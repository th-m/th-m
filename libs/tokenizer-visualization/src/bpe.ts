export const DEFAULT_BPE_MERGE_LIMIT = 24;
export const MAX_BPE_MERGE_LIMIT = 1000;

export type BpePair = readonly [string, string];

export interface BpePairCandidate {
  pair: BpePair;
  frequency: number;
}

export interface BpeMergeStep extends BpePairCandidate {
  step: number;
  token: string;
  vocabularySize: number;
  tokenCount: number;
  candidates: readonly BpePairCandidate[];
}

export interface BpeTrainingResult {
  text: string;
  preTokens: readonly string[];
  uniquePreTokenCount: number;
  initialTokens: readonly string[];
  initialVocabulary: readonly string[];
  vocabulary: readonly string[];
  merges: readonly BpeMergeStep[];
  finalTokens: readonly string[];
  exhausted: boolean;
}

const PRE_TOKEN_PATTERN = /[\p{L}\p{N}\p{M}_]+|\s|[^\p{L}\p{N}\p{M}_\s]/gu;

interface PairFrequency extends BpePairCandidate {
  firstSeen: number;
}

export function splitBpePreTokens(text: string): string[] {
  return text.match(PRE_TOKEN_PATTERN) ?? [];
}

export function countBpePreTokens(text: string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const preToken of splitBpePreTokens(text)) {
    counts.set(preToken, (counts.get(preToken) ?? 0) + 1);
  }
  return counts;
}

export function mergeBpePair(tokens: readonly string[], pair: BpePair): string[] {
  const merged = pair[0] + pair[1];
  const result: string[] = [];

  for (let index = 0; index < tokens.length;) {
    if (index < tokens.length - 1 && tokens[index] === pair[0] && tokens[index + 1] === pair[1]) {
      result.push(merged);
      index += 2;
    } else {
      result.push(tokens[index]!);
      index += 1;
    }
  }

  return result;
}

function pairKey(pair: BpePair): string {
  return JSON.stringify(pair);
}

function collectPairFrequencies(
  wordSplits: ReadonlyMap<string, readonly string[]>,
  frequencies: ReadonlyMap<string, number>,
): PairFrequency[] {
  const pairs = new Map<string, PairFrequency>();
  let firstSeen = 0;

  for (const [preToken, tokens] of wordSplits) {
    const weight = frequencies.get(preToken) ?? 0;
    for (let index = 0; index < tokens.length - 1; index += 1) {
      const pair = [tokens[index]!, tokens[index + 1]!] as const;
      const key = pairKey(pair);
      const existing = pairs.get(key);
      if (existing) {
        existing.frequency += weight;
      } else {
        pairs.set(key, { pair, frequency: weight, firstSeen });
        firstSeen += 1;
      }
    }
  }

  return [...pairs.values()].sort((left, right) =>
    right.frequency - left.frequency || left.firstSeen - right.firstSeen,
  );
}

function weightedTokenCount(
  wordSplits: ReadonlyMap<string, readonly string[]>,
  frequencies: ReadonlyMap<string, number>,
): number {
  let count = 0;
  for (const [preToken, tokens] of wordSplits) {
    count += tokens.length * (frequencies.get(preToken) ?? 0);
  }
  return count;
}

export function applyBpeMerges(
  text: string,
  merges: readonly Pick<BpeMergeStep, "pair">[],
  mergeCount = merges.length,
): string[] {
  const activeMerges = merges.slice(0, Math.max(0, Math.floor(mergeCount)));
  return splitBpePreTokens(text).flatMap((preToken) => {
    let tokens = [...preToken];
    for (const merge of activeMerges) tokens = mergeBpePair(tokens, merge.pair);
    return tokens;
  });
}

export function trainBpeText(text: string, maxMerges = DEFAULT_BPE_MERGE_LIMIT): BpeTrainingResult {
  const preTokens = splitBpePreTokens(text);
  const frequencies = countBpePreTokens(text);
  const wordSplits = new Map<string, string[]>();
  for (const preToken of frequencies.keys()) wordSplits.set(preToken, [...preToken]);

  const initialTokens = preTokens.flatMap((preToken) => [...preToken]);
  const initialVocabulary = [...new Set(initialTokens)];
  const vocabulary = new Set(initialVocabulary);
  const merges: BpeMergeStep[] = [];
  const limit = Math.min(MAX_BPE_MERGE_LIMIT, Math.max(0, Math.floor(maxMerges)));
  let exhausted = false;

  for (let index = 0; index < limit; index += 1) {
    const candidates = collectPairFrequencies(wordSplits, frequencies);
    const best = candidates[0];
    if (!best) {
      exhausted = true;
      break;
    }

    const token = best.pair[0] + best.pair[1];
    for (const [preToken, tokens] of wordSplits) {
      wordSplits.set(preToken, mergeBpePair(tokens, best.pair));
    }
    vocabulary.add(token);
    merges.push({
      step: index + 1,
      pair: best.pair,
      frequency: best.frequency,
      token,
      vocabularySize: vocabulary.size,
      tokenCount: weightedTokenCount(wordSplits, frequencies),
      candidates: candidates.slice(0, 3).map(({ pair, frequency }) => ({ pair, frequency })),
    });
  }

  if (!exhausted) exhausted = collectPairFrequencies(wordSplits, frequencies).length === 0;

  return {
    text,
    preTokens,
    uniquePreTokenCount: frequencies.size,
    initialTokens,
    initialVocabulary,
    vocabulary: [...vocabulary],
    merges,
    finalTokens: applyBpeMerges(text, merges),
    exhausted,
  };
}
