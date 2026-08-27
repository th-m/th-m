import {
  COMPOSITION_STARTERS,
  resolveTermComposition,
  type CompositionTerm,
} from "./compositionModel";

export type CompositionReviewRow = {
  combinationId: number;
  termCount: number;
  terms: readonly CompositionTerm[];
  canonicalExpression: string;
  orderedPermutationCount: number;
  currentResult: string;
  resultKind: "authored" | "exact" | "projected-neighbor" | "invalid";
  valid: boolean;
};

export const COMPOSITION_REVIEW_TERMS: readonly CompositionTerm[] = Array.from(
  new Set(COMPOSITION_STARTERS),
);

export function* generateCanonicalCombinations<T>(
  options: readonly T[],
  maxTerms = 4,
): Generator<readonly T[]> {
  if (!Number.isInteger(maxTerms) || maxTerms < 1) {
    throw new Error("maxTerms must be a positive integer.");
  }

  function* combinationsOfLength(
    targetLength: number,
    startIndex: number,
    prefix: readonly T[],
  ): Generator<readonly T[]> {
    if (prefix.length === targetLength) {
      yield prefix;
      return;
    }

    for (let index = startIndex; index < options.length; index += 1) {
      yield* combinationsOfLength(targetLength, index, [...prefix, options[index] as T]);
    }
  }

  for (let length = 1; length <= maxTerms; length += 1) {
    yield* combinationsOfLength(length, 0, []);
  }
}

export function countOrderedPermutations<T>(terms: readonly T[]): number {
  const factorial = (value: number) => {
    let result = 1;
    for (let factor = 2; factor <= value; factor += 1) result *= factor;
    return result;
  };
  const multiplicities = new Map<T, number>();
  for (const term of terms) multiplicities.set(term, (multiplicities.get(term) ?? 0) + 1);
  return [...multiplicities.values()].reduce(
    (count, multiplicity) => count / factorial(multiplicity),
    factorial(terms.length),
  );
}

export function* generateCompositionReviewRows(
  options: readonly CompositionTerm[] = COMPOSITION_REVIEW_TERMS,
  maxTerms = 4,
): Generator<CompositionReviewRow> {
  let combinationId = 0;
  for (const terms of generateCanonicalCombinations(options, maxTerms)) {
    combinationId += 1;
    const resolution = resolveTermComposition(terms);
    const resultKind = !resolution.valid
      ? "invalid"
      : resolution.recipe
        ? "authored"
        : resolution.result
          ? "exact"
          : "projected-neighbor";
    yield {
      combinationId,
      termCount: terms.length,
      terms,
      canonicalExpression: terms.join(" + "),
      orderedPermutationCount: countOrderedPermutations(terms),
      currentResult: resolution.result ?? "",
      resultKind,
      valid: resolution.valid,
    };
  }
}
