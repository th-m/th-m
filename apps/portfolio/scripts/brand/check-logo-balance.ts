import { dirname, resolve } from "node:path";

type Glyph = "t" | "h" | "o" | "m";
type Metrics = {
  variant: string;
  sizes: Record<string, {
    render: { opticalProfile: "display" | "compact" | "micro" };
    glyphs: Record<Glyph, { share: number; highContrastCoreArea: number }>;
    opticalGaps: { maximumDeviationRatio: number };
  }>;
  hCrossbar: { centroidOffset: number; ratio: number };
  temporal: {
    peakEnergyRatio: number;
    maximumCentroidDrift: number;
    maximumQuarterTurnRatioError: number;
    recognizableCoreAfterReveal: boolean;
    finalMatchesSettled: boolean;
  };
  multiscaleSurvival: Record<string, {
    acceptance: Record<string, boolean>;
  }>;
};

type Gate = {
  id: string;
  pass: boolean;
  actual: number;
  requirement: string;
};

const metricsArgument = process.argv.find((argument) => argument.startsWith("--metrics="));
const variantArgument = process.argv.find((argument) => argument.startsWith("--variant="));
const variant = (variantArgument?.slice("--variant=".length) || process.env.THOM_BALANCE_VARIANT || "final")
  .replace(/[^a-zA-Z0-9._-]/g, "-");
const metricsPath = resolve(
  import.meta.dir,
  "../../../..",
  metricsArgument?.slice("--metrics=".length) || `.codex/audits/logo-balance/${variant}/metrics.json`,
);
const metrics = await Bun.file(metricsPath).json() as Metrics;
const gates: Gate[] = [];

function addGate(id: string, actual: number, requirement: string, pass: boolean) {
  gates.push({ id, actual, requirement, pass });
}

const expectedProfiles = { 24: "micro", 48: "compact", 120: "display" } as const;
for (const height of [24, 48, 120] as const) {
  const size = metrics.sizes[String(height)];
  addGate(
    `${height}px-optical-profile`,
    size.render.opticalProfile === expectedProfiles[height] ? 1 : 0,
    `profile is ${expectedProfiles[height]}`,
    size.render.opticalProfile === expectedProfiles[height],
  );
  for (const glyph of ["t", "h", "o", "m"] as const) {
    const glyphMetrics = size.glyphs[glyph];
    addGate(
      `${height}px-${glyph}-recognizable-core`,
      glyphMetrics.highContrastCoreArea,
      "highContrastCoreArea > 0",
      glyphMetrics.highContrastCoreArea > 0,
    );
  }
  const shares = Object.values(size.glyphs).map((glyph) => glyph.share);
  const spread = Math.max(...shares) - Math.min(...shares);
  if (height < 120) {
    addGate(`${height}px-energy-spread`, spread, "maximum-minus-minimum share <= 8 percentage points", spread <= 8);
  } else {
    for (const glyph of ["t", "h", "o", "m"] as const) {
      const share = size.glyphs[glyph].share;
      addGate(`120px-${glyph}-robust-energy`, share, "12 <= share <= 38", share >= 12 && share <= 38);
    }
  }
}

const goldenRatio = (1 + Math.sqrt(5)) / 2;
addGate(
  "h-golden-ratio-identity",
  metrics.hCrossbar.ratio,
  `abs(ratio - phi) <= 1e-6`,
  Math.abs(metrics.hCrossbar.ratio - goldenRatio) <= 1e-6,
);
addGate(
  "h-crossbar-centroid",
  Math.abs(metrics.hCrossbar.centroidOffset),
  "absolute offset <= 0.25 design units",
  Math.abs(metrics.hCrossbar.centroidOffset) <= 0.25,
);
addGate(
  "h-spiral-peak-energy",
  metrics.temporal.peakEnergyRatio,
  "peak energy <= 1.35 × settled energy",
  metrics.temporal.peakEnergyRatio <= 1.35,
);
addGate(
  "h-spiral-quarter-turn-ratio",
  metrics.temporal.maximumQuarterTurnRatioError,
  "maximum ratio error <= 1e-6",
  metrics.temporal.maximumQuarterTurnRatioError <= 1e-6,
);
addGate(
  "h-animation-centroid",
  metrics.temporal.maximumCentroidDrift,
  "maximum horizontal drift <= 2 design units",
  metrics.temporal.maximumCentroidDrift <= 2,
);
addGate(
  "h-recognizable-after-reveal",
  metrics.temporal.recognizableCoreAfterReveal ? 1 : 0,
  "recognizable H core remains after reveal",
  metrics.temporal.recognizableCoreAfterReveal,
);
addGate(
  "h-final-matches-settled",
  metrics.temporal.finalMatchesSettled ? 1 : 0,
  "final animation frame exactly matches settled H",
  metrics.temporal.finalMatchesSettled,
);

for (const height of [24, 48, 120] as const) {
  const deviation = metrics.sizes[String(height)].opticalGaps.maximumDeviationRatio;
  addGate(`${height}px-optical-gaps`, deviation, "maximum deviation <= 0.10", deviation <= 0.1);
}

for (const [height, survival] of Object.entries(metrics.multiscaleSurvival)) {
  for (const [feature, pass] of Object.entries(survival.acceptance)) {
    addGate(`${height}px-${feature}`, pass ? 1 : 0, "profile feature survives or is intentionally suppressed", pass);
  }
}

const failed = gates.filter((gate) => !gate.pass);
const report = {
  schemaVersion: 2,
  variant: metrics.variant,
  command: `bun run check:brand:balance --metrics=${metricsPath}`,
  policy: "Geometry, profile selection, recognizability, spacing, and motion are hard gates. Energy shares are broad robustness bounds, not universal beauty targets.",
  pass: failed.length === 0,
  summary: { passed: gates.length - failed.length, failed: failed.length, total: gates.length },
  gates,
};
const outputPath = resolve(dirname(metricsPath), "acceptance.json");
await Bun.write(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ output: outputPath, ...report.summary, pass: report.pass }, null, 2));
if (failed.length) {
  console.error(failed.map((gate) => `${gate.id}: ${gate.actual} (${gate.requirement})`).join("\n"));
  process.exitCode = 1;
}
