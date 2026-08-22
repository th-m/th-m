import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type ReactFlowInstance,
} from "@xyflow/react";
import ELK, { type ELK as ElkInstance } from "elkjs/lib/elk-api.js";
import ElkWorker from "elkjs/lib/elk-worker.min.js?worker";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type GraphFlowNode, PropositionNode, RelationshipNode } from "./GraphNodes";
import { createGraphSvg, downloadText, slugifyFilename } from "./exportSvg";
import {
  buildElkGraph,
  estimateDocumentSizes,
  isCurrentLayoutRequest,
  normalizeLayout,
  positionsFromElk,
  propositionLayoutId,
  relationshipLayoutId,
} from "./layout";
import { exportGraphDocument, loadGraphLibrary } from "./storage";
import { thomTheme } from "./theme";
import type {
  GraphDocument,
  GraphLibrary,
  ItemSizes,
  LayoutPositions,
  Selection,
} from "./types";

const nodeTypes = {
  proposition: PropositionNode,
  relationship: RelationshipNode,
};

export interface RelationshipGraphExplorerProps {
  /** Optional graph id to open initially (e.g. from an article's openTool call). */
  initialGraphId?: string;
}

function fallbackPositions(document: GraphDocument): LayoutPositions {
  const positions: LayoutPositions = {};
  document.propositions.forEach((proposition, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    positions[propositionLayoutId(proposition.id)] =
      proposition.pinned && proposition.position
        ? proposition.position
        : { x: column * 390, y: row * 390 };
  });
  document.relationships.forEach((relationship, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    positions[relationshipLayoutId(relationship.id)] =
      relationship.pinned && relationship.position
        ? relationship.position
        : { x: column * 390 + 215, y: row * 390 + 270 };
  });
  return positions;
}

function noopEditing() {
  /* Read-only explorer: nodes never enter edit mode. */
}

function ExplorerWorkspace({ initialGraphId }: RelationshipGraphExplorerProps) {
  const [library] = useState<GraphLibrary>(() => loadGraphLibrary());
  const [documentId, setDocumentId] = useState<string>(() => {
    const requested = library.documents.find(({ id }) => id === initialGraphId);
    return requested?.id ?? library.activeDocumentId;
  });
  const [nodes, setNodes] = useState<GraphFlowNode[]>([]);
  const [positions, setPositions] = useState<LayoutPositions>(() => {
    const document = library.documents.find(({ id }) => id === documentId) ?? library.documents[0];
    return fallbackPositions(document);
  });
  const [selection, setSelection] = useState<Selection>(null);
  const [layoutState, setLayoutState] = useState<"working" | "settled" | "error">("working");
  const [flow, setFlow] = useState<ReactFlowInstance<GraphFlowNode, Edge> | null>(null);
  const elkRef = useRef<ElkInstance | null>(null);
  const latestRequestRef = useRef(0);
  const documentRef = useRef<GraphDocument | null>(null);

  const document =
    library.documents.find(({ id }) => id === documentId) ?? library.documents[0];
  documentRef.current = document;

  useEffect(() => {
    setPositions(fallbackPositions(document));
    setSelection(null);
  }, [document]);

  useEffect(() => {
    const elk = new ELK({ workerFactory: () => new ElkWorker() });
    elkRef.current = elk;
    return () => elk.terminateWorker();
  }, []);

  const estimatedSizes = useMemo(() => estimateDocumentSizes(document), [document]);
  const sizes = estimatedSizes;
  const sizeSignature = useMemo(
    () =>
      Object.entries(sizes)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([id, size]) => `${id}:${Math.round(size.width)}x${Math.round(size.height)}`)
        .join("|"),
    [sizes],
  );

  useEffect(() => {
    latestRequestRef.current += 1;
    const requestId = latestRequestRef.current;
    const timer = window.setTimeout(() => {
      if (!elkRef.current) {
        setPositions((current) => normalizeLayout(document, current, sizes));
        setLayoutState("settled");
        return;
      }
      setLayoutState("working");
      void elkRef.current
        .layout(buildElkGraph(document, sizes))
        .then((result) => {
          if (!isCurrentLayoutRequest(requestId, latestRequestRef.current)) return;
          setPositions(
            normalizeLayout(documentRef.current ?? document, positionsFromElk(result), sizes),
          );
          setLayoutState("settled");
        })
        .catch(() => {
          if (!isCurrentLayoutRequest(requestId, latestRequestRef.current)) return;
          setLayoutState("error");
        });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [document, sizeSignature]);

  useEffect(() => {
    const timer = window.setTimeout(() => flow?.fitView({ padding: 0.14, duration: 350 }), 360);
    return () => window.clearTimeout(timer);
  }, [document.id, flow]);

  const focus = useMemo(() => {
    if (!selection) return null;
    const ids = new Set<string>();
    if (selection.kind === "proposition") {
      ids.add(propositionLayoutId(selection.id));
      for (const relationship of document.relationships) {
        if (!relationship.participants.some(({ nodeId }) => nodeId === selection.id)) continue;
        ids.add(relationshipLayoutId(relationship.id));
        for (const { nodeId } of relationship.participants) {
          ids.add(propositionLayoutId(nodeId));
        }
      }
    } else {
      ids.add(relationshipLayoutId(selection.id));
      const relationship = document.relationships.find(({ id }) => id === selection.id);
      for (const { nodeId } of relationship?.participants ?? []) {
        ids.add(propositionLayoutId(nodeId));
      }
    }
    return ids;
  }, [selection, document]);

  const nodesWithState = useMemo<GraphFlowNode[]>(() => {
    const currentById = new Map(nodes.map((node) => [node.id, node]));
    const next: GraphFlowNode[] = [
      ...document.propositions.map((proposition, index) => {
        const id = propositionLayoutId(proposition.id);
        const previous = currentById.get(id);
        const size = estimatedSizes[id];
        return {
          ...(previous?.type === "proposition" ? previous : {}),
          id,
          type: "proposition" as const,
          position: positions[id] ?? { x: index * 340, y: 0 },
          style: { width: size.width, height: size.height },
          data: {
            entityId: proposition.id,
            statement: proposition.statement,
            emphasis: proposition.emphasis,
            code: `P.${String(index + 1).padStart(2, "0")}`,
            isEditing: false,
            onBeginEdit: noopEditing,
            onCommit: noopEditing,
            onCancel: noopEditing,
            onCompositionChange: noopEditing,
            dimmed: focus !== null && !focus.has(id),
          },
          ariaLabel: `Proposition: ${proposition.statement}`,
        } satisfies GraphFlowNode;
      }),
      ...document.relationships.map((relationship, index) => {
        const id = relationshipLayoutId(relationship.id);
        const previous = currentById.get(id);
        const size = estimatedSizes[id];
        return {
          ...(previous?.type === "relationship" ? previous : {}),
          id,
          type: "relationship" as const,
          position: positions[id] ?? { x: index * 360, y: 340 },
          style: { width: size.width, height: size.height },
          data: {
            entityId: relationship.id,
            statement: relationship.statement,
            code: `R.${String(index + 1).padStart(2, "0")}`,
            isEditing: false,
            onBeginEdit: noopEditing,
            onCommit: noopEditing,
            onCancel: noopEditing,
            onCompositionChange: noopEditing,
            dimmed: focus !== null && !focus.has(id),
          },
          ariaLabel: `Relationship: ${relationship.statement}`,
        } satisfies GraphFlowNode;
      }),
    ];
    return next;
  }, [document, positions, estimatedSizes, nodes, focus]);

  const edges = useMemo<Edge[]>(
    () =>
      document.relationships.flatMap((relationship) =>
        relationship.participants.map((participant) => ({
          id: `${relationship.id}:${participant.nodeId}`,
          source: propositionLayoutId(participant.nodeId),
          target: relationshipLayoutId(relationship.id),
          sourceHandle: "source-right",
          targetHandle: "relation-target",
          type: document.layoutMode === "directional" ? "smoothstep" : "default",
          selectable: false,
          ariaLabel: `${participant.nodeId} participates in ${relationship.statement}`,
          style: { stroke: thomTheme.color.primary, strokeWidth: 2, opacity: 0.8 },
          markerStart: participant.arrowAtNode
            ? { type: MarkerType.ArrowClosed, color: thomTheme.color.primary, width: 18, height: 18 }
            : undefined,
          markerEnd: participant.arrowAtRelation
            ? { type: MarkerType.ArrowClosed, color: thomTheme.color.primary, width: 18, height: 18 }
            : undefined,
        })),
      ),
    [document],
  );

  const onSelectionChange = useCallback(({ nodes: selected }: { nodes: GraphFlowNode[] }) => {
    setSelection((current) => {
      if (selected.length !== 1) return null;
      const node = selected[0];
      const next: Selection =
        node.type === "proposition"
          ? { kind: "proposition", id: node.data.entityId }
          : { kind: "relationship", id: node.data.entityId };
      return current?.kind === next.kind && current.id === next.id ? current : next;
    });
  }, []);

  const exportSvg = useCallback(async () => {
    const svg = await createGraphSvg(document, positions, "graph", sizes);
    downloadText(`${slugifyFilename(document.name)}-graph.svg`, svg, "image/svg+xml");
  }, [document, positions, sizes]);

  const exportJson = useCallback(() => {
    downloadText(
      `${slugifyFilename(document.name)}.json`,
      exportGraphDocument(document),
      "application/json",
    );
  }, [document]);

  const selectedProposition =
    selection?.kind === "proposition"
      ? document.propositions.find(({ id }) => id === selection.id)
      : undefined;
  const selectedRelationship =
    selection?.kind === "relationship"
      ? document.relationships.find(({ id }) => id === selection.id)
      : undefined;

  const propositionRelationships = selectedProposition
    ? document.relationships.filter((relationship) =>
        relationship.participants.some(({ nodeId }) => nodeId === selectedProposition.id),
      )
    : [];
  const relationshipParticipants = selectedRelationship
    ? selectedRelationship.participants
        .map(({ nodeId }) => document.propositions.find(({ id }) => id === nodeId))
        .filter((proposition): proposition is NonNullable<typeof proposition> => Boolean(proposition))
    : [];

  const statusLabel =
    layoutState === "working"
      ? "Balancing…"
      : layoutState === "error"
        ? "Layout issue"
        : "Balanced";

  return (
    <div className="graph-explorer" aria-label="Relationship graph explorer">
      <div className="graph-explorer__bar">
        <label>
          Graph
          <select
            value={document.id}
            aria-label="Choose a graph"
            onChange={(event) => setDocumentId(event.target.value)}
          >
            {library.documents.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name}
              </option>
            ))}
          </select>
        </label>
        <div className="graph-explorer__actions">
          <button type="button" className="graph-explorer__action" onClick={() => void exportSvg()}>
            Graph SVG
          </button>
          <button type="button" className="graph-explorer__action" onClick={exportJson}>
            JSON
          </button>
        </div>
      </div>

      <div className="graph-explorer__canvas">
        <ReactFlow<GraphFlowNode, Edge>
          nodes={nodesWithState}
          edges={edges}
          nodeTypes={nodeTypes}
          onInit={setFlow}
          onSelectionChange={onSelectionChange}
          onNodeClick={(_, node) => {
            const next: Selection =
              node.type === "proposition"
                ? { kind: "proposition", id: node.data.entityId }
                : { kind: "relationship", id: node.data.entityId };
            setSelection((current) =>
              current?.kind === next.kind && current.id === next.id ? current : next,
            );
          }}
          onPaneClick={() => setSelection(null)}
          panOnDrag={[1, 2]}
          nodesConnectable={false}
          minZoom={0.16}
          maxZoom={2.2}
          fitView
          fitViewOptions={{ padding: 0.14 }}
          colorMode="dark"
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={28} size={1} color={thomTheme.color.border} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      <p className="graph-explorer__hint" role="status">
        {statusLabel}
        {selection
          ? " · click empty space to clear"
          : " · click a claim to follow its relationships."}
      </p>

      {selectedProposition || selectedRelationship ? (
        <div className="graph-explorer__detail">
          <header>
            <div>
              <p className="graph-eyebrow">
                {selectedProposition ? "Proposition" : "Relationship"}
              </p>
              <h3>{selectedProposition?.statement ?? selectedRelationship?.statement}</h3>
            </div>
            <button
              type="button"
              className="graph-explorer__clear"
              onClick={() => setSelection(null)}
            >
              Clear
            </button>
          </header>
          {selectedProposition && propositionRelationships.length > 0 ? (
            <ul aria-label="Relationships this proposition participates in">
              {propositionRelationships.map((relationship) => {
                const others = relationship.participants
                  .filter(({ nodeId }) => nodeId !== selectedProposition.id)
                  .map(({ nodeId }) =>
                    document.propositions.find(({ id }) => id === nodeId)?.statement,
                  )
                  .filter((statement): statement is string => Boolean(statement));
                return (
                  <li key={relationship.id}>
                    <strong>{relationship.statement}</strong>
                    <em>{others.length > 0 ? `with ${others.join(" · ")}` : "Standalone relation"}</em>
                  </li>
                );
              })}
            </ul>
          ) : null}
          {selectedRelationship && relationshipParticipants.length > 0 ? (
            <ul aria-label="Participating propositions">
              {relationshipParticipants.map((proposition) => (
                <li key={proposition.id}>
                  <strong>{proposition.statement}</strong>
                  <em>Participating proposition</em>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Compact, read-only relationship graph explorer for the portfolio tool
 * drawer: pick a seeded graph, pan and zoom, click a claim to follow its
 * relationships. Shares the model, layout, and export pipeline with the full
 * editor; never mutates the library.
 */
export function RelationshipGraphExplorer({ initialGraphId }: RelationshipGraphExplorerProps) {
  return (
    <ReactFlowProvider>
      <ExplorerWorkspace initialGraphId={initialGraphId} />
    </ReactFlowProvider>
  );
}
