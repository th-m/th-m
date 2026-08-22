/**
 * Regenerates the laws content snapshot from two sources:
 *
 *   lawsofux.com                        the 30 laws of UX (definition, takeaways,
 *                                       origins copy, source, further reading,
 *                                       related laws, banner SVG)
 *   timsommer.be/famous-laws-of-software-development
 *                                       the famous laws of software development
 *                                       (definition from blockquote, copy, and
 *                                       labeled takeaways where present)
 *
 * Laws that appear on both sites (Postel's Law, Pareto Principle) are merged
 * into one record: lawsofux fields are primary, timsommer copy is appended,
 * and `sources` lists both pages. Every law receives a curated `labels` list
 * from the LABELS map below, and software laws without a source color get a
 * deterministic accent derived from their slug.
 *
 * Outputs:
 *   src/laws/<slug>.ts   one Law record per law
 *   src/laws/index.ts    the aggregated `laws` array and `lawBySlug` map
 *
 * Run with: bun run nx run laws:fetch-laws
 */

import { mkdir, writeFile } from "node:fs/promises";
import { accentPalette } from "@th-m/design-theme";
import type { LawLabel } from "../src/types";

const UX_HOME_URL = "https://lawsofux.com/";
const SOFTWARE_URL = "https://www.timsommer.be/famous-laws-of-software-development/";
const OUTPUT_DIR = new URL("../src/laws/", import.meta.url);

/** Transliterates a lawsofux source slug into the stable ASCII identifier. */
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

/** Turns a timsommer heading into a stable ASCII slug, dropping "aka" aliases. */
function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/ aka .*$/, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/^the-/, "");
}

/** Deterministic accent-palette pick for laws without a source color. */
function colorFromSlug(slug: string): string {
  let hash = 0;
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return accentPalette[hash % accentPalette.length].value;
}

interface ParsedLaw {
  slug: string;
  title: string;
  definition: string;
  category: "theory" | "psychology";
  color: string;
  labels: LawLabel[];
  takeaways?: string[];
  copy: string[];
  source?: string;
  furtherReading?: Array<{ title: string; url: string; source: string | null }>;
  graphic?: string;
  sources: string[];
  related: string[];
}

function unescapeHtml(value: string): string {
  return value
    .replaceAll("&rsquo;", "’")
    .replaceAll("&lsquo;", "‘")
    .replaceAll("&ldquo;", "“")
    .replaceAll("&rdquo;", "”")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&mdash;", "—")
    .replaceAll("&ndash;", "–")
    .replaceAll("&hellip;", "…")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&");
}

function stripTags(value: string): string {
  return value
    .replaceAll(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .trim();
}

/* ------------------------------------------------------------------ */
/* lawsofux.com                                                        */
/* ------------------------------------------------------------------ */

function parseUxHomepage(homeHtml: string): Array<{ sourceSlug: string; slug: string; category: string }> {
  const cardPattern =
    /<li class=grid__item data-category=([a-z]+)><article class=card style=background-color:[^>]+><div class=card__graphic.*?<a href=https:\/\/lawsofux\.com\/([^/]+)\/ data-page-link>/gs;
  const cards = [...homeHtml.matchAll(cardPattern)].map((match) => ({
    category: match[1],
    sourceSlug: match[2],
    slug: toAsciiSlug(match[2]),
  }));
  if (cards.length < 30) {
    throw new Error(`Expected at least 30 law cards on the lawsofux homepage, found ${cards.length}`);
  }
  return cards;
}

function parseUxLawPage(pageHtml: string, sourceSlug: string, category: string): ParsedLaw {
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
    throw new Error(`Incomplete lawsofux page for "${sourceSlug}" (title=${!!titleMatch}, banner=${!!bannerMatch}, tagline=${!!taglineMatch}, graphic=${!!graphicMatch})`);
  }

  const takeaways = takeawaysMatch
    ? [...takeawaysMatch[1].matchAll(/<li class=grid__item>([^<]*)<\/li>/g)].map((match) => unescapeHtml(match[1].trim()))
    : undefined;

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
    : undefined;

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
    labels: [],
    takeaways,
    copy,
    source: sourceMatch ? sourceMatch[1] : undefined,
    furtherReading,
    graphic: graphicMatch[1].trim(),
    sources: [`https://lawsofux.com/${sourceSlug}/`],
    related,
  };
}

/* ------------------------------------------------------------------ */
/* timsommer.be                                                        */
/* ------------------------------------------------------------------ */

interface TimSommerSection {
  title: string;
  definition: string | null;
  takeaways: string[];
  copy: string[];
}

/** Extracts <strong>Label:</strong> value lines into takeaways. */
function extractLabeledLines(paragraphHtml: string): { takeaways: string[]; rest: string } {
  const takeaways: string[] = [];
  // The source writes the colon inside the tag: <strong>First derivation:</strong> value
  const pattern = /<strong>([^<]+?)<\/strong>\s*([^<]*?)(?:<br\s*\/?>|$)/g;
  const rest = paragraphHtml.replace(pattern, (_match, label: string, text: string) => {
    takeaways.push(`${unescapeHtml(label.trim().replace(/:$/, ""))}: ${unescapeHtml(text.trim())}`.trim());
    return "";
  });
  return { takeaways, rest: rest.trim() };
}

function parseTimSommerPage(pageHtml: string): TimSommerSection[] {
  const articleMatch = /<article[^>]*>(.*?)<\/article>/s.exec(pageHtml);
  if (!articleMatch) throw new Error("Could not find the timsommer.be article body");
  const body = articleMatch[1];

  const sections: TimSommerSection[] = [];
  const parts = body.split(/<h2[^>]*>/);
  for (const part of parts.slice(1)) {
    const headingMatch = /^([^<]+)<\/h2>/.exec(part);
    if (!headingMatch) continue;
    const title = unescapeHtml(headingMatch[1].trim());
    if (title === "Conclusion") continue;

    const sectionHtml = part.slice(headingMatch[0].length);
    const blockquote = /<blockquote>\s*<p>(.*?)<\/p>\s*<\/blockquote>/s.exec(sectionHtml);
    const definition = blockquote ? unescapeHtml(stripTags(blockquote[1])).trim() : null;

    const noBlockquotes = sectionHtml.replace(/<blockquote>.*?<\/blockquote>/gs, "");
    const takeaways: string[] = [];
    const copy: string[] = [];
    for (const paragraph of noBlockquotes.matchAll(/<p>(.*?)<\/p>/gs)) {
      const inner = paragraph[1];
      if (/<strong>[^<]+<\/strong>/.test(inner)) {
        const { takeaways: labeled, rest } = extractLabeledLines(inner);
        takeaways.push(...labeled);
        if (rest) {
          const text = unescapeHtml(stripTags(rest)).trim();
          if (text) copy.push(text);
        }
      } else {
        const text = unescapeHtml(stripTags(inner)).trim();
        if (text) copy.push(text);
      }
    }

    sections.push({ title, definition, takeaways, copy });
  }
  return sections;
}

function toSoftwareLaw(section: TimSommerSection): ParsedLaw {
  const slug = slugifyTitle(section.title);
  if (!section.definition) {
    throw new Error(`timsommer law "${section.title}" has no blockquote definition`);
  }
  return {
    slug,
    title: section.title,
    definition: section.definition,
    category: "theory",
    color: colorFromSlug(slug),
    labels: [],
    ...(section.takeaways.length > 0 ? { takeaways: section.takeaways } : {}),
    copy: section.copy,
    sources: [SOFTWARE_URL],
    related: [],
  };
}

/* ------------------------------------------------------------------ */
/* Editorial label map (curated per law)                               */
/* ------------------------------------------------------------------ */

const LABELS: Record<string, LawLabel[]> = {
  // lawsofux.com
  "aesthetic-usability-effect": ["design", "ui", "psychology"],
  "choice-overload": ["ui", "psychology"],
  chunking: ["ui", "psychology", "cs"],
  "cognitive-bias": ["ui", "design", "psychology"],
  "cognitive-load": ["ui", "design", "psychology"],
  "doherty-threshold": ["ui", "cs", "psychology"],
  "fittss-law": ["ui", "design", "cs"],
  flow: ["ui", "design", "psychology"],
  "goal-gradient-effect": ["ui", "product", "psychology"],
  "hicks-law": ["ui", "psychology", "cs"],
  "jakobs-law": ["ui", "design"],
  "law-of-common-region": ["design", "psychology", "ui"],
  "law-of-proximity": ["design", "psychology", "ui"],
  "law-of-praegnanz": ["design", "psychology"],
  "law-of-similarity": ["design", "psychology", "ui"],
  "law-of-uniform-connectedness": ["design", "psychology", "ui"],
  "mental-model": ["ui", "design", "psychology"],
  "millers-law": ["ui", "psychology", "cs"],
  "occams-razor": ["design", "cs", "software-engineering"],
  "paradox-of-the-active-user": ["ui", "product", "psychology"],
  "pareto-principle": ["product", "management", "cs"],
  "parkinsons-law": ["management", "product", "software-engineering"],
  "peak-end-rule": ["ui", "product", "psychology"],
  "postels-law": ["cs", "software-engineering", "ui"],
  "selective-attention": ["ui", "psychology"],
  "serial-position-effect": ["ui", "psychology"],
  "teslers-law": ["ui", "cs", "software-engineering"],
  "von-restorff-effect": ["design", "ui", "psychology"],
  "working-memory": ["ui", "psychology", "cs"],
  "zeigarnik-effect": ["ui", "product", "psychology"],
  // timsommer.be
  "murphys-law": ["software-engineering", "management"],
  "brooks-law": ["management", "software-engineering"],
  "hofstadters-law": ["management", "software-engineering"],
  "conways-law": ["architecture", "software-engineering", "management"],
  "peter-principle": ["management"],
  "kerchkhoffs-principle": ["security", "cs"],
  "linuss-law": ["cs", "software-engineering"],
  "moores-law": ["cs"],
  "wirths-law": ["cs", "software-engineering"],
  "ninety-ninety-rule": ["software-engineering", "management"],
  "knuths-optimization-principle": ["cs", "software-engineering"],
  "norvigs-law": ["product", "cs"],
};

/** Applies the curated label map, failing loudly on any unlabeled law. */
function applyLabels(law: ParsedLaw): ParsedLaw {
  const labels = LABELS[law.slug];
  if (!labels) throw new Error(`Missing curated labels for law "${law.slug}"`);
  return { ...law, labels };
}

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

function renderLawFile(law: ParsedLaw): string {
  const lines = [
    "// Generated by scripts/fetch-laws.ts from lawsofux.com and timsommer.be. Do not edit directly.",
    'import type { Law } from "../types";',
    "",
    `export const ${slugToIdentifier(law.slug)}: Law = {`,
    `  slug: ${JSON.stringify(law.slug)},`,
    `  title: ${JSON.stringify(law.title)},`,
    `  definition: ${JSON.stringify(law.definition)},`,
    `  category: ${JSON.stringify(law.category)},`,
    `  color: ${JSON.stringify(law.color)},`,
    `  labels: ${JSON.stringify(law.labels)},`,
  ];
  if (law.takeaways) lines.push(`  takeaways: ${JSON.stringify(law.takeaways)},`);
  lines.push(`  copy: ${JSON.stringify(law.copy)},`);
  if (law.source) lines.push(`  source: ${JSON.stringify(law.source)},`);
  if (law.furtherReading) lines.push(`  furtherReading: ${JSON.stringify(law.furtherReading)},`);
  if (law.graphic) lines.push(`  graphic: ${JSON.stringify(law.graphic)},`);
  lines.push(
    `  sources: ${JSON.stringify(law.sources)},`,
    `  related: ${JSON.stringify(law.related)},`,
    "};",
    "",
  );
  return lines.join("\n");
}

function renderIndexFile(laws: ParsedLaw[]): string {
  const lines = [
    "// Generated by scripts/fetch-laws.ts from lawsofux.com and timsommer.be. Do not edit directly.",
    'import type { Law } from "../types";',
    ...laws.map((law) => `import { ${slugToIdentifier(law.slug)} } from "./${law.slug}";`),
    "",
    "/** All laws: the 30 laws of UX in lawsofux.com homepage order, then the laws of software development. */",
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
    headers: { "user-agent": "th-m-laws-snapshot/1.0 (+workspace regeneration script)" },
  });
  if (!response.ok) throw new Error(`GET ${url} failed with ${response.status}`);
  return response.text();
}

/* ------------------------------------------------------------------ */
/* Assembly                                                            */
/* ------------------------------------------------------------------ */

const [uxHomeHtml, softwareHtml] = await Promise.all([fetchText(UX_HOME_URL), fetchText(SOFTWARE_URL)]);

const uxLaws = await Promise.all(
  parseUxHomepage(uxHomeHtml).map(async ({ sourceSlug, category }) => {
    const pageHtml = await fetchText(`https://lawsofux.com/${sourceSlug}/`);
    return parseUxLawPage(pageHtml, sourceSlug, category);
  }),
);

// Merge timsommer laws that duplicate lawsofux entries (Postel, Pareto).
const merged: Record<string, string[]> = {};
const softwareLaws = parseTimSommerPage(softwareHtml).map(toSoftwareLaw).filter((law) => {
  const existing = uxLaws.find((uxLaw) => uxLaw.slug === law.slug);
  if (existing) {
    existing.copy = [...new Set([...existing.copy, ...law.copy])];
    existing.sources = [...new Set([...existing.sources, ...law.sources])];
    merged[law.slug] = [existing.slug, law.slug];
    return false;
  }
  return true;
});

const laws = [...uxLaws, ...softwareLaws].map(applyLabels);

await mkdir(OUTPUT_DIR, { recursive: true });
for (const law of laws) {
  await writeFile(new URL(`${law.slug}.ts`, OUTPUT_DIR), renderLawFile(law), "utf8");
}
await writeFile(new URL("index.ts", OUTPUT_DIR), renderIndexFile(laws), "utf8");

console.log(`Regenerated ${laws.length} law data files under src/laws/`);
for (const slug of Object.keys(merged)) {
  console.log(`  merged: ${merged[slug][0]} <- ${merged[slug][1]}`);
}
for (const law of laws) {
  console.log(
    `  ${law.slug.padEnd(34)} labels=${law.labels.join(",").padEnd(38)} takeaways=${(law.takeaways ?? []).length} copy=${law.copy.length} reading=${(law.furtherReading ?? []).length} sources=${law.sources.length}`,
  );
}
