import { describe, expect, it } from "vitest";
import { adaptLawColor } from "../src/adapt";
import { laws, lawBySlug } from "../src/laws";
import type { Law } from "../src/types";

const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const URL = /^https?:\/\/\S+$/;

describe("laws of UX content snapshot", () => {
  it("contains all 30 laws with unique ASCII slugs", () => {
    expect(laws).toHaveLength(30);
    const slugs = laws.map((law) => law.slug);
    expect(new Set(slugs).size).toBe(30);
    for (const slug of slugs) {
      expect(slug).toMatch(KEBAB);
    }
  });

  it("keys lawBySlug by every slug", () => {
    expect(Object.keys(lawBySlug).sort()).toEqual(laws.map((law) => law.slug).sort());
    for (const law of laws) {
      expect(lawBySlug[law.slug]).toBe(law);
    }
  });

  it("completes every required field per law", () => {
    for (const law of laws) {
      expect(law.title.length, `${law.slug} title`).toBeGreaterThan(0);
      expect(law.definition.length, `${law.slug} definition`).toBeGreaterThan(0);
      expect(["theory", "psychology"]).toContain(law.category);
      expect(law.color, `${law.slug} color`).toMatch(HEX_COLOR);
      expect(law.takeaways.length, `${law.slug} takeaways`).toBeGreaterThanOrEqual(1);
      expect(law.copy.length, `${law.slug} copy`).toBeGreaterThanOrEqual(1);
      expect(law.furtherReading.length, `${law.slug} further reading`).toBeGreaterThanOrEqual(1);
      expect(law.siteUrl, `${law.slug} siteUrl`).toMatch(/^https:\/\/lawsofux\.com\//);
    }
  });

  it("stores the original SVG artwork verbatim as a full svg element", () => {
    for (const law of laws) {
      expect(law.graphic.trim().startsWith("<svg"), `${law.slug} starts with <svg`).toBe(true);
      expect(law.graphic.trim().endsWith("</svg>"), `${law.slug} ends with </svg>`).toBe(true);
      expect(law.graphic, `${law.slug} keeps source eggshell`).toContain("#f4f1d0");
    }
  });

  it("keeps every further reading entry well-formed", () => {
    for (const law of laws) {
      for (const entry of law.furtherReading) {
        expect(entry.title.length, `${law.slug} reading title`).toBeGreaterThan(0);
        expect(entry.url, `${law.slug} reading url`).toMatch(URL);
        expect(entry.source.length, `${law.slug} reading source`).toBeGreaterThan(0);
      }
    }
  });

  it("resolves every related slug and keeps the source link valid", () => {
    for (const law of laws) {
      for (const slug of law.related) {
        expect(lawBySlug[slug], `${law.slug} related ${slug}`).toBeDefined();
      }
      if (law.source) {
        expect(law.source, `${law.slug} source`).toMatch(URL);
      }
    }
  });

  it("keeps copy free of stray markup", () => {
    for (const law of laws) {
      for (const paragraph of law.copy) {
        expect(paragraph, `${law.slug} copy`).not.toContain("<");
        expect(paragraph.length, `${law.slug} copy paragraph`).toBeGreaterThan(20);
      }
    }
  });
});

describe("law color adaptation", () => {
  it("derives a THOM-dark tone from every law color without throwing", () => {
    for (const law of laws) {
      const adapted = adaptLawColor(law.color);
      expect(adapted, law.slug).toMatch(HEX_COLOR);
    }
  });
});

describe("law record shape", () => {
  it("covers the canonical 30 laws by slug", () => {
    const expected = [
      "aesthetic-usability-effect",
      "choice-overload",
      "chunking",
      "cognitive-bias",
      "cognitive-load",
      "doherty-threshold",
      "fittss-law",
      "flow",
      "goal-gradient-effect",
      "hicks-law",
      "jakobs-law",
      "law-of-common-region",
      "law-of-proximity",
      "law-of-praegnanz",
      "law-of-similarity",
      "law-of-uniform-connectedness",
      "mental-model",
      "millers-law",
      "occams-razor",
      "paradox-of-the-active-user",
      "pareto-principle",
      "parkinsons-law",
      "peak-end-rule",
      "postels-law",
      "selective-attention",
      "serial-position-effect",
      "teslers-law",
      "von-restorff-effect",
      "working-memory",
      "zeigarnik-effect",
    ];
    expect(laws.map((law: Law) => law.slug)).toEqual(expected);
  });
});
