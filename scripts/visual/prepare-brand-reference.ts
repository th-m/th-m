import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const source = new URL("../../public/brand-logo-idea.png", import.meta.url);
const outputDirectory = new URL("../../public/brand-audit/reference/", import.meta.url);

await mkdir(outputDirectory, { recursive: true });

const crops = {
  t: { left: 74, top: 202, width: 214, height: 154 },
  h: { left: 414, top: 202, width: 232, height: 164 },
  o: { left: 778, top: 205, width: 224, height: 175 },
  m: { left: 1094, top: 200, width: 370, height: 174 },
} as const;

await Promise.all(Object.entries(crops).map(async ([glyph, crop]) => {
  await sharp(fileURLToPath(source))
    .extract(crop)
    .resize(320, 240, {
      fit: "contain",
      background: { r: 5, g: 5, b: 5, alpha: 1 },
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toFile(fileURLToPath(new URL(`${glyph}.png`, outputDirectory)));
}));

console.log("Prepared four normalized reference glyph snapshots from brand-logo-idea.png.");
