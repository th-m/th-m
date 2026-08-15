import { resolve } from "node:path";
import {
  BRAND_COLORS,
  GLYPH_PLACEMENTS,
  H_COLUMN_MATERIAL,
  H_MATERIAL,
  H_PROPORTION,
  MASTER,
  M_FINAL_MATERIAL,
  O_DISPLAY_MATERIAL,
  PI_MATERIAL,
  createBrandData,
  displayStrokeWorldWidth,
  fourierPartialBezier,
  hStrokeWorldWidth,
  sampleBezierChain,
  samplePathOutline,
  type FilledPath,
  type Point,
} from "../../src/brand/thom/geometry";

const GLYPHS = ["t", "h", "o", "m"] as const;
type Glyph = (typeof GLYPHS)[number];
type EnergyTerm = {
  name: string;
  kind: "line" | "fill";
  measure: number;
  width?: number;
  opacity: number;
  luminance: number;
  energy: number;
};

const TARGETS = { t: 32, h: 26.5, o: 17, m: 25.5 } as const;
const variantArgument = process.argv.find((argument) => argument.startsWith("--variant="));
const baselineArgument = process.argv.find((argument) => argument.startsWith("--baseline="));
const variant = (variantArgument?.slice("--variant=".length) || "stroke-energy")
  .replace(/[^a-zA-Z0-9._-]/g, "-");
const baselineVariant = baselineArgument?.slice("--baseline=".length).replace(/[^a-zA-Z0-9._-]/g, "-");
const outputRoot = resolve(process.cwd(), ".codex/audits/logo-balance", variant);

const round = (value: number, digits = 6) => Number(value.toFixed(digits));
const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));
const srgbToLinear = (value: number) => {
  const channel = value / 255;
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
};

function colorLuminance(color: string) {
  const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(color);
  if (!match) throw new Error(`Expected a six-digit hex color, received ${color}`);
  const [, red, green, blue] = match;
  return 0.2126 * srgbToLinear(Number.parseInt(red, 16))
    + 0.7152 * srgbToLinear(Number.parseInt(green, 16))
    + 0.0722 * srgbToLinear(Number.parseInt(blue, 16));
}

function gradientLuminance(stops: ReadonlyArray<{ offset: number; color: string }>) {
  return stops.slice(1).reduce((sum, stop, index) => {
    const previous = stops[index];
    return sum + (stop.offset - previous.offset)
      * (colorLuminance(previous.color) + colorLuminance(stop.color)) / 2;
  }, 0);
}

function transformedLength(points: Point[], scaleX: number) {
  return points.slice(1).reduce((sum, point, index) => {
    const previous = points[index];
    return sum + Math.hypot((point.x - previous.x) * scaleX, point.y - previous.y);
  }, 0);
}

function pathArea(path: FilledPath, scaleX: number) {
  const points = samplePathOutline(path, 1024);
  return Math.abs(points.slice(1).reduce((sum, point, index) => {
    const previous = points[index];
    return sum + (previous.x * scaleX) * point.y - (point.x * scaleX) * previous.y;
  }, 0) / 2);
}

function pathPerimeter(path: FilledPath, scaleX: number) {
  return transformedLength(samplePathOutline(path, 1024), scaleX);
}

function lineTerm(name: string, points: Point[], scaleX: number, width: number, opacity: number, color: string): EnergyTerm {
  const measure = transformedLength(points, scaleX);
  const luminance = colorLuminance(color);
  return { name, kind: "line", measure, width, opacity, luminance, energy: measure * width * opacity * luminance };
}

function fillTerm(name: string, area: number, opacity: number, luminance: number): EnergyTerm {
  return { name, kind: "fill", measure: area, opacity, luminance, energy: area * opacity * luminance };
}

function circleTerm(name: string, radius: number, scaleX: number, opacity: number, color: string): EnergyTerm {
  return fillTerm(name, Math.PI * radius ** 2 * scaleX, opacity, colorLuminance(color));
}

function sumTerms(terms: EnergyTerm[]) {
  return terms.reduce((sum, term) => sum + term.energy, 0);
}

const data = createBrandData();
const tScale = GLYPH_PLACEMENTS.t.scaleX;
const hScale = GLYPH_PLACEMENTS.h.scaleX;
const oScale = GLYPH_PLACEMENTS.o.scaleX;
const mScale = GLYPH_PLACEMENTS.m.scaleX;
const tGradient = gradientLuminance([
  { offset: 0, color: PI_MATERIAL.shadow },
  { offset: 0.28, color: PI_MATERIAL.gold },
  { offset: 0.49, color: PI_MATERIAL.highlight },
  { offset: 0.7, color: PI_MATERIAL.ivory },
  { offset: 1, color: PI_MATERIAL.shadow },
]);
const hGradient = gradientLuminance([
  { offset: 0, color: H_COLUMN_MATERIAL.edge },
  { offset: 0.42, color: H_COLUMN_MATERIAL.body },
  { offset: 0.5, color: H_COLUMN_MATERIAL.highlight },
  { offset: 0.58, color: H_COLUMN_MATERIAL.body },
  { offset: 1, color: H_COLUMN_MATERIAL.edge },
]);
const mPartialGradient = gradientLuminance([
  { offset: 0, color: BRAND_COLORS.shadow },
  { offset: 0.14, color: BRAND_COLORS.gold },
  { offset: 0.86, color: BRAND_COLORS.gold },
  { offset: 1, color: BRAND_COLORS.shadow },
]);
const mFinalGradient = gradientLuminance([
  { offset: 0, color: BRAND_COLORS.shadow },
  { offset: 0.08, color: BRAND_COLORS.gold },
  { offset: 0.14, color: BRAND_COLORS.highlight },
  { offset: 0.86, color: BRAND_COLORS.highlight },
  { offset: 0.92, color: BRAND_COLORS.gold },
  { offset: 1, color: BRAND_COLORS.shadow },
]);

const terms: Record<Glyph, EnergyTerm[]> = { t: [], h: [], o: [], m: [] };
terms.t.push(fillTerm("pi-fill", pathArea(data.pi.display, tScale), PI_MATERIAL.opacity, tGradient));
terms.t.push(lineTerm(
  "pi-edge",
  samplePathOutline(data.pi.display, 1024),
  tScale,
  PI_MATERIAL.strokeWidth,
  PI_MATERIAL.opacity,
  PI_MATERIAL.edge,
));

data.h.paths.forEach((path, index) => {
  terms.h.push(fillTerm(`pillar-${index + 1}-fill`, pathArea(path, hScale), 1, hGradient));
  terms.h.push(lineTerm(
    `pillar-${index + 1}-edge`,
    samplePathOutline(path, 1024),
    hScale,
    H_COLUMN_MATERIAL.strokeWidth,
    1,
    BRAND_COLORS.gold,
  ));
});
const addHStack = (name: keyof typeof H_MATERIAL, points: Point[], coreColor: string) => {
  const material = H_MATERIAL[name];
  terms.h.push(lineTerm(`${name}-halo`, points, hScale, hStrokeWorldWidth(material.haloWidth), material.haloOpacity, BRAND_COLORS.gold));
  terms.h.push(lineTerm(`${name}-middle`, points, hScale, hStrokeWorldWidth(material.middleWidth), material.middleOpacity, BRAND_COLORS.gold));
  terms.h.push(lineTerm(`${name}-core`, points, hScale, hStrokeWorldWidth(material.coreWidth), material.coreOpacity, coreColor));
};
addHStack("a", data.h.proportion.a, BRAND_COLORS.highlight);
addHStack("b", data.h.proportion.b, BRAND_COLORS.highlight);
data.h.proportion.ticks.forEach((tick) => addHStack("tick", tick, BRAND_COLORS.gold));
addHStack("brace", data.h.proportion.brace, BRAND_COLORS.gold);

const addOStroke = (name: string, points: Point[], width: number, opacity: number, color: string) => {
  terms.o.push(lineTerm(name, points, oScale, displayStrokeWorldWidth(width), opacity, color));
};
addOStroke("circle-halo", data.o.circle, O_DISPLAY_MATERIAL.circle.haloWidth, O_DISPLAY_MATERIAL.circle.haloOpacity, BRAND_COLORS.gold);
addOStroke("circle-middle", data.o.circle, O_DISPLAY_MATERIAL.circle.middleWidth, O_DISPLAY_MATERIAL.circle.middleOpacity, BRAND_COLORS.gold);
addOStroke("circle-core", data.o.circle, O_DISPLAY_MATERIAL.circle.coreWidth, O_DISPLAY_MATERIAL.circle.coreOpacity, BRAND_COLORS.ivory);
data.o.canonical.chords.forEach((chord, index) => {
  const start = data.o.canonical.anchors[chord.a];
  const end = data.o.canonical.anchors[chord.b];
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const length = Math.hypot(deltaX, deltaY);
  const inset = 1.7;
  const points = [
    { x: start.x + deltaX / length * inset, y: start.y + deltaY / length * inset },
    { x: end.x - deltaX / length * inset, y: end.y - deltaY / length * inset },
  ];
  const weight = chord.weight ?? 0.55;
  addOStroke(`chord-${index + 1}-halo`, points, O_DISPLAY_MATERIAL.chord.haloWidth * (0.7 + weight * 0.6), O_DISPLAY_MATERIAL.chord.haloOpacity, BRAND_COLORS.gold);
  addOStroke(`chord-${index + 1}-core`, points, O_DISPLAY_MATERIAL.chord.coreWidthBase + weight * O_DISPLAY_MATERIAL.chord.coreWidthWeight, 0.38 + weight * 0.46, BRAND_COLORS.gold);
});
data.o.canonical.anchors.forEach((_point, index) => {
  terms.o.push(circleTerm(`anchor-${index + 1}-halo`, O_DISPLAY_MATERIAL.anchor.haloRadius, oScale, O_DISPLAY_MATERIAL.anchor.haloOpacity, BRAND_COLORS.gold));
  terms.o.push(circleTerm(`anchor-${index + 1}-core`, O_DISPLAY_MATERIAL.anchor.coreRadius, oScale, O_DISPLAY_MATERIAL.anchor.coreOpacity, BRAND_COLORS.highlight));
});
data.o.canonical.intersections.forEach((_point, index) => {
  terms.o.push(circleTerm(`intersection-${index + 1}`, O_DISPLAY_MATERIAL.intersection.radius, oScale, O_DISPLAY_MATERIAL.intersection.opacity, BRAND_COLORS.gold));
});
data.o.canonical.highlights.forEach((_point, index) => {
  terms.o.push(circleTerm(`highlight-${index + 1}-halo`, O_DISPLAY_MATERIAL.highlight.haloRadius, oScale, O_DISPLAY_MATERIAL.highlight.haloOpacity, BRAND_COLORS.gold));
  terms.o.push(circleTerm(`highlight-${index + 1}-core`, O_DISPLAY_MATERIAL.highlight.coreRadius, oScale, O_DISPLAY_MATERIAL.highlight.coreOpacity, BRAND_COLORS.highlight));
});

data.m.restingLayers.forEach((layer) => {
  const points = sampleBezierChain(fourierPartialBezier(data.m, layer.partialIndex, 64, layer.amplitudeScale), 8);
  terms.m.push(lineTerm(`partial-${layer.partialIndex + 1}-halo`, points, mScale, displayStrokeWorldWidth(layer.haloWidth), layer.haloOpacity, BRAND_COLORS.gold));
  const core = lineTerm(`partial-${layer.partialIndex + 1}-core`, points, mScale, displayStrokeWorldWidth(layer.width), layer.opacity, BRAND_COLORS.gold);
  core.luminance = mPartialGradient;
  core.energy = core.measure * (core.width ?? 0) * core.opacity * core.luminance;
  terms.m.push(core);
});
const finalPoints = sampleBezierChain(fourierPartialBezier(data.m, data.m.displayHarmonicCount - 1), 8);
terms.m.push(lineTerm("final-halo", finalPoints, mScale, displayStrokeWorldWidth(M_FINAL_MATERIAL.halo.width), M_FINAL_MATERIAL.halo.opacity, BRAND_COLORS.gold));
terms.m.push(lineTerm("final-middle", finalPoints, mScale, displayStrokeWorldWidth(M_FINAL_MATERIAL.middle.width), M_FINAL_MATERIAL.middle.opacity, BRAND_COLORS.gold));
const finalCore = lineTerm("final-core", finalPoints, mScale, displayStrokeWorldWidth(M_FINAL_MATERIAL.core.width), M_FINAL_MATERIAL.core.opacity, BRAND_COLORS.highlight);
finalCore.luminance = mFinalGradient;
finalCore.energy = finalCore.measure * (finalCore.width ?? 0) * finalCore.opacity * finalCore.luminance;
terms.m.push(finalCore);

const sourceEnergy = Object.fromEntries(GLYPHS.map((glyph) => [glyph, sumTerms(terms[glyph])])) as Record<Glyph, number>;
const sourceTotal = Object.values(sourceEnergy).reduce((sum, value) => sum + value, 0);
const rasterMetrics = await Bun.file(resolve(outputRoot, "metrics.json")).json();
const raster120 = rasterMetrics.sizes["120"];
const rasterEnergy = Object.fromEntries(GLYPHS.map((glyph) => [glyph, raster120.glyphs[glyph].opticalEnergy])) as Record<Glyph, number>;
const rasterTotal = Object.values(rasterEnergy).reduce((sum, value) => sum + value, 0);
const baselineSource = baselineVariant
  ? await Bun.file(resolve(process.cwd(), ".codex/audits/logo-balance", baselineVariant, "source-energy.json")).json()
  : null;
const baselineRaster = baselineVariant
  ? await Bun.file(resolve(process.cwd(), ".codex/audits/logo-balance", baselineVariant, "metrics.json")).json()
  : rasterMetrics;
const calibration = Object.fromEntries(GLYPHS.map((glyph) => {
  const source = baselineSource?.glyphs[glyph].sourceEnergy ?? sourceEnergy[glyph];
  const raster = baselineRaster.sizes["120"].glyphs[glyph].opticalEnergy;
  return [glyph, raster / source];
})) as Record<Glyph, number>;
const predictedRaster = Object.fromEntries(GLYPHS.map((glyph) => [glyph, sourceEnergy[glyph] * calibration[glyph]])) as Record<Glyph, number>;
const targetEnergy = Object.fromEntries(GLYPHS.map((glyph) => [glyph, rasterTotal * TARGETS[glyph] / 100])) as Record<Glyph, number>;

const glyphs = Object.fromEntries(GLYPHS.map((glyph) => {
  const rawQ = Math.sqrt(targetEnergy[glyph] / rasterEnergy[glyph]);
  const qNext = clamp(rawQ, 0.8, 1.2);
  return [glyph, {
    sourceEnergy: round(sourceEnergy[glyph]),
    sourceShare: round(sourceEnergy[glyph] / sourceTotal * 100, 4),
    renderedEnergy: round(rasterEnergy[glyph]),
    renderedShare: round(rasterEnergy[glyph] / rasterTotal * 100, 4),
    calibratedPredictedRenderedEnergy: round(predictedRaster[glyph]),
    predictionErrorRatio: round((predictedRaster[glyph] - rasterEnergy[glyph]) / rasterEnergy[glyph]),
    targetEnergy: round(targetEnergy[glyph]),
    update: {
      formula: "q_next = clamp(q * sqrt(E_target / E_rendered), 0.8, 1.2)",
      qCurrent: 1,
      qRaw: round(rawQ),
      qNext: round(qNext),
      impliedEnergyMultiplier: round(qNext ** 2),
    },
    sensitivity: [0.95, 1, 1.05].map((q) => ({
      q,
      sourceEnergy: round(sourceEnergy[glyph] * q ** 2),
      deltaRatio: round(q ** 2 - 1),
      elasticity: 2,
    })),
    terms: terms[glyph].map((term) => ({
      ...term,
      measure: round(term.measure),
      width: term.width === undefined ? undefined : round(term.width),
      luminance: round(term.luminance),
      energy: round(term.energy),
    })),
  }];
}));

const hA = terms.h.filter((term) => term.name.startsWith("a-")).reduce((sum, term) => sum + term.energy, 0);
const hB = terms.h.filter((term) => term.name.startsWith("b-")).reduce((sum, term) => sum + term.energy, 0);
const report = {
  schemaVersion: 1,
  variant,
  baselineVariant: baselineVariant ?? variant,
  revision: Bun.spawnSync(["git", "rev-parse", "HEAD"], { stdout: "pipe" }).stdout.toString().trim(),
  command: `bun run measure:brand:source-energy --variant=${variant}${baselineVariant ? ` --baseline=${baselineVariant}` : ""}`,
  equation: "E = sum(length * width * opacity * linearLuminance) + sum(area * opacity * linearLuminance)",
  assumptions: [
    "Authored source layers are additive; raster overlap, antialiasing, clipping, and SVG filters are captured by baseline calibration.",
    "Gradient luminance is trapezoid-integrated between authored stops in linear light.",
    "Bézier lengths and fill areas use deterministic high-resolution source sampling.",
    "The bounded q control has energy response E(q)=E(1)*q^2 for sensitivity reporting.",
  ],
  viewport: `${MASTER.width}x${MASTER.height}`,
  targetMidpoints: TARGETS,
  glyphs,
  hCrossbar: {
    geometricRatio: round(H_PROPORTION.aLength / H_PROPORTION.bLength),
    sourceEnergyPerUnit: {
      a: round(hA / H_PROPORTION.aLength),
      b: round(hB / H_PROPORTION.bLength),
      ratio: round((hA / H_PROPORTION.aLength) / (hB / H_PROPORTION.bLength)),
    },
  },
};

await Bun.write(resolve(outputRoot, "source-energy.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  variant,
  output: resolve(outputRoot, "source-energy.json"),
  glyphs: Object.fromEntries(GLYPHS.map((glyph) => [glyph, {
    sourceEnergy: glyphs[glyph].sourceEnergy,
    renderedEnergy: glyphs[glyph].renderedEnergy,
    predictedRenderedEnergy: glyphs[glyph].calibratedPredictedRenderedEnergy,
    predictionErrorRatio: glyphs[glyph].predictionErrorRatio,
    qNext: glyphs[glyph].update.qNext,
  }])),
  hCrossbar: report.hCrossbar,
}, null, 2));
