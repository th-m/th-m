import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { PublishedArticle } from "../src/content/blog-content";
import { ArticleMarkdown } from "../src/writing/ArticleMarkdown";

const article: PublishedArticle = {
  slug: "public-title",
  title: "Public title",
  description: "A concise public description.",
  publishedAt: "2026-08-16",
  tags: ["Ontology"],
  articlePath: "posts/public-title/article.md",
  assetsPath: "posts/public-title/assets",
  markdown: [
    "# Public title",
    "",
    "Body with an [external source](https://example.com/source).",
    "",
    "![A diagram](assets/diagram.svg?theme=dark#detail)",
    "",
    "| Term | Meaning |",
    "| --- | --- |",
    "| Node | A concept |",
    "",
  ].join("\n"),
};

describe("ArticleMarkdown", () => {
  it("renders public Markdown without duplicating the page H1", () => {
    render(<ArticleMarkdown article={article} />);

    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "A diagram" })).toHaveAttribute(
      "src",
      "/_content/posts/public-title/assets/diagram.svg?theme=dark#detail",
    );
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "external source" })).toHaveAttribute("rel", "noreferrer");
  });
});
