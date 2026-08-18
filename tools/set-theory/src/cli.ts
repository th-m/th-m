import { resolve } from "node:path";
import { generateSetAtlasArtifacts } from "./generate";

function valueFor(arguments_: string[], name: string): string | undefined {
  const index = arguments_.indexOf(name);
  return index >= 0 ? arguments_[index + 1] : undefined;
}

function usage(): never {
  throw new Error("Usage: set-theory:gen -- --input <source.ts> --output <output-base> [--tsconfig <tsconfig.json>]");
}

const arguments_ = Bun.argv.slice(2);
if (arguments_.includes("--help")) {
  console.log("Usage: set-theory:gen -- --input <source.ts> --output <output-base> [--tsconfig <tsconfig.json>]");
  process.exit(0);
}

const input = valueFor(arguments_, "--input") ?? usage();
const output = valueFor(arguments_, "--output") ?? usage();
const tsconfig = valueFor(arguments_, "--tsconfig");
const generated = await generateSetAtlasArtifacts({
  workspaceRoot: resolve(import.meta.dir, "../../.."),
  input,
  output,
  ...(tsconfig ? { tsconfig } : {}),
});
console.log(`Created ${generated.svgPath}`);
console.log(`Created ${generated.pngPath}`);
