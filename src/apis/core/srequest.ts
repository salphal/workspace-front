type MessageHandler = (data: any) => void;

export interface SQConfig {
  /** 地址 */
  url: string;
  /** 协议 */
  protocols: string | string[];
  /** 数据解析方法 */
  filterMessage?: (data: any) => boolean;
  /** 响应拦截 */
  responseInterceptor?: (data: any) => any;
}

/**
 * 1. GET 请求的地址不是类似 /path/, 而是以 ws:// 开头的地址
 * 2. 请求头 Upgrade: websocket 和 Connection: Upgrade 表示这个连接将要被转换为 WebSocket 连接
 * 3. Sec-WebSocket-Key 是用于标识这个连接, 并非用于加密数据
 * 4. Sec-WebSocket-Version 指定了 WebSocket 的协议版本
 */
export class SocketRequest {
  /** socket 实例 */
  private ws: WebSocket | null = null;

  /** 订阅回调列表 */
  private messageHandlers: MessageHandler[] = [];

  /**
   * 连接 websocket
   */
  connect(config: SQConfig): Promise<void> {
    const { url, protocols, filterMessage, responseInterceptor } = config;
    return new Promise<void>((resolve, reject) => {
      if (!protocols) {
        console.error(`protocols is ${protocols}( please config )`);
      }
      this.ws = new WebSocket(url, protocols);
      /** 开启连接  */
      this.ws.onopen = () => {
        console.log(`ws: ${url} connected`);
        resolve();
      };
      /** 处理错误 */
      this.ws.onerror = (error) => {
        reject(error);
      };
      /** 处理关闭 */
      this.ws.onclose = () => {
        console.log(`ws: ${url} closed`);
      };
      /** 发布消息 */
      this.ws.onmessage = (event) => {
        try {
          let data = JSON.parse(event.data);
          if (typeof filterMessage === 'function') {
            /** 自定义过滤消息 */
            if (filterMessage(data)) {
              data = typeof responseInterceptor === 'function' ? responseInterceptor(data) : data;
              this.messageHandlers.forEach((handler) => handler(data));
            }
          } else {
            this.messageHandlers.forEach((handler) => handler(data));
          }
        } catch (err) {
          console.error(err);
        }
      };
    });
  }

  /**
   * 添加回调订阅器
   * @param {MessageHandler} handler - 回调订阅器
   */
  addOnMessage(handler: MessageHandler): void {
    this.messageHandlers.push(handler);
  }

  /**
   * 发送消息
   * @param {any} data - 消息
   */
  sendMessage(data: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.ws) {
        /** 默认传递 json 数据类型 */
        this.ws.send(JSON.stringify(data));
        resolve();
      } else {
        reject(new Error('WebSocket is not connected.'));
      }
    });
  }

  /**
   * 关闭连接
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
