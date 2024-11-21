import React, { ForwardRefRenderFunction, Ref, useEffect, useImperativeHandle } from 'react';
import { Button } from 'antd';
import classNames from 'classnames';

import styles from './index.module.scss';

export interface LanguageSwitcherProps {
  children?: any;
}

export interface LanguageSwitcherMethods {}

interface LanguageSwitcherRef {
  [key: string]: any;
}

const LanguageSwitcher: ForwardRefRenderFunction<
  LanguageSwitcherRef,
  LanguageSwitcherProps & LanguageSwitcherMethods
> = (props: LanguageSwitcherProps, ref: Ref<LanguageSwitcherRef | HTMLDivElement>) => {
  const { ...restProps } = props;

  const [checked, setChecked] = useState<boolean>(true);

  useImperativeHandle(ref, () => ({}));

  useEffect(() => {}, []);

  const switchOnChange = () => {
    setChecked((p) => !p);
  };

  return (
    <React.Fragment>
      <Button
        className={styles['language-switcher']}
        type="text"
        onClick={switchOnChange}
        icon={
          <div className={styles.inner}>
            <span
              className={classNames({
                [styles.text]: true,
                [styles.zh]: true,
                [styles.active]: checked,
                [styles.disabled]: !checked,
              })}
            >
              中
            </span>
            <span
              className={classNames({
                [styles.text]: true,
                [styles.en]: true,
                [styles.active]: !checked,
                [styles.disabled]: checked,
              })}
            >
              En
            </span>
          </div>
        }
      />
    </React.Fragment>
  );
};

export default React.forwardRef(LanguageSwitcher);
