import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import { setAtlasAnalyzerPlugin } from "./src/sets/vitePlugin.ts";

export default defineConfig({
  plugins: [react(), setAtlasAnalyzerPlugin()],
  build: {
    target: "es2022",
    sourcemap: true,
    outDir: "dist-sets",
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(import.meta.dirname, "sets.html"),
    },
  },
});
