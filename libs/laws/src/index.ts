import { curatedLawBySlug, curatedLaws } from "./laws-curated";
import { laws as snapshotLaws, lawBySlug as snapshotLawBySlug } from "./laws";
import type { Law } from "./types";
export { adaptLawColor, adaptLawGraphic, SOURCE_EGGSHELL, BRAND_FILL } from "./adapt";
export type { HslColor, RgbColor } from "./adapt";
export { lawLabelAccents, lawLabelAccentVariable } from "./accents";
export { LawGraphic, lawMonogram, type LawGraphicProps } from "./LawGraphic";
export { LawCard, type LawCardProps } from "./LawCard";
export { LawDetail, type LawDetailProps } from "./LawDetail";
export { LawsGrid, type LawsGridProps } from "./LawsGrid";
export { lawLabels } from "./types";
export type { Law, LawCategory, LawFurtherReading, LawLabel } from "./types";
export { curatedLawBySlug, curatedLaws } from "./laws-curated";

/**
 * All laws: the fetched snapshot (30 laws of UX in lawsofux.com homepage
 * order, then the laws of software development) followed by the hand-curated
 * extension collections (information & language, AI/ML, reasoning &
 * epistemology, organizations & economics, operations & systems, cognitive
 * effects, and physical metaphors). The snapshot module (`./laws`) remains
 * generator-owned and unchanged; this merged view is what consumers see.
 */
export const laws: Law[] = [...snapshotLaws, ...curatedLaws];

/** All laws keyed by their stable ASCII slug (snapshot first, then curated). */
export const lawBySlug: Readonly<Record<string, Law>> = {
  ...snapshotLawBySlug,
  ...curatedLawBySlug,
};
