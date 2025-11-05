import { GraphqlRequest } from '@src/api/core/grequest.ts';
import { HttpRequest } from '@src/api/core/hrequest.ts';
import { SocketRequest } from '@src/api/core/srequest.ts';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export const hrequest = new HttpRequest({
  baseURL: '/api',
  interceptors: [
    [
      [
        // 请求拦截
        (config: AxiosRequestConfig) => {
          /** 默认请求头类型 */
          config!.headers!['Content-Type'] = 'application/json;charset=UTF-8';
          /**
           * 登陆成功后
           * 添加 Authorization 到请求头中
           */
          const token = '';
          if (config.headers && token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        // 请求错误捕获
        (err: AxiosError) => {
          /**
           * 全局请求异常处理
           */
          return Promise.reject(err);
        },
      ],
      [
        // 响应拦截
        (res: AxiosResponse) => {
          /**
           * 若没有权限 code === 4xx
           * 触发全局事件总线返回登陆页面
           */
          return res.data;
        },
        // 响应错误捕获
        (err: AxiosError<{ message?: string }>) => {
          /**
           * 全局响应异常处理
           */

          const status = err.response?.status;

          switch (status) {
            case 401:
              console.warn('未授权,跳转登录');
              // redirect('/login')
              break;
            case 500:
              console.error('服务器错误:', err.message);
              break;
            default:
              console.error('网络错误:', err.message);
          }

          return Promise.reject({
            code: status,
            message: err.response?.data?.message || err.message,
            raw: err,
          });
        },
      ],
    ],
  ],
});

export const grequest = new GraphqlRequest({ baseURL: '/v1/graphql' });

export const srequest = new SocketRequest<{ type: string; payload: any }>({
  url: 'wss://example.com/socket',
  reconnect: true,
  heartbeatInterval: 10000,
  heartbeatMessage: { ping: true },
  responseInterceptor: (data) => data.payload,
});
