/** @type {import('jest').Config} */
const config = {
  projects: [
    {
      testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
      displayName: "react",
      testMatch: ["<rootDir>/packages/react/**/*.test.(js|ts|tsx)"],
      transform: {
        "^.+\\.(t|j)sx?$": ["@swc/jest"],
      },
      extensionsToTreatAsEsm: [".ts", ".tsx"],
    },
  ],
  clearMocks: true,
  verbose: true,
  clearMocks: true,
  setupFilesAfterEnv: ["./setupTest.ts"],
  testEnvironment: "jsdom",
  //   silent: true,
};

module.exports = config;
