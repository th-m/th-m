import { accentPalette, thomDesignTokens } from "@th-m/design-theme";

/**
 * Ordered categorical accents for set regions. Each set region gets its own
 * accent (outline, translucent fill, and inside text) so sets are
 * distinguishable by color — the same palette the topology graphs assign to
 * layers. Assignment is deterministic: regions sorted by depth then id take
 * `setAtlasAccent(index)`; more than six regions cycle the palette.
 */
export const setAtlasAccentPalette = accentPalette.map(({ value }) => value);

export function setAtlasAccent(index: number): string {
  return setAtlasAccentPalette[((index % setAtlasAccentPalette.length) + setAtlasAccentPalette.length) % setAtlasAccentPalette.length];
}

export const setAtlasTheme = {
  ...thomDesignTokens,
  geometry: {
    padding: 88,
    islandGap: 76,
    regionMinRadius: 92,
    regionMaxRadius: 255,
    cardWidth: 248,
    cardHeight: 82,
  },
};