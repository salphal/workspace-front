/**
 * 🧩 ESLint 配置文件（React + TypeScript + Vite 最佳实践）
 * ------------------------------------------------------------
 * 🎯 目标：
 *  - 保持代码风格一致（结合 Prettier）
 *  - 支持 React + TS + Hooks + JSX
 *  - 自动清理无用 import
 *  - 兼容 Vite + Jest 环境
 * ------------------------------------------------------------
 */

module.exports = {
  /**
   * 📍 指定 ESLint 根目录
   * 防止被上层目录的配置污染
   */
  root: true,

  /**
   * 🌍 环境变量
   * browser: 支持浏览器全局变量（如 window）
   * es2021: 启用现代 ECMAScript 语法
   * node: 方便识别 Node 环境文件（如 config、scripts）
   */
  env: {
    browser: true,
    es2021: true,
    node: true,
  },

  /**
   * 🧠 解析器
   * 告诉 ESLint 如何解析 TypeScript 语法
   */
  parser: '@typescript-eslint/parser',

  /**
   * 🧩 扩展规则集
   * 按顺序合并多个社区推荐规范
   */
  extends: [
    'eslint:recommended', // ESLint 官方推荐规则
    'plugin:react/recommended', // React 专用规范
    'plugin:react-hooks/recommended', // React Hooks 规范（强烈推荐）
    'plugin:@typescript-eslint/recommended', // TypeScript 官方推荐规则
    'plugin:prettier/recommended', // 集成 Prettier，关闭 ESLint 与 Prettier 冲突的规则
  ],

  /**
   * ⚙️ 解析选项
   * 让 ESLint 理解现代语法特性
   */
  parserOptions: {
    ecmaVersion: 2022, // 支持最新 ECMAScript
    sourceType: 'module', // 允许使用 import/export
    ecmaFeatures: {
      jsx: true, // 支持 JSX
    },
  },

  /**
   * 🔌 插件
   * 可单独启用自定义规则
   */
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier', 'unused-imports'],

  /**
   * 🎯 自定义规则
   * 根据团队偏好灵活调整
   */
  rules: {
    /* ---------- ✨ 代码风格 ---------- */
    quotes: ['error', 'single'], // 使用单引号
    semi: ['error', 'always'], // 强制分号
    'prettier/prettier': ['error'], // 与 Prettier 保持一致

    /* ---------- 🧠 TypeScript ---------- */
    '@typescript-eslint/no-explicit-any': 'off', // 允许使用 any（可根据需要改为 warn）
    '@typescript-eslint/no-unused-vars': 'off', // 关闭原规则，交由 unused-imports 处理

    /* ---------- 🧹 未使用代码清理 ---------- */
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error', // 删除未使用的 import
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_', // 允许以下划线开头的变量不被警告
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],

    /* ---------- ⚛️ React ---------- */
    'react/react-in-jsx-scope': 'off', // React 17+ 不需要显式 import React
    'react/jsx-uses-react': 'off',
    'react/prop-types': 'off', // 使用 TypeScript，不需要 PropTypes
    'react-hooks/rules-of-hooks': 'error', // Hooks 必须符合调用规范
    'react-hooks/exhaustive-deps': 'warn', // 检查依赖数组

    /* ---------- 🧩 其他 ---------- */
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
  },

  /**
   * 🧪 特定文件覆盖规则
   * 可以关闭某些对配置文件/脚本文件不必要的限制
   */
  overrides: [
    {
      files: ['src/setupPolyfills.ts', 'vite.config.*', 'jest.config.*'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'prettier/prettier': 'off',
      },
    },
  ],

  /**
   * 🧩 React 版本自动检测
   * 防止 “React version not specified” 警告
   */
  settings: {
    react: {
      version: 'detect',
    },
  },
};
