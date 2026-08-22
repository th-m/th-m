import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { DecodingExplorer } from "../src/DecodingExplorer";

afterEach(() => {
  cleanup();
});

describe("DecodingExplorer", () => {
  it("renders the strategy tabs and base logits", () => {
    render(<DecodingExplorer />);
    expect(screen.getByRole("heading", { name: /decoding strategies/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Greedy" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Temperature" })).toBeInTheDocument();
    expect(screen.getByText("Base logits · same for every strategy")).toBeInTheDocument();
    expect(screen.getAllByText("Paris").length).toBeGreaterThan(0);
  });

  it("switches strategies and shows the relevant parameter", () => {
    render(<DecodingExplorer />);
    fireEvent.click(screen.getByRole("button", { name: "Top-k" }));
    expect(screen.getByRole("button", { name: "Top-k" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("slider", { name: "Top-k count" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Temperature" }));
    expect(screen.getByRole("slider", { name: "Temperature" })).toBeInTheDocument();
  });

  it("draws again for sampling strategies", () => {
    render(<DecodingExplorer />);
    fireEvent.click(screen.getByRole("button", { name: "Top-p (nucleus)" }));
    const button = screen.getByRole("button", { name: /draw again/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.getByText(/sample draw 02/i)).toBeInTheDocument();
  });
});
