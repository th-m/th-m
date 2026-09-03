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

async function writeRegistry(root: string, slug: string, entries = "{}"): Promise<void> {
  await writeFile(
    join(root, "articles", slug, "article-assets.ts"),
    `import { defineArticleAssets } from "@th-m/blogs/mdx";\nexport default defineArticleAssets(${entries});\n`,
  );
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
    addendumTo,
    tags = ["Ontology", "software"],
    h1 = title,
    body = "Body.",
  }: {
    title?: string;
    description?: string;
    publishedAt?: string;
    updatedAt?: string;
    addendumTo?: string;
    tags?: string[];
    h1?: string;
    body?: string;
  } = {}) => `---\ntitle: ${title}\ndescription: ${description}\npublishedAt: ${publishedAt}\n${updatedAt ? `updatedAt: ${updatedAt}\n` : ""}${addendumTo ? `addendumTo: ${addendumTo}\n` : ""}tags: [${tags.join(", ")}]\n---\n# ${h1}\n\n${body}\n`;

  it("publishes only explicit MDX, registered assets, and public article modules", async () => {
    const root = await temporaryProject();
    await mkdir(join(root, "articles", "published", "assets"), { recursive: true });
    await mkdir(join(root, "articles", "published", "draft"));
    await mkdir(join(root, "articles", "unpublished", "draft"), { recursive: true });
    await mkdir(join(root, "outside-articles"));
    await writeFile(join(root, "articles", "published", "article.mdx"), article({ body: '<Asset id="figure" />' }));
    await writeRegistry(root, "published", '{ figure: { kind: "image", source: "assets/figure.svg", alt: "A figure", tags: ["diagram"] } }');
    await writeFile(join(root, "articles", "published", "draft", "outline.md"), "private outline");
    await writeFile(join(root, "articles", "published", "assets", "figure.svg"), "<svg/>");
    await writeFile(join(root, "articles", "unpublished", "draft", "outline.md"), "# Draft");
    await writeFile(join(root, "outside-articles", "article.mdx"), article({ title: "Outside", h1: "Outside" }));

    const manifest = await buildBlogArtifact(root);

    expect(manifest).toEqual({
      schemaVersion: 3,
      posts: [{
        slug: "published",
        title: "Public title",
        description: "A concise public description.",
        publishedAt: "2026-08-16",
        tags: ["Ontology", "software"],
        articlePath: "posts/published/article.mdx",
        assetRegistryPath: "posts/published/assets.json",
        assetsPath: "posts/published/assets",
      }],
    });
    await expect(readFile(join(root, "dist", "posts", "published", "article.mdx"), "utf8"))
      .resolves.toBe('# Public title\n\n<Asset id="figure" />\n');
    await expect(readFile(join(root, "dist", "posts", "published", "assets.json"), "utf8"))
      .resolves.toContain('"kind": "image"');
    await expect(access(join(root, "dist", "posts", "published", "assets", "figure.svg"))).resolves.toBeUndefined();
    await expect(access(join(root, "dist", "posts", "published", "draft"))).rejects.toThrow();
    await expect(access(join(root, "dist", "posts", "unpublished"))).rejects.toThrow();
  });

  it("stages immediate kebab-case TSX and CSS modules imported by MDX", async () => {
    const root = await temporaryProject();
    await mkdir(join(root, "articles", "published"));
    await writeFile(
      join(root, "articles", "published", "article.mdx"),
      article({ body: 'import { NeuralFigure } from "./neural-figure"\n\n<NeuralFigure />' }),
    );
    await writeRegistry(root, "published");
    await writeFile(
      join(root, "articles", "published", "neural-figure.tsx"),
      'import "./neural-figure.css";\nexport function NeuralFigure() { return <figure>Scene</figure>; }\n',
    );
    await writeFile(join(root, "articles", "published", "neural-figure.css"), ".scene { display: grid; }\n");
    await mkdir(join(root, "articles", "published", "private"));
    await writeFile(join(root, "articles", "published", "private", "secret.tsx"), "export const secret = true;\n");

    await buildBlogArtifact(root);

    await expect(readFile(join(root, "dist", "posts", "published", "neural-figure.tsx"), "utf8")).resolves.toContain("NeuralFigure");
    await expect(readFile(join(root, "dist", "posts", "published", "neural-figure.css"), "utf8")).resolves.toContain("display: grid");
    await expect(access(join(root, "dist", "posts", "published", "private"))).rejects.toThrow();
  });

  it("stages explicit article-local components with their data and styles, excluding private material", async () => {
    const root = await temporaryProject();
    const source = join(root, "articles", "published");
    await mkdir(join(source, "components", "private"), { recursive: true });
    await writeFile(join(source, "article.mdx"), article({ body: '<Asset id="local-figure" />' }));
    await writeRegistry(root, "published", '{ "local-figure": { kind: "figure", label: "Local figure", tags: ["diagram"] } }');
    const modules = {
      "article-components.tsx": 'export { default } from "./components/registry";\n',
      "components/registry.ts": 'import { defineArticleComponents } from "@th-m/blogs/mdx";\nimport assets from "../article-assets";\nimport { LocalFigure } from "./local-figure";\nexport default defineArticleComponents(assets, () => ({ "local-figure": LocalFigure }));\n',
      "components/local-figure.tsx": 'import "./local-figure.css";\nimport { label } from "./figure-data";\nexport function LocalFigure() { return <figure>{label}</figure>; }\n',
      "components/figure-data.ts": 'export const label = "Local scene";\n',
      "components/local-figure.css": ".local-figure { display: grid; }\n",
    };
    for (const [name, contents] of Object.entries(modules)) {
      await writeFile(join(source, name), contents);
    }
    await writeFile(join(source, "components", "private", "secret.tsx"), "export const secret = true;\n");
    await writeFile(join(source, "components", "notes.md"), "Private working material");

    await buildBlogArtifact(root);

    const output = join(root, "dist", "posts", "published");
    for (const [name, contents] of Object.entries(modules)) {
      await expect(readFile(join(output, name), "utf8")).resolves.toBe(contents);
    }
    await expect(access(join(output, "components", "private"))).rejects.toThrow();
    await expect(access(join(output, "components", "notes.md"))).rejects.toThrow();
  });

  it.each([
    { name: "LocalFigure.tsx", contents: "export const Figure = () => null;", error: "must use a kebab-case TSX or CSS filename" },
    { name: "local-figure.css", contents: "  \n", error: "components/local-figure.css must not be empty" },
  ])("validates article-local components/$name", async ({ name, contents, error }) => {
    const root = await temporaryProject();
    const source = join(root, "articles", "published");
    await mkdir(join(source, "components"), { recursive: true });
    await writeFile(join(source, "article.mdx"), article());
    await writeRegistry(root, "published");
    await writeFile(join(source, "components", name), contents);

    await expect(buildBlogArtifact(root)).rejects.toThrow(error);
  });

  it("ignores workspaces without article.mdx and rejects the obsolete split-page source", async () => {
    const root = await temporaryProject();
    await mkdir(join(root, "articles", "draft-only"));
    await writeFile(join(root, "articles", "draft-only", "article.md"), article());
    expect((await buildBlogArtifact(root)).posts).toEqual([]);

    const invalidRoot = await temporaryProject();
    await mkdir(join(invalidRoot, "articles", "invalid-page"));
    await writeFile(join(invalidRoot, "articles", "invalid-page", "article.mdx"), article());
    await writeRegistry(invalidRoot, "invalid-page");
    await writeFile(join(invalidRoot, "articles", "invalid-page", "index.tsx"), "export default function Page() { return null; }\n");
    await expect(buildBlogArtifact(invalidRoot)).rejects.toThrow("index.tsx is obsolete");
  });

  it("requires a non-empty registry and validates module filenames and contents", async () => {
    const missingRoot = await temporaryProject();
    await mkdir(join(missingRoot, "articles", "missing-registry"));
    await writeFile(join(missingRoot, "articles", "missing-registry", "article.mdx"), article());
    await expect(buildBlogArtifact(missingRoot)).rejects.toThrow("must contain article-assets.ts");

    const invalidNameRoot = await temporaryProject();
    await mkdir(join(invalidNameRoot, "articles", "invalid-module"));
    await writeFile(join(invalidNameRoot, "articles", "invalid-module", "article.mdx"), article());
    await writeRegistry(invalidNameRoot, "invalid-module");
    await writeFile(join(invalidNameRoot, "articles", "invalid-module", "NeuralFigure.tsx"), "export const Figure = () => null;\n");
    await expect(buildBlogArtifact(invalidNameRoot)).rejects.toThrow("must use a kebab-case TSX or CSS filename");

    const emptyModuleRoot = await temporaryProject();
    await mkdir(join(emptyModuleRoot, "articles", "empty-module"));
    await writeFile(join(emptyModuleRoot, "articles", "empty-module", "article.mdx"), article());
    await writeRegistry(emptyModuleRoot, "empty-module");
    await writeFile(join(emptyModuleRoot, "articles", "empty-module", "figure.css"), "  \n");
    await expect(buildBlogArtifact(emptyModuleRoot)).rejects.toThrow("figure.css must not be empty");
  });

  it("accepts the shared prose and link vocabulary without article-local imports", async () => {
    const root = await temporaryProject();
    await mkdir(join(root, "articles", "shared"));
    await writeRegistry(root, "shared");
    await writeFile(join(root, "articles", "shared", "article.mdx"), article({ body: `
<Lede>Introduction.</Lede>
<Section index="01" title="Shared presentation">
  <P>A <Term definition="A short definition.">term</Term>.</P>
  <Gloss definition="A longer definition.">Context</Gloss>
  <Callout label="Thesis" emphasis>A claim.</Callout>
  <Quote plain>A quotation.</Quote>
  <Flow>Frame → test</Flow>
  <ArticleLink slug="another-essay">Another essay</ArticleLink>
  <ExternalLink href="https://example.com">Source</ExternalLink>
  <BlogLink href="/relationship-graph">Graph</BlogLink>
</Section>
` }));
    expect((await buildBlogArtifact(root)).posts).toHaveLength(1);
  });

  it("validates component usage and typed asset references", async () => {
    const unsupportedRoot = await temporaryProject();
    await mkdir(join(unsupportedRoot, "articles", "unsupported"));
    await writeFile(join(unsupportedRoot, "articles", "unsupported", "article.mdx"), article({ body: "<Mystery />" }));
    await writeRegistry(unsupportedRoot, "unsupported");
    await expect(buildBlogArtifact(unsupportedRoot)).rejects.toThrow("uses unsupported component Mystery");

    const missingAssetRoot = await temporaryProject();
    await mkdir(join(missingAssetRoot, "articles", "missing-asset"));
    await writeFile(join(missingAssetRoot, "articles", "missing-asset", "article.mdx"), article({ body: '<Asset id="absent" />' }));
    await writeRegistry(missingAssetRoot, "missing-asset");
    await expect(buildBlogArtifact(missingAssetRoot)).rejects.toThrow("Asset must reference a registered non-preview id");

    const previewRoot = await temporaryProject();
    await mkdir(join(previewRoot, "articles", "preview"));
    await writeFile(join(previewRoot, "articles", "preview", "article.mdx"), article({ body: '<PreviewLink href="https://example.com" previewId="card">Example</PreviewLink>' }));
    await writeRegistry(previewRoot, "preview", '{ card: { kind: "preview", label: "Example preview", tags: ["link-preview"] } }');
    await expect(buildBlogArtifact(previewRoot)).resolves.toMatchObject({ schemaVersion: 3 });
  });

  it("requires every public image to be registered and every registered image to exist", async () => {
    const unregisteredRoot = await temporaryProject();
    await mkdir(join(unregisteredRoot, "articles", "unregistered", "assets"), { recursive: true });
    await writeFile(join(unregisteredRoot, "articles", "unregistered", "article.mdx"), article());
    await writeRegistry(unregisteredRoot, "unregistered");
    await writeFile(join(unregisteredRoot, "articles", "unregistered", "assets", "figure.svg"), "<svg/>");
    await expect(buildBlogArtifact(unregisteredRoot)).rejects.toThrow("assets/figure.svg must be registered");

    const missingRoot = await temporaryProject();
    await mkdir(join(missingRoot, "articles", "missing-image"));
    await writeFile(join(missingRoot, "articles", "missing-image", "article.mdx"), article());
    await writeRegistry(missingRoot, "missing-image", '{ figure: { kind: "image", source: "assets/figure.svg", alt: "A figure", tags: ["diagram"] } }');
    await expect(buildBlogArtifact(missingRoot)).rejects.toThrow("references images but assets/ is missing or empty");
  });

  it("creates a deterministic empty schema-v3 manifest when no articles exist", async () => {
    const root = await temporaryProject();
    await mkdir(join(root, "articles", "unpublished", "draft"), { recursive: true });
    await writeFile(join(root, "articles", "unpublished", "draft", "outline.md"), "# Draft");

    await buildBlogArtifact(root);
    await expect(readFile(join(root, "dist", "manifest.json"), "utf8"))
      .resolves.toBe('{\n  "schemaVersion": 3,\n  "posts": []\n}\n');
  });

  it("rejects invalid article metadata and ambiguous public sources", async () => {
    const noFrontmatterRoot = await temporaryProject();
    await mkdir(join(noFrontmatterRoot, "articles", "invalid"));
    await writeFile(join(noFrontmatterRoot, "articles", "invalid", "article.mdx"), "No title here.\n");
    await writeRegistry(noFrontmatterRoot, "invalid");
    await expect(buildBlogArtifact(noFrontmatterRoot)).rejects.toThrow("must begin with YAML frontmatter");

    const slugRoot = await temporaryProject();
    await mkdir(join(slugRoot, "articles", "Invalid Slug"));
    await writeFile(join(slugRoot, "articles", "Invalid Slug", "article.mdx"), article());
    await writeRegistry(slugRoot, "Invalid Slug");
    await expect(buildBlogArtifact(slugRoot)).rejects.toThrow("stable kebab-case slug");

    const ambiguousRoot = await temporaryProject();
    await mkdir(join(ambiguousRoot, "articles", "ambiguous"));
    await writeFile(join(ambiguousRoot, "articles", "ambiguous", "article.mdx"), article());
    await writeFile(join(ambiguousRoot, "articles", "ambiguous", "article.md"), article());
    await writeRegistry(ambiguousRoot, "ambiguous");
    await expect(buildBlogArtifact(ambiguousRoot)).rejects.toThrow("cannot publish both article.md and article.mdx");
  });

  it("rejects mismatched titles and invalid publication dates", async () => {
    const mismatchedRoot = await temporaryProject();
    await mkdir(join(mismatchedRoot, "articles", "mismatched"));
    await writeFile(join(mismatchedRoot, "articles", "mismatched", "article.mdx"), article({ h1: "Another title" }));
    await writeRegistry(mismatchedRoot, "mismatched");
    await expect(buildBlogArtifact(mismatchedRoot)).rejects.toThrow("H1 must exactly match");

    const invalidDateRoot = await temporaryProject();
    await mkdir(join(invalidDateRoot, "articles", "invalid-date"));
    await writeFile(join(invalidDateRoot, "articles", "invalid-date", "article.mdx"), article({ publishedAt: "2026-02-30" }));
    await writeRegistry(invalidDateRoot, "invalid-date");
    await expect(buildBlogArtifact(invalidDateRoot)).rejects.toThrow("is not a valid calendar date");

    const reversedDatesRoot = await temporaryProject();
    await mkdir(join(reversedDatesRoot, "articles", "reversed-dates"));
    await writeFile(join(reversedDatesRoot, "articles", "reversed-dates", "article.mdx"), article({ publishedAt: "2026-08-16", updatedAt: "2026-08-15" }));
    await writeRegistry(reversedDatesRoot, "reversed-dates");
    await expect(buildBlogArtifact(reversedDatesRoot)).rejects.toThrow("updatedAt must not precede publishedAt");
  });

  it("normalizes tags and orders posts newest first", async () => {
    const root = await temporaryProject();
    await mkdir(join(root, "articles", "older"));
    await mkdir(join(root, "articles", "newer"));
    await writeFile(join(root, "articles", "older", "article.mdx"), article({ title: "Older", h1: "Older", publishedAt: "2026-01-01" }));
    await writeFile(join(root, "articles", "newer", "article.mdx"), article({ title: "Newer", h1: "Newer", publishedAt: "2026-08-16", updatedAt: "2026-08-17", tags: ["AI", " ai ", "Product Design"] }));
    await writeRegistry(root, "older");
    await writeRegistry(root, "newer");

    const manifest = await buildBlogArtifact(root);
    expect(manifest.posts.map((post) => post.slug)).toEqual(["newer", "older"]);
    expect(manifest.posts[0]).toMatchObject({ updatedAt: "2026-08-17", tags: ["AI", "Product Design"] });
  });

  it("publishes an addendum only when its parent article exists", async () => {
    const root = await temporaryProject();
    await mkdir(join(root, "articles", "parent"));
    await mkdir(join(root, "articles", "addendum"));
    await writeFile(join(root, "articles", "parent", "article.mdx"), article({ title: "Parent", h1: "Parent" }));
    await writeFile(join(root, "articles", "addendum", "article.mdx"), article({ title: "Addendum", h1: "Addendum", addendumTo: "parent" }));
    await writeRegistry(root, "parent");
    await writeRegistry(root, "addendum");
    expect((await buildBlogArtifact(root)).posts.find((post) => post.slug === "addendum"))
      .toMatchObject({ addendumTo: "parent" });

    const invalidRoot = await temporaryProject();
    await mkdir(join(invalidRoot, "articles", "orphan"));
    await writeFile(join(invalidRoot, "articles", "orphan", "article.mdx"), article({ title: "Orphan", h1: "Orphan", addendumTo: "missing-parent" }));
    await writeRegistry(invalidRoot, "orphan");
    await expect(buildBlogArtifact(invalidRoot)).rejects.toThrow("references unpublished article missing-parent");
  });
});
