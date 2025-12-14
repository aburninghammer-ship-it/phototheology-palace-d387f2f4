import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import es from './locales/es.json';

export const resources = {
  en: { translation: en },
  es: { translation: es },
} as const;

export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
] as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'pt-language',
    },

    interpolation: {
      escapeValue: false,
    },
  });

export const getCurrentLanguage = () => i18n.language || 'en';

export const setLanguage = (lang: string) => {
  i18n.changeLanguage(lang);
  localStorage.setItem('pt-language', lang);
};

export default i18n;
