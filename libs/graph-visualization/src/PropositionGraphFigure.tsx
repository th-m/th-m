import { useEffect, useMemo, useRef, useState } from "react";
import type { GraphCanvasRef } from "reagraph";
import { graphToReagraph } from "./canvas";
import { ThomGraphCanvas } from "./GraphCanvas";
import type { GraphDocument } from "./types";

export interface PropositionGraphFigureProps {
  /** The portable graph to render (same contract as the editor and seeds). */
  document: GraphDocument;
  title?: string;
  className?: string;
  /** Show the content-sized graph figure with its accessibility metadata. */
  showCaption?: boolean;
}

/**
 * Dynamic proposition graph figure for article pages. Renders the document on
 * the shared reagraph WebGL canvas with the THOM theme — no pre-generated
 * asset files. The figure mounts client-side; server/prerendered pages show a
 * placeholder until the canvas settles. Falls back to a status message when
 * WebGL is unavailable.
 */
export function PropositionGraphFigure({
  document,
  title,
  className = "",
  showCaption = true,
}: PropositionGraphFigureProps) {
  const canvasRef = useRef<GraphCanvasRef | null>(null);
  const [mounted, setMounted] = useState(false);
  const [failed, setFailed] = useState(false);

  const data = useMemo(() => graphToReagraph(document), [document]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const label = title ?? `${document.name} proposition graph`;
  const caption = showCaption
    ? `${document.propositions.length} propositions connected by ${document.relationships.length} relationships.`
    : null;

  return (
    <figure
      className={`graph-figure ${className}`.trim()}
      aria-label={label}
    >
      <div className="graph-figure__canvas">
        {mounted ? (
          <ThomGraphCanvas
            ref={canvasRef}
            nodes={data.nodes}
            edges={data.edges}
            layoutMode={document.layoutMode}
            density="compact"
            disabled
            onError={() => setFailed(true)}
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <p className="graph-figure__status" role="status">
            Opening the graph…
          </p>
        )}
        {failed ? (
          <p className="graph-figure__status" role="status">
            WebGL is not available here — the graph needs a capable browser.
          </p>
        ) : null}
      </div>
      {caption ? <figcaption className="graph-figure__caption">{caption}</figcaption> : null}
    </figure>
  );
}
