// Core domain exports for non-browser consumers (CLI generators). Excludes
// React and reagraph so Bun and Node never load the WebGL runtime.
export type {
  GraphDocument,
  GraphLibrary,
  Proposition,
  Relationship,
  RelationshipParticipant,
  Point,
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

export { thomTheme, type GraphTheme } from "./theme";
