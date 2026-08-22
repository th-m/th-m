import { resolve } from "node:path";
import type { SvgExportMode } from "@th-m/graph-visualization/core";
import { generateGraphArtifacts } from "./generate";

function valueFor(arguments_: string[], name: string): string | undefined {
  const index = arguments_.indexOf(name);
  return index >= 0 ? arguments_[index + 1] : undefined;
}

function usage(): never {
  throw new Error("Usage: graph:gen -- --input <graph.json> --output <output-base> [--mode graph|poster]");
}

const arguments_ = Bun.argv.slice(2);
if (arguments_.includes("--help")) {
  console.log("Usage: graph:gen -- --input <graph.json> --output <output-base> [--mode graph|poster]");
  process.exit(0);
}

const input = valueFor(arguments_, "--input") ?? usage();
const output = valueFor(arguments_, "--output") ?? usage();
const modeValue = valueFor(arguments_, "--mode") ?? "graph";
if (modeValue !== "graph" && modeValue !== "poster") usage();

const workspaceRoot = resolve(import.meta.dir, "../../..");
const generated = await generateGraphArtifacts({
  workspaceRoot,
  input,
  output,
  mode: modeValue as SvgExportMode,
});
console.log(`Created ${generated.svgPath}`);
console.log(`Created ${generated.pngPath}`);
