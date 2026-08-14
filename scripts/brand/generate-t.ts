import { Resvg } from "@resvg/resvg-js";
import generatedData from "../../src/brand/thom/generated/brand-data.json";
import { PI_GEOMETRY, type BrandData } from "../../src/brand/thom/geometry";
import {
  renderAvatarSvg,
  renderFaviconSvg,
  renderGlyphSvg,
  renderLogoSvg,
  renderOpenGraphSvg,
} from "../../src/brand/thom/svg";

const data = { ...generatedData, pi: PI_GEOMETRY } as BrandData;
const publicDirectory = new URL("../../public/brand/", import.meta.url);
const generatedDataUrl = new URL("../../src/brand/thom/generated/brand-data.json", import.meta.url);

const assets = new Map<string, string>([
  ["thom-master.svg", renderLogoSvg(data)],
  ["thom-compact.svg", renderLogoSvg(data, "dark", true)],
  ["thom-light.svg", renderLogoSvg(data, "light")],
  ["thom-monochrome.svg", renderLogoSvg(data, "monochrome")],
  ["favicon.svg", renderFaviconSvg(data)],
  ["avatar.svg", renderAvatarSvg(data)],
  ["glyph-t.svg", renderGlyphSvg(data, "t")],
]);

await Promise.all([...assets].map(([name, content]) => Bun.write(new URL(name, publicDirectory), `${content}\n`)));
await Bun.write(generatedDataUrl, `${JSON.stringify(data, null, 2)}\n`);

const openGraphSvg = renderOpenGraphSvg(data);
await Bun.write(new URL("thom-og.svg", publicDirectory), `${openGraphSvg}\n`);
await Bun.write(
  new URL("thom-og.png", publicDirectory),
  new Resvg(openGraphSvg, { fitTo: { mode: "width", value: 1200 } }).render().asPng(),
);

console.log(`Generated ${assets.size + 3} deterministic T-affected THOM assets.`);
