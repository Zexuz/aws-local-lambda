module.exports = {
  collectCoverage: true,
  coverageDirectory: 'jest-coverage',
  collectCoverageFrom: ['src/*.ts', 'src/**/*.ts'],
  coveragePathIgnorePatterns: ['__testdata__/'],
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  setupFiles: ['<rootDir>/jest.env.js'],
  testTimeout: 30000
};
