import { existsSync, statSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";

const vaultRoot = resolve(import.meta.dir, "../../..");
const arguments_ = Bun.argv.slice(2);
const dryRun = arguments_.includes("--dry-run");
const noteArguments = arguments_.filter((argument) => argument !== "--dry-run");
const noteArgument = noteArguments.length > 0
  ? noteArguments.join(" ")
  : "libs/blogs/README.md";
const notePath = resolve(vaultRoot, noteArgument);
const pathFromVaultRoot = relative(vaultRoot, notePath);

if (
  pathFromVaultRoot === ".." ||
  pathFromVaultRoot.startsWith(`..${sep}`) ||
  isAbsolute(pathFromVaultRoot) ||
  pathFromVaultRoot === ""
) {
  throw new Error("The note must be a file inside this repository's Obsidian vault.");
}

if (!existsSync(notePath) || !statSync(notePath).isFile()) {
  throw new Error(`Obsidian note not found: ${pathFromVaultRoot}`);
}

const obsidianUri = `obsidian://open?path=${encodeURIComponent(notePath)}`;

if (dryRun) {
  console.log(obsidianUri);
  process.exit(0);
}

const launcher =
  process.platform === "darwin"
    ? ["open", obsidianUri]
    : process.platform === "win32"
      ? ["cmd.exe", "/d", "/s", "/c", "start", "", obsidianUri]
      : ["xdg-open", obsidianUri];

console.log(`Opening ${pathFromVaultRoot} in Obsidian…`);

const process_ = Bun.spawn(launcher, {
  stdout: "inherit",
  stderr: "inherit",
});

const exitCode = await process_.exited;

if (exitCode !== 0) {
  throw new Error(`Could not open Obsidian (launcher exited with code ${exitCode}).`);
}
