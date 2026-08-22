import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { GenerationPlayback } from "../src/GenerationPlayback";

afterEach(() => {
  cleanup();
});

describe("GenerationPlayback", () => {
  it("renders the playback shell with example choices", () => {
    render(<GenerationPlayback reducedMotion="always" />);
    expect(screen.getByRole("heading", { name: /watch an llm generate/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Capital of France" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Story opener" })).toBeInTheDocument();
    expect(screen.getByText(/Token 01 \/ 03 · stage 01 \/ 06/)).toBeInTheDocument();
  });

  it("steps forward with the next-stage control", () => {
    render(<GenerationPlayback reducedMotion="always" />);
    fireEvent.click(screen.getByRole("button", { name: "Next stage" }));
    expect(screen.getByText(/Token 01 \/ 03 · stage 02 \/ 06/)).toBeInTheDocument();
  });

  it("jumps to the next token and can skip to the end", () => {
    render(<GenerationPlayback reducedMotion="always" />);
    fireEvent.click(screen.getByRole("button", { name: "Next token" }));
    expect(screen.getByText(/Token 02 \/ 03 · stage 01 \/ 06/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Skip to end of generation" }));
    expect(screen.getByText(/Token 03 \/ 03 · stage 06 \/ 06/)).toBeInTheDocument();
    expect(screen.getAllByText("Paris").length).toBeGreaterThan(0);
  });

  it("reacts to keyboard shortcuts on the focused surface", () => {
    const { container } = render(<GenerationPlayback reducedMotion="always" />);
    const surface = container.querySelector(".gen") as HTMLElement;
    expect(surface).not.toBeNull();
    fireEvent.keyDown(surface, { key: "ArrowRight" });
    expect(screen.getByText(/stage 02 \/ 06/)).toBeInTheDocument();
    fireEvent.keyDown(surface, { key: "g" });
    expect(screen.getByText(/Token 03 \/ 03 · stage 06 \/ 06/)).toBeInTheDocument();
    fireEvent.keyDown(surface, { key: "r" });
    expect(screen.getByText(/Token 01 \/ 03 · stage 01 \/ 06/)).toBeInTheDocument();
  });

  it("switches examples from the picker", () => {
    render(<GenerationPlayback reducedMotion="always" />);
    fireEvent.click(screen.getByRole("button", { name: "Largest planet" }));
    expect(screen.getByText(/Token 01 \/ 02 · stage 01 \/ 06/)).toBeInTheDocument();
  });
});
