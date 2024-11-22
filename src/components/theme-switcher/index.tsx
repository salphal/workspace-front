import React, { ForwardRefRenderFunction, Ref, useEffect, useImperativeHandle } from 'react';
import { MoonFilled, SunFilled } from '@ant-design/icons';
import { Select, Switch } from 'antd';

import styles from './index.module.scss';
import { themeKeys, toggleTheme } from '@/components/theme-switcher/utils.ts';

export const defaultModeList = ['light', 'dark'] as const;
//
// export const defaultModeList = ['light', 'dark', 'auto'] as const;

export interface ThemeSwitcherProps {
  /** 主题列表 */
  modeList?: Array<string> | Array<{ [key: string]: any; label: string; value: string }>;
  /** 主题名称 */
  value?: string;
  /** 主题切换时触发的事件 */
  onChange?: (name: string) => void;
  /** 是否自动跟随系统 */
  auto?: boolean;
}

interface ThemeSwitcherRef {
  [key: string]: any;
}

const ThemeSwitcher: ForwardRefRenderFunction<ThemeSwitcherRef, ThemeSwitcherProps> = (
  props: ThemeSwitcherProps,
  ref: Ref<ThemeSwitcherRef | HTMLDivElement>,
) => {
  const { modeList = defaultModeList, value, onChange, auto = true, ...restProps } = props;

  const [mode, setMode] = useState<string>(themeKeys.light);
  const [checked, setChecked] = useState<boolean>(true);

  useImperativeHandle(ref, () => ({
    switchMode: setChecked,
    selectMode: setMode,
  }));

  /** 媒体查询 系统的主题 是否匹配 light, prefers-color-scheme: light | dark */
  const mediaLightTheme = window.matchMedia('(prefers-color-scheme: light)');
  /** 是否是 light 主题 */
  const isLightThemMode = mediaLightTheme.matches;

  /**
   * 监听系统主题变化并切换
   */
  useEffect(() => {
    if (!auto || mode !== themeKeys.auto) return;
    mediaLightTheme.addEventListener('change', followSystemSwitchMode);
    return () => {
      mediaLightTheme.removeEventListener('change', followSystemSwitchMode);
    };
  }, [mediaLightTheme]);

  /**
   * 自动设置默认状态
   *  - switch true
   *  - select modeList[0]
   */
  useEffect(() => {
    if (Array.isArray(modeList)) {
      const defaultMode = value || getDefaultModeByModeList(modeList) || themeKeys.light;
      if (modeList.length <= 2) {
        setChecked(defaultMode === themeKeys.light);
        setMode(defaultMode);
      } else {
        setMode(defaultMode);
      }
    }
  }, [value, modeList]);

  /**
   * 触发 onChange 事件
   */
  useEffect(() => {
    if (!mode) return;
    const themeMode = getThemeMode(mode);
    toggleTheme(themeMode);
    typeof onChange === 'function' && onChange(themeMode);
  }, [mode, modeList]);

  const modeOptions = useMemo(
    () => () => {
      if (Array.isArray(modeList)) {
        if (modeList.length) {
          if (modeList.every((v) => typeof v === 'string')) {
            return modeList.map((v) => ({ label: v, value: v }));
          } else if (modeList.every((v) => typeof v.value === 'string' && v.label)) {
            return modeList;
          }
        }
      }
      return [];
    },
    [modeList],
  );

  /**
   * 跟随系统切换 light 和 dark
   */
  const followSystemSwitchMode = () => {
    if (mediaLightTheme.matches) {
      // light
      setChecked(true);
    } else {
      // dark
      setChecked(false);
    }
  };

  const switchOnChange = (value: boolean) => {
    setChecked(value);
    const mode = getThemeMode(value);
    setMode(mode);
  };

  const selectOnChange = (value: string) => {
    setMode(value);
  };

  const getThemeMode = (mode: boolean | string) => {
    if (mode === true) {
      return themeKeys.light;
    } else if (mode === false) {
      return themeKeys.dark;
    } else if (mode.trim().toLowerCase() === 'auto') {
      return isLightThemMode ? themeKeys.light : themeKeys.dark;
    }
    return mode;
  };

  const getDefaultModeByModeList = (modeList: Array<any>) => {
    if (Array.isArray(modeList) && modeList.length) {
      const firstChild = modeList[0];
      if (!firstChild) return null;
      if (firstChild.value) {
        return firstChild;
      } else if (typeof firstChild === 'string') {
        return firstChild;
      }
    }
    return null;
  };

  return (
    <React.Fragment>
      {modeList.length <= 2 && (
        <Switch
          className={styles['theme-switcher']}
          value={checked}
          onChange={switchOnChange}
          checkedChildren={<SunFilled className={styles.sum} />}
          unCheckedChildren={<MoonFilled className={styles.moon} />}
          style={styles}
          {...restProps}
        />
      )}
      {modeList.length > 2 && (
        <Select
          value={mode}
          onChange={selectOnChange}
          options={modeOptions()}
          style={{ width: 80 }}
        />
      )}
    </React.Fragment>
  );
};

export default React.forwardRef(ThemeSwitcher);
