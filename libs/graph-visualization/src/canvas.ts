// Reagraph adapter for the proposition-graph domain. Maps a GraphDocument to
// reagraph nodes and edges (WebGL canvas) with THOM theme tokens and
// typography applied, and maps selection events back to domain entities.
// React-free: importing this module never loads the reagraph runtime.
import type { GraphEdge, GraphNode } from "reagraph";
import { thomTheme } from "./theme";
import type { GraphDocument, Selection } from "./types";

export type GraphElementKind = "proposition" | "relationship";

export interface GraphCanvasData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  /** Layout id (node id in the canvas) → reagraph node. */
  nodeById: Map<string, GraphNode>;
}

export const propositionLayoutId = (id: string): string => `proposition:${id}`;
export const relationshipLayoutId = (id: string): string => `relationship:${id}`;

export function kindFromLayoutId(layoutId: string): GraphElementKind | null {
  if (layoutId.startsWith("proposition:")) return "proposition";
  if (layoutId.startsWith("relationship:")) return "relationship";
  return null;
}

export function entityIdFromLayoutId(layoutId: string): string {
  const kind = kindFromLayoutId(layoutId);
  return kind ? layoutId.slice(`${kind}:`.length) : layoutId;
}

export function selectionFromLayoutId(layoutId: string): Selection {
  const kind = kindFromLayoutId(layoutId);
  return kind ? { kind, id: entityIdFromLayoutId(layoutId) } : null;
}

function nodePosition(pinned: boolean | undefined, position: { x: number; y: number } | null | undefined): { fx?: number; fy?: number } {
  return pinned && position ? { fx: position.x, fy: position.y } : {};
}

export function graphToReagraph(document: GraphDocument): GraphCanvasData {
  const nodes: GraphNode[] = [
    ...document.propositions.map((proposition, index) => ({
      id: propositionLayoutId(proposition.id),
      label: proposition.statement,
      subLabel: `${`P.${String(index + 1).padStart(2, "0")}`} / PROPOSITION`,
      size: proposition.emphasis ? 11 : 8,
      fill: proposition.emphasis ? thomTheme.color.primary : thomTheme.color.foreground,
      data: {
        kind: "proposition" as const,
        entityId: proposition.id,
        emphasis: Boolean(proposition.emphasis),
      },
      ...nodePosition(proposition.pinned, proposition.position),
    })),
    ...document.relationships.map((relationship, index) => ({
      id: relationshipLayoutId(relationship.id),
      label: relationship.statement,
      subLabel: `R.${String(index + 1).padStart(2, "0")} / RELATIONSHIP`,
      size: 12,
      // Relationships are the connector node type: the categorical accent
      // keeps them instantly distinct from proposition spheres while the
      // edges stay on the primary brand color.
      fill: thomTheme.color.accent,
      data: {
        kind: "relationship" as const,
        entityId: relationship.id,
      },
      ...nodePosition(relationship.pinned, relationship.position),
    })),
  ];

  const directional = document.layoutMode === "directional";
  const edges: GraphEdge[] = document.relationships.flatMap((relationship) =>
    relationship.participants.map((participant) => ({
      id: `${relationship.id}:${participant.nodeId}`,
      source: propositionLayoutId(participant.nodeId),
      target: relationshipLayoutId(relationship.id),
      fill: thomTheme.color.primary,
      interpolation: directional ? ("curved" as const) : ("linear" as const),
      arrowPlacement: directional
        ? participant.arrowAtNode
          ? ("mid" as const)
          : ("end" as const)
        : ("none" as const),
      data: {
        relationshipId: relationship.id,
        nodeId: participant.nodeId,
        arrowAtNode: participant.arrowAtNode,
        arrowAtRelation: participant.arrowAtRelation,
      },
    })),
  );

  return { nodes, edges, nodeById: new Map(nodes.map((node) => [node.id, node])) };
}
