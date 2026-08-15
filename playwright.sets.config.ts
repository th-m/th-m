import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/sets-e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:5191",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "sets-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1600, height: 1000 } },
    },
    {
      name: "sets-mobile",
      use: { browserName: "chromium", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    },
  ],
  webServer: {
    command: "bunx vite --config vite.sets.config.ts --host 127.0.0.1 --port 5191 --strictPort",
    url: "http://127.0.0.1:5191/sets.html",
    reuseExistingServer: !process.env.CI,
    timeout: 45_000,
  },
});
