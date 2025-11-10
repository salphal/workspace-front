/**
 * ✅ Jest 全局测试环境初始化（React + TS + Vite + MSW）
 * -------------------------------------------------------
 * 提供：
 * - DOM 环境修复（matchMedia, document.title）
 * - MSW 服务端 Mock 支持
 * - React / ReactRouter / Antd 全局 API 注入
 * - Jest-DOM 扩展匹配器
 */

import '@testing-library/jest-dom';

import * as React from 'react';
import { server } from '@src/__mock__/node';
import * as Antd from 'antd';
import * as ReactRouterDom from 'react-router-dom';

// 🧩 设置基础 HTML 结构（jest 不会加载 index.html）
document.title = 'vite react front temp';
document.body.innerHTML = '<div id="root"></div>';

/* -------------------------------------------------------------------------- */
/* 🧠 Polyfill: window.matchMedia (jsdom 不支持)                               */
/* -------------------------------------------------------------------------- */
if (typeof window.matchMedia === 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // 兼容旧版 API
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

/* -------------------------------------------------------------------------- */
/* 🌍 全局自动导入（模拟 unplugin-auto-import）                                */
/* -------------------------------------------------------------------------- */
const setupGlobalAutoImports = () => {
  const g = globalThis as Record<string, unknown>;

  // ✅ 注入 Ant Design 组件
  (
    [
      'Col',
      'ConfigProvider',
      'Divider',
      'Flex',
      'Input',
      'Menu',
      'Row',
      'Space',
      'Tooltip',
    ] as const
  ).forEach((k) => {
    if (!g[k]) g[k] = (Antd as any)[k];
  });

  // ✅ 注入 React Hooks & API
  (
    [
      'useState',
      'useEffect',
      'useMemo',
      'useCallback',
      'useRef',
      'useContext',
      'useLayoutEffect',
      'createRef',
      'forwardRef',
      'lazy',
      'memo',
    ] as const
  ).forEach((k) => {
    if (!g[k]) g[k] = (React as any)[k];
  });

  // ✅ 注入 React Router DOM API
  (
    [
      'useLocation',
      'useNavigate',
      'useRoutes',
      'Link',
      'NavLink',
      'Navigate',
      'Outlet',
      'Route',
      'Routes',
    ] as const
  ).forEach((k) => {
    if (!g[k]) g[k] = (ReactRouterDom as any)[k];
  });
};

setupGlobalAutoImports();

/* -------------------------------------------------------------------------- */
/* 🧪 MSW 生命周期控制                                                         */
/* -------------------------------------------------------------------------- */
beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'warn', // 避免测试遗漏接口调用
  });
});

afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks(); // ✅ 清除所有 mock 避免污染
});

afterAll(() => {
  server.close();
});

/* -------------------------------------------------------------------------- */
/* 🧩 额外建议：在 tsconfig.json 中为 Jest 环境配置全局类型                   */
/* -------------------------------------------------------------------------- */
// "types": ["jest", "@testing-library/jest-dom"]
