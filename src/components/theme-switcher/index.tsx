import React, { ForwardRefRenderFunction, Ref, useEffect, useImperativeHandle } from 'react';
import { MoonFilled, SunFilled } from '@ant-design/icons';
import { Switch } from 'antd';

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
  const [styles, setStyles] = useState<any>({});

  useImperativeHandle(ref, () => ({
    checked: switchOnChecked,
    unChecked: switchOnUnChecked,
  }));

  useEffect(() => {}, []);

  const switchOnChecked = () => {
    setChecked(true);
  };

  const switchOnUnChecked = () => {
    setChecked(false);
  };

  const switchOnChange = (value: boolean) => {
    setChecked(value);
    setStyles(value ? { backgroundColor: '#4885fa' } : { backgroundColor: '#b6b6b6' });
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
