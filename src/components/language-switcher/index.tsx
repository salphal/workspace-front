import React, { ForwardRefRenderFunction, Ref, useEffect, useImperativeHandle } from 'react';

import { Button } from 'antd';

import classNames from 'classnames';

import styles from './index.module.scss';

export interface LanguageSwitcherProps {
  value?: any;
  onChange?: (language: string) => void;
}

interface LanguageSwitcherRef {
  [key: string]: any;
}

const LanguageSwitcher: ForwardRefRenderFunction<LanguageSwitcherRef, LanguageSwitcherProps> = (
  props: LanguageSwitcherProps,
  ref: Ref<LanguageSwitcherRef | HTMLDivElement>,
) => {
  const { value, onChange } = props;

  const [checked, setChecked] = useState<boolean>(true);

  useImperativeHandle(ref, () => ({ checked }));

  useEffect(() => {
    setChecked(value);
  }, [value]);

  useEffect(() => {
    onChange?.(checked ? 'zh' : 'en');
  }, [checked, onChange]);

  const switchOnChange = () => {
    setChecked((p) => !p);
  };

  return (
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
  );
};

export default React.forwardRef(LanguageSwitcher);
