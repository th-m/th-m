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
  tags: string[];
  articlePath: string;
  assetsPath?: string;
}

export interface BlogManifest {
  schemaVersion: 2;
  posts: PublishedPost[];
}

export interface ParsedArticle {
  metadata: Omit<PublishedPost, "slug" | "articlePath" | "assetsPath">;
  body: string;
}

const ignoredDirectories = new Set(["dist", "node_modules", "scripts", "src", "tests"]);

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
      tags: articleTags(fields.tags, slug),
    },
    body,
  };
}

export async function buildBlogArtifact(projectDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..")): Promise<BlogManifest> {
  const projectRoot = resolve(projectDirectory);
  const outputRoot = resolve(projectRoot, "dist");
  assertProjectPath(projectRoot, outputRoot);

  const entries = await readdir(projectRoot, { withFileTypes: true });
  const slugs = entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith(".") && !ignoredDirectories.has(entry.name))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right, "en"));

  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(join(outputRoot, "posts"), { recursive: true });

  const posts: PublishedPost[] = [];
  for (const slug of slugs) {
    const articlePath = join(projectRoot, slug, "article.md");
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

    const assetsSource = join(projectRoot, slug, "assets");
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

    posts.push({
      slug: basename(slug),
      ...article.metadata,
      articlePath: `posts/${slug}/article.md`,
      ...(assetsPath ? { assetsPath } : {}),
    });
  }

  posts.sort((left, right) => right.publishedAt.localeCompare(left.publishedAt) || left.slug.localeCompare(right.slug, "en"));
  const manifest: BlogManifest = { schemaVersion: 2, posts };
  await writeFile(join(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}
