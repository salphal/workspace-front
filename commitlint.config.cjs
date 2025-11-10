/**
 * 🧩 Commitlint 配置文件（最佳实践 for React + TypeScript + Vite）
 * ------------------------------------------------------------
 * 作用：
 *   ✅ 规范化 Git 提交信息（Commit Message）
 *   ✅ 与 Conventional Commits / Semantic Release / Husky 集成
 *   ✅ 提高团队协作一致性、自动生成 Changelog
 *
 * 官方文档：
 *   https://github.com/conventional-changelog/commitlint
 * ------------------------------------------------------------
 */

module.exports = {
  /**
   * 继承官方规范集
   * @commitlint/config-conventional 遵循 Angular 提交规范。
   */
  extends: ['@commitlint/config-conventional'],

  /**
   * 自定义校验规则
   * 规则结构：[级别, 是否启用, 限定值]
   * 级别说明：
   *   0 = 关闭规则
   *   1 = 警告
   *   2 = 错误（不允许提交）
   */
  rules: {
    /**
     * 🔧 限制提交类型（type）可选项
     * 格式：<type>(<scope>): <subject>
     * 示例：feat(core): add new theme switcher
     */
    'type-enum': [
      2, // 启用 + 错误级别
      'always',
      [
        'build', // 构建系统或依赖变动（webpack、vite、npm）
        'ci', // CI/CD 配置变更
        'chore', // 其他杂项（无业务影响）
        'docs', // 文档更新
        'feat', // ✨ 新功能
        'fix', // 🐞 修复 bug
        'perf', // ⚡ 性能优化
        'refactor', // ♻️ 代码重构（非新功能、非修复）
        'style', // 💅 样式调整（不影响逻辑）
        'test', // ✅ 测试用例相关
        'revert', // ⏪ 回滚提交
      ],
    ],

    /**
     * 🔠 限制 type 的大小写
     * 设为 0 表示关闭校验（默认全部小写）。
     */
    'type-case': [0],

    /**
     * 📦 是否允许空的 type（一般不允许）
     */
    'type-empty': [2, 'never'],

    /**
     * 📁 是否允许空的 scope（模块范围）
     * 建议可选：不同团队习惯不同。
     */
    'scope-empty': [0],

    /**
     * 🧩 scope 大小写（默认关闭）
     */
    'scope-case': [0],

    /**
     * ✍️ subject（提交说明）结尾是否允许句号
     */
    'subject-full-stop': [0],

    /**
     * ✍️ subject 大小写（默认关闭，允许自由书写）
     */
    'subject-case': [0],

    /**
     * 🧾 限制 header 最长字符数（推荐 72）
     * 格式为：type(scope): subject → 总长度
     */
    'header-max-length': [2, 'always', 72],
  },
};
