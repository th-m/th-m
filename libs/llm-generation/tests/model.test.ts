import { describe, expect, it } from "vitest";
import {
  exampleById,
  generationExamples,
  generationStageIndex,
  generationStages,
} from "../src/model";

describe("generation example model", () => {
  it("exposes at least two deterministic examples with non-empty steps", () => {
    expect(generationExamples.length).toBeGreaterThanOrEqual(2);
    for (const example of generationExamples) {
      expect(example.prompt.length).toBeGreaterThan(0);
      expect(example.steps.length).toBeGreaterThan(0);
      expect(example.steps.length).toBeLessThanOrEqual(8);
      expect(example.promptTokens.length).toBeGreaterThan(0);
    }
  });

  it("keeps candidate probabilities consistent with the selected token", () => {
    for (const example of generationExamples) {
      for (const step of example.steps) {
        expect(step.candidates.length).toBeGreaterThanOrEqual(2);
        const total = step.candidates.reduce((sum, candidate) => sum + candidate.probability, 0);
        expect(total).toBeCloseTo(1, 1);
        expect(step.candidates.some((candidate) => candidate.token === step.token)).toBe(true);
        expect(step.candidates.every((candidate) => Number.isFinite(candidate.logit))).toBe(true);
      }
    }
  });

  it("gives each step attention weights matching the context length", () => {
    for (const example of generationExamples) {
      example.steps.forEach((step, index) => {
        expect(step.attentionWeights.length).toBe(example.promptTokens.length + index);
        const total = step.attentionWeights.reduce((sum, weight) => sum + weight, 0);
        expect(total).toBeCloseTo(1, 1);
      });
    }
  });

  it("resolves examples by id", () => {
    expect(exampleById("capital")?.steps[0].token).toBe("Paris");
    expect(exampleById("missing")).toBeUndefined();
  });

  it("defines the full per-token stage sequence", () => {
    expect(generationStages.map((stage) => stage.id)).toEqual([
      "tokens",
      "attention",
      "feed-forward",
      "logits",
      "decode",
      "append",
    ]);
    expect(generationStageIndex("decode")).toBe(4);
    expect(generationStageIndex("append")).toBe(5);
  });
});
