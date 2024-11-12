import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx';
// 引入 boostrap icon
import 'bootstrap-icons/font/bootstrap-icons.min.css';
// 清除元素默认样式
import 'normalize.css';
// 设置高度 100% 并继承
import '@/styles/full-height.scss';
// 初始化 px 转换 rem( 根据媒体查询, 仅在指定大小下生效, 用于移动端 )
import '@/utils/rem.ts';
// 初始化 多语言
import '@/locales';
// 初始化 本地离线缓存
import '@/utils/pwa.ts';

import React from 'react';

import { registryCacheService } from '@/utils/cache.ts';

// 启动 cache-service.js 用于自定义缓存
registryCacheService();

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter>
    {/* antd 语言设置*/}
    <ConfigProvider locale={zhCN}>
      {/* 解决 antd 样式兼容性 */}
      <StyleProvider hashPriority="high">
        <App />
      </StyleProvider>
    </ConfigProvider>
  </BrowserRouter>,
  // </React.StrictMode>,
);
