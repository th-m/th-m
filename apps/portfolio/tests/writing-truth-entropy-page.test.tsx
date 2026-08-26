import { fireEvent, render, screen } from "@testing-library/react";
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
  it("opens with a concise statement of the argument", async () => {
    await renderPage();

    expect(screen.getByRole("heading", { name: "Fluency follows constraint." })).toBeInTheDocument();
    expect(screen.getByText(/Language records what a domain rewards and rejects/i)).toHaveTextContent(
      /Strong feedback makes fluent output informative; weak feedback makes it merely plausible/i,
    );
    expect(screen.getByText(/how do communities compress tested distinctions into language/i)).toBeInTheDocument();
    expect(screen.getByText(/The answer connects forms of truth to embeddings, entropy, and prompting/i)).toBeInTheDocument();
    expect(screen.queryByText(/The practical destination is an intuition for working with AI/i)).not.toBeInTheDocument();
  });

  it("consolidates the plausible-continuation example into the introduction", async () => {
    await renderPage();

    expect(screen.queryByRole("heading", { name: "Plausible Continuation" })).not.toBeInTheDocument();
    expect(screen.getByText("Implement hash-based sorting for this array.")).toBeInTheDocument();
    expect(screen.getByText("Efficiently organize these numbers.")).toBeInTheDocument();
    expect(screen.getByText(/carries a higher and more useful information density/i)).toHaveTextContent(
      /assumptions still have to fit the problem/i,
    );
    expect(screen.queryByRole("heading", { name: "The Mystery of the Plausible Continuation" })).not.toBeInTheDocument();
    expect(screen.queryByText("Can you put these numbers in order? Be efficient.")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /Hash Sort.*Efficiently Organize/i })).not.toBeInTheDocument();
  });

  it("separates situated truth practices from the recurring composable trio", async () => {
    await renderPage();
    const heading = screen.getByRole("heading", { name: "Truth and Propositional Formulations" });
    const section = heading.closest("section");
    expect(section).not.toBeNull();
    expect(section?.querySelector("ul")).toBeNull();
    const situatedFigure = screen.getByRole("figure", {
      name: "Three situated truth practices shaped by experience, belief, and value",
    });
    const recurringFigure = screen.getByRole("figure", {
      name: "Three recurring truth practices that compose reusable problem-solving formulations",
    });
    expect(section?.querySelectorAll("figure")).toHaveLength(2);
    expect(Array.from(section?.querySelectorAll("figure") ?? [])).toEqual([situatedFigure, recurringFigure]);
    expect(situatedFigure).toHaveTextContent("Experience, belief, and value");
    expect(situatedFigure).toHaveTextContent("Relational / acquaintance");
    expect(situatedFigure).toHaveTextContent("Sincerity / truthfulness");
    expect(situatedFigure).toHaveTextContent("Trustworthiness Theory");
    expect(situatedFigure).not.toHaveTextContent("Teleological Theory");
    expect(situatedFigure).not.toHaveTextContent("Formal truth");
    expect(recurringFigure).toHaveTextContent("Coherence · Correspondence · Consequence");
    expect(recurringFigure).toHaveTextContent("Formal truth");
    expect(recurringFigure).toHaveTextContent("Empirical truth");
    expect(recurringFigure).toHaveTextContent("Operational truth");
    expect(recurringFigure).not.toHaveTextContent("Relational / acquaintance");
    expect(recurringFigure).toHaveTextContent(/Coherence\s*—\s*Does it fit\?/i);
    expect(recurringFigure).toHaveTextContent(/Correspondence\s*—\s*Does it match\?/i);
    expect(recurringFigure).toHaveTextContent(/Consequence\s*—\s*Does it work\?/i);
    expect(recurringFigure).toHaveTextContent(/observable state of affairs/i);
    expect(recurringFigure).toHaveTextContent(/reliable consequences under stated conditions/i);
    expect(section).toHaveTextContent(/Classical Confucian parallel/i);
    expect(section).toHaveTextContent(/chéng \(誠\)/i);
    expect(section).toHaveTextContent(/Biblical Hebrew parallel/i);
    expect(section).toHaveTextContent(/ʾemet \(אֱמֶת\)/i);
    expect(screen.getByRole("link", { name: /Chéng in classical Chinese thought/i })).toHaveAttribute(
      "href",
      "https://www.chinesethought.cn/EN/shuyu_show.aspx?shuyu_id=2126",
    );
    expect(screen.getByRole("link", { name: /ʾEmet in biblical Hebrew/i })).toHaveAttribute(
      "href",
      "https://www.thetorah.com/article/torat-emet-truth-spoken-through-the-humble-human-experience",
    );
    expect(section).toHaveTextContent(/subjective experience, belief, and personal or communal value/i);
    expect(section).toHaveTextContent(/before the next concrete problem instance is known/i);
    expect(
      screen
        .getAllByRole("link", { name: "Goals, Solutions & Value" })
        .some((link) => link.getAttribute("href") === "/writing/goals-solutions-and-value"),
    ).toBe(true);
    expect(section).toHaveTextContent(/ought not be trusted by either Sienna or Pearl/i);
    expect(section).not.toHaveTextContent(/true prop door/i);
    expect(screen.getAllByRole("link", { name: /Nonpropositional Truth/i })[0]).toHaveAttribute(
      "href",
      "https://www.youtube.com/watch?v=c9BFn4Kqj0E&t=1954s",
    );
    expect(screen.queryByRole("link", { name: /teleological/i })).not.toBeInTheDocument();
  });

  it("connects context, embedding coordinates, and output probabilities", async () => {
    await renderPage();

    const sectionHeadings = screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent);
    expect(sectionHeadings.indexOf("From Context to Coordinates to Probabilities")).toBeLessThan(
      sectionHeadings.indexOf("Entropy, Surprise, and Conditional Prediction"),
    );
    const sectionHeading = screen.getByRole("heading", { name: "From Context to Coordinates to Probabilities" });
    const section = sectionHeading.closest("section");
    expect(section).not.toBeNull();
    const sectionContent = section?.querySelector(".article-outline__content");
    const firstParagraph = sectionContent?.querySelector(":scope > p");
    const compositionExplorer = sectionContent?.querySelector("figure.embedding-composition");
    expect(firstParagraph?.nextElementSibling).toBe(compositionExplorer);
    expect(screen.getByText(/You shall know a word by the company it keeps/i)).toBeInTheDocument();
    expect(screen.getByText(/repeated context becomes geometry/i)).toBeInTheDocument();
    expect(section).toHaveTextContent(/biological/i);
    const memoryDisclosure = screen.getByText("Engram metaphor").closest("details");
    expect(memoryDisclosure).not.toBeNull();
    const contextualStateParagraph = [...(sectionContent?.querySelectorAll(":scope > p") ?? [])].find((paragraph) =>
      paragraph.textContent?.includes("An input embedding is only the starting state"),
    );
    expect(contextualStateParagraph?.nextElementSibling).toBe(memoryDisclosure);
    expect(memoryDisclosure).not.toHaveAttribute("open");
    fireEvent.click(screen.getByText("Engram metaphor"));
    expect(memoryDisclosure).toHaveAttribute("open");
    const memoryCard = screen.getByText("A helpful engram").closest(".thom-card");
    expect(memoryCard).not.toBeNull();
    expect(memoryCard?.querySelectorAll("li")).toHaveLength(3);
    expect(memoryCard).toHaveTextContent(/Biological engram — trace/i);
    expect(memoryCard).toHaveTextContent(/Token embedding — parameter/i);
    expect(memoryCard).toHaveTextContent(/Vector-indexed record — record and address/i);
    expect(memoryCard).toHaveTextContent(/trace · parameter · record/i);
    expect(screen.getByRole("link", { name: "Engram research" })).toHaveAttribute(
      "href",
      "https://www.nature.com/articles/nrn4000",
    );
    expect(screen.getByText(/close under learned usage, not necessarily true/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /A Synopsis of Linguistic Theory/i })).toHaveAttribute(
      "href",
      "https://languagelog.ldc.upenn.edu/myl/Firth1957.pdf",
    );
    expect(screen.getByRole("link", { name: /Distributional Structure/i })).toHaveAttribute(
      "href",
      "https://www.its.caltech.edu/~matilde/ZelligHarrisDistributionalStructure1954.pdf",
    );
    expect(screen.getByRole("link", { name: /2013 Word2Vec paper/i })).toHaveAttribute(
      "href",
      "https://research.google/pubs/efficient-estimation-of-word-representations-in-vector-space/",
    );
    expect(
      screen.getByText(
        "Token ID → input embedding → contextual hidden state → output logits → next-token probabilities.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("eᵢ = E[xᵢ] ∈ ℝᵈ")).toBeInTheDocument();
    expect(screen.queryByText("Training changes the map")).not.toBeInTheDocument();
    expect(screen.queryByText("Inference moves through the map")).not.toBeInTheDocument();
    expect(screen.getByText(/tokenizer assigns each token an integer ID/i)).toBeInTheDocument();
    expect(screen.getByText(/lowers them for sampled non-neighbors/i)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /from-scratch Word2Vec demonstration/i })).not.toBeInTheDocument();
    expect(screen.getByText("3D semantic network")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "2D projection" })).not.toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Composition term 1" })).toHaveValue("man");
    expect(screen.getByRole("combobox", { name: "Composition term 2" })).toHaveValue("royal");
    expect(screen.getByRole("combobox", { name: "Composition term 3" })).toHaveValue("");
    expect(screen.getByRole("combobox", { name: "Composition term 4" })).toHaveValue("");
    expect(screen.getByLabelText("Combined embedding result")).toHaveTextContent(/man\s*\+\s*royal\s*=\s*king/);
    expect(screen.getByText(/explorer compresses a much larger space into three hand-authored dimensions/i)).toBeInTheDocument();
    expect(section).not.toHaveTextContent(/WebGL scene/i);
    expect(section).not.toHaveTextContent(/Four equal term slots/i);
    expect(section).not.toHaveTextContent(/Derived endpoints/i);
    expect(screen.queryByRole("group", { name: "3D camera controls" })).not.toBeInTheDocument();
    expect(screen.queryByText(/Geometric intuition, not a guaranteed equation/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Remove royal term" }));
    fireEvent.click(screen.getByRole("button", { name: "Remove man term" }));
    const roleTerms = screen.getByRole("combobox", { name: "Composition term 1" });
    expect(roleTerms).not.toHaveTextContent("king");
    expect(roleTerms).not.toHaveTextContent("princess");
    fireEvent.change(roleTerms, { target: { value: "boy" } });
    fireEvent.change(screen.getByRole("combobox", { name: "Composition term 2" }), { target: { value: "royal" } });
    expect(screen.getByLabelText("Combined embedding result")).toHaveTextContent(/boy\s*\+\s*royal\s*=\s*prince/);
    expect(screen.getByRole("link", { name: /training walkthrough in Goals, Solutions & Value/i })).toHaveAttribute(
      "href",
      "/writing/goals-solutions-and-value",
    );
    expect(screen.queryByRole("button", { name: /Inspect a learned token embedding space/i })).not.toBeInTheDocument();
  });

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
    expect(screen.queryByLabelText("Assumptions activated")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "The domain is bounded integer keys" })).not.toBeInTheDocument();

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
    expect(screen.getByLabelText("Assumptions activated")).toHaveTextContent(
      "Bounded integer keys · Key range known and compact · Memory safety and stability required",
    );
  });

  it("shows how a compact technical instruction expands into an inspectable implementation", async () => {
    await renderPage();

    const figure = screen.getByRole("figure", {
      name: "Generative decompression from a compact prompt to a TypeScript implementation",
    });

    expect(figure).toHaveTextContent("hash sort");
    expect(figure).toHaveTextContent("in TypeScript");
    expect(figure).toHaveTextContent("Map-based frequency buckets");
    expect(figure).toHaveTextContent("Duplicate preservation");
    expect(figure).toHaveTextContent("export function hashSort");
    expect(figure).toHaveTextContent("O(n + k log k)");
    expect(figure).toHaveTextContent(/generative reconstruction, not lossless decoding/i);
  });

  it("explains how constraint moves from practice into language and back through evaluation", async () => {
    await renderPage();

    const figure = screen.getByRole("figure", {
      name: "Working hypothesis from correspondence through consequence and coherence to computation",
    });

    expect(figure).toHaveTextContent("Correspondence · Does it match?");
    expect(figure).toHaveTextContent("Labels are tested against the world");
    expect(figure).toHaveTextContent("Consequence · Does it work?");
    expect(figure).toHaveTextContent("Useful distinctions become efficient terms");
    expect(figure).toHaveTextContent("Coherence · Does it fit?");
    expect(figure).toHaveTextContent("Formal relations become machine-operable");
    expect(figure).toHaveTextContent("Resulting capability — not a fourth theory of truth");
    expect(figure).toHaveTextContent("Regrounding closes the loop");
    expect(figure).toHaveTextContent(/proof establishes derivability from stated premises/i);
    expect(figure).toHaveTextContent(/synthetic data are representative/i);
    expect(screen.getByText("Label. Operationalize. Formalize. Compute.")).toBeInTheDocument();
    expect(screen.getByText(/This computational ladder does not absorb the other truth practices/i)).toHaveTextContent(
      /neither exclusively theological nor merely private/i,
    );
    expect(screen.getByText(/This computational ladder does not absorb the other truth practices/i)).toHaveTextContent(
      /rigorous without becoming fully reducible to formal proof/i,
    );
    expect(screen.queryByRole("button", { name: "Fit graph" })).not.toBeInTheDocument();
  });

  it("returns from abstract coherence through consequence to worldly correspondence", async () => {
    await renderPage();

    const heading = screen.getByRole("heading", { name: "From Abstract to Actual" });
    const section = heading.closest("section");
    expect(section).not.toBeNull();
    expect(section).toHaveTextContent("Coherence · Consequence · Correspondence");
    expect(section).toHaveTextContent(/Is it correct within its semantic logic/i);
    expect(section).toHaveTextContent(/produce the intended outputs and survive the domain’s tests/i);
    expect(section).toHaveTextContent(/map back to an identifiable problem and its claimed real-world impact/i);
    expect(section).toHaveTextContent(/does it fit, does it work, and does it match/i);
    expect(screen.queryByText("Coherence · Correctness · Meaning")).not.toBeInTheDocument();
  });

  it("supplies domain-specific language choices for design and business strategy", async () => {
    await renderPage();
    const domain = screen.getByRole("combobox", { name: "Example domain" });

    fireEvent.change(domain, { target: { value: "design" } });
    expect(screen.getByText("“Make the checkout easier to use.”")).toBeInTheDocument();
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
    fireEvent.click(screen.getByRole("radio", { name: "Term of art: phishing-resistant MFA" }));
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
