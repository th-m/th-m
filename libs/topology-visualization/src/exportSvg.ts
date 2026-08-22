// Deterministic, self-contained SVG renderer for layered system topologies.
// Fonts are embedded as base64 data URIs (Newsreader display + IBM Plex Mono),
// theme tokens come from the design foundation, and both the content-sized
// graph figure and the fixed 1600×1000 editorial poster are supported. The
// output is a single <svg> with accessibility metadata, safe for Bun/Node
// (no DOM, no WebGL).
import { topologyTheme } from "./theme";
import type { LayoutPositions, TopologyDocument, TopologyLink, TopologyNode, Point } from "./types";

export type SvgExportMode = "graph" | "poster";

export interface EmbeddedTopologyFonts {
  newsreader: string;
  plex: string;
}

const xml = (value: string): string =>
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

function nodeCode(nodes: TopologyNode[], node: TopologyNode): string {
  const index = nodes.findIndex((candidate) => candidate.id === node.id);
  return String(index + 1).padStart(2, "0");
}

function edgeEndpoints(
  document: TopologyDocument,
  link: TopologyLink,
  positions: LayoutPositions,
): { start: Point; end: Point } | null {
  const source = document.nodes.find((node) => node.id === link.source);
  const target = document.nodes.find((node) => node.id === link.target);
  const sourcePosition = source && positions[source.id];
  const targetPosition = target && positions[target.id];
  if (!source || !target || !sourcePosition || !targetPosition) return null;

  const { nodeWidth, nodeHeight } = topologyTheme.geometry;
  const horizontal = document.layoutDirection !== "td";
  const start: Point = horizontal
    ? { x: sourcePosition.x + nodeWidth, y: sourcePosition.y + nodeHeight / 2 }
    : { x: sourcePosition.x + nodeWidth / 2, y: sourcePosition.y + nodeHeight };
  const end: Point = horizontal
    ? { x: targetPosition.x, y: targetPosition.y + nodeHeight / 2 }
    : { x: targetPosition.x + nodeWidth / 2, y: targetPosition.y };
  return { start, end };
}

function renderLinks(
  document: TopologyDocument,
  positions: LayoutPositions,
): string {
  const { lineWidth } = topologyTheme.geometry;
  return document.links
    .map((link, linkIndex) => {
      const endpoints = edgeEndpoints(document, link, positions);
      if (!endpoints) return "";
      const { start, end } = endpoints;
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.hypot(dx, dy) || 1;
      const bend = (linkIndex % 2 === 0 ? 1 : -1) * Math.min(26, length * 0.12);
      const normalX = (-dy / length) * bend;
      const normalY = (dx / length) * bend;
      const c1 = { x: start.x + dx * 0.45 + normalX, y: start.y + dy * 0.45 + normalY };
      const dash = link.dashed ? ' stroke-dasharray="7 6"' : "";
      const label =
        link.label && link.label.trim()
          ? `<text class="topology-link-label" x="${(start.x + end.x) / 2 + normalX * 1.6}" y="${(start.y + end.y) / 2 + normalY * 1.6 - 8}">${xml(link.label)}</text>`
          : "";
      return `<g class="topology-link" aria-label="${xml(`${link.label ?? "Dependency"}: ${link.source} → ${link.target}`)}"><path d="M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c1.x} ${c1.y}, ${end.x} ${end.y}" class="topology-link-line" marker-end="url(#topology-arrow)"${dash} stroke-width="${lineWidth}"/>${label}</g>`;
    })
    .join("");
}

function renderNodeCards(
  document: TopologyDocument,
  positions: LayoutPositions,
): string {
  const { nodeWidth, nodeHeight } = topologyTheme.geometry;
  return document.nodes
    .map((node) => {
      const position = positions[node.id];
      if (!position) return "";
      const layer = document.layers.find((candidate) => candidate.id === node.layerId);
      const code = nodeCode(document.nodes, node);
      const emphasis = node.emphasis ? " is-emphasis" : "";
      const lines = wrapText(node.label, 26);
      return `<g class="topology-node${emphasis}" aria-label="${xml(`${node.label} (layer ${layer?.name ?? "?"})`)}">
  <rect x="${position.x}" y="${position.y}" width="${nodeWidth}" height="${nodeHeight}" rx="4" class="topology-node-frame"/>
  <circle cx="${position.x + 22}" cy="${position.y + nodeHeight / 2}" r="5" class="topology-node-dot"/>
  <text class="topology-node-code" x="${position.x + 36}" y="${position.y + 22}">${code} / ${xml(layer?.name ?? "LAYER").toUpperCase()}</text>
  ${textLines(lines, position.x + nodeWidth / 2, position.y + nodeHeight / 2 + 12, 17, "topology-node-label")}
</g>`;
    })
    .join("");
}

function renderLayerHeaders(
  document: TopologyDocument,
  positions: LayoutPositions,
): string {
  const { nodeWidth, headerHeight } = topologyTheme.geometry;
  return document.layers
    .map((layer, index) => {
      const firstNode = document.nodes.find((node) => node.layerId === layer.id);
      const anchor = firstNode ? positions[firstNode.id] : undefined;
      const x = anchor ? anchor.x : index * (nodeWidth + topologyTheme.geometry.columnGap) + topologyTheme.geometry.graphPadding;
      const detail = layer.detail
        ? `<text class="topology-layer-detail" x="${x + nodeWidth / 2}" y="${48}">${xml(layer.detail)}</text>`
        : "";
      return `<g class="topology-layer" aria-label="${xml(`Layer ${index + 1}: ${layer.name}`)}">
  <text class="topology-layer-index" x="${x + nodeWidth / 2}" y="${20}">LAYER ${String(index + 1).padStart(2, "0")}</text>
  <text class="topology-layer-name" x="${x + nodeWidth / 2}" y="${40}">${xml(layer.name)}</text>
  ${detail}
</g>`;
    })
    .join("");
}

function renderLegend(document: TopologyDocument, x: number, y: number): string {
  if (!document.poster?.showLegend) return "";
  const rows = document.layers
    .map(
      (layer, index) =>
        `<g transform="translate(${x}, ${y + index * 30})"><rect x="0" y="-6" width="10" height="10" fill="${index === 0 ? topologyTheme.color.primary : topologyTheme.color.foregroundMuted}"/><text class="topology-legend-label" x="20" y="3">${String(index + 1).padStart(2, "0")} — ${xml(layer.name)}</text></g>`,
    )
    .join("");
  return `<g class="topology-legend" aria-label="Legend"><text class="topology-legend-title" x="${x}" y="${y - 22}">LAYERS</text>${rows}</g>`;
}

function renderGraphContents(
  document: TopologyDocument,
  positions: LayoutPositions,
): string {
  return [
    renderLayerHeaders(document, positions),
    renderLinks(document, positions),
    renderNodeCards(document, positions),
  ].join("");
}

function contentTransform(
  mode: SvgExportMode,
  extent: { width: number; height: number },
  title: string,
): { transform: string; width: number; height: number } {
  const { graphPadding } = topologyTheme.geometry;
  if (mode === "graph") return { transform: "", width: extent.width, height: extent.height };

  const posterWidth = 1600;
  const posterHeight = 1000;
  const headerZone = 176;
  const footerZone = 118;
  const availableWidth = posterWidth - graphPadding * 2;
  const availableHeight = posterHeight - headerZone - footerZone;
  const scale = Math.min(availableWidth / extent.width, availableHeight / extent.height, 1.6);
  const scaledWidth = extent.width * scale;
  const scaledHeight = extent.height * scale;
  const offsetX = (posterWidth - scaledWidth) / 2;
  const offsetY = headerZone + (availableHeight - scaledHeight) / 2;
  return {
    transform: `translate(${offsetX} ${offsetY}) scale(${scale})`,
    width: posterWidth,
    height: posterHeight,
  };
}

export function createTopologySvg(
  document: TopologyDocument,
  positions: LayoutPositions,
  mode: SvgExportMode,
  extent: { width: number; height: number },
  fonts: EmbeddedTopologyFonts,
): string {
  const theme = topologyTheme;
  const label = `${document.name} topology`;
  const description = `${document.layers.length} layers with ${document.nodes.length} nodes and ${document.links.length} dependencies.`;
  const { transform, width, height } = contentTransform(mode, extent, label);

  const title = mode === "poster" && document.poster?.title ? document.poster.title : document.name;
  const kicker = mode === "poster" ? document.poster?.kicker ?? "SYSTEM TOPOLOGY" : "SYSTEM TOPOLOGY";
  const footer = mode === "poster" ? document.poster?.footer ?? `THOM · TOPOLOGY ${document.id.toUpperCase()}` : "";

  const header =
    mode === "poster"
      ? `<g class="topology-poster-header">
  <text class="topology-poster-kicker" x="84" y="64">${xml(kicker)}</text>
  <text class="topology-poster-title" x="84" y="126">${xml(title)}</text>
  <text class="topology-poster-meta" x="1516" y="64" text-anchor="end">${document.layers.length} LAYERS · ${document.nodes.length} NODES · ${document.links.length} LINKS</text>
</g>`
      : "";

  const footerBlock =
    mode === "poster"
      ? `<g class="topology-poster-footer">
  <line x1="84" y1="${height - 78}" x2="${width - 84}" y2="${height - 78}" class="topology-footer-line"/>
  <text class="topology-poster-footer-text" x="84" y="${height - 46}">${xml(footer)}</text>
  ${renderLegend(document, width - 320, height - 44 - document.layers.length * 30)}
</g>`
      : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">
  <title id="title">${xml(label)}</title>
  <desc id="description">${xml(description)}</desc>
  <style>
    @font-face { font-family: "Newsreader Embedded"; src: url(data:font/woff2;base64,${fonts.newsreader}) format("woff2"); }
    @font-face { font-family: "IBM Plex Mono Embedded"; src: url(data:font/woff2;base64,${fonts.plex}) format("woff2"); }
    .topology-graph-header text, .topology-poster-header text, .topology-poster-footer text { font-family: "IBM Plex Mono Embedded", monospace; }
    .topology-graph-kicker, .topology-poster-kicker { font-size: 11px; letter-spacing: .32em; fill: ${theme.color.primary}; }
    .topology-graph-title { font-family: "Newsreader Embedded", serif; font-size: 34px; font-weight: 520; fill: ${theme.color.foreground}; }
    .topology-poster-title { font-family: "Newsreader Embedded", serif; font-size: 58px; font-weight: 520; fill: ${theme.color.foregroundStrong}; }
    .topology-poster-meta { font-size: 10px; letter-spacing: .22em; fill: ${theme.color.foregroundMuted}; }
    .topology-poster-footer-text { font-size: 10px; letter-spacing: .3em; fill: ${theme.color.foregroundMuted}; }
    .topology-footer-line { stroke: ${theme.color.border}; stroke-width: 1; }
    .topology-layer-index { font-size: 8px; letter-spacing: .3em; fill: ${theme.color.primary}; }
    .topology-layer-name { font-family: "Newsreader Embedded", serif; font-size: 19px; font-weight: 520; fill: ${theme.color.foreground}; }
    .topology-layer-detail { font-size: 8.5px; letter-spacing: .12em; fill: ${theme.color.foregroundMuted}; }
    .topology-node-frame { fill: ${theme.color.surface}; stroke: ${theme.color.border}; stroke-width: 1; }
    .topology-node.is-emphasis .topology-node-frame { stroke: ${theme.color.primary}; stroke-width: 2; fill: ${theme.color.surfaceRaised}; }
    .topology-node-dot { fill: ${theme.color.primary}; }
    .topology-node-code { font-size: 7.5px; letter-spacing: .24em; fill: ${theme.color.foregroundMuted}; }
    .topology-node-label { font-family: "Newsreader Embedded", serif; font-size: 16px; font-weight: 520; fill: ${theme.color.foreground}; }
    .topology-node.is-emphasis .topology-node-label { fill: ${theme.color.foregroundStrong}; }
    .topology-link-line { fill: none; stroke: ${theme.color.primary}; stroke-width: 2; opacity: .8; }
    .topology-link-label { font-size: 9px; letter-spacing: .1em; fill: ${theme.color.foregroundMuted}; }
    .topology-legend-title { font-size: 9px; letter-spacing: .28em; fill: ${theme.color.primary}; }
    .topology-legend-label { font-size: 9px; fill: ${theme.color.foregroundMuted}; }
  </style>
  <rect width="${width}" height="${height}" fill="${theme.color.background}"/>
  <defs>
    <marker id="topology-arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="${theme.geometry.arrowSize}" markerHeight="${theme.geometry.arrowSize}" orient="auto-start-reverse">
      <path d="M 2 1 L 11 6 L 2 11 z" fill="${theme.color.primary}"/>
    </marker>
  </defs>
  ${header}
  <g transform="${transform}">${renderGraphContents(document, positions)}</g>
  ${footerBlock}
</svg>`;
}
