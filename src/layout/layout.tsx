import React, { Suspense } from 'react';
import { gray } from '@ant-design/colors';
import {
  EllipsisOutlined,
  GithubFilled,
  HddFilled,
  SearchOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { useBreakpoint } from '@ant-design/pro-components';
import { Layout as AntdLayout, Avatar, Button, Col, Divider, Flex, Input, Menu, Spin } from 'antd';
import { t } from 'i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import styles from './index.module.scss';
import LanguageSwitcher from '@/components/language-switcher';
import ThemeSwitcher from '@/components/theme-switcher';
import { setMode } from '@/store/theme.ts';

const { Header, Content, Footer, Sider } = AntdLayout;

export interface LayoutProps {
  [key: string]: any;
}

const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const screens = useBreakpoint();

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

  const NavigateMenu = () => (
    <Menu
      theme="light"
      mode="horizontal"
      defaultSelectedKeys={['4']}
      overflowedIndicator={
        screens === 'xs' ? (
          <i className={'bi-text-indent-left'} style={{ fontSize: 28, color: gray[3] }} />
        ) : (
          <EllipsisOutlined />
        )
      }
      items={items1}
    />
  );

  const AsideMenu = () => (
    <Menu theme="light" mode="inline" defaultSelectedKeys={['4']} items={items} />
  );

  const languageOnChange = () => {};

  const themeOnChange = (mode: any) => {
    setMode(mode);
  };

  return (
    <React.Fragment>
      <AntdLayout className={styles.layout} hasSider={screens === 'xs'}>
        <Header className={styles.header}>
          <Row
            className={styles['header-content']}
            justify={'space-between'}
            align={'top'}
            wrap={false}
          >
            <Col xs={3} sm={0}>
              <NavigateMenu />
            </Col>
            <Col xs={18} sm={0} flex={'auto'}>
              <Row justify={'center'}>
                <span className={styles.logo}>
                  <i className={'bi-tag-fill'}></i>
                </span>
                <span className={styles.title}>{t('title')}</span>
              </Row>
            </Col>
            <Col xs={3} sm={0}>
              <Avatar size={32} icon={<UserOutlined />} />
            </Col>
            <Col className={styles['header-content-l']} xs={0} md={10} xl={8}>
              <Row justify="start" align={'middle'} wrap={true}>
                <Col>
                  <HddFilled className={styles.logo} style={{ padding: '0 0 0 24px' }} />
                  <span className={styles.title}>{t('title')}</span>
                </Col>
                <Col>
                  <Divider className={styles.divider} type={'vertical'} />
                </Col>
                <Col>
                  <Flex justify={'center'} align={'center'}>
                    <Input
                      className={styles.search}
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
                </Col>
              </Row>
            </Col>
            <Col className={styles['header-content-r']} xs={0} md={14} xl={16}>
              <Row justify={'end'} align={'middle'} wrap={false}>
                {/*<Col xs={0} md={8} xl={6}>*/}
                {/*  <NavigateMenu />*/}
                {/*</Col>*/}
                <Col style={{ padding: '0 24px' }}>
                  <Space align={'center'} size={8} split={<Divider type="vertical" />}>
                    <ThemeSwitcher onChange={themeOnChange} />
                    <LanguageSwitcher onChange={languageOnChange} />
                    <Button
                      type={'text'}
                      icon={<GithubFilled style={{ display: 'block', fontSize: 22 }} />}
                      style={{ display: 'block' }}
                    />
                  </Space>
                </Col>
                <Col style={{ padding: '0 24px 0 0' }}>
                  <Avatar size={32} icon={<UserOutlined />} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Header>
        <AntdLayout className={styles.body}>
          <Sider
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
            {/*<Menu theme="light" mode="inline" defaultSelectedKeys={['4']} items={items} />*/}
            <AsideMenu />
          </Sider>
          <AntdLayout className={styles.content}>
            <div
              className={styles.collapsed}
              onClick={() => setCollapsed((collapsed) => !collapsed)}
            >
              <i
                className={!collapsed ? 'bi-caret-left-fill' : 'bi-caret-right-fill'}
                style={{ color: '#ccc' }}
              />
            </div>
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
