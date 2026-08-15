import { resolve } from "node:path";
import { chromium } from "playwright";
import { brandData } from "../../../../src/brand/thom/brandData";
import { renderGlyphContent } from "../../../../src/brand/thom/svg";

const output = resolve(import.meta.dir);
const sourceT = renderGlyphContent(brandData, "t", "monochrome");
const hLeftPillar = renderGlyphContent(brandData, "h", "monochrome")
  .match(/<path d="M17\.2[^>]*\/>/)?.[0]
  .replace('fill="#000000"', 'fill="#1687c5"');

if (!hLeftPillar) throw new Error("Could not locate the H left-pillar path.");

const hPillar = `<g transform="translate(9.5 0) scale(.74 1)">${hLeftPillar}</g>`;

const html = `<!doctype html><html><head><style>html,body{margin:0;background:#c5b6f4}svg{display:block;width:1600px;height:720px}text{font-family:ui-monospace,Menlo,monospace}</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 144">
  <rect width="320" height="144" fill="#c5b6f4"/>
  <g stroke="#17131b" fill="none" opacity=".82"><line x1="12" x2="308" y1="15" y2="15"/><line x1="12" x2="308" y1="60" y2="60" opacity=".55"/><line x1="12" x2="308" y1="104" y2="104"/></g>
  <g fill="#17131b" font-size="4.1" letter-spacing=".35"><text x="16" y="9">PLAYWRIGHT RASTER OVERLAY · T vs H PILLAR</text><text x="2" y="16.5">CAP</text><text x="2" y="105.5">BASE</text></g>
  <g transform="translate(34 -.222) scale(.62 1.03)" fill="#000">${sourceT}</g>
  <!-- Same H pillar, centered on each T shaft at the y=60 construction line. -->
  <g transform="translate(27.4 0)" opacity=".62">${hPillar}</g>
  <g transform="translate(41.7 0)" opacity=".62">${hPillar}</g>
  <g fill="#1f75a8" font-size="3.7"><text x="108" y="28">blue: rendered H pillar behind each T shaft</text><text x="108" y="34">centred independently at the y=60 construction line</text><text x="92" y="116">compare the blue edge reveal at the shared cross-section</text></g>
  <g fill="#4e4869" font-size="3.1"><text x="16" y="136">black T is unchanged; screenshot captured in Chromium via Playwright</text></g>
</svg></body></html>`;

const htmlPath = resolve(output, "19-t-h-playwright-overlay.html");
const pngPath = resolve(output, "19-t-h-playwright-overlay.png");
await Bun.write(htmlPath, html);

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 720 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "load" });
  await page.screenshot({ path: pngPath });
} finally {
  await browser.close();
}
