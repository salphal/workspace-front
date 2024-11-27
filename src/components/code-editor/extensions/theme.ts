import * as themes from '@uiw/codemirror-themes-all';
import { Extension } from '@uiw/react-codemirror';
import { message } from 'antd';

export const defaultTheme = 'light';

/**
 * https://uiwjs.github.io/react-codemirror/#/extensions/themes-all
 */
export const defaultThemeNames: string[] = ['light', 'dark', 'none'] as const;

/**
 * 筛选出所有主题
 */
export const OtherThemeNames = Object.keys(themes).filter((name) =>
  ['Init', 'Style', 'Settings'].every((p) => name.indexOf(p) === -1),
);

export type ThemeNames = 'light' | 'dark' | 'none' | Extension;

export const themeOptions = [...defaultThemeNames, ...OtherThemeNames].map((name: string) => ({
  label: name,
  value: name,
}));

/**
 * 动态加载指定的 CodeMirror 主题
 * @param themeName - 主题名称 (例如: "github", "dracula", "material")
 * @returns 动态加载的主题扩展
 */
export function getDynamicTheme(themeName: string) {
  if (defaultThemeNames.includes(themeName)) {
    return themeName;
  } else if (themeName in themes) {
    return themes[themeName as keyof typeof themes];
  } else {
    message.warning(`Theme "${themeName}" not found.`);
    console.error(`Theme "${themeName}" not found.`);
    return defaultTheme;
  }
}
