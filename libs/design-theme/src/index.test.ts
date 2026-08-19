import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  accentColorNames,
  accentPalette,
  semanticColorNames,
  thomDesignTokens,
} from "./index";
import { renderTailwindTheme } from "./tailwind";

const relativeLuminance = (hex: string): number => {
  const channels = [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
  return channels
    .map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
    .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
};

const contrast = (first: string, second: string): number => {
  const [lighter, darker] = [relativeLuminance(first), relativeLuminance(second)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
};

const oklab = (hex: string): readonly [number, number, number] => {
  const [red, green, blue] = [1, 3, 5]
    .map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255)
    .map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  const light = Math.cbrt(0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue);
  const medium = Math.cbrt(0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue);
  const short = Math.cbrt(0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue);
  return [
    0.2104542553 * light + 0.793617785 * medium - 0.0040720468 * short,
    1.9779984951 * light - 2.428592205 * medium + 0.4505937099 * short,
    0.0259040371 * light + 0.7827717662 * medium - 0.808675766 * short,
  ];
};

const perceptualDistance = (first: string, second: string): number => {
  const firstLab = oklab(first);
  const secondLab = oklab(second);
  return Math.hypot(...firstLab.map((value, index) => value - secondLab[index]));
};

describe("thomDesignTokens", () => {
  it("exposes the canonical semantic and accent contracts", () => {
    expect(semanticColorNames).toEqual(["success", "info", "warning", "error"]);
    expect(accentColorNames).toEqual(["blue", "rose", "lime", "violet", "teal", "plum"]);
    expect(accentPalette.map(({ ordinal, name }) => [ordinal, name])).toEqual([
      [1, "blue"],
      [2, "rose"],
      [3, "lime"],
      [4, "violet"],
      [5, "teal"],
      [6, "plum"],
    ]);
    expect(thomDesignTokens.color.brand).toBe(thomDesignTokens.color.primary.default);
    expect(thomDesignTokens.typography.display).toContain("Newsreader");
    expect(thomDesignTokens.typography.mono).toContain("IBM Plex Mono");
    expect(thomDesignTokens.color).toEqual({
      background: "#050505",
      surface: "#0c0b09",
      surfaceForeground: "#f2e5cf",
      surfaceRaised: "#15120d",
      surfaceRaisedForeground: "#f2e5cf",
      card: "#15120d",
      cardForeground: "#f2e5cf",
      hoverCard: "#19150f",
      hoverCardForeground: "#f2e5cf",
      popover: "#1d1811",
      popoverForeground: "#f2e5cf",
      dialog: "#211b13",
      dialogForeground: "#fff5dc",
      scrim: "rgb(0 0 0 / 72%)",
      foreground: "#f2e5cf",
      foregroundStrong: "#fff5dc",
      foregroundMuted: "#a99b87",
      foregroundSubtle: "#8f816e",
      foregroundInverse: "#17130f",
      border: "#30291f",
      borderStrong: "#776951",
      input: "#776951",
      ring: "#d6b06a",
      brand: "#d6b06a",
      primary: { default: "#d6b06a", hover: "#e3bd76", active: "#c9a35d", foreground: "#17130f" },
      semantic: {
        success: { default: "#7cb57d", hover: "#88c28a", active: "#70a971", foreground: "#17130f" },
        info: { default: "#69aed5", hover: "#76bbe2", active: "#5da1c8", foreground: "#17130f" },
        warning: { default: "#e1a263", hover: "#efaf6f", active: "#d49656", foreground: "#17130f" },
        error: { default: "#dd766f", hover: "#eb827b", active: "#cf6963", foreground: "#17130f" },
      },
      accents: { blue: "#7a8aff", rose: "#e579c4", lime: "#c8bc00", violet: "#be9df7", teal: "#009084", plum: "#ad65be" },
      accentForeground: "#17130f",
    });
  });

  it("keeps every exported hexadecimal color valid", () => {
    const values = JSON.stringify(thomDesignTokens).match(/#[0-9a-f]+/gi) ?? [];
    expect(values.length).toBeGreaterThan(30);
    expect(values.every((value) => /^#[0-9a-f]{6}$/i.test(value))).toBe(true);
  });

  it("meets text and meaningful-boundary contrast requirements", () => {
    const color = thomDesignTokens.color;
    const surfaces = [color.background, color.surface, color.surfaceRaised, color.hoverCard, color.popover, color.dialog];
    const textPairs = [
      [color.foreground, color.background],
      [color.surfaceForeground, color.surface],
      [color.surfaceRaisedForeground, color.surfaceRaised],
      [color.cardForeground, color.card],
      [color.hoverCardForeground, color.hoverCard],
      [color.popoverForeground, color.popover],
      [color.dialogForeground, color.dialog],
      [color.foregroundMuted, color.background],
      [color.foregroundSubtle, color.background],
    ] as const;
    for (const [foreground, background] of textPairs) expect(contrast(foreground, background)).toBeGreaterThanOrEqual(4.5);
    for (const surface of surfaces) {
      expect(contrast(color.borderStrong, surface)).toBeGreaterThanOrEqual(3);
      expect(contrast(color.ring, surface)).toBeGreaterThanOrEqual(3);
    }
    for (const intent of [color.primary, ...semanticColorNames.map((name) => color.semantic[name])]) {
      expect(contrast(intent.default, intent.foreground)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(intent.hover, intent.foreground)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(intent.active, intent.foreground)).toBeGreaterThanOrEqual(4.5);
    }
    for (const accent of accentPalette) {
      expect(contrast(accent.value, color.accentForeground)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(accent.value, color.background)).toBeGreaterThanOrEqual(4.5);
      for (const intent of semanticColorNames.map((name) => color.semantic[name])) {
        for (const semanticValue of [intent.default, intent.hover, intent.active]) {
          expect(perceptualDistance(accent.value, semanticValue)).toBeGreaterThanOrEqual(0.1);
        }
      }
    }
    for (const [index, accent] of accentPalette.entries()) {
      for (const other of accentPalette.slice(index + 1)) {
        expect(perceptualDistance(accent.value, other.value)).toBeGreaterThanOrEqual(0.1);
      }
    }
  });

  it("keeps the tracked Tailwind theme synchronized with typed tokens", async () => {
    const generated = await readFile(new URL("./theme.css", import.meta.url), "utf8");
    expect(generated).toBe(renderTailwindTheme());
  });
});
