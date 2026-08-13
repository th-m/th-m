import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

type Point = { x: number; y: number };

const source = new URL("../../public/brand-logo-idea.png", import.meta.url);
const output = new URL("../../src/brand/thom/m-calibration.json", import.meta.url);
const crop = { left: 1094, top: 200, width: 370, height: 174 } as const;
const knotPositions = [0, 0.04, 0.12, 0.2, 0.32, 0.5] as const;
const geometryBounds = { top: 20, baseline: 86 } as const;
const opticalAdjustments = [0, 2.057, 5.345, 3.19, 6.134, 0.69] as const;

const { data, info } = await sharp(fileURLToPath(source))
  .extract(crop)
  .blur(1)
  .grayscale()
  .raw()
  .toBuffer({ resolveWithObject: true });

const luminance = (x: number, y: number) => data[y * info.width + x];

function foregroundBounds(threshold: number) {
  let left = info.width;
  let right = -1;
  let top = info.height;
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (luminance(x, y) <= threshold) continue;
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
    }
  }
  if (right < left) throw new Error("The M reference crop has no measurable foreground");
  return { left, right, top };
}

function traceRidge(left: number, right: number, reverse: boolean) {
  const width = right - left + 1;
  const scores = Array.from({ length: width }, () => new Float64Array(info.height).fill(Number.NEGATIVE_INFINITY));
  const previous = Array.from({ length: width }, () => new Int16Array(info.height).fill(-1));
  const sourceX = (index: number) => reverse ? right - index : left + index;

  for (let y = 8; y < info.height - 3; y += 1) {
    scores[0][y] = luminance(sourceX(0), y) / 255 * 6 - Math.abs(y - 158) * 0.02;
  }
  for (let index = 1; index < width; index += 1) {
    for (let y = 8; y < info.height - 3; y += 1) {
      let bestScore = Number.NEGATIVE_INFINITY;
      let bestY = -1;
      for (let priorY = Math.max(8, y - 9); priorY <= Math.min(info.height - 4, y + 9); priorY += 1) {
        const delta = Math.abs(y - priorY);
        const candidate = scores[index - 1][priorY] - delta * 0.045 - delta * delta * 0.004;
        if (candidate > bestScore) {
          bestScore = candidate;
          bestY = priorY;
        }
      }
      scores[index][y] = bestScore + luminance(sourceX(index), y) / 255 * 6;
      previous[index][y] = bestY;
    }
  }

  let ridgeY = 158;
  let bestScore = Number.NEGATIVE_INFINITY;
  for (let y = 8; y < info.height - 3; y += 1) {
    const candidate = scores[width - 1][y] - Math.abs(y - 158) * 0.02;
    if (candidate > bestScore) {
      bestScore = candidate;
      ridgeY = y;
    }
  }
  const ridge = new Float64Array(width);
  for (let index = width - 1; index >= 0; index -= 1) {
    ridge[reverse ? width - 1 - index : index] = ridgeY;
    ridgeY = previous[index][ridgeY];
  }
  return ridge;
}

const looseBounds = foregroundBounds(30);
const brightBounds = foregroundBounds(90);
const forward = traceRidge(looseBounds.left, looseBounds.right, false);
const backward = traceRidge(looseBounds.left, looseBounds.right, true);
const ridge = forward.map((value, index) => (value + backward[index]) / 2);
const sourceBaseline = (ridge[0] + ridge[ridge.length - 1]) / 2;
const sourceBounds = { ...looseBounds, top: brightBounds.top, baseline: sourceBaseline };
const mapY = (value: number) => geometryBounds.top
  + (value - sourceBounds.top) / (sourceBounds.baseline - sourceBounds.top)
  * (geometryBounds.baseline - geometryBounds.top);

const leftControls = knotPositions.map((x) => {
  const index = Math.round(x * (ridge.length - 1));
  const mirrorIndex = ridge.length - 1 - index;
  return { x, y: Number((mapY((ridge[index] + ridge[mirrorIndex]) / 2) + opticalAdjustments[knotPositions.indexOf(x)]).toFixed(3)) } satisfies Point;
});
leftControls[0].y = geometryBounds.baseline;
const controls = [
  ...leftControls,
  ...leftControls.slice(0, -1).reverse().map((point) => ({ x: Number((1 - point.x).toFixed(3)), y: point.y })),
];

await mkdir(new URL("./", output), { recursive: true });
await Bun.write(output, `${JSON.stringify({
  source: "public/brand-logo-idea.png#M",
  crop,
  sourceBounds,
  geometryBounds,
  opticalAdjustments,
  controls,
}, null, 2)}\n`);

console.log("Calibrated the symmetric M spline from the authoritative design board.");
