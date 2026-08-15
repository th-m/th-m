import { resolve } from "node:path";
import sharp from "sharp";

const auditRoot = resolve(process.cwd(), ".codex/audits/logo-balance");
const beforeRoot = resolve(auditRoot, "stroke-energy-before");
const afterRoot = resolve(auditRoot, "stroke-energy");
const background = { r: 5, g: 5, b: 5, alpha: 1 };

function labelSvg(width: number, text: string) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="64"><rect width="100%" height="100%" fill="#050505"/><text x="24" y="41" fill="#f2e5cf" font-family="system-ui, sans-serif" font-size="24" font-weight="600">${text}</text></svg>`);
}

async function labeledTile(input: string, label: string, width: number) {
  const image = await sharp(input).resize({ width }).png().toBuffer();
  const metadata = await sharp(image).metadata();
  const height = metadata.height ?? 1;
  return sharp({ create: { width, height: height + 64, channels: 4, background } })
    .composite([
      { input: labelSvg(width, label), left: 0, top: 0 },
      { input: image, left: 0, top: 64 },
    ])
    .png()
    .toBuffer();
}

async function pair(before: Buffer, after: Buffer, output: string) {
  const beforeMetadata = await sharp(before).metadata();
  const afterMetadata = await sharp(after).metadata();
  const width = (beforeMetadata.width ?? 1) + (afterMetadata.width ?? 1);
  const height = Math.max(beforeMetadata.height ?? 1, afterMetadata.height ?? 1);
  await sharp({ create: { width, height, channels: 4, background } })
    .composite([
      { input: before, left: 0, top: 0 },
      { input: after, left: beforeMetadata.width ?? 1, top: 0 },
    ])
    .png()
    .toFile(output);
}

for (const theme of ["production", "monochrome"] as const) {
  const before = await labeledTile(resolve(beforeRoot, `${theme}-120px@8x.png`), `Before · ${theme}`, 1200);
  const after = await labeledTile(resolve(afterRoot, `${theme}-120px@8x.png`), `Stroke energy · ${theme}`, 1200);
  await pair(before, after, resolve(afterRoot, `before-after-${theme}.png`));
}

const rows = await Promise.all([24, 48, 120].map(async (height) => {
  const before = await labeledTile(resolve(beforeRoot, `production-${height}px@8x.png`), `Before · ${height}px @ 8×`, 800);
  const after = await labeledTile(resolve(afterRoot, `production-${height}px@8x.png`), `Stroke energy · ${height}px @ 8×`, 800);
  const beforeMetadata = await sharp(before).metadata();
  const rowHeight = beforeMetadata.height ?? 1;
  return sharp({ create: { width: 1600, height: rowHeight, channels: 4, background } })
    .composite([
      { input: before, left: 0, top: 0 },
      { input: after, left: 800, top: 0 },
    ])
    .png()
    .toBuffer();
}));
const rowHeights = await Promise.all(rows.map(async (row) => (await sharp(row).metadata()).height ?? 1));
await sharp({ create: { width: 1600, height: rowHeights.reduce((sum, height) => sum + height, 0), channels: 4, background } })
  .composite(rows.map((row, index) => ({
    input: row,
    left: 0,
    top: rowHeights.slice(0, index).reduce((sum, height) => sum + height, 0),
  })))
  .png()
  .toFile(resolve(afterRoot, "before-after-multiscale.png"));

console.log(`Composed stroke-energy evidence in ${afterRoot}`);
