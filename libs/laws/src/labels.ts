import type { LawLabel } from "./types";

/** Compact display names for law labels; established two-letter initialisms stay intact. */
export const lawLabelAbbreviations = Object.freeze({
  ui: "UI",
  design: "DES",
  psychology: "PSY",
  cs: "CS",
  "software-engineering": "SWE",
  architecture: "ARC",
  management: "MGT",
  product: "PRO",
  security: "SEC",
  ai: "AI",
  information: "INF",
  economics: "ECO",
  epistemology: "EPI",
  physics: "PHY",
} satisfies Record<LawLabel, string>);
