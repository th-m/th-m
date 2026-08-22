/**
 * Deterministic illustrative data for a simplified training walkthrough.
 * All values are authored teaching numbers, not recordings from a real run.
 */

export const trainingModes = ["simple", "model"] as const;
export type TrainingMode = (typeof trainingModes)[number];

export interface TrainingStep {
  id: string;
  title: string;
  description: string;
  signal: string;
  result: string;
}

export const simpleTrainingSteps: readonly TrainingStep[] = [
  {
    id: "corpus",
    title: "The model reads a fixed corpus",
    description:
      "Training starts with a set of example sentences. The model learns to predict each next token from the tokens before it.",
    signal: "corpus → sequences",
    result: "Next-token training pairs",
  },
  {
    id: "predict",
    title: "The model predicts the next token",
    description:
      "For each position, a forward pass produces a probability distribution over the vocabulary — exactly like inference.",
    signal: "p(next | context)",
    result: "Predicted distribution",
  },
  {
    id: "compare",
    title: "The prediction is compared with the target",
    description:
      "The actual next token from the corpus is the target. The model is scored by how much probability it assigned to the correct token.",
    signal: "target vs prediction",
    result: "Per-position mismatch",
  },
  {
    id: "loss",
    title: "Loss summarizes the mismatch",
    description:
      "Cross-entropy loss averages the negative log probability of the correct tokens. Lower loss means the model is surprised less often.",
    signal: "−log p(target)",
    result: "A single loss number",
  },
  {
    id: "epoch",
    title: "The whole corpus repeats",
    description:
      "One epoch is one full pass over the corpus. Repeated epochs give the optimizer many chances to nudge the parameters, and the loss curve falls.",
    signal: "epoch 1 → epoch 2 → …",
    result: "Loss curve",
  },
];

export const modelTrainingSteps: readonly TrainingStep[] = [
  {
    id: "embed",
    title: "Tokens enter as embeddings",
    description:
      "Corpus tokens are looked up in the learned embedding table, producing vectors the model can process.",
    signal: "token → embedding",
    result: "Input vectors",
  },
  {
    id: "forward",
    title: "A forward pass produces predictions",
    description:
      "Transformer blocks transform the vectors and an output layer scores every next-token candidate — the same pass used at inference.",
    signal: "forward pass",
    result: "Predicted distribution",
  },
  {
    id: "loss-step",
    title: "Loss measures the error",
    description:
      "Cross-entropy compares the prediction with the actual next token. This single number summarizes how wrong the model was.",
    signal: "−log p(target)",
    result: "Loss L",
  },
  {
    id: "backprop",
    title: "Gradients flow backward",
    description:
      "Backpropagation computes how much each parameter contributed to the loss, ∂L/∂θ, using the chain rule through the network.",
    signal: "∂L/∂θ",
    result: "Parameter gradients",
  },
  {
    id: "update",
    title: "The optimizer updates parameters",
    description:
      "Gradient descent nudges each parameter against its gradient: θ ← θ − η·∂L/∂θ. The learning rate η controls the step size.",
    signal: "θ ← θ − η·∂L/∂θ",
    result: "Updated parameters",
  },
  {
    id: "improve",
    title: "The next epoch improves",
    description:
      "With updated parameters the same corpus produces lower loss. The cycle repeats until the loss curve flattens.",
    signal: "repeat epochs",
    result: "Lower loss curve",
  },
];

export interface TrainingSentence {
  text: string;
  target: string;
}

/** Small fixed corpus used by the simple walkthrough. */
export const trainingCorpus: readonly TrainingSentence[] = [
  { text: "The cat sat on the", target: "mat" },
  { text: "A dog runs through the", target: "park" },
  { text: "She reads a book about", target: "space" },
];

/** Deterministic per-epoch loss trace for the curve. */
export const trainingLossTrace: readonly number[] = [
  4.31, 3.62, 3.05, 2.61, 2.24, 1.95, 1.72, 1.54, 1.41, 1.31, 1.24, 1.19,
];

export function trainingSteps(mode: TrainingMode): readonly TrainingStep[] {
  return mode === "simple" ? simpleTrainingSteps : modelTrainingSteps;
}
