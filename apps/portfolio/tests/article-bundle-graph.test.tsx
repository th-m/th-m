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
import type { BlogManifest } from "@th-m/blogs/publish";
import { ArticleBundleGraph } from "../src/home/ArticleBundleGraph";

const post = (slug: string, title: string, description: string): BlogManifest["posts"][number] => ({
  slug,
  title,
  description,
  publishedAt: "2026-08-22",
  tags: [],
  articlePath: `posts/${slug}/article.md`,
  assetsPath: `posts/${slug}/assets`,
  page: true,
});

const posts: BlogManifest["posts"] = [
  post("solutions-meaning-and-value", "Solutions, Meaning, and Value", "Why predictive systems need explicit goals."),
  post("truth-entropy-and-inference", "Truth, Entropy, and Inference", "How truth and entropy constrain inference."),
  post("understanding-is-the-bottleneck", "Understanding Is the Bottleneck", "Why understanding limits progress."),
  post("the-knowledge-factory", "The Knowledge Factory", "The factory that turns knowledge into work."),
  post("the-factory-ontology", "The Factory — Ontology", "The ontology of the factory."),
  post("the-factory-strategy", "The Factory — Strategy", "The strategy of the factory."),
];

async function renderGraph() {
  const rootRoute = createRootRoute({
    component: () => <Outlet />,
  });
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => <ArticleBundleGraph posts={posts} />,
  });
  const writingRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/writing/$slug",
    component: () => null,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, writingRoute]),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  await router.load();
  return render(<RouterProvider router={router} />);
}

describe("ArticleBundleGraph", () => {
  it("renders six clickable article nodes linking to their essays", async () => {
    await renderGraph();
    expect(screen.getByRole("heading", { name: "AI Factory" })).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(6);
    expect(screen.getByRole("link", { name: /Solutions, Meaning, and Value/ })).toHaveAttribute(
      "href",
      "/writing/solutions-meaning-and-value",
    );
    expect(screen.getByRole("link", { name: /Truth, Entropy, and Inference/ })).toHaveAttribute(
      "href",
      "/writing/truth-entropy-and-inference",
    );
    expect(screen.getByRole("link", { name: /Understanding Is the Bottleneck/ })).toHaveAttribute(
      "href",
      "/writing/understanding-is-the-bottleneck",
    );
    expect(screen.getByRole("link", { name: /The Knowledge Factory/ })).toHaveAttribute(
      "href",
      "/writing/the-knowledge-factory",
    );
    expect(screen.getByRole("link", { name: /The Factory — Ontology/ })).toHaveAttribute(
      "href",
      "/writing/the-factory-ontology",
    );
    expect(screen.getByRole("link", { name: /The Factory — Strategy/ })).toHaveAttribute(
      "href",
      "/writing/the-factory-strategy",
    );
  });

  it("draws the five bundle edges as SVG paths", async () => {
    const { container } = await renderGraph();
    expect(container.querySelectorAll(".home-graph__edges path")).toHaveLength(5);
  });

  it("marks the knowledge factory as the hub and labels node kinds", async () => {
    await renderGraph();
    const hub = screen.getByRole("link", { name: /The Knowledge Factory/ });
    expect(hub.closest(".home-graph__node--hub")).not.toBeNull();
    expect(screen.getAllByText("Foundation", { selector: ".home-graph__node-kind" })).toHaveLength(3);
    expect(screen.getAllByText("Hub", { selector: ".home-graph__node-kind" })).toHaveLength(1);
    expect(screen.getAllByText("Branch", { selector: ".home-graph__node-kind" })).toHaveLength(2);
  });

  it("renders each node as a spotlight card", async () => {
    const { container } = await renderGraph();
    expect(container.querySelectorAll(".thom-card-spotlight")).toHaveLength(6);
    expect(container.querySelectorAll(".thom-card-spotlight__spotlight")).toHaveLength(6);
  });

  it("renders nothing when none of the bundle posts are published", () => {
    const { container } = render(<ArticleBundleGraph posts={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
