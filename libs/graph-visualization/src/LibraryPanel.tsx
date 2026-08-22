import type { GraphLibrary } from "./types";

interface LibraryPanelProps {
  library: GraphLibrary;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onImport: () => void;
  onClose: () => void;
}

export function LibraryPanel({
  library,
  onSelect,
  onCreate,
  onDuplicate,
  onDelete,
  onImport,
  onClose,
}: LibraryPanelProps) {
  return (
    <aside className="graph-library graph-panel" aria-label="Local graph library">
      <div className="graph-panel-heading">
        <div>
          <span className="graph-eyebrow">LOCAL LIBRARY</span>
          <h1>Proposition graphs</h1>
        </div>
        <button className="graph-icon-button graph-panel-close" onClick={onClose} aria-label="Close library">
          ×
        </button>
      </div>
      <div className="graph-library-actions">
        <button className="graph-button graph-button--primary" onClick={onCreate}>New graph</button>
        <button className="graph-button" onClick={onImport}>Import JSON</button>
      </div>
      <nav className="graph-document-list" aria-label="Graphs">
        {library.documents.map((document) => (
          <button
            key={document.id}
            className={document.id === library.activeDocumentId ? "is-active" : ""}
            aria-current={document.id === library.activeDocumentId ? "page" : undefined}
            onClick={() => onSelect(document.id)}
          >
            <strong>{document.name}</strong>
            <span>{document.propositions.length} propositions · {document.relationships.length} relations</span>
          </button>
        ))}
      </nav>
      <div className="graph-library-footer">
        <button className="graph-button" onClick={onDuplicate}>Duplicate</button>
        <button className="graph-button graph-button--error" onClick={onDelete}>Delete</button>
        <p>Saved automatically in this browser.</p>
      </div>
    </aside>
  );
}
