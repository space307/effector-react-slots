/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  transform: {
    '^.+\\.tsx?$': '@swc/jest',
  },
  testEnvironment: 'jsdom',
  modulePathIgnorePatterns: ['<rootDir>/src/__tests__/stub.tsx'],
};
