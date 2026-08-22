import { mkdir, readFile, realpath, writeFile } from "node:fs/promises";
import { basename, dirname, extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";
import { analyzeSetAtlas } from "@th-m/knowledge-model";
import {
  buildSetAtlasScene,
  createSetAtlasSvg,
  type EmbeddedSetAtlasFonts,
} from "@th-m/set-theory-visualization/core";

export interface GenerateSetAtlasOptions {
  workspaceRoot: string;
  input: string;
  output: string;
  tsconfig?: string;
}

export interface GeneratedSetAtlasArtifacts {
  svgPath: string;
  pngPath: string;
}

const sourceExtensions = new Set([".ts", ".tsx", ".mts", ".cts"]);

function assertInside(root: string, candidate: string, label: string): void {
  const path = relative(root, candidate);
  if (path === "" || (!path.startsWith(`..${sep}`) && path !== "..")) return;
  throw new Error(`${label} must be inside the workspace.`);
}

async function existingPath(root: string, value: string, label: string): Promise<string> {
  const candidate = resolve(root, value);
  assertInside(root, candidate, label);
  const canonical = await realpath(candidate);
  assertInside(await realpath(root), canonical, label);
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
  return (await readFile(fileURLToPath(import.meta.resolve(specifier)))).toString("base64");
}

async function embeddedFonts(): Promise<EmbeddedSetAtlasFonts> {
  const [newsreader, plexMono] = await Promise.all([
    loadFont("@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2"),
    loadFont("@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2"),
  ]);
  return { newsreader, plexMono };
}

export async function generateSetAtlasArtifacts(
  options: GenerateSetAtlasOptions,
): Promise<GeneratedSetAtlasArtifacts> {
  const workspaceRoot = await realpath(resolve(options.workspaceRoot));
  const sourcePath = await existingPath(workspaceRoot, options.input, "Input");
  if (!sourceExtensions.has(extname(sourcePath))) {
    throw new Error("Input must be a .ts, .tsx, .mts, or .cts source file.");
  }
  const tsconfigPath = options.tsconfig
    ? await existingPath(workspaceRoot, options.tsconfig, "TypeScript config")
    : undefined;
  const target = await outputBase(workspaceRoot, options.output);

  const analysis = await analyzeSetAtlas({
    revision: 1,
    source: {
      mode: "project",
      sourceFilePath: sourcePath,
      ...(tsconfigPath ? { tsconfigPath } : {}),
    },
  });
  const errors = analysis.diagnostics.filter(({ severity }) => severity === "error");
  if (errors.length > 0) {
    throw new Error(`TypeScript analysis failed:\n${errors.map(({ message }) => `- ${message}`).join("\n")}`);
  }

  const scene = buildSetAtlasScene(analysis);
  const svg = await createSetAtlasSvg(scene, {
    title: basename(sourcePath),
    warnings: analysis.diagnostics
      .filter(({ severity }) => severity !== "error")
      .map(({ message }) => message),
    fonts: await embeddedFonts(),
  });
  const renderer = new Resvg(svg, { fitTo: { mode: "zoom", value: 2 } });
  const svgPath = `${target}.svg`;
  const pngPath = `${target}@2x.png`;
  await Promise.all([writeFile(svgPath, svg), writeFile(pngPath, renderer.render().asPng())]);
  return { svgPath, pngPath };
}
