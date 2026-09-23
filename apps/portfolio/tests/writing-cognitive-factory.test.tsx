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

function cognitiveFactoryArticle(): PublishedArticle {
  return {
    slug: "the-cognitive-factory",
    title: "Cognitive Factory",
    description: "Reliable automation needs typed observations, bounded authority, evaluated consequences, and retained learning.",
    publishedAt: "2026-08-22",
    tags: ["Artificial Intelligence", "Knowledge Work"],
    articlePath: "posts/the-cognitive-factory/article.mdx",
    assetRegistryPath: "posts/the-cognitive-factory/assets.json",
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
    component: () => <ArticleContent article={cognitiveFactoryArticle()} />,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([writingRoute]),
    history: createMemoryHistory({ initialEntries: ["/writing/the-cognitive-factory"] }),
  });
  await router.load();
  return render(<RouterProvider router={router} />);
}

describe("Cognitive Factory published page", () => {
  it("renders the finished essay header instead of an outline", async () => {
    await renderPage();
    expect(screen.getByText("Essay")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Cognitive Factory" })).toBeInTheDocument();
    expect(screen.getByText(/Reliable automation needs typed observations/)).toBeInTheDocument();
    expect(screen.getByText("Published August 22, 2026")).toBeInTheDocument();
    expect(screen.queryByText("Essay outline")).not.toBeInTheDocument();
  });

  it("renders the cognition sections without the retired graph explorer", async () => {
    await renderPage();
    expect(screen.getByRole("heading", { name: "1. Sense: Signals Must Become Typed Observations" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "2. Hypothesize: A Trigger Opens an Investigation" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "3. Decide: Judgment Is Bounded; Authority Stays Explicit" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "4. Execute: Agent Graphs Make Work Inspectable" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "5. Evaluate: Close One Signal-to-Outcome Loop" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "6. Learn: Retained Consequences, Not Activity, Compound" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "7. Build the Feedback Chain in Dependency Order" })).toBeInTheDocument();
    expect(screen.queryByText(/Explore the graph/)).not.toBeInTheDocument();
    expect(screen.getAllByText(/Sentry/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/PostHog/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Jev/).length).toBeGreaterThan(0);
    expect(screen.getByAltText(/operational sensors feed an event contract/)).toBeInTheDocument();
    expect(document.querySelector('[data-variant="trigger-opens-hypotheses"]')).toBeInTheDocument();
    expect(document.querySelector('[data-variant="consequence-returns-to-context"]')).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Capability reach" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Governance conditions" })).toBeInTheDocument();
  });

  it("links the series essays through the writing routes", async () => {
    await renderPage();
    const links: Array<[string, string]> = [
      ["Vision and Values", "/writing/vision-and-values"],
      ["Truth and Coherence", "/writing/truth-and-inference"],
      ["Understanding and Bottlenecks", "/writing/understanding-and-bottlenecks"],
      ["The Knowledge Factory", "/writing/the-knowledge-factory"],
      ["The Ontology Factory", "/writing/the-ontology-factory"],
    ];
    for (const [name, href] of links) {
      const matches = screen.getAllByRole("link", { name });
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.some((link) => link.getAttribute("href") === href)).toBe(true);
    }
  });

});
