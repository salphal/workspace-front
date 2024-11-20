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

export interface ThemeSwitcherProps {}

export interface ThemeSwitcherMethods {}

interface ThemeSwitcherRef {
  [key: string]: any;
}

const ThemeSwitcher: ForwardRefRenderFunction<
  ThemeSwitcherRef,
  ThemeSwitcherProps & ThemeSwitcherMethods
> = (props: ThemeSwitcherProps, ref: Ref<ThemeSwitcherRef | HTMLDivElement>) => {
  const { ...restProps } = props;
  const [checked, setChecked] = useState<boolean>(false);
  const [styles, setStyles] = useState<any>(switchLightStyles);

  useImperativeHandle(ref, () => ({
    checked: switchOnChecked,
    unChecked: switchOnUnChecked,
  }));

  useEffect(() => {
    setStyles(checked ? switchLightStyles : switchDarkStyles);
    toggleTheme(checked ? themeKeys.light : themeKeys.dark);
  }, [checked]);

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
