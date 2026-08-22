import { render, screen } from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PublishedArticle } from "../src/content/blog-content";
import { ArticleContent } from "../src/writing/ArticleContent";
import { ToolDrawerProvider } from "../src/tools/ToolDrawerProvider";
import { ToolDrawer } from "../src/tools/ToolDrawer";

// The jsdom environment here does not provide a storage global (the graph
// library's own tests polyfill it the same way); install a minimal one so the
// page's drawer seeding can persist the knowledge-factory graph.
beforeEach(() => {
  const store = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => { store.set(key, value); },
      removeItem: (key: string) => { store.delete(key); },
      clear: () => { store.clear(); },
    },
  });
});

// The page embeds a PropositionGraphFigure (ELK worker) and can open the
// relationship-graph explorer from the drawer; stub the worker-bound pieces so
// jsdom never constructs a web worker while keeping the storage helpers real.
vi.mock("@th-m/graph-visualization", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@th-m/graph-visualization")>();
  return {
    ...actual,
    PropositionGraphFigure: () => <div data-testid="proposition-graph-figure" />,
    RelationshipGraphExplorer: (props: { initialGraphId?: string }) => (
      <div data-testid="graph-explorer-mock" data-initial-graph-id={props.initialGraphId ?? ""} />
    ),
  };
});

function knowledgeFactoryArticle(): PublishedArticle {
  return {
    slug: "the-knowledge-factory",
    title: "The Knowledge Factory",
    description: "Every company is building a factory.",
    publishedAt: "2026-08-22",
    tags: ["Artificial Intelligence", "Organizations"],
    articlePath: "posts/the-knowledge-factory/article.md",
    markdown: "# The Knowledge Factory\n\nBody.\n",
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
    component: () => <ArticleContent article={knowledgeFactoryArticle()} />,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([writingRoute]),
    history: createMemoryHistory({ initialEntries: ["/writing/the-knowledge-factory"] }),
  });
  await router.load();
  return render(<RouterProvider router={router} />);
}

describe("The Knowledge Factory published page", () => {
  it("renders the finished essay header instead of an outline", async () => {
    await renderPage();
    expect(screen.getByText("Essay")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "The Knowledge Factory" })).toBeInTheDocument();
    expect(screen.getByText("Every company is building a factory.")).toBeInTheDocument();
    expect(screen.getByText("August 22, 2026")).toBeInTheDocument();
    expect(screen.queryByText("Essay outline")).not.toBeInTheDocument();
  });

  it("renders the essay sections, glossary, and the graph figure", async () => {
    await renderPage();
    expect(screen.getByRole("heading", { name: "Core Thesis" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The Strategy Discipline" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "12. The Organizational Second Brain" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Factory engineer" })).toBeInTheDocument();
    expect(screen.getByTestId("proposition-graph-figure")).toBeInTheDocument();
  });

  it("links every series essay through the writing routes", async () => {
    await renderPage();
    const links: Array<[string, string]> = [
      ["Goals, Solutions & Value", "/writing/goals-solutions-and-value"],
      ["Truth, Entropy & Inference", "/writing/truth-entropy-and-inference"],
      ["The Understanding Bottleneck", "/writing/understanding-is-the-bottleneck"],
      ["Ontology Factory", "/writing/the-ontology-factory"],
      ["Cognitive Factory", "/writing/the-cognitive-factory"],
    ];
    for (const [name, href] of links) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
    }
  });
});
