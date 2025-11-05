import { HttpRequest } from '@src/api/core/hrequest.ts';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * 用于存储和刷新 token 的简单封装
 */
const TokenService = {
  getAccessToken: () => localStorage.getItem('access_token') || '',
  getRefreshToken: () => localStorage.getItem('refresh_token') || '',
  setTokens: (access: string, refresh: string) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  },
  clear: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};

/**
 * 是否正在刷新 token(防止并发重复刷新)
 */
let isRefreshing = false;

/**
 * 队列:在 token 刷新完成后,重放之前的请求
 */
let requestQueue: ((token: string) => void)[] = [];

/**
 * 刷新 Token 方法
 */
async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing) {
    // 已有刷新请求进行中,返回等待 Promise
    return new Promise((resolve) => {
      requestQueue.push((token) => resolve(token));
    });
  }

  isRefreshing = true;

  try {
    const refreshToken = TokenService.getRefreshToken();
    if (!refreshToken) throw new Error('无 refresh token');

    // 发起刷新请求
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) throw new Error('刷新 token 失败');
    const data = await response.json();

    const newAccess = data.access_token;
    const newRefresh = data.refresh_token || refreshToken;
    TokenService.setTokens(newAccess, newRefresh);

    // 通知所有挂起请求重新执行
    requestQueue.forEach((cb) => cb(newAccess));
    requestQueue = [];

    return newAccess;
  } catch (err) {
    console.error('[Token 刷新失败]', err);
    TokenService.clear();
    // 可触发全局事件:跳转登录页
    // window.location.href = '/login';
    return null;
  } finally {
    isRefreshing = false;
  }
}

/**
 * 创建带双 Token 机制的 HttpRequest 实例
 */
export const hrequest = new HttpRequest({
  baseURL: '/api',
  interceptors: [
    [
      [
        // 请求拦截
        async (config: AxiosRequestConfig) => {
          config.headers ??= {};
          config.headers['Content-Type'] = 'application/json;charset=UTF-8';

          const accessToken = TokenService.getAccessToken();
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }

          return config;
        },
        // 请求错误捕获
        (err: AxiosError) => Promise.reject(err),
      ],
      [
        // 响应拦截
        (res: AxiosResponse) => res.data,
        // 响应错误捕获
        async (err: AxiosError<{ message?: string }>) => {
          const status = err.response?.status;
          const originalRequest = err.config;

          switch (status) {
            case 401: {
              console.warn('未授权,尝试刷新 token');

              // 避免无限循环:refresh 请求失败也会 401
              if (originalRequest?.url?.includes('/auth/refresh')) {
                TokenService.clear();
                // window.location.href = '/login';
                return Promise.reject({
                  code: 401,
                  message: '登录已过期,请重新登录',
                  raw: err,
                });
              }

              const newToken = await refreshAccessToken();

              if (newToken && originalRequest) {
                if (originalRequest.headers) {
                  (originalRequest.headers as Record<string, string>)['Authorization'] =
                    `Bearer ${newToken}`;
                } else {
                  originalRequest.headers = { Authorization: `Bearer ${newToken}` } as any;
                }
                const axios = await import('axios');
                return axios.default(originalRequest);
              }

              return Promise.reject({
                code: 401,
                message: '无法刷新 token,请重新登录',
                raw: err,
              });
            }

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
