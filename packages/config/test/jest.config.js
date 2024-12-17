/** @type {import('jest').Config} */
const config = {
  verbose: true,
  clearMocks: true,
  testRegex: ".*\\.test\\.(js|ts|tsx)?$",
  setupFilesAfterEnv: ["./jest-setup.ts"],
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
};

module.exports = config;
