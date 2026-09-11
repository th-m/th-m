import { readdir, readFile, stat } from "node:fs/promises";
import { basename, dirname, join, resolve, sep } from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { parseDocument } from "yaml";
import type { Root, Nodes } from "mdast";
import type { DocumentationViolation } from "./repository-policy";

const readmeSections = ["Purpose", "Boundaries", "Ontology", "Key Terms"];
const agentSections = [
  "Operational Flow",
  "Required Verification Parameters Within Nested Context",
  "Required Invariants Within Folder Context",
];
const ignoredDirectories = new Set([
  ".git", ".nx", ".bun", ".bun-tmp", ".bun-install-cache", ".cache",
  "node_modules", "vendor", "coverage", "dist", "dist-graph", "dist-sets",
  "dist-knowledge", "playwright-report", "test-results",
]);
const parser = unified().use(remarkParse);

async function contracts(directory: string): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    // Do not follow symlinked dependency trees or external checkouts.
    if (entry.isDirectory() && !ignoredDirectories.has(entry.name)) files.push(...await contracts(path));
    else if (entry.isFile() && ["README.md", "AGENTS.md", "SKILL.md"].includes(entry.name)) files.push(path);
  }
  return files.sort();
}

function visit(node: Nodes, callback: (node: Nodes) => void): void {
  callback(node);
  if ("children" in node) for (const child of node.children) visit(child, callback);
}

function nodeText(node: Nodes): string {
  if ("value" in node) return node.value;
  return "children" in node ? node.children.map(nodeText).join("") : "";
}

function sectionViolations(tree: Root, required: string[]): string[] {
  const headings = tree.children.filter(node => node.type === "heading" && node.depth === 2).map(nodeText);
  const issues: string[] = [];
  for (const section of required) {
    const count = headings.filter(heading => heading === section).length;
    if (!count) issues.push(`missing heading: ## ${section}`);
    else if (count > 1) issues.push(`duplicate heading: ## ${section}`);
  }
  const present = headings.filter(heading => required.includes(heading));
  if (required.every(section => present.includes(section)) && present.join("|") !== required.join("|")) {
    issues.push("required headings are out of order or duplicated");
  }
  return issues;
}

function localTarget(path: string, url: string): string | undefined {
  if (!url || url.startsWith("#") || url.startsWith("//") || /^[a-z][a-z\d+.-]*:/i.test(url)) return;
  const file = decodeURIComponent(url.split(/[?#]/)[0]);
  return file ? resolve(dirname(path), file) : undefined;
}

function links(tree: Root): { urls: string[]; unresolved: string[] } {
  const definitions = new Map<string, string>();
  const urls: string[] = [];
  const unresolved: string[] = [];
  visit(tree, node => {
    if (node.type === "definition" && !definitions.has(node.identifier)) definitions.set(node.identifier, node.url);
  });
  visit(tree, node => {
    if (node.type === "link" || node.type === "image") urls.push(node.url);
    if (node.type === "linkReference" || node.type === "imageReference") {
      const url = definitions.get(node.identifier);
      if (url !== undefined) urls.push(url);
      else unresolved.push(node.identifier);
    }
  });
  return { urls, unresolved };
}

function sectionLinks(tree: Root, title: string): string[] {
  let included = false;
  const children = tree.children.filter(node => {
    if (node.type === "heading" && node.depth <= 2) {
      included = node.depth === 2 && nodeText(node) === title;
    }
    return included || node.type === "definition";
  });
  // Definitions may sit outside the section that references them.
  return links({ type: "root", children }).urls;
}

function skillBody(path: string, text: string, report: (message: string) => void): string {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  if (!match) {
    report("skill requires YAML frontmatter");
    return text;
  }
  const document = parseDocument(match[1]);
  if (document.errors.length) {
    report("invalid skill YAML frontmatter");
    return text.slice(match[0].length);
  }
  const metadata: unknown = document.toJS({ maxAliasCount: 20 });
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    report("skill frontmatter must be a mapping");
  } else {
    const { name, description } = metadata as Record<string, unknown>;
    if (typeof name !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) || name.length > 64) {
      report("invalid skill name");
    } else if (name !== basename(dirname(path))) report("skill name does not match its folder");
    if (typeof description !== "string" || !description.trim() || description.length > 1024 || /[<>]/.test(description)) {
      report("invalid skill description");
    }
  }
  const body = text.slice(match[0].length);
  if (/\[TODO:/i.test(body) || /\[TODO:/i.test(match[1])) report("unfinished skill placeholder");
  return body;
}

/** Checks maintained contracts only; historical reports and remote URLs are not crawled. */
export async function checkDocumentation(workspaceRoot: string): Promise<DocumentationViolation[]> {
  const root = resolve(workspaceRoot);
  const files = await contracts(root);
  const fileSet = new Set(files);
  const violations: DocumentationViolation[] = [];
  const linkedSkills = new Map<string, Set<string>>();
  const routingSections = new Map([
    [join(root, "AGENTS.md"), "Skills"],
    [join(root, ".agents", "skills", "README.md"), "Ontology"],
  ]);
  const skillPaths = new Set(files.filter(path => basename(path) === "SKILL.md" && path.startsWith(join(root, ".agents", "skills") + sep)));

  for (const path of files) {
    const report = (message: string) => { violations.push({ path, message }); };
    let text = await readFile(path, "utf8");
    if (basename(path) === "SKILL.md") {
      try { text = skillBody(path, text, report); }
      catch { report("invalid skill YAML value or alias expansion"); continue; }
    }
    const tree = parser.parse(text);
    if (basename(path) === "README.md") {
      if (!fileSet.has(join(dirname(path), "AGENTS.md"))) report("README.md is missing its sibling AGENTS.md");
      for (const message of sectionViolations(tree, readmeSections)) report(message);
    } else if (basename(path) === "AGENTS.md") {
      for (const message of sectionViolations(tree, agentSections)) report(message);
    }

    const found = links(tree);
    for (const id of found.unresolved) report(`undefined link reference: ${id}`);
    const routingSection = routingSections.get(path);
    const routeUrls = new Set(routingSection ? sectionLinks(tree, routingSection) : []);
    const targets = new Set<string>();
    for (const url of new Set(found.urls)) {
      let target: string | undefined;
      try { target = localTarget(path, url); }
      catch { report(`invalid local link encoding: ${url}`); continue; }
      if (!target) continue;
      try { await stat(target); }
      catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT" && (error as NodeJS.ErrnoException).code !== "ENOTDIR") throw error;
        report(`missing local link target: ${url}`);
      }
      if (basename(target) === "SKILL.md") {
        if (routeUrls.has(url)) targets.add(target);
        if (!fileSet.has(target)) report(`routed skill is not a repository contract: ${url}`);
      }
    }
    linkedSkills.set(path, targets);
  }

  for (const routingPath of routingSections.keys()) {
    for (const skillPath of skillPaths) {
      if (!linkedSkills.get(routingPath)?.has(skillPath)) {
        violations.push({ path: routingPath, message: `skill is missing from routing: ${basename(dirname(skillPath))}` });
      }
    }
  }
  return violations;
}
