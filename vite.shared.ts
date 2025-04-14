import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: path.resolve(__dirname, "setupTest.ts"),
    coverage: {
      provider: "v8",
      all: false,
      clean: true,
    },
  },
});
