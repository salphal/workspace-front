import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './app.tsx';
// 引入 boostrap icon
import 'bootstrap-icons/font/bootstrap-icons.min.css';
// 清除元素默认样式
import 'normalize.css';
// 重置部分基础样式( eg: 设置高度 100% 并继承 )
import '@src/style/reboot.scss';
// 初始化 px 转换 rem( 根据媒体查询, 仅在指定大小下生效, 用于移动端 )
import '@src/utils/rem.ts';
// 初始化 多语言
import '@src/locale';
// 初始化 本地离线缓存
import '@src/utils/pwa.ts';

import React from 'react';
import { registryCacheService } from '@src/utils/cache.ts';

// 启动 cache-service.js 用于自定义缓存
registryCacheService();

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  // </React.StrictMode>,
);
