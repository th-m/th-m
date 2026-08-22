import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GraphCanvasRef } from "reagraph";
import { graphToReagraph, propositionLayoutId, relationshipLayoutId, selectionFromLayoutId } from "./canvas";
import { ThomGraphCanvas } from "./GraphCanvas";
import { downloadText, slugifyFilename } from "./exportText";
import { exportGraphDocument, loadGraphLibrary } from "./storage";
import type { GraphLibrary, Selection } from "./types";

export interface RelationshipGraphExplorerProps {
  /** Optional graph id to open initially (e.g. from an article's openTool call). */
  initialGraphId?: string;
}

function ExplorerWorkspace({ initialGraphId }: RelationshipGraphExplorerProps) {
  const [library] = useState<GraphLibrary>(() => loadGraphLibrary());
  const [documentId, setDocumentId] = useState<string>(() => {
    const requested = library.documents.find(({ id }) => id === initialGraphId);
    return requested?.id ?? library.activeDocumentId;
  });
  const [selection, setSelection] = useState<Selection>(null);
  const canvasRef = useRef<GraphCanvasRef | null>(null);

  const document = library.documents.find(({ id }) => id === documentId) ?? library.documents[0];

  const data = useMemo(() => graphToReagraph(document), [document]);

  const selections = useMemo(
    () =>
      selection
        ? [selection.kind === "proposition" ? propositionLayoutId(selection.id) : relationshipLayoutId(selection.id)]
        : [],
    [selection],
  );

  // Focus neighborhood: the selected entity plus everything it participates
  // with. Everything outside `actives` is dimmed by the theme.
  const actives = useMemo(() => {
    if (!selection) return [];
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
    return [...ids];
  }, [selection, document]);

  useEffect(() => {
    setSelection(null);
  }, [document.id]);

  const exportPng = useCallback(() => {
    const dataUrl = canvasRef.current?.exportCanvas();
    if (!dataUrl) return;
    const link = globalThis.document.createElement("a");
    link.href = dataUrl;
    link.download = `${slugifyFilename(document.name)}-graph.png`;
    link.click();
  }, [document]);

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
          <button type="button" className="graph-explorer__action" onClick={exportPng}>
            PNG
          </button>
          <button type="button" className="graph-explorer__action" onClick={exportJson}>
            JSON
          </button>
        </div>
      </div>

      <div className="graph-explorer__canvas">
        <ThomGraphCanvas
          ref={canvasRef}
          nodes={data.nodes}
          edges={data.edges}
          selections={selections}
          actives={actives}
          layoutMode={document.layoutMode}
          density="auto"
          onNodeClick={(layoutId) => setSelection(selectionFromLayoutId(layoutId))}
          onNodeKeyboardActivate={(layoutId) => setSelection(selectionFromLayoutId(layoutId))}
          keyboardActionLabel="Select"
          onCanvasClick={() => setSelection(null)}
        />
      </div>

      <p className="graph-explorer__hint" role="status">
        {selection
          ? "click empty space to clear"
          : "click a claim to follow its relationships."}
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
 * relationships. Renders on the reagraph WebGL canvas with the THOM theme;
 * never mutates the library.
 */
export function RelationshipGraphExplorer({ initialGraphId }: RelationshipGraphExplorerProps) {
  return <ExplorerWorkspace initialGraphId={initialGraphId} />;
}
