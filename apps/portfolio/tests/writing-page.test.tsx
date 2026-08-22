import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { PublishedArticle } from "../src/content/blog-content";
import { ArticleContent } from "../src/writing/ArticleContent";

const markdown = [
  "# Public title",
  "",
  "Body with an [external source](https://example.com/source).",
  "",
].join("\n");

function article(slug: string): PublishedArticle {
  return {
    slug,
    title: "Public title",
    description: "A concise public description.",
    publishedAt: "2026-08-16",
    tags: ["Ontology"],
    articlePath: `posts/${slug}/article.md`,
    assetsPath: `posts/${slug}/assets`,
    markdown,
  };
}

describe("ArticleContent dispatch", () => {
  it("renders the dedicated React page when the slug has a generated page", () => {
    render(<ArticleContent article={article("solutions-meaning-and-value")} />);
    expect(screen.getByRole("heading", { level: 1, name: "Public title" })).toBeInTheDocument();
    // The React page renders the essay outline instead of the markdown fallback.
    expect(screen.getByRole("heading", { name: "Goals and Strategies" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Agents and Their Principles" })).toBeInTheDocument();
    expect(screen.queryByText(/external source/i)).not.toBeInTheDocument();
  });

  it("falls back to the essay header and Markdown body for slugs without a page", () => {
    render(<ArticleContent article={article("public-title")} />);
    expect(screen.getByText("Essay")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Public title" })).toBeInTheDocument();
    expect(screen.getByText("A concise public description.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "external source" })).toHaveAttribute("rel", "noreferrer");
  });
});
