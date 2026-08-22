export type KnowledgeEntityKind =
  | "system"
  | "package"
  | "exported-symbol"
  | "table"
  | "column"
  | "set"
  | "atom";

export type KnowledgeRelationKind =
  | "containment"
  | "dependency"
  | "type-reference"
  | "process-step"
  | "foreign-key"
  | "equivalence"
  | "subset"
  | "overlap"
  | "disjoint";

export type KnowledgeDiagnosticSeverity = "error" | "warning" | "info";

export interface KnowledgeSourceSpan {
  start: number;
  end: number;
  line: number;
  column: number;
}

export interface KnowledgeProvenance {
  sourceId: string;
  repository?: string;
  revision?: string;
  path?: string;
  contentHash?: string;
  span?: KnowledgeSourceSpan;
  detail?: string;
}

export interface KnowledgeEntity {
  id: string;
  kind: KnowledgeEntityKind;
  name: string;
  label?: string;
  parentId?: string;
  properties?: Record<string, string | number | boolean | string[]>;
  provenance?: KnowledgeProvenance[];
}

export interface KnowledgeGroup {
  id: string;
  name: string;
  parentId?: string;
  entityIds: string[];
  properties?: Record<string, string | number | boolean>;
  provenance?: KnowledgeProvenance[];
}

export interface KnowledgeRelationPresentation {
  direction: "forward" | "reverse" | "both" | "none";
  layoutInfluence: "primary" | "secondary" | "none";
  style: "solid" | "dotted" | "dashed";
}

export interface KnowledgeRelation {
  id: string;
  kind: KnowledgeRelationKind;
  sourceId: string;
  targetId: string;
  label?: string;
  ordinal?: number;
  phaseId?: string;
  presentation: KnowledgeRelationPresentation;
  properties?: Record<string, string | number | boolean | string[] | number[]>;
  provenance?: KnowledgeProvenance[];
}

export interface KnowledgeDiagnostic {
  code: string | number;
  severity: KnowledgeDiagnosticSeverity;
  message: string;
  provenance?: KnowledgeProvenance;
}

export type KnowledgePerspectiveKind =
  | "native-mermaid"
  | "system-topology"
  | "phased-process"
  | "erd"
  | "hierarchy"
  | "dependency"
  | "public-api";

export interface KnowledgePerspective {
  id: string;
  kind: KnowledgePerspectiveKind;
  title: string;
  entityKinds?: KnowledgeEntityKind[];
  relationKinds?: KnowledgeRelationKind[];
  options?: Record<string, string | number | boolean | string[]>;
}

export interface KnowledgeSource {
  id: string;
  kind: "mermaid" | "postgres-sql" | "typescript-workspace" | "typescript-selection";
  label: string;
  path?: string;
  repository?: string;
  revision?: string;
  contentHash?: string;
  compilerVersion?: string;
}

export interface KnowledgeDocument {
  schemaVersion: 1;
  id: string;
  title: string;
  sources: KnowledgeSource[];
  entities: KnowledgeEntity[];
  groups: KnowledgeGroup[];
  relations: KnowledgeRelation[];
  perspectives: KnowledgePerspective[];
  diagnostics: KnowledgeDiagnostic[];
}

export function validateKnowledgeDocument(document: KnowledgeDocument): string[] {
  const violations: string[] = [];
  if (document.schemaVersion !== 1) violations.push("Unsupported knowledge schema version.");
  const entityIds = new Set<string>();
  for (const entity of document.entities) {
    if (!entity.id || entityIds.has(entity.id)) violations.push(`Duplicate or empty entity id: ${entity.id}`);
    entityIds.add(entity.id);
  }
  const groupIds = new Set<string>();
  for (const group of document.groups) {
    if (!group.id || groupIds.has(group.id)) violations.push(`Duplicate or empty group id: ${group.id}`);
    groupIds.add(group.id);
    for (const entityId of group.entityIds) {
      if (!entityIds.has(entityId)) violations.push(`Group ${group.id} references missing entity ${entityId}.`);
    }
  }
  const relationIds = new Set<string>();
  for (const relation of document.relations) {
    if (!relation.id || relationIds.has(relation.id)) violations.push(`Duplicate or empty relation id: ${relation.id}`);
    relationIds.add(relation.id);
    if (!entityIds.has(relation.sourceId)) violations.push(`Relation ${relation.id} has missing source ${relation.sourceId}.`);
    if (!entityIds.has(relation.targetId)) violations.push(`Relation ${relation.id} has missing target ${relation.targetId}.`);
  }
  return violations;
}
