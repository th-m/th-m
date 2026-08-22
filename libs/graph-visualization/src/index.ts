// Public API for the proposition graph domain, editor, and explorer. All
// interactive surfaces render on the reagraph WebGL canvas with the THOM
// theme; the `./core` entry stays free of React and reagraph for CLI use.
export { PropositionGraphEditor } from "./GraphApp";
export {
  RelationshipGraphExplorer,
  type RelationshipGraphExplorerProps,
} from "./RelationshipGraphExplorer";
export {
  PropositionGraphFigure,
  type PropositionGraphFigureProps,
} from "./PropositionGraphFigure";
export {
  ThomGraphCanvas,
  graphLayoutOverrides,
  graphLayoutProfiles,
  graphNeedsCompactLayout,
  type GraphLayoutDensity,
  type GraphLayoutOptions,
  type GraphLayoutProfile,
  type ThomGraphCanvasProps,
} from "./GraphCanvas";

export {
  entityIdFromLayoutId,
  graphToReagraph,
  kindFromLayoutId,
  propositionLayoutId,
  relationshipLayoutId,
  selectionFromLayoutId,
  type GraphCanvasData,
  type GraphElementKind,
} from "./canvas";

export { createReagraphTheme } from "./reagraphTheme";

export { CanvasControls, type CanvasControlsProps } from "./CanvasControls";

export { thomGraphNodeRenderer } from "./nodes";

export { downloadText, slugifyFilename } from "./exportText";

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

export { createLayerDependencyGraph, createPropositionsGraph, createSeedLibrary, createUnderstandingLoopGraph, createUnderstandingPipelineGraph, createWeatherGraph } from "./seed";

export { thomTheme, type GraphTheme } from "./theme";
