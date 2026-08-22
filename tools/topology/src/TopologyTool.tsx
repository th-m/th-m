import {
  addLayer,
  addLink,
  addNode,
  createBlankTopology,
  exportTopologyDocument,
  loadTopologyLibrary,
  moveLayer,
  moveNode,
  removeLayer,
  removeLink,
  removeNode,
  renameLayer,
  renameNode,
  saveTopologyLibrary,
  setLayerDetail,
  setLinkLabel,
  toggleLinkDashed,
  toggleNodeEmphasis,
  TopologyCanvas,
  type TopologyDocument,
  type TopologyLibrary,
  type TopologyLink,
} from "@th-m/topology-visualization";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GraphCanvasRef } from "reagraph";

function touch(document: TopologyDocument): TopologyDocument {
  return { ...document, updatedAt: new Date().toISOString() };
}

function TopologyWorkspace() {
  const [library, setLibrary] = useState<TopologyLibrary>(() => loadTopologyLibrary());
  const [documentId, setDocumentId] = useState<string>(() => library.activeDocumentId);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [draftSource, setDraftSource] = useState("");
  const [draftTarget, setDraftTarget] = useState("");
  const [draftLabel, setDraftLabel] = useState("");
  const canvasRef = useRef<GraphCanvasRef | null>(null);

  const document =
    library.documents.find(({ id }) => id === documentId) ?? library.documents[0];

  const updateDocument = useCallback(
    (update: (current: TopologyDocument) => TopologyDocument) => {
      setLibrary((current) => ({
        ...current,
        activeDocumentId: documentId,
        documents: current.documents.map((candidate) =>
          candidate.id === documentId ? touch(update(candidate)) : candidate,
        ),
      }));
    },
    [documentId],
  );

  useEffect(() => saveTopologyLibrary(library), [library]);


  const selectedNode = useMemo(
    () => document.nodes.find((node) => node.id === selectedNodeId) ?? null,
    [document, selectedNodeId],
  );

  const addLinkFromDraft = useCallback(() => {
    if (!draftSource || !draftTarget) return;
    updateDocument((current) => addLink(current, draftSource, draftTarget, draftLabel || undefined));
    setDraftLabel("");
  }, [draftSource, draftTarget, draftLabel, updateDocument]);

  const createDocument = useCallback(() => {
    const blank = createBlankTopology();
    const withLayer = addLayer(blank, "Layer 1");
    setLibrary((current) => ({
      schemaVersion: 1,
      activeDocumentId: withLayer.id,
      documents: [...current.documents, withLayer],
    }));
    setDocumentId(withLayer.id);
    setSelectedNodeId(null);
  }, []);

  const nodeOptions = document.nodes;
  const layerOptions = document.layers;

  return (
    <main className="topology-tool bg-background text-foreground font-mono">
      <header className="topology-toolbar">
        <div className="topology-toolbar-primary">
          <label className="topology-picker">
            TOPOLOGY
            <select
              value={document.id}
              aria-label="Choose a topology"
              onChange={(event) => {
                setDocumentId(event.target.value);
                setSelectedNodeId(null);
              }}
            >
              {library.documents.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.name}
                </option>
              ))}
            </select>
          </label>
          <input
            className="topology-title-input"
            aria-label="Topology name"
            value={document.name}
            onChange={(event) =>
              updateDocument((current) => ({ ...current, name: event.target.value }))
            }
          />
          <button className="topology-button" onClick={createDocument}>+ New</button>
          <button
            className="topology-button topology-button--primary"
            onClick={() => {
              const layerId = document.layers[0]?.id;
              if (layerId) updateDocument((current) => addNode(current, layerId));
            }}
            disabled={document.layers.length === 0}
          >+ Node</button>
        </div>
        <div className="topology-toolbar-secondary">
          <div className="topology-segmented" aria-label="Layout direction">
            <button
              className={document.layoutDirection === "lr" ? "is-active" : ""}
              aria-pressed={document.layoutDirection === "lr"}
              onClick={() =>
                updateDocument((current) => ({ ...current, layoutDirection: "lr" }))
              }
            >Left → Right</button>
            <button
              className={document.layoutDirection === "td" ? "is-active" : ""}
              aria-pressed={document.layoutDirection === "td"}
              onClick={() =>
                updateDocument((current) => ({ ...current, layoutDirection: "td" }))
              }
            >Top → Down</button>
          </div>
          <button className="topology-button" onClick={() => canvasRef.current?.fitNodesInView(undefined, { animated: true })}>Fit</button>
          <details className="topology-export-menu">
            <summary className="topology-button">Export</summary>
            <div>
              <button
                onClick={() => {
                  const dataUrl = canvasRef.current?.exportCanvas();
                  if (!dataUrl) return;
                  const link = globalThis.document.createElement("a");
                  link.href = dataUrl;
                  link.download = `${document.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
                  link.click();
                }}
              >Canvas PNG</button>
              <button
                onClick={() => {
                  const link = globalThis.document.createElement("a");
                  const url = URL.createObjectURL(
                    new Blob([exportTopologyDocument(document)], { type: "application/json" }),
                  );
                  link.href = url;
                  link.download = `${document.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.json`;
                  link.click();
                  URL.revokeObjectURL(url);
                }}
              >Portable JSON (for gen)</button>
            </div>
          </details>
        </div>
      </header>

      <div className="topology-shell">
        <aside className="topology-panel topology-layers" aria-label="Layers">
          <div className="topology-panel-heading">
            <h2>Layers</h2>
            <button className="topology-icon-button" onClick={() => updateDocument((current) => addLayer(current))} aria-label="Add layer">+</button>
          </div>
          <div className="topology-layers-list">
            {layerOptions.map((layer, index) => (
              <section key={layer.id} className="topology-layer-card">
                <div className="topology-layer-row">
                  <span className="topology-layer-index">{String(index + 1).padStart(2, "0")}</span>
                  <input
                    aria-label={`Layer ${index + 1} name`}
                    value={layer.name}
                    onChange={(event) =>
                      updateDocument((current) => renameLayer(current, layer.id, event.target.value))
                    }
                  />
                  <button
                    className="topology-icon-button"
                    disabled={index === 0}
                    onClick={() => updateDocument((current) => moveLayer(current, layer.id, -1))}
                    aria-label="Move layer left"
                  >←</button>
                  <button
                    className="topology-icon-button"
                    disabled={index === layerOptions.length - 1}
                    onClick={() => updateDocument((current) => moveLayer(current, layer.id, 1))}
                    aria-label="Move layer right"
                  >→</button>
                  <button
                    className="topology-icon-button topology-icon-button--danger"
                    onClick={() => {
                      if (window.confirm(`Delete layer “${layer.name}” and its nodes?`)) {
                        updateDocument((current) => removeLayer(current, layer.id));
                        setSelectedNodeId(null);
                      }
                    }}
                    aria-label={`Delete layer ${layer.name}`}
                  >✕</button>
                </div>
                <input
                  className="topology-layer-detail"
                  aria-label={`Layer ${index + 1} detail`}
                  placeholder="What this layer owns…"
                  value={layer.detail ?? ""}
                  onChange={(event) =>
                    updateDocument((current) => setLayerDetail(current, layer.id, event.target.value))
                  }
                />
                <ul className="topology-node-list">
                  {document.nodes
                    .filter((node) => node.layerId === layer.id)
                    .map((node) => (
                      <li key={node.id} className={node.id === selectedNodeId ? "is-selected" : ""}>
                        <button
                          className="topology-node-pick"
                          onClick={() => setSelectedNodeId(node.id === selectedNodeId ? null : node.id)}
                        >
                          {node.label || "Untitled node"}
                        </button>
                        <button
                          className={`topology-icon-button${node.emphasis ? " is-emphasis" : ""}`}
                          onClick={() => updateDocument((current) => toggleNodeEmphasis(current, node.id))}
                          aria-label={`Toggle emphasis for ${node.label}`}
                        >★</button>
                        <button
                          className="topology-icon-button topology-icon-button--danger"
                          onClick={() => updateDocument((current) => removeNode(current, node.id))}
                          aria-label={`Delete node ${node.label}`}
                        >✕</button>
                      </li>
                    ))}
                </ul>
                <button
                  className="topology-node-add"
                  onClick={() => updateDocument((current) => addNode(current, layer.id))}
                >+ node in {layer.name}</button>
              </section>
            ))}
            {layerOptions.length === 0 ? (
              <p className="topology-empty">No layers yet — add one to start.</p>
            ) : null}
          </div>
        </aside>

        <section className="topology-canvas" aria-label="Topology canvas">
          <TopologyCanvas
            ref={canvasRef}
            document={document}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            onNodeDragged={(nodeId, position) =>
              updateDocument((current) => ({
                ...current,
                nodes: current.nodes.map((node) =>
                  node.id === nodeId ? { ...node, pinned: true, position } : node,
                ),
              }))
            }
          />
        </section>

        <aside className="topology-panel topology-side" aria-label="Inspector and links">
          <div className="topology-panel-heading">
            <h2>Inspector</h2>
          </div>
          {selectedNode ? (
            <div className="topology-inspector">
              <p className="topology-eyebrow">SELECTED NODE</p>
              <label className="topology-field">
                <span>Label</span>
                <input
                  value={selectedNode.label}
                  onChange={(event) =>
                    updateDocument((current) => renameNode(current, selectedNode.id, event.target.value))
                  }
                />
              </label>
              <label className="topology-field">
                <span>Layer</span>
                <select
                  value={selectedNode.layerId}
                  onChange={(event) =>
                    updateDocument((current) => moveNode(current, selectedNode.id, event.target.value))
                  }
                >
                  {layerOptions.map((layer) => (
                    <option key={layer.id} value={layer.id}>{layer.name}</option>
                  ))}
                </select>
              </label>
              <label className="topology-check">
                <input
                  type="checkbox"
                  checked={Boolean(selectedNode.emphasis)}
                  onChange={() => updateDocument((current) => toggleNodeEmphasis(current, selectedNode.id))}
                />
                Emphasis node
              </label>
              <button
                className="topology-button topology-button--error"
                onClick={() => {
                  updateDocument((current) => removeNode(current, selectedNode.id));
                  setSelectedNodeId(null);
                }}
              >Delete node</button>
            </div>
          ) : (
            <p className="topology-empty">Click a node to edit it.</p>
          )}

          <div className="topology-panel-heading">
            <h2>Links</h2>
          </div>
          <div className="topology-link-form">
            <label className="topology-field">
              <span>Source</span>
              <select value={draftSource} aria-label="Link source" onChange={(event) => setDraftSource(event.target.value)}>
                <option value="">—</option>
                {nodeOptions.map((node) => (
                  <option key={node.id} value={node.id}>{node.label || node.id}</option>
                ))}
              </select>
            </label>
            <label className="topology-field">
              <span>Target</span>
              <select value={draftTarget} aria-label="Link target" onChange={(event) => setDraftTarget(event.target.value)}>
                <option value="">—</option>
                {nodeOptions.map((node) => (
                  <option key={node.id} value={node.id}>{node.label || node.id}</option>
                ))}
              </select>
            </label>
            <label className="topology-field">
              <span>Label</span>
              <input
                value={draftLabel}
                aria-label="Link label"
                placeholder="may depend on"
                onChange={(event) => setDraftLabel(event.target.value)}
              />
            </label>
            <button
              className="topology-button topology-button--primary"
              disabled={!draftSource || !draftTarget}
              onClick={addLinkFromDraft}
            >+ Add link</button>
          </div>
          <ul className="topology-links-list">
            {document.links.map((link) => (
              <TopologyLinkRow
                key={link.id}
                link={link}
                nodes={nodeOptions}
                onRename={(label) => updateDocument((current) => setLinkLabel(current, link.id, label))}
                onToggleDashed={() => updateDocument((current) => toggleLinkDashed(current, link.id))}
                onRemove={() => updateDocument((current) => removeLink(current, link.id))}
              />
            ))}
            {document.links.length === 0 ? (
              <li className="topology-empty">No links yet.</li>
            ) : null}
          </ul>
        </aside>
      </div>
    </main>
  );
}

function TopologyLinkRow({
  link,
  nodes,
  onRename,
  onToggleDashed,
  onRemove,
}: {
  link: TopologyLink;
  nodes: TopologyDocument["nodes"];
  onRename: (label: string) => void;
  onToggleDashed: () => void;
  onRemove: () => void;
}) {
  const label = (id: string) => nodes.find((node) => node.id === id)?.label ?? id;
  return (
    <li className="topology-link-row">
      <button
        className={`topology-link-toggle${link.dashed ? " is-dashed" : ""}`}
        onClick={onToggleDashed}
        aria-label={link.dashed ? "Link is dashed — click for solid" : "Link is solid — click for dashed"}
        title="Toggle dashed"
      ></button>
      <div className="topology-link-meta">
        <input
          aria-label="Link label"
          value={link.label ?? ""}
          placeholder="may depend on"
          onChange={(event) => onRename(event.target.value)}
        />
        <span>{label(link.source)} → {label(link.target)}</span>
      </div>
      <button className="topology-icon-button topology-icon-button--danger" onClick={onRemove} aria-label="Delete link">✕</button>
    </li>
  );
}

/** Local authoring tool for layered system topologies. */
export function TopologyTool() {
  return <TopologyWorkspace />;
}
