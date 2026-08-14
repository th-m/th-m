import { createBrandData, findIntersections, selectHighlights, type Segment } from "../../src/brand/thom/geometry";
import calibration from "../../src/brand/thom/o-calibration.json";
import { renderGlyphSvg } from "../../src/brand/thom/svg";

const output = new URL("../../public/brand-audit/o-candidates.html", import.meta.url);
const metadataOutput = new URL("../../public/brand-audit/o-candidates.json", import.meta.url);
const data = createBrandData();
const anchors = data.o.canonical.anchors;
const current = calibration.chords.map(({ a, b, weight }) => ({ a, b, weight }));
const pairKey = ({ a, b }: Segment) => `${a}:${b}`;
const validNetwork = (chords: Segment[]) => {
  const degrees = Array.from({ length: anchors.length }, () => 0);
  chords.forEach(({ a, b }) => { degrees[a] += 1; degrees[b] += 1; });
  if (Math.min(...degrees) < 1 || Math.max(...degrees) > 6) return false;
  const points = findIntersections(anchors, chords);
  if (points.length < 32 || points.length > 60) return false;
  const quadrants = [0, 0, 0, 0];
  const centroid = points.reduce((sum, point) => {
    quadrants[(point.x >= 50 ? 1 : 0) + (point.y >= 59 ? 2 : 0)] += 1;
    return { x: sum.x + point.x, y: sum.y + point.y };
  }, { x: 0, y: 0 });
  centroid.x /= points.length;
  centroid.y /= points.length;
  return Math.min(...quadrants) >= 5
    && Math.max(...quadrants) - Math.min(...quadrants) <= 8
    && Math.hypot(centroid.x - 50, centroid.y - 59) <= 4;
};
const allPairs: Segment[] = [];
for (let a = 0; a < anchors.length; a += 1) {
  for (let b = a + 1; b < anchors.length; b += 1) {
    const angleA = Math.atan2(anchors[a].y - 59, anchors[a].x - 50);
    const angleB = Math.atan2(anchors[b].y - 59, anchors[b].x - 50);
    const raw = Math.abs(angleA - angleB);
    if (Math.min(raw, Math.PI * 2 - raw) >= Math.PI / 4 - 1e-7) allPairs.push({ a, b });
  }
}

const candidates: Array<{ removed: Segment | null; added: Segment | null; chords: Segment[] }> = [
  { removed: null, added: null, chords: current },
];
if (Bun.env.THOM_O_CANDIDATES === "evolve") {
  let state = 0x54484f4d;
  const random = () => {
    state = Math.imul(state ^ (state >>> 15), state | 1);
    state ^= state + Math.imul(state ^ (state >>> 7), state | 61);
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
  };
  const signatures = new Set([current.map(pairKey).sort().join("|")]);
  while (candidates.length < 703) {
    const chords = current.map(({ a, b }) => ({ a, b }));
    const replacementCount = 1 + Math.floor(random() ** 1.7 * 10);
    for (let replacement = 0; replacement < replacementCount; replacement += 1) {
      const selected = new Set(chords.map(pairKey));
      const available = allPairs.filter((pair) => !selected.has(pairKey(pair)));
      chords[Math.floor(random() * chords.length)] = available[Math.floor(random() * available.length)];
    }
    const signature = chords.map(pairKey).sort().join("|");
    if (signatures.has(signature) || !validNetwork(chords)) continue;
    signatures.add(signature);
    candidates.push({ removed: null, added: null, chords });
  }
} else {
  for (let index = 0; index < current.length; index += 1) {
    const without = current.filter((_, candidateIndex) => candidateIndex !== index);
    const selected = new Set(without.map(pairKey));
    for (const added of allPairs) {
      if (selected.has(pairKey(added))) continue;
      candidates.push({ removed: current[index], added, chords: [...without, added] });
    }
  }
}

const tiles = candidates.map(({ chords }) => {
  const intersections = findIntersections(anchors, chords);
  data.o.canonical = {
    seed: calibration.seed,
    profile: "display",
    anchors,
    chords,
    intersections,
    highlights: selectHighlights(intersections, 8, true, true),
  };
  return `<div class="tile">${renderGlyphSvg(data, "o")}</div>`;
}).join("");

await Bun.write(output, `<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;background:#050505}.board{display:grid;grid-template-columns:repeat(20,320px);width:6400px}.tile{position:relative;width:320px;height:240px;overflow:hidden;background:#050505}.tile svg{position:absolute;top:-44px;left:20px;width:281px;height:337px;max-width:none}</style><div class="board">${tiles}</div>`);
await Bun.write(metadataOutput, `${JSON.stringify({ columns: 20, tileWidth: 320, tileHeight: 240, candidates }, null, 2)}\n`);
console.log(`Wrote ${candidates.length} deterministic O candidates.`);
