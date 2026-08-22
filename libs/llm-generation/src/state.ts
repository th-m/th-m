import {
  generationExamples,
  generationStages,
  type GenerationExample,
} from "./model";

export interface GenerationState {
  exampleIndex: number;
  /** Index into the active example's generated `steps`. */
  tokenIndex: number;
  /** Index into `generationStages`. */
  stageIndex: number;
  isPlaying: boolean;
  /** Autoplay interval per stage, in milliseconds. */
  speedMs: number;
}

export type GenerationAction =
  | { type: "toggle-play" }
  | { type: "play" }
  | { type: "pause" }
  | { type: "tick" }
  | { type: "step-forward" }
  | { type: "step-back" }
  | { type: "next-token" }
  | { type: "previous-token" }
  | { type: "skip-to-end" }
  | { type: "reset" }
  | { type: "select-example"; exampleIndex: number }
  | { type: "set-speed"; speedMs: number };

export const defaultGenerationSpeedMs = 1_000;
const minSpeedMs = 250;
const maxSpeedMs = 2_400;

function clampExampleIndex(index: number): number {
  return Math.max(0, Math.min(generationExamples.length - 1, index));
}

function clampTokenIndex(example: GenerationExample, index: number): number {
  return Math.max(0, Math.min(example.steps.length - 1, index));
}

function clampSpeed(speedMs: number): number {
  return Math.max(minSpeedMs, Math.min(maxSpeedMs, Math.round(speedMs)));
}

export function createGenerationState(
  initialExampleIndex = 0,
  autoplay = false,
  speedMs = defaultGenerationSpeedMs,
): GenerationState {
  return {
    exampleIndex: clampExampleIndex(initialExampleIndex),
    tokenIndex: 0,
    stageIndex: 0,
    isPlaying: autoplay,
    speedMs: clampSpeed(speedMs),
  };
}

export function activeExample(state: GenerationState): GenerationExample {
  return generationExamples[clampExampleIndex(state.exampleIndex)];
}

/** True when playback sits on the final stage of the final generated token. */
export function isAtEnd(state: GenerationState): boolean {
  const example = activeExample(state);
  return (
    state.tokenIndex >= example.steps.length - 1 &&
    state.stageIndex >= generationStages.length - 1
  );
}

/** Advance one stage, crossing into the next token when the stage list ends. */
function advanceOneStage(state: GenerationState): GenerationState {
  const example = activeExample(state);
  if (state.stageIndex < generationStages.length - 1) {
    return { ...state, stageIndex: state.stageIndex + 1 };
  }
  if (state.tokenIndex < example.steps.length - 1) {
    return { ...state, tokenIndex: state.tokenIndex + 1, stageIndex: 0 };
  }
  return { ...state, isPlaying: false };
}

/** Move back one stage, crossing into the previous token's final stage. */
function retreatOneStage(state: GenerationState): GenerationState {
  if (state.stageIndex > 0) {
    return { ...state, stageIndex: state.stageIndex - 1 };
  }
  if (state.tokenIndex > 0) {
    return {
      ...state,
      tokenIndex: state.tokenIndex - 1,
      stageIndex: generationStages.length - 1,
    };
  }
  return state;
}

export function generationReducer(
  state: GenerationState,
  action: GenerationAction,
): GenerationState {
  switch (action.type) {
    case "toggle-play":
      if (state.isPlaying) return { ...state, isPlaying: false };
      if (isAtEnd(state)) {
        return { ...state, tokenIndex: 0, stageIndex: 0, isPlaying: true };
      }
      return { ...state, isPlaying: true };
    case "play":
      return state.isPlaying ? state : generationReducer(state, { type: "toggle-play" });
    case "pause":
      return state.isPlaying ? { ...state, isPlaying: false } : state;
    case "tick": {
      if (!state.isPlaying) return state;
      const advanced = advanceOneStage(state);
      return isAtEnd(advanced) ? { ...advanced, isPlaying: false } : advanced;
    }
    case "step-forward":
      return { ...advanceOneStage(state), isPlaying: false };
    case "step-back":
      return { ...retreatOneStage(state), isPlaying: false };
    case "next-token": {
      const example = activeExample(state);
      if (state.tokenIndex >= example.steps.length - 1) return { ...state, isPlaying: false };
      return { ...state, tokenIndex: state.tokenIndex + 1, stageIndex: 0, isPlaying: false };
    }
    case "previous-token": {
      if (state.tokenIndex <= 0) return { ...state, isPlaying: false };
      return { ...state, tokenIndex: state.tokenIndex - 1, stageIndex: 0, isPlaying: false };
    }
    case "skip-to-end": {
      const example = activeExample(state);
      return {
        ...state,
        tokenIndex: example.steps.length - 1,
        stageIndex: generationStages.length - 1,
        isPlaying: false,
      };
    }
    case "reset":
      return { ...state, tokenIndex: 0, stageIndex: 0, isPlaying: false };
    case "select-example": {
      const exampleIndex = clampExampleIndex(action.exampleIndex);
      return {
        ...state,
        exampleIndex,
        tokenIndex: 0,
        stageIndex: 0,
        isPlaying: false,
      };
    }
    case "set-speed":
      return { ...state, speedMs: clampSpeed(action.speedMs) };
  }
}
