const base = require("../../../jest.config");

/** @type {import('jest').Config} */
const config = {
  ...base,
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  //   silent: true,
};

module.exports = config;
