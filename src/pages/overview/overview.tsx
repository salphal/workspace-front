import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Trans, useTranslation } from 'react-i18next';

import styles from './index.module.scss';

export interface OverviewProps {
  [key: string]: any;
}

const Overview: React.FC<OverviewProps> = (props: OverviewProps) => {
  useEffect(() => {}, []);
  const { t, i18n } = useTranslation();

  return (
    <React.Fragment>
      <div className={classNames([styles.overview])}>{t('title')}</div>
    </React.Fragment>
  );
};

export default React.memo(Overview);
