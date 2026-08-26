import { readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const articlesRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../articles");

const articleWorkspaces = (await readdir(articlesRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
  .map((entry) => entry.name)
  .sort((left, right) => left.localeCompare(right, "en"));

const publishedArticles = (
  await Promise.all(articleWorkspaces.map(async (slug) => {
    try {
      const article = await readFile(resolve(articlesRoot, slug, "article.md"), "utf8");
      let page: string | undefined;
      try {
        page = await readFile(resolve(articlesRoot, slug, "index.tsx"), "utf8");
      } catch {
        // Articles without a dedicated page use the Markdown renderer.
      }
      return { slug, article, page };
    } catch {
      return undefined;
    }
  }))
).filter((article): article is { slug: string; article: string; page: string | undefined } => Boolean(article));
const dedicatedPages = publishedArticles.filter(
  (article): article is { slug: string; article: string; page: string } => typeof article.page === "string",
);

function externalMarkdownLinks(markdown: string): string[] {
  return [...markdown.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((match) => match[1]).sort();
}

function externalPageLinks(page: string): string[] {
  return [...page.matchAll(/(?:href|url)="(https?:\/\/[^\"]+)"/g)].map((match) => match[1]).sort();
}

describe("published article sources", () => {
  it.each(publishedArticles)("keeps Sources as the final section in $slug/article.md", ({ slug, article }) => {
    const headings = [...article.matchAll(/^##[\t ]+([^\r\n]+?)[\t ]*$/gm)];
    const sources = headings.filter((heading) => heading[1] === "Sources");

    expect(sources, `${slug}/article.md must contain exactly one Sources section`).toHaveLength(1);
    expect(headings.at(-1)?.[1], `${slug}/article.md must end with its Sources section`).toBe("Sources");
    expect(article).not.toMatch(/^## References$/m);
    expect(externalMarkdownLinks(article.slice(sources[0].index)), `${slug}/article.md Sources must not be empty`).not.toHaveLength(0);
  });

  it.each(dedicatedPages)(
    "keeps Sources at the bottom of the $slug React page and aligned with its article",
    ({ slug, article, page }) => {
      const sectionTitles = [...page.matchAll(/<Section\b[^>]*\btitle="([^"]+)"/g)];
      const sourceTitles = sectionTitles.filter((section) => section[1] === "Sources");

      expect(sourceTitles, `${slug}/index.tsx must render exactly one Sources section`).toHaveLength(1);
      expect(sectionTitles.at(-1)?.[1], `${slug}/index.tsx Sources must be the final article section`).toBe("Sources");
      expect(page).not.toContain('title="References"');

      const sourceStart = sourceTitles[0].index;
      const sourceEnd = page.indexOf("</Section>", sourceStart);
      expect(sourceEnd, `${slug}/index.tsx Sources section must close`).toBeGreaterThan(sourceStart);

      const sourcePage = page.slice(sourceStart, sourceEnd);
      const trailingPage = page.slice(sourceEnd + "</Section>".length);
      expect(trailingPage, `${slug}/index.tsx must not render content after Sources`).not.toMatch(/<[A-Za-z][A-Za-z0-9.]*(?:\s|>)/);

      const markdownSourceStart = article.match(/^## Sources[\t ]*$/m)?.index;
      expect(markdownSourceStart, `${slug}/article.md must contain Sources`).toBeTypeOf("number");
      const markdownSources = article.slice(markdownSourceStart);
      expect(externalPageLinks(sourcePage), `${slug} React sources must match article.md`).toEqual(
        externalMarkdownLinks(markdownSources),
      );
    },
  );
});
