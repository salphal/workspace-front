/**
 * 🎨 Stylelint 配置文件（最佳实践 for React + TypeScript + Vite + Tailwind + SCSS）
 * -----------------------------------------------------------------------------
 * 目标：
 *   ✅ 统一 CSS/SCSS/Tailwind 风格与规范
 *   ✅ 避免样式冲突与不规范命名
 *   ✅ 与 Prettier、Vite、PostCSS 保持一致风格
 *   ✅ 提升团队代码可读性与一致性
 *
 * 相关文档：
 *   - https://stylelint.io/
 *   - https://github.com/stylelint-scss/stylelint-scss
 *   - https://github.com/csstools/stylelint-config-standard
 *   - https://github.com/stylelint/stylelint-config-recommended
 *   - https://tailwindcss.com/docs
 * -----------------------------------------------------------------------------
 */

module.exports = {
  /**
   * 📦 继承推荐规则集
   * ------------------------------------------------------------
   * 规则说明：
   *   - stylelint-config-standard: 基础 CSS 规则
   *   - stylelint-config-standard-scss: 支持 SCSS 扩展语法
   *   - stylelint-prettier/recommended: 保证与 Prettier 风格统一
   *   - stylelint-config-rational-order: 合理排序 CSS 属性
   */
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-prettier/recommended',
    'stylelint-config-rational-order',
  ],

  /**
   * 🧩 自定义规则
   * ------------------------------------------------------------
   * 通过覆盖/调整规则来满足项目定制化需求。
   */
  rules: {
    /**
     * ✅ 允许 Tailwind 的特殊指令
     *   @tailwind / @apply / @layer / @responsive 等
     * 否则会被误判为未知 at-rule。
     */
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind', // Tailwind 原子指令
          'layer', // 层级定义
          'apply', // 原子类复用
          'variants', // 兼容旧版本 Tailwind 的写法
          'responsive', // 响应式控制
          'screen', // 自定义屏幕断点
        ],
      },
    ],

    /**
     * ✅ 函数名强制小写
     * 例如：`rgba()` ✅, `RGBA()` ❌
     */
    'function-name-case': ['lower'],

    /**
     * ✅ 忽略部分 SCSS 内置函数或自定义函数
     * 否则 stylelint 会误报 unknown function。
     */
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: [
          // 常见 SCSS 内置函数
          'fade',
          'fadeout',
          'tint',
          'darken',
          'ceil',
          'fadein',
          'floor',
          'unit',
          'shade',
          'lighten',
          'percentage',
          '-', // 减法操作符
        ],
      },
    ],

    /**
     * 🚫 关闭部分对现代前端不友好的规则
     * ------------------------------------------------------------
     * 某些规则在使用 Vite + PostCSS + Tailwind + SCSS 时会误报。
     */
    'import-notation': null, // 允许多种 import 语法
    'no-descending-specificity': null, // 忽略层叠选择器优先级警告
    'no-invalid-position-at-import-rule': null, // 允许 import 出现在部分嵌套中
    'declaration-empty-line-before': null, // 不强制声明前空行
    'keyframes-name-pattern': null, // 动画名可自由命名
    'custom-property-pattern': null, // CSS 变量命名不强制
    'selector-class-pattern': null, // 类名模式不强制（兼容 Tailwind）
    'selector-id-pattern': null, // ID 选择器命名不强制
    'selector-not-notation': null, // 不限制 :not() 写法

    /**
     * ✨ 精度与格式优化
     */
    'number-max-precision': 8, // 小数最大 8 位
    'alpha-value-notation': 'number', // 使用数值透明度（例如 rgba(0,0,0,0.5)）
    'color-function-notation': 'legacy', // 兼容旧版色彩函数写法（避免警告）
  },

  /**
   * 🚫 忽略特定文件
   * ------------------------------------------------------------
   * 不检查 JS / TS 文件中内联样式。
   */
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],

  /**
   * 🧠 可选：启用缓存提升性能（适合大型项目）
   */
  cache: true,
};
