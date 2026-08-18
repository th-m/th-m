import { chromium } from "@playwright/test";
import sharp from "sharp";

const baseUrl = Bun.argv[2] ?? "http://127.0.0.1:4176";
const outputDirectory = new URL("../../public/brand-audit/", import.meta.url);
const browser = await chromium.launch({ headless: true });
const captures = [];

for (const width of [668, 1746]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  await page.addInitScript(() => sessionStorage.setItem("thom:intro:v1", "complete"));
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const hero = page.locator(".thom-logo--hero");
  const canvas = hero.locator("canvas");
  await hero.waitFor({ state: "visible" });
  await canvas.waitFor({ state: "visible" });
  await page.waitForFunction(() => document.querySelector(".thom-logo--hero canvas")?.getAttribute("data-render-loop") === "stopped");
  const heroPath = new URL(`responsive-o-current-${width}-hero.png`, outputDirectory);
  const heroBuffer = await hero.screenshot({ path: heroPath.pathname, animations: "disabled", scale: "css" });
  const metadata = await sharp(heroBuffer).metadata();
  const heroWidth = metadata.width ?? 0;
  const heroHeight = metadata.height ?? 0;
  const scale = heroWidth / 416;
  const crop = {
    left: Math.round((199.5 + 5 * 0.88) * scale),
    top: Math.round(14 * scale),
    width: Math.round(90 * 0.88 * scale),
    height: Math.round(90 * scale),
  };
  await sharp(heroBuffer)
    .extract(crop)
    .png()
    .toFile(new URL(`responsive-o-current-${width}-crop.png`, outputDirectory).pathname);
  captures.push({
    viewport: { width, height: 900 },
    hero: { width: heroWidth, height: heroHeight },
    crop,
    lineScale: await canvas.getAttribute("data-line-scale"),
    renderLoop: await canvas.getAttribute("data-render-loop"),
  });
  await page.close();
}

await browser.close();
await Bun.write(new URL("responsive-o-current-captures.json", outputDirectory), `${JSON.stringify(captures, null, 2)}\n`);
console.log(JSON.stringify(captures, null, 2));
