import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

mkdirSync(".bun-tmp/fig-inspect", { recursive: true });
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
await page.goto("http://localhost:5173/writing/truth-entropy-and-inference", { waitUntil: "domcontentloaded", timeout: 45000 });
await page.waitForSelector(".graph-figure__canvas canvas", { timeout: 30000 });
await page.waitForTimeout(5000);
await page.evaluate(() => window.scrollTo(0, 5900));
await page.waitForTimeout(800);
const box = await page.evaluate(() => {
  const r = document.querySelector(".graph-figure__canvas").getBoundingClientRect();
  return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
});
console.log("box:", JSON.stringify(box));
await page.screenshot({ path: ".bun-tmp/fig-inspect/figure.png", clip: box });
console.log("saved");
await browser.close();
