import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "publication",
          environment: "node",
          include: ["tests/**/*.test.{ts,tsx}"],
        },
      },
      {
        test: {
          name: "components",
          environment: "jsdom",
          setupFiles: "@th-m/testing/vitest-setup",
          css: true,
          include: ["components/**/*.test.{ts,tsx}"],
        },
      },
    ],
  },
});
