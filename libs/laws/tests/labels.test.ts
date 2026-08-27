import { describe, expect, it } from "vitest";
import { lawLabelAbbreviations } from "../src/labels";
import { lawLabels } from "../src/types";

describe("law label abbreviations", () => {
  it("provides a unique abbreviation of at most three characters for every label", () => {
    expect(Object.keys(lawLabelAbbreviations)).toEqual([...lawLabels]);

    const abbreviations = Object.values(lawLabelAbbreviations);
    expect(new Set(abbreviations).size).toBe(abbreviations.length);
    for (const abbreviation of abbreviations) {
      expect(abbreviation).toMatch(/^[A-Z]{2,3}$/);
    }
  });
});
