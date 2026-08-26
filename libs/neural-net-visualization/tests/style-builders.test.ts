import { describe, expect, it } from "vitest";
import {
  neuralNetEdgeStyle,
  neuralNetNodeStyle,
  neuralNetValueBarStyle,
} from "../src/style-builders";

describe("neural-net style builders", () => {
  it("builds deterministic node classes for disc, ring, value, and motion", () => {
    expect(neuralNetNodeStyle({
      tone: "danger",
      emphasis: "strong",
      ring: "dashed",
      valueTone: "tone",
      motion: "pulse",
    })).toBe(
      "nnl-node-tone-danger nnl-node-emphasis-strong nnl-node-ring-dashed nnl-node-value-tone nnl-node-motion-pulse",
    );
  });

  it("builds deterministic edge classes for appearance and flow direction", () => {
    expect(neuralNetEdgeStyle({
      tone: "accent",
      emphasis: "strong",
      pattern: "dashed",
      motion: "flow",
      direction: "end-to-start",
    })).toBe(
      "nnl-edge-tone-accent nnl-edge-emphasis-strong nnl-edge-pattern-dashed nnl-edge-motion-flow nnl-edge-direction-end-to-start",
    );
  });

  it("builds deterministic value-bar classes", () => {
    expect(neuralNetValueBarStyle({
      tone: "primary",
      emphasis: "strong",
      outline: "dashed",
      motion: "pulse",
    })).toBe(
      "nnl-value-tone-primary nnl-value-emphasis-strong nnl-value-outline-dashed nnl-value-motion-pulse",
    );
  });

  it("uses neutral defaults without introducing domain semantics", () => {
    const combined = [neuralNetNodeStyle(), neuralNetEdgeStyle(), neuralNetValueBarStyle()].join(" ");
    expect(combined).not.toMatch(/loss|target|forward|backward|gradient/);
  });
});
