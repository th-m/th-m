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
  color: {
    background: "#050505",
    surface: "#0c0b09",
    surfaceRaised: "#15120d",
    ivory: "#f2e5cf",
    gold: "#d6b06a",
    highlight: "#fff5dc",
    muted: "#a99b87",
    line: "#554936",
    danger: "#dc806f",
  },
  typography: {
    display: '"Newsreader Variable", Newsreader, Georgia, serif',
    mono: '"IBM Plex Mono", ui-monospace, monospace',
  },
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
  effect: {
    glow: "0 0 42px rgba(214,176,106,.14)",
    grainOpacity: 0.045,
  },
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
