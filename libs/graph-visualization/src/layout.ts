import type { ElkNode } from "elkjs/lib/elk-api";
import { thomTheme } from "./theme";
import type {
  GraphDocument,
  ItemSize,
  ItemSizes,
  LayoutPositions,
  Point,
} from "./types";

export const propositionLayoutId = (id: string) => `proposition:${id}`;
export const relationshipLayoutId = (id: string) => `relationship:${id}`;

export function isCurrentLayoutRequest(requestId: number, latestRequestId: number): boolean {
  return requestId === latestRequestId;
}

function wrappedLineCount(statement: string, charactersPerLine: number): number {
  const words = statement.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 1;
  let lines = 1;
  let used = 0;
  for (const word of words) {
    const needed = word.length + (used > 0 ? 1 : 0);
    if (used > 0 && used + needed > charactersPerLine) {
      lines += 1;
      used = word.length;
    } else {
      used += needed;
    }
  }
  return lines;
}

export function estimatePropositionSize(statement: string, emphasis = false): ItemSize {
  const lengthFactor = Math.min(1, Math.max(0, (statement.length - 14) / 55));
  const diameter = Math.round(
    thomTheme.geometry.propositionMin +
      lengthFactor * (thomTheme.geometry.propositionMax - thomTheme.geometry.propositionMin) +
      (emphasis ? 12 : 0),
  );
  return { width: diameter, height: diameter };
}

export function estimateRelationshipSize(statement: string): ItemSize {
  const width = Math.min(440, Math.max(thomTheme.geometry.relationshipWidth, statement.length * 5.5));
  const lines = wrappedLineCount(statement, Math.max(26, Math.floor(width / 8.8)));
  return {
    width: Math.round(width),
    height: Math.max(thomTheme.geometry.relationshipMinHeight, 50 + lines * 18),
  };
}

export function estimateDocumentSizes(document: GraphDocument): ItemSizes {
  return Object.fromEntries([
    ...document.propositions.map((proposition) => [
      propositionLayoutId(proposition.id),
      estimatePropositionSize(proposition.statement, proposition.emphasis),
    ]),
    ...document.relationships.map((relationship) => [
      relationshipLayoutId(relationship.id),
      estimateRelationshipSize(relationship.statement),
    ]),
  ]);
}

export function buildElkGraph(document: GraphDocument, sizes: ItemSizes): ElkNode {
  const directional = document.layoutMode === "directional";
  const children: ElkNode[] = [
    ...document.propositions.map((proposition) => {
      const id = propositionLayoutId(proposition.id);
      return { id, ...sizes[id] };
    }),
    ...document.relationships.map((relationship) => {
      const id = relationshipLayoutId(relationship.id);
      return { id, ...sizes[id] };
    }),
  ].sort((a, b) => a.id.localeCompare(b.id));

  const edges = document.relationships
    .flatMap((relationship) =>
      relationship.participants.map((participant) => ({
        id: `${relationship.id}:${participant.nodeId}`,
        sources: [propositionLayoutId(participant.nodeId)],
        targets: [relationshipLayoutId(relationship.id)],
      })),
    )
    .sort((a, b) => a.id.localeCompare(b.id));

  return {
    id: "root",
    children,
    edges,
    layoutOptions: directional
      ? {
          "elk.algorithm": "org.eclipse.elk.layered",
          "elk.direction": "RIGHT",
          "elk.edgeRouting": "SPLINES",
          "elk.spacing.nodeNode": "72",
          "elk.layered.spacing.nodeNodeBetweenLayers": "130",
          "elk.layered.considerModelOrder.strategy": "NODES_AND_EDGES",
          "elk.randomSeed": "17",
        }
      : {
          "elk.algorithm": "org.eclipse.elk.stress",
          "elk.spacing.nodeNode": "82",
          "elk.stress.desiredEdgeLength": "230",
          "elk.stress.dimension": "XY",
          "elk.stress.epsilon": "0.0001",
          "elk.randomSeed": "17",
        },
  };
}

export function positionsFromElk(graph: ElkNode): LayoutPositions {
  return Object.fromEntries(
    (graph.children ?? []).map((child) => [child.id, { x: child.x ?? 0, y: child.y ?? 0 }]),
  );
}

export function applyPinnedPositions(
  document: GraphDocument,
  positions: LayoutPositions,
): LayoutPositions {
  const next = { ...positions };
  for (const proposition of document.propositions) {
    if (proposition.pinned && proposition.position) {
      next[propositionLayoutId(proposition.id)] = proposition.position;
    }
  }
  for (const relationship of document.relationships) {
    if (relationship.pinned && relationship.position) {
      next[relationshipLayoutId(relationship.id)] = relationship.position;
    }
  }
  return next;
}

function isPinned(document: GraphDocument, layoutId: string): boolean {
  if (layoutId.startsWith("proposition:")) {
    return document.propositions.some(
      ({ id, pinned }) => propositionLayoutId(id) === layoutId && pinned,
    );
  }
  return document.relationships.some(
    ({ id, pinned }) => relationshipLayoutId(id) === layoutId && pinned,
  );
}

function overlaps(a: Point, aSize: ItemSize, b: Point, bSize: ItemSize, padding: number): boolean {
  return (
    a.x < b.x + bSize.width + padding &&
    a.x + aSize.width + padding > b.x &&
    a.y < b.y + bSize.height + padding &&
    a.y + aSize.height + padding > b.y
  );
}

export function resolveOverlaps(
  document: GraphDocument,
  initial: LayoutPositions,
  sizes: ItemSizes,
  padding = 34,
): LayoutPositions {
  const positions = structuredClone(initial);
  const ids = Object.keys(positions).sort();

  for (let pass = 0; pass < ids.length * 3; pass += 1) {
    let changed = false;
    for (let left = 0; left < ids.length; left += 1) {
      for (let right = left + 1; right < ids.length; right += 1) {
        const aId = ids[left];
        const bId = ids[right];
        const a = positions[aId];
        const b = positions[bId];
        const aSize = sizes[aId];
        const bSize = sizes[bId];
        if (!a || !b || !aSize || !bSize || !overlaps(a, aSize, b, bSize, padding)) continue;

        const aPinned = isPinned(document, aId);
        const bPinned = isPinned(document, bId);
        if (aPinned && bPinned) continue;
        const moveId = bPinned ? aId : bId;
        const anchorId = moveId === bId ? aId : bId;
        const move = positions[moveId];
        const anchor = positions[anchorId];
        const moveSize = sizes[moveId];
        const anchorSize = sizes[anchorId];
        const horizontal = anchor.x + anchorSize.width + padding - move.x;
        const vertical = anchor.y + anchorSize.height + padding - move.y;
        if (Math.abs(horizontal) < Math.abs(vertical)) {
          move.x += Math.max(1, horizontal);
        } else {
          move.y += Math.max(1, vertical);
        }
        changed = true;
      }
    }
    if (!changed) break;
  }
  return positions;
}

export function normalizeLayout(
  document: GraphDocument,
  positions: LayoutPositions,
  sizes: ItemSizes,
): LayoutPositions {
  return resolveOverlaps(document, applyPinnedPositions(document, positions), sizes);
}
