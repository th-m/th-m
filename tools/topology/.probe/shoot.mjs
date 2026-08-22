import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

mkdirSync(".bun-tmp/fig-inspect", { recursive: true });
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
await page.goto("http://localhost:5173/writing/truth-entropy-and-inference", { waitUntil: "domcontentloaded", timeout: 45000 });
await page.waitForSelector(".graph-figure__canvas canvas", { timeout: 30000 });
await page.waitForTimeout(5000);
const box = await page.evaluate(() => {
  const el = document.querySelector(".graph-figure__canvas");
  const r = el.getBoundingClientRect();
  return { x: r.x, y: r.y + window.scrollY, width: r.width, height: r.height };
});
console.log("figure doc box:", JSON.stringify(box));
await page.screenshot({ path: ".bun-tmp/fig-inspect/figure.png", clip: box });
console.log("saved");
await browser.close();
