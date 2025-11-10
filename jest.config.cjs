module.exports = {
  roots: ['<rootDir>/src'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/__test__/**/*.(test|spec).(ts|tsx|js|jsx)', '**/*.(test|spec).(ts|tsx|js|jsx)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg|webp|ico|bmp|woff|woff2|ttf|eot)$': 'jest-transform-stub',
  },
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
    '\\.scss$': 'jest-transform-css', // Add this line to handle SCSS files
  },
  transformIgnorePatterns: [
    'node_modules/(?!(.pnpm/)?([^/]+/)*lodash-es|(.pnpm/)?([^/]+/)*@ant-design|(.pnpm/)?([^/]+/)*ahooks|(.pnpm/)?([^/]+/)*msw|(.pnpm/)?([^/]+/)*until-async)',
  ],
  setupFiles: ['<rootDir>/src/setupPolyfills.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx,js,jsx}',
    '!src/**/__test__/**',
    '!src/**/__mock__/**',
    '!src/**/index.{ts,tsx,js,jsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};
