import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ArticleBundleGraph, type ArticleBundlePost } from "./article-bundle-graph";

afterEach(cleanup);

const post = (slug: string, title: string, description: string): ArticleBundlePost => ({
  slug,
  title,
  description,
});

const posts: ArticleBundlePost[] = [
  post("vision-and-values", "Vision and Values", "Why predictive systems need explicit goals."),
  post("understanding-and-bottlenecks", "Understanding and Bottlenecks", "Why understanding limits progress."),
  post("truth-and-inference", "Truth and Inference", "How truth and entropy constrain inference."),
  post("the-knowledge-factory", "The Knowledge Factory", "The factory that turns knowledge into work."),
  post("the-ontology-factory", "The Ontology Factory", "The ontology of the factory."),
  post("the-cognitive-factory", "Cognitive Factory", "The cognition of the factory."),
];

describe("ArticleBundleGraph", () => {
  it("renders the canonical six-node graph without a manifest", () => {
    render(<ArticleBundleGraph />);
    expect(screen.getByRole("heading", { name: "AI Factory" })).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(6);
    expect(screen.getAllByRole("link").map(link => link.getAttribute("href")))
      .toEqual(posts.map(post => `/writing/${post.slug}`));
    expect(screen.getByRole("link", { name: /Understanding and Bottlenecks/ })).toHaveTextContent("02");
    expect(screen.getByRole("link", { name: /Truth and Inference/ })).toHaveTextContent("03");
    expect(screen.getByRole("link", { name: /Vision and Values/ })).toHaveAttribute(
      "href",
      "/writing/vision-and-values",
    );
  });

  it("uses published post metadata when supplied", () => {
    render(<ArticleBundleGraph posts={posts} />);
    expect(screen.getByRole("link", { name: /Truth and Inference/ })).toHaveAttribute(
      "aria-label",
      "Truth and Inference. How truth and entropy constrain inference.",
    );
  });

  it("draws the five bundle edges for desktop and mobile", () => {
    const { container } = render(<ArticleBundleGraph posts={posts} />);
    expect(container.querySelectorAll(".home-graph__edges--desktop .home-graph__edge")).toHaveLength(5);
    expect(container.querySelectorAll(".home-graph__edges--mobile .home-graph__edge")).toHaveLength(5);
    expect(container.querySelectorAll(".home-graph__edge[marker-end]")).toHaveLength(10);
  });

  it("marks the knowledge factory as the hub and renders spotlight cards", () => {
    const { container } = render(<ArticleBundleGraph posts={posts} />);
    expect(screen.getByRole("link", { name: /The Knowledge Factory/ }).closest(".home-graph__node--hub")).not.toBeNull();
    expect(screen.getAllByText("Foundation", { selector: ".home-graph__node-kind" })).toHaveLength(3);
    expect(screen.getAllByText("Hub", { selector: ".home-graph__node-kind" })).toHaveLength(1);
    expect(screen.getAllByText("Branch", { selector: ".home-graph__node-kind" })).toHaveLength(2);
    expect(container.querySelectorAll(".thom-card-spotlight")).toHaveLength(6);
  });

  it("renders nothing when none of the supplied posts are published", () => {
    const { container } = render(<ArticleBundleGraph posts={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
