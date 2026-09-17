import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ResumePage } from "../src/resume/ResumePage";

describe("resume page", () => {
  it("presents public experience, outcomes, and selected work", () => {
    render(<ResumePage />);

    expect(screen.getByRole("heading", { level: 1, name: /Thomas Valadez/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Product intent, carried through the system." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Running systems, not just diagrams." })).toBeInTheDocument();
    expect(screen.getByText("Mango Voice")).toBeInTheDocument();
    expect(screen.getByText("SoundSculpt", { selector: "strong" })).toBeInTheDocument();
    expect(screen.getByText(/from ~8 to ~29 per week/i)).toBeInTheDocument();

    const github = screen.getByRole("link", { name: /GitHub/i });
    expect(github).toHaveAttribute("href", "https://github.com/th-m");
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noreferrer");
  });

  it("offers the browser print flow for saving a PDF", () => {
    const print = vi.spyOn(window, "print").mockImplementation(() => undefined);
    render(<ResumePage />);

    fireEvent.click(screen.getByRole("button", { name: /print \/ save pdf/i }));
    expect(print).toHaveBeenCalledOnce();
    print.mockRestore();
  });
});
