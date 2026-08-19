import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";
import { setAtlasAnalyzerPlugin } from "./src/vitePlugin.ts";

export default defineConfig({
  plugins: [tailwindcss(), react(), setAtlasAnalyzerPlugin({ root: resolve(import.meta.dirname, "../..") })],
  test: {
    environment: "jsdom",
    setupFiles: "@th-m/testing/vitest-setup",
    css: true,
    include: ["tests/unit/**/*.test.{ts,tsx}"],
  },
});
