import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { PublishedArticle } from "../src/content/blog-content";
import { ArticleContent } from "../src/writing/ArticleContent";

function aiConsciousnessArticle(): PublishedArticle {
  return {
    slug: "ai-consciousness-is-incoherent",
    title: "AI Consciousness Is Incoherent",
    description: "Why access-like behavior, functional similarity, and theory-derived indicators do not establish qualia, phenomenal selfhood, or subjective time in AI.",
    publishedAt: "2026-08-26",
    tags: ["Artificial Intelligence", "Consciousness", "Philosophy of Mind", "Neuroscience"],
    articlePath: "posts/ai-consciousness-is-incoherent/article.md",
    markdown: "# AI Consciousness Is Incoherent\n\nBody.\n",
  };
}

describe("AI Consciousness Is Incoherent published page", () => {
  it("renders the public essay metadata and its binding thesis", () => {
    render(<ArticleContent article={aiConsciousnessArticle()} />);

    expect(screen.getByText("Essay")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "AI Consciousness Is Incoherent" })).toBeInTheDocument();
    expect(screen.getByText("Published August 26, 2026")).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Topics" }).children).toHaveLength(4);
    expect(screen.getByText(/The unqualified claim that an AI is conscious/)).toHaveTextContent(
      "no validated evidence establishes qualia, phenomenal selfhood, or subjective temporal awareness",
    );
  });

  it("renders the access substitution, biological evidence, and substrate dilemma", () => {
    render(<ArticleContent article={aiConsciousnessArticle()} />);

    expect(screen.getByRole("heading", { name: "The Hard Problem Is the Entire Problem" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The access-consciousness maneuver" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Phenomenal consciousness is replaced/ })).toBeInTheDocument();
    expect(screen.getByText(/In humans, conscious state, reported qualia/)).toHaveTextContent(
      "controlled changes to that activity can alter or abolish",
    );
    expect(screen.getByRole("img", { name: /functionalist causal-organization claim/i })).toBeInTheDocument();
    expect(screen.getByText("Current AI does not reproduce the condition.")).toBeInTheDocument();
    expect(screen.getByText("The theory assumes they are irrelevant.")).toBeInTheDocument();
  });

  it("keeps functional overlap separate from phenomenality and ends with primary sources", () => {
    render(<ArticleContent article={aiConsciousnessArticle()} />);

    expect(screen.getByRole("heading", { name: "Similar Operations Do Not Rescue the Claim" })).toBeInTheDocument();
    expect(screen.getByText("shared felt experience")).toBeInTheDocument();
    expect(screen.getByText("E(AI) ⇏ P(AI)")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Addendum" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "AI's Consciousness explanation" })).toHaveAttribute(
      "href",
      "/writing/consciousness-is-incoherent",
    );
    expect(screen.getByRole("heading", { name: "Sources" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "“Facing Up to the Problem of Consciousness.”" })).toHaveAttribute(
      "href",
      "https://consc.net/papers/facing.html",
    );
    expect(screen.getByRole("link", { name: /Intensity of Affective Experience/ })).toHaveAttribute(
      "href",
      "https://doi.org/10.1093/scan/nsz015",
    );
  });
});
