import { describe, expect, it } from "vitest";
import {
  illustrativeScenario,
  kindLabels,
  stageIds,
  visualizationStages,
} from "../src/model";

describe("decoder-only explanatory model", () => {
  it("keeps the forward-pass stages in a coherent deterministic sequence", () => {
    expect(visualizationStages.map((stage) => stage.id)).toEqual(stageIds);
    expect(stageIds).toEqual([
      "representations",
      "residual-entry",
      "attention",
      "qkv",
      "score-mix",
      "residual-norm",
      "feed-forward",
      "stacked-blocks",
      "logits",
      "decode",
      "feedback",
    ]);
    expect(visualizationStages.at(-1)?.result).toBe("Next inference step");
  });

  it("labels learned parameters separately from request-scoped activations", () => {
    expect(kindLabels).toEqual({
      parameter: "Persistent learned parameter",
      activation: "Temporary activation",
    });
    expect(visualizationStages.find((stage) => stage.id === "qkv")?.kinds).toEqual(["parameter", "activation"]);
    expect(visualizationStages.find((stage) => stage.id === "score-mix")?.kinds).toEqual(["activation"]);
  });

  it("uses stable illustrative tensors and probabilities", () => {
    expect(illustrativeScenario.context[0]).toEqual({ token: "The", position: 0, embedding: [0.18, -0.42, 0.72, 0.11] });
    expect(illustrativeScenario.causalAttention[3]).toEqual([0.08, 0.19, 0.27, 0.46]);
    expect(illustrativeScenario.heads.map((head) => head.weights)).toMatchInlineSnapshot(`
      [
        [
          0.08,
          0.19,
          0.27,
          0.46,
        ],
        [
          0.12,
          0.44,
          0.31,
          0.13,
        ],
        [
          0.04,
          0.1,
          0.24,
          0.62,
        ],
      ]
    `);
    expect(illustrativeScenario.vocabulary.reduce((sum, item) => sum + item.probability, 0)).toBeCloseTo(1, 10);
    expect(illustrativeScenario.selectedToken).toBe("the");
  });
});
