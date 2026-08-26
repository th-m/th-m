import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const articlesRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../articles");

const series = [
  "goals-solutions-and-value",
  "truth-entropy-and-inference",
  "understanding-is-the-bottleneck",
  "the-knowledge-factory",
  "the-ontology-factory",
  "the-cognitive-factory",
] as const;

const dedicatedPages = series.filter((slug) => slug !== "the-ontology-factory");

describe("AI Factory series sources", () => {
  it.each(series)("publishes a Sources section in %s/article.md", async (slug) => {
    const article = await readFile(resolve(articlesRoot, slug, "article.md"), "utf8");

    expect(article).toMatch(/^## Sources$/m);
    expect(article).not.toMatch(/^## References$/m);
  });

  it.each(dedicatedPages)("renders a Sources section in the %s page", async (slug) => {
    const page = await readFile(resolve(articlesRoot, slug, "index.tsx"), "utf8");

    expect(page).toContain('title="Sources"');
    expect(page).not.toContain('title="References"');
  });
});
