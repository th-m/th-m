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
    description: "Sensemaking connects signals, current priorities, historical evidence, and discoverable memory.",
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
    expect(screen.getByText(/Sensemaking connects signals/)).toBeInTheDocument();
    expect(screen.getByText("Published August 22, 2026")).toBeInTheDocument();
    expect(screen.queryByText("Essay outline")).not.toBeInTheDocument();
  });

  it("renders sensemaking and selective memory while execution belongs to the factory", async () => {
    await renderPage();
    expect(screen.getByRole("heading", { name: "1. How Far Can the Factory Make Sense?" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "2. Choose Signals That Explain Progress" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "3. A Second Brain Holds History and Current State" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "4. Make Context Discoverable by Convention" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "5. Retrieve the Context the Decision Needs" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "7. Evaluate the Factory's Cognitive Reach" })).toBeInTheDocument();
    expect(screen.queryByAltText(/operational sensors feed an event contract/)).not.toBeInTheDocument();
    expect(document.querySelector('[data-variant="trigger-opens-hypotheses"]')).not.toBeInTheDocument();
    expect(document.querySelector('[data-variant="consequence-returns-to-context"]')).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Capability reach" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Governance conditions" })).toBeInTheDocument();
    expect(screen.queryByRole("columnheader", { name: "Bare model call" })).not.toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "Temporal reach" })).toBeInTheDocument();
  });

  it("links the series essays through the writing routes", async () => {
    await renderPage();
    const links: Array<[string, string]> = [
      ["Vision and Values", "/writing/vision-and-values"],
      ["Truth and Inference", "/writing/truth-and-inference"],
      ["Understanding and Bottlenecks", "/writing/understanding-and-bottlenecks"],
      ["The Knowledge Factory", "/writing/the-knowledge-factory"],
      ["Ontology Factory", "/writing/the-ontology-factory"],
    ];
    for (const [name, href] of links) {
      const matches = screen.getAllByRole("link", { name });
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.some((link) => link.getAttribute("href") === href)).toBe(true);
    }
  });

});
