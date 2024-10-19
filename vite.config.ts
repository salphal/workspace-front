import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { ConfigEnv, defineConfig, loadEnv, UserConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';

/**
 * https://vitejs.dev/config/
 *
 * @param command {string} - 执行的命令
 * @param mode {string} - 环境
 */
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  console.log('=>(vite.config.ts:11) mode', mode);
  console.log('=>(vite.config.ts:11) command', command);
  console.log('=>(vite.config.ts:11) command', process.cwd());

  const root = process.cwd(); // 根目录
  /**
   * @param mode {string} - 环境
   * @param root {string} - 目录
   * @param prefix {string} - 仅读取该前缀的环境变量
   *
   * @return {[key: string]: string} - 返回的值类型都是字符串
   */
  const envs = loadEnv(mode, root, 'VITE_');
  console.log('=>(vite.config.ts:22) envs', envs);

  return {
    server: {
      port: 3000,
      open: true,
    },
    plugins: [
      react(),
      // 打包后开启资源大小分析页面
      visualizer({ open: true }),
      // 兼容低版本浏览器
      legacy({
        targets: ['chrome 52', 'Android > 39', 'iOS >= 10.3', 'iOS >= 10.3'], // 需要兼容的目标列表，可以设置多个
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'], // 面向IE11时需要此插件
      }),
      // 开启 gzip 压缩
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),
    ],
    resolve: {
      // 路径别名
      alias: {
        '@': '/src',
      },
    },
    build: {
      // 压缩构建产物
      minify: 'terser',
      terserOptions: {
        compress: {
          // 移除生产环境的 debug 和 console
          drop_console: true,
          drop_debugger: true,
        },
      },
      // 移除生产环境的 sourcemap
      sourcemap: false,
    },
    optimizeDeps: {
      // 依赖预构建( esbuild ), vite 会将预构建存放在 node_modules/.vite 中
      exclude: [''],
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 加入全局变量( 不要加入样式，否则在最中产物中会重复出现 )
          additionalData: "@import '@/styles/variables.scss';",
        },
      },
      modules: {
        /**
         * @param name {string} - 当前文件名
         * @param local {string} - 表示当前类名
         * @param hash {string} - 表示 hash 值
         */
        generateScopedName: '[name]_[local]_[hash:base64:5]',
      },
    },
  };
});
