import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { PublishedArticle } from "../src/content/blog-content";
import { ArticleContent } from "../src/writing/ArticleContent";
import { ToolDrawerProvider } from "../src/tools/ToolDrawerProvider";

// The dispatch test verifies page selection, not ELK layout: mock the dynamic
// graph figure so jsdom never constructs a web worker (see the graph library's
// own figure tests for worker-level coverage). Other pages import seed data
// from the same package, so keep the real module and override only the figure.
vi.mock("@th-m/graph-visualization", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@th-m/graph-visualization")>();
  return {
    ...actual,
    PropositionGraphFigure: () => <div data-testid="proposition-graph-figure" />,
  };
});

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
    render(
      <ToolDrawerProvider>
        <ArticleContent article={article("goals-solutions-and-value")} />
      </ToolDrawerProvider>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Public title" })).toBeInTheDocument();
    // The React page renders the full essay instead of the markdown fallback.
    expect(screen.getByRole("heading", { name: "The Priorities Hidden Inside the Prompt" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Training through cross-entropy" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "A bad guess, then training" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Goals Create Problem Spaces" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Authority, Accountability, and Corrigibility" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sources" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Attention Is All You Need/ })).toHaveAttribute(
      "href",
      "https://proceedings.neurips.cc/paper_files/paper/2017/hash/3f5ee243547dee91fbd053c1c4a845aa-Abstract.html",
    );
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
