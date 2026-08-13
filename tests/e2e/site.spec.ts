import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { PNG } from "pngjs";

function silhouette(png: PNG, threshold = 180) {
  const mask = new Uint8Array(png.width * png.height);
  let minX = png.width;
  let minY = png.height;
  let maxX = -1;
  let maxY = -1;
  for (let index = 0; index < mask.length; index += 1) {
    const offset = index * 4;
    const luminance = (png.data[offset] + png.data[offset + 1] + png.data[offset + 2]) / 3;
    if (luminance <= threshold) continue;
    mask[index] = 1;
    const x = index % png.width;
    const y = Math.floor(index / png.width);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  return { mask, width: maxX - minX + 1, height: maxY - minY + 1 };
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
  await page.goto("/");
  const heroCanvas = page.locator(".thom-logo--hero canvas");
  await expect(heroCanvas).toHaveAttribute("data-render-loop", "stopped", { timeout: 3000 });
  const firstGlyph = page.getByRole("button", { name: "Replay T foundations animation" });
  await firstGlyph.focus();
  await expect(heroCanvas).toHaveAttribute("data-render-loop", "running");
  await expect(heroCanvas).toHaveAttribute("data-render-loop", "stopped", { timeout: 1500 });
});

test("keeps the settled M geometry in SVG and WebGL parity", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "The desktop parity fixture has a fixed one-pixel raster scale.");
  await page.goto("/#mark");
  await page.getByRole("button", { name: /Superposition/ }).click();
  const stage = page.locator(".glyph-stage");
  const canvas = stage.locator("canvas");
  await expect(stage).toHaveClass(/is-webgl-ready/);
  await expect(canvas).toHaveAttribute("data-render-loop", "stopped", { timeout: 2000 });

  await page.addStyleTag({ content: ".glyph-stage__fallback{opacity:0!important}.glyph-stage__canvas{opacity:1!important;filter:none!important}" });
  const webglBuffer = await stage.screenshot({ animations: "disabled" });
  const webgl = PNG.sync.read(webglBuffer);
  await page.addStyleTag({ content: ".glyph-stage__fallback{opacity:1!important}.glyph-stage__canvas{opacity:0!important}" });
  const svgBuffer = await stage.screenshot({ animations: "disabled" });
  const svg = PNG.sync.read(svgBuffer);
  await testInfo.attach("settled-m-webgl", { body: webglBuffer, contentType: "image/png" });
  await testInfo.attach("settled-m-svg", { body: svgBuffer, contentType: "image/png" });
  expect({ width: webgl.width, height: webgl.height }).toEqual({ width: svg.width, height: svg.height });

  const webglSilhouette = silhouette(webgl);
  const svgSilhouette = silhouette(svg);
  expect(silhouetteIoU(webglSilhouette.mask, svgSilhouette.mask)).toBeGreaterThanOrEqual(0.72);
  expect(Math.abs(webglSilhouette.width - svgSilhouette.width) / svgSilhouette.width).toBeLessThanOrEqual(0.05);
  expect(Math.abs(webglSilhouette.height - svgSilhouette.height) / svgSilhouette.height).toBeLessThanOrEqual(0.05);
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
