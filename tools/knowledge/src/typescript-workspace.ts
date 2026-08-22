import type { KnowledgeDocument } from "@th-m/knowledge-model";
import { svgShell, tspans, wrapText, xml, type EmbeddedFonts } from "./rendering.ts";
import { knowledgeTheme } from "./theme.ts";
import type { TypeScriptSymbolSnapshot, TypeScriptWorkspaceSnapshot } from "./types.ts";

export function snapshotToKnowledgeDocument(snapshot: TypeScriptWorkspaceSnapshot): KnowledgeDocument {
  const capabilities = [...new Set(snapshot.packages.map(({ capability }) => capability))].sort();
  return {
    schemaVersion: 1,
    id: snapshot.id,
    title: snapshot.title,
    sources: [{
      id: `${snapshot.id}-source`,
      kind: "typescript-workspace",
      label: snapshot.title,
      repository: snapshot.repository.identity,
      revision: snapshot.repository.revision,
      contentHash: snapshot.contentHash,
      compilerVersion: snapshot.compilerVersion,
    }],
    entities: [
      ...snapshot.packages.map((package_) => ({ id: package_.id, kind: "package" as const, name: package_.name, properties: { capability: package_.capability, exportCount: package_.exports.length } })),
      ...snapshot.symbols.map((symbol) => ({ id: symbol.id, kind: "exported-symbol" as const, name: symbol.name, parentId: symbol.packageId, properties: { kind: symbol.kind, display: symbol.display, deprecated: symbol.deprecated }, provenance: [{ sourceId: `${snapshot.id}-source`, repository: snapshot.repository.identity, revision: snapshot.repository.revision, path: symbol.sourcePath, span: { start: 0, end: 0, line: symbol.line, column: symbol.column } }] })),
    ],
    groups: capabilities.map((capability) => ({ id: `capability-${capability}`, name: capability, entityIds: snapshot.packages.filter((package_) => package_.capability === capability).map(({ id }) => id) })),
    relations: [
      ...snapshot.packages.flatMap((package_) => package_.dependencies.map((dependency, index) => ({ id: `package-dependency-${package_.id}-${index}`, kind: "dependency" as const, sourceId: package_.id, targetId: dependency, presentation: { direction: "forward" as const, layoutInfluence: "primary" as const, style: "solid" as const } }))),
      ...snapshot.symbols.flatMap((symbol) => symbol.references.flatMap((reference, index) => {
        const target = snapshot.symbols.find((candidate) => candidate.name === reference);
        return target ? [{ id: `type-reference-${symbol.id}-${index}`, kind: "type-reference" as const, sourceId: symbol.id, targetId: target.id, presentation: { direction: "forward" as const, layoutInfluence: "secondary" as const, style: "dotted" as const } }] : [];
      })),
    ],
    perspectives: [
      { id: "hierarchy", kind: "hierarchy", title: "Schema package hierarchy" },
      { id: "dependency", kind: "dependency", title: "Public package dependencies" },
      { id: "public-api", kind: "public-api", title: "Public API register" },
    ],
    diagnostics: snapshot.diagnostics,
  };
}

function packageLabel(packageName: string): string {
  return packageName.replace(/^@[^/]+\/schema\//, "");
}

export function renderSchemaHierarchy(snapshot: TypeScriptWorkspaceSnapshot, title: string, fonts: EmbeddedFonts): { svg: string; width: number; height: number } {
  const capabilities = [...new Set(snapshot.packages.map(({ capability }) => capability))].sort();
  const columnCount = Math.min(3, Math.max(1, capabilities.length));
  const laneWidth = 490;
  const rows = Math.ceil(capabilities.length / columnCount);
  const rowHeights = Array.from({ length: rows }, (_, row) => Math.max(...capabilities.slice(row * columnCount, (row + 1) * columnCount).map((capability) => snapshot.packages.filter((package_) => package_.capability === capability).length * 92 + 94), 250));
  const width = 100 + columnCount * laneWidth;
  const height = 175 + rowHeights.reduce((sum, value) => sum + value + 38, 0);
  let rowTop = 132;
  const markup: string[] = [];
  for (let row = 0; row < rows; row += 1) {
    const rowCapabilities = capabilities.slice(row * columnCount, (row + 1) * columnCount);
    rowCapabilities.forEach((capability, column) => {
      const packages = snapshot.packages.filter((package_) => package_.capability === capability).sort((left, right) => left.name.localeCompare(right.name));
      const x = 54 + column * laneWidth;
      const laneHeight = rowHeights[row];
      markup.push(`<rect x="${x}" y="${rowTop}" width="450" height="${laneHeight}" rx="20" fill="${knowledgeTheme.surface}" stroke="${knowledgeTheme.border}"/><text x="${x + 22}" y="${rowTop + 29}" font-size="10" fill="${knowledgeTheme.foregroundMuted}">CAPABILITY</text><text class="display" x="${x + 22}" y="${rowTop + 58}" font-size="27">${xml(capability)}</text>`);
      packages.forEach((package_, index) => {
        const y = rowTop + 76 + index * 92;
        markup.push(`<rect x="${x + 20}" y="${y}" width="410" height="72" rx="12" fill="${knowledgeTheme.surfaceRaised}" stroke="${knowledgeTheme.borderStrong}"/><text x="${x + 36}" y="${y + 29}" font-size="13">${xml(packageLabel(package_.name))}</text><text x="${x + 36}" y="${y + 51}" font-size="10" fill="${knowledgeTheme.foregroundMuted}">${package_.exports.length} public exports · ${package_.dependencies.length} schema dependencies</text>`);
      });
    });
    rowTop += rowHeights[row] + 38;
  }
  const content = `<text class="display" x="54" y="58" font-size="38">${xml(title)}</text><text x="${width - 54}" y="56" text-anchor="end" font-size="12" fill="${knowledgeTheme.foregroundMuted}">DOMAIN → CAPABILITY → LEAF PACKAGE</text><text x="54" y="110" font-size="11" fill="${knowledgeTheme.primary}">${snapshot.packages.length} LEAF PACKAGES · ${snapshot.symbols.length} PUBLIC SYMBOLS · ${snapshot.repository.revision.slice(0, 12)}</text>${markup.join("")}`;
  return { svg: svgShell({ title: `${title} — hierarchy`, description: "Top-to-bottom hierarchy from the schema domain through capabilities to independently packaged leaf projects.", width, height, fonts, content }), width, height };
}

function dependencyRanks(snapshot: TypeScriptWorkspaceSnapshot): Map<string, number> {
  const ranks = new Map(snapshot.packages.map((package_) => [package_.id, 0]));
  for (let pass = 0; pass < snapshot.packages.length; pass += 1) {
    for (const package_ of snapshot.packages) {
      for (const dependency of package_.dependencies) ranks.set(package_.id, Math.max(ranks.get(package_.id) ?? 0, (ranks.get(dependency) ?? 0) + 1));
    }
  }
  return ranks;
}

export function renderPackageDependencies(snapshot: TypeScriptWorkspaceSnapshot, title: string, fonts: EmbeddedFonts): { svg: string; width: number; height: number } {
  const ranks = dependencyRanks(snapshot);
  const byRank = new Map<number, TypeScriptWorkspaceSnapshot["packages"]>();
  for (const package_ of snapshot.packages) {
    const rank = ranks.get(package_.id) ?? 0;
    byRank.set(rank, [...(byRank.get(rank) ?? []), package_]);
  }
  const maximumRank = Math.max(0, ...byRank.keys());
  const maximumInRank = Math.max(1, ...[...byRank.values()].map((packages) => packages.length));
  const width = Math.max(1120, 120 + (maximumRank + 1) * 420);
  const height = Math.max(680, 180 + maximumInRank * 112);
  const positions = new Map<string, { x: number; y: number; width: number; height: number }>();
  for (const [rank, packages] of byRank) packages.sort((left, right) => left.name.localeCompare(right.name)).forEach((package_, index) => positions.set(package_.id, { x: 60 + (maximumRank - rank) * 420, y: 140 + index * 112, width: 340, height: 76 }));
  const edges = snapshot.packages.flatMap((package_) => package_.dependencies.map((dependency, index) => {
    const source = positions.get(package_.id)!;
    const target = positions.get(dependency);
    if (!target) return "";
    const sx = source.x;
    const sy = source.y + source.height / 2;
    const tx = target.x + target.width;
    const ty = target.y + target.height / 2;
    const mid = (sx + tx) / 2 + (index % 3) * 8;
    return `<path d="M${sx} ${sy} H${mid} V${ty} H${tx}" fill="none" stroke="${knowledgeTheme.primary}" stroke-width="1.6" marker-end="url(#arrow)"/>`;
  })).join("");
  const nodes = snapshot.packages.map((package_) => {
    const position = positions.get(package_.id)!;
    return `<g><rect x="${position.x}" y="${position.y}" width="${position.width}" height="${position.height}" rx="14" fill="${knowledgeTheme.surfaceRaised}" stroke="${knowledgeTheme.borderStrong}"/><text x="${position.x + 16}" y="${position.y + 30}" font-size="13">${xml(packageLabel(package_.name))}</text><text x="${position.x + 16}" y="${position.y + 54}" font-size="10" fill="${knowledgeTheme.foregroundMuted}">${package_.exports.length} exports · ${package_.capability}</text></g>`;
  }).join("");
  const content = `<text class="display" x="54" y="58" font-size="38">${xml(title)}</text><text x="${width - 54}" y="56" text-anchor="end" font-size="12" fill="${knowledgeTheme.foregroundMuted}">DEPENDENCIES LEFT → FOUNDATIONS RIGHT · PUBLIC LEAF PROJECTS ONLY</text>${edges}${nodes}`;
  return { svg: svgShell({ title: `${title} — dependencies`, description: "Public leaf package dependencies ranked left to right.", width, height, fonts, content }), width, height };
}

export function renderPublicApiOverview(snapshot: TypeScriptWorkspaceSnapshot, title: string, fonts: EmbeddedFonts): { svg: string; width: number; height: number } {
  const width = 1480;
  const columns = 3;
  const rows = Math.ceil(snapshot.packages.length / columns);
  const height = 145 + rows * 142;
  const cards = [...snapshot.packages].sort((left, right) => left.name.localeCompare(right.name)).map((package_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = 54 + column * 474;
    const y = 124 + row * 142;
    const kinds = new Map<string, number>();
    for (const symbol of snapshot.symbols.filter(({ packageId }) => packageId === package_.id)) kinds.set(symbol.kind, (kinds.get(symbol.kind) ?? 0) + 1);
    const detail = [...kinds].sort(([left], [right]) => left.localeCompare(right)).map(([kind, count]) => `${kind} ${count}`).join(" · ");
    return `<g><rect x="${x}" y="${y}" width="438" height="112" rx="16" fill="${knowledgeTheme.surface}" stroke="${knowledgeTheme.border}"/><text x="${x + 18}" y="${y + 30}" font-size="12" fill="${knowledgeTheme.primary}">${xml(packageLabel(package_.name))}</text><text class="display" x="${x + 18}" y="${y + 68}" font-size="34">${package_.exports.length}</text><text x="${x + 82}" y="${y + 62}" font-size="10" fill="${knowledgeTheme.foregroundMuted}">PUBLIC EXPORTS</text><text x="${x + 18}" y="${y + 92}" font-size="9" fill="${knowledgeTheme.foregroundMuted}">${xml(detail || "re-exported runtime values")}</text></g>`;
  }).join("");
  const content = `<text class="display" x="54" y="58" font-size="38">${xml(title)}</text><text x="${width - 54}" y="56" text-anchor="end" font-size="12" fill="${knowledgeTheme.foregroundMuted}">PUBLIC API REGISTER · COMPLETE PROVENANCE IN HTML</text>${cards}`;
  return { svg: svgShell({ title: `${title} — public API`, description: "Summary register of public exports by leaf package.", width, height, fonts, content }), width, height };
}

export function createPublicApiHtml(snapshot: TypeScriptWorkspaceSnapshot): string {
  const rows = snapshot.symbols.map((symbol) => `<tr><td>${xml(packageLabel(symbol.packageId))}</td><td>${xml(symbol.name)}</td><td>${xml(symbol.kind)}</td><td><code>${xml(symbol.sourcePath)}:${symbol.line}</code></td><td>${symbol.deprecated ? "deprecated" : ""}</td></tr>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${xml(snapshot.title)} public API</title><style>body{background:${knowledgeTheme.background};color:${knowledgeTheme.foreground};font:13px ui-monospace,monospace;margin:32px}table{border-collapse:collapse;width:100%}th,td{padding:10px;border-bottom:1px solid ${knowledgeTheme.border};text-align:left}th{color:${knowledgeTheme.primary};position:sticky;top:0;background:${knowledgeTheme.background}}code{color:${knowledgeTheme.foregroundMuted}}</style></head><body><h1>${xml(snapshot.title)} public API</h1><p>${snapshot.symbols.length} exports at <code>${xml(snapshot.repository.revision)}</code></p><table><thead><tr><th>Package</th><th>Symbol</th><th>Kind</th><th>Provenance</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
}
