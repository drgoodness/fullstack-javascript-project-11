import i18n from 'i18next';
import resources from './locales/lang.js';
import { state } from './model.js';

const getI18NInstance = async () => {
  const i18nInstance = i18n.createInstance();
  await i18nInstance.init({
    lng: state.language,
    debug: false,
    resources,
  });
  return i18nInstance;
};

const i18nInstance = await getI18NInstance();

const elements = {
  title: document.querySelector('title'),
  languageButton: document.querySelector('#languageDropdownMenuButton'),
  languageButtons: document.querySelectorAll('div.dropdown-menu a'),
  header: document.querySelector('#header'),
  description: document.querySelector('#description'),
  inputField: document.querySelector('#url-input'),
  inputFieldLabel: document.querySelector('label[for="url-input"]'),
  addButton: document.querySelector('button[type="submit"]'),
  example: document.querySelector('#example'),
  feedback: document.querySelector('p.feedback'),
  feedsAndPostsSection: document.querySelector('#feedsAndPosts'),
  feedsTitle: document.querySelector('div.feeds h2.card-title'),
  postsTitle: document.querySelector('div.posts h2.card-title'),
  feeds: document.querySelector('#feeds'),
  posts: document.querySelector('#posts'),
  modalTitle: document.querySelector('h5.modal-title'),
  modalBody: document.querySelector('div.modal-body'),
  modalReadButton: document.querySelector('div.modal-footer > a.btn-primary'),
  modalCloseButton: document.querySelector('div.modal-footer > button.btn-secondary'),
  createdBy: document.querySelector('#createdBy'),
};

const updateFeedbackClasses = (classToRemove, classToAdd) => {
  elements.feedback.classList.remove(classToRemove);
  elements.feedback.classList.add(classToAdd);
};

const renderFeedback = (text, success = false) => {
  if (success) {
    elements.inputField.classList.remove('is-invalid');
    elements.inputField.value = '';
    elements.inputField.focus();
    updateFeedbackClasses('text-danger', 'text-success');
  } else {
    elements.inputField.classList.add('is-invalid');
    updateFeedbackClasses('text-success', 'text-danger');
  }

  elements.feedback.textContent = text;
};

const feedbackMappingFunc = (namespace, success = false) => renderFeedback(i18nInstance.t(namespace), success);

const feedbackMapping = {
  init: () => {},
  added: () => feedbackMappingFunc('feedback.addedUrl', true),
  invalidUrl: () => feedbackMappingFunc('feedback.invalidUrl'),
  emptyUrl: () => feedbackMappingFunc('feedback.emptyUrl'),
  existentUrl: () => feedbackMappingFunc('feedback.existentUrl'),
};

const renderHeader = () => {
  elements.title.textContent = i18nInstance.t('title');
  elements.languageButton.textContent = i18nInstance.t('language');
  elements.header.textContent = i18nInstance.t('form.header');
  elements.description.textContent = i18nInstance.t('form.description');
  elements.inputFieldLabel.textContent = i18nInstance.t('form.inputFieldLabel');
  elements.addButton.textContent = i18nInstance.t('form.addButton');
  elements.example.textContent = `${i18nInstance.t('form.example')} https://lorem-rss.hexlet.app/feed`;

  feedbackMapping[state.rss]();
};

const buildFeedHtmlElement = (title, description) => `
  <li class="list-group-item border-0 border-end-0">
    <h3 class="h6 m-0">${title}</h3>
    <p class="m-0 small text-black-50">${description}</p>
  </li>`;

const renderFeeds = () => {
  elements.feedsAndPostsSection.classList.remove('d-none');

  const feedsHtml = Array.from(state.feeds).reverse().reduce((acc, feed) => {
    let result = acc;
    result += buildFeedHtmlElement(feed.title, feed.description);
    return result;
  }, '');
  elements.feeds.innerHTML = feedsHtml;

  elements.feedsTitle.textContent = i18nInstance.t('feeds');
};

const buildPostHtmlElement = (title, link) => `
  <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
    <a href="${link}" class="fw-bold" data-id="${link}" target="_blank" rel="noopener noreferrer">${title}</a>
    <button type="button" class="btn btn-outline-primary btn-sm" data-id="${link}" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>
  </li>`;

const renderPosts = () => {
  const postsHtml = Array.from(state.posts).reverse().reduce((acc, post) => {
    let result = acc;
    result += buildPostHtmlElement(post.title, post.link);
    return result;
  }, '');
  elements.posts.innerHTML = postsHtml;

  Array.from(document.querySelectorAll('#posts > li > a'))
    .filter((postRef) => state.viewedPostLinks.has(postRef.getAttribute('href')))
    .forEach((postRef) => {
      postRef.classList.remove('fw-bold');
      postRef.classList.add('fw-normal');
    });

  elements.postsTitle.textContent = i18nInstance.t('posts');
  document.querySelectorAll('#feedsAndPosts button').forEach((button) => {
    const viewBtn = button;
    viewBtn.textContent = i18nInstance.t('view');
  });
};

const renderFooter = () => {
  elements.createdBy.innerHTML = `${i18nInstance.t('createdBy')} <a href="https://github.com/drgoodness" target="_blank">drgoodness</a>`;
};

const renderModal = () => {
  const post = Array.from(state.posts)
    .filter((p) => p.link === state.currentPostLink)[0];
  if (post) {
    elements.modalTitle.textContent = post.title;
    elements.modalBody.textContent = post.description;
    elements.modalReadButton.setAttribute('href', post.link);

    elements.modalReadButton.textContent = i18nInstance.t('modal.readButton');
    elements.modalCloseButton.textContent = i18nInstance.t('modal.closeButton');
  }
};

const render = (path) => {
  i18nInstance.changeLanguage(state.language);
  renderHeader();
  if (state.feeds.size !== 0) {
    renderFeeds();
    renderPosts();
    if (path.includes('currentPostLink')) {
      renderModal();
    }
  }
  renderFooter();
};

export { elements, render };
