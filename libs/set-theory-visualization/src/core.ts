// Core domain + renderer exports for non-browser consumers (CLI generators).
// Excludes React components and CodeMirror so Bun/Node never loads them.
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

export type {
  AtomLabel,
  AtlasCard,
  Point,
  RegionShape,
  SetAtlasDocument,
  SetAtlasLibrary,
  SetAtlasScene,
  ViewportState,
} from "./types";

export { setAtlasTheme } from "./theme";

export {
  buildSetAtlasScene,
  reduceTransitiveContainment,
} from "./layout";

export {
  createSetAtlasSvg,
  renderSetAtlasSvg,
  type EmbeddedSetAtlasFonts,
  type SetAtlasSvgOptions,
} from "./renderSvg";
