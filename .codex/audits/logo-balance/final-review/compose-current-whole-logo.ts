import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";

const output = resolve(import.meta.dir);
const source = await Bun.file(resolve(output, "14-alignment-mockup-perimeter-refined.svg")).text();
const glyphs = source.match(/<g fill="#000000">([\s\S]*?)\n<\/g>\n  <g font-family=/)?.[1];

if (!glyphs) throw new Error("Could not extract the current audit glyphs.");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="2300" height="600" viewBox="0 0 460 120">
  <rect width="460" height="120" fill="#c5b6f4"/>
  <g fill="#000000">${glyphs}</g>
</svg>`;

const stem = "45-current-whole-logo";
await Bun.write(resolve(output, `${stem}.svg`), `${svg}\n`);
await Bun.write(resolve(output, `${stem}.png`), new Resvg(svg, { fitTo: { mode: "width", value: 2300 } }).render().asPng());
