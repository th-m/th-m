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

vi.mock("@th-m/llm-training", () => ({
  TrainingWalkthrough: () => <div data-testid="training-walkthrough" />,
}));

vi.mock("@th-m/embedding-space/composition", () => ({
  EmbeddingCompositionExplorer: () => <div data-testid="embedding-explorer" />,
}));

vi.mock("@th-m/llm-generation", () => ({
  GenerationPlayback: () => <div data-testid="generation-playback" />,
}));

vi.mock("@th-m/llm-decoding", () => ({
  DecodingExplorer: () => <div data-testid="decoding-explorer" />,
}));

function buildingAnLlmArticle(): PublishedArticle {
  return {
    slug: "building-an-llm",
    title: "Building an LLM",
    description:
      "How text becomes tokens, training turns prediction error into learned weights, embeddings organize those patterns, and inference generates one token at a time.",
    publishedAt: "2026-08-26",
    tags: [
      "Artificial Intelligence",
      "Language Models",
      "Machine Learning",
      "Software Systems",
    ],
    articlePath: "posts/building-an-llm/article.mdx",
    assetRegistryPath: "posts/building-an-llm/assets.json",
  };
}

async function renderPage() {
  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  const writingRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/writing/$slug",
    component: () => <ArticleContent article={buildingAnLlmArticle()} />,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([writingRoute]),
    history: createMemoryHistory({ initialEntries: ["/writing/building-an-llm"] }),
  });
  await router.load();
  return render(<RouterProvider router={router} />);
}

describe("Building an LLM published page", () => {
  it("renders the four-stage pattern-prediction argument", async () => {
    await renderPage();

    expect(
      screen.getByRole("heading", { level: 1, name: "Building an LLM" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "1. Input: Text Becomes Tokens" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "2. Training: Prediction Error Changes Weights",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "3. The Model: Learned Weights and Embeddings",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "4. Inference: One Token at a Time" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "5. What Pattern Prediction Means" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Training changes the weights. Inference uses the weights."),
    ).toBeInTheDocument();
  });

  it("composes the training, embedding, generation, and decoding interactives", async () => {
    await renderPage();

    expect(screen.getByTestId("training-walkthrough")).toBeInTheDocument();
    expect(screen.getByTestId("embedding-explorer")).toBeInTheDocument();
    expect(screen.getByTestId("generation-playback")).toBeInTheDocument();
    expect(screen.getByTestId("decoding-explorer")).toBeInTheDocument();
  });

  it("connects inference to the Understanding essay's evaluation boundary", async () => {
    await renderPage();

    expect(
      screen.getByRole("link", { name: "The Understanding Bottleneck" }),
    ).toHaveAttribute("href", "/writing/understanding-is-the-bottleneck");
  });
});
