import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { brandData } from "../../../../src/brand/thom/brandData";
import { renderGlyphSvg, renderLogoSvg } from "../../../../src/brand/thom/svg";

const output = resolve(import.meta.dir);
const glyphs = ["t", "h", "o", "m"] as const;
const labels = { t: "T", h: "H", o: "O", m: "M" } as const;
const background = { r: 5, g: 5, b: 5, alpha: 1 };

function rasterize(svg: string, height: number) {
  return new Resvg(svg, { fitTo: { mode: "height", value: height } }).render().asPng();
}

async function label(text: string, width: number) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="32"><text x="12" y="21" fill="#d6b06a" font-family="system-ui, sans-serif" font-size="13" letter-spacing="2">${text}</text></svg>`);
}

async function glyphBoard(size: number) {
  const frameWidth = 190;
  const frameHeight = 190;
  const gap = 18;
  const titleHeight = 56;
  const width = glyphs.length * frameWidth + (glyphs.length - 1) * gap;
  const height = titleHeight + frameHeight;
  const tiles = await Promise.all(glyphs.map(async (glyph, index) => {
    const png = rasterize(renderGlyphSvg(brandData, glyph, "dark"), size);
    const tile = await sharp({ create: { width: frameWidth, height: frameHeight, channels: 4, background } })
      .composite([
        { input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${frameWidth}" height="${frameHeight}"><rect x="0.5" y="0.5" width="${frameWidth - 1}" height="${frameHeight - 1}" fill="none" stroke="#2d271d"/></svg>`), left: 0, top: 0 },
        { input: await label(labels[glyph], frameWidth), left: 0, top: 0 },
        { input: png, left: Math.round((frameWidth - (await sharp(png).metadata()).width!) / 2), top: 48 },
      ]).png().toBuffer();
    return { input: tile, left: index * (frameWidth + gap), top: titleHeight };
  }));
  return sharp({ create: { width, height, channels: 4, background } })
    .composite([
      { input: await label(`THOM · ISOLATED GLYPHS · ${size} PX · STATIC PRODUCTION ASSETS`, width), left: 0, top: 8 },
      ...tiles,
    ]).png().toFile(resolve(output, `isolated-${size}px.png`));
}

async function monochromeBoard() {
  const sizes = [24, 48, 120];
  const width = 760;
  const rowHeight = 172;
  const monochromeBackground = { r: 242, g: 229, b: 207, alpha: 1 };
  const tiles = await Promise.all(sizes.map(async (size, index) => {
    const png = rasterize(renderLogoSvg(brandData, "monochrome"), size);
    const metadata = await sharp(png).metadata();
    return [
      { input: await label(`${size} PX`, 90), left: 0, top: index * rowHeight + 20 },
      { input: png, left: 110, top: index * rowHeight + Math.round((rowHeight - metadata.height!) / 2) },
    ];
  }));
  return sharp({ create: { width, height: sizes.length * rowHeight, channels: 4, background: monochromeBackground } })
    .composite(tiles.flat())
    .png().toFile(resolve(output, "monochrome-multiscale.png"));
}

async function spacingCrop() {
  return sharp(resolve(output, "01-desktop-lockup.png"))
    .extract({ left: 150, top: 250, width: 1140, height: 350 })
    .png()
    .toFile(resolve(output, "07-spacing-and-alignment.png"));
}

await mkdir(output, { recursive: true });
await Promise.all([glyphBoard(120), glyphBoard(48), glyphBoard(24), monochromeBoard(), spacingCrop()]);
await Bun.write(resolve(output, "review-boards.html"), `<!doctype html><meta charset="utf-8"><title>THOM Final Review Boards</title><style>body{margin:0;padding:24px;background:#050505;color:#f2e5cf;font:14px system-ui,sans-serif}img{display:block;margin:0 0 24px;max-width:100%;height:auto}</style><img src="isolated-120px.png" alt="T H O and M isolated at 120 pixels"><img src="isolated-48px.png" alt="T H O and M isolated at 48 pixels"><img src="isolated-24px.png" alt="T H O and M isolated at 24 pixels"><img src="monochrome-multiscale.png" alt="THOM monochrome at 24 48 and 120 pixels">\n`);
