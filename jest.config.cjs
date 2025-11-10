/**
 * Jest 配置文件(适用于 Vite + React + TypeScript 项目)
 * @type {import('jest').Config}
 */
const esmModules = ['lodash-es', '@ant-design', 'ahooks', 'msw', 'until-async'];

module.exports = {
  // 📂 测试根目录
  roots: ['<rootDir>/src'],

  // 🌐 测试环境( React/Vite 前端项目推荐使用 jsdom )
  testEnvironment: 'jest-environment-jsdom',

  // 🧩 测试文件匹配规则
  testMatch: ['**/__test__/**/*.(test|spec).(ts|tsx|js|jsx)', '**/*.(test|spec).(ts|tsx|js|jsx)'],

  // 🚫 忽略路径
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],

  // 📦 模块扩展名
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // 📁 模块路径映射( 支持 alias )
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',

    // 样式文件 mock
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

    // 静态资源 mock
    '\\.(jpg|jpeg|png|gif|svg|webp|ico|bmp|woff|woff2|ttf|eot)$': 'jest-transform-stub',
  },

  // 🔄 文件转换配置( Babel 转译 )
  transform: {
    '^.+\\.(ts|tsx|js|jsx|mjs)$': 'babel-jest',
    '\\.scss$': 'jest-transform-css',
  },

  // 🚫 默认忽略 node_modules,但允许某些 ESM 包被转译
  transformIgnorePatterns: [`node_modules/(?!(.pnpm/)?([^/]+/)*(${esmModules.join('|')}))`],

  // ⚙️ 前置与后置环境设置
  setupFiles: ['<rootDir>/src/jest.setup.polyfills.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'],

  // 🧮 覆盖率收集范围
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx,js,jsx}',
    '!src/**/__test__/**',
    '!src/**/__mock__/**',
    '!src/**/index.{ts,tsx,js,jsx}',
  ],

  // 🧹 每次测试自动清理 mock
  clearMocks: true,

  // 🗣 输出详细测试报告
  verbose: true,

  // ✅ 启用覆盖率统计
  collectCoverage: true,

  // 🧾 覆盖率阈值( CI 环境下可自动放宽 )
  coverageThreshold: process.env.CI
    ? { global: { branches: 0, functions: 0, lines: 0, statements: 0 } }
    : {
        global: {
          branches: 50,
          functions: 60,
          lines: 70,
          statements: 70,
        },
      },

  // 📊 覆盖率输出目录与格式
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  // 🔍 Watch 模式增强( 文件名 & 测试名模糊搜索 )
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],

  // ⚡️ 缓存优化
  cacheDirectory: '<rootDir>/node_modules/.jest',
  maxWorkers: '50%',
};
