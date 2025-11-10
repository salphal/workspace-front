/**
 * 🎨 Stylelint 配置文件（for React + TypeScript + Vite + Tailwind + SCSS）
 * -----------------------------------------------------------------------------
 * 目标：
 *   ✅ 统一 CSS/SCSS/Tailwind 风格与规范
 *   ✅ 避免样式冲突与不规范命名
 *   ✅ 与 Prettier、Vite、PostCSS 保持一致风格
 *   ✅ 兼容 stylelint v16+ 与 Tailwind 3+
 *
 * 文档：
 *   - https://stylelint.io/
 *   - https://github.com/stylelint-scss/stylelint-scss
 *   - https://github.com/csstools/stylelint-config-standard
 *   - https://github.com/tailwindlabs/tailwindcss
 * -----------------------------------------------------------------------------
 */

module.exports = {
  /**
   * 📦 推荐规则集
   * ------------------------------------------------------------
   * 使用新版 rational-order 替代旧配置，
   * 并加入 stylelint-config-clean-order（现代化 CSS 属性排序插件）。
   */
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-clean-order',
    'stylelint-config-tailwindcss', // ✅ 官方 Tailwind 插件支持
  ],

  /**
   * 🔌 插件声明（确保规则可识别）
   */
  plugins: ['stylelint-scss', 'stylelint-order', 'stylelint-tailwindcss'],

  /**
   * 🧩 自定义规则
   */
  rules: {
    /**
     * ✅ 支持 Tailwind 的特殊 @ 指令
     */
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'layer',
          'responsive',
          'variants',
          'screen',
          'use',
          'forward',
          'function',
          'if',
          'else',
          'mixin',
          'include',
          'return',
        ],
      },
    ],

    /**
     * ✅ 函数名统一小写
     */
    'function-name-case': ['lower'],

    /**
     * ✅ 忽略部分自定义或内置 SCSS 函数
     */
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: [
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
          '-', // 允许 SCSS 中的计算函数
        ],
      },
    ],

    /**
     * 🚫 关闭部分不必要的约束
     */
    'import-notation': null,
    'no-descending-specificity': null,
    'no-invalid-position-at-import-rule': null,
    'declaration-empty-line-before': null,
    'keyframes-name-pattern': null,
    'custom-property-pattern': null,
    'selector-class-pattern': null,
    'selector-id-pattern': null,
    'selector-not-notation': null,

    /**
     * ✨ 数值与格式规范
     */
    'number-max-precision': 8,
    'alpha-value-notation': 'number',
    'color-function-notation': 'legacy',

    /**
     * 🧱 属性顺序（使用 clean-order 或 Tailwind 内置顺序）
     */
    'order/properties-order': null, // 由 stylelint-config-clean-order 自动处理
    'order/order': [
      [
        'custom-properties',
        'dollar-variables',
        'declarations',
        { type: 'at-rule', hasBlock: false },
        { type: 'at-rule', hasBlock: true },
        'rules',
      ],
      { unspecified: 'bottom' },
    ],

    /**
     * ✅ Tailwind 推荐规则
     */
    'tailwindcss/classnames-order': true,
    'tailwindcss/no-custom-classname': null, // 可选：关闭自定义类名限制
  },

  /**
   * 🚫 忽略文件类型
   */
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.json', '**/*.md'],

  /**
   * 🧠 性能优化
   */
  cache: true,
};
