import { lstat, realpath } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";

export async function workspacePath(workspace: string, value: string): Promise<string> {
  const root = await realpath(workspace);
  const path = resolve(root, value);
  const inside = (candidate: string) => { const rel = relative(root, candidate); return rel !== ".." && !rel.startsWith(`..${sep}`) && !isAbsolute(rel); };
  if (!value.trim() || !inside(path) || path === root) throw new Error("Input and output paths must be inside the workspace");
  let ancestor = path;
  while (true) {
    try { await lstat(ancestor); break; } catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; ancestor = dirname(ancestor); }
  }
  if (!inside(await realpath(ancestor))) throw new Error("A path symlink escapes the workspace");
  return path;
}
