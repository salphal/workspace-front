import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import 'normalize.css';

import { ConfigProvider } from 'antd';

import App from './App.tsx';

import './i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </BrowserRouter>,
  // </React.StrictMode>,
);
