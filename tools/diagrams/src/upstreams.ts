import { mkdir, readFile, access } from "node:fs/promises";
import { resolve } from "node:path";
import { createDiagramTheme, diagramStyleGuide } from "@th-m/diagram-theme";
import { run } from "./process";

export const upstreams = [
  { name: "diagram-design", url: "https://github.com/cathrynlavery/diagram-design.git", sha: "8d8b2993ee2256ee7dfc0eeb3b5713aba3b60792", skill: "skills/diagram-design" },
  { name: "fireworks-tech-graph", url: "https://github.com/yizhiyanhua-ai/fireworks-tech-graph.git", sha: "31fea364eda5f1852b1175f3d9e29ea31d22dcb4", skill: "." },
] as const;

export function upstreamRoot(workspace: string, name: string): string { return resolve(workspace, ".bun-tmp/diagram-tools", name); }

export async function assertUpstreams(workspace: string): Promise<void> {
  for (const source of upstreams) {
    const path = upstreamRoot(workspace, source.name);
    try { await access(resolve(path, ".git")); } catch { throw new Error("Run bun run nx run diagrams:setup first"); }
    if ((await run(["git", "-C", path, "rev-parse", "HEAD"])).trim() !== source.sha) throw new Error(`${source.name} revision differs from the pinned source`);
    if ((await run(["git", "-C", path, "status", "--porcelain"])).trim()) throw new Error(`${source.name} source was modified; preserve changes and restore the pinned checkout before generation`);
  }
}

export async function setup(workspace: string): Promise<void> {
  for (const source of upstreams) {
    const path = upstreamRoot(workspace, source.name);
    await mkdir(path, { recursive: true });
    try { await access(resolve(path, ".git")); } catch {
      await run(["git", "init", path]);
      await run(["git", "-C", path, "remote", "add", "origin", source.url]);
      await run(["git", "-C", path, "fetch", "--depth", "1", "origin", source.sha]);
      await run(["git", "-C", path, "checkout", "--detach", "FETCH_HEAD"]);
    }
    await readFile(resolve(path, "LICENSE"), "utf8");
  }
  await assertUpstreams(workspace);
  const output = resolve(workspace, "tools/diagrams/dist/theme");
  await mkdir(output, { recursive: true });
  await Bun.write(resolve(output, "style-guide.md"), diagramStyleGuide(createDiagramTheme()));
  await run([process.execPath, "run", "--bun", "playwright", "install", "chromium"], workspace);
  console.log(`Both tools are ready. THOM profile: ${output}/style-guide.md`);
}
