import { readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const articlesRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../articles");
const articleWorkspaces = (await readdir(articlesRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
  .map((entry) => entry.name)
  .sort((left, right) => left.localeCompare(right, "en"));

const publishedArticles = (await Promise.all(articleWorkspaces.map(async (slug) => {
  try {
    return { slug, article: await readFile(resolve(articlesRoot, slug, "article.mdx"), "utf8") };
  } catch {
    return undefined;
  }
}))).filter((article): article is { slug: string; article: string } => Boolean(article));

const consolidationAnchors: Record<string, string[]> = {
  "ai-consciousness-is-incoherent": [
    "Under one membership rule, living neural organization is decisive.",
    "The second expression is a hypothesis, not an empirical counterpart to the first.",
  ],
  "building-an-llm": [
    "Possible next token",
    "Runtime context and decoding determine which learned patterns are activated",
  ],
  "consciousness-is-incoherent": [
    "The problem is not solved by choosing a more confident definition.",
    "Before attributing phenomenal consciousness to an artificial system, require four things:",
  ],
  "goals-solutions-and-value": [
    "Model, inference, and runtime",
    "Once the root goal is supplied, it becomes valuable to explore opportunities",
  ],
  "the-cognitive-factory": [
    "Work produces outcomes → outcomes produce evidence → evidence updates context and evaluation",
  ],
  "the-knowledge-factory": [
    "Customer experience → evidence → interpretation → priority → design → implementation",
    "An implicit factory keeps queues hidden and decisions gated",
  ],
  "the-ontology-factory": [
    "The factory's ontology is not a description of what its repository happens to look like.",
  ],
  "truth-entropy-and-inference": [
    "Two theological parallels help situate these non-propositional practices",
    "The interactive semantic-composition explorer follows here",
  ],
  "understanding-is-the-bottleneck": [
    "Inference Produces an Answer; Understanding Maintains a Model",
  ],
};

interface ArticleSection {
  title: string;
  index: number;
}

function articleSections(article: string): ArticleSection[] {
  const headings = [...article.matchAll(/^##[\t ]+([^\r\n]+?)[\t ]*$/gm)]
    .map((match) => ({ title: match[1], index: match.index }));
  const components = [...article.matchAll(/<Section\b[^>]*\btitle="([^"]+)"[^>]*>/g)]
    .map((match) => ({ title: match[1], index: match.index }));
  return [...headings, ...components].sort((left, right) => left.index - right.index);
}

function externalLinks(source: string): string[] {
  return [
    ...[...source.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((match) => match[1]),
    ...[...source.matchAll(/(?:href|url)="(https?:\/\/[^"]+)"/g)].map((match) => match[1]),
  ].sort();
}

describe("published article sources", () => {
  it.each(publishedArticles)("keeps Sources as the final section in $slug/article.mdx", ({ slug, article }) => {
    const sections = articleSections(article);
    const sources = sections.filter((section) => section.title === "Sources");

    expect(sources, `${slug}/article.mdx must contain exactly one Sources section`).toHaveLength(1);
    expect(sections.at(-1)?.title, `${slug}/article.mdx must end with its Sources section`).toBe("Sources");
    expect(article).not.toMatch(/^## References$/m);
    expect(article).not.toContain('title="References"');
    expect(externalLinks(article.slice(sources[0].index)), `${slug}/article.mdx Sources must not be empty`).not.toHaveLength(0);
  });

  it.each(publishedArticles)("retains reviewed authored prose in $slug/article.mdx", ({ slug, article }) => {
    const normalizedArticle = article.replace(/\s+/g, " ");
    const anchors = consolidationAnchors[slug];
    expect(anchors, `${slug} must have reviewed consolidation anchors`).toBeDefined();
    for (const anchor of anchors) {
      expect(normalizedArticle, `${slug}/article.mdx must retain: ${anchor}`).toContain(anchor);
    }
  });
});
