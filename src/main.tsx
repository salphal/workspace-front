import { ConfigProvider } from 'antd';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx';

import 'normalize.css';
import '@/styles/full-height.scss';
import '@/utils/rem.ts';
import '@/locales';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </BrowserRouter>,
  // </React.StrictMode>,
);
