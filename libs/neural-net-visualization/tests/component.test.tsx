import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { NeuralNetAnimation } from "../src/NeuralNetAnimation";
import { illustrativeScenario } from "../src/model";

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
});
