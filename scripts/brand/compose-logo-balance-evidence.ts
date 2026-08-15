import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const DISPLAY_HEIGHTS = [24, 48, 120] as const;
const SCALE = 4;
const PANEL_WIDTH = 1800;
const LABEL_HEIGHT = 52;

function argument(name: string) {
  const prefix = `--${name}=`;
  const value = process.argv.find((entry) => entry.startsWith(prefix))?.slice(prefix.length);
  if (!value) throw new Error(`Missing ${prefix}<path>`);
  return resolve(process.cwd(), value);
}

function labelSvg(label: string, width: number, color: string) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${LABEL_HEIGHT}">
    <text x="24" y="34" fill="${color}" font-family="system-ui, sans-serif" font-size="22" font-weight="600">${label}</text>
  </svg>`);
}

async function panel(input: string, displayHeight: number, background: string, label: string, labelColor: string) {
  const imageHeight = displayHeight * SCALE;
  const panelHeight = imageHeight + LABEL_HEIGHT + 32;
  const image = await sharp(input)
    .resize({ height: imageHeight })
    .flatten({ background })
    .toBuffer();
  const metadata = await sharp(image).metadata();
  const left = Math.round((PANEL_WIDTH - (metadata.width ?? PANEL_WIDTH)) / 2);
  return sharp({ create: { width: PANEL_WIDTH, height: panelHeight, channels: 4, background } })
    .composite([
      { input: labelSvg(label, PANEL_WIDTH, labelColor), left: 0, top: 0 },
      { input: image, left, top: LABEL_HEIGHT + 16 },
    ])
    .png()
    .toBuffer();
}

const beforeDirectory = argument("before");
const afterDirectory = argument("after");
const outputDirectory = argument("output");
await mkdir(outputDirectory, { recursive: true });

const comparisonPaths: string[] = [];
for (const displayHeight of DISPLAY_HEIGHTS) {
  const productionName = `production-${displayHeight}px@8x.png`;
  const monochromeName = `monochrome-${displayHeight}px@8x.png`;
  const productionBefore = await panel(resolve(beforeDirectory, productionName), displayHeight, "#050505", "Before · production", "#f2e5cf");
  const productionAfter = await panel(resolve(afterDirectory, productionName), displayHeight, "#050505", "After · production", "#f2e5cf");
  const monochromeBefore = await panel(resolve(beforeDirectory, monochromeName), displayHeight, "#ffffff", "Before · monochrome", "#111111");
  const monochromeAfter = await panel(resolve(afterDirectory, monochromeName), displayHeight, "#ffffff", "After · monochrome", "#111111");
  const panelHeight = displayHeight * SCALE + LABEL_HEIGHT + 32;
  const output = resolve(outputDirectory, `before-after-${displayHeight}px.png`);
  await sharp({ create: { width: PANEL_WIDTH * 2, height: panelHeight * 2, channels: 4, background: "#050505" } })
    .composite([
      { input: productionBefore, left: 0, top: 0 },
      { input: productionAfter, left: PANEL_WIDTH, top: 0 },
      { input: monochromeBefore, left: 0, top: panelHeight },
      { input: monochromeAfter, left: PANEL_WIDTH, top: panelHeight },
    ])
    .png()
    .toFile(output);
  comparisonPaths.push(output);
}

const comparisonBuffers = await Promise.all(comparisonPaths.map((path) => sharp(path).toBuffer()));
const comparisonMetadata = await Promise.all(comparisonBuffers.map((buffer) => sharp(buffer).metadata()));
const overviewHeight = comparisonMetadata.reduce((sum, metadata) => sum + (metadata.height ?? 0), 0);
let overviewTop = 0;
await sharp({ create: { width: PANEL_WIDTH * 2, height: overviewHeight, channels: 4, background: "#050505" } })
  .composite(comparisonBuffers.map((input, index) => {
    const top = overviewTop;
    overviewTop += comparisonMetadata[index].height ?? 0;
    return { input, left: 0, top };
  }))
  .png()
  .toFile(resolve(outputDirectory, "before-after-overview.png"));

console.log(`Composed ${comparisonPaths.length + 1} deterministic logo-balance comparison images.`);
