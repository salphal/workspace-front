import { ConfigProvider } from 'antd';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx';
// 清除元素默认样式
import 'normalize.css';
// 设置高度 100% 并继承
import '@/styles/full-height.scss';
// 初始化 px 转换 rem
import '@/utils/rem.ts';
// 初始化 多语言
import '@/locales';
// 初始化 本地离线缓存
import '@/utils/pwa.ts';

import { registryCacheService } from '@/utils/cache.ts';

registryCacheService();

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </BrowserRouter>,
  // </React.StrictMode>,
);
