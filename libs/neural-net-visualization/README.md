# Neural Net Visualization

## Purpose

`@th-m/neural-net-visualization` renders declarative layered graph scenes. It
owns layout, animation controls, accessible state, and visual utilities for
nodes, edges, and value bars. A consumer owns the scene's meaning, labels,
numerical snapshots, and timeline; the library does not define training,
inference, targets, loss, or other neural-network concepts.

## Ontology

A **scene** contains ordered layers and nodes, static edges, optional value-bar
groups, named numerical snapshots, ordered steps, and one or more iterations.
Each iteration supplies one independent frame per step. A frame selects a
complete snapshot and can append node, edge, and value-bar classes, override a
node's displayed value text, change edge visibility, and provide accessible
labels and readouts. Nothing carries over from the previous frame.

Style builders convert domain-neutral visual options into deterministic atomic
class strings implemented by the package stylesheet. Article code can give
those strings meaningful local names such as `predictionNode` or `lossEdge`.

## Key Terms

- **Layer:** an ordered group of nodes; layer and node order determine layout.
- **Snapshot:** exactly one numeric value for every node in a scene.
- **Step:** a labeled position in an iteration's timeline.
- **Frame:** the complete snapshot reference and visual overrides for one step.
- **Iteration:** one ordered set of frames, such as an article-defined epoch.
- **Edge route:** geometry only: `between-nodes` or `outside-right`.
- **Value-bar group:** an ordered set of nodes whose current values are also
  rendered as bars, with an optional visible label.
- **Style builder:** a deterministic node, edge, or value-bar class composer.

## Public API

Define a scene close to the content that gives it meaning, then pass it to the
renderer:

```tsx
import {
  NeuralNetAnimation,
  defineNeuralNetScene,
  neuralNetEdgeStyle,
  neuralNetNodeStyle,
  neuralNetValueBarStyle,
} from "@th-m/neural-net-visualization";

const styles = {
  activeNode: neuralNetNodeStyle({ tone: "primary", motion: "pulse" }),
  activeEdge: neuralNetEdgeStyle({ tone: "primary", motion: "flow" }),
  importantBar: neuralNetValueBarStyle({ tone: "danger", emphasis: "strong" }),
};

const scene = defineNeuralNetScene({
  id: "small-example",
  copy: {
    eyebrow: "Layered graph",
    title: "Two complete frames",
    summary: "The consumer supplies the meaning.",
    disclaimer: "Illustrative values",
  },
  layers: [
    { id: "left", label: "Left", nodes: [{ id: "a", label: "A" }] },
    { id: "right", label: "Right", nodes: [{ id: "b", label: "B" }] },
  ],
  edges: [{ id: "a-b", from: "a", to: "b", label: "A to B" }],
  valueBarGroups: [{ id: "readout", nodeIds: ["b"], label: "Candidate values" }],
  steps: [
    { id: "before", label: "Before", detail: "Initial state" },
    { id: "after", label: "After", detail: "Changed state" },
  ],
  snapshots: [
    { id: "initial", nodeValues: [{ id: "a", value: 0.2 }, { id: "b", value: 0.4 }] },
    { id: "changed", nodeValues: [{ id: "a", value: 0.7 }, { id: "b", value: 0.9 }] },
  ],
  iterations: [{
    id: "example",
    frames: [
      { stepId: "before", snapshotId: "initial" },
      {
        stepId: "after",
        snapshotId: "changed",
        nodes: [{
          id: "b",
          className: styles.activeNode,
          valueBarClassName: styles.importantBar,
          displayValue: "+",
          ariaLabel: "B has a positive value",
        }],
        edges: [{ id: "a-b", className: styles.activeEdge }],
      },
    ],
  }],
});

export function Example() {
  return <NeuralNetAnimation scene={scene} />;
}
```

`NeuralNetAnimation` also accepts `loop`, `className`, and `reducedMotion`.
Import `@th-m/neural-net-visualization/styles.css` once in the web consumer
after the THOM design-theme CSS.

Scene copy always defines a title, summary, and disclaimer; the compact
eyebrow above the title is optional.

Node styles control tone, emphasis, ring, displayed-value tone, and motion.
Edge styles control tone, emphasis, pattern, motion, and flow direction.
Value-bar styles control tone, emphasis, outline, and motion. Consumers may
append their own classes to every returned string.

## Resolution and Accessibility

Every frame begins from static definitions, loads all numerical values from its
snapshot, appends frame classes, and then applies displayed-value, visibility,
and accessible-label overrides. The renderer exposes stable `data-*` identifiers for the
scene, iteration, step, snapshot, layers, nodes, edges, routes, and value-bar
groups.

Autoplay advances through steps and then iterations. Prev and Next cross
iteration boundaries; direct step selection stays in the current iteration and
pauses autoplay. Controls are real buttons with current-state attributes and a
live status region. Reduced motion initially shows the final frame of the final
iteration while retaining manual navigation.
