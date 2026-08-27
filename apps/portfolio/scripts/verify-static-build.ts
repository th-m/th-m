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
if (manifest.schemaVersion !== 3 || !Array.isArray(manifest.posts)) {
  throw new Error("Staged blog manifest must use schema version 3.");
}

for (const post of manifest.posts) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) {
    throw new Error(`Static build contains an invalid article slug: ${post.slug}`);
  }
  if (post.articlePath !== `posts/${post.slug}/article.mdx`) {
    throw new Error(`${post.slug} does not expose its canonical raw MDX path.`);
  }
  if (post.assetRegistryPath !== `posts/${post.slug}/assets.json`) {
    throw new Error(`${post.slug} does not expose its serialized asset registry.`);
  }
  await requireHtml(`writing/${post.slug}/index.html`, "article-page");
  const article = await (await requireFile(`_content/${post.articlePath}`)).text();
  if (article.startsWith("---")) throw new Error(`${post.articlePath} must omit private publication frontmatter.`);
  if (!article.startsWith(`# ${post.title}\n`)) throw new Error(`${post.articlePath} must begin with its canonical H1.`);
  const assets = await (await requireFile(`_content/${post.assetRegistryPath}`)).json() as unknown;
  if (!assets || typeof assets !== "object" || Array.isArray(assets)) {
    throw new Error(`${post.assetRegistryPath} must contain a serialized asset registry.`);
  }
  if (await Bun.file(publicFile(`_content/posts/${post.slug}/index.tsx`)).exists()) {
    throw new Error(`${post.slug} exposes obsolete React page source.`);
  }
}

console.log(`Verified static portfolio shell and ${manifest.posts.length} published article route${manifest.posts.length === 1 ? "" : "s"}.`);
