import type {
  KnowledgeDiagnostic,
  KnowledgeDocument,
  KnowledgePerspectiveKind,
  TypeRelation,
  TypeSetSymbol,
} from "@th-m/knowledge-model";

export interface ProofManifest {
  schemaVersion: 1;
  id: string;
  title: string;
  description?: string;
  sources: ProofSource[];
  reviewCriteria: string[];
}

export type ProofSource = MermaidProofSource | ErdProofSource | TypeScriptProofSource;

interface BaseProofSource {
  id: string;
  title: string;
  path: string;
  perspectives: KnowledgePerspectiveKind[];
}

export interface MermaidProofSource extends BaseProofSource {
  kind: "mermaid-flowchart";
}

export interface ErdProofSource extends BaseProofSource {
  kind: "postgres-schema";
  schemas?: string[];
}

export interface TypeScriptProofSource extends BaseProofSource {
  kind: "typescript-workspace-snapshot";
  selection?: string[];
}

export interface TypeScriptPackageSnapshot {
  id: string;
  name: string;
  path: string;
  capability: string;
  tags: string[];
  dependencies: string[];
  exports: string[];
  sourceHashes: Array<{ path: string; sha256: string }>;
}

export interface TypeScriptSymbolSnapshot {
  id: string;
  name: string;
  packageId: string;
  kind: "alias" | "interface" | "class" | "enum" | "function" | "variable" | "other";
  sourcePath: string;
  line: number;
  column: number;
  display: string;
  deprecated: boolean;
  extends: string[];
  references: string[];
  unionMembers: string[];
  intersectionMembers: string[];
  aliasTarget?: string;
}

export interface TypeScriptWorkspaceSnapshot {
  schemaVersion: 1;
  kind: "typescript-workspace";
  id: string;
  title: string;
  repository: {
    identity: string;
    revision: string;
    sourcePath: string;
    tsconfigPath: string;
  };
  compilerVersion: string;
  contentHash: string;
  packages: TypeScriptPackageSnapshot[];
  symbols: TypeScriptSymbolSnapshot[];
  diagnostics: KnowledgeDiagnostic[];
}

export interface DiagramArtifact {
  id: string;
  title: string;
  perspective: KnowledgePerspectiveKind;
  svgFile: string;
  pngFile: string;
  width: number;
  height: number;
  counts: Record<string, number>;
  warnings: string[];
}

export interface SourceReport {
  id: string;
  title: string;
  kind: ProofSource["kind"];
  revision?: string;
  modelFile: string;
  diagnosticsFile: string;
  registerFile?: string;
  artifacts: DiagramArtifact[];
  counts: Record<string, number>;
  warnings: string[];
}

export interface ProofReport {
  schemaVersion: 1;
  proofId: string;
  title: string;
  sources: SourceReport[];
  reviewCriteria: string[];
}

export interface SetProjection {
  symbols: TypeSetSymbol[];
  relations: TypeRelation[];
  warnings: string[];
}

export type NormalizedProofModel = KnowledgeDocument;
