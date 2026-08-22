// Core domain exports for non-browser consumers (CLI generators). Excludes
// React components so Bun and Node never load @xyflow/react or the ELK worker.
export type {
  GraphDocument,
  GraphLibrary,
  Proposition,
  Relationship,
  RelationshipParticipant,
  Point,
  ItemSize,
  ItemSizes,
  LayoutPositions,
  LayoutRequest,
  LayoutResponse,
  Selection,
} from "./types";

export {
  addDocument,
  addProposition,
  addRelationship,
  createBlankDocument,
  deleteDocument,
  duplicateDocument,
  removeProposition,
  removeRelationship,
  replaceDocument,
  touchDocument,
} from "./model";

export {
  commitHistory,
  createHistory,
  redoHistory,
  undoHistory,
  type HistoryState,
} from "./history";

export { createId } from "./ids";

export {
  GRAPH_LIBRARY_KEY,
  exportGraphDocument,
  importGraphDocument,
  isGraphDocument,
  isGraphLibrary,
  loadGraphLibrary,
  saveGraphLibrary,
} from "./storage";

export { createPropositionsGraph, createSeedLibrary, createWeatherGraph } from "./seed";

export {
  applyPinnedPositions,
  buildElkGraph,
  estimateDocumentSizes,
  estimatePropositionSize,
  estimateRelationshipSize,
  isCurrentLayoutRequest,
  normalizeLayout,
  positionsFromElk,
  propositionLayoutId,
  relationshipLayoutId,
  resolveOverlaps,
} from "./layout";

export { thomTheme, type GraphTheme } from "./theme";

export {
  createGraphSvg,
  downloadText,
  slugifyFilename,
  type EmbeddedGraphFonts,
  type SvgExportMode,
} from "./exportSvg";
