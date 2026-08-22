import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AnimatedThomLogo, HeroOrbit, ThomGlyphStage, ThomLogo } from "../src";

describe("THOM brand component exports", () => {
  it("composes one interactive wordmark with one coordinated orbit", async () => {
    const { container } = render(<AnimatedThomLogo />);
    expect(container.querySelectorAll(".animated-thom-logo")).toHaveLength(1);
    expect(container.querySelectorAll(".hero-orbit")).toHaveLength(1);
    expect(container.querySelectorAll(".thom-logo--hero")).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Replay T foundations animation" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Replay H equilibrium animation" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Replay O emergence animation" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Replay M superposition animation" })).toBeInTheDocument();
    // The hero logo lazy-loads its three.js scene on mount. Wait for that
    // import to settle so it cannot resolve after the test environment tears
    // down (which Vitest reports as an unhandled error).
    await vi.dynamicImportSettled();
  });

  it("keeps lower-level components independently exportable", () => {
    expect(AnimatedThomLogo).toBeTypeOf("function");
    expect(HeroOrbit).toBeTypeOf("function");
    expect(ThomLogo).toBeTypeOf("function");
    expect(ThomGlyphStage).toBeTypeOf("function");
  });
});
