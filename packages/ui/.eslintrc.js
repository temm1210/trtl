/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@rtl/eslint-config/base.js", "plugin:storybook/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
