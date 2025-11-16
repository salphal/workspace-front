import React, { useEffect } from 'react';
import { setData } from '@src/store/global.ts';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import styles from './index.module.scss';

export interface OverviewProps {
  [key: string]: any;
}

const Overview: React.FC<OverviewProps> = (props: OverviewProps) => {
  useEffect(() => {
    setData({ foo: 'bar' });
  }, []);

  const { t } = useTranslation();

  return (
    <div className={classNames([styles.overview])}>
      <h1>overview page</h1>
      {t('title')}
    </div>
  );
};

export default React.memo(Overview);
