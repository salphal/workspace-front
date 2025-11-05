import { HttpRequest } from '@src/api/core/hrequest.ts';
import { SocketRequest } from '@src/api/core/srequest.ts';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { v4 as uuidv4 } from 'uuid';

/**
 * 获取 graphql 语句中的名称
 */
export const extractQueryName = (graphqlQuery: string): string | null => {
  const match = graphqlQuery.match(/\b(query|mutation|subscription)\s+(\w+)\s?/);
  return match ? match[2] : null;
};

/** GraphQL 基础配置 */
export interface GraphqlConfig {
  /** 查询语句 */
  query: string;
  /** 参数集合 */
  variables?: Record<string, any>;
}

/** 订阅配置 */
export type SubscriptionConfig = GraphqlConfig & {
  /** 操作名(可选) */
  operationName?: string;
  /** 数据订阅的回调 */
  onMessage?: (data: GSResp<any>) => void | null;
};

/** GraphQL 请求接口定义 */
export interface IGraphqlRequest {
  /** 查询 */
  query: <T = any>(config: GraphqlConfig) => Promise<GResp<T>>;
  /** 修改 */
  mutation: <T = any>(config: GraphqlConfig) => Promise<GResp<T>>;
  /** 订阅 */
  subscription: <T = any>(config: SubscriptionConfig) => Promise<() => void>;
}

/** GraphQL 响应结构 */
export interface GResp<T> {
  /** 响应数据 */
  data: T;
  /** 错误消息 */
  error?: any;
  [key: string]: any;
}

/** GraphQL Subscription 响应结构 */
export interface GSResp<T> {
  /** 响应类型 - ka: 心跳检测, data: 响应数据 */
  type: 'ka' | 'data';
  id?: string;
  payload?: { data: T };
}

/**
 * GraphQL 请求封装类
 */
export class GraphqlRequest implements IGraphqlRequest {
  baseURL: string;

  /** 用于 query & mutation */
  private readonly hrequest: HttpRequest;

  /** 用于 subscription */
  private readonly srequest: SocketRequest;

  constructor(config: { baseURL?: string } = {}) {
    this.baseURL = config.baseURL ?? '/graphql';

    this.hrequest = new HttpRequest({
      baseURL: this.baseURL,
      interceptors: [
        [
          [
            // 请求拦截
            (req: AxiosRequestConfig) => req,
            // 请求错误捕获
            (err: AxiosError) => Promise.reject(err),
          ],
          [
            // 响应拦截
            (res: AxiosResponse) => {
              if (res.data?.errors) {
                const messageList = res.data.errors.map((v: any) => v.message);
                console.error('[GraphQL Response Errors]', messageList);
              }
              return res.data;
            },
            // 响应错误捕获
            (err: AxiosError) => Promise.reject(err),
          ],
        ],
      ],
    });

    this.srequest = new SocketRequest({
      url: this.baseURL,
      protocols: ['graphql-ws'],
      /** 过滤心跳方法,避免多次触发数据回调 */
      filterMessage: (data: any) => data.type === 'data',
      /** 响应拦截,解析真实数据 */
      responseInterceptor: (data: any) =>
        data?.type === 'data' && data?.payload?.data ? data.payload.data : data,
    });
  }

  /**
   * GraphQL 查询
   */
  async query<T = any>(config: GraphqlConfig): Promise<GResp<T>> {
    return this.hrequest.post<GResp<T>>({
      data: { ...config },
    });
  }

  /**
   * GraphQL 修改
   */
  async mutation<T = any>(config: GraphqlConfig): Promise<GResp<T>> {
    return this.hrequest.post<GResp<T>>({
      data: { ...config },
    });
  }

  /**
   * GraphQL 订阅
   * 返回一个可调用的函数用于断开连接
   */
  async subscription<T = any>(config: SubscriptionConfig): Promise<() => void> {
    const { query, variables = {}, operationName, onMessage } = config;

    try {
      /** 01. 确保 WebSocket 已连接 */
      await this.srequest.connect();

      /** 02. 初始化连接 */
      this.srequest.sendMessage({
        type: 'connection_init',
        payload: {
          headers: { 'content-type': 'application/json' },
        },
      });

      /** 03. 发送订阅请求 */
      const id = uuidv4();
      this.srequest.sendMessage({
        id,
        type: 'start',
        payload: {
          query,
          variables,
          extensions: {},
          operationName: operationName || extractQueryName(query),
        },
      });

      /** 04. 注册消息回调 */
      if (typeof onMessage === 'function') {
        this.srequest.addOnMessage(onMessage);
      }

      /** 返回取消订阅函数 */
      return () => {
        this.srequest.sendMessage({ id, type: 'stop' });
        this.srequest.disconnect();
      };
    } catch (err) {
      console.error('[GraphQL Subscription Error]', err);
      throw err;
    }
  }
}
