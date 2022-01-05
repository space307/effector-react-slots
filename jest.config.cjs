module.exports = {
  modulePathIgnorePatterns: ['<rootDir>/src/__tests__/stub.tsx'],
  transform: {
    '\\.tsx?$': '@sucrase/jest-plugin',
  },
};
