import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationRU from "@app/locales/ru/translation.json";
import translationTM from "@app/locales/tm/translation.json";
import translationEN from "@app/locales/en/translation.json";


// the translations
const resources = {
  ru: {
    translation: translationRU,
  },
  en: {
    translation: translationEN,
  },
  tm: {
    translation: translationTM,
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') as string | 'en',
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
