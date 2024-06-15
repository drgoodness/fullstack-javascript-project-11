const rssStates = {
  init: 'init',
  added: 'added',
  invalidUrl: 'invalidUrl',
  existentUrl: 'existentUrl',
  emptyUrl: 'emptyUrl',
  invalidRssResource: 'invalidRssResource',
  networkError: 'networkError',
};

const languages = {
  en: 'en',
  ru: 'ru',
};

const state = {
  language: languages.ru,
  rss: rssStates.init,
  feeds: new Set(),
  posts: new Set(),
  currentPostLink: '',
  viewedPostLinks: new Set(),
};

export {
  rssStates, languages, state,
};
