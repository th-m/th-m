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

function consciousnessArticle(): PublishedArticle {
  return {
    slug: "consciousness-is-incoherent",
    title: "AI's Consciousness explanation",
    description: "Machine consciousness claims become coherent only when they name a theory, a discriminating measure, and a validated bridge to phenomenal experience.",
    publishedAt: "2026-08-25",
    updatedAt: "2026-08-26",
    addendumTo: "ai-consciousness-is-incoherent",
    tags: ["Artificial Intelligence", "Consciousness", "Philosophy of Mind", "Language"],
    articlePath: "posts/consciousness-is-incoherent/article.mdx",
    assetRegistryPath: "posts/consciousness-is-incoherent/assets.json",
  };
}

async function renderPage() {
  const rootRoute = createRootRoute({ component: Outlet });
  const writingRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/writing/$slug",
    component: () => <ArticleContent article={consciousnessArticle()} />,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([writingRoute]),
    history: createMemoryHistory({ initialEntries: ["/writing/consciousness-is-incoherent"] }),
  });
  await router.load();
  return render(<RouterProvider router={router} />);
}

describe("AI's Consciousness explanation published page", () => {
  it("renders the dedicated essay page and publication metadata", async () => {
    const { container } = await renderPage();

    expect(container.querySelector(".article-outline__header > .eyebrow")).toHaveTextContent("Addendum");
    expect(screen.getByRole("heading", { level: 1, name: "AI's Consciousness explanation" })).toBeInTheDocument();
    expect(screen.getByText(/Machine consciousness claims become coherent/)).toBeInTheDocument();
    expect(screen.getByText("Published August 25, 2026")).toBeInTheDocument();
    expect(screen.getByText("August 26, 2026")).toHaveAttribute("datetime", "2026-08-26");
    expect(screen.getByRole("list", { name: "Topics" }).children).toHaveLength(4);
    const parentArticleLinks = screen.getAllByRole("link", { name: "AI Consciousness Is Incoherent" });
    expect(parentArticleLinks).toHaveLength(3);
    for (const parentArticleLink of parentArticleLinks) {
      expect(parentArticleLink).toHaveAttribute("href", "/writing/ai-consciousness-is-incoherent");
    }
  });

  it("renders the competing theories, logical form, and evidentiary standard", async () => {
    await renderPage();

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

  it("links the primary sources through article link previews", async () => {
    await renderPage();

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

  it("opens with a preface and the restored original prompt without rewriting its wording", async () => {
    await renderPage();

    const preface = screen.getByRole("heading", { name: "Preface" });
    const firstSection = screen.getByRole("heading", { name: "The question collapses too soon" });

    expect(preface.compareDocumentPosition(firstSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByText("00", { selector: ".article-outline__index" })).toBeInTheDocument();
    expect(screen.getByText(/same surrounding file context later used to develop/)).toBeInTheDocument();
    expect(screen.getByText(/ability to potentially “be a real boy.”/)).toBeInTheDocument();
    expect(screen.getByText(/its own “reasoning,” “problem solving,” “thought process,” or “consciousness.”/)).toBeInTheDocument();
    expect(screen.getByText(/“kind-a-sort-a” is conscious probably contributes to AI psychosis/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Original Prompt" })).toBeInTheDocument();
    expect(screen.getByText("I need to add a new blog page and article with this:")).toBeInTheDocument();
    expect(screen.getByText(/measures of nueral activity in the brain/)).toBeInTheDocument();
    expect(screen.getByText(/all claims of machine consiosness are dependent on hypotheticals/)).toBeInTheDocument();
    expect(screen.getByText(/notes in the exisitng blogs for that too/)).toBeInTheDocument();
  });
});
