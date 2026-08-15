import { resolve } from "node:path";
import { chromium } from "playwright";
import { brandData } from "../../../../src/brand/thom/brandData";
import { renderGlyphContent } from "../../../../src/brand/thom/svg";

const output = resolve(import.meta.dir);
const masterSource = await Bun.file(resolve(output, "14-alignment-mockup-perimeter-refined.svg")).text();
const tContours = masterSource.match(/<!-- T:[\s\S]*?-->\s*([\s\S]*?)\s*<!-- H:/)?.[1];
const hSourcePath = renderGlyphContent(brandData, "h", "monochrome")
  .match(/<path d="M17\.2[^>]*\/>/)?.[0];

if (!tContours || !hSourcePath) throw new Error("Could not load the master T/H contours.");

const hPathD = hSourcePath.match(/d="([^"]+)"/)?.[1];
if (!hPathD) throw new Error("Could not read the H pillar contour.");

// Bake the review board's former scale(.74 1) + placement into the path itself.
// This changes coordinates only; the rendered H silhouette is identical.
const hScaleX = 0.74;
const hPlacedAtX = 141.5;
let coordinateIsX = true;
const bakedHPillarD = hPathD.replace(/-?\d+(?:\.\d+)?/g, (token) => {
  const value = Number(token);
  const next = coordinateIsX ? value * hScaleX + hPlacedAtX : value;
  coordinateIsX = !coordinateIsX;
  return Number(next.toFixed(4)).toString();
});

const html = `<!doctype html><html><head><style>
  html,body{margin:0;background:#c5b6f4}svg{display:block;width:1600px;height:720px}
  text{font-family:ui-monospace,Menlo,monospace}
</style></head><body><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 144">
  <rect width="320" height="144" fill="#c5b6f4"/>
  <g stroke="#17131b" stroke-width=".85" fill="none" opacity=".82">
    <line x1="12" x2="308" y1="15" y2="15"/>
    <line x1="12" x2="308" y1="60" y2="60" opacity=".55"/>
    <line x1="12" x2="308" y1="104" y2="104"/>
  </g>
  <g fill="#17131b" font-size="4.1" letter-spacing=".35">
    <text x="16" y="9">MASTER-SPACE RASTER CHECK · T vs H PILLARS</text>
    <text x="2" y="16.5">CAP</text><text x="2" y="61.5">MID</text><text x="2" y="105.5">BASE</text>
  </g>
  <!-- The three T Bézier contours already live in the #14 master space. -->
  <g fill="#000">${tContours}</g>
  <!-- H is the same visual pillar, now with its .74 horizontal scale baked into d. -->
  <path d="${bakedHPillarD}" fill="#000"/>
  <g fill="#1f75a8" font-size="3.7">
    <text x="119" y="28">H pillar — baked master coordinates</text>
    <text x="119" y="34">same cap / baseline / browser raster scale</text>
  </g>
  <g fill="#17131b" font-size="3.5"><text x="65" y="116" text-anchor="middle">T: three Bézier contours</text><text x="162.9" y="116" text-anchor="middle">H: one pillar</text></g>
  <g fill="#4e4869" font-size="3.1"><text x="16" y="136">no glyph scaling at render time · 1 master unit = 5 browser pixels</text></g>
</svg></body></html>`;

const metadata = {
  source: "14-alignment-mockup-perimeter-refined.svg",
  masterViewBox: { width: 460, height: 152, capLine: 15, baseline: 104 },
  rendering: { browserPixelsPerMasterUnit: 5, tRuntimeTransform: "none", hRuntimeTransform: "none" },
  bakedHTransform: { sourceScaleX: hScaleX, xPlacement: hPlacedAtX },
  protocol: "Compare horizontal ink spans only at the same normalized y coordinate; exclude the T roof and terminal flourishes.",
};

const htmlPath = resolve(output, "20-t-h-master-normalized-render.html");
const pngPath = resolve(output, "20-t-h-master-normalized-render.png");
const jsonPath = resolve(output, "20-t-h-master-normalized-render.json");
await Bun.write(htmlPath, html);
await Bun.write(jsonPath, `${JSON.stringify(metadata, null, 2)}\n`);

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 720 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "load" });
  await page.screenshot({ path: pngPath });
} finally {
  await browser.close();
}
