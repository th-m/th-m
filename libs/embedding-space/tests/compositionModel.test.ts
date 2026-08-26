import { describe, expect, it } from "vitest";
import {
  HYBRID_RECIPES,
  SEMANTIC_AXES,
  SEMANTIC_WORDS,
  WORD_COORDINATES,
  applyMove,
  availableMove,
  compose,
  semanticPosition3d,
  type SemanticWord,
} from "../src/compositionModel";

describe("semantic composition model", () => {
  it("assigns every composable role word to a unique anchor coordinate", () => {
    expect(SEMANTIC_WORDS).toHaveLength(8);
    const coordinates = SEMANTIC_WORDS.map((word) => JSON.stringify(WORD_COORDINATES[word]));
    expect(new Set(coordinates).size).toBe(8);
    for (const word of SEMANTIC_WORDS) {
      expect(semanticPosition3d(word)).toHaveLength(3);
    }
  });

  it.each([
    ["man", "status", "king"],
    ["king", "age", "prince"],
    ["man", "role", "woman"],
    ["queen", "status", "woman"],
    ["princess", "age", "queen"],
    ["girl", "role", "boy"],
  ] as const)("moves %s across %s to %s", (start, axis, result) => {
    expect(applyMove(start, availableMove(start, axis))).toBe(result);
  });

  it("makes every axis move reversible", () => {
    for (const word of SEMANTIC_WORDS) {
      for (const axis of SEMANTIC_AXES) {
        const moved = applyMove(word, availableMove(word, axis));
        expect(applyMove(moved, availableMove(moved, axis))).toBe(word);
      }
    }
  });

  it("chains orthogonal directions and records each vertex in the path", () => {
    const first = availableMove("man", "status");
    const second = availableMove("king", "age");
    const third = availableMove("prince", "role");
    expect(compose("man", [first, second, third])).toEqual({
      result: "princess",
      path: ["man", "king", "prince", "princess"],
    });
  });

  it("rejects a repeated axis and a direction that does not match its source", () => {
    expect(() => compose("man", [availableMove("man", "status"), availableMove("king", "status")])).toThrow(
      "status axis can only be used once",
    );
    expect(() => applyMove("man", { axis: "status", label: "ordinary" })).toThrow(
      "must point toward royal",
    );
  });

  it("keeps the word union exhaustive for coordinate lookup", () => {
    const words: SemanticWord[] = [...SEMANTIC_WORDS];
    expect(words.sort()).toEqual([
      "boy", "girl", "king", "man", "prince", "princess", "queen", "woman",
    ]);
  });

  it("defines the authored person-animal blends used by the mythical creature explorer", () => {
    expect(HYBRID_RECIPES).toEqual([
      { base: "man", animal: "horse", result: "centaur" },
      { base: "woman", animal: "fish", result: "mermaid" },
      { base: "girl", animal: "hummingbird", result: "pixie" },
    ]);
    expect(new Set(HYBRID_RECIPES.map(({ animal }) => animal)).size).toBe(HYBRID_RECIPES.length);
    expect(new Set(HYBRID_RECIPES.map(({ result }) => result)).size).toBe(HYBRID_RECIPES.length);
  });
});
