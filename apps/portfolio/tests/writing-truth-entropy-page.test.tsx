import { fireEvent, render, screen } from "@testing-library/react";
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
import { ToolDrawerProvider } from "../src/tools/ToolDrawerProvider";

vi.mock("@th-m/graph-visualization", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@th-m/graph-visualization")>();
  return {
    ...actual,
    PropositionGraphFigure: () => <div data-testid="proposition-graph-figure" />,
  };
});

function truthEntropyArticle(): PublishedArticle {
  return {
    slug: "truth-entropy-and-inference",
    title: "Truth, Entropy & Inference",
    description: "Why some language reliably predicts useful answers.",
    publishedAt: "2026-08-21",
    tags: ["Artificial Intelligence", "Language Models", "Information Theory", "Software Systems"],
    articlePath: "posts/truth-entropy-and-inference/article.md",
    markdown: "# Truth, Entropy & Inference\n\nBody.\n",
  };
}

async function renderPage() {
  const rootRoute = createRootRoute({
    component: () => (
      <ToolDrawerProvider>
        <Outlet />
      </ToolDrawerProvider>
    ),
  });
  const writingRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/writing/$slug",
    component: () => <ArticleContent article={truthEntropyArticle()} />,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([writingRoute]),
    history: createMemoryHistory({ initialEntries: ["/writing/truth-entropy-and-inference"] }),
  });
  await router.load();
  return render(<RouterProvider router={router} />);
}

describe("Truth, Entropy & Inference language visualization", () => {
  it("lets a term of art direct the response without conflating the choice with the ambiguity meter", async () => {
    await renderPage();

    expect(screen.getByRole("combobox", { name: "Example domain" })).toHaveValue("sorting");
    expect(screen.getByRole("heading", { name: "Choose the language that directs the response" })).toBeInTheDocument();
    for (const option of [
      "Plain language: put the numbers in order",
      "Slang: clean this list up",
      "Colloquial: sort it out",
      "Adjacent domain: rank the entries",
      "Term of art: stable counting sort",
    ]) {
      expect(screen.getByRole("radio", { name: option })).toBeInTheDocument();
    }

    expect(screen.getByRole("radio", { name: "Plain language: put the numbers in order" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("meter", { name: "Possible response directions" })).toHaveAttribute(
      "aria-valuenow",
      "4.8",
    );
    expect(screen.getByText("Broad response")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: "Term of art: stable counting sort" }));

    expect(screen.getByRole("radio", { name: "Term of art: stable counting sort" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("meter", { name: "Possible response directions" })).toHaveAttribute(
      "aria-valuenow",
      "1.8",
    );
    expect(screen.getByText("Domain response activated — stable counting sort")).toBeInTheDocument();
    expect(screen.getByText(/Use a stable counting sort for bounded integer keys/)).toBeInTheDocument();
  });

  it("supplies domain-specific language choices for design and business strategy", async () => {
    await renderPage();
    const domain = screen.getByRole("combobox", { name: "Example domain" });

    fireEvent.change(domain, { target: { value: "design" } });
    expect(screen.getByRole("radio", { name: "Plain language: make the checkout easier to use" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Slang: give it some polish" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Adjacent domain: optimize the conversion funnel" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Term of art: accessible checkout-flow redesign" })).toBeInTheDocument();

    fireEvent.change(domain, { target: { value: "business" } });
    expect(screen.getByRole("radio", { name: "Plain language: make more money" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Slang: pour gas on growth" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Adjacent domain: increase throughput" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Term of art: net revenue retention" })).toBeInTheDocument();
  });

  it("catalogs cybersecurity, manufacturing, and inventory terms of art", async () => {
    await renderPage();
    const domain = screen.getByRole("combobox", { name: "Example domain" });

    fireEvent.change(domain, { target: { value: "cybersecurity" } });
    expect(screen.getByRole("radio", { name: "Term of art: phishing-resistant MFA" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "The domain is administrative access" }));
    expect(screen.getByText("Domain response activated — phishing-resistant MFA")).toBeInTheDocument();

    fireEvent.change(domain, { target: { value: "manufacturing" } });
    expect(screen.getByRole("radio", { name: "Term of art: poka-yoke the assembly step" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: "Term of art: poka-yoke the assembly step" }));
    expect(screen.getByText("Domain response activated — poka-yoke the assembly step")).toBeInTheDocument();

    fireEvent.change(domain, { target: { value: "inventory" } });
    expect(screen.getByRole("radio", { name: "Term of art: reorder point with safety stock" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: "Term of art: reorder point with safety stock" }));
    expect(screen.getByText("Domain response activated — reorder point with safety stock")).toBeInTheDocument();
  });

  it("catalogs UX, visual-design, and branding terms of art", async () => {
    await renderPage();

    const scenarios = [
      {
        id: "error-recovery",
        label: "Error recovery",
        term: "design for error recovery",
      },
      {
        id: "information-scent",
        label: "Information scent",
        term: "strengthen information scent",
      },
      {
        id: "visual-hierarchy",
        label: "Visual hierarchy",
        term: "establish a clear visual hierarchy",
      },
      {
        id: "readable-measure",
        label: "Readable measure",
        term: "set a readable measure",
      },
      {
        id: "branding",
        label: "Branding",
        term: "activate distinctive brand assets",
      },
    ] as const;
    const domain = screen.getByRole("combobox", { name: "Example domain" });

    for (const scenario of scenarios) {
      fireEvent.change(domain, { target: { value: scenario.id } });
      expect(screen.getByRole("radio", { name: `Term of art: ${scenario.term}` })).toBeInTheDocument();
      fireEvent.click(screen.getByRole("radio", { name: `Term of art: ${scenario.term}` }));
      expect(screen.getByText(`Domain response activated — ${scenario.term}`)).toBeInTheDocument();
    }
  });
});
