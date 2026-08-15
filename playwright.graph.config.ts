import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/graph-e2e",
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  workers: 1,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:5190",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "graph-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1600, height: 1000 } },
    },
  ],
  webServer: {
    command: "bunx vite --host 127.0.0.1 --port 5190 --strictPort",
    url: "http://127.0.0.1:5190/graph.html",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
