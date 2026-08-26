import {
  AUTHORED_RECIPES,
  COMPOSITION_OUTPUT_ONLY_TERMS,
  COMPOSITION_STARTERS,
  SEMANTIC_WORDS,
  type AbstractResultWord,
  type AbstractWord,
  type AnimalWord,
  type CompositionResultWord,
  type CompositionTerm,
  type DerivedAnimalWord,
  type MythicalWord,
  type ResolvedTermComposition,
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
  | "divine"
  | "young";

export type SemanticCategoryWord = "animal" | "mythic" | "concept";
export type SemanticNetworkWord = SemanticWord | SemanticContextWord | AnimalWord | MythicalWord | DerivedAnimalWord | StatusResultWord | AbstractWord | AbstractResultWord | SemanticCategoryWord;
export type SemanticNetworkRelation = "status" | "age" | "category" | "counterpart" | "blend";

export type SemanticNetworkNode = {
  word: SemanticNetworkWord;
  kind: "anchor" | "context" | "animal" | "mythic" | "abstract" | "category";
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
  { word: "divine", kind: "context", position: [2.18, 1.82, -0.1], labelOffset: [0, 0.22, 0] },
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
  { word: "god", kind: "context", position: [2.7, 1.48, -1.26], labelOffset: [0, 0.22, 0] },
  { word: "goddess", kind: "context", position: [2.64, 1.44, 1.3], labelOffset: [0, 0.22, 0] },
  { word: "demigod", kind: "context", position: [1.72, -1.52, 0.16], labelOffset: [0, -0.22, 0] },
  { word: "demigoddess", kind: "context", position: [1.72, -1.5, 1.12], labelOffset: [0, -0.22, 0] },
  { word: "anointed monarch", kind: "context", position: [2.18, 1.38, -0.72], labelOffset: [0, 0.22, 0] },
  { word: "anointed queen", kind: "context", position: [2.12, 1.38, 0.92], labelOffset: [0, 0.22, 0] },
  { word: "philosopher-monarch", kind: "context", position: [1.45, 1.42, 0.1], labelOffset: [0, 0.22, 0] },
  { word: "philosopher-king", kind: "context", position: [1.7, 1.28, -0.92], labelOffset: [0, 0.22, 0] },
  { word: "philosopher-queen", kind: "context", position: [1.66, 1.3, 0.98], labelOffset: [0, 0.22, 0] },
  { word: "absolute monarch", kind: "context", position: [2.28, 1.05, -0.45], labelOffset: [0, 0.22, 0] },
  { word: "queen regnant", kind: "context", position: [2.1, 1.12, 1.1], labelOffset: [0, 0.22, 0] },
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
  { word: "fox", kind: "animal", position: [-2.42, 0.46, 1.36], labelOffset: [0, 0.22, 0] },
  { word: "shark", kind: "animal", position: [-2.64, -0.38, 0.42], labelOffset: [0, -0.22, 0] },
  { word: "tiger", kind: "animal", position: [-2.58, 0.84, -1.5], labelOffset: [0, 0.22, 0] },
  { word: "raven", kind: "animal", position: [-1.66, 1.18, 0.42], labelOffset: [0, 0.22, 0] },
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
  { word: "kit", kind: "animal", position: [-2.46, -0.82, 1.3], labelOffset: [0, -0.22, 0] },
  { word: "tigerfish", kind: "animal", position: [-2.68, -0.12, -0.44], labelOffset: [0, -0.22, 0] },
  { word: "owlet", kind: "animal", position: [-1.5, -0.56, 0.14], labelOffset: [0, -0.22, 0] },
  { word: "alpha wolf", kind: "animal", position: [-1.22, 0.9, -0.8], labelOffset: [0, 0.22, 0] },
  { word: "king cobra", kind: "animal", position: [-1.08, 0.18, 0.98], labelOffset: [0, 0.22, 0] },
  { word: "kingfish", kind: "animal", position: [-1.16, -0.34, 0.58], labelOffset: [0, -0.22, 0] },
  { word: "lion king", kind: "animal", position: [0.02, 0.94, -1.18], labelOffset: [0, 0.22, 0] },
  { word: "imperial eagle", kind: "animal", position: [-0.02, 1.38, -0.76], labelOffset: [0, 0.22, 0] },
  { word: "mythic", kind: "category", position: [-0.56, -1.28, 0], labelOffset: [0, -0.22, 0] },
  { word: "centaur", kind: "mythic", position: [-0.62, 0.16, -1.72], labelOffset: [0, 0.24, 0] },
  { word: "centauride", kind: "mythic", position: [-0.58, 0.2, 1.68], labelOffset: [0, 0.24, 0] },
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
  { word: "hippogriff", kind: "mythic", position: [-0.68, 1.28, -1.88], labelOffset: [0, 0.24, 0] },
  { word: "sphinx", kind: "mythic", position: [-0.35, 0.55, 1.65], labelOffset: [0, 0.24, 0] },
  { word: "Fenrir", kind: "mythic", position: [-0.16, 1.22, -1.18], labelOffset: [0, 0.24, 0] },
  { word: "alpha werewolf", kind: "mythic", position: [0.22, 0.82, -0.1], labelOffset: [0, 0.24, 0] },
  { word: "Chiron", kind: "mythic", position: [0.18, 0.78, -1.48], labelOffset: [0, 0.24, 0] },
  { word: "centaur queen", kind: "mythic", position: [0.08, 0.52, 1.58], labelOffset: [0, 0.24, 0] },
  { word: "merman king", kind: "mythic", position: [0.05, -0.02, -1.48], labelOffset: [0, -0.24, 0] },
  { word: "mermaid queen", kind: "mythic", position: [0.08, 0.02, 1.7], labelOffset: [0, 0.24, 0] },
  { word: "harpy queen", kind: "mythic", position: [0.15, 0.66, 1.48], labelOffset: [0, 0.24, 0] },
  { word: "pixie princess", kind: "mythic", position: [0.15, -1.28, 0.92], labelOffset: [0, -0.24, 0] },
];

// Abstract terms occupy the sparse center and positive sides of the teaching
// volume. They make the projection visibly three-dimensional without implying
// that any one axis is a literal "abstractness" coordinate.
const ABSTRACT_NODES: readonly SemanticNetworkNode[] = [
  { word: "concept", kind: "category", position: [0.15, 0.2, 0.2], labelOffset: [0, 0.2, 0] },
  { word: "knowledge", kind: "abstract", position: [0.25, 1.6, 0.75], labelOffset: [0, 0.22, 0] },
  { word: "courage", kind: "abstract", position: [0.9, 0.45, -1.55], labelOffset: [0, 0.22, 0] },
  { word: "freedom", kind: "abstract", position: [0.7, -0.55, 1.65], labelOffset: [0, -0.22, 0] },
  { word: "order", kind: "abstract", position: [1.05, 1.1, 0.7], labelOffset: [0, 0.22, 0] },
  { word: "chaos", kind: "abstract", position: [0.45, -1.4, -1.45], labelOffset: [0, -0.22, 0] },
  { word: "memory", kind: "abstract", position: [-0.15, 0.65, 1.55], labelOffset: [0, 0.22, 0] },
  { word: "time", kind: "abstract", position: [0.35, -1.75, 0.25], labelOffset: [0, -0.22, 0] },
  { word: "mystery", kind: "abstract", position: [-0.05, 0.1, 1.95], labelOffset: [0, 0.22, 0] },
  { word: "justice", kind: "abstract", position: [1.6, 0.4, 0.9], labelOffset: [0, 0.22, 0] },
  { word: "truth", kind: "abstract", position: [1.4, 1.3, -0.6], labelOffset: [0, 0.22, 0] },
  { word: "beauty", kind: "abstract", position: [1.15, 0.05, 1.5], labelOffset: [0, 0.22, 0] },
  { word: "power", kind: "abstract", position: [1.85, 0.9, -0.8], labelOffset: [0, 0.22, 0] },
  { word: "hope", kind: "abstract", position: [1.3, -1.1, 0.9], labelOffset: [0, -0.22, 0] },
  { word: "fear", kind: "abstract", position: [1, -0.8, -1.4], labelOffset: [0, -0.22, 0] },
  { word: "love", kind: "abstract", position: [1.55, 0.2, 1], labelOffset: [0, -0.22, 0] },
  { word: "reason", kind: "abstract", position: [1.2, 1.4, -1], labelOffset: [0, 0.22, 0] },
  { word: "wisdom", kind: "abstract", position: [0.5, 1.45, 1.15], labelOffset: [0, 0.22, 0] },
  { word: "lionheart", kind: "abstract", position: [0.9, 0.65, -1.25], labelOffset: [0, 0.22, 0] },
  { word: "liberty", kind: "abstract", position: [0.85, -0.45, 1.4], labelOffset: [0, -0.22, 0] },
  { word: "chronology", kind: "abstract", position: [0.75, -0.3, 0.45], labelOffset: [0, -0.22, 0] },
  { word: "nostalgia", kind: "abstract", position: [-0.05, -0.75, 1.2], labelOffset: [0, -0.22, 0] },
  { word: "scholar", kind: "abstract", position: [-0.25, 1.35, 0.45], labelOffset: [0, 0.22, 0] },
  { word: "student", kind: "abstract", position: [-0.55, -0.95, 0.5], labelOffset: [0, -0.22, 0] },
  { word: "oracle", kind: "abstract", position: [0.65, 1.75, 0.95], labelOffset: [0, 0.22, 0] },
  { word: "omniscience", kind: "abstract", position: [1.5, 1.7, 0.55], labelOffset: [0, 0.22, 0] },
  { word: "understanding", kind: "abstract", position: [0.8, 1.45, 0.1], labelOffset: [0, 0.22, 0] },
  { word: "compassion", kind: "abstract", position: [1.2, 0.3, -0.2], labelOffset: [0, 0.22, 0] },
  { word: "optimism", kind: "abstract", position: [1, -0.8, 1.2], labelOffset: [0, -0.22, 0] },
  { word: "logic", kind: "abstract", position: [1.1, 1.25, -0.15], labelOffset: [0, 0.22, 0] },
  { word: "sovereignty", kind: "abstract", position: [1.7, 0.45, -0.4], labelOffset: [0, 0.22, 0] },
  { word: "anxiety", kind: "abstract", position: [0.68, -1.28, -0.58], labelOffset: [0, -0.22, 0] },
  { word: "enchantment", kind: "abstract", position: [0.55, 0.08, 1.73], labelOffset: [0, 0.22, 0] },
  { word: "legitimacy", kind: "abstract", position: [1.7, 0.65, 0.05], labelOffset: [0, 0.22, 0] },
  { word: "devotion", kind: "abstract", position: [0.95, -0.78, 0.63], labelOffset: [0, -0.22, 0] },
  { word: "integrity", kind: "abstract", position: [1.15, 0.88, -1.08], labelOffset: [0, 0.22, 0] },
  { word: "divine right", kind: "abstract", position: [1.95, 1.45, 0.18], labelOffset: [0, 0.22, 0] },
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
  ...ABSTRACT_NODES,
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
  { from: "divine", to: "god", relation: "status" },
  { from: "divine", to: "goddess", relation: "status" },
  { from: "divine", to: "demigod", relation: "status" },
  { from: "divine", to: "demigoddess", relation: "status" },
  { from: "monarch", to: "anointed monarch", relation: "status" },
  { from: "monarch", to: "anointed queen", relation: "status" },
  { from: "monarch", to: "philosopher-monarch", relation: "status" },
  { from: "monarch", to: "philosopher-king", relation: "status" },
  { from: "monarch", to: "philosopher-queen", relation: "status" },
  { from: "sovereign", to: "absolute monarch", relation: "status" },
  { from: "monarch", to: "queen regnant", relation: "status" },

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
  { from: "animal", to: "fox", relation: "category" },
  { from: "animal", to: "shark", relation: "category" },
  { from: "animal", to: "tiger", relation: "category" },
  { from: "animal", to: "raven", relation: "category" },
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
  { from: "animal", to: "kit", relation: "category" },
  { from: "animal", to: "tigerfish", relation: "category" },
  { from: "animal", to: "owlet", relation: "category" },
  { from: "animal", to: "alpha wolf", relation: "category" },
  { from: "animal", to: "king cobra", relation: "category" },
  { from: "animal", to: "kingfish", relation: "category" },
  { from: "animal", to: "lion king", relation: "category" },
  { from: "animal", to: "imperial eagle", relation: "category" },
  { from: "mythic", to: "centaur", relation: "category" },
  { from: "mythic", to: "centauride", relation: "category" },
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
  { from: "mythic", to: "hippogriff", relation: "category" },
  { from: "mythic", to: "sphinx", relation: "category" },
  { from: "mythic", to: "Fenrir", relation: "category" },
  { from: "mythic", to: "alpha werewolf", relation: "category" },
  { from: "mythic", to: "Chiron", relation: "category" },
  { from: "mythic", to: "centaur queen", relation: "category" },
  { from: "mythic", to: "merman king", relation: "category" },
  { from: "mythic", to: "mermaid queen", relation: "category" },
  { from: "mythic", to: "harpy queen", relation: "category" },
  { from: "mythic", to: "pixie princess", relation: "category" },

  { from: "concept", to: "knowledge", relation: "category" },
  { from: "concept", to: "courage", relation: "category" },
  { from: "concept", to: "freedom", relation: "category" },
  { from: "concept", to: "order", relation: "category" },
  { from: "concept", to: "chaos", relation: "category" },
  { from: "concept", to: "memory", relation: "category" },
  { from: "concept", to: "time", relation: "category" },
  { from: "concept", to: "mystery", relation: "category" },
  { from: "concept", to: "justice", relation: "category" },
  { from: "concept", to: "truth", relation: "category" },
  { from: "concept", to: "beauty", relation: "category" },
  { from: "concept", to: "power", relation: "category" },
  { from: "concept", to: "hope", relation: "category" },
  { from: "concept", to: "fear", relation: "category" },
  { from: "concept", to: "love", relation: "category" },
  { from: "concept", to: "reason", relation: "category" },
  { from: "concept", to: "wisdom", relation: "category" },
  { from: "concept", to: "lionheart", relation: "category" },
  { from: "concept", to: "liberty", relation: "category" },
  { from: "concept", to: "chronology", relation: "category" },
  { from: "concept", to: "nostalgia", relation: "category" },
  { from: "concept", to: "scholar", relation: "category" },
  { from: "concept", to: "student", relation: "category" },
  { from: "concept", to: "oracle", relation: "category" },
  { from: "concept", to: "omniscience", relation: "category" },
  { from: "concept", to: "understanding", relation: "category" },
  { from: "concept", to: "compassion", relation: "category" },
  { from: "concept", to: "optimism", relation: "category" },
  { from: "concept", to: "logic", relation: "category" },
  { from: "concept", to: "sovereignty", relation: "category" },
  { from: "concept", to: "anxiety", relation: "category" },
  { from: "concept", to: "enchantment", relation: "category" },
  { from: "concept", to: "legitimacy", relation: "category" },
  { from: "concept", to: "devotion", relation: "category" },
  { from: "concept", to: "integrity", relation: "category" },
  { from: "concept", to: "divine right", relation: "category" },

  ...AUTHORED_RECIPES.flatMap(({ terms, result }) => terms.flatMap((term) =>
    SEMANTIC_NETWORK_NODES.some(({ word }) => word === term)
      ? [{ from: term as SemanticNetworkWord, to: result, relation: "blend" as const }]
      : [],
  )),
];

export const SEMANTIC_NETWORK_CONTEXT_WORDS = CONTEXT_NODES.map(({ word }) => word);
export const SEMANTIC_NETWORK_ANIMAL_WORDS = [
  "horse", "fish", "hummingbird", "lion", "eagle", "bird", "goat",
  "wolf", "bear", "owl", "snake", "deer", "cat", "dog", "fox", "shark", "tiger", "raven",
  "foal", "seahorse", "fry", "cub", "chick", "kid", "eaglet", "lionfish", "owlet", "alpha wolf",
  "king cobra", "kingfish", "lion king", "imperial eagle",
  "pup", "hatchling", "fawn", "kitten", "puppy", "catfish", "dogfish", "wolffish", "kit", "tigerfish",
] as const;
export const SEMANTIC_NETWORK_MYTHICAL_WORDS = [
  "centaur", "centauride", "merman", "mermaid", "harpy", "pixie", "werewolf",
  "griffin", "pegasus", "capricorn", "owlbear", "chimera", "unicorn", "phoenix", "hippogriff", "sphinx", "Fenrir",
  "Chiron", "alpha werewolf", "centaur queen", "merman king", "mermaid queen", "harpy queen", "pixie princess",
] as const;
export const SEMANTIC_NETWORK_ABSTRACT_WORDS = ABSTRACT_NODES
  .filter(({ kind }) => kind === "abstract")
  .map(({ word }) => word);

export type SemanticVector3 = readonly [number, number, number];

export type CompositionProjection = {
  components: readonly { label: CompositionTerm; vector: SemanticVector3 }[];
  location: SemanticVector3;
  result: CompositionResultWord | CompositionTerm | null;
  method: "direction" | "mean" | "single";
  resultKind: "exact" | "authored" | "nearest" | "none";
};

const NETWORK_POSITION_BY_WORD = new Map<SemanticNetworkWord, SemanticVector3>(
  SEMANTIC_NETWORK_NODES.map(({ word, position }) => [word, position]),
);

const DIRECTION_VECTORS: Readonly<Partial<Record<CompositionTerm, SemanticVector3>>> = {
  ordinary: [-1.5, 0, 0],
  royal: [1.5, 0, 0],
  young: [0, -1.15, 0],
  adult: [0, 1.15, 0],
  masculine: [0, 0, -1.15],
  feminine: [0, 0, 1.15],
};

function vectorForTerm(term: CompositionTerm): SemanticVector3 {
  return NETWORK_POSITION_BY_WORD.get(term as SemanticNetworkWord) ?? DIRECTION_VECTORS[term] ?? [0, 0, 0];
}

function meanVector(vectors: readonly SemanticVector3[]): SemanticVector3 {
  if (vectors.length === 0) return [0, 0, 0];
  const sum = vectors.reduce<[number, number, number]>(
    (total, vector) => [total[0] + vector[0], total[1] + vector[1], total[2] + vector[2]],
    [0, 0, 0],
  );
  return [sum[0] / vectors.length, sum[1] / vectors.length, sum[2] / vectors.length];
}

function nearestProjectedWord(
  location: SemanticVector3,
  excluded: readonly CompositionTerm[],
): CompositionResultWord | CompositionTerm | null {
  const excludedWords = new Set(excluded);
  const candidates = [...COMPOSITION_OUTPUT_ONLY_TERMS, ...COMPOSITION_STARTERS]
    .filter((word, index, words) => words.indexOf(word) === index)
    .filter((word) => !excludedWords.has(word as CompositionTerm))
    .flatMap((word) => {
      const position = NETWORK_POSITION_BY_WORD.get(word as SemanticNetworkWord);
      return position ? [{ word, position }] : [];
    });
  return candidates.reduce<{ word: CompositionResultWord | CompositionTerm; distance: number } | null>(
    (nearest, candidate) => {
      const distance = Math.hypot(
        candidate.position[0] - location[0],
        candidate.position[1] - location[1],
        candidate.position[2] - location[2],
      );
      return !nearest || distance < nearest.distance ? { word: candidate.word, distance } : nearest;
    },
    null,
  )?.word ?? null;
}

export function projectComposition3d(
  terms: readonly CompositionTerm[],
  composition: ResolvedTermComposition,
): CompositionProjection {
  if (terms.length === 0) {
    return { components: [], location: [0, 0, 0], result: null, method: "mean", resultKind: "none" };
  }

  if (!composition.recipe && composition.path.length > 1 && composition.semanticStart) {
    const components = terms.map((term, index) => {
      if (index === 0) return { label: term, vector: vectorForTerm(term) };
      const from = NETWORK_POSITION_BY_WORD.get(composition.path[index - 1] as SemanticNetworkWord);
      const to = NETWORK_POSITION_BY_WORD.get(composition.path[index] as SemanticNetworkWord);
      const vector: SemanticVector3 = from && to
        ? [to[0] - from[0], to[1] - from[1], to[2] - from[2]]
        : vectorForTerm(term);
      return { label: term, vector };
    });
    const result = composition.result;
    return {
      components,
      location: result ? vectorForTerm(result as CompositionTerm) : [0, 0, 0],
      result,
      method: "direction",
      resultKind: "exact",
    };
  }

  const components = terms.map((term) => ({ label: term, vector: vectorForTerm(term) }));
  const location = meanVector(components.map(({ vector }) => vector));
  if (composition.recipe && composition.result) {
    return { components, location, result: composition.result, method: "mean", resultKind: "authored" };
  }
  if (terms.length === 1) {
    return { components, location, result: composition.result ?? terms[0], method: "single", resultKind: "exact" };
  }
  const result = nearestProjectedWord(location, terms);
  return { components, location, result, method: "mean", resultKind: result ? "nearest" : "none" };
}

export function semanticEdgesForHighlights(
  highlightedWords: readonly SemanticNetworkWord[],
): readonly SemanticNetworkEdge[] {
  const highlighted = new Set(highlightedWords);
  return SEMANTIC_NETWORK_EDGES.filter(
    ({ from, to }) => highlighted.has(from) && highlighted.has(to),
  );
}
