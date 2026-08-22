import { describe, expect, it } from "vitest";
import { adaptLawColor } from "../src/adapt";
import { laws, lawBySlug } from "../src/laws";
import { lawLabels } from "../src/types";
import type { Law } from "../src/types";

const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const URL = /^https?:\/\/\S+$/;

/** The 30 laws of UX from lawsofux.com. */
const uxSlugs = [
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

/** The laws of software development from timsommer.be. */
const softwareSlugs = [
  "murphys-law",
  "brooks-law",
  "hofstadters-law",
  "conways-law",
  "peter-principle",
  "kerchkhoffs-principle",
  "linuss-law",
  "moores-law",
  "wirths-law",
  "ninety-ninety-rule",
  "knuths-optimization-principle",
  "norvigs-law",
];

describe("laws content snapshot", () => {
  it("contains all laws with unique ASCII slugs in source order", () => {
    expect(laws).toHaveLength(42);
    const expected = [...uxSlugs, ...softwareSlugs];
    expect(laws.map((law: Law) => law.slug)).toEqual(expected);
    const slugs = laws.map((law) => law.slug);
    expect(new Set(slugs).size).toBe(42);
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
      expect(law.labels.length, `${law.slug} labels`).toBeGreaterThanOrEqual(1);
      for (const label of law.labels) {
        expect(lawLabels, `${law.slug} label ${label}`).toContain(label);
      }
      expect(law.sources.length, `${law.slug} sources`).toBeGreaterThanOrEqual(1);
      for (const source of law.sources) {
        expect(source, `${law.slug} source url`).toMatch(URL);
      }
    }
  });

  it("keeps the full UX records complete and the software records minimal", () => {
    for (const slug of uxSlugs) {
      const law = lawBySlug[slug]!;
      expect(law.graphic, `${slug} graphic`).toBeDefined();
      expect((law.takeaways ?? []).length, `${slug} takeaways`).toBeGreaterThanOrEqual(1);
      expect((law.furtherReading ?? []).length, `${slug} further reading`).toBeGreaterThanOrEqual(1);
      expect(law.sources, `${slug} sources`).toContain(`https://lawsofux.com/${slug === "law-of-praegnanz" ? "law-of-pr%C3%A4gnanz" : slug}/`);
    }
    for (const slug of softwareSlugs) {
      const law = lawBySlug[slug]!;
      expect(law.graphic, `${slug} graphic`).toBeUndefined();
      expect(law.sources, `${slug} sources`).toContain("https://www.timsommer.be/famous-laws-of-software-development/");
      expect(law.category, `${slug} category`).toBe("theory");
      expect(law.related, `${slug} related`).toEqual([]);
    }
  });

  it("stores UX artwork verbatim as a full svg element", () => {
    for (const slug of uxSlugs) {
      const graphic = lawBySlug[slug]!.graphic!;
      expect(graphic.trim().startsWith("<svg"), `${slug} starts with <svg`).toBe(true);
      expect(graphic.trim().endsWith("</svg>"), `${slug} ends with </svg>`).toBe(true);
      expect(graphic, `${slug} keeps source eggshell`).toContain("#f4f1d0");
    }
  });

  it("keeps every further reading entry well-formed", () => {
    for (const law of laws) {
      for (const entry of law.furtherReading ?? []) {
        expect(entry.title.length, `${law.slug} reading title`).toBeGreaterThan(0);
        expect(entry.url, `${law.slug} reading url`).toMatch(URL);
        expect(entry.source.length, `${law.slug} reading source`).toBeGreaterThan(0);
      }
    }
  });

  it("resolves every related slug and keeps the cited source valid", () => {
    for (const law of laws) {
      for (const slug of law.related) {
        expect(lawBySlug[slug], `${law.slug} related ${slug}`).toBeDefined();
      }
      if (law.source) {
        expect(law.source, `${law.slug} source`).toMatch(URL);
      }
    }
  });

  it("keeps copy free of stray markup and HTML entities", () => {
    for (const law of laws) {
      for (const paragraph of law.copy) {
        expect(paragraph, `${law.slug} copy`).not.toContain("<");
        expect(paragraph, `${law.slug} copy entities`).not.toMatch(/&[a-z#0-9]+;/);
        expect(paragraph.length, `${law.slug} copy paragraph`).toBeGreaterThan(0);
      }
    }
  });

  it("carries dual provenance on the laws present on both sources", () => {
    const postels = lawBySlug["postels-law"]!;
    expect(postels.sources).toEqual([
      "https://lawsofux.com/postels-law/",
      "https://www.timsommer.be/famous-laws-of-software-development/",
    ]);
    const pareto = lawBySlug["pareto-principle"]!;
    expect(pareto.sources).toEqual([
      "https://lawsofux.com/pareto-principle/",
      "https://www.timsommer.be/famous-laws-of-software-development/",
    ]);
  });

  it("gives every software law a valid accent-derived color", () => {
    for (const slug of softwareSlugs) {
      expect(adaptLawColor(lawBySlug[slug]!.color), slug).toMatch(HEX_COLOR);
    }
  });
});
