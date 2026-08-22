import { accentPalette, thomDesignTokens } from "@th-m/design-theme";

const foundation = thomDesignTokens;

export interface GraphTheme {
  id: "thom-dark";
  color: {
    background: string;
    scrim: string;
    surface: string;
    surfaceRaised: string;
    foreground: string;
    foregroundStrong: string;
    foregroundMuted: string;
    primary: string;
    /** Categorical accent for the relationship (connector) node type. */
    accent: string;
    /** Ordered accent palette available to node types and layers. */
    accents: readonly string[];
    border: string;
    error: string;
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
    background: foundation.color.background,
    scrim: foundation.color.scrim,
    surface: foundation.color.surface,
    surfaceRaised: foundation.color.surfaceRaised,
    foreground: foundation.color.foreground,
    foregroundStrong: foundation.color.foregroundStrong,
    foregroundMuted: foundation.color.foregroundMuted,
    primary: foundation.color.primary.default,
    accent: foundation.color.accents.violet,
    accents: accentPalette.map(({ value }) => value),
    border: foundation.color.border,
    error: foundation.color.semantic.error.default,
  },
  typography: foundation.typography,
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
  effect: foundation.effect,
};
