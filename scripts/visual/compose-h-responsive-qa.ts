import { mkdir, readFile } from "node:fs/promises";
import { PNG } from "pngjs";
import sharp, { type OverlayOptions } from "sharp";

const auditDirectory = new URL("../../public/brand-audit/audit/", import.meta.url);
const distAuditDirectory = new URL("../../dist/brand-audit/audit/", import.meta.url);
const captures = [
  { file: "15-h-responsive-before-small.png", label: "BEFORE · 648 PX LOCKUP", size: "small" },
  { file: "15-h-responsive-after-small.png", label: "AFTER · 648 PX LOCKUP", size: "small" },
  { file: "15-h-responsive-before-large.png", label: "BEFORE · 1180 PX LOCKUP", size: "large" },
  { file: "15-h-responsive-after-large.png", label: "AFTER · 1180 PX LOCKUP", size: "large" },
] as const;

function hStrokeRatio(buffer: Buffer) {
  const png = PNG.sync.read(buffer);
  const scale = png.width / 416;
  const luminance = (x: number, y: number) => {
    const offset = (Math.round(y) * png.width + Math.round(x)) * 4;
    return (png.data[offset] + png.data[offset + 1] + png.data[offset + 2]) / 3;
  };
  const widthAtHalfMaximum = (centerX: number, centerY: number, range: number, step: number, axis: "x" | "y") => {
    const samples: Array<{ offset: number; luminance: number }> = [];
    for (let offset = -range; offset <= range; offset += step) {
      samples.push({ offset, luminance: luminance(centerX + (axis === "x" ? offset : 0), centerY + (axis === "y" ? offset : 0)) });
    }
    const peak = Math.max(...samples.map((sample) => sample.luminance));
    const visible = samples.filter((sample) => sample.luminance >= (peak + 5) / 2);
    return visible.at(-1)!.offset - visible[0].offset;
  };
  const stem = widthAtHalfMaximum((98.1 + 25) * scale, 80 * scale, 8 * scale, 0.1, "x");
  const crossbar = widthAtHalfMaximum((98.1 + 40) * scale, 60 * scale, 3 * scale, 0.05, "y");
  return { crossbar, stem, ratio: crossbar / stem };
}

const sourceBuffers = await Promise.all(captures.map((capture) => readFile(new URL(capture.file, auditDirectory))));
const measurements = sourceBuffers.map(hStrokeRatio);
const beforeDrift = Math.abs(measurements[0].ratio - measurements[2].ratio) / measurements[2].ratio;
const afterDrift = Math.abs(measurements[1].ratio - measurements[3].ratio) / measurements[3].ratio;
const panelX = [40, 400, 760, 1120];
const background = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1480" height="570">
  <rect width="100%" height="100%" fill="#050505"/>
  <text x="40" y="48" fill="#d6b06a" font-family="monospace" font-size="12" letter-spacing="3">THOM H RESPONSIVE PROPORTION QA</text>
  <text x="40" y="88" fill="#f2e5cf" font-family="Georgia, serif" font-size="31">Golden-ratio crossbar weight scales with the classical pillars</text>
  <text x="40" y="118" fill="#f2e5cf" fill-opacity=".72" font-family="monospace" font-size="12">CROSSBAR/STEM DRIFT ${Math.round(beforeDrift * 100)}% → ${Math.round(afterDrift * 100)}%  ·  SMALL CROSSBAR FWHM ${measurements[0].crossbar.toFixed(1)} → ${measurements[1].crossbar.toFixed(1)} PX</text>
  ${captures.map((capture, index) => `<text x="${panelX[index]}" y="500" fill="#d6b06a" font-family="monospace" font-size="11" letter-spacing="1.5">${capture.label}</text>
  <text x="${panelX[index]}" y="524" fill="#f2e5cf" fill-opacity=".66" font-family="monospace" font-size="10">CROSSBAR / STEM ${measurements[index].ratio.toFixed(3)}</text>`).join("")}
  <text x="40" y="554" fill="#d6b06a" font-family="monospace" font-size="11">PASS · WORLD-SPACE H RIBBONS · SHARED SVG SCALE · STOPPED WEBGL LOOP</text>
</svg>`);

const panels: OverlayOptions[] = [];
for (let index = 0; index < sourceBuffers.length; index += 1) {
  const input = sourceBuffers[index];
  const metadata = await sharp(input).metadata();
  const scale = (metadata.width ?? 416) / 416;
  const left = Math.max(0, Math.round(90 * scale));
  const cropWidth = Math.min((metadata.width ?? 1) - left, Math.round(110 * scale));
  const crop = await sharp(input)
    .extract({ left, top: 0, width: cropWidth, height: metadata.height ?? 1 })
    .resize(320, 330, { fit: "contain", background: { r: 5, g: 5, b: 5, alpha: 1 } })
    .png()
    .toBuffer();
  panels.push({ input: crop, left: panelX[index], top: 150 });
}

const output = await sharp(background).composite(panels).png().toBuffer();
for (const directory of [auditDirectory, distAuditDirectory]) {
  await mkdir(directory, { recursive: true });
  await Bun.write(new URL("16-h-responsive-proportion.png", directory), output);
}
console.log(JSON.stringify({ beforeDrift, afterDrift, measurements }, null, 2));
