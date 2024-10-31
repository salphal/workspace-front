import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

export declare interface R<T> {
  [key: string]: any;

  /** 响应状态码 */
  code: number;
  /** 响应数据 */
  data: T;
  /** 响应消息 */
  message: string;
}

export type OnFulfilled<V = any> = (value: V) => V | Promise<V>;
export type OnRejected = (error: any) => any;

export type Interceptor = [OnFulfilled?, OnRejected?];
export type Interceptors = [Interceptor?, Interceptor?];

export class HttpRequest {
  /** 创建请求的配置对象 */
  config: any;
  /** axios 实例 */
  instance: AxiosInstance;
  /** 拦截器集合 */
  interceptors: Interceptors;

  constructor(config: any) {
    this.config = { ...config };
    this.instance = axios.create(this.config);
    this.interceptors = config.interceptors || [];
    this.setupInterceptor();
  }

  request<T = any>(config: AxiosRequestConfig = {}): Promise<T> {
    return new Promise((resolve, reject) => {
      this.instance
        .request<any, T>(config)
        .then((res: T) => {
          resolve(res);
        })
        .catch((err: AxiosError) => {
          reject(err);
        });
    });
  }

  /** 查 */
  get<T = any>(config: AxiosRequestConfig = {}): Promise<T> {
    return this.request({ ...config, method: 'GET' });
  }

  /** 增 */
  post<T = any>(config: AxiosRequestConfig = {}): Promise<T> {
    return this.request({ ...config, method: 'POST' });
  }

  /** 改 */
  put<T = any>(config: AxiosRequestConfig = {}): Promise<T> {
    return this.request({ ...config, method: 'PUT' });
  }

  /** 删 */
  delete<T = any>(config: AxiosRequestConfig = {}): Promise<T> {
    return this.request({ ...config, method: 'DELETE' });
  }

  /** 上传 */
  upload<T = any>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    const newConfig: AxiosRequestConfig = {
      url,
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    };
    return this.request(newConfig);
  }

  /** 下载 */
  download<T = any>(url: string, params: any, config?: AxiosRequestConfig): Promise<T> {
    const newConfig: AxiosRequestConfig = {
      url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      responseType: 'blob',
      params,
      ...config,
    };
    return this.request(newConfig);
  }

  setupInterceptor(): void {
    if (!Array.isArray(this.interceptors) || !this.interceptors.length) return;

    /** 请求拦截器列表 */
    const requestInterceptors = this.interceptors.map((v) =>
      Array.isArray(v) && v.length >= 1 ? v[0] : null,
    );

    /** 响应拦截器列表 */
    const responseInterceptors = this.interceptors.map((v) =>
      Array.isArray(v) && v.length >= 2 ? v[1] : null,
    );

    // 请求拦截( 先定义的后执行, 源码使用 unshift 添加 )
    requestInterceptors
      .filter((v) => Array.isArray(v))
      .reverse() // 更改执行顺序( 先定义的先执行 )
      .forEach((v) => {
        this.instance.interceptors.request.use(...(v as Interceptor));
      });

    // 响应拦截( 先定义的先执行 )
    responseInterceptors
      .filter((v) => Array.isArray(v))
      .forEach((v) => {
        this.instance.interceptors.response.use(...(v as Interceptor));
      });
  }
}
