/**
 * Babel 配置文件(最佳实践)
 * --------------------------------------------------------
 * 🎯 目标:
 *   - 统一构建与测试的转译行为(Vite + Jest)
 *   - 支持 React 17/18 + TypeScript
 *   - 启用 class、decorator、runtime 优化
 * --------------------------------------------------------
 */

module.exports = {
  /**
   * 📦 Presets 预设
   * ----------------------------------------------------
   * Babel 将从上到下依次应用这些预设;
   */
  presets: [
    [
      '@babel/preset-env',
      {
        // ✅ 针对 Node 环境(主要供 Jest 使用)
        targets: { node: 'current' },
        // Jest 运行时仍基于 CommonJS 模块体系
        modules: 'commonjs',
      },
    ],
    [
      '@babel/preset-react',
      {
        // ✅ React 17+ 自动运行时(无需 import React)
        runtime: 'automatic',
        // 在开发环境启用额外的警告/调试信息
        development: process.env.NODE_ENV === 'development',
      },
    ],
    // ✅ 仅移除 TypeScript 类型声明(不做类型检查)
    '@babel/preset-typescript',
  ],

  /**
   * 🧩 Plugins 插件
   * ----------------------------------------------------
   * 用于支持实验性语法、类属性、装饰器等特性;
   */
  plugins: [
    // ✅ 支持装饰器语法(MobX / InversifyJS 常用)
    ['@babel/plugin-proposal-decorators', { legacy: true }],

    // ✅ 减少 helper 冗余代码(强烈推荐)
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: true, // 不注入 polyfill(由 Vite/浏览器负责)
        helpers: true,
        regenerator: true,
        version: '^7.0.0',
      },
    ],
  ],

  /**
   * 🧠 环境隔离
   * ----------------------------------------------------
   * 可根据 NODE_ENV 进一步定制行为;
   * 例如在生产环境关闭开发调试插件;
   */
  env: {
    test: {
      plugins: [
        // 测试环境下保持相同配置以确保一致性
        ['@babel/plugin-transform-runtime', { corejs: false }],
      ],
    },
  },
};
