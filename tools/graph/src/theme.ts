import { thomToolFoundation } from "@th-m/design-theme";

export interface GraphTheme {
  id: "thom-dark";
  color: {
    background: string;
    surface: string;
    surfaceRaised: string;
    ivory: string;
    gold: string;
    highlight: string;
    muted: string;
    line: string;
    danger: string;
  };
  typography: {
    display: string;
    mono: string;
  };
  geometry: {
    propositionMin: number;
    propositionMax: number;
    relationshipWidth: number;
    relationshipMinHeight: number;
    graphPadding: number;
  };
  line: {
    width: number;
    arrowSize: number;
  };
  effect: {
    glow: string;
    grainOpacity: number;
  };
}

export const thomTheme: GraphTheme = {
  id: "thom-dark",
  color: thomToolFoundation.color,
  typography: thomToolFoundation.typography,
  geometry: {
    propositionMin: 184,
    propositionMax: 296,
    relationshipWidth: 330,
    relationshipMinHeight: 84,
    graphPadding: 84,
  },
  line: {
    width: 2,
    arrowSize: 11,
  },
  effect: thomToolFoundation.effect,
};

export const graphThemeCssVariables = {
  "--graph-background": thomTheme.color.background,
  "--graph-surface": thomTheme.color.surface,
  "--graph-surface-raised": thomTheme.color.surfaceRaised,
  "--graph-ivory": thomTheme.color.ivory,
  "--graph-gold": thomTheme.color.gold,
  "--graph-highlight": thomTheme.color.highlight,
  "--graph-muted": thomTheme.color.muted,
  "--graph-line": thomTheme.color.line,
  "--graph-danger": thomTheme.color.danger,
  "--graph-display": thomTheme.typography.display,
  "--graph-mono": thomTheme.typography.mono,
} as React.CSSProperties;
