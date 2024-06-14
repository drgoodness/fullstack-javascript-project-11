import axios from 'axios';
import { rssStates } from './model.js';

const fetchRss = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
  .then((response) => {
    if (response.status !== 200) {
      throw Error(rssStates.networkError);
    }
    return response.data.contents;
  })
  .catch(() => {
    throw Error(rssStates.networkError);
  });

export default fetchRss;
