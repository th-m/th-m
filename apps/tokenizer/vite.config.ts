import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    target: "es2022",
    sourcemap: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: "@th-m/testing/vitest-setup",
    css: true,
    include: ["tests/**/*.test.{ts,tsx}"],
  },
});
