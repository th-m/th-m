import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NeuralNetworkVisualization } from "../src";

const originalMatchMedia = window.matchMedia;

afterEach(() => {
  cleanup();
  Object.defineProperty(window, "matchMedia", { configurable: true, writable: true, value: originalMatchMedia });
  vi.useRealTimers();
});

describe("NeuralNetworkVisualization", () => {
  it("provides accessible stages, views, legend, and scientific caveat", () => {
    render(<NeuralNetworkVisualization />);

    const visualization = screen.getByRole("region", { name: "Interactive decoder-only language model visualization" });
    expect(visualization).toHaveAttribute("data-stage", "representations");
    expect(screen.getByRole("navigation", { name: "Visualization focus" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Whole decoder-only inference pipeline" })).toBeInTheDocument();
    expect(screen.getAllByText("Persistent learned parameter").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Temporary activation").length).toBeGreaterThan(0);
    expect(screen.getByText(/not a literal live trace/i)).toBeInTheDocument();
    expect(screen.getByText(/not ordinary steps in next-token inference/i)).toBeInTheDocument();
  });

  it("supports next, previous, direct stage selection, view focus, keyboard, and reset", () => {
    render(<NeuralNetworkVisualization />);
    const visualization = screen.getByRole("region", { name: "Interactive decoder-only language model visualization" });

    fireEvent.click(screen.getByRole("button", { name: "Next stage" }));
    expect(visualization).toHaveAttribute("data-stage", "residual-entry");

    fireEvent.keyDown(visualization, { key: "ArrowRight" });
    expect(visualization).toHaveAttribute("data-stage", "attention");
    expect(visualization).toHaveAttribute("data-view", "attention");

    fireEvent.click(screen.getByRole("button", { name: "Feed-forward" }));
    expect(visualization).toHaveAttribute("data-view", "feed-forward");

    fireEvent.click(screen.getByRole("button", { name: /Go to stage 10:/ }));
    expect(visualization).toHaveAttribute("data-stage", "decode");

    fireEvent.click(screen.getByRole("button", { name: "Previous stage" }));
    expect(visualization).toHaveAttribute("data-stage", "logits");

    fireEvent.click(screen.getByRole("button", { name: "Reset visualization" }));
    expect(visualization).toHaveAttribute("data-stage", "representations");
    expect(screen.getByRole("button", { name: /Go to stage 1:/ })).toHaveAttribute("aria-current", "step");
  });

  it("plays, pauses, and advances on a stable timer", () => {
    vi.useFakeTimers();
    render(<NeuralNetworkVisualization />);
    const visualization = screen.getByRole("region", { name: "Interactive decoder-only language model visualization" });

    fireEvent.click(screen.getByRole("button", { name: "Play animation" }));
    expect(screen.getByRole("button", { name: "Pause animation" })).toHaveAttribute("aria-pressed", "true");

    act(() => vi.advanceTimersByTime(1_800));
    expect(visualization).toHaveAttribute("data-stage", "residual-entry");

    fireEvent.click(screen.getByRole("button", { name: "Pause animation" }));
    act(() => vi.advanceTimersByTime(3_600));
    expect(visualization).toHaveAttribute("data-stage", "residual-entry");
  });

  it("disables autoplay and marks the rendering when motion is reduced", () => {
    render(<NeuralNetworkVisualization autoplay reducedMotion="always" />);
    const visualization = screen.getByRole("region", { name: "Interactive decoder-only language model visualization" });
    expect(visualization).toHaveAttribute("data-motion", "reduced");
    expect(screen.getByRole("button", { name: "Play animation" })).toHaveAttribute("aria-pressed", "false");
  });

  it("exposes a compact responsive state at the mobile media query", () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: (query: string) => ({
        matches: query === "(max-width: 760px)",
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }),
    });

    render(<NeuralNetworkVisualization />);
    expect(screen.getByRole("region", { name: "Interactive decoder-only language model visualization" })).toHaveAttribute("data-layout", "compact");
  });
});
