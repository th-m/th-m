import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NeuralNetAnimation } from "../src/NeuralNetAnimation";
import { sceneFixture } from "./fixture";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("NeuralNetAnimation", () => {
  it("renders declarative nodes, edges, layers, and inspection attributes", () => {
    const { container } = render(<NeuralNetAnimation scene={sceneFixture()} reducedMotion="never" />);
    const scene = screen.getByLabelText(/Animated neural network: Declarative scene/);
    expect(scene).toHaveAttribute("data-step-id", "observe");
    expect(scene).toHaveAttribute("data-snapshot-id", "before");
    expect(scene).toHaveAttribute("data-iteration-id", "first");
    expect(container.querySelectorAll("[data-node-id]")).toHaveLength(6);
    expect(container.querySelector('[data-layer-id="left"]')).toHaveClass("fixture-layer");
    const edge = container.querySelector('path[data-edge-id="a--c"]');
    expect(edge).toHaveAttribute("data-from", "a");
    expect(edge).toHaveAttribute("data-to", "c");
    expect(edge).toHaveAttribute("data-route", "between-nodes");
  });

  it("resolves each frame from its named snapshot without carrying prior classes", () => {
    const { container } = render(<NeuralNetAnimation scene={sceneFixture()} reducedMotion="never" />);
    expect(container.querySelector('[data-node-id="c"].nnl-node')).toHaveClass("frame-node");
    expect(screen.getByLabelText("Right layer, C: 0.30")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Step 2 of 2: Change/ }));
    expect(container.querySelector('[data-node-id="c"].nnl-node')).not.toHaveClass("frame-node");
    expect(screen.getByLabelText("C has a positive value")).toBeInTheDocument();
    expect(container.querySelector('[data-node-id="c"] .nnl-node__value')).toHaveTextContent("+");
  });

  it("composes static and frame-specific node, edge, and value-bar classes", () => {
    const { container } = render(<NeuralNetAnimation scene={sceneFixture()} reducedMotion="never" />);
    expect(container.querySelector('[data-node-id="a"].nnl-node')).toHaveClass("fixture-node");
    expect(container.querySelector('path[data-edge-id="a--c"]')).toHaveClass("fixture-edge", "frame-edge");
    expect(container.querySelector('.nnl__prob[data-node-id="c"]')).toHaveClass("frame-bar");
    expect(container.querySelector('[data-value-bar-group="outputs"]')).toHaveClass("fixture-bars");
  });

  it("uses outside routes and frame visibility for annotations", () => {
    const { container } = render(<NeuralNetAnimation scene={sceneFixture()} reducedMotion="never" />);
    expect(container.querySelector('path[data-edge-id="c--d"]')).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Step 2 of 2: Change/ }));
    const annotation = container.querySelector('path[data-edge-id="c--d"]');
    expect(annotation).toHaveAttribute("data-route", "outside-right");
    expect(annotation).toHaveClass("annotation-edge");
    expect(container.querySelector(".nnl-edge__label")).toHaveTextContent("changed");
  });

  it("advances across iteration boundaries while keeping numbered steps reusable", () => {
    render(<NeuralNetAnimation scene={sceneFixture()} reducedMotion="never" />);
    fireEvent.click(screen.getByRole("button", { name: /Step 2 of 2: Change/ }));
    fireEvent.click(screen.getByRole("button", { name: "Next step" }));
    const scene = screen.getByLabelText(/Animated neural network: Declarative scene/);
    expect(scene).toHaveAttribute("data-iteration-id", "second");
    expect(scene).toHaveAttribute("data-step-id", "observe");
    expect(screen.getByRole("status")).toHaveTextContent("second iteration");
  });

  it("autoplays once when looping is disabled and stops on the final frame", () => {
    vi.useFakeTimers();
    render(<NeuralNetAnimation scene={sceneFixture()} reducedMotion="never" loop={false} />);
    const scene = screen.getByLabelText(/Animated neural network: Declarative scene/);

    expect(screen.getByRole("button", { name: "Pause the animation" })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1_150 * 3));
    expect(scene).toHaveAttribute("data-iteration-id", "second");
    expect(scene).toHaveAttribute("data-step-id", "change");
    expect(screen.getByRole("button", { name: "Play the animation" })).toBeInTheDocument();
  });

  it("starts on the final frame of the final iteration under reduced motion", () => {
    render(<NeuralNetAnimation scene={sceneFixture()} reducedMotion="always" />);
    const scene = screen.getByLabelText(/Animated neural network: Declarative scene/);
    expect(scene).toHaveAttribute("data-iteration-id", "second");
    expect(scene).toHaveAttribute("data-step-id", "change");
    expect(scene).toHaveAttribute("data-snapshot-id", "after");
  });

  it("pauses autoplay after direct navigation and exposes accessible step labels", () => {
    render(<NeuralNetAnimation scene={sceneFixture()} reducedMotion="always" />);
    fireEvent.click(screen.getByRole("button", { name: /Step 1 of 2: Observe/ }));
    expect(screen.getByRole("button", { name: "Play the animation" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("status")).toHaveTextContent("Observe");
  });
});
