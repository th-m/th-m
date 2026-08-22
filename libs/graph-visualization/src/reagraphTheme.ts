// Reagraph theme built from the THOM design foundation. Maps the semantic
// tokens (dark editorial palette, Newsreader/IBM Plex Mono typography,
// glow/grain effects) onto reagraph's WebGL theme surface.
import type { Theme } from "reagraph";
import { thomTheme } from "./theme";

export function createReagraphTheme(): Theme {
  return {
    canvas: {
      background: thomTheme.color.background,
      fog: thomTheme.color.background,
    },
    node: {
      fill: thomTheme.color.foreground,
      activeFill: thomTheme.color.primary,
      opacity: 1,
      selectedOpacity: 1,
      inactiveOpacity: 0.22,
      label: {
        color: thomTheme.color.foreground,
        activeColor: thomTheme.color.foregroundStrong,
        backgroundColor: thomTheme.color.surface,
        backgroundOpacity: 0.72,
        padding: 6,
        radius: 4,
        strokeColor: thomTheme.color.border,
        strokeWidth: 1,
      },
      subLabel: {
        color: thomTheme.color.foregroundMuted,
        activeColor: thomTheme.color.foregroundStrong,
      },
    },
    ring: {
      fill: thomTheme.color.primary,
      activeFill: thomTheme.color.primary,
    },
    edge: {
      fill: thomTheme.color.primary,
      activeFill: thomTheme.color.primary,
      opacity: 0.8,
      selectedOpacity: 1,
      inactiveOpacity: 0.14,
      label: {
        color: thomTheme.color.foregroundMuted,
        activeColor: thomTheme.color.foregroundStrong,
        fontSize: 13,
      },
    },
    arrow: {
      fill: thomTheme.color.primary,
      activeFill: thomTheme.color.primary,
    },
    lasso: {
      background: thomTheme.effect.glow,
      border: thomTheme.color.primary,
    },
  };
}
