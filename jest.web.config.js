const config = {
  roots: ['<rootDir>/test/web-src/src'],
  clearMocks: true,
  collectCoverage: true,
  coverageReporters: ['text', 'lcov'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  projects: ['<rootDir>'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', { tsconfig: './test/web-src/tsconfig.json' }],
  },
  testPathIgnorePatterns: ['/node_modules/'],
  moduleDirectories: ['<rootDir>', 'node_modules'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  testEnvironment: 'jsdom',
};

module.exports = config;
