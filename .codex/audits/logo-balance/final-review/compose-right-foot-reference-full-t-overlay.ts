import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";

const output = resolve(import.meta.dir);
const source = await Bun.file(resolve(output, "compose-alignment-mockup.ts")).text();
const tracedT = source.match(/const tracedTGroups = `([\s\S]*?)`;/)?.[1];

if (!tracedT) throw new Error("Could not read the current T contours.");

const cap = 15;
const baseline = 104;
const gridLeft = 20;
const gridRight = 106;
const row10 = 72.2143;
const row12 = 84.9286;
const gridLines = Array.from({ length: 15 }, (_, index) => {
  const y = cap + (index * (baseline - cap)) / 14;
  return `<line x1="${gridLeft}" x2="${gridRight}" y1="${y}" y2="${y}"/>`;
}).join("");

// The user-drawn two-cubic foot, transformed to the current source endpoints:
// row-10 edges and the M–N / row-12 cusp. It is intentionally an overlay only.
const fittedReference = "M57.09512 70.3265 C57.09512 70.3265 41.90036 110.0634 86.9601 82.6705 C86.9601 82.6705 35.70465 119.64517 52.58655 70.3265 L57.09512 70.3265 Z";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1600" viewBox="0 0 180 160">
  <rect width="180" height="160" fill="#c5b6f4"/>
  <rect x="12" y="0" width="136" height="${cap}" fill="#f8df9e" opacity=".34"/>
  <rect x="12" y="${baseline}" width="136" height="12" fill="#f8df9e" opacity=".34"/>
  <g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" fill="#17131b">
    <text x="12" y="10" font-size="5" letter-spacing=".5">T · YOUR RIGHT-FOOT REFERENCE OVERLAY</text>
    <text x="12" y="16" font-size="2.7" fill="#4b416a">GREY = YOUR 2 CUBICS + CLOSING EDGE · BLACK = CURRENT FILLED T</text>
  </g>
  <g fill="none" stroke="#17131b" stroke-width=".32" stroke-dasharray="2 2" opacity=".55">${gridLines}</g>
  <g fill="none" stroke="#17131b" stroke-width=".7" opacity=".8">
    <line x1="${gridLeft}" x2="${gridRight}" y1="${cap}" y2="${cap}"/>
    <line x1="${gridLeft}" x2="${gridRight}" y1="${baseline}" y2="${baseline}"/>
  </g>
  <g fill="#000000">${tracedT}</g>
  <g transform="translate(22 -.222) scale(.86 1.03)" fill="none" stroke="#706b72" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="${fittedReference}"/>
  </g>
  <g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="3" fill="#4b416a">
    <text x="6" y="${cap + 1}">CAP</text>
    <text x="6" y="${baseline + 1}">BASE</text>
    <text x="112" y="${row10 - 1.4}">ROW 10</text>
    <text x="112" y="${row12 - 1.4}">ROW 12</text>
    <text x="12" y="126">FULL T CONTEXT · ROOF AND LEFT PILLAR UNCHANGED</text>
  </g>
  <g stroke="#706b72" stroke-width=".45" stroke-dasharray="1.4 1.8">
    <line x1="108" x2="148" y1="${row10}" y2="${row10}"/>
    <line x1="108" x2="148" y1="${row12}" y2="${row12}"/>
  </g>
</svg>`;

const stem = "43-right-foot-reference-full-t-overlay";
await Bun.write(resolve(output, `${stem}.svg`), `${svg}\n`);
await Bun.write(resolve(output, `${stem}.png`), new Resvg(svg, { fitTo: { mode: "width", value: 1800 } }).render().asPng());
