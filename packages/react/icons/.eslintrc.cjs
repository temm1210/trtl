/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  globals: {
    vi: true,
  },
  extends: ["@rtl/eslint-config/base", "plugin:storybook/recommended"],
};
