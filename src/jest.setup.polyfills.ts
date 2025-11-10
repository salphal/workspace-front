/**
 * ✅ Jest 全局环境 Polyfill（React + TS + Vite 最佳实践）
 * --------------------------------------------------------------
 * 目标：
 *   - 模拟浏览器内置 API（TextEncoder, fetch, Streams, etc.）
 *   - 保证在 Node 环境运行 React / PWA / MSW 测试正常
 *   - 避免重复加载、类型不兼容与性能浪费
 */

import { TextDecoder, TextEncoder } from 'node:util';

// 🧩 Polyfill: TextEncoder / TextDecoder (Node < 19)
if (typeof globalThis.TextEncoder === 'undefined') {
  (globalThis as any).TextEncoder = TextEncoder;
  (globalThis as any).TextDecoder = TextDecoder;
}

// 🧩 Polyfill: Fetch API
// Vite + Node 18+ 自带 fetch，无需重复加载
if (typeof globalThis.fetch === 'undefined') {
  // 使用 node-fetch 兼容 Node < 18
  const nodeFetch = require('node-fetch');
  (globalThis as any).fetch = nodeFetch.default || nodeFetch;
  (globalThis as any).Headers = nodeFetch.Headers;
  (globalThis as any).Request = nodeFetch.Request;
  (globalThis as any).Response = nodeFetch.Response;
}

// 🧩 Polyfill: BroadcastChannel (Node 不原生支持)
if (typeof globalThis.BroadcastChannel === 'undefined') {
  (globalThis as any).BroadcastChannel = class BroadcastChannel {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
    postMessage(_: unknown) {}
    close() {}
    addEventListener() {}
    removeEventListener() {}
  };
}

// 🧩 Polyfill: ReadableStream / WritableStream / TransformStream
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

// ✅ 安全检查：确保 Jest 使用 jsdom 环境
if (typeof window === 'undefined') {
  console.warn(
    '[jest.setup] 警告：未检测到 jsdom 环境，请在 jest.config.ts 中设置 testEnvironment: "jsdom"',
  );
}
