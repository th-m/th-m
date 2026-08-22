import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

  it("wraps every output link in a link preview that reveals the destination", async () => {
    render(<ArticleMarkdown article={article} />);
    const link = screen.getByRole("link", { name: "external source" });
    expect(link).toHaveAttribute("href", "https://example.com/source");
    fireEvent.pointerEnter(link);
    await waitFor(() => {
      expect(screen.getByText("example.com")).toBeInTheDocument();
      expect(screen.getByText("/source")).toBeInTheDocument();
    });
  });

  it("renders registered inline figures at their markers and ignores unregistered ones", () => {
    const marked: PublishedArticle = {
      ...article,
      markdown: [
        "# Public title",
        "",
        "Before the figure.",
        "",
        "<!-- neural-net-lab -->",
        "",
        "After the figure.",
        "",
        "<!-- unregistered-marker -->",
        "",
        "Tail text.",
      ].join("\n"),
    };
    render(
      <ArticleMarkdown
        article={marked}
        inlineFigures={{ "neural-net-lab": () => <div data-testid="figure-slot">animated lab</div> }}
      />,
    );

    expect(screen.getByTestId("figure-slot")).toHaveTextContent("animated lab");
    expect(screen.getByText("Before the figure.")).toBeInTheDocument();
    expect(screen.getByText("After the figure.")).toBeInTheDocument();
    expect(screen.getByText("Tail text.")).toBeInTheDocument();
    expect(screen.getAllByRole("figure")).toHaveLength(1);
    expect(screen.getAllByRole("figure")[0]).toHaveAttribute("data-figure", "neural-net-lab");
  });
});
