import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { NeuralNetAnimation } from "../src/NeuralNetAnimation";
import { illustrativeScenario, neuralNetPhases } from "../src/model";

// All tests render with reduced motion so no animation timers run.

afterEach(() => {
  cleanup();
});

describe("NeuralNetAnimation", () => {
  it("renders a left-to-right network with every node", () => {
    const { container } = render(<NeuralNetAnimation reducedMotion="always" />);
    expect(screen.getByRole("img")).toBeInTheDocument();
    const nodeCount = illustrativeScenario.layerSizes.reduce((sum, count) => sum + count, 0);
    expect(container.querySelectorAll(".nnl-node")).toHaveLength(nodeCount);
  });

  it("renders output token labels and probability rows", () => {
    const { container } = render(<NeuralNetAnimation reducedMotion="always" />);
    expect(container.querySelector(".nnl-node__label")?.textContent).toBe("the");
    expect(container.querySelectorAll(".nnl__prob")).toHaveLength(2);
    expect(screen.getAllByText("story").length).toBeGreaterThan(0);
  });

  it("shows a static final frame under reduced motion", () => {
    render(<NeuralNetAnimation reducedMotion="always" />);
    expect(screen.getByRole("status")).toHaveTextContent("Selection");
  });

  it("labels training-only behavior in backprop copy and telemetry", () => {
    render(<NeuralNetAnimation effect="backprop" reducedMotion="always" />);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Update");
    expect(status).toHaveTextContent("epoch 5 / 5");
    expect(status).toHaveTextContent("loss 0.31 · final");
    expect(screen.getByLabelText(/Training · backpropagation/)).toBeInTheDocument();
  });

  it("keeps inference free of training telemetry", () => {
    render(<NeuralNetAnimation effect="inference" reducedMotion="always" />);
    expect(screen.queryByText(/epoch \d/)).not.toBeInTheDocument();
    expect(screen.queryByText(/gradient ∂L\/∂θ/)).not.toBeInTheDocument();
  });

  it("respects the reduced-motion data attribute", () => {
    render(<NeuralNetAnimation reducedMotion="always" />);
    expect(screen.getByLabelText(/Animated Inference/)).toHaveAttribute("data-motion", "reduced");
  });

  it("defaults to the inference effect", () => {
    render(<NeuralNetAnimation reducedMotion="always" />);
    expect(screen.getByLabelText(/Animated Inference/)).toHaveAttribute("data-effect", "inference");
  });

  it("renders one numbered step button per phase for every effect", () => {
    const { rerender } = render(<NeuralNetAnimation effect="inference" reducedMotion="always" />);
    expect(screen.getAllByRole("button", { name: /^Step \d of \d:/ })).toHaveLength(neuralNetPhases.inference.length);
    rerender(<NeuralNetAnimation effect="feed-forward" reducedMotion="always" />);
    expect(screen.getAllByRole("button", { name: /^Step \d of \d:/ })).toHaveLength(neuralNetPhases["feed-forward"].length);
    rerender(<NeuralNetAnimation effect="backprop" reducedMotion="always" />);
    expect(screen.getAllByRole("button", { name: /^Step \d of \d:/ })).toHaveLength(neuralNetPhases.backprop.length);
  });

  it("names every step's operation in its button label", () => {
    render(<NeuralNetAnimation reducedMotion="always" />);
    expect(screen.getByRole("button", { name: /Step 2 of 5: Forward pass · Hidden 1/ })).toBeInTheDocument();
  });

  it("shows the step count and operation explicitly in the readout", () => {
    render(<NeuralNetAnimation reducedMotion="always" />);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Step 5 of 5");
    expect(status).toHaveTextContent("Selection · highest score");
  });

  it("jumps to a step on click, pauses autoplay, and marks it current", () => {
    render(<NeuralNetAnimation reducedMotion="always" />);
    fireEvent.click(screen.getByRole("button", { name: /Step 2 of 5: Forward pass · Hidden 1/ }));
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Step 2 of 5");
    expect(status).toHaveTextContent("Forward pass · Hidden 1");
    expect(screen.getByRole("button", { name: /Step 2 of 5/ })).toHaveAttribute("aria-current", "step");
    expect(screen.getByRole("button", { name: "Play the animation" })).toHaveAttribute("aria-pressed", "false");
  });

  it("steps forward and backward with the control buttons", () => {
    render(<NeuralNetAnimation reducedMotion="always" />);
    fireEvent.click(screen.getByRole("button", { name: "Next step" }));
    expect(screen.getByRole("status")).toHaveTextContent("Step 2 of 5");
    fireEvent.click(screen.getByRole("button", { name: "Previous step" }));
    expect(screen.getByRole("status")).toHaveTextContent("Step 1 of 5");
    fireEvent.click(screen.getByRole("button", { name: "Previous step" }));
    expect(screen.getByRole("status")).toHaveTextContent("Step 1 of 5");
  });

  it("wraps Next from the last step back to the first", () => {
    render(<NeuralNetAnimation reducedMotion="always" />);
    fireEvent.click(screen.getByRole("button", { name: /Step 5 of 5/ }));
    fireEvent.click(screen.getByRole("button", { name: "Next step" }));
    expect(screen.getByRole("status")).toHaveTextContent("Step 1 of 5");
    expect(screen.getByRole("status")).toHaveTextContent("Forward pass · Input");
  });

  it("toggles the play state through the pause control", () => {
    render(<NeuralNetAnimation reducedMotion="always" />);
    const play = screen.getByRole("button", { name: "Pause the animation" });
    expect(play).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(play);
    expect(screen.getByRole("button", { name: "Play the animation" })).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(screen.getByRole("button", { name: "Play the animation" }));
    expect(screen.getByRole("button", { name: "Pause the animation" })).toHaveAttribute("aria-pressed", "true");
  });

  it("highlights only the strongest node per reached layer on a forward pass", () => {
    const { container } = render(<NeuralNetAnimation reducedMotion="always" />);
    fireEvent.click(screen.getByRole("button", { name: /Step 2 of 5: Forward pass · Hidden 1/ }));
    const litNodes = Array.from(container.querySelectorAll<HTMLElement>(".nnl-node.is-lit"));
    expect(litNodes).toHaveLength(2);
    expect(litNodes.filter((node) => node.getAttribute("aria-label")?.startsWith("Input")).length).toBe(1);
    expect(litNodes.filter((node) => node.getAttribute("aria-label")?.startsWith("Hidden")).length).toBe(1);
  });

  it("glows a single path edge between reached layers", () => {
    const { container } = render(<NeuralNetAnimation reducedMotion="always" />);
    fireEvent.click(screen.getByRole("button", { name: /Step 2 of 5: Forward pass · Hidden 1/ }));
    expect(container.querySelectorAll(".nnl-edges.is-forward .nnl-edge.is-active")).toHaveLength(1);
  });

  it("glows the full backward edge fan in rose during the backward pass", () => {
    const { container } = render(<NeuralNetAnimation effect="backprop" reducedMotion="always" />);
    fireEvent.click(screen.getByRole("button", { name: /Step 3 of 5: Backward · hidden 2/ }));
    expect(container.querySelectorAll(".nnl-edges.is-backward .nnl-edge.is-active")).toHaveLength(8);
  });
});
