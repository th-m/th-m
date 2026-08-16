import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";

type Point = { x: number; y: number };
type Segment =
  | { kind: "line"; p0: Point; p3: Point }
  | { kind: "cubic"; p0: Point; p1: Point; p2: Point; p3: Point };
type InkSpan = { start: number; end: number; span: number };
type Measurement = { spans: InkSpan[] } | null;
type TSegment = "top-bar" | "left-pillar" | "right-pillar";

const output = resolve(import.meta.dir);
const source = await Bun.file(resolve(output, "compose-alignment-mockup.ts")).text();
const cap = 15;
const baseline = 104;
const gridLeft = 20;
const gridRight = 106;
const lineCount = 15;
const rowSpacing = (baseline - cap) / (lineCount - 1);
const columnSpacing = (gridRight - gridLeft) / (lineCount - 1);
const gridColumns = Array.from({ length: lineCount }, (_, index) => String.fromCharCode(65 + index));
const tTransform = { x: 22, y: -0.222, scaleX: 0.86, scaleY: 1.03 };

const contourPath = (segment: TSegment) => {
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

const verticalIntersections = (segments: Segment[], rawX: number) => {
  const intersections: number[] = [];

  for (const segment of segments) {
    let previous = pointAt(segment, 0);
    for (let sample = 1; sample <= 512; sample += 1) {
      const nextT = sample / 512;
      const next = pointAt(segment, nextT);
      if ((previous.x - rawX) * (next.x - rawX) <= 0 && previous.x !== next.x) {
        let low = (sample - 1) / 512;
        let high = nextT;
        for (let iteration = 0; iteration < 32; iteration += 1) {
          const middle = (low + high) / 2;
          if ((pointAt(segment, low).x - rawX) * (pointAt(segment, middle).x - rawX) <= 0) high = middle;
          else low = middle;
        }
        intersections.push(pointAt(segment, (low + high) / 2).y);
      }
      previous = next;
    }
  }

  return [...new Set(intersections.map((y) => y.toFixed(5)))].map(Number).sort((a, b) => a - b);
};

const measureContour = (segments: Segment[], guideX: number): Measurement => {
  const rawX = (guideX - tTransform.x) / tTransform.scaleX;
  const intersections = verticalIntersections(segments, rawX).map((y) => tTransform.y + y * tTransform.scaleY);
  if (intersections.length < 2) return null;
  return {
    spans: Array.from({ length: Math.floor(intersections.length / 2) }, (_, index) => {
      const start = intersections[index * 2];
      const end = intersections[index * 2 + 1];
      return {
        start: Number(start.toFixed(3)),
        end: Number(end.toFixed(3)),
        span: Number((end - start).toFixed(3)),
      };
    }),
  };
};

const contours = {
  roof: parsePath(contourPath("top-bar")),
  left: parsePath(contourPath("left-pillar")),
  right: parsePath(contourPath("right-pillar")),
};
const columns = Array.from({ length: lineCount }, (_, index) => {
  const x = Number((gridLeft + index * columnSpacing).toFixed(4));
  return {
    index: index + 1,
    column: gridColumns[index],
    x,
    roof: measureContour(contours.roof, x),
    left: measureContour(contours.left, x),
    right: measureContour(contours.right, x),
  };
});
const rows = Array.from({ length: lineCount }, (_, index) => Number((cap + index * rowSpacing).toFixed(4)));

const display = (measurement: Measurement) => (measurement ? measurement.spans.map(({ span }) => `${span.toFixed(2)}u`).join(" + ") : "—");
const colors = { roof: "#f1a208", left: "#16b9e8", right: "#f044a7" };
const verticalBrackets = columns
  .flatMap(({ x, roof, left, right }) =>
    ([
      [roof, colors.roof],
      [left, colors.left],
      [right, colors.right],
    ] as const)
      .filter(([measurement]) => measurement !== null)
      .flatMap(([measurement, color]) =>
        measurement.spans.map(
          ({ start, end }) => `<g fill="none" stroke="${color}" stroke-width=".5">
            <line x1="${x}" x2="${x}" y1="${start}" y2="${end}"/>
            <line x1="${x - 1.25}" x2="${x + 1.25}" y1="${start}" y2="${start}"/>
            <line x1="${x - 1.25}" x2="${x + 1.25}" y1="${end}" y2="${end}"/>
          </g>`,
        ),
      ),
  )
  .join("");

const rowLines = rows
  .map((y, index) => `<line x1="${gridLeft}" x2="${gridRight}" y1="${y}" y2="${y}" stroke="#17131b" stroke-width="${index === 0 || index === lineCount - 1 ? ".8" : ".28"}" ${index === 0 || index === lineCount - 1 ? "" : 'stroke-dasharray="1.8 2.2"'}/>`)
  .join("");
const columnLines = columns
  .map(({ x, index }) => `<line x1="${x}" x2="${x}" y1="${cap}" y2="${baseline}" stroke="#17131b" stroke-width="${index === 1 || index === lineCount ? ".65" : ".28"}" ${index === 1 || index === lineCount ? "" : 'stroke-dasharray="1.8 2.2"'}/>`)
  .join("");
const columnLabels = columns
  .map(({ x, column }) => `<text x="${x}" y="110" text-anchor="middle" font-size="2.35">${column}</text>`)
  .join("");
const rowLabels = rows
  .map((y, index) => `<text x="112" y="${y + 0.75}" font-size="2.15">${String(index + 1).padStart(2, "0")}</text>`)
  .join("");
const tableRows = columns
  .map(
    ({ index, column, x, roof, left, right }) => `<text x="142" y="${25 + (index - 1) * 7.2}">${column}</text>
      <text x="158" y="${25 + (index - 1) * 7.2}">${x.toFixed(2)}</text>
      <text x="193" y="${25 + (index - 1) * 7.2}" fill="${colors.roof}">${display(roof)}</text>
      <text x="272" y="${25 + (index - 1) * 7.2}" fill="${colors.left}">${display(left)}</text>
      <text x="348" y="${25 + (index - 1) * 7.2}" fill="${colors.right}">${display(right)}</text>`,
  )
  .join("");

const tracedT = source.match(/const tracedTGroups = `([\s\S]*?)`;/)?.[1];
if (!tracedT) throw new Error("Could not read the T contour groups.");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="4800" height="1800" viewBox="0 0 480 180">
  <rect width="480" height="180" fill="#c5b6f4"/>
  <rect x="${gridLeft}" y="0" width="${gridRight - gridLeft}" height="${cap}" fill="#f8df9e" opacity=".34"/>
  <rect x="${gridLeft}" y="${baseline}" width="${gridRight - gridLeft}" height="12" fill="#f8df9e" opacity=".34"/>
  <g font-family="ui-monospace, SFMono-Regular, Menlo, monospace" fill="#17131b">
    <text x="20" y="8.5" font-size="4.4" letter-spacing=".5">T PILLAR · ADDRESSABLE 15 × 15 GRID</text>
    <text x="20" y="13.1" font-size="2.7" letter-spacing=".18">ADDRESS: A01–O15 · COLUMN STEP: ${columnSpacing.toFixed(3)} MASTER UNITS · VERTICAL INK SPANS</text>
    <text x="4" y="${cap + 1.7}" font-size="3.3">CAP REF</text>
    <text x="4" y="${baseline + 1.7}" font-size="3.3">BASE</text>
    ${rowLines}${columnLines}
    <g fill="#000000">${tracedT}</g>
    ${verticalBrackets}
    <g font-size="2.15" fill="#4b416a">${columnLabels}${rowLabels}</g>
    <text x="${gridLeft}" y="116" font-size="2.45" fill="#4b416a">COLUMN (A–O) →</text>
    <text x="111" y="116" font-size="2.45" fill="#4b416a">ROW</text>
    <rect x="130" y="7" width="337" height="132" fill="#b8a8e5" opacity=".48"/>
    <g font-size="3.1" letter-spacing=".15">
      <text x="142" y="9.8" font-size="3.8" letter-spacing=".45">VERTICAL INTERSECTION SPANS · MASTER UNITS</text>
      <text x="142" y="17" fill="#4b416a">COL</text><text x="158" y="17" fill="#4b416a">X</text><text x="193" y="17" fill="${colors.roof}">ROOF</text><text x="272" y="17" fill="${colors.left}">LEFT</text><text x="348" y="17" fill="${colors.right}">RIGHT</text>
      ${tableRows}
      <text x="142" y="148" font-size="2.75" fill="#4b416a">— = that column does not intersect the named independent contour.</text>
      <text x="142" y="153" font-size="2.75" fill="#4b416a">Multiple values show discrete vertical ink runs at a concavity or terminal turn.</text>
    </g>
  </g>
</svg>`;

const stem = "26-t-grid-15-vertical-measure";
await Bun.write(resolve(output, `${stem}.svg`), `${svg}\n`);
await Bun.write(resolve(output, `${stem}.png`), new Resvg(svg, { fitTo: { mode: "width", value: 4800 } }).render().asPng());
await Bun.write(
  resolve(output, `${stem}.json`),
  `${JSON.stringify(
    {
      source: "compose-alignment-mockup.ts",
      grid: {
        rowCount: lineCount,
        columnCount: lineCount,
        cap,
        baseline,
        left: gridLeft,
        right: gridRight,
        rowSpacing: Number(rowSpacing.toFixed(6)),
        columnSpacing: Number(columnSpacing.toFixed(6)),
      },
      addressing: { columns: gridColumns, rows: rows.map((_y, index) => String(index + 1).padStart(2, "0")), format: "A01–O15" },
      rows: rows.map((y, index) => ({ index: index + 1, y })),
      measurement: "vertical contiguous ink spans of each independent T contour at every grid column",
      columns,
    },
    null,
    2,
  )}\n`,
);
