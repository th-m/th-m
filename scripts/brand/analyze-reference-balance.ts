import { mkdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { PNG } from "pngjs";
import sharp, { type OverlayOptions } from "sharp";

type Glyph = "t" | "h" | "o" | "m";
type Bounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
};
type MaskStats = {
  mask: Uint8Array;
  bounds: Bounds;
  centroid: { x: number; y: number };
  pixels: number;
};

const glyphs: Glyph[] = ["t", "h", "o", "m"];
const thresholds = [18, 55, 140] as const;
const auditRoot = resolve(process.cwd(), "public/brand-audit");
const outputRoot = resolve(process.cwd(), ".codex/audits/logo-balance/reference-diff");
const frameSize = 256;

function makeMask(png: PNG, threshold: number): MaskStats {
  const mask = new Uint8Array(png.width * png.height);
  let minX = png.width;
  let minY = png.height;
  let maxX = -1;
  let maxY = -1;
  let sumX = 0;
  let sumY = 0;
  let pixels = 0;
  for (let index = 0; index < mask.length; index += 1) {
    const offset = index * 4;
    const luminance = (png.data[offset] + png.data[offset + 1] + png.data[offset + 2]) / 3;
    if (luminance <= threshold) continue;
    const x = index % png.width;
    const y = Math.floor(index / png.width);
    mask[index] = 1;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    sumX += x;
    sumY += y;
    pixels += 1;
  }
  const width = maxX >= minX ? maxX - minX + 1 : 0;
  const height = maxY >= minY ? maxY - minY + 1 : 0;
  return {
    mask,
    bounds: { minX, minY, maxX, maxY, width, height },
    centroid: { x: sumX / Math.max(1, pixels), y: sumY / Math.max(1, pixels) },
    pixels,
  };
}

function iou(first: Uint8Array, second: Uint8Array) {
  let intersection = 0;
  let union = 0;
  for (let index = 0; index < first.length; index += 1) {
    if (first[index] || second[index]) union += 1;
    if (first[index] && second[index]) intersection += 1;
  }
  return union === 0 ? 1 : intersection / union;
}

function shiftedIou(reference: Uint8Array, current: Uint8Array, width: number, height: number, dx: number, dy: number) {
  let intersection = 0;
  let union = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const referenceValue = reference[y * width + x];
      const sourceX = x - dx;
      const sourceY = y - dy;
      const currentValue = sourceX >= 0 && sourceX < width && sourceY >= 0 && sourceY < height
        ? current[sourceY * width + sourceX]
        : 0;
      if (referenceValue || currentValue) union += 1;
      if (referenceValue && currentValue) intersection += 1;
    }
  }
  return union === 0 ? 1 : intersection / union;
}

function bestTranslation(reference: MaskStats, current: MaskStats, width: number, height: number) {
  let best = { dx: 0, dy: 0, iou: shiftedIou(reference.mask, current.mask, width, height, 0, 0) };
  for (let dy = -16; dy <= 16; dy += 1) {
    for (let dx = -16; dx <= 16; dx += 1) {
      const candidate = shiftedIou(reference.mask, current.mask, width, height, dx, dy);
      if (candidate > best.iou) best = { dx, dy, iou: candidate };
    }
  }
  return best;
}

function normalizedMask(source: MaskStats, canvasWidth: number, targetWidth = frameSize, targetHeight = frameSize) {
  const output = new Uint8Array(targetWidth * targetHeight);
  const { bounds } = source;
  for (let y = 0; y < targetHeight; y += 1) {
    const sourceY = bounds.minY + Math.min(bounds.height - 1, Math.floor((y + 0.5) * bounds.height / targetHeight));
    for (let x = 0; x < targetWidth; x += 1) {
      const sourceX = bounds.minX + Math.min(bounds.width - 1, Math.floor((x + 0.5) * bounds.width / targetWidth));
      output[y * targetWidth + x] = source.mask[sourceY * canvasWidth + sourceX];
    }
  }
  return output;
}

function envelope(mask: Uint8Array, width: number, height: number) {
  const output = new Uint8Array(mask.length);
  for (let y = 0; y < height; y += 1) {
    let minX = width;
    let maxX = -1;
    for (let x = 0; x < width; x += 1) {
      if (!mask[y * width + x]) continue;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
    }
    for (let x = minX; x <= maxX; x += 1) output[y * width + x] = 1;
  }
  return output;
}

const signedRatio = (current: number, reference: number) => (current - reference) / Math.max(1, reference);
const round = (value: number) => Number(value.toFixed(6));

await mkdir(outputRoot, { recursive: true });
const report = {
  schemaVersion: 1,
  command: "bun run scripts/brand/analyze-reference-balance.ts",
  source: "Fresh Playwright captures from public/brand-audit/current compared with prepared source-board crops in public/brand-audit/reference.",
  glyphs: {} as Record<Glyph, unknown>,
};

for (const glyph of glyphs) {
  const referenceBuffer = await readFile(resolve(auditRoot, "reference", `${glyph}.png`));
  const currentBuffer = await readFile(resolve(auditRoot, "current", `${glyph}.png`));
  const referencePng = PNG.sync.read(referenceBuffer);
  const currentPng = PNG.sync.read(currentBuffer);
  const measurements = thresholds.map((threshold) => {
    const reference = makeMask(referencePng, threshold);
    const current = makeMask(currentPng, threshold);
    const translation = bestTranslation(reference, current, referencePng.width, referencePng.height);
    const normalizedReference = normalizedMask(reference, referencePng.width);
    const normalizedCurrent = normalizedMask(current, currentPng.width);
    return {
      threshold,
      reference: { bounds: reference.bounds, centroid: reference.centroid, pixels: reference.pixels },
      current: { bounds: current.bounds, centroid: current.centroid, pixels: current.pixels },
      signedDifference: {
        widthPixels: current.bounds.width - reference.bounds.width,
        widthRatio: round(signedRatio(current.bounds.width, reference.bounds.width)),
        heightPixels: current.bounds.height - reference.bounds.height,
        heightRatio: round(signedRatio(current.bounds.height, reference.bounds.height)),
        topPixels: current.bounds.minY - reference.bounds.minY,
        bottomPixels: current.bounds.maxY - reference.bounds.maxY,
        centroidXPixels: round(current.centroid.x - reference.centroid.x),
        centroidYPixels: round(current.centroid.y - reference.centroid.y),
      },
      comparison: {
        rawIou: round(shiftedIou(reference.mask, current.mask, referencePng.width, referencePng.height, 0, 0)),
        bestTranslation: { dx: translation.dx, dy: translation.dy, iou: round(translation.iou) },
        normalizedShapeIou: round(iou(normalizedReference, normalizedCurrent)),
        normalizedEnvelopeIou: round(iou(
          envelope(normalizedReference, frameSize, frameSize),
          envelope(normalizedCurrent, frameSize, frameSize),
        )),
      },
    };
  });
  report.glyphs[glyph] = { measurements };
}

await Bun.write(resolve(outputRoot, "report.json"), `${JSON.stringify(report, null, 2)}\n`);

const materialRows = glyphs.map((glyph) => {
  const measurement = (report.glyphs[glyph] as { measurements: Array<any> }).measurements.find((item) => item.threshold === 55);
  const difference = measurement.signedDifference;
  const comparison = measurement.comparison;
  return `| ${glyph.toUpperCase()} | ${difference.widthPixels >= 0 ? "+" : ""}${difference.widthPixels} (${(difference.widthRatio * 100).toFixed(1)}%) | ${difference.heightPixels >= 0 ? "+" : ""}${difference.heightPixels} (${(difference.heightRatio * 100).toFixed(1)}%) | ${difference.topPixels >= 0 ? "+" : ""}${difference.topPixels} | ${difference.bottomPixels >= 0 ? "+" : ""}${difference.bottomPixels} | ${difference.centroidYPixels >= 0 ? "+" : ""}${difference.centroidYPixels.toFixed(1)} | ${(comparison.normalizedEnvelopeIou * 100).toFixed(1)}% | ${(comparison.normalizedShapeIou * 100).toFixed(1)}% |`;
});
const coreRows = glyphs.map((glyph) => {
  const measurement = (report.glyphs[glyph] as { measurements: Array<any> }).measurements.find((item) => item.threshold === 140);
  const difference = measurement.signedDifference;
  return `| ${glyph.toUpperCase()} | ${difference.widthPixels >= 0 ? "+" : ""}${difference.widthPixels} (${(difference.widthRatio * 100).toFixed(1)}%) | ${difference.heightPixels >= 0 ? "+" : ""}${difference.heightPixels} (${(difference.heightRatio * 100).toFixed(1)}%) | ${difference.centroidYPixels >= 0 ? "+" : ""}${difference.centroidYPixels.toFixed(1)} |`;
});
const markdown = `# THOM Reference Balance Diff\n\nFresh Playwright captures compared with the supplied source-board glyph crops. Signed values are current minus reference; positive Y means the current glyph sits lower.\n\n## Material silhouette · luminance 55\n\n| Glyph | Width | Height | Top | Bottom | Centroid Y | Envelope match | Internal shape match |\n|---|---:|---:|---:|---:|---:|---:|---:|\n${materialRows.join("\n")}\n\n## High-contrast core · luminance 140\n\n| Glyph | Width | Height | Centroid Y |\n|---|---:|---:|---:|\n${coreRows.join("\n")}\n\nEnvelope match compares the outer row-by-row silhouette after removing width, height, and position. Internal shape match also includes counters, chords, and layered strokes.\n`;
await Bun.write(resolve(outputRoot, "report.md"), markdown);

const boardWidth = 1200;
const boardHeight = 1480;
const columnX = [40, 440, 840];
const columnLabels = ["REFERENCE", "PLAYWRIGHT CAPTURE", "PIXEL DIFFERENCE"];
const rows = glyphs.map((glyph, row) => {
  const measurement = (report.glyphs[glyph] as { measurements: Array<any> }).measurements.find((item) => item.threshold === 55);
  const difference = measurement.signedDifference;
  const top = 170 + row * 320;
  return `<text x="40" y="${top - 26}" fill="#f2e5cf" font-family="Georgia,serif" font-size="28">${glyph.toUpperCase()}</text>
    <text x="1160" y="${top - 26}" text-anchor="end" fill="#d6b06a" font-family="monospace" font-size="12">W ${difference.widthPixels >= 0 ? "+" : ""}${difference.widthPixels}px · H ${difference.heightPixels >= 0 ? "+" : ""}${difference.heightPixels}px · Y ${difference.centroidYPixels >= 0 ? "+" : ""}${difference.centroidYPixels.toFixed(1)}px</text>
    ${columnLabels.map((label, index) => `<text x="${columnX[index]}" y="${top + 260}" fill="#d6b06a" font-family="monospace" font-size="11" letter-spacing="2">${label}</text>`).join("")}
    <line x1="40" y1="${top + 286}" x2="1160" y2="${top + 286}" stroke="#f2e5cf" stroke-opacity=".12"/>`;
}).join("");
const background = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${boardWidth}" height="${boardHeight}">
  <rect width="100%" height="100%" fill="#050505"/>
  <text x="40" y="48" fill="#d6b06a" font-family="monospace" font-size="12" letter-spacing="3">THOM PLAYWRIGHT REFERENCE DIFF</text>
  <text x="40" y="90" fill="#f2e5cf" font-family="Georgia,serif" font-size="32">Signed width, height, and vertical alignment</text>
  <text x="40" y="118" fill="#f2e5cf" fill-opacity=".7" font-family="monospace" font-size="12">LUMINANCE 55 · CURRENT MINUS REFERENCE · POSITIVE Y SITS LOWER</text>
  ${rows}
</svg>`);
const composites: OverlayOptions[] = [];
for (let row = 0; row < glyphs.length; row += 1) {
  for (let column = 0; column < columnLabels.length; column += 1) {
    const directory = column === 0 ? "reference" : column === 1 ? "current" : "diff";
    composites.push({ input: await readFile(resolve(auditRoot, directory, `${glyphs[row]}.png`)), left: columnX[column], top: 170 + row * 320 });
  }
}
await sharp(background).composite(composites).png().toFile(resolve(outputRoot, "playwright-reference-diff.png"));

console.log(JSON.stringify({ output: outputRoot, report: resolve(outputRoot, "report.json") }, null, 2));
