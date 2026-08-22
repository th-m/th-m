/**
 * Deterministic decoding-strategy teaching data. The base logits are fixed
 * illustrative values so every strategy can be compared against the same
 * next-token distribution.
 */

export const decodingStrategies = ["greedy", "temperature", "top-k", "top-p"] as const;
export type DecodingStrategy = (typeof decodingStrategies)[number];

export interface DecodingStrategyInfo {
  id: DecodingStrategy;
  label: string;
  description: string;
}

export const decodingStrategyInfos: Record<DecodingStrategy, DecodingStrategyInfo> = {
  greedy: {
    id: "greedy",
    label: "Greedy",
    description:
      "Always select the token with the highest probability. Deterministic, but it can lock the model into repetitive or flat continuations.",
  },
  temperature: {
    id: "temperature",
    label: "Temperature",
    description:
      "Divide logits by a temperature before softmax. Below 1 concentrates the distribution; above 1 flattens it, making lower-ranked tokens more likely.",
  },
  "top-k": {
    id: "top-k",
    label: "Top-k",
    description:
      "Restrict sampling to the k most probable tokens, renormalize, and sample from that shortlist. Prevents very unlikely tokens from ever being chosen.",
  },
  "top-p": {
    id: "top-p",
    label: "Top-p (nucleus)",
    description:
      "Restrict sampling to the smallest set of tokens whose cumulative probability reaches p, then renormalize and sample. The shortlist adapts to the shape of the distribution.",
  },
};

export interface DecodingCandidate {
  token: string;
  logit: number;
}

/** Fixed illustrative next-token logits shared by every strategy. */
export const baseLogits: readonly DecodingCandidate[] = [
  { token: "Paris", logit: 3.42 },
  { token: "Lyon", logit: 2.24 },
  { token: "France", logit: 1.69 },
  { token: "world", logit: 1.37 },
  { token: "the", logit: -0.6 },
  { token: "next", logit: -1.3 },
  { token: "is", logit: -1.9 },
  { token: "blue", logit: -2.7 },
];

export interface DecodingLimits {
  temperature: { min: number; max: number; step: number; default: number };
  topK: { min: number; max: number; step: number; default: number };
  topP: { min: number; max: number; step: number; default: number };
}

export const decodingLimits: DecodingLimits = {
  temperature: { min: 0.1, max: 2, step: 0.1, default: 0.8 },
  topK: { min: 1, max: 8, step: 1, default: 3 },
  topP: { min: 0.1, max: 1, step: 0.05, default: 0.9 },
};
