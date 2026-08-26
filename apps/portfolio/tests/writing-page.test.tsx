import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

const dedicatedPageSlugs = [
  "consciousness-is-incoherent",
  "goals-solutions-and-value",
  "the-cognitive-factory",
  "the-knowledge-factory",
  "truth-entropy-and-inference",
  "understanding-is-the-bottleneck",
] as const;

describe("ArticleContent dispatch", () => {
  it("renders the dedicated React page when the slug has a generated page", async () => {
    const user = userEvent.setup();
    render(
      <ToolDrawerProvider>
        <ArticleContent article={article("goals-solutions-and-value")} />
      </ToolDrawerProvider>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Public title" })).toBeInTheDocument();
    // The React page renders the full essay instead of the markdown fallback.
    expect(screen.getByRole("heading", { name: "The Priorities Hidden Inside the Prompt" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What's Inside a Language Model" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "What a Language Model Carries" })).not.toBeInTheDocument();
    expect(screen.getByText(/Technically, an LLM is just a large file with a bunch of weights/)).toHaveTextContent(
      "Those weights represent a compressed statistical model of patterns in human language.",
    );
    expect(screen.getByText(/A model never "experiences" anything/)).toHaveTextContent(
      "The value of its predictive capabilities comes from the relationships between words.",
    );
    expect(screen.getByText(/Training changes the weights\. Inference uses them/)).toHaveTextContent(
      "the underlying process remains probabilistic prediction across learned patterns",
    );
    expect(screen.queryByText(/The model never encounters a cat/)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Tokens, Training and Information" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Input and tokens" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Training and inference" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What Language Leaves Out" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Two compressions" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "LLM Training" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "A model is not conscious" })).toHaveAttribute(
      "href",
      "/writing/consciousness-is-incoherent",
    );
    expect(screen.getByRole("heading", { name: "Goals Create Opportunity Spaces" })).toBeInTheDocument();
    expect(screen.getByText(/A goal is the precursor to opportunity/)).toHaveTextContent(
      "From there, we can distinguish two kinds of decisions:",
    );
    expect(screen.queryByText(/Once the root goal is supplied/)).not.toBeInTheDocument();
    expect(screen.getByText(/coordinates cognitive operations and actions over time/)).toBeInTheDocument();
    expect(screen.queryByText(/Optimize this code/)).not.toBeInTheDocument();
    expect(screen.getByRole("img", {
      name: "A governing goal branches to three opportunities, four solutions, and three experiments",
    })).toBeInTheDocument();
    const strategyMap = screen.getByRole("img", {
      name: "Two governing goals direct a strategy, which coordinates three subgoals while institutional authority constrains it and stakeholder goals influence it",
    });
    expect(strategyMap).toBeInTheDocument();
    const strategyField = screen.getByText(/Strategy also operates inside a field of goals/);
    expect(strategyMap.compareDocumentPosition(strategyField) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByText(/Accounting for relational impacts, temporal impacts, and value tradeoffs/)).toBeInTheDocument();
    expect(screen.getByText(/you have likely already prioritized your goals/)).toBeInTheDocument();
    expect(screen.getByText(/Human values cannot guide an AI while remaining private\. They must be expressed via:/)).toBeInTheDocument();
    expect(screen.getByText(/Human governance means retaining responsibility for which values govern/)).toBeInTheDocument();
    expect(screen.queryByText(/Human governance does not mean manually choosing every action/)).not.toBeInTheDocument();
    expect(screen.getByText("optimal", { selector: "code" }).closest("p")).toHaveTextContent(
      "The agent failed because optimal omitted the judgment that would make one plan preferable to another.",
    );
    expect(screen.queryByText(/The agent did not fail because it was incapable/)).not.toBeInTheDocument();
    expect(screen.getByText(/Our hypothesis is that, had the researchers/)).toBeInTheDocument();
    expect(screen.queryByText(/The strategic-advice study did not test this claim directly/)).not.toBeInTheDocument();
    expect(screen.getByText("Fewer than 2%:", { selector: "strong" })).toBeInTheDocument();
    expect(screen.getByText("About 11%:", { selector: "strong" })).toBeInTheDocument();
    expect(screen.getByText("About 19%:", { selector: "strong" })).toBeInTheDocument();
    const corrigibilityList = screen
      .getByText("direct observation of customer and employee consequences;")
      .closest("ul");
    expect(corrigibilityList).toHaveClass("goals-article__bullets");
    expect(corrigibilityList?.querySelectorAll("li")).toHaveLength(6);
    const expressedValuesList = screen.getByText("named stakeholders and consequences;").closest("ul");
    expect(expressedValuesList).toHaveClass("goals-article__bullets");
    expect(expressedValuesList?.querySelectorAll("li")).toHaveLength(8);
    expect(screen.getByText("Governing goal 1", { exact: true })).toBeInTheDocument();
    expect(screen.getByText("Governing goal 2", { exact: true })).toBeInTheDocument();
    expect(screen.getByText("direct", { exact: true })).toBeInTheDocument();
    expect(screen.getByText("coordinates", { exact: true })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Authority, Accountability, and Corrigibility" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ChatGPT" })).toHaveAttribute(
      "href",
      "https://chatgpt.com/share/6a8915a6-f76c-83e8-922e-e05026381142",
    );
    expect(screen.getByRole("link", { name: "Claude" })).toHaveAttribute(
      "href",
      "https://claude.ai/share/ee135d92-4246-4424-8ff4-bfb38cfa18b6",
    );
    expect(screen.getByRole("link", { name: "DeepSeek" })).toHaveAttribute(
      "href",
      "https://chat.deepseek.com/share/3dqzyfjd1evx1je3o6",
    );
    fireEvent.pointerEnter(screen.getByRole("link", { name: "ChatGPT" }));
    await waitFor(() => {
      expect(screen.getByRole("document", { name: "ChatGPT shared conversation preview" })).toBeInTheDocument();
    });
    expect(screen.getByText("Condensed from the shared thread")).toBeInTheDocument();
    expect(screen.getByText(/Truth, human agency, nonmaleficence/)).toBeInTheDocument();
    expect(screen.getByText("Governed by the wrong values, the system becomes coherently wrong.")).toBeInTheDocument();
    expect(screen.queryByText("The organization becomes coherently wrong.")).not.toBeInTheDocument();
    await user.hover(screen.getByText("false evaluative closure"));
    expect(await screen.findByText(/The appearance that evaluation is complete/)).toBeInTheDocument();
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

  it.each(dedicatedPageSlugs)("renders Sources as the final section of %s", (slug) => {
    render(
      <ToolDrawerProvider>
        <ArticleContent article={article(slug)} />
      </ToolDrawerProvider>,
    );

    const sourcesHeading = screen.getByRole("heading", { level: 2, name: "Sources" });
    const sourcesSection = sourcesHeading.closest("section");
    expect(sourcesSection).not.toBeNull();
    expect(sourcesSection?.nextElementSibling).toBeNull();
    expect(screen.getAllByRole("heading", { level: 2 }).at(-1)).toBe(sourcesHeading);
  });
});
