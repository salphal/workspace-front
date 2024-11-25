export const codeEditorKeys = {
  theme: 'theme',
  language: 'language',
};

export interface EditorFormData {
  theme: IThemeList;
  language: ILanguageList;
}

export const defaultFormData: EditorFormData = {
  theme: 'default',
  language: 'javascript',
};

export const themeList = [
  'default',
  'material',
  'monokai',
  'dracula',
  'solarized',
  'eclipse',
  'twilight',
  'cobalt',
] as const;

export type IThemeList = (typeof themeList)[number];

export const themeOptions = themeList.map((name: string) => ({ label: name, value: name }));

export const languageList = [
  'javascript',
  'typescript',
  'python',
  'java',
  'shell',
  'html',
  'css',
  'json',
];

export type ILanguageList = (typeof languageList)[number];

export const languageOptions = languageList.map((name: string) => ({ label: name, value: name }));
