import { trainingSteps, type TrainingMode } from "./model";

export interface TrainingState {
  mode: TrainingMode;
  stepIndex: number;
  isPlaying: boolean;
}

export type TrainingAction =
  | { type: "toggle-play" }
  | { type: "play" }
  | { type: "pause" }
  | { type: "tick" }
  | { type: "step-forward" }
  | { type: "step-back" }
  | { type: "reset" }
  | { type: "select-mode"; mode: TrainingMode };

export function createTrainingState(mode: TrainingMode = "simple", autoplay = false): TrainingState {
  return { mode, stepIndex: 0, isPlaying: autoplay };
}

function stepCount(state: TrainingState): number {
  return trainingSteps(state.mode).length;
}

export function trainingReducer(
  state: TrainingState,
  action: TrainingAction,
): TrainingState {
  switch (action.type) {
    case "toggle-play":
      if (state.isPlaying) return { ...state, isPlaying: false };
      if (state.stepIndex >= stepCount(state) - 1) {
        return { ...state, stepIndex: 0, isPlaying: true };
      }
      return { ...state, isPlaying: true };
    case "play":
      return state.isPlaying ? state : trainingReducer(state, { type: "toggle-play" });
    case "pause":
      return state.isPlaying ? { ...state, isPlaying: false } : state;
    case "tick": {
      if (!state.isPlaying) return state;
      if (state.stepIndex >= stepCount(state) - 1) return { ...state, isPlaying: false };
      return { ...state, stepIndex: state.stepIndex + 1 };
    }
    case "step-forward":
      if (state.stepIndex >= stepCount(state) - 1) return { ...state, isPlaying: false };
      return { ...state, stepIndex: state.stepIndex + 1, isPlaying: false };
    case "step-back":
      if (state.stepIndex <= 0) return { ...state, isPlaying: false };
      return { ...state, stepIndex: state.stepIndex - 1, isPlaying: false };
    case "reset":
      return { ...state, stepIndex: 0, isPlaying: false };
    case "select-mode":
      return state.mode === action.mode
        ? state
        : { mode: action.mode, stepIndex: 0, isPlaying: false };
  }
}
