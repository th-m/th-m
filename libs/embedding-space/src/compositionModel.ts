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
export type StatusWord = SemanticStatus | "noble" | "sovereign" | "legendary" | "divine";
export type AbstractWord =
  | "knowledge"
  | "courage"
  | "freedom"
  | "order"
  | "chaos"
  | "memory"
  | "time"
  | "mystery"
  | "justice"
  | "truth"
  | "beauty"
  | "power"
  | "hope"
  | "fear"
  | "love"
  | "reason";
export type AnimalWord =
  | "horse"
  | "fish"
  | "hummingbird"
  | "lion"
  | "eagle"
  | "bird"
  | "goat"
  | "wolf"
  | "bear"
  | "owl"
  | "snake"
  | "deer"
  | "cat"
  | "dog"
  | "fox"
  | "shark"
  | "tiger"
  | "raven";
export type MythicalWord =
  | "centaur"
  | "centauride"
  | "merman"
  | "mermaid"
  | "harpy"
  | "pixie"
  | "werewolf"
  | "griffin"
  | "pegasus"
  | "capricorn"
  | "owlbear"
  | "chimera"
  | "unicorn"
  | "phoenix"
  | "hippogriff"
  | "sphinx"
  | "Fenrir"
  | "Chiron"
  | "alpha werewolf"
  | "centaur queen"
  | "merman king"
  | "mermaid queen"
  | "harpy queen"
  | "pixie princess";
export type DerivedAnimalWord =
  | "foal"
  | "seahorse"
  | "fry"
  | "cub"
  | "chick"
  | "kid"
  | "eaglet"
  | "lionfish"
  | "pup"
  | "hatchling"
  | "fawn"
  | "kitten"
  | "puppy"
  | "owlet"
  | "alpha wolf"
  | "king cobra"
  | "kingfish"
  | "lion king"
  | "imperial eagle"
  | "catfish"
  | "dogfish"
  | "wolffish"
  | "kit"
  | "tigerfish";
export type StatusResultWord =
  | "lord"
  | "lady"
  | "emperor"
  | "empress"
  | "hero"
  | "heroine"
  | "prodigy"
  | "god"
  | "goddess"
  | "demigod"
  | "demigoddess"
  | "anointed monarch"
  | "anointed queen"
  | "philosopher-monarch"
  | "philosopher-king"
  | "philosopher-queen"
  | "absolute monarch"
  | "queen regnant";
export type AbstractResultWord =
  | "wisdom"
  | "lionheart"
  | "liberty"
  | "chronology"
  | "nostalgia"
  | "scholar"
  | "student"
  | "oracle"
  | "omniscience"
  | "understanding"
  | "compassion"
  | "optimism"
  | "logic"
  | "sovereignty"
  | "anxiety"
  | "enchantment"
  | "legitimacy"
  | "devotion"
  | "integrity"
  | "divine right";
export type SemanticDirection = SemanticStatus | SemanticAge | SemanticRole;
export type CuratedDerivedInputWord = "centaur";
export type CompositionTerm = SemanticWord | SemanticDirection | StatusWord | AnimalWord | AbstractWord | CuratedDerivedInputWord;
export type CompositionResultWord = SemanticWord | MythicalWord | DerivedAnimalWord | StatusResultWord | AbstractResultWord;
export type PairResultWord = MythicalWord | DerivedAnimalWord | StatusResultWord | AbstractResultWord;
export type PairInputTerm =
  | SemanticWord
  | AnimalWord
  | AbstractWord
  | "young"
  | "noble"
  | "sovereign"
  | "legendary"
  | "divine";
export type CompositionTermGroupId = "role" | "status" | "age" | "creature" | "abstract";

export type PairRecipe = {
  terms: readonly [PairInputTerm, PairInputTerm];
  result: PairResultWord;
};

export type CompositionRecipe = {
  terms: readonly [CompositionTerm, CompositionTerm, ...CompositionTerm[]];
  result: PairResultWord;
};

export type ResolvedTermComposition = {
  valid: boolean;
  result: CompositionResultWord | CompositionTerm | null;
  semanticStart: SemanticWord | null;
  moves: CompositionMove[];
  path: SemanticWord[];
  recipe: CompositionRecipe | null;
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

export const COMPOSITION_TERM_GROUPS = [
  {
    id: "role",
    label: "Role",
    terms: ["man", "woman", "boy", "girl", "masculine", "feminine"],
  },
  {
    id: "status",
    label: "Status",
    terms: ["royal", "noble", "sovereign", "legendary", "divine"],
  },
  {
    id: "age",
    label: "Age",
    terms: ["young", "adult"],
  },
  {
    id: "creature",
    label: "Creature",
    terms: [
      "horse",
      "fish",
      "hummingbird",
      "lion",
      "eagle",
      "bird",
      "goat",
      "wolf",
      "bear",
      "owl",
      "snake",
      "deer",
      "cat",
      "dog",
      "fox",
      "shark",
      "tiger",
      "raven",
      "centaur",
    ],
  },
  {
    id: "abstract",
    label: "Abstract",
    terms: [
      "knowledge", "courage", "freedom", "order", "chaos", "memory", "time", "mystery",
      "justice", "truth", "beauty", "power", "hope", "fear", "love", "reason",
    ],
  },
] as const satisfies readonly {
  id: CompositionTermGroupId;
  label: string;
  terms: readonly CompositionTerm[];
}[];

export const PAIR_RECIPES: readonly PairRecipe[] = [
  { terms: ["man", "horse"], result: "centaur" },
  { terms: ["woman", "horse"], result: "centauride" },
  { terms: ["man", "fish"], result: "merman" },
  { terms: ["woman", "fish"], result: "mermaid" },
  { terms: ["woman", "bird"], result: "harpy" },
  { terms: ["girl", "hummingbird"], result: "pixie" },
  { terms: ["man", "wolf"], result: "werewolf" },
  { terms: ["woman", "wolf"], result: "werewolf" },
  { terms: ["young", "horse"], result: "foal" },
  { terms: ["young", "fish"], result: "fry" },
  { terms: ["young", "lion"], result: "cub" },
  { terms: ["young", "bird"], result: "chick" },
  { terms: ["young", "goat"], result: "kid" },
  { terms: ["young", "eagle"], result: "eaglet" },
  { terms: ["young", "hummingbird"], result: "chick" },
  { terms: ["young", "wolf"], result: "pup" },
  { terms: ["young", "bear"], result: "cub" },
  { terms: ["young", "owl"], result: "owlet" },
  { terms: ["young", "snake"], result: "hatchling" },
  { terms: ["young", "deer"], result: "fawn" },
  { terms: ["young", "cat"], result: "kitten" },
  { terms: ["young", "dog"], result: "puppy" },
  { terms: ["young", "fox"], result: "kit" },
  { terms: ["young", "shark"], result: "pup" },
  { terms: ["young", "tiger"], result: "cub" },
  { terms: ["young", "raven"], result: "chick" },
  { terms: ["horse", "fish"], result: "seahorse" },
  { terms: ["lion", "fish"], result: "lionfish" },
  { terms: ["lion", "eagle"], result: "griffin" },
  { terms: ["horse", "bird"], result: "pegasus" },
  { terms: ["horse", "eagle"], result: "hippogriff" },
  { terms: ["goat", "fish"], result: "capricorn" },
  { terms: ["cat", "fish"], result: "catfish" },
  { terms: ["dog", "fish"], result: "dogfish" },
  { terms: ["wolf", "fish"], result: "wolffish" },
  { terms: ["tiger", "fish"], result: "tigerfish" },
  { terms: ["bear", "owl"], result: "owlbear" },
  { terms: ["lion", "goat"], result: "chimera" },
  { terms: ["man", "noble"], result: "lord" },
  { terms: ["woman", "noble"], result: "lady" },
  { terms: ["man", "sovereign"], result: "emperor" },
  { terms: ["woman", "sovereign"], result: "empress" },
  { terms: ["man", "legendary"], result: "hero" },
  { terms: ["woman", "legendary"], result: "heroine" },
  { terms: ["boy", "legendary"], result: "prodigy" },
  { terms: ["girl", "legendary"], result: "prodigy" },
  { terms: ["man", "divine"], result: "god" },
  { terms: ["woman", "divine"], result: "goddess" },
  { terms: ["boy", "divine"], result: "demigod" },
  { terms: ["girl", "divine"], result: "demigoddess" },
  { terms: ["legendary", "horse"], result: "unicorn" },
  { terms: ["legendary", "bird"], result: "phoenix" },
  { terms: ["knowledge", "time"], result: "wisdom" },
  { terms: ["courage", "lion"], result: "lionheart" },
  { terms: ["freedom", "bird"], result: "liberty" },
  { terms: ["order", "time"], result: "chronology" },
  { terms: ["memory", "time"], result: "nostalgia" },
  { terms: ["mystery", "cat"], result: "sphinx" },
  { terms: ["man", "knowledge"], result: "scholar" },
  { terms: ["woman", "knowledge"], result: "scholar" },
  { terms: ["young", "knowledge"], result: "student" },
  { terms: ["legendary", "knowledge"], result: "oracle" },
  { terms: ["divine", "knowledge"], result: "omniscience" },
  { terms: ["truth", "knowledge"], result: "understanding" },
  { terms: ["love", "courage"], result: "compassion" },
  { terms: ["hope", "freedom"], result: "optimism" },
  { terms: ["reason", "order"], result: "logic" },
  { terms: ["power", "sovereign"], result: "sovereignty" },
  { terms: ["fear", "time"], result: "anxiety" },
  { terms: ["beauty", "mystery"], result: "enchantment" },
  { terms: ["justice", "power"], result: "legitimacy" },
  { terms: ["love", "time"], result: "devotion" },
  { terms: ["truth", "courage"], result: "integrity" },
];

/**
 * Higher-order recipes preserve the established pair result while translating
 * status into language natural to that semantic family.
 */
export const CONTEXTUAL_RECIPES: readonly CompositionRecipe[] = [
  { terms: ["royal", "wolf"], result: "alpha wolf" },
  { terms: ["royal", "snake"], result: "king cobra" },
  { terms: ["royal", "fish"], result: "kingfish" },
  { terms: ["royal", "lion"], result: "lion king" },
  { terms: ["royal", "eagle"], result: "imperial eagle" },
  { terms: ["legendary", "wolf"], result: "Fenrir" },
  { terms: ["centaur", "royal"], result: "Chiron" },
  { terms: ["royal", "divine"], result: "divine right" },
  { terms: ["royal", "knowledge"], result: "philosopher-monarch" },
  { terms: ["royal", "power"], result: "sovereignty" },
  { terms: ["man", "royal", "divine"], result: "anointed monarch" },
  { terms: ["woman", "royal", "divine"], result: "anointed queen" },
  { terms: ["man", "royal", "knowledge"], result: "philosopher-king" },
  { terms: ["woman", "royal", "knowledge"], result: "philosopher-queen" },
  { terms: ["man", "royal", "power"], result: "absolute monarch" },
  { terms: ["woman", "royal", "power"], result: "queen regnant" },
  { terms: ["man", "royal", "wolf"], result: "alpha werewolf" },
  { terms: ["woman", "royal", "wolf"], result: "alpha werewolf" },
  { terms: ["man", "royal", "horse"], result: "Chiron" },
  { terms: ["woman", "royal", "horse"], result: "centaur queen" },
  { terms: ["man", "royal", "fish"], result: "merman king" },
  { terms: ["woman", "royal", "fish"], result: "mermaid queen" },
  { terms: ["woman", "royal", "bird"], result: "harpy queen" },
  { terms: ["girl", "royal", "hummingbird"], result: "pixie princess" },
];

export const AUTHORED_RECIPES: readonly CompositionRecipe[] = [
  ...PAIR_RECIPES,
  ...CONTEXTUAL_RECIPES,
];

/**
 * Curated result vocabulary that is intentionally absent from the controls.
 * These terms can still appear as equation results and highlighted 3D nodes,
 * but withholding them as ingredients keeps the dropdowns from recursively
 * expanding every derived endpoint into another family of recipes.
 */
export const COMPOSITION_STARTERS: readonly CompositionTerm[] = COMPOSITION_TERM_GROUPS.flatMap(
  ({ terms }) => terms,
);

export const COMPOSITION_OUTPUT_ONLY_TERMS: readonly CompositionResultWord[] = Array.from(new Set([
  "king",
  "queen",
  "prince",
  "princess",
  ...AUTHORED_RECIPES.map(({ result }) => result),
] satisfies CompositionResultWord[])).filter(
  (term) => !COMPOSITION_STARTERS.includes(term as CompositionTerm),
);

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

const AXIS_BY_DIRECTION: Readonly<Record<SemanticDirection, SemanticAxis>> = {
  ordinary: "status",
  royal: "status",
  young: "age",
  adult: "age",
  masculine: "role",
  feminine: "role",
};

function isSemanticWord(term: CompositionTerm): term is SemanticWord {
  return SEMANTIC_WORDS.includes(term as SemanticWord);
}

function isSemanticDirection(term: CompositionTerm): term is SemanticDirection {
  return term in AXIS_BY_DIRECTION;
}

function recipeFor(terms: readonly CompositionTerm[]) {
  if (terms.length < 2) return null;
  const selected = [...terms].sort();
  return AUTHORED_RECIPES.find((recipe) =>
    recipe.terms.length === terms.length
      && [...recipe.terms].sort().every((term, index) => term === selected[index]),
  ) ?? null;
}

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

export function resolveTermComposition(terms: readonly CompositionTerm[]): ResolvedTermComposition {
  if (terms.length === 0) {
    return { valid: true, result: null, semanticStart: null, moves: [], path: [], recipe: null };
  }

  const recipe = recipeFor(terms);
  if (recipe) {
    const semanticStart = terms.find(isSemanticWord) ?? null;
    return {
      valid: true,
      result: recipe.result,
      semanticStart,
      moves: [],
      path: semanticStart ? [semanticStart] : [],
      recipe,
    };
  }

  const semanticTerms = terms.filter(isSemanticWord);
  const directions = terms.filter(isSemanticDirection);
  if (semanticTerms.length === 1 && semanticTerms.length + directions.length === terms.length) {
    const semanticStart = semanticTerms[0];
    const moves: CompositionMove[] = [];
    let current = semanticStart;
    const usedAxes = new Set<SemanticAxis>();

    for (const direction of directions) {
      const axis = AXIS_BY_DIRECTION[direction];
      if (usedAxes.has(axis)) {
        return { valid: false, result: null, semanticStart, moves, path: [semanticStart], recipe: null };
      }
      const move = availableMove(current, axis);
      if (move.label !== direction) {
        return { valid: false, result: null, semanticStart, moves, path: [semanticStart], recipe: null };
      }
      usedAxes.add(axis);
      moves.push(move);
      current = applyMove(current, move);
    }

    const composition = compose(semanticStart, moves);
    return { valid: true, result: composition.result, semanticStart, moves, path: composition.path, recipe: null };
  }

  if (terms.length === 1) {
    return { valid: true, result: terms[0], semanticStart: null, moves: [], path: [], recipe: null };
  }

  // The fixed-slot explorer deliberately permits un-authored combinations.
  // They still compose into a projected location; they simply do not receive
  // a hand-authored lexical result from this small teaching vocabulary.
  return { valid: true, result: null, semanticStart: null, moves: [], path: [], recipe: null };
}

export function semanticPosition3d(word: SemanticWord): readonly [number, number, number] {
  const coordinate = WORD_COORDINATES[word];
  return [
    coordinate.status === "royal" ? 1.5 : -1.5,
    coordinate.age === "adult" ? 1.15 : -1.15,
    coordinate.role === "feminine" ? 1.15 : -1.15,
  ];
}
