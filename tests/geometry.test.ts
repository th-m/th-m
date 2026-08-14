import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  createBrandData,
  createHData,
  DISPLAY_STROKE_WORLD_PER_PIXEL,
  displayStrokeWorldWidth,
  fft,
  fourierPartialBezier,
  generateChordNetwork,
  generateFourier,
  H_ANIMATION,
  H_ISOLATED_VIEW,
  H_MATERIAL,
  H_STROKE_WORLD_PER_PIXEL,
  hStrokeWorldWidth,
  M_ANIMATION,
  M_SPLINE_CONTROLS,
  O_ANIMATION,
  O_DISPLAY_MATERIAL,
  PI_ANIMATION,
  PI_GEOMETRY,
  samplePathOutline,
  sampleBezierChain,
  sampleCatenary,
  sampleCompanionCatenary,
  type FilledPath,
} from "../src/brand/thom/geometry";
import { renderGlyphSvg, renderLogoSvg } from "../src/brand/thom/svg";
import { brandData } from "../src/brand/thom/brandData";

function endpoints(path: FilledPath) {
  return path.commands.flatMap((command) => command.type === "M" || command.type === "L" || command.type === "C" ? [{ x: command.x, y: command.y }] : []);
}

function pathBounds(path: FilledPath) {
  const points = path.commands.flatMap((command) => {
    if (command.type === "Z") return [];
    if (command.type === "C") return [
      { x: command.x1, y: command.y1 },
      { x: command.x2, y: command.y2 },
      { x: command.x, y: command.y },
    ];
    return [{ x: command.x, y: command.y }];
  });
  return {
    minX: Math.min(...points.map((point) => point.x)),
    maxX: Math.max(...points.map((point) => point.x)),
    minY: Math.min(...points.map((point) => point.y)),
    maxY: Math.max(...points.map((point) => point.y)),
  };
}

describe("THOM geometry", () => {
  it("commits a closed, bounded classical pi outline without a font glyph", () => {
    for (const path of [PI_GEOMETRY.display, PI_GEOMETRY.compact]) {
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

  it("keeps the reference-led pi proportions and exact 450ms construction contract", () => {
    expect(PI_ANIMATION.durationMs).toBe(450);
    expect(PI_ANIMATION.traceHoldEnd).toBeGreaterThan(0.5);
    const outline = samplePathOutline(PI_GEOMETRY.display);
    expect(outline).toHaveLength(192);
    expect(outline[0]).toEqual(outline.at(-1));
    expect(Math.min(...outline.map((point) => point.x))).toBeLessThanOrEqual(2.1);
    expect(Math.max(...outline.map((point) => point.x))).toBeGreaterThanOrEqual(98.8);
    expect(Math.max(...outline.map((point) => point.y)) - Math.min(...outline.map((point) => point.y))).toBeLessThan(95);
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

    const exactPrimary = sampleCatenary(129);
    const exactCompanion = sampleCompanionCatenary(129);
    expect(exactPrimary[64]).toEqual({ x: 50, y: 70 });
    expect(exactCompanion[64]).toEqual({ x: 50, y: 70 });
  });

  it("bounds the H with high-contrast bracketed serifs and narrow symmetric stems", () => {
    const h = createHData();
    const [left, right] = h.paths.map(pathBounds);
    expect(left.minX).toBeCloseTo(7.7, 10);
    expect(left.maxX).toBeCloseTo(26.3, 10);
    expect(right.minX).toBeCloseTo(73.7, 10);
    expect(right.maxX).toBeCloseTo(92.3, 10);
    expect([left.minY, left.maxY, right.minY, right.maxY]).toEqual([15, 104, 15, 104]);
    expect(h.axis).toEqual([{ x: 50, y: 8 }, { x: 50, y: 112 }]);
    expect(h.midpoint).toEqual({ x: 50, y: 70 });
  });

  it("settles the H construction between 220 and 740 ms with at most four percent overshoot", () => {
    expect(H_ANIMATION.delayMs).toBe(220);
    expect(H_ANIMATION.delayMs + H_ANIMATION.durationMs).toBe(H_ANIMATION.endMs);
    expect(H_ANIMATION.endMs).toBe(740);
    expect(H_ANIMATION.overshoot - 1).toBeCloseTo(0.04, 10);
    expect(H_ANIMATION.primaryRevealStart).toBeLessThan(H_ANIMATION.companionRevealStart);
    expect(H_ANIMATION.companionRevealStart).toBeLessThan(H_ANIMATION.midpointIgnitionStart);
  });

  it("keeps the H curve stack fine, layered, and quieter on the companion curve", () => {
    expect(H_MATERIAL.primary).toMatchObject({ coreWidth: 0.82, middleWidth: 1.55, haloWidth: 3.8 });
    expect(H_MATERIAL.companion).toMatchObject({ coreWidth: 0.5, middleWidth: 0.96, haloWidth: 2.3 });
    expect(H_MATERIAL.primary.coreWidth).toBeLessThan(1);
    expect(H_MATERIAL.primary.haloWidth).toBeGreaterThan(H_MATERIAL.primary.middleWidth);
    expect(H_MATERIAL.primary.middleWidth).toBeGreaterThan(H_MATERIAL.primary.coreWidth);
    expect(H_MATERIAL.companion.coreWidth).toBeLessThan(H_MATERIAL.primary.coreWidth);
    expect(H_MATERIAL.companion.middleOpacity).toBeLessThan(H_MATERIAL.primary.middleOpacity);
    expect(H_MATERIAL.companion.haloOpacity).toBeLessThan(H_MATERIAL.primary.haloOpacity);
  });

  it("expresses H construction strokes in world units so their pillar ratio survives responsive scaling", () => {
    expect(H_STROKE_WORLD_PER_PIXEL).toBe(0.7);
    expect(hStrokeWorldWidth(H_MATERIAL.primary.coreWidth)).toBeCloseTo(0.574, 10);
    expect(hStrokeWorldWidth(H_MATERIAL.companion.coreWidth)).toBeCloseTo(0.35, 10);
    const smallScale = 648 / 416;
    const largeScale = 1180 / 416;
    const smallPrimary = hStrokeWorldWidth(H_MATERIAL.primary.coreWidth) * smallScale;
    const largePrimary = hStrokeWorldWidth(H_MATERIAL.primary.coreWidth) * largeScale;
    expect(smallPrimary / largePrimary).toBeCloseTo(smallScale / largeScale, 10);
    expect(hStrokeWorldWidth(H_MATERIAL.primary.coreWidth) / 6).toBeCloseTo(largePrimary / (6 * largeScale), 10);
  });

  it("generates deterministic display and compact chord profiles", () => {
    for (const seed of ["THOM-01", "THOM-02", "THOM-03", "THOM-04"]) {
      const display = generateChordNetwork(seed, "display");
      expect(display).toEqual(generateChordNetwork(seed, "display"));
      expect(display.anchors).toHaveLength(12);
      expect(display.chords).toHaveLength(19);
      expect(display.intersections.length).toBeGreaterThanOrEqual(32);
      expect(display.intersections.length).toBeLessThanOrEqual(60);
      expect(display.highlights).toHaveLength(8);
      const quadrants = [0, 0, 0, 0];
      const highlightQuadrants = [0, 0, 0, 0];
      display.intersections.forEach((point) => { quadrants[(point.x >= 50 ? 1 : 0) + (point.y >= 59 ? 2 : 0)] += 1; });
      display.highlights.forEach((point) => { highlightQuadrants[(point.x >= 50 ? 1 : 0) + (point.y >= 59 ? 2 : 0)] += 1; });
      expect(Math.min(...quadrants)).toBeGreaterThanOrEqual(4);
      expect(Math.max(...quadrants) - Math.min(...quadrants)).toBeLessThanOrEqual(10);
      expect(highlightQuadrants).toEqual([2, 2, 2, 2]);
      const highlightDistances = display.highlights.flatMap((point, index) => display.highlights.slice(index + 1).map((other) => Math.hypot(point.x - other.x, point.y - other.y)));
      expect(Math.min(...highlightDistances)).toBeGreaterThanOrEqual(10);
      const highlightAngles = display.highlights.map((point) => (Math.atan2(point.y - 59, point.x - 50) + Math.PI * 2) % (Math.PI * 2)).sort((a, b) => a - b);
      const highlightGaps = highlightAngles.map((angle, index) => (highlightAngles[(index + 1) % highlightAngles.length] - angle + Math.PI * 2) % (Math.PI * 2));
      expect(Math.min(...highlightGaps)).toBeGreaterThanOrEqual(20 * Math.PI / 180);
      expect(Math.max(...highlightGaps)).toBeLessThanOrEqual(Math.PI / 2);
      expect(new Set(display.chords.map(({ a, b }) => `${a}:${b}`)).size).toBe(19);
      display.chords.forEach(({ a, b }) => {
        const angleA = Math.atan2(display.anchors[a].y - 59, display.anchors[a].x - 50);
        const angleB = Math.atan2(display.anchors[b].y - 59, display.anchors[b].x - 50);
        const raw = Math.abs(angleA - angleB) % (Math.PI * 2);
        expect(Math.min(raw, Math.PI * 2 - raw)).toBeGreaterThanOrEqual(display.seed === "THOM-01" ? 0.65 : Math.PI / 4 - 1e-7);
      });
    }

    const compact = generateChordNetwork("THOM-01", "compact");
    expect(compact).toEqual(generateChordNetwork("THOM-01", "compact"));
    expect(compact.anchors).toHaveLength(10);
    expect(compact.chords).toHaveLength(13);
    expect(compact.intersections.length).toBeGreaterThanOrEqual(8);
    expect(compact.intersections.length).toBeLessThanOrEqual(14);
    expect(O_ANIMATION.introDelay).toBe(0.48);
    expect(O_ANIMATION.introDelay + O_ANIMATION.introDuration).toBe(1.2);
    expect(O_ANIMATION.circle.start).toBeLessThan(O_ANIMATION.chord.start);
    expect(O_ANIMATION.chord.start).toBeLessThan(O_ANIMATION.intersection.start);
    expect(O_ANIMATION.intersection.start).toBeLessThan(O_ANIMATION.highlight.start);
  });

  it("expresses every display O line layer in glyph-relative world units", () => {
    expect(DISPLAY_STROKE_WORLD_PER_PIXEL).toBe(0.35);
    expect(displayStrokeWorldWidth(O_DISPLAY_MATERIAL.circle.coreWidth)).toBe(0.752);
    expect(displayStrokeWorldWidth(O_DISPLAY_MATERIAL.chord.coreWidth)).toBe(0.245);
    const smallScale = 648 / 416;
    const largeScale = 1180 / 416;
    const smallCore = displayStrokeWorldWidth(O_DISPLAY_MATERIAL.circle.coreWidth) * smallScale;
    const largeCore = displayStrokeWorldWidth(O_DISPLAY_MATERIAL.circle.coreWidth) * largeScale;
    expect(smallCore / largeCore).toBeCloseTo(smallScale / largeScale, 10);
    const glyph = renderGlyphSvg(brandData, "o");
    expect(glyph).not.toContain("vector-effect");
    expect(glyph).toContain(`stroke-width="${displayStrokeWorldWidth(O_DISPLAY_MATERIAL.circle.coreWidth)}"`);
  });

  it("uses a wider, lower real Fourier construction with persistent partial sums", () => {
    const fourier = generateFourier();
    expect(fourier.target).toHaveLength(128);
    expect(fourier.fftBins).toHaveLength(128);
    expect(fourier.coefficients).toHaveLength(13);
    expect(fourier.components).toHaveLength(12);
    expect(fourier.componentWidths).toHaveLength(12);
    expect(fourier.partialSums).toHaveLength(12);
    expect(fourier.restingPartialIndices).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(fourier.restingLayers).toHaveLength(11);
    expect(fourier.restingLayers.every((layer) => layer.amplitudeScale === 1)).toBe(true);
    expect(new Set(fourier.componentWidths).size).toBeGreaterThanOrEqual(10);
    expect(Math.max(...fourier.componentWidths) / Math.min(...fourier.componentWidths)).toBeGreaterThanOrEqual(2.5);
    expect(new Set(fourier.restingLayers.map((layer) => layer.width)).size).toBeGreaterThanOrEqual(9);
    expect(Math.max(...fourier.restingLayers.map((layer) => layer.width)) / Math.min(...fourier.restingLayers.map((layer) => layer.width))).toBeGreaterThanOrEqual(1.35);
    fourier.restingLayers.forEach((layer) => expect(layer.haloWidth).toBeGreaterThan(layer.width));
    expect(fourier.harmonicOrder).toEqual([2, 5, 4, 12, 9, 6, 10, 8, 3, 11, 7, 1]);
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
    for (const points of [fourier.target, ...fourier.partialSums, fourier.compact]) {
      points.forEach((point, index) => expect(point.y).toBeCloseTo(points[points.length - 1 - index].y, 8));
    }

    const separations = fourier.partialSums.slice(4).map((points, index) => {
      const previous = fourier.partialSums[index + 3];
      return Math.sqrt(points.reduce((sum, point, pointIndex) => sum + (point.y - previous[pointIndex].y) ** 2, 0) / points.length);
    }).sort((a, b) => a - b);
    const median = (separations[3] + separations[4]) / 2;
    expect(median).toBeGreaterThanOrEqual(0.2);
    expect(M_ANIMATION).toMatchObject({ delayMs: 780, durationMs: 820, endMs: 1600, replayDurationMs: 820 });
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

  it("converts every FFT partial into a continuous symmetric cubic Bézier chain", () => {
    const fourier = generateFourier();
    fourier.partialSums.forEach((_partial, partialIndex) => {
      const chain = fourierPartialBezier(fourier, partialIndex);
      const points = sampleBezierChain(chain, 8);
      expect(chain).toHaveLength(64);
      chain.slice(1).forEach((segment, index) => expect(segment.start).toEqual(chain[index].end));
      expect(points[0].x).toBe(2);
      expect(points.at(-1)?.x).toBe(98);
      expect(points[0].y).toBeCloseTo(points.at(-1)?.y ?? 0, 10);
      points.forEach((point, index) => expect(point.y).toBeCloseTo(points[points.length - 1 - index].y, 8));

      let maxError = 0;
      points.forEach((point, index) => {
        const progress = index / (points.length - 1);
        const expected = fourier.harmonicOrder.slice(0, partialIndex + 1).reduce((value, harmonic) => {
          const coefficient = fourier.coefficients[harmonic];
          const angle = Math.PI * 2 * harmonic * progress;
          return value + coefficient.a * Math.cos(angle) + coefficient.b * Math.sin(angle);
        }, fourier.coefficients[0].a / 2);
        maxError = Math.max(maxError, Math.abs(point.y - expected));
      });
      expect(maxError).toBeLessThan(0.005);
    });
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
    const glyph = renderGlyphSvg(brandData, "m");
    expect(glyph).toContain('viewBox="0 0 122 120"');
    expect(glyph).toContain('transform="scale(1.22 1)"');
    expect(glyph).toContain('id="thom-m-highlight"');
    expect(glyph.match(/<path/g)).toHaveLength(25);
    expect(glyph).not.toContain("<polyline");
    expect(glyph).not.toContain("non-scaling-stroke");
  });

  it("pins the deterministic committed M asset and Fourier payload", () => {
    const [glyphUrl] = ["../public/brand/glyph-m.svg"].map((path) => new URL(path, import.meta.url));
    const glyphHash = createHash("sha256")
      .update(readFileSync(glyphUrl))
      .digest("hex");
    const dataHash = createHash("sha256").update(JSON.stringify(brandData.m)).digest("hex");
    expect(glyphHash).toBe("5d6a9564a32f1f31b9380a268ee9ac18d39c079f4bb82e35be7629d039ada3b9");
    expect(dataHash).toBe("9e33f2ba91bf2f6fbdd725add87a9920f455bc9b4c46ef63290bd8ce07e8be9f");
  });

  it("renders the display H in its reference-calibrated isolated frame while keeping compact output ghost-free", () => {
    const display = renderGlyphSvg(brandData, "h");
    const compact = renderGlyphSvg(brandData, "h", "dark", true);
    expect(createHash("sha256").update(display).digest("hex")).toBe("ec43f78ed604931c435a323f88e450113a28d1c1acd5d1844e6b0ab9632c0848");
    expect(display).toContain(`viewBox="${H_ISOLATED_VIEW.x} ${H_ISOLATED_VIEW.y} ${H_ISOLATED_VIEW.width} ${H_ISOLATED_VIEW.height}"`);
    expect(display).toContain(`transform="scale(${H_ISOLATED_VIEW.scaleX} 1)"`);
    expect(display).toContain('id="thom-h-metal"');
    expect(display).toContain('stroke-dasharray="4 3"');
    expect(display).not.toContain("vector-effect");
    expect(display.match(/<circle/g)).toHaveLength(3);
    expect(compact).not.toContain("thom-fill-glow");
    expect(compact).not.toContain("stroke-dasharray");
    expect(compact).not.toContain("<circle");
    expect(compact.match(/<polyline/g)).toHaveLength(1);
  });

  it("keeps the master grid centered with a 122-unit M", () => {
    const data = createBrandData();
    expect(data.placements).toEqual({
      t: { x: 5.5, scaleX: 0.86, width: 86 },
      h: { x: 95.5, scaleX: 1, width: 100 },
      o: { x: 199.5, scaleX: 0.88, width: 88 },
      m: { x: 288.5, scaleX: 1.22, width: 122 },
    });
    expect(data.h.curve).toHaveLength(data.m.hero.length);
  });

  it("renders deterministic luminous SVG output", () => {
    const data = createBrandData();
    const first = renderLogoSvg(data);
    const second = renderLogoSvg(data);
    const hash = createHash("sha256").update(first).digest("hex");
    expect(first).toBe(second);
    expect(hash).toBe("b374c7b7c3fb5df0f5aaa76988fbec08b5f6052ab6fe0c6f039c8a70f0469103");
    expect(first).toContain("<title id=\"title\">THOM</title>");
    expect(first).toContain('viewBox="0 0 416 120"');
    expect(first).toContain('id="thom-metal"');
    expect(first).toContain("<path");
    expect(first).not.toContain("font-family");
    expect(first).not.toContain("non-scaling-stroke");
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
    expect(hash.digest("hex")).toBe("1238925d9cbec8612eedb0721e0cf922e45461bd859f8f1271f69287beb6afdc");
  });
});
