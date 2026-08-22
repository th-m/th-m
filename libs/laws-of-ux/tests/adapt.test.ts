import { describe, expect, it } from "vitest";
import {
  adaptLawColor,
  adaptLawGraphic,
  parseHexColor,
  rgbToHex,
  rgbToHsl,
  BRAND_FILL,
  DEFAULT_TARGET_LIGHTNESS,
  SOURCE_EGGSHELL,
} from "../src/adapt";
import { laws } from "../src/laws";

const FITTSS_SVG =
  '<svg viewbox="0 0 566 566" xmlns="http://www.w3.org/2000/svg"><g stroke="#f4f1d0" stroke-width="30" fill="none" fill-rule="evenodd"><circle style="--animation-order: 1" cx="282.882" cy="282.882" r="267.882"/><circle style="--animation-order: 2" cx="282.861" cy="282.861" r="192.861"/></g><circle style="--animation-order: 3" fill="#000" fill-opacity=".2" cx="283" cy="283" r="119"/><path style="--animation-order: 4" fill="#f4f1d0" fill-opacity=".6" d="M0 0h10v10z"/></svg>';

describe("adaptLawGraphic", () => {
  it("recolors eggshell fills and strokes to the brand gold token", () => {
    const adapted = adaptLawGraphic(FITTSS_SVG);
    expect(adapted).not.toContain(SOURCE_EGGSHELL);
    expect(adapted).toContain(`fill="${BRAND_FILL}"`);
    expect(adapted).toContain(`stroke="${BRAND_FILL}"`);
  });

  it("normalizes lowercase viewbox to viewBox", () => {
    const adapted = adaptLawGraphic(FITTSS_SVG);
    expect(adapted).toContain('viewBox="0 0 566 566"');
    expect(adapted).not.toContain("viewbox=");
  });

  it("preserves black shadow shapes, their opacity, and unrelated attributes", () => {
    const adapted = adaptLawGraphic(FITTSS_SVG);
    expect(adapted).toContain('fill="#000" fill-opacity=".2"');
    expect(adapted).toContain('stroke-width="30"');
    expect(adapted).toContain('fill-rule="evenodd"');
    expect(adapted).toContain("--animation-order");
  });

  it("keeps opacity-modulated light shapes opaque-gold with their opacity", () => {
    const adapted = adaptLawGraphic(FITTSS_SVG);
    expect(adapted).toContain(`fill="${BRAND_FILL}" fill-opacity=".6"`);
  });

  it("is idempotent", () => {
    const once = adaptLawGraphic(FITTSS_SVG);
    expect(adaptLawGraphic(once)).toBe(once);
  });

  it("adapts every stored law graphic without error", () => {
    for (const law of laws) {
      const adapted = adaptLawGraphic(law.graphic);
      expect(adapted, law.slug).not.toContain(SOURCE_EGGSHELL);
      expect(adapted, law.slug).toContain("viewBox");
    }
  });
});

describe("adaptLawColor", () => {
  it("returns a deterministic dark hex for a source color", () => {
    const first = adaptLawColor("#5d883a");
    const second = adaptLawColor("#5d883a");
    expect(first).toBe(second);
    expect(first).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("clamps lightness into the dark THOM range", () => {
    for (const source of ["#f4f1d0", "#cfbb28", "#297aa3", "#5d883a", "#000000", "#ffffff"]) {
      const adapted = adaptLawColor(source);
      const rgb = parseHexColor(adapted);
      expect(rgb, source).not.toBeNull();
      expect(rgbToHsl(rgb!).l, source).toBeCloseTo(DEFAULT_TARGET_LIGHTNESS, 2);
    }
  });

  it("preserves the source hue within rounding tolerance", () => {
    for (const law of laws) {
      const source = parseHexColor(law.color)!;
      const adapted = parseHexColor(adaptLawColor(law.color))!;
      const sourceHue = rgbToHsl(source).h;
      const adaptedHue = rgbToHsl(adapted).h;
      const delta = Math.abs(sourceHue - adaptedHue);
      expect(Math.min(delta, 360 - delta), law.slug).toBeLessThanOrEqual(2);
    }
  });

  it("desaturates mildly toward the restrained palette", () => {
    const source = rgbToHsl(parseHexColor("#e95444")!);
    const adapted = rgbToHsl(parseHexColor(adaptLawColor("#e95444"))!);
    expect(adapted.s).toBeLessThanOrEqual(source.s);
  });

  it("throws on malformed hex input", () => {
    expect(() => adaptLawColor("not-a-color")).toThrow();
    expect(() => adaptLawColor("#12345")).toThrow();
  });

  it("round-trips rgbToHex and parseHexColor", () => {
    expect(rgbToHex(parseHexColor("#123456")!)).toBe("#123456");
    expect(parseHexColor("#zzzzzz")).toBeNull();
  });
});
