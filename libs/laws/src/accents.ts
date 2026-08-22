import { accentColorNames, type AccentColorName } from "@th-m/design-theme";
import { lawLabels, type LawLabel } from "./types";

/** Stable label-to-theme mapping shared by filters, cards, and details. */
export const lawLabelAccents: Readonly<Record<LawLabel, AccentColorName>> = Object.freeze(
  Object.fromEntries(
    lawLabels.map((label, index) => [label, accentColorNames[index % accentColorNames.length]]),
  ) as Record<LawLabel, AccentColorName>,
);

/** CSS token reference for the mapped accent; useful to non-library consumers. */
export function lawLabelAccentVariable(label: LawLabel): string {
  return `var(--color-accent-${lawLabelAccents[label]})`;
}
