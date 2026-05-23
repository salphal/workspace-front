import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import dayjs from 'dayjs';

import en from './en/translation.json';
import zh from './zh/translation.json';

i18n
  // 检测用户当前使用的语言
  // 文档: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // 注入 react-i18next 实例
  .use(initReactI18next)
  // 初始化 i18next
  // 配置参数的文档: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh'],
    load: 'languageOnly',
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false, // 禁用 suspense，避免刷新问题
    },
    // 确保检测用户语言时使用浏览器存储
    detection: {
      // 默认使用 localStorage 存储语言
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

if (i18n.services?.formatter) {
  i18n.services.formatter.add('DD/MM/YY', (value, lng, options) => {
    return dayjs(value).format('DD/MM/YY');
  });

  i18n.services.formatter.add('YYYY-MM-DD', (value, lng, options) => {
    return dayjs(value).format('YYYY-MM-DD');
  });
} else {
  console.error('i18n.services.formatter is undefined');
}
