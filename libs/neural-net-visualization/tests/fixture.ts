import { defineNeuralNetScene, type NeuralNetScene } from "../src/scene";

export function sceneFixture(): NeuralNetScene {
  return defineNeuralNetScene({
    id: "test-scene",
    copy: {
      eyebrow: "Test graph",
      title: "Declarative scene",
      summary: "A small graph for renderer tests.",
      disclaimer: "Fixture values",
    },
    layers: [
      {
        id: "left",
        label: "Left layer",
        className: "fixture-layer",
        nodes: [
          { id: "a", label: "A", className: "fixture-node" },
          { id: "b", label: "B" },
        ],
      },
      {
        id: "right",
        label: "Right layer",
        nodes: [
          { id: "c", label: "C" },
          { id: "d", label: "D" },
        ],
      },
    ],
    edges: [
      { id: "a--c", from: "a", to: "c", label: "A to C", className: "fixture-edge" },
      {
        id: "c--d",
        from: "c",
        to: "d",
        label: "C to D annotation",
        route: "outside-right",
        visible: false,
      },
    ],
    valueBarGroups: [
      {
        id: "outputs",
        nodeIds: ["c", "d"],
        label: "Candidate values",
        ariaLabel: "Output values",
        className: "fixture-bars",
      },
    ],
    steps: [
      { id: "observe", label: "Observe", detail: "Read the first snapshot." },
      { id: "change", label: "Change", detail: "Read the second snapshot." },
    ],
    snapshots: [
      {
        id: "before",
        nodeValues: [
          { id: "a", value: 0.1 },
          { id: "b", value: 0.2 },
          { id: "c", value: 0.3 },
          { id: "d", value: 0.7 },
        ],
      },
      {
        id: "after",
        nodeValues: [
          { id: "a", value: 0.9 },
          { id: "b", value: 0.8 },
          { id: "c", value: 0.6 },
          { id: "d", value: 0.4 },
        ],
      },
    ],
    iterations: [
      {
        id: "first",
        label: "first iteration",
        frames: [
          {
            stepId: "observe",
            snapshotId: "before",
            nodes: [{ id: "c", className: "frame-node", valueBarClassName: "frame-bar" }],
            edges: [{ id: "a--c", className: "frame-edge" }],
            readouts: [{ id: "first-observe", text: "before" }],
          },
          {
            stepId: "change",
            snapshotId: "after",
            nodes: [{ id: "c", displayValue: "+", ariaLabel: "C has a positive value" }],
            edges: [{ id: "c--d", visible: true, label: "changed", className: "annotation-edge" }],
            readouts: [{ id: "first-change", text: "after" }],
          },
        ],
      },
      {
        id: "second",
        label: "second iteration",
        frames: [
          {
            stepId: "observe",
            snapshotId: "before",
            readouts: [{ id: "second-observe", text: "before again" }],
          },
          {
            stepId: "change",
            snapshotId: "after",
            edges: [{ id: "c--d", visible: true, label: "final" }],
            readouts: [{ id: "second-change", text: "final" }],
          },
        ],
      },
    ],
  });
}
