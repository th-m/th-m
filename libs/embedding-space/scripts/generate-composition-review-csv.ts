import { once } from "node:events";
import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { dirname, isAbsolute, normalize, relative, resolve } from "node:path";
import {
  COMPOSITION_REVIEW_TERMS,
  generateCompositionReviewRows,
  type CompositionReviewRow,
} from "../src/compositionReview";

const HEADER = [
  "combination_id",
  "term_count",
  "term_1",
  "term_2",
  "term_3",
  "term_4",
  "canonical_expression",
  "ordered_permutation_count",
  "current_result",
  "result_kind",
  "valid",
  "reviewed_result",
  "review_status",
  "review_notes",
] as const;

function parseOutput(): string {
  const arguments_ = Bun.argv.slice(2);
  const outputIndex = arguments_.indexOf("--output");
  const value = outputIndex >= 0 ? arguments_[outputIndex + 1] : undefined;
  if (!value) throw new Error("Usage: --output <library-owned.csv>");

  const output = resolve(value);
  const projectRoot = resolve(import.meta.dir, "..");
  const withinProject = relative(projectRoot, output);
  if (
    !isAbsolute(output)
    || withinProject.startsWith("..")
    || normalize(withinProject) !== "generated/embedding-composition-review.csv"
  ) {
    throw new Error(`Generated output must be the explicit library-owned review CSV path. Received ${output}`);
  }
  return output;
}

function csvCell(value: string | number | boolean): string {
  const text = String(value);
  return /[",\r\n]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function rowValues(row: CompositionReviewRow): readonly (string | number | boolean)[] {
  return [
    row.combinationId,
    row.termCount,
    row.terms[0] ?? "",
    row.terms[1] ?? "",
    row.terms[2] ?? "",
    row.terms[3] ?? "",
    row.canonicalExpression,
    row.orderedPermutationCount,
    row.currentResult,
    row.resultKind,
    row.valid,
    "",
    "",
    "",
  ];
}

async function writeLine(stream: ReturnType<typeof createWriteStream>, values: readonly (string | number | boolean)[]) {
  const line = `${values.map(csvCell).join(",")}\n`;
  if (!stream.write(line)) await once(stream, "drain");
}

const output = parseOutput();
await mkdir(dirname(output), { recursive: true });
const stream = createWriteStream(output, { encoding: "utf8" });
await writeLine(stream, HEADER);

let rowCount = 0;
for (const row of generateCompositionReviewRows()) {
  await writeLine(stream, rowValues(row));
  rowCount += 1;
}

stream.end();
await once(stream, "finish");
console.log(`Wrote ${rowCount.toLocaleString("en-US")} canonical compositions from ${COMPOSITION_REVIEW_TERMS.length} options to ${output}.`);
