import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { thomDesignTokens } from "@th-m/design-theme";
import { generateKnowledgeProof } from "../src/generate.ts";
import type { TypeScriptWorkspaceSnapshot } from "../src/types.ts";

const temporary: string[] = [];
afterEach(async () => Promise.all(temporary.splice(0).map((path) => rm(path, { recursive: true, force: true }))));

async function workspaceFixture(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "knowledge-gen-"));
  temporary.push(root);
  await mkdir(join(root, "fixtures"));
  const snapshot: TypeScriptWorkspaceSnapshot = {
    schemaVersion: 1,
    kind: "typescript-workspace",
    id: "fixture",
    title: "Fixture",
    repository: { identity: "https://example.test/repo.git", revision: "a".repeat(40), sourcePath: "libs/schema", tsconfigPath: "tsconfig.json" },
    compilerVersion: "7.0.2",
    contentHash: "b".repeat(64),
    packages: [{ id: "@fixture/schema/model", name: "@fixture/schema/model", path: "libs/schema/model", capability: "model", tags: [], dependencies: [], exports: ["Shape"], sourceHashes: [] }],
    symbols: [{ id: "shape", name: "Shape", packageId: "@fixture/schema/model", kind: "interface", sourcePath: "libs/schema/model/src/shape.ts", line: 1, column: 1, display: "export interface Shape { id: string }", deprecated: false, extends: [], references: [], unionMembers: [], intersectionMembers: [] }],
    diagnostics: [],
  };
  await writeFile(join(root, "fixtures/model.json"), JSON.stringify(snapshot));
  await writeFile(join(root, "fixtures/proof.json"), JSON.stringify({ schemaVersion: 1, id: "proof", title: "Proof", sources: [{ id: "typescript", kind: "typescript-workspace-snapshot", title: "TypeScript", path: "fixtures/model.json", perspectives: ["hierarchy", "public-api"] }], reviewCriteria: ["fidelity"] }));
  return root;
}

describe("knowledge proof generator", () => {
  it("writes complete, accessible, self-contained artifact pairs and board links", async () => {
    const root = await workspaceFixture();
    const generated = await generateKnowledgeProof({ workspaceRoot: root, manifest: "fixtures/proof.json", output: "dist/proof" });
    expect(generated.report.sources[0].artifacts).toHaveLength(2);
    const svg = await readFile(join(root, "dist/proof/typescript/schema-hierarchy.svg"), "utf8");
    expect(svg).toContain("role=\"img\"");
    expect(svg).toContain("data:font/woff2;base64,");
    expect(svg).toContain(thomDesignTokens.color.background);
    expect(svg).toContain(thomDesignTokens.color.primary.default);
    expect((await readFile(join(root, "dist/proof/typescript/schema-hierarchy@2x.png"))).byteLength).toBeGreaterThan(1000);
    const board = await readFile(generated.boardPath, "utf8");
    expect(board).toContain("typescript/schema-hierarchy.svg");
    expect(board).toContain("complete public API register");
    expect(board).toContain(`background:${thomDesignTokens.color.background}`);
    expect(board).not.toMatch(/https?:\/\/(?:fonts|cdn)/);
  }, 20_000);

  it("leaves the previous output untouched when generation fails", async () => {
    const root = await workspaceFixture();
    await mkdir(join(root, "dist/proof"), { recursive: true });
    await writeFile(join(root, "dist/proof/sentinel.txt"), "previous");
    const manifest = JSON.parse(await readFile(join(root, "fixtures/proof.json"), "utf8"));
    manifest.sources[0].path = "fixtures/missing.json";
    await writeFile(join(root, "fixtures/broken.json"), JSON.stringify(manifest));
    await expect(generateKnowledgeProof({ workspaceRoot: root, manifest: "fixtures/broken.json", output: "dist/proof" })).rejects.toThrow();
    expect(await readFile(join(root, "dist/proof/sentinel.txt"), "utf8")).toBe("previous");
  });
});
