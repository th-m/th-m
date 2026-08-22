import {
  decodingLimits,
  decodingStrategies,
  type DecodingStrategy,
} from "./model";

export interface DecodingState {
  strategy: DecodingStrategy;
  temperature: number;
  topK: number;
  topP: number;
  /** Deterministic sample draw; incrementing changes the illustrative outcome. */
  draw: number;
}

export type DecodingAction =
  | { type: "select-strategy"; strategy: DecodingStrategy }
  | { type: "set-temperature"; temperature: number }
  | { type: "set-topK"; topK: number }
  | { type: "set-topP"; topP: number }
  | { type: "next-draw" }
  | { type: "reset" };

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function createDecodingState(strategy: DecodingStrategy = "greedy"): DecodingState {
  return {
    strategy: decodingStrategies.includes(strategy) ? strategy : "greedy",
    temperature: decodingLimits.temperature.default,
    topK: decodingLimits.topK.default,
    topP: decodingLimits.topP.default,
    draw: 0,
  };
}

export function decodingReducer(
  state: DecodingState,
  action: DecodingAction,
): DecodingState {
  switch (action.type) {
    case "select-strategy":
      return {
        ...state,
        strategy: decodingStrategies.includes(action.strategy) ? action.strategy : state.strategy,
      };
    case "set-temperature":
      return {
        ...state,
        temperature: clamp(action.temperature, decodingLimits.temperature.min, decodingLimits.temperature.max),
      };
    case "set-topK":
      return {
        ...state,
        topK: Math.round(clamp(action.topK, decodingLimits.topK.min, decodingLimits.topK.max)),
      };
    case "set-topP":
      return {
        ...state,
        topP: Math.round(clamp(action.topP, decodingLimits.topP.min, decodingLimits.topP.max) * 20) / 20,
      };
    case "next-draw":
      return { ...state, draw: state.draw + 1 };
    case "reset":
      return createDecodingState(state.strategy);
  }
}
