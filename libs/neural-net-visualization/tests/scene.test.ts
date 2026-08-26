import { describe, expect, it } from "vitest";
import { defineNeuralNetScene, type NeuralNetScene } from "../src/scene";
import { sceneFixture } from "./fixture";

function altered(change: (scene: NeuralNetScene) => void): NeuralNetScene {
  const scene = structuredClone(sceneFixture());
  change(scene);
  return scene;
}

describe("defineNeuralNetScene", () => {
  it("returns a valid scene unchanged", () => {
    const scene = sceneFixture();
    expect(defineNeuralNetScene(scene)).toBe(scene);
  });

  it("rejects duplicate IDs", () => {
    const scene = altered((value) => {
      (value.layers[0].nodes as Array<{ id: string; label: string }>)[1].id = "a";
    });
    expect(() => defineNeuralNetScene(scene)).toThrow("Duplicate node id: a");
  });

  it("rejects invalid edge and frame references", () => {
    const invalidEdge = altered((value) => {
      (value.edges[0] as { from: string }).from = "missing";
    });
    expect(() => defineNeuralNetScene(invalidEdge)).toThrow("unknown source node");

    const invalidFrame = altered((value) => {
      (value.iterations[0].frames[0] as { snapshotId: string }).snapshotId = "missing";
    });
    expect(() => defineNeuralNetScene(invalidFrame)).toThrow("unknown snapshot");
  });

  it("requires complete snapshots", () => {
    const scene = altered((value) => {
      (value.snapshots[0].nodeValues as Array<{ id: string; value: number }>).pop();
    });
    expect(() => defineNeuralNetScene(scene)).toThrow("is missing node values: d");
  });

  it("requires exactly one frame for every step in every iteration", () => {
    const scene = altered((value) => {
      (value.iterations[0].frames as Array<unknown>).pop();
    });
    expect(() => defineNeuralNetScene(scene)).toThrow("is missing frames for steps: change");
  });

  it("rejects an empty frame-local display value", () => {
    const scene = altered((value) => {
      const node = value.iterations[0].frames[0].nodes?.[0];
      if (!node) throw new Error("Fixture node is missing.");
      node.displayValue = " ";
    });
    expect(() => defineNeuralNetScene(scene)).toThrow("displayValue must not be empty");
  });
});
