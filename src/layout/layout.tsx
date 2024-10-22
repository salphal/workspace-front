import React, { Suspense } from 'react';
import { gray } from '@ant-design/colors';
import {
  GithubFilled,
  HddFilled,
  SearchOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout as AntdLayout, Avatar, Divider, Flex, Menu, Spin } from 'antd';
import Input from 'antd/es/input/Input';
import { t } from 'i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import styles from './index.module.scss';

const { Header, Content, Footer, Sider } = AntdLayout;

export interface LayoutProps {
  [key: string]: any;
}

const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  const items1 = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
  }));

  const items = [UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
    (icon, index) => ({
      key: String(index + 1),
      icon: React.createElement(icon),
      label: `nav ${index + 1}`,
    }),
  );

  return (
    <React.Fragment>
      <AntdLayout className={styles.layout} hasSider={false}>
        <Header className={styles.header}>
          <Flex className={styles['header-content']} justify={'space-between'} align={'center'}>
            <Flex className={styles['header-content-l']} align={'center'}>
              <HddFilled className={styles.logo} />
              <span className={styles.title}>{t('title')}</span>
              <Divider className={styles.divider} type={'vertical'} />
              <Input
                placeholder={t('search')}
                addonBefore={<SearchOutlined style={{ color: gray[2] }} />}
                addonAfter={
                  <div
                    style={{
                      padding: '4px 8px',
                      color: '#ced4d9',
                      backgroundColor: 'rgba(150, 150, 150, 0.06)',
                      borderWidth: '1px',
                      borderColor: 'rgba(100, 100, 100, 0.2)',
                      borderRadius: '4px',
                      fontSize: 14,
                    }}
                  >
                    ⌘ K
                  </div>
                }
                variant="borderless"
                style={{ width: 280 }}
              />
            </Flex>
            {/*<Flex className={styles['header-content-m']}></Flex>*/}
            <Flex className={styles['header-content-r']} justify={'flex-end'} align={'center'}>
              <Menu
                theme="light"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                items={items1}
                style={{ flex: 1, minWidth: 0 }}
              />
              <Flex style={{ padding: '0 24px' }}>
                <GithubFilled style={{ fontSize: 20 }} />
              </Flex>
              <Avatar className={styles.avatar} size={32} icon={<UserOutlined />} />
            </Flex>
          </Flex>
        </Header>
        <AntdLayout className={styles.body}>
          <Sider
            className={styles.aside}
            collapsible={false}
            // collapsible={collapsed}
            reverseArrow={true}
            breakpoint={'xl'}
            theme={'light'}
            width={200}
          >
            <Menu theme="light" mode="inline" defaultSelectedKeys={['4']} items={items} />
          </Sider>
          <AntdLayout className={styles.content}>
            {/*<Breadcrumb className={styles['bread-crumbs']}>*/}
            {/*  <Breadcrumb.Item>Home</Breadcrumb.Item>*/}
            {/*  <Breadcrumb.Item>List</Breadcrumb.Item>*/}
            {/*  <Breadcrumb.Item>App</Breadcrumb.Item>*/}
            {/*</Breadcrumb>*/}
            <Content content={styles.children}>
              <Suspense fallback={<Spin size={'large'} />}>{props.children}</Suspense>
            </Content>
            {/*<Footer className={styles.footer}>footer</Footer>*/}
          </AntdLayout>
        </AntdLayout>
      </AntdLayout>
    </React.Fragment>
  );
};

export default React.memo(Layout);
