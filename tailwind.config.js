/* eslint-disable */
/** @type {import('tailwindcss').Config} */

import plugin from 'tailwindcss/plugin';

export default {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    theme: {
      /**
       * 自定义 媒体查询原子类
       * 用法: sm:bg-white
       */
      screens: {
        // 默认的断点
        sm: '640px', // 小屏幕 (手机)
        // => @media (min-width: 640px) { ... }
        md: '768px', // 中屏幕 (平板)
        // => @media (min-width: 768px) { ... }
        lg: '1024px', // 大屏幕 (桌面)
        // => @media (min-width: 1024px) { ... }
        xl: '1280px', // 超大屏幕 (大桌面)
        // => @media (min-width: 1280px) { ... }
        '2xl': '1536px', // 更大的桌面
        // => @media (min-width: 1536px) { ... }

        // 自定义的断点
        xs: '480px', // 超小屏幕 (小型手机)
        xxl: '1600px', // 更大的屏幕
      } /**
       * 自定义 颜色原子类
       * 用法: [color]-[number]
       ** 注意 颜色原子类需要和全局 scss variables 中的定义保持一致
       */,
      colors: {
        blue: '#0d6efd',
        indigo: '#6610f2',
        purple: '#6f42c1',
        pink: '#d63384',
        red: '#dc3545',
        orange: '#fd7e14',
        yellow: '#ffc107',
        green: '#198754',
        teal: '#20c997',
        cyan: '#0dcaf0',
        gray: '#6c757d',
        'gray-dark': '#343a40',
        white: '#fff',
        black: '#000',
      } /**
       * 自定义 字体原子类
       * font-[key]
       */,
      fontFamily: {
        /**
         * 用法: font-sans
         * 包含无衬线字体，默认选择现代系统字体( 如 Inter 和 系统字体 )
         * 回退到通用的无衬线字体 sans-serif
         */
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        /**
         * 用法: font-serif
         * 包含有衬线字体，适合正式或传统样式
         * 回退到 serif
         */
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        /**
         * 用法: font-mono
         * 包含等宽字体，适用于代码或表格展示
         * 回退到 monospace
         */
        mono: ['Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      /**
       *
       */
      extend: {
        /**
         * 自定义 间距原子类
         * https://tailwindcss.com/docs/customizing-spacing
         * 用法 p-[key]
         */
        spacing: {
          0.5: '2px', // 小间距
          1.5: '6px', // 中小间距
          2.5: '10px', // 较小间距
          3.5: '14px', // 中间偏小的间距
          72: '18rem', // 大间距（如用于布局）
          80: '20rem', // 更大的间距
          96: '24rem', // 超大间距
        } /**
         * 自定义 圆角原子类
         * https://tailwindcss.com/docs/theme#core-plugins
         * 用法: rounded-[key]
         */,
        borderRadius: {
          none: '0px', // 无圆角
          sm: '0.125rem', // 小圆角
          DEFAULT: '0.25rem', // 默认圆角
          md: '0.375rem', // 中圆角
          lg: '0.5rem', // 大圆角
          xl: '0.75rem', // 超大圆角
          '2xl': '1rem', // 极大圆角
          full: '9999px', // 圆形
          '3xl': '1.5rem', // 超级大圆角
        },
      },
    },
    extend: {},
  },
  /**
   * 有样式冲突, 谨慎引入
   * https://tailwindcss.com/docs/plugins
   * example: https://tailwindcss.com/docs/adding-custom-styles#writing-plugins
   */
  plugins: [
    /**
     * 将原子类和theme结合
     * theme-light:bg-white
     */
    plugin(function ({ addVariant }) {
      const themeNameList = ['dark', 'light'].map((name) => `theme-${name}`);
      if (Array.isArray(themeNameList) && themeNameList.length) {
        themeNameList.forEach((themeName) => {
          addVariant(themeName, (definition) => {
            const { modifySelectors, separator } = definition;
            modifySelectors(
              ({ className }) => `.${themeName} .${e(`${themeName}${separator}${className}`)}`,
            );
          });
        });
      }
    }),
  ],
  /**
   * 控制 tailwind 生成哪些模块的预设样式
   * https://tailwind.org.cn/docs/configuration
   * @property {Array<string> | Object} corePlugins
   *  - include 数组( 用于启用模块 ): 仅启用包含在数组中的模块
   *  - exclude 对象( 用于排除模块 ): key 为模块, 值为 布尔, false 为关闭
   */
  // corePlugins: {},
  corePlugins: [],
};
