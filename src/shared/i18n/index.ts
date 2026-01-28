import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import zhLanding from './locales/zh-CN/landing.json';
import enLanding from './locales/en-US/landing.json';
import zhAuth from './locales/zh-CN/auth.json';
import enAuth from './locales/en-US/auth.json';

import chatZh from './locales/zh-CN/chat.json';
import chatEn from './locales/en-US/chat.json';

import commonZh from './locales/zh-CN/common.json';
import commonEn from './locales/en-US/common.json';

// ✅ 只在“第一次初始化”时读取 localStorage
const savedLang = localStorage.getItem('lang');

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    // ⚠️ 这里的 lng 只作为“初始语言”
    lng: savedLang ?? 'zh-CN',
    fallbackLng: 'zh-CN',
    resources: {
      'zh-CN': {
        landing: zhLanding,
        auth: zhAuth,
        chat: chatZh,
        common: commonZh,
      },
      'en-US': {
        landing: enLanding,
        auth: enAuth,
        chat: chatEn,
        common: commonEn,
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
