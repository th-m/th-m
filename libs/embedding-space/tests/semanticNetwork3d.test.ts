import { describe, expect, it } from "vitest";
import sourceDataset from "../src/data/gpt2-embedding-space.json";
import {
  PAIR_RECIPES,
  SEMANTIC_WORDS,
  WORD_COORDINATES,
} from "../src/compositionModel";
import {
  SEMANTIC_NETWORK_ANIMAL_WORDS,
  SEMANTIC_NETWORK_CONTEXT_WORDS,
  SEMANTIC_NETWORK_EDGES,
  SEMANTIC_NETWORK_MYTHICAL_WORDS,
  SEMANTIC_NETWORK_NODES,
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
  it("expands the eight composable anchors into a seventy-term point network", () => {
    expect(SEMANTIC_NETWORK_NODES).toHaveLength(70);
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
      "young",
    ]);
    expect(SEMANTIC_WORDS.every((word) => SEMANTIC_NETWORK_NODES.some((node) => node.word === word))).toBe(true);
    expect(SEMANTIC_NETWORK_NODES.filter((node) => node.kind === "context")).toHaveLength(17);
    expect(SEMANTIC_NETWORK_ANIMAL_WORDS).toEqual([
      "horse", "fish", "hummingbird", "lion", "eagle", "bird", "goat",
      "wolf", "bear", "owl", "snake", "deer", "cat", "dog",
      "foal", "seahorse", "fry", "cub", "chick", "kid", "eaglet", "lionfish",
      "pup", "hatchling", "fawn", "kitten", "puppy", "catfish", "dogfish", "wolffish",
    ]);
    expect(SEMANTIC_NETWORK_MYTHICAL_WORDS).toEqual([
      "centaur", "merman", "mermaid", "harpy", "pixie", "werewolf",
      "griffin", "pegasus", "capricorn", "owlbear", "chimera", "unicorn", "phoenix",
    ]);
    expect(SEMANTIC_NETWORK_NODES.filter((node) => node.kind === "animal")).toHaveLength(30);
    expect(SEMANTIC_NETWORK_NODES.filter((node) => node.kind === "mythic")).toHaveLength(13);
    expect(SEMANTIC_NETWORK_NODES.filter((node) => node.kind === "category")).toHaveLength(2);
  });

  it("places every term at a unique x-y-z coordinate, including interior points", () => {
    const positions = SEMANTIC_NETWORK_NODES.map(({ position }) => position.join(":"));
    expect(new Set(positions).size).toBe(SEMANTIC_NETWORK_NODES.length);
    expect(SEMANTIC_NETWORK_NODES.some(({ position }) => position[2] === 0)).toBe(true);
    expect(SEMANTIC_NETWORK_NODES.some(({ position }) => Math.abs(position[0]) < 1.5)).toBe(true);
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
    const words = new Set(SEMANTIC_NETWORK_NODES.map(({ word }) => word));
    expect(SEMANTIC_NETWORK_EDGES).toHaveLength(165);
    expect(new Set(SEMANTIC_NETWORK_EDGES.map(({ relation }) => relation))).toEqual(
      new Set(["status", "age", "category", "counterpart", "blend"]),
    );
    for (const edge of SEMANTIC_NETWORK_EDGES) {
      expect(words.has(edge.from)).toBe(true);
      expect(words.has(edge.to)).toBe(true);
      expect(edge.from).not.toBe(edge.to);
    }
    for (const recipe of PAIR_RECIPES) {
      expect(SEMANTIC_NETWORK_EDGES).toContainEqual({
        from: recipe.terms[0],
        to: recipe.result,
        relation: "blend",
      });
      expect(SEMANTIC_NETWORK_EDGES).toContainEqual({
        from: recipe.terms[1],
        to: recipe.result,
        relation: "blend",
      });
    }
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
