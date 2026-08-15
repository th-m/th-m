export type Point = { x: number; y: number };

export interface ViewportState {
  x: number;
  y: number;
  zoom: number;
}

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

export interface RegionShape {
  id: string;
  symbolIds: string[];
  labels: string[];
  display: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  depth: number;
  approximate: boolean;
}

export interface AtlasCard {
  id: string;
  symbolId: string;
  label: string;
  detail: string;
  status: "template" | "exception" | "empty";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AtomLabel {
  id: string;
  label: string;
  x: number;
  y: number;
  ownerIds: string[];
}

export interface SetAtlasScene {
  width: number;
  height: number;
  regions: RegionShape[];
  cards: AtlasCard[];
  atoms: AtomLabel[];
  warnings: string[];
}

export interface SetAtlasDocument {
  schemaVersion: 1;
  id: string;
  name: string;
  source: SetAtlasSource;
  themeId: "thom-dark";
  pins: Record<string, Point>;
  viewport: ViewportState;
  createdAt: string;
  updatedAt: string;
}

export interface SetAtlasLibrary {
  schemaVersion: 1;
  activeDocumentId: string;
  documents: SetAtlasDocument[];
}
