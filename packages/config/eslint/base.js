const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  plugins: ["unused-imports"],
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "prettier",
    "turbo",
    "plugin:react-hooks/recommended-legacy",
  ],
  globals: {
    React: true,
    JSX: true,
    vi: true,
  },
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  rules: {
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "error",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        groups: [
          "builtin",
          "external",
          "internal",
          ["sibling", "parent"],
          "unknown",
        ],
        pathGroups: [
          { pattern: "react", group: "builtin", position: "after" },
          { pattern: "react-dom", group: "builtin", position: "after" },
          {
            pattern: "**/*.css",
            group: "unknown",
            position: "after",
          },
        ],
        pathGroupsExcludedImportTypes: [],
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
    "dist/",
  ],
  overrides: [
    {
      files: ["*.js?(x)", "*.ts?(x)"],
    },
  ],
};
