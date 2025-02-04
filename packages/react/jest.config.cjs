const base = require("../../jest.config");

/** @type {import('jest').Config} */
const config = {
  ...base,
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  testMatch: ["<rootDir>/src/**/*.test.(js|ts|tsx)"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "@swc/jest",
      {
        jsc: {
          target: "es2021",
          transform: {
            react: {
              runtime: "automatic",
            },
          },
        },
      },
    ],
  },
  //   silent: true,
};

module.exports = config;
