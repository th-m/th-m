import { access, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { PublishedPost } from "@th-m/blogs/publish";
import { articleAssetUrl, organizeBlogPosts } from "../src/content/blog-content";

const post: PublishedPost = {
  slug: "public-title",
  title: "Public title",
  description: "A concise public description.",
  publishedAt: "2026-08-16",
  tags: [],
  articlePath: "posts/public-title/article.md",
  assetsPath: "posts/public-title/assets",
};

describe("articleAssetUrl", () => {
  it("maps sibling article assets into the staged public content tree", () => {
    expect(articleAssetUrl(post, "assets/figure.svg")).toBe("/_content/posts/public-title/assets/figure.svg");
    expect(articleAssetUrl(post, "./assets/figure.svg?theme=dark#detail")).toBe(
      "/_content/posts/public-title/assets/figure.svg?theme=dark#detail",
    );
  });

  it("leaves external, root-relative, fragment, and escaping URLs unchanged", () => {
    for (const value of ["https://example.com/figure.svg", "/brand/thom.svg", "#detail", "../private.md"]) {
      expect(articleAssetUrl(post, value)).toBe(value);
    }
  });
});

describe("organizeBlogPosts", () => {
  it("keeps addenda out of the primary list and groups them beneath their parent", () => {
    const addendum: PublishedPost = {
      ...post,
      slug: "public-title-addendum",
      title: "Public title addendum",
      addendumTo: post.slug,
      articlePath: "posts/public-title-addendum/article.md",
    };

    const organized = organizeBlogPosts([addendum, post]);

    expect(organized.primaryPosts).toEqual([post]);
    expect(organized.addendaByParent.get(post.slug)).toEqual([addendum]);
  });
});

describe("article page module staging", () => {
  const projectRoot = process.cwd();
  const slug = "goals-solutions-and-value";

  it("compiles sibling TSX and CSS modules without exposing their sources as public content", async () => {
    const generatedPage = resolve(projectRoot, "src/generated/blog-pages", slug);
    await expect(readFile(resolve(generatedPage, "index.tsx"), "utf8")).resolves.toContain(
      'from "./neural-training-figure"',
    );
    await expect(readFile(resolve(generatedPage, "neural-training-figure.tsx"), "utf8")).resolves.toContain(
      'import "./neural-training-figure.css"',
    );
    await expect(access(resolve(generatedPage, "neural-training-figure.css"))).resolves.toBeUndefined();

    const publicEntries = await readdir(resolve(projectRoot, "public/_content/posts", slug));
    expect(publicEntries).not.toContain("index.tsx");
    expect(publicEntries).not.toContain("neural-training-figure.tsx");
    expect(publicEntries).not.toContain("neural-training-figure.css");
  });
});
