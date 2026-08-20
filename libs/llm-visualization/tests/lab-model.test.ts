import { describe, expect, it } from "vitest";
import {
  createDecodingResult,
  createDeterministicTrainingTrace,
  createEmbeddingPoints,
  defaultTransformerLabConfig,
  deriveTransformerArchitecture,
  normalizeTransformerLabConfig,
  tokenizeWithIllustrativeBpe,
  transformerLabPhases,
} from "../src/lab-model";

describe("deterministic transformer lab model", () => {
  it("applies stable BPE merge rules and token IDs to editable text", () => {
    const first = tokenizeWithIllustrativeBpe("The model learns to");
    const second = tokenizeWithIllustrativeBpe("  THE   model learns to  ");

    expect(first).toEqual(second);
    expect(first.normalized).toBe("the model learns to");
    expect(first.tokens).toEqual([
      { text: "▁the", id: 915, wordIndex: 0 },
      { text: "▁model", id: 369, wordIndex: 1 },
      { text: "▁learn", id: 354, wordIndex: 2 },
      { text: "s", id: 962, wordIndex: 2 },
      { text: "▁t", id: 172, wordIndex: 3 },
      { text: "o", id: 434, wordIndex: 3 },
    ]);
    expect(first.merges[0]).toMatchObject({ pair: "t + h", result: "th" });
    expect(createEmbeddingPoints(first.tokens)).toEqual(createEmbeddingPoints(first.tokens));
  });

  it("derives parameter counts from the configured decoder depth", () => {
    const architecture = deriveTransformerArchitecture(defaultTransformerLabConfig);
    const deepArchitecture = deriveTransformerArchitecture({ ...defaultTransformerLabConfig, numLayers: 6 });

    expect(architecture).toMatchObject({
      vocabSize: 96,
      contextLength: 32,
      embeddingDimension: 32,
      numHeads: 2,
      feedForwardDimension: 128,
      numLayers: 2,
      totalParameters: 32_736,
    });
    expect(deepArchitecture.totalParameters).toBeGreaterThan(architecture.totalParameters);
  });

  it("creates a stable decreasing teaching trace with sample checkpoints", () => {
    const first = createDeterministicTrainingTrace(defaultTransformerLabConfig);
    const second = createDeterministicTrainingTrace(defaultTransformerLabConfig);

    expect(first).toEqual(second);
    expect(first).toHaveLength(11);
    expect(first[0]?.epoch).toBe(0);
    expect(first.at(-1)?.epoch).toBe(300);
    expect(first.at(-1)?.loss).toBeLessThan(first[0]?.loss ?? 0);
    expect(first.filter((checkpoint) => checkpoint.sample)).toHaveLength(3);
  });

  it("runs deterministic temperature and top-p decoding math", () => {
    const result = createDecodingResult(defaultTransformerLabConfig);
    const repeated = createDecodingResult(defaultTransformerLabConfig);

    expect(result).toEqual(repeated);
    expect(result.candidates.reduce((sum, candidate) => sum + candidate.probability, 0)).toBeCloseTo(1, 5);
    expect(result.candidates.filter((candidate) => candidate.included).map((candidate) => candidate.token)).toEqual(["the", "story", "next"]);
    expect(result.candidates.filter((candidate) => candidate.selected)).toHaveLength(1);
    expect(result.nucleusMass).toBeGreaterThanOrEqual(defaultTransformerLabConfig.topP);
  });

  it("clamps public configuration and keeps training phases explicit", () => {
    expect(normalizeTransformerLabConfig({ epochs: 9_999, topP: 0, temperature: 8, numLayers: -2, maxTokens: 2 })).toMatchObject({
      epochs: 2_000,
      topP: 0.1,
      temperature: 2,
      numLayers: 1,
      maxTokens: 8,
    });
    expect(transformerLabPhases).toEqual(["tokenize", "initialize", "forward", "loss", "backpropagate", "update", "sample"]);
  });
});
