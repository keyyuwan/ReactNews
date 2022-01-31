module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  // arquivos que o jest executa antes de executar os testes
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(scss|css|sass)$': 'identity-obj-proxy',
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.tsx', '!src/**/*.test.tsx'],
  coverageReporters: ['lcov', 'json'],
}
