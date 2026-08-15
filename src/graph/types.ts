export type Point = { x: number; y: number };

export interface Proposition {
  id: string;
  statement: string;
  emphasis: boolean;
  pinned: boolean;
  position?: Point;
}

export interface RelationshipParticipant {
  nodeId: string;
  arrowAtNode: boolean;
  arrowAtRelation: boolean;
}

export interface Relationship {
  id: string;
  statement: string;
  participants: RelationshipParticipant[];
  pinned: boolean;
  position?: Point;
}

export interface GraphDocument {
  schemaVersion: 1;
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  themeId: "thom-dark";
  layoutMode: "editorial" | "directional";
  propositions: Proposition[];
  relationships: Relationship[];
  poster: {
    kicker: string;
    title: string;
    footer: string;
    showLegend: boolean;
  };
}

export interface GraphLibrary {
  schemaVersion: 1;
  activeDocumentId: string;
  documents: GraphDocument[];
}

export interface ItemSize {
  width: number;
  height: number;
}

export type ItemSizes = Record<string, ItemSize>;
export type LayoutPositions = Record<string, Point>;

export interface LayoutRequest {
  requestId: number;
  document: GraphDocument;
  sizes: ItemSizes;
}

export interface LayoutResponse {
  requestId: number;
  positions: LayoutPositions;
  error?: string;
}

export type Selection =
  | { kind: "proposition"; id: string }
  | { kind: "relationship"; id: string }
  | null;
