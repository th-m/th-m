import { cp, mkdir, rm } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";
import { buildBlogArtifact } from "@th-m/blogs/publish";

const projectRoot = resolve(import.meta.dir, "..");
const blogsRoot = resolve(projectRoot, "../blogs");
const sourceRoot = resolve(blogsRoot, "dist");
const targetRoot = resolve(projectRoot, "public/_content");

const targetRelative = relative(projectRoot, targetRoot);
if (targetRelative === ".." || targetRelative.startsWith(`..${sep}`)) {
  throw new Error(`Generated content path escapes the portfolio project: ${targetRoot}`);
}

const manifest = await buildBlogArtifact(blogsRoot);
await rm(targetRoot, { recursive: true, force: true });
await mkdir(targetRoot, { recursive: true });
await cp(sourceRoot, targetRoot, { recursive: true });

console.log(`Prepared ${manifest.posts.length} published article${manifest.posts.length === 1 ? "" : "s"} for the portfolio.`);
