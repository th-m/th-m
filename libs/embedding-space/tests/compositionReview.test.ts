import { describe, expect, it } from "vitest";
import {
  countOrderedPermutations,
  generateCanonicalCombinations,
  generateCompositionReviewRows,
} from "../src/compositionReview";

describe("composition review export", () => {
  it("enumerates canonical combinations with repetition", () => {
    expect([...generateCanonicalCombinations(["a", "b"], 2)]).toEqual([
      ["a"],
      ["b"],
      ["a", "a"],
      ["a", "b"],
      ["b", "b"],
    ]);
  });

  it("records how many ordered permutations each canonical row represents", () => {
    expect(countOrderedPermutations(["a", "b", "c"])).toBe(6);
    expect(countOrderedPermutations(["a", "a", "b"])).toBe(3);
    expect(countOrderedPermutations(["a", "a", "a"])).toBe(1);
  });

  it("includes current authored and projected-neighbor classifications", () => {
    const rows = [...generateCompositionReviewRows(["royal", "wolf", "truth"], 2)];
    expect(rows.find(({ canonicalExpression }) => canonicalExpression === "royal + wolf")).toMatchObject({
      currentResult: "alpha wolf",
      resultKind: "authored",
      orderedPermutationCount: 2,
    });
    expect(rows.find(({ canonicalExpression }) => canonicalExpression === "wolf + truth")).toMatchObject({
      currentResult: "",
      resultKind: "projected-neighbor",
      orderedPermutationCount: 2,
    });
  });
});
