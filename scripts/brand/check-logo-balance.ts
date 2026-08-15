import { dirname, resolve } from "node:path";

type Glyph = "t" | "h" | "o" | "m";
type Metrics = {
  variant: string;
  targets: Record<Glyph, { midpoint: number; band: [number, number] }>;
  sizes: Record<string, {
    glyphs: Record<Glyph, { share: number; highContrastCoreArea: number }>;
    opticalGaps: { maximumDeviationRatio: number };
  }>;
  hCrossbar: { centroidOffset: number; ratio: number };
  temporal: {
    phiHoldDeviationRatio: number;
    maximumCrossfadeEnergyDeviationRatio: number;
    maximumCentroidDrift: number;
  };
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
  process.cwd(),
  metricsArgument?.slice("--metrics=".length) || `.codex/audits/logo-balance/${variant}/metrics.json`,
);
const metrics = await Bun.file(metricsPath).json() as Metrics;
const gates: Gate[] = [];

function addGate(id: string, actual: number, requirement: string, pass: boolean) {
  gates.push({ id, actual, requirement, pass });
}

for (const glyph of ["t", "h", "o", "m"] as const) {
  const share = metrics.sizes["120"].glyphs[glyph].share;
  const [minimum, maximum] = metrics.targets[glyph].band;
  addGate(`120px-${glyph}-energy-share`, share, `${minimum} <= share <= ${maximum}`, share >= minimum && share <= maximum);
}

for (const height of [24, 48] as const) {
  for (const glyph of ["t", "h", "o", "m"] as const) {
    const glyphMetrics = metrics.sizes[String(height)].glyphs[glyph];
    const [targetMinimum, targetMaximum] = metrics.targets[glyph].band;
    const minimum = targetMinimum - 2;
    const maximum = targetMaximum + 2;
    addGate(
      `${height}px-${glyph}-energy-share`,
      glyphMetrics.share,
      `${minimum} <= share <= ${maximum}`,
      glyphMetrics.share >= minimum && glyphMetrics.share <= maximum,
    );
    addGate(
      `${height}px-${glyph}-recognizable-core`,
      glyphMetrics.highContrastCoreArea,
      "highContrastCoreArea > 0",
      glyphMetrics.highContrastCoreArea > 0,
    );
  }
}

const goldenRatio = (1 + Math.sqrt(5)) / 2;
addGate(
  "h-golden-ratio",
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
  "h-phi-hold-energy",
  metrics.temporal.phiHoldDeviationRatio,
  "deviation <= 0.05",
  metrics.temporal.phiHoldDeviationRatio <= 0.05,
);
addGate(
  "h-crossfade-energy",
  metrics.temporal.maximumCrossfadeEnergyDeviationRatio,
  "maximum deviation <= 0.07",
  metrics.temporal.maximumCrossfadeEnergyDeviationRatio <= 0.07,
);
addGate(
  "h-animation-centroid",
  metrics.temporal.maximumCentroidDrift,
  "maximum horizontal drift <= 1 design unit",
  metrics.temporal.maximumCentroidDrift <= 1,
);

for (const height of [24, 48, 120] as const) {
  const deviation = metrics.sizes[String(height)].opticalGaps.maximumDeviationRatio;
  addGate(`${height}px-optical-gaps`, deviation, "maximum deviation <= 0.10", deviation <= 0.1);
}

const failed = gates.filter((gate) => !gate.pass);
const report = {
  schemaVersion: 1,
  variant: metrics.variant,
  command: `bun run check:brand:balance --metrics=${metricsPath}`,
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
