import {
  HYBRID_RECIPES,
  SEMANTIC_WORDS,
  semanticPosition3d,
  type AnimalWord,
  type MythicalWord,
  type SemanticWord,
} from "./compositionModel";

export type SemanticContextWord =
  | "person"
  | "child"
  | "leader"
  | "successor"
  | "noble"
  | "monarch"
  | "heir"
  | "sovereign";

export type SemanticCategoryWord = "animal" | "mythic";
export type SemanticNetworkWord = SemanticWord | SemanticContextWord | AnimalWord | MythicalWord | SemanticCategoryWord;
export type SemanticNetworkRelation = "status" | "age" | "category" | "counterpart" | "blend";

export type SemanticNetworkNode = {
  word: SemanticNetworkWord;
  kind: "anchor" | "context" | "animal" | "mythic" | "category";
  position: readonly [number, number, number];
  labelOffset?: readonly [number, number, number];
};

export type SemanticNetworkEdge = {
  from: SemanticNetworkWord;
  to: SemanticNetworkWord;
  relation: SemanticNetworkRelation;
};

// Keep each anchor in its semantic octant while loosening the perfectly
// axis-aligned teaching cube. These authored offsets are presentation-only:
// composition still uses the discrete status, age, and role coordinates.
const ANCHOR_PRESENTATION_OFFSETS: Readonly<
  Record<SemanticWord, readonly [number, number, number]>
> = {
  man: [-0.16, -0.08, 0.12],
  woman: [0.11, 0.14, 0.08],
  boy: [-0.2, 0.11, -0.09],
  girl: [0.14, -0.15, -0.13],
  king: [-0.12, 0.16, -0.11],
  queen: [0.17, -0.1, -0.07],
  prince: [-0.03, -0.14, 0.1],
  princess: [0.2, 0.13, 0.12],
};

function anchorPresentationPosition(word: SemanticWord): readonly [number, number, number] {
  const base = semanticPosition3d(word);
  const offset = ANCHOR_PRESENTATION_OFFSETS[word];
  return [base[0] + offset[0], base[1] + offset[1], base[2] + offset[2]];
}

const CONTEXT_NODES: readonly SemanticNetworkNode[] = [
  { word: "person", kind: "context", position: [-1.5, 1.15, 0], labelOffset: [0, -0.2, 0] },
  { word: "child", kind: "context", position: [-1.5, -1.15, 0], labelOffset: [0, -0.2, 0] },
  { word: "leader", kind: "context", position: [-0.58, 0.58, -0.18], labelOffset: [0, 0.2, 0] },
  { word: "successor", kind: "context", position: [0.08, -0.7, 0.18], labelOffset: [0, -0.2, 0] },
  { word: "noble", kind: "context", position: [0.45, 0.92, 0.32], labelOffset: [0, 0.2, 0] },
  { word: "monarch", kind: "context", position: [1.5, 1.15, 0], labelOffset: [0, -0.2, 0] },
  { word: "heir", kind: "context", position: [1.5, -1.15, 0], labelOffset: [0, -0.2, 0] },
  { word: "sovereign", kind: "context", position: [2.38, 1.72, 0], labelOffset: [0, 0.22, 0] },
];

const CREATURE_NODES: readonly SemanticNetworkNode[] = [
  { word: "animal", kind: "category", position: [-2.72, -0.78, 0], labelOffset: [0, -0.2, 0] },
  { word: "horse", kind: "animal", position: [-2.28, 0.18, -0.45], labelOffset: [0, 0.22, 0] },
  { word: "fish", kind: "animal", position: [-2.28, -0.68, 0.68], labelOffset: [0, -0.2, 0] },
  { word: "hummingbird", kind: "animal", position: [-1.82, -1.72, -0.52], labelOffset: [0, -0.22, 0] },
  { word: "mythic", kind: "category", position: [-0.56, -1.28, 0], labelOffset: [0, -0.22, 0] },
  { word: "centaur", kind: "mythic", position: [-0.62, 0.16, -1.72], labelOffset: [0, 0.24, 0] },
  { word: "mermaid", kind: "mythic", position: [-0.55, -0.34, 1.78], labelOffset: [0, 0.24, 0] },
  { word: "pixie", kind: "mythic", position: [-0.3, -1.78, 0.9], labelOffset: [0, -0.24, 0] },
];

export const SEMANTIC_NETWORK_NODES: readonly SemanticNetworkNode[] = [
  ...SEMANTIC_WORDS.map((word) => ({
    word,
    kind: "anchor" as const,
    position: anchorPresentationPosition(word),
  })),
  ...CONTEXT_NODES,
  ...CREATURE_NODES,
];

export const SEMANTIC_NETWORK_EDGES: readonly SemanticNetworkEdge[] = [
  { from: "man", to: "woman", relation: "counterpart" },
  { from: "boy", to: "girl", relation: "counterpart" },
  { from: "king", to: "queen", relation: "counterpart" },
  { from: "prince", to: "princess", relation: "counterpart" },

  { from: "person", to: "man", relation: "category" },
  { from: "person", to: "woman", relation: "category" },
  { from: "child", to: "boy", relation: "category" },
  { from: "child", to: "girl", relation: "category" },
  { from: "monarch", to: "king", relation: "category" },
  { from: "monarch", to: "queen", relation: "category" },
  { from: "heir", to: "prince", relation: "category" },
  { from: "heir", to: "princess", relation: "category" },

  { from: "man", to: "boy", relation: "age" },
  { from: "woman", to: "girl", relation: "age" },
  { from: "king", to: "prince", relation: "age" },
  { from: "queen", to: "princess", relation: "age" },
  { from: "person", to: "child", relation: "age" },
  { from: "monarch", to: "heir", relation: "age" },

  { from: "man", to: "king", relation: "status" },
  { from: "woman", to: "queen", relation: "status" },
  { from: "boy", to: "prince", relation: "status" },
  { from: "girl", to: "princess", relation: "status" },
  { from: "person", to: "leader", relation: "status" },
  { from: "leader", to: "noble", relation: "status" },
  { from: "noble", to: "monarch", relation: "status" },
  { from: "monarch", to: "sovereign", relation: "status" },
  { from: "child", to: "successor", relation: "status" },
  { from: "successor", to: "heir", relation: "status" },

  { from: "animal", to: "horse", relation: "category" },
  { from: "animal", to: "fish", relation: "category" },
  { from: "animal", to: "hummingbird", relation: "category" },
  { from: "mythic", to: "centaur", relation: "category" },
  { from: "mythic", to: "mermaid", relation: "category" },
  { from: "mythic", to: "pixie", relation: "category" },

  ...HYBRID_RECIPES.flatMap(({ base, animal, result }) => [
    { from: base, to: result, relation: "blend" as const },
    { from: animal, to: result, relation: "blend" as const },
  ]),
];

export const SEMANTIC_NETWORK_CONTEXT_WORDS = CONTEXT_NODES.map(({ word }) => word);
export const SEMANTIC_NETWORK_ANIMAL_WORDS = HYBRID_RECIPES.map(({ animal }) => animal);
export const SEMANTIC_NETWORK_MYTHICAL_WORDS = HYBRID_RECIPES.map(({ result }) => result);

export function semanticEdgesForHighlights(
  highlightedWords: readonly SemanticNetworkWord[],
): readonly SemanticNetworkEdge[] {
  const highlighted = new Set(highlightedWords);
  return SEMANTIC_NETWORK_EDGES.filter(
    ({ from, to }) => highlighted.has(from) || highlighted.has(to),
  );
}
