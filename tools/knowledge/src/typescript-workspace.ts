import type { KnowledgeDocument, TypeRelation, TypeSetSymbol } from "@th-m/knowledge-model";
import { svgShell, tspans, wrapText, xml, type EmbeddedFonts } from "./rendering.ts";
import type { SetProjection, TypeScriptSymbolSnapshot, TypeScriptWorkspaceSnapshot } from "./types.ts";

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
      { id: "set-atlas", kind: "set-atlas", title: "Focused Songs set atlas" },
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
      markup.push(`<rect x="${x}" y="${rowTop}" width="450" height="${laneHeight}" rx="20" fill="#0c0b09" stroke="#554936"/><text x="${x + 22}" y="${rowTop + 29}" font-size="10" fill="#a99b87">CAPABILITY</text><text class="display" x="${x + 22}" y="${rowTop + 58}" font-size="27">${xml(capability)}</text>`);
      packages.forEach((package_, index) => {
        const y = rowTop + 76 + index * 92;
        markup.push(`<rect x="${x + 20}" y="${y}" width="410" height="72" rx="12" fill="#15120d" stroke="#6d5a3b"/><text x="${x + 36}" y="${y + 29}" font-size="13">${xml(packageLabel(package_.name))}</text><text x="${x + 36}" y="${y + 51}" font-size="10" fill="#a99b87">${package_.exports.length} public exports · ${package_.dependencies.length} schema dependencies</text>`);
      });
    });
    rowTop += rowHeights[row] + 38;
  }
  const content = `<text class="display" x="54" y="58" font-size="38">${xml(title)}</text><text x="${width - 54}" y="56" text-anchor="end" font-size="12" fill="#a99b87">DOMAIN → CAPABILITY → LEAF PACKAGE</text><text x="54" y="110" font-size="11" fill="#d6b06a">${snapshot.packages.length} LEAF PACKAGES · ${snapshot.symbols.length} PUBLIC SYMBOLS · ${snapshot.repository.revision.slice(0, 12)}</text>${markup.join("")}`;
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
    return `<path d="M${sx} ${sy} H${mid} V${ty} H${tx}" fill="none" stroke="#d6b06a" stroke-width="1.6" marker-end="url(#arrow)"/>`;
  })).join("");
  const nodes = snapshot.packages.map((package_) => {
    const position = positions.get(package_.id)!;
    return `<g><rect x="${position.x}" y="${position.y}" width="${position.width}" height="${position.height}" rx="14" fill="#15120d" stroke="#6d5a3b"/><text x="${position.x + 16}" y="${position.y + 30}" font-size="13">${xml(packageLabel(package_.name))}</text><text x="${position.x + 16}" y="${position.y + 54}" font-size="10" fill="#a99b87">${package_.exports.length} exports · ${package_.capability}</text></g>`;
  }).join("");
  const content = `<text class="display" x="54" y="58" font-size="38">${xml(title)}</text><text x="${width - 54}" y="56" text-anchor="end" font-size="12" fill="#a99b87">DEPENDENCIES LEFT → FOUNDATIONS RIGHT · PUBLIC LEAF PROJECTS ONLY</text>${edges}${nodes}`;
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
    return `<g><rect x="${x}" y="${y}" width="438" height="112" rx="16" fill="#0c0b09" stroke="#554936"/><text x="${x + 18}" y="${y + 30}" font-size="12" fill="#d6b06a">${xml(packageLabel(package_.name))}</text><text class="display" x="${x + 18}" y="${y + 68}" font-size="34">${package_.exports.length}</text><text x="${x + 82}" y="${y + 62}" font-size="10" fill="#a99b87">PUBLIC EXPORTS</text><text x="${x + 18}" y="${y + 92}" font-size="9" fill="#a99b87">${xml(detail || "re-exported runtime values")}</text></g>`;
  }).join("");
  const content = `<text class="display" x="54" y="58" font-size="38">${xml(title)}</text><text x="${width - 54}" y="56" text-anchor="end" font-size="12" fill="#a99b87">PUBLIC API REGISTER · COMPLETE PROVENANCE IN HTML</text>${cards}`;
  return { svg: svgShell({ title: `${title} — public API`, description: "Summary register of public exports by leaf package.", width, height, fonts, content }), width, height };
}

export function createPublicApiHtml(snapshot: TypeScriptWorkspaceSnapshot): string {
  const rows = snapshot.symbols.map((symbol) => `<tr><td>${xml(packageLabel(symbol.packageId))}</td><td>${xml(symbol.name)}</td><td>${xml(symbol.kind)}</td><td><code>${xml(symbol.sourcePath)}:${symbol.line}</code></td><td>${symbol.deprecated ? "deprecated" : ""}</td></tr>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${xml(snapshot.title)} public API</title><style>body{background:#050505;color:#f2e5cf;font:13px ui-monospace,monospace;margin:32px}table{border-collapse:collapse;width:100%}th,td{padding:10px;border-bottom:1px solid #30291f;text-align:left}th{color:#d6b06a;position:sticky;top:0;background:#050505}code{color:#a99b87}</style></head><body><h1>${xml(snapshot.title)} public API</h1><p>${snapshot.symbols.length} exports at <code>${xml(snapshot.repository.revision)}</code></p><table><thead><tr><th>Package</th><th>Symbol</th><th>Kind</th><th>Provenance</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
}

function selectedSymbols(snapshot: TypeScriptWorkspaceSnapshot, names: string[]): TypeScriptSymbolSnapshot[] {
  if (names.length > 24) throw new Error(`Set analysis accepts at most 24 symbols; received ${names.length}.`);
  const selected: TypeScriptSymbolSnapshot[] = [];
  for (const name of names) {
    const matches = snapshot.symbols.filter((symbol) => symbol.name === name);
    if (matches.length === 0) throw new Error(`Selected TypeScript symbol was not found in the snapshot: ${name}`);
    if (matches.length > 1) throw new Error(`Selected TypeScript symbol is ambiguous; qualify it in a future manifest revision: ${name}`);
    selected.push(matches[0]);
  }
  return selected;
}

export function createSetProjection(snapshot: TypeScriptWorkspaceSnapshot, names: string[]): SetProjection {
  const selected = selectedSymbols(snapshot, names);
  const byName = new Map(selected.map((symbol) => [symbol.name, symbol]));
  const symbols: TypeSetSymbol[] = selected.map((symbol) => ({
    id: symbol.id,
    name: symbol.name,
    kind: symbol.kind === "interface" || symbol.kind === "class" || symbol.kind === "enum" ? symbol.kind : "alias",
    display: symbol.display,
    status: "region",
    typeFlags: 0,
    sourceSpan: { start: 0, end: 0, line: symbol.line, column: symbol.column },
    atomIds: [],
  }));
  const relations: TypeRelation[] = [];
  const relationKeys = new Set<string>();
  const add = (source: TypeScriptSymbolSnapshot, targetName: string, kind: TypeRelation["kind"], confidence: TypeRelation["confidence"], reason: string): void => {
    const target = byName.get(targetName);
    if (!target || target.id === source.id) return;
    const unordered = kind === "equivalent" || kind === "overlap" || kind === "disjoint";
    const endpoints = unordered ? [source.id, target.id].sort() : [source.id, target.id];
    const key = `${kind}:${endpoints.join(":")}`;
    if (relationKeys.has(key)) return;
    relationKeys.add(key);
    relations.push({ sourceId: source.id, targetId: target.id, kind, confidence, reason });
  };
  for (const symbol of selected) {
    if (symbol.aliasTarget) add(symbol, symbol.aliasTarget, "equivalent", "compiler-proven", "Public compatibility alias targets the same declared type.");
    for (const parent of symbol.extends) add(symbol, parent, "proper-subset", "derived", "Interface or class inheritance is structural containment in TypeScript.");
    for (const member of symbol.intersectionMembers) add(symbol, member, "proper-subset", "approximate", "Intersection values must satisfy the selected member.");
  }
  for (const symbol of selected.filter(({ unionMembers }) => unionMembers.length > 0)) {
    for (const candidateName of symbol.unionMembers) {
      const candidate = byName.get(candidateName);
      if (!candidate) continue;
      const everyMemberContained = symbol.unionMembers.every((memberName) => memberName === candidateName || relations.some((relation) => relation.kind === "proper-subset" && byName.get(memberName)?.id === relation.sourceId && candidate.id === relation.targetId));
      if (everyMemberContained) add(symbol, candidateName, "equivalent", "approximate", "Every selected union member is assignable to the broader member; the union collapses structurally.");
    }
  }
  const warnings = selected.some((symbol) => symbol.kind === "interface" || /\{/.test(symbol.display)) ? ["Open structural TypeScript object types are approximated as closed visual regions; excess properties and compiler configuration can change mathematical interpretation."] : [];
  return { symbols, relations: relations.sort((left, right) => `${left.kind}:${left.sourceId}:${left.targetId}`.localeCompare(`${right.kind}:${right.sourceId}:${right.targetId}`)), warnings };
}

class DisjointSets {
  private readonly parent = new Map<string, string>();
  constructor(ids: string[]) { for (const id of ids) this.parent.set(id, id); }
  find(id: string): string { const parent = this.parent.get(id) ?? id; if (parent === id) return id; const root = this.find(parent); this.parent.set(id, root); return root; }
  union(left: string, right: string): void { const a = this.find(left); const b = this.find(right); if (a !== b) this.parent.set([a, b].sort()[1], [a, b].sort()[0]); }
}

export function renderSetProjection(projection: SetProjection, title: string, fonts: EmbeddedFonts): { svg: string; width: number; height: number } {
  const sets = new DisjointSets(projection.symbols.map(({ id }) => id));
  for (const relation of projection.relations) if (relation.kind === "equivalent") sets.union(relation.sourceId, relation.targetId);
  const members = new Map<string, TypeSetSymbol[]>();
  for (const symbol of projection.symbols) {
    const root = sets.find(symbol.id);
    members.set(root, [...(members.get(root) ?? []), symbol]);
  }
  const groups = [...members].map(([id, symbols]) => ({ id, symbols: symbols.sort((left, right) => left.name.localeCompare(right.name)) }));
  const groupFor = (symbolId: string): string => sets.find(symbolId);
  const parentByGroup = new Map<string, string>();
  for (const relation of projection.relations.filter(({ kind }) => kind === "proper-subset")) {
    const child = groupFor(relation.sourceId);
    const parent = groupFor(relation.targetId);
    if (child !== parent) parentByGroup.set(child, parent);
  }
  const roots = groups.filter(({ id }) => !parentByGroup.has(id)).sort((left, right) => left.id.localeCompare(right.id));
  const width = Math.max(1280, 80 + roots.length * 310);
  const warningHeight = projection.warnings.length * 54;
  const height = 610 + warningHeight;
  const markup = roots.map((root, index) => {
    const x = 200 + index * 310;
    const y = 330;
    const children = groups.filter((group) => parentByGroup.get(group.id) === root.id);
    const rootLabel = root.symbols.map(({ name }) => name).join(" ≡ ");
    const childMarkup = children.map((child, childIndex) => {
      const cx = x + (childIndex - (children.length - 1) / 2) * 90;
      const cy = y + 18;
      return `<ellipse cx="${cx}" cy="${cy}" rx="104" ry="68" fill="#211a10" fill-opacity=".88" stroke="#d6b06a"/><text x="${cx}" y="${cy - 3}" text-anchor="middle" font-size="11">${tspans(wrapText(child.symbols.map(({ name }) => name).join(" ≡ "), 22, 2), cx, cy - 3, 17)}</text>`;
    }).join("");
    return `<g><ellipse cx="${x}" cy="${y}" rx="142" ry="122" fill="#15120d" stroke="#6d5a3b" stroke-width="2"/><text x="${x}" y="${y - 75}" text-anchor="middle" font-size="12" fill="#d6b06a">${tspans(wrapText(rootLabel, 25, 2), x, y - 75, 17)}</text>${childMarkup}</g>`;
  }).join("");
  const warnings = projection.warnings.map((warning, index) => `<g><rect x="54" y="${566 + index * 54}" width="${width - 108}" height="42" rx="10" fill="#15120d" stroke="#554936"/><text x="70" y="${592 + index * 54}" font-size="10" fill="#a99b87">APPROXIMATION · ${xml(warning)}</text></g>`).join("");
  const content = `<text class="display" x="54" y="58" font-size="38">${xml(title)}</text><text x="${width - 54}" y="56" text-anchor="end" font-size="12" fill="#a99b87">FOCUSED SET / EULER ATLAS · EQUIVALENCE MERGED · CONTAINMENT NESTED</text><text x="54" y="112" font-size="11" fill="#d6b06a">${projection.symbols.length} SELECTED SYMBOLS · ${projection.relations.length} EXPLICIT RELATIONS</text>${markup}${warnings}`;
  return { svg: svgShell({ title: `${title} — set atlas`, description: "Focused TypeScript set atlas merging equivalent types and nesting structural containment.", width, height, fonts, content }), width, height };
}
