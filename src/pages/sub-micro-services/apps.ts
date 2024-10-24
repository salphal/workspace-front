import { MicroApps } from '@/hooks/use-submicro-services.tsx';

// 子服务域名
let subAppDomain = 'localhost';
// 子服务端口
let subAppPort = 8080;

/**
 * 根据不同环境更新子服务 端口 和 域名
 */
if (import.meta.env.MODE !== 'dev') {
  subAppDomain = import.meta.env.VITE_DEMO_SUB_DOMAIN;
  subAppPort = import.meta.env.VITE_DEMO_SUB_PORT;
}

/**
 * 必须携带开头的 /
 * 因为在匹配时候 会根据 pathname 和 name 进行匹配
 */
export const prefix = '/prefix';

export const subMicroApps: MicroApps = [
  {
    // 主服务路由地址
    name: `${prefix}/router/path`,
    // 子服务真实路由地址
    url: `//${subAppDomain}:${subAppPort}/real/path`,
    // 自定义携带的元数据( 可选 )
    meta: {},
  },
];
