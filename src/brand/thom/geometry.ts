import mCalibration from "./m-calibration.json";

export type Point = { x: number; y: number };
export type Segment = { a: number; b: number };

export type PathCommand =
  | { type: "M" | "L"; x: number; y: number }
  | { type: "C"; x1: number; y1: number; x2: number; y2: number; x: number; y: number }
  | { type: "Z" };

export type FilledPath = { commands: PathCommand[] };
export type NetworkProfile = "display" | "compact";

export type ChordNetwork = {
  seed: string;
  profile: NetworkProfile;
  anchors: Point[];
  chords: Segment[];
  intersections: Point[];
  highlights: Point[];
};

export type FourierData = {
  controls: Point[];
  fftBins: ComplexValue[];
  coefficients: Array<{ n: number; a: number; b: number }>;
  harmonicOrder: number[];
  displayHarmonicCount: number;
  compactHarmonicCount: number;
  restingPartialIndices: number[];
  restingLayers: Array<{ partialIndex: number; amplitudeScale: number; width: number; opacity: number; haloWidth: number; haloOpacity: number }>;
  target: Point[];
  components: Point[][];
  partialSums: Point[][];
  hero: Point[];
  compact: Point[];
};

export type ComplexValue = { re: number; im: number };

export type BrandData = {
  master: { width: number; height: number };
  placements: Record<"t" | "h" | "o" | "m", { x: number; scaleX: number; width: number }>;
  pi: { display: FilledPath; compact: FilledPath };
  h: {
    paths: FilledPath[];
    straight: Point[];
    curve: Point[];
    companionStraight: Point[];
    companion: Point[];
    midpoint: Point;
    axis: Point[];
  };
  o: {
    canonical: ChordNetwork;
    compact: ChordNetwork;
    alternates: ChordNetwork[];
    circle: Point[];
  };
  m: FourierData;
};

export const BRAND_COLORS = {
  background: "#050505",
  surface: "#0a0908",
  shadow: "#765237",
  ivory: "#f2e5cf",
  gold: "#d6b06a",
  highlight: "#fff5dc",
  muted: "#a99b87",
  construction: "rgba(214,176,106,.35)",
  glow: "rgba(214,176,106,.18)",
  lightBackground: "#f4efe6",
  lightInk: "#17130f",
  lightGold: "#8a652a",
} as const;

export const M_FINAL_MATERIAL = {
  halo: { width: 8, opacity: 0.12 },
  middle: { width: 5.6, opacity: 0.58 },
  core: { width: 3.1, opacity: 0.96 },
} as const;

export const MASTER = { width: 416, height: 120 } as const;
export const GLYPH_PLACEMENTS = {
  t: { x: 5.5, scaleX: 0.86, width: 86 },
  h: { x: 102.5, scaleX: 0.86, width: 86 },
  o: { x: 199.5, scaleX: 0.88, width: 88 },
  m: { x: 288.5, scaleX: 1.22, width: 122 },
} as const;

const classicalPi: FilledPath = {
  commands: [
    { type: "M", x: 4, y: 34 },
    { type: "C", x1: 7, y1: 22, x2: 16, y2: 14, x: 29, y: 14 },
    { type: "C", x1: 48, y1: 14, x2: 71, y2: 14.5, x: 91, y: 13.5 },
    { type: "C", x1: 95, y1: 13.2, x2: 97, y2: 10, x: 97.5, y: 7.5 },
    { type: "L", x: 99, y: 7.5 },
    { type: "C", x1: 98.5, y1: 18, x2: 94, y2: 24, x: 86, y: 24.5 },
    { type: "L", x: 75.5, y: 24.5 },
    { type: "C", x1: 73.5, y1: 35, x2: 71.5, y2: 49, x: 70.5, y: 64 },
    { type: "C", x1: 69.3, y1: 82, x2: 71.8, y2: 94, x: 79.5, y: 97 },
    { type: "C", x1: 86, y1: 99.5, x2: 92.5, y2: 95, x: 96.5, y: 87.5 },
    { type: "L", x: 99, y: 90 },
    { type: "C", x1: 94.5, y1: 103.5, x2: 85.5, y2: 110.5, x: 75.5, y: 108.5 },
    { type: "C", x1: 62, y1: 106, x2: 59, y2: 96.5, x: 60.2, y: 80 },
    { type: "C", x1: 61.5, y1: 61, x2: 64.5, y2: 40, x: 66.8, y: 24.5 },
    { type: "L", x: 39.5, y: 24.5 },
    { type: "C", x1: 38.5, y1: 37, x2: 36.8, y2: 55, x: 34, y: 72 },
    { type: "C", x1: 31.2, y1: 90.5, x2: 26, y2: 102.5, x: 17.5, y: 108 },
    { type: "C", x1: 13, y1: 110.5, x2: 8, y2: 109.5, x: 5, y: 108 },
    { type: "C", x1: 16, y1: 93, x2: 21, y2: 77, x: 23.5, y: 60 },
    { type: "C", x1: 25.5, y1: 46, x2: 27.5, y2: 33, x: 28.5, y: 24.5 },
    { type: "C", x1: 18, y1: 24.5, x2: 10.5, y2: 28.5, x: 6.5, y: 36 },
    { type: "Z" },
  ],
};

const compactPi: FilledPath = {
  commands: [
    { type: "M", x: 5, y: 34 },
    { type: "C", x1: 9, y1: 21, x2: 18, y2: 15, x: 30, y: 15 },
    { type: "L", x: 91, y: 15 },
    { type: "C", x1: 95, y1: 15, x2: 97, y2: 11, x: 98, y: 8 },
    { type: "C", x1: 98, y1: 19, x2: 94, y2: 24, x: 86, y: 25 },
    { type: "L", x: 75, y: 25 },
    { type: "C", x1: 72, y1: 45, x2: 69, y2: 75, x: 71, y: 88 },
    { type: "C", x1: 73, y1: 101, x2: 88, y2: 102, x: 97, y: 89 },
    { type: "C", x1: 94, y1: 103, x2: 85, y2: 109, x: 76, y: 108 },
    { type: "C", x1: 62, y1: 106, x2: 59, y2: 96, x: 61, y: 80 },
    { type: "L", x: 67, y: 25 },
    { type: "L", x: 40, y: 25 },
    { type: "C", x1: 38, y1: 48, x2: 35, y2: 78, x: 29, y: 94 },
    { type: "C", x1: 24, y1: 106, x2: 14, y2: 110, x: 6, y: 108 },
    { type: "C", x1: 18, y1: 91, x2: 24, y2: 61, x: 29, y: 25 },
    { type: "C", x1: 17, y1: 25, x2: 10, y2: 29, x: 6, y: 36 },
    { type: "Z" },
  ],
};

function pillarPath(center: number): FilledPath {
  return {
    commands: [
      { type: "M", x: center - 14, y: 104 },
      { type: "C", x1: center - 8.5, y1: 103.5, x2: center - 5.5, y2: 101.5, x: center - 4.2, y: 98.5 },
      { type: "L", x: center - 3.8, y: 23 },
      { type: "C", x1: center - 5.2, y1: 20, x2: center - 8.5, y2: 18.5, x: center - 12, y: 18.2 },
      { type: "L", x: center - 12, y: 15 },
      { type: "L", x: center + 12, y: 15 },
      { type: "L", x: center + 12, y: 18.2 },
      { type: "C", x1: center + 8.5, y1: 18.5, x2: center + 5.2, y2: 20, x: center + 3.8, y: 23 },
      { type: "L", x: center + 4.2, y: 98.5 },
      { type: "C", x1: center + 5.5, y1: 101.5, x2: center + 8.5, y2: 103.5, x: center + 14, y: 104 },
      { type: "Z" },
    ],
  };
}

type CatenarySpec = { left: number; right: number; centerX: number; anchorY: number; centerY: number; a: number };
const primaryCatenary = { left: 24, right: 76, centerX: 50, anchorY: 48, centerY: 70, a: 18 };
const companionCatenary = { left: 24, right: 76, centerX: 50, anchorY: 60, centerY: 70, a: 24 };

function sampleCatenarySpec(spec: CatenarySpec, count: number, sag: number): Point[] {
  const rawCenterDrop = spec.a * (Math.cosh((spec.left - spec.centerX) / spec.a) - 1);
  const targetDrop = (spec.centerY - spec.anchorY) * sag;
  const scale = targetDrop / rawCenterDrop;
  return Array.from({ length: count }, (_, index) => {
    const x = spec.left + (spec.right - spec.left) * (index / (count - 1));
    const edgeHeight = spec.a * (Math.cosh((x - spec.centerX) / spec.a) - 1);
    return { x, y: spec.anchorY + targetDrop - edgeHeight * scale };
  });
}

export function sampleCatenary(count = 128, sag = 1): Point[] {
  return sampleCatenarySpec(primaryCatenary, count, sag);
}

export function sampleCompanionCatenary(count = 128, sag = 1): Point[] {
  return sampleCatenarySpec(companionCatenary, count, sag);
}

export function sampleStraight(count = 128, y = 48): Point[] {
  return Array.from({ length: count }, (_, index) => ({ x: 24 + 52 * (index / (count - 1)), y }));
}

function xmur3(value: string) {
  let hash = 1779033703 ^ value.length;
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }
  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    return (hash ^= hash >>> 16) >>> 0;
  };
}

function mulberry32(seed: number) {
  return () => {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(values: T[], random: () => number): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function segmentIntersection(p1: Point, p2: Point, p3: Point, p4: Point): Point | null {
  const denominator = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  if (Math.abs(denominator) < 1e-7) return null;
  const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / denominator;
  const u = -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / denominator;
  if (t <= 1e-5 || t >= 1 - 1e-5 || u <= 1e-5 || u >= 1 - 1e-5) return null;
  return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) };
}

function findIntersections(anchors: Point[], chords: Segment[]): Point[] {
  const intersections: Point[] = [];
  for (let first = 0; first < chords.length; first += 1) {
    for (let second = first + 1; second < chords.length; second += 1) {
      const a = chords[first];
      const b = chords[second];
      if (a.a === b.a || a.a === b.b || a.b === b.a || a.b === b.b) continue;
      const point = segmentIntersection(anchors[a.a], anchors[a.b], anchors[b.a], anchors[b.b]);
      if (point && !intersections.some((candidate) => Math.hypot(candidate.x - point.x, candidate.y - point.y) < 0.35)) {
        intersections.push(point);
      }
    }
  }
  return intersections;
}

function angularDistance(a: number, b: number): number {
  const delta = Math.abs(a - b) % (Math.PI * 2);
  return Math.min(delta, Math.PI * 2 - delta);
}

function distanceToSegment(point: Point, start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  const progress = lengthSquared === 0 ? 0 : clampNumber(((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared, 0, 1);
  return Math.hypot(point.x - (start.x + progress * dx), point.y - (start.y + progress * dy));
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function selectHighlights(points: Point[], count = 8): Point[] {
  if (points.length <= count) return [...points];
  const selected: Point[] = [];
  for (let quadrant = 0; quadrant < 4; quadrant += 1) {
    const candidates = points.filter((point) => (point.x >= 50 ? 1 : 0) + (point.y >= 59 ? 2 : 0) === quadrant);
    if (!candidates.length) continue;
    candidates.sort((a, b) => Math.hypot(b.x - 50, b.y - 59) - Math.hypot(a.x - 50, a.y - 59));
    selected.push(candidates[0]);
  }
  while (selected.length < count) {
    const candidate = points
      .filter((point) => !selected.includes(point))
      .map((point) => ({ point, distance: Math.min(...selected.map((chosen) => Math.hypot(point.x - chosen.x, point.y - chosen.y))) }))
      .sort((a, b) => b.distance - a.distance || a.point.x - b.point.x || a.point.y - b.point.y)[0];
    if (!candidate) break;
    selected.push(candidate.point);
  }
  return selected.slice(0, count);
}

const networkSpecs = {
  display: { anchors: 12, chords: 19, intersections: [16, 24] as const, quadrants: 4, centroidRadius: 8, minDegree: 1, maxDegree: 5, centralChords: 11 },
  compact: { anchors: 10, chords: 13, intersections: [8, 14] as const, quadrants: 3, centroidRadius: 12, minDegree: 1, maxDegree: 4, centralChords: 0 },
};

export function generateChordNetwork(seed: string, profile: NetworkProfile = "display"): ChordNetwork {
  const spec = networkSpecs[profile];
  const seedFactory = xmur3(`${seed}:${profile}`);
  const random = mulberry32(seedFactory());
  const radius = 41;
  const center = { x: 50, y: 59 };

  for (let attempt = 0; attempt < 12000; attempt += 1) {
    const slice = (Math.PI * 2) / spec.anchors;
    const offset = random() * Math.PI * 2;
    const angles = Array.from({ length: spec.anchors }, (_, index) => {
      const jitter = (random() - 0.5) * slice * 0.44;
      return (offset + index * slice + jitter + Math.PI * 2) % (Math.PI * 2);
    }).sort((a, b) => a - b);
    const anchors = angles.map((angle) => ({ x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) }));
    const pairs: Segment[] = [];
    for (let a = 0; a < angles.length; a += 1) {
      for (let b = a + 1; b < angles.length; b += 1) {
        if (angularDistance(angles[a], angles[b]) >= Math.PI / 4) pairs.push({ a, b });
      }
    }
    if (pairs.length < spec.chords) continue;
    const degrees = Array.from({ length: spec.anchors }, () => 0);
    const chords: Segment[] = [];
    let centralChordCount = 0;
    let remaining = shuffled(pairs, random);
    while (chords.length < spec.chords) {
      const desiredIntersections = Math.round(((chords.length + 1) / spec.chords) ** 2 * ((spec.intersections[0] + spec.intersections[1]) / 2));
      const remainingSlots = spec.chords - chords.length;
      const centralNeeded = Math.max(0, spec.centralChords - centralChordCount);
      const candidates = remaining
        .filter((pair) => degrees[pair.a] < spec.maxDegree && degrees[pair.b] < spec.maxDegree)
        .map((pair) => ({
          pair,
          count: findIntersections(anchors, [...chords, pair]).length,
          central: distanceToSegment(center, anchors[pair.a], anchors[pair.b]) <= 24,
          degreeLoad: degrees[pair.a] + degrees[pair.b],
        }))
        .filter((candidate) => centralNeeded < remainingSlots || candidate.central)
        .filter((candidate) => candidate.count <= spec.intersections[1])
        .sort((a, b) => {
          const scoreA = Math.abs(a.count - desiredIntersections) + a.degreeLoad * 0.14 + (a.central ? 0 : 0.35);
          const scoreB = Math.abs(b.count - desiredIntersections) + b.degreeLoad * 0.14 + (b.central ? 0 : 0.35);
          return scoreA - scoreB;
        });
      if (!candidates.length) break;
      const poolSize = Math.min(5, candidates.length);
      const chosen = candidates[Math.floor(random() * poolSize)].pair;
      chords.push(chosen);
      degrees[chosen.a] += 1;
      degrees[chosen.b] += 1;
      if (distanceToSegment(center, anchors[chosen.a], anchors[chosen.b]) <= 24) centralChordCount += 1;
      remaining = remaining.filter((pair) => pair !== chosen);
    }
    if (chords.length < spec.chords) continue;
    if (Math.min(...degrees) < spec.minDegree || Math.max(...degrees) > spec.maxDegree) continue;
    if (centralChordCount < spec.centralChords) continue;
    const intersections = findIntersections(anchors, chords);
    if (intersections.length < spec.intersections[0] || intersections.length > spec.intersections[1]) continue;
    const quadrants = new Set(intersections.map((point) => `${point.x >= 50 ? 1 : 0}${point.y >= 59 ? 1 : 0}`));
    const centroid = intersections.reduce((sum, point) => ({ x: sum.x + point.x, y: sum.y + point.y }), { x: 0, y: 0 });
    centroid.x /= intersections.length;
    centroid.y /= intersections.length;
    if (quadrants.size < spec.quadrants) continue;
    if (Math.hypot(centroid.x - 50, centroid.y - 59) > spec.centroidRadius) continue;
    {
      return { seed, profile, anchors, chords, intersections, highlights: selectHighlights(intersections) };
    }
  }
  throw new Error(`Unable to produce a balanced ${profile} chord network for ${seed}`);
}

function circlePoints(count = 128): Point[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / (count - 1)) * Math.PI * 2;
    return { x: 50 + Math.cos(angle) * 41, y: 59 + Math.sin(angle) * 41 };
  });
}

export const M_SPLINE_CONTROLS: Point[] = mCalibration.controls;

function sampleHermite(x: number): number {
  let index = 0;
  while (index < M_SPLINE_CONTROLS.length - 2 && M_SPLINE_CONTROLS[index + 1].x < x) index += 1;
  const p0 = M_SPLINE_CONTROLS[Math.max(0, index - 1)];
  const p1 = M_SPLINE_CONTROLS[index];
  const p2 = M_SPLINE_CONTROLS[index + 1];
  const p3 = M_SPLINE_CONTROLS[Math.min(M_SPLINE_CONTROLS.length - 1, index + 2)];
  const span = p2.x - p1.x || 1;
  const t = (x - p1.x) / span;
  const m1 = index === 0 ? 0 : (p2.y - p0.y) / (p2.x - p0.x);
  const m2 = index + 1 === M_SPLINE_CONTROLS.length - 1 ? 0 : (p3.y - p1.y) / (p3.x - p1.x);
  const h00 = 2 * t ** 3 - 3 * t ** 2 + 1;
  const h10 = t ** 3 - 2 * t ** 2 + t;
  const h01 = -2 * t ** 3 + 3 * t ** 2;
  const h11 = t ** 3 - t ** 2;
  return h00 * p1.y + h10 * span * m1 + h01 * p2.y + h11 * span * m2;
}

export function fft(values: ComplexValue[], inverse = false): ComplexValue[] {
  const count = values.length;
  if (count === 0 || (count & (count - 1)) !== 0) throw new Error("FFT input length must be a power of two");
  const output = values.map((value) => ({ ...value }));
  for (let index = 1, reversed = 0; index < count; index += 1) {
    let bit = count >> 1;
    for (; reversed & bit; bit >>= 1) reversed ^= bit;
    reversed ^= bit;
    if (index < reversed) [output[index], output[reversed]] = [output[reversed], output[index]];
  }
  for (let length = 2; length <= count; length <<= 1) {
    const angle = (inverse ? 2 : -2) * Math.PI / length;
    const root = { re: Math.cos(angle), im: Math.sin(angle) };
    for (let start = 0; start < count; start += length) {
      let twiddle = { re: 1, im: 0 };
      for (let offset = 0; offset < length / 2; offset += 1) {
        const even = output[start + offset];
        const oddSource = output[start + offset + length / 2];
        const odd = {
          re: oddSource.re * twiddle.re - oddSource.im * twiddle.im,
          im: oddSource.re * twiddle.im + oddSource.im * twiddle.re,
        };
        output[start + offset] = { re: even.re + odd.re, im: even.im + odd.im };
        output[start + offset + length / 2] = { re: even.re - odd.re, im: even.im - odd.im };
        twiddle = {
          re: twiddle.re * root.re - twiddle.im * root.im,
          im: twiddle.re * root.im + twiddle.im * root.re,
        };
      }
    }
  }
  return inverse ? output.map((value) => ({ re: value.re / count, im: value.im / count })) : output;
}

export function generateFourier(sampleCount = 128, displayHarmonicCount = 12, compactHarmonicCount = 4): FourierData {
  const fftSamples = Array.from({ length: sampleCount }, (_, index) => ({ re: sampleHermite(index / sampleCount), im: 0 }));
  const fftBins = fft(fftSamples);
  const coefficients = Array.from({ length: displayHarmonicCount + 1 }, (_, n) => ({
    n,
    a: (2 / sampleCount) * fftBins[n].re,
    b: (-2 / sampleCount) * fftBins[n].im,
  }));
  const xFor = (index: number) => 2 + 96 * (index / (sampleCount - 1));
  const seriesAt = (progress: number, harmonics: number[]) => {
    let value = coefficients[0].a / 2;
    for (const n of harmonics) {
      const angle = Math.PI * 2 * n * progress;
      value += coefficients[n].a * Math.cos(angle) + coefficients[n].b * Math.sin(angle);
    }
    return value;
  };
  const preferredOrder = [2, 3, 12, 9, 6, 5, 4, 10, 8, 11, 7, 1];
  const harmonicOrder = [
    ...preferredOrder.filter((harmonic) => harmonic <= displayHarmonicCount),
    ...Array.from({ length: displayHarmonicCount }, (_, index) => index + 1).filter((harmonic) => !preferredOrder.includes(harmonic)),
  ];
  const partialSums = Array.from({ length: displayHarmonicCount }, (_, term) =>
    Array.from({ length: sampleCount }, (_, index) => ({ x: xFor(index), y: seriesAt(index / (sampleCount - 1), harmonicOrder.slice(0, term + 1)) })),
  );
  const baseline = coefficients[0].a / 2;
  const components = Array.from({ length: displayHarmonicCount }, (_, componentIndex) => {
    const coefficient = coefficients[componentIndex + 1];
    return Array.from({ length: sampleCount }, (_, index) => {
      const angle = Math.PI * 2 * coefficient.n * (index / (sampleCount - 1));
      return { x: xFor(index), y: baseline + coefficient.a * Math.cos(angle) + coefficient.b * Math.sin(angle) };
    });
  });
  const restingLayers = Array.from({ length: displayHarmonicCount - 1 }, (_, index) => {
    const progress = index / Math.max(1, displayHarmonicCount - 2);
    return {
      partialIndex: index,
      amplitudeScale: 0.45 + progress * 0.55,
      width: 0.56 + progress * 0.35,
      opacity: 0.27 + progress * 0.3,
      haloWidth: 3.6,
      haloOpacity: 0.08,
    };
  });
  return {
    controls: M_SPLINE_CONTROLS,
    fftBins,
    coefficients,
    harmonicOrder,
    displayHarmonicCount,
    compactHarmonicCount,
    restingPartialIndices: Array.from({ length: displayHarmonicCount - 1 }, (_, index) => index),
    restingLayers,
    target: Array.from({ length: sampleCount }, (_, index) => ({ x: xFor(index), y: sampleHermite(index / (sampleCount - 1)) })),
    components,
    partialSums,
    hero: partialSums[displayHarmonicCount - 1],
    compact: Array.from({ length: sampleCount }, (_, index) => ({
      x: xFor(index),
      y: seriesAt(index / (sampleCount - 1), Array.from({ length: compactHarmonicCount }, (_value, harmonic) => harmonic + 1)),
    })),
  };
}

export function scaleFourierLayer(points: Point[], baseline: number, amplitudeScale: number): Point[] {
  return points.map((point) => ({ ...point, y: baseline + (point.y - baseline) * amplitudeScale }));
}

export function createBrandData(): BrandData {
  return {
    master: MASTER,
    placements: GLYPH_PLACEMENTS,
    pi: { display: classicalPi, compact: compactPi },
    h: {
      paths: [pillarPath(17), pillarPath(83)],
      straight: sampleStraight(),
      curve: sampleCatenary(),
      companionStraight: sampleStraight(128, 60),
      companion: sampleCompanionCatenary(),
      midpoint: { x: 50, y: 70 },
      axis: [{ x: 50, y: 23 }, { x: 50, y: 101 }],
    },
    o: {
      canonical: generateChordNetwork("THOM-01", "display"),
      compact: generateChordNetwork("THOM-01", "compact"),
      alternates: ["THOM-02", "THOM-03", "THOM-04"].map((seed) => generateChordNetwork(seed, "display")),
      circle: circlePoints(),
    },
    m: generateFourier(),
  };
}

export function interpolatePoints(from: Point[], to: Point[], progress: number): Point[] {
  return from.map((point, index) => ({
    x: point.x + (to[index].x - point.x) * progress,
    y: point.y + (to[index].y - point.y) * progress,
  }));
}
