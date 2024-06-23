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

const feedbackMapping = {
  init: () => {},
  added: (i18nInstance) => renderFeedback(i18nInstance.t('feedback.addedUrl'), true),
  invalidUrl: (i18nInstance) => renderFeedback(i18nInstance.t('feedback.invalidUrl')),
  emptyUrl: (i18nInstance) => renderFeedback(i18nInstance.t('feedback.emptyUrl')),
  existentUrl: (i18nInstance) => renderFeedback(i18nInstance.t('feedback.existentUrl')),
  invalidRssResource: (i18nInstance) => renderFeedback(i18nInstance.t('feedback.invalidRssResource')),
  networkError: (i18nInstance) => renderFeedback(i18nInstance.t('feedback.networkError')),
};

const renderHeaderText = (i18nInstance) => {
  elements.title.textContent = i18nInstance.t('title');
  elements.languageButton.textContent = i18nInstance.t('language');
  elements.header.textContent = i18nInstance.t('form.header');
  elements.description.textContent = i18nInstance.t('form.description');
  elements.inputFieldLabel.textContent = i18nInstance.t('form.inputFieldLabel');
  elements.addButton.textContent = i18nInstance.t('form.addButton');
  elements.example.textContent = `${i18nInstance.t('form.example')} https://lorem-rss.hexlet.app/feed`;
};

const renderHeader = (state, i18nInstance) => {
  renderHeaderText(i18nInstance);

  feedbackMapping[state.rss](i18nInstance);
};

const buildFeedHtmlElement = (title, description) => `
  <li class="list-group-item border-0 border-end-0">
    <h3 class="h6 m-0">${title}</h3>
    <p class="m-0 small text-black-50">${description}</p>
  </li>`;

const renderFeeds = (state, i18nInstance) => {
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

const renderPosts = (state, i18nInstance) => {
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

const renderFooter = (i18nInstance) => {
  elements.createdBy.innerHTML = `${i18nInstance.t('createdBy')} <a href="https://github.com/drgoodness" target="_blank">drgoodness</a>`;
};

const initText = (i18nInstance) => {
  renderHeaderText(i18nInstance);
  renderFooter(i18nInstance);
};

const renderModal = (state, i18nInstance) => {
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

const render = (path, state, i18nInstance) => {
  i18nInstance.changeLanguage(state.language);
  renderHeader(state, i18nInstance);
  if (state.feeds.size !== 0) {
    renderFeeds(state, i18nInstance);
    renderPosts(state, i18nInstance);
    if (path.includes('currentPostLink')) {
      renderModal(state, i18nInstance);
    }
  }
  renderFooter(i18nInstance);
};

export { elements, initText, render };
