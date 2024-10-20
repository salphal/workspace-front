import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import AutoImport from 'unplugin-auto-import/vite';
import { ArcoResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { ConfigEnv, defineConfig, loadEnv, UserConfig } from 'vite';
import viteCDNPlugin from 'vite-plugin-cdn-import';
import viteCompression from 'vite-plugin-compression';
import viteImagemin from 'vite-plugin-imagemin';

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
      proxy: {
        // http 请求代理
        '/api': {
          target: 'http://192.168.1.193:10001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api/rest'),
        },
        // graphql 的 subscription 代理( web socket )
        '/v1/graphql': {
          target: 'ws://192.168.1.193:10001/',
          changeOrigin: true,
          ws: true,
          // rewrite: (path) => path.replace(/^\/v1\/graphql/, ''),
        },
        // graphql 的 query 和 mutation 代理
        '/v1': {
          target: 'http://192.168.1.193:10001/',
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/v1\/graphql/, ''),
        },
      },
    },
    plugins: [
      react(),
      AutoImport({
        resolvers: [ArcoResolver()],
      }),
      // 按需引入组件库
      Components({
        resolvers: [
          ArcoResolver({
            sideEffect: true,
          }),
        ],
      }),
      // 打包后开启资源大小分析页面
      visualizer({ open: true }),
      // 兼容低版本浏览器
      legacy({
        targets: ['chrome 52', 'Android > 39', 'iOS >= 10.3', 'iOS >= 10.3'], // 需要兼容的目标列表，可以设置多个
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'], // 面向IE11时需要此插件
      }),
      // 开启 gzip 压缩, 服务端 nginx 还需要配置一下才能生效
      // http {
      //   gzip_static on;
      //   gzip_proxied any;
      // }
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),
      // 图片压缩
      viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false,
        },
        optipng: {
          optimizationLevel: 7,
        },
        mozjpeg: {
          quality: 20,
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4,
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox',
            },
            {
              name: 'removeEmptyAttrs',
              active: false,
            },
          ],
        },
      }),
      // 开启 cdn
      // viteCDNPlugin({
      //   // 需要 CDN 加速的模块
      //   modules: [
      //     {
      //       name: 'lodash',
      //       var: '_',
      //       path: `https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js`
      //     }
      //   ]
      // })
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
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
          entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
          assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
          manualChunks(id) {
            // 将 node_modules 打成一个包, 好方便缓存
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
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
          // 加入全局变量( 不要单独引入该文件样式，否则在最中产物中会重复出现 )
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
