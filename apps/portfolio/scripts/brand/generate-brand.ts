import { mkdir } from "node:fs/promises";
import { Resvg } from "@resvg/resvg-js";
import { createBrandData } from "@th-m/thom-brand/geometry";
import {
  renderAvatarSvg,
  renderFaviconSvg,
  renderGlyphSvg,
  renderLogoSvg,
  renderOpenGraphSvg,
} from "../../src/brand/thom/svg";

const data = createBrandData();
const publicDirectory = new URL("../../public/brand/", import.meta.url);

await mkdir(publicDirectory, { recursive: true });


const assets = new Map<string, string>([
  ["thom-master.svg", renderLogoSvg(data)],
  ["thom-compact.svg", renderLogoSvg(data, "dark", "compact")],
  ["thom-micro.svg", renderLogoSvg(data, "dark", "micro")],
  ["thom-light.svg", renderLogoSvg(data, "light")],
  ["thom-monochrome.svg", renderLogoSvg(data, "monochrome")],
  ["favicon.svg", renderFaviconSvg(data)],
  ["avatar.svg", renderAvatarSvg(data)],
  ["glyph-t.svg", renderGlyphSvg(data, "t")],
  ["glyph-h.svg", renderGlyphSvg(data, "h")],
  ["glyph-o.svg", renderGlyphSvg(data, "o")],
  ["glyph-m.svg", renderGlyphSvg(data, "m")],
]);

await Promise.all([...assets].map(([name, content]) => Bun.write(new URL(name, publicDirectory), `${content}\n`)));
const openGraphSvg = renderOpenGraphSvg(data);
await Bun.write(new URL("thom-og.svg", publicDirectory), `${openGraphSvg}\n`);
const renderer = new Resvg(openGraphSvg, { fitTo: { mode: "width", value: 1200 } });
await Bun.write(new URL("thom-og.png", publicDirectory), renderer.render().asPng());

console.log(`Generated ${assets.size + 3} deterministic THOM assets.`);
