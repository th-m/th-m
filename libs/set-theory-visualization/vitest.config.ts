import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    environmentOptions: {
      jsdom: { url: "https://th-m.test/" },
    },
    setupFiles: "@th-m/testing/vitest-setup",
    css: true,
    include: ["tests/**/*.test.{ts,tsx}"],
  },
});
