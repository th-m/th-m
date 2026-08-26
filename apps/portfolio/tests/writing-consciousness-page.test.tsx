import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { PublishedArticle } from "../src/content/blog-content";
import { ArticleContent } from "../src/writing/ArticleContent";

function consciousnessArticle(): PublishedArticle {
  return {
    slug: "consciousness-is-incoherent",
    title: "AI's Consciousness explanation",
    description: "Machine consciousness claims become coherent only when they name a theory, a discriminating measure, and a validated bridge to phenomenal experience.",
    publishedAt: "2026-08-25",
    updatedAt: "2026-08-26",
    tags: ["Artificial Intelligence", "Consciousness", "Philosophy of Mind", "Language"],
    articlePath: "posts/consciousness-is-incoherent/article.md",
    markdown: "# AI's Consciousness explanation\n\nBody.\n",
  };
}

describe("AI's Consciousness explanation published page", () => {
  it("renders the dedicated essay page and publication metadata", () => {
    render(<ArticleContent article={consciousnessArticle()} />);

    expect(screen.getByText("Essay")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "AI's Consciousness explanation" })).toBeInTheDocument();
    expect(screen.getByText(/Machine consciousness claims become coherent/)).toBeInTheDocument();
    expect(screen.getByText("Published August 25, 2026")).toBeInTheDocument();
    expect(screen.getByText("August 26, 2026")).toHaveAttribute("datetime", "2026-08-26");
    expect(screen.getByRole("list", { name: "Topics" }).children).toHaveLength(4);
  });

  it("renders the competing theories, logical form, and evidentiary standard", () => {
    render(<ArticleContent article={consciousnessArticle()} />);

    expect(screen.getByRole("heading", { name: "Two theories, two predicates" })).toBeInTheDocument();
    expect(screen.getByText("Biological naturalism")).toBeInTheDocument();
    expect(screen.getByText("Functionalism / organizational invariance")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The argument in one line" })).toBeInTheDocument();
    expect(screen.getByText("E(A) ⇒ Access(A)")).toBeInTheDocument();
    expect(screen.getByText("Tꜰ: F(A) ⇒ P(A)")).toBeInTheDocument();
    expect(screen.getByText("Tɴ: N(A) ⇒ P(A)")).toBeInTheDocument();
    expect(screen.getByText("E(A) ⇏ P(A)")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What evidence would be enough?" })).toBeInTheDocument();
    expect(screen.getByText("Discriminating measurement.")).toBeInTheDocument();
    expect(screen.getByText("Causal instantiation.")).toBeInTheDocument();
  });

  it("links the primary sources through article link previews", () => {
    render(<ArticleContent article={consciousnessArticle()} />);

    expect(screen.getByRole("link", { name: "“On a Confusion about a Function of Consciousness”" })).toHaveAttribute(
      "href",
      "https://doi.org/10.1017/S0140525X00038188",
    );
    expect(screen.getByRole("link", { name: "“Consciousness”" })).toHaveAttribute(
      "href",
      "https://doi.org/10.1146/annurev.neuro.23.1.557",
    );
    expect(screen.getByRole("link", { name: "“Absent Qualia, Fading Qualia, Dancing Qualia”" })).toHaveAttribute(
      "href",
      "https://consc.net/papers/qualia.html",
    );
  });

  it("ends with a structured original brief", () => {
    render(<ArticleContent article={consciousnessArticle()} />);

    expect(screen.getByRole("heading", { name: "Original brief" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Questions to investigate" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Argument to develop" })).toBeInTheDocument();
    expect(screen.getByText(/Could consciousness emerge from neural mechanisms/)).toBeInTheDocument();
    expect(screen.getByText(/Express that incongruency as a concise logical argument/)).toBeInTheDocument();
    expect(screen.queryByText(/I need to add a new blog page and article/)).not.toBeInTheDocument();
  });
});
