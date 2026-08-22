import { useMemo, useState } from "react";
import {
  buildSetAtlasScene,
  curatedSetAtlasAnalyses,
  exportSetAtlasSvg,
  SetAtlasVisualization,
} from "@th-m/set-theory-visualization";
import type { ToolRenderProps } from "../registry";

/**
 * Compact set-atlas explorer for the tool drawer: pick a curated TypeScript
 * snippet, pan/zoom the deterministic atlas, click a region to read the type
 * and its relationships, and export the figure. Renders entirely from
 * committed compiler analyses — no compiler runs in the browser.
 */
export function SetAtlasExplorer(_props: ToolRenderProps) {
  const [entryId, setEntryId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (curatedSetAtlasAnalyses.length === 0) return null;
  const entry =
    curatedSetAtlasAnalyses.find((candidate) => candidate.id === entryId) ??
    curatedSetAtlasAnalyses[0];

  const scene = useMemo(() => buildSetAtlasScene(entry.analysis), [entry]);
  const selectedSymbol = selectedId
    ? (entry.analysis.symbols.find(({ id }) => id === selectedId) ?? null)
    : null;
  const selectedRelations = selectedSymbol
    ? entry.analysis.relations
        .filter(({ sourceId, targetId }) => sourceId === selectedSymbol.id || targetId === selectedSymbol.id)
        .map((relation) => ({
          relation,
          other:
            entry.analysis.symbols.find(({ id }) => id === (relation.sourceId === selectedSymbol.id ? relation.targetId : relation.sourceId)) ?? null,
        }))
    : [];

  const exportSvg = async () => {
    await exportSetAtlasSvg(scene, { title: entry.label });
  };

  return (
    <div className="set-figure" aria-label="Set atlas explorer">
      <div className="set-figure__bar">
        <label>
          Snippet
          <select
            value={entry.id}
            aria-label="Choose a TypeScript snippet"
            onChange={(event) => {
              setEntryId(event.target.value);
              setSelectedId(null);
            }}
          >
            {curatedSetAtlasAnalyses.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.label}
              </option>
            ))}
          </select>
        </label>
        <div className="set-figure__actions">
          <button type="button" className="set-figure__action" onClick={() => void exportSvg()}>
            Graph SVG
          </button>
        </div>
      </div>

      <SetAtlasVisualization
        analysis={entry.analysis}
        title={entry.label}
        onSelect={setSelectedId}
      />

      {selectedSymbol ? (
        <div className="set-figure__detail">
          <h3>{selectedSymbol.name}</h3>
          <p>
            {selectedSymbol.kind} · {selectedSymbol.display}
            {selectedSymbol.detail ? ` — ${selectedSymbol.detail}` : ""}
          </p>
          {selectedRelations.length > 0 ? (
            <ul aria-label={`Relationships for ${selectedSymbol.name}`}>
              {selectedRelations.map(({ relation, other }) => (
                <li key={relation.sourceId + relation.targetId}>
                  <strong>{relation.kind}</strong>
                  {other ? ` ${other.name}` : ""}
                  {relation.confidence !== "compiler-proven" ? ` · ${relation.confidence}` : ""}
                </li>
              ))}
            </ul>
          ) : (
            <p>No relationships reported.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
