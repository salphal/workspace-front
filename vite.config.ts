import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import { codeInspectorPlugin } from 'code-inspector-plugin';
import postCssPxToRem from 'postcss-pxtorem';
import { visualizer } from 'rollup-plugin-visualizer';
import AntdResolver from 'unplugin-antd-resolver';
import AutoImport from 'unplugin-auto-import/vite';
import { ConfigEnv, defineConfig, loadEnv, UserConfig } from 'vite';
import viteCDNPlugin from 'vite-plugin-cdn-import';
import viteCompression from 'vite-plugin-compression';
import viteImagemin from 'vite-plugin-imagemin';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';

/**
 * 配置文档: https://vitejs.dev/config/
 * 插件列表: https://github.com/vitejs/awesome-vite#plugins
 *
 * @param {string} command - 执行的命令
 * @param {string} mode - 环境
 */
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  console.log('=>(vite.config.ts) mode', mode);
  console.log('=>(vite.config.ts) command', command);
  console.log('=>(vite.config.ts) command', process.cwd());

  const root = process.cwd(); // 根目录
  /**
   * @param {string} mode - 环境
   * @param {string} root - 目录
   * @param {string} prefix - 仅读取该前缀的环境变量
   *
   * @return {[key: string]: string} - 返回的值类型都是字符串
   */
  const envs = loadEnv(mode, root, 'VITE_');
  console.log('=>(vite.config.ts) envs', envs);

  return {
    server: {
      port: 8182,
      open: true,
      proxy: {
        // http 请求代理
        '/api': {
          target: 'http://api.alphal.cn:60001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api/rest'),
        },
        // graphql 的 subscription 代理( web socket )
        '/v1/graphql': {
          target: 'ws://api.alphal.cn:60001/',
          changeOrigin: true,
          ws: true,
          // rewrite: (path) => path.replace(/^\/v1\/graphql/, ''),
        },
        // graphql 的 query 和 mutation 代理
        '/v1': {
          target: 'http://api.alphal.cn:60001/',
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/v1\/graphql/, ''),
        },
      },
    },
    plugins: [
      react(),
      /**
       * code-inspector-plugin + locatorJs( chrome plugin )
       * 开发时通过点击快速跳转到源码
       */
      codeInspectorPlugin({ bundler: 'vite' }),
      /**
       * https://github.com/vite-pwa/vite-plugin-pwa/blob/main/src/types.ts
       * 离线缓存
       *   - workbox    // 内部使用 google 开发的这个库
       ** 该插件为官方插件
       */
      VitePWA({
        includeAssets: ['favicon.svg'],
        // 自动更新 Service Worker
        registerType: 'autoUpdate',
        manifest: false,
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /v1/i, // 接口缓存 此处填你想缓存的接口正则匹配
              handler: 'CacheFirst',
              options: {
                cacheName: 'interface-cache',
                expiration: {
                  maxEntries: 30, // 最多缓存30个，超过的按照LRU原则删除
                  maxAgeSeconds: 0.5 * (24 * 60 * 60), // 缓存 半天
                },
                cacheableResponse: {
                  statuses: [200],
                },
              },
            },
            {
              urlPattern: /(.*?)\.(js|css|ts)/, // js /css /ts 静态资源缓存
              handler: 'CacheFirst',
              options: {
                cacheName: 'js-css-cache',
                expiration: {
                  // maxEntries: 30, // 最多缓存30个，超过的按照LRU原则删除
                  maxAgeSeconds: 30 * (24 * 60 * 60), // 缓存 30天
                },
                cacheableResponse: {
                  statuses: [200],
                },
              },
            },
            {
              urlPattern: /(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/, // 图片缓存
              handler: 'CacheFirst',
              options: {
                cacheName: 'image-cache',
                expiration: {
                  // maxEntries: 30, // 最多缓存30个，超过的按照LRU原则删除
                  maxAgeSeconds: 30 * (24 * 60 * 60), // 缓存 30天
                },
                cacheableResponse: {
                  statuses: [200],
                },
              },
            },
          ],
        },
      }),
      /**
       * 自动全局引入指定 API
       * https://github.com/unplugin/unplugin-auto-import
       */
      AutoImport({
        resolvers: [AntdResolver()],
        // 需要配置 tsconfig.json 中 includes: ['auto-imports.d.ts']
        imports: [
          'react',
          'react-router-dom',
          // {
          //   react: [
          //     // default imports
          //     ['default', 'React'], // import { default as axios } from 'axios',
          //   ],
          // },
        ],
      }),
      /**
       * 打包后开启资源大小分析页面
       */
      visualizer({ open: true }),
      /**
       * 兼容低版本浏览器
       * https://github.com/vitejs/vite/tree/main/packages/plugin-legacy
       */
      legacy({
        // 需要兼容的目标列表，可以设置多个
        targets: ['chrome 52', 'Android > 39', 'iOS >= 10.3', 'iOS >= 10.3'],
        // 面向 IE11 时需要此插件
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      }),
      /**
       * 开启 gzip 压缩
       * 服务端 nginx 还需要配置一下才能生效
       */
      // http {
      //    # 启用 Gzip 压缩功能
      //    gzip on;
      //    # Nginx 检查是否存在预压缩的 .gz 文件，如果有的话，就直接发送这些文件而不是压缩原文件
      //    gzip_static on;
      //    # 指定哪些 MIME 类型的响应会被压缩
      //    gzip_types text/plain text/html text/css application/javascript application/xml;
      //    # 小于 10240 字节的响应不会被压缩
      //    gzip_min_length 10240;
      // }
      viteCompression({
        verbose: true, // 是否在控制台中输出压缩结果
        disable: false,
        threshold: 10240, // 如果体积大于阈值，将被压缩，单位为b，体积过小时请不要压缩，以免适得其反
        algorithm: 'gzip', // 压缩算法，可选['gzip'，' brotliccompress '，'deflate '，'deflateRaw']
        ext: '.gz',
        // deleteOriginFile: true, // 源文件压缩后是否删除( 为了看压缩后的效果，先选择了 true )
      }),
      /**
       * 将 svg 作为组件使用
       * https://github.com/pd4d10/vite-plugin-svgr
       *
       * 使用: import SvgIcon from '../assets/svg-icons/demo.svg?react';
       * 注意: 路径结尾添加 ?react
       *      添加 ts 支持, 在 src/typings/svg.d.ts 中
       */
      svgr({
        svgrOptions: {
          plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
          svgoConfig: {
            floatPrecision: 2,
          },
          exportType: 'default',
          ref: true,
          svgo: false,
          titleProp: true,
        },
        esbuildOptions: {},
        include: '**/*.svg?react',
        exclude: '**/*.svg',
      }),
      /**
       * 图片压缩
       */
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
      /**
       * 开启 cdn
       */
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
      /** 定义路径别名 */
      alias: {
        '@': '/src',
      },
    },
    build: {
      // 压缩构建产物
      minify: 'terser',
      terserOptions: {
        compress: {
          /**
           * 移除生产环境的 debug 和 console
           */
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        external: ['workbox-window'], // Add workbox-window to external
        output: {
          /** 定义动态分块文件的命名格式 */
          chunkFileNames: 'js/[name]-[hash].js', //
          /** 定义包入口文件的命名格式 */
          entryFileNames: 'js/[name]-[hash].js', //
          /** 定义资源文件( 如字体、图片等 )的命名格式 */
          assetFileNames: '[ext]/[name]-[hash].[ext]',
          /** 自定义分包策略 */
          manualChunks(id) {
            // 将 node_modules 打成一个包, 好方便缓存
            // if (id.includes('node_modules')) {
            //   return 'vendor';
            // }
            // 对 d3 图表展示库 单独打包
            if (id.includes('d3')) {
              return 'd3';
            }
          },
        },
      },
      // 移除生产环境的 sourcemap
      sourcemap: false,
    },
    optimizeDeps: {
      // 自定义预构建的入口文件
      entries: ['@/main.tsx'],
      // 让 vite启动的时候预编译一些包, 而不是运行网页的时候才编译
      // 这样可以加快网页首次的加载速度, 但是可能vite首次启动会比较慢点
      include: [],
      // 依赖预构建( esbuild ), vite 会将预构建存放在 node_modules/.vite 中
      exclude: [''],
      // 强制依赖预构建，而忽略之前已经缓存过的、已经优化过的依赖
      force: true,
    },
    css: {
      postcss: {
        // 添加浏览器兼容前缀
        plugins: [
          autoprefixer(),
          /**
           * https://github.com/cuth/postcss-pxtorem
           * 使用的官方配置的默认值
           */
          postCssPxToRem({
            // 表示根元素字体大小
            rootValue: 16,
            // 允许REM单位增长到的十进制数字, 小数点后保留的位数
            unitPrecision: 5,
            // 表示哪些属性的值, 可以从 px 变为 rem
            propList: ['*'], // 所有 属性值 都转 px
            // 要忽略并保留为 px 的选择器
            selectorBlackList: [''],
            // 替换包含 rems 的规则, 而不是添加后备
            replace: true,
            //( 布尔值 )允许在媒体查询中转换px
            mediaQuery: false,
            // 设置要替换的最小像素值
            minPixelValue: 1,
            // 默认false，可以( reg )利用正则表达式排除某些文件夹的方法，例如 /(node_modules)/i
            // 如果想把前端UI框架内的 px 也转换成 rem, 请把此属性设为默认值
            exclude: /node_modules/i,
          }),
        ],
      },
      preprocessorOptions: {
        scss: {
          // 加入全局变量( 不要单独引入该文件样式，否则在最中产物中会重复出现 )
          // 引入多个文件以；分割
          additionalData: "@use '@/styles/index.scss' as *;",
          javascriptEnabled: true,
        },
      },
      // css 文件打包命名规则
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
