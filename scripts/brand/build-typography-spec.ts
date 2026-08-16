import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import { chromium } from "playwright";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { brandData } from "../../src/brand/thom/brandData";
import { H_ANIMATION, H_SPIRAL, OPTICAL_PLACEMENT_X } from "../../src/brand/thom/geometry";
import { OPTICAL_PROFILE_WIDTHS } from "../../src/brand/thom/opticalProfile";

type Point = { x: number; y: number };
type Bounds = { left: number; top: number; right: number; bottom: number; width: number; height: number };
type Segment =
  | { kind: "line"; p0: Point; p3: Point }
  | { kind: "cubic"; p0: Point; p1: Point; p2: Point; p3: Point };
type InkSpan = { start: number; end: number; span: number };
type Measurement = { spans: InkSpan[] } | null;
type TSegment = "top-bar" | "left-pillar" | "right-pillar";

const repo = resolve(import.meta.dir, "../..");
const audit = resolve(repo, ".codex/audits/logo-balance/final-review");
const out = resolve(repo, "docs/brand/typography");
const figures = resolve(out, "figures");
const sourceTsPath = resolve(audit, "compose-alignment-mockup.ts");
const sourceSvgPath = resolve(audit, "14-alignment-mockup-perimeter-refined.svg");
const currentWholeLogoPath = resolve(audit, "45-current-whole-logo.svg");
const glyphExportDirectory = resolve(audit, "vector-exports");

const MASTER = { width: 460, height: 120 } as const;
const AUDIT_BOARD = { width: 460, height: 152, annotationHeight: 32 } as const;
const VERTICAL = {
  capLine: 15,
  constructionAxis: 60,
  baseline: 104,
  lowerOvershootClearance: 112,
  capHeight: 89,
} as const;
const REFERENCE_EXPORT = { widthPx: 2300, heightPx: 600, pixelsPerUnit: 5 } as const;
const T_GRID = { left: 20, right: 106, count: 15 } as const;
const T_TRANSFORM = { translateX: 22, translateY: -0.222, scaleX: 0.86, scaleY: 1.03 } as const;
const DESIGN_FRAMES = {
  T: { left: 20, right: 106 },
  H: { left: 113.5, right: 182.5 },
  O: { left: 187.875, right: 264.875 },
  M: { left: 275, right: 396 },
} as const;
const PLACEMENT_X = { T: 22, H: 98.475, O: 182.5, M: 274.6 } as const;
const COLORS = {
  purple: "#c5b6f4",
  purpleDeep: "#4b416a",
  purpleSoft: "#eeeaff",
  ink: "#17131b",
  gold: "#c6902e",
  goldSoft: "#f8df9e",
  cyan: "#0c91b7",
  magenta: "#a81962",
  white: "#fffdf9",
} as const;

const round = (value: number, digits = 4) => Number(value.toFixed(digits));
const bounds = (left: number, top: number, right: number, bottom: number): Bounds => ({
  left: round(left),
  top: round(top),
  right: round(right),
  bottom: round(bottom),
  width: round(right - left),
  height: round(bottom - top),
});
const addPlacement = (box: Bounds, x: number) => bounds(box.left + x, box.top, box.right + x, box.bottom);
const xml = (text: string) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

await mkdir(figures, { recursive: true });

const sourceTs = await readFile(sourceTsPath, "utf8");
const sourceSvg = await readFile(sourceSvgPath, "utf8");
const glyphs = sourceSvg.match(/<g fill="#000000">([\s\S]*?)\n<\/g>\n  <g font-family=/)?.[1];
if (!glyphs) throw new Error("Could not extract the refined glyph layer from the audit SVG.");

const tracedT = sourceTs.match(/const tracedTGroups = `([\s\S]*?)`;/)?.[1];
if (!tracedT) throw new Error("Could not extract the current T contours.");

const canonicalSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="460" height="120" viewBox="0 0 460 120" role="img" aria-labelledby="title desc" data-canonical-geometry="thom-typography-v1">
  <title id="title">THOM canonical typography master</title>
  <desc id="desc">Canonical 460 by 120 master artwork for the refined THOM wordmark. Geometry and placement are authoritative; color and motion remain defined by the production implementation.</desc>
  <g id="thom-canonical" fill="#000000">${glyphs}
  </g>
</svg>
`;
const canonicalPath = resolve(out, "thom-canonical.svg");
await writeFile(canonicalPath, canonicalSvg);
new Resvg(canonicalSvg).render();
if (canonicalSvg.includes("<rect")) throw new Error("Canonical SVG must remain transparent.");

const contourPath = (segment: TSegment) => {
  const path = sourceTs.match(new RegExp(`data-t-segment="${segment}"[\\s\\S]*?<path d="([^"]+)"`))?.[1];
  if (!path) throw new Error(`Could not find the ${segment} contour.`);
  return path;
};

const parsePath = (path: string): Segment[] => {
  const tokens = path.match(/[MCLZ]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? [];
  let tokenIndex = 0;
  let command = "";
  let current: Point = { x: 0, y: 0 };
  let start: Point = { x: 0, y: 0 };
  const nextNumber = () => Number(tokens[tokenIndex++]);
  const segments: Segment[] = [];
  while (tokenIndex < tokens.length) {
    if (/^[MCLZ]$/i.test(tokens[tokenIndex])) command = tokens[tokenIndex++].toUpperCase();
    if (command === "M") {
      current = { x: nextNumber(), y: nextNumber() };
      start = { ...current };
    } else if (command === "L") {
      const p3 = { x: nextNumber(), y: nextNumber() };
      segments.push({ kind: "line", p0: { ...current }, p3 });
      current = p3;
    } else if (command === "C") {
      const p1 = { x: nextNumber(), y: nextNumber() };
      const p2 = { x: nextNumber(), y: nextNumber() };
      const p3 = { x: nextNumber(), y: nextNumber() };
      segments.push({ kind: "cubic", p0: { ...current }, p1, p2, p3 });
      current = p3;
    } else if (command === "Z") {
      segments.push({ kind: "line", p0: { ...current }, p3: { ...start } });
      current = { ...start };
    } else {
      throw new Error(`Unsupported path command: ${command}`);
    }
    command = "";
  }
  return segments;
};

const cubicPoint = (p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point => {
  const u = 1 - t;
  return {
    x: u ** 3 * p0.x + 3 * u ** 2 * t * p1.x + 3 * u * t ** 2 * p2.x + t ** 3 * p3.x,
    y: u ** 3 * p0.y + 3 * u ** 2 * t * p1.y + 3 * u * t ** 2 * p2.y + t ** 3 * p3.y,
  };
};
const pointAt = (segment: Segment, t: number): Point => segment.kind === "line"
  ? {
      x: segment.p0.x + (segment.p3.x - segment.p0.x) * t,
      y: segment.p0.y + (segment.p3.y - segment.p0.y) * t,
    }
  : cubicPoint(segment.p0, segment.p1, segment.p2, segment.p3, t);

const intersections = (segments: Segment[], axis: "x" | "y", coordinate: number) => {
  const hits: number[] = [];
  const other = axis === "x" ? "y" : "x";
  for (const segment of segments) {
    let previous = pointAt(segment, 0);
    for (let sample = 1; sample <= 768; sample += 1) {
      const nextT = sample / 768;
      const next = pointAt(segment, nextT);
      if ((previous[axis] - coordinate) * (next[axis] - coordinate) <= 0 && previous[axis] !== next[axis]) {
        let low = (sample - 1) / 768;
        let high = nextT;
        for (let iteration = 0; iteration < 40; iteration += 1) {
          const middle = (low + high) / 2;
          if ((pointAt(segment, low)[axis] - coordinate) * (pointAt(segment, middle)[axis] - coordinate) <= 0) high = middle;
          else low = middle;
        }
        hits.push(pointAt(segment, (low + high) / 2)[other]);
      }
      previous = next;
    }
  }
  return [...new Set(hits.map((value) => value.toFixed(6)))].map(Number).sort((a, b) => a - b);
};

const spanPairs = (hits: number[]): Measurement => {
  if (hits.length < 2) return null;
  return {
    spans: Array.from({ length: Math.floor(hits.length / 2) }, (_, index) => {
      const start = hits[index * 2];
      const end = hits[index * 2 + 1];
      return { start: round(start, 3), end: round(end, 3), span: round(end - start, 3) };
    }),
  };
};

const tContours = {
  roof: parsePath(contourPath("top-bar")),
  left: parsePath(contourPath("left-pillar")),
  right: parsePath(contourPath("right-pillar")),
};
const rowSpacing = (VERTICAL.baseline - VERTICAL.capLine) / (T_GRID.count - 1);
const columnSpacing = (T_GRID.right - T_GRID.left) / (T_GRID.count - 1);
const gridColumns = Array.from({ length: T_GRID.count }, (_, index) => String.fromCharCode(65 + index));
const gridRows = Array.from({ length: T_GRID.count }, (_, index) => String(index + 1).padStart(2, "0"));

const measureHorizontal = (segments: Segment[], guideY: number): Measurement => {
  const rawY = (guideY - T_TRANSFORM.translateY) / T_TRANSFORM.scaleY;
  return spanPairs(intersections(segments, "y", rawY).map((x) => T_TRANSFORM.translateX + x * T_TRANSFORM.scaleX));
};
const measureVertical = (segments: Segment[], guideX: number): Measurement => {
  const rawX = (guideX - T_TRANSFORM.translateX) / T_TRANSFORM.scaleX;
  return spanPairs(intersections(segments, "x", rawX).map((y) => T_TRANSFORM.translateY + y * T_TRANSFORM.scaleY));
};

const tRows = Array.from({ length: T_GRID.count }, (_, index) => {
  const y = round(VERTICAL.capLine + index * rowSpacing, 4);
  return {
    index: index + 1,
    row: gridRows[index],
    y,
    leftPillar: measureHorizontal(tContours.left, y),
    rightPillar: measureHorizontal(tContours.right, y),
  };
});
const tColumns = Array.from({ length: T_GRID.count }, (_, index) => {
  const x = round(T_GRID.left + index * columnSpacing, 4);
  return {
    index: index + 1,
    column: gridColumns[index],
    x,
    topBar: measureVertical(tContours.roof, x),
    leftPillar: measureVertical(tContours.left, x),
    rightPillar: measureVertical(tContours.right, x),
  };
});

const renderScale = 20;
const rasterInkBounds = async (path: string): Promise<Bounds> => {
  const svg = await readFile(path, "utf8");
  const png = PNG.sync.read(new Resvg(svg, { fitTo: { mode: "width", value: 100 * renderScale } }).render().asPng());
  let minX = png.width;
  let minY = png.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < png.height; y += 1) {
    for (let x = 0; x < png.width; x += 1) {
      if (png.data[(y * png.width + x) * 4 + 3] < 128) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  if (maxX < 0) throw new Error(`No visible ink found in ${path}`);
  return bounds(minX / renderScale, minY / renderScale, (maxX + 1) / renderScale, (maxY + 1) / renderScale);
};

const browser = await chromium.launch({ headless: true });
const geometricBounds: Record<string, Bounds> = {};
const visibleLocalBounds: Record<string, Bounds> = {};
try {
  const page = await browser.newPage({ viewport: { width: 1000, height: 1200 }, deviceScaleFactor: 1 });
  for (const glyph of ["T", "H", "O", "M"] as const) {
    const path = resolve(glyphExportDirectory, `${glyph}-current-audit.svg`);
    const svg = await readFile(path, "utf8");
    await page.setContent(svg, { waitUntil: "load" });
    const box = await page.evaluate(() => {
      const graphic = document.querySelector("svg > g") as SVGGraphicsElement | null;
      if (!graphic) throw new Error("Glyph group not found.");
      const value = graphic.getBBox();
      return { left: value.x, top: value.y, right: value.x + value.width, bottom: value.y + value.height };
    });
    geometricBounds[glyph] = bounds(box.left, box.top, box.right, box.bottom);
    visibleLocalBounds[glyph] = await rasterInkBounds(path);
  }
} finally {
  await browser.close();
}

const oCircleLocal = (() => {
  const points = brandData.o.circle;
  const xs = points.map(({ x }) => x * 0.88);
  const ys = points.map(({ y }) => -8.4 + y * 1.14);
  return bounds(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys));
})();

const glyphMetrics = Object.fromEntries((["T", "H", "O", "M"] as const).map((glyph) => {
  const frame = DESIGN_FRAMES[glyph];
  const geometricLocal = geometricBounds[glyph];
  const visibleLocal = visibleLocalBounds[glyph];
  const geometricMaster = addPlacement(geometricLocal, PLACEMENT_X[glyph]);
  const visibleMaster = addPlacement(visibleLocal, PLACEMENT_X[glyph]);
  return [glyph, {
    designFrame: { ...frame, width: round(frame.right - frame.left) },
    geometricBounds: { local: geometricLocal, master: geometricMaster },
    visibleInkBounds: { local: visibleLocal, master: visibleMaster },
    sidebearingsFromVisibleInk: {
      left: round(visibleMaster.left - frame.left),
      right: round(frame.right - visibleMaster.right),
    },
    capOvershoot: {
      geometric: round(Math.max(0, VERTICAL.capLine - geometricMaster.top)),
      visibleInk: round(Math.max(0, VERTICAL.capLine - visibleMaster.top)),
    },
    baselineOvershoot: {
      geometric: round(Math.max(0, geometricMaster.bottom - VERTICAL.baseline)),
      visibleInk: round(Math.max(0, visibleMaster.bottom - VERTICAL.baseline)),
    },
  }];
}));

const visibleGaps = {
  T_H: round(glyphMetrics.H.visibleInkBounds.master.left - glyphMetrics.T.visibleInkBounds.master.right),
  H_O: round(glyphMetrics.O.visibleInkBounds.master.left - glyphMetrics.H.visibleInkBounds.master.right),
  O_M: round(glyphMetrics.M.visibleInkBounds.master.left - glyphMetrics.O.visibleInkBounds.master.right),
};

const auditMetrics = JSON.parse(await readFile(resolve(audit, "14-alignment-mockup-master-metrics.json"), "utf8"));
const metrics = {
  schema: "https://th-m.codes/schemas/thom-typography-metrics.v1.json",
  schemaVersion: "1.1.0",
  status: "canonical-geometry",
  generatedFrom: {
    editableSource: ".codex/audits/logo-balance/final-review/compose-alignment-mockup.ts",
    refinedRender: ".codex/audits/logo-balance/final-review/14-alignment-mockup-perimeter-refined.svg",
    canonicalSvg: "docs/brand/typography/thom-canonical.svg",
  },
  authority: {
    geometryAndPlacement: "docs/brand/typography/thom-canonical.svg",
    metrics: "docs/brand/typography/thom-typography-metrics.json",
    colorMaterialsAndMotion: [
      "src/brand/thom/geometry.ts",
      "src/brand/thom/threeScene.ts",
      "src/brand/thom/generated/brand-data.json",
    ],
  },
  units: {
    name: "master unit",
    abbreviation: "u",
    note: "SVG user units on the canonical 460 × 120 artboard.",
  },
  artboard: { ...MASTER, viewBox: [0, 0, MASTER.width, MASTER.height] },
  auditBoard: AUDIT_BOARD,
  verticalMetrics: VERTICAL,
  referenceExport: REFERENCE_EXPORT,
  measurementMethods: {
    geometricBounds: "Browser SVGGraphicsElement.getBBox(); strokes excluded where SVG geometry permits.",
    visibleInkBounds: {
      method: "Resvg alpha raster at 20 px/u; inclusive bounds at alpha >= 0.5.",
      precisionUnits: 1 / renderScale,
      warning: "Visible-ink bounds are render-verified measurements, not replacements for vector construction bounds.",
    },
    tIntersections: "Analytic line/cubic intersections with binary refinement; values rounded to 0.001u.",
  },
  glyphTransforms: {
    T: { translate: [22, -0.222], scale: [0.86, 1.03], contours: ["top-bar", "left-pillar", "right-pillar"] },
    H: { translate: [98.475, 0], pillarCentersLocal: [28, 72], pillarScaleX: 0.74 },
    O: { translate: [182.5, -8.4], scale: [0.88, 1.14] },
    M: { translate: [274.6, -26.7], scale: [1, 1.49] },
  },
  glyphs: glyphMetrics,
  visibleInkGaps: visibleGaps,
  opticalProfiles: {
    selectionMetric: "rendered wordmark width in CSS pixels",
    display: {
      minimumExclusivePx: OPTICAL_PROFILE_WIDTHS.compactMax,
      asset: "public/brand/thom-master.svg",
      detail: "Full luminous construction and canonical placements.",
      placementOffsetX: OPTICAL_PLACEMENT_X.display,
    },
    compact: {
      minimumExclusivePx: OPTICAL_PROFILE_WIDTHS.microMax,
      maximumInclusivePx: OPTICAL_PROFILE_WIDTHS.compactMax,
      asset: "public/brand/thom-compact.svg",
      detail: "Strengthened H pillars, simplified H construction, compact O network, and four-harmonic M.",
      placementOffsetX: OPTICAL_PLACEMENT_X.compact,
    },
    micro: {
      maximumInclusivePx: OPTICAL_PROFILE_WIDTHS.microMax,
      asset: "public/brand/thom-micro.svg",
      detail: "Continuous H crossbar, reduced O network, and strengthened single M contour.",
      placementOffsetX: OPTICAL_PLACEMENT_X.micro,
    },
  },
  perceptualValidation: {
    status: "unvalidated-design-prior",
    hypothesis: "The golden-ratio H split supports the identity narrative and may be preferred, but is not assumed to be universally optimal.",
    experiment: {
      method: "randomized blinded pairwise comparison",
      displayVariants: ["1:1 split", "golden-ratio split", "2:1 split"],
      controls: ["identical H pillars", "identical total crossbar span", "matched stroke energy", "identical wordmark spacing"],
      renderedWidthsPx: [460, 184, 92],
      measures: ["THOM recognition", "perceived balance", "forced-choice preference", "response confidence"],
    },
  },
  hAnimation: {
    trigger: ["page-load intro", "hero H hover/focus/click/tap", "Equilibrium stage hover/focus/click/tap"],
    lifecycle: "Trace once to completion; pointer exit does not cancel; duplicate H triggers are ignored while active; final frame is the unchanged settled H.",
    geometry: {
      kind: "clockwise logarithmic golden spiral",
      center: [brandData.h.proportion.ratioPoint.x, brandData.h.proportion.ratioPoint.y],
      turns: H_SPIRAL.turns,
      radiusGrowthPerQuarterTurn: "phi",
      finalRadius: H_SPIRAL.finalRadius,
      segments: H_SPIRAL.segments,
    },
    timing: H_ANIMATION,
    reducedMotion: "No animated render loop; resolve directly to the settled SVG/WebGL construction.",
  },
  constructionDetails: {
    T: {
      roofTopY: round(T_TRANSFORM.translateY + 8.25 * T_TRANSFORM.scaleY),
      roofCapOvershoot: round(VERTICAL.capLine - (T_TRANSFORM.translateY + 8.25 * T_TRANSFORM.scaleY)),
      grid: {
        addressing: "A01–O15",
        left: T_GRID.left,
        right: T_GRID.right,
        top: VERTICAL.capLine,
        bottom: VERTICAL.baseline,
        rowSpacing: round(rowSpacing, 6),
        columnSpacing: round(columnSpacing, 6),
        rows: tRows,
        columns: tColumns,
      },
    },
    H: {
      stemWidthAtConstructionAxis: round((27.23 - 22.77) * 0.74),
      terminalSerifWidth: round((32.8 - 17.2) * 0.74),
      note: "Stem width and cap/baseline terminal width are intentionally different measures.",
    },
    O: {
      perimeterCenterlineBounds: { local: oCircleLocal, master: addPlacement(oCircleLocal, PLACEMENT_X.O) },
      perimeterWeight: auditMetrics.measurements.oCircumference,
      sharedIntersectionDot: auditMetrics.measurements.sharedIntersectionDot,
    },
    M: auditMetrics.measurements.mTexture,
  },
  threeJs: {
    canonicalCamera: { left: 0, right: 460, top: 120, bottom: 0 },
    pointTransform: { x: "x_svg", y: "120 - y_svg", z: 0 },
    legacyCompatibility: {
      viewport: [416, 120],
      uniformScale: round(416 / 460, 9),
      renderedHeight: round(120 * 416 / 460, 6),
      verticalInset: round((120 - 120 * 416 / 460) / 2, 6),
      warning: "Do not independently scale X and Y.",
    },
  },
} as const;

const metricsPath = resolve(out, "thom-typography-metrics.json");
await writeFile(metricsPath, `${JSON.stringify(metrics, null, 2)}\n`);

const figureShell = (viewBox: string, width: number, height: number, content: string, title: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}" role="img" aria-label="${xml(title)}">
  <rect x="-100" y="-100" width="1000" height="600" fill="${COLORS.purple}"/>
  ${content}
</svg>\n`;

const writeFigure = async (stem: string, svg: string, pngWidth: number) => {
  await writeFile(resolve(figures, `${stem}.svg`), svg);
  await writeFile(resolve(figures, `${stem}.png`), new Resvg(svg, { fitTo: { mode: "width", value: pngWidth } }).render().asPng());
};

const measureFigure = figureShell("-64 0 534 120", 1602, 360, `
  <rect x="0" y="${glyphMetrics.T.visibleInkBounds.master.top}" width="460" height="${VERTICAL.capLine - glyphMetrics.T.visibleInkBounds.master.top}" fill="${COLORS.goldSoft}" opacity=".62"/>
  <rect x="0" y="${VERTICAL.baseline}" width="460" height="${VERTICAL.lowerOvershootClearance - VERTICAL.baseline}" fill="${COLORS.goldSoft}" opacity=".45"/>
  <g fill="${COLORS.ink}">${glyphs}</g>
  <g fill="none" stroke="${COLORS.ink}">
    <line x1="0" x2="460" y1="${VERTICAL.capLine}" y2="${VERTICAL.capLine}" stroke-width=".8"/>
    <line x1="0" x2="460" y1="${VERTICAL.constructionAxis}" y2="${VERTICAL.constructionAxis}" stroke-width=".55" stroke-dasharray="2 2"/>
    <line x1="0" x2="460" y1="${VERTICAL.baseline}" y2="${VERTICAL.baseline}" stroke-width=".8"/>
    <line x1="0" x2="460" y1="${VERTICAL.lowerOvershootClearance}" y2="${VERTICAL.lowerOvershootClearance}" stroke="${COLORS.gold}" stroke-width=".5" stroke-dasharray="2 2"/>
    <line x1="0" x2="460" y1="${glyphMetrics.T.visibleInkBounds.master.top}" y2="${glyphMetrics.T.visibleInkBounds.master.top}" stroke="${COLORS.magenta}" stroke-width=".45" stroke-dasharray="1.5 1.5"/>
    <line x1="0" x2="460" y1="${glyphMetrics.O.visibleInkBounds.master.bottom}" y2="${glyphMetrics.O.visibleInkBounds.master.bottom}" stroke="${COLORS.magenta}" stroke-width=".45" stroke-dasharray="1.5 1.5"/>
  </g>
  <g font-family="IBM Plex Mono, ui-monospace, monospace" font-size="4" fill="${COLORS.ink}">
    <text x="-62" y="${glyphMetrics.T.visibleInkBounds.master.top + 1.3}">UPPER INK EXTENT</text>
    <text x="-62" y="${VERTICAL.capLine + 1.3}">CAP LINE</text>
    <text x="-62" y="${VERTICAL.constructionAxis + 1.3}">CONSTRUCTION AXIS</text>
    <text x="-62" y="${VERTICAL.baseline + 1.3}">BASELINE</text>
    <text x="-62" y="${VERTICAL.lowerOvershootClearance + 1.3}">OVERSHOOT CLEARANCE</text>
  </g>
`, "THOM on canonical typographic measurement lines");
await writeFigure("01-vertical-metrics", measureFigure, 2400);

const overshootFigure = figureShell("0 0 460 160", 1380, 480, `
  <g font-family="IBM Plex Mono, ui-monospace, monospace" fill="${COLORS.ink}">
    <text x="18" y="13" font-size="7" font-weight="700">OPTICAL OVERSHOOT</text>
    <text x="18" y="22" font-size="4.2" fill="${COLORS.purpleDeep}">Nominal alignment and visible ink are separate measurements.</text>
  </g>
  <rect x="16" y="30" width="204" height="116" rx="4" fill="${COLORS.white}" opacity=".58"/>
  <rect x="240" y="30" width="204" height="116" rx="4" fill="${COLORS.white}" opacity=".58"/>
  <svg x="18" y="34" width="116" height="108" viewBox="15 4 98 108" overflow="hidden"><g fill="${COLORS.ink}">${tracedT}</g></svg>
  <svg x="242" y="34" width="116" height="108" viewBox="185 8 88 102" overflow="hidden"><g fill="${COLORS.ink}">${glyphs.match(/<!-- O:[\s\S]*?(?=<!-- M:)/)?.[0] ?? ""}</g></svg>
  <g stroke="${COLORS.magenta}" stroke-width=".7" stroke-dasharray="2 2" fill="none">
    <line x1="20" x2="216" y1="45" y2="45"/><line x1="244" x2="440" y1="45" y2="45"/>
    <line x1="20" x2="216" y1="132" y2="132"/><line x1="244" x2="440" y1="132" y2="132"/>
  </g>
  <g font-family="IBM Plex Mono, ui-monospace, monospace" fill="${COLORS.ink}">
    <text x="137" y="50" font-size="4.2" font-weight="700">T · ROOF</text>
    <text x="137" y="58" font-size="3.5">6.72u above cap</text>
    <text x="137" y="65" font-size="3.5">No baseline overshoot</text>
    <text x="361" y="50" font-size="4.2" font-weight="700">O · ROUND FORM</text>
    <text x="361" y="58" font-size="3.5">Centerline and rim overshoot</text>
    <text x="361" y="65" font-size="3.5">above cap and below baseline</text>
    <text x="137" y="118" font-size="3.25" fill="${COLORS.purpleDeep}">The roof is a filled contour:</text>
    <text x="137" y="125" font-size="3.25" fill="${COLORS.purpleDeep}">its geometric and visible bounds coincide.</text>
    <text x="361" y="118" font-size="3.25" fill="${COLORS.purpleDeep}">The O is stroked:</text>
    <text x="361" y="125" font-size="3.25" fill="${COLORS.purpleDeep}">rim thickness expands beyond its centerline.</text>
  </g>
`, "Enlarged T and O optical overshoot details");
await writeFigure("02-optical-overshoot", overshootFigure, 2400);

const frameLineMarkup = Object.entries(DESIGN_FRAMES).flatMap(([_glyph, frame]) => [
  `<line x1="${frame.left}" x2="${frame.left}" y1="${VERTICAL.capLine}" y2="${VERTICAL.baseline}"/>`,
  `<line x1="${frame.right}" x2="${frame.right}" y1="${VERTICAL.capLine}" y2="${VERTICAL.baseline}"/>`,
]).join("");
const frameLabelMarkup = Object.entries(DESIGN_FRAMES).map(([glyph, frame]) =>
  `<text x="${(frame.left + frame.right) / 2}" y="111" text-anchor="middle">${glyph} · ${frame.left}—${frame.right}</text>`,
).join("");
const inkBoxMarkup = Object.entries(glyphMetrics).map(([_glyph, data]) => {
  const box = data.visibleInkBounds.master;
  return `<rect x="${box.left}" y="${box.top}" width="${box.width}" height="${box.height}"/>`;
}).join("");
const inkLabelMarkup = Object.entries(glyphMetrics).map(([glyph, data]) => {
  const box = data.visibleInkBounds.master;
  return `<text x="${box.left}" y="${Math.max(6, box.top - 2)}">${glyph} INK · ${box.width.toFixed(2)}u</text>`;
}).join("");
const horizontalFigure = figureShell("0 0 460 126", 1610, 441, `
  <g fill="${COLORS.ink}">${glyphs}</g>
  <g fill="none" stroke="${COLORS.ink}" stroke-width=".45" stroke-dasharray="2 2" opacity=".75">${frameLineMarkup}</g>
  <g fill="none" stroke="${COLORS.magenta}" stroke-width=".45">${inkBoxMarkup}</g>
  <line x1="0" x2="460" y1="${VERTICAL.baseline}" y2="${VERTICAL.baseline}" stroke="${COLORS.ink}" stroke-width=".7"/>
  <g font-family="IBM Plex Mono, ui-monospace, monospace" font-size="2.75" fill="${COLORS.ink}">
    ${frameLabelMarkup}
  </g>
  <g font-family="IBM Plex Mono, ui-monospace, monospace" font-size="2.55" fill="${COLORS.magenta}">
    ${inkLabelMarkup}
  </g>
  <g font-family="IBM Plex Mono, ui-monospace, monospace" font-size="3.2" fill="${COLORS.ink}">
    <text x="20" y="123">VISIBLE INK GAPS · T–H ${visibleGaps.T_H.toFixed(2)}u · H–O ${visibleGaps.H_O.toFixed(2)}u · O–M ${visibleGaps.O_M.toFixed(2)}u</text>
  </g>
`, "THOM design frames, ink boxes, and visible spacing");
await writeFigure("03-horizontal-metrics", horizontalFigure, 2400);

const gridLineMarkup = Array.from({ length: T_GRID.count }, (_, index) => {
  const x = T_GRID.left + index * columnSpacing;
  const y = VERTICAL.capLine + index * rowSpacing;
  return `<line x1="${x}" x2="${x}" y1="${VERTICAL.capLine}" y2="${VERTICAL.baseline}"/><line x1="${T_GRID.left}" x2="${T_GRID.right}" y1="${y}" y2="${y}"/>`;
}).join("");
const gridLabels = Array.from({ length: T_GRID.count }, (_, index) => {
  const x = T_GRID.left + index * columnSpacing;
  const y = VERTICAL.capLine + index * rowSpacing;
  return `<text x="${x}" y="111" text-anchor="middle">${gridColumns[index]}</text><text x="110" y="${y + 1}">${gridRows[index]}</text>`;
}).join("");
const tGridFigure = figureShell("0 0 180 126", 1440, 1008, `
  <g font-family="IBM Plex Mono, ui-monospace, monospace" fill="${COLORS.ink}">
    <text x="20" y="8" font-size="5.2" font-weight="700">T · ADDRESSABLE CONSTRUCTION GRID</text>
    <text x="20" y="13" font-size="2.8" fill="${COLORS.purpleDeep}">15 × 15 · A01–O15 · ROW ${rowSpacing.toFixed(3)}u · COLUMN ${columnSpacing.toFixed(3)}u</text>
  </g>
  <g fill="none" stroke="${COLORS.ink}" stroke-width=".3" stroke-dasharray="1.5 1.8" opacity=".58">${gridLineMarkup}</g>
  <g fill="none" stroke="${COLORS.ink}" stroke-width=".75"><line x1="${T_GRID.left}" x2="${T_GRID.right}" y1="${VERTICAL.capLine}" y2="${VERTICAL.capLine}"/><line x1="${T_GRID.left}" x2="${T_GRID.right}" y1="${VERTICAL.baseline}" y2="${VERTICAL.baseline}"/></g>
  <g fill="${COLORS.ink}">${tracedT}</g>
  <g font-family="IBM Plex Mono, ui-monospace, monospace" font-size="2.25" fill="${COLORS.purpleDeep}">${gridLabels}</g>
  <g font-family="IBM Plex Mono, ui-monospace, monospace" fill="${COLORS.ink}">
    <text x="123" y="28" font-size="4" font-weight="700">ADDRESSING</text>
    <text x="123" y="36" font-size="3">Column letter first, row second.</text>
    <text x="123" y="43" font-size="3">Example: M12.</text>
    <text x="123" y="56" font-size="4" font-weight="700">MEASUREMENT</text>
    <text x="123" y="64" font-size="3">Row tables report horizontal</text>
    <text x="123" y="70" font-size="3">ink spans through each pillar.</text>
    <text x="123" y="83" font-size="4" font-weight="700">CONTOURS</text>
    <text x="123" y="91" font-size="3">Top bar, left pillar, and right</text>
    <text x="123" y="97" font-size="3">pillar remain independent fills.</text>
  </g>
`, "Addressable 15 by 15 construction grid for the canonical T");
await writeFigure("04-t-grid", tGridFigure, 2400);

const displayMeasurement = (measurement: Measurement) => measurement
  ? measurement.spans.map(({ span }) => `${span.toFixed(3)}u`).join(" + ")
  : "—";
const rowTable = tRows.map(({ row, y, leftPillar, rightPillar }) => `| ${row} | ${y.toFixed(4)} | ${displayMeasurement(leftPillar)} | ${displayMeasurement(rightPillar)} |`).join("\n");
const columnTable = tColumns.map(({ column, x, topBar, leftPillar, rightPillar }) => `| ${column} | ${x.toFixed(4)} | ${displayMeasurement(topBar)} | ${displayMeasurement(leftPillar)} | ${displayMeasurement(rightPillar)} |`).join("\n");
const glyphTable = (["T", "H", "O", "M"] as const).map((glyph) => {
  const data = glyphMetrics[glyph];
  const nominal = data.geometricBounds.master;
  const ink = data.visibleInkBounds.master;
  return `| ${glyph} | ${data.designFrame.left}–${data.designFrame.right} | ${nominal.left.toFixed(2)}, ${nominal.top.toFixed(2)}, ${nominal.right.toFixed(2)}, ${nominal.bottom.toFixed(2)} | ${ink.left.toFixed(2)}, ${ink.top.toFixed(2)}, ${ink.right.toFixed(2)}, ${ink.bottom.toFixed(2)} | ${data.capOvershoot.visibleInk.toFixed(2)} | ${data.baselineOvershoot.visibleInk.toFixed(2)} |`;
}).join("\n");

const markdown = `<div class="cover">
  <div class="cover-kicker">CANONICAL GEOMETRY · VERSION 1.1</div>
  <h1>THOM Typography Specification</h1>
  <p class="cover-subtitle">Construction, optical alignment, measurement, and SVG → Three.js translation</p>
  <img class="cover-logo" src="thom-canonical.svg" alt="Canonical THOM wordmark">
  <div class="cover-meta">460 × 120 master · 89u cap height · refined audit geometry</div>
</div>

# Status and authority

This specification makes the refined THOM artwork canonical for **shape, proportion, and placement**. The canonical wordmark is [thom-canonical.svg](thom-canonical.svg); the machine-readable contract is [thom-typography-metrics.json](thom-typography-metrics.json).

The wordmark occupies a **460 × 120 master-unit artboard**. The former 460 × 152 audit board is not a second geometry system: its lower 32 units are annotation space. One master unit (1u) is one SVG user unit.

> **Typographic rule.** The baseline is the nominal alignment datum, not necessarily the lowest visible pixel. Filled contours, stroked centerlines, and round caps must be measured separately.

> **Evidence rule.** Geometry and accessibility constraints eliminate known defects; they do not prove universal beauty. The H’s golden-ratio division is an identity narrative and testable design prior, not a psychophysical optimum.

| Authority | Canonical source | Rule |
|---|---|---|
| Shape and placement | \`docs/brand/typography/thom-canonical.svg\` | Governs glyph outlines, construction, relative scale, and spacing. |
| Numeric geometry | \`docs/brand/typography/thom-typography-metrics.json\` | Governs lines, frames, bounds, overshoot, grid coordinates, and conversion constants. |
| Color and materials | \`src/brand/thom/geometry.ts\` | Preserve the existing palette, metallic ramps, glow, stroke stacks, and source-energy compensation. |
| Motion and WebGL behavior | \`src/brand/thom/threeScene.ts\` and generated brand data | Preserve timing, reveal order, animated construction, and material behavior during migration. |
| Optical profiles | \`src/brand/thom/opticalProfile.ts\` and \`src/brand/thom/svg.ts\` | Select display, compact, or micro detail from rendered size while preserving the canonical silhouettes. |

<div class="page-break"></div>

# Vertical metrics

![THOM on its canonical cap line, construction axis, baseline, and overshoot references](figures/01-vertical-metrics.svg)

| Metric | SVG y | Three.js y | Definition |
|---|---:|---:|---|
| Upper ink extent | ${glyphMetrics.T.visibleInkBounds.master.top.toFixed(2)} | ${(MASTER.height - glyphMetrics.T.visibleInkBounds.master.top).toFixed(2)} | Highest rendered ink, set by the T roof. It is an observed ink bound, not a font-wide alignment line. |
| Cap line | 15.00 | 105.00 | Nominal top alignment for H and the principal M waveform. |
| Horizontal construction axis | 60.00 | 60.00 | Shared geometric axis through the H proportion split and O construction. |
| Baseline | 104.00 | 16.00 | Nominal lower alignment for filled T/H contours and the principal M waveform. |
| Lowest visible ink | ${glyphMetrics.O.visibleInkBounds.master.bottom.toFixed(2)} | ${(MASTER.height - glyphMetrics.O.visibleInkBounds.master.bottom).toFixed(2)} | Rendered bottom of the O perimeter at the specified audit weight. |
| Lower overshoot clearance | 112.00 | 8.00 | Reserved clearance/safety boundary; it is not an ink target. |

The cap height is **89u**. At the reference width of 2300 px, the export scale is **5 px/u**, so the cap height renders at 445 px.

## Optical compensation

![Enlarged T and O overshoot comparison](figures/02-optical-overshoot.svg)

- **T:** the roof reaches y = ${(T_TRANSFORM.translateY + 8.25 * T_TRANSFORM.scaleY).toFixed(4)}, or ${(VERTICAL.capLine - (T_TRANSFORM.translateY + 8.25 * T_TRANSFORM.scaleY)).toFixed(4)}u above the cap line. Its pillar terminals land on the baseline with no lower ink overshoot.
- **O:** the perimeter centerline extends beyond both cap line and baseline; the visible rim extends farther by half the transformed stroke weight. This is conventional round-form compensation, not misalignment.
- **H:** the filled terminals land on the cap line and baseline. Its stem width and terminal/serif width are distinct metrics.
- **M:** the principal centerline aligns to cap line and baseline; round strokes and layered fine strands add a small visible-ink extension.

<div class="page-break"></div>

# Glyph metric sheets

Bounds are listed as **left, top, right, bottom** in master coordinates. “Geometric” uses SVG vector bounds; “visible ink” is verified at 20 px/u with alpha ≥ 0.5 and is reported to 0.05u precision.

| Glyph | Design frame | Geometric bounds | Visible-ink bounds | Upper ink overshoot | Lower ink overshoot |
|---|---|---|---|---:|---:|
${glyphTable}

## T — three independent filled contours

The T is built from **top-bar**, **left-pillar**, and **right-pillar** contours. Each contour retains paired outer/inner Bézier edges. The canonical transform is \`translate(22, −0.222) scale(0.86, 1.03)\`. Curve edits must move corresponding anchors and adjacent handles along the local normal; never replace the contours with simplified polygons or non-uniformly scale the whole letter.

## H — stem and terminal measures

- Construction-axis stem width: **${metrics.constructionDetails.H.stemWidthAtConstructionAxis.toFixed(4)}u**.
- Cap/baseline terminal width: **${metrics.constructionDetails.H.terminalSerifWidth.toFixed(4)}u**.
- Local pillar centers after the audit adjustment: **28u** and **72u**.

### H motion contract

The display H uses one procedural, clockwise logarithmic golden spiral centered on the golden-ratio division point. Its radius grows by **φ per quarter turn**, completes **${H_SPIRAL.turns} turns** at a **${H_SPIRAL.finalRadius}u** radius, and remains behind the H construction. The ${H_ANIMATION.durationMs} ms sequence traces through ${(H_ANIMATION.traceEnd * H_ANIMATION.durationMs).toFixed(0)} ms, holds through ${(H_ANIMATION.holdEnd * H_ANIMATION.durationMs).toFixed(0)} ms, then fades to the unchanged settled H. Page load and direct H interaction share this geometry and timing. Pointer exit never cancels an active trace; reduced motion skips it.

## O — centerline versus rim

- Side perimeter weight: **${metrics.constructionDetails.O.perimeterWeight.sideMasterUnits.toFixed(4)}u**.
- Cap/baseline perimeter weight: **${metrics.constructionDetails.O.perimeterWeight.capBaselineMasterUnits.toFixed(4)}u**.
- Perimeter centerline bounds, local: **${oCircleLocal.left.toFixed(3)}, ${oCircleLocal.top.toFixed(3)}, ${oCircleLocal.right.toFixed(3)}, ${oCircleLocal.bottom.toFixed(3)}**.
- Node/chord construction remains integral to the canonical O; the outer circle is not a substitute for the internal network.

## M — layered waveform

The M remains a textural Fourier construction. Four fine-strand copies are added at local y offsets **−2.4, −1.2, +1.2, +2.4**, each at 0.4 opacity. Existing strand widths are unchanged.

<div class="page-break"></div>

# Horizontal placement and spacing

![Design frames, visible ink boxes, and inter-character gaps](figures/03-horizontal-metrics.svg)

The design frame is the nominal placement/advance region. The ink box is the actual rendered silhouette. Sidebearings are therefore measured from the frame edge to the visible ink—not inferred from a character’s nominal 100u source cell.

| Pair | Visible-ink gap |
|---|---:|
| T–H | ${visibleGaps.T_H.toFixed(4)}u |
| H–O | ${visibleGaps.H_O.toFixed(4)}u |
| O–M | ${visibleGaps.O_M.toFixed(4)}u |

The three gaps remain optically—not mechanically—defined, but now cluster within **${(Math.max(...Object.values(visibleGaps)) - Math.min(...Object.values(visibleGaps))).toFixed(4)}u**. Their near-equality is a calibrated prior to be validated in use, not a claim that equal spacing is universally preferred.

## Placement transforms

| Glyph | Master transform | Design frame |
|---|---|---|
| T | translate(22, −0.222) · scale(0.86, 1.03) | 20–106 |
| H | translate(98.475, 0); local pillar scale x = 0.74 | 113.5–182.5 |
| O | translate(182.5, −8.4) · scale(0.88, 1.14) | 187.875–264.875 |
| M | translate(274.6, −26.7) · scale(1, 1.49) | 275–396 |

<div class="page-break"></div>

# T construction grid

![Addressable A01 through O15 construction grid for the T](figures/04-t-grid.svg)

Grid addresses use the **column letter first** and the **two-digit row second**: \`A01\` through \`O15\`. Rows are equally spaced between cap line and baseline; columns are equally spaced across the T design frame.

- Row spacing: **${rowSpacing.toFixed(6)}u**.
- Column spacing: **${columnSpacing.toFixed(6)}u**.
- Horizontal measurements report contiguous filled-ink spans through each independent pillar contour.
- Multiple values indicate distinct ink runs where a terminal or concavity crosses the same guide.

<div class="page-break"></div>

# T pillar widths by row

| Row | SVG y | Left pillar | Right pillar |
|---:|---:|---:|---:|
${rowTable}

<div class="page-break"></div>

# T vertical intersections

| Column | SVG x | Top bar | Left pillar | Right pillar |
|---:|---:|---:|---:|---:|
${columnTable}

The roof’s vertical span is deliberately non-uniform: its long sweep is thinner through the center and resolves into sharpened terminals. Pillar readings become discontinuous near the feet because the horizontal sample can cross a terminal turn more than once.

<div class="page-break"></div>

# Scaling and export

## Master units

Keep geometry in the 460 × 120 master whenever possible. Scale only at the final presentation boundary.

For a target width \(W\):

\`scale = W / 460\`

At the reference export, \(W = 2300\), so \`scale = 5 px/u\`. The corresponding height is \`120 × 5 = 600 px\`.

For a constrained viewport, use a uniform contain scale:

\`\`\`ts
const scale = Math.min(viewportWidth / 460, viewportHeight / 120);
const offsetX = (viewportWidth - 460 * scale) / 2;
const offsetY = (viewportHeight - 120 * scale) / 2;
\`\`\`

Never fit the complete wordmark with independent X and Y scales. Glyph-specific transforms already belong to the canonical construction and must not be reinterpreted as responsive distortion.

## Optical profiles

Profile selection uses the **rendered wordmark width**, not a device category or component name. The React component observes its actual inline size when \`opticalProfile="auto"\`; callers may pin a profile for exports or controlled comparisons.

| Profile | Rendered width | Treatment |
|---|---:|---|
| Display | > ${OPTICAL_PROFILE_WIDTHS.compactMax}px | Full luminous construction, golden-ratio annotations, canonical O network, and layered M. |
| Compact | ${OPTICAL_PROFILE_WIDTHS.microMax + 1}–${OPTICAL_PROFILE_WIDTHS.compactMax}px | Stronger H stems, quiet continuous a/b crossbar, compact O network, and single compact M contour. |
| Micro | ≤ ${OPTICAL_PROFILE_WIDTHS.microMax}px | Continuous H crossbar without φ ticks/brace/point, seven O chords without nodes, and a strengthened M contour. |

Compact and micro assets apply small X-only spacing corrections recorded in the metrics contract. They never distort glyph geometry. The golden-ratio construction remains available in the display mark and procedural spiral animation, but it does not compete with letter recognition in utility sizes.

## Perceptual validation protocol

The golden-ratio split remains an **unvalidated design prior**. Before making a preference claim, compare blinded display variants at 1:1, φ:1, and 2:1 while holding pillars, total crossbar span, stroke energy, and wordmark spacing constant. Randomize order and record THOM recognition, perceived balance, forced-choice preference, and response confidence.

Repeat the recognition check at 184px compact and 92px micro sizes. Those profiles intentionally suppress ratio annotations, so the small-size question is legibility and identity survival—not whether viewers can recover φ from the rendered pixels. Report sample, context, uncertainty, and null results alongside any winner.

## Raster export examples

| Target width | Uniform scale | Output height |
|---:|---:|---:|
| 460 px | 1 px/u | 120 px |
| 920 px | 2 px/u | 240 px |
| 1380 px | 3 px/u | 360 px |
| 2300 px | 5 px/u | 600 px |

<div class="page-break"></div>

# SVG → Three.js translation

SVG’s origin is at the upper left and y increases downward. The canonical Three.js scene uses the same 460u width and 120u height, but y increases upward.

\`\`\`ts
type Point = { x: number; y: number };

const svgToThree = ({ x, y }: Point) =>
  new Vector3(x, 120 - y, 0);
\`\`\`

Apply the function to every \`M\`, \`L\`, and \`C\` coordinate, including both cubic control points. Preserve \`Z\` as \`closePath()\`.

## Preferred: flatten the SVG transform first

\`\`\`ts
type SvgTransform = {
  tx: number;
  ty: number;
  sx: number;
  sy: number;
};

function transformedPoint({ x, y }: Point, t: SvgTransform) {
  const X = t.tx + t.sx * x;
  const Y = t.ty + t.sy * y;
  return new Vector3(X, 120 - Y, 0);
}
\`\`\`

Flattening is least ambiguous because nested SVG transforms are resolved before the y-axis inversion.

## Equivalent Three.js group transform

If local geometry has already been converted with \`(x, 120 − y)\` and the SVG transform is only translate + scale:

\`\`\`ts
group.scale.set(sx, sy, 1);
group.position.set(tx, 120 - ty - 120 * sy, 0);
\`\`\`

## Camera

\`\`\`ts
const camera = new OrthographicCamera(0, 460, 120, 0, -30, 30);
\`\`\`

| SVG datum | SVG y | Three.js y |
|---|---:|---:|
| Artboard top | 0 | 120 |
| Cap line | 15 | 105 |
| Construction axis | 60 | 60 |
| Baseline | 104 | 16 |
| Artboard bottom | 120 | 0 |

## Legacy 416 × 120 compatibility

The former 416 × 120 scene is a compatibility viewport, not the geometry master. If it cannot yet be migrated, preserve proportions with a uniform scale of **${(416 / 460).toFixed(9)}**. The canonical art becomes **${(120 * 416 / 460).toFixed(6)}u** high with **${((120 - 120 * 416 / 460) / 2).toFixed(6)}u** of vertical inset above and below. Do not squeeze 460u into 416u while retaining the full 120u height.

<div class="page-break"></div>

# Preservation and migration checklist

## Preserve from the legacy implementation

- Metallic color ramps and light/dark/monochrome themes.
- Source-energy compensation and display stroke conversions.
- T rim, O perimeter/chord/node materials, H proportion construction, and M layered stroke materials.
- Animation timing, reveal ordering, H logarithmic golden-spiral trace, O network stages, and M Fourier buildup.
- Responsive orthographic-camera behavior, adjusted to a 460 × 120 canonical base.

## Replace during a future production migration

- Geometry and placement constants derived from the old 416 × 120 master.
- Legacy T path data and old per-glyph placements where they disagree with this canonical SVG.
- Any non-uniform whole-wordmark fit introduced solely to preserve the old viewport.

## Acceptance checks

1. Composite \`thom-canonical.svg\` over \`#c5b6f4\` at 2300 × 600 and compare it to the refined audit raster.
2. Verify cap line, construction axis, baseline, and optical overshoots from the metrics JSON.
3. Confirm every cubic control point receives the same affine transform as its endpoint.
4. Confirm the 460 × 120 camera displays the canonical wordmark without cropping or anisotropic scaling.
5. Re-run the T grid measurements after any contour edit; do not copy old width tables forward.
6. Preserve color/material/motion sources until a separate migration explicitly supersedes them.
7. At widths of 92px, 184px, and 460px, verify the selected micro, compact, and display profiles respectively; every glyph must retain a high-contrast recognizable core.
8. Confirm compact and micro H output omits the ratio point, ticks, and brace while the display H retains them and the procedural spiral remains display-only.
9. Do not describe the φ split as preferred until the blinded comparison protocol is run and reported; exact geometry alone is not preference evidence.

---

**Specification artifacts:** [canonical SVG](thom-canonical.svg) · [metrics JSON](thom-typography-metrics.json) · [print-ready PDF](thom-typography-overview.pdf)
`;

const markdownPath = resolve(out, "thom-typography-overview.md");
await writeFile(markdownPath, markdown);

const temp = await mkdtemp(join(tmpdir(), "thom-typography-spec-"));
const htmlPath = resolve(temp, "thom-typography-overview.html");
const markdownHtml = Bun.markdown.html(markdown);
const baseHref = pathToFileURL(`${out}/`).href;
const html = `<!doctype html>
<html><head><meta charset="utf-8"><base href="${baseHref}"><style>
  @page { size: Letter; margin: .62in .62in .68in; }
  :root { --purple:${COLORS.purple}; --purple-deep:${COLORS.purpleDeep}; --soft:${COLORS.purpleSoft}; --ink:${COLORS.ink}; --gold:${COLORS.gold}; --gold-soft:${COLORS.goldSoft}; --white:${COLORS.white}; }
  * { box-sizing: border-box; }
  html { background:#ddd; }
  body { margin:0; color:var(--ink); font-family:Inter, "Helvetica Neue", Arial, sans-serif; font-size:9.25pt; line-height:1.42; }
  h1, h2, h3 { break-after:avoid; color:var(--ink); }
  h1 { margin:0 0 14pt; padding-bottom:7pt; border-bottom:2px solid var(--gold); font-size:23pt; line-height:1.05; letter-spacing:-.02em; }
  h2 { margin:12pt 0 5pt; font-size:14pt; line-height:1.16; }
  h3 { margin:11pt 0 5pt; font-size:11pt; line-height:1.2; color:var(--purple-deep); }
  p { margin:0 0 7pt; }
  ul, ol { margin:4pt 0 9pt; padding-left:18pt; }
  li { margin:0 0 3pt; }
  strong { font-weight:750; }
  a { color:#54458a; text-decoration-color:#b18a35; }
  code { font-family:"IBM Plex Mono", "SFMono-Regular", Consolas, monospace; font-size:.9em; background:#eee9ff; border-radius:3px; padding:1px 3px; }
  pre { margin:5pt 0 8pt; padding:8pt 10pt; border-left:3px solid var(--gold); border-radius:4px; background:#17131b; color:#fffaf0; break-inside:avoid; white-space:pre-wrap; font-size:7.5pt; line-height:1.3; }
  pre code { padding:0; color:inherit; background:transparent; }
  blockquote { margin:10pt 0 12pt; padding:9pt 12pt; border-left:4px solid var(--gold); background:var(--gold-soft); color:#3c3020; break-inside:avoid; }
  blockquote p { margin:0; }
  table { width:100%; border-collapse:collapse; margin:7pt 0 12pt; font-size:7.6pt; break-inside:auto; }
  thead { display:table-header-group; }
  tr { break-inside:avoid; }
  th { padding:5pt 5.5pt; text-align:left; vertical-align:bottom; background:#32284d; color:white; font-weight:700; }
  td { padding:4.5pt 5.5pt; vertical-align:middle; border-bottom:1px solid #d8d1eb; }
  tbody tr:nth-child(even) { background:#f3f0fb; }
  td:not(:first-child), th:not(:first-child) { font-variant-numeric:tabular-nums; }
  img { display:block; max-width:100%; max-height:6.75in; margin:9pt auto 12pt; break-inside:avoid; }
  hr { margin:16pt 0 8pt; border:0; border-top:1px solid #a99bc9; }
  .page-break { break-before:page; }
  .cover { height:9.25in; margin:-.62in; padding:.72in .72in .58in; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; background:var(--purple); break-after:page; }
  .cover h1 { max-width:6.4in; margin:0; padding:0; border:0; font-size:35pt; line-height:1; letter-spacing:-.035em; }
  .cover-kicker { margin-bottom:18pt; font-family:"IBM Plex Mono", monospace; font-size:8.5pt; font-weight:700; letter-spacing:.17em; color:#5f4a1d; }
  .cover-subtitle { max-width:5.8in; margin:12pt 0 34pt; font-family:Newsreader, Georgia, serif; font-size:16pt; line-height:1.3; color:#3c3156; }
  .cover-logo { width:6.55in; margin:0 0 34pt; }
  .cover-meta { padding-top:12pt; border-top:1px solid #6f638d; font-family:"IBM Plex Mono", monospace; font-size:8.5pt; letter-spacing:.08em; color:#4b416a; }
  @media print { html { background:white; } a { text-decoration:none; } }
</style></head><body>${markdownHtml}</body></html>`;
await writeFile(htmlPath, html);

const pdfBrowser = await chromium.launch({ headless: true });
try {
  const page = await pdfBrowser.newPage({ viewport: { width: 1365, height: 1767 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: resolve(out, "thom-typography-overview.pdf"),
    format: "Letter",
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: '<div style="font-size:7px;width:100%;padding:0 .62in;color:#6d6481;font-family:Arial,sans-serif"><span>THOM · TYPOGRAPHY SPECIFICATION</span></div>',
    footerTemplate: '<div style="font-size:7px;width:100%;padding:0 .62in;color:#6d6481;font-family:Arial,sans-serif;display:flex;justify-content:space-between"><span>CANONICAL GEOMETRY · v1.1</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
    margin: { top: ".62in", right: ".62in", bottom: ".68in", left: ".62in" },
  });
} finally {
  await pdfBrowser.close();
}

const comparisonSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="2300" height="600" viewBox="0 0 460 120"><rect width="460" height="120" fill="${COLORS.purple}"/><g fill="#000000">${glyphs}</g></svg>`;
const canonicalPng = PNG.sync.read(new Resvg(comparisonSvg, { fitTo: { mode: "width", value: 2300 } }).render().asPng());
const currentSvg = await readFile(currentWholeLogoPath, "utf8");
const currentPng = PNG.sync.read(new Resvg(currentSvg, { fitTo: { mode: "width", value: 2300 } }).render().asPng());
if (canonicalPng.width !== currentPng.width || canonicalPng.height !== currentPng.height) throw new Error("Canonical/current raster sizes differ.");
const diff = new PNG({ width: canonicalPng.width, height: canonicalPng.height });
const differingPixels = pixelmatch(canonicalPng.data, currentPng.data, diff.data, canonicalPng.width, canonicalPng.height, { threshold: 0 });
if (differingPixels !== 0) throw new Error(`Canonical raster differs from current refined wordmark by ${differingPixels} pixels.`);

const svgToThree = ({ x, y }: Point) => ({ x, y: MASTER.height - y, z: 0 });
const coordinateCases = [
  [{ x: 0, y: 0 }, { x: 0, y: 120, z: 0 }],
  [{ x: 460, y: 120 }, { x: 460, y: 0, z: 0 }],
  [{ x: 0, y: VERTICAL.capLine }, { x: 0, y: 105, z: 0 }],
  [{ x: 0, y: VERTICAL.constructionAxis }, { x: 0, y: 60, z: 0 }],
  [{ x: 0, y: VERTICAL.baseline }, { x: 0, y: 16, z: 0 }],
] as const;
for (const [input, expected] of coordinateCases) {
  const actual = svgToThree(input);
  if (actual.x !== expected.x || actual.y !== expected.y || actual.z !== expected.z) {
    throw new Error(`Coordinate conversion failed for ${JSON.stringify(input)}.`);
  }
}

console.log(JSON.stringify({
  outputs: {
    markdown: markdownPath,
    pdf: resolve(out, "thom-typography-overview.pdf"),
    svg: canonicalPath,
    metrics: metricsPath,
  },
  figures: 4,
  canonicalRasterDiffPixels: differingPixels,
  glyphVisibleInkBounds: Object.fromEntries(Object.entries(glyphMetrics).map(([glyph, data]) => [glyph, data.visibleInkBounds.master])),
  tRoofCapOvershoot: metrics.constructionDetails.T.roofCapOvershoot,
  coordinateCases: coordinateCases.length,
}, null, 2));
