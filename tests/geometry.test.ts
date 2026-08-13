import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  createBrandData,
  fft,
  generateChordNetwork,
  generateFourier,
  M_SPLINE_CONTROLS,
  sampleCatenary,
  sampleCompanionCatenary,
  type FilledPath,
} from "../src/brand/thom/geometry";
import { renderGlyphSvg, renderLogoSvg } from "../src/brand/thom/svg";

function endpoints(path: FilledPath) {
  return path.commands.flatMap((command) => command.type === "M" || command.type === "L" || command.type === "C" ? [{ x: command.x, y: command.y }] : []);
}

describe("THOM geometry", () => {
  it("commits a closed, bounded classical pi outline without a font glyph", () => {
    const data = createBrandData();
    for (const path of [data.pi.display, data.pi.compact]) {
      expect(path.commands[0]?.type).toBe("M");
      expect(path.commands.at(-1)?.type).toBe("Z");
      expect(path.commands.some((command) => command.type === "C")).toBe(true);
      for (const point of endpoints(path)) {
        expect(point.x).toBeGreaterThanOrEqual(0);
        expect(point.x).toBeLessThanOrEqual(100);
        expect(point.y).toBeGreaterThanOrEqual(0);
        expect(point.y).toBeLessThanOrEqual(120);
      }
    }
  });

  it("creates the primary and companion equilibrium curves with a shared midpoint", () => {
    const primary = sampleCatenary();
    const companion = sampleCompanionCatenary();
    expect(primary).toHaveLength(128);
    expect(companion).toHaveLength(128);
    expect(primary[0]).toEqual({ x: 24, y: 48 });
    expect(primary.at(-1)).toEqual({ x: 76, y: 48 });
    expect(companion[0]).toEqual({ x: 24, y: 60 });
    expect(companion.at(-1)).toEqual({ x: 76, y: 60 });
    expect(primary[63].y).toBeCloseTo(70, 1);
    expect(companion[63].y).toBeCloseTo(70, 1);
    primary.forEach((point, index) => expect(point.y).toBeCloseTo(primary[primary.length - 1 - index].y, 6));
    companion.forEach((point, index) => expect(point.y).toBeCloseTo(companion[companion.length - 1 - index].y, 6));
  });

  it("generates deterministic display and compact chord profiles", () => {
    for (const seed of ["THOM-01", "THOM-02", "THOM-03", "THOM-04"]) {
      const display = generateChordNetwork(seed, "display");
      expect(display).toEqual(generateChordNetwork(seed, "display"));
      expect(display.anchors).toHaveLength(12);
      expect(display.chords).toHaveLength(19);
      expect(display.intersections.length).toBeGreaterThanOrEqual(16);
      expect(display.intersections.length).toBeLessThanOrEqual(24);
      expect(display.highlights).toHaveLength(8);
      expect(new Set(display.intersections.map((point) => `${point.x >= 50 ? 1 : 0}${point.y >= 59 ? 1 : 0}`)).size).toBe(4);
      expect(new Set(display.chords.map(({ a, b }) => `${a}:${b}`)).size).toBe(19);
      display.chords.forEach(({ a, b }) => {
        const angleA = Math.atan2(display.anchors[a].y - 59, display.anchors[a].x - 50);
        const angleB = Math.atan2(display.anchors[b].y - 59, display.anchors[b].x - 50);
        const raw = Math.abs(angleA - angleB) % (Math.PI * 2);
        expect(Math.min(raw, Math.PI * 2 - raw)).toBeGreaterThanOrEqual(Math.PI / 4 - 1e-7);
      });
    }

    const compact = generateChordNetwork("THOM-01", "compact");
    expect(compact).toEqual(generateChordNetwork("THOM-01", "compact"));
    expect(compact.anchors).toHaveLength(10);
    expect(compact.chords).toHaveLength(13);
    expect(compact.intersections.length).toBeGreaterThanOrEqual(8);
    expect(compact.intersections.length).toBeLessThanOrEqual(14);
  });

  it("uses a wider, lower real Fourier construction with persistent partial sums", () => {
    const fourier = generateFourier();
    expect(fourier.target).toHaveLength(128);
    expect(fourier.fftBins).toHaveLength(128);
    expect(fourier.coefficients).toHaveLength(13);
    expect(fourier.components).toHaveLength(12);
    expect(fourier.partialSums).toHaveLength(12);
    expect(fourier.restingPartialIndices).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(fourier.restingLayers).toHaveLength(11);
    expect(fourier.harmonicOrder).toEqual([2, 3, 12, 9, 6, 5, 4, 10, 8, 11, 7, 1]);
    expect([...fourier.harmonicOrder].sort((a, b) => a - b)).toEqual(Array.from({ length: 12 }, (_, index) => index + 1));
    expect(fourier.hero).toEqual(fourier.partialSums[11]);
    expect(fourier.compact).toHaveLength(128);
    fourier.compact.forEach((point, index) => {
      const progress = index / (fourier.compact.length - 1);
      const expected = fourier.coefficients.slice(1, 5).reduce((value, coefficient) => {
        const angle = Math.PI * 2 * coefficient.n * progress;
        return value + coefficient.a * Math.cos(angle) + coefficient.b * Math.sin(angle);
      }, fourier.coefficients[0].a / 2);
      expect(point.y).toBeCloseTo(expected, 10);
    });
    expect(fourier.hero[0].x).toBeCloseTo(2);
    expect(fourier.hero.at(-1)?.x).toBeCloseTo(98);
    expect(fourier.hero[0].y).toBeCloseTo(fourier.hero.at(-1)?.y ?? 0, 10);
    expect(Math.min(...fourier.hero.map((point) => point.y))).toBeGreaterThan(24);
    expect(Math.max(...fourier.hero.map((point) => point.y))).toBeLessThan(94);
    expect(Math.max(...fourier.coefficients.slice(1).map((coefficient) => Math.abs(coefficient.b)))).toBeLessThan(1e-8);
    expect(fourier.target[0].y).toBeCloseTo(fourier.target.at(-1)?.y ?? 0, 10);
    for (const points of [fourier.target, fourier.hero, fourier.compact]) {
      points.forEach((point, index) => expect(point.y).toBeCloseTo(points[points.length - 1 - index].y, 8));
    }

    const separations = fourier.partialSums.slice(4).map((points, index) => {
      const previous = fourier.partialSums[index + 3];
      return Math.sqrt(points.reduce((sum, point, pointIndex) => sum + (point.y - previous[pointIndex].y) ** 2, 0) / points.length);
    }).sort((a, b) => a - b);
    const median = (separations[3] + separations[4]) / 2;
    expect(median).toBeGreaterThanOrEqual(0.2);
  });

  it("uses a deterministic radix-two FFT with inverse reconstruction", () => {
    const input = Array.from({ length: 128 }, (_, index) => ({ re: Math.cos(index * 0.17) + Math.sin(index * 0.31), im: 0 }));
    const transformed = fft(input);
    const reconstructed = fft(transformed, true);
    reconstructed.forEach((value, index) => {
      expect(value.re).toBeCloseTo(input[index].re, 10);
      expect(value.im).toBeCloseTo(0, 10);
    });
    expect(() => fft(Array.from({ length: 12 }, () => ({ re: 0, im: 0 })))).toThrow(/power of two/);
  });

  it("commits paired reference-calibrated M spline controls", () => {
    expect(M_SPLINE_CONTROLS).toHaveLength(11);
    M_SPLINE_CONTROLS.forEach((point, index) => {
      const mirror = M_SPLINE_CONTROLS[M_SPLINE_CONTROLS.length - 1 - index];
      expect(point.x + mirror.x).toBeCloseTo(1, 10);
      expect(point.y).toBeCloseTo(mirror.y, 10);
    });
  });

  it("renders the settled display M from the same geometry at the isolated 122-unit width", () => {
    const data = createBrandData();
    const glyph = renderGlyphSvg(data, "m");
    expect(glyph).toContain('viewBox="0 0 122 120"');
    expect(glyph).toContain('transform="scale(1.22 1)"');
    expect(glyph).toContain('id="thom-m-highlight"');
    expect(glyph.match(/<polyline/g)).toHaveLength(25);
  });

  it("keeps the master grid centered with a 122-unit M", () => {
    const data = createBrandData();
    expect(data.placements).toEqual({
      t: { x: 5.5, scaleX: 0.86, width: 86 },
      h: { x: 102.5, scaleX: 0.86, width: 86 },
      o: { x: 199.5, scaleX: 0.88, width: 88 },
      m: { x: 288.5, scaleX: 1.22, width: 122 },
    });
    expect(data.h.curve).toHaveLength(data.m.hero.length);
  });

  it("renders deterministic luminous SVG output", () => {
    const first = renderLogoSvg(createBrandData());
    const second = renderLogoSvg(createBrandData());
    const hash = createHash("sha256").update(first).digest("hex");
    expect(first).toBe(second);
    expect(hash).toBe("5bf8b3ab8a58c9cb75ca6095530528997744a4d282fdecd1088e2969d20138ef");
    expect(first).toContain("<title id=\"title\">THOM</title>");
    expect(first).toContain('viewBox="0 0 416 120"');
    expect(first).toContain('id="thom-metal"');
    expect(first).toContain("<path");
    expect(first).not.toContain("font-family");
  });

  it("keeps every committed generated brand asset deterministic", () => {
    const assetUrls = [
      "../public/brand/avatar.svg",
      "../public/brand/favicon.svg",
      "../public/brand/glyph-h.svg",
      "../public/brand/glyph-m.svg",
      "../public/brand/glyph-o.svg",
      "../public/brand/glyph-t.svg",
      "../public/brand/thom-compact.svg",
      "../public/brand/thom-light.svg",
      "../public/brand/thom-master.svg",
      "../public/brand/thom-monochrome.svg",
      "../public/brand/thom-og.png",
      "../public/brand/thom-og.svg",
      "../src/brand/thom/generated/brand-data.json",
    ].map((path) => new URL(path, import.meta.url));
    const hash = createHash("sha256");
    assetUrls.forEach((url) => hash.update(readFileSync(url)));
    expect(hash.digest("hex")).toBe("444353a3282bcbd789cebc34612b413eae8d17ca04e7c4879853d704ed96bba8");
  });
});
