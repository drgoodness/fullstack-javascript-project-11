import '../scss/styles.scss';
/* eslint-disable */
import * as bootstrap from 'bootstrap';
/* eslint-enable */
import * as yup from 'yup';
import onChange from 'on-change';
import { elements, render } from './view.js';
import { rssStates, languages, state } from './model/index.js';
import fetchRss from './http.js';
import getRss from './parser.js';

const watchedState = onChange(state, (path) => render(path));

const schema = yup.object({
  rssLink: yup.string().url(),
});

elements.languageButtons.forEach((langButton) => {
  langButton.addEventListener('click', (e) => {
    e.preventDefault();
    const { target } = e;
    if (target.getAttribute('data-language') === languages.en) {
      watchedState.language = languages.en;
    } else {
      watchedState.language = languages.ru;
    }
  });
});

const addEventListenersToViewButtons = () => {
  document.querySelectorAll('#feedsAndPosts button').forEach((viewButton) => {
    viewButton.addEventListener('click', (e) => {
      e.preventDefault();
      const { target } = e;
      const postLink = target.getAttribute('data-id');
      watchedState.currentPostLink = postLink;
      watchedState.viewedPostLinks.add(postLink);
      addEventListenersToViewButtons();
    });
  });
};

const loadRss = (rssLink) => {
  schema.validate({ rssLink })
    .then(() => {
      if (rssLink === '') {
        throw Error(rssStates.emptyUrl);
      }
      watchedState.feeds.forEach((feed) => {
        if (feed.rssLink === rssLink) {
          throw Error(rssStates.existentUrl);
        }
      });
    })
    .then(() => fetchRss(rssLink))
    .then((rssXml) => {
      const rss = getRss(rssXml, rssLink);
      watchedState.feeds.add(rss.feed);
      rss.posts.forEach((post) => watchedState.posts.add(post));
      watchedState.rss = rssStates.added;
    })
    .catch((err) => {
      switch (err.message) {
        case rssStates.emptyUrl:
          watchedState.rss = rssStates.emptyUrl;
          break;
        case rssStates.existentUrl:
          watchedState.rss = rssStates.existentUrl;
          break;
        case rssStates.invalidRssResource:
          watchedState.rss = rssStates.invalidRssResource;
          break;
        case rssStates.networkError:
          watchedState.rss = rssStates.networkError;
          break;
        default:
          watchedState.rss = rssStates.invalidUrl;
      }
    })
    .finally(() => addEventListenersToViewButtons());
};

elements.addButton.addEventListener('click', (e) => {
  e.preventDefault();
  const rss = elements.inputField.value.trim();
  loadRss(rss);
});

const loadNewPosts = () => {
  setTimeout(() => loadNewPosts(), 5000);
  state.feeds.forEach((feed) => {
    const { rssLink } = feed;
    fetchRss(rssLink)
      .then((rssXml) => {
        const rss = getRss(rssXml, rssLink);
        rss.posts.forEach((post) => {
          const foundPosts = Array.from(state.posts)
            .filter((p) => (p.rssLink === post.rssLink) && (p.link === post.link));
          if (foundPosts.length === 0) {
            watchedState.posts.add(post);
            addEventListenersToViewButtons();
          }
        });
      })
      .catch(() => console.error('Couldn\'t load new posts'));
  });
};

loadNewPosts();
