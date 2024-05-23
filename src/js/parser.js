import {
  Feed, Post, RSS, rssStates,
} from './model.js';

const domParser = new DOMParser();

const getRss = (rssXml, rssLink) => {
  try {
    const document = domParser.parseFromString(rssXml, 'application/xml');

    const feedTitle = document.querySelector('channel > title').textContent;
    const feedDescription = document.querySelector('channel > description').textContent;
    const feed = new Feed(feedTitle, feedDescription, rssLink);

    const items = Array.from(document.querySelectorAll('channel > item'));
    const posts = items.map((item) => {
      const postTitle = item.querySelector('title').textContent;
      const postDescription = item.querySelector('description').textContent;
      const postLink = item.querySelector('link').textContent;
      return new Post(postTitle, postDescription, postLink, rssLink);
    });

    return new RSS(feed, posts);
  } catch {
    throw Error(rssStates.invalidRssResource);
  }
};

export default getRss;
