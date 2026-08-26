import { describe, expect, it } from "vitest";
import {
  AUTHORED_RECIPES,
  COMPOSITION_OUTPUT_ONLY_TERMS,
  COMPOSITION_STARTERS,
  COMPOSITION_TERM_GROUPS,
  CONTEXTUAL_RECIPES,
  PAIR_RECIPES,
  SEMANTIC_AXES,
  SEMANTIC_WORDS,
  WORD_COORDINATES,
  applyMove,
  availableMove,
  compose,
  resolveTermComposition,
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

  it("resolves role directions and authored recipes through one term interface", () => {
    expect(resolveTermComposition(["man", "royal", "young", "feminine"])).toMatchObject({
      valid: true,
      result: "princess",
      path: ["man", "king", "prince", "princess"],
      recipe: null,
    });
    expect(resolveTermComposition(["young", "horse"])).toMatchObject({
      valid: true,
      result: "foal",
      recipe: PAIR_RECIPES.find(({ result }) => result === "foal"),
    });
    expect(resolveTermComposition(["horse", "young"]).result).toBe("foal");
    expect(resolveTermComposition(["horse", "fish"]).result).toBe("seahorse");
    expect(resolveTermComposition(["royal", "man"]).result).toBe("king");
    expect(resolveTermComposition(["man", "sovereign"]).result).toBe("emperor");
    expect(resolveTermComposition(["young", "lion"]).result).toBe("cub");
    expect(resolveTermComposition(["young", "cat"]).result).toBe("kitten");
    expect(resolveTermComposition(["lion", "eagle"]).result).toBe("griffin");
    expect(resolveTermComposition(["cat", "fish"]).result).toBe("catfish");
    expect(resolveTermComposition(["man", "wolf"]).result).toBe("werewolf");
    expect(resolveTermComposition(["woman", "horse"]).result).toBe("centauride");
    expect(resolveTermComposition(["young", "owl"]).result).toBe("owlet");
    expect(resolveTermComposition(["girl", "divine"]).result).toBe("demigoddess");
    expect(resolveTermComposition(["legendary", "horse"]).result).toBe("unicorn");
    expect(resolveTermComposition(["horse", "bird"]).result).toBe("pegasus");
    expect(resolveTermComposition(["goat", "fish"]).result).toBe("capricorn");
    expect(resolveTermComposition(["knowledge", "time"]).result).toBe("wisdom");
    expect(resolveTermComposition(["courage", "lion"]).result).toBe("lionheart");
    expect(resolveTermComposition(["mystery", "cat"]).result).toBe("sphinx");
    expect(resolveTermComposition(["divine", "knowledge"]).result).toBe("omniscience");
  });

  it("preserves semantic roles when status is added to an animal or mythical family", () => {
    expect(resolveTermComposition(["royal", "wolf"]).result).toBe("alpha wolf");
    expect(resolveTermComposition(["centaur", "royal"]).result).toBe("Chiron");
    expect(resolveTermComposition(["royal", "snake"]).result).toBe("king cobra");
    expect(resolveTermComposition(["royal", "fish"]).result).toBe("kingfish");
    expect(resolveTermComposition(["royal", "lion"]).result).toBe("lion king");
    expect(resolveTermComposition(["royal", "eagle"]).result).toBe("imperial eagle");
    expect(resolveTermComposition(["legendary", "wolf"]).result).toBe("Fenrir");
    expect(resolveTermComposition(["royal", "divine"]).result).toBe("divine right");
    expect(resolveTermComposition(["royal", "knowledge"]).result).toBe("philosopher-monarch");
    expect(resolveTermComposition(["royal", "power"]).result).toBe("sovereignty");
    expect(resolveTermComposition(["man", "royal", "divine"]).result).toBe("anointed monarch");
    expect(resolveTermComposition(["woman", "royal", "divine"]).result).toBe("anointed queen");
    expect(resolveTermComposition(["man", "royal", "knowledge"]).result).toBe("philosopher-king");
    expect(resolveTermComposition(["woman", "royal", "knowledge"]).result).toBe("philosopher-queen");
    expect(resolveTermComposition(["man", "royal", "power"]).result).toBe("absolute monarch");
    expect(resolveTermComposition(["woman", "royal", "power"]).result).toBe("queen regnant");
    expect(resolveTermComposition(["man", "royal", "wolf"]).result).toBe("alpha werewolf");
    expect(resolveTermComposition(["wolf", "royal", "woman"]).result).toBe("alpha werewolf");
    expect(resolveTermComposition(["man", "horse", "royal"]).result).toBe("Chiron");
    expect(resolveTermComposition(["royal", "horse", "woman"]).result).toBe("centaur queen");
    expect(resolveTermComposition(["man", "royal", "fish"]).result).toBe("merman king");
    expect(resolveTermComposition(["woman", "fish", "royal"]).result).toBe("mermaid queen");
    expect(resolveTermComposition(["woman", "royal", "bird"]).result).toBe("harpy queen");
    expect(resolveTermComposition(["girl", "royal", "hummingbird"]).result).toBe("pixie princess");
  });

  it("groups the complete starter vocabulary into five stable controls", () => {
    expect(COMPOSITION_TERM_GROUPS.map(({ id }) => id)).toEqual(["role", "status", "age", "creature", "abstract"]);
    expect(COMPOSITION_TERM_GROUPS.find(({ id }) => id === "role")?.terms).toEqual([
      "man", "woman", "boy", "girl", "masculine", "feminine",
    ]);
    expect(COMPOSITION_TERM_GROUPS.find(({ id }) => id === "status")?.terms).toEqual([
      "royal", "noble", "sovereign", "legendary", "divine",
    ]);
    expect(COMPOSITION_TERM_GROUPS.find(({ id }) => id === "creature")?.terms).toEqual([
      "horse", "fish", "hummingbird", "lion", "eagle", "bird", "goat",
      "wolf", "bear", "owl", "snake", "deer", "cat", "dog", "fox", "shark", "tiger", "raven", "centaur",
    ]);
    expect(COMPOSITION_TERM_GROUPS.find(({ id }) => id === "abstract")?.terms).toEqual([
      "knowledge", "courage", "freedom", "order", "chaos", "memory", "time", "mystery",
      "justice", "truth", "beauty", "power", "hope", "fear", "love", "reason",
    ]);
    expect(COMPOSITION_TERM_GROUPS.flatMap(({ terms }) => terms)).toEqual(COMPOSITION_STARTERS);
    expect(new Set(COMPOSITION_STARTERS).size).toBe(COMPOSITION_STARTERS.length);
    expect(COMPOSITION_STARTERS).not.toContain("king");
    expect(COMPOSITION_STARTERS).not.toContain("queen");
    expect(COMPOSITION_STARTERS).not.toContain("prince");
    expect(COMPOSITION_STARTERS).not.toContain("princess");
    expect(COMPOSITION_STARTERS).toContain("centaur");
    expect(COMPOSITION_OUTPUT_ONLY_TERMS).not.toContain("centaur");
    const starterTerms = new Set<string>(COMPOSITION_STARTERS);
    expect(COMPOSITION_OUTPUT_ONLY_TERMS.every((term) => !starterTerms.has(term))).toBe(true);
  });

  it("enumerates a broad authored vocabulary while keeping derived endpoints out of the controls", () => {
    expect(PAIR_RECIPES).toHaveLength(73);
    expect(PAIR_RECIPES).toEqual(expect.arrayContaining([
      { terms: ["young", "dog"], result: "puppy" },
      { terms: ["young", "owl"], result: "owlet" },
      { terms: ["cat", "fish"], result: "catfish" },
      { terms: ["bear", "owl"], result: "owlbear" },
      { terms: ["woman", "horse"], result: "centauride" },
      { terms: ["man", "sovereign"], result: "emperor" },
      { terms: ["girl", "legendary"], result: "prodigy" },
      { terms: ["legendary", "bird"], result: "phoenix" },
      { terms: ["young", "fox"], result: "kit" },
      { terms: ["tiger", "fish"], result: "tigerfish" },
      { terms: ["woman", "divine"], result: "goddess" },
      { terms: ["girl", "divine"], result: "demigoddess" },
      { terms: ["horse", "eagle"], result: "hippogriff" },
      { terms: ["knowledge", "time"], result: "wisdom" },
      { terms: ["courage", "lion"], result: "lionheart" },
      { terms: ["freedom", "bird"], result: "liberty" },
      { terms: ["mystery", "cat"], result: "sphinx" },
      { terms: ["divine", "knowledge"], result: "omniscience" },
      { terms: ["truth", "knowledge"], result: "understanding" },
      { terms: ["reason", "order"], result: "logic" },
      { terms: ["justice", "power"], result: "legitimacy" },
      { terms: ["truth", "courage"], result: "integrity" },
    ]));
    expect(CONTEXTUAL_RECIPES).toHaveLength(24);
    expect(CONTEXTUAL_RECIPES).toEqual(expect.arrayContaining([
      { terms: ["royal", "wolf"], result: "alpha wolf" },
      { terms: ["centaur", "royal"], result: "Chiron" },
      { terms: ["royal", "snake"], result: "king cobra" },
      { terms: ["royal", "divine"], result: "divine right" },
      { terms: ["royal", "knowledge"], result: "philosopher-monarch" },
      { terms: ["man", "royal", "divine"], result: "anointed monarch" },
      { terms: ["woman", "royal", "divine"], result: "anointed queen" },
      { terms: ["man", "royal", "knowledge"], result: "philosopher-king" },
      { terms: ["woman", "royal", "power"], result: "queen regnant" },
      { terms: ["man", "royal", "wolf"], result: "alpha werewolf" },
      { terms: ["woman", "royal", "horse"], result: "centaur queen" },
      { terms: ["girl", "royal", "hummingbird"], result: "pixie princess" },
    ]));
    const pairKeys = PAIR_RECIPES.map(({ terms }) => [...terms].sort().join("+"));
    expect(new Set(pairKeys).size).toBe(PAIR_RECIPES.length);
    for (const recipe of PAIR_RECIPES) {
      expect(COMPOSITION_STARTERS).toContain(recipe.terms[0]);
      expect(COMPOSITION_STARTERS).toContain(recipe.terms[1]);
      if (!COMPOSITION_STARTERS.includes(recipe.result as (typeof COMPOSITION_STARTERS)[number])) {
        expect(COMPOSITION_OUTPUT_ONLY_TERMS).toContain(recipe.result);
      }
      expect(resolveTermComposition(recipe.terms)).toMatchObject({ valid: true, result: recipe.result });
      expect(resolveTermComposition([...recipe.terms].reverse())).toMatchObject({ valid: true, result: recipe.result });
    }
    const recipeKeys = AUTHORED_RECIPES.map(({ terms }) => [...terms].sort().join("+"));
    expect(new Set(recipeKeys).size).toBe(AUTHORED_RECIPES.length);
    for (const recipe of AUTHORED_RECIPES) {
      for (const term of recipe.terms) expect(COMPOSITION_STARTERS).toContain(term);
      if (!COMPOSITION_STARTERS.includes(recipe.result as (typeof COMPOSITION_STARTERS)[number])) {
        expect(COMPOSITION_OUTPUT_ONLY_TERMS).toContain(recipe.result);
      }
      expect(resolveTermComposition(recipe.terms)).toMatchObject({ valid: true, result: recipe.result });
      expect(resolveTermComposition([...recipe.terms].reverse())).toMatchObject({ valid: true, result: recipe.result });
    }
    expect(resolveTermComposition(["boy", "fish"])).toMatchObject({ valid: true, result: null });
  });
});
