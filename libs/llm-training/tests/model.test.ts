import { describe, expect, it } from "vitest";
import {
  modelTrainingSteps,
  simpleTrainingSteps,
  trainingCorpus,
  trainingLossTrace,
  trainingSteps,
} from "../src/model";

describe("training model", () => {
  it("defines ordered simple and model walkthroughs", () => {
    expect(simpleTrainingSteps.map((step) => step.id)).toEqual([
      "corpus",
      "predict",
      "compare",
      "loss",
      "epoch",
    ]);
    expect(modelTrainingSteps.map((step) => step.id)).toEqual([
      "embed",
      "forward",
      "loss-step",
      "backprop",
      "update",
      "improve",
    ]);
    expect(trainingSteps("simple")).toBe(simpleTrainingSteps);
    expect(trainingSteps("model")).toBe(modelTrainingSteps);
  });

  it("keeps the corpus small and the loss trace strictly decreasing", () => {
    expect(trainingCorpus.length).toBeGreaterThanOrEqual(2);
    for (const sentence of trainingCorpus) {
      expect(sentence.text.length).toBeGreaterThan(0);
      expect(sentence.target.length).toBeGreaterThan(0);
    }
    expect(trainingLossTrace.length).toBeGreaterThanOrEqual(6);
    for (let index = 1; index < trainingLossTrace.length; index++) {
      expect(trainingLossTrace[index]).toBeLessThan(trainingLossTrace[index - 1]);
    }
  });

  it("labels training steps with copy for every stage", () => {
    for (const step of [...simpleTrainingSteps, ...modelTrainingSteps]) {
      expect(step.title.length).toBeGreaterThan(0);
      expect(step.description.length).toBeGreaterThan(0);
      expect(step.signal.length).toBeGreaterThan(0);
      expect(step.result.length).toBeGreaterThan(0);
    }
  });
});
