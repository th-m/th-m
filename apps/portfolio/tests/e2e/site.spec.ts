import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { PNG } from "pngjs";
import sharp from "sharp";

const brandData = JSON.parse(readFileSync(new URL("../../../../libs/thom-brand/src/generated/brand-data.json", import.meta.url), "utf8")) as {
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
    bounds: { minX, minY, maxX, maxY },
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

test("renders the minimal home with logo and writings", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "THOM — Thomas Valadez" })).toBeAttached();
  await expect(page.getByRole("heading", { name: "AI Factory" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Laws" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore the writing" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Measured to stay itself at every scale." })).toHaveCount(0);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test("documents the Tailwind design system accessibly at each supported viewport", async ({ page }, testInfo) => {
  await page.goto("/design-system");
  await expect(page.getByRole("heading", { name: "Color with a job to do." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Status colors that stay in their lane." })).toBeVisible();
  await expect(page.getByText("accent-1 · accent-blue", { exact: true })).toBeVisible();
  await expect(page.getByText("accent-6 · accent-plum", { exact: true })).toBeVisible();

  const primaryAction = page.getByRole("button", { name: "Primary action" });
  await primaryAction.focus();
  await expect(primaryAction).toBeFocused();
  expect(await primaryAction.evaluate((element) => getComputedStyle(element).outlineWidth)).toBe("2px");

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
  await testInfo.attach(`design-system-${testInfo.project.name}`, {
    body: await page.screenshot({ animations: "disabled", fullPage: true }),
    contentType: "image/png",
  });
});

test("renders the identity and complete content without overflow", async ({ page }) => {
  await page.goto("/brand");
  await expect(page.getByRole("heading", { name: "THOM — Thomas Valadez" })).toBeAttached();
  await expect(page.getByRole("heading", { name: "Measured to stay itself at every scale." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Color with a job to do." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Software Design" })).toBeVisible();
  await expect(page.getByText("platonic-values")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test("optically centers hero wordmarks without clipping at the reference viewports", async ({ page }, testInfo) => {
  await page.addInitScript(() => sessionStorage.setItem("thom:intro:v1", "complete"));
  await page.setViewportSize(testInfo.project.name === "mobile" ? { width: 390, height: 844 } : { width: 1170, height: 1014 });

  for (const route of ["/", "/brand"]) {
    await page.goto(route);
    const logo = page.locator(".thom-logo--hero");
    const canvas = logo.locator("canvas");
    await expect(canvas).toHaveAttribute("data-render-loop", "stopped", { timeout: 3000 });
    const png = PNG.sync.read(await logo.screenshot());
    const metrics = silhouette(png, 100);
    const visibleCenter = (metrics.bounds.minX + metrics.bounds.maxX) / 2 / png.width;
    expect(Math.abs(visibleCenter - 0.5), `${route} visible center at ${visibleCenter}`).toBeLessThanOrEqual(0.015);
    expect(metrics.bounds.minX).toBeGreaterThan(0);
    expect(metrics.bounds.maxX).toBeLessThan(png.width - 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
  }
});

test("activates only the hovered or focused glyph orbit", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Pointer and keyboard activation are exercised in the desktop browser.");
  await page.addInitScript(() => sessionStorage.setItem("thom:intro:v1", "complete"));
  await page.setViewportSize({ width: 1170, height: 1014 });
  await page.goto("/brand");
  const orbit = page.locator(".hero-orbit");
  const labels = {
    t: "Replay T foundations animation",
    h: "Replay H equilibrium animation",
    o: "Replay O emergence animation",
    m: "Replay M superposition animation",
  } as const;

  const animationCounts = () => orbit.evaluate((element) => Object.fromEntries(
    ["t", "h", "o", "m"].map((glyph) => {
      const motif = element.querySelector(`[data-orbit-motif="${glyph}"]`);
      return [glyph, motif?.getAnimations({ subtree: true }).filter((animation) => animation.playState === "running").length ?? 0];
    }),
  ));

  await expect(orbit).toHaveAttribute("data-active-glyph", "idle");
  for (const [glyph, label] of Object.entries(labels)) {
    const target = page.getByRole("button", { name: label });
    await target.hover();
    await expect(orbit).toHaveAttribute("data-active-glyph", glyph);
    await expect.poll(animationCounts).toMatchObject({ [glyph]: expect.any(Number) });
    const counts = await animationCounts();
    expect(counts[glyph]).toBeGreaterThan(0);
    for (const inactive of Object.keys(labels).filter((candidate) => candidate !== glyph)) expect(counts[inactive]).toBe(0);
    await page.mouse.move(0, 0);
    await expect(orbit).toHaveAttribute("data-active-glyph", "idle");
  }

  const focused = page.getByRole("button", { name: labels.h });
  await focused.focus();
  await expect(orbit).toHaveAttribute("data-active-glyph", "h");
  await page.mouse.move(0, 0);
  await expect(orbit).toHaveAttribute("data-active-glyph", "h");
  await focused.evaluate((button) => (button as HTMLButtonElement).blur());
  await expect(orbit).toHaveAttribute("data-active-glyph", "idle");
});

test("shares the composed animated THOM logo across home and brand", async ({ page }, testInfo) => {
  await page.addInitScript(() => sessionStorage.setItem("thom:intro:v1", "complete"));
  await page.setViewportSize(testInfo.project.name === "mobile" ? { width: 390, height: 844 } : { width: 1170, height: 1014 });

  for (const route of ["/", "/brand"]) {
    await page.goto(route);
    const component = page.locator(".animated-thom-logo");
    const orbit = component.locator(".hero-orbit");
    await expect(component).toHaveCount(1);
    await expect(component.locator(".thom-logo--hero")).toHaveCount(1);
    await page.getByRole("button", { name: "Replay H equilibrium animation" }).focus();
    await expect(component).toHaveAttribute("data-active-glyph", "h");
    await expect(orbit).toHaveAttribute("data-active-glyph", "h");
    expect(await orbit.locator('[data-orbit-motif="h"]').evaluate((motif) => motif.getAnimations({ subtree: true }).length)).toBeGreaterThan(0);
  }
});

test("keeps the H trace to five fading segments across its seamless loop", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "The deterministic animation timeline is sampled once in desktop Chromium.");
  await page.addInitScript(() => sessionStorage.setItem("thom:intro:v1", "complete"));
  await page.goto("/brand");
  await page.getByRole("button", { name: "Replay H equilibrium animation" }).focus();
  await expect(page.locator(".hero-orbit")).toHaveAttribute("data-active-glyph", "h");

  const timeline = await page.evaluate(async () => {
    const segments = Array.from(document.querySelectorAll<SVGLineElement>("[data-golden-trail-segment]"));
    const dot = document.querySelector<SVGPathElement>(".hero-orbit__golden-dot");
    const animations = [...segments.flatMap((segment) => segment.getAnimations()), ...(dot?.getAnimations() ?? [])];
    animations.forEach((animation) => animation.pause());
    const sample = async (time: number) => {
      animations.forEach((animation) => { animation.currentTime = time; });
      await new Promise(requestAnimationFrame);
      return {
        visible: segments.filter((segment) => {
          const style = getComputedStyle(segment);
          return Number(style.opacity) > 0.01 && Number.parseFloat(style.strokeDashoffset) < .999;
        }).length,
        dotOffset: Number.parseFloat(getComputedStyle(dot!).strokeDashoffset),
      };
    };
    const start = await sample(0);
    const visibleCounts = [];
    for (let time = 0; time < 6400; time += 160) visibleCounts.push((await sample(time)).visible);
    return {
      start,
      maximumVisible: Math.max(...visibleCounts),
      beforeLoop: await sample(6579),
      atLoop: await sample(6580),
    };
  });

  expect(timeline.start.visible).toBe(0);
  expect(timeline.maximumVisible).toBeLessThanOrEqual(5);
  expect(timeline.beforeLoop.visible).toBeGreaterThanOrEqual(4);
  expect(timeline.atLoop.visible).toBeGreaterThanOrEqual(4);
  expect(timeline.beforeLoop.dotOffset).toBeCloseTo(-1, 2);
  expect(timeline.atLoop.dotOffset).toBeCloseTo(0, 5);
});

test("supports keyboard glyph replay and has no serious accessibility findings", async ({ page }) => {
  await page.goto("/brand");
  const firstGlyph = page.getByRole("button", { name: "Replay T foundations animation" });
  await firstGlyph.focus();
  await expect(firstGlyph).toBeFocused();
  const results = await new AxeBuilder({ page }).disableRules(["color-contrast"]).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
});

test("settles WebGL stages and stops their render loops", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("thom:intro:v1", "complete"));
  await page.goto("/brand");
  const heroCanvas = page.locator(".thom-logo--hero canvas");
  await expect(heroCanvas).toHaveAttribute("data-render-loop", "stopped", { timeout: 3000 });
  const firstGlyph = page.getByRole("button", { name: "Replay T foundations animation" });
  await page.mouse.move(0, 0);
  await firstGlyph.hover();
  await page.waitForTimeout(550);
  await expect(heroCanvas).toHaveAttribute("data-render-loop", "stopped");
});

test("runs the H golden spiral on intro and direct hero interaction without restart or pointer cancellation", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Motion timing is verified in the fixed desktop fixture.");
  await page.addInitScript(() => sessionStorage.removeItem("thom:intro:v1"));
  await page.goto("/brand");
  const hero = page.locator(".thom-logo--hero");
  const canvas = hero.locator("canvas");
  const hTarget = page.getByRole("button", { name: "Replay H equilibrium animation" });
  await expect(hero).toHaveClass(/is-webgl-ready/);
  await expect(canvas).toHaveAttribute("data-h-saw-spiral", "true", { timeout: 1500 });
  await expect(canvas).toHaveAttribute("data-render-loop", "stopped", { timeout: 2500 });
  await expect(canvas).toHaveAttribute("data-h-phase", "settled");

  await page.mouse.move(0, 0);
  const started = await hTarget.evaluate(async (button) => {
    const canvas = document.querySelector<HTMLCanvasElement>(".thom-logo--hero canvas");
    const phase = new Promise<string | undefined>((resolve) => {
      const observer = new MutationObserver(() => {
        if (canvas?.dataset.hPhase !== "settled") {
          observer.disconnect();
          resolve(canvas?.dataset.hPhase);
        }
      });
      if (canvas) observer.observe(canvas, { attributes: true, attributeFilter: ["data-h-phase"] });
      setTimeout(() => {
        observer.disconnect();
        resolve(canvas?.dataset.hPhase);
      }, 300);
    });
    button.dispatchEvent(new PointerEvent("pointerover", { bubbles: true }));
    const loop = canvas?.dataset.renderLoop;
    const observedPhase = await phase;
    button.dispatchEvent(new PointerEvent("pointerout", { bubbles: true }));
    (button as HTMLButtonElement).click();
    return { loop, phase: observedPhase };
  });
  expect(started).toEqual({ loop: "running", phase: "spiral-trace" });
  await expect(canvas).toHaveAttribute("data-render-loop", "stopped", { timeout: 1300 });
  await expect(canvas).toHaveAttribute("data-h-saw-spiral", "true");
  await expect(canvas).toHaveAttribute("data-h-phase", "settled");

  const replayStarted = await hTarget.evaluate((button) => {
    (button as HTMLButtonElement).click();
    return document.querySelector<HTMLCanvasElement>(".thom-logo--hero canvas")?.dataset.renderLoop;
  });
  expect(replayStarted).toBe("running");
  await expect(canvas).toHaveAttribute("data-render-loop", "stopped", { timeout: 1300 });

  const interruptStarted = await hTarget.evaluate((button) => {
    (button as HTMLButtonElement).click();
    return document.querySelector<HTMLCanvasElement>(".thom-logo--hero canvas")?.dataset.renderLoop;
  });
  expect(interruptStarted).toBe("running");
  await page.getByRole("button", { name: "Replay T foundations animation" }).evaluate((button) => (button as HTMLButtonElement).click());
  await expect(canvas).toHaveAttribute("data-h-phase", "settled");
  await expect(canvas).toHaveAttribute("data-render-loop", "stopped", { timeout: 900 });
});

test("scales construction strokes and glow with the hero geometry", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("thom:intro:v1", "complete"));
  await page.setViewportSize({ width: 1180, height: 760 });
  await page.goto("/brand#mark");
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
  for (const asset of ["thom-master.svg", "glyph-m.svg", "thom-compact.svg", "thom-micro.svg"]) {
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
    await page.goto("/brand");
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
    // Diffuse halo and highlight pixels move slightly across raster scales;
    // the midtone sample remains the tighter material-density contract.
    expect(metric.densityDelta).toBeLessThanOrEqual(metric.threshold === 55 ? 0.1 : 0.15);
    expect(metric.centroidDelta).toBeLessThanOrEqual(0.025);
    expect(Math.max(...metric.quadrantDeltas)).toBeLessThanOrEqual(0.04);
    expect(metric.mismatch).toBeLessThanOrEqual(metric.threshold === 18 ? 0.32 : 0.54);
  });
});

test("keeps the H crossbar readable and bounded across hero sizes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "This compares two fixed one-pixel desktop raster scales.");
  await page.addInitScript(() => sessionStorage.setItem("thom:intro:v1", "complete"));
  const captures: Array<{ width: number; buffer: Buffer; measurement: ReturnType<typeof hHeroCrossbarRatio> }> = [];
  for (const width of [668, 1746]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/brand");
    const logo = page.locator(".thom-logo--hero");
    await expect(logo).toHaveClass(/is-webgl-ready/);
    await expect(logo.locator("canvas")).toHaveAttribute("data-render-loop", "stopped", { timeout: 3000 });
    const buffer = await logo.screenshot({ animations: "disabled" });
    captures.push({ width, buffer, measurement: hHeroCrossbarRatio(buffer) });
    await testInfo.attach(`h-responsive-${width}`, { body: buffer, contentType: "image/png" });
  }
  const [small, large] = captures;
  // The half-maximum sample includes the luminous halo, so its apparent width
  // is intentionally size-dependent. Guard visibility and domination instead
  // of treating one raster ratio as a universal aesthetic constant.
  captures.forEach(({ measurement }) => {
    expect(measurement.crossbarWidth).toBeGreaterThan(0);
    expect(measurement.ratio).toBeGreaterThanOrEqual(0.12);
    expect(measurement.ratio).toBeLessThanOrEqual(0.5);
  });
  expect(small.measurement.crossbarWidth).toBeLessThanOrEqual(large.measurement.crossbarWidth + 1e-9);
});

test("replays the isolated M for 820 ms and returns to a stopped loop", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "The mobile viewport deliberately stops the offscreen isolated WebGL stage.");
  await page.goto("/brand#mark");
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
  await page.goto("/brand#mark");
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
  // Material shading changes which antialiased edge pixels clear the fixed
  // luminance threshold; the near-exact bounds are the primary geometry gate.
  expect(parity.iou).toBeGreaterThanOrEqual(0.75);
  expect(parity.widthDelta).toBeLessThanOrEqual(0.05);
  expect(parity.heightDelta).toBeLessThanOrEqual(0.05);
});

test("keeps the settled H geometry in SVG and WebGL parity after keyboard replay", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "The desktop parity fixture has a fixed one-pixel raster scale.");
  await page.goto("/brand#mark");
  const hControl = page.getByRole("button", { name: /Equilibrium/ });
  await hControl.focus();
  await expect(hControl).toBeFocused();

  const stage = page.locator(".glyph-stage");
  const canvas = stage.locator("canvas");
  await expect(stage).toHaveClass(/is-webgl-ready/);
  await hControl.press("Enter");
  await expect(hControl).toHaveAttribute("aria-pressed", "true");
  await expect(canvas).toHaveAttribute("data-h-saw-spiral", "true", { timeout: 1500 });
  await expect(canvas).toHaveAttribute("data-render-loop", "stopped", { timeout: 1300 });
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
  await page.addInitScript(() => sessionStorage.setItem("thom:intro:v1", "complete"));
  await page.goto("/brand#mark");
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
  await page.goto("/brand#mark");
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
  await page.goto("/brand");
  await expect(page.locator(".thom-logo--hero .thom-logo__fallback")).toBeVisible();
  await expect(page.locator(".thom-logo--hero")).not.toHaveClass(/is-webgl-ready/);
});

test("keeps the static identity under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/brand");
  await expect(page.locator(".thom-logo--hero .thom-logo__fallback")).toBeVisible();
  const canvas = page.locator(".thom-logo--hero canvas");
  await expect(canvas).toBeHidden();
  await expect(canvas).toHaveAttribute("data-render-loop", "stopped");
  const orbit = page.locator(".hero-orbit");
  await page.getByRole("button", { name: "Replay H equilibrium animation" }).hover();
  await expect(orbit).toHaveAttribute("data-active-glyph", "h");
  expect(await orbit.evaluate((element) => element.querySelector('[data-orbit-motif="h"]')?.getAnimations({ subtree: true }).length ?? 0)).toBe(0);
  await expect(orbit.locator("[data-orbit-ring]")).toHaveCount(3);
  await page.getByRole("button", { name: "Replay H equilibrium animation" }).evaluate((button) => (button as HTMLButtonElement).click());
  await expect(canvas).toHaveAttribute("data-render-loop", "stopped");
});

test("uses size-aware utility assets and exposes alternate downloads", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/brand");
  const header = page.locator(".thom-logo--header");
  await expect(header).toHaveAttribute("data-optical-profile", "micro");
  await expect(header.locator("img")).toHaveAttribute("src", "/brand/thom-micro.svg");
  for (const asset of ["thom-light.svg", "thom-monochrome.svg", "thom-micro.svg"]) {
    const response = await page.request.get(`/brand/${asset}`);
    expect(response.ok()).toBe(true);
    expect(await response.text()).toContain("<title id=\"title\">THOM</title>");
  }
});

test("navigates to the prerendered writing section without losing app state", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("thom:intro:v1", "complete"));
  await page.goto("/");
  await page.evaluate(() => ((window as Window & { portfolioSentinel?: string }).portfolioSentinel = "alive"));
  await page.locator(".site-header").getByRole("link", { name: "Writings", exact: true }).click();
  await expect(page).toHaveURL(/\/writing\/?$/);
  await expect(page.getByRole("heading", { name: "Ideas with enough structure to navigate." })).toBeVisible();
  expect(await page.evaluate(() => (window as Window & { portfolioSentinel?: string }).portfolioSentinel)).toBe("alive");
});

test("keeps one shared header and footer while route content changes", async ({ page }) => {
  test.slow();
  await page.addInitScript(() => sessionStorage.setItem("thom:intro:v1", "complete"));
  await page.goto("/");

  const header = page.locator(".site-header");
  const footer = page.locator(".site-footer");
  const navigation = header.getByRole("navigation", { name: "Primary navigation" });
  await expect(header).toHaveCount(1);
  await expect(footer).toHaveCount(1);
  await expect(header.getByText("th-m.codes", { exact: true })).toHaveCount(0);
  await expect(navigation.getByRole("link")).toHaveCount(1);
  await expect(navigation.getByRole("link", { name: "Writings", exact: true })).toHaveAttribute("href", "/writing");
  await expect(navigation.getByRole("link", { name: "Home", exact: true })).toHaveCount(0);
  await expect(navigation.getByRole("link", { name: "Brand", exact: true })).toHaveCount(0);
  await expect(navigation.getByRole("link", { name: "System", exact: true })).toHaveCount(0);
  await header.evaluate((element) => { element.setAttribute("data-layout-sentinel", "persistent"); });

  const brandLink = header.getByRole("link", { name: "THOM — brand" });
  await expect(brandLink).toHaveAttribute("href", "/brand");
  await brandLink.click();
  await expect(page).toHaveURL(/\/brand$/);
  await expect(page.getByRole("heading", { name: "Measured to stay itself at every scale." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Color with a job to do." })).toBeVisible();
  await expect(header).toHaveAttribute("data-layout-sentinel", "persistent");

  await navigation.getByRole("link", { name: "Writings", exact: true }).click();
  await expect(page).toHaveURL(/\/writing\/?$/);
  await expect(page.getByRole("heading", { name: "Ideas with enough structure to navigate." })).toBeVisible();
  await expect(header).toHaveAttribute("data-layout-sentinel", "persistent");
  await expect(navigation.getByRole("link", { name: "Writings", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(header).toHaveCount(1);
  await expect(footer).toHaveCount(1);
});

test.describe("no JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("prerenders the minimal home and writings section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "THOM — Thomas Valadez" })).toBeAttached();
    await expect(page.getByRole("heading", { name: "AI Factory" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Laws" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Explore the writing" })).toBeVisible();
  });

  test("prerenders the full brand page and static mark", async ({ page }) => {
    await page.goto("/brand");
    await expect(page.getByRole("heading", { name: "THOM — Thomas Valadez" })).toBeAttached();
    await expect(page.getByRole("heading", { name: "Software Design" })).toBeVisible();
    await expect(page.locator(".thom-logo--hero .thom-logo__fallback")).toBeVisible();
  });

  test("serves the writing index as navigable prerendered HTML", async ({ page }) => {
    await page.goto("/writing");
    await expect(page.getByRole("heading", { name: "Ideas with enough structure to navigate." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "AI Factory series" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Goals, Solutions & Value" })).toBeVisible();
    await expect(page.getByRole("link", { name: "AI Consciousness Is Incoherent" })).toBeVisible();
    await expect(page.getByRole("list", { name: "Addenda to AI Consciousness Is Incoherent" }))
      .toContainText("AI's Consciousness explanation");
    await expect(page.getByRole("heading", { name: "AI's Consciousness explanation" })).toHaveCount(0);
  });
});
