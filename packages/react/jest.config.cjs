const baseConfig = require("@rtl/test-config/jest-config");

/** @type {import('jest').Config} */
const config = {
  ...baseConfig,
  setupFilesAfterEnv: ["<rootDir>/setupTest.ts"],
  testEnvironment: "jsdom",
  //   silent: true,
};

module.exports = config;
