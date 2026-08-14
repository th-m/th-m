import { PNG } from "pngjs";

type Point = { x: number; y: number };
type Segment = { a: number; b: number; evidence: number };

const reference = PNG.sync.read(Buffer.from(await Bun.file(new URL("../../public/brand-audit/reference/o.png", import.meta.url)).arrayBuffer()));
const center = { x: 160, y: 121 };
const radii = { x: 115.5, y: 113.5 };
// Peaks are sampled from the board's luminous perimeter. The close pairs in
// the upper quadrants are intentional source features, not random jitter.
const anchorAngles = [270, 315, 321, 0, 28, 57, 90, 122, 147, 185, 226, 240]
  .map((degrees) => degrees * Math.PI / 180);
const anchors = anchorAngles.map((angle) => ({
  x: center.x + Math.cos(angle) * radii.x,
  y: center.y + Math.sin(angle) * radii.y,
}));

const luminance = (x: number, y: number) => {
  const pixelX = Math.round(x);
  const pixelY = Math.round(y);
  if (pixelX < 0 || pixelY < 0 || pixelX >= reference.width || pixelY >= reference.height) return 0;
  const offset = (pixelY * reference.width + pixelX) * 4;
  return (reference.data[offset] + reference.data[offset + 1] + reference.data[offset + 2]) / 3;
};

function lineEvidence(start: Point, end: Point) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);
  const normal = { x: -dy / length, y: dx / length };
  const values: number[] = [];
  const inset = Math.max(14, length * 0.16);
  for (let distance = inset; distance < length - inset; distance += 1) {
    const progress = distance / length;
    let value = 0;
    for (let offset = -1.5; offset <= 1.5; offset += 0.75) {
      value = Math.max(value, luminance(start.x + dx * progress + normal.x * offset, start.y + dy * progress + normal.y * offset));
    }
    values.push(value);
  }
  values.sort((a, b) => a - b);
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return mean * 0.35 + values[Math.floor(values.length * 0.6)] * 0.4 + values[Math.floor(values.length * 0.3)] * 0.25;
}

const pairs: Segment[] = [];
for (let a = 0; a < anchors.length; a += 1) {
  for (let b = a + 1; b < anchors.length; b += 1) {
    const span = Math.min(b - a, anchors.length - (b - a));
    if (span >= 2) pairs.push({ a, b, evidence: lineEvidence(anchors[a], anchors[b]) });
  }
}

function intersection(first: Segment, second: Segment): Point | null {
  if (new Set([first.a, first.b, second.a, second.b]).size < 4) return null;
  const p1 = anchors[first.a];
  const p2 = anchors[first.b];
  const p3 = anchors[second.a];
  const p4 = anchors[second.b];
  const denominator = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  if (Math.abs(denominator) < 1e-7) return null;
  const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / denominator;
  const u = -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / denominator;
  if (t <= 1e-5 || t >= 1 - 1e-5 || u <= 1e-5 || u >= 1 - 1e-5) return null;
  return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) };
}

function score(chords: Segment[]) {
  const degrees = Array.from({ length: 12 }, () => 0);
  const orientations = [0, 0, 0, 0];
  let centralChords = 0;
  chords.forEach((chord) => {
    degrees[chord.a] += 1;
    degrees[chord.b] += 1;
    const start = anchors[chord.a];
    const end = anchors[chord.b];
    const angle = (Math.atan2(end.y - start.y, end.x - start.x) + Math.PI) % Math.PI;
    orientations[Math.min(3, Math.floor(angle / (Math.PI / 4)))] += 1;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const progress = Math.max(0, Math.min(1, ((center.x - start.x) * dx + (center.y - start.y) * dy) / (dx * dx + dy * dy)));
    if (Math.hypot(center.x - (start.x + progress * dx), center.y - (start.y + progress * dy)) <= 66) centralChords += 1;
  });
  const intersections: Point[] = [];
  for (let first = 0; first < chords.length; first += 1) {
    for (let second = first + 1; second < chords.length; second += 1) {
      const point = intersection(chords[first], chords[second]);
      if (point && !intersections.some((candidate) => Math.hypot(candidate.x - point.x, candidate.y - point.y) < 1)) intersections.push(point);
    }
  }
  const quadrants = [0, 0, 0, 0];
  const centroid = intersections.reduce((sum, point) => {
    quadrants[(point.x >= center.x ? 1 : 0) + (point.y >= center.y ? 2 : 0)] += 1;
    return { x: sum.x + point.x, y: sum.y + point.y };
  }, { x: 0, y: 0 });
  centroid.x /= Math.max(1, intersections.length);
  centroid.y /= Math.max(1, intersections.length);
  const meanDegree = 38 / 12;
  const degreeVariance = degrees.reduce((sum, degree) => sum + (degree - meanDegree) ** 2, 0) / 12;
  return -chords.reduce((sum, chord) => sum + chord.evidence, 0) * 0.55
    + Math.hypot(centroid.x - center.x, centroid.y - center.y) * 2.4
    + (Math.max(...quadrants) - Math.min(...quadrants)) * 3
    + Math.max(0, 4 - Math.min(...quadrants)) * 18
    + Math.abs(intersections.length - 30) * 1.5
    + degreeVariance * 4
    + Math.max(0, 1 - Math.min(...degrees)) * 30
    + Math.max(0, Math.max(...degrees) - 5) * 30
    + Math.max(0, 11 - centralChords) * 24
    + (Math.max(...orientations) - Math.min(...orientations)) * 3;
}

let state = 0x54484f4d;
const random = () => {
  state = Math.imul(state ^ (state >>> 15), state | 1);
  state ^= state + Math.imul(state ^ (state >>> 7), state | 61);
  return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
};
let current = [...pairs].sort((a, b) => b.evidence - a.evidence).slice(0, 19);
let currentScore = score(current);
let best = [...current];
let bestScore = currentScore;
for (let iteration = 0; iteration < 120_000; iteration += 1) {
  const chosen = new Set(current.map(({ a, b }) => `${a}:${b}`));
  const alternatives = pairs.filter(({ a, b }) => !chosen.has(`${a}:${b}`));
  const candidate = [...current];
  candidate[Math.floor(random() * candidate.length)] = alternatives[Math.floor(random() * alternatives.length)];
  const candidateScore = score(candidate);
  const temperature = 5 * (1 - iteration / 120_000) + 0.02;
  if (candidateScore < currentScore || random() < Math.exp((currentScore - candidateScore) / temperature)) {
    current = candidate;
    currentScore = candidateScore;
  }
  if (currentScore < bestScore) {
    best = [...current];
    bestScore = currentScore;
  }
}

console.log(JSON.stringify({
  score: bestScore,
  evidence: best.reduce((sum, chord) => sum + chord.evidence, 0),
  anchorAngles,
  chords: best.map(({ a, b, evidence }) => ({ a, b, evidence: Number(evidence.toFixed(2)) })),
}, null, 2));
