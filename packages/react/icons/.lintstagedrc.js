export default {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    () => "tsc --project . --noEmit",
    "vitest related --bail=1 --run ",
    "prettier --write",
  ],
};
