import Layout from '@src/layout';
import routes from '@src/route';
import React from 'react';

import { useLocation, useRoutes } from 'react-router-dom';

import './app.scss';

import { StyleProvider } from '@ant-design/cssinjs';
import { WhitePageList } from '@src/constant/white-page.ts';

import { ConfigProvider } from 'antd';
import { ThemeProvider } from 'antd-style';
import zhCN from 'antd/locale/zh_CN';

function App() {
  const { pathname } = useLocation();

  const page = useRoutes(routes);

  if (WhitePageList.includes(pathname)) return page;

  return (
    <React.Fragment>
      {/* 解决 antd 样式兼容性 */}
      <StyleProvider hashPriority="high">
        {/* antd 主题模式: https://ant-design.antgroup.com/docs/react/customize-theme-cn */}
        <ThemeProvider
          // appearance={mode}
          theme={{
            // algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
            /** css-in-js: https://ant-design.antgroup.com/docs/react/css-variables-cn */
            cssVar: true,
            hashed: false,
            /** 重置样式 */
            components: {
              Layout: {
                // headerBg: mode === 'light' ? '#fff' : '#000',
                headerBg: '#fff',
              },
            },
          }}
        >
          {/* antd 语言设置*/}
          <ConfigProvider locale={zhCN}>
            <Layout>{page}</Layout>
          </ConfigProvider>
        </ThemeProvider>
      </StyleProvider>
    </React.Fragment>
  );
}

export default App;
