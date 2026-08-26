import { describe, expect, it } from "vitest";
import {
  HYBRID_RECIPES,
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

describe("three-dimensional semantic teaching network", () => {
  it("expands the eight composable anchors into a twenty-four-term point network", () => {
    expect(SEMANTIC_NETWORK_NODES).toHaveLength(24);
    expect(SEMANTIC_NETWORK_CONTEXT_WORDS).toEqual([
      "person",
      "child",
      "leader",
      "successor",
      "noble",
      "monarch",
      "heir",
      "sovereign",
    ]);
    expect(SEMANTIC_WORDS.every((word) => SEMANTIC_NETWORK_NODES.some((node) => node.word === word))).toBe(true);
    expect(SEMANTIC_NETWORK_NODES.filter((node) => node.kind === "context")).toHaveLength(8);
    expect(SEMANTIC_NETWORK_ANIMAL_WORDS).toEqual(["horse", "fish", "hummingbird"]);
    expect(SEMANTIC_NETWORK_MYTHICAL_WORDS).toEqual(["centaur", "mermaid", "pixie"]);
    expect(SEMANTIC_NETWORK_NODES.filter((node) => node.kind === "animal")).toHaveLength(3);
    expect(SEMANTIC_NETWORK_NODES.filter((node) => node.kind === "mythic")).toHaveLength(3);
    expect(SEMANTIC_NETWORK_NODES.filter((node) => node.kind === "category")).toHaveLength(2);
  });

  it("places every term at a unique x-y-z coordinate, including interior points", () => {
    const positions = SEMANTIC_NETWORK_NODES.map(({ position }) => position.join(":"));
    expect(new Set(positions).size).toBe(SEMANTIC_NETWORK_NODES.length);
    expect(SEMANTIC_NETWORK_NODES.some(({ position }) => position[2] === 0)).toBe(true);
    expect(SEMANTIC_NETWORK_NODES.some(({ position }) => Math.abs(position[0]) < 1.5)).toBe(true);
  });

  it("loosens anchor spacing without moving a term out of its semantic octant", () => {
    const anchors = SEMANTIC_NETWORK_NODES.filter(
      (node): node is typeof node & { word: (typeof SEMANTIC_WORDS)[number] } =>
        node.kind === "anchor",
    );

    expect(new Set(anchors.map(({ position }) => position[0])).size).toBeGreaterThan(2);
    expect(new Set(anchors.map(({ position }) => position[1])).size).toBeGreaterThan(2);
    expect(new Set(anchors.map(({ position }) => position[2])).size).toBeGreaterThan(2);

    for (const { word, position } of anchors) {
      const coordinate = WORD_COORDINATES[word];
      expect(Math.sign(position[0])).toBe(coordinate.status === "royal" ? 1 : -1);
      expect(Math.sign(position[1])).toBe(coordinate.age === "adult" ? 1 : -1);
      expect(Math.sign(position[2])).toBe(coordinate.role === "feminine" ? 1 : -1);
    }
  });

  it("connects valid terms through role, category, counterpart, and authored blend links", () => {
    const words = new Set(SEMANTIC_NETWORK_NODES.map(({ word }) => word));
    expect(SEMANTIC_NETWORK_EDGES).toHaveLength(40);
    expect(new Set(SEMANTIC_NETWORK_EDGES.map(({ relation }) => relation))).toEqual(
      new Set(["status", "age", "category", "counterpart", "blend"]),
    );
    for (const edge of SEMANTIC_NETWORK_EDGES) {
      expect(words.has(edge.from)).toBe(true);
      expect(words.has(edge.to)).toBe(true);
      expect(edge.from).not.toBe(edge.to);
    }
    for (const recipe of HYBRID_RECIPES) {
      expect(SEMANTIC_NETWORK_EDGES).toContainEqual({
        from: recipe.base,
        to: recipe.result,
        relation: "blend",
      });
      expect(SEMANTIC_NETWORK_EDGES).toContainEqual({
        from: recipe.animal,
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
        ({ from, to }) => ["man", "king"].includes(from) || ["man", "king"].includes(to),
      ),
    ).toBe(true);
    expect(visibleEdges).not.toContainEqual({ from: "woman", to: "girl", relation: "age" });
  });
});
