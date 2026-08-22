import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { curatedSetAtlasAnalyses } from "../src/data/curated-atlases";
import { SetAtlasVisualization } from "../src/SetAtlasVisualization";

describe("SetAtlasVisualization", () => {
  it("renders a dynamic atlas figure from curated analysis data", () => {
    const entry = curatedSetAtlasAnalyses[0];
    render(<SetAtlasVisualization analysis={entry.analysis} title={entry.label} />);

    const figure = screen.getByLabelText(entry.label);
    expect(figure).toBeInTheDocument();
    expect(figure.querySelectorAll(".set-region").length).toBeGreaterThan(0);
    expect(screen.getByRole("application", { name: "TypeScript set atlas" })).toBeInTheDocument();
  });

  it("reports region selection through onSelect", () => {
    const entry = curatedSetAtlasAnalyses[1];
    const onSelect = vi.fn();
    render(<SetAtlasVisualization analysis={entry.analysis} onSelect={onSelect} />);

    const regions = screen.getAllByRole("button");
    expect(regions.length).toBeGreaterThan(0);
    fireEvent.click(regions[0]);
    expect(onSelect).toHaveBeenCalledWith(expect.any(String));
  });

  it("shows geometry notes when the analysis carries warnings", () => {
    const entry = curatedSetAtlasAnalyses[0];
    const analysis = {
      ...entry.analysis,
      diagnostics: [
        ...entry.analysis.diagnostics,
        { code: 1, severity: "warning" as const, message: "Overlap approximated." },
      ],
    };
    render(<SetAtlasVisualization analysis={analysis} />);
    expect(screen.getByRole("note")).toBeInTheDocument();
  });
});
