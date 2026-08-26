import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EmbeddingSpaceVisualization } from "../src";
import { EmbeddingCompositionExplorer } from "../src/composition";

const compositionScene = vi.hoisted(() => ({
  unavailable: false,
}));

const deferredObservers: DeferredIntersectionObserver[] = [];
const defaultIntersectionObserver = window.IntersectionObserver;

class DeferredIntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [0.01];
  target: Element | null = null;

  constructor(readonly callback: IntersectionObserverCallback) {
    deferredObservers.push(this);
  }

  observe(target: Element) { this.target = target; }
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
}

function revealCompositionScene() {
  const observer = deferredObservers.at(-1);
  if (!observer?.target) throw new Error("The composition explorer did not register its viewport observer.");
  act(() => observer.callback(
    [{ isIntersecting: true, target: observer.target } as IntersectionObserverEntry],
    observer as unknown as IntersectionObserver,
  ));
}

vi.mock("../src/EmbeddingCompositionScene3D", async () => {
  const React = await import("react");
  return {
    EmbeddingCompositionScene3D({ onUnavailable }: {
      onUnavailable: () => void;
    }) {
      React.useEffect(() => {
        if (compositionScene.unavailable) onUnavailable();
      }, [onUnavailable]);
      return <div data-testid="mock-composition-3d-scene" />;
    },
  };
});

function expectComposition(equation: string) {
  expect(screen.getByLabelText("Combined embedding result").textContent?.replace(/\s/g, "")).toBe(
    equation.replace(/\s/g, ""),
  );
}

function setCompositionTerm(slot: number, term: string) {
  fireEvent.change(screen.getByRole("combobox", { name: `Composition term ${slot}` }), { target: { value: term } });
}

beforeEach(() => {
  deferredObservers.length = 0;
  window.IntersectionObserver = DeferredIntersectionObserver as unknown as typeof IntersectionObserver;
});

afterEach(() => {
  cleanup();
  compositionScene.unavailable = false;
  window.IntersectionObserver = defaultIntersectionObserver;
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("EmbeddingSpaceVisualization", () => {
  it("provides accessible map, selection, metadata, and non-visual summary", () => {
    const { container } = render(<EmbeddingSpaceVisualization />);
    expect(screen.getByRole("heading", { level: 1, name: "Meaning has neighborhoods, not addresses." })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Two-dimensional PCA projection of curated GPT-2 token embeddings" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /king, People & roles, single static token/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Learned static token row")).toBeInTheDocument();
    expect(screen.getByText("Nearest in source space")).toBeInTheDocument();
    expect(container.querySelector("table caption")).toHaveTextContent("king selected");
  });

  it("searches, selects a pooled term, and explains an unsupported term", () => {
    render(<EmbeddingSpaceVisualization />);
    const search = screen.getByLabelText("Find a word or token");
    fireEvent.change(search, { target: { value: "ice cream" } });
    fireEvent.click(screen.getByRole("option", { name: /ice cream.*2 tokens.*pooled/i }));
    expect(screen.getByRole("heading", { level: 2, name: "ice cream" })).toBeInTheDocument();
    expect(screen.getByText("Illustrative mean of 2 tokens")).toBeInTheDocument();

    fireEvent.change(search, { target: { value: "unicorn" } });
    expect(screen.getByText(/outside this curated offline dataset/)).toHaveTextContent("Token boundaries vary");
  });

  it("applies, compares, and resets a source-space transformation", () => {
    const { container } = render(<EmbeddingSpaceVisualization />);
    fireEvent.click(screen.getByRole("button", { name: /Apply operation/ }));
    expect(screen.getByText("New source-space neighbors")).toBeInTheDocument();
    expect(screen.getByText("Base ↔ result")).toBeInTheDocument();
    expect(container.querySelector(".embedding-space__displacement")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Hide comparison" }));
    expect(container.querySelector(".embedding-space__displacement")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Show comparison" }));
    expect(container.querySelector(".embedding-space__displacement")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reset vector" }));
    expect(screen.getByText("Nearest in source space")).toBeInTheDocument();
    expect(container.querySelector(".embedding-space__transformed-point")).not.toBeInTheDocument();
  });

  it("supports keyboard selection between plot points", () => {
    render(<EmbeddingSpaceVisualization />);
    const queen = screen.getByRole("button", { name: /queen, People & roles, single static token/ });
    queen.focus();
    fireEvent.keyDown(queen, { key: "Enter" });
    expect(queen).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { level: 2, name: "queen" })).toBeInTheDocument();
  });

  it("honors reduced motion in runtime state and rendered transformation", () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const { container } = render(<EmbeddingSpaceVisualization />);
    expect(container.querySelector(".embedding-space")).toHaveAttribute("data-reduced-motion", "true");
    fireEvent.click(screen.getByRole("button", { name: /Apply operation/ }));
    expect(container.querySelector("animateTransform")).not.toBeInTheDocument();
  });

  it("exposes cluster filters without changing the fixed projection", () => {
    render(<EmbeddingSpaceVisualization />);
    const filters = screen.getByRole("navigation", { name: "Filter semantic clusters" });
    const technology = within(filters).getByRole("button", { name: /Technology 10/ });
    fireEvent.click(technology);
    expect(technology).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("button", { name: /queen, People & roles/ })).not.toBeInTheDocument();
    expect(screen.getByText("10 / 72 entries")).toBeInTheDocument();
  });

  it("switches to the training lab and exposes stats, learned vectors, similarities, and analogies", async () => {
    render(<EmbeddingSpaceVisualization />);
    fireEvent.click(screen.getByRole("button", { name: /Train.*Co-occurrence teaching model/ }));

    expect(await screen.findByRole("heading", { level: 1, name: "Watch a neighborhood learn itself." })).toBeInTheDocument();
    const stats = screen.getByLabelText("Teaching corpus and model statistics");
    expect(stats).toHaveTextContent("43");
    expect(stats).toHaveTextContent("103");
    expect(stats).toHaveTextContent("16");
    expect(stats).toHaveTextContent("602");
    expect(screen.getByText("All 16 learned input-vector values at epoch 0")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Nearest learned neighbors" })).toBeInTheDocument();
    expect(screen.getByLabelText("Pairwise cosine similarity")).toBeInTheDocument();
    expect(screen.getByLabelText("Nearest analogy result")).toBeInTheDocument();
  });

  it("replays progressive checkpoints and allows direct checkpoint inspection", async () => {
    render(<EmbeddingSpaceVisualization initialMode="train" />);
    const start = await screen.findByRole("button", { name: /Start training replay/ });
    vi.useFakeTimers();
    fireEvent.click(start);
    expect(screen.getByRole("button", { name: "Pause replay" })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(370));
    expect(screen.getByText("Epoch 5 / 120")).toBeInTheDocument();

    const slider = screen.getByLabelText("Inspect checkpoint");
    fireEvent.change(slider, { target: { value: "24" } });
    expect(screen.getByText("Epoch 120 / 120")).toBeInTheDocument();
    expect(screen.getByLabelText("Nearest analogy result")).toHaveTextContent("cat");
  });

  it("warns for multi-token and unsupported training queries while selecting supported words", async () => {
    render(<EmbeddingSpaceVisualization initialMode="train" />);
    const query = await screen.findByLabelText("Word / query");
    fireEvent.change(query, { target: { value: "queen" } });
    fireEvent.click(screen.getByRole("button", { name: "Inspect" }));
    expect(screen.getByRole("heading", { level: 2, name: "queen" })).toBeInTheDocument();

    fireEvent.change(query, { target: { value: "ice cream" } });
    fireEvent.click(screen.getByRole("button", { name: "Inspect" }));
    expect(screen.getByRole("alert")).toHaveTextContent("splits into 2 whitespace tokens");

    fireEvent.change(query, { target: { value: "unicorn" } });
    fireEvent.click(screen.getByRole("button", { name: "Inspect" }));
    expect(screen.getByRole("alert")).toHaveTextContent("outside this fixed teaching vocabulary");
  });

  it("jumps to the final checkpoint when reduced motion is preferred", async () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    const { container } = render(<EmbeddingSpaceVisualization initialMode="train" />);
    fireEvent.click(await screen.findByRole("button", { name: /Start training replay/ }));
    expect(screen.getByText("Epoch 120 / 120")).toBeInTheDocument();
    expect(container.querySelector(".embedding-training")).toHaveAttribute("data-reduced-motion", "true");
  });
});

describe("EmbeddingCompositionExplorer", () => {
  it("stacks input vectors, composition, and result as non-wrapping arithmetic steps", async () => {
    const { VectorCompositionReadout } = await vi.importActual<
      typeof import("../src/EmbeddingCompositionScene3D")
    >("../src/EmbeddingCompositionScene3D");
    const { container } = render(
      <VectorCompositionReadout
        projection={{
          components: [
            { label: "man", vector: [-1.46, 1.12, -1.12] },
            { label: "royal", vector: [2.92, -0.25, 0.3] },
          ],
          location: [1.46, 0.87, -0.82],
          result: "king",
          method: "direction",
          resultKind: "exact",
        }}
      />,
    );

    const calculation = screen.getByRole("group", { name: "Vector composition calculation" });
    const stages = Array.from(calculation.querySelectorAll<HTMLElement>(".embedding-composition__algebra-step"));
    expect(stages.map((stage) => stage.dataset.stage)).toEqual(["input-vectors", "compose", "result"]);
    expect(stages.map((stage) => within(stage).getByRole("heading").textContent)).toEqual([
      "Input vectors",
      "Compose",
      "Result",
    ]);
    expect(container.querySelectorAll(".embedding-composition__assignment")).toHaveLength(5);
    expect(within(stages[0]!).getByText("v(man) = [-1.46, 1.12, -1.12]")).toHaveClass(
      "embedding-composition__assignment",
    );
  });

  it("keeps four stable vocabulary slots and defers its three-dimensional network until it enters the viewport", () => {
    render(<EmbeddingCompositionExplorer />);

    expectComposition("man+royal=king");
    expect(screen.getByText("3D semantic network")).toBeInTheDocument();
    expect(screen.getByText(/loads when this explorer enters the viewport/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "2D projection" })).not.toBeInTheDocument();
    expect(screen.queryByTestId("mock-composition-3d-scene")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove man term" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove royal term" })).toBeInTheDocument();
    const slots = screen.getAllByRole("combobox");
    expect(slots).toHaveLength(4);
    expect(slots[0]).toHaveValue("man");
    expect(slots[1]).toHaveValue("royal");
    expect(slots[2]).toHaveValue("");
    expect(slots[3]).toHaveValue("");
    const optionCounts = slots.map((slot) => within(slot).getAllByRole("option").length);
    expect(new Set(optionCounts).size).toBe(1);
    for (const slot of slots) {
      expect(within(slot).getByRole("option", { name: "young" })).toBeInTheDocument();
      expect(within(slot).getByRole("option", { name: "feminine" })).toBeInTheDocument();
      expect(within(slot).getByRole("option", { name: "tiger" })).toBeInTheDocument();
      expect(within(slot).getByRole("option", { name: "knowledge" })).toBeInTheDocument();
    }
  });

  it("replaces any slot in place without changing sibling slots or their options", () => {
    render(<EmbeddingCompositionExplorer />);

    const status = screen.getByRole("combobox", { name: "Composition term 2" });
    expect(within(status).getByRole("option", { name: "noble" })).toBeInTheDocument();
    fireEvent.change(status, { target: { value: "noble" } });
    expectComposition("man+noble=lord");
    expect(screen.getByRole("combobox", { name: "Composition term 2" })).toHaveValue("noble");
    expect(screen.getByRole("combobox", { name: "Composition term 3" })).toHaveValue("");

    setCompositionTerm(1, "woman");
    expectComposition("woman+noble=lady");
    expect(screen.getByRole("combobox", { name: "Composition term 1" })).toHaveValue("woman");
    expect(within(screen.getByRole("combobox", { name: "Composition term 4" })).getByRole("option", { name: "divine" })).toBeInTheDocument();
  });

  it("composes multiple directions, clears pills without removing slots, and supports undo and reset", () => {
    render(<EmbeddingCompositionExplorer />);

    setCompositionTerm(3, "young");
    expectComposition("man+royal+young=prince");
    setCompositionTerm(4, "feminine");
    expectComposition("man+royal+young+feminine=princess");

    fireEvent.click(screen.getByRole("button", { name: "Remove royal term" }));
    expectComposition("man+young+feminine=girl");
    expect(screen.getByRole("combobox", { name: "Composition term 2" })).toHaveValue("");
    expect(screen.getAllByRole("combobox")).toHaveLength(4);

    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expectComposition("man+royal+young+feminine=princess");
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expectComposition("man+royal=king");
  });

  it("keeps all four empty slots available after every pill is removed", () => {
    render(<EmbeddingCompositionExplorer />);
    fireEvent.click(screen.getByRole("button", { name: "Remove man term" }));
    fireEvent.click(screen.getByRole("button", { name: "Remove royal term" }));
    expect(screen.getByLabelText("Combined embedding result")).toHaveTextContent("Choose a starting term");
    const roleOptions = screen.getByRole("combobox", { name: "Composition term 1" });
    expect(within(roleOptions).queryByRole("option", { name: "king" })).not.toBeInTheDocument();
    expect(within(roleOptions).queryByRole("option", { name: "princess" })).not.toBeInTheDocument();
    setCompositionTerm(1, "boy");
    expectComposition("boy=boy");
    setCompositionTerm(2, "royal");
    expectComposition("boy+royal=prince");
  });

  it("offers a broader ingredient vocabulary without exposing derived results as new inputs", () => {
    render(<EmbeddingCompositionExplorer />);
    const creatureOptions = screen.getByRole("combobox", { name: "Composition term 3" });
    for (const ingredient of [
      "wolf", "bear", "owl", "snake", "deer", "cat", "dog", "fox", "shark", "tiger", "raven",
      "knowledge", "courage", "freedom", "order", "chaos", "memory", "time", "mystery",
      "justice", "truth", "beauty", "power", "hope", "fear", "love", "reason",
    ]) {
      expect(within(creatureOptions).getByRole("option", { name: ingredient })).toBeInTheDocument();
    }
    for (const endpoint of [
      "werewolf", "owlbear", "catfish", "puppy", "wisdom", "sphinx", "omniscience", "understanding", "legitimacy",
    ]) {
      expect(within(creatureOptions).queryByRole("option", { name: endpoint })).not.toBeInTheDocument();
    }

    setCompositionTerm(1, "cat");
    setCompositionTerm(2, "fish");
    expectComposition("cat+fish=catfish");
  });

  it("composes abstract terms with one another and with concrete vocabulary", () => {
    render(<EmbeddingCompositionExplorer />);
    setCompositionTerm(1, "knowledge");
    setCompositionTerm(2, "time");
    expectComposition("knowledge+time=wisdom");

    setCompositionTerm(1, "mystery");
    setCompositionTerm(2, "cat");
    expectComposition("mystery+cat=sphinx");
  });

  it("lazy-loads the semantic network on viewport entry and preserves the active composition", async () => {
    render(<EmbeddingCompositionExplorer />);
    setCompositionTerm(2, "feminine");
    expectComposition("man+feminine=woman");
    expect(screen.queryByTestId("mock-composition-3d-scene")).not.toBeInTheDocument();

    revealCompositionScene();
    expect(await screen.findByTestId("mock-composition-3d-scene")).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "3D camera controls" })).not.toBeInTheDocument();
    expect(screen.queryByText(/Drag to orbit/i)).not.toBeInTheDocument();
    expect(document.querySelector(".embedding-composition figcaption")).not.toBeInTheDocument();
    expectComposition("man+feminine=woman");
  });

  it("names the nearest projected point after the lazy network data becomes available", async () => {
    render(<EmbeddingCompositionExplorer />);
    setCompositionTerm(3, "tiger");
    expectComposition("man+royal+tiger=projectedpoint");

    revealCompositionScene();
    await waitFor(() => expectComposition("man+royal+tiger=owlbear"));
    expect(screen.getAllByRole("combobox")).toHaveLength(4);
  });

  it("builds mythical and animal pair recipes from the same Add section", async () => {
    render(<EmbeddingCompositionExplorer />);
    setCompositionTerm(2, "horse");
    expectComposition("man+horse=centaur");
    expect(screen.queryByText("Mythical blends")).not.toBeInTheDocument();

    setCompositionTerm(1, "young");
    setCompositionTerm(2, "horse");
    expectComposition("young+horse=foal");

    setCompositionTerm(1, "fish");
    expectComposition("fish+horse=seahorse");

    setCompositionTerm(1, "lion");
    setCompositionTerm(2, "eagle");
    expectComposition("lion+eagle=griffin");
    expect(screen.getByRole("combobox", { name: "Composition term 1" })).toHaveValue("lion");
    expect(screen.getByRole("combobox", { name: "Composition term 2" })).toHaveValue("eagle");
    setCompositionTerm(2, "fish");
    expectComposition("lion+fish=lionfish");

    revealCompositionScene();
    expect(await screen.findByTestId("mock-composition-3d-scene")).toBeInTheDocument();
    expectComposition("lion+fish=lionfish");
  });

  it("preserves the active composition controls when WebGL is unavailable", async () => {
    compositionScene.unavailable = true;
    render(<EmbeddingCompositionExplorer />);
    revealCompositionScene();
    expect(await screen.findByText(/3D semantic network is unavailable in this browser/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "2D projection" })).not.toBeInTheDocument();
    expectComposition("man+royal=king");
  });
});
