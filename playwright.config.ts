import { defineConfig, devices } from "@playwright/test";

const STORYBOOK_URL = "http://localhost:6006";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: STORYBOOK_URL,
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm storybook",
    url: STORYBOOK_URL,
    timeout: 60 * 1000,
    reuseExistingServer: !process.env.CI,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
