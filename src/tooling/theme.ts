export interface ThomToolFoundation {
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
  effect: {
    glow: string;
    grainOpacity: number;
  };
}

export const thomToolFoundation: ThomToolFoundation = {
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
  effect: {
    glow: "0 0 42px rgba(214,176,106,.14)",
    grainOpacity: 0.045,
  },
};
