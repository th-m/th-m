/** Laws content snapshot types. Framework-independent. */

/** Domain/theory labels a law applies to. */
export const lawLabels = [
  "ui", // user interface
  "design", // visual and interaction design
  "psychology", // human cognition and behavior
  "cs", // computer science
  "software-engineering", // development practice
  "architecture", // system and software architecture
  "management", // teams, projects, and process
  "product", // product strategy and adoption
  "security", // security and cryptography
] as const;
export type LawLabel = (typeof lawLabels)[number];

export type LawCategory = "theory" | "psychology";

export interface LawFurtherReading {
  title: string;
  url: string;
  source: string;
}

export interface Law {
  /** Stable ASCII kebab-case identifier, e.g. "fittss-law" or "conways-law". */
  slug: string;
  /** Display title, e.g. "Fitts's Law" or "Conway's Law". */
  title: string;
  /** One-sentence law definition. */
  definition: string;
  /** Source site category: "theory" or "psychology". */
  category: LawCategory;
  /** Source accent color, "#rrggbb" (source site or derived from the slug). */
  color: string;
  /** Domain/theory labels this law applies to. */
  labels: LawLabel[];
  /** Actionable takeaways; absent when the source provides none. */
  takeaways?: string[];
  /** Long-form copy content (the origins/explanatory paragraphs). May be empty. */
  copy: string[];
  /** Optional cited "Source" reference URL. */
  source?: string;
  /** Further reading links with their publisher; absent when the source provides none. */
  furtherReading?: LawFurtherReading[];
  /** Original source SVG artwork (full <svg> element); absent when the source provides none. */
  graphic?: string;
  /** Provenance page URLs the law was collected from, primary first. */
  sources: string[];
  /** Slugs of related laws, when the source lists them. */
  related: string[];
}
