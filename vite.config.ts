import { resolve } from 'node:path';
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
    plugins: [react(), /**
     * code-inspector-plugin + locatorJs( chrome plugin )
     * 开发时通过点击快速跳转到源码
     */
      codeInspectorPlugin({ bundler: 'vite' }), /**
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
                  maxEntries: 30, // 最多缓存30个, 超过的按照LRU原则删除
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
                  // maxEntries: 30, // 最多缓存30个, 超过的按照LRU原则删除
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
                  // maxEntries: 30, // 最多缓存30个, 超过的按照LRU原则删除
                  maxAgeSeconds: 30 * (24 * 60 * 60), // 缓存 30天
                },
                cacheableResponse: {
                  statuses: [200],
                },
              },
            },
          ],
        },
      }), /**
       * 自动全局引入指定 API
       * https://github.com/unplugin/unplugin-auto-import
       */
      AutoImport({
        resolvers: [AntdResolver()],
        // 需要配置 tsconfig.json 中 includes: ['auto-imports.d.ts']
        imports: [
          {
            react: [
              // 默认导出
              ['default', 'React'],
              // 基础 Hooks
              'useState',
              'useEffect',
              'useLayoutEffect',
              'useMemo',
              'useCallback',
              'useRef',
              'useContext',
              'useReducer',
              'useTransition',
              'useDeferredValue',
              'useId',
              'useSyncExternalStore',
              'useDebugValue',
              'useImperativeHandle',
              // 组件辅助
              'memo',
              'forwardRef',
              'lazy',
              'Suspense',
              'startTransition',
              'Fragment',
              'StrictMode',
              // Children API
              ['Children', 'ReactChildren'],
              // Component API
              'cloneElement',
              'createElement',
              'isValidElement',
              'createFactory',
              'createRef',
              // Context
              'createContext',
              // Profiler
              'Profiler',
            ],
            // ReactDOM 自动导入
            'react-dom': [
              'createPortal',
              'findDOMNode',
              'flushSync',
            ],
            // ReactDOM Client
            'react-dom/client': [
              'createRoot',
              'hydrateRoot',
            ],
          },
          // 路由
          'react-router-dom',
        ],
      }), /**
       * 打包后开启资源大小分析页面
       */
      visualizer({ open: true }), /**
       * 兼容低版本浏览器
       * https://github.com/vitejs/vite/tree/main/packages/plugin-legacy
       */
      legacy({
        // 需要兼容的目标列表, 可以设置多个
        targets: ['chrome 52', 'Android > 39', 'iOS >= 10.3', 'iOS >= 10.3'],
        // 面向 IE11 时需要此插件
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      }), /**
       * 需要配置在以下配置之一
       *  - 主模块 http
       *  - 各个服务 server
       *
       *  * 检查主模块 mime.types 中是否包含指定的压缩类型
       *
       * # 开启gzip功能
       * gzip on;
       * # 启用gzip压缩的最小文件, 小于设置值的文件将不会压缩
       * gzip_min_length 100k;
       * # 开启gzip静态压缩功能
       * gzip_static on;
       * # 设置压缩所需要的缓冲区大小
       * gzip_buffers 4 16k;
       * # gzip http版本
       * gzip_http_version 1.1;
       * # gzip 压缩级别 1-10( 值越大压缩效果越好, 同时消耗服务器性能越大 )
       * gzip_comp_level 7;
       * # gzip 压缩类型
       * gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
       * # 是否在http header 中添加 Vary: Accept-Encoding, ** 一定要开启, 不开启读取不到 .gz 结尾的压缩文件 **
       * gzip_vary on;
       *
       * 验证是否生效
       *  响应头: content-encoding: gzip
       */
      /**
       * 根据算法打包指定 压缩文件
       * https://github.com/vbenjs/vite-plugin-compression
       *
       ** 需要开启 nginx gzip 配置
       */
      /**
       * nginx brotli( 仅生效于 https ), 因为 http 请求中 request-header 里的 Accept-Encoding 没有 br
       *  - 需要单独安装
       *  - 需要打包 demo.js => demo.js.br 文件
       *  - 可以和 gzip 同时生效
       *
       * https://github.com/google/ngx_brotli
       *
       * brotli on;              # 启用
       * brotli_comp_level 6;    # 压缩等级, 默认6, 最高11, 太高的压缩水平可能需要更多的CPU
       * brotli_buffers 16 8k;   # 请求缓冲区的数量和大小
       * brotli_min_length 20;   # 指定压缩数据的最小长度, 只有大于或等于最小长度才会对其压缩。这里指定20字节
       * brotli_types text/plain application/javascript application/x-javascript text/javascript text/css application/xml text/html application/json image/svg application/font-woff application/vnd.ms-fontobject application/vnd.apple.mpegurl image/x-icon image/jpeg image/gif image/png image/bmp;   #指定允许进行压缩类型
       * brotli_static always;   # 是否允许查找预处理好的、以.br结尾的压缩文件, 可选值为on、off、always
       * brotli_window 512k;     # 窗口值, 默认值为512k
       */
      viteCompression({
        verbose: true, // 是否在控制台中输出压缩结果
        disable: false, // 是否禁用
        threshold: 10240, // 体积大于 threshold 则进行压缩, 单位为 b( 1m = 1024b ), 体积过小时请不要压缩, 以免适得其反
        /** gzip */
        // algorithm: 'gzip', // 压缩算法: 可选['gzip', ' brotliCompress ', 'deflate ', 'deflateRaw']
        // ext: '.gz', // 生成的压缩包后缀
        /** brotli */
        algorithm: 'brotliCompress', // 压缩算法: 可选['gzip', ' brotliccompress ', 'deflate ', 'deflateRaw']
        ext: '.br', // 生成的压缩包后缀
        /**
         * nginx 中不要删除原文件( 否则无法匹配压缩的文件 demo.js => demo.js.gz )
         */
        deleteOriginFile: false, // 源文件压缩后是否删除( false: 服务器会自动优先返回同名的 .gzip 资源, 如果找不到还可以拿原始文件 )
      }), /**
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
      }), /**
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
      }), /**
       * 开启 cdn
       */
      viteCDNPlugin({
        // 需要 CDN 加速的模块
        modules: [
          {
            name: 'lodash',
            var: '_',
            path: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js',
          },
        ],
      }),
    ],
    resolve: {
      /** 定义路径别名 */
      alias: {
        '@src': resolve(__dirname, 'src'),
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
        format: {
          /**
           * 移除注释
           */
          comments: false,
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
          manualChunks(id: string) {
            // 将 node_modules 打成一个包, 好方便缓存
            // if (id.includes('node_modules')) {
            //   return 'vendor';
            // }
            // 对 d3 图表展示库 单独打包
            if (id.includes('d3')) {
              return 'd3';
            }
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
        },
      },
      // 移除生产环境的 sourcemap
      sourcemap: false,
    },
    optimizeDeps: {
      // 自定义预构建的入口文件
      entries: ['@src/main.tsx'],
      // 让 vite启动的时候预编译一些包, 而不是运行网页的时候才编译
      // 这样可以加快网页首次的加载速度, 但是可能vite首次启动会比较慢点
      include: [],
      // 依赖预构建( esbuild ), vite 会将预构建存放在 node_modules/.vite 中
      exclude: [''],
      // 强制依赖预构建, 而忽略之前已经缓存过的、已经优化过的依赖
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
           *
           * postcss-pxtorem 把 px 转换成 rem 时，都会以 html 的 font-size 作为基准
           * body 上的 font-size 仅仅是文字样式，不会影响 rem
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
            // 默认false, 可以( reg )利用正则表达式排除某些文件夹的方法, 例如 /(node_modules)/i
            // 如果想把前端UI框架内的 px 也转换成 rem, 请把此属性设为默认值
            exclude: /node_modules/i,
          }),
        ],
      },
      preprocessorOptions: {
        scss: {
          // 加入全局变量( 不要单独引入该文件样式, 否则在最中产物中会重复出现 )
          // 引入多个文件以；分割
          additionalData: '@use \'@src/styles/index.scss\' as *;',
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
