import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

function publishedPages() {
  const manifestPath = resolve(dirname(fileURLToPath(import.meta.url)), "public/_content/manifest.json");
  let slugs: string[] = [];
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
      schemaVersion?: number;
      posts?: Array<{ slug?: string }>;
    };
    if (manifest.schemaVersion !== 2 || !Array.isArray(manifest.posts)) {
      throw new Error("Expected blog manifest schema version 2.");
    }
    slugs = manifest.posts.map((post) => {
      if (typeof post.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) {
        throw new Error(`Invalid published article slug: ${String(post.slug)}`);
      }
      return post.slug;
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }

  return [
    { path: "/", prerender: { enabled: true, outputPath: "/index.html" } },
    { path: "/brand", prerender: { enabled: true, outputPath: "/brand/index.html" } },
    { path: "/design-system", prerender: { enabled: true, outputPath: "/design-system/index.html" } },
    { path: "/embedding-space", prerender: { enabled: true, outputPath: "/embedding-space/index.html" } },
    { path: "/llm-visualization", prerender: { enabled: true, outputPath: "/llm-visualization/index.html" } },
    { path: "/laws", prerender: { enabled: true, outputPath: "/laws/index.html" } },
    { path: "/login", prerender: { enabled: true, outputPath: "/login/index.html" } },
    { path: "/relationship-graph", prerender: { enabled: true, outputPath: "/relationship-graph/index.html" } },
    { path: "/writing", prerender: { enabled: true, outputPath: "/writing/index.html" } },
    ...slugs.map((slug) => ({
      path: `/writing/${slug}`,
      prerender: { enabled: true, outputPath: `/writing/${slug}/index.html` },
    })),
  ];
}

export default defineConfig(({ mode }) => ({
  resolve: { tsconfigPaths: true },
  plugins: mode === "test" ? [tailwindcss(), react()] : [
    tailwindcss(),
    tanstackStart({
      spa: {
        enabled: true,
        maskPath: "/spa-shell",
        prerender: {
          outputPath: "/_shell.html",
          crawlLinks: false,
          retryCount: 2,
        },
      },
      prerender: {
        enabled: true,
        autoSubfolderIndex: true,
        autoStaticPathsDiscovery: false,
        crawlLinks: false,
        retryCount: 2,
        retryDelay: 250,
        // Low concurrency keeps the local preview-server fetches from racing
        // (transient failures would silently drop a page, since this
        // tanstack-start version's prerender retry is a no-op).
        concurrency: 1,
        failOnError: true,
      },
      pages: publishedPages(),
    }),
    react(),
  ],
  build: {
    target: "es2022",
    sourcemap: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "@th-m/testing/vitest-setup",
    css: true,
    include: ["tests/**/*.test.{ts,tsx}"],
  },
}));
