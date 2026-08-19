import { resolve } from "node:path";
import { snapshotTypeScriptWorkspace } from "./snapshot.ts";

function valueFor(arguments_: string[], name: string): string | undefined {
  const index = arguments_.indexOf(name);
  return index >= 0 ? arguments_[index + 1] : undefined;
}

function usage(): never {
  throw new Error("Usage: knowledge:snapshot -- --repository <absolute-root> --source <relative-directory> --tsconfig <relative-tsconfig> --output <workspace-file.json>");
}

const arguments_ = Bun.argv.slice(2);
if (arguments_.includes("--help")) {
  console.log("Usage: knowledge:snapshot -- --repository <absolute-root> --source <relative-directory> --tsconfig <relative-tsconfig> --output <workspace-file.json>");
  process.exit(0);
}
const repository = valueFor(arguments_, "--repository") ?? usage();
const source = valueFor(arguments_, "--source") ?? usage();
const tsconfig = valueFor(arguments_, "--tsconfig") ?? usage();
const output = valueFor(arguments_, "--output") ?? usage();
const snapshot = await snapshotTypeScriptWorkspace({
  workspaceRoot: resolve(import.meta.dir, "../../.."),
  repository,
  source,
  tsconfig,
  output,
});
console.log(`Created ${output} at ${snapshot.repository.revision}.`);
console.log(`Discovered ${snapshot.packages.length} packages and ${snapshot.symbols.length} public symbols.`);
