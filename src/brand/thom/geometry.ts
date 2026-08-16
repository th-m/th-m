import mCalibration from "./m-calibration.json";
import oCalibration from "./o-calibration.json";

export type Point = { x: number; y: number };
export type Segment = { a: number; b: number; weight?: number };
export type CubicBezierSegment = { start: Point; control1: Point; control2: Point; end: Point };

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
  componentWidths: number[];
  partialSums: Point[][];
  hero: Point[];
  compact: Point[];
};

export type ComplexValue = { re: number; im: number };

export type HData = {
  paths: FilledPath[];
  proportion: {
    ratio: number;
    totalLength: number;
    aLength: number;
    bLength: number;
    a: Point[];
    b: Point[];
    ratioPoint: Point;
    ticks: Point[][];
    brace: Point[];
  };
};

export type BrandData = {
  master: { width: number; height: number };
  placements: Record<"t" | "h" | "o" | "m", { x: number; y: number; scaleX: number; scaleY: number; width: number }>;
  pi: { display: FilledPath; displayContours: FilledPath[]; compact: FilledPath };
  h: HData;
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

export const SOURCE_ENERGY_Q = {
  t: 0.852298,
  h: 1.116686,
  o: 1.096325,
  m: 1.113872,
} as const;

export const SOURCE_ENERGY_SCALE = {
  t: SOURCE_ENERGY_Q.t ** 2,
  h: SOURCE_ENERGY_Q.h ** 2,
  o: SOURCE_ENERGY_Q.o ** 2,
  m: SOURCE_ENERGY_Q.m ** 2,
} as const;

const srgbToLinearChannel = (channel: number) => channel <= 0.04045
  ? channel / 12.92
  : ((channel + 0.055) / 1.055) ** 2.4;
const linearToSrgbChannel = (channel: number) => channel <= 0.0031308
  ? channel * 12.92
  : 1.055 * channel ** (1 / 2.4) - 0.055;

function scaleLinearHex(color: string, energyScale: number) {
  const channels = [1, 3, 5].map((index) => Number.parseInt(color.slice(index, index + 2), 16));
  return `#${channels.map((channel) => {
    const scaled = Math.min(1, linearToSrgbChannel(srgbToLinearChannel(channel / 255) * energyScale));
    return Math.round(scaled * 255).toString(16).padStart(2, "0");
  }).join("")}`;
}

export const PI_FILL_ENERGY_SCALE = SOURCE_ENERGY_SCALE.t * 0.916682;

export const PI_MATERIAL = {
  shadow: "#50382f",
  gold: scaleLinearHex("#a67f50", PI_FILL_ENERGY_SCALE),
  ivory: scaleLinearHex("#beb19f", PI_FILL_ENERGY_SCALE),
  highlight: scaleLinearHex("#f1dfbd", PI_FILL_ENERGY_SCALE),
  edge: "#ead7b5",
  strokeWidth: 0.38,
} as const;

export const PI_WEBGL_MATERIAL = {
  shadow: "#50382f",
  gold: "#a67f50",
  ivory: "#beb19f",
  highlight: "#f1dfbd",
  edge: "#ead7b5",
  opacity: 1,
} as const;

export const PI_ANIMATION = {
  durationMs: 450,
  traceHoldEnd: 0.58,
} as const;

export const PI_LEG_INSET = {
  display: 5.5,
  compact: 5,
} as const;

export const M_SPATIAL_ADJUSTMENT = {
  centerY: 60,
  scaleY: 1.032,
  offsetY: 0,
} as const;

export const M_FINAL_MATERIAL = {
  halo: { width: Number((8.8 * SOURCE_ENERGY_SCALE.m).toFixed(3)), opacity: 0.11 },
  middle: { width: Number((6.85 * SOURCE_ENERGY_SCALE.m).toFixed(3)), opacity: 0.56 },
  core: { width: Number((3.1 * SOURCE_ENERGY_SCALE.m).toFixed(3)), opacity: 0.96 },
} as const;

export const M_FINE_STRAND_OFFSETS = [-2.4, -1.2, 1.2, 2.4] as const;

export const M_WEBGL_CORE_PARITY_SCALE = 1.12;

export const DISPLAY_STROKE_WORLD_PER_PIXEL = 0.35;
export const displayStrokeWorldWidth = (referencePixels: number) => Number((referencePixels * DISPLAY_STROKE_WORLD_PER_PIXEL).toFixed(3));

export const O_RADIUS_SCALE = 0.98;
export const O_RADIUS = 41 * O_RADIUS_SCALE;

export const O_DISPLAY_MATERIAL = {
  circle: {
    haloWidth: Number((8 * SOURCE_ENERGY_SCALE.o * O_RADIUS_SCALE).toFixed(3)),
    haloOpacity: 0.055,
    middleWidth: Number((4.8 * SOURCE_ENERGY_SCALE.o * O_RADIUS_SCALE).toFixed(3)),
    middleOpacity: 0.3,
    coreWidth: 2.613,
    coreOpacity: 1,
  },
  chord: {
    haloWidth: Number((4 * SOURCE_ENERGY_SCALE.o * O_RADIUS_SCALE).toFixed(3)),
    haloOpacity: 0.025,
    coreWidth: Number((0.7 * SOURCE_ENERGY_SCALE.o * O_RADIUS_SCALE).toFixed(3)),
    coreWidthBase: Number((0.5 * SOURCE_ENERGY_SCALE.o * O_RADIUS_SCALE).toFixed(3)),
    coreWidthWeight: Number((0.58 * SOURCE_ENERGY_SCALE.o * O_RADIUS_SCALE).toFixed(3)),
    coreOpacity: 0.62,
  },
  anchor: {
    haloRadius: Number((3.1 * SOURCE_ENERGY_Q.o * O_RADIUS_SCALE).toFixed(3)),
    haloOpacity: 0.07,
    coreRadius: Number((0.8 * SOURCE_ENERGY_Q.o * O_RADIUS_SCALE).toFixed(3)),
    coreOpacity: 0.98,
  },
  intersection: { radius: Number((0.4 * SOURCE_ENERGY_Q.o * O_RADIUS_SCALE).toFixed(3)), opacity: 0.3 },
  highlight: {
    haloRadius: Number((3.5 * SOURCE_ENERGY_Q.o * O_RADIUS_SCALE).toFixed(3)),
    haloOpacity: 0.1,
    coreRadius: Number((1.15 * SOURCE_ENERGY_Q.o * O_RADIUS_SCALE).toFixed(3)),
    coreOpacity: 1,
  },
} as const;

export const O_ANIMATION = {
  introDelay: 0.48,
  introDuration: 0.72,
  circle: { start: 0, duration: 0.22, stagger: 0 },
  anchor: { start: 0.1, duration: 0.2, stagger: 0.12 },
  chord: { start: 0.18, duration: 0.3, stagger: 0.2 },
  intersection: { start: 0.58, duration: 0.16, stagger: 0.1 },
  highlight: { start: 0.78, duration: 0.16, stagger: 0.06 },
} as const;

export const M_ANIMATION = {
  delayMs: 780,
  durationMs: 820,
  endMs: 1600,
  componentFanEnd: 0.34,
  partialStart: 0.195,
  partialEnd: 0.695,
  partialRevealDuration: 0.085,
  finalStart: 0.659,
  replayDurationMs: 820,
} as const;

export const H_ISOLATED_VIEW = { x: -2.8, y: 4, width: 137, height: 110, scaleX: 1.37 } as const;
export const H_STROKE_WORLD_PER_PIXEL = 0.7;
export const hStrokeWorldWidth = (referencePixels: number) => Number((referencePixels * H_STROKE_WORLD_PER_PIXEL).toFixed(3));

export const H_MATERIAL = {
  a: { haloWidth: 4.02, haloOpacity: 0.058, middleWidth: 2.15, middleOpacity: 0.297, coreWidth: 1.667142857142857, coreOpacity: 1 },
  b: { haloWidth: 4.02, haloOpacity: 0.058, middleWidth: 2.15, middleOpacity: 0.297, coreWidth: 1.667142857142857, coreOpacity: 1 },
  tick: { haloWidth: 1.9, haloOpacity: 0.035, middleWidth: 0.88, middleOpacity: 0.18, coreWidth: 0.56, coreOpacity: 0.9 },
  brace: { haloWidth: 1.6, haloOpacity: 0.025, middleWidth: 0.76, middleOpacity: 0.14, coreWidth: 0.46, coreOpacity: 0.68 },
} as const;

export const H_RATIO_POINT_MATERIAL = O_DISPLAY_MATERIAL.intersection;

export const H_COLUMN_MATERIAL = {
  edge: scaleLinearHex("#bd9a63", SOURCE_ENERGY_SCALE.h),
  body: scaleLinearHex("#d2bc96", SOURCE_ENERGY_SCALE.h),
  highlight: scaleLinearHex("#e2d2b4", SOURCE_ENERGY_SCALE.h),
  highlightMix: 0.1,
  strokeWidth: Number((0.34 * SOURCE_ENERGY_SCALE.h).toFixed(3)),
} as const;

export const H_PILLAR_SHAPE = {
  serifHalfWidth: 5.772,
  topSerifHalfWidth: 5.476,
  stemHalfWidth: 1.6502,
} as const;

export const H_RATIO_POINT_SHAPE = { radiusX: 0.748, radiusY: 0.969 } as const;

export const H_ANIMATION = {
  delayMs: 220,
  durationMs: 700,
  endMs: 920,
  phiFadeInEnd: 0.16,
  phiHoldEnd: 0.34,
  crossfadeEnd: 0.82,
} as const;

export const H_PHI_STRATEGIES = {
  enlarged: {
    plane: { width: 59, height: 90, centerX: 51.42, centerY: 60 },
    coreOpacity: 0.61,
    halo: { width: 59, height: 90, opacity: 0 },
  },
  material: {
    plane: { width: 42, height: 64, centerX: 50.71, centerY: 60 },
    coreOpacity: 1,
    halo: { width: 50, height: 72, opacity: 0.717 },
  },
} as const;

export type HPhiStrategyName = keyof typeof H_PHI_STRATEGIES;
export const H_PHI_STRATEGY: HPhiStrategyName = "material";

export function hAnimationWeights(progress: number, _strategyName: HPhiStrategyName = H_PHI_STRATEGY) {
  const phiIn = Math.min(1, Math.max(0, progress / H_ANIMATION.phiFadeInEnd));
  const crossfade = Math.min(1, Math.max(
    0,
    (progress - H_ANIMATION.phiHoldEnd) / (H_ANIMATION.crossfadeEnd - H_ANIMATION.phiHoldEnd),
  ));
  const phiCrossfadeWeight = 1 - crossfade;
  const hCrossfadeWeight = crossfade;
  const crossfadeNormalization = Math.max(phiCrossfadeWeight + hCrossfadeWeight, Number.EPSILON);
  return {
    phi: phiIn * phiCrossfadeWeight / crossfadeNormalization,
    h: hCrossfadeWeight / crossfadeNormalization,
  };
}

export const MASTER = { width: 460, height: 120 } as const;
export const GLYPH_PLACEMENTS = {
  t: { x: 22, y: -0.222, scaleX: 0.86, scaleY: 1.03, width: 86 },
  h: { x: 98.975, y: 0, scaleX: 1, scaleY: 1, width: 69 },
  o: { x: 185.625, y: -8.4, scaleX: 0.88, scaleY: 1.14, width: 77 },
  m: { x: 274.6, y: -26.7, scaleX: 1, scaleY: 1.49, width: 121 },
} as const;

export const H_PILLAR_CENTERS = [28, 72] as const;
export const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
export const H_PROPORTION = (() => {
  const y = 60;
  const startX = 27.23;
  const endX = 72.77;
  const totalLength = endX - startX;
  const aLength = totalLength / GOLDEN_RATIO;
  const bLength = totalLength - aLength;
  const splitX = startX + aLength;
  const tickTop = y - 2.8;
  const tickBottom = y + 2.8;
  return { y, startX, splitX, endX, totalLength, aLength, bLength, tickTop, tickBottom };
})();

export const H_UNIT_BRACE = {
  topY: 64.6,
  shoulderY: 68.8,
  cuspY: 74.3,
} as const;

function hUnitBrace(startX: number, endX: number): Point[] {
  const span = endX - startX;
  const centerX = startX + span / 2;
  const leftOuter = startX + span * 0.14;
  const leftInner = centerX - span * 0.11;
  const rightInner = centerX + span * 0.11;
  const rightOuter = endX - span * 0.14;
  const { topY, shoulderY, cuspY } = H_UNIT_BRACE;
  return sampleBezierChain([
    { start: { x: startX, y: topY }, control1: { x: startX, y: shoulderY - 1.2 }, control2: { x: startX + span * 0.045, y: shoulderY }, end: { x: leftOuter, y: shoulderY } },
    { start: { x: leftOuter, y: shoulderY }, control1: { x: startX + span * 0.24, y: shoulderY }, control2: { x: centerX - span * 0.18, y: shoulderY - 0.35 }, end: { x: leftInner, y: shoulderY } },
    { start: { x: leftInner, y: shoulderY }, control1: { x: centerX - span * 0.055, y: shoulderY + 0.15 }, control2: { x: centerX - span * 0.022, y: cuspY - 2.15 }, end: { x: centerX, y: cuspY } },
    { start: { x: centerX, y: cuspY }, control1: { x: centerX + span * 0.022, y: cuspY - 2.15 }, control2: { x: centerX + span * 0.055, y: shoulderY + 0.15 }, end: { x: rightInner, y: shoulderY } },
    { start: { x: rightInner, y: shoulderY }, control1: { x: centerX + span * 0.18, y: shoulderY - 0.35 }, control2: { x: endX - span * 0.24, y: shoulderY }, end: { x: rightOuter, y: shoulderY } },
    { start: { x: rightOuter, y: shoulderY }, control1: { x: endX - span * 0.045, y: shoulderY }, control2: { x: endX, y: shoulderY - 1.2 }, end: { x: endX, y: topY } },
  ], 6);
}

const classicalPiOutline: FilledPath = {
  commands: [
    { type: "M", x: 2, y: 40 },
    { type: "C", x1: 5, y1: 27, x2: 16, y2: 14, x: 29, y: 14 },
    { type: "C", x1: 48, y1: 14, x2: 71, y2: 14.5, x: 91, y: 13.5 },
    { type: "C", x1: 95, y1: 13.2, x2: 97, y2: 10, x: 97.5, y: 7.5 },
    { type: "L", x: 99, y: 7.5 },
    { type: "C", x1: 98.5, y1: 18, x2: 94, y2: 24, x: 86, y: 24.5 },
    { type: "L", x: 72.5, y: 24.5 },
    { type: "C", x1: 70.5, y1: 35, x2: 68.5, y2: 49, x: 67.5, y: 64 },
    { type: "C", x1: 66.3, y1: 82, x2: 68.8, y2: 94, x: 76.5, y: 97 },
    { type: "C", x1: 83, y1: 99.5, x2: 89.5, y2: 92, x: 93.5, y: 82 },
    { type: "L", x: 96, y: 82 },
    { type: "C", x1: 91.5, y1: 101, x2: 82.5, y2: 110.5, x: 72.5, y: 108.5 },
    { type: "C", x1: 59, y1: 106, x2: 56, y2: 96.5, x: 57.2, y: 80 },
    { type: "C", x1: 58.5, y1: 61, x2: 61.5, y2: 40, x: 63.8, y: 24.5 },
    { type: "L", x: 39.5, y: 24.5 },
    { type: "C", x1: 38.5, y1: 37, x2: 36.8, y2: 55, x: 34, y: 72 },
    { type: "C", x1: 31.2, y1: 90.5, x2: 26, y2: 102.5, x: 17.5, y: 108 },
    { type: "C", x1: 13, y1: 110.5, x2: 8, y2: 109.5, x: 5, y: 108 },
    { type: "C", x1: 16, y1: 93, x2: 21, y2: 77, x: 23.5, y: 60 },
    { type: "C", x1: 25.5, y1: 46, x2: 27.5, y2: 33, x: 28.5, y: 24.5 },
    { type: "C", x1: 18, y1: 24.5, x2: 8, y2: 31, x: 3, y: 42 },
    { type: "Z" },
  ],
};

const compactPiOutline: FilledPath = {
  commands: [
    { type: "M", x: 3, y: 40 },
    { type: "C", x1: 7, y1: 26, x2: 17, y2: 15, x: 30, y: 15 },
    { type: "C", x1: 50, y1: 15, x2: 72, y2: 15, x: 91, y: 14 },
    { type: "C", x1: 96, y1: 14, x2: 98, y2: 10, x: 99, y: 8 },
    { type: "C", x1: 99, y1: 19, x2: 94, y2: 24, x: 86, y: 25 },
    { type: "L", x: 72, y: 25 },
    { type: "C", x1: 69, y1: 45, x2: 65, y2: 76, x: 67, y: 88 },
    { type: "C", x1: 69, y1: 101, x2: 83, y2: 102, x: 96, y: 82 },
    { type: "C", x1: 93, y1: 101, x2: 83, y2: 109, x: 73, y: 108 },
    { type: "C", x1: 59, y1: 106, x2: 55, y2: 96, x: 57, y: 80 },
    { type: "L", x: 64, y: 25 },
    { type: "L", x: 40, y: 25 },
    { type: "C", x1: 38, y1: 48, x2: 35, y2: 78, x: 29, y: 94 },
    { type: "C", x1: 24, y1: 106, x2: 14, y2: 110, x: 5, y: 108 },
    { type: "C", x1: 18, y1: 91, x2: 24, y2: 61, x: 29, y: 25 },
    { type: "C", x1: 17, y1: 25, x2: 9, y2: 31, x: 4, y: 42 },
    { type: "Z" },
  ],
};

function shiftCommandX(command: PathCommand, offset: number): PathCommand {
  if (command.type === "Z") return command;
  if (command.type === "C") {
    return {
      ...command,
      x1: command.x1 + offset,
      x2: command.x2 + offset,
      x: command.x + offset,
    };
  }
  return { ...command, x: command.x + offset };
}

function tightenPiLegs(path: FilledPath, rightRange: readonly [number, number], leftRange: readonly [number, number], inset: number): FilledPath {
  return {
    commands: path.commands.map((command, index) => {
      if (index >= rightRange[0] && index <= rightRange[1]) return shiftCommandX(command, -inset);
      if (index >= leftRange[0] && index <= leftRange[1]) return shiftCommandX(command, inset);
      return command;
    }),
  };
}

function compressPathHeight(path: FilledPath, top: number, scale: number): FilledPath {
  const mapY = (y: number) => top + (y - top) * scale;
  return {
    commands: path.commands.map((command) => {
      if (command.type === "Z") return command;
      if (command.type === "C") return { ...command, y1: mapY(command.y1), y2: mapY(command.y2), y: mapY(command.y) };
      return { ...command, y: mapY(command.y) };
    }),
  };
}

export const CANONICAL_T_CONTOURS: FilledPath[] = [
  {
    commands: [
      { type: "M", x: 2, y: 30.2 },
      { type: "C", x1: 5, y1: 21, x2: 16, y2: 13.415, x: 29, y: 13.415 },
      { type: "C", x1: 48, y1: 13.415, x2: 71, y2: 13.87, x: 91, y: 12.96 },
      { type: "C", x1: 95, y1: 12.687, x2: 97, y2: 10.1, x: 97.5, y: 8.25 },
      { type: "L", x: 99, y: 8.25 },
      { type: "C", x1: 98.5, y1: 13.3, x2: 94, y2: 18.05, x: 86, y: 18.63 },
      { type: "L", x: 64.51, y: 18.63 },
      { type: "L", x: 60.79, y: 18.63 },
      { type: "L", x: 41.36, y: 18.63 },
      { type: "L", x: 37.64, y: 18.63 },
      { type: "C", x1: 18, y1: 18.63, x2: 8, y2: 21, x: 3, y: 29.8 },
      { type: "Z" },
    ],
  },
  {
    commands: [
      { type: "M", x: 37.64, y: 18.63 },
      { type: "C", x1: 36.99, y1: 27, x2: 35.07, y2: 42.535, x: 33.37, y: 55.275 },
      { type: "C", x1: 30.57, y1: 70.745, x2: 24.44, y2: 86.22, x: 10.5, y: 101.1864 },
      { type: "L", x: 20.6, y: 101.1864 },
      { type: "C", x1: 26.8, y1: 94.65, x2: 30.33, y2: 83.03, x: 35.13, y: 66.195 },
      { type: "C", x1: 37.93, y1: 50.725, x2: 40.28, y2: 30, x: 41.36, y: 18.63 },
      { type: "Z" },
    ],
  },
  {
    commands: [
      { type: "M", x: 60.79, y: 18.63 },
      { type: "C", x1: 60.18283713, y1: 26.44838958, x2: 58.46755266, y2: 40.51850456, x: 56.85854676, y: 52.72260962 },
      { type: "C", x1: 41.30673423, y1: 138.79746558, x2: 86.80571662, y2: 83.98950826, x: 86.80571662, y: 83.98950826 },
      { type: "C", x1: 46.75198157, y1: 120.82021715, x2: 60.45031492, y2: 52.68602707, x: 60.45031492, y: 52.68602707 },
      { type: "C", x1: 62.26545535, y1: 40.13351436, x2: 63.72403346, y2: 26.90448112, x: 64.51, y: 18.63 },
      { type: "Z" },
    ],
  },
];

const canonicalTPath: FilledPath = {
  commands: CANONICAL_T_CONTOURS.flatMap((contour) => contour.commands),
};

export const PI_GEOMETRY = {
  display: canonicalTPath,
  displayContours: CANONICAL_T_CONTOURS,
  compact: canonicalTPath,
} as const;

export function samplePathOutline(path: FilledPath, count = 192): Point[] {
  const raw: Point[] = [];
  let current = { x: 0, y: 0 };
  let start = { x: 0, y: 0 };
  const push = (point: Point) => {
    const previous = raw.at(-1);
    if (!previous || previous.x !== point.x || previous.y !== point.y) raw.push(point);
  };
  path.commands.forEach((command) => {
    if (command.type === "M") {
      current = { x: command.x, y: command.y };
      start = current;
      push(current);
    } else if (command.type === "L") {
      current = { x: command.x, y: command.y };
      push(current);
    } else if (command.type === "C") {
      const from = current;
      for (let step = 1; step <= 18; step += 1) {
        const t = step / 18;
        const inverse = 1 - t;
        push({
          x: inverse ** 3 * from.x + 3 * inverse ** 2 * t * command.x1 + 3 * inverse * t ** 2 * command.x2 + t ** 3 * command.x,
          y: inverse ** 3 * from.y + 3 * inverse ** 2 * t * command.y1 + 3 * inverse * t ** 2 * command.y2 + t ** 3 * command.y,
        });
      }
      current = { x: command.x, y: command.y };
    } else {
      current = start;
      push(start);
    }
  });
  const lengths = raw.slice(1).map((point, index) => Math.hypot(point.x - raw[index].x, point.y - raw[index].y));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  const sampled: Point[] = [];
  let segment = 0;
  let traversed = 0;
  for (let index = 0; index < count; index += 1) {
    const target = total * (index / Math.max(1, count - 1));
    while (segment < lengths.length - 1 && traversed + lengths[segment] < target) {
      traversed += lengths[segment];
      segment += 1;
    }
    const length = lengths[segment] || 1;
    const progress = Math.min(1, Math.max(0, (target - traversed) / length));
    sampled.push({
      x: raw[segment].x + (raw[segment + 1].x - raw[segment].x) * progress,
      y: raw[segment].y + (raw[segment + 1].y - raw[segment].y) * progress,
    });
  }
  return sampled;
}

function pillarPath(center: number): FilledPath {
  const { serifHalfWidth, stemHalfWidth, topSerifHalfWidth } = H_PILLAR_SHAPE;
  const sourceScale = 0.74;
  return {
    commands: [
      { type: "M", x: center - serifHalfWidth, y: 104 },
      { type: "C", x1: center - 5.2 * sourceScale, y1: 103.7, x2: center - 3.1 * sourceScale, y2: 101.8, x: center - stemHalfWidth, y: 98.5 },
      { type: "L", x: center - stemHalfWidth, y: 23 },
      { type: "C", x1: center - 2.5 * sourceScale, y1: 20.2, x2: center - 4.7 * sourceScale, y2: 18.5, x: center - topSerifHalfWidth, y: 18.2 },
      { type: "L", x: center - topSerifHalfWidth, y: 15 },
      { type: "L", x: center + topSerifHalfWidth, y: 15 },
      { type: "L", x: center + topSerifHalfWidth, y: 18.2 },
      { type: "C", x1: center + 4.7 * sourceScale, y1: 18.5, x2: center + 2.5 * sourceScale, y2: 20.2, x: center + stemHalfWidth, y: 23 },
      { type: "L", x: center + stemHalfWidth, y: 98.5 },
      { type: "C", x1: center + 3.1 * sourceScale, y1: 101.8, x2: center + 5.2 * sourceScale, y2: 103.7, x: center + serifHalfWidth, y: 104 },
      { type: "Z" },
    ],
  };
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

export function findIntersections(anchors: Point[], chords: Segment[]): Point[] {
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

function chordOrientationBin(anchors: Point[], chord: Segment): number {
  const start = anchors[chord.a];
  const end = anchors[chord.b];
  const orientation = (Math.atan2(end.y - start.y, end.x - start.x) + Math.PI) % Math.PI;
  return Math.min(3, Math.floor(orientation / (Math.PI / 4)));
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function pointQuadrant(point: Point): number {
  return (point.x >= 50 ? 1 : 0) + (point.y >= 59 ? 2 : 0);
}

export function selectHighlights(points: Point[], count = 8, balanced = false, sourceAligned = false): Point[] {
  if (points.length <= count) return [...points];
  if (balanced && count === 8) {
    const sourceTargets = sourceAligned ? [
      { x: 43.2, y: 40.5 }, { x: 21.1, y: 49.7 },
      { x: 61.8, y: 57.2 }, { x: 77.1, y: 47.9 },
      { x: 35.7, y: 69.3 }, { x: 43.8, y: 76.2 },
      { x: 56.1, y: 82.2 }, { x: 75.3, y: 69 },
    ] : [];
    const selected: Point[] = [];
    for (const target of sourceTargets) {
      const quadrant = pointQuadrant(target);
      const candidate = points
        .filter((point) => pointQuadrant(point) === quadrant && !selected.includes(point))
        .sort((first, second) => Math.hypot(first.x - target.x, first.y - target.y) - Math.hypot(second.x - target.x, second.y - target.y))[0];
      if (candidate) selected.push(candidate);
    }
    if (sourceAligned && selected.length === count) return selected;
    const pairsByQuadrant = Array.from({ length: 4 }, (_, quadrant) => {
      const quadrantPoints = points.filter((point) => pointQuadrant(point) === quadrant);
      const interior = quadrantPoints.filter((point) => Math.hypot(point.x - 50, point.y - 59) <= 32);
      const candidates = interior.length >= 2 ? interior : quadrantPoints;
      const pairs: Array<[Point, Point]> = [];
      for (let first = 0; first < candidates.length; first += 1) {
        for (let second = first + 1; second < candidates.length; second += 1) {
          pairs.push([candidates[first], candidates[second]]);
        }
      }
      return pairs
        .sort((a, b) => {
          const pairScore = (pair: [Point, Point]) => {
            const radii = pair.map((point) => Math.hypot(point.x - 50, point.y - 59)).sort((first, second) => first - second);
            return Math.hypot(pair[0].x - pair[1].x, pair[0].y - pair[1].y) - Math.abs(radii[0] - 18) * 1.8 - Math.abs(radii[1] - 28) * 0.8;
          };
          return pairScore(b) - pairScore(a);
        })
        .slice(0, 12);
    });
    let selectedFallback: Point[] = [];
    let bestScore = -Infinity;
    for (const topLeft of pairsByQuadrant[0]) {
      for (const topRight of pairsByQuadrant[1]) {
        for (const bottomLeft of pairsByQuadrant[2]) {
          for (const bottomRight of pairsByQuadrant[3]) {
            const candidate = [...topLeft, ...topRight, ...bottomLeft, ...bottomRight];
            const distances = candidate.flatMap((point, first) => candidate.slice(first + 1).map((other) => Math.hypot(point.x - other.x, point.y - other.y)));
            const minimum = Math.min(...distances);
            const mean = distances.reduce((sum, distance) => sum + distance, 0) / distances.length;
            const radii = candidate.map((point) => Math.hypot(point.x - 50, point.y - 59)).sort((a, b) => a - b);
            const radialPenalty = radii.reduce((sum, radius, index) => sum + Math.abs(radius - (index < 4 ? 18 : 28)), 0);
            const angles = candidate.map((point) => (Math.atan2(point.y - 59, point.x - 50) + Math.PI * 2) % (Math.PI * 2)).sort((a, b) => a - b);
            const minimumAngularGap = Math.min(...angles.map((angle, index) => (angles[(index + 1) % angles.length] - angle + Math.PI * 2) % (Math.PI * 2)));
            const score = minimum * 3 + mean - radialPenalty * 6 + minimumAngularGap * 120;
            if (score > bestScore) {
              bestScore = score;
              selectedFallback = candidate;
            }
          }
        }
      }
    }
    return selectedFallback;
  }
  const selected: Point[] = [];
  for (let quadrant = 0; quadrant < 4; quadrant += 1) {
    const candidates = points.filter((point) => pointQuadrant(point) === quadrant);
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

function displayNetworkScore(anchors: Point[], chords: Segment[]): number {
  const degrees = Array.from({ length: anchors.length }, () => 0);
  const orientationCounts = [0, 0, 0, 0];
  let centralChordCount = 0;
  chords.forEach((chord) => {
    degrees[chord.a] += 1;
    degrees[chord.b] += 1;
    orientationCounts[chordOrientationBin(anchors, chord)] += 1;
    if (distanceToSegment({ x: 50, y: 59 }, anchors[chord.a], anchors[chord.b]) <= 24) centralChordCount += 1;
  });
  const degreePenalty = Math.max(0, 1 - Math.min(...degrees)) * 50 + Math.max(0, Math.max(...degrees) - 5) * 50;
  const intersections = findIntersections(anchors, chords);
  const quadrantCounts = Array.from({ length: 4 }, (_, quadrant) => intersections.filter((point) => pointQuadrant(point) === quadrant).length);
  const centroid = intersections.reduce((sum, point) => ({ x: sum.x + point.x, y: sum.y + point.y }), { x: 0, y: 0 });
  centroid.x /= intersections.length;
  centroid.y /= intersections.length;
  const centroidDistance = Math.hypot(centroid.x - 50, centroid.y - 59);
  const degreeMean = chords.length * 2 / anchors.length;
  const degreeVariance = degrees.reduce((sum, degree) => sum + (degree - degreeMean) ** 2, 0) / degrees.length;
  return degreePenalty
    + Math.max(0, 32 - intersections.length) * 20
    + Math.max(0, intersections.length - 60) * 20
    + Math.max(0, 5 - Math.min(...quadrantCounts)) * 25
    + Math.abs(intersections.length - 40) * 1.4
    + (Math.max(...quadrantCounts) - Math.min(...quadrantCounts)) * 2.1
    + centroidDistance * 2.4
    + (Math.max(...orientationCounts) - Math.min(...orientationCounts)) * 20
    + degreeVariance * 2.2
    + Math.max(0, 11 - centralChordCount) * 40;
}

function generateDisplayNetwork(seed: string): ChordNetwork {
  const seedFactory = xmur3(`${seed}:display`);
  const random = mulberry32(seedFactory());
  const center = { x: 50, y: 59 };
  const anchorCount = 12;
  const chordCount = 19;
  const radius = O_RADIUS;
  const slice = (Math.PI * 2) / anchorCount;
  const calibrated = seed === oCalibration.seed
    ? { anchorAngles: oCalibration.anchorAngles, chords: oCalibration.chords }
    : oCalibration.alternates.find((alternate) => alternate.seed === seed);
  if (calibrated) {
    const anchors = calibrated.anchorAngles.map((angle) => {
      return { x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) };
    });
    const chords = calibrated.chords.map((chord) => ({ a: chord.a, b: chord.b, weight: "weight" in chord ? chord.weight : undefined }));
    const intersections = findIntersections(anchors, chords);
    return { seed, profile: "display", anchors, chords, intersections, highlights: selectHighlights(intersections, 8, true, seed === oCalibration.seed) };
  }
  let best: ChordNetwork | null = null;
  let bestScore = Number.POSITIVE_INFINITY;

  for (let attempt = 0; attempt < 160; attempt += 1) {
    const offset = random() * Math.PI * 2;
    const angles = Array.from({ length: anchorCount }, (_, index) => {
      const jitter = (random() - 0.5) * slice * 0.44;
      return (offset + index * slice + jitter + Math.PI * 2) % (Math.PI * 2);
    }).sort((a, b) => a - b);
    const anchors = angles.map((angle) => ({ x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) }));
    const pairs: Segment[] = [];
    for (let a = 0; a < anchorCount; a += 1) {
      for (let b = a + 1; b < anchorCount; b += 1) {
        if (angularDistance(angles[a], angles[b]) >= Math.PI / 4) pairs.push({ a, b });
      }
    }
    const degrees = Array.from({ length: anchorCount }, () => 0);
    const orientationCounts = [0, 0, 0, 0];
    const chords: Segment[] = [];
    let remaining = shuffled(pairs, random);
    while (chords.length < chordCount) {
      const desiredIntersections = Math.round(((chords.length + 1) / chordCount) ** 2 * 42);
      const candidates = remaining
        .filter((pair) => degrees[pair.a] < 5 && degrees[pair.b] < 5)
        .map((pair) => ({
          pair,
          score: (degrees[pair.a] ** 2 + degrees[pair.b] ** 2) * 0.72
            + orientationCounts[chordOrientationBin(anchors, pair)] * 0.9
            + Math.abs(findIntersections(anchors, [...chords, pair]).length - desiredIntersections) * 0.35
            + (distanceToSegment(center, anchors[pair.a], anchors[pair.b]) <= 24 ? 0 : 1.8),
        }))
        .sort((a, b) => a.score - b.score);
      if (!candidates.length) break;
      const chosen = candidates[Math.floor(random() * Math.min(7, candidates.length))].pair;
      chords.push(chosen);
      degrees[chosen.a] += 1;
      degrees[chosen.b] += 1;
      orientationCounts[chordOrientationBin(anchors, chosen)] += 1;
      remaining = remaining.filter((pair) => pair !== chosen);
    }
    if (chords.length !== chordCount || Math.min(...degrees) < 1) continue;
    const intersections = findIntersections(anchors, chords);
    const quadrantCounts = Array.from({ length: 4 }, (_, quadrant) => intersections.filter((point) => pointQuadrant(point) === quadrant).length);
    if (intersections.length < 32 || intersections.length > 60 || Math.min(...quadrantCounts) < 4) continue;
    const centroid = intersections.reduce((sum, point) => ({ x: sum.x + point.x, y: sum.y + point.y }), { x: 0, y: 0 });
    centroid.x /= intersections.length;
    centroid.y /= intersections.length;
    if (Math.max(...quadrantCounts) - Math.min(...quadrantCounts) > 10 || Math.hypot(centroid.x - 50, centroid.y - 59) > 5) continue;
    const score = displayNetworkScore(anchors, chords);
    if (score < bestScore) {
      bestScore = score;
      best = { seed, profile: "display", anchors, chords, intersections, highlights: [] };
    }
  }
  if (!best) throw new Error(`Unable to produce a balanced display chord network for ${seed}`);
  best.highlights = selectHighlights(best.intersections, 8, true);
  return best;
}

const networkSpecs = {
  display: { anchors: 12, chords: 19, intersections: [16, 24] as const, quadrants: 4, centroidRadius: 8, minDegree: 1, maxDegree: 5, centralChords: 11 },
  compact: { anchors: 10, chords: 13, intersections: [8, 14] as const, quadrants: 3, centroidRadius: 12, minDegree: 1, maxDegree: 4, centralChords: 0 },
};

export function generateChordNetwork(seed: string, profile: NetworkProfile = "display"): ChordNetwork {
  if (profile === "display") return generateDisplayNetwork(seed);
  const spec = networkSpecs[profile];
  const seedFactory = xmur3(`${seed}:${profile}`);
  const random = mulberry32(seedFactory());
  const radius = O_RADIUS;
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
    return { x: 50 + Math.cos(angle) * O_RADIUS, y: 59 + Math.sin(angle) * O_RADIUS };
  });
}

const adjustMVertical = (y: number) => M_SPATIAL_ADJUSTMENT.centerY
  + (y - M_SPATIAL_ADJUSTMENT.centerY) * M_SPATIAL_ADJUSTMENT.scaleY
  + M_SPATIAL_ADJUSTMENT.offsetY;

export const M_SPLINE_CONTROLS: Point[] = mCalibration.controls.map((point) => ({
  x: point.x,
  y: adjustMVertical(point.y),
}));

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
  const preferredOrder = [2, 5, 4, 12, 9, 6, 10, 8, 3, 11, 7, 1];
  const harmonicOrder = [
    ...preferredOrder.filter((harmonic) => harmonic <= displayHarmonicCount),
    ...Array.from({ length: displayHarmonicCount }, (_, index) => index + 1).filter((harmonic) => !preferredOrder.includes(harmonic)),
  ];
  const partialSums = Array.from({ length: displayHarmonicCount }, (_, term) =>
    Array.from({ length: sampleCount }, (_, index) => ({ x: xFor(index), y: seriesAt(index / (sampleCount - 1), harmonicOrder.slice(0, term + 1)) })),
  );
  const baseline = coefficients[0].a / 2;
  const components = harmonicOrder.map((harmonic) => {
    const coefficient = coefficients[harmonic];
    return Array.from({ length: sampleCount }, (_, index) => {
      const angle = Math.PI * 2 * coefficient.n * (index / (sampleCount - 1));
      return { x: xFor(index), y: baseline + coefficient.a * Math.cos(angle) + coefficient.b * Math.sin(angle) };
    });
  });
  const componentEnergies = harmonicOrder.map((harmonic) => Math.hypot(coefficients[harmonic].a, coefficients[harmonic].b));
  const maxComponentEnergy = Math.max(...componentEnergies);
  const componentWidths = componentEnergies.map((energy, index) => {
    const energyWeight = Math.log1p(energy) / Math.log1p(maxComponentEnergy);
    return Number((0.38 + energyWeight * 0.82 + index * 0.003).toFixed(3));
  });
  const restingLayers = Array.from({ length: displayHarmonicCount - 1 }, (_, index) => {
    const progress = index / Math.max(1, displayHarmonicCount - 2);
    const width = Number(((0.72 - progress * 0.2 + (componentWidths[index] - 0.38) * 0.02) * SOURCE_ENERGY_SCALE.m).toFixed(3));
    return {
      partialIndex: index,
      amplitudeScale: 1,
      width,
      opacity: Number((0.5 - progress * 0.28).toFixed(3)),
      haloWidth: Number(((2.8 + (componentWidths[index] - 0.38) * 0.35) * SOURCE_ENERGY_SCALE.m).toFixed(3)),
      haloOpacity: 0.045,
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
    componentWidths,
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

function fourierValueAndDerivative(data: FourierData, harmonics: number[], progress: number, amplitudeScale: number) {
  const baseline = data.coefficients[0].a / 2;
  let value = baseline;
  let derivative = 0;
  for (const harmonic of harmonics) {
    const coefficient = data.coefficients[harmonic];
    if (!coefficient) throw new Error(`Missing Fourier coefficient ${harmonic}`);
    const angle = Math.PI * 2 * harmonic * progress;
    value += amplitudeScale * (coefficient.a * Math.cos(angle) + coefficient.b * Math.sin(angle));
    derivative += amplitudeScale * Math.PI * 2 * harmonic * (-coefficient.a * Math.sin(angle) + coefficient.b * Math.cos(angle));
  }
  return { value, derivative };
}

export function fourierBezierChain(data: FourierData, harmonics: number[], segmentCount = 64, amplitudeScale = 1): CubicBezierSegment[] {
  if (!Number.isInteger(segmentCount) || segmentCount < 1) throw new Error("Fourier Bézier segment count must be a positive integer");
  const xStart = 2;
  const xSpan = 96;
  const step = 1 / segmentCount;
  return Array.from({ length: segmentCount }, (_, index) => {
    const startProgress = index * step;
    const endProgress = (index + 1) * step;
    const startSeries = fourierValueAndDerivative(data, harmonics, startProgress, amplitudeScale);
    const endSeries = fourierValueAndDerivative(data, harmonics, endProgress, amplitudeScale);
    const start = { x: xStart + xSpan * startProgress, y: startSeries.value };
    const end = { x: xStart + xSpan * endProgress, y: endSeries.value };
    const handleProgress = step / 3;
    return {
      start,
      control1: { x: start.x + xSpan * handleProgress, y: start.y + startSeries.derivative * handleProgress },
      control2: { x: end.x - xSpan * handleProgress, y: end.y - endSeries.derivative * handleProgress },
      end,
    };
  });
}

export function fourierPartialBezier(data: FourierData, partialIndex: number, segmentCount = 64, amplitudeScale = 1): CubicBezierSegment[] {
  if (!Number.isInteger(partialIndex) || partialIndex < 0 || partialIndex >= data.displayHarmonicCount) {
    throw new Error(`Fourier partial index ${partialIndex} is out of range`);
  }
  return fourierBezierChain(data, data.harmonicOrder.slice(0, partialIndex + 1), segmentCount, amplitudeScale);
}

export function fourierComponentBezier(data: FourierData, componentIndex: number, segmentCount = 64): CubicBezierSegment[] {
  if (!Number.isInteger(componentIndex) || componentIndex < 0 || componentIndex >= data.displayHarmonicCount) {
    throw new Error(`Fourier component index ${componentIndex} is out of range`);
  }
  return fourierBezierChain(data, [data.harmonicOrder[componentIndex]], segmentCount);
}

export function fourierCompactBezier(data: FourierData, segmentCount = 64): CubicBezierSegment[] {
  return fourierBezierChain(data, Array.from({ length: data.compactHarmonicCount }, (_, index) => index + 1), segmentCount);
}

export function sampleBezierChain(chain: CubicBezierSegment[], subdivisions = 4): Point[] {
  if (!Number.isInteger(subdivisions) || subdivisions < 1) throw new Error("Bézier subdivisions must be a positive integer");
  if (!chain.length) return [];
  const points: Point[] = [chain[0].start];
  chain.forEach((segment) => {
    for (let index = 1; index <= subdivisions; index += 1) {
      const progress = index / subdivisions;
      const inverse = 1 - progress;
      points.push({
        x: inverse ** 3 * segment.start.x + 3 * inverse ** 2 * progress * segment.control1.x + 3 * inverse * progress ** 2 * segment.control2.x + progress ** 3 * segment.end.x,
        y: inverse ** 3 * segment.start.y + 3 * inverse ** 2 * progress * segment.control1.y + 3 * inverse * progress ** 2 * segment.control2.y + progress ** 3 * segment.end.y,
      });
    }
  });
  return points;
}

export function createHData(): HData {
  const { y, startX, splitX, endX, totalLength, aLength, bLength, tickTop, tickBottom } = H_PROPORTION;
  return {
    paths: H_PILLAR_CENTERS.map((center) => pillarPath(center)),
    proportion: {
      ratio: GOLDEN_RATIO,
      totalLength,
      aLength,
      bLength,
      a: [{ x: startX, y }, { x: splitX, y }],
      b: [{ x: splitX, y }, { x: endX, y }],
      ratioPoint: { x: splitX, y },
      ticks: [startX, splitX, endX].map((x) => [{ x, y: tickTop }, { x, y: tickBottom }]),
      brace: hUnitBrace(startX, endX),
    },
  };
}

export function createBrandData(): BrandData {
  return {
    master: MASTER,
    placements: GLYPH_PLACEMENTS,
    pi: PI_GEOMETRY,
    h: createHData(),
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
