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

class Feed {
  constructor(title, description, rssLink) {
    this.title = title;
    this.description = description;
    this.rssLink = rssLink;
  }
}

class Post {
  constructor(title, description, link, rssLink) {
    this.title = title;
    this.description = description;
    this.link = link;
    this.rssLink = rssLink;
  }
}

class RSS {
  constructor(feed, posts) {
    this.feed = feed;
    this.posts = posts;
  }
}

export {
  rssStates, languages, state, Feed, Post, RSS,
};
