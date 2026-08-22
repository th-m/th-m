import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  applyNodeChanges,
  type Connection,
  type Edge,
  type NodeChange,
  type ReactFlowInstance,
} from "@xyflow/react";
import ELK, { type ELK as ElkInstance } from "elkjs/lib/elk-api.js";
import ElkWorker from "elkjs/lib/elk-worker.min.js?worker";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CommitField } from "./CommitField";
import {
  type GraphFlowNode,
  PropositionNode,
  RelationshipNode,
} from "./GraphNodes";
import { Inspector } from "./Inspector";
import { LibraryPanel } from "./LibraryPanel";
import { createGraphSvg, downloadText, slugifyFilename } from "./exportSvg";
import {
  commitHistory,
  createHistory,
  redoHistory,
  type HistoryState,
  undoHistory,
} from "./history";
import {
  buildElkGraph,
  estimateDocumentSizes,
  isCurrentLayoutRequest,
  normalizeLayout,
  positionsFromElk,
  propositionLayoutId,
  relationshipLayoutId,
} from "./layout";
import {
  addDocument,
  addProposition,
  addRelationship,
  createBlankDocument,
  deleteDocument,
  duplicateDocument,
  removeProposition,
  removeRelationship,
  replaceDocument,
} from "./model";
import {
  exportGraphDocument,
  importGraphDocument,
  loadGraphLibrary,
  saveGraphLibrary,
} from "./storage";
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

interface EditorState {
  library: GraphLibrary;
  history: HistoryState<GraphDocument>;
}

type EditorAction =
  | { type: "update"; update: (document: GraphDocument) => GraphDocument }
  | { type: "undo" }
  | { type: "redo" }
  | { type: "switch"; id: string }
  | { type: "create" }
  | { type: "duplicate" }
  | { type: "delete" }
  | { type: "import"; document: GraphDocument };

function syncState(library: GraphLibrary, history: HistoryState<GraphDocument>): EditorState {
  return { library: replaceDocument(library, history.present), history };
}

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  if (action.type === "update") {
    const next = action.update(state.history.present);
    return syncState(state.library, commitHistory(state.history, next));
  }
  if (action.type === "undo") return syncState(state.library, undoHistory(state.history));
  if (action.type === "redo") return syncState(state.library, redoHistory(state.history));
  if (action.type === "switch") {
    const document = state.library.documents.find(({ id }) => id === action.id);
    if (!document) return state;
    return {
      library: { ...state.library, activeDocumentId: document.id },
      history: createHistory(document),
    };
  }
  if (action.type === "create") {
    const document = createBlankDocument();
    return { library: addDocument(state.library, document), history: createHistory(document) };
  }
  if (action.type === "duplicate") {
    const document = duplicateDocument(state.history.present);
    return { library: addDocument(state.library, document), history: createHistory(document) };
  }
  if (action.type === "import") {
    return {
      library: addDocument(state.library, action.document),
      history: createHistory(action.document),
    };
  }
  const library = deleteDocument(state.library, state.history.present.id);
  const document = library.documents.find(({ id }) => id === library.activeDocumentId) ?? library.documents[0];
  return { library, history: createHistory(document) };
}

function initialEditorState(): EditorState {
  const library = loadGraphLibrary();
  const document =
    library.documents.find(({ id }) => id === library.activeDocumentId) ?? library.documents[0];
  return { library, history: createHistory(document) };
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

function entitySelection(node: GraphFlowNode): Selection {
  return node.type === "proposition"
    ? { kind: "proposition", id: node.data.entityId }
    : { kind: "relationship", id: node.data.entityId };
}

function GraphWorkspace() {
  const [state, setState] = useState(initialEditorState);
  const [nodes, setNodes] = useState<GraphFlowNode[]>([]);
  const [positions, setPositions] = useState<LayoutPositions>(() =>
    fallbackPositions(state.history.present),
  );
  const [selection, setSelection] = useState<Selection>(null);
  const [selectedPropositionIds, setSelectedPropositionIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [composing, setComposing] = useState(false);
  const [layoutState, setLayoutState] = useState<"settled" | "working" | "paused" | "error">(
    "working",
  );
  const [toast, setToast] = useState<string | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [flow, setFlow] = useState<ReactFlowInstance<GraphFlowNode, Edge> | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const elkRef = useRef<ElkInstance | null>(null);
  const latestRequestRef = useRef(0);
  const documentRef = useRef(state.history.present);
  const sizesRef = useRef<ItemSizes>({});

  const document = state.history.present;
  documentRef.current = document;

  const dispatch = useCallback((action: EditorAction) => {
    setState((current) => editorReducer(current, action));
  }, []);

  const updateDocument = useCallback(
    (update: (current: GraphDocument) => GraphDocument) => dispatch({ type: "update", update }),
    [dispatch],
  );

  useEffect(() => saveGraphLibrary(state.library), [state.library]);

  useEffect(() => {
    setPositions(fallbackPositions(document));
    setSelection(null);
    setSelectedPropositionIds([]);
    setEditingId(null);
  }, [document.id]);

  useEffect(() => {
    const elk = new ELK({ workerFactory: () => new ElkWorker() });
    elkRef.current = elk;
    return () => elk.terminateWorker();
  }, []);

  const estimatedSizes = useMemo(() => estimateDocumentSizes(document), [document]);
  const measuredSizes = useMemo(
    () =>
      Object.fromEntries(
        nodes
          .filter((node) => node.measured?.width && node.measured?.height)
          .map((node) => [
            node.id,
            { width: node.measured?.width ?? 0, height: node.measured?.height ?? 0 },
          ]),
      ),
    [nodes],
  );
  const sizes = useMemo(() => ({ ...estimatedSizes, ...measuredSizes }), [estimatedSizes, measuredSizes]);
  sizesRef.current = sizes;
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
    if (dragging || composing) {
      setLayoutState("paused");
      return;
    }
    const timer = window.setTimeout(() => {
      const requestSizes = sizesRef.current;
      if (!elkRef.current) {
        setPositions((current) => normalizeLayout(document, current, requestSizes));
        setLayoutState("settled");
        return;
      }
      setLayoutState("working");
      void elkRef.current
        .layout(buildElkGraph(document, requestSizes))
        .then((result) => {
          if (!isCurrentLayoutRequest(requestId, latestRequestRef.current)) return;
          setPositions(
            normalizeLayout(documentRef.current, positionsFromElk(result), sizesRef.current),
          );
          setLayoutState("settled");
        })
        .catch((error: unknown) => {
          if (!isCurrentLayoutRequest(requestId, latestRequestRef.current)) return;
          setLayoutState("error");
          setToast(`Layout: ${error instanceof Error ? error.message : "ELK layout failed."}`);
        });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [document, sizeSignature, dragging, composing]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const beginEdit = useCallback((layoutId: string) => setEditingId(layoutId), []);
  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setComposing(false);
  }, []);
  const commitInlineEdit = useCallback(
    (layoutId: string, statement: string) => {
      if (layoutId.startsWith("proposition:")) {
        const id = layoutId.slice("proposition:".length);
        updateDocument((current) => ({
          ...current,
          updatedAt: new Date().toISOString(),
          propositions: current.propositions.map((item) =>
            item.id === id ? { ...item, statement } : item,
          ),
        }));
      } else {
        const id = layoutId.slice("relationship:".length);
        updateDocument((current) => ({
          ...current,
          updatedAt: new Date().toISOString(),
          relationships: current.relationships.map((item) =>
            item.id === id ? { ...item, statement } : item,
          ),
        }));
      }
      setEditingId(null);
      setComposing(false);
    },
    [updateDocument],
  );

  useEffect(() => {
    setNodes((currentNodes) => {
      const currentById = new Map(currentNodes.map((node) => [node.id, node]));
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
              isEditing: editingId === id,
              onBeginEdit: beginEdit,
              onCommit: commitInlineEdit,
              onCancel: cancelEdit,
              onCompositionChange: setComposing,
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
              isEditing: editingId === id,
              onBeginEdit: beginEdit,
              onCommit: commitInlineEdit,
              onCancel: cancelEdit,
              onCompositionChange: setComposing,
            },
            ariaLabel: `Relationship: ${relationship.statement}`,
          } satisfies GraphFlowNode;
        }),
      ];
      return next;
    });
  }, [document, positions, estimatedSizes, editingId, beginEdit, cancelEdit, commitInlineEdit]);

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

  const onNodesChange = useCallback((changes: NodeChange<GraphFlowNode>[]) => {
    setNodes((current) => applyNodeChanges(changes, current));
  }, []);

  const onSelectionChange = useCallback(({ nodes: selectedNodes }: { nodes: GraphFlowNode[] }) => {
    const propositionIds = selectedNodes
      .filter((node) => node.type === "proposition")
      .map((node) => node.data.entityId);
    setSelectedPropositionIds((current) =>
      current.length === propositionIds.length &&
      current.every((id, index) => id === propositionIds[index])
        ? current
        : propositionIds,
    );
    const nextSelection = selectedNodes.length === 1 ? entitySelection(selectedNodes[0]) : null;
    setSelection((current) =>
      current?.kind === nextSelection?.kind && current?.id === nextSelection?.id
        ? current
        : nextSelection,
    );
  }, []);

  const onConnect = useCallback(
    (connection: Connection) => {
      const ids = [connection.source, connection.target]
        .filter((id): id is string => Boolean(id?.startsWith("proposition:")))
        .map((id) => id.slice("proposition:".length));
      if (new Set(ids).size !== 2) return;
      updateDocument((current) => addRelationship(current, ids, "Describe this relationship"));
    },
    [updateDocument],
  );

  const deleteSelection = useCallback(() => {
    if (!selection) return;
    updateDocument((current) =>
      selection.kind === "proposition"
        ? removeProposition(current, selection.id)
        : removeRelationship(current, selection.id),
    );
    setSelection(null);
  }, [selection, updateDocument]);

  const onNodesDelete = useCallback(
    (deleted: GraphFlowNode[]) => {
      updateDocument((current) =>
        deleted.reduce(
          (next, node) =>
            node.type === "proposition"
              ? removeProposition(next, node.data.entityId)
              : removeRelationship(next, node.data.entityId),
          current,
        ),
      );
      setSelection(null);
    },
    [updateDocument],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "z") return;
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      event.preventDefault();
      dispatch({ type: event.shiftKey ? "redo" : "undo" });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dispatch]);

  const exportSvg = useCallback(
    async (mode: "graph" | "poster") => {
      try {
        const svg = await createGraphSvg(document, positions, mode, sizes);
        const suffix = mode === "poster" ? "poster" : "graph";
        downloadText(`${slugifyFilename(document.name)}-${suffix}.svg`, svg, "image/svg+xml");
        setToast(`${mode === "poster" ? "Poster" : "Graph"} SVG exported.`);
      } catch (error) {
        setToast(error instanceof Error ? error.message : "SVG export failed.");
      }
    },
    [document, positions, sizes],
  );

  const importJson = useCallback(async (file: File | undefined) => {
    if (!file) return;
    try {
      const imported = importGraphDocument(await file.text());
      dispatch({ type: "import", document: imported });
      setToast("Imported as a new graph.");
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Import failed.");
    }
  }, [dispatch]);

  const layoutLabel =
    layoutState === "working"
      ? "Balancing…"
      : layoutState === "paused"
        ? "Layout paused"
        : layoutState === "error"
          ? "Layout issue"
          : "Balanced";

  return (
    <main className="graph-app bg-background text-foreground font-mono">
      <input
        ref={importInputRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(event) => {
          void importJson(event.target.files?.[0]);
          event.currentTarget.value = "";
        }}
      />

      <div className={`graph-panel-shell graph-panel-shell--library${libraryOpen ? " is-open" : ""}`}>
        <LibraryPanel
          library={state.library}
          onSelect={(id) => dispatch({ type: "switch", id })}
          onCreate={() => dispatch({ type: "create" })}
          onDuplicate={() => dispatch({ type: "duplicate" })}
          onDelete={() => {
            if (window.confirm(`Delete “${document.name}” from this browser?`)) dispatch({ type: "delete" });
          }}
          onImport={() => importInputRef.current?.click()}
          onClose={() => setLibraryOpen(false)}
        />
      </div>

      <section className={`graph-stage${dragging ? " is-dragging" : ""}`} aria-label="Graph canvas">
        <header className="graph-toolbar">
          <div className="graph-toolbar-primary">
            <button className="graph-icon-button graph-mobile-panel-button" onClick={() => setLibraryOpen(true)} aria-label="Open graph library">☰</button>
            <div className="graph-title-block">
              <CommitField
                label="CURRENT GRAPH"
                value={document.name}
                onCommit={(name) =>
                  updateDocument((current) => ({ ...current, name, updatedAt: new Date().toISOString() }))
                }
              />
            </div>
            <button className="graph-button graph-button--primary" onClick={() => updateDocument((current) => addProposition(current))}>+ Proposition</button>
            <button
              className="graph-button"
              disabled={selectedPropositionIds.length < 2}
              title="Select at least two proposition circles"
              onClick={() =>
                updateDocument((current) =>
                  addRelationship(current, selectedPropositionIds, "Describe this shared relationship"),
                )
              }
            >
              + Relationship ({selectedPropositionIds.length})
            </button>
          </div>
          <div className="graph-toolbar-secondary">
            <span className={`graph-layout-status is-${layoutState}`}><i />{layoutLabel}</span>
            <div className="graph-segmented" aria-label="Layout mode">
              <button
                className={document.layoutMode === "editorial" ? "is-active" : ""}
                aria-pressed={document.layoutMode === "editorial"}
                onClick={() => updateDocument((current) => ({ ...current, layoutMode: "editorial", updatedAt: new Date().toISOString() }))}
              >Editorial</button>
              <button
                className={document.layoutMode === "directional" ? "is-active" : ""}
                aria-pressed={document.layoutMode === "directional"}
                onClick={() => updateDocument((current) => ({ ...current, layoutMode: "directional", updatedAt: new Date().toISOString() }))}
              >Directional</button>
            </div>
            <button className="graph-icon-button" disabled={state.history.past.length === 0} onClick={() => dispatch({ type: "undo" })} aria-label="Undo">↶</button>
            <button className="graph-icon-button" disabled={state.history.future.length === 0} onClick={() => dispatch({ type: "redo" })} aria-label="Redo">↷</button>
            <button className="graph-button" onClick={() => flow?.fitView({ padding: 0.12, duration: 500 })}>Fit</button>
            <details className="graph-export-menu">
              <summary className="graph-button">Export</summary>
              <div>
                <button onClick={() => void exportSvg("graph")}>Graph SVG</button>
                <button onClick={() => void exportSvg("poster")}>1600 × 1000 poster SVG</button>
                <button
                  onClick={() =>
                    downloadText(
                      `${slugifyFilename(document.name)}.json`,
                      exportGraphDocument(document),
                      "application/json",
                    )
                  }
                >Portable JSON</button>
              </div>
            </details>
            <button className="graph-icon-button graph-mobile-panel-button" onClick={() => setInspectorOpen(true)} aria-label="Open inspector">⌘</button>
          </div>
        </header>

        <div className="graph-canvas">
          <ReactFlow<GraphFlowNode, Edge>
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onInit={setFlow}
            onNodesChange={onNodesChange}
            onNodesDelete={onNodesDelete}
            onConnect={onConnect}
            onNodeDragStart={() => setDragging(true)}
            onNodeDragStop={(_, node) => {
              setDragging(false);
              const position = { x: node.position.x, y: node.position.y };
              updateDocument((current) =>
                node.type === "proposition"
                  ? {
                      ...current,
                      updatedAt: new Date().toISOString(),
                      propositions: current.propositions.map((item) =>
                        item.id === node.data.entityId ? { ...item, pinned: true, position } : item,
                      ),
                    }
                  : {
                      ...current,
                      updatedAt: new Date().toISOString(),
                      relationships: current.relationships.map((item) =>
                        item.id === node.data.entityId ? { ...item, pinned: true, position } : item,
                      ),
                    },
              );
            }}
            onSelectionChange={onSelectionChange}
            isValidConnection={(connection) =>
              connection.source !== connection.target &&
              Boolean(connection.source?.startsWith("proposition:")) &&
              Boolean(connection.target?.startsWith("proposition:"))
            }
            selectionOnDrag
            panOnDrag={[1, 2]}
            multiSelectionKeyCode={["Meta", "Control"]}
            deleteKeyCode={["Backspace", "Delete"]}
            minZoom={0.16}
            maxZoom={2.2}
            fitView
            fitViewOptions={{ padding: 0.14 }}
            colorMode="dark"
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={28} size={1} color={thomTheme.color.border} />
            <Controls showInteractive={false} />
            <MiniMap
              pannable
              zoomable
              nodeColor={(node) => node.type === "relationship" ? thomTheme.color.primary : thomTheme.color.foreground}
              maskColor={thomTheme.color.scrim}
            />
          </ReactFlow>
        </div>
      </section>

      <div className={`graph-panel-shell graph-panel-shell--inspector${inspectorOpen ? " is-open" : ""}`}>
        <Inspector
          document={document}
          selection={selection}
          onUpdateDocument={updateDocument}
          onDeleteSelection={deleteSelection}
          onClose={() => setInspectorOpen(false)}
        />
      </div>
      {toast && <div className="graph-toast" role="status">{toast}</div>}
    </main>
  );
}

/**
 * Full proposition-graph authoring editor: library, canvas, toolbar, and
 * inspector. Shared by the local authoring tool and the portfolio route.
 */
export function PropositionGraphEditor() {
  return (
    <ReactFlowProvider>
      <GraphWorkspace />
    </ReactFlowProvider>
  );
}
