import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { PNG } from "pngjs";
import sharp from "sharp";
import {
  GLYPH_PLACEMENTS,
  H_ANIMATION,
  H_PROPORTION,
  MASTER,
  createBrandData,
} from "../../src/brand/thom/geometry";
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
  t: { midpoint: 32, band: [31, 33] },
  h: { midpoint: 26.5, band: [25, 28] },
  o: { midpoint: 17, band: [16, 18] },
  m: { midpoint: 25.5, band: [24, 27] },
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
) {
  const placement = data.placements[glyph];
  const content = renderGlyphContent(data, glyph, theme);
  return svgDocument(`<g transform="translate(${placement.x} 0) scale(${placement.scaleX} 1)">${content}</g>`, definitions);
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

function phiFrameSvg(hContent: string, definitions: string, phiHref: string, progress: number) {
  const phiIn = clamp(progress / H_ANIMATION.phiFadeInEnd);
  const phiOut = 1 - clamp(
    (progress - H_ANIMATION.phiHoldEnd) / (H_ANIMATION.crossfadeEnd - H_ANIMATION.phiHoldEnd),
  );
  const phiOpacity = phiIn * phiOut;
  const hOpacity = clamp(
    (progress - H_ANIMATION.phiHoldEnd) / (H_ANIMATION.crossfadeEnd - H_ANIMATION.phiHoldEnd),
  );
  return svgDocument(
    `<g opacity="${hOpacity}">${hContent}</g><image href="${phiHref}" x="29" y="28" width="42" height="64" opacity="${phiOpacity}"/>`,
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
  const production = rasterize(renderLogoSvg(data), renderHeight);
  const monochrome = rasterize(renderLogoSvg(data, "monochrome"), renderHeight);
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
    const glyphProduction = rasterize(placedGlyphSvg(data, definitions, glyph, "dark"), renderHeight);
    const glyphMonochrome = rasterize(placedGlyphSvg(data, definitions, glyph, "monochrome"), renderHeight);
    raw[glyph] = analyzePng(glyphProduction);
    opticalBounds[glyph] = await blurredAlphaBounds(glyphMonochrome, height);
  }
  const totalEnergy = GLYPHS.reduce((sum, glyph) => sum + raw[glyph].energy, 0);
  const designScale = MASTER.height / height;
  for (const glyph of GLYPHS) {
    const metrics = publicMetrics(raw[glyph], height);
    const placement = GLYPH_PLACEMENTS[glyph];
    glyphMetrics[glyph] = {
      ...metrics,
      share: round(raw[glyph].energy / totalEnergy * 100, 4),
      opticalBounds: publicBounds(opticalBounds[glyph], height),
      opticalSidebearings: {
        left: round(metrics.occupiedBounds.minX - placement.x),
        right: round(placement.x + placement.width - metrics.occupiedBounds.maxX),
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
const phiBuffer = Buffer.from(await Bun.file(resolve(process.cwd(), "public/brand/h-phi.png")).arrayBuffer());
const phiHref = `data:image/png;base64,${phiBuffer.toString("base64")}`;
const temporalFrames = [];
const temporalPngs: Buffer[] = [];
for (let ms = 0; ms <= H_ANIMATION.durationMs; ms += 25) {
  const progress = ms / H_ANIMATION.durationMs;
  const frame = rasterize(phiFrameSvg(hContent, definitions, phiHref, progress), MASTER.height * SUPERSAMPLE);
  const metrics = analyzePng(frame);
  temporalFrames.push({ ms, progress: round(progress), ...publicMetrics(metrics, MASTER.height) });
  if ([0, 100, 175, 250, 350, 475, 575, 700].includes(ms)) temporalPngs.push(frame);
}
const settled = temporalFrames.at(-1)!;
const settledEnergy = settled.opticalEnergy;
const holdFrames = temporalFrames.filter(
  (frame) => frame.progress >= H_ANIMATION.phiFadeInEnd && frame.progress <= H_ANIMATION.phiHoldEnd,
);
const holdEnergy = holdFrames.reduce((sum, frame) => sum + frame.opticalEnergy, 0) / Math.max(holdFrames.length, 1);
const motionEnergyError = temporalFrames.reduce(
  (sum, frame) => sum + Math.abs(frame.opticalEnergy - settledEnergy) / Math.max(settledEnergy, 1e-9),
  0,
) / temporalFrames.length;
const motionCentroidDrift = Math.max(
  ...temporalFrames
    .filter((frame) => frame.opticalEnergy > settledEnergy * 0.05)
    .map((frame) => Math.abs(frame.centroid.x - settled.centroid.x)),
);
const crossfadeFrames = temporalFrames.filter(
  (frame) => frame.progress >= H_ANIMATION.phiHoldEnd && frame.progress <= H_ANIMATION.crossfadeEnd,
);
const maximumCrossfadeEnergyDeviation = Math.max(
  ...crossfadeFrames.map(
    (frame) => Math.abs(frame.opticalEnergy - settledEnergy) / Math.max(settledEnergy, 1e-9),
  ),
);
const motionScore = motionEnergyError + 0.25 * motionCentroidDrift;

if (temporalPngs.length) {
  const decoded = temporalPngs.map((buffer) => PNG.sync.read(buffer));
  const tileWidth = decoded[0].width;
  const tileHeight = decoded[0].height;
  const sheet = new PNG({ width: tileWidth * decoded.length, height: tileHeight });
  decoded.forEach((png, index) => {
    PNG.bitblt(png, sheet, 0, 0, tileWidth, tileHeight, index * tileWidth, 0);
  });
  await Bun.write(resolve(outputRoot, "h-animation-contact-sheet.png"), PNG.sync.write(sheet));
}

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
    durationMs: H_ANIMATION.durationMs,
    cadenceMs: 25,
    settledEnergy,
    phiHoldEnergy: round(holdEnergy),
    phiHoldDeviationRatio: round(Math.abs(holdEnergy - settledEnergy) / Math.max(settledEnergy, 1e-9)),
    maximumCrossfadeEnergyDeviationRatio: round(maximumCrossfadeEnergyDeviation),
    maximumCentroidDrift: round(motionCentroidDrift),
    frames: temporalFrames,
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
  `<!doctype html><meta charset="utf-8"><title>THOM ${variant}</title><style>body{background:#050505;color:#eee;font:14px system-ui;padding:24px}img{max-width:100%;display:block;margin:16px 0;background:#050505}</style><h1>THOM logo balance: ${variant}</h1><p>Revision ${revision}</p>${DISPLAY_HEIGHTS.map((height) => `<h2>${height}px @ 8x</h2><img src="production-${height}px@8x.png"><img src="monochrome-${height}px@8x.png">`).join("")}<h2>H animation</h2><img src="h-animation-contact-sheet.png"><pre>${JSON.stringify(report.score, null, 2)}</pre>`,
);

console.log(JSON.stringify({ variant, revision, output: outputRoot, score: report.score }, null, 2));
