export default {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    () => "tsc --project . --noEmit",
    "jest --bail --findRelatedTests --passWithNoTests",
    "prettier --write",
  ],
};
