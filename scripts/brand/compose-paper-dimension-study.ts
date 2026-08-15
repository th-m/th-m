import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp, { type OverlayOptions } from "sharp";

type Glyph = "t" | "h" | "o" | "m";

const auditRoot = resolve(process.cwd(), "public/brand-audit/current");
const outputRoot = resolve(process.cwd(), ".codex/audits/logo-balance/reference-diff");
const glyphs: Glyph[] = ["t", "h", "o", "m"];
const bounds = {
  t: { minX: 50, maxX: 259 },
  h: { minX: 68, maxX: 263 },
  o: { minX: 41, maxX: 279 },
  m: { minX: 30, maxX: 289 },
} satisfies Record<Glyph, { minX: number; maxX: number }>;
const transforms = {
  t: { scaleX: 1, scaleY: 1, offsetY: 0 },
  h: { scaleX: 1, scaleY: 1, offsetY: 0 },
  o: { scaleX: 1.03, scaleY: 1.01, offsetY: -7 },
  m: { scaleX: 0.976, scaleY: 1.042, offsetY: -3 },
} satisfies Record<Glyph, { scaleX: number; scaleY: number; offsetY: number }>;

const canvasWidth = 1400;
const canvasHeight = 820;
const imageHeight = 240;
const glyphPadding = 14;
const glyphGap = 12;

function textSvg(text: string, size: number, color: string, tracking = 0) {
  return Buffer.from(
    `<svg width="${canvasWidth}" height="60" xmlns="http://www.w3.org/2000/svg"><text x="0" y="${size}" fill="${color}" font-family="Helvetica,Arial,sans-serif" font-size="${size}" font-weight="500" letter-spacing="${tracking}">${text}</text></svg>`,
  );
}

async function glyphStrip(amended: boolean) {
  const pieces: Array<{ input: Buffer; width: number; top: number }> = [];
  let stripWidth = 0;
  for (const glyph of glyphs) {
    const cropLeft = bounds[glyph].minX - glyphPadding;
    const cropWidth = bounds[glyph].maxX - bounds[glyph].minX + 1 + glyphPadding * 2;
    const transform = amended ? transforms[glyph] : transforms.t;
    const width = Math.round(cropWidth * transform.scaleX);
    const height = Math.round(imageHeight * transform.scaleY);
    const input = await sharp(resolve(auditRoot, `${glyph}.png`))
      .extract({ left: cropLeft, top: 0, width: cropWidth, height: imageHeight })
      .resize({ width, height, fit: "fill" })
      .png()
      .toBuffer();
    pieces.push({ input, width, top: transform.offsetY });
    stripWidth += width;
  }
  stripWidth += glyphGap * (pieces.length - 1);
  const overlays: OverlayOptions[] = [];
  let left = 0;
  for (const piece of pieces) {
    overlays.push({ input: piece.input, left, top: 12 + piece.top });
    left += piece.width + glyphGap;
  }
  return sharp({
    create: { width: stripWidth, height: 270, channels: 4, background: "#050505" },
  })
    .composite(overlays)
    .png()
    .toBuffer();
}

await mkdir(outputRoot, { recursive: true });
const current = await glyphStrip(false);
const amended = await glyphStrip(true);
const currentMeta = await sharp(current).metadata();
const amendedMeta = await sharp(amended).metadata();
const currentLeft = Math.round((canvasWidth - (currentMeta.width ?? 0)) / 2);
const amendedLeft = Math.round((canvasWidth - (amendedMeta.width ?? 0)) / 2);
const rule = Buffer.from(
  `<svg width="1320" height="2" xmlns="http://www.w3.org/2000/svg"><rect width="1320" height="1" fill="#59472b"/></svg>`,
);
const overlays: OverlayOptions[] = [
  { input: textSvg("THOM · MEASURED DIMENSION AMENDMENT", 24, "#d8aa5e", 5), left: 40, top: 32 },
  { input: textSvg("CURRENT PLAYWRIGHT", 15, "#9f9689", 3), left: 40, top: 102 },
  { input: current, left: currentLeft, top: 138 },
  { input: rule, left: 40, top: 415 },
  { input: textSvg("AMENDED WIDTH + HEIGHT", 15, "#d8aa5e", 3), left: 40, top: 444 },
  { input: amended, left: amendedLeft, top: 480 },
  { input: textSvg("O  +3.0% W  ·  +1.0% H  ·  7 px UP", 14, "#e7dfd1", 1.5), left: 40, top: 762 },
  { input: textSvg("M  −2.4% W  ·  +4.2% H  ·  3 px UP", 14, "#e7dfd1", 1.5), left: 710, top: 762 },
];

await sharp({ create: { width: canvasWidth, height: canvasHeight, channels: 4, background: "#050505" } })
  .composite(overlays)
  .png()
  .toFile(resolve(outputRoot, "paper-amended-dimensions.png"));

await sharp(amended).png().toFile(resolve(outputRoot, "thom-amended-dimensions.png"));

console.log(`Wrote ${resolve(outputRoot, "paper-amended-dimensions.png")}`);
