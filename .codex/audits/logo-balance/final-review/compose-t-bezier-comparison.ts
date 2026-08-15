import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { brandData } from "../../../../src/brand/thom/brandData";
import { renderGlyphContent } from "../../../../src/brand/thom/svg";

const output = resolve(import.meta.dir);
const cap = 15;
const baseline = 104;
const sourceT = renderGlyphContent(brandData, "t", "monochrome");

// Every segment is a cubic Bézier; no polygonal point mapping or clipped scale.
const roof = "M24 34 C27 23 36 13 49 13 C65 13 83 14 98 12.5 C103 12.2 105.5 10 106 7.5 C107 7 108 7 108.5 7.5 C107.8 14.3 104 17.3 97 17.5 C87 17.8 79 17.4 70.5 17.7 C70 19.2 69.6 20.7 69.1 22.2 C67.4 21.5 65.5 21.5 63.8 22.2 C64.1 20.6 64.4 19 64.7 17.7 L58.8 17.7 C58.5 19.2 58.2 20.7 57.8 22.2 C56.1 21.5 54.1 21.5 52.4 22.2 C52.8 20.6 53.1 19 53.4 17.7 C41 17.8 31.5 23.6 24 34 Z";
const leftLeg = "M53.4 17.3 C55.1 17.1 57 17.1 58.8 17.3 C58.1 31.1 56.3 48 53.4 64.3 C50.7 80.4 46.3 93.9 40 99.5 C37.8 101.6 35 102.3 32.7 101.1 C40.6 87.7 44.2 72 46.7 55.1 C48.7 41.2 50.6 27.8 53.4 17.3 Z";
const rightLeg = "M64.7 17.3 C66.4 17.1 68.2 17.1 70 17.3 C68.5 34.5 67.3 49 67.7 61.4 C68.2 75.4 71.2 87.4 76.2 90.5 C80.2 93.1 84.8 85.9 87.7 77.4 C88.8 77.1 90.1 77.2 91 77.5 C87.5 95 80.5 102.2 72.7 100.2 C64.7 98.1 62.2 89 63.2 73.7 C64.3 55.1 65.2 33 64.7 17.3 Z";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="680" viewBox="0 0 320 136">
  <rect width="320" height="136" fill="#c5b6f4"/>
  <g stroke="#17131b" fill="none" opacity=".82"><line x1="12" x2="308" y1="${cap}" y2="${cap}"/><line x1="12" x2="308" y1="60" y2="60" opacity=".55"/><line x1="12" x2="308" y1="${baseline}" y2="${baseline}"/></g>
  <g fill="#17131b" font-family="ui-monospace, monospace" font-size="4.2" letter-spacing=".4"><text x="12" y="9">SOURCE T</text><text x="172" y="9">CUSTOM BÉZIER T</text><text x="2" y="16.5">CAP</text><text x="2" y="105.5">BASE</text></g>
  <g fill="none" stroke="#17131b" stroke-dasharray="3 3" opacity=".5"><rect x="18" y="15" width="120" height="89"/><rect x="178" y="15" width="120" height="89"/></g>
  <g fill="#000"><g transform="translate(31 -.222) scale(.62 1.03)">${sourceT}</g></g>
  <g fill="#000" transform="translate(154 0)"><path d="${roof}"/><path d="${leftLeg}"/><path d="${rightLeg}"/></g>
  <g fill="#17131b" font-family="ui-monospace, monospace" font-size="3.3"><text x="30" y="123">existing source contour</text><text x="190" y="123">independent roof + legs</text></g>
</svg>`;

await Bun.write(resolve(output, "15-t-bezier-comparison.svg"), `${svg}\n`);
await Bun.write(resolve(output, "15-t-bezier-comparison.png"), new Resvg(svg, { fitTo: { mode: "width", value: 1600 } }).render().asPng());
