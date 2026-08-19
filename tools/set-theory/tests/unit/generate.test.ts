import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { thomDesignTokens } from "@th-m/design-theme";
import { generateSetAtlasArtifacts } from "../../src/generate";

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("generateSetAtlasArtifacts", () => {
  it("writes a self-contained SVG and 2x PNG pair", async () => {
    const root = await mkdtemp(join(tmpdir(), "th-m-sets-"));
    roots.push(root);
    await writeFile(join(root, "tsconfig.json"), '{"compilerOptions":{"strict":true,"noEmit":true}}');
    await writeFile(
      join(root, "sets.ts"),
      'type Animal = "cat" | "dog";\ntype Cat = "cat";\ntype Plant = "fern";\n',
    );

    const result = await generateSetAtlasArtifacts({
      workspaceRoot: root,
      input: "sets.ts",
      output: "generated/sets",
    });

    const svg = await readFile(result.svgPath, "utf8");
    expect(svg).toContain("typescript-set-atlas");
    expect(svg).toContain(thomDesignTokens.color.background);
    expect(svg).toContain(thomDesignTokens.color.primary.default);
    expect((await stat(result.pngPath)).size).toBeGreaterThan(1_000);
  }, 20_000);

  it("fails when TypeScript has compiler errors", async () => {
    const root = await mkdtemp(join(tmpdir(), "th-m-sets-"));
    roots.push(root);
    await writeFile(join(root, "tsconfig.json"), '{"compilerOptions":{"strict":true,"noEmit":true}}');
    await writeFile(join(root, "invalid.ts"), "type Broken = MissingType;\n");

    await expect(
      generateSetAtlasArtifacts({ workspaceRoot: root, input: "invalid.ts", output: "generated/invalid" }),
    ).rejects.toThrow("TypeScript analysis failed");
  });
});
