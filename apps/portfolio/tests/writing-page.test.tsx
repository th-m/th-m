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
  "goals-solutions-and-value",
  "the-cognitive-factory",
  "the-knowledge-factory",
  "the-ontology-factory",
  "truth-entropy-and-inference",
  "understanding-is-the-bottleneck",
] as const;

describe("ArticleContent MDX rendering", () => {
  it("renders the canonical MDX article selected by slug", async () => {
    const user = userEvent.setup();
    render(
      <ToolDrawerProvider>
        <ArticleContent article={article("goals-solutions-and-value")} />
      </ToolDrawerProvider>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Public title" })).toBeInTheDocument();
    // The MDX module renders the complete canonical essay.
    expect(screen.getByRole("heading", { name: "The Priorities Hidden Inside the Prompt" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What a Language Model Carries" })).toBeInTheDocument();
    expect(screen.getByText(/An LLM is a compressed statistical model of patterns in human language/)).toBeInTheDocument();
    expect(screen.getByText(/A model never experiences anything/)).toHaveTextContent(
      "The value of its predictive capabilities comes from the relationships between words.",
    );
    expect(
      screen.getByText(
        "There is no evidence to suggest anything beyond a pattern with incredible predictive power.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(/The model never encounters a cat/)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Input and tokens" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Training through cross-entropy" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Model, inference, and runtime" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Possible next token" }).closest("table")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What Language Leaves Out" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Two compressions" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "LLM Training" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "A model is not conscious" })).toHaveAttribute(
      "href",
      "/writing/consciousness-is-incoherent",
    );
    expect(screen.getByRole("heading", { name: "Goals Create Opportunity Spaces" })).toBeInTheDocument();
    expect(screen.getByText(/Once the root goal is supplied/)).toHaveTextContent(
      "That distinction separates two kinds of decision:",
    );
    expect(screen.getByText(/coordinates cognitive operations and actions over time/)).toBeInTheDocument();
    expect(screen.getByText(/Optimize this code/)).toBeInTheDocument();
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
    expect(screen.getByText(/Optimize this plan, find all the gaps/).closest("blockquote")).toHaveClass("article-quote--plain");
    expect(screen.getByText(/Human values cannot guide an AI while remaining private/)).toHaveTextContent(
      "They have to become available through some combination of:",
    );
    expect(screen.getByText(/Human governance does not mean manually choosing every action/)).toBeInTheDocument();
    const coreThesis = screen.getByText(/Human experience reveals what can matter/);
    const strategicStudy = screen.getByText(/Research on AI-generated strategic advice demonstrates/);
    const governingPoint = screen.getByText(/Meaningful decisions must begin with human experience/);
    expect(coreThesis.compareDocumentPosition(strategicStudy) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(strategicStudy.compareDocumentPosition(governingPoint) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(coreThesis.closest(".article-claim")).toHaveClass("article-claim--emphasis");
    const externalEvidence = screen.getByRole("complementary", { name: "External research" });
    expect(externalEvidence).toContainElement(screen.getByRole("link", { name: "study of seven strategic tradeoffs" }));
    expect(externalEvidence.querySelector("ul")).toBeInTheDocument();
    expect(screen.queryByText("External evidence")).not.toBeInTheDocument();
    expect(screen.getByText("Which outcome should be optimized?").closest("ul")?.querySelectorAll("li")).toHaveLength(6);
    const salaryFigure = screen.getByRole("img", { name: /Illustrative company of 100 people/ });
    expect(salaryFigure).toBeInTheDocument();
    expect(salaryFigure).toHaveTextContent(/No one earns the \$95k average/);
    const salaryFigureText = salaryFigure.textContent ?? "";
    expect(salaryFigureText.indexOf("Typical employee")).toBeLessThan(
      salaryFigureText.indexOf("Company average"),
    );
    expect(screen.queryByText(/80 × \$60k/)).not.toBeInTheDocument();
    expect(screen.getByText(/Subjective terms and value-laden language inherit personal definitions/)).toHaveTextContent(
      "An average can describe a population while obscuring the person we are trying to understand. This is not only an AI problem. It is a language problem.",
    );
    expect(screen.queryByText(/Visualization placeholder/)).not.toBeInTheDocument();
    expect(screen.getByText("optimal", { selector: "code" }).closest("p")).toHaveTextContent(
      "The agent did not fail because it was incapable of producing a plan.",
    );
    expect(screen.getByText(/Our hypothesis is that, had the researchers/)).toBeInTheDocument();
    expect(screen.getByText(/The strategic-advice study did not test this claim directly/)).toBeInTheDocument();
    expect(screen.getByText("Fewer than 2%:", { selector: "strong" })).toBeInTheDocument();
    expect(screen.getByText("About 11%:", { selector: "strong" })).toBeInTheDocument();
    expect(screen.getByText("About 19%:", { selector: "strong" })).toBeInTheDocument();
    const corrigibilityList = screen
      .getByText("direct observation of customer and employee consequences")
      .closest("ul");
    expect(corrigibilityList?.querySelectorAll("li")).toHaveLength(6);
    const expressedValuesList = screen.getByText("named stakeholders and consequences").closest("ul");
    expect(expressedValuesList?.querySelectorAll("li")).toHaveLength(8);
    const bulletItems = Array.from(document.querySelectorAll(".goals-article ul li"));
    expect(bulletItems.every((item) => !item.textContent?.includes(";"))).toBe(true);
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
  }, 20_000);

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
