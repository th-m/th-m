import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { PNG } from "pngjs";
import sharp from "sharp";

const brandData = JSON.parse(readFileSync(new URL("../../src/brand/thom/generated/brand-data.json", import.meta.url), "utf8")) as {
  master: { width: number };
  placements: Record<"h" | "o", { x: number; scaleX: number }>;
  h: {
    proportion: { a: Array<{ x: number; y: number }> };
    paths: Array<{ commands: Array<{ type: string; x?: number; x1?: number; x2?: number }> }>;
  };
};

const leftHPillarXs = brandData.h.paths[0].commands.flatMap((command) => [command.x, command.x1, command.x2].filter((value): value is number => typeof value === "number"));
const leftHPillarCenter = (Math.min(...leftHPillarXs) + Math.max(...leftHPillarXs)) / 2;

function silhouette(png: PNG, threshold = 180) {
  const mask = new Uint8Array(png.width * png.height);
  let count = 0;
  let sumX = 0;
  let sumY = 0;
  let minX = png.width;
  let minY = png.height;
  let maxX = -1;
  let maxY = -1;
  for (let index = 0; index < mask.length; index += 1) {
    const offset = index * 4;
    const luminance = (png.data[offset] + png.data[offset + 1] + png.data[offset + 2]) / 3;
    if (luminance <= threshold) continue;
    mask[index] = 1;
    count += 1;
    const x = index % png.width;
    const y = Math.floor(index / png.width);
    sumX += x;
    sumY += y;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const quadrants = [0, 0, 0, 0];
  for (let index = 0; index < mask.length; index += 1) {
    if (!mask[index]) continue;
    const x = index % png.width;
    const y = Math.floor(index / png.width);
    quadrants[(y >= centerY ? 2 : 0) + (x >= centerX ? 1 : 0)] += 1;
  }
  return {
    mask,
    width,
    height,
    density: count / Math.max(1, width * height),
    centroid: { x: sumX / Math.max(1, count) / png.width, y: sumY / Math.max(1, count) / png.height },
    quadrants: quadrants.map((value) => value / Math.max(1, count)),
  };
}

function silhouetteIoU(first: Uint8Array, second: Uint8Array) {
  let intersection = 0;
  let union = 0;
  for (let index = 0; index < first.length; index += 1) {
    if (first[index] || second[index]) union += 1;
    if (first[index] && second[index]) intersection += 1;
  }
  return intersection / union;
}

function hHeroCrossbarRatio(buffer: Buffer) {
  const png = PNG.sync.read(buffer);
  const scale = png.width / brandData.master.width;
  const [aStart, aEnd] = brandData.h.proportion.a;
  const crossbarPoint = { x: (aStart.x + aEnd.x) / 2, y: aStart.y };
  const placement = brandData.placements.h;
  const luminance = (x: number, y: number) => {
    const offset = (Math.round(y) * png.width + Math.round(x)) * 4;
    return (png.data[offset] + png.data[offset + 1] + png.data[offset + 2]) / 3;
  };
  const profileWidth = (centerX: number, centerY: number, range: number, step: number, axis: "x" | "y") => {
    const samples: Array<{ offset: number; luminance: number }> = [];
    for (let offset = -range; offset <= range; offset += step) {
      samples.push({
        offset,
        luminance: luminance(centerX + (axis === "x" ? offset : 0), centerY + (axis === "y" ? offset : 0)),
      });
    }
    const peak = Math.max(...samples.map((sample) => sample.luminance));
    const halfMaximum = (peak + 5) / 2;
    const visible = samples.filter((sample) => sample.luminance >= halfMaximum);
    return visible.at(-1)!.offset - visible[0].offset;
  };
  const stemWidth = profileWidth((placement.x + leftHPillarCenter) * scale, 80 * scale, 8 * scale, 0.1, "x");
  const crossbarWidth = profileWidth((placement.x + crossbarPoint.x) * scale, crossbarPoint.y * scale, 3 * scale, 0.05, "y");
  return { stemWidth, crossbarWidth, ratio: crossbarWidth / stemWidth };
}

async function normalizedHeroOCrop(buffer: Buffer) {
  const png = PNG.sync.read(buffer);
  const scale = png.width / brandData.master.width;
  const placement = brandData.placements.o;
  return sharp(buffer)
    .extract({
      left: Math.round((placement.x + 5 * placement.scaleX) * scale),
      top: Math.round(14 * scale),
      width: Math.round(90 * placement.scaleX * scale),
      height: Math.round(90 * scale),
    })
    .resize(318, 360, { fit: "fill", kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();
}

test("renders the identity and complete content without overflow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "THOM — Thomas Valadez" })).toBeAttached();
  await expect(page.getByRole("heading", { name: "Software Design" })).toBeVisible();
  await expect(page.getByText("platonic-values")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test("supports keyboard glyph replay and has no serious accessibility findings", async ({ page }) => {
  await page.goto("/");
  const firstGlyph = page.getByRole("button", { name: "Replay T foundations animation" });
  await firstGlyph.focus();
  await expect(firstGlyph).toBeFocused();
  const results = await new AxeBuilder({ page }).disableRules(["color-contrast"]).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
});

test("settles WebGL stages and stops their render loops", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("thom:intro:v1", "complete"));
  await page.goto("/");
  const heroCanvas = page.locator(".thom-logo--hero canvas");
  await expect(heroCanvas).toHaveAttribute("data-render-loop", "stopped", { timeout: 3000 });
  const firstGlyph = page.getByRole("button", { name: "Replay T foundations animation" });
  await page.mouse.move(0, 0);
  await firstGlyph.hover();
  await page.waitForTimeout(550);
  await expect(heroCanvas).toHaveAttribute("data-render-loop", "stopped");
});

test("scales construction strokes and glow with the hero geometry", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("thom:intro:v1", "complete"));
  await page.setViewportSize({ width: 1180, height: 760 });
  await page.goto("/#mark");
  const canvas = page.locator(".thom-logo--hero canvas");
  await expect(canvas).toHaveAttribute("data-render-loop", "stopped", { timeout: 3000 });
  const large = await canvas.evaluate((element) => ({
    lineScale: Number((element as HTMLCanvasElement).dataset.lineScale),
    width: element.getBoundingClientRect().width,
    glow: getComputedStyle(element).filter,
  }));

  await page.setViewportSize({ width: 668, height: 760 });
  await expect.poll(async () => Number(await canvas.getAttribute("data-line-scale"))).toBeLessThan(large.lineScale);
  const small = await canvas.evaluate((element) => ({
    lineScale: Number((element as HTMLCanvasElement).dataset.lineScale),
    width: element.getBoundingClientRect().width,
    glow: getComputedStyle(element).filter,
  }));

  expect(small.lineScale / large.lineScale).toBeCloseTo(small.width / large.width, 3);
  const blur = (filter: string) => Number(filter.match(/([\d.]+)px\)$/)?.[1] ?? 0);
  expect(blur(small.glow)).toBeLessThan(blur(large.glow));
  for (const asset of ["thom-master.svg", "glyph-m.svg", "thom-compact.svg"]) {
    const response = await page.request.get(`/brand/${asset}`);
    expect(await response.text()).not.toContain("non-scaling-stroke");
  }
});

test("keeps the O network proportionate across the supplied small and large screen scales", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "The responsive comparison controls its own desktop viewport sizes.");
  await page.addInitScript(() => sessionStorage.setItem("thom:intro:v1", "complete"));
  const captures: Array<{ width: number; crop: Buffer }> = [];
  for (const width of [668, 1746]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const logo = page.locator(".thom-logo--hero");
    const canvas = logo.locator("canvas");
    await expect(logo).toHaveClass(/is-webgl-ready/);
    await expect(canvas).toHaveAttribute("data-render-loop", "stopped", { timeout: 3000 });
    const crop = await normalizedHeroOCrop(await logo.screenshot({ animations: "disabled", scale: "css" }));
    captures.push({ width, crop });
    await testInfo.attach(`o-responsive-${width}`, { body: crop, contentType: "image/png" });
  }

  const [small, large] = captures;
  const metrics = [18, 55, 140].map((threshold) => {
    const smallMetrics = silhouette(PNG.sync.read(small.crop), threshold);
    const largeMetrics = silhouette(PNG.sync.read(large.crop), threshold);
    return {
      threshold,
      mismatch: 1 - silhouetteIoU(smallMetrics.mask, largeMetrics.mask),
      widthDelta: Math.abs(smallMetrics.width - largeMetrics.width) / largeMetrics.width,
      heightDelta: Math.abs(smallMetrics.height - largeMetrics.height) / largeMetrics.height,
      densityDelta: Math.abs(smallMetrics.density - largeMetrics.density) / largeMetrics.density,
      centroidDelta: Math.hypot(
        smallMetrics.centroid.x - largeMetrics.centroid.x,
        smallMetrics.centroid.y - largeMetrics.centroid.y,
      ),
      quadrantDeltas: smallMetrics.quadrants.map((value, index) => Math.abs(value - largeMetrics.quadrants[index])),
    };
  });
  console.log(`O responsive parity: ${JSON.stringify(metrics)}`);
  metrics.forEach((metric) => {
    expect(metric.widthDelta).toBeLessThanOrEqual(0.02);
    expect(metric.heightDelta).toBeLessThanOrEqual(0.02);
    expect(metric.densityDelta).toBeLessThanOrEqual(metric.threshold === 18 ? 0.125 : 0.1);
    expect(metric.centroidDelta).toBeLessThanOrEqual(0.025);
    expect(Math.max(...metric.quadrantDeltas)).toBeLessThanOrEqual(0.04);
    expect(metric.mismatch).toBeLessThanOrEqual(metric.threshold === 18 ? 0.32 : 0.54);
  });
});

test("keeps the H crossbar-to-pillar proportion stable across hero sizes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "This compares two fixed one-pixel desktop raster scales.");
  await page.addInitScript(() => sessionStorage.setItem("thom:intro:v1", "complete"));
  const captures: Array<{ width: number; buffer: Buffer; measurement: ReturnType<typeof hHeroCrossbarRatio> }> = [];
  for (const width of [668, 1746]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const logo = page.locator(".thom-logo--hero");
    await expect(logo).toHaveClass(/is-webgl-ready/);
    await expect(logo.locator("canvas")).toHaveAttribute("data-render-loop", "stopped", { timeout: 3000 });
    const buffer = await logo.screenshot({ animations: "disabled" });
    captures.push({ width, buffer, measurement: hHeroCrossbarRatio(buffer) });
    await testInfo.attach(`h-responsive-${width}`, { body: buffer, contentType: "image/png" });
  }
  const [small, large] = captures;
  expect(small.measurement.crossbarWidth).toBeLessThanOrEqual(large.measurement.crossbarWidth + 1e-9);
  expect(small.measurement.ratio).toBeLessThanOrEqual(0.36);
  expect(Math.abs(small.measurement.ratio - large.measurement.ratio) / large.measurement.ratio).toBeLessThanOrEqual(0.35);
});

test("replays the isolated M for 820 ms and returns to a stopped loop", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "The mobile viewport deliberately stops the offscreen isolated WebGL stage.");
  await page.goto("/#mark");
  const mControl = page.getByRole("button", { name: /04 M Superposition/ });
  const stage = page.locator(".glyph-stage");
  const canvas = stage.locator("canvas");
  await stage.scrollIntoViewIfNeeded();
  await expect(stage).toHaveClass(/is-webgl-ready/);
  await expect(canvas).toHaveAttribute("data-render-loop", "stopped", { timeout: 2000 });
  await mControl.evaluate((button) => (button as HTMLButtonElement).click());
  await expect(canvas).toHaveAttribute("data-render-loop", "running");
  await expect(canvas).toHaveAttribute("data-render-loop", "stopped", { timeout: 1200 });
});

test("traces the isolated T for 450 ms, resolves, and keeps SVG/WebGL parity", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "The desktop parity fixture has a fixed one-pixel raster scale.");
  await page.addInitScript(() => sessionStorage.setItem("thom:intro:v1", "complete"));
  await page.goto("/#mark");
  const tControl = page.getByRole("button", { name: /Foundations/ });
  const stage = page.locator(".glyph-stage");
  const canvas = stage.locator("canvas");
  await expect(stage).toHaveClass(/is-webgl-ready/);
  await tControl.click();
  await expect(canvas).toHaveAttribute("data-render-loop", "running");
  await expect(canvas).toHaveAttribute("data-render-loop", "stopped", { timeout: 900 });
  await page.reload();
  await expect(stage).toHaveClass(/is-webgl-ready/);
  await expect(canvas).toHaveAttribute("data-render-loop", "stopped", { timeout: 2000 });

  await page.addStyleTag({ content: ".glyph-stage__fallback{visibility:hidden!important}.glyph-stage__canvas{visibility:visible!important;opacity:1!important;filter:none!important;transition:none!important}" });
  const webglBuffer = await stage.screenshot({ animations: "disabled" });
  const webgl = PNG.sync.read(webglBuffer);
  await page.addStyleTag({ content: ".glyph-stage__fallback{visibility:visible!important;opacity:1!important;transition:none!important}.glyph-stage__canvas{visibility:hidden!important}" });
  const svgBuffer = await stage.screenshot({ animations: "disabled" });
  const svg = PNG.sync.read(svgBuffer);
  await testInfo.attach("settled-t-webgl", { body: webglBuffer, contentType: "image/png" });
  await testInfo.attach("settled-t-svg", { body: svgBuffer, contentType: "image/png" });

  const webglSilhouette = silhouette(webgl, 55);
  const svgSilhouette = silhouette(svg, 55);
  const parity = {
    iou: silhouetteIoU(webglSilhouette.mask, svgSilhouette.mask),
    widthDelta: Math.abs(webglSilhouette.width - svgSilhouette.width) / svgSilhouette.width,
    heightDelta: Math.abs(webglSilhouette.height - svgSilhouette.height) / svgSilhouette.height,
  };
  console.log(`T settled SVG/WebGL parity: ${JSON.stringify(parity)}`);
  expect(parity.iou).toBeGreaterThanOrEqual(0.84);
  expect(parity.widthDelta).toBeLessThanOrEqual(0.05);
  expect(parity.heightDelta).toBeLessThanOrEqual(0.05);
});

test("keeps the settled H geometry in SVG and WebGL parity after keyboard replay", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "The desktop parity fixture has a fixed one-pixel raster scale.");
  await page.goto("/#mark");
  const hControl = page.getByRole("button", { name: /Equilibrium/ });
  await hControl.focus();
  await expect(hControl).toBeFocused();

  const stage = page.locator(".glyph-stage");
  const canvas = stage.locator("canvas");
  await expect(stage).toHaveClass(/is-webgl-ready/);
  await hControl.press("Enter");
  await expect(hControl).toHaveAttribute("aria-pressed", "true");
  await expect(canvas).toHaveAttribute("data-render-loop", "running", { timeout: 1500 });
  await expect(canvas).toHaveAttribute("data-render-loop", "stopped", { timeout: 2000 });
  await expect(canvas).toHaveAttribute("data-h-phase", "settled");

  await page.addStyleTag({ content: ".glyph-stage__fallback{visibility:hidden!important}.glyph-stage__canvas{visibility:visible!important;opacity:1!important;filter:none!important;transition:none!important}" });
  const webglBuffer = await stage.screenshot({ animations: "disabled" });
  const webgl = PNG.sync.read(webglBuffer);
  const normalizedHWebgl = await sharp(webglBuffer)
    .resize(320, 240, { fit: "fill", kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();
  await writeFile(new URL("../../public/brand-audit/current/h-webgl.png", import.meta.url), normalizedHWebgl);
  await page.addStyleTag({ content: ".glyph-stage__fallback{visibility:visible!important;opacity:1!important;transition:none!important}.glyph-stage__canvas{visibility:hidden!important}" });
  const svgBuffer = await stage.screenshot({ animations: "disabled" });
  const svg = PNG.sync.read(svgBuffer);
  await testInfo.attach("settled-h-webgl", { body: webglBuffer, contentType: "image/png" });
  await testInfo.attach("settled-h-svg", { body: svgBuffer, contentType: "image/png" });

  // The calmer H column palette is intentionally lower contrast; compare its
  // geometry below the highlight-only range so the full stems participate.
  const webglSilhouette = silhouette(webgl, 80);
  const svgSilhouette = silhouette(svg, 80);
  const parity = {
    iou: silhouetteIoU(webglSilhouette.mask, svgSilhouette.mask),
    widthDelta: Math.abs(webglSilhouette.width - svgSilhouette.width) / svgSilhouette.width,
    heightDelta: Math.abs(webglSilhouette.height - svgSilhouette.height) / svgSilhouette.height,
  };
  console.log(`H settled SVG/WebGL parity: ${JSON.stringify(parity)}`);
  expect(parity.iou).toBeGreaterThanOrEqual(0.6);
  expect(parity.widthDelta).toBeLessThanOrEqual(0.06);
  expect(parity.heightDelta).toBeLessThanOrEqual(0.05);
});

test("reveals the O from 480–1200 ms and keeps settled SVG/WebGL parity", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "The desktop parity fixture has a fixed one-pixel raster scale.");
  await page.goto("/#mark");
  const oControl = page.getByRole("button", { name: /03 O Emergence/ });
  const stage = page.locator(".glyph-stage");
  const canvas = stage.locator("canvas");
  await expect(stage).toHaveClass(/is-webgl-ready/);
  await oControl.evaluate((button) => (button as HTMLButtonElement).click());
  await expect(canvas).toHaveAttribute("data-render-loop", "running");
  await expect(canvas).toHaveAttribute("data-render-loop", "stopped", { timeout: 1200 });

  await page.addStyleTag({ content: ".glyph-stage__fallback{visibility:hidden!important}.glyph-stage__canvas{visibility:visible!important;opacity:1!important;filter:none!important;transition:none!important}" });
  const webglBuffer = await stage.screenshot({ animations: "disabled" });
  const webgl = PNG.sync.read(webglBuffer);
  await page.addStyleTag({ content: ".glyph-stage__fallback{visibility:visible!important;opacity:1!important;transition:none!important}.glyph-stage__canvas{visibility:hidden!important}" });
  const svgBuffer = await stage.screenshot({ animations: "disabled" });
  const svg = PNG.sync.read(svgBuffer);
  await testInfo.attach("settled-o-webgl", { body: webglBuffer, contentType: "image/png" });
  await testInfo.attach("settled-o-svg", { body: svgBuffer, contentType: "image/png" });

  const webglSilhouette = silhouette(webgl, 55);
  const svgSilhouette = silhouette(svg, 55);
  const parity = {
    iou: silhouetteIoU(webglSilhouette.mask, svgSilhouette.mask),
    widthDelta: Math.abs(webglSilhouette.width - svgSilhouette.width) / svgSilhouette.width,
    heightDelta: Math.abs(webglSilhouette.height - svgSilhouette.height) / svgSilhouette.height,
  };
  console.log(`O settled SVG/WebGL parity: ${JSON.stringify(parity)}`);
  expect(parity.iou).toBeGreaterThanOrEqual(0.35);
  expect(parity.widthDelta).toBeLessThanOrEqual(0.1);
  expect(parity.heightDelta).toBeLessThanOrEqual(0.1);
});

test("keeps the settled M geometry in SVG and WebGL parity", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "The desktop parity fixture has a fixed one-pixel raster scale.");
  await page.goto("/#mark");
  const mControl = page.getByRole("button", { name: /04 M Superposition/ });
  const stage = page.locator(".glyph-stage");
  const canvas = stage.locator("canvas");
  await stage.scrollIntoViewIfNeeded();
  await expect(stage).toHaveClass(/is-webgl-ready/);
  await mControl.evaluate((button) => (button as HTMLButtonElement).click());
  await expect(mControl).toHaveAttribute("aria-pressed", "true");
  await expect(stage).toHaveAttribute("aria-label", "M — Superposition");
  await expect(canvas).toHaveAttribute("data-glyph-view", "m");
  await page.mouse.move(0, 0);
  await page.waitForTimeout(1800);
  await expect(canvas).toHaveAttribute("data-render-loop", "stopped", { timeout: 2000 });

  await page.addStyleTag({ content: ".glyph-stage__fallback{opacity:0!important}.glyph-stage__canvas{opacity:1!important;filter:none!important}" });
  const webglBuffer = await stage.screenshot({ animations: "disabled" });
  if (process.env.THOM_QA_FOCUS === "m") {
    const canvasBuffer = await canvas.screenshot({ animations: "disabled", scale: "css" });
    const normalizedCanvas = await sharp(canvasBuffer)
      .resize(320, 240, { fit: "contain", background: { r: 5, g: 5, b: 5, alpha: 1 } })
      .png()
      .toBuffer();
    await writeFile(new URL("../../public/brand-audit/current/m-webgl.png", import.meta.url), normalizedCanvas);
  }
  const webgl = PNG.sync.read(webglBuffer);
  await page.addStyleTag({ content: ".glyph-stage__fallback{opacity:1!important}.glyph-stage__canvas{opacity:0!important}" });
  const svgBuffer = await stage.screenshot({ animations: "disabled" });
  const svg = PNG.sync.read(svgBuffer);
  await testInfo.attach("settled-m-webgl", { body: webglBuffer, contentType: "image/png" });
  await testInfo.attach("settled-m-svg", { body: svgBuffer, contentType: "image/png" });
  expect({ width: webgl.width, height: webgl.height }).toEqual({ width: svg.width, height: svg.height });

  const parity = [18, 55, 140].map((threshold) => {
    const webglSilhouette = silhouette(webgl, threshold);
    const svgSilhouette = silhouette(svg, threshold);
    return {
      threshold,
      webgl: { width: webglSilhouette.width, height: webglSilhouette.height, density: webglSilhouette.density },
      svg: { width: svgSilhouette.width, height: svgSilhouette.height, density: svgSilhouette.density },
      iou: silhouetteIoU(webglSilhouette.mask, svgSilhouette.mask),
      widthDelta: Math.abs(webglSilhouette.width - svgSilhouette.width) / svgSilhouette.width,
      heightDelta: Math.abs(webglSilhouette.height - svgSilhouette.height) / svgSilhouette.height,
      densityDelta: Math.abs(webglSilhouette.density - svgSilhouette.density) / svgSilhouette.density,
    };
  });
  console.log(`M settled SVG/WebGL parity: ${JSON.stringify(parity)}`);
  parity.forEach((metric) => {
    expect(metric.widthDelta).toBeLessThanOrEqual(0.05);
    expect(metric.heightDelta).toBeLessThanOrEqual(0.05);
    expect(metric.densityDelta).toBeLessThanOrEqual(0.2);
  });
  expect(parity[0].iou).toBeGreaterThanOrEqual(0.55);
  expect(parity[1].iou).toBeGreaterThanOrEqual(0.65);
  expect(parity[2].iou).toBeGreaterThanOrEqual(0.72);
});

test("retains the generated SVG when WebGL initialization fails", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, contextId: string, ...args: unknown[]) {
      if (contextId === "webgl" || contextId === "webgl2" || contextId === "experimental-webgl") return null;
      return Reflect.apply(original, this, [contextId, ...args]);
    } as typeof HTMLCanvasElement.prototype.getContext;
  });
  await page.goto("/");
  await expect(page.locator(".thom-logo--hero .thom-logo__fallback")).toBeVisible();
  await expect(page.locator(".thom-logo--hero")).not.toHaveClass(/is-webgl-ready/);
});

test("keeps the static identity under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".thom-logo--hero .thom-logo__fallback")).toBeVisible();
  await expect(page.locator(".thom-logo--hero canvas")).toBeHidden();
});

test("uses compact utility assets and exposes light and monochrome downloads", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".thom-logo--header img")).toHaveAttribute("src", "/brand/thom-compact.svg");
  for (const asset of ["thom-light.svg", "thom-monochrome.svg"]) {
    const response = await page.request.get(`/brand/${asset}`);
    expect(response.ok()).toBe(true);
    expect(await response.text()).toContain("<title id=\"title\">THOM</title>");
  }
});

test.describe("no JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("prerenders the full page and static mark", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "THOM — Thomas Valadez" })).toBeAttached();
    await expect(page.getByRole("heading", { name: "Software Design" })).toBeVisible();
    await expect(page.locator(".thom-logo--hero .thom-logo__fallback")).toBeVisible();
  });
});
