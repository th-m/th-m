import { access, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { buildBlogArtifact } from "../src/publish";

const temporaryRoots: string[] = [];

async function temporaryProject(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "th-m-blogs-"));
  await mkdir(join(root, "articles"));
  temporaryRoots.push(root);
  return root;
}

afterEach(async () => {
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("buildBlogArtifact", () => {
  const article = ({
    title = "Public title",
    description = "A concise public description.",
    publishedAt = "2026-08-16",
    updatedAt,
    tags = ["Ontology", "software"],
    h1 = title,
  }: {
    title?: string;
    description?: string;
    publishedAt?: string;
    updatedAt?: string;
    tags?: string[];
    h1?: string;
  } = {}) => `---\ntitle: ${title}\ndescription: ${description}\npublishedAt: ${publishedAt}\n${updatedAt ? `updatedAt: ${updatedAt}\n` : ""}tags: [${tags.join(", ")}]\n---\n# ${h1}\n\nBody.\n`;

  it("publishes only explicit articles and their assets", async () => {
    const root = await temporaryProject();
    await mkdir(join(root, "articles", "published", "assets"), { recursive: true });
    await mkdir(join(root, "articles", "published", "draft"));
    await mkdir(join(root, "articles", "unpublished", "draft"), { recursive: true });
    await mkdir(join(root, "outside-articles"));
    await writeFile(join(root, "articles", "published", "article.md"), article());
    await writeFile(join(root, "articles", "published", "draft", "outline.md"), "private outline");
    await writeFile(join(root, "articles", "published", "assets", "figure.svg"), "<svg/>");
    await writeFile(join(root, "articles", "unpublished", "draft", "outline.md"), "# Draft");
    await writeFile(join(root, "outside-articles", "article.md"), article({ title: "Outside", h1: "Outside" }));

    const manifest = await buildBlogArtifact(root);

    expect(manifest.posts).toEqual([
      {
        slug: "published",
        title: "Public title",
        description: "A concise public description.",
        publishedAt: "2026-08-16",
        tags: ["Ontology", "software"],
        articlePath: "posts/published/article.md",
        assetsPath: "posts/published/assets",
      },
    ]);
    await expect(access(join(root, "dist", "posts", "published", "article.md"))).resolves.toBeUndefined();
    await expect(access(join(root, "dist", "posts", "published", "draft"))).rejects.toThrow();
    await expect(access(join(root, "dist", "posts", "unpublished"))).rejects.toThrow();
  });

  it("stages an optional React page and marks the post with page: true", async () => {
    const root = await temporaryProject();
    await mkdir(join(root, "articles", "published"));
    await writeFile(join(root, "articles", "published", "article.md"), article());
    await writeFile(
      join(root, "articles", "published", "index.tsx"),
      'import type { PublishedPost } from "@th-m/blogs/publish";\nexport default function ArticlePage({ post }: { post: PublishedPost }) { return <h1>{post.title}</h1>; }\n',
    );

    const manifest = await buildBlogArtifact(root);

    expect(manifest.posts[0]).toMatchObject({ slug: "published", page: true });
    await expect(readFile(join(root, "dist", "posts", "published", "index.tsx"), "utf8")).resolves.toContain("export default function ArticlePage");
  });

  it("ignores a page without a publishable article and rejects invalid pages", async () => {
    const orphanRoot = await temporaryProject();
    await mkdir(join(orphanRoot, "articles", "draft-only"));
    await writeFile(join(orphanRoot, "articles", "draft-only", "index.tsx"), "export default function Page() { return null; }\n");

    const manifest = await buildBlogArtifact(orphanRoot);
    expect(manifest.posts).toEqual([]);

    const invalidRoot = await temporaryProject();
    await mkdir(join(invalidRoot, "articles", "invalid-page"));
    await writeFile(join(invalidRoot, "articles", "invalid-page", "article.md"), article());
    await writeFile(join(invalidRoot, "articles", "invalid-page", "index.tsx"), "export const notAPage = true;\n");
    await expect(buildBlogArtifact(invalidRoot)).rejects.toThrow("must export a default React component");

    const emptyRoot = await temporaryProject();
    await mkdir(join(emptyRoot, "articles", "empty-page"));
    await writeFile(join(emptyRoot, "articles", "empty-page", "article.md"), article());
    await writeFile(join(emptyRoot, "articles", "empty-page", "index.tsx"), "   \n");
    await expect(buildBlogArtifact(emptyRoot)).rejects.toThrow("must not be empty");
  });

  it("creates a deterministic empty manifest when no articles exist", async () => {
    const root = await temporaryProject();
    await mkdir(join(root, "articles", "unpublished", "draft"), { recursive: true });
    await writeFile(join(root, "articles", "unpublished", "draft", "outline.md"), "# Draft");

    await buildBlogArtifact(root);
    const manifest = await readFile(join(root, "dist", "manifest.json"), "utf8");

    expect(manifest).toBe('{\n  "schemaVersion": 2,\n  "posts": []\n}\n');
  });

  it("rejects articles without frontmatter", async () => {
    const root = await temporaryProject();
    await mkdir(join(root, "articles", "invalid"));
    await writeFile(join(root, "articles", "invalid", "article.md"), "No title here.\n");

    await expect(buildBlogArtifact(root)).rejects.toThrow("must begin with YAML frontmatter");
  });

  it("rejects published directories without kebab-case slugs", async () => {
    const root = await temporaryProject();
    await mkdir(join(root, "articles", "Invalid Slug"));
    await writeFile(join(root, "articles", "Invalid Slug", "article.md"), article());

    await expect(buildBlogArtifact(root)).rejects.toThrow("stable kebab-case slug");
  });

  it("rejects mismatched titles and invalid publication dates", async () => {
    const mismatchedRoot = await temporaryProject();
    await mkdir(join(mismatchedRoot, "articles", "mismatched"));
    await writeFile(join(mismatchedRoot, "articles", "mismatched", "article.md"), article({ h1: "Another title" }));
    await expect(buildBlogArtifact(mismatchedRoot)).rejects.toThrow("H1 must exactly match");

    const invalidDateRoot = await temporaryProject();
    await mkdir(join(invalidDateRoot, "articles", "invalid-date"));
    await writeFile(join(invalidDateRoot, "articles", "invalid-date", "article.md"), article({ publishedAt: "2026-02-30" }));
    await expect(buildBlogArtifact(invalidDateRoot)).rejects.toThrow("is not a valid calendar date");

    const reversedDatesRoot = await temporaryProject();
    await mkdir(join(reversedDatesRoot, "articles", "reversed-dates"));
    await writeFile(join(reversedDatesRoot, "articles", "reversed-dates", "article.md"), article({
      publishedAt: "2026-08-16",
      updatedAt: "2026-08-15",
    }));
    await expect(buildBlogArtifact(reversedDatesRoot)).rejects.toThrow("updatedAt must not precede publishedAt");
  });

  it("normalizes tags and orders posts newest first", async () => {
    const root = await temporaryProject();
    await mkdir(join(root, "articles", "older"));
    await mkdir(join(root, "articles", "newer"));
    await writeFile(join(root, "articles", "older", "article.md"), article({ title: "Older", h1: "Older", publishedAt: "2026-01-01" }));
    await writeFile(join(root, "articles", "newer", "article.md"), article({
      title: "Newer",
      h1: "Newer",
      publishedAt: "2026-08-16",
      updatedAt: "2026-08-17",
      tags: ["AI", " ai ", "Product Design"],
    }));

    const manifest = await buildBlogArtifact(root);
    expect(manifest.posts.map((post) => post.slug)).toEqual(["newer", "older"]);
    expect(manifest.posts[0]).toMatchObject({ updatedAt: "2026-08-17", tags: ["AI", "Product Design"] });
  });
});
