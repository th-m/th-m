import { CommitField } from "./CommitField";
import type { GraphDocument, RelationshipParticipant, Selection } from "./types";

interface InspectorProps {
  document: GraphDocument;
  selection: Selection;
  onUpdateDocument: (update: (document: GraphDocument) => GraphDocument) => void;
  onDeleteSelection: () => void;
  onClose: () => void;
}

type ArrowMode = "none" | "node" | "relation" | "both";

function arrowMode(participant: RelationshipParticipant): ArrowMode {
  if (participant.arrowAtNode && participant.arrowAtRelation) return "both";
  if (participant.arrowAtNode) return "node";
  if (participant.arrowAtRelation) return "relation";
  return "none";
}

function arrowsForMode(mode: ArrowMode): Pick<RelationshipParticipant, "arrowAtNode" | "arrowAtRelation"> {
  return {
    arrowAtNode: mode === "node" || mode === "both",
    arrowAtRelation: mode === "relation" || mode === "both",
  };
}

export function Inspector({
  document,
  selection,
  onUpdateDocument,
  onDeleteSelection,
  onClose,
}: InspectorProps) {
  const proposition =
    selection?.kind === "proposition"
      ? document.propositions.find(({ id }) => id === selection.id)
      : undefined;
  const relationship =
    selection?.kind === "relationship"
      ? document.relationships.find(({ id }) => id === selection.id)
      : undefined;

  return (
    <aside className="graph-inspector graph-panel" aria-label="Inspector">
      <div className="graph-panel-heading">
        <div>
          <span className="graph-eyebrow">SELECTED ITEM</span>
          <h2>{proposition ? "Proposition" : relationship ? "Relationship" : "Graph settings"}</h2>
        </div>
        <button className="graph-icon-button graph-panel-close" onClick={onClose} aria-label="Close inspector">
          ×
        </button>
      </div>

      {!proposition && !relationship && (
        <div className="graph-inspector-stack">
          <CommitField
            label="Graph name"
            value={document.name}
            onCommit={(name) =>
              onUpdateDocument((current) => ({ ...current, name, updatedAt: new Date().toISOString() }))
            }
          />
          <CommitField
            label="Poster kicker"
            value={document.poster.kicker}
            onCommit={(kicker) =>
              onUpdateDocument((current) => ({
                ...current,
                updatedAt: new Date().toISOString(),
                poster: { ...current.poster, kicker },
              }))
            }
          />
          <CommitField
            label="Poster title"
            value={document.poster.title}
            multiline
            onCommit={(title) =>
              onUpdateDocument((current) => ({
                ...current,
                updatedAt: new Date().toISOString(),
                poster: { ...current.poster, title },
              }))
            }
          />
          <CommitField
            label="Poster footer"
            value={document.poster.footer}
            onCommit={(footer) =>
              onUpdateDocument((current) => ({
                ...current,
                updatedAt: new Date().toISOString(),
                poster: { ...current.poster, footer },
              }))
            }
          />
          <label className="graph-check">
            <input
              type="checkbox"
              checked={document.poster.showLegend}
              onChange={(event) =>
                onUpdateDocument((current) => ({
                  ...current,
                  updatedAt: new Date().toISOString(),
                  poster: { ...current.poster, showLegend: event.target.checked },
                }))
              }
            />
            Show poster legend
          </label>
          <div className="graph-theme-card">
            <span className="graph-eyebrow">THEME</span>
            <strong>THOM dark</strong>
            <span>Ivory · Gold · Newsreader · IBM Plex Mono</span>
          </div>
        </div>
      )}

      {proposition && (
        <div className="graph-inspector-stack">
          <CommitField
            label="Statement"
            value={proposition.statement}
            multiline
            onCommit={(statement) =>
              onUpdateDocument((current) => ({
                ...current,
                updatedAt: new Date().toISOString(),
                propositions: current.propositions.map((item) =>
                  item.id === proposition.id ? { ...item, statement } : item,
                ),
              }))
            }
          />
          <label className="graph-check">
            <input
              type="checkbox"
              checked={proposition.emphasis}
              onChange={(event) =>
                onUpdateDocument((current) => ({
                  ...current,
                  updatedAt: new Date().toISOString(),
                  propositions: current.propositions.map((item) =>
                    item.id === proposition.id ? { ...item, emphasis: event.target.checked } : item,
                  ),
                }))
              }
            />
            Gold emphasis ring
          </label>
          <label className="graph-check">
            <input
              type="checkbox"
              checked={proposition.pinned}
              onChange={(event) =>
                onUpdateDocument((current) => ({
                  ...current,
                  updatedAt: new Date().toISOString(),
                  propositions: current.propositions.map((item) =>
                    item.id === proposition.id
                      ? { ...item, pinned: event.target.checked, position: event.target.checked ? item.position : undefined }
                      : item,
                  ),
                }))
              }
            />
            Pin position
          </label>
          <button className="graph-button graph-button--danger" onClick={onDeleteSelection}>
            Delete proposition
          </button>
        </div>
      )}

      {relationship && (
        <div className="graph-inspector-stack">
          <CommitField
            label="Relational statement"
            value={relationship.statement}
            multiline
            onCommit={(statement) =>
              onUpdateDocument((current) => ({
                ...current,
                updatedAt: new Date().toISOString(),
                relationships: current.relationships.map((item) =>
                  item.id === relationship.id ? { ...item, statement } : item,
                ),
              }))
            }
          />
          <div className="graph-participants">
            <span className="graph-field-label">Participant arrows</span>
            {relationship.participants.map((participant) => {
              const name =
                document.propositions.find(({ id }) => id === participant.nodeId)?.statement ??
                participant.nodeId;
              return (
                <label key={participant.nodeId}>
                  <span title={name}>{name}</span>
                  <select
                    value={arrowMode(participant)}
                    aria-label={`Arrow direction for ${name}`}
                    onChange={(event) => {
                      const arrows = arrowsForMode(event.target.value as ArrowMode);
                      onUpdateDocument((current) => ({
                        ...current,
                        updatedAt: new Date().toISOString(),
                        relationships: current.relationships.map((item) =>
                          item.id === relationship.id
                            ? {
                                ...item,
                                participants: item.participants.map((candidate) =>
                                  candidate.nodeId === participant.nodeId
                                    ? { ...candidate, ...arrows }
                                    : candidate,
                                ),
                              }
                            : item,
                        ),
                      }));
                    }}
                  >
                    <option value="none">No arrows</option>
                    <option value="node">Toward proposition</option>
                    <option value="relation">Toward relationship</option>
                    <option value="both">Both ends</option>
                  </select>
                </label>
              );
            })}
          </div>
          <label className="graph-check">
            <input
              type="checkbox"
              checked={relationship.pinned}
              onChange={(event) =>
                onUpdateDocument((current) => ({
                  ...current,
                  updatedAt: new Date().toISOString(),
                  relationships: current.relationships.map((item) =>
                    item.id === relationship.id
                      ? { ...item, pinned: event.target.checked, position: event.target.checked ? item.position : undefined }
                      : item,
                  ),
                }))
              }
            />
            Pin label position
          </label>
          <button className="graph-button graph-button--danger" onClick={onDeleteSelection}>
            Delete relationship
          </button>
        </div>
      )}
    </aside>
  );
}
