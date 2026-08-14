import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import sharp from "sharp";

const auditDirectory = new URL("../../public/brand-audit/", import.meta.url);
const outputDirectory = new URL("../../public/brand-audit/audit/", import.meta.url);
const width = 318;
const height = 360;

async function difference(firstName: string, secondName: string, outputName: string) {
  const first = PNG.sync.read(Buffer.from(await Bun.file(new URL(firstName, auditDirectory)).arrayBuffer()));
  const second = PNG.sync.read(Buffer.from(await Bun.file(new URL(secondName, auditDirectory)).arrayBuffer()));
  const output = new PNG({ width, height });
  pixelmatch(first.data, second.data, output.data, width, height, {
    threshold: 0.1,
    includeAA: true,
    diffColor: [245, 191, 99],
    diffColorAlt: [233, 91, 111],
    alpha: 0.16,
  });
  const buffer = PNG.sync.write(output);
  await Bun.write(new URL(outputName, auditDirectory), buffer);
  return buffer;
}

const sourceDiff = await difference("responsive-o-source-small.png", "responsive-o-source-large.png", "responsive-o-source-diff.png");
const currentDiff = await difference("responsive-o-current-small.png", "responsive-o-current-large.png", "responsive-o-current-diff.png");
const images = await Promise.all([
  "responsive-o-source-small.png",
  "responsive-o-source-large.png",
  "responsive-o-current-small.png",
  "responsive-o-current-large.png",
].map((name) => Bun.file(new URL(name, auditDirectory)).arrayBuffer().then((value) => Buffer.from(value))));

const gap = 18;
const margin = 24;
const labelHeight = 38;
const boardWidth = margin * 2 + width * 3 + gap * 2;
const boardHeight = margin * 2 + (labelHeight + height) * 2 + gap;
const labels = [
  ["SOURCE SMALL", "SOURCE LARGE", "SOURCE DIFFERENCE"],
  ["CURRENT SMALL", "CURRENT LARGE", "CURRENT DIFFERENCE"],
];
const labelSvg = Buffer.from(`<svg width="${boardWidth}" height="${boardHeight}" xmlns="http://www.w3.org/2000/svg">
  <style>text{font:12px ui-monospace,monospace;letter-spacing:1.8px;fill:#d6b06a}</style>
  ${labels.flatMap((row, rowIndex) => row.map((label, columnIndex) => {
    const x = margin + columnIndex * (width + gap);
    const y = margin + rowIndex * (labelHeight + height + gap) + 22;
    return `<text x="${x}" y="${y}">${label}</text>`;
  })).join("")}
</svg>`);
const panels = [
  images[0], images[1], sourceDiff,
  images[2], images[3], currentDiff,
];
const composites = panels.map((input, index) => {
  const row = Math.floor(index / 3);
  const column = index % 3;
  return {
    input,
    left: margin + column * (width + gap),
    top: margin + labelHeight + row * (labelHeight + height + gap),
  };
});
await sharp({ create: { width: boardWidth, height: boardHeight, channels: 3, background: "#050505" } })
  .composite([...composites, { input: labelSvg, left: 0, top: 0 }])
  .png()
  .toFile(new URL("15-o-responsive-scale.png", outputDirectory).pathname);

console.log(new URL("15-o-responsive-scale.png", outputDirectory).pathname);
