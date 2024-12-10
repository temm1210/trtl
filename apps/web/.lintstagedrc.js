/**
 * This file is required when use "next lint" with lint-staged
 * @see https://nextjs.org/docs/pages/api-reference/config/eslint#running-lint-on-staged-files
 */
const path = require("path");

// use __dirname instead of path.cwd() because lint-staged run on root directory in this project
const buildEslintCommand = (filenames) => {
  console.log("filenames:", filenames);
  return `next lint --fix --file ${filenames
    .map((f) => path.relative(__dirname, f))
    .join(" --file ")}`;
};
module.exports = {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand],
};
