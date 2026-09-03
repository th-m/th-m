import { access, cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import ts from "typescript";
import { parse as parseYaml } from "yaml";
import { validateArticleAssetRegistry, type ArticleAssetRegistry } from "./mdx";

export interface PublishedPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  addendumTo?: string;
  tags: string[];
  articlePath: string;
  assetRegistryPath: string;
  assetsPath?: string;
}

export interface BlogManifest {
  schemaVersion: 3;
  posts: PublishedPost[];
}

export interface ParsedArticle {
  metadata: Omit<PublishedPost, "slug" | "articlePath" | "assetRegistryPath" | "assetsPath">;
  body: string;
}

function assertProjectPath(projectRoot: string, candidate: string): void {
  const path = relative(projectRoot, candidate);
  if (path === ".." || path.startsWith(`..${sep}`)) {
    throw new Error(`Publication path escapes the blogs project: ${candidate}`);
  }
}

function articleTitle(markdown: string, slug: string): string {
  const match = markdown.match(/^#[\t ]+([^\r\n]+?)[\t ]*(?:\r?\n|$)/);
  if (!match?.[1]) throw new Error(`${slug}/article.mdx must contain an H1 title.`);
  return match[1].trim();
}

function requiredString(value: unknown, field: string, slug: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${slug}/article.mdx frontmatter must contain a non-empty ${field}.`);
  }
  return value.trim();
}

function publicationDate(value: unknown, field: string, slug: string): string {
  const date = requiredString(value, field, slug);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`${slug}/article.mdx ${field} must use YYYY-MM-DD.`);
  }
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error(`${slug}/article.mdx ${field} is not a valid calendar date.`);
  }
  return date;
}

function articleTags(value: unknown, slug: string): string[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new Error(`${slug}/article.mdx tags must be an array of strings.`);

  const tags: string[] = [];
  const seen = new Set<string>();
  for (const valueTag of value) {
    if (typeof valueTag !== "string" || valueTag.trim().length === 0) {
      throw new Error(`${slug}/article.mdx tags must contain only non-empty strings.`);
    }
    const tag = valueTag.trim().replace(/\s+/g, " ");
    const key = tag.toLocaleLowerCase("en");
    if (!seen.has(key)) {
      tags.push(tag);
      seen.add(key);
    }
  }
  return tags;
}

function articleAddendumTarget(value: unknown, slug: string): string | undefined {
  if (value === undefined) return undefined;
  const target = requiredString(value, "addendumTo", slug);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(target)) {
    throw new Error(`${slug}/article.mdx addendumTo must be a stable kebab-case slug.`);
  }
  if (target === slug) {
    throw new Error(`${slug}/article.mdx cannot be an addendum to itself.`);
  }
  return target;
}

export function parseArticleDocument(markdown: string, slug: string): ParsedArticle {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`${slug}/article.mdx must begin with YAML frontmatter.`);

  const parsed = parseYaml(match[1]);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${slug}/article.mdx frontmatter must be a YAML object.`);
  }

  const fields = parsed as Record<string, unknown>;
  const title = requiredString(fields.title, "title", slug);
  const description = requiredString(fields.description, "description", slug);
  const publishedAt = publicationDate(fields.publishedAt, "publishedAt", slug);
  const updatedAt = fields.updatedAt === undefined
    ? undefined
    : publicationDate(fields.updatedAt, "updatedAt", slug);
  const addendumTo = articleAddendumTarget(fields.addendumTo, slug);
  if (updatedAt && updatedAt < publishedAt) {
    throw new Error(`${slug}/article.mdx updatedAt must not precede publishedAt.`);
  }

  const body = markdown.slice(match[0].length).replace(/^\s+/, "").trimEnd() + "\n";
  const h1 = articleTitle(body, slug);
  if (h1 !== title) {
    throw new Error(`${slug}/article.mdx H1 must exactly match its frontmatter title.`);
  }

  return {
    metadata: {
      title,
      description,
      publishedAt,
      ...(updatedAt ? { updatedAt } : {}),
      ...(addendumTo ? { addendumTo } : {}),
      tags: articleTags(fields.tags, slug),
    },
    body,
  };
}

const articleModulePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*\.(?:ts|tsx|css)$/;
const sharedMdxComponents = new Set([
  "ArticleLink",
  "Asset",
  "BlogLink",
  "Callout",
  "ExternalLink",
  "Flow",
  "Gloss",
  "Lede",
  "P",
  "PreviewLink",
  "Quote",
  "Section",
  "Term",
  "ToolLink",
]);

function literalValue(node: ts.Expression, slug: string): unknown {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map((entry) => literalValue(entry as ts.Expression, slug));
  if (ts.isObjectLiteralExpression(node)) {
    const value: Record<string, unknown> = {};
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property)) {
        throw new Error(`${slug}/article-assets.ts supports only literal property assignments.`);
      }
      const name = property.name;
      const key = ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)
        ? name.text
        : undefined;
      if (!key) throw new Error(`${slug}/article-assets.ts contains an unsupported property name.`);
      value[key] = literalValue(property.initializer, slug);
    }
    return value;
  }
  throw new Error(`${slug}/article-assets.ts must contain only serializable literal metadata.`);
}

export function parseArticleAssetDocument(source: string, slug: string): ArticleAssetRegistry {
  const file = ts.createSourceFile("article-assets.ts", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  let expression: ts.Expression | undefined;
  for (const statement of file.statements) {
    if (ts.isExportAssignment(statement) && !statement.isExportEquals) expression = statement.expression;
  }
  if (!expression) throw new Error(`${slug}/article-assets.ts must default-export defineArticleAssets({...}).`);
  if (ts.isCallExpression(expression)) {
    if (!ts.isIdentifier(expression.expression) || expression.expression.text !== "defineArticleAssets" || expression.arguments.length !== 1) {
      throw new Error(`${slug}/article-assets.ts must default-export defineArticleAssets({...}).`);
    }
    expression = expression.arguments[0];
  }
  if (!ts.isObjectLiteralExpression(expression)) {
    throw new Error(`${slug}/article-assets.ts must default-export defineArticleAssets({...}).`);
  }
  return validateArticleAssetRegistry(literalValue(expression, slug), slug);
}

function attributeValue(node: { attributes?: Array<{ name?: string; value?: unknown }> }, name: string): string | undefined {
  const attribute = node.attributes?.find((candidate) => candidate.name === name);
  return typeof attribute?.value === "string" ? attribute.value : undefined;
}

function importedMdxNames(tree: unknown, slug: string): Set<string> {
  const names = new Set<string>();
  const visit = (value: unknown): void => {
    if (!value || typeof value !== "object") return;
    const node = value as { type?: string; value?: string; children?: unknown[] };
    if (node.type === "mdxjsEsm") {
      const source = node.value?.trim() ?? "";
      const match = source.match(/^import\s*\{([\s\S]*?)\}\s*from\s*["'](\.\/[a-z0-9]+(?:-[a-z0-9]+)*)["'];?$/u);
      if (!match) {
        throw new Error(`${slug}/article.mdx imports must be named imports from immediate kebab-case modules.`);
      }
      for (const specifier of match[1].split(",")) {
        const imported = specifier.trim().match(/^(?:[A-Za-z_$][\w$]*\s+as\s+)?([A-Za-z_$][\w$]*)$/u)?.[1];
        if (!imported) throw new Error(`${slug}/article.mdx contains an invalid import specifier.`);
        names.add(imported);
      }
    }
    for (const child of node.children ?? []) visit(child);
  };
  visit(tree);
  return names;
}

function validateMdxTree(tree: unknown, slug: string, assets: ArticleAssetRegistry, importedNames: Set<string>): void {
  if (!tree || typeof tree !== "object") return;
  const node = tree as {
    type?: string;
    name?: string | null;
    attributes?: Array<{ name?: string; value?: unknown }>;
    children?: unknown[];
  };
  if ((node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") && node.name) {
    if (/^[A-Z]/.test(node.name) && !sharedMdxComponents.has(node.name) && !importedNames.has(node.name)) {
      throw new Error(`${slug}/article.mdx uses unsupported component ${node.name}.`);
    }
    if (node.name === "Asset") {
      const id = attributeValue(node, "id");
      if (!id || !assets[id] || assets[id].kind === "preview") {
        throw new Error(`${slug}/article.mdx Asset must reference a registered non-preview id.`);
      }
    }
    if (node.name === "PreviewLink") {
      const previewId = attributeValue(node, "previewId");
      if (!previewId || assets[previewId]?.kind !== "preview") {
        throw new Error(`${slug}/article.mdx PreviewLink must reference a registered preview id.`);
      }
    }
  }
  for (const child of node.children ?? []) validateMdxTree(child, slug, assets, importedNames);
}

async function validateArticleMdx(body: string, slug: string, assets: ArticleAssetRegistry): Promise<void> {
  const validatePlugin = () => (tree: unknown) => validateMdxTree(tree, slug, assets, importedMdxNames(tree, slug));
  try {
    await compile(body, { remarkPlugins: [remarkGfm, validatePlugin] });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${slug}/article.mdx is invalid: ${message}`);
  }
}

async function stagedArticleModules(
  articlesRoot: string,
  slug: string,
  postOutput: string,
): Promise<void> {
  const articleDirectory = join(articlesRoot, slug);
  const entries = await readdir(articleDirectory, { withFileTypes: true });
  const modules = entries
    .filter((entry) => entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx") || entry.name.endsWith(".css")))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right, "en"));
  if (!modules.includes("article-assets.ts")) {
    throw new Error(`${slug} must contain article-assets.ts.`);
  }
  if (modules.includes("index.tsx")) {
    throw new Error(`${slug}/index.tsx is obsolete; article.mdx owns the rendered prose.`);
  }
  if (entries.some((entry) => entry.isDirectory() && entry.name === "components")) {
    const componentEntries = await readdir(join(articleDirectory, "components"), { withFileTypes: true });
    modules.push(...componentEntries
      .filter((entry) => entry.isFile() && /\.(ts|tsx|css)$/.test(entry.name))
      .map((entry) => `components/${entry.name}`)
      .sort((left, right) => left.localeCompare(right, "en")));
  }
  for (const name of modules) {
    if (!articleModulePattern.test(basename(name))) {
      throw new Error(`${slug}/${name} must use a kebab-case TSX or CSS filename.`);
    }
  }
  for (const name of modules) {
    const contents = await readFile(join(articleDirectory, name), "utf8");
    if (contents.trim().length === 0) {
      throw new Error(`${slug}/${name} must not be empty.`);
    }
    await mkdir(dirname(join(postOutput, name)), { recursive: true });
    await writeFile(join(postOutput, name), contents);
  }
}

async function publicAssetFiles(directory: string, prefix = "assets"): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await publicAssetFiles(path, `${prefix}/${entry.name}`));
    else if (entry.isFile()) files.push(`${prefix}/${entry.name}`);
  }
  return files.sort((left, right) => left.localeCompare(right, "en"));
}

export async function buildBlogArtifact(projectDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..")): Promise<BlogManifest> {
  const projectRoot = resolve(projectDirectory);
  const articlesRoot = resolve(projectRoot, "articles");
  const outputRoot = resolve(projectRoot, "dist");
  assertProjectPath(projectRoot, articlesRoot);
  assertProjectPath(projectRoot, outputRoot);

  const entries = await readdir(articlesRoot, { withFileTypes: true });
  const slugs = entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right, "en"));

  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(join(outputRoot, "posts"), { recursive: true });

  const posts: PublishedPost[] = [];
  for (const slug of slugs) {
    const articleDirectory = join(articlesRoot, slug);
    const markdownPath = join(articleDirectory, "article.md");
    const articlePath = join(articleDirectory, "article.mdx");
    try {
      await access(articlePath);
    } catch {
      continue;
    }
    try {
      await access(markdownPath);
      throw new Error(`${slug} cannot publish both article.md and article.mdx.`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new Error(`Published post directory must use a stable kebab-case slug: ${slug}`);
    }

    const mdx = await readFile(articlePath, "utf8");
    const article = parseArticleDocument(mdx, slug);
    const assetSourcePath = join(articleDirectory, "article-assets.ts");
    let assetSource: string;
    try {
      assetSource = await readFile(assetSourcePath, "utf8");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        throw new Error(`${slug} must contain article-assets.ts.`);
      }
      throw error;
    }
    const assets = parseArticleAssetDocument(assetSource, slug);
    await validateArticleMdx(article.body, slug, assets);
    const postOutput = join(outputRoot, "posts", slug);
    await mkdir(postOutput, { recursive: true });
    await writeFile(join(postOutput, "article.mdx"), article.body);
    await writeFile(join(postOutput, "assets.json"), `${JSON.stringify(assets, null, 2)}\n`);

    const assetsSource = join(articlesRoot, slug, "assets");
    let assetsPath: string | undefined;
    try {
      const assetEntries = await publicAssetFiles(assetsSource);
      if (assetEntries.length > 0) {
        const registeredFiles = new Set<string>(Object.values(assets)
          .filter((asset) => asset.kind === "image")
          .map((asset) => asset.source));
        for (const file of assetEntries) {
          if (!registeredFiles.has(file)) throw new Error(`${slug}/${file} must be registered in article-assets.ts.`);
        }
        for (const file of registeredFiles) {
          if (!assetEntries.includes(file)) throw new Error(`${slug}/article-assets.ts references missing ${file}.`);
        }
        await cp(assetsSource, join(postOutput, "assets"), { recursive: true });
        assetsPath = `posts/${slug}/assets`;
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    if (!assetsPath && Object.values(assets).some((asset) => asset.kind === "image")) {
      throw new Error(`${slug}/article-assets.ts references images but assets/ is missing or empty.`);
    }

    await stagedArticleModules(articlesRoot, slug, postOutput);

    posts.push({
      slug: basename(slug),
      ...article.metadata,
      articlePath: `posts/${slug}/article.mdx`,
      assetRegistryPath: `posts/${slug}/assets.json`,
      ...(assetsPath ? { assetsPath } : {}),
    });
  }

  const publishedSlugs = new Set(posts.map((post) => post.slug));
  for (const post of posts) {
    if (post.addendumTo && !publishedSlugs.has(post.addendumTo)) {
      throw new Error(`${post.slug}/article.mdx addendumTo references unpublished article ${post.addendumTo}.`);
    }
  }

  posts.sort((left, right) => right.publishedAt.localeCompare(left.publishedAt) || left.slug.localeCompare(right.slug, "en"));
  const manifest: BlogManifest = { schemaVersion: 3, posts };
  await writeFile(join(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}
