/**
 * Deterministic adaptation of lawsofux.com artwork onto the THOM theme.
 * Pure string and color transforms; no side effects.
 */

/** Source artwork light shape color (lawsofux eggshell). */
export const SOURCE_EGGSHELL = "#f4f1d0";

/** THOM brand fill, resolved from the design-theme CSS variable at render time. */
export const BRAND_FILL = "var(--color-primary)";

/**
 * Recolors a source lawsofux.com SVG element onto the THOM theme:
 * - normalizes lowercase `viewbox` to `viewBox`;
 * - replaces source eggshell fills/strokes with the brand gold token;
 * - keeps `#000` shapes with their existing fill-opacity (subtle mid-tones).
 * The `--animation-order` style attributes are preserved for the optional
 * staggered reveal in `LawGraphic`.
 */
export function adaptLawGraphic(graphic: string): string {
  return graphic
    .replaceAll("viewbox", "viewBox")
    .replaceAll(`fill="${SOURCE_EGGSHELL}"`, `fill="${BRAND_FILL}"`)
    .replaceAll(`stroke="${SOURCE_EGGSHELL}"`, `stroke="${BRAND_FILL}"`);
}

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

/** Parses "#rrggbb" into 0-255 channels; returns null for malformed input. */
export function parseHexColor(hex: string): RgbColor | null {
  const match = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const value = Number.parseInt(match[1], 16);
  return { r: (value >> 16) & 0xff, g: (value >> 8) & 0xff, b: value & 0xff };
}

export function rgbToHex({ r, g, b }: RgbColor): string {
  const channel = (value: number): string =>
    Math.round(Math.min(255, Math.max(0, value))).toString(16).padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

export interface HslColor {
  h: number; // 0-360
  s: number; // 0-1
  l: number; // 0-1
}

export function rgbToHsl({ r, g, b }: RgbColor): HslColor {
  const [rn, gn, bn] = [r, g, b].map((channel) => channel / 255);
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const lightness = (max + min) / 2;
  const delta = max - min;
  if (delta === 0) return { h: 0, s: 0, l: lightness };
  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  let hue: number;
  if (max === rn) hue = ((gn - bn) / delta) % 6;
  else if (max === gn) hue = (bn - rn) / delta + 2;
  else hue = (rn - gn) / delta + 4;
  return { h: ((hue * 60) + 360) % 360, s: saturation, l: lightness };
}

export function hslToRgb({ h, s, l }: HslColor): RgbColor {
  if (s === 0) {
    const gray = Math.round(l * 255);
    return { r: gray, g: gray, b: gray };
  }
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const huePrime = ((h % 360) + 360) % 360 / 60;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));
  let [r, g, b] = [0, 0, 0];
  if (huePrime < 1) [r, g, b] = [chroma, x, 0];
  else if (huePrime < 2) [r, g, b] = [x, chroma, 0];
  else if (huePrime < 3) [r, g, b] = [0, chroma, x];
  else if (huePrime < 4) [r, g, b] = [0, x, chroma];
  else if (huePrime < 5) [r, g, b] = [x, 0, chroma];
  else [r, g, b] = [chroma, 0, x];
  const m = l - chroma / 2;
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
}

export const DEFAULT_TARGET_LIGHTNESS = 0.25;
export const DEFAULT_SATURATION_FACTOR = 0.85;

/**
 * Derives a THOM-compatible dark tone from a source color: preserves the hue,
 * clamps lightness into the dark surface range, and desaturates mildly.
 * Returns a "#rrggbb" string. Deterministic and side-effect free.
 */
export function adaptLawColor(
  hex: string,
  targetLightness = DEFAULT_TARGET_LIGHTNESS,
  saturationFactor = DEFAULT_SATURATION_FACTOR,
): string {
  const rgb = parseHexColor(hex);
  if (!rgb) throw new Error(`adaptLawColor: invalid hex color "${hex}"`);
  const hsl = rgbToHsl(rgb);
  return rgbToHex(
    hslToRgb({
      h: hsl.h,
      s: hsl.s * saturationFactor,
      l: targetLightness,
    }),
  );
}
