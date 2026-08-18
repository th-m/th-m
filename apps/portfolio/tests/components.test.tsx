import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../src/App";
import { shouldPlayIntro, ThomLogo } from "../src/brand/thom/ThomLogo";
import { opticalProfileAsset, opticalProfileForWidth } from "../src/brand/thom/opticalProfile";

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

  it("selects deterministic optical profiles at the documented rendered widths", () => {
    expect(opticalProfileForWidth(92)).toBe("micro");
    expect(opticalProfileForWidth(120)).toBe("micro");
    expect(opticalProfileForWidth(121)).toBe("compact");
    expect(opticalProfileForWidth(300)).toBe("compact");
    expect(opticalProfileForWidth(301)).toBe("display");
    expect(opticalProfileAsset("micro")).toBe("/brand/thom-micro.svg");
  });

  it("allows an optical profile to be pinned for a known application", () => {
    render(<ThomLogo variant="static" opticalProfile="micro" ariaLabel="Micro THOM" />);
    const logo = screen.getByRole("img", { name: "Micro THOM" });
    expect(logo).toHaveAttribute("data-optical-profile", "micro");
    expect(logo.querySelector("img")).toHaveAttribute("src", "/brand/thom-micro.svg");
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
