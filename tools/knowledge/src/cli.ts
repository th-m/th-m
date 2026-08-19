import { resolve } from "node:path";
import { generateKnowledgeProof } from "./generate.ts";

function valueFor(arguments_: string[], name: string): string | undefined {
  const index = arguments_.indexOf(name);
  return index >= 0 ? arguments_[index + 1] : undefined;
}

function usage(): never {
  throw new Error("Usage: knowledge:gen -- --manifest <proof.json> --output <workspace-directory>");
}

const arguments_ = Bun.argv.slice(2);
if (arguments_.includes("--help")) {
  console.log("Usage: knowledge:gen -- --manifest <proof.json> --output <workspace-directory>");
  process.exit(0);
}
const manifest = valueFor(arguments_, "--manifest") ?? usage();
const output = valueFor(arguments_, "--output") ?? usage();
const generated = await generateKnowledgeProof({ workspaceRoot: resolve(import.meta.dir, "../../.."), manifest, output });
console.log(`Created ${generated.boardPath}`);
console.log(`Created ${generated.reportPath}`);
console.log(`Generated ${generated.report.sources.reduce((sum, source) => sum + source.artifacts.length, 0)} diagram pairs.`);

// Playwright keeps an fsevents handle alive under Bun after its browser closes.
// The CLI has completed every atomic write at this point, so terminate cleanly.
process.exit(0);
