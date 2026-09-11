import { afterEach, describe, expect, it } from "vitest";
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { documentationViolations } from "./repository-policy";

const readme = "# Owner\n\n## Purpose\n\nPurpose.\n\n## Boundaries\n\nBoundaries.\n\n## Ontology\n\nConcepts.\n\n## Key Terms\n\nTerms.\n";
const agents = "# Owner Contract\n\n## Operational Flow\n\nSteps.\n\n## Required Verification Parameters Within Nested Context\n\nChecks.\n\n## Required Invariants Within Folder Context\n\nRules.\n";
const skill = "---\nname: example\ndescription: A focused example procedure.\n---\n\n# Example\n\nReturn the requested result.\n";
const scratch = resolve(import.meta.dirname, "../../../.bun-tmp");
const roots: string[] = [];

async function fixture(files: Record<string, string> = {}): Promise<string> {
  await mkdir(scratch, { recursive: true });
  const root = await mkdtemp(join(scratch, "documentation-policy-"));
  roots.push(root);
  for (const [path, text] of Object.entries({ "README.md": readme, "AGENTS.md": agents, ...files })) {
    await mkdir(dirname(join(root, path)), { recursive: true });
    await writeFile(join(root, path), text);
  }
  return root;
}

async function messages(files: Record<string, string>): Promise<string[]> {
  return (await documentationViolations(await fixture(files))).map(issue => issue.message);
}

function skillFiles(): Record<string, string> {
  return {
    "AGENTS.md": agents + "\n## Skills\n\n[Example](.agents/skills/example/SKILL.md)\n",
    ".agents/skills/README.md": readme.replace("Concepts.", "[Example](example/SKILL.md)"),
    ".agents/skills/AGENTS.md": agents,
    ".agents/skills/example/SKILL.md": skill,
  };
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true })));
});

describe("documentation contract integrity", () => {
  it("accepts ordered contracts, optional sections, external URLs, and conceptual examples", async () => {
    expect(await messages({ "README.md": readme + "\n## Public API\n\n[Reference](https://example.test/unavailable)\n\n```ts\nconst text = '[Example](missing.ts)';\n```\n" })).toEqual([]);
  });

  it.each(["Purpose", "Boundaries", "Ontology", "Key Terms"])("rejects missing %s", async section => {
    expect(await messages({ "README.md": readme.replace(`## ${section}`, `### ${section}`) })).toContain(`missing heading: ## ${section}`);
  });

  it("does not accept heading examples as actual sections", async () => {
    expect(await messages({ "README.md": "```md\n" + readme + "```\n" })).toContain("missing heading: ## Purpose");
  });

  it("does not accept headings inside a blockquote", async () => {
    expect(await messages({ "README.md": readme.replace("## Purpose", "> ## Purpose") })).toContain("missing heading: ## Purpose");
  });

  it("rejects duplicates and changed order", async () => {
    expect(await messages({ "README.md": readme + "\n## Ontology\n" })).toContain("duplicate heading: ## Ontology");
    const swapped = readme.replace("## Purpose", "## Key Terms").replace(/## Key Terms(?=\n\nTerms)/, "## Purpose");
    expect(await messages({ "README.md": swapped })).toContain("required headings are out of order or duplicated");
  });

  it("requires a sibling and checks standalone AGENTS files", async () => {
    const issues = await messages({ "feature/README.md": readme, "other/AGENTS.md": "# Incomplete\n" });
    expect(issues).toContain("README.md is missing its sibling AGENTS.md");
    expect(issues).toContain("missing heading: ## Operational Flow");
  });

  it("checks AGENTS heading order", async () => {
    const flipped = agents.replace("Operational Flow", "Required Invariants Within Folder Context")
      .replace(/Required Invariants Within Folder Context(?=\n\nRules)/, "Operational Flow");
    expect(await messages({ "AGENTS.md": flipped })).toContain("required headings are out of order or duplicated");
  });

  it("checks inline, image, and reference-style file links", async () => {
    const issues = await messages({ "README.md": readme + "\n[Inline](missing.ts)\n\n![Image](missing.png)\n\n[Named][target]\n\n[target]: other.md\n" });
    expect(issues).toContain("missing local link target: missing.ts");
    expect(issues).toContain("missing local link target: missing.png");
    expect(issues).toContain("missing local link target: other.md");
  });

  it("resolves relative links, encoded spaces, reference case, directories and fragments", async () => {
    expect(await messages({
      "folder/README.md": readme + "\n[Source](../source%20file.ts#symbol)\n\n[Parent][parent]\n\n[PARENT]: ../\n\n[Section](#purpose)\n",
      "folder/AGENTS.md": agents,
      "source file.ts": "export const x = 1;\n",
    })).toEqual([]);
  });

  it("reports malformed URL escapes rather than throwing", async () => {
    expect(await messages({ "README.md": readme + "\n[File](bad%ZZ.md)\n" })).toContain("invalid local link encoding: bad%ZZ.md");
  });

  it("ignores generated, vendor, dependency and cache contracts", async () => {
    const files = Object.fromEntries(["dist", "dist-knowledge", "node_modules", "vendor", ".nx", ".cache", ".bun-tmp"]
      .map(dir => [`${dir}/README.md`, "# Generated\n"]));
    expect(await messages(files)).toEqual([]);
  });

  it("does not follow symlinked trees", async () => {
    const root = await fixture();
    const outside = await fixture({ "README.md": "# Incomplete\n" });
    await symlink(outside, join(root, "external"), "dir");
    expect(await documentationViolations(root)).toEqual([]);
  });
});

describe("repository skill integrity", () => {
  it("accepts a routed skill with block YAML and optional metadata", async () => {
    const files = skillFiles();
    files[".agents/skills/example/SKILL.md"] = skill.replace("description: A focused example procedure.", "description: >\n  A focused\n  example procedure.\nmetadata:\n  short-description: Example");
    expect(await messages(files)).toEqual([]);
  });

  it.each([
    ["# No frontmatter", "skill requires YAML frontmatter"],
    ["---\nname: [\n---\n", "invalid skill YAML frontmatter"],
    ["---\n- name\n---\n", "skill frontmatter must be a mapping"],
    [skill.replace("name: example", "name: Example"), "invalid skill name"],
    [skill.replace("name: example", "name: different"), "skill name does not match its folder"],
    [skill.replace("description: A focused example procedure.", "description: 12"), "invalid skill description"],
    [skill.replace("description: A focused example procedure.", "description: ''"), "invalid skill description"],
    [skill.replace("description: A focused example procedure.\n", ""), "invalid skill description"],
    [skill.replace("name: example", "name: example\nname: again"), "invalid skill YAML frontmatter"],
    [skill + "\n[TODO: finish]\n", "unfinished skill placeholder"],
  ])("rejects malformed skill metadata (%#)", async (content, expected) => {
    expect(await messages({ ...skillFiles(), ".agents/skills/example/SKILL.md": content })).toContain(expected);
  });

  it("requires both catalog and root routing", async () => {
    const files = skillFiles();
    files["AGENTS.md"] = agents;
    files[".agents/skills/README.md"] = readme;
    const issues = await documentationViolations(await fixture(files));
    expect(issues.filter(issue => issue.message === "skill is missing from routing: example")).toHaveLength(2);
  });

  it("rejects a route to a missing skill", async () => {
    expect(await messages({ "AGENTS.md": agents + "\n## Skills\n\n[Missing](.agents/skills/missing/SKILL.md)\n" }))
      .toContain("routed skill is not a repository contract: .agents/skills/missing/SKILL.md");
  });

  it("requires links in the designated routing sections", async () => {
    const files = skillFiles();
    files["AGENTS.md"] = files["AGENTS.md"].replace("## Skills", "## Other");
    files[".agents/skills/README.md"] = readme + "\n[Example](example/SKILL.md)\n";
    const issues = await documentationViolations(await fixture(files));
    expect(issues.filter(issue => issue.message === "skill is missing from routing: example")).toHaveLength(2);
  });

  it("allows routing references defined outside their section", async () => {
    const files = skillFiles();
    files["AGENTS.md"] = agents + "\n## Skills\n\n[Example][skill]\n\n## Downlinks\n\n[skill]: .agents/skills/example/SKILL.md\n";
    expect(await messages(files)).toEqual([]);
  });

  it("checks skill body links", async () => {
    expect(await messages({ ...skillFiles(), ".agents/skills/example/SKILL.md": skill + "\n[Contract](missing.md)\n" }))
      .toContain("missing local link target: missing.md");
  });
});
