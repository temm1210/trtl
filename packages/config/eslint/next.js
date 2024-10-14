/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "@rtl/eslint-config/base.js",
    require.resolve("@vercel/style-guide/eslint/next"),
  ],
};
