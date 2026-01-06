import styles from '@src/layout/index.module.scss';
import React from 'react';

import { Layout } from 'antd';

export interface LayoutAsideProps {
  collapsed?: boolean;
  children?: React.ReactNode;
}

const LayoutAside: React.FC<LayoutAsideProps> = (props: LayoutAsideProps) => {
  const { children, collapsed } = props;

  return (
    <Layout.Sider
      className={styles.aside}
      collapsed={collapsed}
      reverseArrow={true}
      breakpoint={'xl'}
      theme={'light'}
      width={200}
      collapsedWidth={50}
      trigger={null}
      collapsible
    >
      {children}
    </Layout.Sider>
  );
};

export default React.memo(LayoutAside);
