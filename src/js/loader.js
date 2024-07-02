import * as yup from 'yup';
import { rssStates } from './model/index.js';
import fetchRss from './http.js';
import getRss from './parser.js';

const getRssLinksFromFeeds = (state) => Array.from(state.feeds).map((feed) => feed.rssLink);

const schema = (state) => yup.object({
  rssLink: yup.string().required().url().notOneOf(getRssLinksFromFeeds(state)),
});

const loadRss = (rssLink, watchedState) => {
  const state = watchedState;
  schema(state).validate({ rssLink })
    .then(() => fetchRss(rssLink))
    .then((rssXml) => {
      const rss = getRss(rssXml, rssLink);
      state.feeds.add(rss.feed);
      rss.posts.forEach((post) => state.posts.add(post));
      state.rss = rssStates.added;
    })
    .catch((err) => {
      switch (err.message) {
        case 'rssLink is a required field':
          state.rss = rssStates.emptyUrl;
          break;
        case `rssLink must not be one of the following values: ${rssLink}`:
          state.rss = rssStates.existentUrl;
          break;
        case rssStates.invalidRssResource:
          state.rss = rssStates.invalidRssResource;
          break;
        case rssStates.networkError:
          state.rss = rssStates.networkError;
          break;
        default:
          state.rss = rssStates.invalidUrl;
      }
    });
};

const loadNewPosts = (state) => {
  const responsePromises = Array.from(state.feeds).map((feed) => {
    const { rssLink } = feed;
    const responsePromise = fetchRss(rssLink)
      .then((rssXml) => {
        const rss = getRss(rssXml, rssLink);
        rss.posts.forEach((post) => {
          const foundPosts = Array.from(state.posts)
            .filter((p) => (p.rssLink === post.rssLink) && (p.link === post.link));
          if (foundPosts.length === 0) {
            state.posts.add(post);
          }
        });
      })
      .catch(() => console.error('Couldn\'t load new posts'));
    return responsePromise;
  });
  Promise.all(responsePromises)
    .then(() => setTimeout(() => loadNewPosts(state), 5000));
};

export { loadRss, loadNewPosts };
