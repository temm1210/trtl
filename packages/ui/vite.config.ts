import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig, mergeConfig } from "vitest/config";

import configShared from "../../vite.shared";

export default mergeConfig(
  configShared,
  defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src/"),
      },
    },
  }),
);
