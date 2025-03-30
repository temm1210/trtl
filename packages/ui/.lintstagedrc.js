export default {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    () => "tsc --project . --noEmit",
    "prettier --write",
  ],
};
