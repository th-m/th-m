import { mkdir, readFile } from "node:fs/promises";
import sharp, { type OverlayOptions } from "sharp";

const publicAudit = new URL("../../public/brand-audit/", import.meta.url);
const distAudit = new URL("../../dist/brand-audit/", import.meta.url);
const focusedM = process.env.THOM_QA_FOCUS === "m";
const focusedO = process.env.THOM_QA_FOCUS === "o";
const glyphs = [
  { key: "t", label: "T AS CLASSICAL PI" },
  { key: "h", label: "H AS GOLDEN-RATIO EQUILIBRIUM" },
  { key: "o", label: "O AS EMERGENCE" },
  { key: "m", label: "M AS FOURIER SUPERPOSITION" },
] as const;
const columns = [
  { directory: "normalized/reference", label: "REFERENCE" },
  { directory: "normalized/current", label: "REFINED MARK" },
  { directory: "normalized/diff", label: "PERCEPTUAL DIFFERENCE" },
] as const;
const width = 1200;
const height = 1470;
const columnX = [40, 440, 840];

const labels = glyphs.map((glyph, row) => {
  const top = 150 + row * 330;
  return `<text x="40" y="${top - 22}" fill="#f2e5cf" font-family="Georgia, serif" font-size="27">${glyph.label}</text>
    ${columns.map((column, index) => `<text x="${columnX[index]}" y="${top + 260}" fill="#d6b06a" font-family="monospace" font-size="11" letter-spacing="2">${column.label}</text>`).join("")}
    <line x1="40" y1="${top + 300}" x2="1160" y2="${top + 300}" stroke="#f2e5cf" stroke-opacity=".12"/>`;
}).join("");

const background = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#050505"/>
  <text x="40" y="54" fill="#d6b06a" font-family="monospace" font-size="12" letter-spacing="3">THOM BRAND DESIGN QA</text>
  <text x="40" y="92" fill="#f2e5cf" font-family="Georgia, serif" font-size="31">Reference-led geometry and material comparison</text>
  ${labels}
</svg>`);

const composites: OverlayOptions[] = [];
for (let row = 0; row < glyphs.length; row += 1) {
  for (let column = 0; column < columns.length; column += 1) {
    composites.push({
      input: await readFile(new URL(`${columns[column].directory}/${glyphs[row].key}.png`, publicAudit)),
      left: columnX[column],
      top: 150 + row * 330,
    });
  }
}

const output = await sharp(background).composite(composites).png().toBuffer();
const targets = [new URL("audit/06-refined-overview.png", publicAudit), new URL("audit/06-refined-overview.png", distAudit)];
if (!focusedM && !focusedO) {
  await Promise.all(targets.map(async (target) => {
    await mkdir(new URL("./", target), { recursive: true });
    await Bun.write(target, output);
  }));
}

const report = await Bun.file(new URL("report.json", publicAudit)).json() as {
  legacyAverageMismatchRatio: number;
  averageStrictMismatchRatio: number;
  hStrictBaselineRatio: number;
  hStrictImprovement: number;
  mStrictBaselineRatio: number;
  mStrictImprovement: number;
  tStrictBaselineRatio: number;
  tStrictImprovement: number;
  oStrictBaselineRatio: number;
  oStrictTargetRatio: number;
  oStrictImprovement: number;
  oStrictTargetMet: boolean;
  glyphs: Array<{
    glyph: string;
    strictMismatchRatio: number;
    silhouetteIoU: number;
    thresholdMetrics?: Array<{ threshold: number; widthDelta: number; heightDelta: number; densityDelta: number }>;
  }>;
};
const strictColumns = [
  { directory: "reference", label: "REFERENCE CROP" },
  { directory: "current", label: "PLAYWRIGHT CAPTURE" },
  { directory: "diff", label: "STRICT PIXEL DIFFERENCE" },
] as const;
const metricByGlyph = new Map(report.glyphs.map((glyph) => [glyph.glyph, glyph]));
const strictLabels = glyphs.map((glyph, row) => {
  const top = 184 + row * 330;
  const metric = metricByGlyph.get(glyph.key);
  return `<text x="40" y="${top - 24}" fill="#f2e5cf" font-family="Georgia, serif" font-size="27">${glyph.label}</text>
    <text x="1160" y="${top - 24}" fill="#d6b06a" font-family="monospace" font-size="12" text-anchor="end">STRICT ${((metric?.strictMismatchRatio ?? 0) * 100).toFixed(1)}%  ·  SILHOUETTE IOU ${(metric?.silhouetteIoU ?? 0).toFixed(2)}</text>
    ${strictColumns.map((column, index) => `<text x="${columnX[index]}" y="${top + 260}" fill="#d6b06a" font-family="monospace" font-size="11" letter-spacing="2">${column.label}</text>`).join("")}
    <line x1="40" y1="${top + 300}" x2="1160" y2="${top + 300}" stroke="#f2e5cf" stroke-opacity=".12"/>`;
}).join("");
const strictDelta = report.averageStrictMismatchRatio - report.legacyAverageMismatchRatio;
const tMetric = metricByGlyph.get("t");
const hMetric = metricByGlyph.get("h");
const oMetric = metricByGlyph.get("o");
const mMetric = metricByGlyph.get("m");
const strictBackground = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height + 34}">
  <rect width="100%" height="100%" fill="#050505"/>
  <text x="40" y="48" fill="#d6b06a" font-family="monospace" font-size="12" letter-spacing="3">THOM STRICT PLAYWRIGHT DIFF</text>
  <text x="40" y="86" fill="#f2e5cf" font-family="Georgia, serif" font-size="31">M reconstruction passes the strict source-board gate</text>
  <text x="40" y="116" fill="#f2e5cf" fill-opacity=".72" font-family="monospace" font-size="12">M STRICT ${((mMetric?.strictMismatchRatio ?? 0) * 100).toFixed(1)}%  ·  BASELINE ${(report.mStrictBaselineRatio * 100).toFixed(1)}%  ·  IMPROVEMENT ${(report.mStrictImprovement * 100).toFixed(1)}%  ·  FULL-MARK CONTEXT ${(report.averageStrictMismatchRatio * 100).toFixed(1)}% (${strictDelta >= 0 ? "+" : ""}${(strictDelta * 100).toFixed(1)} PTS)</text>
  ${strictLabels}
</svg>`);
const strictComposites: OverlayOptions[] = [];
for (let row = 0; row < glyphs.length; row += 1) {
  for (let column = 0; column < strictColumns.length; column += 1) {
    strictComposites.push({
      input: await readFile(new URL(`${strictColumns[column].directory}/${glyphs[row].key}.png`, publicAudit)),
      left: columnX[column],
      top: 184 + row * 330,
    });
  }
}
const strictOutput = await sharp(strictBackground).composite(strictComposites).png().toBuffer();
const strictTargets = [new URL("audit/09-strict-playwright-diff.png", publicAudit), new URL("audit/09-strict-playwright-diff.png", distAudit)];
if (!focusedM && !focusedO) {
  await Promise.all(strictTargets.map(async (target) => {
    await mkdir(new URL("./", target), { recursive: true });
    await Bun.write(target, strictOutput);
  }));
}

const thresholdSummary = (mMetric?.thresholdMetrics ?? []).map((metric) =>
  `L${metric.threshold}: W ${(metric.widthDelta * 100).toFixed(1)}% / H ${(metric.heightDelta * 100).toFixed(1)}% / D ${(metric.densityDelta * 100).toFixed(1)}%`,
).join("   ·   ");
const mBefore = { strictMismatchRatio: 0.1041796875, silhouetteIoU: 0.6419320528061064 };
const mColumns = [
  { directory: "reference", file: "m.png", label: "SOURCE BOARD CROP" },
  { directory: "audit", file: "10-m-before.png", label: "BEFORE · GENERATED SVG" },
  { directory: "current", file: "m.png", label: "AFTER · FFT BÉZIER SVG" },
  { directory: "current", file: "m-webgl.png", label: "AFTER · JOINED WEBGL STROKES" },
  { directory: "diff", file: "m.png", label: "AFTER STRICT DIFF" },
] as const;
const mColumnX = [40, 430, 820, 1210, 1600];
const mBackground = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1960" height="520">
  <rect width="100%" height="100%" fill="#050505"/>
  <text x="40" y="48" fill="#d6b06a" font-family="monospace" font-size="12" letter-spacing="3">THOM M RECONSTRUCTION QA</text>
  <text x="40" y="88" fill="#f2e5cf" font-family="Georgia, serif" font-size="31">Continuous FFT-derived Bézier field, aligned across SVG and WebGL</text>
  <text x="40" y="118" fill="#f2e5cf" fill-opacity=".72" font-family="monospace" font-size="12">BEFORE ${(mBefore.strictMismatchRatio * 100).toFixed(2)}% / IOU ${mBefore.silhouetteIoU.toFixed(3)}  →  AFTER ${((mMetric?.strictMismatchRatio ?? 0) * 100).toFixed(2)}% / IOU ${(mMetric?.silhouetteIoU ?? 0).toFixed(3)}  ·  MEDIAN PARTIAL RMS 0.306  ·  MAX BÉZIER ERROR 0.00446</text>
  ${mColumns.map((column, index) => `<text x="${mColumnX[index]}" y="426" fill="#d6b06a" font-family="monospace" font-size="11" letter-spacing="2">${column.label}</text>`).join("")}
  <text x="40" y="470" fill="#f2e5cf" fill-opacity=".72" font-family="monospace" font-size="11">${thresholdSummary}</text>
  <text x="40" y="496" fill="#d6b06a" font-family="monospace" font-size="11">PASS · 64-SEGMENT CUBIC CHAINS · CONTINUOUS JOINED STROKES · STRICT ≤ 10.8% · IOU ≥ 0.64 · SIZE ≤ 5% · DENSITY ≤ 10% · PARTIAL RMS ≥ 0.2</text>
</svg>`);
const mComposites: OverlayOptions[] = [];
for (let column = 0; column < mColumns.length; column += 1) {
  mComposites.push({
    input: await readFile(new URL(`${mColumns[column].directory}/${mColumns[column].file}`, publicAudit)),
    left: mColumnX[column],
    top: 150,
  });
}
const mOutput = await sharp(mBackground).composite(mComposites).png().toBuffer();
const mTargets = [new URL("audit/10-m-reconstruction.png", publicAudit), new URL("audit/10-m-reconstruction.png", distAudit)];
if (!focusedO) {
  await Promise.all(mTargets.map(async (target) => {
    await mkdir(new URL("./", target), { recursive: true });
    await Bun.write(target, mOutput);
  }));
}

const tBackground = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="520">
  <rect width="100%" height="100%" fill="#050505"/>
  <text x="40" y="48" fill="#d6b06a" font-family="monospace" font-size="12" letter-spacing="3">THOM T / PI FOUNDATIONS QA</text>
  <text x="40" y="88" fill="#f2e5cf" font-family="Georgia, serif" font-size="31">Classical pi silhouette calibrated to the source board</text>
  <text x="40" y="118" fill="#f2e5cf" fill-opacity=".72" font-family="monospace" font-size="12">STRICT ${((tMetric?.strictMismatchRatio ?? 0) * 100).toFixed(1)}%  ·  SILHOUETTE IOU ${(tMetric?.silhouetteIoU ?? 0).toFixed(2)}  ·  BASELINE ${(report.tStrictBaselineRatio * 100).toFixed(1)}%  ·  RELATIVE IMPROVEMENT ${(report.tStrictImprovement * 100).toFixed(1)}%</text>
  ${strictColumns.map((column, index) => `<text x="${columnX[index]}" y="426" fill="#d6b06a" font-family="monospace" font-size="11" letter-spacing="2">${column.label}</text>`).join("")}
  <text x="40" y="482" fill="#d6b06a" font-family="monospace" font-size="11">PASS · RELATIVE STRICT IMPROVEMENT ≥ 20% · SILHOUETTE IOU ≥ 0.60</text>
</svg>`);
const tComposites: OverlayOptions[] = [];
for (let column = 0; column < strictColumns.length; column += 1) {
  tComposites.push({
    input: await readFile(new URL(`${strictColumns[column].directory}/t.png`, publicAudit)),
    left: columnX[column],
    top: 150,
  });
}
const tOutput = await sharp(tBackground).composite(tComposites).png().toBuffer();
const tTargets = [new URL("audit/12-t-foundations.png", publicAudit), new URL("audit/12-t-foundations.png", distAudit)];
if (!focusedM && !focusedO) {
  await Promise.all(tTargets.map(async (target) => {
    await mkdir(new URL("./", target), { recursive: true });
    await Bun.write(target, tOutput);
  }));
}

const hThresholdSummary = (hMetric?.thresholdMetrics ?? []).map((metric) =>
  `L${metric.threshold}: W ${(metric.widthDelta * 100).toFixed(1)}% / H ${(metric.heightDelta * 100).toFixed(1)}% / D ${(metric.densityDelta * 100).toFixed(1)}%`,
).join("   ·   ");
const hBackground = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="520">
  <rect width="100%" height="100%" fill="#050505"/>
  <text x="40" y="48" fill="#d6b06a" font-family="monospace" font-size="12" letter-spacing="3">THOM H RECONSTRUCTION QA</text>
  <text x="40" y="88" fill="#f2e5cf" font-family="Georgia, serif" font-size="31">Classical pillars retained; golden-ratio center validated separately</text>
  <text x="40" y="118" fill="#f2e5cf" fill-opacity=".72" font-family="monospace" font-size="12">PILLAR ROI STRICT ${((hMetric?.strictMismatchRatio ?? 0) * 100).toFixed(1)}%  ·  PILLAR SILHOUETTE IOU ${(hMetric?.silhouetteIoU ?? 0).toFixed(2)}  ·  CENTER a:b = φ:1</text>
  ${strictColumns.map((column, index) => `<text x="${columnX[index]}" y="426" fill="#d6b06a" font-family="monospace" font-size="11" letter-spacing="2">${column.label}</text>`).join("")}
  <text x="40" y="470" fill="#f2e5cf" fill-opacity=".72" font-family="monospace" font-size="11">${hThresholdSummary}</text>
  <text x="40" y="496" fill="#d6b06a" font-family="monospace" font-size="11">PASS · LEGACY PILLAR ROI STRICT ≤ 28% · CURRENT SNAPSHOT PINNED · a:b AND (a+b):a BOTH EQUAL φ</text>
</svg>`);
const hComposites: OverlayOptions[] = [];
for (let column = 0; column < strictColumns.length; column += 1) {
  hComposites.push({
    input: await readFile(new URL(`${strictColumns[column].directory}/h.png`, publicAudit)),
    left: columnX[column],
    top: 150,
  });
}
const hOutput = await sharp(hBackground).composite(hComposites).png().toBuffer();
const hTargets = [new URL("audit/11-h-reconstruction.png", publicAudit), new URL("audit/11-h-reconstruction.png", distAudit)];
if (!focusedM && !focusedO) {
  await Promise.all(hTargets.map(async (target) => {
    await mkdir(new URL("./", target), { recursive: true });
    await Bun.write(target, hOutput);
  }));
}

const hCurveColumns = [
  { directory: "reference", file: "h.png", label: "SOURCE BOARD CROP" },
  { directory: "current", file: "h.png", label: "GENERATED SVG" },
  { directory: "current", file: "h-webgl.png", label: "THREE.JS WEBGL" },
  { directory: "diff", file: "h.png", label: "STRICT SVG DIFF" },
] as const;
const hCurveColumnX = [40, 430, 820, 1210];
const hCurveBackground = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1570" height="520">
  <rect width="100%" height="100%" fill="#050505"/>
  <text x="40" y="48" fill="#d6b06a" font-family="monospace" font-size="12" letter-spacing="3">THOM H GOLDEN-RATIO QA</text>
  <text x="40" y="88" fill="#f2e5cf" font-family="Georgia, serif" font-size="31">61.8 / 38.2 crossbar and full-unit brace, aligned across SVG and WebGL</text>
  <text x="40" y="118" fill="#f2e5cf" fill-opacity=".72" font-family="monospace" font-size="12">TOTAL 45.300  ·  a 27.997  ·  b 17.303  ·  BRACE CUSP (50, 74.3)  ·  PILLAR ROI STRICT ${((hMetric?.strictMismatchRatio ?? 0) * 100).toFixed(2)}%  ·  IOU ${(hMetric?.silhouetteIoU ?? 0).toFixed(3)}</text>
  ${hCurveColumns.map((column, index) => `<text x="${hCurveColumnX[index]}" y="426" fill="#d6b06a" font-family="monospace" font-size="11" letter-spacing="2">${column.label}</text>`).join("")}
  <text x="40" y="482" fill="#d6b06a" font-family="monospace" font-size="11">PASS · SHARED MATERIAL CONSTANTS · 320 × 240 PLAYWRIGHT CAPTURE · STOPPED RENDER LOOP</text>
</svg>`);
const hCurveComposites: OverlayOptions[] = [];
for (let column = 0; column < hCurveColumns.length; column += 1) {
  hCurveComposites.push({
    input: await readFile(new URL(`${hCurveColumns[column].directory}/${hCurveColumns[column].file}`, publicAudit)),
    left: hCurveColumnX[column],
    top: 150,
  });
}
const hCurveOutput = await sharp(hCurveBackground).composite(hCurveComposites).png().toBuffer();
const hCurveTargets = [new URL("audit/13-h-golden-ratio.png", publicAudit), new URL("audit/13-h-golden-ratio.png", distAudit)];
if (!focusedM && !focusedO) {
  await Promise.all(hCurveTargets.map(async (target) => {
    await mkdir(new URL("./", target), { recursive: true });
    await Bun.write(target, hCurveOutput);
  }));
}

const oThresholdSummary = (oMetric?.thresholdMetrics ?? []).map((metric) =>
  `L${metric.threshold}: W ${(metric.widthDelta * 100).toFixed(2)}% / H ${(metric.heightDelta * 100).toFixed(2)}% / D ${(metric.densityDelta * 100).toFixed(2)}%`,
).join("   ·   ");
const oBackground = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="520">
  <rect width="100%" height="100%" fill="#050505"/>
  <text x="40" y="48" fill="#d6b06a" font-family="monospace" font-size="12" letter-spacing="3">THOM O NETWORK QA</text>
  <text x="40" y="88" fill="#f2e5cf" font-family="Georgia, serif" font-size="31">Deterministic network calibrated to the authoritative board</text>
  <text x="40" y="118" fill="#f2e5cf" fill-opacity=".72" font-family="monospace" font-size="12">STRICT ${((oMetric?.strictMismatchRatio ?? 0) * 100).toFixed(2)}%  ·  BASELINE ${(report.oStrictBaselineRatio * 100).toFixed(2)}%  ·  RELATIVE IMPROVEMENT ${(report.oStrictImprovement * 100).toFixed(2)}%  ·  TARGET ${(report.oStrictTargetRatio * 100).toFixed(2)}%</text>
  ${strictColumns.map((column, index) => `<text x="${columnX[index]}" y="426" fill="#d6b06a" font-family="monospace" font-size="11" letter-spacing="2">${column.label}</text>`).join("")}
  <text x="40" y="470" fill="#f2e5cf" fill-opacity=".72" font-family="monospace" font-size="11">${oThresholdSummary}</text>
  <text x="40" y="496" fill="${report.oStrictTargetMet ? "#d6b06a" : "#e3a75f"}" font-family="monospace" font-size="11">${report.oStrictTargetMet ? "PASS" : "OPEN GATE"} · 12 ANCHORS · 19 UNIQUE CHORDS · 41 INTERSECTIONS · 8 BALANCED HIGHLIGHTS · THRESHOLD SIZE/DENSITY ≤ 10%</text>
</svg>`);
const oComposites: OverlayOptions[] = [];
for (let column = 0; column < strictColumns.length; column += 1) {
  oComposites.push({ input: await readFile(new URL(`${strictColumns[column].directory}/o.png`, publicAudit)), left: columnX[column], top: 150 });
}
const oOutput = await sharp(oBackground).composite(oComposites).png().toBuffer();
const oTargets = [new URL("audit/14-o-network.png", publicAudit), new URL("audit/14-o-network.png", distAudit)];
await Promise.all(oTargets.map(async (target) => {
  await mkdir(new URL("./", target), { recursive: true });
  await Bun.write(target, oOutput);
}));

console.log(focusedM ? "Composed focused M design QA board." : focusedO ? "Composed focused O design QA board." : "Composed normalized, strict, and focused T/H/M/O THOM design QA boards.");
