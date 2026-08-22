import { describe, expect, it } from "vitest";
import { createTrainingState, trainingReducer } from "../src/state";

describe("training state", () => {
  it("advances through steps and stops at the end", () => {
    let state = createTrainingState("simple", true);
    state = trainingReducer(state, { type: "tick" });
    expect(state).toMatchObject({ stepIndex: 1, isPlaying: true });

    for (let index = 0; index < 10; index++) {
      state = trainingReducer(state, { type: "tick" });
    }
    expect(state.stepIndex).toBe(4);
    expect(state.isPlaying).toBe(false);
  });

  it("restarts from the beginning when toggled at the end", () => {
    let state = createTrainingState("simple", true);
    for (let index = 0; index < 10; index++) {
      state = trainingReducer(state, { type: "tick" });
    }
    state = trainingReducer(state, { type: "toggle-play" });
    expect(state).toMatchObject({ stepIndex: 0, isPlaying: true });
  });

  it("clamps stepping and switches modes", () => {
    let state = createTrainingState("model", false);
    state = trainingReducer(state, { type: "step-back" });
    expect(state.stepIndex).toBe(0);

    state = trainingReducer(state, { type: "select-mode", mode: "simple" });
    expect(state).toMatchObject({ mode: "simple", stepIndex: 0, isPlaying: false });

    state = trainingReducer(state, { type: "step-forward" });
    expect(state.stepIndex).toBe(1);

    state = trainingReducer(state, { type: "reset" });
    expect(state.stepIndex).toBe(0);
  });
});
