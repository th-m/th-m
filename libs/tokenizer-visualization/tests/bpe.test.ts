import { describe, expect, it } from "vitest";
import {
  applyBpeMerges,
  countBpePreTokens,
  mergeBpePair,
  splitBpePreTokens,
  trainBpeText,
} from "../src";

describe("from-scratch BPE training", () => {
  it("weights repeated pre-tokens and learns deterministic merge rules", () => {
    const training = trainBpeText("cat cat car", 8);

    expect(training.merges[0]).toMatchObject({
      step: 1,
      pair: ["c", "a"],
      frequency: 3,
      token: "ca",
      tokenCount: 8,
    });
    expect(training.merges.map((merge) => merge.token)).toEqual(["ca", "cat", "car"]);
    expect(training.finalTokens).toEqual(["cat", " ", "cat", " ", "car"]);
    expect(training.exhausted).toBe(true);
  });

  it("replays any prefix of the learned merge timeline without crossing pre-token boundaries", () => {
    const training = trainBpeText("cat cat car", 8);

    expect(applyBpeMerges(training.text, training.merges, 0).join("")).toBe(training.text);
    expect(applyBpeMerges(training.text, training.merges, 1)).toEqual([
      "ca", "t", " ", "ca", "t", " ", "ca", "r",
    ]);
    expect(applyBpeMerges(training.text, training.merges).join("")).toBe(training.text);
  });

  it("resolves equal-frequency pairs by stable corpus order", () => {
    expect(trainBpeText("ab ac", 1).merges[0]?.pair).toEqual(["a", "b"]);
    expect(trainBpeText("ab ac", 1)).toEqual(trainBpeText("ab ac", 1));
  });
});

describe("BPE primitives and edge cases", () => {
  it("merges non-overlapping pairs", () => {
    expect(mergeBpePair(["a", "a", "a"], ["a", "a"])).toEqual(["aa", "a"]);
  });

  it("pre-tokenizes Unicode letters, punctuation, spaces, and newlines losslessly", () => {
    const input = "Café 👩🏽‍💻 你好\nCafé";
    const training = trainBpeText(input, 32);

    expect(splitBpePreTokens(input).join("")).toBe(input);
    expect(countBpePreTokens(input).get("Café")).toBe(2);
    expect(training.finalTokens.join("")).toBe(input);
    expect(training.merges.some((merge) => merge.token === "你好")).toBe(true);
  });

  it("returns a complete empty training state", () => {
    expect(trainBpeText("")).toMatchObject({
      preTokens: [],
      initialTokens: [],
      vocabulary: [],
      merges: [],
      finalTokens: [],
      exhausted: true,
    });
  });
});
