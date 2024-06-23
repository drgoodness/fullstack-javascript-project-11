import i18n from 'i18next';
import onChange from 'on-change';
import { rssStates, languages } from './model/index.js';
import { initText, render } from './view.js';
import initEventListeners from './controller.js';
import resources from './locales/lang.js';
import { loadNewPosts } from './loader.js';

const state = {
  language: languages.ru,
  rss: rssStates.init,
  feeds: new Set(),
  posts: new Set(),
  currentPostLink: '',
  viewedPostLinks: new Set(),
};

const getI18NInstance = async () => {
  const i18nInstance = i18n.createInstance();
  await i18nInstance.init({
    lng: state.language,
    debug: false,
    resources,
  });
  return i18nInstance;
};

const run = async () => {
  const i18nInstance = await getI18NInstance();
  const watchedState = onChange(state, (path) => render(path, state, i18nInstance));

  initText(i18nInstance);
  initEventListeners(watchedState);
  loadNewPosts(watchedState);
};

export default run;
