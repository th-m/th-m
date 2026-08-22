import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelection, type GraphCanvasRef, type GraphNode } from "reagraph";
import { graphToReagraph, kindFromLayoutId, selectionFromLayoutId, entityIdFromLayoutId } from "./canvas";
import { CommitField } from "./CommitField";
import { ThomGraphCanvas } from "./GraphCanvas";
import { Inspector } from "./Inspector";
import { LibraryPanel } from "./LibraryPanel";
import { downloadText, slugifyFilename } from "./exportText";
import {
  commitHistory,
  createHistory,
  redoHistory,
  type HistoryState,
  undoHistory,
} from "./history";
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
import type { GraphDocument, GraphLibrary, Selection } from "./types";

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

function GraphWorkspace() {
  const [state, setState] = useState(initialEditorState);
  const [selection, setSelection] = useState<Selection>(null);
  const [selectedPropositionIds, setSelectedPropositionIds] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const canvasRef = useRef<GraphCanvasRef | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const document = state.history.present;

  const dispatch = useCallback((action: EditorAction) => {
    setState((current) => editorReducer(current, action));
  }, []);

  const updateDocument = useCallback(
    (update: (current: GraphDocument) => GraphDocument) => dispatch({ type: "update", update }),
    [dispatch],
  );

  useEffect(() => saveGraphLibrary(state.library), [state.library]);

  const data = useMemo(() => graphToReagraph(document), [document]);

  const selectionApi = useSelection({
    ref: canvasRef,
    nodes: data.nodes,
    edges: data.edges,
    type: "multiModifier",
    focusOnSelect: false,
    onSelection: (ids) => {
      const propositionIds = ids
        .filter((id) => kindFromLayoutId(id) === "proposition")
        .map((id) => entityIdFromLayoutId(id));
      setSelectedPropositionIds((current) =>
        current.length === propositionIds.length && current.every((id, index) => id === propositionIds[index])
          ? current
          : propositionIds,
      );
      const nextSelection = ids.length === 1 ? selectionFromLayoutId(ids[0]) : null;
      setSelection((current) =>
        current?.kind === nextSelection?.kind && current?.id === nextSelection?.id
          ? current
          : nextSelection,
      );
    },
  });

  const resetSelection = useCallback(() => {
    selectionApi.clearSelections();
    setSelection(null);
    setSelectedPropositionIds([]);
  }, [selectionApi]);

  useEffect(() => {
    resetSelection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document.id]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleNodeDoubleClick = useCallback(
    (layoutId: string) => {
      const next = selectionFromLayoutId(layoutId);
      if (!next) return;
      selectionApi.clearSelections([layoutId]);
      setSelection(next);
      setInspectorOpen(true);
    },
    [selectionApi],
  );

  const deleteSelection = useCallback(() => {
    if (!selection) return;
    updateDocument((current) =>
      selection.kind === "proposition"
        ? removeProposition(current, selection.id)
        : removeRelationship(current, selection.id),
    );
    resetSelection();
  }, [selection, updateDocument, resetSelection]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        dispatch({ type: event.shiftKey ? "redo" : "undo" });
        return;
      }
      if (event.key === "Backspace" || event.key === "Delete") {
        if (selection) {
          event.preventDefault();
          deleteSelection();
        }
      }
      if (event.key === "Escape") resetSelection();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dispatch, selection, deleteSelection, resetSelection]);

  const exportPng = useCallback(() => {
    const dataUrl = canvasRef.current?.exportCanvas();
    if (!dataUrl) return;
    const link = globalThis.document.createElement("a");
    link.href = dataUrl;
    link.download = `${slugifyFilename(document.name)}.png`;
    link.click();
    setToast("Canvas PNG exported.");
  }, [document]);

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

  const layoutLabel = document.layoutMode === "directional" ? "Directional flow" : "Force-directed";

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

      <section className="graph-stage" aria-label="Graph canvas">
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
              title="Select at least two proposition circles (meta/ctrl-click to select more)"
              onClick={() => {
                updateDocument((current) =>
                  addRelationship(current, selectedPropositionIds, "Describe this shared relationship"),
                );
                resetSelection();
              }}
            >
              + Relationship ({selectedPropositionIds.length})
            </button>
          </div>
          <div className="graph-toolbar-secondary">
            <span className="graph-layout-status is-settled"><i />{layoutLabel}</span>
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
            <button className="graph-button" onClick={() => canvasRef.current?.fitNodesInView(undefined, { animated: true })}>Fit</button>
            <details className="graph-export-menu">
              <summary className="graph-button">Export</summary>
              <div>
                <button onClick={exportPng}>Canvas PNG</button>
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
          <ThomGraphCanvas
            ref={canvasRef}
            nodes={data.nodes}
            edges={data.edges}
            selections={selectionApi.selections}
            actives={selectionApi.actives}
            layoutMode={document.layoutMode}
            density="auto"
            draggable
            onNodeClick={(layoutId) =>
              selectionApi.onNodeClick?.({ id: layoutId } as unknown as GraphNode)
            }
            onNodeDoubleClick={handleNodeDoubleClick}
            onNodeKeyboardActivate={handleNodeDoubleClick}
            keyboardActionLabel="Edit"
            onNodeDragged={(layoutId, position) => {
              const kind = kindFromLayoutId(layoutId);
              const entityId = entityIdFromLayoutId(layoutId);
              if (kind === "proposition") {
                updateDocument((current) => ({
                  ...current,
                  updatedAt: new Date().toISOString(),
                  propositions: current.propositions.map((item) =>
                    item.id === entityId ? { ...item, pinned: true, position } : item,
                  ),
                }));
              } else if (kind === "relationship") {
                updateDocument((current) => ({
                  ...current,
                  updatedAt: new Date().toISOString(),
                  relationships: current.relationships.map((item) =>
                    item.id === entityId ? { ...item, pinned: true, position } : item,
                  ),
                }));
              }
            }}
            onCanvasClick={() => selectionApi.onCanvasClick?.({ button: 0 } as MouseEvent)}
          />
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
 * Full proposition-graph authoring editor: library, reagraph canvas, toolbar,
 * and inspector. Shared by the local authoring tool and the portfolio route.
 * Nodes are added from the toolbar; relationships are created by selecting two
 * or more propositions (meta/ctrl-click) and confirming from the toolbar.
 * Editing happens in the inspector (double-click a node to open it).
 */
export function PropositionGraphEditor() {
  return <GraphWorkspace />;
}
