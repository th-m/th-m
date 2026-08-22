import { describe, expect, it } from "vitest";
import { adaptLawColor } from "../src/adapt";
import { curatedLawBySlug, curatedLaws, lawBySlug, laws } from "../src/index";
import { lawLabels } from "../src/types";
import type { Law } from "../src/types";

const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const URL = /^https?:\/\/\S+$/;

describe("curated laws extension", () => {
  it("has unique ASCII slugs that do not collide with the snapshot", () => {
    const snapshotSlugs = new Set(
      laws.slice(0, laws.length - curatedLaws.length).map((law) => law.slug),
    );
    const slugs = curatedLaws.map((law) => law.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(KEBAB);
      expect(snapshotSlugs.has(slug), `${slug} collides with the snapshot`).toBe(false);
    }
  });

  it("appends the curated laws after the snapshot in the merged export", () => {
    expect(laws.length).toBeGreaterThan(curatedLaws.length);
    expect(laws.slice(-curatedLaws.length).map((law) => law.slug)).toEqual(
      curatedLaws.map((law) => law.slug),
    );
    expect(Object.keys(lawBySlug).sort()).toEqual(laws.map((law) => law.slug).sort());
  });

  it("completes every required field per curated law", () => {
    for (const law of curatedLaws) {
      expect(law.title.length, `${law.slug} title`).toBeGreaterThan(0);
      expect(law.definition.length, `${law.slug} definition`).toBeGreaterThan(0);
      expect(["theory", "psychology"], `${law.slug} category`).toContain(law.category);
      expect(law.color, `${law.slug} color`).toMatch(HEX_COLOR);
      expect(adaptLawColor(law.color), `${law.slug} adapted color`).toMatch(HEX_COLOR);
      expect(law.labels.length, `${law.slug} labels`).toBeGreaterThanOrEqual(1);
      for (const label of law.labels) {
        expect(lawLabels, `${law.slug} label ${label}`).toContain(label);
      }
      expect(law.copy.length, `${law.slug} copy`).toBeGreaterThanOrEqual(1);
      for (const paragraph of law.copy) {
        expect(paragraph.length, `${law.slug} copy paragraph`).toBeGreaterThan(0);
        expect(paragraph, `${law.slug} copy markup`).not.toContain("<");
      }
      expect(law.sources.length, `${law.slug} sources`).toBeGreaterThanOrEqual(1);
      for (const source of law.sources) {
        expect(source, `${law.slug} source url`).toMatch(URL);
      }
    }
  });

  it("resolves every curated related slug against the merged map", () => {
    for (const law of curatedLaws) {
      for (const slug of law.related) {
        expect(lawBySlug[slug], `${law.slug} related ${slug}`).toBeDefined();
      }
    }
  });

  it("keys curatedLawBySlug by every curated slug", () => {
    expect(Object.keys(curatedLawBySlug).sort()).toEqual(
      curatedLaws.map((law) => law.slug).sort(),
    );
    for (const law of curatedLaws) {
      expect(curatedLawBySlug[law.slug]).toBe(law);
    }
  });

  it("covers every curated collection label in the taxonomy", () => {
    const used = new Set(curatedLaws.flatMap((law: Law) => law.labels));
    const collectionLabels: Law["labels"][number][] = [
      "ai",
      "information",
      "economics",
      "epistemology",
      "physics",
    ];
    for (const collectionLabel of collectionLabels) {
      expect(used.has(collectionLabel), collectionLabel).toBe(true);
    }
  });
});
