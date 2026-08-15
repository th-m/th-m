import { resolve } from "node:path";
import { chromium } from "playwright";

const output = resolve(import.meta.dir);
const backgroundPath = resolve(output, "14-alignment-mockup-perimeter-refined.png");
const background = await Bun.file(backgroundPath).arrayBuffer();
const backgroundData = Buffer.from(background).toString("base64");

const html = `<!doctype html><html><head><style>
  html,body{margin:0;background:#c5b6f4}svg{display:block;width:2300px;height:760px}
  text{font-family:ui-monospace,Menlo,monospace}
</style></head><body><svg xmlns="http://www.w3.org/2000/svg" width="2300" height="760" viewBox="0 0 2300 760">
  <image href="data:image/png;base64,${backgroundData}" width="2300" height="760"/>
  <g font-size="19" letter-spacing="1.2" fill="#17131b"><rect x="70" y="18" width="1090" height="42" rx="6" fill="#c5b6f4" opacity=".94"/><text x="88" y="46">MASTER VISUAL UNIT · 1u = 5 RENDERED PX</text></g>

  <g stroke="#e83e8c" stroke-width="4" fill="none" stroke-linecap="square">
    <!-- Black-ink spans at construction line: T left 53px, T right 38px, H shafts 16px. -->
    <path d="M231 300H283M231 288V312M283 288V312"/>
    <path d="M338 300H375M338 288V312M375 288V312"/>
    <path d="M627 300H642M627 288V312M642 288V312"/>
    <path d="M847 300H862M847 288V312M862 288V312"/>
    <!-- O perimeter samples: side and cap/base weights. -->
    <path d="M1318 294H1331M1318 282V306M1331 282V306"/>
    <path d="M1148 89V104M1136 89H1160M1136 104H1160"/>
  </g>

  <g fill="#a81962" font-size="17" font-weight="600">
    <text x="196" y="348">T-L · 10.6u / 53px</text><text x="320" y="378">T-R · 7.6u / 38px</text>
    <text x="568" y="348">H-L · 3.2u / 16px</text><text x="808" y="348">H-R · 3.2u / 16px</text>
    <text x="1344" y="275">O side rim · 2.3u / 11.5px</text><text x="1169" y="126">O cap/base rim · 3.0u / 14.9px</text>
  </g>

  <g fill="#1f75a8" font-size="17"><text x="140" y="696">CONSTRUCTION-LINE INK WIDTHS: measured as visible black span; no cap or foot flare included.</text><text x="140" y="722">CAP → BASE: 89u / 445px for every character. M remains textural waveform, so it has no comparable pillar width.</text></g>
</svg></body></html>`;

const htmlPath = resolve(output, "22-typography-master-measure-board.html");
const pngPath = resolve(output, "22-typography-master-measure-board.png");
await Bun.write(htmlPath, html);

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 2300, height: 760 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "load" });
  await page.screenshot({ path: pngPath });
} finally {
  await browser.close();
}
