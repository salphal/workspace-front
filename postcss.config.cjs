/**
 * 🧩 PostCSS 配置文件(React + Vite + TypeScript + Tailwind 最佳实践)
 * ---------------------------------------------------------------------
 * 🎯 目标:
 *  - 统一 CSS 构建管线
 *  - 支持 TailwindCSS + 嵌套语法
 *  - 自动处理浏览器前缀
 *  - 提升开发体验与兼容性
 * ---------------------------------------------------------------------
 */

module.exports = {
  plugins: {
    /**
     * 📦 postcss-import
     * ----------------------------------------------------
     * 允许在 CSS 中使用 @import 引入其他文件;
     * (例如:在 index.css 中导入 base/reset 文件)
     */
    'postcss-import': {},

    /**
     * 🧬 TailwindCSS 嵌套支持
     * ----------------------------------------------------
     * 使用官方推荐的 "tailwindcss/nesting" 语法,
     * 内部基于 postcss-nesting(W3C 标准方案);
     * ✅ 推荐:语义更符合 CSS 规范,未来无需替换;
     */
    'tailwindcss/nesting': 'postcss-nesting',

    /**
     * 🎨 TailwindCSS 主插件
     * ----------------------------------------------------
     * 加载 tailwind.config.ts 中定义的设计系统(颜色、spacing、variants...)
     * 必须放在 nesting 之后,autoprefixer 之前;
     */
    tailwindcss: {},

    /**
     * 🚀 Autoprefixer
     * ----------------------------------------------------
     * 自动为 CSS 添加浏览器前缀(如 -webkit-、-moz-);
     * 数据来源于 browserslist(package.json 中定义);
     * 推荐与 Vite 内置兼容机制配合使用;
     */
    autoprefixer: {},
  },
};
