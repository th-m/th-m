import ELK, { type ELK as ElkInstance } from "elkjs/lib/elk-api.js";
import ElkWorker from "elkjs/lib/elk-worker.min.js?worker";
import { useEffect, useMemo, useState } from "react";
import { createGraphSvg } from "./exportSvg";
import {
  buildElkGraph,
  estimateDocumentSizes,
  normalizeLayout,
  positionsFromElk,
} from "./layout";
import type { GraphDocument } from "./types";

export interface PropositionGraphFigureProps {
  /** The portable graph to render (same contract as the editor and CLI). */
  document: GraphDocument;
  title?: string;
  className?: string;
  /** Show the content-sized graph figure with its accessibility metadata. */
  showCaption?: boolean;
}

/**
 * Dynamic, self-contained proposition graph figure for article pages. Runs the
 * same deterministic ELK layout and SVG renderer as the export pipeline, then
 * renders the font-embedded SVG inline — no pre-generated asset files. The
 * figure mounts client-side (ELK runs in a worker); server/prerendered pages
 * show a placeholder until it settles.
 */
export function PropositionGraphFigure({
  document,
  title,
  className = "",
  showCaption = true,
}: PropositionGraphFigureProps) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const sizes = useMemo(() => estimateDocumentSizes(document), [document]);

  useEffect(() => {
    let cancelled = false;
    const elk: ElkInstance = new ELK({ workerFactory: () => new ElkWorker() });
    setSvg(null);
    setError(null);
    elk.layout(buildElkGraph(document, sizes))
      .then((result) => {
        if (cancelled) return;
        const positions = normalizeLayout(document, positionsFromElk(result), sizes);
        return createGraphSvg(document, positions, "graph", sizes);
      })
      .then((rendered) => {
        if (!cancelled && rendered) setSvg(rendered);
      })
      .catch((reason: unknown) => {
        if (cancelled) return;
        setError(reason instanceof Error ? reason.message : "Graph layout failed.");
      })
      .finally(() => elk.terminateWorker());
    return () => {
      cancelled = true;
    };
  }, [document, sizes]);

  const label = title ?? `${document.name} proposition graph`;
  const caption = showCaption
    ? `${document.propositions.length} propositions connected by ${document.relationships.length} relationships.`
    : null;

  return (
    <figure
      className={`graph-figure ${className}`.trim()}
      aria-label={label}
    >
      {svg ? (
        <div
          className="graph-figure__svg"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <p className="graph-figure__status" role="status">
          {error ? `Layout issue — ${error}` : "Balancing the graph…"}
        </p>
      )}
      {caption ? <figcaption className="graph-figure__caption">{caption}</figcaption> : null}
    </figure>
  );
}
