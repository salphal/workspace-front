type MessageHandler<T = any> = (data: T) => void;

export interface WSConfig<T = any> {
  /** 地址 */
  url: string;
  /** 协议 */
  protocols?: string | string[];
  /** 数据过滤函数 */
  filterMessage?: (data: T) => boolean;
  /** 响应拦截函数 */
  responseInterceptor?: (data: T) => T;
  /** 自动重连 */
  reconnect?: boolean;
  /** 最大重连次数 */
  maxRetries?: number;
  /** 重连间隔( ms )*/
  retryInterval?: number;
  /** 心跳间隔( ms )*/
  heartbeatInterval?: number;
  /** 心跳消息内容 */
  heartbeatMessage?: any;
}

export class SocketRequest<T = any> {
  private ws: WebSocket | null = null;
  private messageHandlers: MessageHandler<T>[] = [];

  private retries = 0;
  private heartbeatTimer?: NodeJS.Timeout;
  private reconnectTimer?: NodeJS.Timeout;

  private isManuallyClosed = false;

  constructor(private config: WSConfig<T>) {}

  /** 当前连接状态 */
  get readyState() {
    return this.ws?.readyState;
  }

  /** 初始化连接 */
  connect(): Promise<void> {
    const { url, protocols } = this.config;

    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url, protocols);

      this.ws.onopen = () => {
        console.info(`[WS] Connected → ${url}`);
        this.retries = 0;
        this.startHeartbeat();
        resolve();
      };

      this.ws.onerror = (err) => {
        console.error('[WS] Error:', err);
        this.scheduleReconnect();
        reject(err);
      };

      this.ws.onclose = (event) => {
        console.warn('[WS] Closed', event.code, event.reason);
        this.stopHeartbeat();
        if (!this.isManuallyClosed) {
          this.scheduleReconnect();
        }
      };

      this.ws.onmessage = (event) => this.handleMessage(event);
    });
  }

  /** 处理消息 */
  private handleMessage(event: MessageEvent) {
    try {
      let data: T = JSON.parse(event.data);
      const { filterMessage, responseInterceptor } = this.config;

      if (filterMessage && !filterMessage(data)) return;

      if (responseInterceptor) {
        data = responseInterceptor(data);
      }

      this.messageHandlers.forEach((fn) => fn(data));
    } catch (err) {
      console.error('[WS] Message parse error:', err);
    }
  }

  /** 心跳机制 */
  private startHeartbeat() {
    const { heartbeatInterval = 30000, heartbeatMessage = 'ping' } = this.config;
    if (!heartbeatInterval) return;
    this.stopHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(
          typeof heartbeatMessage === 'string'
            ? heartbeatMessage
            : JSON.stringify(heartbeatMessage),
        );
      }
    }, heartbeatInterval);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
  }

  /** 自动重连 */
  private scheduleReconnect() {
    const { reconnect = true, maxRetries = 5, retryInterval = 3000 } = this.config;
    if (!reconnect || this.isManuallyClosed) return;

    if (this.retries >= maxRetries) {
      console.warn(`[WS] Max reconnect attempts reached (${maxRetries})`);
      return;
    }

    this.retries++;
    console.info(`[WS] Reconnecting... attempt ${this.retries}/${maxRetries}`);
    this.reconnectTimer = setTimeout(() => this.connect(), retryInterval);
  }

  /** 添加消息监听 */
  addOnMessage(handler: MessageHandler<T>) {
    this.messageHandlers.push(handler);
  }

  /** 移除消息监听 */
  removeOnMessage(handler: MessageHandler<T>) {
    this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
  }

  /** 发送消息 */
  sendMessage(data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('[WS] Cannot send, socket not open.');
    }
  }

  /** 关闭连接(手动) */
  disconnect(): void {
    this.isManuallyClosed = true;
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    console.info('[WS] Disconnected manually.');
  }
}
