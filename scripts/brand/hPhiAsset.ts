import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

export const H_PHI_SOURCE = new URL("../../src/brand/thom/reference/golden-ratio-phi.png", import.meta.url);
export const H_PHI_OUTPUT = new URL("../../public/brand/h-phi.png", import.meta.url);

type Pixel = { r: number; g: number; b: number };

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const colorDistance = (a: Pixel, b: Pixel) => Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);

function connectedComponents(mask: Uint8Array, width: number, height: number) {
  const seen = new Uint8Array(mask.length);
  const components: number[][] = [];
  for (let start = 0; start < mask.length; start += 1) {
    if (!mask[start] || seen[start]) continue;
    const component: number[] = [];
    const queue = [start];
    seen[start] = 1;
    while (queue.length) {
      const index = queue.pop()!;
      component.push(index);
      const x = index % width;
      const y = Math.floor(index / width);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
        const nextX = x + dx;
        const nextY = y + dy;
        if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height) continue;
        const next = nextY * width + nextX;
        if (!mask[next] || seen[next]) continue;
        seen[next] = 1;
        queue.push(next);
      }
    }
    components.push(component);
  }
  return components.sort((a, b) => b.length - a.length);
}

export async function generateHPhiAsset(source = H_PHI_SOURCE, output = H_PHI_OUTPUT) {
  const { data, info } = await sharp(fileURLToPath(source)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const pixel = (index: number): Pixel => {
    const offset = index * info.channels;
    return { r: data[offset], g: data[offset + 1], b: data[offset + 2] };
  };
  const backgroundSamples = [0, info.width - 1, (info.height - 1) * info.width, info.width * info.height - 1].map(pixel);
  const background = backgroundSamples.reduce((sum, sample) => ({ r: sum.r + sample.r, g: sum.g + sample.g, b: sum.b + sample.b }), { r: 0, g: 0, b: 0 });
  background.r /= backgroundSamples.length;
  background.g /= backgroundSamples.length;
  background.b /= backgroundSamples.length;
  const maximumDistance = colorDistance(background, { r: 0, g: 0, b: 0 });

  const candidateAlpha = new Float32Array(info.width * info.height);
  const candidateMask = new Uint8Array(candidateAlpha.length);
  for (let index = 0; index < candidateAlpha.length; index += 1) {
    const normalizedDistance = colorDistance(background, pixel(index)) / maximumDistance;
    const alpha = clamp((normalizedDistance - 0.035) / 0.76);
    candidateAlpha[index] = alpha;
    if (alpha >= 0.12) candidateMask[index] = 1;
  }

  const largest = connectedComponents(candidateMask, info.width, info.height)[0];
  if (!largest?.length) throw new Error("Could not isolate the golden-ratio phi silhouette.");
  const largestSet = new Set(largest);
  const xs = largest.map((index) => index % info.width);
  const ys = largest.map((index) => Math.floor(index / info.width));
  const padding = 4;
  const left = Math.max(0, Math.min(...xs) - padding);
  const top = Math.max(0, Math.min(...ys) - padding);
  const right = Math.min(info.width - 1, Math.max(...xs) + padding);
  const bottom = Math.min(info.height - 1, Math.max(...ys) + padding);
  const width = right - left + 1;
  const height = bottom - top + 1;
  const rgba = Buffer.alloc(width * height * 4);

  for (let y = top; y <= bottom; y += 1) {
    for (let x = left; x <= right; x += 1) {
      const sourceIndex = y * info.width + x;
      const targetIndex = ((y - top) * width + (x - left)) * 4;
      rgba[targetIndex] = 255;
      rgba[targetIndex + 1] = 255;
      rgba[targetIndex + 2] = 255;
      rgba[targetIndex + 3] = largestSet.has(sourceIndex) ? Math.round(candidateAlpha[sourceIndex] * 255) : 0;
    }
  }

  await mkdir(new URL("./", output), { recursive: true });
  await sharp(rgba, { raw: { width, height, channels: 4 } })
    .blur(0.35)
    .resize({ height: 256, fit: "contain", kernel: sharp.kernel.lanczos3 })
    .png({ compressionLevel: 9, adaptiveFiltering: false })
    .toFile(fileURLToPath(output));
  return { source: { width: info.width, height: info.height }, componentPixels: largest.length, bounds: { left, top, width, height }, outputHeight: 256 };
}

if (import.meta.main) {
  const result = await generateHPhiAsset();
  console.log(`Generated deterministic H phi asset: ${JSON.stringify(result)}`);
}
