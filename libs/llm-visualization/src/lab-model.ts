export const transformerLabPhases = [
  "tokenize",
  "initialize",
  "forward",
  "loss",
  "backpropagate",
  "update",
  "sample",
] as const;

export type TransformerLabPhase = (typeof transformerLabPhases)[number];

export interface TransformerLabPhaseDefinition {
  id: TransformerLabPhase;
  shortLabel: string;
  title: string;
  description: string;
  trainingOnly: boolean;
}

export const transformerLabPhaseDefinitions = [
  {
    id: "tokenize",
    shortLabel: "Tokenize",
    title: "Turn text into reusable subword pieces",
    description: "A small deterministic BPE vocabulary repeatedly merges learned symbol pairs, then maps each resulting piece to a stable token ID.",
    trainingOnly: false,
  },
  {
    id: "initialize",
    shortLabel: "Initialize",
    title: "Allocate the model's learned parameters",
    description: "Architecture choices determine the shapes of embeddings, attention projections, MLP matrices, normalization terms, and the vocabulary head.",
    trainingOnly: true,
  },
  {
    id: "forward",
    shortLabel: "Forward",
    title: "Run tokens through the decoder stack",
    description: "Temporary activations move through causal attention and feed-forward sublayers while persistent parameters are read but not changed.",
    trainingOnly: false,
  },
  {
    id: "loss",
    shortLabel: "Loss",
    title: "Compare predictions with target tokens",
    description: "During training, cross-entropy assigns a scalar penalty when the predicted distribution disagrees with the known next token.",
    trainingOnly: true,
  },
  {
    id: "backpropagate",
    shortLabel: "Backprop",
    title: "Send credit-assignment signals backward",
    description: "Backpropagation computes temporary gradients for every trainable parameter. This is a training operation, not an ordinary inference step.",
    trainingOnly: true,
  },
  {
    id: "update",
    shortLabel: "Update",
    title: "Let the optimizer update persistent weights",
    description: "An optimizer such as Adam combines gradients with running moment estimates and applies a small parameter update.",
    trainingOnly: true,
  },
  {
    id: "sample",
    shortLabel: "Decode",
    title: "Sample an allowed next token",
    description: "Temperature reshapes the distribution and top-p keeps the smallest high-probability nucleus whose cumulative mass reaches the threshold.",
    trainingOnly: false,
  },
] as const satisfies readonly TransformerLabPhaseDefinition[];

export interface TransformerLabConfig {
  prompt: string;
  epochs: number;
  temperature: number;
  topP: number;
  numLayers: number;
  maxTokens: number;
}

export const defaultTransformerLabConfig: TransformerLabConfig = {
  prompt: "The model learns to",
  epochs: 300,
  temperature: 0.8,
  topP: 0.9,
  numLayers: 2,
  maxTokens: 40,
};

export const transformerLabPresets = [
  {
    id: "quick",
    label: "Quick study",
    config: { epochs: 120, temperature: 0.7, topP: 0.85, numLayers: 1, maxTokens: 24 },
  },
  {
    id: "balanced",
    label: "Balanced",
    config: { epochs: 300, temperature: 0.8, topP: 0.9, numLayers: 2, maxTokens: 40 },
  },
  {
    id: "deep",
    label: "Deeper stack",
    config: { epochs: 800, temperature: 1.1, topP: 0.95, numLayers: 6, maxTokens: 64 },
  },
] as const;

export const transformerLabLimits = {
  epochs: { min: 50, max: 2_000, step: 50 },
  temperature: { min: 0.1, max: 2, step: 0.1 },
  topP: { min: 0.1, max: 1, step: 0.05 },
  numLayers: { min: 1, max: 6, step: 1 },
  maxTokens: { min: 8, max: 96, step: 8 },
} as const;

export interface BpeToken {
  text: string;
  id: number;
  wordIndex: number;
}

export interface BpeMergeStep {
  word: string;
  pair: string;
  result: string;
  before: readonly string[];
  after: readonly string[];
}

export interface BpeResult {
  normalized: string;
  tokens: readonly BpeToken[];
  merges: readonly BpeMergeStep[];
}

const BPE_MERGES = [
  ["t", "h", "th"],
  ["th", "e", "the"],
  ["m", "o", "mo"],
  ["mo", "d", "mod"],
  ["mod", "e", "mode"],
  ["mode", "l", "model"],
  ["l", "e", "le"],
  ["le", "a", "lea"],
  ["lea", "r", "lear"],
  ["lear", "n", "learn"],
  ["i", "n", "in"],
  ["in", "g", "ing"],
  ["s", "t", "st"],
  ["st", "o", "sto"],
  ["sto", "r", "stor"],
  ["stor", "y", "story"],
  ["n", "e", "ne"],
  ["ne", "x", "nex"],
  ["nex", "t", "next"],
] as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function roundTo(value: number, digits: number): number {
  return Number(value.toFixed(digits));
}

function stableHash(value: string): number {
  let hash = 2_166_136_261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }
  return hash >>> 0;
}

function mergePair(parts: readonly string[], left: string, right: string, merged: string): { changed: boolean; parts: string[] } {
  const next: string[] = [];
  let changed = false;
  for (let index = 0; index < parts.length; index += 1) {
    if (parts[index] === left && parts[index + 1] === right) {
      next.push(merged);
      index += 1;
      changed = true;
    } else {
      next.push(parts[index] ?? "");
    }
  }
  return { changed, parts: next };
}

export function tokenizeWithIllustrativeBpe(input: string): BpeResult {
  const normalized = input.trim().toLowerCase().replace(/\s+/g, " ");
  const words = normalized.match(/[a-z0-9]+|[^\s\w]/g) ?? [];
  const tokens: BpeToken[] = [];
  const merges: BpeMergeStep[] = [];

  words.forEach((word, wordIndex) => {
    if (!/^[a-z0-9]+$/.test(word)) {
      tokens.push({ text: word, id: 100 + (stableHash(word) % 900), wordIndex });
      return;
    }

    let parts = [...word];
    for (const [left, right, merged] of BPE_MERGES) {
      const before = parts;
      const result = mergePair(parts, left, right, merged);
      if (result.changed) {
        parts = result.parts;
        merges.push({ word, pair: `${left} + ${right}`, result: merged, before, after: parts });
      }
    }

    parts.forEach((part, partIndex) => {
      const text = partIndex === 0 ? `▁${part}` : part;
      tokens.push({ text, id: 100 + (stableHash(text) % 900), wordIndex });
    });
  });

  return { normalized, tokens, merges };
}

export function normalizeTransformerLabConfig(config: Partial<TransformerLabConfig> = {}): TransformerLabConfig {
  const merged = { ...defaultTransformerLabConfig, ...config };
  return {
    prompt: merged.prompt.trim().slice(0, 120) || defaultTransformerLabConfig.prompt,
    epochs: Math.round(clamp(merged.epochs, transformerLabLimits.epochs.min, transformerLabLimits.epochs.max) / 50) * 50,
    temperature: roundTo(clamp(merged.temperature, transformerLabLimits.temperature.min, transformerLabLimits.temperature.max), 1),
    topP: roundTo(clamp(merged.topP, transformerLabLimits.topP.min, transformerLabLimits.topP.max), 2),
    numLayers: Math.round(clamp(merged.numLayers, transformerLabLimits.numLayers.min, transformerLabLimits.numLayers.max)),
    maxTokens: Math.round(clamp(merged.maxTokens, transformerLabLimits.maxTokens.min, transformerLabLimits.maxTokens.max) / 8) * 8,
  };
}

export interface TransformerArchitecture {
  vocabSize: number;
  contextLength: number;
  embeddingDimension: number;
  numHeads: number;
  feedForwardDimension: number;
  numLayers: number;
  totalParameters: number;
}

export function deriveTransformerArchitecture(config: TransformerLabConfig, vocabSize = 96): TransformerArchitecture {
  const contextLength = 32;
  const embeddingDimension = 32;
  const numHeads = 2;
  const feedForwardDimension = 128;
  const d = embeddingDimension;
  const ff = feedForwardDimension;
  const perBlock = (4 * d * d) + (2 * d * ff) + (9 * d) + ff;
  const embeddings = (vocabSize * d) + (contextLength * d);
  const finalNormalization = 2 * d;
  const vocabularyHead = (d * vocabSize) + vocabSize;
  return {
    vocabSize,
    contextLength,
    embeddingDimension,
    numHeads,
    feedForwardDimension,
    numLayers: config.numLayers,
    totalParameters: embeddings + (perBlock * config.numLayers) + finalNormalization + vocabularyHead,
  };
}

export interface TrainingCheckpoint {
  epoch: number;
  loss: number;
  sample?: string;
}

function truncateWords(value: string, maxTokens: number): string {
  const words = value.split(/\s+/);
  return words.slice(0, maxTokens).join(" ");
}

function createSample(prompt: string, progress: number, maxTokens: number): string {
  const cleanPrompt = prompt.trim().replace(/\s+/g, " ");
  if (progress < 0.25) return truncateWords("the · story · model · next · learns · the", maxTokens);
  if (progress < 0.75) return truncateWords(`${cleanPrompt} notice patterns in the story and the next`, maxTokens);
  return truncateWords(`${cleanPrompt} predict the next token, then return it to the context.`, maxTokens);
}

export function createDeterministicTrainingTrace(config: TransformerLabConfig): readonly TrainingCheckpoint[] {
  const seed = stableHash(`${config.prompt}|${config.numLayers}|${config.epochs}`);
  const initialLoss = 4.55 + (config.numLayers * 0.06) + ((seed % 23) / 100);
  const floor = 0.46 + (config.numLayers * 0.018) + ((seed % 7) / 100);

  return Array.from({ length: 11 }, (_, index) => {
    const progress = index / 10;
    const epoch = Math.round((config.epochs * index) / 10);
    const wave = Math.sin((index + (seed % 5)) * 1.13) * 0.075 * (1 - progress);
    const loss = Math.max(floor, floor + ((initialLoss - floor) * Math.exp(-4.7 * progress)) + wave);
    return {
      epoch,
      loss: roundTo(loss, 4),
      sample: index === 0 || index === 5 || index === 10
        ? createSample(config.prompt, progress, config.maxTokens)
        : undefined,
    };
  });
}

const BASE_LOGITS = [
  { token: "the", logit: 3.42 },
  { token: "story", logit: 2.24 },
  { token: "next", logit: 1.69 },
  { token: "world", logit: 1.37 },
  { token: "quietly", logit: 0.91 },
] as const;

export interface DecodingCandidate {
  token: string;
  logit: number;
  probability: number;
  included: boolean;
  selected: boolean;
}

export interface DecodingResult {
  candidates: readonly DecodingCandidate[];
  selectedToken: string;
  nucleusMass: number;
}

export function createDecodingResult(config: TransformerLabConfig): DecodingResult {
  const scaled = BASE_LOGITS.map((candidate) => ({ ...candidate, scaled: candidate.logit / config.temperature }));
  const maxLogit = Math.max(...scaled.map((candidate) => candidate.scaled));
  const exponentials = scaled.map((candidate) => Math.exp(candidate.scaled - maxLogit));
  const total = exponentials.reduce((sum, value) => sum + value, 0);
  const probabilities = exponentials.map((value) => value / total);

  let cumulative = 0;
  let nucleusEnd = 0;
  for (let index = 0; index < probabilities.length; index += 1) {
    cumulative += probabilities[index] ?? 0;
    nucleusEnd = index;
    if (cumulative >= config.topP) break;
  }

  const nucleus = probabilities.slice(0, nucleusEnd + 1);
  const nucleusMass = nucleus.reduce((sum, value) => sum + value, 0);
  const normalized = nucleus.map((value) => value / nucleusMass);
  const samplePoint = (stableHash(`${config.prompt}|${config.temperature}|${config.topP}`) % 10_000) / 10_000;
  let sampleCumulative = 0;
  let selectedIndex = 0;
  for (let index = 0; index < normalized.length; index += 1) {
    sampleCumulative += normalized[index] ?? 0;
    if (samplePoint <= sampleCumulative) {
      selectedIndex = index;
      break;
    }
  }

  return {
    candidates: BASE_LOGITS.map((candidate, index) => ({
      ...candidate,
      probability: roundTo(probabilities[index] ?? 0, 6),
      included: index <= nucleusEnd,
      selected: index === selectedIndex,
    })),
    selectedToken: BASE_LOGITS[selectedIndex]?.token ?? BASE_LOGITS[0].token,
    nucleusMass: roundTo(nucleusMass, 6),
  };
}

export interface EmbeddingPoint {
  token: string;
  x: number;
  y: number;
}

export function createEmbeddingPoints(tokens: readonly BpeToken[]): readonly EmbeddingPoint[] {
  return tokens.slice(0, 10).map((token) => {
    const hash = stableHash(token.text);
    return {
      token: token.text,
      x: roundTo((((hash & 0xff) / 255) * 2) - 1, 3),
      y: roundTo(((((hash >>> 8) & 0xff) / 255) * 2) - 1, 3),
    };
  });
}

export function formatParameterCount(value: number): string {
  if (value >= 1_000_000) return `${roundTo(value / 1_000_000, 2)}M`;
  if (value >= 1_000) return `${roundTo(value / 1_000, 1)}K`;
  return String(value);
}
