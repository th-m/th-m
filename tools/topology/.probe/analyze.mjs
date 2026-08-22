import { PNG } from "/Users/thom/Sites/th-m/th-m/node_modules/.bun/pngjs@7.0.0/node_modules/pngjs";
import { readFileSync } from "node:fs";

const png = PNG.sync.read(readFileSync(".bun-tmp/fig-inspect/figure.png"));
const { width, height, data } = png;

// Label boxes: surface #0c0b09 blended at 0.72 over bg #050505 -> ~(10,9,8), plus
// node spheres/edges (bright #f2e5cf / #d6b06a). Cluster both as "ink".
const ink = new Uint8Array(width * height);
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    if (a < 60) continue;
    const nearBg = Math.abs(r - 5) < 10 && Math.abs(g - 5) < 10 && Math.abs(b - 5) < 10;
    if (!nearBg) ink[y * width + x] = 1;
  }
}

// Flood-fill connected components (4-neighbour) of ink.
const comp = new Int32Array(width * height).fill(-1);
const sizes = [];
const boxes = [];
let next = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (!ink[y * width + x] || comp[y * width + x] !== -1) continue;
    const stack = [[x, y]];
    comp[y * width + x] = next;
    let count = 0, minX = x, maxX = x, minY = y, maxY = y;
    while (stack.length) {
      const [cx, cy] = stack.pop();
      count++;
      if (cx < minX) minX = cx; if (cx > maxX) maxX = cx;
      if (cy < minY) minY = cy; if (cy > maxY) maxY = cy;
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        if (ink[ny * width + nx] && comp[ny * width + nx] === -1) {
          comp[ny * width + nx] = next;
          stack.push([nx, ny]);
        }
      }
    }
    sizes.push(count);
    boxes.push({ x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1, count });
    next++;
  }
}

const sorted = [...boxes].sort((a, b) => b.count - a.count).slice(0, 14);
console.log(`components: ${next}`);
console.log("largest components (x,y,w,h,pixels):");
for (const b of sorted) console.log(`  ${b.x},${b.y}  ${b.w}x${b.h}  ${b.count}px`);
