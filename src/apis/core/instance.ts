import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { GraphqlRequest } from '@/apis/core/grequest.ts';
import { HttpRequest } from '@/apis/core/hrequest.ts';

export const hrequest = new HttpRequest({
  baseURL: '/api',
  interceptors: [
    [
      [
        // 请求拦截
        (config: AxiosRequestConfig) => {
          return config;
        },
        // 请求错误捕获
        (err: AxiosError) => {
          /** 全局请求异常处理*/
          return Promise.reject(err);
        },
      ],
      [
        // 响应拦截
        (res: AxiosResponse) => {
          return res.data;
        },
        // 响应错误捕获
        (err: AxiosError) => {
          /** 全局响应异常处理*/
          return Promise.reject(err);
        },
      ],
    ],
  ],
});

export const grequest = new GraphqlRequest({ baseURL: '/v1/graphql' });
