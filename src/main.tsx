import ReactDOM from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';

import App from './app.tsx';
// 引入 boostrap icon
import 'bootstrap-icons/font/bootstrap-icons.min.css';
// 清除元素默认样式
import 'normalize.css';
// 重置部分基础样式( eg: 设置高度 100% 并继承 )
import '@src/styles/reboot.scss';
// 初始化 px 转换 rem( 根据媒体查询, 仅在指定大小下生效, 用于移动端 )
import '@src/utils/rem.ts';
// 初始化 多语言
import '@src/locales';

import React from 'react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
