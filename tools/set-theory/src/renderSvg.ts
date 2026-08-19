import { thomDesignTokens } from "@th-m/design-theme";
import type { AtlasCard, RegionShape, SetAtlasScene } from "./types";

export interface EmbeddedSetAtlasFonts {
  newsreader: string;
  plexMono: string;
}

export interface SetAtlasSvgOptions {
  title?: string;
  description?: string;
  /** Additional analysis or export warnings to include after scene warnings. */
  warnings?: string[];
  /** Supplying fonts makes the synchronous renderer self-contained. */
  fonts?: EmbeddedSetAtlasFonts;
}

interface SvgBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  contentBottom: number;
}

const xml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

function finite(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

function fixed(value: number): string {
  const rounded = Math.round(finite(value) * 100) / 100;
  return Object.is(rounded, -0) ? "0" : String(rounded);
}

function uniqueWarnings(scene: SetAtlasScene, options: SetAtlasSvgOptions): string[] {
  return [...new Set([...scene.warnings, ...(options.warnings ?? [])])].sort((left, right) =>
    left.localeCompare(right, "en"),
  );
}

function calculateBounds(scene: SetAtlasScene, warningCount: number): SvgBounds {
  const extents: Array<{ minX: number; minY: number; maxX: number; maxY: number }> = [];
  for (const region of scene.regions) {
    extents.push({
      minX: region.cx - region.rx,
      minY: region.cy - region.ry,
      maxX: region.cx + region.rx,
      maxY: region.cy + region.ry,
    });
  }
  for (const card of scene.cards) {
    extents.push({
      minX: card.x,
      minY: card.y,
      maxX: card.x + card.width,
      maxY: card.y + card.height,
    });
  }
  for (const atom of scene.atoms) {
    extents.push({
      minX: atom.x - 8,
      minY: atom.y - 10,
      maxX: atom.x + Math.max(34, atom.label.length * 8.4),
      maxY: atom.y + 12,
    });
  }

  const minimumX = Math.min(0, ...extents.map(({ minX }) => minX));
  const minimumY = Math.min(0, ...extents.map(({ minY }) => minY));
  const maximumX = Math.max(scene.width, ...extents.map(({ maxX }) => maxX), 960);
  const contentBottom = Math.max(scene.height, ...extents.map(({ maxY }) => maxY), 560);
  const padding = 62;
  const legendHeight = warningCount > 0 ? 84 + Math.min(warningCount, 6) * 25 : 0;
  return {
    x: minimumX - padding,
    y: minimumY - padding,
    width: maximumX - minimumX + padding * 2,
    height: contentBottom - minimumY + padding * 2 + legendHeight,
    contentBottom,
  };
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

function renderRegion(region: RegionShape, index: number): string {
  const label = region.labels.join(" ≡ ");
  const labelLines = wrapText(label, Math.max(12, Math.floor(region.rx / 7.5)), 2);
  const typeLines = wrapText(region.display, Math.max(15, Math.floor(region.rx / 6)), 2);
  const top = region.cy - region.ry;
  const labelY = top + Math.min(38, Math.max(26, region.ry * 0.24));
  const typeY = labelY + labelLines.length * 20 + 6;
  const className = `set-region depth-${region.depth % 4}${region.approximate ? " approximate" : ""}`;
  const code = `S.${String(index + 1).padStart(2, "0")} / DEPTH ${region.depth}`;
  return `<g class="${className}" data-region-id="${xml(region.id)}" data-symbol-ids="${xml(region.symbolIds.join(" "))}" aria-label="${xml(`${label}: ${region.display}`)}">
    <ellipse class="region-field" cx="${fixed(region.cx)}" cy="${fixed(region.cy)}" rx="${fixed(region.rx)}" ry="${fixed(region.ry)}"/>
    <ellipse class="region-orbit" cx="${fixed(region.cx)}" cy="${fixed(region.cy)}" rx="${fixed(region.rx + 7)}" ry="${fixed(region.ry + 7)}"/>
    <circle class="region-index-dot" cx="${fixed(region.cx)}" cy="${fixed(top + 9)}" r="3.5"/>
    <text class="region-code" x="${fixed(region.cx)}" y="${fixed(top + 19)}" text-anchor="middle">${xml(code)}</text>
    <text class="region-label" text-anchor="middle">${tspans(labelLines, region.cx, labelY, 20)}</text>
    <text class="region-type" text-anchor="middle">${tspans(typeLines, region.cx, typeY, 15)}</text>
    ${region.approximate ? `<text class="approximate-label" x="${fixed(region.cx)}" y="${fixed(region.cy + region.ry - 19)}" text-anchor="middle">APPROXIMATE</text>` : ""}
  </g>`;
}

function cardCaption(card: AtlasCard): string {
  if (card.status === "empty") return "EMPTY SET / NO MEMBERS";
  if (card.status === "exception") return "TYPE-SYSTEM EXCEPTION";
  return "GENERIC SET TEMPLATE";
}

function renderCard(card: AtlasCard, index: number): string {
  const labelLines = wrapText(card.label, 25, 2);
  const detailLines = wrapText(card.detail, 38, 2);
  const badge = card.status === "empty" ? "∅" : card.status === "exception" ? "!" : "T";
  return `<g class="atlas-card ${card.status}" data-card-id="${xml(card.id)}" data-symbol-id="${xml(card.symbolId)}" aria-label="${xml(`${card.label}: ${card.detail}`)}">
    <rect x="${fixed(card.x)}" y="${fixed(card.y)}" width="${fixed(card.width)}" height="${fixed(card.height)}" rx="3"/>
    <text class="card-badge" x="${fixed(card.x + 22)}" y="${fixed(card.y + 31)}">${badge}</text>
    <text class="card-code" x="${fixed(card.x + 50)}" y="${fixed(card.y + 27)}">C.${String(index + 1).padStart(2, "0")} / ${cardCaption(card)}</text>
    <text class="card-label">${tspans(labelLines, card.x + 22, card.y + 56, 19)}</text>
    <text class="card-detail">${tspans(detailLines, card.x + 22, card.y + 91, 15)}</text>
  </g>`;
}

function renderWarnings(warnings: string[], bounds: SvgBounds): string {
  if (warnings.length === 0) return "";
  const visible = warnings.slice(0, 6);
  const hidden = warnings.length - visible.length;
  const x = bounds.x + 38;
  const top = bounds.contentBottom + 78;
  const entries = visible
    .map((warning, index) => {
      const rendered = warning.length > 145 ? `${warning.slice(0, 142)}…` : warning;
      return `<text class="warning-entry" x="${fixed(x + 17)}" y="${fixed(top + 30 + index * 25)}"><tspan class="warning-mark">◇</tspan><tspan dx="10">${xml(rendered)}</tspan></text>`;
    })
    .join("");
  const remainder = hidden
    ? `<text class="warning-entry" x="${fixed(x + 17)}" y="${fixed(top + 30 + visible.length * 25)}">+ ${hidden} additional warnings in the atlas</text>`
    : "";
  return `<g class="warning-legend" role="note" aria-label="Geometry warnings">
    <line x1="${fixed(x)}" y1="${fixed(top - 18)}" x2="${fixed(bounds.x + bounds.width - 38)}" y2="${fixed(top - 18)}"/>
    <text class="warning-heading" x="${fixed(x)}" y="${fixed(top)}">GEOMETRY / APPROXIMATION NOTES</text>
    ${entries}${remainder}
  </g>`;
}

function fontFaceDefinitions(fonts?: EmbeddedSetAtlasFonts): string {
  if (!fonts) return "";
  return `
    @font-face { font-family: "Newsreader Atlas"; src: url(data:font/woff2;base64,${fonts.newsreader}) format("woff2"); font-weight: 200 800; font-style: normal; }
    @font-face { font-family: "IBM Plex Mono Atlas"; src: url(data:font/woff2;base64,${fonts.plexMono}) format("woff2"); font-weight: 400; font-style: normal; }`;
}

function definitions(fonts?: EmbeddedSetAtlasFonts): string {
  const { color, effect } = thomDesignTokens;
  return `<defs>
  <style><![CDATA[${fontFaceDefinitions(fonts)}
    .set-region { --region-opacity: .042; }
    .set-region.depth-1 { --region-opacity: .052; }
    .set-region.depth-2 { --region-opacity: .065; }
    .set-region.depth-3 { --region-opacity: .08; }
    .region-field { fill: ${color.primary.default}; fill-opacity: var(--region-opacity); stroke: ${color.primary.default}; stroke-width: 1.45; vector-effect: non-scaling-stroke; }
    .region-orbit { fill: none; stroke: ${color.border}; stroke-width: .8; stroke-opacity: .52; vector-effect: non-scaling-stroke; }
    .set-region.approximate .region-field, .set-region.approximate .region-orbit { stroke: ${color.semantic.error.default}; stroke-dasharray: 8 7; }
    .region-index-dot { fill: ${color.primary.default}; }
    .region-code, .region-type, .approximate-label, .card-code, .card-detail, .warning-heading, .warning-entry, .atom-label { font-family: "IBM Plex Mono Atlas", ${thomDesignTokens.typography.mono}; }
    .region-code { fill: ${color.primary.default}; font-size: 8px; letter-spacing: 1.45px; }
    .region-label { fill: ${color.foreground}; font-family: "Newsreader Atlas", ${thomDesignTokens.typography.display}; font-size: 19px; font-weight: 570; }
    .region-type { fill: ${color.foregroundMuted}; font-size: 9px; }
    .approximate-label { fill: ${color.semantic.error.default}; font-size: 8px; letter-spacing: 1.7px; }
    .atom-dot { fill: ${color.foregroundStrong}; stroke: ${color.primary.default}; stroke-width: 1.5; }
    .atom-label { fill: ${color.foreground}; font-size: 11px; paint-order: stroke; stroke: ${color.background}; stroke-width: 3px; stroke-linejoin: round; }
    .atlas-card rect { fill: ${color.surface}; stroke: ${color.border}; stroke-width: 1.15; }
    .atlas-card.exception rect { stroke: ${color.semantic.error.default}; }
    .card-badge { fill: ${color.primary.default}; font-family: "Newsreader Atlas", ${thomDesignTokens.typography.display}; font-size: 21px; }
    .atlas-card.exception .card-badge { fill: ${color.semantic.error.default}; }
    .card-code { fill: ${color.primary.default}; font-size: 7.5px; letter-spacing: 1.25px; }
    .card-label { fill: ${color.foreground}; font-family: "Newsreader Atlas", ${thomDesignTokens.typography.display}; font-size: 17px; font-weight: 570; }
    .card-detail { fill: ${color.foregroundMuted}; font-size: 8.5px; }
    .warning-legend line { stroke: ${color.border}; }
    .warning-heading { fill: ${color.semantic.error.default}; font-size: 9px; letter-spacing: 2px; }
    .warning-entry { fill: ${color.foregroundMuted}; font-size: 9px; }
    .warning-mark { fill: ${color.semantic.error.default}; }
  ]]></style>
  <radialGradient id="atlas-ambient" cx="68%" cy="27%" r="74%"><stop offset="0" stop-color="${color.primary.default}" stop-opacity=".12"/><stop offset="1" stop-color="${color.background}" stop-opacity="0"/></radialGradient>
  <filter id="atlas-grain" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".84" numOctaves="3" seed="17"/><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${effect.grainOpacity} 0"/></filter>
</defs>`;
}

/** Synchronous renderer used by both the live view and the downloadable artifact. */
export function renderSetAtlasSvg(
  scene: SetAtlasScene,
  options: SetAtlasSvgOptions = {},
): string {
  const warnings = uniqueWarnings(scene, options);
  const bounds = calculateBounds(scene, warnings.length);
  const title = options.title?.trim() || "TypeScript set atlas";
  const description =
    options.description?.trim() ||
    `${scene.regions.length} set regions, ${scene.atoms.length} members, and ${scene.cards.length} special type cards${warnings.length ? ` with ${warnings.length} approximation warnings` : ""}.`;
  const regions = [...scene.regions]
    .sort((left, right) => left.depth - right.depth || left.id.localeCompare(right.id, "en"))
    .map(renderRegion)
    .join("");
  const atoms = [...scene.atoms]
    .sort((left, right) => left.id.localeCompare(right.id, "en"))
    .map(
      (atom) => `<g class="set-atom" data-atom-id="${xml(atom.id)}" data-owner-ids="${xml(atom.ownerIds.join(" "))}">
        <circle class="atom-dot" cx="${fixed(atom.x)}" cy="${fixed(atom.y)}" r="3.6"/>
        <text class="atom-label" x="${fixed(atom.x + 9)}" y="${fixed(atom.y + 4)}">${xml(atom.label)}</text>
      </g>`,
    )
    .join("");
  const cards = [...scene.cards]
    .sort((left, right) => left.id.localeCompare(right.id, "en"))
    .map(renderCard)
    .join("");
  const { color } = thomDesignTokens;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(bounds.width)}" height="${Math.ceil(bounds.height)}" viewBox="${fixed(bounds.x)} ${fixed(bounds.y)} ${fixed(bounds.width)} ${fixed(bounds.height)}" role="img" aria-labelledby="set-atlas-title set-atlas-description">
  <title id="set-atlas-title">${xml(title)}</title>
  <desc id="set-atlas-description">${xml(description)}</desc>
  <metadata>${xml(JSON.stringify({ kind: "typescript-set-atlas", regionCount: scene.regions.length, atomCount: scene.atoms.length, warningCount: warnings.length }))}</metadata>
  ${definitions(options.fonts)}
  <rect x="${fixed(bounds.x)}" y="${fixed(bounds.y)}" width="${fixed(bounds.width)}" height="${fixed(bounds.height)}" fill="${color.background}"/>
  <rect x="${fixed(bounds.x)}" y="${fixed(bounds.y)}" width="${fixed(bounds.width)}" height="${fixed(bounds.height)}" fill="url(#atlas-ambient)"/>
  <rect x="${fixed(bounds.x)}" y="${fixed(bounds.y)}" width="${fixed(bounds.width)}" height="${fixed(bounds.height)}" filter="url(#atlas-grain)" opacity=".42"/>
  <g id="set-atlas-regions">${regions}</g>
  <g id="set-atlas-atoms">${atoms}</g>
  <g id="set-atlas-cards">${cards}</g>
  ${renderWarnings(warnings, bounds)}
</svg>`;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

let embeddedFontsPromise: Promise<EmbeddedSetAtlasFonts> | undefined;

export function loadEmbeddedSetAtlasFonts(): Promise<EmbeddedSetAtlasFonts> {
  embeddedFontsPromise ??= Promise.all([
    import("@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2?url"),
    import("@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2?url"),
  ]).then(async ([newsreaderModule, plexModule]) => {
    const [newsreaderResponse, plexResponse] = await Promise.all([
      fetch(newsreaderModule.default),
      fetch(plexModule.default),
    ]);
    if (!newsreaderResponse.ok || !plexResponse.ok) {
      throw new Error("Unable to load the embedded atlas fonts.");
    }
    const [newsreader, plexMono] = await Promise.all([
      newsreaderResponse.arrayBuffer(),
      plexResponse.arrayBuffer(),
    ]);
    return {
      newsreader: arrayBufferToBase64(newsreader),
      plexMono: arrayBufferToBase64(plexMono),
    };
  });
  return embeddedFontsPromise;
}

/** Creates the self-contained SVG export, embedding the exact fonts used by the live atlas. */
export async function createSetAtlasSvg(
  scene: SetAtlasScene,
  options: SetAtlasSvgOptions = {},
): Promise<string> {
  const fonts = options.fonts ?? (await loadEmbeddedSetAtlasFonts());
  return renderSetAtlasSvg(scene, { ...options, fonts });
}
