import newsreaderUrl from "@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2?url";
import plexMonoUrl from "@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2?url";
import {
  estimateDocumentSizes,
  propositionLayoutId,
  relationshipLayoutId,
} from "./layout";
import { thomTheme } from "./theme";
import type {
  GraphDocument,
  ItemSize,
  ItemSizes,
  LayoutPositions,
  Point,
  Relationship,
} from "./types";

export type SvgExportMode = "graph" | "poster";

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

const xml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

function wrapText(value: string, maxCharacters: number): string[] {
  const words = value.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if (line && `${line} ${word}`.length > maxCharacters) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line || lines.length === 0) lines.push(line);
  return lines;
}

function textLines(
  lines: string[],
  x: number,
  centerY: number,
  lineHeight: number,
  className: string,
): string {
  const firstY = centerY - ((lines.length - 1) * lineHeight) / 2;
  return `<text class="${className}" text-anchor="middle">${lines
    .map((line, index) => `<tspan x="${x}" y="${firstY + index * lineHeight}">${xml(line)}</tspan>`)
    .join("")}</text>`;
}

function center(position: Point, size: ItemSize): Point {
  return { x: position.x + size.width / 2, y: position.y + size.height / 2 };
}

function circleBoundary(from: Point, toward: Point, radius: number): Point {
  const dx = toward.x - from.x;
  const dy = toward.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  return { x: from.x + (dx / length) * radius, y: from.y + (dy / length) * radius };
}

function rectangleBoundary(from: Point, toward: Point, size: ItemSize): Point {
  const dx = toward.x - from.x;
  const dy = toward.y - from.y;
  const halfWidth = size.width / 2;
  const halfHeight = size.height / 2;
  const scale = 1 / Math.max(Math.abs(dx) / halfWidth || 0, Math.abs(dy) / halfHeight || 0, 1e-6);
  return { x: from.x + dx * scale, y: from.y + dy * scale };
}

function boundsForLayout(positions: LayoutPositions, sizes: ItemSizes): Bounds {
  const entries = Object.entries(positions).filter(([id]) => sizes[id]);
  if (entries.length === 0) return { x: 0, y: 0, width: 800, height: 500 };
  const minX = Math.min(...entries.map(([, point]) => point.x));
  const minY = Math.min(...entries.map(([, point]) => point.y));
  const maxX = Math.max(...entries.map(([id, point]) => point.x + sizes[id].width));
  const maxY = Math.max(...entries.map(([id, point]) => point.y + sizes[id].height));
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function renderRelationshipEdges(
  relationship: Relationship,
  positions: LayoutPositions,
  sizes: ItemSizes,
): string {
  const relationId = relationshipLayoutId(relationship.id);
  const relationPosition = positions[relationId];
  const relationSize = sizes[relationId];
  if (!relationPosition || !relationSize) return "";
  const relationCenter = center(relationPosition, relationSize);

  return relationship.participants
    .map((participant, index) => {
      const nodeId = propositionLayoutId(participant.nodeId);
      const nodePosition = positions[nodeId];
      const nodeSize = sizes[nodeId];
      if (!nodePosition || !nodeSize) return "";
      const nodeCenter = center(nodePosition, nodeSize);
      const start = circleBoundary(nodeCenter, relationCenter, nodeSize.width / 2);
      const end = rectangleBoundary(relationCenter, nodeCenter, relationSize);
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.hypot(dx, dy) || 1;
      const bend = (index - (relationship.participants.length - 1) / 2) * 7;
      const normalX = (-dy / length) * bend;
      const normalY = (dx / length) * bend;
      const c1 = { x: start.x + dx * 0.38 + normalX, y: start.y + dy * 0.38 + normalY };
      const c2 = { x: start.x + dx * 0.68 + normalX, y: start.y + dy * 0.68 + normalY };
      const markerStart = participant.arrowAtNode ? ' marker-start="url(#arrow-node)"' : "";
      const markerEnd = participant.arrowAtRelation
        ? ' marker-end="url(#arrow-relation)"'
        : "";
      return `<path class="relation-line" d="M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}"${markerStart}${markerEnd}/>`;
    })
    .join("");
}

function renderGraphContents(
  document: GraphDocument,
  positions: LayoutPositions,
  sizes: ItemSizes,
): string {
  const edges = document.relationships
    .map((relationship) => renderRelationshipEdges(relationship, positions, sizes))
    .join("");

  const propositions = document.propositions
    .map((proposition, index) => {
      const id = propositionLayoutId(proposition.id);
      const position = positions[id];
      const size = sizes[id];
      if (!position || !size) return "";
      const nodeCenter = center(position, size);
      const lines = wrapText(proposition.statement, Math.max(15, Math.floor(size.width / 12)));
      return `<g class="proposition${proposition.emphasis ? " emphasis" : ""}" aria-label="${xml(proposition.statement)}">
        <circle cx="${nodeCenter.x}" cy="${nodeCenter.y}" r="${size.width / 2 - 3}"/>
        <circle class="orbit" cx="${nodeCenter.x}" cy="${nodeCenter.y}" r="${size.width / 2 + 8}"/>
        <circle class="node-dot" cx="${nodeCenter.x}" cy="${position.y + 3}" r="4.5"/>
        <text class="proposition-code" x="${nodeCenter.x}" y="${position.y + 34}" text-anchor="middle">P.${String(index + 1).padStart(2, "0")} / PROPOSITION</text>
        ${textLines(lines, nodeCenter.x, nodeCenter.y + 5, 29, "proposition-statement")}
        <text class="proposition-caption" x="${nodeCenter.x}" y="${position.y + size.height - 27}" text-anchor="middle">WHAT CAN BE STATED</text>
      </g>`;
    })
    .join("");

  const relationships = document.relationships
    .map((relationship, index) => {
      const id = relationshipLayoutId(relationship.id);
      const position = positions[id];
      const size = sizes[id];
      if (!position || !size) return "";
      const lines = wrapText(relationship.statement, Math.max(24, Math.floor(size.width / 9)));
      return `<g class="relationship" aria-label="${xml(relationship.statement)}">
        <rect x="${position.x}" y="${position.y}" width="${size.width}" height="${size.height}" rx="4"/>
        <circle cx="${position.x + 25}" cy="${position.y + size.height / 2}" r="4.5"/>
        <text class="relationship-code" x="${position.x + 45}" y="${position.y + size.height / 2 + 4}">R.${String(index + 1).padStart(2, "0")}</text>
        ${textLines(lines, position.x + size.width * 0.61, position.y + size.height / 2 + 1, 20, "relationship-statement")}
      </g>`;
    })
    .join("");

  return `<g id="graph-contents">${edges}${propositions}${relationships}</g>`;
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

let embeddedFontsPromise: Promise<{ newsreader: string; plex: string }> | undefined;

async function loadEmbeddedFonts(): Promise<{ newsreader: string; plex: string }> {
  embeddedFontsPromise ??= Promise.all([
    fetch(newsreaderUrl).then((response) => response.arrayBuffer()),
    fetch(plexMonoUrl).then((response) => response.arrayBuffer()),
  ]).then(([newsreader, plex]) => ({
    newsreader: arrayBufferToBase64(newsreader),
    plex: arrayBufferToBase64(plex),
  }));
  return embeddedFontsPromise;
}

function svgDefinitions(fonts: { newsreader: string; plex: string }): string {
  return `<defs>
    <style><![CDATA[
      @font-face { font-family: "Newsreader Embedded"; src: url(data:font/woff2;base64,${fonts.newsreader}) format("woff2"); font-weight: 200 800; }
      @font-face { font-family: "IBM Plex Mono Embedded"; src: url(data:font/woff2;base64,${fonts.plex}) format("woff2"); font-weight: 400; }
      .relation-line { fill: none; stroke: ${thomTheme.color.gold}; stroke-width: 2; stroke-linecap: round; opacity: .82; }
      .proposition circle { fill: ${thomTheme.color.surface}; stroke: ${thomTheme.color.line}; stroke-width: 2; }
      .proposition.emphasis circle:first-child { stroke: ${thomTheme.color.gold}; }
      .proposition .orbit { fill: none; stroke-width: 1; opacity: .42; }
      .proposition .node-dot, .relationship circle { fill: ${thomTheme.color.gold}; stroke: none; }
      .proposition-code, .proposition-caption, .relationship-code, .relationship-statement { font-family: "IBM Plex Mono Embedded", monospace; fill: ${thomTheme.color.gold}; letter-spacing: 2px; }
      .proposition-code { font-size: 10px; }
      .proposition-caption { fill: ${thomTheme.color.muted}; font-size: 9px; }
      .proposition-statement { font-family: "Newsreader Embedded", serif; font-size: 28px; font-weight: 540; fill: ${thomTheme.color.ivory}; }
      .relationship rect { fill: ${thomTheme.color.background}; stroke: ${thomTheme.color.gold}; stroke-width: 1.4; }
      .relationship-code { font-size: 9px; }
      .relationship-statement { fill: ${thomTheme.color.ivory}; font-size: 12px; }
      .poster-kicker, .poster-footer, .poster-legend { font-family: "IBM Plex Mono Embedded", monospace; letter-spacing: 3px; fill: ${thomTheme.color.gold}; }
      .poster-kicker { font-size: 14px; }
      .poster-title { font-family: "Newsreader Embedded", serif; font-size: 46px; fill: ${thomTheme.color.ivory}; }
      .poster-footer, .poster-legend { font-size: 11px; }
    ]]></style>
    <marker id="arrow-node" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 10 0 L 0 5 L 10 10 z" fill="${thomTheme.color.gold}"/></marker>
    <marker id="arrow-relation" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="${thomTheme.color.gold}"/></marker>
    <radialGradient id="ambient" cx="68%" cy="32%"><stop offset="0" stop-color="${thomTheme.color.gold}" stop-opacity=".13"/><stop offset="1" stop-color="${thomTheme.color.background}" stop-opacity="0"/></radialGradient>
    <filter id="grain"><feTurbulence baseFrequency=".82" numOctaves="3" seed="17"/><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .045 0"/></filter>
  </defs>`;
}

export async function createGraphSvg(
  document: GraphDocument,
  positions: LayoutPositions,
  mode: SvgExportMode,
  providedSizes?: ItemSizes,
): Promise<string> {
  const sizes = { ...estimateDocumentSizes(document), ...providedSizes };
  const fonts = await loadEmbeddedFonts();
  const graphBounds = boundsForLayout(positions, sizes);
  const title = xml(`${document.name} proposition graph`);
  const description = xml(
    `${document.propositions.length} propositions connected by ${document.relationships.length} relationships.`,
  );
  const definitions = svgDefinitions(fonts);
  const contents = renderGraphContents(document, positions, sizes);

  if (mode === "poster") {
    const width = 1600;
    const height = 1000;
    const frame = { x: 90, y: 190, width: 1420, height: 670 };
    const scale = Math.min(frame.width / graphBounds.width, frame.height / graphBounds.height, 1);
    const tx = frame.x + (frame.width - graphBounds.width * scale) / 2 - graphBounds.x * scale;
    const ty = frame.y + (frame.height - graphBounds.height * scale) / 2 - graphBounds.y * scale;
    const legend = document.poster.showLegend
      ? `<text class="poster-legend" x="1510" y="914" text-anchor="end">CIRCLES / PROPOSITIONS · CARDS / RELATIONSHIPS · ARROWS / DIRECTION</text>`
      : "";
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">
      <title id="title">${title}</title><desc id="description">${description}</desc>${definitions}
      <rect width="1600" height="1000" fill="${thomTheme.color.background}"/><rect width="1600" height="1000" fill="url(#ambient)"/><rect width="1600" height="1000" filter="url(#grain)" opacity=".7"/>
      <line x1="90" y1="58" x2="1510" y2="58" stroke="${thomTheme.color.line}"/>
      <text class="poster-kicker" x="90" y="105">${xml(document.poster.kicker)}</text>
      <text class="poster-title" x="90" y="158">${xml(document.poster.title)}</text>
      <g transform="translate(${tx} ${ty}) scale(${scale})">${contents}</g>
      <line x1="90" y1="886" x2="1510" y2="886" stroke="${thomTheme.color.line}"/>
      <text class="poster-footer" x="90" y="914">${xml(document.poster.footer)}</text>${legend}
    </svg>`;
  }

  const padding = thomTheme.geometry.graphPadding;
  const viewBox = {
    x: graphBounds.x - padding,
    y: graphBounds.y - padding,
    width: graphBounds.width + padding * 2,
    height: graphBounds.height + padding * 2,
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(viewBox.width)}" height="${Math.ceil(viewBox.height)}" viewBox="${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}" role="img" aria-labelledby="title description">
    <title id="title">${title}</title><desc id="description">${description}</desc>${definitions}
    <rect x="${viewBox.x}" y="${viewBox.y}" width="${viewBox.width}" height="${viewBox.height}" fill="${thomTheme.color.background}"/>
    <rect x="${viewBox.x}" y="${viewBox.y}" width="${viewBox.width}" height="${viewBox.height}" fill="url(#ambient)"/>
    ${contents}
  </svg>`;
}

export function downloadText(filename: string, contents: string, type: string): void {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function slugifyFilename(value: string): string {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "proposition-graph"
  );
}
