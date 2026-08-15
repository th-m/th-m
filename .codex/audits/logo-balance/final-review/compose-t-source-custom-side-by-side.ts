import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { brandData } from "../../../../src/brand/thom/brandData";
import { renderGlyphContent } from "../../../../src/brand/thom/svg";

const output = resolve(import.meta.dir);
const sourceT = renderGlyphContent(brandData, "t", "monochrome");
const customT = sourceT.replace('fill="#000000"', 'fill="#1f75a8"');
const glyph = (content: string) => `<g transform="translate(34 -.222) scale(.62 1.03)">${content}</g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="680" viewBox="0 0 320 136">
  <defs>
    <clipPath id="left-top"><path d="M0 0 H100 V23.4 H0 Z"/></clipPath><clipPath id="left-leg"><path d="M0 22 H54 V120 H0 Z"/></clipPath><clipPath id="right-leg"><path d="M54 22 H100 V120 H54 Z"/></clipPath>
  </defs>
  <rect width="320" height="136" fill="#c5b6f4"/>
  <g stroke="#17131b" fill="none" opacity=".82"><line x1="12" x2="308" y1="15" y2="15"/><line x1="12" x2="308" y1="60" y2="60" opacity=".55"/><line x1="12" x2="308" y1="104" y2="104"/></g>
  <g fill="#17131b" font-family="ui-monospace, monospace" font-size="4.1" letter-spacing=".35"><text x="24" y="9">SOURCE T</text><text x="179" y="9">THREE-GROUP BÉZIER T</text><text x="2" y="16.5">CAP</text><text x="2" y="105.5">BASE</text></g>
  <g fill="none" stroke="#17131b" stroke-dasharray="3 3" opacity=".48"><rect x="18" y="15" width="124" height="89"/><rect x="178" y="15" width="124" height="89"/></g>
  <g fill="#000" transform="translate(0 0)">${glyph(sourceT)}</g>
  <g transform="translate(160 0)">
    <g id="t-top-bar" clip-path="url(#left-top)" opacity="1">${glyph(customT)}</g>
    <g id="t-left-pillar" clip-path="url(#left-leg)" opacity="1">${glyph(customT)}</g>
    <g id="t-right-pillar" clip-path="url(#right-leg)" opacity="1">${glyph(customT)}</g>
  </g>
  <g fill="#17131b" font-family="ui-monospace, monospace" font-size="3.3"><text x="33" y="123">one source Bézier contour</text></g>
  <g fill="#1f75a8" font-family="ui-monospace, monospace" font-size="3.3"><text x="190" y="123">top / left / right groups</text></g>
</svg>`;

await Bun.write(resolve(output, "17-t-source-custom-side-by-side.svg"), `${svg}\n`);
await Bun.write(resolve(output, "17-t-source-custom-side-by-side.png"), new Resvg(svg, { fitTo: { mode: "width", value: 1600 } }).render().asPng());
