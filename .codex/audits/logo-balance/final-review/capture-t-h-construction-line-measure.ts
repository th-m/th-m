import { resolve } from "node:path";
import { chromium } from "playwright";
import { brandData } from "../../../../src/brand/thom/brandData";
import { renderGlyphContent } from "../../../../src/brand/thom/svg";

const output = resolve(import.meta.dir);
const source = await Bun.file(resolve(output, "14-alignment-mockup-perimeter-refined.svg")).text();
const tContours = source.match(/<!-- T:[\s\S]*?-->\s*([\s\S]*?)\s*<!-- H:/)?.[1];
const hPaths = [...renderGlyphContent(brandData, "h", "monochrome").matchAll(/<path d="([^"]+)" fill="#000000"\/>/g)].map((match) => match[1]);

if (!tContours || hPaths.length < 2) throw new Error("Could not locate the #14 T/H pillar contours.");

const bakeX = (d: string, scaleX: number, translateX: number) => {
  let isX = true;
  return d.replace(/-?\d+(?:\.\d+)?/g, (token) => {
    const value = Number(token);
    const next = isX ? value * scaleX + translateX : value;
    isX = !isX;
    return Number(next.toFixed(4)).toString();
  });
};

// Exact #14 H transforms, baked into the paths for a single master coordinate system.
const hLeft = bakeX(hPaths[0], 0.74, 98.975 + 9.5);
const hRight = bakeX(hPaths[1], 0.74, 98.975 + 16.5);

const measures = [
  { key: "T left", start: 46.2, end: 56.8, labelY: 113 },
  { key: "T right", start: 67.6, end: 75.2, labelY: 119 },
  { key: "H left", start: 125.4, end: 128.6, labelY: 113 },
  { key: "H right", start: 169.4, end: 172.6, labelY: 113 },
].map((measure) => ({ ...measure, masterUnits: Number((measure.end - measure.start).toFixed(3)) }));

const dimensionLines = measures.map(({ start, end, masterUnits, key, labelY }) => {
  const center = (start + end) / 2;
  return `<g stroke="#e83e8c" fill="none" stroke-width=".7">
    <line x1="${start}" x2="${end}" y1="60" y2="60"/>
    <line x1="${start}" x2="${start}" y1="57.7" y2="62.3"/><line x1="${end}" x2="${end}" y1="57.7" y2="62.3"/>
  </g><text x="${center}" y="${labelY}" text-anchor="middle" fill="#a81962" font-size="3.3">${key}: ${masterUnits}u</text>`;
}).join("");

const html = `<!doctype html><html><head><style>
  html,body{margin:0;background:#c5b6f4}svg{display:block;width:1100px;height:660px}
  text{font-family:ui-monospace,Menlo,monospace}
</style></head><body><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 132">
  <rect width="220" height="132" fill="#c5b6f4"/>
  <g stroke="#17131b" fill="none" opacity=".82"><line x1="12" x2="208" y1="15" y2="15"/><line x1="12" x2="208" y1="60" y2="60" stroke-width="1.2"/><line x1="12" x2="208" y1="104" y2="104"/></g>
  <g fill="#17131b" font-size="4.1" letter-spacing=".25"><text x="16" y="9">CONSTRUCTION-LINE PILLAR WIDTHS · #14</text><text x="2" y="16.5">CAP</text><text x="2" y="61.5">MID</text><text x="2" y="105.5">BASE</text></g>
  <g fill="#000">${tContours}<path d="${hLeft}"/><path d="${hRight}"/></g>
  ${dimensionLines}
  <g fill="#4e4869" font-size="3.1"><text x="16" y="127">pink boundaries are sampled exactly at y=60 · 1 master unit = 5 Chromium pixels</text></g>
</svg></body></html>`;

const htmlPath = resolve(output, "21-t-h-construction-line-measure.html");
const pngPath = resolve(output, "21-t-h-construction-line-measure.png");
const jsonPath = resolve(output, "21-t-h-construction-line-measure.json");
await Bun.write(htmlPath, html);
await Bun.write(jsonPath, `${JSON.stringify({ constructionLineY: 60, browserPixelsPerMasterUnit: 5, measures }, null, 2)}\n`);

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1100, height: 660 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "load" });
  await page.screenshot({ path: pngPath });
} finally {
  await browser.close();
}
