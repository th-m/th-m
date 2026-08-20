import {
  stageIndex,
  visualizationStages,
  type VisualizationStageId,
  type VisualizationView,
} from "./model";

export interface VisualizationState {
  stageIndex: number;
  view: VisualizationView;
  isPlaying: boolean;
  initialStageIndex: number;
  initialView: VisualizationView;
}

export type VisualizationAction =
  | { type: "previous" }
  | { type: "next" }
  | { type: "tick" }
  | { type: "toggle-play" }
  | { type: "reset" }
  | { type: "select-stage"; stageIndex: number }
  | { type: "select-view"; view: VisualizationView }
  | { type: "stop" };

function stageView(index: number): VisualizationView {
  return visualizationStages[index]?.view ?? visualizationStages[0].view;
}

function move(state: VisualizationState, requestedIndex: number, keepPlaying = false): VisualizationState {
  const nextIndex = Math.max(0, Math.min(visualizationStages.length - 1, requestedIndex));
  return {
    ...state,
    stageIndex: nextIndex,
    view: stageView(nextIndex),
    isPlaying: keepPlaying ? state.isPlaying : false,
  };
}

export function createVisualizationState(
  initialStage: VisualizationStageId = visualizationStages[0].id,
  initialView?: VisualizationView,
  autoplay = false,
): VisualizationState {
  const requestedIndex = stageIndex(initialStage);
  const initialStageIndex = requestedIndex < 0 ? 0 : requestedIndex;
  const view = initialView ?? stageView(initialStageIndex);
  return { stageIndex: initialStageIndex, view, isPlaying: autoplay, initialStageIndex, initialView: view };
}

export function visualizationReducer(state: VisualizationState, action: VisualizationAction): VisualizationState {
  switch (action.type) {
    case "previous":
      return move(state, state.stageIndex - 1);
    case "next":
      return move(state, state.stageIndex + 1);
    case "tick": {
      if (!state.isPlaying) return state;
      if (state.stageIndex >= visualizationStages.length - 1) return { ...state, isPlaying: false };
      return move(state, state.stageIndex + 1, true);
    }
    case "toggle-play":
      if (state.isPlaying) return { ...state, isPlaying: false };
      if (state.stageIndex >= visualizationStages.length - 1) {
        return { ...state, stageIndex: 0, view: stageView(0), isPlaying: true };
      }
      return { ...state, isPlaying: true };
    case "reset":
      return {
        ...state,
        stageIndex: state.initialStageIndex,
        view: state.initialView,
        isPlaying: false,
      };
    case "select-stage":
      return move(state, action.stageIndex);
    case "select-view":
      return { ...state, view: action.view, isPlaying: false };
    case "stop":
      return state.isPlaying ? { ...state, isPlaying: false } : state;
  }
}

