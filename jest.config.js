const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig");

module.exports = {
  preset: "ts-jest",
  // Use jsdom for React component tests
  testEnvironment: "jsdom",
  // Match typical test file patterns for ts/tsx/js/jsx
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)", "**/__tests__/**/*.test.ts?(x)"],
  // ignore e2e or integration test folders during unit test runs
  testPathIgnorePatterns: ["/tests/e2e/"],
  setupFiles: ["<rootDir>/jest.env.polyfills.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.jest.json'
    }
  },
  moduleNameMapper: {
    // map TS path aliases
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/" }),
    // CSS modules and style files -> mock
    "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.js",
    // static assets -> mock
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
    "^next/server$": "<rootDir>/__mocks__/next-server-mock.js",
  },
};
