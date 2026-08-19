import { Parser, type Database } from "@dbml/core";
import type { KnowledgeDocument } from "@th-m/knowledge-model";
import { svgShell, tspans, wrapText, xml, type EmbeddedFonts } from "./rendering.ts";
import { knowledgeTheme } from "./theme.ts";

export interface ErdColumn {
  id: string;
  schema: string;
  table: string;
  name: string;
  type: string;
  nullable: boolean;
  primary: boolean;
  unique: boolean;
}

export interface ErdTable {
  id: string;
  schema: string;
  name: string;
  columns: ErdColumn[];
}

export interface ErdForeignKey {
  id: string;
  name: string;
  dependentTableId: string;
  dependentColumnIds: string[];
  referencedTableId: string;
  referencedColumnIds: string[];
}

export interface ErdModel {
  schemas: string[];
  tables: ErdTable[];
  foreignKeys: ErdForeignKey[];
  diagnostics: Array<{
    code: string;
    severity: "warning" | "info";
    message: string;
  }>;
}

const stableId = (...parts: string[]): string => parts.map((part) => part.replace(/[^A-Za-z0-9_-]+/g, "-").replace(/^-|-$/g, "").toLowerCase()).join("--");

const SQL_IDENTIFIER = String.raw`(?:"(?:[^"]|"")*"|[A-Za-z_][A-Za-z0-9_$]*)`;

function identifier(value: string): string {
  return value.startsWith('"') ? value.slice(1, -1).replaceAll('""', '"') : value;
}

function quoteIdentifier(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

interface PreparedPostgresSql {
  sql: string;
  ignoredTriggerCount: number;
  externalStubTables: Set<string>;
}

/**
 * Reduce pg_dump constructs that do not affect an ERD before handing the text
 * to @dbml/core. Parser-only table stubs satisfy references to omitted schemas
 * such as auth.users and are excluded from the normalized model below.
 */
function preparePostgresForDbml(sql: string): PreparedPostgresSql {
  const triggerPattern = /^\s*CREATE OR REPLACE TRIGGER\b.*?;\s*$/gim;
  const ignoredTriggerCount = [...sql.matchAll(triggerPattern)].length;
  const withoutTriggers = sql.replace(triggerPattern, "");
  const definedTables = new Set<string>();
  const createTablePattern = new RegExp(String.raw`\bCREATE\s+(?:UNLOGGED\s+)?TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(${SQL_IDENTIFIER})(?:\s*\.\s*(${SQL_IDENTIFIER}))?`, "gi");
  for (const match of withoutTriggers.matchAll(createTablePattern)) {
    const schema = match[2] ? identifier(match[1]) : "public";
    const table = identifier(match[2] ?? match[1]);
    definedTables.add(`${schema}.${table}`);
  }

  const missingColumns = new Map<string, Set<string>>();
  const referencePattern = new RegExp(String.raw`\bREFERENCES\s+(${SQL_IDENTIFIER})(?:\s*\.\s*(${SQL_IDENTIFIER}))?\s*\(([^)]*)\)`, "gi");
  for (const match of withoutTriggers.matchAll(referencePattern)) {
    const schema = match[2] ? identifier(match[1]) : "public";
    const table = identifier(match[2] ?? match[1]);
    const qualifiedName = `${schema}.${table}`;
    if (definedTables.has(qualifiedName)) continue;
    const columns = missingColumns.get(qualifiedName) ?? new Set<string>();
    for (const column of match[3].match(new RegExp(SQL_IDENTIFIER, "g")) ?? []) columns.add(identifier(column));
    missingColumns.set(qualifiedName, columns);
  }

  const stubs = [...missingColumns].sort(([left], [right]) => left.localeCompare(right)).map(([qualifiedName, columns]) => {
    const separator = qualifiedName.indexOf(".");
    const schema = qualifiedName.slice(0, separator);
    const table = qualifiedName.slice(separator + 1);
    const fields = [...columns].sort().map((column) => `${quoteIdentifier(column)} text`).join(", ");
    return `CREATE SCHEMA IF NOT EXISTS ${quoteIdentifier(schema)};\nCREATE TABLE IF NOT EXISTS ${quoteIdentifier(schema)}.${quoteIdentifier(table)} (${fields || '"id" text'});`;
  });
  return {
    sql: stubs.length > 0 ? `${stubs.join("\n")}\n${withoutTriggers}` : withoutTriggers,
    ignoredTriggerCount,
    externalStubTables: new Set(missingColumns.keys()),
  };
}

function dbmlErrorMessage(error: unknown): string {
  const diagnostics = (error as { diags?: Array<{ text?: string; message?: string; location?: { start?: { line?: number; column?: number } } }> } | undefined)?.diags;
  if (diagnostics?.length) {
    return diagnostics.slice(0, 4).map((diagnostic) => {
      const location = diagnostic.location?.start;
      const suffix = location?.line ? ` at line ${location.line}${location.column !== undefined ? `:${location.column}` : ""}` : "";
      return `${diagnostic.text ?? diagnostic.message ?? "Unknown parser diagnostic"}${suffix}`;
    }).join("; ");
  }
  return error instanceof Error ? error.message : String(error);
}

export function parsePostgresSchema(sql: string, selectedSchemas: string[] = ["public"]): ErdModel {
  const prepared = preparePostgresForDbml(sql);
  let database: Database;
  try {
    database = Parser.parse(prepared.sql, "postgres");
  } catch (error) {
    throw new Error(`PostgreSQL schema could not be parsed: ${dbmlErrorMessage(error)}`);
  }
  const selected = new Set(selectedSchemas.length > 0 ? selectedSchemas : ["public"]);
  const schemas = database.schemas.filter((schema) => selected.has(schema.name));
  if (schemas.length === 0) throw new Error(`No selected schemas were found: ${[...selected].join(", ")}`);
  const tables: ErdTable[] = [];
  const tableByQualifiedName = new Map<string, ErdTable>();
  for (const schema of schemas) {
    for (const table of schema.tables) {
      if (prepared.externalStubTables.has(`${schema.name}.${table.name}`)) continue;
      const primaryIndexColumns = new Set(table.indexes.filter((index) => index.pk).flatMap((index) => index.columns.filter((column) => column.type === "column").map((column) => String(column.value))));
      const uniqueIndexColumns = new Set(table.indexes.filter((index) => index.unique && index.columns.length === 1).flatMap((index) => index.columns.filter((column) => column.type === "column").map((column) => String(column.value))));
      const normalized: ErdTable = {
        id: stableId("table", schema.name, table.name),
        schema: schema.name,
        name: table.name,
        columns: table.fields.map((field) => ({
          id: stableId("column", schema.name, table.name, field.name),
          schema: schema.name,
          table: table.name,
          name: field.name,
          type: [field.type?.schemaName, field.type?.type_name, field.type?.args].filter(Boolean).join(field.type?.schemaName ? "." : ""),
          nullable: !field.not_null && !field.pk && !primaryIndexColumns.has(field.name),
          primary: Boolean(field.pk || primaryIndexColumns.has(field.name)),
          unique: Boolean(field.unique || uniqueIndexColumns.has(field.name)),
        })),
      };
      tables.push(normalized);
      tableByQualifiedName.set(`${schema.name}.${table.name}`, normalized);
    }
  }

  const foreignKeys: ErdForeignKey[] = [];
  let omittedExternalForeignKeys = 0;
  for (const schema of database.schemas) {
    for (const ref of schema.refs) {
      if (ref.endpoints.length !== 2) continue;
      const [dependentEndpoint, referencedEndpoint] = ref.endpoints;
      const dependent = tableByQualifiedName.get(`${dependentEndpoint.schemaName ?? "public"}.${dependentEndpoint.tableName}`);
      const referenced = tableByQualifiedName.get(`${referencedEndpoint.schemaName ?? "public"}.${referencedEndpoint.tableName}`);
      if (!dependent || !referenced) {
        if (dependent && !referenced) omittedExternalForeignKeys += 1;
        continue;
      }
      const dependentColumnIds = dependentEndpoint.fieldNames.map((name) => stableId("column", dependent.schema, dependent.name, name));
      const referencedColumnIds = referencedEndpoint.fieldNames.map((name) => stableId("column", referenced.schema, referenced.name, name));
      foreignKeys.push({
        id: stableId("fk", ref.name || String(ref.id), dependent.schema, dependent.name, dependentColumnIds.join("-")),
        name: ref.name || `${dependent.name}_${dependentEndpoint.fieldNames.join("_")}_fkey`,
        dependentTableId: dependent.id,
        dependentColumnIds,
        referencedTableId: referenced.id,
        referencedColumnIds,
      });
    }
  }
  return {
    schemas: schemas.map(({ name }) => name).sort(),
    tables: tables.sort((left, right) => `${left.schema}.${left.name}`.localeCompare(`${right.schema}.${right.name}`)),
    foreignKeys: foreignKeys.sort((left, right) => left.id.localeCompare(right.id)),
    diagnostics: [
      ...(prepared.ignoredTriggerCount > 0 ? [{ code: "postgres.trigger-ignored", severity: "info" as const, message: `Ignored ${prepared.ignoredTriggerCount} trigger definitions because triggers do not affect ERD structure.` }] : []),
      ...(prepared.externalStubTables.size > 0 ? [{ code: "postgres.external-table-stub", severity: "info" as const, message: `Created ${prepared.externalStubTables.size} parser-only external table stub${prepared.externalStubTables.size === 1 ? "" : "s"}; stubs are excluded from the normalized model.` }] : []),
      ...(omittedExternalForeignKeys > 0 ? [{ code: "postgres.external-foreign-key", severity: "warning" as const, message: `Omitted ${omittedExternalForeignKeys} foreign key${omittedExternalForeignKeys === 1 ? "" : "s"} whose referenced table is outside the selected schemas.` }] : []),
    ],
  };
}

export function erdToKnowledgeDocument(id: string, title: string, model: ErdModel): KnowledgeDocument {
  return {
    schemaVersion: 1,
    id,
    title,
    sources: [{ id: `${id}-source`, kind: "postgres-sql", label: title }],
    entities: [
      ...model.tables.map((table) => ({ id: table.id, kind: "table" as const, name: table.name, label: `${table.schema}.${table.name}`, properties: { schema: table.schema } })),
      ...model.tables.flatMap((table) => table.columns.map((column) => ({ id: column.id, kind: "column" as const, name: column.name, parentId: table.id, properties: { type: column.type, nullable: column.nullable, primary: column.primary, unique: column.unique } }))),
    ],
    groups: model.schemas.map((schema) => ({ id: `schema-${schema}`, name: schema, entityIds: model.tables.filter((table) => table.schema === schema).map(({ id: tableId }) => tableId) })),
    relations: model.foreignKeys.map((foreignKey) => ({
      id: foreignKey.id,
      kind: "foreign-key",
      sourceId: foreignKey.dependentTableId,
      targetId: foreignKey.referencedTableId,
      label: foreignKey.name,
      presentation: { direction: "forward", layoutInfluence: "primary", style: "solid" },
      properties: { dependentColumnIds: foreignKey.dependentColumnIds, referencedColumnIds: foreignKey.referencedColumnIds },
    })),
    perspectives: [
      { id: "native", kind: "native-mermaid", title: "Generated Mermaid ERD" },
      { id: "erd", kind: "erd", title: "THOM ERD" },
    ],
    diagnostics: model.diagnostics,
  };
}

function mermaidIdentifier(table: ErdTable): string {
  return `${table.schema}_${table.name}`.replace(/[^A-Za-z0-9_]/g, "_").toUpperCase();
}

export function createMermaidErd(model: ErdModel): string {
  const lines = ["erDiagram"];
  for (const foreignKey of model.foreignKeys) {
    const dependent = model.tables.find(({ id }) => id === foreignKey.dependentTableId)!;
    const referenced = model.tables.find(({ id }) => id === foreignKey.referencedTableId)!;
    lines.push(`    ${mermaidIdentifier(referenced)} ||--o{ ${mermaidIdentifier(dependent)} : "${foreignKey.name.replaceAll('"', "'")}"`);
  }
  for (const table of model.tables) {
    lines.push(`    ${mermaidIdentifier(table)} {`);
    for (const column of table.columns) {
      const keys = [column.primary ? "PK" : "", column.unique ? "UK" : ""].filter(Boolean).join(",");
      const safeType = column.type.replace(/[^A-Za-z0-9_\[\]-]/g, "_") || "unknown";
      lines.push(`        ${safeType} ${column.name.replace(/[^A-Za-z0-9_]/g, "_")}${keys ? ` ${keys}` : ""}${column.nullable ? ' "nullable"' : ""}`);
    }
    lines.push("    }");
  }
  return `${lines.join("\n")}\n`;
}

interface ComponentState { index: number; lowLink: number; active: boolean }

function stronglyConnectedComponents(model: ErdModel): Map<string, number> {
  const adjacency = new Map(model.tables.map(({ id }) => [id, [] as string[]]));
  for (const foreignKey of model.foreignKeys) adjacency.get(foreignKey.referencedTableId)?.push(foreignKey.dependentTableId);
  const states = new Map<string, ComponentState>();
  const stack: string[] = [];
  const componentByTable = new Map<string, number>();
  let nextIndex = 0;
  let component = 0;
  const visit = (id: string): void => {
    const state = { index: nextIndex, lowLink: nextIndex, active: true };
    nextIndex += 1;
    states.set(id, state);
    stack.push(id);
    for (const neighbor of adjacency.get(id) ?? []) {
      const neighborState = states.get(neighbor);
      if (!neighborState) {
        visit(neighbor);
        state.lowLink = Math.min(state.lowLink, states.get(neighbor)!.lowLink);
      } else if (neighborState.active) state.lowLink = Math.min(state.lowLink, neighborState.index);
    }
    if (state.lowLink === state.index) {
      while (stack.length > 0) {
        const member = stack.pop()!;
        states.get(member)!.active = false;
        componentByTable.set(member, component);
        if (member === id) break;
      }
      component += 1;
    }
  };
  for (const table of model.tables) if (!states.has(table.id)) visit(table.id);
  return componentByTable;
}

interface TablePosition { x: number; y: number; width: number; height: number; rank: number }

interface ErdLayout {
  positions: Map<string, TablePosition>;
  width: number;
  height: number;
  cyclicForeignKeys: Set<string>;
  dense: boolean;
}

function layoutErd(model: ErdModel): ErdLayout {
  const scc = stronglyConnectedComponents(model);
  const componentIds = [...new Set(scc.values())];
  const componentEdges = new Map(componentIds.map((id) => [id, new Set<number>()]));
  const cyclicForeignKeys = new Set<string>();
  for (const foreignKey of model.foreignKeys) {
    const source = scc.get(foreignKey.referencedTableId)!;
    const target = scc.get(foreignKey.dependentTableId)!;
    if (source === target) cyclicForeignKeys.add(foreignKey.id);
    else componentEdges.get(source)?.add(target);
  }
  const ranks = new Map(componentIds.map((id) => [id, 0]));
  for (let pass = 0; pass < componentIds.length; pass += 1) {
    for (const [source, targets] of componentEdges) {
      for (const target of targets) ranks.set(target, Math.max(ranks.get(target) ?? 0, (ranks.get(source) ?? 0) + 1));
    }
  }

  const undirected = new Map(model.tables.map(({ id }) => [id, new Set<string>()]));
  for (const foreignKey of model.foreignKeys) {
    undirected.get(foreignKey.dependentTableId)?.add(foreignKey.referencedTableId);
    undirected.get(foreignKey.referencedTableId)?.add(foreignKey.dependentTableId);
  }
  const connected: string[][] = [];
  const visited = new Set<string>();
  for (const table of model.tables) {
    if (visited.has(table.id)) continue;
    const queue = [table.id];
    const members: string[] = [];
    visited.add(table.id);
    while (queue.length > 0) {
      const current = queue.shift()!;
      members.push(current);
      for (const neighbor of undirected.get(current) ?? []) if (!visited.has(neighbor)) { visited.add(neighbor); queue.push(neighbor); }
    }
    connected.push(members.sort());
  }

  const dense = model.tables.length > 80 || model.tables.reduce((sum, table) => sum + table.columns.length, 0) > 1_200;
  if (dense) {
    const componentByTable = new Map<string, number>();
    connected.forEach((members, componentIndex) => members.forEach((id) => componentByTable.set(id, componentIndex)));
    const tableWidth = 270;
    const rowHeight = 11;
    const headerHeight = 48;
    const laneGap = 34;
    const rankGap = 86;
    const targetHeight = 3_600;
    const top = 112;
    const positions = new Map<string, TablePosition>();
    let rankLeft = 48;
    let maximumY = top;
    const byRank = new Map<number, string[]>();
    for (const table of model.tables) {
      const rank = ranks.get(scc.get(table.id)!) ?? 0;
      byRank.set(rank, [...(byRank.get(rank) ?? []), table.id]);
    }
    for (const [rank, ids] of [...byRank].sort(([left], [right]) => left - right)) {
      ids.sort((left, right) => (componentByTable.get(left) ?? 0) - (componentByTable.get(right) ?? 0) || left.localeCompare(right));
      let lane = 0;
      let y = top;
      let previousComponent: number | undefined;
      for (const id of ids) {
        const table = model.tables.find((candidate) => candidate.id === id)!;
        const height = headerHeight + 8 + table.columns.length * rowHeight;
        const component = componentByTable.get(id);
        if (previousComponent !== undefined && component !== previousComponent) y += 20;
        if (y + height > targetHeight && y > top) {
          lane += 1;
          y = top;
        }
        const x = rankLeft + lane * (tableWidth + laneGap);
        positions.set(id, { x, y, width: tableWidth, height, rank });
        y += height + 24;
        maximumY = Math.max(maximumY, y);
        previousComponent = component;
      }
      rankLeft += (lane + 1) * (tableWidth + laneGap) + rankGap;
    }
    return {
      positions,
      width: Math.max(1_040, rankLeft - rankGap + 48),
      height: Math.max(680, maximumY + 28),
      cyclicForeignKeys,
      dense,
    };
  }

  const positions = new Map<string, TablePosition>();
  let componentTop = 128;
  let maximumX = 0;
  for (const members of connected) {
    const byRank = new Map<number, string[]>();
    for (const id of members) {
      const rank = ranks.get(scc.get(id)!) ?? 0;
      byRank.set(rank, [...(byRank.get(rank) ?? []), id]);
    }
    let componentHeight = 0;
    for (const [rank, ids] of [...byRank].sort(([left], [right]) => left - right)) {
      let y = componentTop;
      for (const id of ids.sort()) {
        const table = model.tables.find((candidate) => candidate.id === id)!;
        const height = 66 + table.columns.length * 30;
        positions.set(id, { x: 70 + rank * 500, y, width: 370, height, rank });
        y += height + 62;
        maximumX = Math.max(maximumX, 70 + rank * 500 + 370);
      }
      componentHeight = Math.max(componentHeight, y - componentTop);
    }
    componentTop += componentHeight + 90;
  }
  return { positions, width: Math.max(1040, maximumX + 80), height: Math.max(680, componentTop + 20), cyclicForeignKeys, dense };
}

export function renderErd(model: ErdModel, title: string, fonts: EmbeddedFonts): { svg: string; width: number; height: number; rasterSvg?: string } {
  const layout = layoutErd(model);
  const tableMarkup = model.tables.map((table) => {
    const position = layout.positions.get(table.id)!;
    const rows = table.columns.map((column, index) => {
      if (layout.dense) {
        const top = position.y + 48 + index * 11;
        const keys = [column.primary ? "PK" : "", column.unique ? "UK" : "", column.nullable ? "?" : ""].filter(Boolean).join(" ");
        return `<g id="${column.id}"><path d="M${position.x} ${top + 11} H${position.x + position.width}" stroke="${knowledgeTheme.border}" stroke-width=".6"/><text x="${position.x + 7}" y="${top + 8}" font-size="6.6" fill="${column.primary ? knowledgeTheme.primary : knowledgeTheme.foreground}">${xml(column.name)}</text><text x="${position.x + 142}" y="${top + 8}" font-size="6.1" fill="${knowledgeTheme.foregroundMuted}">${xml(column.type.slice(0, 27))}</text><text x="${position.x + position.width - 7}" y="${top + 8}" text-anchor="end" font-size="5.8" fill="${knowledgeTheme.primary}">${keys}</text></g>`;
      }
      const y = position.y + 61 + index * 30;
      const keys = [column.primary ? "PK" : "", column.unique ? "UK" : "", column.nullable ? "?" : ""].filter(Boolean).join(" ");
      return `<g id="${column.id}"><path d="M${position.x} ${y + 14} H${position.x + position.width}" stroke="${knowledgeTheme.border}"/><text x="${position.x + 16}" y="${y + 4}" font-size="12" fill="${column.primary ? knowledgeTheme.primary : knowledgeTheme.foreground}">${xml(column.name)}</text><text x="${position.x + 190}" y="${y + 4}" font-size="11" fill="${knowledgeTheme.foregroundMuted}">${xml(column.type)}</text><text x="${position.x + position.width - 16}" y="${y + 4}" text-anchor="end" font-size="10" fill="${knowledgeTheme.primary}">${keys}</text></g>`;
    }).join("");
    if (layout.dense) {
      const label = wrapText(table.name, 34, 1)[0];
      return `<g id="${table.id}"><rect x="${position.x}" y="${position.y}" width="${position.width}" height="${position.height}" rx="8" fill="${knowledgeTheme.surface}" stroke="${knowledgeTheme.borderStrong}" stroke-width=".8"/><path d="M${position.x} ${position.y + 48} H${position.x + position.width}" stroke="${knowledgeTheme.borderStrong}" stroke-width=".8"/><text x="${position.x + 8}" y="${position.y + 13}" font-size="5.8" fill="${knowledgeTheme.foregroundMuted}">${xml(table.schema)}</text><text class="display" x="${position.x + 8}" y="${position.y + 36}" font-size="13">${xml(label)}</text>${rows}</g>`;
    }
    return `<g id="${table.id}"><rect x="${position.x}" y="${position.y}" width="${position.width}" height="${position.height}" rx="15" fill="${knowledgeTheme.surface}" stroke="${knowledgeTheme.borderStrong}"/><path d="M${position.x} ${position.y + 50} H${position.x + position.width}" stroke="${knowledgeTheme.borderStrong}"/><text x="${position.x + 16}" y="${position.y + 21}" font-size="10" fill="${knowledgeTheme.foregroundMuted}">${xml(table.schema)}</text><text class="display" x="${position.x + 16}" y="${position.y + 43}" font-size="23">${xml(table.name)}</text>${rows}</g>`;
  }).join("");

  const columnY = (table: ErdTable, columnId: string): number => {
    const position = layout.positions.get(table.id)!;
    const index = Math.max(0, table.columns.findIndex(({ id }) => id === columnId));
    return layout.dense ? position.y + 53 + index * 11 : position.y + 65 + index * 30;
  };
  const relationMarkup = model.foreignKeys.map((foreignKey, index) => {
    const dependent = model.tables.find(({ id }) => id === foreignKey.dependentTableId)!;
    const referenced = model.tables.find(({ id }) => id === foreignKey.referencedTableId)!;
    const dependentPosition = layout.positions.get(dependent.id)!;
    const referencedPosition = layout.positions.get(referenced.id)!;
    const sy = columnY(referenced, foreignKey.referencedColumnIds[0]);
    const ty = columnY(dependent, foreignKey.dependentColumnIds[0]);
    const cyclic = layout.cyclicForeignKeys.has(foreignKey.id);
    if (dependent.id === referenced.id) {
      const x = dependentPosition.x + dependentPosition.width;
      const loopX = x + (layout.dense ? 18 : 54) + index * (layout.dense ? 1.5 : 8);
      return `<path d="M${x} ${sy} H${loopX} V${ty} H${x}" fill="none" stroke="${knowledgeTheme.error}" stroke-width="${layout.dense ? .7 : 1.8}" stroke-dasharray="6 5" marker-end="url(#arrow-muted)"/><text x="${loopX + (layout.dense ? 3 : 8)}" y="${(sy + ty) / 2}" font-size="${layout.dense ? 5 : 9}" fill="${knowledgeTheme.foregroundMuted}">${xml(foreignKey.name)}</text>`;
    }
    const leftToRight = referencedPosition.x <= dependentPosition.x;
    const sx = leftToRight ? referencedPosition.x + referencedPosition.width : referencedPosition.x;
    const tx = leftToRight ? dependentPosition.x : dependentPosition.x + dependentPosition.width;
    const mid = (sx + tx) / 2 + ((index % 3) - 1) * (layout.dense ? 3 : 10);
    const labelY = Math.min(sy, ty) - (layout.dense ? 3 : 9);
    return `<path d="M${sx} ${sy} H${mid} V${ty} H${tx}" fill="none" stroke="${cyclic ? knowledgeTheme.error : knowledgeTheme.primary}" stroke-width="${layout.dense ? .7 : 1.8}"${cyclic ? ' stroke-dasharray="6 5"' : ""} marker-end="url(#arrow)"/><text x="${mid}" y="${labelY}" text-anchor="middle" font-size="${layout.dense ? 4.8 : 9}" fill="${knowledgeTheme.foregroundMuted}">${xml(foreignKey.name)}</text>`;
  }).join("");
  const content = `<text class="display" x="58" y="58" font-size="${layout.dense ? 28 : 38}">${xml(title)}</text><text x="${layout.width - 58}" y="56" text-anchor="end" font-size="${layout.dense ? 8 : 12}" fill="${knowledgeTheme.foregroundMuted}">ERD · REFERENCED → DEPENDENT · COLUMN PORTS · ORTHOGONAL ROUTES${layout.dense ? " · DENSE DOMAIN PACKING" : ""}</text>${relationMarkup}${tableMarkup}`;
  const svg = svgShell({ title: `${title} — THOM ERD`, description: "Entity relationship diagram ranked from referenced tables to dependent tables with column-level ports.", width: layout.width, height: layout.height, fonts, content });
  if (!layout.dense) return { svg, width: layout.width, height: layout.height };
  const overviewTables = model.tables.map((table) => {
    const position = layout.positions.get(table.id)!;
    return `<g><rect x="${position.x}" y="${position.y}" width="${position.width}" height="${position.height}" rx="8" fill="${knowledgeTheme.surface}" stroke="${knowledgeTheme.borderStrong}" stroke-width="1.2"/><text class="display" x="${position.x + 9}" y="${position.y + 25}" font-size="11">${xml(wrapText(table.name, 34, 1)[0])}</text><text x="${position.x + 9}" y="${position.y + 41}" font-size="6" fill="${knowledgeTheme.foregroundMuted}">${table.columns.length} COLUMNS</text></g>`;
  }).join("");
  const overviewContent = `<text class="display" x="58" y="58" font-size="28">${xml(title)}</text><text x="${layout.width - 58}" y="56" text-anchor="end" font-size="8" fill="${knowledgeTheme.foregroundMuted}">ERD OVERVIEW · FULL COLUMN REGISTER IN SVG</text>${relationMarkup}${overviewTables}`;
  const rasterSvg = svgShell({ title: `${title} — THOM ERD overview`, description: "Raster overview of the complete ERD; the paired SVG contains the full column register.", width: layout.width, height: layout.height, fonts, content: overviewContent });
  return { svg, width: layout.width, height: layout.height, rasterSvg };
}
