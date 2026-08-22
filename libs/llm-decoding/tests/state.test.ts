import { describe, expect, it } from "vitest";
import { createDecodingState, decodingReducer } from "../src/state";

describe("decoding state", () => {
  it("clamps strategy, parameters, and draw transitions", () => {
    let state = createDecodingState("greedy");
    expect(state).toMatchObject({ strategy: "greedy", draw: 0 });

    state = decodingReducer(state, { type: "select-strategy", strategy: "top-p" });
    expect(state.strategy).toBe("top-p");

    state = decodingReducer(state, { type: "set-topP", topP: 9 });
    expect(state.topP).toBe(1);

    state = decodingReducer(state, { type: "set-temperature", temperature: 0.05 });
    expect(state.temperature).toBe(0.1);

    state = decodingReducer(state, { type: "next-draw" });
    expect(state.draw).toBe(1);
  });

  it("reset restores defaults while keeping the strategy", () => {
    let state = createDecodingState("top-k");
    state = decodingReducer(state, { type: "set-topK", topK: 6 });
    state = decodingReducer(state, { type: "next-draw" });
    state = decodingReducer(state, { type: "reset" });
    expect(state).toMatchObject({ strategy: "top-k", topK: 3, draw: 0 });
  });

  it("ignores unknown strategies", () => {
    const state = createDecodingState("greedy");
    const next = decodingReducer(state, { type: "select-strategy", strategy: "greedy" });
    expect(next.strategy).toBe("greedy");
  });
});
