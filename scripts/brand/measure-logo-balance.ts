import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { PNG } from "pngjs";
import sharp from "sharp";
import {
  BRAND_COLORS,
  generateGoldenSpiral,
  GOLDEN_RATIO,
  GLYPH_PLACEMENTS,
  H_ANIMATION,
  H_PROPORTION,
  H_RATIO_POINT_MATERIAL,
  H_SPIRAL,
  MASTER,
  OPTICAL_PLACEMENT_X,
  createBrandData,
  hSpiralFrame,
  type OpticalProfile,
} from "../../src/brand/thom/geometry";
import { opticalProfileForWidth } from "../../src/brand/thom/opticalProfile";
import { renderGlyphContent, renderLogoSvg } from "../../src/brand/thom/svg";

const GLYPHS = ["t", "h", "o", "m"] as const;
type Glyph = (typeof GLYPHS)[number];
type Bounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
};

const TARGETS = {
  t: { midpoint: 25, band: [12, 38] },
  h: { midpoint: 25, band: [12, 38] },
  o: { midpoint: 25, band: [12, 38] },
  m: { midpoint: 25, band: [12, 38] },
} as const;
const DISPLAY_HEIGHTS = [24, 48, 120] as const;
const SUPERSAMPLE = 8;
const CORE_THRESHOLD = 0.2;
const OCCUPIED_THRESHOLD = 0.012;
const OPTICAL_GAP_THRESHOLD = 0.1;
const OPTICAL_GAP_BLUR_DESIGN_UNITS = 1.25;

const variantArgument = process.argv.find((argument) => argument.startsWith("--variant="));
const variant = (variantArgument?.slice("--variant=".length) || process.env.THOM_BALANCE_VARIANT || "baseline")
  .replace(/[^a-zA-Z0-9._-]/g, "-");
const outputRoot = resolve(process.cwd(), ".codex/audits/logo-balance", variant);

const clamp = (value: number, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value));
const round = (value: number, digits = 6) => Number(value.toFixed(digits));
const srgbToLinear = (value: number) => {
  const channel = value / 255;
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
};
const luminance = (red: number, green: number, blue: number) =>
  0.2126 * srgbToLinear(red) + 0.7152 * srgbToLinear(green) + 0.0722 * srgbToLinear(blue);

function rasterize(svg: string, height: number) {
  const renderer = new Resvg(svg, { fitTo: { mode: "height", value: height } });
  return Buffer.from(renderer.render().asPng());
}

function metricBounds(weights: Float64Array, width: number, height: number, threshold = OCCUPIED_THRESHOLD): Bounds {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let index = 0; index < weights.length; index += 1) {
    if (weights[index] < threshold) continue;
    const x = index % width;
    const y = Math.floor(index / width);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  if (maxX < minX || maxY < minY) {
    return { minX: 0, minY: 0, maxX: -1, maxY: -1, width: 0, height: 0 };
  }
  return { minX, minY, maxX, maxY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

function analyzePng(buffer: Buffer) {
  const png = PNG.sync.read(buffer);
  const weights = new Float64Array(png.width * png.height);
  let energy = 0;
  let alphaArea = 0;
  let coreArea = 0;
  let weightedX = 0;
  let weightedY = 0;
  for (let index = 0; index < weights.length; index += 1) {
    const offset = index * 4;
    const alpha = png.data[offset + 3] / 255;
    const weight = alpha * luminance(png.data[offset], png.data[offset + 1], png.data[offset + 2]);
    weights[index] = weight;
    energy += weight;
    alphaArea += alpha;
    if (weight >= CORE_THRESHOLD) coreArea += 1;
    weightedX += (index % png.width) * weight;
    weightedY += Math.floor(index / png.width) * weight;
  }
  const centroid = {
    x: weightedX / Math.max(energy, 1e-12),
    y: weightedY / Math.max(energy, 1e-12),
  };
  let momentXX = 0;
  let momentYY = 0;
  let momentXY = 0;
  for (let index = 0; index < weights.length; index += 1) {
    const weight = weights[index];
    if (!weight) continue;
    const dx = (index % png.width) - centroid.x;
    const dy = Math.floor(index / png.width) - centroid.y;
    momentXX += dx * dx * weight;
    momentYY += dy * dy * weight;
    momentXY += dx * dy * weight;
  }
  const bounds = metricBounds(weights, png.width, png.height);
  let counterArea = 0;
  if (bounds.width && bounds.height) {
    for (let y = bounds.minY; y <= bounds.maxY; y += 1) {
      for (let x = bounds.minX; x <= bounds.maxX; x += 1) {
        if (weights[y * png.width + x] < OCCUPIED_THRESHOLD) counterArea += 1;
      }
    }
  }
  return {
    png,
    weights,
    energy,
    alphaArea,
    coreArea,
    centroid,
    moments: {
      xx: momentXX / Math.max(energy, 1e-12),
      yy: momentYY / Math.max(energy, 1e-12),
      xy: momentXY / Math.max(energy, 1e-12),
    },
    bounds,
    counterArea,
  };
}

function publicBounds(bounds: Bounds, height: number) {
  const designScale = MASTER.height / height;
  return {
    minX: round(bounds.minX / SUPERSAMPLE * designScale),
    minY: round(bounds.minY / SUPERSAMPLE * designScale),
    maxX: round(bounds.maxX / SUPERSAMPLE * designScale),
    maxY: round(bounds.maxY / SUPERSAMPLE * designScale),
    width: round(bounds.width / SUPERSAMPLE * designScale),
    height: round(bounds.height / SUPERSAMPLE * designScale),
  };
}

function publicMetrics(result: ReturnType<typeof analyzePng>, height: number) {
  const designScale = MASTER.height / height;
  return {
    opticalEnergy: round(result.energy / (SUPERSAMPLE * SUPERSAMPLE)),
    alphaArea: round(result.alphaArea / (SUPERSAMPLE * SUPERSAMPLE)),
    highContrastCoreArea: round(result.coreArea / (SUPERSAMPLE * SUPERSAMPLE)),
    centroid: {
      x: round(result.centroid.x / SUPERSAMPLE * designScale),
      y: round(result.centroid.y / SUPERSAMPLE * designScale),
    },
    secondMoments: {
      xx: round(result.moments.xx / (SUPERSAMPLE * SUPERSAMPLE) * designScale ** 2),
      yy: round(result.moments.yy / (SUPERSAMPLE * SUPERSAMPLE) * designScale ** 2),
      xy: round(result.moments.xy / (SUPERSAMPLE * SUPERSAMPLE) * designScale ** 2),
    },
    occupiedBounds: publicBounds(result.bounds, height),
    counterArea: round(result.counterArea / (SUPERSAMPLE * SUPERSAMPLE) * designScale ** 2),
  };
}

function scoreDistribution(values: Record<Glyph, number>, targets: Record<Glyph, number>) {
  return GLYPHS.reduce(
    (sum, glyph) => sum + Math.abs(values[glyph] - targets[glyph]) / Math.max(targets[glyph], 1e-9),
    0,
  ) / GLYPHS.length;
}

function extractDefs(svg: string) {
  return svg.match(/<defs>[\s\S]*?<\/defs>/)?.[0] ?? "";
}

function svgDocument(content: string, definitions: string, viewBox = `0 0 ${MASTER.width} ${MASTER.height}`) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${definitions}${content}</svg>`;
}

function placedGlyphSvg(
  data: ReturnType<typeof createBrandData>,
  definitions: string,
  glyph: Glyph,
  theme: "dark" | "monochrome",
  profile: OpticalProfile,
) {
  const placement = data.placements[glyph];
  const content = renderGlyphContent(data, glyph, theme, profile);
  const x = placement.x + OPTICAL_PLACEMENT_X[profile][glyph];
  return svgDocument(`<g transform="translate(${x} ${placement.y}) scale(${placement.scaleX} ${placement.scaleY})">${content}</g>`, definitions);
}

async function blurredAlphaBounds(buffer: Buffer, height: number) {
  const sigma = Math.max(0.5, height * SUPERSAMPLE / MASTER.height * OPTICAL_GAP_BLUR_DESIGN_UNITS);
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .extractChannel(3)
    .blur(sigma)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const weights = new Float64Array(info.width * info.height);
  for (let index = 0; index < data.length; index += 1) weights[index] = data[index] / 255;
  return metricBounds(weights, info.width, info.height, OPTICAL_GAP_THRESHOLD);
}

async function comparisonSheet(production: Buffer, monochrome: Buffer, output: string) {
  const width = 1664;
  const background = { r: 5, g: 5, b: 5, alpha: 1 };
  const left = await sharp(production)
    .resize({ width: 800 })
    .extend({ top: 50, bottom: 50, left: 16, right: 16, background })
    .toBuffer();
  const right = await sharp(monochrome)
    .resize({ width: 800 })
    .negate({ alpha: false })
    .extend({ top: 50, bottom: 50, left: 16, right: 16, background })
    .toBuffer();
  await sharp({ create: { width, height: 580, channels: 4, background } })
    .composite([{ input: left, left: 0, top: 0 }, { input: right, left: 832, top: 0 }])
    .png()
    .toFile(output);
}

function labelSvg(width: number, height: number, title: string, subtitle = "") {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="#11100e"/>
    <text x="24" y="38" fill="#f5eee3" font-family="system-ui, sans-serif" font-size="24" font-weight="700">${title}</text>
    <text x="24" y="68" fill="#bcae9a" font-family="ui-monospace, monospace" font-size="18">${subtitle}</text>
  </svg>`);
}

function phaseForProgress(progress: number) {
  return hSpiralFrame(progress).phase;
}

async function animationContactSheet(
  frames: Array<{ buffer: Buffer; ms: number; phase: string }>,
  output: string,
) {
  if (!frames.length) return;
  const metadata = await sharp(frames[0].buffer).metadata();
  const tileWidth = metadata.width!;
  const tileHeight = metadata.height!;
  const labelHeight = 88;
  const columns = 4;
  const rows = Math.ceil(frames.length / columns);
  const background = { r: 5, g: 5, b: 5, alpha: 1 };
  const tiles = await Promise.all(frames.map(async (frame) => sharp({
    create: { width: tileWidth, height: tileHeight + labelHeight, channels: 4, background },
  }).composite([
    { input: labelSvg(tileWidth, labelHeight, frame.phase, `${frame.ms} ms · logarithmic φ spiral`), left: 0, top: 0 },
    { input: frame.buffer, left: 0, top: labelHeight },
  ]).png().toBuffer()));
  await sharp({
    create: { width: tileWidth * columns, height: (tileHeight + labelHeight) * rows, channels: 4, background },
  }).composite(tiles.map((input, index) => ({
    input,
    left: index % columns * tileWidth,
    top: Math.floor(index / columns) * (tileHeight + labelHeight),
  }))).png().toFile(output);
}

async function temporalPlot(
  frames: Array<{ ms: number; opticalEnergy: number; centroid: { x: number } }>,
  settledEnergy: number,
  settledCentroidX: number,
  outputRootPath: string,
) {
  const width = 1440;
  const height = 760;
  const left = 96;
  const right = 48;
  const top = 82;
  const panelHeight = 250;
  const panelGap = 96;
  const plotWidth = width - left - right;
  const x = (ms: number) => left + ms / H_ANIMATION.durationMs * plotWidth;
  const energyY = (energy: number) => top + panelHeight - energy / (settledEnergy * 1.4) * panelHeight;
  const centroidTop = top + panelHeight + panelGap;
  const centroidY = (centroidX: number) => centroidTop + panelHeight / 2
    - (centroidX - settledCentroidX) / 2.5 * (panelHeight / 2);
  const linePath = (points: Array<[number, number]>) => points
    .map(([pointX, pointY], index) => `${index ? "L" : "M"}${round(pointX, 3)} ${round(pointY, 3)}`)
    .join(" ");
  const energyPath = linePath(frames.map((frame) => [x(frame.ms), energyY(frame.opticalEnergy)]));
  const centroidPath = linePath(frames
    .filter((frame) => frame.opticalEnergy > settledEnergy * 0.05)
    .map((frame) => [x(frame.ms), centroidY(frame.centroid.x)]));
  const phaseLines = [
    { progress: H_ANIMATION.revealEnd, label: "H revealed" },
    { progress: H_ANIMATION.traceEnd, label: "trace complete" },
    { progress: H_ANIMATION.holdEnd, label: "fade starts" },
  ];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="#050505"/>
    <text x="${left}" y="42" fill="#f5eee3" font-family="system-ui, sans-serif" font-size="28" font-weight="700">H temporal balance · logarithmic φ spiral</text>
    <text x="${left}" y="68" fill="#bcae9a" font-family="ui-monospace, monospace" font-size="16">25 ms cadence · 0–${H_ANIMATION.durationMs} ms · target energy ${round(settledEnergy, 3)}</text>
    <rect x="${left}" y="${energyY(settledEnergy * 1.35)}" width="${plotWidth}" height="${energyY(settledEnergy) - energyY(settledEnergy * 1.35)}" fill="#6fa879" opacity=".14"/>
    <line x1="${left}" x2="${width - right}" y1="${energyY(settledEnergy)}" y2="${energyY(settledEnergy)}" stroke="#8fbf96" stroke-dasharray="8 8" opacity=".8"/>
    <path d="${energyPath}" fill="none" stroke="#e1bc78" stroke-width="4"/>
    <text x="24" y="${top + 18}" fill="#d5c7b5" font-family="system-ui, sans-serif" font-size="18" transform="rotate(-90 24 ${top + 18})">optical energy</text>
    <rect x="${left}" y="${centroidY(settledCentroidX + 2)}" width="${plotWidth}" height="${centroidY(settledCentroidX - 2) - centroidY(settledCentroidX + 2)}" fill="#6f8fa8" opacity=".12"/>
    <line x1="${left}" x2="${width - right}" y1="${centroidY(settledCentroidX)}" y2="${centroidY(settledCentroidX)}" stroke="#8cb8d1" stroke-dasharray="8 8" opacity=".8"/>
    <path d="${centroidPath}" fill="none" stroke="#8fc7dc" stroke-width="4"/>
    <text x="24" y="${centroidTop + 62}" fill="#d5c7b5" font-family="system-ui, sans-serif" font-size="18" transform="rotate(-90 24 ${centroidTop + 62})">centroid x</text>
    ${phaseLines.map(({ progress, label }) => {
      const lineX = x(progress * H_ANIMATION.durationMs);
      return `<line x1="${lineX}" x2="${lineX}" y1="${top}" y2="${centroidTop + panelHeight}" stroke="#ffffff" opacity=".18"/><text x="${lineX + 8}" y="${centroidTop + panelHeight + 28}" fill="#9d9183" font-family="ui-monospace, monospace" font-size="14">${label}</text>`;
    }).join("")}
    ${Array.from({ length: 11 }, (_, index) => index * H_ANIMATION.durationMs / 10).map((ms) => `<text x="${x(ms)}" y="${height - 28}" fill="#9d9183" font-family="ui-monospace, monospace" font-size="14" text-anchor="middle">${ms} ms</text>`).join("")}
  </svg>`;
  await Bun.write(resolve(outputRootPath, "h-animation-plot.svg"), `${svg}\n`);
  await sharp(Buffer.from(svg)).png().toFile(resolve(outputRootPath, "h-animation-plot.png"));
}

async function multiscaleComparison(
  scenarios: Array<{ label: string; detail: string; buffer: Buffer }>,
  output: string,
) {
  const width = 1920;
  const rowHeight = 360;
  const labelWidth = 420;
  const background = { r: 5, g: 5, b: 5, alpha: 1 };
  const rows = await Promise.all(scenarios.map(async (scenario) => {
    const artwork = await sharp(scenario.buffer)
      .resize({ width: width - labelWidth - 80, height: rowHeight - 64, fit: "contain", withoutEnlargement: true })
      .toBuffer();
    const artworkMetadata = await sharp(artwork).metadata();
    return sharp({ create: { width, height: rowHeight, channels: 4, background } }).composite([
      { input: labelSvg(labelWidth, rowHeight, scenario.label, scenario.detail), left: 0, top: 0 },
      {
        input: artwork,
        left: labelWidth + 40,
        top: Math.round((rowHeight - artworkMetadata.height!) / 2),
      },
    ]).png().toBuffer();
  }));
  await sharp({ create: { width, height: rowHeight * rows.length, channels: 4, background } })
    .composite(rows.map((input, index) => ({ input, left: 0, top: index * rowHeight })))
    .png()
    .toFile(output);
}

function spiralFrameSvg(hContent: string, definitions: string, progress: number) {
  const frame = hSpiralFrame(progress);
  const points = generateGoldenSpiral();
  const traceIndex = Math.min(points.length - 1, Math.floor(frame.trace * (points.length - 1)));
  const tracedPoints = points.slice(0, Math.max(2, traceIndex + 1));
  const path = tracedPoints.map((point, index) => `${index ? "L" : "M"}${round(point.x, 4)} ${round(point.y, 4)}`).join(" ");
  const tracer = points[traceIndex];
  const ratioPointOpacity = round(H_RATIO_POINT_MATERIAL.opacity * frame.ratioPointOpacity);
  const resolvedHContent = hContent.replace(
    /opacity="0\.3" data-h-part="ratio-point"/,
    `opacity="${ratioPointOpacity}" data-h-part="ratio-point"`,
  );
  return svgDocument(
    `<path d="${path}" fill="none" stroke="${BRAND_COLORS.gold}" stroke-width="${H_SPIRAL.halo.width}" stroke-linecap="round" opacity="${round(frame.shellOpacity * H_SPIRAL.halo.opacity)}"/><path d="${path}" fill="none" stroke="${BRAND_COLORS.gold}" stroke-width="${H_SPIRAL.core.width}" stroke-linecap="round" opacity="${round(frame.shellOpacity * H_SPIRAL.core.opacity)}"/><circle cx="${round(tracer.x, 4)}" cy="${round(tracer.y, 4)}" r="${round(1.05 * frame.tracerScale, 4)}" fill="${BRAND_COLORS.gold}" opacity="${round(frame.tracerOpacity * 0.92)}"/><g opacity="${frame.reveal}">${resolvedHContent}</g>`,
    definitions,
    "0 0 100 120",
  );
}

await mkdir(outputRoot, { recursive: true });
const generation = Bun.spawnSync(["bun", "run", "generate:brand"], {
  cwd: process.cwd(),
  stdout: "pipe",
  stderr: "pipe",
});
if (generation.exitCode !== 0) {
  throw new Error(`Brand generation failed:\n${generation.stderr.toString()}`);
}

const data = createBrandData();
const definitions = extractDefs(renderLogoSvg(data));
const sizeReports: Record<string, unknown> = {};
const scoreInputs: Record<string, { mass: number; core: number; moments: number; gaps: number }> = {};

for (const height of DISPLAY_HEIGHTS) {
  const renderHeight = height * SUPERSAMPLE;
  const renderedWidth = height * MASTER.width / MASTER.height;
  const profile = opticalProfileForWidth(renderedWidth);
  const production = rasterize(renderLogoSvg(data, "dark", profile), renderHeight);
  const monochrome = rasterize(renderLogoSvg(data, "monochrome", profile), renderHeight);
  await Bun.write(resolve(outputRoot, `production-${height}px@8x.png`), production);
  await Bun.write(resolve(outputRoot, `monochrome-${height}px@8x.png`), monochrome);
  const full = PNG.sync.read(production);
  const glyphMetrics = {} as Record<
    Glyph,
    ReturnType<typeof publicMetrics> & {
      share: number;
      opticalBounds: ReturnType<typeof publicBounds>;
      opticalSidebearings: { left: number; right: number };
    }
  >;
  const raw = {} as Record<Glyph, ReturnType<typeof analyzePng>>;
  const opticalBounds = {} as Record<Glyph, Bounds>;
  for (const glyph of GLYPHS) {
    const glyphProduction = rasterize(placedGlyphSvg(data, definitions, glyph, "dark", profile), renderHeight);
    const glyphMonochrome = rasterize(placedGlyphSvg(data, definitions, glyph, "monochrome", profile), renderHeight);
    raw[glyph] = analyzePng(glyphProduction);
    opticalBounds[glyph] = await blurredAlphaBounds(glyphMonochrome, height);
  }
  const totalEnergy = GLYPHS.reduce((sum, glyph) => sum + raw[glyph].energy, 0);
  const designScale = MASTER.height / height;
  for (const glyph of GLYPHS) {
    const metrics = publicMetrics(raw[glyph], height);
    const placement = GLYPH_PLACEMENTS[glyph];
    const placementX = placement.x + OPTICAL_PLACEMENT_X[profile][glyph];
    glyphMetrics[glyph] = {
      ...metrics,
      share: round(raw[glyph].energy / totalEnergy * 100, 4),
      opticalBounds: publicBounds(opticalBounds[glyph], height),
      opticalSidebearings: {
        left: round(metrics.occupiedBounds.minX - placementX),
        right: round(placementX + placement.width - metrics.occupiedBounds.maxX),
      },
    };
  }
  const gapValues = GLYPHS.slice(0, -1).map((glyph, index) => {
    const next = GLYPHS[index + 1];
    return (opticalBounds[next].minX - opticalBounds[glyph].maxX - 1) / SUPERSAMPLE * designScale;
  });
  const gapMean = gapValues.reduce((sum, gap) => sum + gap, 0) / gapValues.length;
  const shares = Object.fromEntries(GLYPHS.map((glyph) => [glyph, glyphMetrics[glyph].share])) as Record<Glyph, number>;
  const cores = Object.fromEntries(
    GLYPHS.map((glyph) => [glyph, glyphMetrics[glyph].highContrastCoreArea]),
  ) as Record<Glyph, number>;
  const coreTotal = Object.values(cores).reduce((sum, value) => sum + value, 0);
  const coreShares = Object.fromEntries(
    GLYPHS.map((glyph) => [glyph, cores[glyph] / Math.max(coreTotal, 1e-9) * 100]),
  ) as Record<Glyph, number>;
  const momentValues = Object.fromEntries(
    GLYPHS.map((glyph) => [
      glyph,
      Math.sqrt(glyphMetrics[glyph].secondMoments.xx + glyphMetrics[glyph].secondMoments.yy),
    ]),
  ) as Record<Glyph, number>;
  const momentMean = Object.values(momentValues).reduce((sum, value) => sum + value, 0) / GLYPHS.length;
  scoreInputs[String(height)] = {
    mass: scoreDistribution(
      shares,
      Object.fromEntries(GLYPHS.map((glyph) => [glyph, TARGETS[glyph].midpoint])) as Record<Glyph, number>,
    ),
    core: scoreDistribution(
      coreShares,
      Object.fromEntries(GLYPHS.map((glyph) => [glyph, TARGETS[glyph].midpoint])) as Record<Glyph, number>,
    ),
    moments: Object.values(momentValues).reduce(
      (sum, value) => sum + Math.abs(value - momentMean) / momentMean,
      0,
    ) / GLYPHS.length,
    gaps: gapValues.reduce(
      (sum, gap) => sum + Math.abs(gap - gapMean) / Math.max(Math.abs(gapMean), 1e-9),
      0,
    ) / gapValues.length,
  };
  sizeReports[String(height)] = {
    render: {
      displayHeight: height,
      renderedWidth: round(renderedWidth),
      opticalProfile: profile,
      supersample: SUPERSAMPLE,
      rasterWidth: full.width,
      rasterHeight: full.height,
    },
    totalOpticalEnergy: round(totalEnergy / (SUPERSAMPLE * SUPERSAMPLE)),
    glyphs: glyphMetrics,
    opticalGaps: {
      method: `monochrome alpha, Gaussian sigma ${OPTICAL_GAP_BLUR_DESIGN_UNITS} design units, threshold ${OPTICAL_GAP_THRESHOLD}`,
      values: gapValues.map((value) => round(value)),
      mean: round(gapMean),
      maximumDeviationRatio: round(
        Math.max(...gapValues.map((value) => Math.abs(value - gapMean) / Math.max(Math.abs(gapMean), 1e-9))),
      ),
    },
  };
}

const hContent = renderGlyphContent(data, "h");
const crossbarData = {
  ...data,
  h: {
    ...data.h,
    paths: [],
    proportion: { ...data.h.proportion, ticks: [], brace: [] },
  },
};
const aData = {
  ...crossbarData,
  h: { ...crossbarData.h, proportion: { ...crossbarData.h.proportion, b: [] } },
};
const bData = {
  ...crossbarData,
  h: { ...crossbarData.h, proportion: { ...crossbarData.h.proportion, a: [] } },
};
const crossbar = analyzePng(
  rasterize(svgDocument(renderGlyphContent(crossbarData, "h"), definitions, "0 0 100 120"), MASTER.height * SUPERSAMPLE),
);
const aCrossbar = analyzePng(
  rasterize(svgDocument(renderGlyphContent(aData, "h"), definitions, "0 0 100 120"), MASTER.height * SUPERSAMPLE),
);
const bCrossbar = analyzePng(
  rasterize(svgDocument(renderGlyphContent(bData, "h"), definitions, "0 0 100 120"), MASTER.height * SUPERSAMPLE),
);
const multiscaleSurvival: Record<string, unknown> = {};
for (const height of [24, 48] as const) {
  const renderHeight = height * SUPERSAMPLE;
  const renderedWidth = height * MASTER.width / MASTER.height;
  const profile = opticalProfileForWidth(renderedWidth);
  const hCrossbarData = {
    ...data,
    h: {
      ...data.h,
      paths: [],
    },
  };
  const emptyNetwork = (network: typeof data.o.canonical) => ({
    ...network,
    anchors: [],
    chords: [],
    intersections: [],
    highlights: [],
  });
  const oCircleData = {
    ...data,
    o: {
      ...data.o,
      canonical: emptyNetwork(data.o.canonical),
      compact: emptyNetwork(data.o.compact),
    },
  };
  const oNetworkData = { ...data, o: { ...data.o, circle: [] } };
  const featureMetrics = (content: string, glyph: Glyph) => {
    const placement = data.placements[glyph];
    const x = placement.x + OPTICAL_PLACEMENT_X[profile][glyph];
    return publicMetrics(analyzePng(rasterize(svgDocument(
      `<g transform="translate(${x} ${placement.y}) scale(${placement.scaleX} ${placement.scaleY})">${content}</g>`,
      definitions,
    ), renderHeight)), height);
  };
  const hMarkup = renderGlyphContent(data, "h", "dark", profile);
  const features = {
    hCrossbar: featureMetrics(renderGlyphContent(hCrossbarData, "h", "dark", profile), "h"),
    oCircumference: featureMetrics(renderGlyphContent(oCircleData, "o", "dark", profile), "o"),
    oNetwork: featureMetrics(renderGlyphContent(oNetworkData, "o", "dark", profile), "o"),
    mMark: featureMetrics(renderGlyphContent(data, "m", "dark", profile), "m"),
  };
  multiscaleSurvival[String(height)] = {
    renderedWidth: round(renderedWidth),
    opticalProfile: profile,
    features,
    acceptance: {
      hCrossbarVisible: features.hCrossbar.highContrastCoreArea > 0 && features.hCrossbar.occupiedBounds.width > 0,
      hRatioDetailsSuppressed: !hMarkup.includes("ratio-point") && !hMarkup.includes("unit-brace") && !hMarkup.includes("tick-"),
      oCircumferenceVisible: features.oCircumference.highContrastCoreArea > 0,
      oNetworkVisible: features.oNetwork.opticalEnergy > 0 && features.oNetwork.occupiedBounds.width > 0,
      mMarkVisible: features.mMark.highContrastCoreArea > 0 && features.mMark.occupiedBounds.width > 0,
    },
  };
}
const temporalFrames = [];
const temporalPngs: Array<{ buffer: Buffer; ms: number; phase: string }> = [];
let finalSpiralFrame = Buffer.alloc(0);
for (let ms = 0; ms <= H_ANIMATION.durationMs; ms += 25) {
  const progress = ms / H_ANIMATION.durationMs;
  const frame = rasterize(spiralFrameSvg(hContent, definitions, progress), MASTER.height * SUPERSAMPLE);
  if (ms === H_ANIMATION.durationMs) finalSpiralFrame = frame;
  const metrics = analyzePng(frame);
  temporalFrames.push({ ms, progress: round(progress), ...publicMetrics(metrics, MASTER.height) });
  if ([0, 100, 175, 350, 675, 750, 825, 900, 1000].includes(ms)) {
    temporalPngs.push({ buffer: frame, ms, phase: phaseForProgress(progress) });
  }
}
const settled = temporalFrames.at(-1)!;
const settledEnergy = settled.opticalEnergy;
const postRevealFrames = temporalFrames.filter((frame) => frame.progress >= H_ANIMATION.revealEnd);
const peakEnergyRatio = Math.max(...postRevealFrames.map((frame) => frame.opticalEnergy)) / Math.max(settledEnergy, 1e-9);
const motionCentroidDrift = Math.max(
  ...postRevealFrames.map((frame) => Math.abs(frame.centroid.x - settled.centroid.x)),
);
const recognizableCoreAfterReveal = postRevealFrames.every((frame) => frame.highContrastCoreArea > 0);
const settledHFrame = rasterize(svgDocument(hContent, definitions, "0 0 100 120"), MASTER.height * SUPERSAMPLE);
const finalMatchesSettled = finalSpiralFrame.equals(settledHFrame);
const spiralPoints = generateGoldenSpiral();
const quarterTurnRadii = Array.from({ length: H_SPIRAL.quarterTurns }, (_, index) => {
  const point = spiralPoints[(index + 1) * H_SPIRAL.segments / H_SPIRAL.quarterTurns];
  return Math.hypot(point.x - H_PROPORTION.splitX, point.y - H_PROPORTION.y);
});
const maximumQuarterTurnRatioError = Math.max(
  ...quarterTurnRadii.slice(1).map((radius, index) => Math.abs(radius / quarterTurnRadii[index] - GOLDEN_RATIO)),
);
const motionScore = Math.max(0, peakEnergyRatio - 1) + 0.125 * motionCentroidDrift;

await animationContactSheet(temporalPngs, resolve(outputRoot, "h-animation-contact-sheet.png"));
await temporalPlot(temporalFrames, settledEnergy, settled.centroid.x, outputRoot);

const settledDesktop = rasterize(renderLogoSvg(data), 120 * SUPERSAMPLE);
const compact = rasterize(renderLogoSvg(data, "dark", "compact"), 48 * SUPERSAMPLE);
const mobile = rasterize(renderLogoSvg(data, "dark", "micro"), 24 * SUPERSAMPLE);
const reducedMotion = rasterize(renderLogoSvg(data), 120 * SUPERSAMPLE);
const staticFallback = rasterize(renderLogoSvg(data), 120 * SUPERSAMPLE);
await multiscaleComparison([
  { label: "Desktop", detail: "120 px · full settled construction", buffer: settledDesktop },
  { label: "Compact", detail: "48 px · compact deterministic SVG", buffer: compact },
  { label: "Mobile", detail: "24 px · compact deterministic SVG", buffer: mobile },
  { label: "Reduced motion", detail: "120 px · immediate settled state", buffer: reducedMotion },
  { label: "Static fallback", detail: "120 px · thom-master.svg", buffer: staticFallback },
], resolve(outputRoot, "responsive-motion-static-comparison.png"));

const sizeScores = Object.values(scoreInputs);
const components = {
  mass: sizeScores.reduce((sum, score) => sum + score.mass, 0) / sizeScores.length,
  core: sizeScores.reduce((sum, score) => sum + score.core, 0) / sizeScores.length,
  moments: sizeScores.reduce((sum, score) => sum + score.moments, 0) / sizeScores.length,
  gaps: sizeScores.reduce((sum, score) => sum + score.gaps, 0) / sizeScores.length,
  motion: motionScore,
};
const aggregate = 0.4 * components.mass
  + 0.2 * components.core
  + 0.15 * components.moments
  + 0.1 * components.gaps
  + 0.15 * components.motion;
const revision = Bun.spawnSync(["git", "rev-parse", "HEAD"], { stdout: "pipe" }).stdout.toString().trim();
const report = {
  schemaVersion: 1,
  variant,
  revision,
  command: `bun run measure:brand:balance --variant=${variant}`,
  environment: {
    viewport: `${MASTER.width}x${MASTER.height}`,
    pixelRatio: SUPERSAMPLE,
    renderEngine: "@resvg/resvg-js",
    colorSpace: "sRGB decoded to linear-light luminance",
  },
  targets: TARGETS,
  targetPolicy: "Equal-share is a robustness reference, not a universal aesthetic target; broad bands catch collapse or domination.",
  sizes: sizeReports,
  hCrossbar: {
    authoredCenterX: 50,
    opticalCentroidX: round(crossbar.centroid.x / SUPERSAMPLE),
    centroidOffset: round(crossbar.centroid.x / SUPERSAMPLE - 50),
    geometricSplitX: round(H_PROPORTION.splitX),
    ratio: round(H_PROPORTION.aLength / H_PROPORTION.bLength),
    energyPerUnit: {
      a: round(aCrossbar.energy / H_PROPORTION.aLength),
      b: round(bCrossbar.energy / H_PROPORTION.bLength),
      ratio: round(
        (aCrossbar.energy / H_PROPORTION.aLength) / (bCrossbar.energy / H_PROPORTION.bLength),
      ),
    },
  },
  temporal: {
    strategy: "logarithmic-golden-spiral",
    strategyParameters: H_SPIRAL,
    durationMs: H_ANIMATION.durationMs,
    cadenceMs: 25,
    settledEnergy,
    peakEnergyRatio: round(peakEnergyRatio),
    maximumCentroidDrift: round(motionCentroidDrift),
    maximumQuarterTurnRatioError: round(maximumQuarterTurnRatioError, 12),
    recognizableCoreAfterReveal,
    finalMatchesSettled,
    acceptance: {
      cadenceAndDuration: temporalFrames.length === 41
        && temporalFrames[0]?.ms === 0
        && temporalFrames.at(-1)?.ms === H_ANIMATION.durationMs,
      peakEnergyWithinThirtyFivePercent: peakEnergyRatio <= 1.35,
      centroidWithinTwoDesignUnits: motionCentroidDrift <= 2,
      goldenRatioPerQuarterTurn: maximumQuarterTurnRatioError <= 1e-6,
      recognizableCoreAfterReveal,
      finalMatchesSettled,
    },
    frames: temporalFrames,
  },
  multiscaleSurvival,
  fallbackParity: {
    reducedMotionMatchesSettled: reducedMotion.equals(settledDesktop),
    staticFallbackMatchesSettled: staticFallback.equals(settledDesktop),
  },
  score: {
    formula: "0.40*mass + 0.20*core + 0.15*moments + 0.10*gaps + 0.15*motion",
    components: Object.fromEntries(Object.entries(components).map(([key, value]) => [key, round(value)])),
    aggregate: round(aggregate),
  },
};

await Bun.write(resolve(outputRoot, "metrics.json"), `${JSON.stringify(report, null, 2)}\n`);
await comparisonSheet(
  rasterize(renderLogoSvg(data), MASTER.height * SUPERSAMPLE),
  rasterize(renderLogoSvg(data, "monochrome"), MASTER.height * SUPERSAMPLE),
  resolve(outputRoot, "production-monochrome-comparison.png"),
);
await Bun.write(
  resolve(outputRoot, "index.html"),
  `<!doctype html><meta charset="utf-8"><title>THOM ${variant}</title><style>body{background:#050505;color:#eee;font:14px system-ui;padding:24px}img{max-width:100%;display:block;margin:16px 0;background:#050505}</style><h1>THOM logo balance: ${variant}</h1><p>Revision ${revision}</p>${DISPLAY_HEIGHTS.map((height) => `<h2>${height}px @ 8x</h2><img src="production-${height}px@8x.png"><img src="monochrome-${height}px@8x.png">`).join("")}<h2>H animation phases</h2><img src="h-animation-contact-sheet.png"><h2>Temporal plot</h2><img src="h-animation-plot.png"><h2>Responsive, reduced-motion, and static states</h2><img src="responsive-motion-static-comparison.png"><pre>${JSON.stringify(report.score, null, 2)}</pre>`,
);

console.log(JSON.stringify({ variant, revision, output: outputRoot, score: report.score }, null, 2));
