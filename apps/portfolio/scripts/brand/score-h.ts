import { chromium } from "playwright";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import sharp from "sharp";

const BASELINE_STRICT_MISMATCH = 0.24641927083333334;
const referencePath = new URL("../../public/brand-audit/reference/h.png", import.meta.url);

async function normalizeForeground(input: Buffer): Promise<Buffer> {
  const foreground = await sharp(input)
    .trim({ background: { r: 5, g: 5, b: 5, alpha: 1 }, threshold: 14 })
    .resize(288, 216, { fit: "contain", background: { r: 5, g: 5, b: 5, alpha: 1 }, kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();
  return sharp(foreground)
    .extend({ top: 12, bottom: 12, left: 16, right: 16, background: { r: 5, g: 5, b: 5, alpha: 1 } })
    .png()
    .toBuffer();
}

function silhouette(png: PNG, threshold: number) {
  const mask = new Uint8Array(png.width * png.height);
  let minX = png.width;
  let minY = png.height;
  let maxX = -1;
  let maxY = -1;
  let count = 0;
  for (let index = 0; index < mask.length; index += 1) {
    const offset = index * 4;
    const luminance = (png.data[offset] + png.data[offset + 1] + png.data[offset + 2]) / 3;
    if (luminance <= threshold) continue;
    mask[index] = 1;
    count += 1;
    const x = index % png.width;
    const y = Math.floor(index / png.width);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  return { mask, count, bounds: { minX, minY, maxX, maxY, width: maxX - minX + 1, height: maxY - minY + 1 } };
}

function intersectionOverUnion(first: Uint8Array, second: Uint8Array) {
  let intersection = 0;
  let union = 0;
  for (let index = 0; index < first.length; index += 1) {
    if (first[index] || second[index]) union += 1;
    if (first[index] && second[index]) intersection += 1;
  }
  return union === 0 ? 1 : intersection / union;
}

function luminousCentroid(png: PNG, region: { minX: number; maxX: number; minY: number; maxY: number }, threshold = 90) {
  let total = 0;
  let weightedX = 0;
  let weightedY = 0;
  for (let y = region.minY; y <= region.maxY; y += 1) {
    for (let x = region.minX; x <= region.maxX; x += 1) {
      const offset = (y * png.width + x) * 4;
      const luminance = (png.data[offset] + png.data[offset + 1] + png.data[offset + 2]) / 3;
      const weight = Math.max(0, luminance - threshold);
      total += weight;
      weightedX += x * weight;
      weightedY += y * weight;
    }
  }
  return { x: weightedX / total, y: weightedY / total };
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 900, height: 1200 }, deviceScaleFactor: 1 });
await page.goto("http://127.0.0.1:4173/brand-audit/fixture.html");
await page.locator('[data-glyph="h"] img').waitFor({ state: "visible" });
const currentBuffer = await page.locator('[data-glyph="h"] .current-frame').screenshot({ animations: "disabled" });
await browser.close();

const referenceBuffer = Buffer.from(await Bun.file(referencePath).arrayBuffer());
const current = PNG.sync.read(currentBuffer);
const reference = PNG.sync.read(referenceBuffer);
const diff = new PNG({ width: current.width, height: current.height });
const strictMismatchPixels = pixelmatch(reference.data, current.data, diff.data, current.width, current.height, {
  threshold: 0.1,
  includeAA: false,
});
const normalizedReference = PNG.sync.read(await normalizeForeground(referenceBuffer));
const normalizedCurrent = PNG.sync.read(await normalizeForeground(currentBuffer));
const referenceSilhouette = silhouette(normalizedReference, 55);
const currentSilhouette = silhouette(normalizedCurrent, 55);
const strictMismatchRatio = strictMismatchPixels / (current.width * current.height);

console.log(JSON.stringify({
  strictMismatchRatio,
  relativeStrictImprovement: 1 - strictMismatchRatio / BASELINE_STRICT_MISMATCH,
  silhouetteIoU: intersectionOverUnion(referenceSilhouette.mask, currentSilhouette.mask),
  normalizedBounds: {
    reference: referenceSilhouette.bounds,
    current: currentSilhouette.bounds,
  },
  midpoint: {
    reference: luminousCentroid(reference, { minX: 148, maxX: 184, minY: 127, maxY: 162 }),
    current: luminousCentroid(current, { minX: 148, maxX: 184, minY: 127, maxY: 162 }),
  },
}, null, 2));
