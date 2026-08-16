import { resolve } from "node:path";

type Glyph = "t" | "h" | "o" | "m";
type Metrics = {
  variant: string;
  revision: string;
  score: {
    aggregate: number;
    components: { mass: number; core: number; moments: number; gaps: number; motion: number };
  };
  sizes: Record<string, {
    glyphs: Record<Glyph, { share: number }>;
    opticalGaps: { maximumDeviationRatio: number };
  }>;
  hCrossbar: { centroidOffset: number };
  temporal: {
    peakEnergyRatio: number;
    maximumCentroidDrift: number;
    maximumQuarterTurnRatioError: number;
  };
};

type Acceptance = { pass: boolean; summary: { passed: number; failed: number; total: number } };

const variantsArgument = process.argv.find((argument) => argument.startsWith("--variants="));
const variants = (variantsArgument?.slice("--variants=".length)
  || "baseline,ink-budget,stroke-energy,spatial,motion,synthesis")
  .split(",")
  .map((variant) => variant.trim())
  .filter(Boolean);
const auditRoot = resolve(process.cwd(), ".codex/audits/logo-balance");
const rows = [];

for (const variant of variants) {
  const metricsFile = Bun.file(resolve(auditRoot, variant, "metrics.json"));
  if (!await metricsFile.exists()) continue;
  const metrics = await metricsFile.json() as Metrics;
  const acceptanceFile = Bun.file(resolve(auditRoot, variant, "acceptance.json"));
  const acceptance = await acceptanceFile.exists() ? await acceptanceFile.json() as Acceptance : null;
  rows.push({
    variant,
    revision: metrics.revision,
    aggregate: metrics.score.aggregate,
    components: metrics.score.components,
    shares120: Object.fromEntries(
      (["t", "h", "o", "m"] as const).map((glyph) => [glyph, metrics.sizes["120"].glyphs[glyph].share]),
    ) as Record<Glyph, number>,
    hCrossbarOffset: metrics.hCrossbar.centroidOffset,
    peakEnergyRatio: metrics.temporal.peakEnergyRatio,
    quarterTurnRatioError: metrics.temporal.maximumQuarterTurnRatioError,
    centroidDrift: metrics.temporal.maximumCentroidDrift,
    maximumGapDeviation: Math.max(
      ...[24, 48, 120].map((height) => metrics.sizes[String(height)].opticalGaps.maximumDeviationRatio),
    ),
    acceptance,
  });
}

rows.sort((left, right) => {
  const leftAccepted = left.acceptance?.pass ? 1 : 0;
  const rightAccepted = right.acceptance?.pass ? 1 : 0;
  return rightAccepted - leftAccepted || left.aggregate - right.aggregate || left.variant.localeCompare(right.variant);
});

const scorecard = {
  schemaVersion: 1,
  formula: "0.40*mass + 0.20*core + 0.15*moments + 0.10*gaps + 0.15*motion",
  ordering: "Invariant and acceptance pass first; lower aggregate score second.",
  rows,
};
const jsonPath = resolve(auditRoot, "scorecard.json");
await Bun.write(jsonPath, `${JSON.stringify(scorecard, null, 2)}\n`);

const header = "| Variant | Gates | J | Mass | Core | Moments | Gaps | Motion | 120px T/H/O/M | H offset | Spiral peak | φ ratio error | Drift | Max gap |";
const separator = "|---|---:|---:|---:|---:|---:|---:|---:|---|---:|---:|---:|---:|---:|";
const tableRows = rows.map((row) => {
  const gates = row.acceptance
    ? `${row.acceptance.summary.passed}/${row.acceptance.summary.total}${row.acceptance.pass ? " pass" : ""}`
    : "not run";
  const shares = (["t", "h", "o", "m"] as const).map((glyph) => row.shares120[glyph].toFixed(2)).join("/");
  return `| ${row.variant} | ${gates} | ${row.aggregate.toFixed(4)} | ${row.components.mass.toFixed(4)} | ${row.components.core.toFixed(4)} | ${row.components.moments.toFixed(4)} | ${row.components.gaps.toFixed(4)} | ${row.components.motion.toFixed(4)} | ${shares} | ${row.hCrossbarOffset.toFixed(3)} | ${row.peakEnergyRatio.toFixed(3)}× | ${row.quarterTurnRatioError.toExponential(1)} | ${row.centroidDrift.toFixed(3)} | ${(row.maximumGapDeviation * 100).toFixed(2)}% |`;
});
const markdown = `# THOM Logo Balance Scorecard\n\nInvariant and acceptance status outrank aggregate score. Lower J is better among eligible variants.\n\n${header}\n${separator}\n${tableRows.join("\n")}\n`;
const markdownPath = resolve(auditRoot, "scorecard.md");
await Bun.write(markdownPath, markdown);
console.log(JSON.stringify({ variants: rows.length, json: jsonPath, markdown: markdownPath }, null, 2));
