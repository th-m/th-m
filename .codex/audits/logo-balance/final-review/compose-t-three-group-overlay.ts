import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { brandData } from "../../../../src/brand/thom/brandData";
import { renderGlyphContent } from "../../../../src/brand/thom/svg";

const output = resolve(import.meta.dir);
const sourceT = renderGlyphContent(brandData, "t", "monochrome");
const customT = sourceT.replace('fill="#000000"', 'fill="#2c9cff"');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="680" viewBox="0 0 320 136">
  <defs>
    <!-- The three clips overlap by 1.4 local units, preventing raster seams. -->
    <clipPath id="t-top"><path d="M0 0 H100 V23.4 H0 Z"/></clipPath>
    <clipPath id="t-left"><path d="M0 22 H54 V120 H0 Z"/></clipPath>
    <clipPath id="t-right"><path d="M54 22 H100 V120 H54 Z"/></clipPath>
  </defs>
  <rect width="320" height="136" fill="#c5b6f4"/>
  <g stroke="#17131b" fill="none" opacity=".82"><line x1="12" x2="308" y1="15" y2="15"/><line x1="12" x2="308" y1="60" y2="60" opacity=".55"/><line x1="12" x2="308" y1="104" y2="104"/></g>
  <g fill="#17131b" font-family="ui-monospace, monospace" font-size="4.2" letter-spacing=".4"><text x="12" y="9">SOURCE T + THREE-GROUP BÉZIER OVERLAY</text><text x="2" y="16.5">CAP</text><text x="2" y="105.5">BASE</text></g>
  <g transform="translate(110 -.222) scale(.92 1.03)">
    <!-- Original source silhouette, held as the black alignment reference. -->
    <g fill="#000">${sourceT}</g>
    <!-- Custom structural groups: each contains the exact same cubic Bézier contour. -->
    <g id="t-top-bar" clip-path="url(#t-top)" opacity=".42">${customT}</g>
    <g id="t-left-pillar" clip-path="url(#t-left)" opacity=".42">${customT}</g>
    <g id="t-right-pillar" clip-path="url(#t-right)" opacity=".42">${customT}</g>
  </g>
  <g fill="#2c9cff" font-family="ui-monospace, monospace" font-size="3.5"><text x="116" y="124">blue = custom Bézier groups</text><text x="116" y="130">black edge = source reference</text></g>
</svg>`;

await Bun.write(resolve(output, "16-t-three-group-overlay.svg"), `${svg}\n`);
await Bun.write(resolve(output, "16-t-three-group-overlay.png"), new Resvg(svg, { fitTo: { mode: "width", value: 1600 } }).render().asPng());
