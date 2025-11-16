import { ResolvedConfig } from 'vite';

/**
 * https://cn.vitejs.dev/guide/api-plugin.html
 * https://rollupjs.org/plugin-development/
 */

export default function vitePluginCustom() {
  return {
    /** 插件名称 */
    name: 'vite-plugin-custom',
    /** 插件版本 */
    version: '1.0.0',
    /** 插件调用时机: serve( 默认 ) | build */
    // apply: 'build',
    configResolved(resolvedConfig: ResolvedConfig) {
      // Vite 独有钩子 在解析 Vite 配置后调用。使用这个钩子读取和存储最终解析的配置。当插件需要根据运行的命令做一些不同的事情时，它也很有用。
      // 存储最终解析的配置
      console.log(resolvedConfig);
    },
  };
}

/**
 * 使用示例
 *
 * import customVitePlugin from "./plugins/custom-vite-plugin";
 *
 * export default defineConfig({
 *   plugins: [
 *     customVitePlugin()
 *   ],
 * });
 */
