import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PropositionGraphFigure } from "../src/PropositionGraphFigure";
import { createUnderstandingLoopGraph, createUnderstandingPipelineGraph, createWeatherGraph } from "../src/seed";

vi.mock("reagraph", async () => {
  const actual = await vi.importActual<typeof import("reagraph")>("reagraph");
  return {
    ...actual,
    GraphCanvas: () => <div data-testid="graph-canvas" role="img" aria-label="Graph canvas" />,
  };
});

describe("PropositionGraphFigure", () => {
  it("renders an interactive canvas figure from a GraphDocument", async () => {
    const graph = createWeatherGraph("2026-08-15T12:00:00.000Z");
    render(<PropositionGraphFigure document={graph} />);

    const figure = screen.getByLabelText("Weather above Kolob proposition graph");
    expect(figure).toBeInTheDocument();
    expect(await screen.findByTestId("graph-canvas")).toBeInTheDocument();
    expect(figure.textContent).toContain("6 propositions connected by 6 relationships.");
  });

  it("renders the proof pipeline figure from the understanding seed", async () => {
    const graph = createUnderstandingPipelineGraph("2026-08-22T12:00:00.000Z");
    render(<PropositionGraphFigure document={graph} />);

    const figure = screen.getByLabelText("Proof pipeline proposition graph");
    expect(figure).toBeInTheDocument();
    expect(await screen.findByTestId("graph-canvas")).toBeInTheDocument();
    expect(figure.textContent).toContain("5 propositions connected by 4 relationships.");
  });

  it("renders the understanding loop figure from the understanding seed", async () => {
    const graph = createUnderstandingLoopGraph("2026-08-22T12:00:00.000Z");
    render(<PropositionGraphFigure document={graph} />);

    const figure = screen.getByLabelText("The understanding loop proposition graph");
    expect(figure).toBeInTheDocument();
    expect(await screen.findByTestId("graph-canvas")).toBeInTheDocument();
    expect(figure.textContent).toContain("6 propositions connected by 6 relationships.");
  });
});
