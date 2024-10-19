import React from 'react';
import { RedoOutlined, UploadOutlined } from '@ant-design/icons';
import { ProLayout } from '@ant-design/pro-components';
import { Button } from 'antd';
import classNames from 'classnames';
import { useLocation, useNavigate } from 'react-router-dom';

import styles from './index.module.scss';

export interface LayoutProps {
  [key: string]: any;
}

const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <React.Fragment>
      <ProLayout
        className={classNames([styles.layout])}
        splitMenus
        title={'OpenAI Prompt Management Platform'}
        logo={null}
        location={{
          pathname,
        }}
        // headerRender={() => <div>headerRender</div>}
        // headerTitleRender={() => <div>headerTitleRender</div>}
        headerContentRender={() => (
          <div className={classNames(['flex', 'justify-end', 'w-full'])}>
            <Button className={'mr-3'} icon={<UploadOutlined />}>
              Export
            </Button>
            <Button className={classNames(['mr-10'])} icon={<RedoOutlined />}>
              Reset
            </Button>
          </div>
        )}
        actionsRender={() => []}
        // avatarProps={{
        //   src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
        //   size: 'small',
        //   title: 'admin',
        // }}
        menuFooterRender={(props) => {
          if (props?.collapsed) return undefined;
          return (
            <p
              style={{
                textAlign: 'center',
                paddingBlockStart: 12,
              }}
            >
              Power by Ant Design
            </p>
          );
        }}
        onMenuHeaderClick={(e) => {
          navigate('/home');
        }}
        menuItemRender={(item, dom) => (
          <a
            onClick={() => {
              console.log('=>(layout.tsx:80) onClick', item, dom);
            }}
          >
            {dom}
          </a>
        )}
        layout="top"
      >
        {props.children}
      </ProLayout>
    </React.Fragment>
  );
};

export default React.memo(Layout);
