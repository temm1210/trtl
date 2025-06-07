import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig, mergeConfig } from "vitest/config";

import configShared from "../../../vite.shared";

export default mergeConfig(
  configShared,
  defineConfig({
    test: {
      include: ["src/**/*.test.{ts,tsx}"],
      exclude: ["e2e", "e2e/**/*", "**/*.spec.ts", "**/*.e2e.ts"],
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  }),
);
