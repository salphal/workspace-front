import { MicroApps } from '@/hooks/use-submicro-services.tsx';

// 子服务域名
let subAppDomain = 'localhost';
// 子服务端口
let subAppPort = 8080;

/**
 * 打包时, 若不是开发环境
 * 则使用环境变量中的配置更新子服务的 域名 和 端口
 */
if (
  import.meta.env.MODE !== 'dev' &&
  import.meta.env.VITE_DEMO_SUB_DOMAIN &&
  import.meta.env.VITE_DEMO_SUB_PORT
) {
  subAppDomain = import.meta.env.VITE_DEMO_SUB_DOMAIN;
  subAppPort = import.meta.env.VITE_DEMO_SUB_PORT;
} else {
  console.error(
    `Please checked VITE_DEMO_SUB_DOMAIN and VITE_DEMO_SUB_PORT in .env.${import.meta.env.MODE}. file`,
  );
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
