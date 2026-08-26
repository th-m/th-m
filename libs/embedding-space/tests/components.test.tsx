import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EmbeddingSpaceVisualization } from "../src";
import { EmbeddingCompositionExplorer } from "../src/composition";

const compositionScene = vi.hoisted(() => ({
  unavailable: false,
  rotate: vi.fn(),
  reset: vi.fn(),
}));

vi.mock("../src/EmbeddingCompositionScene3D", async () => {
  const React = await import("react");
  return {
    EmbeddingCompositionScene3D({ onControlsReady, onUnavailable }: {
      onControlsReady: (controls: { rotate: typeof compositionScene.rotate; reset: typeof compositionScene.reset } | null) => void;
      onUnavailable: () => void;
    }) {
      React.useEffect(() => {
        if (compositionScene.unavailable) onUnavailable();
        else onControlsReady({ rotate: compositionScene.rotate, reset: compositionScene.reset });
        return () => onControlsReady(null);
      }, [onControlsReady, onUnavailable]);
      return <div data-testid="mock-composition-3d-scene" />;
    },
  };
});

function expectComposition(equation: string) {
  expect(screen.getByLabelText("Combined embedding result").textContent?.replace(/\s/g, "")).toBe(
    equation.replace(/\s/g, ""),
  );
}

afterEach(() => {
  cleanup();
  compositionScene.unavailable = false;
  compositionScene.rotate.mockClear();
  compositionScene.reset.mockClear();
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
  it("starts with a lightweight two-dimensional projection and all eight role terms", () => {
    render(<EmbeddingCompositionExplorer />);

    expectComposition("man+royal=king");
    expect(
      screen.getByRole("img", {
        name: /man plus royal equals king on an illustrative two-dimensional semantic projection/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2D projection" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByTestId("mock-composition-3d-scene")).not.toBeInTheDocument();
    expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual([
      "man", "woman", "boy", "girl", "king", "queen", "prince", "princess",
    ]);
    expect(screen.getByRole("img")).toHaveTextContent("man / woman");
    expect(screen.getByRole("img")).toHaveTextContent("king / queen");
  });

  it("composes multiple axes, prevents repeated axes, and supports undo and reset", () => {
    render(<EmbeddingCompositionExplorer />);

    fireEvent.click(screen.getByRole("button", { name: "Add young age direction" }));
    expectComposition("man+royal+young=prince");
    expect(screen.queryByRole("button", { name: /Add .* status direction/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Add .* age direction/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expectComposition("man+royal=king");
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expectComposition("man=man");
  });

  it("resets the path when the starting term changes and composes king plus young", () => {
    render(<EmbeddingCompositionExplorer />);
    fireEvent.change(screen.getByLabelText("Starting embedding term"), { target: { value: "king" } });
    expectComposition("king=king");
    fireEvent.click(screen.getByRole("button", { name: "Add young age direction" }));
    expectComposition("king+young=prince");
  });

  it("lazy-loads the semantic network, adds the third direction, and exposes keyboard camera controls", async () => {
    render(<EmbeddingCompositionExplorer />);
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    fireEvent.click(screen.getByRole("button", { name: "3D semantic network" }));
    expect(await screen.findByTestId("mock-composition-3d-scene")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3D semantic network" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Add feminine role convention direction" }));
    expectComposition("man+feminine=woman");

    fireEvent.click(screen.getByRole("button", { name: "Rotate 3D view left" }));
    expect(compositionScene.rotate).toHaveBeenCalledWith(-Math.PI / 12, 0);
    fireEvent.click(screen.getByRole("button", { name: "Reset view" }));
    expect(compositionScene.reset).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "2D projection" }));
    expectComposition("man+feminine=woman");
    expect(screen.getByText("+ feminine is hidden in 2D")).toBeInTheDocument();
  });

  it("composes authored animal blends into mythical creatures and preserves them across projections", async () => {
    render(<EmbeddingCompositionExplorer />);
    fireEvent.click(screen.getByRole("button", { name: "3D semantic network" }));
    expect(await screen.findByTestId("mock-composition-3d-scene")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Compose man plus horse as centaur" }));
    expectComposition("man+horse=centaur");
    fireEvent.click(screen.getByRole("button", { name: "Compose woman plus fish as mermaid" }));
    expectComposition("woman+fish=mermaid");
    fireEvent.click(screen.getByRole("button", { name: "Compose girl plus hummingbird as pixie" }));
    expectComposition("girl+hummingbird=pixie");

    fireEvent.click(screen.getByRole("button", { name: "2D projection" }));
    expectComposition("girl+hummingbird=pixie");
    expect(screen.getByText("+ hummingbird → pixie is outside the 2D role projection")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expectComposition("girl=girl");
  });

  it("falls back to the active two-dimensional composition when WebGL is unavailable", async () => {
    compositionScene.unavailable = true;
    render(<EmbeddingCompositionExplorer />);
    fireEvent.click(screen.getByRole("button", { name: "3D semantic network" }));
    expect(await screen.findByText(/3D is unavailable in this browser/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2D projection" })).toHaveAttribute("aria-pressed", "true");
    expectComposition("man+royal=king");
  });
});
