import * as yup from 'yup';
import { rssStates } from './model/index.js';
import fetchRss from './http.js';
import getRss from './parser.js';

const schema = yup.object({
  rssLink: yup.string().url(),
});

const loadRss = (rssLink, watchedState) => {
  const state = watchedState;
  schema.validate({ rssLink })
    .then(() => {
      if (rssLink === '') {
        throw Error(rssStates.emptyUrl);
      }
      state.feeds.forEach((feed) => {
        if (feed.rssLink === rssLink) {
          throw Error(rssStates.existentUrl);
        }
      });
    })
    .then(() => fetchRss(rssLink))
    .then((rssXml) => {
      const rss = getRss(rssXml, rssLink);
      state.feeds.add(rss.feed);
      rss.posts.forEach((post) => state.posts.add(post));
      state.rss = rssStates.added;
    })
    .catch((err) => {
      switch (err.message) {
        case rssStates.emptyUrl:
          state.rss = rssStates.emptyUrl;
          break;
        case rssStates.existentUrl:
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
  setTimeout(() => loadNewPosts(state), 5000);
  state.feeds.forEach((feed) => {
    const { rssLink } = feed;
    fetchRss(rssLink)
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
  });
};

export { loadRss, loadNewPosts };
