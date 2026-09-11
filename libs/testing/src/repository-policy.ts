import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { checkDocumentation } from "./documentation-policy";

export interface DocumentationViolation {
  path: string;
  message: string;
}

export interface FoundationColorViolation {
  path: string;
  line: number;
  token: string;
  value: string;
}

const ignoredDirectories = new Set([
  ".bun-tmp",
  ".git",
  ".nx",
  "coverage",
  "dist",
  "dist-graph",
  "dist-sets",
  "node_modules",
  "playwright-report",
  "test-results",
]);

const canonicalFoundationColors = [
  ["background", "050505"],
  ["surface", "0c0b09"],
  ["surface-raised", "15120d"],
  ["hover-card", "19150f"],
  ["popover", "1d1811"],
  ["dialog", "211b13"],
  ["foreground", "f2e5cf"],
  ["foreground-strong", "fff5dc"],
  ["foreground-muted", "a99b87"],
  ["foreground-subtle", "8f816e"],
  ["foreground-inverse", "17130f"],
  ["border", "30291f"],
  ["border-strong", "776951"],
  ["brand", "d6b06a"],
] as const;

const colorPolicyExclusions = [
  "libs/design-theme/",
  "apps/portfolio/scripts/brand/",
  "apps/portfolio/scripts/visual/",
  "tools/topology/scripts/legacy/",
] as const;

async function walk(directory: string): Promise<string[]> {
  const found: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) found.push(...(await walk(path)));
    else found.push(path);
  }
  return found;
}

export async function documentationViolations(workspaceRoot: string): Promise<DocumentationViolation[]> {
  return checkDocumentation(workspaceRoot);
}

/** Prevents implementation code from copying the canonical palette instead of consuming design-theme. */
export async function foundationColorViolations(workspaceRoot: string): Promise<FoundationColorViolation[]> {
  const files = await walk(workspaceRoot);
  const violations: FoundationColorViolation[] = [];

  for (const path of files) {
    const workspacePath = relative(workspaceRoot, path).split(sep).join("/");
    if (!/\.(?:css|ts|tsx)$/.test(workspacePath)) continue;
    if (!/^(?:apps|libs|tools)\//.test(workspacePath)) continue;
    if (colorPolicyExclusions.some((prefix) => workspacePath.startsWith(prefix))) continue;

    const lines = (await readFile(path, "utf8")).split("\n");
    for (const [index, line] of lines.entries()) {
      const normalized = line.toLowerCase();
      for (const [token, digits] of canonicalFoundationColors) {
        const value = `#${digits}`;
        if (normalized.includes(value)) violations.push({ path: workspacePath, line: index + 1, token, value });
      }
    }
  }

  return violations;
}
