import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { TrainingWalkthrough } from "../src/TrainingWalkthrough";
import { trainingCorpus } from "../src/model";

afterEach(() => {
  cleanup();
});

describe("TrainingWalkthrough", () => {
  it("renders the walkthrough shell with mode tabs", () => {
    render(<TrainingWalkthrough reducedMotion="always" />);
    expect(screen.getByRole("heading", { name: /how an llm learns/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Simple" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Model" })).toBeInTheDocument();
    expect(screen.getAllByText(/training only/i).length).toBeGreaterThan(0);
  });

  it("shows the corpus in simple mode", () => {
    render(<TrainingWalkthrough reducedMotion="always" />);
    expect(screen.getByText(trainingCorpus[0].text)).toBeInTheDocument();
    expect(screen.getAllByText("mat").length).toBeGreaterThan(0);
  });

  it("switches to the model walkthrough", () => {
    render(<TrainingWalkthrough reducedMotion="always" />);
    fireEvent.click(screen.getByRole("button", { name: "Model" }));
    expect(screen.getByText(/Gradients ∂L\/∂θ/i)).toBeInTheDocument();
    expect(screen.getByText(/Optimizer: θ ← θ − η·∂L\/∂θ/i)).toBeInTheDocument();
  });

  it("steps forward and resets via controls", () => {
    render(<TrainingWalkthrough reducedMotion="always" />);
    fireEvent.click(screen.getByRole("button", { name: "Next step" }));
    expect(screen.getByText(/Step 02 \/ 05/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reset training walkthrough" }));
    expect(screen.getByText(/Step 01 \/ 05/)).toBeInTheDocument();
  });
});
