import WujieReact from 'wujie-react';

import { apps } from './apps.ts';

const { setupApp, preloadApp, bus } = WujieReact;

/**
 * 主应用
 *  - setupApp: 设置子应用默认属性
 *  - startApp: 启动子应用( 不用自己使用 )
 *  - preloadApp: 预加载子应用
 *  - destroyApp: 销毁所有
 */

/**
 * 子应用
 *  - window.$wujie
 * https://wujie-micro.github.io/doc/api/wujie.html
 *
 ** 需要改造子应用入口: https://wujie-micro.github.io/doc/guide/start.html
 *    主要用于控制子应用的生命周期
 *    - window.__WUJIE_MOUNT
 *    - window.__WUJIE_UNMOUNT
 *    - window.__WUJIE.mount()
 */

/**
 * 官方插件
 * https://wujie-micro.github.io/doc/guide/plugin.html
 */

/**
 * 子应用短路由配置: {短路径} + 剩余路径
 *    /example/prod/hello  => {prod}/hello
 *    /example/test/name => {test}/name
 *    /example/prod/debug?id=5&age=10 => {prodId}5&age=10
 */
const prefix = {
  prod: '/example/prod',
  test: '/example/test',
  prodId: '/example/prod/debug?id=',
};

export const setupMicroServices = () => {
  apps.forEach((app: any) => {
    /**
     * 设置子应用默认属性
     * https://wujie-micro.github.io/doc/api/setupApp.html
     */
    setupApp({ ...app, prefix });
    /**
     * 预加载子应用
     * https://wujie-micro.github.io/doc/api/preloadApp.html
     */
    preloadApp({ name: app.name, url: app.url });
  });
};

/**
 * 无界事件总线( 用于 主应用和子应用之间的 事件通信 )
 * https://wujie-micro.github.io/doc/api/bus.html#on
 */
export const wujieEventBus = bus;
