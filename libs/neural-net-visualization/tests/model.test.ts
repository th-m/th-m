import { describe, expect, it } from "vitest";
import {
  backwardPass,
  buildTrace,
  crossEntropyLoss,
  forwardPass,
  illustrativeLayerSizes,
  illustrativeScenario,
  illustrativeTrace,
  neuralNetPhases,
  softmax,
} from "../src/model";

describe("softmax", () => {
  it("produces a probability distribution", () => {
    const result = softmax([2.0, 1.0, 0.1]);
    expect(result).toHaveLength(3);
    expect(result.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 6);
    expect(result[0]).toBeGreaterThan(result[1]);
    expect(result[1]).toBeGreaterThan(result[2]);
  });
});

describe("crossEntropyLoss", () => {
  it("is zero for a perfect prediction", () => {
    expect(crossEntropyLoss([1, 0], 0)).toBeCloseTo(0, 6);
  });

  it("grows as the target probability shrinks", () => {
    const low = crossEntropyLoss([0.8, 0.2], 1);
    const high = crossEntropyLoss([0.95, 0.05], 1);
    expect(high).toBeGreaterThan(low);
  });
});

describe("forwardPass", () => {
  it("produces one activation layer per layer size", () => {
    const { activations } = forwardPass(
      illustrativeScenario,
      illustrativeScenario.weights,
      illustrativeScenario.biases,
    );
    expect(activations.map((layer) => layer.length)).toEqual([...illustrativeLayerSizes]);
  });

  it("outputs probabilities that sum to one", () => {
    const { probabilities } = forwardPass(
      illustrativeScenario,
      illustrativeScenario.weights,
      illustrativeScenario.biases,
    );
    expect(probabilities.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 6);
  });
});

describe("backwardPass", () => {
  it("returns gradients shaped like the weights and biases", () => {
    const { activations } = forwardPass(
      illustrativeScenario,
      illustrativeScenario.weights,
      illustrativeScenario.biases,
    );
    const { weightGradients, biasGradients } = backwardPass(
      illustrativeScenario,
      illustrativeScenario.weights,
      activations,
    );
    expect(weightGradients).toHaveLength(3);
    weightGradients.forEach((layer, layerIndex) => {
      expect(layer).toHaveLength(illustrativeScenario.weights[layerIndex].length);
      layer.forEach((row, rowIndex) => {
        expect(row).toHaveLength(illustrativeScenario.weights[layerIndex][rowIndex].length);
      });
    });
    biasGradients.forEach((layer, layerIndex) => {
      expect(layer).toHaveLength(illustrativeScenario.biases[layerIndex].length);
    });
  });
});

describe("buildTrace", () => {
  it("strictly decreases cross-entropy loss across epochs", () => {
    const trace = buildTrace(illustrativeScenario);
    expect(trace.losses).toHaveLength(illustrativeScenario.epochs);
    trace.losses.forEach((loss, index) => {
      if (index > 0) expect(loss).toBeLessThan(trace.losses[index - 1]);
    });
  });

  it("starts as a bad guess and ends confident in the target", () => {
    const trace = buildTrace(illustrativeScenario);
    const first = trace.epochs[0].probabilities[illustrativeScenario.targetIndex];
    const last = trace.epochs[trace.epochs.length - 1].probabilities[illustrativeScenario.targetIndex];
    expect(first).toBeLessThan(0.3);
    expect(last).toBeGreaterThan(0.7);
    expect(last).toBeGreaterThan(first);
  });

  it("matches the fixed teaching trace values", () => {
    expect(illustrativeTrace.losses.map((loss) => Number(loss.toFixed(2)))).toEqual([
      1.46, 0.6, 0.36, 0.32, 0.31,
    ]);
  });

  it("stores per-epoch weight gradients on every non-final epoch", () => {
    const trace = buildTrace(illustrativeScenario);
    trace.epochs.forEach((epoch, index) => {
      if (index < trace.epochs.length - 1) {
        expect(epoch.gradients).toHaveLength(3);
        expect(epoch.gradients![0]).toHaveLength(4); // W1: 4×3
        expect(epoch.gradients![0][0]).toHaveLength(3);
        expect(epoch.gradients![2]).toHaveLength(2); // W3: 2×4
        expect(epoch.gradients![2][0]).toHaveLength(4);
      } else {
        expect(epoch.gradients).toBeUndefined();
      }
    });
  });
});

describe("phase timelines", () => {
  it("defines every phase for every effect", () => {
    for (const effect of ["inference", "feed-forward", "backprop"] as const) {
      expect(neuralNetPhases[effect].length).toBeGreaterThan(0);
    }
  });

  it("keeps training-only phases inside the backprop effect", () => {
    const ids = neuralNetPhases.backprop.map((phase) => phase.id);
    expect(ids).toEqual(["forward", "loss", "backward-h2", "backward-h1", "update"]);
    const inferenceIds = neuralNetPhases.inference.map((phase) => phase.id);
    expect(inferenceIds).not.toContain("loss");
    expect(inferenceIds).not.toContain("update");
  });
});
