export const SEMANTIC_AXES = ["status", "age", "role"] as const;

export type SemanticAxis = (typeof SEMANTIC_AXES)[number];
export type SemanticWord =
  | "man"
  | "woman"
  | "boy"
  | "girl"
  | "king"
  | "queen"
  | "prince"
  | "princess";
export type SemanticStatus = "ordinary" | "royal";
export type SemanticAge = "young" | "adult";
export type SemanticRole = "masculine" | "feminine";
export type AnimalWord = "horse" | "fish" | "hummingbird";
export type MythicalWord = "centaur" | "mermaid" | "pixie";

export type HybridRecipe = {
  base: SemanticWord;
  animal: AnimalWord;
  result: MythicalWord;
};

export type SemanticCoordinate = {
  status: SemanticStatus;
  age: SemanticAge;
  role: SemanticRole;
};

export type CompositionMove = {
  axis: SemanticAxis;
  label: SemanticStatus | SemanticAge | SemanticRole;
};

export type CompositionState = {
  result: SemanticWord;
  path: SemanticWord[];
};

export type CompositionSceneControls = {
  rotate: (horizontal: number, vertical: number) => void;
  reset: () => void;
};

export const SEMANTIC_WORDS: readonly SemanticWord[] = [
  "man",
  "woman",
  "boy",
  "girl",
  "king",
  "queen",
  "prince",
  "princess",
];

export const HYBRID_RECIPES: readonly HybridRecipe[] = [
  { base: "man", animal: "horse", result: "centaur" },
  { base: "woman", animal: "fish", result: "mermaid" },
  { base: "girl", animal: "hummingbird", result: "pixie" },
];

export const WORD_COORDINATES: Readonly<Record<SemanticWord, SemanticCoordinate>> = {
  man: { status: "ordinary", age: "adult", role: "masculine" },
  woman: { status: "ordinary", age: "adult", role: "feminine" },
  boy: { status: "ordinary", age: "young", role: "masculine" },
  girl: { status: "ordinary", age: "young", role: "feminine" },
  king: { status: "royal", age: "adult", role: "masculine" },
  queen: { status: "royal", age: "adult", role: "feminine" },
  prince: { status: "royal", age: "young", role: "masculine" },
  princess: { status: "royal", age: "young", role: "feminine" },
};

const coordinateKey = ({ status, age, role }: SemanticCoordinate) => `${status}:${age}:${role}`;
const WORD_BY_COORDINATE = Object.fromEntries(
  SEMANTIC_WORDS.map((word) => [coordinateKey(WORD_COORDINATES[word]), word]),
) as Record<string, SemanticWord>;

const OPPOSITES = {
  ordinary: "royal",
  royal: "ordinary",
  young: "adult",
  adult: "young",
  masculine: "feminine",
  feminine: "masculine",
} as const;

export function availableMove(word: SemanticWord, axis: SemanticAxis): CompositionMove {
  const coordinate = WORD_COORDINATES[word];
  return { axis, label: OPPOSITES[coordinate[axis]] } as CompositionMove;
}

export function applyMove(word: SemanticWord, move: CompositionMove): SemanticWord {
  const coordinate = WORD_COORDINATES[word];
  const expected = OPPOSITES[coordinate[move.axis]];
  if (move.label !== expected) {
    throw new Error(`The ${move.axis} move from ${word} must point toward ${expected}.`);
  }

  const next = { ...coordinate, [move.axis]: move.label } as SemanticCoordinate;
  const result = WORD_BY_COORDINATE[coordinateKey(next)];
  if (!result) throw new Error(`No teaching term occupies ${coordinateKey(next)}.`);
  return result;
}

export function compose(start: SemanticWord, moves: readonly CompositionMove[]): CompositionState {
  const usedAxes = new Set<SemanticAxis>();
  const path: SemanticWord[] = [start];
  let result = start;

  for (const move of moves) {
    if (usedAxes.has(move.axis)) throw new Error(`The ${move.axis} axis can only be used once per composition.`);
    usedAxes.add(move.axis);
    result = applyMove(result, move);
    path.push(result);
  }

  return { result, path };
}

export function semanticPosition3d(word: SemanticWord): readonly [number, number, number] {
  const coordinate = WORD_COORDINATES[word];
  return [
    coordinate.status === "royal" ? 1.5 : -1.5,
    coordinate.age === "adult" ? 1.15 : -1.15,
    coordinate.role === "feminine" ? 1.15 : -1.15,
  ];
}
