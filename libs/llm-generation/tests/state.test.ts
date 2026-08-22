import { describe, expect, it } from "vitest";
import { generationExamples, generationStages } from "../src/model";
import {
  activeExample,
  createGenerationState,
  generationReducer,
  isAtEnd,
} from "../src/state";

describe("generation playback state", () => {
  it("starts at the beginning of the selected example", () => {
    const state = createGenerationState(1, false);
    expect(state).toMatchObject({ exampleIndex: 1, tokenIndex: 0, stageIndex: 0, isPlaying: false });
    expect(activeExample(state).id).toBe("planet");
  });

  it("advances through stages and crosses into the next token", () => {
    let state = createGenerationState(0, true);
    state = generationReducer(state, { type: "tick" });
    expect(state).toMatchObject({ tokenIndex: 0, stageIndex: 1, isPlaying: true });

    for (let i = 0; i < generationStages.length - 1; i++) {
      state = generationReducer(state, { type: "tick" });
    }
    expect(state).toMatchObject({ tokenIndex: 1, stageIndex: 0, isPlaying: true });
  });

  it("stops autoplay after the final token", () => {
    let state = createGenerationState(0, true);
    const example = activeExample(state);
    // Skip to the final token, then tick through every remaining stage.
    state = generationReducer(state, { type: "skip-to-end" });
    expect(isAtEnd(state)).toBe(true);
    expect(state.isPlaying).toBe(false);

    state = generationReducer(state, { type: "toggle-play" });
    expect(state).toMatchObject({ tokenIndex: 0, stageIndex: 0, isPlaying: true });
    state = generationReducer(state, { type: "tick" });
    expect(state.tokenIndex).toBe(0);
    expect(example.steps.length).toBeGreaterThan(0);
  });

  it("next-token jumps to the start of the following token", () => {
    let state = createGenerationState(0, true);
    state = generationReducer(state, { type: "next-token" });
    expect(state).toMatchObject({ tokenIndex: 1, stageIndex: 0, isPlaying: false });
  });

  it("step-back crosses into the previous token's final stage", () => {
    let state = createGenerationState(0, false);
    state = generationReducer(state, { type: "next-token" });
    state = generationReducer(state, { type: "step-back" });
    expect(state).toMatchObject({ tokenIndex: 0, stageIndex: generationStages.length - 1 });
  });

  it("reset returns to the start and selects examples deterministically", () => {
    let state = createGenerationState(0, true);
    state = generationReducer(state, { type: "select-example", exampleIndex: 99 });
    expect(state.exampleIndex).toBe(generationExamples.length - 1); // clamped to the last example

    state = generationReducer(state, { type: "skip-to-end" });
    state = generationReducer(state, { type: "reset" });
    expect(state).toMatchObject({
      exampleIndex: generationExamples.length - 1,
      tokenIndex: 0,
      stageIndex: 0,
      isPlaying: false,
    });

    state = generationReducer(state, { type: "set-speed", speedMs: 10_000 });
    expect(state.speedMs).toBeLessThanOrEqual(2_400);
  });
});
