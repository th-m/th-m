import { chromium } from "@playwright/test";

const baseUrl = Bun.argv[2] ?? "http://127.0.0.1:4173";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
await page.goto(`${baseUrl}/#mark`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /03 O Emergence/ }).evaluate((button) => (button as HTMLButtonElement).click());
const stage = page.locator(".glyph-stage");
await page.waitForFunction(() => document.querySelector(".glyph-stage canvas")?.getAttribute("data-render-loop") === "stopped");
await page.addStyleTag({ content: ".glyph-stage__fallback{visibility:hidden!important}.glyph-stage__canvas{visibility:visible!important;opacity:1!important;filter:none!important;transition:none!important}" });
await stage.screenshot({ path: "public/brand-audit/current/o-webgl.png", animations: "disabled", scale: "css" });
await page.addStyleTag({ content: ".glyph-stage__fallback{visibility:visible!important;opacity:1!important;transition:none!important}.glyph-stage__canvas{visibility:hidden!important}" });
await stage.screenshot({ path: "public/brand-audit/current/o-svg.png", animations: "disabled", scale: "css" });
console.log(await page.locator(".glyph-stage canvas").evaluate((canvas) => ({
  width: canvas.getBoundingClientRect().width,
  height: canvas.getBoundingClientRect().height,
  loop: canvas.getAttribute("data-render-loop"),
  lineScale: canvas.getAttribute("data-line-scale"),
})));
await browser.close();
