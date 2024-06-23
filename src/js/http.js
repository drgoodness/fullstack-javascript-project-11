import axios from 'axios';
import { rssStates } from './model/index.js';

const buildProxiedUrl = (url) => {
  const proxiedUrl = new URL('https://allorigins.hexlet.app/get');
  proxiedUrl.searchParams.set('disableCache', 'true');
  proxiedUrl.searchParams.set('url', url);
  return proxiedUrl;
};

const fetchRss = (url) => axios.get(buildProxiedUrl(url))
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
