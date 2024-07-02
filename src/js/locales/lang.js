import i18n from 'i18next';
import en from './en.js';
import ru from './ru.js';

const resources = { en, ru };

const getI18NInstance = async (state) => {
  const i18nInstance = i18n.createInstance();
  await i18nInstance.init({
    lng: state.language,
    debug: false,
    resources,
  });
  return i18nInstance;
};

export default getI18NInstance;
