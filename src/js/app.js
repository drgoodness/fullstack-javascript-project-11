import onChange from 'on-change';
import getI18NInstance from './locales/lang.js';
import initEventListeners from './controller.js';
import { rssStates, languages } from './model/index.js';
import { initText, render } from './view.js';
import { loadNewPosts } from './loader.js';

const state = {
  language: languages.ru,
  rss: rssStates.init,
  feeds: new Set(),
  posts: new Set(),
  currentPostLink: '',
  viewedPostLinks: new Set(),
};

const run = async () => {
  const i18nInstance = await getI18NInstance(state);
  const watchedState = onChange(state, (path) => render(path, state, i18nInstance));

  initText(i18nInstance);
  initEventListeners(watchedState);
  loadNewPosts(watchedState);
};

export default run;
