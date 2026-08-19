export type SetAtlasSource =
  | { mode: "snippet"; fileName: string; code: string }
  | { mode: "project"; sourceFilePath: string; tsconfigPath?: string };

export type AtlasSymbolKind = "alias" | "interface" | "enum" | "class";
export type AtlasSymbolStatus = "region" | "universe" | "empty" | "template" | "exception";
export type RelationKind = "equivalent" | "proper-subset" | "disjoint" | "overlap" | "indeterminate";
export type RelationConfidence = "compiler-proven" | "derived" | "approximate";
export type DiagnosticSeverity = "error" | "warning" | "info";

export interface SourceSpan {
  start: number;
  end: number;
  line: number;
  column: number;
}

export interface AtlasDiagnostic {
  code: number | string;
  severity: DiagnosticSeverity;
  message: string;
  fileName?: string;
  span?: SourceSpan;
}

export interface LiteralOrPrimitiveAtom {
  id: string;
  label: string;
  kind: "literal" | "primitive";
  ownerIds: string[];
}

export interface TypeSetSymbol {
  id: string;
  name: string;
  kind: AtlasSymbolKind;
  display: string;
  status: AtlasSymbolStatus;
  typeFlags: number;
  sourceSpan: SourceSpan;
  detail?: string;
  atomIds: string[];
}

export interface TypeRelation {
  sourceId: string;
  targetId: string;
  kind: RelationKind;
  confidence: RelationConfidence;
  reason?: string;
}

export interface AnalyzeResult {
  revision: number;
  compilerVersion: string;
  sourceText: string;
  sourceFilePath: string;
  resolvedConfigPath?: string;
  diagnostics: AtlasDiagnostic[];
  symbols: TypeSetSymbol[];
  relations: TypeRelation[];
  atoms: LiteralOrPrimitiveAtom[];
}

export interface AnalyzeRequest {
  revision: number;
  source: SetAtlasSource;
}

export interface AnalyzeError {
  revision: number;
  error: string;
}
