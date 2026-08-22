import { PNG } from "/Users/thom/Sites/th-m/th-m/node_modules/.bun/pngjs@7.0.0/node_modules/pngjs";
import { readFileSync } from "node:fs";

const png = PNG.sync.read(readFileSync(".bun-tmp/fig-inspect/figure.png"));
const { width, height, data } = png;
let minX = width, minY = height, maxX = 0, maxY = 0, ink = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    const isBg = a < 40 || (Math.abs(r - 5) < 12 && Math.abs(g - 5) < 12 && Math.abs(b - 5) < 12);
    if (!isBg) {
      ink++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
const bw = maxX - minX + 1, bh = maxY - minY + 1;
console.log(`canvas ${width}x${height}`);
console.log(`ink bbox: x[${minX}..${maxX}] y[${minY}..${maxY}] = ${bw}x${bh} (${(100 * bw / width).toFixed(0)}% x ${(100 * bh / height).toFixed(0)}% of canvas)`);
console.log(`ink coverage: ${(100 * ink / (width * height)).toFixed(1)}%`);
