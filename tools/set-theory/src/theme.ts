import { thomToolFoundation } from "@th-m/design-theme";

export const setAtlasTheme = {
  ...thomToolFoundation,
  geometry: {
    padding: 88,
    islandGap: 76,
    regionMinRadius: 92,
    regionMaxRadius: 255,
    cardWidth: 248,
    cardHeight: 82,
  },
};

export const setThemeCssVariables = {
  "--set-background": setAtlasTheme.color.background,
  "--set-surface": setAtlasTheme.color.surface,
  "--set-surface-raised": setAtlasTheme.color.surfaceRaised,
  "--set-ivory": setAtlasTheme.color.ivory,
  "--set-gold": setAtlasTheme.color.gold,
  "--set-highlight": setAtlasTheme.color.highlight,
  "--set-muted": setAtlasTheme.color.muted,
  "--set-line": setAtlasTheme.color.line,
  "--set-danger": setAtlasTheme.color.danger,
  "--set-display": setAtlasTheme.typography.display,
  "--set-mono": setAtlasTheme.typography.mono,
} as React.CSSProperties;
