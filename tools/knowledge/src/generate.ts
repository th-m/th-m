import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, realpath, rename, rm, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join, relative, resolve, sep } from "node:path";
import { validateKnowledgeDocument, type KnowledgeDocument, type KnowledgePerspectiveKind } from "@th-m/knowledge-model";
import { createMermaidErd, erdToKnowledgeDocument, parsePostgresSchema, renderErd } from "./erd.ts";
import { parseMermaidFlowchart, renderPhasedProcess, renderSystemTopology, systemToKnowledgeDocument } from "./mermaid.ts";
import { loadEmbeddedFonts, rasterizeSvg, renderNativeMermaid, xml, type EmbeddedFonts, type RenderedDiagram } from "./rendering.ts";
import { knowledgeTheme } from "./theme.ts";
import { createPublicApiHtml, renderPackageDependencies, renderPublicApiOverview, renderSchemaHierarchy, snapshotToKnowledgeDocument } from "./typescript-workspace.ts";
import type { DiagramArtifact, ErdProofSource, MermaidProofSource, ProofManifest, ProofReport, ProofSource, SourceReport, TypeScriptProofSource, TypeScriptWorkspaceSnapshot } from "./types.ts";

export interface GenerateKnowledgeProofOptions {
  workspaceRoot: string;
  manifest: string;
  output: string;
}

export interface GeneratedKnowledgeProof {
  outputDirectory: string;
  reportPath: string;
  boardPath: string;
  report: ProofReport;
}

function assertInside(root: string, candidate: string, label: string): void {
  const path = relative(root, candidate);
  if (path === "" || (path !== ".." && !path.startsWith(`..${sep}`))) return;
  throw new Error(`${label} must be inside the workspace.`);
}

async function workspaceInput(root: string, value: string, label: string): Promise<string> {
  const candidate = resolve(root, value);
  assertInside(root, candidate, label);
  const canonical = await realpath(candidate);
  assertInside(root, canonical, label);
  return canonical;
}

function validateManifest(value: unknown): asserts value is ProofManifest {
  if (!value || typeof value !== "object") throw new Error("Proof manifest must be an object.");
  const manifest = value as Partial<ProofManifest>;
  if (manifest.schemaVersion !== 1) throw new Error("Unsupported proof manifest version.");
  if (!manifest.id || !manifest.title || !Array.isArray(manifest.sources) || manifest.sources.length === 0) throw new Error("Proof manifest requires id, title, and at least one source.");
  if (!Array.isArray(manifest.reviewCriteria)) throw new Error("Proof manifest requires reviewCriteria.");
  const sourceIds = new Set<string>();
  for (const source of manifest.sources) {
    if (!source.id || sourceIds.has(source.id)) throw new Error(`Duplicate or empty proof source id: ${source.id}`);
    sourceIds.add(source.id);
    if (!source.path || !Array.isArray(source.perspectives) || source.perspectives.length === 0) throw new Error(`Proof source ${source.id} requires path and perspectives.`);
    if (!["mermaid-flowchart", "postgres-schema", "typescript-workspace-snapshot"].includes(source.kind)) throw new Error(`Unsupported proof source kind: ${source.kind}`);
  }
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

async function writeCustomArtifact(directory: string, id: string, title: string, perspective: KnowledgePerspectiveKind, rendered: { svg: string; width: number; height: number; rasterSvg?: string }, counts: Record<string, number>, warnings: string[]): Promise<DiagramArtifact> {
  const svgFile = `${id}.svg`;
  const pngFile = `${id}@2x.png`;
  const rasterized = rasterizeSvg(rendered.rasterSvg ?? rendered.svg, rendered.rasterSvg ? { maximumDimension: 1_200, maximumArea: 1_200_000 } : {});
  if (rendered.rasterSvg) warnings.push(`${title} PNG uses a lightweight semantic overview with the same table positions and routes; the SVG retains every column on its full ${rendered.width} × ${rendered.height} canvas.`);
  if (rasterized.rasterScale < 1) warnings.push(`${title} exceeded safe raster bounds; the overview PNG is rendered at 2× and ${(rasterized.rasterScale * 100).toFixed(2)}% canvas scale.`);
  await Promise.all([writeFile(join(directory, svgFile), rendered.svg), writeFile(join(directory, pngFile), rasterized.png)]);
  if (rasterized.png.byteLength === 0) throw new Error(`PNG output was empty for ${id}.`);
  return { id, title, perspective, svgFile, pngFile, width: rendered.width, height: rendered.height, counts, warnings };
}

async function writeNativeArtifact(directory: string, id: string, title: string, perspective: KnowledgePerspectiveKind, rendered: RenderedDiagram, counts: Record<string, number>, warnings: string[]): Promise<DiagramArtifact> {
  const svgFile = `${id}.svg`;
  const pngFile = `${id}@2x.png`;
  await Promise.all([writeFile(join(directory, svgFile), rendered.svg), writeFile(join(directory, pngFile), rendered.png)]);
  if (rendered.png.byteLength === 0) throw new Error(`PNG output was empty for ${id}.`);
  return { id, title, perspective, svgFile, pngFile, width: rendered.width, height: rendered.height, counts, warnings };
}

async function writeModelFiles(directory: string, document: KnowledgeDocument): Promise<{ modelFile: string; diagnosticsFile: string }> {
  const violations = validateKnowledgeDocument(document);
  if (violations.length > 0) throw new Error(`Normalized knowledge model is invalid:\n${violations.map((violation) => `- ${violation}`).join("\n")}`);
  const modelFile = "model.json";
  const diagnosticsFile = "diagnostics.json";
  await Promise.all([
    writeFile(join(directory, modelFile), `${JSON.stringify(document, null, 2)}\n`),
    writeFile(join(directory, diagnosticsFile), `${JSON.stringify(document.diagnostics, null, 2)}\n`),
  ]);
  return { modelFile, diagnosticsFile };
}

async function generateMermaidSource(root: string, source: MermaidProofSource, outputRoot: string, fonts: EmbeddedFonts): Promise<SourceReport> {
  const path = await workspaceInput(root, source.path, "Mermaid source");
  const text = await readFile(path, "utf8");
  const model = parseMermaidFlowchart(text);
  const document = systemToKnowledgeDocument(source.id, source.title, model);
  document.sources[0].path = relative(root, path).split(sep).join("/");
  document.sources[0].contentHash = sha256(text);
  const directory = join(outputRoot, source.id);
  await mkdir(directory);
  const files = await writeModelFiles(directory, document);
  const counts = {
    groups: model.groups.length,
    nodes: model.nodes.length,
    orderedSteps: model.edges.filter(({ ordinal }) => ordinal !== undefined).length,
    supportingRelations: model.edges.filter(({ ordinal }) => ordinal === undefined).length,
    selfLoops: model.edges.filter((edge) => edge.sourceId === edge.targetId).length,
  };
  const artifacts: DiagramArtifact[] = [];
  for (const perspective of source.perspectives) {
    if (perspective === "native-mermaid") artifacts.push(await writeNativeArtifact(directory, "native-mermaid", "Native Mermaid", perspective, await renderNativeMermaid(text, fonts), counts, []));
    else if (perspective === "system-topology") artifacts.push(await writeCustomArtifact(directory, "thom-topology", "THOM topology", perspective, renderSystemTopology(model, source.title, fonts), counts, []));
    else if (perspective === "phased-process") artifacts.push(await writeCustomArtifact(directory, "thom-process", "THOM phased process", perspective, renderPhasedProcess(model, source.title, fonts), counts, []));
    else throw new Error(`Perspective ${perspective} is not valid for Mermaid flowcharts.`);
  }
  return { id: source.id, title: source.title, kind: source.kind, ...files, artifacts, counts, warnings: [] };
}

async function generateErdSource(root: string, source: ErdProofSource, outputRoot: string, fonts: EmbeddedFonts): Promise<SourceReport> {
  const path = await workspaceInput(root, source.path, "PostgreSQL schema source");
  const sql = await readFile(path, "utf8");
  const model = parsePostgresSchema(sql, source.schemas ?? ["public"]);
  const document = erdToKnowledgeDocument(source.id, source.title, model);
  document.sources[0].path = relative(root, path).split(sep).join("/");
  document.sources[0].contentHash = sha256(sql);
  const directory = join(outputRoot, source.id);
  await mkdir(directory);
  const files = await writeModelFiles(directory, document);
  const mermaid = createMermaidErd(model);
  await writeFile(join(directory, "baseline.mmd"), mermaid);
  const counts = { schemas: model.schemas.length, tables: model.tables.length, columns: model.tables.reduce((sum, table) => sum + table.columns.length, 0), foreignKeys: model.foreignKeys.length };
  const warnings = model.diagnostics.filter(({ severity }) => severity === "warning").map(({ message }) => message);
  const artifacts: DiagramArtifact[] = [];
  for (const perspective of source.perspectives) {
    if (perspective === "native-mermaid") {
      const rendered = await renderNativeMermaid(mermaid, fonts);
      if (rendered.rasterScale < 1) warnings.push(`Native Mermaid exceeded safe raster bounds; the PNG is a 2× overview at ${(rendered.rasterScale * 100).toFixed(2)}% scale while the SVG retains its full ${rendered.width} × ${rendered.height} canvas.`);
      artifacts.push(await writeNativeArtifact(directory, "native-mermaid-erd", "Generated Mermaid ERD", perspective, rendered, counts, warnings));
    }
    else if (perspective === "erd") artifacts.push(await writeCustomArtifact(directory, "thom-erd", "THOM ERD", perspective, renderErd(model, source.title, fonts), counts, warnings));
    else throw new Error(`Perspective ${perspective} is not valid for PostgreSQL schema sources.`);
  }
  return { id: source.id, title: source.title, kind: source.kind, ...files, artifacts, counts, warnings };
}

function isTypeScriptSnapshot(value: unknown): value is TypeScriptWorkspaceSnapshot {
  const snapshot = value as Partial<TypeScriptWorkspaceSnapshot> | undefined;
  return snapshot?.schemaVersion === 1 && snapshot.kind === "typescript-workspace" && Array.isArray(snapshot.packages) && Array.isArray(snapshot.symbols) && Boolean(snapshot.repository?.revision);
}

async function generateTypeScriptSource(root: string, source: TypeScriptProofSource, outputRoot: string, fonts: EmbeddedFonts): Promise<SourceReport> {
  const path = await workspaceInput(root, source.path, "TypeScript semantic snapshot");
  const parsed: unknown = JSON.parse(await readFile(path, "utf8"));
  if (!isTypeScriptSnapshot(parsed)) throw new Error("TypeScript snapshot has an unsupported shape or version.");
  const snapshot = parsed;
  const document = snapshotToKnowledgeDocument(snapshot);
  const directory = join(outputRoot, source.id);
  await mkdir(directory);
  const files = await writeModelFiles(directory, document);
  const counts = { packages: snapshot.packages.length, publicSymbols: snapshot.symbols.length, capabilities: new Set(snapshot.packages.map(({ capability }) => capability)).size };
  const artifacts: DiagramArtifact[] = [];
  let registerFile: string | undefined;
  const warnings: string[] = snapshot.diagnostics.filter(({ severity }) => severity !== "error").map(({ message }) => message);
  for (const perspective of source.perspectives) {
    if (perspective === "hierarchy") artifacts.push(await writeCustomArtifact(directory, "schema-hierarchy", "Schema hierarchy", perspective, renderSchemaHierarchy(snapshot, source.title, fonts), counts, warnings));
    else if (perspective === "dependency") artifacts.push(await writeCustomArtifact(directory, "package-dependencies", "Package dependencies", perspective, renderPackageDependencies(snapshot, source.title, fonts), counts, warnings));
    else if (perspective === "public-api") {
      artifacts.push(await writeCustomArtifact(directory, "public-api", "Public API overview", perspective, renderPublicApiOverview(snapshot, source.title, fonts), counts, warnings));
      registerFile = "public-api.html";
      await writeFile(join(directory, registerFile), createPublicApiHtml(snapshot));
    } else throw new Error(`Perspective ${perspective} is not valid for TypeScript workspace snapshots.`);
  }
  return { id: source.id, title: source.title, kind: source.kind, revision: snapshot.repository.revision, ...files, ...(registerFile ? { registerFile } : {}), artifacts, counts, warnings: [...new Set(warnings)] };
}

async function generateSource(root: string, source: ProofSource, outputRoot: string, fonts: EmbeddedFonts): Promise<SourceReport> {
  if (source.kind === "mermaid-flowchart") return generateMermaidSource(root, source, outputRoot, fonts);
  if (source.kind === "postgres-schema") return generateErdSource(root, source, outputRoot, fonts);
  return generateTypeScriptSource(root, source, outputRoot, fonts);
}

function boardHtml(manifest: ProofManifest, report: ProofReport, fonts: EmbeddedFonts): string {
  const navigation = report.sources.map((source) => `<a href="#${xml(source.id)}">${xml(source.title)}</a>`).join("");
  const sourceSections = report.sources.map((source) => {
    const metrics = Object.entries(source.counts).map(([label, value]) => `<span><strong>${value}</strong>${xml(label)}</span>`).join("");
    const artifacts = source.artifacts.map((artifact) => `<article class="artifact"><header><div><p>${xml(artifact.perspective)}</p><h3>${xml(artifact.title)}</h3></div><span>${artifact.width} × ${artifact.height}</span></header><a href="${xml(`${source.id}/${artifact.svgFile}`)}"><img src="${xml(`${source.id}/${artifact.svgFile}`)}" alt="${xml(artifact.title)}"></a><footer><a href="${xml(`${source.id}/${artifact.svgFile}`)}">SVG</a><a href="${xml(`${source.id}/${artifact.pngFile}`)}">2× PNG</a></footer></article>`).join("");
    const warnings = source.warnings.length > 0 ? `<details><summary>${source.warnings.length} qualifications</summary><ul>${source.warnings.map((warning) => `<li>${xml(warning)}</li>`).join("")}</ul></details>` : "";
    return `<section id="${xml(source.id)}"><div class="section-title"><div><p>${xml(source.kind)}</p><h2>${xml(source.title)}</h2>${source.revision ? `<code>${xml(source.revision)}</code>` : ""}</div><div class="metrics">${metrics}</div></div>${warnings}<div class="grid">${artifacts}</div><div class="evidence"><a href="${xml(`${source.id}/${source.modelFile}`)}">normalized model</a><a href="${xml(`${source.id}/${source.diagnosticsFile}`)}">diagnostics</a>${source.registerFile ? `<a href="${xml(`${source.id}/${source.registerFile}`)}">complete public API register</a>` : ""}</div></section>`;
  }).join("");
  const criteria = manifest.reviewCriteria.map((criterion, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span>${xml(criterion)}</li>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${xml(manifest.title)}</title><style>
  @font-face{font-family:Newsreader;src:url(data:font/woff2;base64,${fonts.newsreader}) format("woff2");font-weight:200 800}@font-face{font-family:Plex;src:url(data:font/woff2;base64,${fonts.plexMono}) format("woff2")}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:${knowledgeTheme.background};color:${knowledgeTheme.foreground};font-family:Plex,monospace}body:before{content:"";position:fixed;inset:0;pointer-events:none;background:radial-gradient(circle at 20% 0,color-mix(in srgb,${knowledgeTheme.primary} 9%,transparent),transparent 34%)}a{color:${knowledgeTheme.primary};text-decoration:none}nav{position:sticky;top:0;z-index:3;display:flex;gap:22px;padding:18px 4vw;background:color-mix(in srgb,${knowledgeTheme.background} 92%,transparent);border-bottom:1px solid ${knowledgeTheme.border};font-size:11px}main{max-width:1800px;margin:auto;padding:70px 4vw 140px}.hero{display:grid;grid-template-columns:1.5fr 1fr;gap:80px;padding-bottom:90px}.eyebrow,.section-title p,.artifact header p{color:${knowledgeTheme.primary};font-size:10px;text-transform:uppercase;letter-spacing:.12em}h1,h2,h3{font-family:Newsreader,serif;font-weight:420;margin:0}h1{font-size:clamp(48px,7vw,104px);line-height:.9;max-width:900px}h2{font-size:48px}h3{font-size:27px}.hero>div>p:not(.eyebrow){max-width:700px;color:${knowledgeTheme.foregroundMuted};line-height:1.7}.criteria{list-style:none;padding:0;margin:0}.criteria li{padding:14px 0;border-bottom:1px solid ${knowledgeTheme.border};text-transform:capitalize}.criteria span{color:${knowledgeTheme.foregroundMuted};margin-right:18px}section{padding:82px 0;border-top:1px solid ${knowledgeTheme.border}}.section-title{display:flex;justify-content:space-between;gap:40px;align-items:flex-end;margin-bottom:36px}.section-title code{display:block;color:${knowledgeTheme.foregroundMuted};font-size:10px;margin-top:12px}.metrics{display:flex;gap:18px;flex-wrap:wrap;justify-content:flex-end}.metrics span{display:grid;gap:5px;min-width:90px;color:${knowledgeTheme.foregroundMuted};font-size:9px}.metrics strong{color:${knowledgeTheme.foreground};font:32px Newsreader,serif}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,620px),1fr));gap:28px}.artifact{background:${knowledgeTheme.surface};border:1px solid ${knowledgeTheme.border};border-radius:18px;overflow:hidden}.artifact header{display:flex;justify-content:space-between;align-items:end;padding:20px 24px;border-bottom:1px solid ${knowledgeTheme.border}}.artifact header span{font-size:9px;color:${knowledgeTheme.foregroundMuted}}.artifact img{display:block;width:100%;height:clamp(420px,48vw,760px);object-fit:contain;background:${knowledgeTheme.background}}.artifact footer,.evidence{display:flex;gap:20px;padding:14px 24px;border-top:1px solid ${knowledgeTheme.border};font-size:10px}.evidence{padding:24px 0;border-top:0}details{margin:0 0 28px;color:${knowledgeTheme.foregroundMuted};font-size:11px}details li{margin:8px 0}@media(max-width:800px){.hero{grid-template-columns:1fr}.section-title{display:block}.metrics{justify-content:flex-start;margin-top:26px}}
  </style></head><body><nav>${navigation}<a href="report.json">report.json</a></nav><main><header class="hero"><div><p class="eyebrow">First knowledge-representation proof</p><h1>${xml(manifest.title)}</h1><p>${xml(manifest.description ?? "One semantic source, several organization rules, reviewable against native rendering.")}</p></div><ol class="criteria">${criteria}</ol></header>${sourceSections}</main></body></html>`;
}

async function replaceDirectoryAtomically(temporary: string, output: string): Promise<void> {
  const backup = `${output}.previous-${process.pid}`;
  let hadOutput = false;
  try {
    await rename(output, backup);
    hadOutput = true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  try {
    await rename(temporary, output);
    if (hadOutput) await rm(backup, { recursive: true, force: true });
  } catch (error) {
    if (hadOutput) await rename(backup, output);
    throw error;
  }
}

export async function generateKnowledgeProof(options: GenerateKnowledgeProofOptions): Promise<GeneratedKnowledgeProof> {
  const root = await realpath(resolve(options.workspaceRoot));
  const manifestPath = await workspaceInput(root, options.manifest, "Manifest");
  const parsed: unknown = JSON.parse(await readFile(manifestPath, "utf8"));
  validateManifest(parsed);
  const manifest = parsed;
  const output = resolve(root, options.output);
  assertInside(root, output, "Output");
  if (output === root || extname(output)) throw new Error("Output must be a workspace directory path without a file extension.");
  await mkdir(dirname(output), { recursive: true });
  assertInside(root, await realpath(dirname(output)), "Output");
  const temporary = await mkdtemp(join(dirname(output), `.${basename(output)}-knowledge-`));
  const fonts = await loadEmbeddedFonts();
  try {
    const sources: SourceReport[] = [];
    for (const source of manifest.sources) sources.push(await generateSource(root, source, temporary, fonts));
    const report: ProofReport = { schemaVersion: 1, proofId: manifest.id, title: manifest.title, sources, reviewCriteria: manifest.reviewCriteria };
    await Promise.all([
      writeFile(join(temporary, "report.json"), `${JSON.stringify(report, null, 2)}\n`),
      writeFile(join(temporary, "index.html"), boardHtml(manifest, report, fonts)),
    ]);
    await replaceDirectoryAtomically(temporary, output);
    return { outputDirectory: output, reportPath: join(output, "report.json"), boardPath: join(output, "index.html"), report };
  } catch (error) {
    await rm(temporary, { recursive: true, force: true });
    throw error;
  }
}
