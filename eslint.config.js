/**
 * 🧩 ESLint 9.x 扁平化配置文件（React + TypeScript + Vite 最佳实践）
 * ------------------------------------------------------------
 * 🎯 目标：
 *  - 保持代码风格一致（结合 Prettier）
 *  - 支持 React + TS + Hooks + JSX
 *  - 自动清理无用 import
 *  - 兼容 Vite + Jest 环境
 * ------------------------------------------------------------
 */

import js from '@eslint/js';
import globals from 'globals';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierPlugin from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // 基础配置
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      /* ---------- ✨ 代码风格 ---------- */
      quotes: ['error', 'single'],
      semi: ['error', 'always'],

      /* ---------- 🧹 未使用代码清理 ---------- */
      'no-unused-vars': 'off',
    },
  },

  // TypeScript 配置
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      'unused-imports': unusedImportsPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,

      /* ---------- 🧠 TypeScript ---------- */
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',

      /* ---------- 🧹 未使用代码清理 ---------- */
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '.*',
          args: 'after-used',
          argsIgnorePattern: '.*',
        },
      ],
    },
  },

  // React 配置
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,

      /* ---------- ⚛️ React ---------- */
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Prettier 集成配置
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': ['error'],
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
    },
  },

  // 增强自动修复配置
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // 可自动修复的规则
      'no-extra-semi': 'error',
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'eol-last': 'error',
      'comma-dangle': ['error', 'always-multiline'],
      'comma-spacing': ['error', { before: false, after: true }],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'computed-property-spacing': ['error', 'never'],
      'space-in-parens': ['error', 'never'],
      'space-before-blocks': 'error',
      'keyword-spacing': 'error',
      'space-infix-ops': 'error',
      'space-unary-ops': 'error',
      'no-multi-spaces': 'error',
      'no-whitespace-before-property': 'error',
      'func-call-spacing': ['error', 'never'],
      'block-spacing': 'error',
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
    },
  },

  // 特定文件覆盖规则
  {
    files: ['src/setupPolyfills.ts', 'vite.config.*', 'jest.config.*'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'prettier/prettier': 'off',
    },
  },

  // 忽略文件配置
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      'coverage/',
      'public/tailwind.css',
      '*.min.js',
    ],
  },
];
