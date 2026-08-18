import sharp from "sharp";
import { fileURLToPath } from "node:url";

const root = new URL("../../", import.meta.url);
const sourceSmall = "/Users/thom/Desktop/Screenshot 2026-08-13 at 10.17.18 AM.png";
const sourceLarge = "/Users/thom/Desktop/Screenshot 2026-08-13 at 10.17.34 AM.png";
const implementationSmall = new URL("public/brand-audit/qa-responsive-small.png", root);
const implementationLarge = new URL("public/brand-audit/qa-responsive-large.png", root);
const output = new URL("public/brand-audit/qa-responsive-stroke-board.png", root);

const panelWidth = 860;
const panelHeight = 570;
const gap = 28;
const margin = 26;
const labelHeight = 46;
const boardWidth = margin * 2 + panelWidth * 2 + gap;
const boardHeight = margin * 2 + (panelHeight + labelHeight) * 2 + gap;

async function panel(input: string | URL, extract?: { left: number; top: number; width: number; height: number }) {
  let pipeline = sharp(input instanceof URL ? fileURLToPath(input) : input);
  if (extract) pipeline = pipeline.extract(extract);
  return pipeline
    .resize(panelWidth, panelHeight, { fit: "contain", background: "#050505" })
    .extend({ top: labelHeight, background: "#0a0908" })
    .png()
    .toBuffer();
}

function label(text: string) {
  return Buffer.from(`<svg width="${panelWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#0a0908"/>
    <text x="16" y="29" fill="#d6b06a" font-family="monospace" font-size="14" letter-spacing="2">${text}</text>
  </svg>`);
}

const panels = await Promise.all([
  panel(sourceLarge),
  panel(implementationLarge),
  panel(sourceSmall),
  panel(implementationSmall),
]);
const labels = ["SOURCE — LARGE", "IMPLEMENTATION — LARGE", "SOURCE — SMALL", "IMPLEMENTATION — SMALL"];

const composites = panels.flatMap((input, index) => {
  const column = index % 2;
  const row = Math.floor(index / 2);
  const left = margin + column * (panelWidth + gap);
  const top = margin + row * (panelHeight + labelHeight + gap);
  return [
    { input, left, top },
    { input: label(labels[index]), left, top },
  ];
});

await sharp({
  create: { width: boardWidth, height: boardHeight, channels: 4, background: "#050505" },
})
  .composite(composites)
  .png()
  .toFile(fileURLToPath(output));

console.log(`Wrote ${output.pathname}`);
