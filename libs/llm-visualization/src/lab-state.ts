import {
  transformerLabPhases,
  type TransformerLabPhase,
} from "./lab-model";

export interface TransformerLabState {
  phaseIndex: number;
  isPlaying: boolean;
  initialPhaseIndex: number;
}

export type TransformerLabAction =
  | { type: "next" | "previous" | "tick" | "toggle-play" | "stop" | "reset" }
  | { type: "select-phase"; phaseIndex: number };

function clampPhase(index: number): number {
  return Math.min(transformerLabPhases.length - 1, Math.max(0, index));
}

export function createTransformerLabState(initialPhase: TransformerLabPhase = "tokenize", autoplay = false): TransformerLabState {
  const phaseIndex = Math.max(0, transformerLabPhases.indexOf(initialPhase));
  return { phaseIndex, isPlaying: autoplay, initialPhaseIndex: phaseIndex };
}

export function transformerLabReducer(state: TransformerLabState, action: TransformerLabAction): TransformerLabState {
  switch (action.type) {
    case "next":
      return { ...state, phaseIndex: clampPhase(state.phaseIndex + 1), isPlaying: false };
    case "previous":
      return { ...state, phaseIndex: clampPhase(state.phaseIndex - 1), isPlaying: false };
    case "select-phase":
      return { ...state, phaseIndex: clampPhase(action.phaseIndex), isPlaying: false };
    case "stop":
      return { ...state, isPlaying: false };
    case "reset":
      return { ...state, phaseIndex: state.initialPhaseIndex, isPlaying: false };
    case "toggle-play":
      return state.isPlaying
        ? { ...state, isPlaying: false }
        : {
            ...state,
            phaseIndex: state.phaseIndex === transformerLabPhases.length - 1 ? 0 : state.phaseIndex,
            isPlaying: true,
          };
    case "tick":
      if (state.phaseIndex >= transformerLabPhases.length - 1) return { ...state, isPlaying: false };
      return { ...state, phaseIndex: state.phaseIndex + 1 };
  }
}
