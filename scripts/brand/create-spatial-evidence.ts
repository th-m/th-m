import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const GLYPHS = ["t", "h", "o", "m"] as const;
const DISPLAY_HEIGHTS = [24, 48, 120] as const;
const CANVAS_WIDTH = 1664;
const ROW_HEIGHT = 480;
const GLYPH_COLORS = ["#ff6688", "#66d9ff", "#9cff77", "#c79cff"] as const;

type Glyph = (typeof GLYPHS)[number];
type Point = { x: number; y: number };
type Bounds = { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number };
type GlyphMetric = {
  share: number;
  centroid: Point;
  secondMoments: { xx: number; yy: number; xy: number };
  occupiedBounds: Bounds;
  opticalBounds: Bounds;
  opticalSidebearings: { left: number; right: number };
  counterArea: number;
};
type SizeReport = {
  glyphs: Record<Glyph, GlyphMetric>;
  opticalGaps: { values: number[]; mean: number; maximumDeviationRatio: number };
};
type MetricsReport = {
  variant: string;
  revision: string;
  sizes: Record<string, SizeReport>;
  score: unknown;
};

function argument(name: string, fallback: string) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length) ?? fallback;
}

const beforeVariant = argument("before", "spatial-before");
const afterVariant = argument("after", "spatial");
const auditRoot = resolve(process.cwd(), ".codex/audits/logo-balance");
const beforeRoot = resolve(auditRoot, beforeVariant);
const afterRoot = resolve(auditRoot, afterVariant);
const outputRoot = resolve(auditRoot, argument("output", afterVariant));
const before = await Bun.file(resolve(beforeRoot, "metrics.json")).json() as MetricsReport;
const after = await Bun.file(resolve(afterRoot, "metrics.json")).json() as MetricsReport;

const round = (value: number, digits = 6) => Number(value.toFixed(digits));

function momentEllipse(metric: GlyphMetric) {
  const { xx, yy, xy } = metric.secondMoments;
  const trace = xx + yy;
  const discriminant = Math.sqrt(Math.max(0, (xx - yy) ** 2 + 4 * xy ** 2));
  return {
    rx: Math.sqrt(Math.max(0, (trace + discriminant) / 2)),
    ry: Math.sqrt(Math.max(0, (trace - discriminant) / 2)),
    angle: 0.5 * Math.atan2(2 * xy, xx - yy) * 180 / Math.PI,
  };
}

function overlaySvg(label: string, report: SizeReport) {
  const sidebearingFields = GLYPHS.map((glyph) => {
    const metric = report.glyphs[glyph];
    const advanceStart = metric.occupiedBounds.minX - metric.opticalSidebearings.left;
    const advanceEnd = metric.occupiedBounds.maxX + metric.opticalSidebearings.right;
    return `<rect x="${advanceStart}" y="4" width="${metric.opticalSidebearings.left}" height="112" fill="#45a3ff" opacity=".12"/>
      <rect x="${metric.occupiedBounds.maxX}" y="4" width="${metric.opticalSidebearings.right}" height="112" fill="#45a3ff" opacity=".12"/>
      <line x1="${advanceStart}" y1="4" x2="${advanceStart}" y2="116" stroke="#45a3ff" stroke-width=".35" stroke-dasharray="1 1"/>
      <line x1="${advanceEnd}" y1="4" x2="${advanceEnd}" y2="116" stroke="#45a3ff" stroke-width=".35" stroke-dasharray="1 1"/>`;
  }).join("");
  const gapFields = GLYPHS.slice(0, -1).map((glyph, index) => {
    const next = GLYPHS[index + 1];
    const start = report.glyphs[glyph].opticalBounds.maxX;
    const end = report.glyphs[next].opticalBounds.minX;
    const gap = report.opticalGaps.values[index];
    return `<rect x="${start}" y="4" width="${Math.max(0, end - start)}" height="112" fill="#ffc857" opacity=".13"/>
      <text x="${(start + end) / 2}" y="114" text-anchor="middle" fill="#ffc857" font-size="3.6">${gap.toFixed(3)}</text>`;
  }).join("");
  const metricFields = GLYPHS.map((glyph, index) => {
    const metric = report.glyphs[glyph];
    const ellipse = momentEllipse(metric);
    const color = GLYPH_COLORS[index];
    return `<rect x="${metric.occupiedBounds.minX}" y="${metric.occupiedBounds.minY}" width="${metric.occupiedBounds.width}" height="${metric.occupiedBounds.height}" fill="none" stroke="#ffffff" stroke-width=".3" stroke-dasharray="1.2 1.2" opacity=".65"/>
      <rect x="${metric.opticalBounds.minX}" y="${metric.opticalBounds.minY}" width="${metric.opticalBounds.width}" height="${metric.opticalBounds.height}" fill="none" stroke="${color}" stroke-width=".45" opacity=".9"/>
      <ellipse cx="${metric.centroid.x}" cy="${metric.centroid.y}" rx="${ellipse.rx}" ry="${ellipse.ry}" fill="none" stroke="${color}" stroke-width=".45" opacity=".75" transform="rotate(${ellipse.angle} ${metric.centroid.x} ${metric.centroid.y})"/>
      <line x1="${metric.centroid.x - 2.2}" y1="${metric.centroid.y}" x2="${metric.centroid.x + 2.2}" y2="${metric.centroid.y}" stroke="${color}" stroke-width=".55"/>
      <line x1="${metric.centroid.x}" y1="${metric.centroid.y - 2.2}" x2="${metric.centroid.x}" y2="${metric.centroid.y + 2.2}" stroke="${color}" stroke-width=".55"/>
      <circle cx="${metric.centroid.x}" cy="${metric.centroid.y}" r="1.1" fill="#050505" stroke="${color}" stroke-width=".55"/>
      <text x="${metric.centroid.x}" y="${Math.max(7, metric.opticalBounds.minY - 2)}" text-anchor="middle" fill="${color}" font-size="3.5">${glyph.toUpperCase()} ${metric.centroid.x.toFixed(2)},${metric.centroid.y.toFixed(2)}</text>`;
  }).join("");
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS_WIDTH}" height="${ROW_HEIGHT}" viewBox="0 0 416 120">
    <rect width="416" height="120" fill="none"/>
    ${sidebearingFields}${gapFields}${metricFields}
    <rect x="3" y="3" width="68" height="7" rx="1" fill="#050505" opacity=".82"/>
    <text x="6" y="8" fill="#ffffff" font-family="system-ui,sans-serif" font-size="4.5">${label}</text>
  </svg>`);
}

async function annotatedRow(root: string, height: number, label: string, report: SizeReport) {
  const logo = await sharp(resolve(root, `production-${height}px@8x.png`))
    .resize(CANVAS_WIDTH, ROW_HEIGHT, { fit: "fill" })
    .toBuffer();
  return sharp({ create: { width: CANVAS_WIDTH, height: ROW_HEIGHT, channels: 4, background: "#050505" } })
    .composite([{ input: logo }, { input: overlaySvg(label, report) }])
    .png()
    .toBuffer();
}

await mkdir(outputRoot, { recursive: true });
const overlayBuffers: Buffer[] = [];
for (const height of DISPLAY_HEIGHTS) {
  const beforeRow = await annotatedRow(beforeRoot, height, `${before.variant} · ${height}px`, before.sizes[String(height)]);
  const afterRow = await annotatedRow(afterRoot, height, `${after.variant} · ${height}px`, after.sizes[String(height)]);
  const output = await sharp({
    create: { width: CANVAS_WIDTH, height: ROW_HEIGHT * 2 + 8, channels: 4, background: "#151515" },
  }).composite([
    { input: beforeRow, top: 0, left: 0 },
    { input: afterRow, top: ROW_HEIGHT + 8, left: 0 },
  ]).png().toBuffer();
  overlayBuffers.push(output);
  await Bun.write(resolve(outputRoot, `spatial-overlay-${height}px.png`), output);
}

const overlayHeight = ROW_HEIGHT * 2 + 8;
await sharp({
  create: { width: CANVAS_WIDTH, height: overlayHeight * overlayBuffers.length, channels: 4, background: "#151515" },
}).composite(overlayBuffers.map((input, index) => ({ input, left: 0, top: index * overlayHeight }))).png()
  .toFile(resolve(outputRoot, "spatial-overlays-contact-sheet.png"));

const comparison = {
  schemaVersion: 1,
  command: `bun run evidence:brand:spatial --before=${beforeVariant} --after=${afterVariant} --output=${argument("output", afterVariant)}`,
  before: { variant: before.variant, revision: before.revision, score: before.score },
  after: { variant: after.variant, revision: after.revision, score: after.score },
  sizes: Object.fromEntries(DISPLAY_HEIGHTS.map((height) => {
    const size = String(height);
    const beforeSize = before.sizes[size];
    const afterSize = after.sizes[size];
    return [size, {
      gaps: { before: beforeSize.opticalGaps, after: afterSize.opticalGaps },
      glyphs: Object.fromEntries(GLYPHS.map((glyph) => {
        const beforeMetric = beforeSize.glyphs[glyph];
        const afterMetric = afterSize.glyphs[glyph];
        return [glyph, {
          before: beforeMetric,
          after: afterMetric,
          delta: {
            share: round(afterMetric.share - beforeMetric.share),
            centroid: {
              x: round(afterMetric.centroid.x - beforeMetric.centroid.x),
              y: round(afterMetric.centroid.y - beforeMetric.centroid.y),
            },
            secondMoments: {
              xx: round(afterMetric.secondMoments.xx - beforeMetric.secondMoments.xx),
              yy: round(afterMetric.secondMoments.yy - beforeMetric.secondMoments.yy),
              xy: round(afterMetric.secondMoments.xy - beforeMetric.secondMoments.xy),
            },
            counterArea: round(afterMetric.counterArea - beforeMetric.counterArea),
            opticalFootprint: {
              width: round(afterMetric.opticalBounds.width - beforeMetric.opticalBounds.width),
              height: round(afterMetric.opticalBounds.height - beforeMetric.opticalBounds.height),
            },
          },
        }];
      })),
    }];
  })),
};

await Bun.write(resolve(outputRoot, "spatial-comparison.json"), `${JSON.stringify(comparison, null, 2)}\n`);
console.log(JSON.stringify({ output: outputRoot, files: [...DISPLAY_HEIGHTS.map((height) => `spatial-overlay-${height}px.png`), "spatial-overlays-contact-sheet.png", "spatial-comparison.json"] }, null, 2));
