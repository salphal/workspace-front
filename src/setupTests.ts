import '@testing-library/jest-dom';

import * as React from 'react';
import { server } from '@src/__mock__/node.ts';
import * as Antd from 'antd';
import * as ReactRouterDom from 'react-router-dom';

/**
 * 设置 document.title, div#id
 * 注意：测试环境不会加载 index.html，需要手动设置
 */
document.title = 'vite react front temp';
document.body.innerHTML = '<div id="root"></div>';

/**
 * Mock matchMedia for jsdom environment
 * jsdom 环境不支持 matchMedia API，需要手动模拟
 */
const mockMatchMedia = () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

/**
 * 批量设置全局变量
 * 这些是开发环境中通过 unplugin-auto-import 自动导入的 API
 * 在 Jest 测试环境中需要手动添加到 global 对象
 */
const setupGlobalAutoImports = () => {
  const globalAny = global as any;

  // Antd 组件
  const antdComponents = [
    'Col',
    'ConfigProvider',
    'Divider',
    'Flex',
    'Input',
    'Menu',
    'Row',
    'Space',
    'Tooltip',
  ] as const;

  antdComponents.forEach((component) => {
    globalAny[component] = Antd[component];
  });

  // React Hooks 和 APIs
  const reactApis = [
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
  ] as const;

  reactApis.forEach((api) => {
    globalAny[api] = React[api];
  });

  // React Router DOM APIs
  const routerApis = [
    'useLocation',
    'useNavigate',
    'useRoutes',
    'Link',
    'NavLink',
    'Navigate',
    'Outlet',
    'Route',
    'Routes',
  ] as const;

  routerApis.forEach((api) => {
    globalAny[api] = ReactRouterDom[api];
  });
};

// 执行初始化
mockMatchMedia();
setupGlobalAutoImports();

/**
 * 每个测试用例调用之前被执行
 */
afterEach(() => {
  // Reset the request handlers between each test.
  // This way the handlers we add on a per-test basis
  // do not leak to other, irrelevant tests.
  server.resetHandlers();
});

/**
 * 每个测试用例调用后被执行
 */
afterEach(() => {});

/**
 * 全局测试用例调用前执行
 */
beforeAll(() => {
  // Enable API mocking before all the tests.
  server.listen();
});

/**
 * 全局测试用例调用后执行
 */
afterAll(() => {
  // Finally, disable API mocking after the tests are done.
  server.close();
});
