import { relative, resolve, sep } from "node:path";
import type { BlogManifest } from "@th-m/blogs/publish";

const projectRoot = resolve(import.meta.dir, "..");
const clientRoot = resolve(projectRoot, "dist/client");

function publicFile(relativePath: string): string {
  const candidate = resolve(clientRoot, relativePath);
  const resolved = relative(clientRoot, candidate);
  if (resolved === ".." || resolved.startsWith(`..${sep}`)) {
    throw new Error(`Static build path escapes dist/client: ${relativePath}`);
  }
  return candidate;
}

async function requireFile(relativePath: string): Promise<Bun.BunFile> {
  const file = Bun.file(publicFile(relativePath));
  if (!(await file.exists())) throw new Error(`Static build is missing ${relativePath}.`);
  return file;
}

async function requireHtml(relativePath: string, marker: string): Promise<void> {
  const html = await (await requireFile(relativePath)).text();
  if (!html.startsWith("<!DOCTYPE html>")) throw new Error(`${relativePath} is not an HTML document.`);
  if (!html.includes(marker)) throw new Error(`${relativePath} does not contain its expected route content.`);
}

await requireHtml("index.html", "Writings");
await requireHtml("brand/index.html", "Measured to stay itself at every scale.");
await requireHtml("embedding-space/index.html", "Meaning has neighborhoods, not addresses.");
await requireHtml("llm-visualization/index.html", "Inside a language model");
await requireHtml("laws/index.html", "Laws for making systems legible.");
await requireHtml("writing/index.html", "Ideas with enough structure to navigate.");
await requireHtml("_shell.html", "__TSR");

const manifest = await (await requireFile("_content/manifest.json")).json() as BlogManifest;
if (manifest.schemaVersion !== 2 || !Array.isArray(manifest.posts)) {
  throw new Error("Staged blog manifest must use schema version 2.");
}

for (const post of manifest.posts) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) {
    throw new Error(`Static build contains an invalid article slug: ${post.slug}`);
  }
  await requireHtml(`writing/${post.slug}/index.html`, "article-page");
  await requireFile(`_content/${post.articlePath}`);
}

console.log(`Verified static portfolio shell and ${manifest.posts.length} published article route${manifest.posts.length === 1 ? "" : "s"}.`);
