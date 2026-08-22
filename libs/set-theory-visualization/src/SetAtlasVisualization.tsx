import { useMemo, useState } from "react";
import { buildSetAtlasScene } from "./layout";
import { SetAtlasCanvas } from "./SetAtlasCanvas";
import type { AnalyzeResult, ViewportState } from "./types";

export interface SetAtlasVisualizationProps {
  /** Compiler analysis produced offline by `analyzeSetAtlas` (curated data). */
  analysis: AnalyzeResult;
  title?: string;
  className?: string;
  /** Show the geometry/approximation notes under the atlas. Defaults to true. */
  showNotes?: boolean;
  /** Fired with the clicked symbol id (or null on clear) for consumer detail panels. */
  onSelect?: (symbolId: string | null) => void;
  initialViewport?: ViewportState;
}

const initialFit: ViewportState = { x: 0, y: 0, zoom: 1 };

/**
 * Dynamic, read-only TypeScript set atlas figure. Renders a deterministic
 * scene from an `AnalyzeResult` (curated data, no compiler in the browser):
 * pan/zoom/select the nested and overlapping regions, or embed as a static
 * article figure. The authoring workbench in `tools/set-theory` shares the
 * same canvas and scene builder.
 */
export function SetAtlasVisualization({
  analysis,
  title,
  className = "",
  showNotes = true,
  onSelect,
  initialViewport,
}: SetAtlasVisualizationProps) {
  const [selectedSymbolId, setSelectedSymbolId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<ViewportState>(initialViewport ?? initialFit);

  const scene = useMemo(() => buildSetAtlasScene(analysis), [analysis]);
  const notes = useMemo(() => {
    const diagnostics = analysis.diagnostics
      .filter(({ severity }) => severity !== "error")
      .map(({ message }) => message);
    return [...new Set([...scene.warnings, ...diagnostics])];
  }, [analysis, scene]);

  const select = (symbolId: string) => {
    setSelectedSymbolId(symbolId);
    onSelect?.(symbolId);
  };

  const clear = () => {
    setSelectedSymbolId(null);
    onSelect?.(null);
  };

  return (
    <figure
      className={`set-figure ${className}`.trim()}
      aria-label={title ?? "TypeScript set atlas"}
    >
      <div className="set-figure__canvas">
        <SetAtlasCanvas
          scene={scene}
          selectedSymbolId={selectedSymbolId}
          viewport={viewport}
          fitRequest={0}
          onSelect={select}
          onPin={() => undefined}
          onViewportChange={setViewport}
          readOnly
        />
      </div>
      {showNotes && notes.length > 0 ? (
        <p className="set-figure__notes" role="note">
          {notes.length} geometry note{notes.length === 1 ? "" : "s"} — the atlas
          approximates relationships the compiler could not prove exactly.
        </p>
      ) : null}
    </figure>
  );
}
