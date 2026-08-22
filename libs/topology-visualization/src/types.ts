// Layered system topology domain: ordered layers, nodes assigned to layers,
// and directed links (dependencies) between nodes. A TopologyDocument is the
// portable source of truth; layout positions and rendered artifacts are
// derived output.

export interface Point {
  x: number;
  y: number;
}

export interface TopologyLayer {
  id: string;
  name: string;
  /** One-line note shown under the layer name (e.g. what this layer owns). */
  detail?: string;
}

export interface TopologyNode {
  id: string;
  layerId: string;
  label: string;
  /** Highlighted role node (e.g. the product/consumer layer). */
  emphasis?: boolean;
  pinned?: boolean;
  position?: Point | null;
}

export interface TopologyLink {
  id: string;
  source: string;
  target: string;
  /** Short edge label, e.g. "may depend on". */
  label?: string;
  /** Rendered dashed when the dependency is indirect. */
  dashed?: boolean;
}

export interface TopologyPoster {
  kicker?: string;
  title?: string;
  footer?: string;
  showLegend?: boolean;
}

export interface TopologyDocument {
  schemaVersion: 1;
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  themeId: "thom-dark";
  /** Flow direction of the layered layout. */
  layoutDirection: "lr" | "td";
  layers: TopologyLayer[];
  nodes: TopologyNode[];
  links: TopologyLink[];
  poster?: TopologyPoster;
}

export interface TopologyLibrary {
  schemaVersion: 1;
  activeDocumentId: string;
  documents: TopologyDocument[];
}

export interface LayoutPositions {
  [nodeId: string]: Point;
}
