import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../src/App";
import { shouldPlayIntro, ThomLogo } from "../src/brand/thom/ThomLogo";

describe("accessible identity and content", () => {
  it("spells the accessible identity as THOM", () => {
    render(<ThomLogo variant="static" />);
    expect(screen.getByRole("img", { name: "THOM — Thomas Valadez" })).toBeInTheDocument();
    expect(screen.queryByLabelText(/πHOM/i)).not.toBeInTheDocument();
  });

  it("plays the full intro only once per session and never under reduced motion", () => {
    const empty = { getItem: () => null };
    const complete = { getItem: () => "complete" };
    expect(shouldPlayIntro(empty, false)).toBe(true);
    expect(shouldPlayIntro(complete, false)).toBe(false);
    expect(shouldPlayIntro(empty, true)).toBe(false);
  });

  it("renders all README-derived sections and safe external links", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /software systems become understandable/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Software Design" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /making sound visible/i })).toBeInTheDocument();
    expect(screen.getByText("platonic-values")).toBeInTheDocument();
    const soundsculpt = screen.getByRole("link", { name: /soundsculpt.app/i });
    expect(soundsculpt).toHaveAttribute("target", "_blank");
    expect(soundsculpt).toHaveAttribute("rel", "noreferrer");
  });
});
