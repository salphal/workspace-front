import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { GraphqlRequest } from '@src/apis/core/grequest.ts';
import { HttpRequest } from '@src/apis/core/hrequest.ts';

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
        (err: AxiosError) => {
          /**
           * 全局响应异常处理
           */
          return Promise.reject(err);
        },
      ],
    ],
  ],
});

export const grequest = new GraphqlRequest({ baseURL: '/v1/graphql' });
