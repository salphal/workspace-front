/**
 * 主题集合
 */
export const themeKeys = {
  dark: 'dark',
  light: 'light',
} as const;

type ThemeName = keyof typeof themeKeys;

/**
 * 主题名称列表
 */
export const themeNameList: Array<ThemeName> = Object.keys(themeKeys) as Array<ThemeName>;

/**
 * 获取主题类名
 * @param {ThemeName} name - 主题名称
 */
export const getThemeName = (name: ThemeName) => `theme-${name}`;

/**
 * 根据名称切换主题
 * @param {ThemeName} name - 主题名称
 */
export const toggleTheme = (name: ThemeName) => {
  const root = document.documentElement;
  const themeName = getThemeName(name);
  // 匹配以 'theme-' 开头的类名
  const themeClassRegex = /^theme-/;
  // 先移除所有已存在的主题类
  root.classList.forEach((cls) => {
    if (themeClassRegex.test(cls)) {
      root.classList.remove(cls);
    }
  });
  // 添加新的主题类
  root.classList.add(themeName);
};

/**
 * 初始化主题为 theme-light
 */
export const initTheme = () => {
  const lightTheme = getThemeName(themeKeys.light);
  document.documentElement.classList.add(lightTheme);
};
