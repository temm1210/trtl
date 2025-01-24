/** @type {import('jest').Config} */
const config = {
  projects: [
    {
      testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
      displayName: "react",
      testMatch: ["<rootDir>/packages/react/**/*.test.(js|ts|tsx)"],
      testEnvironment: "jsdom",
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/packages/react/src/$1",
      },
      transform: {
        "^.+\\.(t|j)sx?$": [
          "@swc/jest",
          {
            jsc: {
              transform: {
                react: {
                  runtime: "automatic",
                },
              },
            },
          },
        ],
      },
    },
  ],
  clearMocks: true,
  verbose: true,
  clearMocks: true,
  setupFilesAfterEnv: ["./setupTest.ts"],
  //   silent: true,
};

module.exports = config;
