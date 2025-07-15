module.exports = {
  testEnvironment: 'node',
  testTimeout: 10000,
  verbose: true,
  collectCoverage: true,
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/fixtures/'
  ],
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  setupFilesAfterEnv: ['./tests/setup.js']
};
