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
import { describe, expect, it } from "vitest";
import type { PublishedArticle } from "../src/content/blog-content";
import { ArticleContent } from "../src/writing/ArticleContent";
import { ToolDrawerProvider } from "../src/tools/ToolDrawerProvider";
import { ToolDrawer } from "../src/tools/ToolDrawer";

function truthCoherenceArticle(): PublishedArticle {
  return {
    slug: "truth-and-inference",
    title: "Truth and Coherence",
    description: "How meaningful inputs and testable consequences turn fluent AI output into work we can rely on.",
    publishedAt: "2026-08-22",
    updatedAt: "2026-09-23",
    tags: ["Artificial Intelligence", "Language Models", "Information Theory", "Software Systems"],
    articlePath: "posts/truth-and-inference/article.mdx",
    assetRegistryPath: "posts/truth-and-inference/assets.json",
  };
}

async function renderPage() {
  const rootRoute = createRootRoute({
    component: () => (
      <ToolDrawerProvider>
        <ToolDrawer />
        <Outlet />
      </ToolDrawerProvider>
    ),
  });
  const writingRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/writing/$slug",
    component: () => <ArticleContent article={truthCoherenceArticle()} />,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([writingRoute]),
    history: createMemoryHistory({ initialEntries: ["/writing/truth-and-inference"] }),
  });
  await router.load();
  return render(<RouterProvider router={router} />);
}

describe("Truth and Coherence article", () => {
  it("opens with the input problem and the central question", async () => {
    await renderPage();

    expect(screen.getByRole("heading", { level: 1, name: "Truth and Coherence" })).toBeInTheDocument();
    expect(screen.getByText(/The most dangerous prompt is often the one that already sounds solved\./)).toBeInTheDocument();
    expect(screen.getByText(/Our customers keep choosing the wrong columns/i)).toBeInTheDocument();
    expect(screen.getByText(/Customers submit files with unfamiliar headers/i)).toBeInTheDocument();
    expect(screen.getByText(/How do we recognize meaningful input and valuable output/i)).toBeInTheDocument();
  });

  it("separates the three truth tests and renders the term-of-art motif", async () => {
    await renderPage();

    const sectionHeading = screen.getByRole("heading", { name: "A Good Answer Can Be Wrong in Three Ways" });
    const section = sectionHeading.closest("section");
    expect(section).not.toBeNull();
    expect(section).toHaveTextContent(/Coherence asks: Does it fit?/i);
    expect(section).toHaveTextContent(/Correspondence asks: Does it match?/i);
    expect(section).toHaveTextContent(/Consequence asks: What happens when someone relies on it?/i);
    const truthPracticesFigure = screen.getByRole("figure", {
      name: "Three recurring truth practices for evaluating an AI-assisted claim",
    });
    expect(truthPracticesFigure).toHaveTextContent("Coherence · Correspondence · Consequence");
    for (const kind of ["coherence", "correspondence", "consequence"]) {
      expect(truthPracticesFigure.querySelector(`.ai-factory-icon--${kind}`)).toBeInstanceOf(SVGElement);
    }
    expect(truthPracticesFigure.querySelector("img")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Refinement and discipline establish a term of art" })).toBeInTheDocument();
    expect(section).toHaveTextContent(/chéng/i);
    expect(section).toHaveTextContent(/ʾemet/i);
  });

  it("connects distributional language, embeddings, and conditional prediction", async () => {
    const user = userEvent.setup();
    await renderPage();

    const sectionHeading = screen.getByRole("heading", { name: "The Right Term Changes the Prediction" });
    const section = sectionHeading.closest("section");
    expect(section).not.toBeNull();
    expect(section).toHaveTextContent(/You shall know a word by the company it keeps/i);
    expect(section).toHaveTextContent(/token IDs → input embeddings → contextual hidden states → output logits/i);
    expect(section?.querySelector("figure.embedding-composition")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "A grounded term can guide useful expansion" })).toBeInTheDocument();
    const groundedMotif = screen.getByRole("img", { name: /A grounded term can guide useful expansion/ });
    expect(groundedMotif.querySelector('[data-lane="grounded"]')).toBeInTheDocument();
    expect(groundedMotif.querySelector('[data-lane="ungrounded"]')).not.toBeInTheDocument();
    expect(section).toHaveTextContent(/These equations describe distributions. They do not measure truth/i);
    await user.click(screen.getByRole("button", { name: /Open the semantic composition tool/i }));
    expect(await screen.findByRole("heading", { name: "Semantic composition" })).toBeInTheDocument();
    expect(await screen.findByRole("figure", { name: "Interactive three-dimensional semantic composition teaching model" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Composition term 1" })).toHaveValue("man");
  });

  it("shows how domain constraints reject plausible work", async () => {
    await renderPage();

    const sectionHeading = screen.getByRole("heading", { name: "Domains Teach Language What to Reject" });
    const section = sectionHeading.closest("section");
    expect(section).not.toBeNull();
    expect(section).toHaveTextContent(/Label → operationalize → formalize → compute/i);
    expect(
      screen.getByRole("figure", {
        name: "Working hypothesis from correspondence through consequence and coherence to computation",
      }),
    ).toHaveTextContent(/Regrounding closes the loop/i);
    expect(section).toHaveTextContent(/evaluative closure/i);
    expect(section?.querySelector("h3")).toHaveTextContent("Vibes to a Typographic Specification");
    expect(section).toHaveTextContent(/optical profiles, stroke hierarchy, glyph silhouette, spacing/i);
  });

  it("carries the composite mapping case through evaluation and retained learning", async () => {
    await renderPage();

    const sectionHeading = screen.getByRole("heading", { name: "Paid Work Begins After Generation" });
    const section = sectionHeading.closest("section");
    expect(section).not.toBeNull();
    expect(section).toHaveTextContent(/composite example, not a report of measured revenue/i);
    expect(section).toHaveTextContent(/A technically valid mapping that creates expensive cleanup is a bad product result/i);
    expect(section).toHaveTextContent(/Supplied context/i);
    expect(section).toHaveTextContent(/Retained learning/i);
    expect(section).toHaveTextContent(/This describes a mechanism, not measured ROI/i);
  });

  it("ends with inspectable judgment and the regrounding question", async () => {
    await renderPage();

    const sectionHeading = screen.getByRole("heading", { name: "Make Judgment Local and Inspectable" });
    const section = sectionHeading.closest("section");
    expect(section).not.toBeNull();
    expect(section).toHaveTextContent(/What are we asking others to rely on?/i);
    expect(section).toHaveTextContent(/Inspect the input → generate candidates → discriminate among claims/i);
    expect(section).toHaveTextContent(/does it fit, does it work, and does it match the world we mean to change?/i);
    expect(screen.getByRole("heading", { name: "Sources" })).toBeInTheDocument();
  });
});
