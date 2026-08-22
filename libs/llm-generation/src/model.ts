/**
 * Deterministic illustrative data for token-by-token LLM generation playback.
 * All traces are authored teaching values, not recordings from a live model.
 */

export const generationStageIds = [
  "tokens",
  "attention",
  "feed-forward",
  "logits",
  "decode",
  "append",
] as const;
export type GenerationStageId = (typeof generationStageIds)[number];

export interface GenerationStage {
  id: GenerationStageId;
  shortLabel: string;
  title: string;
  description: string;
  signal: string;
  result: string;
}

export const generationStages: readonly GenerationStage[] = [
  {
    id: "tokens",
    shortLabel: "Tokens",
    title: "The newest context token becomes a vector",
    description:
      "The tokenizer's latest piece of context is looked up in the learned embedding table and combined with position information so identical words at different positions can behave differently.",
    signal: "token + position",
    result: "Embedding vector",
  },
  {
    id: "attention",
    shortLabel: "Attend",
    title: "Attention routes relevant context to the new position",
    description:
      "The new position queries the keys of every earlier token. Stronger matches receive more weight, and the causal mask keeps the model from peeking at tokens that do not exist yet.",
    signal: "softmax(QKᵀ / √d + mask) V",
    result: "Context update",
  },
  {
    id: "feed-forward",
    shortLabel: "Transform",
    title: "The feed-forward network transforms the position",
    description:
      "Each position passes through learned expansion, gating, and compression layers, then rejoins the residual stream. The same learned MLP applies at every token position.",
    signal: "Wdown · GELU(Wup · x)",
    result: "Refined representation",
  },
  {
    id: "logits",
    shortLabel: "Logits",
    title: "The final state scores every candidate token",
    description:
      "A learned output projection turns the final representation into one raw score per vocabulary item. Logits are unnormalized preferences, not probabilities.",
    signal: "hfinal · Wvocab",
    result: "Vocabulary logits",
  },
  {
    id: "decode",
    shortLabel: "Decode",
    title: "Softmax turns scores into a distribution, and a rule picks a token",
    description:
      "Logits become probabilities. Greedy decoding selects the most likely token; sampling rules can pick differently from the same distribution.",
    signal: "softmax(logits / temperature)",
    result: "Selected token",
  },
  {
    id: "append",
    shortLabel: "Append",
    title: "The selected token joins the context",
    description:
      "The token is appended and the model repeats the pass for the next position. The output grows one token at a time.",
    signal: "context ⊕ token",
    result: "Next inference step",
  },
];

export interface CandidateToken {
  token: string;
  logit: number;
  probability: number;
}

export interface GeneratedStep {
  /** The token selected for this position. */
  token: string;
  candidates: readonly CandidateToken[];
  /**
   * Attention weights the final position gives to each earlier context token
   * (prompt tokens first, then previously generated tokens). Its length equals
   * `promptTokens.length + step index`.
   */
  attentionWeights: readonly number[];
  note: string;
}

export interface GenerationExample {
  id: string;
  label: string;
  prompt: string;
  promptTokens: readonly string[];
  steps: readonly GeneratedStep[];
}

export const generationExamples: readonly GenerationExample[] = [
  {
    id: "capital",
    label: "Capital of France",
    prompt: "The capital of France is",
    promptTokens: ["The", " capital", " of", " France", " is"],
    steps: [
      {
        token: "Paris",
        candidates: [
          { token: "Paris", logit: 3.42, probability: 0.62 },
          { token: "Lyon", logit: 2.24, probability: 0.19 },
          { token: "France", logit: 1.69, probability: 0.11 },
          { token: "world", logit: 1.37, probability: 0.08 },
        ],
        attentionWeights: [0.08, 0.14, 0.07, 0.39, 0.32],
        note: "The final position looks mostly at 'France' and at the verb 'is'.",
      },
      {
        token: ".",
        candidates: [
          { token: ".", logit: 3.1, probability: 0.58 },
          { token: "!", logit: 2.2, probability: 0.22 },
          { token: ",", logit: 1.4, probability: 0.11 },
          { token: ";", logit: 1.1, probability: 0.09 },
        ],
        attentionWeights: [0.04, 0.06, 0.05, 0.22, 0.28, 0.35],
        note: "After a complete statement the model favors sentence punctuation.",
      },
      {
        token: "\n",
        candidates: [
          { token: "\n", logit: 2.8, probability: 0.54 },
          { token: " ", logit: 2.0, probability: 0.25 },
          { token: "(", logit: 1.2, probability: 0.12 },
          { token: "However", logit: 0.9, probability: 0.09 },
        ],
        attentionWeights: [0.03, 0.05, 0.04, 0.18, 0.23, 0.27, 0.2],
        note: "A paragraph break ends this deterministic example trace.",
      },
    ],
  },
  {
    id: "planet",
    label: "Largest planet",
    prompt: "The largest planet in our solar system is",
    promptTokens: ["The", " largest", " planet", " in", " our", " solar", " system", " is"],
    steps: [
      {
        token: "Jupiter",
        candidates: [
          { token: "Jupiter", logit: 2.9, probability: 0.48 },
          { token: "Saturn", logit: 2.5, probability: 0.27 },
          { token: "Mars", logit: 1.8, probability: 0.15 },
          { token: "Earth", logit: 1.2, probability: 0.1 },
        ],
        attentionWeights: [0.02, 0.03, 0.3, 0.04, 0.05, 0.22, 0.24, 0.1],
        note: "Attention concentrates on 'planet' and the solar-system context.",
      },
      {
        token: ".",
        candidates: [
          { token: ".", logit: 3.3, probability: 0.66 },
          { token: "!", logit: 1.9, probability: 0.18 },
          { token: ";", logit: 1.2, probability: 0.1 },
          { token: ":", logit: 0.8, probability: 0.06 },
        ],
        attentionWeights: [0.02, 0.03, 0.24, 0.04, 0.05, 0.18, 0.2, 0.09, 0.15],
        note: "The completed claim again resolves to sentence punctuation.",
      },
    ],
  },
  {
    id: "story",
    label: "Story opener",
    prompt: "Once upon a time",
    promptTokens: ["Once", " upon", " a", " time"],
    steps: [
      {
        token: "there",
        candidates: [
          { token: "there", logit: 2.6, probability: 0.35 },
          { token: "a", logit: 2.3, probability: 0.28 },
          { token: "an", logit: 1.9, probability: 0.2 },
          { token: "we", logit: 1.2, probability: 0.17 },
        ],
        attentionWeights: [0.42, 0.31, 0.12, 0.15],
        note: "Story-opener conventions push the next token toward 'there'.",
      },
      {
        token: " was",
        candidates: [
          { token: " was", logit: 2.4, probability: 0.31 },
          { token: " lived", logit: 2.2, probability: 0.26 },
          { token: " came", logit: 1.7, probability: 0.23 },
          { token: " stood", logit: 1.3, probability: 0.2 },
        ],
        attentionWeights: [0.3, 0.24, 0.1, 0.11, 0.25],
        note: "After 'there', a past-tense verb is the most probable continuation.",
      },
      {
        token: " a",
        candidates: [
          { token: " a", logit: 2.7, probability: 0.41 },
          { token: " an", logit: 2.1, probability: 0.26 },
          { token: " once", logit: 1.5, probability: 0.19 },
          { token: " not", logit: 1.0, probability: 0.14 },
        ],
        attentionWeights: [0.22, 0.18, 0.08, 0.09, 0.19, 0.24],
        note: "A determiner opens the noun phrase that follows the verb.",
      },
      {
        token: " kingdom",
        candidates: [
          { token: " kingdom", logit: 2.2, probability: 0.28 },
          { token: " castle", logit: 2.0, probability: 0.26 },
          { token: " forest", logit: 1.8, probability: 0.24 },
          { token: " village", logit: 1.4, probability: 0.22 },
        ],
        attentionWeights: [0.18, 0.16, 0.07, 0.08, 0.16, 0.19, 0.16],
        note: "The fairy-tale register favors a storybook setting.",
      },
    ],
  },
];

export function exampleById(id: string): GenerationExample | undefined {
  return generationExamples.find((example) => example.id === id);
}

export function generationStageIndex(stageId: GenerationStageId): number {
  return generationStages.findIndex((stage) => stage.id === stageId);
}
