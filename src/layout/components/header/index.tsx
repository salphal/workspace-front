import LanguageSwitcher from '@src/components/language-switcher';
import ThemeSwitcher from '@src/components/theme-switcher';
import HeaderGithub from '@src/layout/components/header/components/github.tsx';
import HeaderLogo from '@src/layout/components/header/components/logo.tsx';
import HeaderSearch from '@src/layout/components/header/components/search.tsx';
import React, { ReactNode, Ref } from 'react';

import { UserOutlined } from '@ant-design/icons';
import { useBreakpoint } from '@ant-design/pro-components';
import { Layout as AntdLayout } from 'antd';

import classNames from 'classnames';

const { Header } = AntdLayout;

export interface LayoutHeaderProps {
  children?: ReactNode;
}

export type LayoutHeaderRef = object;

const LayoutHeader: React.ForwardRefRenderFunction<LayoutHeaderRef, LayoutHeaderProps> = (
  props: LayoutHeaderProps,
  ref: Ref<LayoutHeaderRef | HTMLDivElement>,
) => {
  const screens = useBreakpoint();

  useImperativeHandle(ref, () => ({}));

  const themeOnChange = (mode: string) => {};

  const languageOnChange = (lang: string) => {};

  return (
    <Header className={classNames([['layout-header']])}>
      {screens && (
        <Row justify={'space-between'} align={'middle'} wrap={false}>
          {['xl', 'xxl', 'md', 'lg'].includes(screens) && (
            <>
              <Col span={14}>
                <Flex justify={'start'} align={'center'} wrap={false}>
                  <HeaderLogo />
                  <HeaderSearch />
                </Flex>
              </Col>
              <Col span={10}>
                <Flex justify={'end'} align={'center'} wrap={false}>
                  <Space align={'center'} split={<Divider type="vertical" />}>
                    <ThemeSwitcher onChange={themeOnChange} />
                    <LanguageSwitcher onChange={languageOnChange} />
                    <HeaderGithub />
                    <Avatar size={32} icon={<UserOutlined />} />
                  </Space>
                </Flex>
              </Col>
            </>
          )}
          {['xs', 'sm'].includes(screens) && (
            <>
              <Col span={12}>left</Col>
              <Col span={12}>right</Col>
            </>
          )}
        </Row>
      )}
    </Header>
  );
};

export default React.forwardRef(LayoutHeader);
