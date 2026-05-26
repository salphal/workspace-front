import Layout from '@src/layout';
import routes from '@src/route';
import React, { useEffect } from 'react';

import { useLocation, useRoutes } from 'react-router-dom';

import './app.scss';

import { StyleProvider } from '@ant-design/cssinjs';
import { toggleTheme } from '@src/components/theme-switcher/utils.ts';
import { WhitePageList } from '@src/constant/white-page.ts';
import { useThemeConfig } from '@src/hook/useThemeConfig.ts';
import useLanguageStore from '@src/store/language.ts';
import useThemeStore from '@src/store/theme.ts';

import { ConfigProvider } from 'antd';
import { ThemeProvider } from 'antd-style';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';

function App() {
  const { pathname } = useLocation();
  const locale = useLanguageStore((s) => s.locale);
  const appMode = useThemeStore((s) => s.mode);

  const page = useRoutes(routes);

  useEffect(() => {
    toggleTheme(appMode);
  }, [appMode]);

  const antdLocale = locale === 'en' ? enUS : zhCN;

  const themeConfig = useThemeConfig(appMode);

  if (WhitePageList.includes(pathname)) return page;

  return (
    <React.Fragment>
      {/* 解决 antd 样式兼容性 */}
      <StyleProvider hashPriority="high">
        {/* antd 主题模式: https://ant-design.antgroup.com/docs/react/customize-theme-cn */}
        <ThemeProvider appearance={appMode} theme={themeConfig}>
          {/* antd 语言设置*/}
          <ConfigProvider locale={antdLocale}>
            <Layout>{page}</Layout>
          </ConfigProvider>
        </ThemeProvider>
      </StyleProvider>
    </React.Fragment>
  );
}

export default App;
