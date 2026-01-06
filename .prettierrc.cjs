/**
 * 🎨 Prettier 配置文件(React + Vite + TypeScript 最佳实践)
 * ---------------------------------------------------------------------
 * 🎯 目标:
 *   - 保持团队代码风格一致
 *   - 结合 ESLint 9.x 与 import 排序插件自动化
 *   - 支持 TSX / JSX / Tailwind 项目
 * ---------------------------------------------------------------------
 */

module.exports = {
  /**
   * ✍️ 基础格式规范
   * -------------------------------------------------------------------
   */
  singleQuote: true, // 使用单引号代替双引号
  semi: true, // 每行语句末尾自动加分号
  jsxSingleQuote: false, // JSX 中仍使用双引号(更符合习惯)
  trailingComma: 'all', // 多行对象/数组的最后一项也加逗号
  printWidth: 100, // 一行最大字符数(超过则自动换行)
  tabWidth: 2, // 缩进宽度(2 空格是社区共识)
  arrowParens: 'always', // 箭头函数参数总是带括号
  proseWrap: 'never', // Markdown 文本不自动换行
  endOfLine: 'auto', // 自动识别系统换行符(跨平台友好)

  /**
   * 📦 import 排序(@ianvs/prettier-plugin-sort-imports)
   * -------------------------------------------------------------------
   * 自动根据分组和字母顺序对 import 语句排序
   * ✅ 避免人工调整顺序带来的 merge 冲突
   * ✅ 兼容 ESLint 9.x 的 import 规则
   */
  importOrder: [
    // 1️⃣ React 核心
    '^(react|react-dom)$',
    '', // 分隔符（空行）

    // 2️⃣ 状态管理 / 路由 / Hooks / 常用上下文库
    '^(@reduxjs|mobx|react-router.*|zustand|ahooks)',
    '', // 分隔符（空行）

    // 3️⃣ UI 组件库
    '^antd|^@mui|^chakra-ui|^element-plus|^@ant-design/pro-components|^@ant-design/icons',
    '', // 分隔符（空行）

    // 4️⃣ 工具 / 通用库
    '^axios|^lodash|^dayjs|^classnames|^uuid|^query-string|^copy-to-clipboard|^file-saver|^js-md5|^highlight.js',
    '', // 分隔符（空行）

    // 5️⃣ 第三方可视化 / 动画 / 数据处理库
    '^d3|^rc-motion',
    '', // 分隔符（空行）

    // 6️⃣ 本地 alias
    '^@/', // 你项目的 alias, 如 '@src', '@components'
    '', // 分隔符（空行）

    // 7️⃣ 相对路径
    '^[./]', // 相对路径文件，如 './', '../'
  ],

  /**
   * 🔌 插件配置
   * -------------------------------------------------------------------
   * @ianvs/prettier-plugin-sort-imports → 自动排序 import
   * 兼容 ESLint 9.x 的 unused-imports/no-unused-imports 规则
   */
  plugins: ['@ianvs/prettier-plugin-sort-imports'],

  /**
   * 🧠 文件特例配置
   * -------------------------------------------------------------------
   * 针对 .prettierrc 自身(JSON 格式)设置正确的解析器;
   * 针对 ESLint 9.x 配置文件使用正确的解析器
   */
  overrides: [
    {
      files: '.prettierrc',
      options: {
        parser: 'json',
      },
    },
    {
      files: 'eslint.config.js',
      options: {
        parser: 'javascript',
      },
    },
    {
      files: '*.{js,cjs,mjs}',
      options: {
        parser: 'babel',
      },
    },
  ],

  /**
   * 🎯 ESLint 9.x 兼容性优化
   * -------------------------------------------------------------------
   * 确保与 ESLint 9.x 的扁平化配置格式兼容
   * 避免与 ESLint 的 import 排序规则冲突
   */
  // 禁用与 ESLint 冲突的格式规则，由 ESLint 处理
  // 这些规则在 eslint-plugin-prettier 中会自动处理
};
