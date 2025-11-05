// 为 Jest 环境添加必要的 polyfill
if (typeof TextEncoder === 'undefined') {
  // 使用类型断言来避免 TypeScript 错误
  const util = require('util');
  (global as any).TextEncoder = util.TextEncoder;
  (global as any).TextDecoder = util.TextDecoder;
}

// 为 Jest 环境添加 Fetch API polyfill
if (typeof Response === 'undefined') {
  const nodeFetch = require('node-fetch');
  (global as any).Response = nodeFetch.Response;
  (global as any).Request = nodeFetch.Request;
  (global as any).Headers = nodeFetch.Headers;
  (global as any).fetch = nodeFetch.default || nodeFetch;
}

// 为 Jest 环境添加 BroadcastChannel polyfill
if (typeof BroadcastChannel === 'undefined') {
  (global as any).BroadcastChannel = class BroadcastChannel {
    constructor() {}
    postMessage() {}
    close() {}
    addEventListener() {}
    removeEventListener() {}
  };
}

// 为 Jest 环境添加 TransformStream polyfill
if (typeof TransformStream === 'undefined') {
  (global as any).TransformStream = class TransformStream {
    readable: any;
    writable: any;
    constructor() {
      this.readable = new (global as any).ReadableStream();
      this.writable = new (global as any).WritableStream();
    }
  };
}

// 为 Jest 环境添加 ReadableStream 和 WritableStream polyfill
if (typeof ReadableStream === 'undefined') {
  (global as any).ReadableStream = class ReadableStream {
    constructor() {}
    getReader() {
      return {
        read: () => Promise.resolve({ done: true, value: undefined }),
        releaseLock: () => {},
        cancel: () => Promise.resolve(),
      };
    }
  };
}

if (typeof WritableStream === 'undefined') {
  (global as any).WritableStream = class WritableStream {
    constructor() {}
    getWriter() {
      return {
        write: () => Promise.resolve(),
        releaseLock: () => {},
        close: () => Promise.resolve(),
        abort: () => Promise.resolve(),
      };
    }
  };
}
