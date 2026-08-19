import { describe, expect, it } from "vitest";
import { createSetProjection } from "../src/typescript-workspace.ts";
import type { TypeScriptWorkspaceSnapshot } from "../src/types.ts";

const snapshot: TypeScriptWorkspaceSnapshot = {
  schemaVersion: 1,
  kind: "typescript-workspace",
  id: "songs",
  title: "Songs",
  repository: { identity: "https://example.test/repo.git", revision: "a".repeat(40), sourcePath: "libs/schema", tsconfigPath: "tsconfig.base.json" },
  compilerVersion: "7.0.2",
  contentHash: "b".repeat(64),
  packages: [{ id: "@ss/schema/songs/model", name: "@ss/schema/songs/model", path: "libs/schema/songs/model", capability: "songs", tags: [], dependencies: [], exports: ["Base", "Child", "Alias", "Combined"], sourceHashes: [] }],
  symbols: [
    { id: "base", name: "Base", packageId: "@ss/schema/songs/model", kind: "interface", sourcePath: "base.ts", line: 1, column: 1, display: "export interface Base { id: string }", deprecated: false, extends: [], references: [], unionMembers: [], intersectionMembers: [] },
    { id: "child", name: "Child", packageId: "@ss/schema/songs/model", kind: "interface", sourcePath: "child.ts", line: 1, column: 1, display: "export interface Child extends Base { value: number }", deprecated: false, extends: ["Base"], references: ["Base"], unionMembers: [], intersectionMembers: [] },
    { id: "alias", name: "Alias", packageId: "@ss/schema/songs/model", kind: "alias", sourcePath: "alias.ts", line: 1, column: 1, display: "export type Alias = Base;", deprecated: true, extends: [], references: ["Base"], unionMembers: [], intersectionMembers: [], aliasTarget: "Base" },
    { id: "combined", name: "Combined", packageId: "@ss/schema/songs/model", kind: "alias", sourcePath: "combined.ts", line: 1, column: 1, display: "export type Combined = Base & { more: true };", deprecated: false, extends: [], references: ["Base"], unionMembers: [], intersectionMembers: ["Base"] },
  ],
  diagnostics: [],
};

describe("focused TypeScript set projection", () => {
  it("derives aliases, inheritance, intersections, and approximation warnings", () => {
    const projection = createSetProjection(snapshot, ["Base", "Child", "Alias", "Combined"]);
    expect(projection.relations).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: "equivalent", sourceId: "alias", targetId: "base" }),
      expect.objectContaining({ kind: "proper-subset", sourceId: "child", targetId: "base" }),
      expect.objectContaining({ kind: "proper-subset", sourceId: "combined", targetId: "base", confidence: "approximate" }),
    ]));
    expect(projection.warnings.join(" ")).toMatch(/open structural/i);
  });

  it("enforces the 24-symbol analysis boundary", () => {
    expect(() => createSetProjection(snapshot, Array.from({ length: 25 }, () => "Base"))).toThrow(/at most 24/);
  });
});
