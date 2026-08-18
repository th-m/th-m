import sharp from "sharp";

const THRESHOLDS = [18, 55, 140] as const;

type Crop = { left: number; top: number; width: number; height: number };
type Raster = { data: Buffer; width: number; height: number; channels: number };

function parseCrop(value: string): Crop {
  const [left, top, width, height] = value.split(",").map(Number);
  if (![left, top, width, height].every(Number.isFinite)) throw new Error(`Invalid crop: ${value}`);
  return { left, top, width, height };
}

async function normalize(path: string, crop: Crop, width: number, height: number, output: string): Promise<Raster> {
  const pipeline = sharp(path)
    .extract(crop)
    .resize(width, height, { fit: "fill", kernel: sharp.kernel.lanczos3 })
    .png();
  await pipeline.clone().toFile(output);
  const { data, info } = await pipeline.removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, channels: info.channels };
}

function luminance(raster: Raster, pixel: number) {
  const offset = pixel * raster.channels;
  return raster.data[offset] * 0.2126 + raster.data[offset + 1] * 0.7152 + raster.data[offset + 2] * 0.0722;
}

function maskAt(raster: Raster, threshold: number) {
  return Uint8Array.from({ length: raster.width * raster.height }, (_, pixel) => luminance(raster, pixel) >= threshold ? 1 : 0);
}

function maskMetrics(mask: Uint8Array, width: number, height: number) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  let count = 0;
  let sumX = 0;
  let sumY = 0;
  for (let pixel = 0; pixel < mask.length; pixel += 1) {
    if (!mask[pixel]) continue;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    count += 1;
    sumX += x;
    sumY += y;
  }
  const foregroundWidth = Math.max(0, maxX - minX + 1);
  const foregroundHeight = Math.max(0, maxY - minY + 1);
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const quadrantCounts = [0, 0, 0, 0];
  for (let pixel = 0; pixel < mask.length; pixel += 1) {
    if (!mask[pixel]) continue;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    quadrantCounts[(y >= centerY ? 2 : 0) + (x >= centerX ? 1 : 0)] += 1;
  }
  return {
    width: foregroundWidth,
    height: foregroundHeight,
    density: count / Math.max(1, foregroundWidth * foregroundHeight),
    centroid: { x: sumX / Math.max(1, count) / width, y: sumY / Math.max(1, count) / height },
    quadrants: quadrantCounts.map((value) => value / Math.max(1, count)),
  };
}

function mismatch(first: Uint8Array, second: Uint8Array) {
  let union = 0;
  let xor = 0;
  for (let index = 0; index < first.length; index += 1) {
    if (first[index] || second[index]) union += 1;
    if (first[index] !== second[index]) xor += 1;
  }
  return xor / Math.max(1, union);
}

const relativeDelta = (first: number, second: number) => Math.abs(first - second) / Math.max(Number.EPSILON, second);

const [smallPath, largePath, smallCropValue, largeCropValue, outputPrefix, normalizedValue = "316,360"] = Bun.argv.slice(2);
if (!smallPath || !largePath || !smallCropValue || !largeCropValue || !outputPrefix) {
  throw new Error("Usage: bun run measure-responsive-o-pair.ts <small> <large> <small-crop> <large-crop> <output-prefix> [normalized-width,height]");
}
const [normalizedWidth, normalizedHeight] = normalizedValue.split(",").map(Number);
const small = await normalize(smallPath, parseCrop(smallCropValue), normalizedWidth, normalizedHeight, `${outputPrefix}-small.png`);
const large = await normalize(largePath, parseCrop(largeCropValue), normalizedWidth, normalizedHeight, `${outputPrefix}-large.png`);
const metrics = THRESHOLDS.map((threshold) => {
  const smallMask = maskAt(small, threshold);
  const largeMask = maskAt(large, threshold);
  const smallMetrics = maskMetrics(smallMask, small.width, small.height);
  const largeMetrics = maskMetrics(largeMask, large.width, large.height);
  return {
    threshold,
    small: smallMetrics,
    large: largeMetrics,
    mismatch: mismatch(smallMask, largeMask),
    relativeDelta: {
      width: relativeDelta(smallMetrics.width, largeMetrics.width),
      height: relativeDelta(smallMetrics.height, largeMetrics.height),
      density: relativeDelta(smallMetrics.density, largeMetrics.density),
      centroid: Math.hypot(smallMetrics.centroid.x - largeMetrics.centroid.x, smallMetrics.centroid.y - largeMetrics.centroid.y),
      quadrants: smallMetrics.quadrants.map((value, index) => Math.abs(value - largeMetrics.quadrants[index])),
    },
  };
});
const output = {
  small: { path: smallPath, crop: parseCrop(smallCropValue) },
  large: { path: largePath, crop: parseCrop(largeCropValue) },
  normalized: { width: normalizedWidth, height: normalizedHeight },
  metrics,
};
await Bun.write(`${outputPrefix}-metrics.json`, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify(output, null, 2));
