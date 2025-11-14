/**
 * 🎨 Stylelint 宽容版配置（React + TS + Vite + Tailwind + SCSS）
 * -------------------------------------------------------------------
 * ✅ 允许所有 SCSS 函数、mixin、if 写法
 * ✅ 不再提示 map-get / mix / append 等函数错误
 * ✅ 不再强制 kebab-case 命名
 * ✅ 不再限制 @if != null
 */

module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-clean-order',
    'stylelint-config-tailwindcss',
  ],
  plugins: ['stylelint-scss', 'stylelint-order'],

  rules: {
    /* ✅ SCSS/Tailwind 兼容 */
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'use',
          'forward',
          'function',
          'if',
          'else',
          'mixin',
          'include',
          'return',
          'tailwind',
          'apply',
          'layer',
          'responsive',
          'variants',
          'screen',
        ],
      },
    ],

    /* 🚫 关闭所有 Sass 限制性规则 */
    'scss/no-global-function-names': null, // ✅ 允许 map-get, mix, nth 等
    'scss/at-function-pattern': null, // ✅ 函数命名随意
    'scss/at-mixin-pattern': null, // ✅ mixin 命名随意
    'scss/at-if-no-null': null, // ✅ 允许 @if $x != null
    'scss/comment-no-empty': null, // ✅ 允许空注释
    'scss/dollar-variable-pattern': null, // ✅ 变量命名不强制 kebab-case

    /* 🚫 关闭不必要的基础检查 */
    'function-no-unknown': null,
    'no-descending-specificity': null,
    'no-invalid-position-at-import-rule': null,
    'declaration-empty-line-before': null,
    'keyframes-name-pattern': null,
    'selector-class-pattern': null,
    'selector-id-pattern': null,
    'custom-property-pattern': null,
    'block-no-empty': null, // ✅ 允许空块（有时在预留结构中很常见）

    /* ✨ 基础格式 */
    'number-max-precision': 8,
    'alpha-value-notation': 'number',
    'color-function-notation': 'legacy',

    /* 🧱 属性排序（由 clean-order 控制） */
    'order/properties-order': null,
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
  },

  /* 💬 针对 SCSS 文件 */
  overrides: [
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
      rules: {
        'function-no-unknown': null,
      },
    },
  ],

  /* 🚫 忽略非样式文件 */
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.json', '**/*.md'],

  cache: true,
};
