import React, { useEffect, useMemo, useState } from 'react';

import MicroServiceApp from '@/components/micro-service-app/micro-service-app.tsx';

type MicroApp = {
  /** 子服务名称( 唯一 ) */
  name: string;
  /** 子服务地址 */
  url: string;
  /** 子服务元数据信息 */
  meta?: { [key: string]: any };
};
export type MicroApps = Array<MicroApp>;

export interface ISubMicroServices {
  /** 所有子服务集合 */
  apps: MicroApps;
  /** 当前子服务集合的前缀 */
  prefix: string;
  /** 自定义需要传递给子服务的属性 */
  props?: { [key: string]: any };
}

export const useSubMicroServices = (config: ISubMicroServices) => {
  const { apps, prefix, props = {} } = config;

  const navigate = useNavigate();
  const { pathname = '', search = '', hash = '', state = {} } = useLocation();

  const [app, setApp] = useState<any>({});
  const [subApps, setSubApps] = useState<any>([]);
  const [error, setError] = useState<string>('');

  /**
   * 根据 prefix 筛选出 所有当前子服务 的配置
   */
  useEffect(() => {
    if (Array.isArray(apps)) {
      const subApps = apps.filter((app) => new RegExp(`^/?${prefix}.*`).test(app.name));
      if (Array.isArray(subApps) && subApps.length) {
        setSubApps(subApps);
      } else {
        console.log('=> subApp is not array or array.length is zero.', subApps);
      }
    }
  }, [apps]);

  /**
   * 根据 pathname 过滤出 单个当前的子服务 的配置
   */
  useEffect(() => {
    setError('');
    if (new RegExp(`^/?${prefix}.*`).test(pathname)) {
      if (!pathname || !Array.isArray(subApps) || !subApps.length) return;
      const [app] = subApps.filter((v: any) => {
        return pathname === v.name;
      });
      if (app && app.name && app.url) {
        setApp(app);
      }
    } else {
      console.log('=> The current sub-service is not matched according to pathname');
      console.log('=> pathname', pathname);
      console.log('=> subApps', subApps);
    }
  }, [pathname, subApps]);

  /**
   * 根据筛选出的 单个子服务配置 创建 wujie 微服务
   */
  const microServiceApp = useMemo(
    () => () => {
      if (app && app.name && app.url) {
        const appUrl = app.url + search + hash;
        const appMeta = app.meta || {};
        const appProps = {
          /** 注入主服务的路由能力 */
          navigate,
          /** 路由数据 */
          state,
          /** 微服务定义时携带的 元数据 */
          meta: appMeta,
          /** 自定义属性 */
          ...props,
        };
        return (
          <MicroServiceApp name={app.name} url={appUrl} props={appProps} loadError={loadError} />
        );
      } else {
        console.log('The same sub-service configuration as path name was not matched');
        console.log('=> app', app);
        return [];
      }
    },
    [app, state, search, hash],
  );

  const loadError = (url: string, err: any) => {
    setError(`fetch ${url} failed`);
    console.error(err);
  };

  return {
    app,
    error,
    microServiceApp,
  };
};
