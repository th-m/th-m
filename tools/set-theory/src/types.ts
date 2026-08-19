export type Point = { x: number; y: number };

export interface ViewportState {
  x: number;
  y: number;
  zoom: number;
}

export type {
  AnalyzeError,
  AnalyzeRequest,
  AnalyzeResult,
  AtlasDiagnostic,
  AtlasSymbolKind,
  AtlasSymbolStatus,
  DiagnosticSeverity,
  LiteralOrPrimitiveAtom,
  RelationConfidence,
  RelationKind,
  SetAtlasSource,
  SourceSpan,
  TypeRelation,
  TypeSetSymbol,
} from "@th-m/knowledge-model";

import type {
  RelationConfidence,
  RelationKind,
  SetAtlasSource,
} from "@th-m/knowledge-model";

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
