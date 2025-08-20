import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import styles from './index.module.scss';
import { setData } from '@src/store/global.ts';

export interface OverviewProps {
  [key: string]: any;
}

const Overview: React.FC<OverviewProps> = (props: OverviewProps) => {
  useEffect(() => {
    setData({ foo: 'bar' });
  }, []);
  const { t, i18n } = useTranslation();

  return (
    <React.Fragment>
      <div className={classNames([styles.overview])}>
        <h1>overview page</h1>
        {t('title')}
      </div>
    </React.Fragment>
  );
};

export default React.memo(Overview);
