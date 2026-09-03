import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { NeuralInferenceFigure } from "../src/generated/blog-pages/understanding-and-bottlenecks/neural-inference-figure";

afterEach(() => cleanup());

describe("Understanding and Bottlenecks neural inference figure", () => {
  it("begins with fixed weights and the context token states active", () => {
    const { container } = render(<NeuralInferenceFigure />);

    expect(
      screen.getByLabelText(/Animated neural network: LLM Inference/),
    ).toHaveAttribute("data-step-id", "context");
    expect(container.querySelectorAll("g.nnl-node")).toHaveLength(14);
    expect(
      container.querySelectorAll("g.nnl-node.nnl-node-tone-primary"),
    ).toHaveLength(3);
    expect(
      container.querySelector('path[data-edge-id="append-selected-token"]'),
    ).toBeNull();
    expect(screen.getByRole("status")).toHaveTextContent(
      "x[≤t] = “The cat sat on the”",
    );
    expect(
      screen.getByText("context x[≤t] · weights θ fixed"),
    ).toBeInTheDocument();
  });

  it("shows the vocabulary distribution without a loss or backward pass", () => {
    const { container } = render(<NeuralInferenceFigure />);

    fireEvent.click(
      screen.getByRole("button", { name: /Step 3 of 4: Distribution/ }),
    );

    expect(
      screen.getByLabelText(/Animated neural network: LLM Inference/),
    ).toHaveAttribute("data-step-id", "distribution");
    expect(
      container.querySelectorAll("g.nnl-node.nnl-node-tone-primary"),
    ).toHaveLength(3);
    expect(
      container.querySelectorAll("path.nnl-edge.nnl-edge-tone-primary"),
    ).toHaveLength(3);
    expect(screen.getByRole("status")).toHaveTextContent(
      "p(x[t+1] | x[≤t]) = softmax(W hₜ)",
    );
    expect(container.querySelector(".nnl-node-tone-danger")).toBeNull();
    expect(screen.queryByText(/loss/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/backpropagation/i)).not.toBeInTheDocument();
  });

  it("selects a token, appends it to context, and leaves weights unchanged", () => {
    const { container } = render(<NeuralInferenceFigure />);

    fireEvent.click(
      screen.getByRole("button", { name: /Step 4 of 4: Select \+ append/ }),
    );

    expect(container.querySelector('g[data-node-id="output-mat"]')).toHaveClass(
      "nnl-node-tone-accent",
      "nnl-node-emphasis-strong",
    );
    expect(
      container.querySelector('.nnl__prob[data-node-id="output-mat"]'),
    ).toHaveClass("nnl-value-tone-accent", "nnl-value-emphasis-strong");
    expect(
      container.querySelector('path[data-edge-id="append-selected-token"]'),
    ).toHaveClass("nnl-edge-tone-accent", "nnl-edge-direction-start-to-end");
    expect(
      container.querySelector('path[data-edge-id="append-selected-token"]'),
    ).toHaveAttribute("data-route", "outside-right");
    expect(screen.getByRole("status")).toHaveTextContent(
      "select “mat” → append to context → repeat · weights unchanged",
    );
  });
});
