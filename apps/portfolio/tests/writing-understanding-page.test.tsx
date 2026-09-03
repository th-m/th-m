import { render, screen, within } from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import type { PublishedArticle } from "../src/content/blog-content";
import { ArticleContent } from "../src/writing/ArticleContent";
import { ToolDrawerProvider } from "../src/tools/ToolDrawerProvider";
import { ToolDrawer } from "../src/tools/ToolDrawer";

function understandingArticle(): PublishedArticle {
  return {
    slug: "understanding-and-bottlenecks",
    title: "Understanding and Bottlenecks",
    description:
      "When plausible output becomes abundant, shared understanding limits progress.",
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-26",
    tags: [
      "Artificial Intelligence",
      "Leadership",
      "Knowledge Work",
      "Software Systems",
    ],
    articlePath: "posts/understanding-and-bottlenecks/article.mdx",
    assetRegistryPath: "posts/understanding-and-bottlenecks/assets.json",
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
    history: createMemoryHistory({
      initialEntries: ["/writing/understanding-and-bottlenecks"],
    }),
  });
  await router.load();
  return render(<RouterProvider router={router} />);
}

describe("Understanding and Bottlenecks published page", () => {
  it("renders the finished essay header instead of an outline", async () => {
    await renderPage();
    expect(screen.getByText("Essay")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Understanding and Bottlenecks",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "When plausible output becomes abundant, shared understanding limits progress.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/August 22, 2026/)).toBeInTheDocument();
    expect(screen.getByText(/August 26, 2026/)).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Topics" }).children.length).toBe(
      4,
    );
    expect(screen.queryByText("Essay outline")).not.toBeInTheDocument();
    expect(screen.queryByText(/Editorial status/)).not.toBeInTheDocument();
  });

  it("renders the four movements, recurring tests, and explanatory figures", async () => {
    await renderPage();
    expect(
      screen.getByRole("heading", {
        name: "Two Ways Output Outruns Understanding",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "When Correctness Outruns Meaning" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "When Generation Outruns Evaluation",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Inference Produces an Answer; Understanding Maintains a Model",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "From Output to Shared Understanding",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Distillation Preserves What a Decision Needs",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Five Dimensions Check the Model's Coverage",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "From an Authority Gate to an Evaluative Boundary",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Evaluative Closure Makes Delegation Responsible",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Test, Act, and Revise" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Understanding Is a Skill to Look For—and Develop",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Coherence — does it fit?")).toBeInTheDocument();
    expect(
      screen.getByText("Correspondence — does it match?"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Consequence — what follows when people act on it?"),
    ).toBeInTheDocument();
    expect(screen.getByText("Evaluative closure")).toBeInTheDocument();

    const pipeline = screen.getByRole("figure", {
      name: "Where abundance becomes a bottleneck",
    });
    expect(
      within(pipeline).getByText("Candidate proofs can outrun verification"),
    ).toBeInTheDocument();
    expect(
      within(pipeline).getByText(
        "Published work can outrun collective absorption",
      ),
    ).toBeInTheDocument();

    const inference = screen.getByLabelText(
      /Animated neural network: LLM Inference/,
    );
    expect(
      within(inference).getByRole("heading", { name: "LLM Inference" }),
    ).toBeInTheDocument();
    expect(
      within(inference).getByText(/fixed trained weights/i),
    ).toBeInTheDocument();
    expect(
      within(inference).getByText("Illustrative next-token probabilities"),
    ).toBeInTheDocument();

    const loop = screen.getByRole("figure", {
      name: "The understanding loop",
    });
    expect(within(loop).getByText("Observe")).toBeInTheDocument();
    expect(within(loop).getByText("Revise")).toBeInTheDocument();
    expect(
      screen.queryByRole("group", { name: "Graph view controls" }),
    ).not.toBeInTheDocument();
  });

  it("links the organizing evidence and the next series essay", async () => {
    await renderPage();
    const external = [
      [
        "Mathematics in the Age of AI",
        "https://www.simonsfoundation.org/2026/08/13/fields-medalist-terence-tao-on-artificial-intelligence-and-why-we-do-math/",
      ],
      ["essay", "https://arxiv.org/abs/2608.16753"],
      [
        "OpenAI unit-distance result",
        "https://openai.com/index/model-disproves-discrete-geometry-conjecture/",
      ],
      [
        "Leiden Declaration on Artificial Intelligence and Mathematics",
        "https://leidendeclaration.ai/",
      ],
      [
        "mixed-methods study of 442 developers",
        "https://arxiv.org/abs/2510.07435",
      ],
      [
        "Research on gambling and reward uncertainty",
        "https://pubmed.ncbi.nlm.nih.gov/31870708/",
      ],
    ];
    for (const [name, href] of external) {
      const matchingLink = screen
        .getAllByRole("link", { name })
        .find((link) => link.getAttribute("href") === href);

      expect(matchingLink).toBeDefined();
      expect(matchingLink).toHaveAttribute("target", "_blank");
    }
    expect(
      screen.getByRole("link", { name: "Truth and Inference" }),
    ).toHaveAttribute("href", "/writing/truth-and-inference");
    expect(
      screen.getByRole("link", { name: "The Knowledge Factory" }),
    ).toHaveAttribute("href", "/writing/the-knowledge-factory");
  });
});
