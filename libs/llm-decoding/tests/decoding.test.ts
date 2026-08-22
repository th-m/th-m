import { describe, expect, it } from "vitest";
import {
  applyDecoding,
  hash01,
  softmax,
  topKAllowed,
  topPAllowed,
} from "../src/decoding";
import { baseLogits, decodingStrategies } from "../src/model";

const logits = baseLogits.map((candidate) => candidate.logit);
const baseConfig = { temperature: 0.8, topK: 3, topP: 0.9, draw: 0 };

describe("decoding math", () => {
  it("softmax produces a normalized distribution", () => {
    const probabilities = softmax(logits);
    const sum = probabilities.reduce((total, value) => total + value, 0);
    expect(sum).toBeCloseTo(1, 12);
    expect(probabilities.every((value) => value > 0)).toBe(true);
    expect(probabilities[0]).toBeGreaterThan(probabilities[1]);
  });

  it("top-k keeps exactly the k most probable candidates", () => {
    const allowed = topKAllowed(softmax(logits), 3);
    expect(allowed.filter(Boolean).length).toBe(3);
    expect(allowed[0]).toBe(true);
    expect(allowed[1]).toBe(true);
    expect(allowed[2]).toBe(true);
    expect(allowed[3]).toBe(false);
  });

  it("top-p keeps a minimal nucleus reaching the threshold", () => {
    const probabilities = softmax(logits);
    const allowed = topPAllowed(probabilities, 0.9);
    const kept = probabilities.filter((_, index) => allowed[index]);
    const total = kept.reduce((sum, value) => sum + value, 0);
    expect(total).toBeGreaterThanOrEqual(0.89);
    // The smallest prefix set should not overshoot by more than one candidate.
    const ordered = [...probabilities].sort((a, b) => b - a);
    const oneLess = ordered.slice(0, Math.max(0, kept.length - 1)).reduce((sum, value) => sum + value, 0);
    expect(oneLess).toBeLessThan(0.9);
  });

  it("greedy selects the argmax without sampling", () => {
    const result = applyDecoding("greedy", baseConfig);
    expect(result.selectedIndex).toBe(0);
    expect(result.mostLikelyIndex).toBe(0);
    expect(result.allowed.every(Boolean)).toBe(true);
  });

  it("is deterministic for a fixed strategy, config, and draw", () => {
    for (const strategy of decodingStrategies) {
      const first = applyDecoding(strategy, baseConfig);
      const second = applyDecoding(strategy, baseConfig);
      expect(first).toEqual(second);
      expect(first.probabilities.length).toBe(baseLogits.length);
      expect(first.selectedIndex).toBeGreaterThanOrEqual(0);
    }
  });

  it("temperature changes the distribution shape", () => {
    const cold = applyDecoding("temperature", { ...baseConfig, temperature: 0.3 });
    const hot = applyDecoding("temperature", { ...baseConfig, temperature: 2 });
    expect(cold.probabilities[0]).toBeGreaterThan(hot.probabilities[0]);
  });

  it("masks disallowed candidates to zero probability", () => {
    const result = applyDecoding("top-k", { ...baseConfig, topK: 2 });
    result.probabilities.forEach((probability, index) => {
      if (!result.allowed[index]) expect(probability).toBe(0);
    });
  });

  it("hashes strings into the unit interval deterministically", () => {
    expect(hash01("a|1")).toBe(hash01("a|1"));
    expect(hash01("a|1")).toBeGreaterThanOrEqual(0);
    expect(hash01("a|1")).toBeLessThan(1);
  });
});
