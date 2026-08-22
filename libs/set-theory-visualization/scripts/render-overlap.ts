/**
 * General SVG overlap renderer for set diagrams.
 *
 * Draws overlapping groups as translucent ellipses that stack cleanly (the
 * type-level-typescript style): every group is a `fill-opacity` blob with a
 * crisp stroke and a legible, haloed label. Unlike the auto-laid-out atlas
 * scene, this script never invents dimensions — the SVG is sized exactly to
 * the groups you place, so nothing comes out with unexpected proportions.
 *
 *   bun run nx run set-theory-visualization:render:overlap \
 *     -- --input spec.json --output diagrams/known-sets [--print]
 *
 * Input is a JSON spec. Every group may set its own placement (cx/cy/rx/ry)
 * and coloring (fill/opacity/stroke/strokeWidth); unspecified values fall
 * back to the global `style` defaults. A spec may also reference a TypeScript
 * analysis (`"analysis"`) to bootstrap groups — either a path to an
 * `AnalyzeResult` JSON or `{ "source": "path/to/sets.ts", "tsconfig": "..." }`
 * to run the compiler — with the `groups` entries overriding that bootstrap by
 * group label or symbol id. `--print` writes the fully resolved groups back
 * out as a pure JSON spec, so you can analyze once and then hand-tune
 * placement and coloring forever after.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { thomDesignTokens } from "@th-m/design-theme";
import { analyzeSetAtlas, type AnalyzeResult } from "@th-m/knowledge-model";
import { buildSetAtlasScene } from "../src/layout";
import type { RegionShape } from "../src/types";

export interface OverlapGroupSpec {
  /** Group label; in analysis mode also the match key against region labels/symbol ids. */
  label?: string;
  /** Match key for analysis mode (region id / symbol id). Falls back to `label`. */
  id?: string;
  /** Optional secondary mono line under the label; `null` hides the derived display. */
  detail?: string | null;
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
  fill?: string;
  opacity?: number;
  stroke?: string;
  strokeWidth?: number;
  /** Drops the group (e.g. hide a derived region you do not want drawn). */
  hidden?: boolean;
}

export interface OverlapCanvasSpec {
  /** Optional fixed canvas size; content is centered inside it. */
  width?: number;
  height?: number;
  /** Padding around the group bounds when no fixed size is given. Default 60. */
  margin?: number;
  /** Optional background rect color; omitted (null) leaves the SVG transparent. */
  background?: string | null;
}

export interface OverlapStyleSpec {
  fill?: string;
  opacity?: number;
  stroke?: string;
  strokeWidth?: number;
  labelColor?: string;
  haloColor?: string;
  labelSize?: number;
  detailColor?: string;
}

export interface OverlapSpec {
  title?: string;
  description?: string;
  /** Path to an AnalyzeResult JSON, or `{ source, tsconfig? }` to run the compiler. */
  analysis?: string | { source: string; tsconfig?: string };
  canvas?: OverlapCanvasSpec;
  style?: OverlapStyleSpec;
  groups: OverlapGroupSpec[];
}

export interface OverlapGroup {
  id: string;
  label: string;
  detail: string | null;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  fill: string;
  opacity: number;
  stroke: string;
  strokeWidth: number;
  depth: number;
}

export interface OverlapBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface ResolvedOverlap {
  title: string;
  description: string;
  groups: OverlapGroup[];
  warnings: string[];
  bounds: OverlapBounds;
  viewBox: { x: number; y: number; width: number; height: number };
  margin: number;
  background: string | null;
  labelColor: string;
  haloColor: string;
  labelSize: number;
  detailColor: string;
}

const DEFAULT_FILL = thomDesignTokens.color.primary.default;
const DEFAULT_OPACITY = 0.5;
const DEFAULT_STROKE_WIDTH = 2;
const DEFAULT_LABEL_COLOR = thomDesignTokens.color.foreground;
const DEFAULT_HALO_COLOR = thomDesignTokens.color.background;
const DEFAULT_LABEL_SIZE = 19;
const DEFAULT_DETAIL_COLOR = thomDesignTokens.color.foreground;
const DEFAULT_MARGIN = 60;

/** Nx runs scripts from the project root, so user paths are workspace-relative. */
const WORKSPACE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

interface ResolvedStyle {
  fill: string;
  opacity: number;
  stroke?: string;
  strokeWidth: number;
}

const xml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

function fixed(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return Object.is(rounded, -0) ? "0" : String(rounded);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function wrapText(value: string, maximumCharacters: number, maximumLines: number): string[] {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if (line && `${line} ${word}`.length > maximumCharacters) {
      lines.push(line);
      line = word;
      if (lines.length === maximumLines - 1) break;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line && lines.length < maximumLines) lines.push(line);
  const consumed = lines.join(" ").split(/\s+/).filter(Boolean).length;
  if (consumed < words.length && lines.length > 0) {
    const last = lines.length - 1;
    lines[last] = `${lines[last].replace(/[.…]+$/u, "")}…`;
  }
  return lines;
}

function tspans(lines: string[], x: number, firstY: number, lineHeight: number): string {
  return lines
    .map(
      (line, index) =>
        `<tspan x="${fixed(x)}" y="${fixed(firstY + index * lineHeight)}">${xml(line)}</tspan>`,
    )
    .join("");
}

async function loadFont(specifier: string): Promise<string | undefined> {
  try {
    return (await readFile(fileURLToPath(import.meta.resolve(specifier)))).toString("base64");
  } catch {
    return undefined;
  }
}

async function embeddedFonts(): Promise<{ newsreader?: string; plexMono?: string }> {
  const [newsreader, plexMono] = await Promise.all([
    loadFont("@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2"),
    loadFont("@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2"),
  ]);
  return { newsreader, plexMono };
}

async function loadAnalysis(
  analysis: NonNullable<OverlapSpec["analysis"]>,
): Promise<AnalyzeResult> {
  if (typeof analysis === "string") {
    let parsed: unknown;
    try {
      parsed = JSON.parse(await readFile(resolve(WORKSPACE_ROOT, analysis), "utf8"));
    } catch (error) {
      throw new Error(`Unable to read analysis JSON "${analysis}": ${error instanceof Error ? error.message : String(error)}`);
    }
    const candidate = parsed as Partial<AnalyzeResult>;
    if (!Array.isArray(candidate.symbols) || !Array.isArray(candidate.relations)) {
      throw new Error(`Analysis JSON "${analysis}" does not look like an AnalyzeResult.`);
    }
    return candidate as AnalyzeResult;
  }
  const result = await analyzeSetAtlas({
    revision: 1,
    source: {
      mode: "project",
      sourceFilePath: resolve(WORKSPACE_ROOT, analysis.source),
      ...(analysis.tsconfig ? { tsconfigPath: resolve(WORKSPACE_ROOT, analysis.tsconfig) } : {}),
    },
  });
  const errors = result.diagnostics.filter(({ severity }) => severity === "error");
  if (errors.length > 0) {
    throw new Error(
      `TypeScript analysis failed:\n${errors.map(({ message }) => `- ${message}`).join("\n")}`,
    );
  }
  return result;
}

function matchesRegion(region: RegionShape, key: string): boolean {
  return (
    region.id === key ||
    region.symbolIds.includes(key) ||
    region.labels.includes(key)
  );
}

function groupFromRegion(region: RegionShape, style: ResolvedStyle): OverlapGroup {
  return {
    id: region.id,
    label: region.labels.join(" ≡ "),
    detail: region.display || null,
    cx: region.cx,
    cy: region.cy,
    rx: region.rx,
    ry: region.ry,
    fill: style.fill,
    opacity: style.opacity,
    stroke: style.stroke ?? style.fill,
    strokeWidth: style.strokeWidth,
    depth: region.depth,
  };
}

function resolveGroup(
  entry: OverlapGroupSpec,
  fallback: Pick<OverlapGroup, "id" | "label" | "detail" | "cx" | "cy" | "rx" | "ry" | "depth"> &
    Partial<Pick<OverlapGroup, "opacity" | "stroke" | "strokeWidth">>,
  style: ResolvedStyle,
  index: number,
): OverlapGroup {
  const id = entry.id ?? entry.label ?? fallback.id ?? `group-${index + 1}`;
  const fill = entry.fill ?? style.fill;
  return {
    id,
    label: entry.label ?? fallback.label ?? entry.id ?? `group-${index + 1}`,
    detail: entry.detail !== undefined ? entry.detail : fallback.detail ?? null,
    cx: entry.cx ?? fallback.cx,
    cy: entry.cy ?? fallback.cy,
    rx: entry.rx ?? fallback.rx,
    ry: entry.ry ?? fallback.ry,
    fill,
    opacity: entry.opacity ?? fallback.opacity ?? style.opacity,
    stroke: entry.stroke ?? fallback.stroke ?? style.stroke ?? fill,
    strokeWidth: entry.strokeWidth ?? fallback.strokeWidth ?? style.strokeWidth,
    depth: fallback.depth,
  };
}

/**
 * Resolves a spec (optionally bootstrapped from a TypeScript analysis) into a
 * flat list of placed, colored groups plus the exact SVG viewBox for them.
 */
export async function resolveOverlap(spec: OverlapSpec): Promise<ResolvedOverlap> {
  const warnings: string[] = [];
  const style: ResolvedStyle = {
    fill: spec.style?.fill ?? DEFAULT_FILL,
    opacity: spec.style?.opacity ?? DEFAULT_OPACITY,
    stroke: spec.style?.stroke,
    strokeWidth: spec.style?.strokeWidth ?? DEFAULT_STROKE_WIDTH,
  };

  const byId = new Map<string, OverlapGroup>();
  const hidden = new Set<string>();
  let regions: RegionShape[] = [];

  if (spec.analysis) {
    const analysis = await loadAnalysis(spec.analysis);
    const scene = buildSetAtlasScene(analysis);
    regions = scene.regions;
    for (const region of regions) byId.set(region.id, groupFromRegion(region, style));
  }

  for (let index = 0; index < spec.groups.length; index += 1) {
    const entry = spec.groups[index];
    const key = entry.id ?? entry.label;
    const region = key ? regions.find((candidate) => matchesRegion(candidate, key)) : undefined;
    const target = region ? byId.get(region.id) : undefined;

    if (target) {
      if (entry.hidden) {
        hidden.add(target.id);
      } else {
        byId.set(target.id, resolveGroup(entry, target, style, index));
      }
      continue;
    }

    if (spec.analysis) {
      const name = entry.label ?? entry.id ?? `#${index + 1}`;
      if (entry.hidden) {
        warnings.push(`Override "${name}" matched no derived group; hidden was ignored.`);
      } else if (
        isFiniteNumber(entry.cx) && isFiniteNumber(entry.cy) &&
        isFiniteNumber(entry.rx) && isFiniteNumber(entry.ry)
      ) {
        warnings.push(`Override "${name}" matched no derived group and was added as a new group.`);
        const added = resolveGroup(
          entry,
          {
            id: entry.id ?? entry.label ?? `group-${index + 1}`,
            label: entry.label ?? entry.id ?? `group-${index + 1}`,
            detail: entry.detail ?? null,
            cx: entry.cx,
            cy: entry.cy,
            rx: entry.rx,
            ry: entry.ry,
            depth: Number.MAX_SAFE_INTEGER,
          },
          style,
          index,
        );
        byId.set(added.id, added);
      } else {
        warnings.push(`Override "${name}" matched no derived group and was dropped (add placement to add it as a new group).`);
      }
      continue;
    }

    const label = entry.label ?? entry.id ?? `group-${index + 1}`;
    if (entry.hidden) continue;
    if (
      !isFiniteNumber(entry.cx) || !isFiniteNumber(entry.cy) ||
      !isFiniteNumber(entry.rx) || !isFiniteNumber(entry.ry)
    ) {
      throw new Error(`Group "${label}" is missing placement — every group needs cx, cy, rx, and ry without an analysis to derive them.`);
    }
    if ((entry.rx as number) <= 0 || (entry.ry as number) <= 0) {
      throw new Error(`Group "${label}" needs positive rx and ry.`);
    }
    const opacity = entry.opacity ?? style.opacity;
    if (!isFiniteNumber(opacity) || opacity < 0 || opacity > 1) {
      throw new Error(`Group "${label}" opacity must be between 0 and 1.`);
    }
    const resolved = resolveGroup(
      entry,
      {
        id: entry.id ?? label,
        label,
        detail: entry.detail ?? null,
        cx: entry.cx,
        cy: entry.cy,
        rx: entry.rx,
        ry: entry.ry,
        depth: index,
      },
      style,
      index,
    );
    byId.set(resolved.id, resolved);
  }

  const groups = [...byId.values()].filter((group) => !hidden.has(group.id));
  if (groups.length === 0) {
    throw new Error("The spec resolves to no visible groups.");
  }

  const ordered = [...groups].sort(
    (left, right) => left.depth - right.depth || left.id.localeCompare(right.id, "en"),
  );
  const bounds: OverlapBounds = {
    minX: Math.min(...ordered.map(({ cx, rx }) => cx - rx)),
    minY: Math.min(...ordered.map(({ cy, ry }) => cy - ry)),
    maxX: Math.max(...ordered.map(({ cx, rx }) => cx + rx)),
    maxY: Math.max(...ordered.map(({ cy, ry }) => cy + ry)),
  };

  const margin = isFiniteNumber(spec.canvas?.margin) ? (spec.canvas?.margin as number) : DEFAULT_MARGIN;
  const fixedWidth = spec.canvas?.width;
  const fixedHeight = spec.canvas?.height;
  let viewBox: ResolvedOverlap["viewBox"];
  if (isFiniteNumber(fixedWidth) && isFiniteNumber(fixedHeight) && fixedWidth > 0 && fixedHeight > 0) {
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    viewBox = {
      x: fixedWidth / 2 - centerX,
      y: fixedHeight / 2 - centerY,
      width: fixedWidth,
      height: fixedHeight,
    };
  } else {
    viewBox = {
      x: bounds.minX - margin,
      y: bounds.minY - margin,
      width: bounds.maxX - bounds.minX + margin * 2,
      height: bounds.maxY - bounds.minY + margin * 2,
    };
  }

  return {
    title: spec.title?.trim() || "Set overlap diagram",
    description:
      spec.description?.trim() ||
      `${ordered.length} overlapping set group${ordered.length === 1 ? "" : "s"}.`,
    groups: ordered,
    warnings,
    bounds,
    viewBox,
    margin,
    background: spec.canvas?.background === undefined ? null : spec.canvas.background,
    labelColor: spec.style?.labelColor ?? DEFAULT_LABEL_COLOR,
    haloColor: spec.style?.haloColor ?? DEFAULT_HALO_COLOR,
    labelSize: spec.style?.labelSize ?? DEFAULT_LABEL_SIZE,
    detailColor: spec.style?.detailColor ?? DEFAULT_DETAIL_COLOR,
  };
}

function renderGroup(group: OverlapGroup, resolved: ResolvedOverlap): string {
  const labelSize = resolved.labelSize;
  const top = group.cy - group.ry;
  const labelY = top + Math.min(38, Math.max(26, group.ry * 0.24));
  const labelMax = Math.max(8, Math.floor((group.rx * 1.7) / (labelSize * 0.55)));
  const labelLines = wrapText(group.label, labelMax, 2);
  const detailLines = group.detail
    ? wrapText(group.detail, Math.max(12, Math.floor((group.rx * 1.7) / 5.6)), 2)
    : [];
  const detailY = labelY + labelLines.length * (labelSize + 2) + 6;
  return `<g class="overlap-group">
    <ellipse cx="${fixed(group.cx)}" cy="${fixed(group.cy)}" rx="${fixed(group.rx)}" ry="${fixed(group.ry)}" fill="${xml(group.fill)}" fill-opacity="${fixed(group.opacity)}" stroke="${xml(group.stroke)}" stroke-width="${fixed(group.strokeWidth)}"/>
    <text class="overlap-label" text-anchor="middle">${tspans(labelLines, group.cx, labelY, labelSize + 2)}</text>
    ${detailLines.length > 0 ? `<text class="overlap-detail" text-anchor="middle">${tspans(detailLines, group.cx, detailY, 15)}</text>` : ""}
  </g>`;
}

/** Renders a spec to a self-contained SVG (fonts embedded). */
export async function renderOverlapSvg(spec: OverlapSpec): Promise<{ svg: string; resolved: ResolvedOverlap }> {
  const resolved = await resolveOverlap(spec);
  const fonts = await embeddedFonts();
  const { viewBox, background, labelColor, haloColor, labelSize, detailColor } = resolved;
  const fontFaces = [
    fonts.newsreader
      ? `@font-face { font-family: "Newsreader Overlap"; src: url(data:font/woff2;base64,${fonts.newsreader}) format("woff2"); font-weight: 200 800; font-style: normal; }`
      : "",
    fonts.plexMono
      ? `@font-face { font-family: "IBM Plex Mono Overlap"; src: url(data:font/woff2;base64,${fonts.plexMono}) format("woff2"); font-weight: 400; font-style: normal; }`
      : "",
  ].filter(Boolean).join("\n");
  const groups = resolved.groups.map((group) => renderGroup(group, resolved)).join("\n");
  const backgroundRect = background
    ? `<rect x="${fixed(viewBox.x)}" y="${fixed(viewBox.y)}" width="${fixed(viewBox.width)}" height="${fixed(viewBox.height)}" fill="${xml(background)}"/>`
    : "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(viewBox.width)}" height="${Math.ceil(viewBox.height)}" viewBox="${fixed(viewBox.x)} ${fixed(viewBox.y)} ${fixed(viewBox.width)} ${fixed(viewBox.height)}" role="img" aria-labelledby="overlap-title overlap-desc">
  <title id="overlap-title">${xml(resolved.title)}</title>
  <desc id="overlap-desc">${xml(resolved.description)}</desc>
  <defs>
  <style><![CDATA[
    ${fontFaces}
    .overlap-label { fill: ${xml(labelColor)}; font-family: "Newsreader Overlap", Georgia, serif; font-size: ${fixed(labelSize)}px; font-weight: 570; paint-order: stroke; stroke: ${xml(haloColor)}; stroke-width: 3px; stroke-linejoin: round; }
    .overlap-detail { fill: ${xml(detailColor)}; font-family: "IBM Plex Mono Overlap", ui-monospace, monospace; font-size: 9px; paint-order: stroke; stroke: ${xml(haloColor)}; stroke-width: 2px; stroke-linejoin: round; }
  ]]></style>
  </defs>
  ${backgroundRect}
  <g id="overlap-groups">${groups}
  </g>
</svg>`;
  return { svg, resolved };
}

function valueFor(arguments_: string[], name: string): string | undefined {
  const index = arguments_.indexOf(name);
  return index >= 0 ? arguments_[index + 1] : undefined;
}

function usage(): never {
  throw new Error(
    "Usage: set-theory-visualization:render:overlap -- --input <spec.json> --output <output-base> [--print]",
  );
}

async function main(): Promise<void> {
  const arguments_ = Bun.argv.slice(2);
  if (arguments_.includes("--help")) {
    console.log(
      "Usage: set-theory-visualization:render:overlap -- --input <spec.json> --output <output-base> [--print]",
    );
    process.exit(0);
  }
  const input = valueFor(arguments_, "--input") ?? usage();
  const output = valueFor(arguments_, "--output");
  const printOnly = arguments_.includes("--print");

  let spec: OverlapSpec;
  try {
    spec = JSON.parse(await readFile(resolve(WORKSPACE_ROOT, input), "utf8")) as OverlapSpec;
  } catch (error) {
    throw new Error(`Unable to read spec "${input}": ${error instanceof Error ? error.message : String(error)}`);
  }
  if (!Array.isArray(spec.groups)) {
    throw new Error(`Spec "${input}" must define a "groups" array.`);
  }

  const { svg, resolved } = await renderOverlapSvg(spec);
  for (const warning of resolved.warnings) console.warn(`overlap: ${warning}`);

  if (printOnly) {
    const printed = {
      title: resolved.title,
      description: resolved.description,
      canvas: {
        ...(spec.canvas?.width !== undefined ? { width: spec.canvas.width } : {}),
        ...(spec.canvas?.height !== undefined ? { height: spec.canvas.height } : {}),
        margin: resolved.margin,
        background: resolved.background ?? undefined,
      },
      style: {
        fill: spec.style?.fill,
        opacity: spec.style?.opacity,
        stroke: spec.style?.stroke,
        strokeWidth: spec.style?.strokeWidth,
        labelColor: resolved.labelColor,
        haloColor: resolved.haloColor,
        labelSize: resolved.labelSize,
        detailColor: resolved.detailColor,
      },
      groups: resolved.groups.map((group) => ({
        label: group.label,
        detail: group.detail ?? undefined,
        cx: group.cx,
        cy: group.cy,
        rx: group.rx,
        ry: group.ry,
        fill: group.fill,
        opacity: group.opacity,
        stroke: group.stroke,
        strokeWidth: group.strokeWidth,
      })),
    };
    console.log(JSON.stringify(printed, null, 2));
    return;
  }
  if (!output) usage();
  const target = resolve(WORKSPACE_ROOT, output);
  await mkdir(dirname(target), { recursive: true });
  const svgPath = `${target}.svg`;
  await writeFile(svgPath, svg);
  console.log(`Created ${svgPath}`);
}

if (import.meta.main) {
  await main();
}
