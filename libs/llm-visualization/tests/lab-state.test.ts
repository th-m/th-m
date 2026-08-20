import { describe, expect, it } from "vitest";
import { transformerLabPhases } from "../src/lab-model";
import { createTransformerLabState, transformerLabReducer } from "../src/lab-state";

describe("transformer lab state", () => {
  it("steps, pauses, selects, and resets to its configured phase", () => {
    let state = createTransformerLabState("forward", true);
    expect(state).toMatchObject({ phaseIndex: 2, isPlaying: true });

    state = transformerLabReducer(state, { type: "tick" });
    expect(state).toMatchObject({ phaseIndex: 3, isPlaying: true });

    state = transformerLabReducer(state, { type: "previous" });
    expect(state).toMatchObject({ phaseIndex: 2, isPlaying: false });

    state = transformerLabReducer(state, { type: "select-phase", phaseIndex: 5 });
    expect(state).toMatchObject({ phaseIndex: 5, isPlaying: false });

    state = transformerLabReducer(state, { type: "reset" });
    expect(state).toMatchObject({ phaseIndex: 2, isPlaying: false });
  });

  it("clamps manual stepping and stops playback at the last phase", () => {
    let state = createTransformerLabState("sample", true);
    state = transformerLabReducer(state, { type: "tick" });
    expect(state).toMatchObject({ phaseIndex: transformerLabPhases.length - 1, isPlaying: false });

    state = transformerLabReducer(state, { type: "toggle-play" });
    expect(state).toMatchObject({ phaseIndex: 0, isPlaying: true });
  });
});
