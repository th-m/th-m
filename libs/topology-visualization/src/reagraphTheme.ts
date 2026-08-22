// Reagraph theme built from the THOM design foundation for topology canvases.
import type { Theme } from "reagraph";
import { topologyTheme } from "./theme";

export function createReagraphTheme(): Theme {
  return {
    canvas: {
      background: topologyTheme.color.background,
      fog: topologyTheme.color.background,
    },
    node: {
      fill: topologyTheme.color.foreground,
      activeFill: topologyTheme.color.primary,
      opacity: 1,
      selectedOpacity: 1,
      inactiveOpacity: 0.22,
      label: {
        color: topologyTheme.color.foreground,
        activeColor: topologyTheme.color.foregroundStrong,
        backgroundColor: topologyTheme.color.surface,
        backgroundOpacity: 0.72,
        padding: 6,
        radius: 4,
        strokeColor: topologyTheme.color.border,
        strokeWidth: 1,
      },
      subLabel: {
        color: topologyTheme.color.foregroundMuted,
        activeColor: topologyTheme.color.foregroundStrong,
      },
    },
    ring: {
      fill: topologyTheme.color.primary,
      activeFill: topologyTheme.color.primary,
    },
    edge: {
      fill: topologyTheme.color.primary,
      activeFill: topologyTheme.color.primary,
      opacity: 0.8,
      selectedOpacity: 1,
      inactiveOpacity: 0.14,
      label: {
        color: topologyTheme.color.foregroundMuted,
        activeColor: topologyTheme.color.foregroundStrong,
        fontSize: 13,
      },
    },
    arrow: {
      fill: topologyTheme.color.primary,
      activeFill: topologyTheme.color.primary,
    },
    lasso: {
      background: topologyTheme.effect.glow,
      border: topologyTheme.color.primary,
    },
  };
}
