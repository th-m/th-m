import { thomDesignTokens } from "@th-m/design-theme";

const foundation = thomDesignTokens;

export interface TopologyTheme {
  id: "thom-dark";
  color: {
    background: string;
    surface: string;
    surfaceRaised: string;
    foreground: string;
    foregroundStrong: string;
    foregroundMuted: string;
    primary: string;
    border: string;
    borderStrong: string;
    error: string;
  };
  typography: {
    display: string;
    mono: string;
  };
  geometry: {
    nodeWidth: number;
    nodeHeight: number;
    columnGap: number;
    rowGap: number;
    headerHeight: number;
    graphPadding: number;
    lineWidth: number;
    arrowSize: number;
  };
  effect: {
    glow: string;
    grainOpacity: number;
  };
}

export const topologyTheme: TopologyTheme = {
  id: "thom-dark",
  color: {
    background: foundation.color.background,
    surface: foundation.color.surface,
    surfaceRaised: foundation.color.surfaceRaised,
    foreground: foundation.color.foreground,
    foregroundStrong: foundation.color.foregroundStrong,
    foregroundMuted: foundation.color.foregroundMuted,
    primary: foundation.color.primary.default,
    border: foundation.color.border,
    borderStrong: foundation.color.borderStrong,
    error: foundation.color.semantic.error.default,
  },
  typography: foundation.typography,
  geometry: {
    nodeWidth: 232,
    nodeHeight: 76,
    columnGap: 118,
    rowGap: 34,
    headerHeight: 64,
    graphPadding: 84,
    lineWidth: 2,
    arrowSize: 11,
  },
  effect: foundation.effect,
};
