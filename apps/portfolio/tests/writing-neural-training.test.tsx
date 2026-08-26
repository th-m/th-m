import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { NeuralTrainingFigure } from "../src/generated/blog-pages/goals-solutions-and-value/neural-training-figure";

afterEach(() => cleanup());

describe("Goals, Solutions & Value neural training figure", () => {
  it("begins with the full muted graph and only three glowing activation nodes", () => {
    const { container } = render(<NeuralTrainingFigure />);

    expect(container.querySelector('section[data-step-id="forward"]')).not.toBeNull();
    expect(container.querySelectorAll("g.nnl-node"))
      .toHaveLength(13);
    expect(container.querySelectorAll("g.nnl-node.nnl-node-tone-primary"))
      .toHaveLength(3);
    expect(container.querySelectorAll("path.nnl-edge")).toHaveLength(36);
    expect(container.querySelectorAll("path.nnl-edge.nnl-edge-tone-primary"))
      .toHaveLength(2);
    expect(container.querySelector('g[data-node-id="output-story"]'))
      .not.toHaveClass("nnl-node-tone-danger");
  });

  it("keeps the target treatment and red incoming edge aligned across all five loss frames", () => {
    const { container } = render(<NeuralTrainingFigure />);
    const scene = screen.getByLabelText(/Animated neural network: A bad guess, then training/);
    const expectedLosses = ["1.46", "0.60", "0.36", "0.32", "0.31"];

    for (let epoch = 0; epoch < 5; epoch += 1) {
      fireEvent.click(screen.getByRole("button", { name: /Step 2 of 4: Target \+ loss/ }));

      expect(scene).toHaveAttribute("data-iteration-id", `epoch-${epoch + 1}`);
      expect(scene).toHaveAttribute("data-step-id", "loss");
      expect(container.querySelector('path[data-edge-id="hidden-2-4--output-story"]'))
        .toHaveClass("nnl-edge-tone-danger", "nnl-edge-emphasis-strong");
      expect(container.querySelector('g[data-node-id="output-story"]'))
        .toHaveClass("nnl-node-tone-danger");
      expect(container.querySelector('.nnl__prob[data-node-id="output-story"]'))
        .toHaveClass("nnl-value-tone-danger", "nnl-value-motion-pulse");
      expect(screen.getByRole("status")).toHaveTextContent(`= ${expectedLosses[epoch]}`);
      expect(container.querySelector('g[data-node-id="output-the"]'))
        .not.toHaveClass("nnl-node-tone-primary");
      expect(container.querySelector('path[data-edge-id="hidden-2-4--output-the"]'))
        .not.toHaveClass("nnl-edge-tone-primary");
      expect(container.querySelector('path[data-edge-id="prediction--target"]')).toBeNull();

      if (epoch < 4) {
        fireEvent.click(screen.getByRole("button", { name: /Step 4 of 4: Update/ }));
        fireEvent.click(screen.getByRole("button", { name: "Next step" }));
      }
    }
  });

  it("preserves gradient telemetry and the final fixed snapshot", () => {
    const { container } = render(<NeuralTrainingFigure />);

    fireEvent.click(screen.getByRole("button", { name: /Step 3 of 4: Backpropagation/ }));
    expect(screen.getByRole("status")).toHaveTextContent("gradient ∂L/∂θ");
    expect(screen.getByRole("status")).toHaveTextContent("the input stays fixed");
    expect(container.querySelectorAll(".nnl-edge__label")).toHaveLength(2);
    expect(container.querySelector('g[data-node-id="output-the"]'))
      .not.toHaveClass("nnl-node-tone-primary");
    expect(container.querySelectorAll('path[data-to="output-the"]')).toHaveLength(0);
    expect(container.querySelectorAll("path.nnl-edge-tone-accent")).toHaveLength(3);
    expect(container.querySelector('path[data-edge-id="input-1--hidden-1-3"]'))
      .toHaveClass("nnl-edge-tone-accent", "nnl-edge-direction-end-to-start");
    expect(container.querySelector('path[data-edge-id="hidden-1-3--hidden-2-4"]'))
      .toHaveClass("nnl-edge-tone-accent", "nnl-edge-direction-end-to-start");
    expect(container.querySelector('path[data-edge-id="hidden-2-4--output-story"]'))
      .toHaveClass("nnl-edge-tone-accent", "nnl-edge-direction-end-to-start");

    for (let epoch = 0; epoch < 4; epoch += 1) {
      fireEvent.click(screen.getByRole("button", { name: /Step 4 of 4: Update/ }));
      fireEvent.click(screen.getByRole("button", { name: "Next step" }));
    }
    fireEvent.click(screen.getByRole("button", { name: /Step 4 of 4: Update/ }));

    const scene = screen.getByLabelText(/Animated neural network: A bad guess, then training/);
    expect(scene).toHaveAttribute("data-iteration-id", "epoch-5");
    expect(scene).toHaveAttribute("data-snapshot-id", "epoch-5");
    expect(screen.getByRole("status")).toHaveTextContent("loss 0.31 · final");
  });

  it("shows only three signed path nodes and no highlighted edges during the update", () => {
    const { container } = render(<NeuralTrainingFigure />);

    fireEvent.click(screen.getByRole("button", { name: /Step 4 of 4: Update/ }));

    expect(container.querySelectorAll("g.nnl-node.nnl-node-tone-primary")).toHaveLength(3);
    expect(container.querySelectorAll("path.nnl-edge.nnl-edge-tone-primary")).toHaveLength(0);
    expect(container.querySelectorAll("path.nnl-edge.nnl-edge-tone-accent")).toHaveLength(0);
    expect(container.querySelectorAll("path.nnl-edge.nnl-edge-tone-danger")).toHaveLength(0);
    expect(container.querySelectorAll(".neural-training-figure__update-sign--positive")).toHaveLength(2);
    expect(container.querySelectorAll(".neural-training-figure__update-sign--negative")).toHaveLength(1);
    expect(container.querySelector('[data-node-id="input-1"] .nnl-node__value')).toHaveTextContent("+");
    expect(container.querySelector('[data-node-id="hidden-1-3"] .nnl-node__value')).toHaveTextContent("+");
    expect(container.querySelector('[data-node-id="hidden-2-4"] .nnl-node__value')).toHaveTextContent("−");
    expect(container.querySelector('g[data-node-id="output-story"]')).not.toHaveClass("nnl-node-tone-danger");
  });
});
