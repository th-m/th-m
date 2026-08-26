import {
  NeuralNetAnimation,
  defineNeuralNetScene,
  neuralNetEdgeStyle,
  neuralNetNodeStyle,
  neuralNetValueBarStyle,
  type NeuralNetEdgeState,
  type NeuralNetNodeState,
  type NeuralNetValueSnapshot,
} from "@th-m/neural-net-visualization";
import "./neural-training-figure.css";

const inputNodeIds = ["input-1", "input-2", "input-3"] as const;
const hidden1NodeIds = ["hidden-1-1", "hidden-1-2", "hidden-1-3", "hidden-1-4"] as const;
const hidden2NodeIds = ["hidden-2-1", "hidden-2-2", "hidden-2-3", "hidden-2-4"] as const;
const outputNodeIds = ["output-mat", "output-floor"] as const;
const allNodeIds = [...inputNodeIds, ...hidden1NodeIds, ...hidden2NodeIds, ...outputNodeIds] as const;
const activationPathNodeIds = ["input-1", "hidden-1-3", "hidden-2-4"] as const;

const nodeLabels: Record<(typeof allNodeIds)[number], string> = {
  "input-1": "Input 1",
  "input-2": "Input 2",
  "input-3": "Input 3",
  "hidden-1-1": "Hidden 1.1",
  "hidden-1-2": "Hidden 1.2",
  "hidden-1-3": "Hidden 1.3",
  "hidden-1-4": "Hidden 1.4",
  "hidden-2-1": "Hidden 2.1",
  "hidden-2-2": "Hidden 2.2",
  "hidden-2-3": "Hidden 2.3",
  "hidden-2-4": "Hidden 2.4",
  "output-mat": "“mat”",
  "output-floor": "“floor”",
};

const trainingStyles = {
  baseNode: neuralNetNodeStyle(),
  activationNode: neuralNetNodeStyle({
    tone: "primary",
    emphasis: "strong",
    valueTone: "strong",
    motion: "pulse",
  }),
  targetNode: neuralNetNodeStyle({
    tone: "danger",
    ring: "dashed",
    valueTone: "tone",
  }),
  updatingNode: neuralNetNodeStyle({
    tone: "primary",
    emphasis: "strong",
    valueTone: "strong",
    motion: "swap",
  }),
  baseEdge: neuralNetEdgeStyle(),
  forwardEdge: neuralNetEdgeStyle({
    tone: "primary",
    emphasis: "strong",
    motion: "flow",
    direction: "start-to-end",
  }),
  backwardEdge: neuralNetEdgeStyle({
    tone: "accent",
    emphasis: "strong",
    motion: "flow",
    direction: "end-to-start",
  }),
  lossEdge: neuralNetEdgeStyle({
    tone: "danger",
    emphasis: "strong",
    pattern: "dashed",
    motion: "pulse",
  }),
  targetBar: neuralNetValueBarStyle({ tone: "danger", outline: "dashed" }),
  targetLossBar: neuralNetValueBarStyle({
    tone: "danger",
    emphasis: "strong",
    outline: "dashed",
    motion: "pulse",
  }),
};

function nodes(ids: readonly (typeof allNodeIds)[number][]) {
  return ids.map((id) => ({
    id,
    label: nodeLabels[id],
    ariaLabel: `${nodeLabels[id]} neural-network node`,
    className: trainingStyles.baseNode,
  }));
}

function connectionId(from: string, to: string): string {
  return `${from}--${to}`;
}

function connectLayers(
  fromIds: readonly (typeof allNodeIds)[number][],
  toIds: readonly (typeof allNodeIds)[number][],
) {
  return fromIds.flatMap((from) => toIds.map((to) => ({
    id: connectionId(from, to),
    from,
    to,
    label: `Learned connection from ${nodeLabels[from]} to ${nodeLabels[to]}`,
    className: trainingStyles.baseEdge,
  })));
}

function snapshot(
  id: string,
  values: readonly number[],
): NeuralNetValueSnapshot {
  return {
    id,
    nodeValues: allNodeIds.map((nodeId, index) => ({ id: nodeId, value: values[index] })),
  };
}

const snapshots = [
  snapshot("epoch-1", [
    0.52, 0.31, -0.44,
    0.06002774379392694, -0.18678127366538738, 0.4057390813069377, -0.4191001970859926,
    0.07753354726473805, -0.31823185388965375, 0.11524126081475193, 0.1595514812368235,
    0.2322809414966061, 0.767719058503394,
  ]),
  snapshot("epoch-2", [
    0.52, 0.31, -0.44,
    -0.03055218356054491, -0.25589517990661476, 0.42010393692451553, -0.4251616277795976,
    -0.24613465385683017, -0.5191608194186683, -0.17398451700748915, -0.05933491709902184,
    0.5503530165472155, 0.44964698345278453,
  ]),
  snapshot("epoch-3", [
    0.52, 0.31, -0.44,
    -0.0622430400686577, -0.29743105408514986, 0.446749312689328, -0.45006073113701656,
    -0.3728823053740739, -0.5969392259109045, -0.2924869941861949, -0.15590822419752642,
    0.6955980285291334, 0.3044019714708666,
  ]),
  snapshot("epoch-4", [
    0.52, 0.31, -0.44,
    -0.07258390958847608, -0.31510758306747827, 0.4586291394602005, -0.4613711782307941,
    -0.4160508999479216, -0.6250672475471816, -0.33401641564342704, -0.1945208435135514,
    0.7264432655770496, 0.2735567344229505,
  ]),
  snapshot("epoch-5", [
    0.52, 0.31, -0.44,
    -0.07784456809643338, -0.3258157029328527, 0.4658154706077745, -0.46823984355145415,
    -0.4396299878695676, -0.6414052890747743, -0.3566790030959781, -0.2177012659900268,
    0.7365808314262619, 0.26341916857373826,
  ]),
] as const;

type GradientLabels = readonly (readonly string[])[];

interface EpochDefinition {
  id: string;
  nextSnapshot: string;
  targetProbability: number;
  loss: number;
  nextLoss: number;
  hidden2Gradients?: GradientLabels;
  hidden1Gradients?: GradientLabels;
}

const epochData: readonly EpochDefinition[] = [
  {
    id: "epoch-1",
    nextSnapshot: "epoch-2",
    targetProbability: 0.2322809414966061,
    loss: 1.4598076852033697,
    nextLoss: 0.5971953583844571,
    hidden2Gradients: [
      ["+0.03", "-0.12", "+0.05", "+0.06"],
      ["-0.14", "+0.57", "-0.21", "-0.29"],
    ],
    hidden1Gradients: [
      ["+0.14", "-0.44", "+0.96", "-0.99"],
      ["+0.11", "-0.33", "+0.71", "-0.74"],
      ["+0.11", "-0.33", "+0.72", "-0.74"],
      ["+0.09", "-0.28", "+0.62", "-0.64"],
    ],
  },
  {
    id: "epoch-2",
    nextSnapshot: "epoch-3",
    targetProbability: 0.5503530165472155,
    loss: 0.5971953583844571,
    nextLoss: 0.3629833307079613,
    hidden2Gradients: [
      ["+0.02", "+0.04", "+0.01", "+0.00"],
      ["+0.22", "+0.46", "+0.15", "+0.05"],
    ],
    hidden1Gradients: [
      ["-0.03", "-0.24", "+0.39", "-0.40"],
      ["-0.02", "-0.17", "+0.28", "-0.28"],
      ["-0.02", "-0.18", "+0.30", "-0.30"],
      ["-0.02", "-0.17", "+0.27", "-0.28"],
    ],
  },
  {
    id: "epoch-3",
    nextSnapshot: "epoch-4",
    targetProbability: 0.6955980285291334,
    loss: 0.3629833307079613,
    nextLoss: 0.3195948918263636,
    hidden2Gradients: [
      ["+0.09", "+0.15", "+0.07", "+0.04"],
      ["+0.16", "+0.25", "+0.12", "+0.07"],
    ],
    hidden1Gradients: [
      ["-0.02", "-0.10", "+0.14", "-0.14"],
      ["-0.01", "-0.07", "+0.10", "-0.11"],
      ["-0.02", "-0.07", "+0.11", "-0.11"],
      ["-0.02", "-0.07", "+0.11", "-0.11"],
    ],
  },
  {
    id: "epoch-4",
    nextSnapshot: "epoch-5",
    targetProbability: 0.7264432655770496,
    loss: 0.3195948918263636,
    nextLoss: 0.30573629835313626,
    hidden2Gradients: [
      ["+0.11", "+0.17", "+0.09", "+0.05"],
      ["+0.12", "+0.18", "+0.10", "+0.06"],
    ],
    hidden1Gradients: [
      ["-0.01", "-0.06", "+0.08", "-0.08"],
      ["-0.01", "-0.04", "+0.06", "-0.06"],
      ["-0.01", "-0.04", "+0.06", "-0.06"],
      ["-0.01", "-0.05", "+0.07", "-0.07"],
    ],
  },
  {
    id: "epoch-5",
    nextSnapshot: "epoch-5",
    targetProbability: 0.7365808314262619,
    loss: 0.30573629835313626,
    nextLoss: 0.30573629835313626,
  },
] as const;

function joinClasses(...values: Array<string | undefined>): string {
  return values.filter(Boolean).join(" ");
}

function mergeNodeStates(...states: NeuralNetNodeState[]): NeuralNetNodeState[] {
  const merged = new Map<string, NeuralNetNodeState>();
  for (const state of states) {
    const current = merged.get(state.id);
    merged.set(state.id, {
      id: state.id,
      className: joinClasses(current?.className, state.className) || undefined,
      valueBarClassName: joinClasses(current?.valueBarClassName, state.valueBarClassName) || undefined,
      displayValue: state.displayValue ?? current?.displayValue,
      ariaLabel: state.ariaLabel ?? current?.ariaLabel,
    });
  }
  return [...merged.values()];
}

function activationPathNodeStates(): NeuralNetNodeState[] {
  return activationPathNodeIds.map((id) => ({
    id,
    className: trainingStyles.activationNode,
  }));
}

function activationPathEdges(): NeuralNetEdgeState[] {
  return [
    {
      id: connectionId("input-1", "hidden-1-3"),
      className: trainingStyles.forwardEdge,
    },
    {
      id: connectionId("hidden-1-3", "hidden-2-4"),
      className: trainingStyles.forwardEdge,
    },
  ];
}

function lossNodeStates(): NeuralNetNodeState[] {
  return mergeNodeStates(
    { id: "input-1", className: trainingStyles.activationNode },
    { id: "hidden-1-3", className: trainingStyles.activationNode },
    { id: "hidden-2-4", className: trainingStyles.activationNode },
    {
      id: "output-mat",
      className: trainingStyles.targetNode,
      valueBarClassName: trainingStyles.targetLossBar,
    },
  );
}

const snapshotValuesById: ReadonlyMap<string, ReadonlyMap<string, number>> = new Map(
  snapshots.map((valueSnapshot) => [
    valueSnapshot.id,
    new Map(valueSnapshot.nodeValues.map(({ id, value }) => [id, value])),
  ]),
);

function updatePathNodeStates(snapshotId: string): NeuralNetNodeState[] {
  const values = snapshotValuesById.get(snapshotId);
  if (!values) throw new Error(`Missing update snapshot ${snapshotId}.`);

  return activationPathNodeIds.map((id) => {
    const value = values.get(id);
    if (value === undefined) throw new Error(`Missing update value for ${id} in ${snapshotId}.`);
    const positive = value >= 0;
    return {
      id,
      className: joinClasses(
        trainingStyles.updatingNode,
        `neural-training-figure__update-sign--${positive ? "positive" : "negative"}`,
      ),
      displayValue: positive ? "+" : "−",
      ariaLabel: `${nodeLabels[id]} has a ${positive ? "positive" : "negative"} value after the update`,
    };
  });
}

function backpropagationEdges(
  hidden2Labels?: GradientLabels,
  hidden1Labels?: GradientLabels,
): NeuralNetEdgeState[] {
  const targetToHidden2Label = hidden2Labels?.[1]?.[3];
  const hidden2ToHidden1Label = hidden1Labels?.[3]?.[2];
  return [
    {
      id: connectionId("hidden-2-4", "output-mat"),
      className: trainingStyles.backwardEdge,
      ...(targetToHidden2Label ? { label: targetToHidden2Label } : {}),
    },
    {
      id: connectionId("hidden-1-3", "hidden-2-4"),
      className: trainingStyles.backwardEdge,
      ...(hidden2ToHidden1Label ? { label: hidden2ToHidden1Label } : {}),
    },
    {
      id: connectionId("input-1", "hidden-1-3"),
      className: trainingStyles.backwardEdge,
    },
    ...hidden2NodeIds.map((from) => ({
      id: connectionId(from, "output-floor"),
      visible: false,
    })),
  ];
}

const trainingScene = defineNeuralNetScene({
  id: "next-token-training",
  copy: {
    title: "LLM Training",
    summary: "Next-token probabilities for “The cat sat on the …”",
    disclaimer: "Training-only illustration · deterministic teaching frames · not a live training run",
  },
  layers: [
    { id: "input", label: "Input layer", nodes: nodes(inputNodeIds) },
    { id: "hidden-1", label: "First hidden layer", nodes: nodes(hidden1NodeIds) },
    { id: "hidden-2", label: "Final hidden layer", nodes: nodes(hidden2NodeIds) },
    { id: "output", label: "Output layer", nodes: nodes(outputNodeIds) },
  ],
  edges: [
    ...connectLayers(inputNodeIds, hidden1NodeIds),
    ...connectLayers(hidden1NodeIds, hidden2NodeIds),
    ...connectLayers(hidden2NodeIds, outputNodeIds),
  ],
  valueBarGroups: [
    {
      id: "output-probabilities",
      nodeIds: outputNodeIds,
      ariaLabel: "Model’s next-token probabilities after The cat sat on the",
    },
  ],
  steps: [
    { id: "forward", label: "Forward pass", detail: "The signal moves left to right and the model guesses." },
    {
      id: "loss",
      label: "Target + loss",
      detail: "The target is the actual next token in the training data; loss is higher when the model assigns that token less probability.",
    },
    {
      id: "backward",
      label: "Backpropagation",
      detail: "The gradient travels from the target back through the prediction path; the input stays fixed while its connected weights receive gradients.",
    },
    {
      id: "update",
      label: "Update",
      detail: "The optimizer uses the gradients to adjust the weights, making the observed token more likely in future predictions.",
    },
  ],
  snapshots,
  iterations: epochData.map((epoch, epochIndex) => {
    return {
      id: epoch.id,
      label: `epoch ${epochIndex + 1} / ${epochData.length}`,
      frames: [
        {
          stepId: "forward",
          snapshotId: epoch.id,
          nodes: activationPathNodeStates(),
          edges: activationPathEdges(),
        },
        {
          stepId: "loss",
          snapshotId: epoch.id,
          nodes: lossNodeStates(),
          edges: [
            ...activationPathEdges(),
            {
              id: connectionId("hidden-2-4", "output-mat"),
              className: trainingStyles.lossEdge,
              ariaLabel: "Highlighted contribution from the final hidden activation to the target token mat",
            },
          ],
          readouts: [{
            id: `${epoch.id}-loss`,
            text: `loss −ln ${epoch.targetProbability.toFixed(2)} = ${epoch.loss.toFixed(2)}`,
            className: "neural-training-figure__loss-readout",
          }],
        },
        {
          stepId: "backward",
          snapshotId: epoch.id,
          nodes: mergeNodeStates(
            { id: "input-1", className: trainingStyles.activationNode },
            { id: "hidden-1-3", className: trainingStyles.activationNode },
            { id: "hidden-2-4", className: trainingStyles.activationNode },
            {
              id: "output-mat",
              className: trainingStyles.targetNode,
              valueBarClassName: trainingStyles.targetBar,
            },
          ),
          edges: backpropagationEdges(epoch.hidden2Gradients, epoch.hidden1Gradients),
          readouts: [{
            id: `${epoch.id}-gradient`,
            text: "gradient ∂L/∂θ",
            className: "neural-training-figure__gradient-readout",
          }],
        },
        {
          stepId: "update",
          snapshotId: epoch.nextSnapshot,
          nodes: updatePathNodeStates(epoch.nextSnapshot),
          readouts: [{
            id: `${epoch.id}-update`,
            text: epochIndex < epochData.length - 1
              ? `loss ${epoch.loss.toFixed(2)} → ${epoch.nextLoss.toFixed(2)}`
              : `loss ${epoch.loss.toFixed(2)} · final`,
            className: "neural-training-figure__loss-readout",
          }],
        },
      ],
    };
  }),
});

export function NeuralTrainingFigure() {
  return (
    <figure className="article-figure neural-training-figure">
      <NeuralNetAnimation scene={trainingScene} />
      <figcaption>
        A bad guess, then backpropagation adjusting the network. Training changes the model&apos;s
        weights; inference later uses those weights.
      </figcaption>
    </figure>
  );
}
