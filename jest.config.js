const path = require("path");

/** @type {import('jest').Config} */
const config = {
  rootDir: ".",
  clearMocks: true,
  verbose: true,
  clearMocks: true,
  setupFilesAfterEnv: [path.resolve(__dirname, "setupTest.ts")],
};

module.exports = config;
