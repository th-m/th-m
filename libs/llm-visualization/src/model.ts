export const visualizationViews = ["pipeline", "attention", "feed-forward", "autoregressive"] as const;
export type VisualizationView = (typeof visualizationViews)[number];

export const contentKinds = ["parameter", "activation"] as const;
export type ContentKind = (typeof contentKinds)[number];

export const stageIds = [
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
] as const;
export type VisualizationStageId = (typeof stageIds)[number];

export interface VisualizationStage {
  id: VisualizationStageId;
  shortLabel: string;
  title: string;
  description: string;
  signal: string;
  result: string;
  view: VisualizationView;
  kinds: readonly ContentKind[];
}

export const visualizationStages = [
  {
    id: "representations",
    shortLabel: "Represent",
    title: "Tokens become contextual coordinates",
    description: "Token IDs look up learned vectors. Positional information is combined with them so identical words at different positions can behave differently.",
    signal: "Token + position",
    result: "Initial residual stream",
    view: "pipeline",
    kinds: ["parameter", "activation"],
  },
  {
    id: "residual-entry",
    shortLabel: "Enter block",
    title: "The residual stream enters a transformer block",
    description: "A running representation carries information through the network. Each sublayer reads it and writes a learned update back to it.",
    signal: "xₗ",
    result: "Normalized block input",
    view: "pipeline",
    kinds: ["activation"],
  },
  {
    id: "attention",
    shortLabel: "Attend",
    title: "Causal self-attention routes information",
    description: "Several attention heads inspect the same context in parallel. A causal mask prevents every position from looking at tokens that come after it.",
    signal: "Normalized residual",
    result: "Per-head context",
    view: "attention",
    kinds: ["parameter", "activation"],
  },
  {
    id: "qkv",
    shortLabel: "Project Q/K/V",
    title: "Learned projections create queries, keys, and values",
    description: "Queries express what a position seeks, keys express what each prior position offers, and values carry the information that may be mixed.",
    signal: "xWQ · xWK · xWV",
    result: "Q, K, and V activations",
    view: "attention",
    kinds: ["parameter", "activation"],
  },
  {
    id: "score-mix",
    shortLabel: "Score + mix",
    title: "Allowed relationships become a weighted value mix",
    description: "Scaled query–key scores are masked and normalized. Their weights combine value vectors, producing a context-sensitive update for each position.",
    signal: "softmax(QKᵀ / √d + mask)V",
    result: "Attention update",
    view: "attention",
    kinds: ["activation"],
  },
  {
    id: "residual-norm",
    shortLabel: "Add + norm",
    title: "The attention update rejoins the residual stream",
    description: "The sublayer output is added to the skip path. Normalization keeps feature scales well-behaved before the next learned transformation.",
    signal: "x + attention(x)",
    result: "Updated residual stream",
    view: "pipeline",
    kinds: ["parameter", "activation"],
  },
  {
    id: "feed-forward",
    shortLabel: "Transform",
    title: "The feed-forward network transforms each position",
    description: "A learned projection expands the feature dimension, a nonlinearity gates the result, and another projection compresses it back into the residual width.",
    signal: "Wdown · GELU(Wup · x)",
    result: "MLP update",
    view: "feed-forward",
    kinds: ["parameter", "activation"],
  },
  {
    id: "stacked-blocks",
    shortLabel: "Repeat",
    title: "The same block pattern repeats at depth",
    description: "Each layer owns different learned weights, while the activation stream passes forward. Later blocks can build on features composed by earlier ones.",
    signal: "xₗ → xₗ₊₁",
    result: "Final hidden state",
    view: "pipeline",
    kinds: ["parameter", "activation"],
  },
  {
    id: "logits",
    shortLabel: "Project logits",
    title: "The final state is projected into vocabulary logits",
    description: "A learned output matrix scores every vocabulary item. Logits are unnormalized preferences, not probabilities or claims of certainty.",
    signal: "hfinal · Wvocab",
    result: "Vocabulary logits",
    view: "pipeline",
    kinds: ["parameter", "activation"],
  },
  {
    id: "decode",
    shortLabel: "Decode",
    title: "A decoding rule selects the next token",
    description: "Softmax converts logits into a distribution. Greedy choice, sampling, temperature, and other policies can select differently from the same logits.",
    signal: "softmax(logits / temperature)",
    result: "Selected token: “the”",
    view: "autoregressive",
    kinds: ["activation"],
  },
  {
    id: "feedback",
    shortLabel: "Feed back",
    title: "The selected token extends the context",
    description: "The new token is appended and another inference step begins. Cached keys and values can avoid recomputing all earlier attention states.",
    signal: "context ⊕ token",
    result: "Next inference step",
    view: "autoregressive",
    kinds: ["activation"],
  },
] as const satisfies readonly VisualizationStage[];

export const viewLabels: Record<VisualizationView, string> = {
  pipeline: "Whole pipeline",
  attention: "Attention",
  "feed-forward": "Feed-forward",
  autoregressive: "Token loop",
};

export const kindLabels: Record<ContentKind, string> = {
  parameter: "Persistent learned parameter",
  activation: "Temporary activation",
};

export const illustrativeScenario = {
  context: [
    { token: "The", position: 0, embedding: [0.18, -0.42, 0.72, 0.11] },
    { token: "model", position: 1, embedding: [-0.31, 0.64, 0.08, 0.47] },
    { token: "writes", position: 2, embedding: [0.55, 0.21, -0.36, 0.19] },
    { token: "a", position: 3, embedding: [0.09, -0.17, 0.44, 0.68] },
  ],
  causalAttention: [
    [1, 0, 0, 0],
    [0.36, 0.64, 0, 0],
    [0.18, 0.29, 0.53, 0],
    [0.08, 0.19, 0.27, 0.46],
  ],
  heads: [
    { label: "syntax", weights: [0.08, 0.19, 0.27, 0.46] },
    { label: "reference", weights: [0.12, 0.44, 0.31, 0.13] },
    { label: "recency", weights: [0.04, 0.1, 0.24, 0.62] },
  ],
  mlpExpansion: [-0.14, 0.62, 0.09, 0.78, -0.41, 0.33, 0.57, -0.08],
  vocabulary: [
    { token: "the", logit: 3.42, probability: 0.62 },
    { token: "story", logit: 2.24, probability: 0.19 },
    { token: "next", logit: 1.69, probability: 0.11 },
    { token: "world", logit: 1.37, probability: 0.08 },
  ],
  selectedToken: "the",
  temperature: 1,
} as const;

export function stageIndex(stageId: VisualizationStageId): number {
  return visualizationStages.findIndex((stage) => stage.id === stageId);
}
