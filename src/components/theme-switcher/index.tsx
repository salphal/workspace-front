import React, { ForwardRefRenderFunction, Ref, useEffect, useImperativeHandle } from 'react';
import { MoonFilled, SunFilled } from '@ant-design/icons';
import { Switch } from 'antd';

import { themeKeys, toggleTheme } from '@/components/theme-switcher/utils.ts';

const switchLightStyles = {
  backgroundColor: '#4885fa',
};

const switchDarkStyles = {
  backgroundColor: '#b6b6b6',
};

export type IThemeName = 'light' | 'dark' | 'auto';

export interface ThemeSwitcherProps {
  /** 主题名称 */
  value?: IThemeName;
  /** 主题切换时触发的事件 */
  onChange?: (name: IThemeName) => void;
  /** 是否自动跟随系统*/
  auto?: boolean;
}

interface ThemeSwitcherRef {
  [key: string]: any;
}

const ThemeSwitcher: ForwardRefRenderFunction<ThemeSwitcherRef, ThemeSwitcherProps> = (
  props: ThemeSwitcherProps,
  ref: Ref<ThemeSwitcherRef | HTMLDivElement>,
) => {
  const { value, onChange, auto = true, ...restProps } = props;
  const [checked, setChecked] = useState<boolean>();
  const [styles, setStyles] = useState<any>(switchLightStyles);

  /**
   * 媒体查询 系统的主题 是否匹配 light
   *  prefers-color-scheme: light | dark
   */
  const mediaLightTheme = window.matchMedia('(prefers-color-scheme: light)');

  useImperativeHandle(ref, () => ({
    checked: switchOnChecked,
    unChecked: switchOnUnChecked,
  }));

  useEffect(() => {
    if (!auto) return;
    mediaLightTheme.addEventListener('change', followSystemSwitchMode);
    return () => {
      mediaLightTheme.removeEventListener('change', followSystemSwitchMode);
    };
  }, [mediaLightTheme]);

  useEffect(() => {
    setStyles(checked ? switchLightStyles : switchDarkStyles);
    toggleTheme(checked ? themeKeys.light : themeKeys.dark);
    typeof onChange === 'function' && onChange(checked ? themeKeys.light : themeKeys.dark);
  }, [checked]);

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

  const switchOnChecked = () => {
    setChecked(true);
  };

  const switchOnUnChecked = () => {
    setChecked(false);
  };

  const switchOnChange = (value: boolean) => {
    setChecked(value);
  };

  return (
    <React.Fragment>
      <Switch
        value={checked}
        onChange={switchOnChange}
        checkedChildren={<SunFilled />}
        unCheckedChildren={<MoonFilled />}
        style={styles}
        {...restProps}
      />
    </React.Fragment>
  );
};

export default React.forwardRef(ThemeSwitcher);
