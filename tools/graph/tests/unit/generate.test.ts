import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { thomDesignTokens } from "@th-m/design-theme";
import { generateGraphArtifacts } from "../../src/generate";
import { createWeatherGraph } from "../../src/seed";

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("generateGraphArtifacts", () => {
  it("writes a self-contained SVG and 2x PNG pair", async () => {
    const root = await mkdtemp(join(tmpdir(), "th-m-graph-"));
    roots.push(root);
    await writeFile(join(root, "graph.json"), JSON.stringify(createWeatherGraph("2026-01-01T00:00:00.000Z")));

    const result = await generateGraphArtifacts({
      workspaceRoot: root,
      input: "graph.json",
      output: "generated/weather",
      mode: "poster",
    });

    const svg = await readFile(result.svgPath, "utf8");
    expect(svg).toContain("Newsreader Embedded");
    expect(svg).toContain(thomDesignTokens.color.background);
    expect(svg).toContain(thomDesignTokens.color.primary.default);
    expect((await stat(result.pngPath)).size).toBeGreaterThan(1_000);
  }, 20_000);

  it("rejects output outside the workspace", async () => {
    const root = await mkdtemp(join(tmpdir(), "th-m-graph-"));
    roots.push(root);
    await writeFile(join(root, "graph.json"), JSON.stringify(createWeatherGraph()));

    await expect(
      generateGraphArtifacts({ workspaceRoot: root, input: "graph.json", output: "../outside" }),
    ).rejects.toThrow("inside the workspace");
  });
});
