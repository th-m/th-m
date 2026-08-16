import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";

type Point = { x: number; y: number };
type Segment =
  | { kind: "line"; p0: Point; p3: Point }
  | { kind: "cubic"; p0: Point; p1: Point; p2: Point; p3: Point };
type InkSpan = { start: number; end: number; span: number };
type Measurement = { spans: InkSpan[] } | null;

const output = resolve(import.meta.dir);
const source = await Bun.file(resolve(output, "compose-alignment-mockup.ts")).text();
const cap = 15;
const baseline = 104;
const construction = 60;
const lineCount = 15;
const lineSpacing = (baseline - cap) / (lineCount - 1);
const gridLeft = 20;
const gridRight = 106;
const gridColumns = Array.from({ length: lineCount }, (_, index) => String.fromCharCode(65 + index));
const columnSpacing = (gridRight - gridLeft) / (lineCount - 1);
const tTransform = { x: 22, y: -0.222, scaleX: 0.86, scaleY: 1.03 };

const contourPath = (segment: "left-pillar" | "right-pillar") => {
  const path = source.match(new RegExp(`data-t-segment="${segment}"[\\s\\S]*?<path d="([^"]+)"`))?.[1];
  if (!path) throw new Error(`Could not find the ${segment} contour.`);
  return path;
};

const parsePath = (path: string): Segment[] => {
  const tokens = path.match(/[MCLZ]|-?\d*\.?\d+/g) ?? [];
  let tokenIndex = 0;
  let command = "";
  let current: Point = { x: 0, y: 0 };
  let start: Point = { x: 0, y: 0 };
  const nextNumber = () => Number(tokens[tokenIndex++]);
  const segments: Segment[] = [];

  while (tokenIndex < tokens.length) {
    if (/^[MCLZ]$/.test(tokens[tokenIndex])) command = tokens[tokenIndex++];

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

const pointAt = (segment: Segment, t: number): Point =>
  segment.kind === "line"
    ? {
        x: segment.p0.x + (segment.p3.x - segment.p0.x) * t,
        y: segment.p0.y + (segment.p3.y - segment.p0.y) * t,
      }
    : cubicPoint(segment.p0, segment.p1, segment.p2, segment.p3, t);

const horizontalIntersections = (segments: Segment[], rawY: number) => {
  const intersections: number[] = [];

  for (const segment of segments) {
    let previous = pointAt(segment, 0);
    for (let sample = 1; sample <= 512; sample += 1) {
      const nextT = sample / 512;
      const next = pointAt(segment, nextT);
      if ((previous.y - rawY) * (next.y - rawY) <= 0 && previous.y !== next.y) {
        let low = (sample - 1) / 512;
        let high = nextT;
        for (let iteration = 0; iteration < 32; iteration += 1) {
          const middle = (low + high) / 2;
          if ((pointAt(segment, low).y - rawY) * (pointAt(segment, middle).y - rawY) <= 0) high = middle;
          else low = middle;
        }
        intersections.push(pointAt(segment, (low + high) / 2).x);
      }
      previous = next;
    }
  }

  return [...new Set(intersections.map((x) => x.toFixed(5)))].map(Number).sort((a, b) => a - b);
};

const measureContour = (segments: Segment[], guideY: number): Measurement => {
  const rawY = (guideY - tTransform.y) / tTransform.scaleY;
  const intersections = horizontalIntersections(segments, rawY).map((x) => tTransform.x + x * tTransform.scaleX);
  if (intersections.length < 2) return null;
  const spans = Array.from({ length: Math.floor(intersections.length / 2) }, (_, index) => {
    const start = intersections[index * 2];
    const end = intersections[index * 2 + 1];
    return {
      start: Number(start.toFixed(3)),
      end: Number(end.toFixed(3)),
      span: Number((end - start).toFixed(3)),
    };
  });
  return {
    spans,
  };
};

const leftPillar = parsePath(contourPath("left-pillar"));
const rightPillar = parsePath(contourPath("right-pillar"));
const guides = Array.from({ length: lineCount }, (_, index) => {
  const y = Number((cap + index * lineSpacing).toFixed(4));
  return {
    index: index + 1,
    row: String(index + 1).padStart(2, "0"),
    y,
    left: measureContour(leftPillar, y),
    right: measureContour(rightPillar, y),
  };
});

const display = (measurement: Measurement) => (measurement ? measurement.spans.map(({ span }) => `${span.toFixed(2)}u`).join(" + ") : "—");
const brackets = guides
  .flatMap(({ y, left, right }) =>
    [left, right]
      .filter((measurement): measurement is NonNullable<Measurement> => measurement !== null)
      .flatMap(({ spans }) =>
        spans.map(
          ({ start, end }) => `<g fill="none" stroke="#16b9e8" stroke-width=".5">
          <line x1="${start}" x2="${end}" y1="${y}" y2="${y}"/>
          <line x1="${start}" x2="${start}" y1="${y - 1.3}" y2="${y + 1.3}"/>
          <line x1="${end}" x2="${end}" y1="${y - 1.3}" y2="${y + 1.3}"/>
        </g>`,
        ),
      ),
  )
  .join("");

const guideLines = guides
  .map(({ index, y }) => {
    const isTopReference = index === 1;
    const isBaseline = index === lineCount;
    const isConstruction = Math.abs(y - construction) < 0.01;
    const strokeWidth = isTopReference || isBaseline ? ".9" : isConstruction ? ".65" : ".32";
    const dash = isTopReference || isBaseline ? "" : 'stroke-dasharray="2 2.4"';
    return `<line x1="${gridLeft}" x2="${gridRight}" y1="${y}" y2="${y}" stroke="#17131b" stroke-width="${strokeWidth}" ${dash}/>`;
  })
  .join("");

const verticalGridLines = gridColumns
  .map((column, index) => {
    const x = gridLeft + index * columnSpacing;
    const isBoundary = index === 0 || index === lineCount - 1;
    return `<line x1="${x}" x2="${x}" y1="${cap}" y2="${baseline}" stroke="#17131b" stroke-width="${isBoundary ? ".65" : ".28"}" ${isBoundary ? "" : 'stroke-dasharray="1.8 2.2"'}/>`;
  })
  .join("");
const columnLabels = gridColumns
  .map((column, index) => `<text x="${gridLeft + index * columnSpacing}" y="110" text-anchor="middle" font-size="2.35">${column}</text>`)
  .join("");
const rowLabels = guides
  .map(({ row, y }) => `<text x="110" y="${y + .75}" font-size="2.15">${row}</text>`)
  .join("");

const tableRows = guides
  .map(
    ({ index, y, left, right }) => `<text x="184" y="${25 + (index - 1) * 7.2}">${String(index).padStart(2, "0")}</text>
      <text x="201" y="${25 + (index - 1) * 7.2}">${y.toFixed(2)}</text>
      <text x="231" y="${25 + (index - 1) * 7.2}">${display(left)}</text>
      <text x="276" y="${25 + (index - 1) * 7.2}">${display(right)}</text>`,
  )
  .join("");

const tracedT = source.match(/const tracedTGroups = `([\s\S]*?)`;/)?.[1];
if (!tracedT) throw new Error("Could not read the T contour groups.");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="3600" height="1800" viewBox="0 0 360 180">
  <rect width="360" height="180" fill="#c5b6f4"/>
  <rect x="14" y="0" width="146" height="${cap}" fill="#f8df9e" opacity=".34"/>
  <rect x="14" y="${baseline}" width="146" height="12" fill="#f8df9e" opacity=".34"/>
  <g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" fill="#17131b">
    <text x="14" y="8.5" font-size="4.4" letter-spacing=".5">T PILLAR · ADDRESSABLE 15 × 15 GRID</text>
    <text x="14" y="13.1" font-size="2.7" letter-spacing=".18">ADDRESS: A01–O15 · ROW STEP: ${lineSpacing.toFixed(3)} MASTER UNITS · CYAN = HORIZONTAL INK SPAN</text>
    <text x="4" y="${cap + 1.7}" font-size="3.3">CAP REF</text>
    <text x="4" y="${baseline + 1.7}" font-size="3.3">BASE</text>
    ${guideLines}${verticalGridLines}
    <g fill="#000000">${tracedT}</g>
    ${brackets}
    <g font-size="2.15" fill="#4b416a">${columnLabels}${rowLabels}</g>
    <text x="${gridLeft}" y="116" font-size="2.45" fill="#4b416a">COLUMN (A–O) →</text>
    <text x="109" y="116" font-size="2.45" fill="#4b416a">ROW</text>
    <rect x="172" y="7" width="169" height="132" fill="#b8a8e5" opacity=".48"/>
    <g font-size="3.1" letter-spacing=".2">
      <text x="184" y="9.8" font-size="3.8" letter-spacing=".45">INTERSECTION SPANS · MASTER UNITS</text>
      <text x="184" y="17" fill="#4b416a">LINE</text><text x="201" y="17" fill="#4b416a">Y</text><text x="231" y="17" fill="#4b416a">LEFT</text><text x="276" y="17" fill="#4b416a">RIGHT</text>
      ${tableRows}
      <text x="184" y="148" font-size="2.75" fill="#4b416a">— = the guide is in the roof/reference zone, not a pillar contour.</text>
      <text x="184" y="153" font-size="2.75" fill="#4b416a">Separate values mark discrete ink runs where the terminal opens a horizontal counter.</text>
    </g>
    <g font-size="3.4" letter-spacing=".6"><text x="76" y="128" text-anchor="middle">T</text></g>
  </g>
</svg>`;

const stem = "25-t-pillar-15-line-measure";
await Bun.write(resolve(output, `${stem}.svg`), `${svg}\n`);
await Bun.write(resolve(output, `${stem}.png`), new Resvg(svg, { fitTo: { mode: "width", value: 3600 } }).render().asPng());
await Bun.write(
  resolve(output, `${stem}.json`),
  `${JSON.stringify(
    {
      source: "compose-alignment-mockup.ts",
      reference: { cap, baseline, guideCount: lineCount, guideSpacing: Number(lineSpacing.toFixed(6)) },
      addressing: { columns: gridColumns, rows: guides.map(({ row }) => row), format: "A01–O15" },
      measurement: "horizontal contiguous ink spans of each filled T pillar at each guide",
      guides,
    },
    null,
    2,
  )}\n`,
);
