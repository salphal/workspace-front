export default {
  roots: ['<rootDir>/src'],

  // 测试环境
  testEnvironment: 'jsdom',

  // 测试文件匹配模式
  testMatch: ['**/__test__/**/*.(test|spec).(ts|tsx|js|jsx)', '**/*.(test|spec).(ts|tsx|js|jsx)'],

  // 需要忽略的文件
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],

  // 模块文件扩展名
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // 模块名映射（处理路径别名和静态资源）
  moduleNameMapper: {
    // 处理路径别名 @src/*
    '^@src/(.*)$': '<rootDir>/src/$1',
    // 处理 CSS/SCSS 模块
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // 处理图片和字体等静态资源
    '\\.(jpg|jpeg|png|gif|svg|webp|ico|bmp|woff|woff2|ttf|eot)$': 'jest-transform-stub',
  },

  // 转换配置
  transform: {
    '^.+\\.(ts|tsx|js|jsx|mjs)$': [
      'babel-jest',
      {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: { node: 'current' },
              modules: 'commonjs',
            },
          ],
          [
            '@babel/preset-react',
            {
              runtime: 'automatic',
            },
          ],
          '@babel/preset-typescript',
        ],
      },
    ],
  },

  // 转换忽略模式（需要转换 ESM 模块）
  // pnpm 的路径格式：node_modules/.pnpm/package@version/node_modules/package/
  transformIgnorePatterns: [
    'node_modules/(?!(.pnpm/)?([^/]+/)*lodash-es|(.pnpm/)?([^/]+/)*@ant-design|(.pnpm/)?([^/]+/)*ahooks)',
  ],

  // 设置文件（测试前执行的脚本）
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  // 收集覆盖率
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx,js,jsx}',
    '!src/**/__test__/**',
    '!src/**/__mock__/**',
    '!src/**/index.{ts,tsx,js,jsx}',
  ],

  // 覆盖率阈值（可选）
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },

  // 覆盖率报告目录
  coverageDirectory: 'coverage',

  // 覆盖率报告格式
  coverageReporters: ['text', 'lcov', 'html'],
};

