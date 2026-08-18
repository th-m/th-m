import { describe, expect, it } from "vitest";
import { thomToolFoundation } from "./index";

describe("thomToolFoundation", () => {
  it("exposes complete color, typography, and effect contracts", () => {
    expect(Object.keys(thomToolFoundation.color).sort()).toEqual([
      "background",
      "danger",
      "gold",
      "highlight",
      "ivory",
      "line",
      "muted",
      "surface",
      "surfaceRaised",
    ]);
    expect(thomToolFoundation.typography.display).toContain("Newsreader");
    expect(thomToolFoundation.typography.mono).toContain("IBM Plex Mono");
    expect(thomToolFoundation.effect.grainOpacity).toBeGreaterThan(0);
  });
});
