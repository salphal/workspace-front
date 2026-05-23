import LayoutHeader from '@src/layout/components/header';
import React from 'react';

import { useBreakpoint } from '@ant-design/pro-components';
import { Layout } from 'antd';

import styles from './index.module.scss';

import '@ant-design/colors';

export interface LayoutProps {
  children?: React.ReactNode;
}

const LayoutPlus: React.FC<LayoutProps> = (props: LayoutProps) => {
  const { children } = props;

  const screens = useBreakpoint();

  const [collapsed, setCollapsed] = useState(false);

  const collapsedOnChange = (collapsed: boolean) => {};

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            headerPadding: '0 24px',
            // headerBg: mode === 'light' ? '#fff' : '#000',
          },
        },
      }}
    >
      <Layout className={styles['layout-plus']} hasSider={screens === 'xs'}>
        <LayoutHeader />
        <Layout className={styles['layout-plus__content']}>
          <Layout>
            <Layout.Content>
              <Suspense fallback={<Spin size={'large'} />}>{children}</Suspense>
            </Layout.Content>
            <Layout.Footer className={styles['layout-plus__footer']}>footer</Layout.Footer>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default React.memo(LayoutPlus);
