/** Laws of UX content snapshot types. Framework-independent. */

export type LawCategory = "theory" | "psychology";

export interface LawFurtherReading {
  title: string;
  url: string;
  source: string;
}

export interface Law {
  /** Stable ASCII kebab-case identifier, e.g. "fittss-law" or "law-of-praegnanz". */
  slug: string;
  /** Display title, e.g. "Fitts's Law". */
  title: string;
  /** One-sentence law definition. */
  definition: string;
  /** Source site category: "theory" or "psychology". */
  category: LawCategory;
  /** Source accent color from lawsofux.com, "#rrggbb". */
  color: string;
  /** Actionable takeaways. */
  takeaways: string[];
  /** Long-form copy content (the Origins section paragraphs). */
  copy: string[];
  /** Optional cited "Source" reference URL. */
  source?: string;
  /** Further reading links with their publisher. */
  furtherReading: LawFurtherReading[];
  /** Original lawsofux.com SVG artwork, stored verbatim (full <svg> element). */
  graphic: string;
  /** lawsofux.com page URL for attribution. */
  siteUrl: string;
  /** Slugs of related laws on lawsofux.com. */
  related: string[];
}
