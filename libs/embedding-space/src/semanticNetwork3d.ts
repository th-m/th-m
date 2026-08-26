import {
  PAIR_RECIPES,
  SEMANTIC_WORDS,
  type AnimalWord,
  type DerivedAnimalWord,
  type MythicalWord,
  type SemanticWord,
  type StatusResultWord,
} from "./compositionModel";

export type SemanticContextWord =
  | "person"
  | "child"
  | "leader"
  | "successor"
  | "noble"
  | "monarch"
  | "heir"
  | "sovereign"
  | "legendary"
  | "young";

export type SemanticCategoryWord = "animal" | "mythic";
export type SemanticNetworkWord = SemanticWord | SemanticContextWord | AnimalWord | MythicalWord | DerivedAnimalWord | StatusResultWord | SemanticCategoryWord;
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

// Precomputed 3D classical-MDS fit of pairwise cosine distances among these
// eight static GPT-2 input embeddings. The fit is rotated so status, age, and
// role remain broadly legible, but spacing follows source-vector proximity
// instead of forcing the words onto a binary cube. Hard-coding the small fit
// keeps the lazy composition scene from importing the full 768D dataset.
const ANCHOR_SEMANTIC_POSITIONS: Readonly<
  Record<SemanticWord, readonly [number, number, number]>
> = {
  man: [-1.458, 1.117, -1.118],
  woman: [-1.28, 0.652, 0.999],
  boy: [-1.122, -1.021, -0.73],
  girl: [-1.011, -0.749, 0.848],
  king: [1.459, 0.869, -0.817],
  queen: [1.337, 0.912, 0.935],
  prince: [1.078, -0.86, -0.973],
  princess: [0.996, -0.922, 0.854],
};

const CONTEXT_NODES: readonly SemanticNetworkNode[] = [
  { word: "person", kind: "context", position: [-1.5, 1.15, 0], labelOffset: [0, -0.2, 0] },
  { word: "child", kind: "context", position: [-1.5, -1.15, 0], labelOffset: [0, -0.2, 0] },
  { word: "leader", kind: "context", position: [-0.58, 0.58, -0.18], labelOffset: [0, 0.2, 0] },
  { word: "successor", kind: "context", position: [0.08, -0.7, 0.18], labelOffset: [0, -0.2, 0] },
  { word: "noble", kind: "context", position: [0.45, 0.92, 0.32], labelOffset: [0, 0.2, 0] },
  { word: "monarch", kind: "context", position: [1.5, 1.15, 0], labelOffset: [0, -0.2, 0] },
  { word: "heir", kind: "context", position: [1.5, -1.15, 0], labelOffset: [0, -0.2, 0] },
  { word: "sovereign", kind: "context", position: [2.38, 1.72, 0], labelOffset: [0, 0.22, 0] },
  { word: "legendary", kind: "context", position: [1.78, 1.64, 0.58], labelOffset: [0, 0.22, 0] },
  { word: "young", kind: "context", position: [-2.82, -1.62, -0.14], labelOffset: [0, -0.2, 0] },
];

const STATUS_RESULT_NODES: readonly SemanticNetworkNode[] = [
  { word: "lord", kind: "context", position: [-0.08, 1.32, -1.32], labelOffset: [0, 0.22, 0] },
  { word: "lady", kind: "context", position: [-0.02, 1.22, 1.34], labelOffset: [0, 0.22, 0] },
  { word: "emperor", kind: "context", position: [2.48, 1.08, -0.98], labelOffset: [0, 0.22, 0] },
  { word: "empress", kind: "context", position: [2.36, 1.16, 1.06], labelOffset: [0, 0.22, 0] },
  { word: "hero", kind: "context", position: [0.38, 1.52, -1.38], labelOffset: [0, 0.22, 0] },
  { word: "heroine", kind: "context", position: [0.34, 1.48, 1.42], labelOffset: [0, 0.22, 0] },
  { word: "prodigy", kind: "context", position: [0.16, -1.42, 0.46], labelOffset: [0, -0.22, 0] },
];

const CREATURE_NODES: readonly SemanticNetworkNode[] = [
  { word: "animal", kind: "category", position: [-2.72, -0.78, 0], labelOffset: [0, -0.2, 0] },
  { word: "horse", kind: "animal", position: [-2.28, 0.18, -0.45], labelOffset: [0, 0.22, 0] },
  { word: "fish", kind: "animal", position: [-2.28, -0.68, 0.68], labelOffset: [0, -0.2, 0] },
  { word: "hummingbird", kind: "animal", position: [-1.82, -1.72, -0.52], labelOffset: [0, -0.22, 0] },
  { word: "lion", kind: "animal", position: [-2.42, 0.72, -1.32], labelOffset: [0, 0.22, 0] },
  { word: "eagle", kind: "animal", position: [-1.6, 1.5, -0.78], labelOffset: [0, 0.22, 0] },
  { word: "bird", kind: "animal", position: [-1.78, 0.92, -0.48], labelOffset: [0, 0.22, 0] },
  { word: "goat", kind: "animal", position: [-2.92, 0.26, 0.02], labelOffset: [0, 0.22, 0] },
  { word: "wolf", kind: "animal", position: [-2.62, 0.62, -0.82], labelOffset: [0, 0.22, 0] },
  { word: "bear", kind: "animal", position: [-2.96, 0.94, -0.54], labelOffset: [0, 0.22, 0] },
  { word: "owl", kind: "animal", position: [-1.46, 1.08, 0.12], labelOffset: [0, 0.22, 0] },
  { word: "snake", kind: "animal", position: [-2.62, -0.28, 1.14], labelOffset: [0, -0.22, 0] },
  { word: "deer", kind: "animal", position: [-2.86, 0.38, 0.72], labelOffset: [0, 0.22, 0] },
  { word: "cat", kind: "animal", position: [-2.34, 0.78, 1.02], labelOffset: [0, 0.22, 0] },
  { word: "dog", kind: "animal", position: [-2.54, 0.7, 0.24], labelOffset: [0, 0.22, 0] },
  { word: "foal", kind: "animal", position: [-2.36, -1.18, -0.3], labelOffset: [0, -0.22, 0] },
  { word: "seahorse", kind: "animal", position: [-2.52, -0.34, 0.16], labelOffset: [0, 0.22, 0] },
  { word: "fry", kind: "animal", position: [-2.38, -1.28, 0.72], labelOffset: [0, -0.22, 0] },
  { word: "cub", kind: "animal", position: [-2.7, -0.58, -1.08], labelOffset: [0, -0.22, 0] },
  { word: "chick", kind: "animal", position: [-1.84, -0.96, -0.58], labelOffset: [0, -0.22, 0] },
  { word: "kid", kind: "animal", position: [-2.92, -0.76, 0.04], labelOffset: [0, -0.22, 0] },
  { word: "eaglet", kind: "animal", position: [-1.54, -0.52, -0.82], labelOffset: [0, -0.22, 0] },
  { word: "lionfish", kind: "animal", position: [-2.72, -0.08, -0.22], labelOffset: [0, 0.22, 0] },
  { word: "pup", kind: "animal", position: [-2.72, -0.72, -0.66], labelOffset: [0, -0.22, 0] },
  { word: "hatchling", kind: "animal", position: [-2.58, -1.08, 1.12], labelOffset: [0, -0.22, 0] },
  { word: "fawn", kind: "animal", position: [-2.92, -0.74, 0.68], labelOffset: [0, -0.22, 0] },
  { word: "kitten", kind: "animal", position: [-2.32, -0.62, 1.04], labelOffset: [0, -0.22, 0] },
  { word: "puppy", kind: "animal", position: [-2.52, -0.68, 0.26], labelOffset: [0, -0.22, 0] },
  { word: "catfish", kind: "animal", position: [-2.4, -0.18, 0.88], labelOffset: [0, -0.22, 0] },
  { word: "dogfish", kind: "animal", position: [-2.56, -0.12, 0.38], labelOffset: [0, -0.22, 0] },
  { word: "wolffish", kind: "animal", position: [-2.7, -0.08, -0.62], labelOffset: [0, -0.22, 0] },
  { word: "mythic", kind: "category", position: [-0.56, -1.28, 0], labelOffset: [0, -0.22, 0] },
  { word: "centaur", kind: "mythic", position: [-0.62, 0.16, -1.72], labelOffset: [0, 0.24, 0] },
  { word: "merman", kind: "mythic", position: [-0.7, -0.28, -1.58], labelOffset: [0, -0.24, 0] },
  { word: "mermaid", kind: "mythic", position: [-0.55, -0.34, 1.78], labelOffset: [0, 0.24, 0] },
  { word: "harpy", kind: "mythic", position: [-0.32, 0.46, 1.48], labelOffset: [0, 0.24, 0] },
  { word: "pixie", kind: "mythic", position: [-0.3, -1.78, 0.9], labelOffset: [0, -0.24, 0] },
  { word: "werewolf", kind: "mythic", position: [-0.46, 0.62, -1.34], labelOffset: [0, 0.24, 0] },
  { word: "griffin", kind: "mythic", position: [-0.5, 1.42, -1.64], labelOffset: [0, 0.24, 0] },
  { word: "pegasus", kind: "mythic", position: [-0.84, 0.9, -1.94], labelOffset: [0, 0.24, 0] },
  { word: "capricorn", kind: "mythic", position: [-0.76, -0.7, 0.72], labelOffset: [0, -0.24, 0] },
  { word: "owlbear", kind: "mythic", position: [-0.72, 1.02, -0.42], labelOffset: [0, 0.24, 0] },
  { word: "chimera", kind: "mythic", position: [-0.58, 0.76, 0.22], labelOffset: [0, 0.24, 0] },
  { word: "unicorn", kind: "mythic", position: [-0.82, 1.16, 0.5], labelOffset: [0, 0.24, 0] },
  { word: "phoenix", kind: "mythic", position: [-0.14, 1.7, 0.62], labelOffset: [0, 0.24, 0] },
];

export const SEMANTIC_NETWORK_NODES: readonly SemanticNetworkNode[] = [
  ...SEMANTIC_WORDS.map((word) => ({
    word,
    kind: "anchor" as const,
    position: ANCHOR_SEMANTIC_POSITIONS[word],
  })),
  ...CONTEXT_NODES,
  ...STATUS_RESULT_NODES,
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
  { from: "sovereign", to: "legendary", relation: "status" },
  { from: "child", to: "successor", relation: "status" },
  { from: "successor", to: "heir", relation: "status" },
  { from: "noble", to: "lord", relation: "status" },
  { from: "noble", to: "lady", relation: "status" },
  { from: "sovereign", to: "emperor", relation: "status" },
  { from: "sovereign", to: "empress", relation: "status" },
  { from: "legendary", to: "hero", relation: "status" },
  { from: "legendary", to: "heroine", relation: "status" },
  { from: "legendary", to: "prodigy", relation: "status" },

  { from: "animal", to: "horse", relation: "category" },
  { from: "animal", to: "fish", relation: "category" },
  { from: "animal", to: "hummingbird", relation: "category" },
  { from: "animal", to: "lion", relation: "category" },
  { from: "animal", to: "eagle", relation: "category" },
  { from: "animal", to: "bird", relation: "category" },
  { from: "animal", to: "goat", relation: "category" },
  { from: "animal", to: "wolf", relation: "category" },
  { from: "animal", to: "bear", relation: "category" },
  { from: "animal", to: "owl", relation: "category" },
  { from: "animal", to: "snake", relation: "category" },
  { from: "animal", to: "deer", relation: "category" },
  { from: "animal", to: "cat", relation: "category" },
  { from: "animal", to: "dog", relation: "category" },
  { from: "animal", to: "foal", relation: "category" },
  { from: "animal", to: "seahorse", relation: "category" },
  { from: "animal", to: "fry", relation: "category" },
  { from: "animal", to: "cub", relation: "category" },
  { from: "animal", to: "chick", relation: "category" },
  { from: "animal", to: "kid", relation: "category" },
  { from: "animal", to: "eaglet", relation: "category" },
  { from: "animal", to: "lionfish", relation: "category" },
  { from: "animal", to: "pup", relation: "category" },
  { from: "animal", to: "hatchling", relation: "category" },
  { from: "animal", to: "fawn", relation: "category" },
  { from: "animal", to: "kitten", relation: "category" },
  { from: "animal", to: "puppy", relation: "category" },
  { from: "animal", to: "catfish", relation: "category" },
  { from: "animal", to: "dogfish", relation: "category" },
  { from: "animal", to: "wolffish", relation: "category" },
  { from: "mythic", to: "centaur", relation: "category" },
  { from: "mythic", to: "merman", relation: "category" },
  { from: "mythic", to: "mermaid", relation: "category" },
  { from: "mythic", to: "harpy", relation: "category" },
  { from: "mythic", to: "pixie", relation: "category" },
  { from: "mythic", to: "werewolf", relation: "category" },
  { from: "mythic", to: "griffin", relation: "category" },
  { from: "mythic", to: "pegasus", relation: "category" },
  { from: "mythic", to: "capricorn", relation: "category" },
  { from: "mythic", to: "owlbear", relation: "category" },
  { from: "mythic", to: "chimera", relation: "category" },
  { from: "mythic", to: "unicorn", relation: "category" },
  { from: "mythic", to: "phoenix", relation: "category" },

  ...PAIR_RECIPES.flatMap(({ terms: [left, right], result }) => [
    { from: left, to: result, relation: "blend" as const },
    { from: right, to: result, relation: "blend" as const },
  ]),
];

export const SEMANTIC_NETWORK_CONTEXT_WORDS = CONTEXT_NODES.map(({ word }) => word);
export const SEMANTIC_NETWORK_ANIMAL_WORDS = [
  "horse", "fish", "hummingbird", "lion", "eagle", "bird", "goat",
  "wolf", "bear", "owl", "snake", "deer", "cat", "dog",
  "foal", "seahorse", "fry", "cub", "chick", "kid", "eaglet", "lionfish",
  "pup", "hatchling", "fawn", "kitten", "puppy", "catfish", "dogfish", "wolffish",
] as const;
export const SEMANTIC_NETWORK_MYTHICAL_WORDS = [
  "centaur", "merman", "mermaid", "harpy", "pixie", "werewolf",
  "griffin", "pegasus", "capricorn", "owlbear", "chimera", "unicorn", "phoenix",
] as const;

export function semanticEdgesForHighlights(
  highlightedWords: readonly SemanticNetworkWord[],
): readonly SemanticNetworkEdge[] {
  const highlighted = new Set(highlightedWords);
  return SEMANTIC_NETWORK_EDGES.filter(
    ({ from, to }) => highlighted.has(from) && highlighted.has(to),
  );
}
