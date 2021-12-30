/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  testEnvironment: 'jsdom',
  modulePathIgnorePatterns: ['<rootDir>/src/__tests__/stub.tsx'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
};
