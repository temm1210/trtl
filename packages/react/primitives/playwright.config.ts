import { defineConfig, devices } from "@playwright/test";

const STORYBOOK_URL = "http://localhost:6006";

export default defineConfig({
  testDir: "./playwright/tests",
  snapshotPathTemplate:
    "{testDir}/{testFileDir}/__snapshots__/{arg}-{projectName}{ext}",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: `${STORYBOOK_URL}/iframe.html`,
    trace: "on-first-retry",
    viewport: { width: 1280, height: 720 },
  },
  webServer: {
    command: "pnpm run storybook",
    url: STORYBOOK_URL,
    timeout: 60 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
