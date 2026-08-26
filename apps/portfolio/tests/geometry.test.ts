import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { PNG } from "pngjs";
import { describe, expect, it } from "vitest";
import {
  BRAND_COLORS,
  createBrandData,
  createHData,
  DISPLAY_STROKE_WORLD_PER_PIXEL,
  displayStrokeWorldWidth,
  fft,
  fourierPartialBezier,
  generateChordNetwork,
  generateFourier,
  generateGoldenSpiral,
  GOLDEN_RATIO,
  H_ANIMATION,
  H_COLUMN_MATERIAL,
  H_ISOLATED_VIEW,
  H_MATERIAL,
  H_PILLAR_CENTERS,
  H_PILLAR_SHAPE,
  H_PROPORTION,
  H_RATIO_POINT_MATERIAL,
  H_SPIRAL,
  H_STROKE_WORLD_PER_PIXEL,
  H_UNIT_BRACE,
  hStrokeWorldWidth,
  hSpiralFrame,
  M_ANIMATION,
  M_SPATIAL_ADJUSTMENT,
  M_WEBGL_CORE_PARITY_SCALE,
  M_SPLINE_CONTROLS,
  MASTER,
  O_ANIMATION,
  O_DISPLAY_MATERIAL,
  O_METAL_GRADIENT,
  OPTICAL_PLACEMENT_X,
  O_RADIUS,
  O_RADIUS_SCALE,
  PI_ANIMATION,
  PI_FILL_ENERGY_SCALE,
  PI_GEOMETRY,
  PI_WEBGL_MATERIAL,
  SOURCE_ENERGY_Q,
  SOURCE_ENERGY_SCALE,
  samplePathOutline,
  sampleBezierChain,
  type FilledPath,
} from "@th-m/thom-brand/geometry";
import { renderGlyphSvg, renderLogoSvg } from "../src/brand/thom/svg";
import { brandData } from "@th-m/thom-brand/brand-data";

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
  it("keeps the bounded source-energy update explicit and deterministic", () => {
    expect(SOURCE_ENERGY_Q).toEqual({ t: 0.852298, h: 1.116686, o: 1.096325, m: 1.113872 });
    expect(M_WEBGL_CORE_PARITY_SCALE).toBe(1.12);
    expect(PI_WEBGL_MATERIAL).toMatchObject({ shadow: "#50382f", highlight: "#f1dfbd", opacity: 1 });
    expect(PI_FILL_ENERGY_SCALE).toBeCloseTo(0.6658887, 6);
    for (const glyph of ["t", "h", "o", "m"] as const) {
      expect(SOURCE_ENERGY_Q[glyph]).toBeGreaterThanOrEqual(0.8);
      expect(SOURCE_ENERGY_Q[glyph]).toBeLessThanOrEqual(1.2);
      expect(SOURCE_ENERGY_SCALE[glyph]).toBeCloseTo(SOURCE_ENERGY_Q[glyph] ** 2, 12);
    }
  });

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

  it("keeps the canonical three-contour T and exact 450ms construction contract", () => {
    expect(PI_ANIMATION.durationMs).toBe(450);
    expect(PI_ANIMATION.traceHoldEnd).toBeGreaterThan(0.5);
    expect(PI_GEOMETRY.displayContours).toHaveLength(3);
    const outlines = PI_GEOMETRY.displayContours.map((contour) => samplePathOutline(contour));
    outlines.forEach((outline) => {
      expect(outline).toHaveLength(192);
      expect(outline[0].x).toBeCloseTo(outline.at(-1)!.x, 10);
      expect(outline[0].y).toBeCloseTo(outline.at(-1)!.y, 10);
    });
    const points = outlines.flat();
    expect(Math.min(...points.map((point) => point.x))).toBeCloseTo(2, 2);
    expect(Math.max(...points.map((point) => point.x))).toBeGreaterThan(98.9);
    expect(Math.max(...points.map((point) => point.x))).toBeLessThanOrEqual(99);
    expect(PI_GEOMETRY.displayContours[0].commands).toHaveLength(12);
    expect(PI_GEOMETRY.displayContours[1].commands).toHaveLength(7);
    expect(PI_GEOMETRY.displayContours[2].commands).toHaveLength(6);
  });

  it("divides the H crossbar into exact golden-ratio a and b segments", () => {
    const h = createHData();
    expect(GOLDEN_RATIO).toBeCloseTo(1.61803398875, 11);
    expect(H_PROPORTION).toMatchObject({ y: 60, startX: 27.23, endX: 72.77 });
    expect(H_PROPORTION.totalLength).toBeCloseTo(45.54, 10);
    expect(H_PROPORTION.splitX).toBeCloseTo(55.37526784767, 10);
    expect(h.proportion.a).toEqual([{ x: 27.23, y: 60 }, { x: H_PROPORTION.splitX, y: 60 }]);
    expect(h.proportion.b).toEqual([{ x: H_PROPORTION.splitX, y: 60 }, { x: 72.77, y: 60 }]);
    expect(h.proportion.ratioPoint).toEqual({ x: H_PROPORTION.splitX, y: 60 });
    expect(h.proportion.aLength / h.proportion.bLength).toBeCloseTo(GOLDEN_RATIO, 10);
    expect(h.proportion.totalLength / h.proportion.aLength).toBeCloseTo(GOLDEN_RATIO, 10);
    expect(h.proportion.ticks).toEqual([27.23, H_PROPORTION.splitX, 72.77].map((x) => [{ x, y: 57.2 }, { x, y: 62.8 }]));
    expect(h.proportion.brace[0]).toEqual({ x: H_PROPORTION.startX, y: H_UNIT_BRACE.topY });
    expect(h.proportion.brace.at(-1)).toEqual({ x: H_PROPORTION.endX, y: H_UNIT_BRACE.topY });
    const braceCusp = h.proportion.brace.reduce((deepest, point) => point.y > deepest.y ? point : deepest);
    expect(braceCusp).toEqual({ x: 50, y: H_UNIT_BRACE.cuspY });
    expect(Math.min(...h.proportion.brace.map((point) => point.x))).toBe(H_PROPORTION.startX);
    expect(Math.max(...h.proportion.brace.map((point) => point.x))).toBe(H_PROPORTION.endX);
  });

  it("bounds the H with high-contrast bracketed serifs and narrow symmetric stems", () => {
    const h = createHData();
    const [left, right] = h.paths.map(pathBounds);
    expect(H_PILLAR_CENTERS).toEqual([28, 72]);
    expect(H_PILLAR_SHAPE).toEqual({ serifHalfWidth: 5.772, topSerifHalfWidth: 5.476, stemHalfWidth: 1.6502 });
    expect(left.minX).toBeCloseTo(22.228, 10);
    expect(left.maxX).toBeCloseTo(33.772, 10);
    expect(right.minX).toBeCloseTo(66.228, 10);
    expect(right.maxX).toBeCloseTo(77.772, 10);
    expect([left.minY, left.maxY, right.minY, right.maxY]).toEqual([15, 104, 15, 104]);
    expect(h).not.toHaveProperty("curve");
    expect(h).not.toHaveProperty("axis");
    expect(h).not.toHaveProperty("midpoint");
  });

  it("traces a bounded logarithmic golden spiral and resolves between 220 and 1220 ms", () => {
    expect(H_ANIMATION.delayMs).toBe(220);
    expect(H_ANIMATION.delayMs + H_ANIMATION.durationMs).toBe(H_ANIMATION.endMs);
    expect(H_ANIMATION.durationMs).toBe(1000);
    expect(H_ANIMATION.endMs).toBe(1220);
    expect(H_ANIMATION.revealEnd).toBeLessThan(H_ANIMATION.traceEnd);
    expect(H_ANIMATION.traceEnd).toBeLessThan(H_ANIMATION.holdEnd);
    expect(H_ANIMATION.holdEnd).toBeLessThan(H_ANIMATION.fadeEnd);
    expect(H_SPIRAL).toMatchObject({ turns: 2.25, quarterTurns: 9, finalRadius: 32, segments: 180 });

    const points = generateGoldenSpiral();
    expect(points).toHaveLength(H_SPIRAL.segments + 1);
    expect(points[0]).toEqual({ x: H_PROPORTION.splitX, y: H_PROPORTION.y });
    const radii = points.map((point) => Math.hypot(point.x - H_PROPORTION.splitX, point.y - H_PROPORTION.y));
    radii.slice(2).forEach((radius, index) => expect(radius).toBeGreaterThan(radii[index + 1]));
    const quarterTurnRadii = Array.from({ length: H_SPIRAL.quarterTurns }, (_, index) => radii[(index + 1) * H_SPIRAL.segments / H_SPIRAL.quarterTurns]);
    quarterTurnRadii.slice(1).forEach((radius, index) => expect(radius / quarterTurnRadii[index]).toBeCloseTo(GOLDEN_RATIO, 6));
    expect(quarterTurnRadii.at(-1)).toBeCloseTo(H_SPIRAL.finalRadius, 10);
    points.forEach((point) => {
      expect(point.x).toBeGreaterThanOrEqual(22.228);
      expect(point.x).toBeLessThanOrEqual(77.772);
      expect(point.y).toBeGreaterThanOrEqual(15);
      expect(point.y).toBeLessThanOrEqual(104);
    });

    expect(hSpiralFrame(0)).toMatchObject({ phase: "spiral-trace", trace: 0, ratioPointOpacity: 0 });
    expect(hSpiralFrame(H_ANIMATION.traceEnd)).toMatchObject({ phase: "shell-hold", trace: 1, shellOpacity: 1 });
    expect(hSpiralFrame(H_ANIMATION.holdEnd)).toMatchObject({ phase: "shell-fade", trace: 1, shellOpacity: 1 });
    expect(hSpiralFrame(1)).toMatchObject({ phase: "settled", shellOpacity: 0, tracerOpacity: 0, ratioPointOpacity: 1 });
  });

  it("keeps the H proportion lines layered with equal-energy crossbar segments and quieter annotations", () => {
    expect(H_COLUMN_MATERIAL).toMatchObject({ edge: "#d1aa6e", body: "#e8cfa6", highlight: "#f9e8c7", highlightMix: 0.1, strokeWidth: 0.424 });
    expect(H_MATERIAL.a).toMatchObject({ coreWidth: 1.667142857142857, middleWidth: 2.15, haloWidth: 4.02 });
    expect(H_MATERIAL.b).toEqual(H_MATERIAL.a);
    expect(H_RATIO_POINT_MATERIAL).toBe(O_DISPLAY_MATERIAL.intersection);
    expect(H_MATERIAL.tick).toMatchObject({ coreWidth: 0.56, middleWidth: 0.88, haloWidth: 1.9 });
    expect(H_MATERIAL.brace).toMatchObject({ coreWidth: 0.46, middleWidth: 0.76, haloWidth: 1.6, coreOpacity: 0.68 });
    expect(H_MATERIAL.a.haloWidth).toBeGreaterThan(H_MATERIAL.a.middleWidth);
    expect(H_MATERIAL.a.middleWidth).toBeGreaterThan(H_MATERIAL.a.coreWidth);
    expect(H_MATERIAL.b.coreWidth).toBe(H_MATERIAL.a.coreWidth);
    expect(H_MATERIAL.b.middleOpacity).toBe(H_MATERIAL.a.middleOpacity);
    expect(H_MATERIAL.tick.coreWidth).toBeLessThan(H_MATERIAL.b.coreWidth);
    expect(H_MATERIAL.brace.coreWidth).toBeLessThan(H_MATERIAL.tick.coreWidth);
  });

  it("expresses H construction strokes in world units so their pillar ratio survives responsive scaling", () => {
    expect(H_STROKE_WORLD_PER_PIXEL).toBe(0.7);
    expect(hStrokeWorldWidth(H_MATERIAL.a.coreWidth)).toBeCloseTo(1.167, 10);
    expect(hStrokeWorldWidth(H_MATERIAL.b.coreWidth)).toBeCloseTo(1.167, 10);
    const smallScale = 648 / 460;
    const largeScale = 1180 / 460;
    const smallPrimary = hStrokeWorldWidth(H_MATERIAL.a.coreWidth) * smallScale;
    const largePrimary = hStrokeWorldWidth(H_MATERIAL.a.coreWidth) * largeScale;
    expect(smallPrimary / largePrimary).toBeCloseTo(smallScale / largeScale, 10);
    expect(hStrokeWorldWidth(H_MATERIAL.a.coreWidth) / 6).toBeCloseTo(largePrimary / (6 * largeScale), 10);
  });

  it("generates deterministic display and compact chord profiles", () => {
    expect(O_RADIUS_SCALE).toBe(0.98);
    expect(O_RADIUS).toBeCloseTo(40.18, 10);
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
      expect(Math.min(...highlightDistances)).toBeGreaterThanOrEqual(10 * O_RADIUS_SCALE);
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
    expect(O_METAL_GRADIENT).toEqual({
      start: { x: 0, y: 0 },
      end: { x: 100, y: 120 },
      stops: [
        { offset: 0, color: BRAND_COLORS.shadow },
        { offset: 0.28, color: BRAND_COLORS.gold },
        { offset: 0.49, color: BRAND_COLORS.highlight },
        { offset: 0.7, color: BRAND_COLORS.ivory },
        { offset: 1, color: BRAND_COLORS.shadow },
      ],
    });
    expect(O_DISPLAY_MATERIAL.circle.coreWidth).toBe(2.613);
    expect(O_DISPLAY_MATERIAL.circle.coreOpacity).toBe(0.84);
    expect(displayStrokeWorldWidth(O_DISPLAY_MATERIAL.chord.coreWidth)).toBe(0.289);
    const smallScale = 648 / 460;
    const largeScale = 1180 / 460;
    const smallCore = O_DISPLAY_MATERIAL.circle.coreWidth * smallScale;
    const largeCore = O_DISPLAY_MATERIAL.circle.coreWidth * largeScale;
    expect(smallCore / largeCore).toBeCloseTo(smallScale / largeScale, 10);
    const glyph = renderGlyphSvg(brandData, "o");
    expect(glyph).not.toContain("vector-effect");
    expect(glyph).toContain('id="thom-o-metal"');
    expect(glyph).toContain('stroke="url(#thom-o-metal)"');
    expect(glyph).toContain(`stroke-width="${O_DISPLAY_MATERIAL.circle.coreWidth}"`);
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
    expect(M_SPATIAL_ADJUSTMENT).toEqual({ centerY: 60, scaleY: 1.032, offsetY: 0 });
    expect(M_SPLINE_CONTROLS).toHaveLength(11);
    M_SPLINE_CONTROLS.forEach((point, index) => {
      const mirror = M_SPLINE_CONTROLS[M_SPLINE_CONTROLS.length - 1 - index];
      expect(point.x + mirror.x).toBeCloseTo(1, 10);
      expect(point.y).toBeCloseTo(mirror.y, 10);
    });
  });

  it("renders the settled display M from canonical geometry with added fine strands", () => {
    const glyph = renderGlyphSvg(brandData, "m");
    expect(glyph).toContain('viewBox="0 0 121 120"');
    expect(glyph).toContain('transform="translate(0 -26.7) scale(1 1.49)"');
    expect(glyph).toContain('id="thom-m-highlight"');
    expect(glyph.match(/<path/g)).toHaveLength(105);
    expect(glyph).not.toContain("<polyline");
    expect(glyph).not.toContain("non-scaling-stroke");
  });

  it("pins the deterministic committed M asset and Fourier payload", () => {
    const [glyphUrl] = ["../public/brand/glyph-m.svg"].map((path) => new URL(path, import.meta.url));
    const glyphHash = createHash("sha256")
      .update(readFileSync(glyphUrl))
      .digest("hex");
    const dataHash = createHash("sha256").update(JSON.stringify(brandData.m)).digest("hex");
    expect(glyphHash).toBe("10b234a336c53956e4471b17f1eab1aff6459f6850893edbb2178da5609cee3e");
    expect(dataHash).toBe("7ad2c0b82a5cad31dd39745f322eace22b25819d7ba5e77ce542855b72ca896d");
  });

  it("renders the display H in its reference-calibrated isolated frame while keeping compact output ghost-free", () => {
    const display = renderGlyphSvg(brandData, "h");
    const compact = renderGlyphSvg(brandData, "h", "dark", "compact");
    const micro = renderGlyphSvg(brandData, "h", "dark", "micro");
    expect(display).toContain(`viewBox="${H_ISOLATED_VIEW.x} ${H_ISOLATED_VIEW.y} ${H_ISOLATED_VIEW.width} ${H_ISOLATED_VIEW.height}"`);
    expect(display).toContain(`transform="scale(${H_ISOLATED_VIEW.scaleX} 1)"`);
    expect(display).toContain('id="thom-h-metal"');
    expect(display).toContain('data-h-part="a"');
    expect(display).toContain('data-h-part="b"');
    expect(display).toContain('data-h-part="tick-2"');
    expect(display).toContain('data-h-part="unit-brace"');
    expect(display).not.toContain("vector-effect");
    expect(display).not.toContain("stroke-dasharray");
    expect(display).toContain('data-h-part="ratio-point"');
    expect(display.match(/<ellipse/g)).toHaveLength(1);
    expect(display.match(/<polyline/g)).toHaveLength(18);
    expect(compact).not.toContain("thom-fill-glow");
    expect(compact).not.toContain("stroke-dasharray");
    expect(compact).not.toContain('data-h-part="ratio-point"');
    expect(compact).not.toContain('data-h-part="unit-brace"');
    expect(compact).not.toContain("tick-");
    expect(compact.match(/<polyline/g)).toHaveLength(2);
    expect(micro).toContain('data-h-part="crossbar"');
    expect(micro).not.toContain('data-h-part="a"');
    expect(micro.match(/<polyline/g)).toHaveLength(1);
  });

  it("pins the canonical 460 × 120 master transforms and optical spacing rhythm", () => {
    const data = createBrandData();
    expect(MASTER).toEqual({ width: 460, height: 120 });
    expect(data.placements).toEqual({
      t: { x: 22, y: -0.222, scaleX: 0.86, scaleY: 1.03, width: 86 },
      h: { x: 98.475, y: 0, scaleX: 1, scaleY: 1, width: 69 },
      o: { x: 182.5, y: -8.4, scaleX: 0.88, scaleY: 1.14, width: 77 },
      m: { x: 274.6, y: -26.7, scaleX: 1, scaleY: 1.49, width: 121 },
    });
    expect(OPTICAL_PLACEMENT_X).toEqual({
      display: { t: 0, h: 0, o: 0, m: 0 },
      compact: { t: 0, h: -0.85, o: -1.475, m: 0 },
      micro: { t: 0, h: -0.95, o: -1.675, m: 0 },
    });
    const visibleEdges = {
      tLeft: data.placements.t.x + 2 * data.placements.t.scaleX,
      tRight: data.placements.t.x + 99 * data.placements.t.scaleX,
      hLeft: data.placements.h.x + 22.228,
      hRight: data.placements.h.x + 77.772,
      oLeft: 190,
      oRight: 263,
      mLeft: data.placements.m.x + 2 * data.placements.m.scaleX,
      mRight: data.placements.m.x + 98 * data.placements.m.scaleX,
    };
    const gaps = [
      visibleEdges.hLeft - visibleEdges.tRight,
      visibleEdges.oLeft - visibleEdges.hRight,
      visibleEdges.mLeft - visibleEdges.oRight,
    ];
    expect(gaps[0]).toBeCloseTo(13.563, 3);
    expect(gaps[1]).toBeCloseTo(13.753, 3);
    expect(gaps[2]).toBeCloseTo(13.6, 3);
    expect(Math.max(...gaps) - Math.min(...gaps)).toBeLessThan(0.2);
    expect(data.h.proportion.aLength / data.h.proportion.bLength).toBeCloseTo(GOLDEN_RATIO, 10);
  });

  it("renders deterministic luminous SVG output", () => {
    const data = createBrandData();
    const first = renderLogoSvg(data);
    const second = renderLogoSvg(data);
    const hash = createHash("sha256").update(first).digest("hex");
    expect(first).toBe(second);
    expect(hash).toBe("5f152af44e695383e37891889b2983358162762591ed65f32dcf10f0f88e34fa");
    expect(first).toContain("<title id=\"title\">THOM</title>");
    expect(first).toContain('viewBox="0 0 460 120"');
    expect(first).toContain('id="thom-metal"');
    expect(first).toContain("<path");
    expect(first).not.toContain("font-family");
    expect(first).not.toContain("non-scaling-stroke");
  });

  it("keeps isolated T and O SVG frames in placement parity with WebGL", () => {
    const t = renderGlyphSvg(brandData, "t");
    const o = renderGlyphSvg(brandData, "o");
    expect(t).toContain('viewBox="-10 0 120 120"');
    expect(t).toContain('transform="translate(0 -0.222) scale(0.86 1.03)"');
    expect(o).toContain('viewBox="-16 0 120 120"');
    expect(o).toContain('transform="translate(0 -8.4) scale(0.88 1.14)"');
  });

  it("keeps the generated monochrome wordmark in raster parity with the canonical typography master", () => {
    const canonical = readFileSync(resolve(process.cwd(), "docs/brand/typography/thom-canonical.svg"), "utf8");
    const generated = renderLogoSvg(createBrandData(), "monochrome");
    const render = (svg: string) => PNG.sync.read(new Resvg(svg, { fitTo: { mode: "width", value: 920 } }).render().asPng());
    const expected = render(canonical);
    const actual = render(generated);
    let changedAlphaPixels = 0;
    for (let offset = 3; offset < expected.data.length; offset += 4) {
      if (Math.abs(expected.data[offset] - actual.data[offset]) > 8) changedAlphaPixels += 1;
    }
    expect(changedAlphaPixels / (expected.width * expected.height)).toBeLessThan(0.001);
  }, 20_000);

  it("keeps every committed generated brand asset deterministic", () => {
    const assetUrls = [
      "../public/brand/avatar.svg",
      "../public/brand/favicon.svg",
      "../public/brand/glyph-h.svg",
      "../public/brand/glyph-m.svg",
      "../public/brand/glyph-o.svg",
      "../public/brand/glyph-t.svg",
      "../public/brand/thom-compact.svg",
      "../public/brand/thom-micro.svg",
      "../public/brand/thom-light.svg",
      "../public/brand/thom-master.svg",
      "../public/brand/thom-monochrome.svg",
      "../public/brand/thom-og.png",
      "../public/brand/thom-og.svg",
      "../../../libs/thom-brand/src/generated/brand-data.json",
    ].map((path) => new URL(path, import.meta.url));
    const hash = createHash("sha256");
    assetUrls.forEach((url) => hash.update(readFileSync(url)));
    expect(hash.digest("hex")).toBe("658dd615c3fde096b34113956885d23401e01c99099de1517aea46e9cffd1a86");
  });
});
