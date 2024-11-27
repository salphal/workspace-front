import { langNames, loadLanguage } from '@uiw/codemirror-extensions-langs';
import { Extension } from '@uiw/react-codemirror';

/**
 * 扩展多种语言支持
 * https://uiwjs.github.io/react-codemirror/#/extensions/languages
 */

import { ISettings } from '@/components/code-editor/components/editor-controller';

export const defaultLanguage: Extension = loadLanguage('javascript') as Extension;

export const languageOptions = langNames.map((lang) => ({ label: lang, value: lang }));

export interface ILanguageProps {
  settings: ISettings;
}

export const useLanguage = (props: ILanguageProps) => {
  const { settings } = props;

  /** 语言类型 */
  const editorLanguage = useMemo(
    () => () => {
      if (settings.language && langNames.includes(settings.language)) {
        return loadLanguage(settings.language) as Extension;
      }
      return defaultLanguage;
    },
    [settings],
  );

  return { language: editorLanguage() };
};
