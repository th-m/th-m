import { readFile } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";
import { createIsomorphicFn } from "@tanstack/react-start";
import type { BlogManifest, PublishedPost } from "@th-m/blogs/publish";

export interface PublishedArticle extends PublishedPost {
  markdown: string;
}

function assertManifest(value: unknown): asserts value is BlogManifest {
  if (!value || typeof value !== "object" || (value as { schemaVersion?: unknown }).schemaVersion !== 2) {
    throw new Error("Published blog manifest must use schema version 2.");
  }
  if (!Array.isArray((value as { posts?: unknown }).posts)) {
    throw new Error("Published blog manifest must contain a posts array.");
  }
}

const readPublishedText = createIsomorphicFn()
  .server(async (publicPath: string) => {
    const contentRoot = resolve(process.cwd(), "public/_content");
    const filePath = resolve(contentRoot, publicPath.replace(/^\/+/, ""));
    const resolved = relative(contentRoot, filePath);
    if (resolved === ".." || resolved.startsWith(`..${sep}`)) {
      throw new Error(`Published content path escapes its root: ${publicPath}`);
    }
    return readFile(filePath, "utf8");
  })
  .client(async (publicPath: string) => {
    const response = await fetch(`/_content/${publicPath.replace(/^\/+/, "")}`);
    if (!response.ok) throw new Error(`Unable to load published content (${response.status}).`);
    return response.text();
  });

export async function loadBlogManifest(): Promise<BlogManifest> {
  const manifest = JSON.parse(await readPublishedText("manifest.json")) as unknown;
  assertManifest(manifest);
  return manifest;
}

export async function loadPublishedArticle(slug: string): Promise<PublishedArticle | null> {
  const manifest = await loadBlogManifest();
  const post = manifest.posts.find((candidate) => candidate.slug === slug);
  if (!post) return null;
  return { ...post, markdown: await readPublishedText(post.articlePath) };
}

export function organizeBlogPosts(posts: BlogManifest["posts"]): {
  primaryPosts: BlogManifest["posts"];
  addendaByParent: Map<string, BlogManifest["posts"]>;
} {
  const primaryPosts = posts.filter((post) => !post.addendumTo);
  const addendaByParent = new Map<string, BlogManifest["posts"]>();

  for (const post of posts) {
    if (!post.addendumTo) continue;
    const addenda = addendaByParent.get(post.addendumTo) ?? [];
    addenda.push(post);
    addendaByParent.set(post.addendumTo, addenda);
  }

  return { primaryPosts, addendaByParent };
}

export function articleAssetUrl(post: PublishedPost, value: string): string {
  if (/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(value)) return value;

  const match = value.match(/^([^?#]*)(.*)$/u);
  const path = match?.[1] ?? value;
  const suffix = match?.[2] ?? "";
  const normalized = path.replace(/^\.\//, "");
  if (!post.assetsPath || !normalized.startsWith("assets/") || normalized.includes("..")) return value;
  return `/_content/${post.assetsPath}/${normalized.slice("assets/".length)}${suffix}`;
}
