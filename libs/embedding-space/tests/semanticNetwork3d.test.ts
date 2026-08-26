import { describe, expect, it } from "vitest";
import sourceDataset from "../src/data/gpt2-embedding-space.json";
import {
  AUTHORED_RECIPES,
  COMPOSITION_STARTERS,
  SEMANTIC_WORDS,
  WORD_COORDINATES,
  resolveTermComposition,
} from "../src/compositionModel";
import {
  SEMANTIC_NETWORK_ANIMAL_WORDS,
  SEMANTIC_NETWORK_ABSTRACT_WORDS,
  SEMANTIC_NETWORK_CONTEXT_WORDS,
  SEMANTIC_NETWORK_EDGES,
  SEMANTIC_NETWORK_MYTHICAL_WORDS,
  SEMANTIC_NETWORK_NODES,
  projectComposition3d,
  semanticEdgesForHighlights,
} from "../src/semanticNetwork3d";

function dot(left: readonly number[], right: readonly number[]) {
  return left.reduce((sum, value, index) => sum + value * (right[index] ?? 0), 0);
}

function pearsonCorrelation(left: readonly number[], right: readonly number[]) {
  const leftMean = left.reduce((sum, value) => sum + value, 0) / left.length;
  const rightMean = right.reduce((sum, value) => sum + value, 0) / right.length;
  const centeredLeft = left.map((value) => value - leftMean);
  const centeredRight = right.map((value) => value - rightMean);
  return dot(centeredLeft, centeredRight) /
    Math.sqrt(dot(centeredLeft, centeredLeft) * dot(centeredRight, centeredRight));
}

describe("three-dimensional semantic teaching network", () => {
  it("expands the eight composable anchors into a one-hundred-forty-two-term point network", () => {
    expect(SEMANTIC_NETWORK_NODES).toHaveLength(142);
    expect(SEMANTIC_NETWORK_CONTEXT_WORDS).toEqual([
      "person",
      "child",
      "leader",
      "successor",
      "noble",
      "monarch",
      "heir",
      "sovereign",
      "legendary",
      "divine",
      "young",
    ]);
    expect(SEMANTIC_WORDS.every((word) => SEMANTIC_NETWORK_NODES.some((node) => node.word === word))).toBe(true);
    expect(SEMANTIC_NETWORK_NODES.filter((node) => node.kind === "context")).toHaveLength(29);
    expect(SEMANTIC_NETWORK_ANIMAL_WORDS).toEqual([
      "horse", "fish", "hummingbird", "lion", "eagle", "bird", "goat",
      "wolf", "bear", "owl", "snake", "deer", "cat", "dog", "fox", "shark", "tiger", "raven",
      "foal", "seahorse", "fry", "cub", "chick", "kid", "eaglet", "lionfish", "owlet", "alpha wolf",
      "king cobra", "kingfish", "lion king", "imperial eagle",
      "pup", "hatchling", "fawn", "kitten", "puppy", "catfish", "dogfish", "wolffish", "kit", "tigerfish",
    ]);
    expect(SEMANTIC_NETWORK_MYTHICAL_WORDS).toEqual([
      "centaur", "centauride", "merman", "mermaid", "harpy", "pixie", "werewolf",
      "griffin", "pegasus", "capricorn", "owlbear", "chimera", "unicorn", "phoenix", "hippogriff", "sphinx", "Fenrir",
      "Chiron", "alpha werewolf", "centaur queen", "merman king", "mermaid queen", "harpy queen", "pixie princess",
    ]);
    expect(SEMANTIC_NETWORK_ABSTRACT_WORDS).toEqual([
      "knowledge", "courage", "freedom", "order", "chaos", "memory", "time", "mystery",
      "justice", "truth", "beauty", "power", "hope", "fear", "love", "reason",
      "wisdom", "lionheart", "liberty", "chronology", "nostalgia", "scholar", "student", "oracle", "omniscience",
      "understanding", "compassion", "optimism", "logic", "sovereignty", "anxiety", "enchantment", "legitimacy",
      "devotion", "integrity",
      "divine right",
    ]);
    expect(SEMANTIC_NETWORK_NODES.filter((node) => node.kind === "animal")).toHaveLength(42);
    expect(SEMANTIC_NETWORK_NODES.filter((node) => node.kind === "mythic")).toHaveLength(24);
    expect(SEMANTIC_NETWORK_NODES.filter((node) => node.kind === "abstract")).toHaveLength(36);
    expect(SEMANTIC_NETWORK_NODES.filter((node) => node.kind === "category")).toHaveLength(3);
  });

  it("places every term at a unique x-y-z coordinate, including interior points", () => {
    const positions = SEMANTIC_NETWORK_NODES.map(({ position }) => position.join(":"));
    expect(new Set(positions).size).toBe(SEMANTIC_NETWORK_NODES.length);
    expect(SEMANTIC_NETWORK_NODES.some(({ position }) => position[2] === 0)).toBe(true);
    expect(SEMANTIC_NETWORK_NODES.some(({ position }) => Math.abs(position[0]) < 1.5)).toBe(true);
  });

  it("rounds out the visible teaching volume on both sides of every coordinate axis", () => {
    const visibleWords = new Set<string>([
      ...COMPOSITION_STARTERS,
      ...SEMANTIC_NETWORK_CONTEXT_WORDS,
      "animal",
      "mythic",
      "concept",
    ]);
    const visibleNodes = SEMANTIC_NETWORK_NODES.filter(({ word }) => visibleWords.has(word));

    for (const axis of [0, 1, 2] as const) {
      expect(visibleNodes.filter(({ position }) => position[axis] < -0.25).length).toBeGreaterThan(5);
      expect(visibleNodes.filter(({ position }) => position[axis] > 0.25).length).toBeGreaterThan(5);
    }
  });

  it("fits source-vector distances without moving a term out of its semantic octant", () => {
    const anchors = SEMANTIC_NETWORK_NODES.filter(
      (node): node is typeof node & { word: (typeof SEMANTIC_WORDS)[number] } =>
        node.kind === "anchor",
    );
    const anchorByWord = new Map(anchors.map((node) => [node.word, node.position]));
    const vectorByWord = new Map(
      sourceDataset.points
        .filter(({ label }) => SEMANTIC_WORDS.includes(label as (typeof SEMANTIC_WORDS)[number]))
        .map(({ label, vector }) => [label as (typeof SEMANTIC_WORDS)[number], vector] as const),
    );
    const sourceDistances: number[] = [];
    const fittedDistances: number[] = [];

    expect(new Set(anchors.map(({ position }) => position[0])).size).toBeGreaterThan(2);
    expect(new Set(anchors.map(({ position }) => position[1])).size).toBeGreaterThan(2);
    expect(new Set(anchors.map(({ position }) => position[2])).size).toBeGreaterThan(2);

    for (const { word, position } of anchors) {
      const coordinate = WORD_COORDINATES[word];
      expect(Math.sign(position[0])).toBe(coordinate.status === "royal" ? 1 : -1);
      expect(Math.sign(position[1])).toBe(coordinate.age === "adult" ? 1 : -1);
      expect(Math.sign(position[2])).toBe(coordinate.role === "feminine" ? 1 : -1);
    }

    for (const [index, leftWord] of SEMANTIC_WORDS.entries()) {
      for (const rightWord of SEMANTIC_WORDS.slice(index + 1)) {
        const leftVector = vectorByWord.get(leftWord);
        const rightVector = vectorByWord.get(rightWord);
        const leftPosition = anchorByWord.get(leftWord);
        const rightPosition = anchorByWord.get(rightWord);
        expect(leftVector).toBeDefined();
        expect(rightVector).toBeDefined();
        expect(leftPosition).toBeDefined();
        expect(rightPosition).toBeDefined();
        if (!leftVector || !rightVector || !leftPosition || !rightPosition) continue;

        const cosine = dot(leftVector, rightVector) /
          Math.sqrt(dot(leftVector, leftVector) * dot(rightVector, rightVector));
        sourceDistances.push(Math.sqrt(2 - 2 * cosine));
        fittedDistances.push(Math.hypot(
          leftPosition[0] - rightPosition[0],
          leftPosition[1] - rightPosition[1],
          leftPosition[2] - rightPosition[2],
        ));
      }
    }

    expect(pearsonCorrelation(sourceDistances, fittedDistances)).toBeGreaterThan(0.95);
  });

  it("connects valid terms through role, category, counterpart, and authored blend links", () => {
    const words = new Set<string>(SEMANTIC_NETWORK_NODES.map(({ word }) => word));
    expect(SEMANTIC_NETWORK_EDGES).toHaveLength(334);
    expect(new Set(SEMANTIC_NETWORK_EDGES.map(({ relation }) => relation))).toEqual(
      new Set(["status", "age", "category", "counterpart", "blend"]),
    );
    for (const edge of SEMANTIC_NETWORK_EDGES) {
      expect(words.has(edge.from)).toBe(true);
      expect(words.has(edge.to)).toBe(true);
      expect(edge.from).not.toBe(edge.to);
    }
    for (const recipe of AUTHORED_RECIPES) {
      expect(words.has(recipe.result)).toBe(true);
      for (const term of recipe.terms) {
        if (!words.has(term)) continue;
        expect(SEMANTIC_NETWORK_EDGES).toContainEqual({
          from: term,
          to: recipe.result,
          relation: "blend",
        });
      }
    }
  });

  it("projects exact directions, authored blends, and un-authored combinations with explicit vector math", () => {
    const exact = projectComposition3d(["man", "royal"], resolveTermComposition(["man", "royal"]));
    expect(exact).toMatchObject({ method: "direction", result: "king", resultKind: "exact" });
    expect(exact.components).toHaveLength(2);
    expect(exact.location).toEqual(
      SEMANTIC_NETWORK_NODES.find(({ word }) => word === "king")?.position,
    );

    const authored = projectComposition3d(["horse", "eagle"], resolveTermComposition(["horse", "eagle"]));
    expect(authored).toMatchObject({ method: "mean", result: "hippogriff", resultKind: "authored" });

    const abstract = projectComposition3d(["knowledge", "time"], resolveTermComposition(["knowledge", "time"]));
    expect(abstract).toMatchObject({ method: "mean", result: "wisdom", resultKind: "authored" });

    const contextual = projectComposition3d(
      ["man", "royal", "wolf"],
      resolveTermComposition(["man", "royal", "wolf"]),
    );
    expect(contextual).toMatchObject({ method: "mean", result: "alpha werewolf", resultKind: "authored" });

    const nearest = projectComposition3d(["boy", "fish"], resolveTermComposition(["boy", "fish"]));
    expect(nearest.method).toBe("mean");
    expect(nearest.resultKind).toBe("nearest");
    expect(nearest.result).not.toBeNull();
  });

  it("keeps only links that touch a highlighted composition term", () => {
    const visibleEdges = semanticEdgesForHighlights(["man", "king"]);

    expect(visibleEdges.length).toBeGreaterThan(0);
    expect(
      visibleEdges.every(
        ({ from, to }) => ["man", "king"].includes(from) && ["man", "king"].includes(to),
      ),
    ).toBe(true);
    expect(visibleEdges).not.toContainEqual({ from: "woman", to: "girl", relation: "age" });
  });
});
