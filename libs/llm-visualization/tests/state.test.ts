import { describe, expect, it } from "vitest";
import { visualizationStages } from "../src/model";
import { createVisualizationState, visualizationReducer } from "../src/state";

describe("visualization state", () => {
  it("steps, pauses, and resets to the configured starting point", () => {
    let state = createVisualizationState("attention", undefined, true);
    expect(state).toMatchObject({ stageIndex: 2, view: "attention", isPlaying: true });

    state = visualizationReducer(state, { type: "tick" });
    expect(state).toMatchObject({ stageIndex: 3, view: "attention", isPlaying: true });

    state = visualizationReducer(state, { type: "previous" });
    expect(state).toMatchObject({ stageIndex: 2, isPlaying: false });

    state = visualizationReducer(state, { type: "select-view", view: "feed-forward" });
    expect(state).toMatchObject({ view: "feed-forward", isPlaying: false });

    state = visualizationReducer(state, { type: "reset" });
    expect(state).toMatchObject({ stageIndex: 2, view: "attention", isPlaying: false });
  });

  it("clamps manual stepping and stops autoplay after the final stage", () => {
    let state = createVisualizationState("feedback", undefined, true);
    state = visualizationReducer(state, { type: "tick" });
    expect(state).toMatchObject({ stageIndex: visualizationStages.length - 1, isPlaying: false });

    state = visualizationReducer(state, { type: "next" });
    expect(state.stageIndex).toBe(visualizationStages.length - 1);

    state = visualizationReducer(state, { type: "toggle-play" });
    expect(state).toMatchObject({ stageIndex: 0, view: "pipeline", isPlaying: true });
  });
});
