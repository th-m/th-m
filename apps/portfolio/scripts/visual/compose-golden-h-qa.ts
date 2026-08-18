import { mkdir, readFile } from "node:fs/promises";
import sharp, { type OverlayOptions } from "sharp";

const workspace = new URL("../../", import.meta.url);
const auditDir = new URL("../../.codex/audits/golden-ratio-h/", workspace);
const sourceDir = new URL("file:///Users/thom/Desktop/");
const tileWidth = 440;
const tileHeight = 310;
const tileX = [40, 520, 1000, 1480];
const rowY = [150, 560];

const items = [
  {
    input: new URL("Screenshot 2026-08-15 at 6.47.47%E2%80%AFAM.png", sourceDir),
    label: "SUPPLIED H · CATENARY TO REPLACE",
  },
  {
    input: new URL("Screenshot 2026-08-15 at 6.49.56%E2%80%AFAM.png", sourceDir),
    label: "SUPPLIED φ SILHOUETTE",
  },
  {
    input: new URL("Screenshot 2026-08-15 at 6.49.53%E2%80%AFAM.png", sourceDir),
    label: "SUPPLIED a / b PROPORTION",
  },
  {
    input: new URL("Screenshot 2026-08-15 at 7.24.26%E2%80%AFAM.png", sourceDir),
    label: "SUPPLIED FULL-UNIT UNDER-BRACE",
  },
  {
    input: new URL("public/brand/glyph-h.svg", workspace),
    label: "GENERATED H SVG",
  },
  {
    input: new URL("public/brand-audit/current/h-webgl.png", workspace),
    label: "SETTLED WEBGL H",
  },
  {
    input: new URL("desktop-h-final.png", auditDir),
    label: "ISOLATED DESKTOP STATE",
  },
  {
    input: new URL("mobile-h-final.png", auditDir),
    label: "MOBILE STATE · 390 × 844",
  },
] as const;

const labels = items.map((item, index) => {
  const column = index % 4;
  const row = Math.floor(index / 4);
  return `<text x="${tileX[column]}" y="${rowY[row] + tileHeight + 28}" fill="#d6b06a" font-family="monospace" font-size="11" letter-spacing="1.7">${item.label}</text>`;
}).join("");

const background = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1960" height="970">
  <rect width="100%" height="100%" fill="#050505"/>
  <text x="40" y="48" fill="#d6b06a" font-family="monospace" font-size="12" letter-spacing="3">THOM GOLDEN-RATIO H · DESIGN QA</text>
  <text x="40" y="88" fill="#f2e5cf" font-family="Georgia, serif" font-size="31">Source intent, extracted φ, and final responsive construction</text>
  <text x="40" y="118" fill="#f2e5cf" fill-opacity=".66" font-family="monospace" font-size="12">a:b = (a+b):a = φ · 61.8% / 38.2% · three ticks · full-span brace · no labels inside the mark</text>
  ${labels}
</svg>`);

const composites: OverlayOptions[] = [];
for (let index = 0; index < items.length; index += 1) {
  const item = items[index];
  const input = await readFile(item.input);
  const panel = await sharp({
    create: { width: tileWidth, height: tileHeight, channels: 4, background: "#090909" },
  }).composite([{
    input: await sharp(input).resize({ width: tileWidth - 32, height: tileHeight - 32, fit: "contain" }).png().toBuffer(),
    gravity: "center",
  }]).png().toBuffer();
  composites.push({
    input: panel,
    left: tileX[index % 4],
    top: rowY[Math.floor(index / 4)],
  });
}

await mkdir(auditDir, { recursive: true });
await Bun.write(new URL("comparison.png", auditDir), await sharp(background).composite(composites).png().toBuffer());
