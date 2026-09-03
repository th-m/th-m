import {
  NeuralNetAnimation,
  defineNeuralNetScene,
  neuralNetEdgeStyle,
  neuralNetNodeStyle,
  neuralNetValueBarStyle,
  type NeuralNetEdgeState,
  type NeuralNetNodeState,
} from "@th-m/neural-net-visualization";
import "./neural-inference-figure.css";

const contextNodeIds = ["context-1", "context-2", "context-t"] as const;
const transformer1NodeIds = [
  "transformer-1-1",
  "transformer-1-2",
  "transformer-1-3",
  "transformer-1-4",
] as const;
const transformerNNodeIds = [
  "transformer-n-1",
  "transformer-n-2",
  "transformer-n-3",
  "transformer-n-4",
] as const;
const outputNodeIds = ["output-mat", "output-floor", "output-chair"] as const;
const allNodeIds = [
  ...contextNodeIds,
  ...transformer1NodeIds,
  ...transformerNNodeIds,
  ...outputNodeIds,
] as const;

type InferenceNodeId = (typeof allNodeIds)[number];

const nodeLabels: Record<InferenceNodeId, string> = {
  "context-1": "x₁",
  "context-2": "x₂",
  "context-t": "xₜ",
  "transformer-1-1": "h¹₁",
  "transformer-1-2": "h¹₂",
  "transformer-1-3": "h¹₃",
  "transformer-1-4": "h¹₄",
  "transformer-n-1": "hᴺ₁",
  "transformer-n-2": "hᴺ₂",
  "transformer-n-3": "hᴺ₃",
  "transformer-n-4": "hᴺ₄",
  "output-mat": "“mat”",
  "output-floor": "“floor”",
  "output-chair": "“chair”",
};

const inferenceStyles = {
  baseNode: neuralNetNodeStyle(),
  activeNode: neuralNetNodeStyle({
    tone: "primary",
    emphasis: "strong",
    valueTone: "strong",
    motion: "pulse",
  }),
  candidateNode: neuralNetNodeStyle({
    tone: "primary",
    valueTone: "tone",
  }),
  selectedNode: neuralNetNodeStyle({
    tone: "accent",
    emphasis: "strong",
    ring: "solid",
    valueTone: "tone",
    motion: "pulse",
  }),
  baseEdge: neuralNetEdgeStyle(),
  forwardEdge: neuralNetEdgeStyle({
    tone: "primary",
    emphasis: "strong",
    motion: "flow",
    direction: "start-to-end",
  }),
  selectedEdge: neuralNetEdgeStyle({
    tone: "accent",
    emphasis: "strong",
    motion: "flow",
    direction: "start-to-end",
  }),
  candidateBar: neuralNetValueBarStyle({ tone: "primary" }),
  selectedBar: neuralNetValueBarStyle({
    tone: "accent",
    emphasis: "strong",
    motion: "pulse",
  }),
};

function nodes(ids: readonly InferenceNodeId[]) {
  return ids.map((id) => ({
    id,
    label: nodeLabels[id],
    ariaLabel: `${nodeLabels[id]} inference node`,
    className: inferenceStyles.baseNode,
  }));
}

function connectionId(from: string, to: string): string {
  return `${from}--${to}`;
}

function connectLayers(
  fromIds: readonly InferenceNodeId[],
  toIds: readonly InferenceNodeId[],
) {
  return fromIds.flatMap((from) =>
    toIds.map((to) => ({
      id: connectionId(from, to),
      from,
      to,
      label: `Fixed learned connection from ${nodeLabels[from]} to ${nodeLabels[to]}`,
      className: inferenceStyles.baseEdge,
    })),
  );
}

function states(
  ids: readonly InferenceNodeId[],
  className: string,
): NeuralNetNodeState[] {
  return ids.map((id) => ({ id, className }));
}

const forwardPath = [
  connectionId("context-t", "transformer-1-3"),
  connectionId("transformer-1-3", "transformer-n-4"),
] as const;

function forwardEdges(): NeuralNetEdgeState[] {
  return forwardPath.map((id) => ({
    id,
    className: inferenceStyles.forwardEdge,
  }));
}

const inferenceScene = defineNeuralNetScene({
  id: "autoregressive-inference",
  copy: {
    eyebrow: "Fixed weights · changing context",
    title: "LLM Inference",
    summary:
      "One schematic forward pass turns “The cat sat on the …” into next-token probabilities.",
    disclaimer:
      "Inference-only illustration · fixed trained weights · three candidates shown from a much larger vocabulary",
  },
  layers: [
    {
      id: "context",
      label: "Context token states",
      nodes: nodes(contextNodeIds),
    },
    {
      id: "transformer-1",
      label: "First transformer block",
      nodes: nodes(transformer1NodeIds),
    },
    {
      id: "transformer-n",
      label: "Final transformer block",
      nodes: nodes(transformerNNodeIds),
    },
    {
      id: "output",
      label: "Vocabulary candidates",
      nodes: nodes(outputNodeIds),
    },
  ],
  edges: [
    ...connectLayers(contextNodeIds, transformer1NodeIds),
    ...connectLayers(transformer1NodeIds, transformerNNodeIds),
    ...connectLayers(transformerNNodeIds, outputNodeIds),
    {
      id: "append-selected-token",
      from: "output-mat",
      to: "context-t",
      label: "Append the selected token to the context",
      route: "outside-right",
      className: inferenceStyles.baseEdge,
      visible: false,
    },
  ],
  valueBarGroups: [
    {
      id: "next-token-probabilities",
      nodeIds: outputNodeIds,
      label: "Illustrative next-token probabilities",
      ariaLabel:
        "Illustrative next-token probabilities after The cat sat on the",
    },
  ],
  steps: [
    {
      id: "context",
      label: "Context",
      detail:
        "The current tokens are encoded as context. The trained parameters are available but remain fixed.",
    },
    {
      id: "forward",
      label: "Forward pass",
      detail:
        "Attention and feed-forward operations transform the context into a final-position hidden state.",
    },
    {
      id: "distribution",
      label: "Distribution",
      detail:
        "An output projection produces vocabulary logits; softmax converts them into next-token probabilities.",
    },
    {
      id: "append",
      label: "Select + append",
      detail:
        "A decoding rule selects “mat”, appends it to the context, and begins another forward pass.",
    },
  ],
  snapshots: [
    {
      id: "fixed-weights-pass",
      nodeValues: [
        { id: "context-1", value: 0.62 },
        { id: "context-2", value: -0.18 },
        { id: "context-t", value: 0.91 },
        { id: "transformer-1-1", value: 0.14 },
        { id: "transformer-1-2", value: -0.47 },
        { id: "transformer-1-3", value: 0.66 },
        { id: "transformer-1-4", value: 0.38 },
        { id: "transformer-n-1", value: -0.21 },
        { id: "transformer-n-2", value: 0.42 },
        { id: "transformer-n-3", value: 0.15 },
        { id: "transformer-n-4", value: 0.79 },
        { id: "output-mat", value: 0.72 },
        { id: "output-floor", value: 0.18 },
        { id: "output-chair", value: 0.1 },
      ],
    },
  ],
  iterations: [
    {
      id: "next-token-cycle",
      label: "context x[≤t] · weights θ fixed",
      frames: [
        {
          stepId: "context",
          snapshotId: "fixed-weights-pass",
          nodes: states(contextNodeIds, inferenceStyles.activeNode),
          readouts: [
            {
              id: "context-readout",
              text: "x[≤t] = “The cat sat on the”",
              className: "neural-inference-figure__context-readout",
            },
          ],
        },
        {
          stepId: "forward",
          snapshotId: "fixed-weights-pass",
          nodes: states(
            ["context-t", "transformer-1-3", "transformer-n-4"],
            inferenceStyles.activeNode,
          ),
          edges: forwardEdges(),
          readouts: [
            {
              id: "forward-readout",
              text: "hₜ = transformerθ(x[≤t]) · no parameter update",
              className: "neural-inference-figure__forward-readout",
            },
          ],
        },
        {
          stepId: "distribution",
          snapshotId: "fixed-weights-pass",
          nodes: outputNodeIds.map((id) => ({
            id,
            className: inferenceStyles.candidateNode,
            valueBarClassName: inferenceStyles.candidateBar,
          })),
          edges: outputNodeIds.map((id) => ({
            id: connectionId("transformer-n-4", id),
            className: inferenceStyles.forwardEdge,
          })),
          readouts: [
            {
              id: "distribution-readout",
              text: "p(x[t+1] | x[≤t]) = softmax(W hₜ)",
              className: "neural-inference-figure__distribution-readout",
            },
          ],
        },
        {
          stepId: "append",
          snapshotId: "fixed-weights-pass",
          nodes: [
            {
              id: "output-mat",
              className: inferenceStyles.selectedNode,
              valueBarClassName: inferenceStyles.selectedBar,
              ariaLabel:
                "The decoding rule selects mat with an illustrative probability of 0.72",
            },
          ],
          edges: [
            {
              id: connectionId("transformer-n-4", "output-mat"),
              className: inferenceStyles.selectedEdge,
            },
            {
              id: "append-selected-token",
              visible: true,
              label: "append + repeat",
              className: inferenceStyles.selectedEdge,
              ariaLabel:
                "The selected token mat is appended to the context before the next forward pass",
            },
          ],
          readouts: [
            {
              id: "append-readout",
              text: "select “mat” → append to context → repeat · weights unchanged",
              className: "neural-inference-figure__append-readout",
            },
          ],
        },
      ],
    },
  ],
});

export function NeuralInferenceFigure() {
  return (
    <figure className="article-figure neural-inference-figure">
      <NeuralNetAnimation scene={inferenceScene} />
      <figcaption>
        Inference uses fixed learned weights to transform the current context
        into a probability distribution, select a token, append it, and repeat.
        It does not by itself verify truth or update those weights.
      </figcaption>
    </figure>
  );
}
