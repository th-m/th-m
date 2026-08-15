import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { brandData } from "../../../../src/brand/thom/brandData";
import { renderGlyphContent } from "../../../../src/brand/thom/svg";

const output = resolve(import.meta.dir);
const sourceT = renderGlyphContent(brandData, "t", "monochrome");
const h = renderGlyphContent(brandData, "h", "monochrome")
  .replace(/(<polyline[^>]*stroke-width=")(.*?)("[^>]*data-h-part="(?:a|b)"[^>]*>)/g, (_m, a, width, b) => `${a}${(Number(width) * 1.45).toFixed(3)}${b}`)
  .replace(/(<path d="M17\.2[^>]*\/>)/, '<g transform="translate(9.5 0) scale(.74 1)">$1</g>')
  .replace(/(<path d="M67\.2[^>]*\/>)/, '<g transform="translate(16.5 0) scale(.74 1)">$1</g>');

const bracket = (x1: number, x2: number, y: number) => `<path d="M${x1} ${y - 2} V${y + 2} M${x1} ${y} H${x2} M${x2} ${y - 2} V${y + 2}"/>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="720" viewBox="0 0 320 144">
  <rect width="320" height="144" fill="#c5b6f4"/>
  <g stroke="#17131b" fill="none" opacity=".82"><line x1="12" x2="308" y1="15" y2="15"/><line x1="12" x2="308" y1="60" y2="60" opacity=".55"/><line x1="12" x2="308" y1="104" y2="104"/></g>
  <g fill="#17131b" font-family="ui-monospace, monospace" font-size="4.1" letter-spacing=".35"><text x="18" y="9">T CONTOUR</text><text x="151" y="9">H PILLAR</text><text x="2" y="16.5">CAP</text><text x="2" y="105.5">BASE</text></g>
  <g fill="#000"><g transform="translate(24 -.222) scale(.62 1.03)">${sourceT}</g><g transform="translate(120 0)">${h}</g></g>
  <g stroke="#2c9cff" fill="none" stroke-width=".9">
    ${bracket(27.2, 30.75, 30)}
    ${bracket(61.35, 71.95, 100)}
    ${bracket(142.228, 153.772, 60)}
  </g>
  <g fill="#1f75a8" font-family="ui-monospace, monospace" font-size="3.7">
    <text x="18" y="27">T thin: 3.55u · 31%</text><text x="18" y="34">of H pillar</text>
    <text x="40" y="115">T thick: 10.60u · 92%</text><text x="40" y="121">of H pillar</text>
    <text x="157" y="57">H: 11.54u · 100%</text>
  </g>
  <g fill="#4e4869" font-family="ui-monospace, monospace" font-size="3.1"><text x="18" y="136">master cap height: 89u · 1u = 5 export px</text></g>
</svg>`;

await Bun.write(resolve(output, "18-t-h-weight-comparison.svg"), `${svg}\n`);
await Bun.write(resolve(output, "18-t-h-weight-comparison.png"), new Resvg(svg, { fitTo: { mode: "width", value: 1600 } }).render().asPng());
