import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { chromium, type Page } from "@playwright/test";
import sharp from "sharp";
import { brandData } from "@th-m/thom-brand/brand-data";
import { fft, M_SPLINE_CONTROLS, type FourierData, type Point } from "@th-m/thom-brand/geometry";
import { renderGlyphSvg } from "../../src/brand/thom/svg";

const referenceBuffer = Buffer.from(await Bun.file(new URL("../../public/brand-audit/reference/m.png", import.meta.url)).arrayBuffer());
const reference = PNG.sync.read(referenceBuffer);
const sampleCount = 128;

function sampleHermite(controls: Point[], x: number): number {
  let index = 0;
  while (index < controls.length - 2 && controls[index + 1].x < x) index += 1;
  const p0 = controls[Math.max(0, index - 1)];
  const p1 = controls[index];
  const p2 = controls[index + 1];
  const p3 = controls[Math.min(controls.length - 1, index + 2)];
  const span = p2.x - p1.x || 1;
  const progress = (x - p1.x) / span;
  const m1 = index === 0 ? 0 : (p2.y - p0.y) / (p2.x - p0.x);
  const m2 = index + 1 === controls.length - 1 ? 0 : (p3.y - p1.y) / (p3.x - p1.x);
  const h00 = 2 * progress ** 3 - 3 * progress ** 2 + 1;
  const h10 = progress ** 3 - 2 * progress ** 2 + progress;
  const h01 = -2 * progress ** 3 + 3 * progress ** 2;
  const h11 = progress ** 3 - progress ** 2;
  return h00 * p1.y + h10 * span * m1 + h01 * p2.y + h11 * span * m2;
}

function fourierForOrder(harmonicOrder: number[], controls = M_SPLINE_CONTROLS): FourierData {
  const fftBins = fft(Array.from({ length: sampleCount }, (_, index) => ({ re: sampleHermite(controls, index / sampleCount), im: 0 })));
  const coefficients = Array.from({ length: 13 }, (_, n) => ({ n, a: 2 * fftBins[n].re / sampleCount, b: -2 * fftBins[n].im / sampleCount }));
  const xFor = (index: number) => 2 + 96 * index / (sampleCount - 1);
  const seriesAt = (progress: number, harmonics: number[]) => harmonics.reduce((value, n) => {
    const coefficient = coefficients[n];
    const angle = Math.PI * 2 * n * progress;
    return value + coefficient.a * Math.cos(angle) + coefficient.b * Math.sin(angle);
  }, coefficients[0].a / 2);
  const partialSums = Array.from({ length: 12 }, (_, term) => Array.from({ length: sampleCount }, (_, index) => ({
    x: xFor(index),
    y: seriesAt(index / (sampleCount - 1), harmonicOrder.slice(0, term + 1)),
  })));
  const baseline = coefficients[0].a / 2;
  const components = coefficients.slice(1).map((coefficient) => Array.from({ length: sampleCount }, (_, index) => {
    const angle = Math.PI * 2 * coefficient.n * index / (sampleCount - 1);
    return { x: xFor(index), y: baseline + coefficient.a * Math.cos(angle) + coefficient.b * Math.sin(angle) };
  }));
  const componentEnergies = harmonicOrder.map((harmonic) => Math.hypot(coefficients[harmonic].a, coefficients[harmonic].b));
  const maxComponentEnergy = Math.max(...componentEnergies);
  const componentWidths = componentEnergies.map((energy, index) => Number((0.38 + Math.log1p(energy) / Math.log1p(maxComponentEnergy) * 0.82 + index * 0.003).toFixed(3)));
  return {
    controls,
    fftBins,
    coefficients,
    harmonicOrder,
    displayHarmonicCount: 12,
    compactHarmonicCount: 4,
    restingPartialIndices: Array.from({ length: 11 }, (_, index) => index),
    restingLayers: Array.from({ length: 11 }, (_, index) => ({
      partialIndex: index,
      amplitudeScale: 1,
      width: 0.72 - index / 10 * 0.2,
      opacity: 0.5 - index / 10 * 0.28,
      haloWidth: 2.8,
      haloOpacity: 0.045,
    })),
    target: Array.from({ length: sampleCount }, (_, index) => ({ x: xFor(index), y: sampleHermite(controls, index / (sampleCount - 1)) })),
    components,
    componentWidths,
    partialSums,
    hero: partialSums[11],
    compact: Array.from({ length: sampleCount }, (_, index) => ({
      x: xFor(index),
      y: seriesAt(index / (sampleCount - 1), [1, 2, 3, 4]),
    })),
  };
}

function luminance(png: PNG, index: number) {
  const offset = index * 4;
  return (png.data[offset] + png.data[offset + 1] + png.data[offset + 2]) / 3;
}

function coverage(png: PNG, threshold: number) {
  let count = 0;
  for (let index = 0; index < png.width * png.height; index += 1) {
    if (luminance(png, index) > threshold) count += 1;
  }
  return count / (png.width * png.height);
}

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

function foregroundStats(png: PNG, threshold: number) {
  let count = 0;
  let minX = png.width;
  let minY = png.height;
  let maxX = -1;
  let maxY = -1;
  for (let index = 0; index < png.width * png.height; index += 1) {
    if (luminance(png, index) <= threshold) continue;
    count += 1;
    const x = index % png.width;
    const y = Math.floor(index / png.width);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  const width = maxX >= minX ? maxX - minX + 1 : 0;
  const height = maxY >= minY ? maxY - minY + 1 : 0;
  return { width, height, density: count / Math.max(1, width * height) };
}

function silhouetteMask(png: PNG, threshold: number) {
  return Uint8Array.from({ length: png.width * png.height }, (_, index) => luminance(png, index) > threshold ? 1 : 0);
}

function intersectionOverUnion(first: Uint8Array, second: Uint8Array) {
  let intersection = 0;
  let union = 0;
  for (let index = 0; index < first.length; index += 1) {
    if (first[index] || second[index]) union += 1;
    if (first[index] && second[index]) intersection += 1;
  }
  return intersection / union;
}

const normalizedReference = PNG.sync.read(await normalizeForeground(referenceBuffer));

async function score(page: Page, harmonicOrder: number[], controls: Point[]) {
  const data = structuredClone(brandData);
  data.m = fourierForOrder(harmonicOrder, controls);
  const svg = renderGlyphSvg(data, "m");
  await page.locator("img").evaluate((image, source) => new Promise<void>((resolve, reject) => {
    const target = image as HTMLImageElement;
    target.onload = () => resolve();
    target.onerror = () => reject(new Error("Candidate SVG failed to load"));
    target.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(source)))}`;
  }), svg);
  const frameBuffer = await page.locator("#frame").screenshot();
  const frame = PNG.sync.read(frameBuffer);
  const normalizedFrame = PNG.sync.read(await normalizeForeground(frameBuffer));
  return {
    mismatch: pixelmatch(reference.data, frame.data, undefined, 320, 240, { threshold: 0.1, includeAA: false }) / (320 * 240),
    coverage18: coverage(frame, 18),
    coverage55: coverage(frame, 55),
    coverage140: coverage(frame, 140),
    silhouetteIoU: intersectionOverUnion(silhouetteMask(normalizedReference, 18), silhouetteMask(normalizedFrame, 18)),
    thresholdMetrics: [18, 55, 140].map((threshold) => {
      const referenceStats = foregroundStats(reference, threshold);
      const currentStats = foregroundStats(frame, threshold);
      const delta = (key: "width" | "height" | "density") => Math.abs(referenceStats[key] - currentStats[key]) / referenceStats[key];
      return { threshold, widthDelta: delta("width"), heightDelta: delta("height"), densityDelta: delta("density") };
    }),
  };
}

const targetOrders = [[2, 5, 4, 12, 9, 6, 10, 8, 3, 11, 7, 1]];
const candidates: Array<{ controls: Point[]; order: number[]; mismatch: number; coverage18: number; coverage55: number; coverage140: number }> =
  targetOrders.map((order) => ({
    controls: M_SPLINE_CONTROLS,
    order,
    mismatch: 1,
    coverage18: 0,
    coverage55: 0,
    coverage140: 0,
  }));
const browser = await chromium.launch({ headless: true });
const pages = await Promise.all(Array.from({ length: 4 }, async () => {
  const page = await browser.newPage({ viewport: { width: 320, height: 240 }, deviceScaleFactor: 1 });
  await page.setContent(`<style>*{box-sizing:border-box}html,body{margin:0;background:#050505}#frame{width:320px;height:240px;display:grid;place-items:center;overflow:hidden;background:#050505}img{width:82%;height:auto}</style><div id="frame"><img alt=""></div>`);
  return page;
}));
for (let index = 0; index < candidates.length; index += pages.length) {
  await Promise.all(candidates.slice(index, index + pages.length).map(async (candidate, offset) => {
    Object.assign(candidate, await score(pages[offset], candidate.order, candidate.controls));
  }));
}
await browser.close();
candidates.sort((a, b) => a.mismatch - b.mismatch);
console.log(JSON.stringify(candidates.slice(0, 16), null, 2));
