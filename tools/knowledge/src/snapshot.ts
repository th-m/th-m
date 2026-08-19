import { createHash } from "node:crypto";
import { execFile as execFileCallback } from "node:child_process";
import { mkdir, readFile, readdir, realpath, stat, writeFile } from "node:fs/promises";
import { basename, dirname, extname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { promisify } from "node:util";
import { version as compilerVersion } from "typescript";
import type { KnowledgeDiagnostic } from "@th-m/knowledge-model";
import type { TypeScriptPackageSnapshot, TypeScriptSymbolSnapshot, TypeScriptWorkspaceSnapshot } from "./types.ts";

const execFile = promisify(execFileCallback);
const TYPE_SCRIPT_EXTENSION = /(?:\.d\.)?(?:ts|tsx|mts|cts)$/i;
const SNAPSHOT_FILE_EXTENSION = /\.(?:ts|tsx|mts|cts|json)$/i;

export interface SnapshotWorkspaceOptions {
  workspaceRoot: string;
  repository: string;
  source: string;
  tsconfig: string;
  output: string;
}

function assertContained(root: string, candidate: string, label: string): void {
  const path = relative(root, candidate);
  if (path === "" || (path !== ".." && !path.startsWith(`..${sep}`))) return;
  throw new Error(`${label} escapes the supplied root.`);
}

async function canonicalExternalPath(root: string, relativePath: string, label: string): Promise<string> {
  if (isAbsolute(relativePath)) throw new Error(`${label} must be relative to the repository.`);
  const candidate = resolve(root, relativePath);
  assertContained(root, candidate, label);
  const canonical = await realpath(candidate);
  assertContained(root, canonical, label);
  return canonical;
}

async function walk(directory: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    if (["node_modules", "dist", ".git", ".nx"].includes(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      const target = await realpath(path);
      assertContained(await realpath(directory), target, `Symlink ${path}`);
    }
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

function sha256(content: string | Uint8Array): string {
  return createHash("sha256").update(content).digest("hex");
}

function gitIdentity(value: string | undefined, repositoryName: string): string {
  if (!value) return `git:${repositoryName}`;
  const trimmed = value.trim();
  return trimmed
    .replace(/^https?:\/\/[^/@]+@/, "https://")
    .replace(/^ssh:\/\/[^/@]+@/, "ssh://")
    .replace(/^[^/@]+@([^:]+):/, "ssh://$1/");
}

async function git(repository: string, arguments_: string[]): Promise<string> {
  const result = await execFile("git", ["-C", repository, ...arguments_], { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  return result.stdout.trim();
}

function moduleSpecifiers(source: string): string[] {
  const values = new Set<string>();
  const pattern = /(?:from\s*|import\s*\()(["'])([^"']+)\1/g;
  for (const match of source.matchAll(pattern)) values.add(match[2]);
  return [...values].sort();
}

function sourceLocation(source: string, offset: number): { line: number; column: number } {
  const before = source.slice(0, offset);
  const lines = before.split("\n");
  return { line: lines.length, column: (lines.at(-1)?.length ?? 0) + 1 };
}

function normalizeTypeText(value: string): string {
  return value.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, " ").replace(/\s+/g, " ").trim();
}

interface DeclarationInfo extends Omit<TypeScriptSymbolSnapshot, "id" | "packageId"> {}

function declarationsInSource(path: string, source: string): Map<string, DeclarationInfo> {
  const declarations = new Map<string, DeclarationInfo>();
  const pattern = /\b(?:export\s+)?(?:declare\s+)?(?:default\s+)?(type|interface|class|enum|function|const|let|var)\s+([A-Za-z_$][\w$]*)/g;
  for (const match of source.matchAll(pattern)) {
    const syntaxKind = match[1];
    const name = match[2];
    const start = match.index ?? 0;
    const tail = source.slice(start);
    let end = syntaxKind === "type" ? tail.indexOf(";") : tail.indexOf("{");
    if (end < 0 || end > 4000) end = tail.indexOf("\n");
    if (end < 0) end = Math.min(tail.length, 1000);
    const display = normalizeTypeText(tail.slice(0, end + 1));
    const location = sourceLocation(source, start);
    const kind = syntaxKind === "type" ? "alias" : syntaxKind === "interface" || syntaxKind === "class" || syntaxKind === "enum" || syntaxKind === "function" ? syntaxKind : "variable";
    const typeExpression = syntaxKind === "type" ? display.slice(display.indexOf("=") + 1).replace(/;$/, "").trim() : "";
    const extendsText = display.match(/\bextends\s+([^\{]+)/)?.[1] ?? "";
    const tokenNames = [...new Set(display.match(/\b[A-Z][A-Za-z0-9_$]*\b/g) ?? [])].filter((token) => token !== name);
    const aliasTarget = typeExpression.match(/^([A-Za-z_$][\w$]*)$/)?.[1];
    declarations.set(name, {
      name,
      kind,
      sourcePath: path,
      line: location.line,
      column: location.column,
      display,
      deprecated: /@deprecated/.test(source.slice(Math.max(0, start - 400), start)),
      extends: extendsText.split(",").map((value) => value.trim().match(/^([A-Za-z_$][\w$]*)/)?.[1]).filter((value): value is string => Boolean(value)),
      references: tokenNames.sort(),
      unionMembers: typeExpression.includes("|") ? typeExpression.split("|").map((member) => member.trim().match(/^([A-Za-z_$][\w$]*)/)?.[1]).filter((value): value is string => Boolean(value)) : [],
      intersectionMembers: typeExpression.includes("&") ? typeExpression.split("&").map((member) => member.trim().match(/^([A-Za-z_$][\w$]*)/)?.[1]).filter((value): value is string => Boolean(value)) : [],
      ...(aliasTarget ? { aliasTarget } : {}),
    });
  }
  return declarations;
}

function resolveRelativeModule(fromFile: string, specifier: string, available: Set<string>): string | undefined {
  if (!specifier.startsWith(".")) return undefined;
  const requested = resolve(dirname(fromFile), specifier);
  const base = /\.(?:js|jsx|mjs|cjs)$/.test(requested) ? requested.replace(/\.(?:js|jsx|mjs|cjs)$/, "") : requested;
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, `${base}.mts`, `${base}.cts`, join(base, "index.ts")]) {
    if (available.has(candidate)) return candidate;
  }
  return undefined;
}

function publicExports(entrypoint: string, sourceByPath: Map<string, string>): Array<{ exportName: string; declaration: DeclarationInfo }> {
  const available = new Set(sourceByPath.keys());
  const declarations = new Map<string, DeclarationInfo>();
  for (const [path, source] of sourceByPath) for (const [name, declaration] of declarationsInSource(path, source)) declarations.set(`${path}:${name}`, declaration);
  const results = new Map<string, DeclarationInfo>();
  const visited = new Set<string>();
  const visit = (path: string): void => {
    if (visited.has(path)) return;
    visited.add(path);
    const source = sourceByPath.get(path);
    if (!source) return;
    for (const match of source.matchAll(/export\s+\*\s+from\s+["']([^"']+)["']/g)) {
      const resolved = resolveRelativeModule(path, match[1], available);
      if (resolved) visit(resolved);
    }
    for (const match of source.matchAll(/export\s+(?:type\s+)?\{([^}]+)\}(?:\s+from\s+["']([^"']+)["'])?/g)) {
      const sourcePath = match[2] ? resolveRelativeModule(path, match[2], available) : path;
      if (!sourcePath) continue;
      for (const item of match[1].split(",")) {
        const parts = item.trim().replace(/^type\s+/, "").split(/\s+as\s+/);
        const originalName = parts[0]?.trim();
        const exportName = parts[1]?.trim() || originalName;
        const declaration = declarations.get(`${sourcePath}:${originalName}`);
        if (declaration && exportName) results.set(exportName, declaration);
      }
    }
    for (const [key, declaration] of declarations) {
      if (!key.startsWith(`${path}:`)) continue;
      const declarationPattern = new RegExp(`\\bexport\\s+(?:declare\\s+)?(?:default\\s+)?(?:type|interface|class|enum|function|const|let|var)\\s+${declaration.name}\\b`);
      if (declarationPattern.test(source)) results.set(declaration.name, declaration);
    }
  };
  visit(entrypoint);
  return [...results].map(([exportName, declaration]) => ({ exportName, declaration })).sort((left, right) => left.exportName.localeCompare(right.exportName));
}

export async function snapshotTypeScriptWorkspace(options: SnapshotWorkspaceOptions): Promise<TypeScriptWorkspaceSnapshot> {
  if (!isAbsolute(options.repository)) throw new Error("Repository must be an explicit absolute path.");
  const workspaceRoot = await realpath(resolve(options.workspaceRoot));
  const repository = await realpath(options.repository);
  const repositoryStats = await stat(repository);
  if (!repositoryStats.isDirectory()) throw new Error("Repository must be a directory.");
  const sourceRoot = await canonicalExternalPath(repository, options.source, "Source");
  const tsconfigPath = await canonicalExternalPath(repository, options.tsconfig, "TypeScript config");
  const sourceStatusBefore = await git(repository, ["status", "--porcelain", "--untracked-files=all", "--", options.source]);
  if (sourceStatusBefore) throw new Error(`Source subtree must be Git-clean before snapshotting:\n${sourceStatusBefore}`);

  const output = resolve(workspaceRoot, options.output);
  assertContained(workspaceRoot, output, "Output");
  await mkdir(dirname(output), { recursive: true });
  assertContained(workspaceRoot, await realpath(dirname(output)), "Output");

  const allFiles = await walk(sourceRoot);
  for (const file of allFiles) assertContained(repository, await realpath(file), `Source file ${file}`);
  const snapshotFiles = allFiles.filter((path) => SNAPSHOT_FILE_EXTENSION.test(path));
  const sourceByPath = new Map<string, string>();
  for (const path of snapshotFiles.filter((candidate) => TYPE_SCRIPT_EXTENSION.test(candidate))) sourceByPath.set(path, await readFile(path, "utf8"));
  const sourceHashes = await Promise.all(snapshotFiles.map(async (path) => ({
    path: relative(repository, path).split(sep).join("/"),
    sha256: sha256(await readFile(path)),
  })));
  sourceHashes.sort((left, right) => left.path.localeCompare(right.path));

  const packageFiles = allFiles.filter((path) => basename(path) === "package.json");
  const packageMetadata = await Promise.all(packageFiles.map(async (path) => ({ path, parsed: JSON.parse(await readFile(path, "utf8")) as { name?: string; nx?: { tags?: string[] } } })));
  const leafMetadata = packageMetadata.filter(({ path, parsed }) => parsed.name && sourceByPath.has(join(dirname(path), "src/index.ts")));
  const packageNames = new Set(leafMetadata.map(({ parsed }) => parsed.name!));
  const packages: TypeScriptPackageSnapshot[] = [];
  const symbols: TypeScriptSymbolSnapshot[] = [];
  const diagnostics: KnowledgeDiagnostic[] = [];

  for (const { path: packagePath, parsed } of leafMetadata.sort((left, right) => left.parsed.name!.localeCompare(right.parsed.name!))) {
    const packageRoot = dirname(packagePath);
    const packageId = parsed.name!;
    const packageRelative = relative(repository, packageRoot).split(sep).join("/");
    const domainRelative = relative(sourceRoot, packageRoot).split(sep).join("/");
    const packageSources = [...sourceByPath].filter(([path]) => path.startsWith(`${packageRoot}${sep}`));
    const dependencies = new Set<string>();
    for (const [, source] of packageSources) for (const specifier of moduleSpecifiers(source)) if (packageNames.has(specifier)) dependencies.add(specifier);
    const exports = publicExports(join(packageRoot, "src/index.ts"), sourceByPath);
    for (const { exportName, declaration } of exports) {
      symbols.push({
        id: `${packageId}#${exportName}`,
        packageId,
        ...declaration,
        name: exportName,
        sourcePath: relative(repository, declaration.sourcePath).split(sep).join("/"),
      });
    }
    if (exports.length === 0) diagnostics.push({ code: "typescript/empty-public-api", severity: "warning", message: `${packageId} exposes no declarations through src/index.ts.` });
    packages.push({
      id: packageId,
      name: packageId,
      path: packageRelative,
      capability: domainRelative.split("/")[0] || "root",
      tags: [...(parsed.nx?.tags ?? [])].sort(),
      dependencies: [...dependencies].sort(),
      exports: exports.map(({ exportName }) => exportName),
      sourceHashes: sourceHashes.filter(({ path }) => path.startsWith(`${packageRelative}/`)),
    });
  }

  const revision = await git(repository, ["rev-parse", "HEAD"]);
  let remote: string | undefined;
  try { remote = await git(repository, ["remote", "get-url", "origin"]); } catch { remote = undefined; }
  const contentHash = sha256(sourceHashes.map(({ path, sha256: hash }) => `${path}\0${hash}`).join("\n"));
  const snapshot: TypeScriptWorkspaceSnapshot = {
    schemaVersion: 1,
    kind: "typescript-workspace",
    id: `${basename(repository)}-${options.source.replace(/[^A-Za-z0-9]+/g, "-")}`,
    title: `${basename(repository)} ${options.source}`,
    repository: {
      identity: gitIdentity(remote, basename(repository)),
      revision,
      sourcePath: relative(repository, sourceRoot).split(sep).join("/"),
      tsconfigPath: relative(repository, tsconfigPath).split(sep).join("/"),
    },
    compilerVersion,
    contentHash,
    packages,
    symbols: symbols.sort((left, right) => `${left.packageId}#${left.name}`.localeCompare(`${right.packageId}#${right.name}`)),
    diagnostics,
  };
  const sourceStatusAfter = await git(repository, ["status", "--porcelain", "--untracked-files=all", "--", options.source]);
  if (sourceStatusAfter !== sourceStatusBefore) throw new Error("Source repository changed while snapshotting; no snapshot was written.");
  await writeFile(output, `${JSON.stringify(snapshot, null, 2)}\n`);
  return snapshot;
}
