import { render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import type { PublishedArticle } from "../src/content/blog-content";
import { ArticleContent } from "../src/writing/ArticleContent";
import { ToolDrawerProvider } from "../src/tools/ToolDrawerProvider";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  const { forwardRef } = await import("react");
  const Link = forwardRef<
    HTMLAnchorElement,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
      children: ReactNode;
      params?: Record<string, string>;
      to: string;
    }
  >(function TestLink({ children, params, to, ...props }, ref) {
    const href = params?.slug ? to.replace("$slug", params.slug) : to;
    return <a {...props} href={href} ref={ref}>{children}</a>;
  });
  return { ...actual, Link };
});

// The article renderer test verifies MDX selection, not ELK layout: mock the dynamic
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

function article(slug: string): PublishedArticle {
  return {
    slug,
    title: "Public title",
    description: "A concise public description.",
    publishedAt: "2026-08-16",
    tags: ["Ontology"],
    articlePath: `posts/${slug}/article.mdx`,
    assetRegistryPath: `posts/${slug}/assets.json`,
    assetsPath: `posts/${slug}/assets`,
  };
}

const dedicatedPageSlugs = [
  "ai-consciousness-is-incoherent",
  "building-an-llm",
  "consciousness-is-incoherent",
  "vision-and-values",
  "the-cognitive-factory",
  "the-knowledge-factory",
  "the-ontology-factory",
  "truth-and-inference",
  "understanding-and-bottlenecks",
] as const;

describe("ArticleContent MDX rendering", () => {
  it("renders the two Vision and Values motif graphs in context", () => {
    render(
      <ToolDrawerProvider>
        <ArticleContent article={article("vision-and-values")} />
      </ToolDrawerProvider>,
    );

    const prioritiesGraph = screen.getByRole("img", {
      name: /Fluent output is not value insight/,
    });
    const experienceGraph = screen.getByRole("img", {
      name: /Personal meaning is not yet shared value/,
    });

    expect(prioritiesGraph).toBeInTheDocument();
    expect(experienceGraph).toBeInTheDocument();
    expect(prioritiesGraph.compareDocumentPosition(experienceGraph) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("renders the canonical MDX article selected by slug", () => {
    render(
      <ToolDrawerProvider>
        <ArticleContent article={article("vision-and-values")} />
      </ToolDrawerProvider>,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Public title" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "A Plan Is Not a Strategy" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Fluency Can Feel Like Understanding" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What Language Carries—and What It Leaves Out" })).toBeInTheDocument();
    expect(screen.getByText(/complete coverage of recorded facts/)).toBeInTheDocument();
    expect(screen.getByText(/Alicia is pronounced/)).toHaveTextContent("ah-LEE-sha");
    expect(screen.getByRole("heading", { name: "Vision Gives Direction. Authority Makes It Governing." })).toBeInTheDocument();
    expect(screen.getByText(/Once the root goal is supplied/)).toBeInTheDocument();
    expect(screen.getByText(/The ladder answers increasingly powerful causal questions/)).toBeInTheDocument();
    expect(screen.getByRole("img", {
      name: "A governing goal branches to three opportunities, four solutions, and three experiments",
    })).toBeInTheDocument();
    expect(screen.getByRole("img", {
      name: "Two governing goals direct a strategy, which coordinates three subgoals while institutional authority constrains it and stakeholder goals influence it",
    })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "A System Can Be Coherent and Still Be Wrong" })).toBeInTheDocument();
    expect(screen.getByText(/false evaluative closure/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Shared Intent Lets Teams Think for Themselves" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Retain Authority Over the Ends" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "AI Factory" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sources" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /The Economic Case for Generative AI/ })).not.toHaveLength(0);
  });

  it("renders the Vision and Values editorial hierarchy with shared MDX components", () => {
    render(
      <ToolDrawerProvider>
        <ArticleContent article={article("vision-and-values")} />
      </ToolDrawerProvider>,
    );

    expect(screen.getByText("Make this plan optimal. Find all the gaps. Add the necessary validation.").closest("blockquote"))
      .toBeInTheDocument();
    expect(screen.getByText("Core thesis").closest(".article-claim"))
      .toHaveClass("article-claim--emphasis");
    expect(screen.getByText("Barnum effect")).toHaveClass("thom-tooltip-trigger");
    expect(screen.getByText("Four requirements").closest(".article-claim")).toBeInTheDocument();
    expect(screen.getByText("False evaluative closure", { exact: true }).closest(".article-claim"))
      .toBeInTheDocument();
    expect(screen.getByText("Responsibility").closest(".article-claim"))
      .toHaveClass("article-claim--emphasis");
  });

  it.each(dedicatedPageSlugs)("renders Sources as the final section of %s", (slug) => {
    render(
      <ToolDrawerProvider>
        <ArticleContent article={article(slug)} />
      </ToolDrawerProvider>,
    );

    const sourcesHeading = screen.getByRole("heading", { level: 2, name: "Sources" });
    const sourcesSection = sourcesHeading.closest("section");
    if (sourcesSection) expect(sourcesSection.nextElementSibling).toBeNull();
    expect(screen.getAllByRole("heading", { level: 2 }).at(-1)).toBe(sourcesHeading);
  });
});
