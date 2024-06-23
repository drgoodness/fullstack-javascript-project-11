import { elements } from './view.js';
import { languages } from './model/index.js';
import { loadRss } from './loader.js';

const addEventListenerToSubmitButton = (state) => {
  elements.addButton.addEventListener('click', (e) => {
    e.preventDefault();
    const rss = elements.inputField.value.trim();
    loadRss(rss, state);
  });
};

const addEventListenersToLanguageButtons = (watchedState) => {
  const state = watchedState;
  elements.languageButtons.forEach((langButton) => {
    langButton.addEventListener('click', (e) => {
      e.preventDefault();
      const { target } = e;
      if (target.getAttribute('data-language') === languages.en) {
        state.language = languages.en;
      } else {
        state.language = languages.ru;
      }
    });
  });
};

const addEventListenersToViewButtons = (watchedState) => {
  const state = watchedState;
  elements.posts.addEventListener('click', (e) => {
    e.preventDefault();
    const { target } = e;
    const postLink = target.getAttribute('data-id');
    state.currentPostLink = postLink;
    state.viewedPostLinks.add(postLink);
  });
};

const initEventListeners = (state) => {
  addEventListenersToLanguageButtons(state);
  addEventListenerToSubmitButton(state);
  addEventListenersToViewButtons(state);
};

export default initEventListeners;
