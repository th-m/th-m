import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

export interface DocumentationViolation {
  path: string;
  message: string;
}

const ignoredDirectories = new Set([
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

const readmeHeadings = ["## Purpose", "## Ontology", "## Key Terms"];
const agentHeadings = [
  "## Operational Flow",
  "## Required Verification Parameters Within Nested Context",
  "## Required Invariants Within Folder Context",
];

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

function missingHeadings(contents: string, headings: string[]): string[] {
  return headings.filter((heading) => !contents.includes(heading));
}

export async function documentationViolations(workspaceRoot: string): Promise<DocumentationViolation[]> {
  const files = await walk(workspaceRoot);
  const fileSet = new Set(files);
  const violations: DocumentationViolation[] = [];

  for (const readme of files.filter((path) => path.endsWith("/README.md") || path === join(workspaceRoot, "README.md"))) {
    const agent = join(readme.slice(0, -"README.md".length), "AGENTS.md");
    if (!fileSet.has(agent)) {
      violations.push({ path: readme, message: "README.md is missing its sibling AGENTS.md" });
      continue;
    }

    const [readmeContents, agentContents] = await Promise.all([
      readFile(readme, "utf8"),
      readFile(agent, "utf8"),
    ]);
    for (const heading of missingHeadings(readmeContents, readmeHeadings)) {
      violations.push({ path: readme, message: `missing heading: ${heading}` });
    }
    for (const heading of missingHeadings(agentContents, agentHeadings)) {
      violations.push({ path: agent, message: `missing heading: ${heading}` });
    }
  }

  return violations;
}
