import {
  baseLogits,
  type DecodingStrategy,
} from "./model";

export interface DecodingConfig {
  temperature: number;
  topK: number;
  topP: number;
  /** Deterministic draw counter; changing it yields a different illustrative sample. */
  draw: number;
}

export interface DecodingResult {
  /** Final probabilities per candidate (renormalized over the allowed set). */
  probabilities: readonly number[];
  /** Whether each candidate is inside the strategy's allowed set. */
  allowed: readonly boolean[];
  selectedIndex: number;
  mostLikelyIndex: number;
  note: string;
}

export function softmax(logits: readonly number[]): number[] {
  const max = Math.max(...logits);
  const exp = logits.map((logit) => Math.exp(logit - max));
  const sum = exp.reduce((total, value) => total + value, 0);
  return exp.map((value) => value / sum);
}

/** Stable FNV-1a hash over a string, normalized to [0, 1). */
export function hash01(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 0xffffffff;
}

export function topKAllowed(probabilities: readonly number[], k: number): boolean[] {
  const kClamped = Math.max(1, Math.min(k, probabilities.length));
  const order = probabilities
    .map((probability, index) => ({ probability, index }))
    .sort((a, b) => b.probability - a.probability);
  const keep = new Set(order.slice(0, kClamped).map((entry) => entry.index));
  return probabilities.map((_, index) => keep.has(index));
}

export function topPAllowed(probabilities: readonly number[], p: number): boolean[] {
  const pClamped = Math.max(0, Math.min(1, p));
  const order = probabilities
    .map((probability, index) => ({ probability, index }))
    .sort((a, b) => b.probability - a.probability);
  const keep = new Set<number>();
  let cumulative = 0;
  for (const entry of order) {
    keep.add(entry.index);
    cumulative += entry.probability;
    if (cumulative >= pClamped) break;
  }
  return probabilities.map((_, index) => keep.has(index));
}

function renormalize(probabilities: readonly number[], allowed: readonly boolean[]): number[] {
  const sum = probabilities.reduce(
    (total, probability, index) => total + (allowed[index] ? probability : 0),
    0,
  );
  if (sum <= 0) return probabilities.map(() => 0);
  return probabilities.map((probability, index) =>
    allowed[index] ? probability / sum : 0,
  );
}

function argmax(values: readonly number[]): number {
  let best = 0;
  for (let index = 1; index < values.length; index++) {
    if (values[index] > values[best]) best = index;
  }
  return best;
}

/** Deterministic weighted sample over a normalized probability vector. */
function weightedSample(probabilities: readonly number[], seed: string): number {
  const r = hash01(seed);
  let cumulative = 0;
  for (let index = 0; index < probabilities.length; index++) {
    cumulative += probabilities[index];
    if (r < cumulative) return index;
  }
  return probabilities.length - 1;
}

export function applyDecoding(
  strategy: DecodingStrategy,
  config: DecodingConfig,
): DecodingResult {
  const logits = baseLogits.map((candidate) => candidate.logit);
  const rawProbabilities = softmax(logits);

  let allowed: boolean[];
  let note: string;

  switch (strategy) {
    case "greedy": {
      allowed = logits.map(() => true);
      const mostLikelyIndex = argmax(rawProbabilities);
      return {
        probabilities: rawProbabilities,
        allowed,
        selectedIndex: mostLikelyIndex,
        mostLikelyIndex,
        note: "Greedy always selects the most probable token, so no sampling is involved.",
      };
    }
    case "temperature": {
      allowed = logits.map(() => true);
      const scaled = softmax(logits.map((logit) => logit / config.temperature));
      note = `Temperature ${config.temperature.toFixed(1)} reshaped the distribution before sampling.`;
      return {
        probabilities: scaled,
        allowed,
        selectedIndex: weightedSample(scaled, `temperature|${config.temperature}|${config.draw}`),
        mostLikelyIndex: argmax(scaled),
        note,
      };
    }
    case "top-k": {
      allowed = topKAllowed(rawProbabilities, config.topK);
      const filtered = renormalize(rawProbabilities, allowed);
      note = `Sampling is restricted to the top ${config.topK} tokens after renormalization.`;
      return {
        probabilities: filtered,
        allowed,
        selectedIndex: weightedSample(filtered, `top-k|${config.topK}|${config.draw}`),
        mostLikelyIndex: argmax(filtered),
        note,
      };
    }
    case "top-p": {
      allowed = topPAllowed(rawProbabilities, config.topP);
      const filtered = renormalize(rawProbabilities, allowed);
      note = `Sampling is restricted to the smallest nucleus reaching p = ${config.topP.toFixed(2)} after renormalization.`;
      return {
        probabilities: filtered,
        allowed,
        selectedIndex: weightedSample(filtered, `top-p|${config.topP}|${config.draw}`),
        mostLikelyIndex: argmax(filtered),
        note,
      };
    }
  }
}
