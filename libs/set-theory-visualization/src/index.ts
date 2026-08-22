// Public API for the TypeScript set atlas domain, renderers, and components.
export { SetAtlasVisualization, type SetAtlasVisualizationProps } from "./SetAtlasVisualization";
export { SetAtlasCanvas } from "./SetAtlasCanvas";
export { curatedSetAtlasAnalyses, type CuratedSetAtlasEntry } from "./data/curated-atlases";

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

export {
  addDocument,
  clearDocumentPins,
  createBlankDocument,
  createSetAtlasId,
  deleteDocument,
  duplicateDocument,
  removeDocumentPin,
  renameDocument,
  replaceDocument,
  setActiveDocument,
  setDocumentPin,
  touchDocument,
  updateDocumentPin,
  updateDocumentSource,
  updateDocumentViewport,
} from "./model";

export {
  SET_ATLAS_LIBRARY_KEY,
  isSetAtlasDocument,
  isSetAtlasLibrary,
  isSetAtlasSource,
  loadAtlasLibrary,
  loadSetAtlasLibrary,
  saveAtlasLibrary,
  saveSetAtlasLibrary,
  serializeSetAtlasLibrary,
} from "./storage";

export { createSeedDocument, createSeedLibrary, createSetTheoryDocument } from "./seed";

export { setAtlasAccent, setAtlasAccentPalette, setAtlasTheme } from "./theme";

export {
  buildSetAtlasScene,
  reduceTransitiveContainment,
} from "./layout";

export {
  createSetAtlasSvg,
  loadEmbeddedSetAtlasFonts,
  renderSetAtlasSvg,
  type EmbeddedSetAtlasFonts,
  type SetAtlasSvgOptions,
} from "./renderSvg";

export {
  createSetAtlasPng,
  downloadBlob,
  downloadText,
  exportSetAtlasPng,
  exportSetAtlasSvg,
  slugifyFilename,
  slugifySetAtlasFilename,
  type SetAtlasExportOptions,
} from "./export";
