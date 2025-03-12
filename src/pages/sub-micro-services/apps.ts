import { MicroApps } from '@src/hooks/use-submicro-services.tsx';

/**
 * 尽量保证导出的变量命名唯一
 *  外部可能需要引用, 避免冲突
 */

// 子服务域名( 命名唯一 )
let demoDomain = 'localhost';
// 子服务端口( 命名唯一 )
let demoPort = 8080;

/**
 * 打包时, 若不是开发环境
 * 则使用环境变量中的配置更新子服务的 域名 和 端口
 */
if (
  import.meta.env.MODE !== 'dev' &&
  import.meta.env.VITE_DEMO_SUB_DOMAIN &&
  import.meta.env.VITE_DEMO_SUB_PORT
) {
  demoDomain = import.meta.env.VITE_DEMO_SUB_DOMAIN;
  demoPort = import.meta.env.VITE_DEMO_SUB_PORT;
} else {
  console.error(
    `Please checked VITE_DEMO_SUB_DOMAIN and VITE_DEMO_SUB_PORT in .env.${import.meta.env.MODE}. file`,
  );
}

/**
 * 命名唯一
 *
 * 必须携带开头的 /
 * 因为在匹配时候 会根据 pathname 和 name 进行匹配
 *
 ** 需要在 router 配置路由
 */
export const demoPrefix = '/prefix';

/**
 * 命名唯一
 *
 ** 需要在 /microservices/apps 中引入该配置
 */
export const demoApps: MicroApps = [
  {
    // 主服务路由地址
    name: `${demoPrefix}/router/path`,
    // 子服务真实路由地址
    url: `//${demoDomain}:${demoPort}/real/path`,
    // 自定义携带的元数据( 可选 )
    meta: {},
  },
];
