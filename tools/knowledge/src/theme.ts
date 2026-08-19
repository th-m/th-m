import { thomDesignTokens } from "@th-m/design-theme";

const color = thomDesignTokens.color;

export const knowledgeTheme = {
  background: color.background,
  surface: color.surface,
  surfaceRaised: color.surfaceRaised,
  dialog: color.dialog,
  foreground: color.foreground,
  foregroundMuted: color.foregroundMuted,
  foregroundSubtle: color.foregroundSubtle,
  foregroundInverse: color.foregroundInverse,
  primary: color.primary.default,
  border: color.border,
  borderStrong: color.borderStrong,
  error: color.semantic.error.default,
} as const;
