import { render, screen } from "@testing-library/react";
import { afterAll, describe, expect, it, vi } from "vitest";
import { PropositionGraphFigure } from "../src/PropositionGraphFigure";
import { createWeatherGraph } from "../src/seed";

const { layoutMock } = vi.hoisted(() => ({
  layoutMock: vi.fn(async () => ({ children: [] })),
}));

vi.mock("elkjs/lib/elk-api.js", () => ({
  default: class {
    layout = layoutMock;
    terminateWorker = vi.fn();
  },
}));

vi.mock("elkjs/lib/elk-worker.min.js?worker", () => ({ default: class {} }));

vi.stubGlobal(
  "fetch",
  vi.fn(async () => new Response(new Uint8Array([119, 79, 70, 50, 1, 2, 3]))),
);

afterAll(() => vi.unstubAllGlobals());

describe("PropositionGraphFigure", () => {
  it("renders a dynamic inline SVG figure from a GraphDocument", async () => {
    layoutMock.mockResolvedValueOnce({ children: [] });
    const graph = createWeatherGraph("2026-08-15T12:00:00.000Z");
    render(<PropositionGraphFigure document={graph} />);

    const figure = screen.getByLabelText("Weather above Kolob proposition graph");
    expect(figure).toBeInTheDocument();
    expect(screen.getByText("Balancing the graph…")).toBeInTheDocument();

    const svg = await screen.findByRole("img");
    expect(svg).toBeInTheDocument();
    expect(figure.textContent).toContain("6 propositions connected by 6 relationships.");
  });

  it("shows a layout error when ELK fails", async () => {
    layoutMock.mockRejectedValueOnce(new Error("boom"));
    const graph = createWeatherGraph("2026-08-15T12:00:00.000Z");
    render(<PropositionGraphFigure document={graph} />);
    expect(await screen.findByText(/Layout issue — boom/)).toBeInTheDocument();
  });
});
