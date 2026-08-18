import sharp from "sharp";

const THRESHOLDS = [18, 55, 140] as const;
const NORMALIZED_SIZE = 360;

type Raster = {
  data: Buffer;
  width: number;
  height: number;
  channels: number;
};

type MaskMetrics = {
  width: number;
  height: number;
  density: number;
  centroid: { x: number; y: number };
  quadrants: [number, number, number, number];
};

async function normalizedRaster(path: string): Promise<Raster> {
  const { data, info } = await sharp(path)
    .resize(NORMALIZED_SIZE, NORMALIZED_SIZE, { fit: "fill", kernel: sharp.kernel.lanczos3 })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, channels: info.channels };
}

function luminance(raster: Raster, pixel: number) {
  const offset = pixel * raster.channels;
  return raster.data[offset] * 0.2126 + raster.data[offset + 1] * 0.7152 + raster.data[offset + 2] * 0.0722;
}

function maskAt(raster: Raster, threshold: number) {
  return Uint8Array.from({ length: raster.width * raster.height }, (_, pixel) => luminance(raster, pixel) >= threshold ? 1 : 0);
}

function metrics(mask: Uint8Array, width: number, height: number): MaskMetrics {
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
  const quadrants: [number, number, number, number] = [0, 0, 0, 0];
  for (let pixel = 0; pixel < mask.length; pixel += 1) {
    if (!mask[pixel]) continue;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    const quadrant = (y >= centerY ? 2 : 0) + (x >= centerX ? 1 : 0);
    quadrants[quadrant] += 1;
  }
  return {
    width: foregroundWidth,
    height: foregroundHeight,
    density: count / Math.max(1, foregroundWidth * foregroundHeight),
    centroid: { x: sumX / Math.max(1, count) / width, y: sumY / Math.max(1, count) / height },
    quadrants: quadrants.map((value) => value / Math.max(1, count)) as [number, number, number, number],
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

function relativeDelta(first: number, second: number) {
  return Math.abs(first - second) / Math.max(Number.EPSILON, second);
}

async function compareRenderer(prefix: string, renderer: "webgl" | "svg") {
  const small = await normalizedRaster(`${prefix}-small-${renderer}.jpg`);
  const large = await normalizedRaster(`${prefix}-large-${renderer}.jpg`);
  return THRESHOLDS.map((threshold) => {
    const smallMask = maskAt(small, threshold);
    const largeMask = maskAt(large, threshold);
    const smallMetrics = metrics(smallMask, small.width, small.height);
    const largeMetrics = metrics(largeMask, large.width, large.height);
    return {
      threshold,
      small: smallMetrics,
      large: largeMetrics,
      mismatch: mismatch(smallMask, largeMask),
      relativeDelta: {
        width: relativeDelta(smallMetrics.width, largeMetrics.width),
        height: relativeDelta(smallMetrics.height, largeMetrics.height),
        density: relativeDelta(smallMetrics.density, largeMetrics.density),
        centroid: Math.hypot(
          smallMetrics.centroid.x - largeMetrics.centroid.x,
          smallMetrics.centroid.y - largeMetrics.centroid.y,
        ),
        quadrants: smallMetrics.quadrants.map((value, index) => Math.abs(value - largeMetrics.quadrants[index])),
      },
    };
  });
}

const prefix = Bun.argv[2] ?? "public/brand-audit/responsive-o-before";
const cropSpecs = [
  { name: "small-webgl", left: 24, top: 24, width: 120, height: 120 },
  { name: "small-svg", left: 160, top: 24, width: 120, height: 120 },
  { name: "large-webgl", left: 328, top: 24, width: 360, height: 360 },
  { name: "large-svg", left: 704, top: 24, width: 360, height: 360 },
] as const;
await Promise.all(cropSpecs.map((crop) => sharp(`${prefix}.jpg`)
  .extract({ left: crop.left, top: crop.top, width: crop.width, height: crop.height })
  .jpeg({ quality: 100, chromaSubsampling: "4:4:4" })
  .toFile(`${prefix}-${crop.name}.jpg`)));
const output = {
  normalizedSize: NORMALIZED_SIZE,
  source: {
    small: { cssPixels: [120, 120] },
    large: { cssPixels: [360, 360] },
  },
  webgl: await compareRenderer(prefix, "webgl"),
  svg: await compareRenderer(prefix, "svg"),
};

await Bun.write(`${prefix}-metrics.json`, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify(output, null, 2));
