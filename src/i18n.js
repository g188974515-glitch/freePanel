import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh from './locales/zh.json';
import en from './locales/en.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            zh: { translation: zh },
            en: { translation: en }
        },
        lng: "zh", // 默认语言
        fallbackLng: "en",
        interpolation: {
            escapeValue: false // React 默认已防范 XSS
        }
    });

export default i18n;