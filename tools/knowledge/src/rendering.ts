import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { Resvg } from "@resvg/resvg-js";

const MAXIMUM_NATIVE_RASTER_PREVIEW_DIMENSION = 2_500;
const MAXIMUM_NATIVE_RASTER_PREVIEW_AREA = 4_000_000;

export interface EmbeddedFonts {
  newsreader: string;
  plexMono: string;
}

export interface RenderedDiagram {
  svg: string;
  png: Uint8Array;
  width: number;
  height: number;
  rasterScale: number;
}

export const xml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export function wrapText(value: string, maximumCharacters: number, maximumLines = 4): string[] {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if (line && `${line} ${word}`.length > maximumCharacters) {
      lines.push(line);
      line = word;
      if (lines.length >= maximumLines - 1) break;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line && lines.length < maximumLines) lines.push(line);
  const consumed = lines.join(" ").split(/\s+/).filter(Boolean).length;
  if (consumed < words.length) lines[lines.length - 1] = `${lines.at(-1)?.replace(/[….]$/u, "")}…`;
  return lines;
}

export function tspans(lines: string[], x: number, y: number, lineHeight: number): string {
  return lines.map((line, index) => `<tspan x="${x}" y="${y + index * lineHeight}">${xml(line)}</tspan>`).join("");
}

export async function loadEmbeddedFonts(): Promise<EmbeddedFonts> {
  const [newsreader, plexMono] = await Promise.all([
    readFile(fileURLToPath(import.meta.resolve("@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2"))),
    readFile(fileURLToPath(import.meta.resolve("@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2"))),
  ]);
  return { newsreader: newsreader.toString("base64"), plexMono: plexMono.toString("base64") };
}

export function svgShell(options: {
  title: string;
  description: string;
  width: number;
  height: number;
  content: string;
  fonts: EmbeddedFonts;
  extraCss?: string;
}): string {
  const { title, description, width, height, content, fonts, extraCss = "" } = options;
  return `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title description" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <title id="title">${xml(title)}</title>
  <desc id="description">${xml(description)}</desc>
  <defs>
    <style><![CDATA[
      @font-face { font-family: "Newsreader Variable"; src: url(data:font/woff2;base64,${fonts.newsreader}) format("woff2"); font-weight: 200 800; }
      @font-face { font-family: "IBM Plex Mono"; src: url(data:font/woff2;base64,${fonts.plexMono}) format("woff2"); font-weight: 400; }
      text { fill: #f2e5cf; font-family: "IBM Plex Mono", monospace; }
      .display { font-family: "Newsreader Variable", Georgia, serif; }
      ${extraCss}
    ]]></style>
    <filter id="glow"><feGaussianBlur stdDeviation="6" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <marker id="arrow" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 z" fill="#d6b06a"/></marker>
    <marker id="arrow-muted" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 z" fill="#8f816e"/></marker>
  </defs>
  <rect width="${width}" height="${height}" fill="#050505"/>
  <path d="M0 86 H${width}" stroke="#2d271e"/>
  ${content}
</svg>`;
}

export function rasterizeSvg(svg: string, limits: { maximumDimension?: number; maximumArea?: number } = {}): { png: Uint8Array; rasterScale: number; width: number; height: number } {
  const { width, height } = svgDimensions(svg);
  const maximumDimension = limits.maximumDimension ?? 4_096;
  const maximumArea = limits.maximumArea ?? 10_000_000;
  const rasterScale = Math.min(1, maximumDimension / width, maximumDimension / height, Math.sqrt(maximumArea / (width * height)));
  const png = new Resvg(svg, { fitTo: { mode: "zoom", value: 2 * rasterScale } }).render().asPng();
  return { png, rasterScale, width, height };
}

function injectMermaidFonts(svg: string, fonts: EmbeddedFonts): string {
  const style = `<style><![CDATA[
    @font-face { font-family: "Newsreader Variable"; src: url(data:font/woff2;base64,${fonts.newsreader}) format("woff2"); font-weight: 200 800; }
    @font-face { font-family: "IBM Plex Mono"; src: url(data:font/woff2;base64,${fonts.plexMono}) format("woff2"); font-weight: 400; }
    text, .label, .nodeLabel, .edgeLabel { font-family: "IBM Plex Mono", monospace !important; }
  ]]></style>`;
  return svg.replace(/<svg([^>]*)>/, (_match, attributes: string) => {
    const accessibleAttributes = attributes
      .replace(/\srole="[^"]*"/g, "")
      .replace(/\saria-labelledby="[^"]*"/g, "");
    return `<svg${accessibleAttributes} role="img" aria-labelledby="native-mermaid-title native-mermaid-description"><title id="native-mermaid-title">Native Mermaid rendering</title><desc id="native-mermaid-description">Baseline generated by Mermaid 11.16.1.</desc><defs>${style}</defs>`;
  });
}

function svgDimensions(svg: string): { width: number; height: number } {
  const viewBox = svg.match(/viewBox="[^\"]*?([\d.]+)\s+([\d.]+)"/);
  if (viewBox) return { width: Math.ceil(Number(viewBox[1])), height: Math.ceil(Number(viewBox[2])) };
  const width = Number(svg.match(/width="([\d.]+)/)?.[1] ?? 1200);
  const height = Number(svg.match(/height="([\d.]+)/)?.[1] ?? 800);
  return { width: Math.ceil(width), height: Math.ceil(height) };
}

/** Render Mermaid in its own browser runtime so the baseline uses the pinned public API. */
export async function renderNativeMermaid(source: string, fonts: EmbeddedFonts): Promise<RenderedDiagram> {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ deviceScaleFactor: 2 });
    const page = await context.newPage();
    await page.setContent("<!doctype html><html><body style='margin:0;background:#fff'><div id='host'></div></body></html>");
    await page.addScriptTag({ path: fileURLToPath(import.meta.resolve("mermaid/dist/mermaid.min.js")) });
    const rendered = await page.evaluate(async (diagramSource) => {
      const mermaid = (globalThis as unknown as { mermaid: { initialize(config: unknown): void; render(id: string, source: string): Promise<{ svg: string }> } }).mermaid;
      mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: "neutral", maxTextSize: 1_000_000, maxEdges: 10_000, flowchart: { htmlLabels: true, curve: "basis" } });
      return (await mermaid.render("knowledge-native", diagramSource)).svg;
    }, source);
    const svg = injectMermaidFonts(rendered, fonts);
    const { width, height } = svgDimensions(svg);
    const rasterScale = Math.min(1, MAXIMUM_NATIVE_RASTER_PREVIEW_DIMENSION / width, MAXIMUM_NATIVE_RASTER_PREVIEW_DIMENSION / height, Math.sqrt(MAXIMUM_NATIVE_RASTER_PREVIEW_AREA / (width * height)));
    const previewWidth = Math.max(1, Math.round(width * rasterScale));
    const previewHeight = Math.max(1, Math.round(height * rasterScale));
    await page.setViewportSize({ width: Math.max(800, previewWidth + 40), height: Math.max(600, previewHeight + 40) });
    await page.setContent(`<!doctype html><html><head><style>#preview>svg{width:${previewWidth}px!important;height:${previewHeight}px!important;max-width:none!important}</style></head><body style="margin:20px;background:white"><div id="preview">${svg}</div></body></html>`);
    const element = page.locator("svg").first();
    const png = await element.screenshot({ type: "png", omitBackground: false });
    await context.close();
    return { svg, png, width, height, rasterScale };
  } finally {
    await browser.close();
  }
}
