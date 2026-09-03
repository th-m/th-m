import { access, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { BlogManifest, PublishedPost } from "@th-m/blogs/publish";
import { articleAssetUrl, organizeBlogPosts } from "../src/content/blog-content";

const post: PublishedPost = {
  slug: "public-title",
  title: "Public title",
  description: "A concise public description.",
  publishedAt: "2026-08-16",
  tags: [],
  articlePath: "posts/public-title/article.mdx",
  assetRegistryPath: "posts/public-title/assets.json",
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
      articlePath: "posts/public-title-addendum/article.mdx",
      assetRegistryPath: "posts/public-title-addendum/assets.json",
    };

    const organized = organizeBlogPosts([addendum, post]);

    expect(organized.primaryPosts).toEqual([post]);
    expect(organized.addendaByParent.get(post.slug)).toEqual([addendum]);
  });
});

describe("article MDX module staging", () => {
  const projectRoot = process.cwd();
  const slug = "vision-and-values";

  it.each([
    { slug: "vision-and-values", title: "Vision and Values" },
    { slug: "truth-and-inference", title: "Truth and Inference" },
    { slug: "understanding-and-bottlenecks", title: "Understanding and Bottlenecks" },
  ])("publishes $title with matching content paths", async ({ slug, title }) => {
    const contentRoot = resolve(projectRoot, "public/_content");
    const manifest = JSON.parse(await readFile(resolve(contentRoot, "manifest.json"), "utf8")) as BlogManifest;
    const article = manifest.posts.find((entry) => entry.slug === slug);

    expect(article).toMatchObject({
      title,
      articlePath: `posts/${slug}/article.mdx`,
      assetRegistryPath: `posts/${slug}/assets.json`,
    });
    await expect(readFile(resolve(contentRoot, `posts/${slug}/article.mdx`), "utf8")).resolves.toContain(
      `# ${title}`,
    );
  });

  it("stages article modules while resolving shared figures through package exports", async () => {
    const generatedPage = resolve(projectRoot, "src/generated/blog-pages", slug);
    await expect(readFile(resolve(generatedPage, "article.mdx"), "utf8")).resolves.toContain(
      'from "./article-components"',
    );
    await expect(readFile(resolve(generatedPage, "article-components.tsx"), "utf8")).resolves.toContain(
      'export { default } from "./components/registry"',
    );
    await expect(readFile(resolve(generatedPage, "components/registry.ts"), "utf8")).resolves.toContain(
      'from "@th-m/blogs/components/neural-training-figure"',
    );
    expect((await readdir(resolve(generatedPage, "components"))).sort()).toEqual([
      "goal-tree-figure.css",
      "goal-tree-figure.tsx",
      "governing-loop-figure.tsx",
      "population-mean-figure.css",
      "population-mean-figure.tsx",
      "registry.ts",
      "relational-knowing-figure.css",
      "relational-knowing-figure.tsx",
      "strategy-map-figure.css",
      "strategy-map-figure.tsx",
      "value-ladder.tsx",
    ]);
    await expect(readFile(resolve(generatedPage, "components/value-ladder.tsx"), "utf8")).resolves.toContain(
      "const valueLadder =",
    );
    await expect(readFile(resolve(generatedPage, "components/governing-loop-figure.tsx"), "utf8")).resolves.toContain(
      "const governingLoop =",
    );
    await expect(readFile(resolve(generatedPage, "article-assets.ts"), "utf8")).resolves.toContain(
      '"neural-training-figure": { kind: "interactive"',
    );
    await expect(access(resolve(generatedPage, "goals-article.css"))).resolves.toBeUndefined();

    const generatedEntries = await readdir(generatedPage);
    expect(generatedEntries).not.toContain("neural-training-figure.tsx");
    expect(generatedEntries).not.toContain("neural-training-figure.css");
    expect(generatedEntries).not.toContain("neural-training-figure.test.tsx");

    const publicEntries = await readdir(resolve(projectRoot, "public/_content/posts", slug));
    expect(publicEntries).toContain("article.mdx");
    expect(publicEntries).toContain("assets.json");
    expect(publicEntries).not.toContain("components");
    expect(publicEntries).not.toContain("article-components.tsx");
    expect(publicEntries).not.toContain("neural-training-figure.tsx");
    expect(publicEntries).not.toContain("neural-training-figure.css");
    expect(publicEntries).not.toContain("neural-training-figure.test.tsx");
  });
});
