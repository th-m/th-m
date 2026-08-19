export const semanticColorNames = ["success", "info", "warning", "error"] as const;
export type SemanticColorName = (typeof semanticColorNames)[number];

export const accentColorNames = ["blue", "rose", "lime", "violet", "teal", "plum"] as const;
export type AccentColorName = (typeof accentColorNames)[number];

export interface IntentColor {
  default: string;
  hover: string;
  active: string;
  foreground: string;
}

export interface AccentColor {
  ordinal: 1 | 2 | 3 | 4 | 5 | 6;
  name: AccentColorName;
  value: string;
}

export const accentPalette = [
  { ordinal: 1, name: "blue", value: "#7a8aff" },
  { ordinal: 2, name: "rose", value: "#e579c4" },
  { ordinal: 3, name: "lime", value: "#c8bc00" },
  { ordinal: 4, name: "violet", value: "#be9df7" },
  { ordinal: 5, name: "teal", value: "#009084" },
  { ordinal: 6, name: "plum", value: "#ad65be" },
] as const satisfies readonly AccentColor[];

export interface ThomDesignTokens {
  color: {
    background: string;
    surface: string;
    surfaceForeground: string;
    surfaceRaised: string;
    surfaceRaisedForeground: string;
    card: string;
    cardForeground: string;
    hoverCard: string;
    hoverCardForeground: string;
    popover: string;
    popoverForeground: string;
    dialog: string;
    dialogForeground: string;
    scrim: string;
    foreground: string;
    foregroundStrong: string;
    foregroundMuted: string;
    foregroundSubtle: string;
    foregroundInverse: string;
    border: string;
    borderStrong: string;
    input: string;
    ring: string;
    brand: string;
    primary: IntentColor;
    semantic: Record<SemanticColorName, IntentColor>;
    accents: Record<AccentColorName, string>;
    accentForeground: string;
  };
  typography: {
    sans: string;
    display: string;
    mono: string;
  };
  easing: {
    draw: string;
    converge: string;
  };
  effect: {
    glow: string;
    grainOpacity: number;
  };
}

const foreground = "#f2e5cf";
const foregroundStrong = "#fff5dc";
const foregroundInverse = "#17130f";

export const thomDesignTokens: ThomDesignTokens = {
  color: {
    background: "#050505",
    surface: "#0c0b09",
    surfaceForeground: foreground,
    surfaceRaised: "#15120d",
    surfaceRaisedForeground: foreground,
    card: "#15120d",
    cardForeground: foreground,
    hoverCard: "#19150f",
    hoverCardForeground: foreground,
    popover: "#1d1811",
    popoverForeground: foreground,
    dialog: "#211b13",
    dialogForeground: foregroundStrong,
    scrim: "rgb(0 0 0 / 72%)",
    foreground,
    foregroundStrong,
    foregroundMuted: "#a99b87",
    foregroundSubtle: "#8f816e",
    foregroundInverse,
    border: "#30291f",
    borderStrong: "#776951",
    input: "#776951",
    ring: "#d6b06a",
    brand: "#d6b06a",
    primary: {
      default: "#d6b06a",
      hover: "#e3bd76",
      active: "#c9a35d",
      foreground: foregroundInverse,
    },
    semantic: {
      success: { default: "#7cb57d", hover: "#88c28a", active: "#70a971", foreground: foregroundInverse },
      info: { default: "#69aed5", hover: "#76bbe2", active: "#5da1c8", foreground: foregroundInverse },
      warning: { default: "#e1a263", hover: "#efaf6f", active: "#d49656", foreground: foregroundInverse },
      error: { default: "#dd766f", hover: "#eb827b", active: "#cf6963", foreground: foregroundInverse },
    },
    accents: Object.fromEntries(accentPalette.map(({ name, value }) => [name, value])) as Record<AccentColorName, string>,
    accentForeground: foregroundInverse,
  },
  typography: {
    sans: '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
    display: '"Newsreader Variable", Newsreader, Georgia, serif',
    mono: '"IBM Plex Mono", ui-monospace, monospace',
  },
  easing: {
    draw: "cubic-bezier(.22, 1, .36, 1)",
    converge: "cubic-bezier(.16, 1, .3, 1)",
  },
  effect: {
    glow: "0 0 42px rgb(214 176 106 / 14%)",
    grainOpacity: 0.045,
  },
};
