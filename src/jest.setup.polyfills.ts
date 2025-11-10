/**
 * ✅ Jest 全局 Polyfill（React + Vite + TypeScript 最佳实践）
 * --------------------------------------------------------------
 * 功能目标：
 *  1. 模拟浏览器内置 API（TextEncoder, fetch, Streams, etc.）
 *  2. 兼容 Node 环境（测试 React / SW / PWA）
 *  3. 避免重复定义与类型冲突
 *  4. 自动检测 jsdom 环境
 *
 * 环境支持：
 *  - Node ≥18 (fetch 原生支持)
 *  - Node <18 自动回退至 node-fetch
 *  - React 18+ / Vite 5+
 * --------------------------------------------------------------
 */

import { TextDecoder, TextEncoder } from 'node:util';

/* --------------------------------------------------------------
 * 🧩 1. TextEncoder / TextDecoder Polyfill
 * -------------------------------------------------------------- */
if (typeof globalThis.TextEncoder === 'undefined') {
  (globalThis as any).TextEncoder = TextEncoder;
  (globalThis as any).TextDecoder = TextDecoder;
}

/* --------------------------------------------------------------
 * 🧩 2. Fetch / Request / Response Polyfill
 * -------------------------------------------------------------- */
if (typeof globalThis.fetch === 'undefined') {
  try {
    // node-fetch v3 (ESM)
    const nodeFetch = require('node-fetch');
    (globalThis as any).fetch = nodeFetch.default || nodeFetch;
    (globalThis as any).Headers = nodeFetch.Headers;
    (globalThis as any).Request = nodeFetch.Request;
    (globalThis as any).Response = nodeFetch.Response;
  } catch {
    console.warn('[jest.setup] ⚠️ Node <18 且未安装 node-fetch，fetch 将不可用');
  }
}

/* --------------------------------------------------------------
 * 🧩 3. BroadcastChannel Polyfill
 * -------------------------------------------------------------- */
if (typeof globalThis.BroadcastChannel === 'undefined') {
  (globalThis as any).BroadcastChannel = class BroadcastChannel {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
    postMessage(_data: unknown) {}
    close() {}
    addEventListener() {}
    removeEventListener() {}
  };
}

/* --------------------------------------------------------------
 * 🧩 4. Streams Polyfill
 * -------------------------------------------------------------- */
if (typeof globalThis.ReadableStream === 'undefined') {
  (globalThis as any).ReadableStream = class ReadableStream {
    getReader() {
      return {
        read: async () => ({ done: true, value: undefined }),
        releaseLock: () => {},
        cancel: async () => {},
      };
    }
  };
}

if (typeof globalThis.WritableStream === 'undefined') {
  (globalThis as any).WritableStream = class WritableStream {
    getWriter() {
      return {
        write: async () => {},
        close: async () => {},
        abort: async () => {},
        releaseLock: () => {},
      };
    }
  };
}

if (typeof globalThis.TransformStream === 'undefined') {
  (globalThis as any).TransformStream = class TransformStream {
    readable: any;
    writable: any;
    constructor() {
      this.readable = new (globalThis as any).ReadableStream();
      this.writable = new (globalThis as any).WritableStream();
    }
  };
}

/* --------------------------------------------------------------
 * 🧩 5. Vite PWA / MSW 环境 Polyfill（可选）
 * -------------------------------------------------------------- */
// Mock Service Worker 等场景下可能需要的环境
if (typeof globalThis.ServiceWorkerRegistration === 'undefined') {
  (globalThis as any).ServiceWorkerRegistration = class {};
}

/* --------------------------------------------------------------
 * 🧩 6. 环境检查提示
 * -------------------------------------------------------------- */
if (typeof window === 'undefined') {
  console.warn(
    '[jest.setup] ⚠️ 未检测到 jsdom 环境，请在 jest.config.ts 中设置 testEnvironment: "jsdom"',
  );
}

/* --------------------------------------------------------------
 * ✅ 7. 全局标记（防止重复执行）
 * -------------------------------------------------------------- */
(globalThis as any).__JEST_POLYFILLED__ = true;
