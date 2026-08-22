import { render, screen } from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { describe, expect, it, vi } from "vitest";
import type { PublishedArticle } from "../src/content/blog-content";
import { ArticleContent } from "../src/writing/ArticleContent";
import { ToolDrawerProvider } from "../src/tools/ToolDrawerProvider";
import { ToolDrawer } from "../src/tools/ToolDrawer";

// The page embeds PropositionGraphFigure components (ELK worker); stub the
// worker-bound figure while keeping the rest of the library real.
vi.mock("@th-m/graph-visualization", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@th-m/graph-visualization")>();
  return {
    ...actual,
    PropositionGraphFigure: (props: { title?: string }) => (
      <div data-testid="proposition-graph-figure" data-title={props.title ?? ""} />
    ),
  };
});

function understandingArticle(): PublishedArticle {
  return {
    slug: "understanding-is-the-bottleneck",
    title: "The Understanding Bottleneck",
    description: "When plausible output becomes abundant, shared understanding limits progress.",
    publishedAt: "2026-08-22",
    tags: ["Artificial Intelligence", "Leadership", "Knowledge Work", "Software Systems"],
    articlePath: "posts/understanding-is-the-bottleneck/article.md",
    markdown: "# The Understanding Bottleneck\n\nBody.\n",
  };
}

async function renderPage() {
  const rootRoute = createRootRoute({
    component: () => (
      <ToolDrawerProvider>
        <Outlet />
        <ToolDrawer />
      </ToolDrawerProvider>
    ),
  });
  const writingRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/writing/$slug",
    component: () => <ArticleContent article={understandingArticle()} />,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([writingRoute]),
    history: createMemoryHistory({ initialEntries: ["/writing/understanding-is-the-bottleneck"] }),
  });
  await router.load();
  return render(<RouterProvider router={router} />);
}

describe("The Understanding Bottleneck published page", () => {
  it("renders the finished essay header instead of an outline", async () => {
    await renderPage();
    expect(screen.getByText("Essay")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "The Understanding Bottleneck" })).toBeInTheDocument();
    expect(screen.getByText("When plausible output becomes abundant, shared understanding limits progress.")).toBeInTheDocument();
    expect(screen.getByText(/August 22, 2026/)).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Topics" }).children.length).toBe(4);
    expect(screen.queryByText("Essay outline")).not.toBeInTheDocument();
    expect(screen.queryByText(/Editorial status/)).not.toBeInTheDocument();
  });

  it("renders the essay sections, key terms, claims, and both graph figures", async () => {
    await renderPage();
    expect(screen.getByRole("heading", { name: "Core Thesis" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "When Verification Outruns Understanding" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Distillation Is Not Summarization" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Five Dimensions of Product Understanding" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Action Completes the Loop" })).toBeInTheDocument();
    // The glossary term appears in the key-terms definition list, and the
    // same word is an inline hover-card trigger in the distillation section.
    expect(screen.getAllByText("Distillation").length).toBe(2);
    expect(screen.getByText("Evaluative closure")).toBeInTheDocument();

    const figures = screen.getAllByTestId("proposition-graph-figure");
    expect(figures).toHaveLength(2);
    expect(figures[0]).toHaveAttribute("data-title", "Proof abundance pipeline");
    expect(figures[1]).toHaveAttribute("data-title", "The understanding loop");
  });

  it("links the external sources and every series essay through the writing routes", async () => {
    await renderPage();
    const external = [
      ['"Mathematics in the Age of AI"', "https://www.simonsfoundation.org/2026/08/13/fields-medalist-terence-tao-on-artificial-intelligence-and-why-we-do-math/"],
      ["essay", "https://arxiv.org/abs/2608.16753"],
      ['"An OpenAI model has disproved a central conjecture in discrete geometry"', "https://openai.com/index/model-disproves-discrete-geometry-conjecture/"],
      ["Leiden Declaration on Artificial Intelligence and Mathematics", "https://leidendeclaration.ai/"],
    ];
    for (const [name, href] of external) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
      expect(screen.getByRole("link", { name })).toHaveAttribute("target", "_blank");
    }
    const series: Array<[string, string]> = [
      ["Goals, Solutions & Value", "/writing/goals-solutions-and-value"],
      ["Truth, Entropy & Inference", "/writing/truth-entropy-and-inference"],
      ["The Knowledge Factory", "/writing/the-knowledge-factory"],
      ["Factory Ontology", "/writing/the-factory-ontology"],
      ["Cognitive Factory", "/writing/the-cognitive-factory"],
    ];
    for (const [name, href] of series) {
      const links = screen.getAllByRole("link", { name });
      expect(links.length).toBeGreaterThan(0);
      expect(links.some((link) => link.getAttribute("href") === href)).toBe(true);
    }
  });
});
