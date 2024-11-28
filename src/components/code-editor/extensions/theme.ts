import * as themes from '@uiw/codemirror-themes-all';
import { message } from 'antd';
import { ISettings } from 'src/components/code-editor/components/editor-controller-bar';

/**
 * 扩展所有主题
 * https://uiwjs.github.io/react-codemirror/#/extensions/themes-all
 */

export const defaultTheme = 'light';

export const defaultThemeNames: string[] = ['light', 'dark', 'none'] as const;

/**
 * 筛选出所有主题
 */
export const OtherThemeNames = Object.keys(themes).filter((name) =>
  ['Init', 'Style', 'Settings'].every((p) => name.indexOf(p) === -1),
);

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

export interface IUseTheme {
  settings: ISettings;
}

export const useTheme = (props: IUseTheme) => {
  const { settings } = props;

  /** 主题 */
  const editorTheme = useMemo(
    () => () => {
      if (settings.theme) {
        return getDynamicTheme(settings.theme);
      }
      return defaultTheme;
    },
    [settings],
  );

  /**
   * 动态加载指定的 CodeMirror 主题
   * @param themeName - 主题名称 (例如: "github", "dracula", "material")
   * @returns 动态加载的主题扩展
   */
  const getDynamicTheme = (themeName: string) => {
    if (defaultThemeNames.includes(themeName)) {
      return themeName;
    } else if (themeName in themes) {
      return themes[themeName as keyof typeof themes];
    } else {
      message.warning(`Theme "${themeName}" not found.`);
      console.error(`Theme "${themeName}" not found.`);
      return defaultTheme;
    }
  };

  return {
    editorTheme,
  };
};
