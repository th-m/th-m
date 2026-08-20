import { accentPalette } from "@th-m/design-theme";
import { describe, expect, it } from "vitest";
import {
  TOKENIZER_ENCODING,
  assignTextTokenAccents,
  assignTokenAccents,
  describeTokenText,
  reconstructTokenBytes,
  tokenizeText,
} from "../src";

const textDecoder = new TextDecoder();

describe("o200k tokenizer mapping", () => {
  it("maps a stable reference string to its token IDs and exact bytes", () => {
    const tokens = tokenizeText("Hello, world!");

    expect(TOKENIZER_ENCODING).toBe("o200k_base");
    expect(tokens.map((token) => token.id)).toEqual([13225, 11, 2375, 0]);
    expect(tokens.map((token) => token.text)).toEqual(["Hello", ",", " world", "!"]);
    expect(textDecoder.decode(reconstructTokenBytes(tokens))).toBe("Hello, world!");
  });

  it("treats special-token-looking text as ordinary user text", () => {
    const input = "literal <|endoftext|> punctuation";
    expect(textDecoder.decode(reconstructTokenBytes(tokenizeText(input)))).toBe(input);
  });
});

describe("deterministic adjacent accent assignment", () => {
  it("is stable and never repeats the immediate accent", () => {
    const ids = [42, 42, 42, 17, 17, 999, 42, 17];
    const first = assignTokenAccents(ids);
    const second = assignTokenAccents(ids);

    expect(first).toEqual(second);
    expect(first.every((accent) => accentPalette.some((candidate) => candidate.name === accent.name))).toBe(true);
    for (let index = 1; index < first.length; index += 1) {
      expect(first[index]!.index).not.toBe(first[index - 1]!.index);
    }
  });

  it("also separates repeated learned BPE pieces", () => {
    const tokens = ["the", " ", "the", " ", "the"];
    const first = assignTextTokenAccents(tokens);

    expect(first).toEqual(assignTextTokenAccents(tokens));
    for (let index = 1; index < first.length; index += 1) {
      expect(first[index]!.index).not.toBe(first[index - 1]!.index);
    }
  });
});

describe("visible token content", () => {
  it("preserves spaces, tabs, and newlines while providing intelligible markers", () => {
    const input = "one  two\n\tthree";
    const tokens = tokenizeText(input);
    const displayKinds = tokens.flatMap((token) => token.display.map((part) => part.kind));

    expect(displayKinds).toContain("space");
    expect(displayKinds).toContain("line-break");
    expect(displayKinds).toContain("tab");
    expect(textDecoder.decode(reconstructTokenBytes(tokens))).toBe(input);
  });

  it("labels incomplete UTF-8 pieces by their bytes instead of inventing text", () => {
    expect(describeTokenText(null, [0xf0, 0x9f])).toEqual([
      { kind: "bytes", value: "F0 9F", label: "UTF-8 byte fragment F0 9F" },
    ]);
  });
});

describe("Unicode and empty input", () => {
  it("reconstructs emoji, modifiers, joiners, and non-Latin text exactly", () => {
    const input = "Café 👩🏽‍💻 你好";
    const tokens = tokenizeText(input);

    expect(textDecoder.decode(reconstructTokenBytes(tokens))).toBe(input);
    expect(tokens.some((token) => token.text === null)).toBe(true);
    expect(tokens.filter((token) => token.text === null).every((token) => token.display[0]?.kind === "bytes")).toBe(true);
  });

  it("returns no tokens for empty input", () => {
    expect(tokenizeText("")).toEqual([]);
  });
});
