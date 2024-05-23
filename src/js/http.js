import axios from 'axios';
import { rssStates } from './model.js';

const fetchRss = (url) => axios.get(`https://allorigins.hexlet.app/raw?disableCache=true&url=${url}`)
  .then((response) => {
    if (response.status !== 200) {
      throw Error(rssStates.networkError);
    }
    const contentType = response.headers['content-type'];
    if (!contentType.includes('application/rss+xml') || !contentType) {
      throw Error(rssStates.invalidRssResource);
    }
    return response.data;
  });

export default fetchRss;
