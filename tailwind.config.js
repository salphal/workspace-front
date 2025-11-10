/* eslint-disable */
/**
 * Tailwind CSS 配置文件(最佳实践)
 * ---------------------------------------------------------------
 * 🧭 适用环境:
 *   - React + TypeScript
 *   - Vite 构建体系
 *   - PostCSS 自动处理(配合 postcss.config.js)
 *
 * 🎯 目标:
 *   - 统一设计体系(颜色、字体、间距等)
 *   - 提供灵活的主题扩展能力
 *   - 支持 light / dark / 自定义主题
 * ---------------------------------------------------------------
 */

import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  /**
   * 🧩 扫描源文件路径(用于 tree-shaking)
   * 仅在这些文件中存在的 class 才会被生成到最终 CSS;
   */
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],

  /**
   * 🎨 自定义主题配置
   * 通过 theme.extend 可安全扩展默认 Tailwind 变量;
   */
  theme: {
    /**
     * 📱 自定义媒体查询断点
     * 用法示例:`sm:bg-red-500`
     */
    screens: {
      xs: '480px', // 极小屏幕(小型手机)
      sm: '640px', // 手机
      md: '768px', // 平板
      lg: '1024px', // 桌面
      xl: '1280px', // 大桌面
      '2xl': '1536px', // 超大屏幕
      xxl: '1600px', // 更宽屏幕
    },

    /**
     * 🎨 自定义颜色体系
     * ⚠️ 建议与 SCSS / CSS 变量保持同步;
     */
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
      white: '#ffffff',
      black: '#000000',
    },

    /**
     * ✍️ 字体体系
     * 提供 sans / serif / mono 三类基础字体;
     */
    fontFamily: {
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
      serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      mono: ['Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
    },

    /**
     * 🔧 扩展 Tailwind 默认样式
     * 在这里添加新的 spacing、borderRadius 等;
     */
    extend: {
      spacing: {
        0.5: '2px',
        1.5: '6px',
        2.5: '10px',
        3.5: '14px',
        72: '18rem',
        80: '20rem',
        96: '24rem',
      },
      borderRadius: {
        none: '0px',
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
    },
  },

  /**
   * 🔌 自定义插件
   * 可扩展 Tailwind 功能,例如主题切换、组件封装等;
   */
  plugins: [
    /**
     * 🌗 自定义主题原子类(light / dark)
     * 用法:`theme-light:bg-white` 或 `theme-dark:text-gray-100`
     */
    plugin(function ({ addVariant, e }) {
      const themes = ['light', 'dark'];
      themes.forEach((name) => {
        addVariant(`theme-${name}`, ({ modifySelectors, separator }) => {
          modifySelectors(({ className }) => {
            return `.${`theme-${name}`} .${e(`theme-${name}${separator}${className}`)}`;
          });
        });
      });
    }),
  ],

  /**
   * ⚙️ 控制核心插件启用状态
   * 关闭 preflight 以避免与组件库(如 Ant Design)样式冲突;
   */
  corePlugins: {
    preflight: false,
  },
};
