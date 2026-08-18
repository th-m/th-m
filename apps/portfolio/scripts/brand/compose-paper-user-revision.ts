import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { PNG } from "pngjs";
import sharp, { type OverlayOptions } from "sharp";

type Glyph = "t" | "h" | "o" | "m";

const glyphs: Glyph[] = ["t", "h", "o", "m"];
const beforeRoot = resolve(import.meta.dir, "../../../../.codex/audits/logo-balance/user-directed-revision/playwright-before");
const revisedRoot = resolve(process.cwd(), "public/brand-audit/current");
const outputPath = resolve(import.meta.dir, "../../../../.codex/audits/logo-balance/user-directed-revision/paper-user-revision-02.png");
const canvasWidth = 1400;
const canvasHeight = 860;

function textSvg(text: string, size: number, color: string, tracking = 0) {
  return Buffer.from(
    `<svg width="1320" height="64" xmlns="http://www.w3.org/2000/svg"><text x="0" y="${size}" fill="${color}" font-family="Helvetica,Arial,sans-serif" font-size="${size}" font-weight="500" letter-spacing="${tracking}">${text}</text></svg>`,
  );
}

async function cropGlyph(path: string) {
  const input = await readFile(path);
  const png = PNG.sync.read(input);
  let minX = png.width;
  let maxX = -1;
  for (let index = 0; index < png.width * png.height; index += 1) {
    const offset = index * 4;
    const luminance = (png.data[offset] + png.data[offset + 1] + png.data[offset + 2]) / 3;
    if (luminance <= 12) continue;
    const x = index % png.width;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
  }
  const left = Math.max(0, minX - 14);
  const right = Math.min(png.width - 1, maxX + 14);
  const width = right - left + 1;
  return {
    width,
    input: await sharp(input).extract({ left, top: 0, width, height: png.height }).png().toBuffer(),
  };
}

async function glyphStrip(root: string) {
  const crops = await Promise.all(glyphs.map((glyph) => cropGlyph(resolve(root, `${glyph}.png`))));
  const gap = 12;
  const width = crops.reduce((sum, crop) => sum + crop.width, gap * (crops.length - 1));
  const overlays: OverlayOptions[] = [];
  let left = 0;
  for (const crop of crops) {
    overlays.push({ input: crop.input, left, top: 0 });
    left += crop.width + gap;
  }
  return sharp({ create: { width, height: 240, channels: 4, background: "#050505" } })
    .composite(overlays)
    .png()
    .toBuffer();
}

const before = await glyphStrip(beforeRoot);
const revised = await glyphStrip(revisedRoot);
const beforeWidth = (await sharp(before).metadata()).width ?? 0;
const revisedWidth = (await sharp(revised).metadata()).width ?? 0;
const rule = Buffer.from(`<svg width="1320" height="2" xmlns="http://www.w3.org/2000/svg"><rect width="1320" height="1" fill="#59472b"/></svg>`);
const overlays: OverlayOptions[] = [
  { input: textSvg("THOM · USER REVISION 02", 24, "#d8aa5e", 5), left: 40, top: 28 },
  { input: textSvg("BEFORE", 15, "#9f9689", 3), left: 40, top: 98 },
  { input: before, left: Math.round((canvasWidth - beforeWidth) / 2), top: 130 },
  { input: rule, left: 40, top: 398 },
  { input: textSvg("REVISED", 15, "#d8aa5e", 3), left: 40, top: 430 },
  { input: revised, left: Math.round((canvasWidth - revisedWidth) / 2), top: 462 },
  { input: textSvg("H  STEM −5.1%  ·  CROSSBAR STACK +5.9%  ·  O-INTERSECTION RATIO POINT", 13, "#e7dfd1", 1.2), left: 40, top: 755 },
  { input: textSvg("O  UNIFORM −2.0%  ·  M  HEIGHT +3.2%", 13, "#e7dfd1", 1.2), left: 40, top: 798 },
];

await sharp({ create: { width: canvasWidth, height: canvasHeight, channels: 4, background: "#050505" } })
  .composite(overlays)
  .png()
  .toFile(outputPath);

console.log(`Wrote ${outputPath}`);
