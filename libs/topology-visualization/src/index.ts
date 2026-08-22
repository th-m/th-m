// Public API for the layered system topology domain and interactive canvas.
export { TopologyCanvas, topologyToReagraph, type TopologyCanvasProps } from "./TopologyCanvas";
export { createReagraphTheme } from "./reagraphTheme";

export type {
  LayoutPositions,
  Point,
  TopologyDocument,
  TopologyLayer,
  TopologyLibrary,
  TopologyLink,
  TopologyNode,
  TopologyPoster,
} from "./types";

export {
  addLayer,
  addLink,
  addNode,
  createBlankTopology,
  isValidTopologyDocument,
  isValidTopologyLibrary,
  moveLayer,
  moveNode,
  removeLayer,
  removeLink,
  removeNode,
  renameLayer,
  renameNode,
  setLayerDetail,
  setLinkLabel,
  toggleLinkDashed,
  toggleNodeEmphasis,
} from "./model";

export { createId } from "./ids";

export {
  TOPOLOGY_LIBRARY_KEY,
  exportTopologyDocument,
  importTopologyDocument,
  isTopologyDocument,
  isTopologyLibrary,
  loadTopologyLibrary,
  saveTopologyLibrary,
} from "./storage";

export { layoutTopology, type LayoutExtent } from "./layout";

export {
  createTopologySvg,
  type EmbeddedTopologyFonts,
  type SvgExportMode,
} from "./exportSvg";

export {
  createFactoryTopology,
  createPipelineTopology,
  createTopologyLibrary,
} from "./seed";

export { topologyTheme, type TopologyTheme } from "./theme";
