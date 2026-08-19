import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
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

    expect(await readFile(result.svgPath, "utf8")).toContain("Newsreader Embedded");
    expect((await stat(result.pngPath)).size).toBeGreaterThan(1_000);
  }, 20_000);

  it("rejects output outside the workspace", async () => {
    const root = await mkdtemp(join(tmpdir(), "th-m-graph-"));
    roots.push(root);
    await writeFile(join(root, "graph.json"), JSON.stringify(createWeatherGraph()));

    let thrown: unknown;
    try {
      await generateGraphArtifacts({ workspaceRoot: root, input: "graph.json", output: "../outside" });
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(Error);
    expect((thrown as Error).message).toContain("inside the workspace");
  });
});
