import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { HttpRequest } from '@/apis/core/hrequest.ts';
import { SocketRequest } from '@/apis/core/srequest.ts';

/**
 * 获取 graphql 语句中的名称
 */
export const extractQueryName = (graphqlQuery: string) => {
  const match = graphqlQuery.match(/\b(query|mutation|subscription)\s+(\w+)\s?/);
  if (match) {
    return match[2]; // 返回语句的名字
  }
  return null; // 如果没有找到语句名，返回 null
};

export interface IGraphqlRequest {
  /** 查询 */
  query: (config: GraphqlConfig) => Promise<any>;
  /** 修改 */
  mutation: (config: GraphqlConfig) => Promise<any>;
  /** 订阅 */
  subscription?: () => Promise<any>;
}

export interface GraphqlConfig {
  /** 查询语句 */
  query: string;
  /** 参数集合 */
  variables?: { [key: string]: any };
}

export type SubscriptionConfig = GraphqlConfig & {
  /** 订阅时必须传递 */
  operationName?: string;
  /** 数据订阅的回调*/
  onMessage: (data: GSResp<any>) => void | null;
};

export interface GResp<T> {
  [key: string]: any;

  /** 响应数据 */
  data: T;
  /** 错误消息 */
  error: any;
}

export interface GSResp<T> {
  /**
   * 响应类型
   *  - ka: 监测连接
   *  - data: 响应数据
   */
  type: 'ka' | 'data';
  id?: string;
  payload?: {
    data: T;
  };
}

export class GraphqlRequest implements IGraphqlRequest {
  baseURL = '/graphql';

  /** 用于 query & mutation */
  hrequest = new HttpRequest({
    baseURL: this.baseURL,
    interceptors: [
      [
        [
          // 请求拦截
          (config: AxiosRequestConfig) => {
            return config;
          },
          // 请求错误捕获
          (err: AxiosError) => {
            /** 全局请求异常处理 */
            return Promise.reject(err);
          },
        ],
        [
          // 响应拦截
          (res: AxiosResponse) => {
            /**
             * graphql 接口错误捕获
             */
            if (res.data && res.data.errors) {
              const messageList = res.data.errors.map((v: any) => v.message);
              console.error('[ Graphql Response Errors ]', messageList);
            }
            return res.data;
          },
          // 响应错误捕获
          (err: AxiosError) => {
            /** 全局响应异常处理 */
            return Promise.reject(err);
          },
        ],
      ],
    ],
  });

  /** 用于 subscription */
  srequest = new SocketRequest();

  constructor(config?: { baseURL: string }) {
    if (config) {
      if (config.baseURL) this.baseURL = config.baseURL;
    }
  }

  query<T = any>(config: GraphqlConfig = { query: '' }): Promise<GResp<T>> {
    return this.hrequest.post<GResp<T>>({
      data: { ...config },
    });
  }

  mutation<T = any>(config: GraphqlConfig = { query: '' }): Promise<GResp<T>> {
    return this.hrequest.post<GResp<T>>({
      data: { ...config },
    });
  }

  subscription<T = any>(
    config: SubscriptionConfig = {
      query: '',
      operationName: '',
      onMessage: () => {},
    },
  ): Promise<any> {
    const { query, operationName, onMessage, variables = {} } = config;
    return new Promise((resolve, reject) => {
      this.srequest
        /** 必须有协议 */
        .connect({
          url: this.baseURL,
          protocols: ['graphql-ws'],
          /** 过滤心跳方法, 避免多次触发数据回调订阅 */
          filterMessage: (data: any) => data.type === 'data',
          /** 响应拦截, 解析出真实数据 */
          responseInterceptor: (data: any) => {
            if (data && data.type === 'data' && data.payload && data.payload.data) {
              return data.payload.data;
            }
            return data;
          },
        })
        .then(async () => {
          /** 01. 初始化与 graphql 的连接 */
          await this.srequest.sendMessage({
            type: 'connection_init',
            payload: {
              headers: {
                'content-type': 'application/json',
              },
              lazy: true,
            },
          });
          /** 02. 发送 query 订阅数据 */
          await this.srequest.sendMessage({
            id: uuidv4(),
            type: 'start',
            payload: {
              variables,
              extensions: {},
              operationName: extractQueryName(query), // 必须填写的和 query 的名称一致
              query,
            },
          });
          /** 03. 添加数据订阅回调 */
          this.srequest.addOnMessage((data) => {
            typeof onMessage === 'function' && onMessage(data);
          });
        })
        .catch((err) => {
          reject(err);
        });
      /** 关闭连接 */
      // this.srequest.disconnect();
      return this.srequest;
    });
  }
}
