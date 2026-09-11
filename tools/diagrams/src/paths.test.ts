import { mkdtemp, mkdir, symlink, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { workspacePath } from "./paths";

describe("workspace artifact paths", () => {
  it("accepts nested outputs and rejects traversal and symlink escapes", async () => {
    const root = await mkdtemp(join(tmpdir(), "diagram-paths-"));
    try {
      const workspace = join(root, "workspace"); await mkdir(workspace);
      const outside = join(root, "outside"); await mkdir(outside);
      await expect(workspacePath(workspace, "dist/new/diagram.svg")).resolves.toContain("/dist/new/diagram.svg");
      await expect(workspacePath(workspace, "../outside/file.svg")).rejects.toThrow();
      await symlink(outside, join(workspace, "escape"));
      await expect(workspacePath(workspace, "escape/file.svg")).rejects.toThrow("symlink");
      await writeFile(join(outside, "file.svg"), "original");
      await symlink(join(outside, "file.svg"), join(workspace, "file.svg"));
      await expect(workspacePath(workspace, "file.svg")).rejects.toThrow("symlink");
    } finally { await rm(root, { recursive:true, force:true }); }
  });
});
