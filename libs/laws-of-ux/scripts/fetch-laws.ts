/**
 * Fetches the lawsofux.com homepage and each law page, extracts the definition,
 * takeaways, origins copy, source, further reading links, related laws, and
 * banner SVG, then regenerates the content snapshot:
 *
 *   src/laws/<slug>.ts   one Law record per law
 *   src/laws/index.ts    the aggregated `laws` array and `lawBySlug` map
 *
 * Run with: bun run nx run laws-of-ux:fetch-laws
 */

import { mkdir, writeFile } from "node:fs/promises";

const HOME_URL = "https://lawsofux.com/";
const OUTPUT_DIR = new URL("../src/laws/", import.meta.url);

/** Transliterates a source slug into the stable ASCII identifier. */
function toAsciiSlug(slug: string): string {
  return decodeURIComponent(slug)
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("ß", "ss");
}

/** "fittss-law" -> "fittssLaw" */
function slugToIdentifier(slug: string): string {
  return slug.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase());
}

interface ParsedLaw {
  slug: string;
  title: string;
  definition: string;
  category: "theory" | "psychology";
  color: string;
  takeaways: string[];
  copy: string[];
  source: string | null;
  furtherReading: Array<{ title: string; url: string; source: string | null }>;
  graphic: string;
  siteUrl: string;
  related: string[];
}

function unescapeHtml(value: string): string {
  return value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&");
}

function stripTags(value: string): string {
  return value.replace(/<[^>]+>/g, "");
}

function parseHomepage(homeHtml: string): Array<{ sourceSlug: string; slug: string; category: string }> {
  const cardPattern =
    /<li class=grid__item data-category=([a-z]+)><article class=card style=background-color:[^>]+><div class=card__graphic.*?<a href=https:\/\/lawsofux\.com\/([^/]+)\/ data-page-link>/gs;
  const cards = [...homeHtml.matchAll(cardPattern)].map((match) => ({
    category: match[1],
    sourceSlug: match[2],
    slug: toAsciiSlug(match[2]),
  }));
  if (cards.length < 30) {
    throw new Error(`Expected at least 30 law cards on the homepage, found ${cards.length}`);
  }
  return cards;
}

function parseLawPage(pageHtml: string, sourceSlug: string, category: string): ParsedLaw {
  const titleMatch = /<h1 class=banner__title>([^<]+)<\/h1>/.exec(pageHtml);
  const bannerMatch = /<header class="banner banner--media" style=background-color:([^>]+)>/.exec(pageHtml);
  const taglineMatch = /<div class=text-lrg>([^<]*)<\/div>/.exec(pageHtml);
  const takeawaysMatch = /<h2>Takeaways<\/h2><ol class="grid grid--list">(.*?)<\/ol>/s.exec(pageHtml);
  const originsMatch = /<h2 id=origins>Origins<\/h2><div>(.*?)<\/div><\/section>/s.exec(pageHtml);
  const sourceMatch = /<p><a href=([^ >]+)>Source<\/a><\/p>/.exec(pageHtml);
  const readingMatch = /<h2 id=further-reading>Further Reading<\/h2><div>(.*?)<\/section>/s.exec(pageHtml);
  const graphicMatch = /<div class=banner__graphic aria-hidden=true data-graphic>(<svg.*?<\/svg>)/s.exec(pageHtml);
  const relatedMatch = /<div class="related divider">(.*?)<\/div>\s*<\/div>/s.exec(pageHtml);

  if (!titleMatch || !bannerMatch || !taglineMatch || !graphicMatch) {
    throw new Error(`Incomplete law page for "${sourceSlug}" (title=${!!titleMatch}, banner=${!!bannerMatch}, tagline=${!!taglineMatch}, graphic=${!!graphicMatch})`);
  }

  const takeaways = takeawaysMatch
    ? [...takeawaysMatch[1].matchAll(/<li class=grid__item>([^<]*)<\/li>/g)].map((match) => unescapeHtml(match[1].trim()))
    : [];

  const copy: string[] = [];
  if (originsMatch) {
    // Drop the trailing "Source" link paragraph so it does not leak into copy.
    const originsBody = originsMatch[1].replace(/<p><a href=[^>]+>Source<\/a><\/p>/g, "");
    const paragraphs = [...originsBody.matchAll(/<p>(.*?)<\/p>/gs)].map((match) =>
      unescapeHtml(stripTags(match[1])).trim(),
    );
    copy.push(...(paragraphs.length > 0 ? paragraphs : [unescapeHtml(stripTags(originsBody)).trim()]));
  }

  const furtherReading = readingMatch
    ? [...readingMatch[1].matchAll(/<article class=slat[^>]*>(.*?)<\/article>/gs)]
        .map((article) => {
          const title = /<h3 class=slat__title><a href=([^ >]+)[^>]*>([^<]+)<\/a><\/h3>/.exec(article[1]);
          const source = /<p class="slat__meta text-meta">([^<]+)<\/p>/.exec(article[1]);
          if (!title) return null;
          // Normalize the raw href: strip stray quotes and resolve relative
          // paths (site-internal articles) against the lawsofux.com origin.
          let url = title[1].trim();
          if (url.startsWith('"') && url.endsWith('"')) url = url.slice(1, -1);
          if (url.startsWith("/")) url = `https://lawsofux.com${url}`;
          return {
            title: unescapeHtml(title[2]).trim(),
            url,
            source: source ? unescapeHtml(source[1]).trim() : null,
          };
        })
        .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    : [];

  const related: string[] = [];
  if (relatedMatch) {
    for (const match of relatedMatch[1].matchAll(/<h2 class=card__title><a href=https:\/\/lawsofux\.com\/([^/]+)\/ data-page-link>/g)) {
      const slug = toAsciiSlug(match[1]);
      if (!related.includes(slug)) related.push(slug);
    }
  }

  return {
    slug: toAsciiSlug(sourceSlug),
    title: unescapeHtml(titleMatch[1]).trim(),
    definition: unescapeHtml(taglineMatch[1]).trim(),
    category: category === "psychology" ? "psychology" : "theory",
    color: bannerMatch[1].trim(),
    takeaways,
    copy,
    source: sourceMatch ? sourceMatch[1] : null,
    furtherReading,
    graphic: graphicMatch[1].trim(),
    siteUrl: `https://lawsofux.com/${sourceSlug}/`,
    related,
  };
}

function renderLawFile(law: ParsedLaw): string {
  const lines = [
    "// Generated by scripts/fetch-laws.ts from lawsofux.com. Do not edit directly.",
    'import type { Law } from "../types";',
    "",
    `export const ${slugToIdentifier(law.slug)}: Law = {`,
    `  slug: ${JSON.stringify(law.slug)},`,
    `  title: ${JSON.stringify(law.title)},`,
    `  definition: ${JSON.stringify(law.definition)},`,
    `  category: ${JSON.stringify(law.category)},`,
    `  color: ${JSON.stringify(law.color)},`,
    `  takeaways: ${JSON.stringify(law.takeaways)},`,
    `  copy: ${JSON.stringify(law.copy)},`,
    ...(law.source ? [`  source: ${JSON.stringify(law.source)},`] : ["  source: undefined,"]),
    `  furtherReading: ${JSON.stringify(law.furtherReading)},`,
    `  graphic: ${JSON.stringify(law.graphic)},`,
    `  siteUrl: ${JSON.stringify(law.siteUrl)},`,
    `  related: ${JSON.stringify(law.related)},`,
    "};",
    "",
  ];
  return lines.join("\n");
}

function renderIndexFile(laws: ParsedLaw[]): string {
  const lines = [
    "// Generated by scripts/fetch-laws.ts from lawsofux.com. Do not edit directly.",
    'import type { Law } from "../types";',
    ...laws.map((law) => `import { ${slugToIdentifier(law.slug)} } from "./${law.slug}";`),
    "",
    "/** All 30 laws of UX in lawsofux.com homepage order. */",
    `export const laws: Law[] = [`,
    ...laws.map((law) => `  ${slugToIdentifier(law.slug)},`),
    "];",
    "",
    "/** Laws keyed by their stable ASCII slug. */",
    "export const lawBySlug: Readonly<Record<string, Law>> = Object.fromEntries(",
    "  laws.map((law) => [law.slug, law]),",
    ");",
    "",
  ];
  return lines.join("\n");
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { "user-agent": "th-m-laws-of-ux-snapshot/1.0 (+workspace regeneration script)" },
  });
  if (!response.ok) throw new Error(`GET ${url} failed with ${response.status}`);
  return response.text();
}

const homeHtml = await fetchText(HOME_URL);
const cards = parseHomepage(homeHtml);

const laws = await Promise.all(
  cards.map(async ({ sourceSlug, category }) => {
    const pageHtml = await fetchText(`https://lawsofux.com/${sourceSlug}/`);
    return parseLawPage(pageHtml, sourceSlug, category);
  }),
);

await mkdir(OUTPUT_DIR, { recursive: true });
for (const law of laws) {
  await writeFile(new URL(`${law.slug}.ts`, OUTPUT_DIR), renderLawFile(law), "utf8");
}
await writeFile(new URL("index.ts", OUTPUT_DIR), renderIndexFile(laws), "utf8");

console.log(`Regenerated ${laws.length} law data files under src/laws/`);
for (const law of laws) {
  console.log(
    `  ${law.slug.padEnd(32)} takeways=${law.takeaways.length} copy=${law.copy.length} reading=${law.furtherReading.length} related=${law.related.length}`,
  );
}
