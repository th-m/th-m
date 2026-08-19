import { execFile as execFileCallback } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { afterEach, describe, expect, it } from "vitest";
import { snapshotTypeScriptWorkspace } from "../src/snapshot.ts";

const execFile = promisify(execFileCallback);
const temporary: string[] = [];

afterEach(async () => {
  await Promise.all(temporary.splice(0).map((path) => rm(path, { recursive: true, force: true })));
});

async function fixture(): Promise<{ repository: string; workspace: string }> {
  const repository = await mkdtemp(join(tmpdir(), "knowledge-external-"));
  const workspace = await mkdtemp(join(tmpdir(), "knowledge-workspace-"));
  temporary.push(repository, workspace);
  await mkdir(join(repository, "libs/schema/base/model/src/lib"), { recursive: true });
  await mkdir(join(repository, "libs/schema/consumer/model/src/lib"), { recursive: true });
  await writeFile(join(repository, "tsconfig.base.json"), JSON.stringify({ compilerOptions: { paths: { "@fixture/schema/base/model": ["libs/schema/base/model/src/index.ts"] } } }));
  await writeFile(join(repository, "libs/schema/base/model/package.json"), JSON.stringify({ name: "@fixture/schema/base/model", nx: { tags: ["scope:schema"] } }));
  await writeFile(join(repository, "libs/schema/base/model/src/index.ts"), "export * from './lib/types.js';\n");
  await writeFile(join(repository, "libs/schema/base/model/src/lib/types.ts"), "export interface Base { id: string }\nexport interface Child extends Base { value: number }\nexport type Alias = Base;\nexport type Choice = Base | Child;\nexport type Refined = Base & { ready: true };\n");
  await writeFile(join(repository, "libs/schema/consumer/model/package.json"), JSON.stringify({ name: "@fixture/schema/consumer/model" }));
  await writeFile(join(repository, "libs/schema/consumer/model/src/index.ts"), "export type { Consumer } from './lib/consumer.js';\n");
  await writeFile(join(repository, "libs/schema/consumer/model/src/lib/consumer.ts"), "import type { Base } from '@fixture/schema/base/model';\nexport interface Consumer extends Base {}\n");
  await execFile("git", ["init", repository]);
  await execFile("git", ["-C", repository, "config", "user.email", "test@example.test"]);
  await execFile("git", ["-C", repository, "config", "user.name", "Test"]);
  await execFile("git", ["-C", repository, "add", "."]);
  await execFile("git", ["-C", repository, "commit", "-m", "fixture"]);
  return { repository, workspace };
}

describe("read-only TypeScript workspace snapshot", () => {
  it("discovers leaf packages, barrels, aliases, inheritance, unions, intersections, path aliases, and provenance without source mutation", async () => {
    const { repository, workspace } = await fixture();
    const sourceBefore = await readFile(join(repository, "libs/schema/base/model/src/lib/types.ts"), "utf8");
    const snapshot = await snapshotTypeScriptWorkspace({ workspaceRoot: workspace, repository, source: "libs/schema", tsconfig: "tsconfig.base.json", output: "evidence/model.json" });
    expect(snapshot.packages).toHaveLength(2);
    expect(snapshot.packages.find(({ id }) => id.includes("consumer"))?.dependencies).toEqual(["@fixture/schema/base/model"]);
    expect(snapshot.symbols.map(({ name }) => name)).toEqual(expect.arrayContaining(["Base", "Child", "Alias", "Choice", "Refined", "Consumer"]));
    expect(snapshot.symbols.find(({ name }) => name === "Child")?.extends).toEqual(["Base"]);
    expect(snapshot.symbols.find(({ name }) => name === "Alias")?.aliasTarget).toBe("Base");
    expect(snapshot.symbols.find(({ name }) => name === "Choice")?.unionMembers).toEqual(["Base", "Child"]);
    expect(snapshot.symbols.find(({ name }) => name === "Refined")?.intersectionMembers).toContain("Base");
    expect(snapshot.symbols.every(({ sourcePath }) => !sourcePath.startsWith("/"))).toBe(true);
    expect(JSON.stringify(snapshot)).not.toContain(repository);
    expect(await readFile(join(repository, "libs/schema/base/model/src/lib/types.ts"), "utf8")).toBe(sourceBefore);
    expect((await execFile("git", ["-C", repository, "status", "--porcelain"])).stdout).toBe("");
    expect(JSON.parse(await readFile(join(workspace, "evidence/model.json"), "utf8"))).toMatchObject({ contentHash: snapshot.contentHash });
  });

  it("rejects a dirty source subtree", async () => {
    const { repository, workspace } = await fixture();
    await writeFile(join(repository, "libs/schema/base/model/src/lib/types.ts"), "export type Dirty = true;\n");
    await expect(snapshotTypeScriptWorkspace({ workspaceRoot: workspace, repository, source: "libs/schema", tsconfig: "tsconfig.base.json", output: "model.json" })).rejects.toThrow(/Git-clean/);
  });

  it("rejects traversal and escaping source symlinks", async () => {
    const { repository, workspace } = await fixture();
    const outside = await mkdtemp(join(tmpdir(), "knowledge-outside-"));
    temporary.push(outside);
    await symlink(outside, join(repository, "escaped"));
    await expect(snapshotTypeScriptWorkspace({ workspaceRoot: workspace, repository, source: "escaped", tsconfig: "tsconfig.base.json", output: "model.json" })).rejects.toThrow(/escapes/);
    await expect(snapshotTypeScriptWorkspace({ workspaceRoot: workspace, repository, source: "../outside", tsconfig: "tsconfig.base.json", output: "model.json" })).rejects.toThrow(/escapes/);
  });
});
