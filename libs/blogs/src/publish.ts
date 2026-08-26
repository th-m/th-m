import { access, cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

export interface PublishedPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  addendumTo?: string;
  tags: string[];
  articlePath: string;
  assetsPath?: string;
  page?: boolean;
}

export interface BlogManifest {
  schemaVersion: 2;
  posts: PublishedPost[];
}

export interface ParsedArticle {
  metadata: Omit<PublishedPost, "slug" | "articlePath" | "assetsPath" | "page">;
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
  if (!match?.[1]) throw new Error(`${slug}/article.md must contain an H1 title.`);
  return match[1].trim();
}

function requiredString(value: unknown, field: string, slug: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${slug}/article.md frontmatter must contain a non-empty ${field}.`);
  }
  return value.trim();
}

function publicationDate(value: unknown, field: string, slug: string): string {
  const date = requiredString(value, field, slug);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`${slug}/article.md ${field} must use YYYY-MM-DD.`);
  }
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error(`${slug}/article.md ${field} is not a valid calendar date.`);
  }
  return date;
}

function articleTags(value: unknown, slug: string): string[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new Error(`${slug}/article.md tags must be an array of strings.`);

  const tags: string[] = [];
  const seen = new Set<string>();
  for (const valueTag of value) {
    if (typeof valueTag !== "string" || valueTag.trim().length === 0) {
      throw new Error(`${slug}/article.md tags must contain only non-empty strings.`);
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
    throw new Error(`${slug}/article.md addendumTo must be a stable kebab-case slug.`);
  }
  if (target === slug) {
    throw new Error(`${slug}/article.md cannot be an addendum to itself.`);
  }
  return target;
}

export function parseArticleDocument(markdown: string, slug: string): ParsedArticle {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`${slug}/article.md must begin with YAML frontmatter.`);

  const parsed = parseYaml(match[1]);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${slug}/article.md frontmatter must be a YAML object.`);
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
    throw new Error(`${slug}/article.md updatedAt must not precede publishedAt.`);
  }

  const body = markdown.slice(match[0].length).replace(/^\s+/, "").trimEnd() + "\n";
  const h1 = articleTitle(body, slug);
  if (h1 !== title) {
    throw new Error(`${slug}/article.md H1 must exactly match its frontmatter title.`);
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

const auxiliaryPageModulePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*\.(?:tsx|css)$/;

/**
 * Stages an article's optional React page and its immediate sibling modules.
 * The portfolio build performs full type checking after these structural
 * publication checks.
 */
async function stageArticlePageModules(
  articlesRoot: string,
  slug: string,
  postOutput: string,
): Promise<boolean> {
  const articleDirectory = join(articlesRoot, slug);
  const entries = await readdir(articleDirectory, { withFileTypes: true });
  const pageModules = entries
    .filter((entry) => entry.isFile() && (entry.name.endsWith(".tsx") || entry.name.endsWith(".css")))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right, "en"));
  const hasPage = pageModules.includes("index.tsx");
  const auxiliaryModules = pageModules.filter((name) => name !== "index.tsx");

  if (!hasPage) {
    if (auxiliaryModules.length > 0) {
      throw new Error(`${slug} auxiliary page modules require index.tsx.`);
    }
    return false;
  }

  for (const name of auxiliaryModules) {
    if (!auxiliaryPageModulePattern.test(name)) {
      throw new Error(`${slug}/${name} must use a kebab-case TSX or CSS filename.`);
    }
  }

  for (const name of pageModules) {
    const contents = await readFile(join(articleDirectory, name), "utf8");
    if (contents.trim().length === 0) {
      throw new Error(`${slug}/${name} must not be empty.`);
    }
    if (name === "index.tsx" && !/\bexport\s+default\b/.test(contents)) {
      throw new Error(`${slug}/index.tsx must export a default React component.`);
    }
    await writeFile(join(postOutput, name), contents);
  }

  return true;
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
    const articlePath = join(articlesRoot, slug, "article.md");
    try {
      await access(articlePath);
    } catch {
      continue;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new Error(`Published post directory must use a stable kebab-case slug: ${slug}`);
    }

    const markdown = await readFile(articlePath, "utf8");
    const article = parseArticleDocument(markdown, slug);
    const postOutput = join(outputRoot, "posts", slug);
    await mkdir(postOutput, { recursive: true });
    await writeFile(join(postOutput, "article.md"), article.body);

    const assetsSource = join(articlesRoot, slug, "assets");
    let assetsPath: string | undefined;
    try {
      const assetEntries = await readdir(assetsSource);
      if (assetEntries.length > 0) {
        await cp(assetsSource, join(postOutput, "assets"), { recursive: true });
        assetsPath = `posts/${slug}/assets`;
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }

    const hasPage = await stageArticlePageModules(articlesRoot, slug, postOutput);

    posts.push({
      slug: basename(slug),
      ...article.metadata,
      articlePath: `posts/${slug}/article.md`,
      ...(assetsPath ? { assetsPath } : {}),
      ...(hasPage ? { page: true } : {}),
    });
  }

  const publishedSlugs = new Set(posts.map((post) => post.slug));
  for (const post of posts) {
    if (post.addendumTo && !publishedSlugs.has(post.addendumTo)) {
      throw new Error(`${post.slug}/article.md addendumTo references unpublished article ${post.addendumTo}.`);
    }
  }

  posts.sort((left, right) => right.publishedAt.localeCompare(left.publishedAt) || left.slug.localeCompare(right.slug, "en"));
  const manifest: BlogManifest = { schemaVersion: 2, posts };
  await writeFile(join(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}
