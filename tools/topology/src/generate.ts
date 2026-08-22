import {
  importTopologyDocument,
  layoutTopology,
  createTopologySvg,
  type EmbeddedTopologyFonts,
  type SvgExportMode,
} from "@th-m/topology-visualization/core";
import { mkdir, readFile, realpath, writeFile } from "node:fs/promises";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

export interface GenerateTopologyOptions {
  workspaceRoot: string;
  input: string;
  output: string;
  mode?: SvgExportMode;
}

export interface GeneratedTopologyArtifacts {
  svgPath: string;
  pngPath: string;
}

function assertInside(root: string, candidate: string, label: string): void {
  const path = relative(root, candidate);
  if (path === "" || (!path.startsWith(`..${sep}`) && path !== "..")) return;
  throw new Error(`${label} must be inside the workspace.`);
}

async function inputPath(root: string, value: string): Promise<string> {
  const candidate = resolve(root, value);
  assertInside(root, candidate, "Input");
  const canonical = await realpath(candidate);
  assertInside(await realpath(root), canonical, "Input");
  return canonical;
}

async function outputBase(root: string, value: string): Promise<string> {
  const candidate = resolve(root, value);
  assertInside(root, candidate, "Output");
  if (extname(candidate)) throw new Error("Output must be a basename without an extension.");
  await mkdir(dirname(candidate), { recursive: true });
  assertInside(await realpath(root), await realpath(dirname(candidate)), "Output");
  return candidate;
}

async function loadFont(specifier: string): Promise<string> {
  const url = import.meta.resolve(specifier);
  const buffer = await readFile(fileURLToPath(url));
  return buffer.toString("base64");
}

async function embeddedFonts(): Promise<EmbeddedTopologyFonts> {
  const [newsreader, plex] = await Promise.all([
    loadFont("@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2"),
    loadFont("@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2"),
  ]);
  return { newsreader, plex };
}

export async function generateTopologyArtifacts(
  options: GenerateTopologyOptions,
): Promise<GeneratedTopologyArtifacts> {
  const workspaceRoot = await realpath(resolve(options.workspaceRoot));
  const sourcePath = await inputPath(workspaceRoot, options.input);
  const target = await outputBase(workspaceRoot, options.output);
  const parsed = importTopologyDocument(await readFile(sourcePath, "utf8"));

  const { positions, extent } = layoutTopology(parsed);
  const svg = createTopologySvg(parsed, positions, options.mode ?? "graph", extent, await embeddedFonts());
  const renderer = new Resvg(svg, { fitTo: { mode: "zoom", value: 2 } });
  const svgPath = `${target}.svg`;
  const pngPath = `${target}@2x.png`;

  await Promise.all([writeFile(svgPath, svg), writeFile(pngPath, renderer.render().asPng())]);
  return { svgPath, pngPath };
}
