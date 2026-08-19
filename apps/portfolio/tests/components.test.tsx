import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroOrbit, shouldPlayIntro, ThomLogo } from "@th-m/thom-brand";
import { opticalProfileAsset, opticalProfileForWidth } from "@th-m/thom-brand/optical-profile";
import App from "../src/App";

describe("accessible identity and content", () => {
  it("renders deterministic orbit geometry from the stored brand data", () => {
    const { container, rerender } = render(<HeroOrbit activeGlyph={null} />);
    const orbit = container.querySelector(".hero-orbit");
    expect(orbit).toHaveAttribute("data-active-glyph", "idle");
    expect(container.querySelectorAll("[data-orbit-ring]")).toHaveLength(3);
    expect(container.querySelectorAll("[data-golden-point]")).toHaveLength(5);
    expect(container.querySelectorAll("[data-golden-side]")).toHaveLength(5);
    expect(container.querySelectorAll("[data-golden-trail-segment]")).toHaveLength(10);
    expect(container.querySelectorAll('[data-golden-trace="dot"]')).toHaveLength(1);
    const sides = Array.from(container.querySelectorAll('[data-golden-trail-segment][data-segment-kind="side"]')).map((segment) => Number(segment.getAttribute("data-segment-length")));
    const diagonals = Array.from(container.querySelectorAll('[data-golden-trail-segment][data-segment-kind="diagonal"]')).map((segment) => Number(segment.getAttribute("data-segment-length")));
    expect(sides).toHaveLength(5);
    expect(diagonals).toHaveLength(5);
    expect(diagonals[0] / sides[0]).toBeCloseTo((1 + Math.sqrt(5)) / 2, 5);

    const networks = Array.from(container.querySelectorAll("[data-orbit-network]"));
    expect(networks).toHaveLength(3);
    expect(networks.map((network) => network.getAttribute("data-network-seed"))).toEqual(["THOM-02", "THOM-03", "THOM-04"]);
    for (const network of networks) {
      expect(network.querySelectorAll("[data-orbit-chord]").length).toBeGreaterThan(0);
      expect(network.querySelectorAll("[data-orbit-intersection]").length).toBeGreaterThan(0);
    }

    const fftBars = Array.from(container.querySelectorAll("[data-fft-bin]"));
    const magnitudes = fftBars.map((bar) => Number(bar.getAttribute("data-fft-magnitude")));
    expect(fftBars).toHaveLength(32);
    expect(Math.min(...magnitudes)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...magnitudes)).toBe(1);

    rerender(<HeroOrbit activeGlyph="m" />);
    expect(container.querySelector(".hero-orbit")).toHaveAttribute("data-active-glyph", "m");
  });

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
