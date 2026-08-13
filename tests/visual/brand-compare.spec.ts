import { expect, test } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import sharp from "sharp";

const root = new URL("../../public/brand-audit/", import.meta.url);
const distRoot = new URL("../../dist/brand-audit/", import.meta.url);
const currentDirectory = new URL("current/", root);
const referenceDirectory = new URL("reference/", root);
const diffDirectory = new URL("diff/", root);
const normalizedCurrentDirectory = new URL("normalized/current/", root);
const normalizedReferenceDirectory = new URL("normalized/reference/", root);
const normalizedDiffDirectory = new URL("normalized/diff/", root);
const distCurrentDirectory = new URL("current/", distRoot);
const distDiffDirectory = new URL("diff/", distRoot);
const distNormalizedDirectory = new URL("normalized/", distRoot);
const glyphs = ["t", "h", "o", "m"] as const;
const legacyBaseline = { t: 0.2551171875, h: 0.21404947916666667, o: 0.15912760416666666, m: 0.1273828125 } as const;

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

function maskStats(png: PNG, threshold: number) {
  const mask = new Uint8Array(png.width * png.height);
  const quadrants = [0, 0, 0, 0];
  let count = 0;
  for (let index = 0; index < mask.length; index += 1) {
    const offset = index * 4;
    const luminance = (png.data[offset] + png.data[offset + 1] + png.data[offset + 2]) / 3;
    if (luminance <= threshold) continue;
    mask[index] = 1;
    count += 1;
    const x = index % png.width;
    const y = Math.floor(index / png.width);
    quadrants[(x >= png.width / 2 ? 1 : 0) + (y >= png.height / 2 ? 2 : 0)] += 1;
  }
  return { mask, coverage: count / mask.length, quadrants: quadrants.map((value) => value / (mask.length / 4)) };
}

function foregroundStats(png: PNG, threshold: number) {
  let count = 0;
  let minX = png.width;
  let minY = png.height;
  let maxX = -1;
  let maxY = -1;
  for (let index = 0; index < png.width * png.height; index += 1) {
    const offset = index * 4;
    const luminance = (png.data[offset] + png.data[offset + 1] + png.data[offset + 2]) / 3;
    if (luminance <= threshold) continue;
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

const relativeDelta = (reference: number, current: number) => Math.abs(reference - current) / Math.max(Number.EPSILON, reference);

function intersectionOverUnion(first: Uint8Array, second: Uint8Array) {
  let intersection = 0;
  let union = 0;
  for (let index = 0; index < first.length; index += 1) {
    if (first[index] || second[index]) union += 1;
    if (first[index] && second[index]) intersection += 1;
  }
  return union === 0 ? 1 : intersection / union;
}

test("captures stable brand snapshots and meets the reference-fidelity gate", async ({ page }) => {
  const directories = [
    currentDirectory, diffDirectory, normalizedCurrentDirectory, normalizedReferenceDirectory, normalizedDiffDirectory,
    distCurrentDirectory, distDiffDirectory, new URL("current/", distNormalizedDirectory), new URL("reference/", distNormalizedDirectory), new URL("diff/", distNormalizedDirectory),
  ];
  await Promise.all(directories.map((directory) => mkdir(directory, { recursive: true })));
  await page.goto("/brand-audit/fixture.html");
  await page.locator("img").last().waitFor({ state: "visible" });

  const report: Array<{
    glyph: string;
    strictMismatchRatio: number;
    perceptualMismatchRatio: number;
    improvementFromLegacyBaseline: number;
    silhouetteIoU: number;
    referenceCoverage: number;
    currentCoverage: number;
    coverageDelta: number;
    quadrantDistributionDelta: number;
    thresholdMetrics?: Array<{
      threshold: number;
      reference: { width: number; height: number; density: number };
      current: { width: number; height: number; density: number };
      widthDelta: number;
      heightDelta: number;
      densityDelta: number;
    }>;
  }> = [];

  for (const glyph of glyphs) {
    const frame = page.locator(`[data-glyph="${glyph}"] .current-frame`);
    const currentBuffer = await frame.screenshot({ animations: "disabled" });
    await expect(currentBuffer).toMatchSnapshot(`current-${glyph}.png`, { maxDiffPixelRatio: 0.01 });
    await writeFile(new URL(`${glyph}.png`, currentDirectory), currentBuffer);
    await writeFile(new URL(`${glyph}.png`, distCurrentDirectory), currentBuffer);

    const referenceBuffer = await readFile(new URL(`${glyph}.png`, referenceDirectory));
    const current = PNG.sync.read(currentBuffer);
    const reference = PNG.sync.read(referenceBuffer);
    expect({ width: current.width, height: current.height }).toEqual({ width: reference.width, height: reference.height });

    const rawDiff = new PNG({ width: current.width, height: current.height });
    const strictMismatchPixels = pixelmatch(reference.data, current.data, rawDiff.data, current.width, current.height, {
      threshold: 0.1,
      includeAA: false,
      alpha: 0.42,
      diffColor: [255, 245, 220],
      aaColor: [214, 176, 106],
    });
    const rawDiffBuffer = PNG.sync.write(rawDiff);
    await writeFile(new URL(`${glyph}.png`, diffDirectory), rawDiffBuffer);
    await writeFile(new URL(`${glyph}.png`, distDiffDirectory), rawDiffBuffer);

    const normalizedCurrentBuffer = await normalizeForeground(currentBuffer);
    const normalizedReferenceBuffer = await normalizeForeground(referenceBuffer);
    const normalizedCurrent = PNG.sync.read(normalizedCurrentBuffer);
    const normalizedReference = PNG.sync.read(normalizedReferenceBuffer);
    const normalizedDiff = new PNG({ width: 320, height: 240 });
    const perceptualMismatchPixels = pixelmatch(
      normalizedReference.data,
      normalizedCurrent.data,
      normalizedDiff.data,
      320,
      240,
      { threshold: 0.38, includeAA: false, alpha: 0.42, diffColor: [255, 245, 220], aaColor: [214, 176, 106] },
    );
    const normalizedDiffBuffer = PNG.sync.write(normalizedDiff);
    const normalizedOutputs = [
      [normalizedCurrentDirectory, normalizedCurrentBuffer],
      [normalizedReferenceDirectory, normalizedReferenceBuffer],
      [normalizedDiffDirectory, normalizedDiffBuffer],
      [new URL("current/", distNormalizedDirectory), normalizedCurrentBuffer],
      [new URL("reference/", distNormalizedDirectory), normalizedReferenceBuffer],
      [new URL("diff/", distNormalizedDirectory), normalizedDiffBuffer],
    ] as const;
    await Promise.all(normalizedOutputs.map(([directory, buffer]) => writeFile(new URL(`${glyph}.png`, directory), buffer)));

    const silhouetteThreshold = glyph === "t" || glyph === "h" ? 55 : glyph === "m" ? 18 : 24;
    const referenceMask = maskStats(normalizedReference, silhouetteThreshold);
    const currentMask = maskStats(normalizedCurrent, silhouetteThreshold);
    const silhouetteIoU = intersectionOverUnion(referenceMask.mask, currentMask.mask);
    const perceptualMismatchRatio = perceptualMismatchPixels / (320 * 240);
    const quadrantDistributionDelta = referenceMask.quadrants.reduce((sum, value, index) => sum + Math.abs(value - currentMask.quadrants[index]), 0) / 4;
    const improvementFromLegacyBaseline = 1 - perceptualMismatchRatio / legacyBaseline[glyph];

    const thresholdMetrics = glyph === "m" ? [18, 55, 140].map((threshold) => {
      const referenceStats = foregroundStats(reference, threshold);
      const currentStats = foregroundStats(current, threshold);
      return {
        threshold,
        reference: referenceStats,
        current: currentStats,
        widthDelta: relativeDelta(referenceStats.width, currentStats.width),
        heightDelta: relativeDelta(referenceStats.height, currentStats.height),
        densityDelta: relativeDelta(referenceStats.density, currentStats.density),
      };
    }) : undefined;
    const strictMismatchRatio = strictMismatchPixels / (320 * 240);

    report.push({
      glyph,
      strictMismatchRatio,
      perceptualMismatchRatio,
      improvementFromLegacyBaseline,
      silhouetteIoU,
      referenceCoverage: referenceMask.coverage,
      currentCoverage: currentMask.coverage,
      coverageDelta: Math.abs(referenceMask.coverage - currentMask.coverage),
      quadrantDistributionDelta,
      thresholdMetrics,
    });

    if (glyph !== "m") expect(perceptualMismatchRatio).toBeLessThanOrEqual(legacyBaseline[glyph] * 0.8);
    if (glyph === "t") expect(silhouetteIoU).toBeGreaterThanOrEqual(0.45);
    if (glyph === "h") expect(silhouetteIoU).toBeGreaterThanOrEqual(0.18);
    if (glyph === "o") expect(Math.abs(referenceMask.coverage - currentMask.coverage)).toBeLessThanOrEqual(0.07);
    if (glyph === "m") {
      expect(strictMismatchRatio).toBeLessThanOrEqual(0.108);
      expect(silhouetteIoU).toBeGreaterThanOrEqual(0.5);
      thresholdMetrics?.forEach((metric) => {
        expect(metric.widthDelta).toBeLessThanOrEqual(0.05);
        expect(metric.heightDelta).toBeLessThanOrEqual(0.05);
        expect(metric.densityDelta).toBeLessThanOrEqual(0.1);
      });
    }
  }

  const masterBuffer = await page.locator('[data-lockup="master"] .lockup-frame').screenshot({ animations: "disabled" });
  const compactBuffer = await page.locator('[data-lockup="compact"] .lockup-frame').screenshot({ animations: "disabled" });
  await expect(masterBuffer).toMatchSnapshot("current-master.png", { maxDiffPixelRatio: 0.01 });
  await expect(compactBuffer).toMatchSnapshot("current-compact.png", { maxDiffPixelRatio: 0.01 });

  const averagePerceptualMismatchRatio = report.reduce((sum, item) => sum + item.perceptualMismatchRatio, 0) / report.length;
  const averageStrictMismatchRatio = report.reduce((sum, item) => sum + item.strictMismatchRatio, 0) / report.length;
  const strictDeltaFromLegacyBaseline = averageStrictMismatchRatio - 0.18891927083333332;
  expect(averagePerceptualMismatchRatio).toBeLessThanOrEqual(0.142);
  const reportJson = `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    method: "Raw pixel mismatch at 0.1 is the M acceptance gate. Content-normalized pixelmatch remains informational; silhouette uses a luminance-18 mask for the luminous M field, and width, height, and density are measured at luminance 18, 55, and 140.",
    legacyAverageMismatchRatio: 0.18891927083333332,
    averageStrictMismatchRatio,
    strictDeltaFromLegacyBaseline,
    strictVisualFidelityResult: strictDeltaFromLegacyBaseline <= 0 ? "improved" : "regressed",
    averagePerceptualMismatchRatio,
    mStrictBaselineRatio: 0.136,
    mStrictImprovement: 1 - (report.find((item) => item.glyph === "m")?.strictMismatchRatio ?? 0.136) / 0.136,
    glyphs: report,
  }, null, 2)}\n`;
  await writeFile(new URL("report.json", root), reportJson);
  await writeFile(new URL("report.json", distRoot), reportJson);
});
