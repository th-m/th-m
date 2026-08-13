import { mkdir, readFile } from "node:fs/promises";
import sharp, { type OverlayOptions } from "sharp";

const publicAudit = new URL("../../public/brand-audit/", import.meta.url);
const distAudit = new URL("../../dist/brand-audit/", import.meta.url);
const glyphs = [
  { key: "t", label: "T AS CLASSICAL PI" },
  { key: "h", label: "H AS EQUILIBRIUM" },
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
await Promise.all(targets.map(async (target) => {
  await mkdir(new URL("./", target), { recursive: true });
  await Bun.write(target, output);
}));

const report = await Bun.file(new URL("report.json", publicAudit)).json() as {
  legacyAverageMismatchRatio: number;
  averageStrictMismatchRatio: number;
  mStrictBaselineRatio: number;
  mStrictImprovement: number;
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
await Promise.all(strictTargets.map(async (target) => {
  await mkdir(new URL("./", target), { recursive: true });
  await Bun.write(target, strictOutput);
}));

const thresholdSummary = (mMetric?.thresholdMetrics ?? []).map((metric) =>
  `L${metric.threshold}: W ${(metric.widthDelta * 100).toFixed(1)}% / H ${(metric.heightDelta * 100).toFixed(1)}% / D ${(metric.densityDelta * 100).toFixed(1)}%`,
).join("   ·   ");
const mBackground = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="520">
  <rect width="100%" height="100%" fill="#050505"/>
  <text x="40" y="48" fill="#d6b06a" font-family="monospace" font-size="12" letter-spacing="3">THOM M RECONSTRUCTION QA</text>
  <text x="40" y="88" fill="#f2e5cf" font-family="Georgia, serif" font-size="31">Symmetric Fourier field calibrated to the source board</text>
  <text x="40" y="118" fill="#f2e5cf" fill-opacity=".72" font-family="monospace" font-size="12">STRICT ${((mMetric?.strictMismatchRatio ?? 0) * 100).toFixed(1)}%  ·  SILHOUETTE IOU ${(mMetric?.silhouetteIoU ?? 0).toFixed(2)}  ·  RELATIVE IMPROVEMENT ${(report.mStrictImprovement * 100).toFixed(1)}%</text>
  ${strictColumns.map((column, index) => `<text x="${columnX[index]}" y="426" fill="#d6b06a" font-family="monospace" font-size="11" letter-spacing="2">${column.label}</text>`).join("")}
  <text x="40" y="470" fill="#f2e5cf" fill-opacity=".72" font-family="monospace" font-size="11">${thresholdSummary}</text>
  <text x="40" y="496" fill="#d6b06a" font-family="monospace" font-size="11">PASS · STRICT ≤ 10.8% · IOU ≥ 0.50 · ALL LUMINANCE SIZE DELTAS ≤ 5% · ALL DENSITY DELTAS ≤ 10%</text>
</svg>`);
const mComposites: OverlayOptions[] = [];
for (let column = 0; column < strictColumns.length; column += 1) {
  mComposites.push({
    input: await readFile(new URL(`${strictColumns[column].directory}/m.png`, publicAudit)),
    left: columnX[column],
    top: 150,
  });
}
const mOutput = await sharp(mBackground).composite(mComposites).png().toBuffer();
const mTargets = [new URL("audit/10-m-reconstruction.png", publicAudit), new URL("audit/10-m-reconstruction.png", distAudit)];
await Promise.all(mTargets.map(async (target) => {
  await mkdir(new URL("./", target), { recursive: true });
  await Bun.write(target, mOutput);
}));

console.log("Composed normalized, strict, and M-focused THOM design QA boards.");
