import { cosineSimilarity } from "./math";
import type { TrainingCheckpoint, TrainingWord } from "./trainingTypes";

export interface TrainingNeighbor {
  word: string;
  similarity: number;
}

export interface TrainingAnalogyResult {
  vector: number[];
  nearest: TrainingNeighbor | null;
}

export function trainingNeighbors(
  vector: readonly number[],
  checkpoint: TrainingCheckpoint,
  count = 5,
  exclude: readonly string[] = [],
): TrainingNeighbor[] {
  const excluded = new Set(exclude);
  return Object.entries(checkpoint.vectors)
    .filter(([word]) => !excluded.has(word))
    .map(([word, candidate]) => ({ word, similarity: cosineSimilarity(vector, candidate) }))
    .sort((a, b) => b.similarity - a.similarity || a.word.localeCompare(b.word))
    .slice(0, count);
}

export function trainingAnalogy(
  a: string,
  b: string,
  c: string,
  checkpoint: TrainingCheckpoint,
): TrainingAnalogyResult {
  const first = checkpoint.vectors[a];
  const second = checkpoint.vectors[b];
  const third = checkpoint.vectors[c];
  if (!first || !second || !third) throw new Error("Analogy terms must exist in the training vocabulary.");
  const vector = first.map((value, index) => value - second[index]! + third[index]!);
  return { vector, nearest: trainingNeighbors(vector, checkpoint, 1, [a, b, c])[0] ?? null };
}

export type TrainingQueryStatus =
  | { status: "supported"; word: string; message: string }
  | { status: "multiple" | "unsupported"; message: string };

export function inspectTrainingQuery(query: string, vocabulary: readonly TrainingWord[]): TrainingQueryStatus {
  const normalized = query.trim().toLocaleLowerCase();
  const pieces = normalized.split(/\s+/).filter(Boolean);
  if (pieces.length > 1) {
    return {
      status: "multiple",
      message: `“${query.trim()}” splits into ${pieces.length} whitespace tokens in this teaching tokenizer (${pieces.join(" + ")}). Choose one vocabulary term.`,
    };
  }
  if (!normalized || !vocabulary.some((entry) => entry.word === normalized)) {
    return {
      status: "unsupported",
      message: `“${query.trim()}” is outside this fixed teaching vocabulary. The replay cannot invent or retrain a new term in the browser.`,
    };
  }
  return { status: "supported", word: normalized, message: `${normalized} is available as one teaching-model word token.` };
}
