import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

function cognitiveFactoryArticle(): PublishedArticle {
  return {
    slug: "the-cognitive-factory",
    title: "Cognitive Factory",
    description: "The factory's cognition is not a model subscription.",
    publishedAt: "2026-08-22",
    tags: ["Artificial Intelligence", "Knowledge Work"],
    articlePath: "posts/the-cognitive-factory/article.md",
    markdown: "# Cognitive Factory\n\nBody.\n",
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
    expect(screen.getByText("The factory's cognition is not a model subscription.")).toBeInTheDocument();
    expect(screen.getByText("August 22, 2026")).toBeInTheDocument();
    expect(screen.queryByText("Essay outline")).not.toBeInTheDocument();
  });

  it("renders the cognition sections and the graph figure", async () => {
    await renderPage();
    expect(screen.getByRole("heading", { name: "Extending Loop and Graph Engineering" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "1. Graph Context Exploration" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "2. From Documents to Executable Context" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "3. The Compounding Loop" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "4. The Cognitive Light Cone Scorecard" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "6. The Two Factory Disciplines" })).toBeInTheDocument();
    expect(screen.getByTestId("proposition-graph-figure")).toBeInTheDocument();
  });

  it("links the series essays through the writing routes", async () => {
    await renderPage();
    const links: Array<[string, string]> = [
      ["Goals, Solutions & Value", "/writing/goals-solutions-and-value"],
      ["Truth, Entropy & Inference", "/writing/truth-entropy-and-inference"],
      ["The Understanding Bottleneck", "/writing/understanding-is-the-bottleneck"],
      ["The Knowledge Factory", "/writing/the-knowledge-factory"],
      ["Factory Ontology", "/writing/the-factory-ontology"],
    ];
    for (const [name, href] of links) {
      const matches = screen.getAllByRole("link", { name });
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.some((link) => link.getAttribute("href") === href)).toBe(true);
    }
  });

  it("seeds the knowledge-factory graph and opens it in the relationship-graph drawer", async () => {
    const user = userEvent.setup();
    await renderPage();

    await user.click(screen.getByRole("button", { name: /Explore the graph/ }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(await screen.findByTestId("graph-explorer-mock")).toHaveAttribute(
      "data-initial-graph-id",
      "knowledge-factory",
    );

    const stored = localStorage.getItem("thom:proposition-graph:v1");
    expect(stored).toBeTruthy();
    expect(stored).toContain("knowledge-factory");
  });
});
