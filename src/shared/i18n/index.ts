import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import zhLanding from './locales/zh-CN/landing.json';
import enLanding from './locales/en-US/landing.json';
import viLanding from './locales/vi-VN/landing.json';
import thLanding from './locales/th-TH/landing.json';
import myLanding from './locales/my-MM/landing.json';
import zhAuth from './locales/zh-CN/auth.json';
import enAuth from './locales/en-US/auth.json';
import viAuth from './locales/vi-VN/auth.json';
import thAuth from './locales/th-TH/auth.json';
import myAuth from './locales/my-MM/auth.json';

import chatZh from './locales/zh-CN/chat.json';
import chatEn from './locales/en-US/chat.json';
import chatVi from './locales/vi-VN/chat.json';
import chatTh from './locales/th-TH/chat.json';
import chatMy from './locales/my-MM/chat.json';

import commonZh from './locales/zh-CN/common.json';
import commonEn from './locales/en-US/common.json';
import commonVi from './locales/vi-VN/common.json';
import commonTh from './locales/th-TH/common.json';
import commonMy from './locales/my-MM/common.json';

import aboutZh from './locales/zh-CN/about.json';
import aboutEn from './locales/en-US/about.json';
import aboutVi from './locales/vi-VN/about.json';
import aboutTh from './locales/th-TH/about.json';
import aboutMy from './locales/my-MM/about.json';

import complaintZh from './locales/zh-CN/complaint.json';
import complaintEn from './locales/en-US/complaint.json';
import complaintVi from './locales/vi-VN/complaint.json';
import complaintTh from './locales/th-TH/complaint.json';
import complaintMy from './locales/my-MM/complaint.json';
import privacyZh from './locales/zh-CN/privacy.json';
import privacyEn from './locales/en-US/privacy.json';
import privacyVi from './locales/vi-VN/privacy.json';
import privacyTh from './locales/th-TH/privacy.json';
import privacyMy from './locales/my-MM/privacy.json';
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
        about: aboutZh,
        complaint: complaintZh,
        privacy: privacyZh,
      },
      'en-US': {
        landing: enLanding,
        auth: enAuth,
        chat: chatEn,
        common: commonEn,
        about: aboutEn,
        complaint: complaintEn,
        privacy: privacyEn,
      },
      'vi-VN': {
        landing: viLanding,
        auth: viAuth,
        chat: chatVi,
        common: commonVi,
        about: aboutVi,
        complaint: complaintVi,
        privacy: privacyVi,
      },
      'th-TH': {
        landing: thLanding,
        auth: thAuth,
        chat: chatTh,
        common: commonTh,
        about: aboutTh,
        complaint: complaintTh,
        privacy: privacyTh,
      },
      'my-MM': {
        landing: myLanding,
        auth: myAuth,
        chat: chatMy,
        common: commonMy,
        about: aboutMy,
        complaint: complaintMy,
        privacy: privacyMy,
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
