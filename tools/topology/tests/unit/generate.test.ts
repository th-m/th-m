import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { thomDesignTokens } from "@th-m/design-theme";
import { createFactoryTopology } from "@th-m/topology-visualization/core";
import { generateTopologyArtifacts } from "../../src/generate";

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("generateTopologyArtifacts", () => {
  it("writes a self-contained SVG and 2x PNG pair", async () => {
    const root = await mkdtemp(join(tmpdir(), "th-m-topology-"));
    roots.push(root);
    await writeFile(
      join(root, "topology.json"),
      JSON.stringify(createFactoryTopology("2026-01-01T00:00:00.000Z")),
    );

    const result = await generateTopologyArtifacts({
      workspaceRoot: root,
      input: "topology.json",
      output: "generated/factory",
      mode: "poster",
    });

    const svg = await readFile(result.svgPath, "utf8");
    expect(svg).toContain("Newsreader Embedded");
    expect(svg).toContain("IBM Plex Mono Embedded");
    expect(svg).toContain(thomDesignTokens.color.background);
    expect(svg).toContain(thomDesignTokens.color.primary.default);
    expect(svg).toContain("Dependencies flow toward more foundational layers");
    expect((await stat(result.pngPath)).size).toBeGreaterThan(1_000);
  }, 20_000);

  it("rejects invalid topology JSON", async () => {
    const root = await mkdtemp(join(tmpdir(), "th-m-topology-"));
    roots.push(root);
    await writeFile(join(root, "topology.json"), JSON.stringify({ schemaVersion: 99 }));

    let thrown: unknown;
    try {
      await generateTopologyArtifacts({ workspaceRoot: root, input: "topology.json", output: "generated/x" });
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(Error);
    expect((thrown as Error).message).toContain("not a valid TopologyDocument");
  });

  it("rejects output outside the workspace", async () => {
    const root = await mkdtemp(join(tmpdir(), "th-m-topology-"));
    roots.push(root);
    await writeFile(
      join(root, "topology.json"),
      JSON.stringify(createFactoryTopology()),
    );

    let thrown: unknown;
    try {
      await generateTopologyArtifacts({ workspaceRoot: root, input: "topology.json", output: "../outside" });
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(Error);
    expect((thrown as Error).message).toContain("inside the workspace");
  });
});
