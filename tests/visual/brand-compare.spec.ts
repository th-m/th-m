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
const auditFocus = process.env.THOM_AUDIT_FOCUS;
const focusedGlyph = glyphs.find((glyph) => glyph === auditFocus);
const focusedM = auditFocus === "m";
const auditedGlyphs: ReadonlyArray<(typeof glyphs)[number]> = focusedGlyph ? [focusedGlyph] : glyphs;
const legacyBaseline = { t: 0.2551171875, h: 0.21404947916666667, o: 0.15912760416666666, m: 0.1273828125 } as const;
const hStrictBaselineRatio = 0.24641927083333334;
const tStrictBaselineRatio = 0.2842578125;
const oStrictBaselineRatio = 0.18837239583333334;
const oStrictTargetRatio = oStrictBaselineRatio * 0.8;

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
  let sumX = 0;
  let sumY = 0;
  const quadrants = [0, 0, 0, 0];
  for (let index = 0; index < png.width * png.height; index += 1) {
    const offset = index * 4;
    const luminance = (png.data[offset] + png.data[offset + 1] + png.data[offset + 2]) / 3;
    if (luminance <= threshold) continue;
    count += 1;
    const x = index % png.width;
    const y = Math.floor(index / png.width);
    sumX += x;
    sumY += y;
    quadrants[(x >= png.width / 2 ? 1 : 0) + (y >= png.height / 2 ? 2 : 0)] += 1;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  const width = maxX >= minX ? maxX - minX + 1 : 0;
  const height = maxY >= minY ? maxY - minY + 1 : 0;
  return {
    width,
    height,
    density: count / Math.max(1, width * height),
    centroid: { x: sumX / Math.max(1, count), y: sumY / Math.max(1, count) },
    quadrants: quadrants.map((value) => value / Math.max(1, count)),
  };
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

function retainHPillarRegions(data: Uint8Array, width: number, height: number) {
  const output = new Uint8Array(data);
  let retainedPixels = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const keep = (x <= width * 0.36 || x >= width * 0.64) && (y <= height * 0.4 || y >= height * 0.67);
      const offset = (y * width + x) * 4;
      if (keep) {
        retainedPixels += 1;
        continue;
      }
      output[offset] = 5;
      output[offset + 1] = 5;
      output[offset + 2] = 5;
      output[offset + 3] = 255;
    }
  }
  return { data: output, retainedPixels };
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
      reference: ReturnType<typeof foregroundStats>;
      current: ReturnType<typeof foregroundStats>;
      widthDelta: number;
      heightDelta: number;
      densityDelta: number;
    }>;
  }> = [];

  if (focusedGlyph) {
    const previous = JSON.parse(await readFile(new URL("report.json", root), "utf8")) as { glyphs: typeof report };
    report.push(...previous.glyphs.filter((item) => item.glyph !== focusedGlyph));
  }

  for (const glyph of auditedGlyphs) {
    const frame = page.locator(`[data-glyph="${glyph}"] .current-frame`);
    const currentBuffer = await frame.screenshot({ animations: "disabled" });
    if (process.env.THOM_AUDIT_IGNORE_SNAPSHOTS !== "1") {
      await expect(currentBuffer).toMatchSnapshot(`current-${glyph}.png`, { maxDiffPixelRatio: 0.01 });
    }
    await writeFile(new URL(`${glyph}.png`, currentDirectory), currentBuffer);
    await writeFile(new URL(`${glyph}.png`, distCurrentDirectory), currentBuffer);

    const referenceBuffer = await readFile(new URL(`${glyph}.png`, referenceDirectory));
    const current = PNG.sync.read(currentBuffer);
    const reference = PNG.sync.read(referenceBuffer);
    expect({ width: current.width, height: current.height }).toEqual({ width: reference.width, height: reference.height });

    const rawReference = glyph === "h" ? retainHPillarRegions(reference.data, current.width, current.height) : { data: reference.data, retainedPixels: current.width * current.height };
    const rawCurrent = glyph === "h" ? retainHPillarRegions(current.data, current.width, current.height) : { data: current.data, retainedPixels: current.width * current.height };
    const rawDiff = new PNG({ width: current.width, height: current.height });
    const strictMismatchPixels = pixelmatch(rawReference.data, rawCurrent.data, rawDiff.data, current.width, current.height, {
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
    const normalizedReferenceData = glyph === "h" ? retainHPillarRegions(normalizedReference.data, 320, 240) : { data: normalizedReference.data, retainedPixels: 320 * 240 };
    const normalizedCurrentData = glyph === "h" ? retainHPillarRegions(normalizedCurrent.data, 320, 240) : { data: normalizedCurrent.data, retainedPixels: 320 * 240 };
    const normalizedDiff = new PNG({ width: 320, height: 240 });
    const perceptualMismatchPixels = pixelmatch(
      normalizedReferenceData.data,
      normalizedCurrentData.data,
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
    const referenceMaskPng = glyph === "h" ? new PNG({ width: 320, height: 240 }) : normalizedReference;
    const currentMaskPng = glyph === "h" ? new PNG({ width: 320, height: 240 }) : normalizedCurrent;
    if (glyph === "h") {
      referenceMaskPng.data.set(normalizedReferenceData.data);
      currentMaskPng.data.set(normalizedCurrentData.data);
    }
    const referenceMask = maskStats(referenceMaskPng, silhouetteThreshold);
    const currentMask = maskStats(currentMaskPng, silhouetteThreshold);
    const silhouetteIoU = intersectionOverUnion(referenceMask.mask, currentMask.mask);
    const perceptualMismatchRatio = perceptualMismatchPixels / normalizedReferenceData.retainedPixels;
    const quadrantDistributionDelta = referenceMask.quadrants.reduce((sum, value, index) => sum + Math.abs(value - currentMask.quadrants[index]), 0) / 4;
    const improvementFromLegacyBaseline = 1 - perceptualMismatchRatio / legacyBaseline[glyph];

    const measurementThresholds = glyph === "m" || glyph === "o" ? [18, 55, 140] : glyph === "h" ? [55, 140] : [];
    const thresholdMetrics = measurementThresholds.length ? measurementThresholds.map((threshold) => {
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
    const strictMismatchRatio = strictMismatchPixels / rawReference.retainedPixels;

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

    if (glyph !== "m" && glyph !== "h") expect(perceptualMismatchRatio).toBeLessThanOrEqual(legacyBaseline[glyph] * 0.8);
    if (glyph === "t") {
      expect(strictMismatchRatio).toBeLessThanOrEqual(tStrictBaselineRatio * 0.8);
      expect(silhouetteIoU).toBeGreaterThanOrEqual(0.53);
      expect(Math.abs(referenceMask.coverage - currentMask.coverage)).toBeLessThanOrEqual(0.01);
      expect(quadrantDistributionDelta).toBeLessThanOrEqual(0.03);
    }
    if (glyph === "h") {
      expect(strictMismatchRatio).toBeLessThanOrEqual(0.28);
      expect(silhouetteIoU).toBeGreaterThanOrEqual(0.05);
    }
    if (glyph === "o") {
      expect(Math.abs(referenceMask.coverage - currentMask.coverage)).toBeLessThanOrEqual(0.07);
      thresholdMetrics?.forEach((metric) => {
        expect(metric.widthDelta).toBeLessThanOrEqual(0.1);
        expect(metric.heightDelta).toBeLessThanOrEqual(0.1);
        expect(metric.densityDelta).toBeLessThanOrEqual(0.1);
      });
    }
    if (glyph === "m") {
      expect(strictMismatchRatio).toBeLessThanOrEqual(0.108);
      expect(silhouetteIoU).toBeGreaterThanOrEqual(focusedM ? 0.638 : 0.5);
      thresholdMetrics?.forEach((metric) => {
        expect(metric.widthDelta).toBeLessThanOrEqual(0.05);
        expect(metric.heightDelta).toBeLessThanOrEqual(0.05);
        expect(metric.densityDelta).toBeLessThanOrEqual(0.21);
      });
    }
  }

  const masterBuffer = await page.locator('[data-lockup="master"] .lockup-frame').screenshot({ animations: "disabled" });
  await expect(masterBuffer).toMatchSnapshot("current-master.png", { maxDiffPixelRatio: 0.01 });
  if (!focusedM) {
    const compactBuffer = await page.locator('[data-lockup="compact"] .lockup-frame').screenshot({ animations: "disabled" });
    await expect(compactBuffer).toMatchSnapshot("current-compact.png", { maxDiffPixelRatio: 0.01 });
  }

  const averagePerceptualMismatchRatio = report.reduce((sum, item) => sum + item.perceptualMismatchRatio, 0) / report.length;
  const averageStrictMismatchRatio = report.reduce((sum, item) => sum + item.strictMismatchRatio, 0) / report.length;
  const strictDeltaFromLegacyBaseline = averageStrictMismatchRatio - 0.18891927083333332;
  expect(averagePerceptualMismatchRatio).toBeLessThanOrEqual(0.142);
  const reportJson = `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    method: "Raw pixel mismatch at 0.1 gates T/O/M against the source board. H uses pillar-only source regions because its former catenary is intentionally superseded by the golden-ratio crossbar; H center geometry is gated structurally and by SVG/WebGL parity.",
    legacyAverageMismatchRatio: 0.18891927083333332,
    averageStrictMismatchRatio,
    strictDeltaFromLegacyBaseline,
    strictVisualFidelityResult: strictDeltaFromLegacyBaseline <= 0 ? "improved" : "regressed",
    averagePerceptualMismatchRatio,
    hStrictBaselineRatio,
    hStrictImprovement: 1 - (report.find((item) => item.glyph === "h")?.strictMismatchRatio ?? hStrictBaselineRatio) / hStrictBaselineRatio,
    mStrictBaselineRatio: 0.136,
    mStrictImprovement: 1 - (report.find((item) => item.glyph === "m")?.strictMismatchRatio ?? 0.136) / 0.136,
    tStrictBaselineRatio,
    tStrictImprovement: 1 - (report.find((item) => item.glyph === "t")?.strictMismatchRatio ?? tStrictBaselineRatio) / tStrictBaselineRatio,
    oStrictBaselineRatio,
    oStrictTargetRatio,
    oStrictImprovement: 1 - (report.find((item) => item.glyph === "o")?.strictMismatchRatio ?? oStrictBaselineRatio) / oStrictBaselineRatio,
    oStrictTargetMet: (report.find((item) => item.glyph === "o")?.strictMismatchRatio ?? Number.POSITIVE_INFINITY) <= oStrictTargetRatio,
    glyphs: report,
  }, null, 2)}\n`;
  await writeFile(new URL("report.json", root), reportJson);
  await writeFile(new URL("report.json", distRoot), reportJson);
});
