/**
 * https://uiwjs.github.io/react-codemirror/#/extensions/languages
 */
import { langNames } from '@uiw/codemirror-extensions-langs';

export const languageOptions = langNames.map((lang) => ({ label: lang, value: lang }));
