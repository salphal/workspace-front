/**
 * 🎨 宽容 SCSS + Tailwind，但保留属性排序
 */
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-tailwindcss',
  ],

  plugins: ['stylelint-scss', 'stylelint-order'],

  rules: {
    /* ========== SCSS 兼容性 ========== */
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': null,
    'scss/no-global-function-names': null,
    'scss/at-mixin-pattern': null,
    'scss/at-function-pattern': null,
    'scss/at-if-no-null': null,
    'scss/operator-no-newline-before': null,
    'scss/operator-no-newline-after': null,
    'scss/comment-no-empty': null,
    'function-no-unknown': null, // 支持 tailwind & scss 函数

    /* ========== 命名规则放宽 ========== */
    'selector-class-pattern': null,
    'selector-id-pattern': null,
    'custom-property-pattern': null,
    'keyframes-name-pattern': null,
    'scss/dollar-variable-pattern': '^(_)?[a-z0-9-]+$',

    /* ========== 文件结构宽容 ========== */
    'block-no-empty': null,
    'no-empty-source': null,

    /* ========== 保留属性排序 ========== */
    'order/order': null, // 不强制整体结构排序（如 custom-properties 之类）
    'order/properties-order': [
      [
        // ⭐ 完整的属性排序。你可以随时让我调整为你们团队习惯的版本
        // Positioning
        'position',
        'top',
        'right',
        'bottom',
        'left',
        'z-index',

        // Display & Box Model
        'display',
        'flex',
        'flex-direction',
        'flex-grow',
        'flex-shrink',
        'flex-basis',
        'flex-wrap',
        'justify-content',
        'align-items',
        'align-content',
        'order',
        'float',
        'clear',
        'box-sizing',
        'width',
        'height',
        'min-width',
        'min-height',
        'max-width',
        'max-height',
        'padding',
        'padding-top',
        'padding-right',
        'padding-bottom',
        'padding-left',
        'margin',
        'margin-top',
        'margin-right',
        'margin-bottom',
        'margin-left',

        // Typography
        'font',
        'font-family',
        'font-size',
        'font-weight',
        'line-height',
        'text-align',
        'text-transform',
        'text-decoration',
        'white-space',
        'color',

        // Background
        'background',
        'background-color',
        'background-image',
        'background-repeat',
        'background-position',
        'background-size',

        // Border
        'border',
        'border-radius',

        // Effects
        'opacity',
        'box-shadow',
        'transition',

        // Others
        'cursor',
      ],
      { unspecified: 'bottomAlphabetical' },
    ],

    /* ========== 基础风格 ========== */
    'number-max-precision': 8,
    'alpha-value-notation': 'number',
    'color-function-notation': 'legacy',
  },

  overrides: [
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
      rules: {
        'function-no-unknown': null,
      },
    },
  ],

  ignoreFiles: ['**/*.{js,jsx,ts,tsx,json,md}'],

  cache: true,
};
