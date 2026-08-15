import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  worker: { format: "es" },
  build: {
    target: "es2022",
    sourcemap: true,
    outDir: "dist-graph",
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(import.meta.dirname, "graph.html"),
    },
  },
});
