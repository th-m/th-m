import { render, screen } from "@testing-library/react";
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
      "When generation becomes abundant, shared understanding must move from a central gate into bounded team learning loops.",
    publishedAt: "2026-08-22",
    updatedAt: "2026-09-23",
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
        "When generation becomes abundant, shared understanding must move from a central gate into bounded team learning loops.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/August 22, 2026/)).toBeInTheDocument();
    expect(screen.getByText(/September 23, 2026/)).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Topics" }).children.length).toBe(
      4,
    );
    expect(screen.queryByText("Essay outline")).not.toBeInTheDocument();
    expect(screen.queryByText(/Editorial status/)).not.toBeInTheDocument();
  });

  it("renders the six movements, recurring tests, and bounded-loop topology", async () => {
    await renderPage();
    for (const name of [
      "Generation Scales; Understanding Does Not",
      "The Central Architect Becomes the Queue",
      "Distribute Complete Learning Loops",
      "Design Philosophy Makes Local Decisions Compatible",
      "Make Shared Models Compact—and Reopenable",
      "Protect the Work That Develops Judgment",
    ]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
    expect(screen.getByText("Coherence:")).toBeInTheDocument();
    expect(screen.getByText("Correspondence:")).toBeInTheDocument();
    expect(screen.getByText("Consequence:")).toBeInTheDocument();
    expect(
      screen.getByText("investigate → decide → act → evaluate → revise"),
    ).toBeInTheDocument();
    expect(screen.getByText("A model that can be opened")).toBeInTheDocument();

    expect(
      screen.queryByRole("img", {
        name: /Short input, useful output—or just more tokens/,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: /The same teams, a different place for understanding/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("group", { name: "Graph view controls" }),
    ).not.toBeInTheDocument();
  });

  it("links the organizing evidence and the next series essay", async () => {
    await renderPage();
    const external = [
      "https://arxiv.org/abs/2608.16753",
      "https://openai.com/index/model-disproves-discrete-geometry-conjecture/",
      "https://leidendeclaration.ai/",
      "https://arxiv.org/abs/2510.07435",
      "https://pubmed.ncbi.nlm.nih.gov/31870708/",
    ];
    for (const href of external) {
      const matchingLink = screen
        .getAllByRole("link")
        .find((link) => link.getAttribute("href") === href);

      expect(matchingLink).toBeDefined();
      expect(matchingLink).toHaveAttribute("target", "_blank");
    }
    const links = screen.getAllByRole("link");
    expect(
      links.find((link) => link.getAttribute("href") === "/writing/truth-and-inference"),
    ).toBeDefined();
    expect(
      links.find((link) => link.getAttribute("href") === "/writing/the-knowledge-factory"),
    ).toBeDefined();
  });
});
