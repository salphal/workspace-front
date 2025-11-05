import { handlers } from '@src/__mock__/handlers/index.ts';
import { setupWorker } from 'msw/browser';

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers);

// 在开发环境中启动 msw worker
if (process.env.NODE_ENV === 'development') {
  worker.start({
    onUnhandledRequest: 'bypass', // 对于未处理的请求，直接绕过
  });
}
