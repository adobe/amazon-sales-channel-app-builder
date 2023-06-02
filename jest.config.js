const config = {
  roots: ['<rootDir>/test/actions', '<rootDir>/e2e'],
  clearMocks: true,
  collectCoverage: true,
  coverageReporters: ['text', 'lcov'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  projects: ['<rootDir>'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(js|ts)$': ['ts-jest', { tsconfig: './test/actions/tsconfig.json' }],
  },
  testPathIgnorePatterns: ['/components/', '/node_modules/'],
  moduleDirectories: ['<rootDir>', 'node_modules'],
};

module.exports = config;
