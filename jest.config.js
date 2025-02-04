const path = require("path");

/** @type {import('jest').Config} */
const config = {
  rootDir: ".",
  clearMocks: true,
  verbose: true,
  clearMocks: true,
  testMatch: ["**/*.test.(js|ts|tsx)"],
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
  setupFilesAfterEnv: [path.resolve(__dirname, "setupTest.ts")],
};

module.exports = config;
