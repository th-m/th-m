import {
  Fragment,
  lazy,
  Suspense,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { thomDesignTokens } from "@th-m/design-theme";
import { defaultEmbeddingDataset } from "./defaultScenario";
import { applyTransformation, cosineSimilarity, nearestNeighbors, vectorMagnitude } from "./math";
import { searchEmbeddingDataset } from "./search";
import { usePrefersReducedMotion } from "./useReducedMotion";
import type {
  EmbeddingCluster,
  EmbeddingPoint,
  EmbeddingSpaceVisualizationProps,
  ProjectionMetadata,
} from "./types";

const WIDTH = 1000;
const HEIGHT = 650;
const PADDING = { top: 54, right: 64, bottom: 64, left: 72 };
const LazyEmbeddingTrainingLab = lazy(() => import("./EmbeddingTrainingLab").then((module) => ({ default: module.EmbeddingTrainingLab })));

const clusterPresentation: Record<EmbeddingCluster, { label: string; color: string; shape: string }> = {
  people: { label: "People & roles", color: thomDesignTokens.color.accents.rose, shape: "circle" },
  nature: { label: "Natural world", color: thomDesignTokens.color.accents.teal, shape: "circle" },
  animals: { label: "Animals", color: thomDesignTokens.color.accents.lime, shape: "circle" },
  technology: { label: "Technology", color: thomDesignTokens.color.accents.blue, shape: "circle" },
  places: { label: "Places", color: thomDesignTokens.color.accents.violet, shape: "circle" },
  emotion: { label: "Affect", color: thomDesignTokens.color.accents.plum, shape: "circle" },
  food: { label: "Food & drink", color: thomDesignTokens.color.semantic.warning.default, shape: "circle" },
  polysemy: { label: "Polysemous", color: thomDesignTokens.color.foreground, shape: "ring" },
};

const anchorLabels = new Set([
  "king", "queen", "woman", "forest", "ocean", "sun", "dog", "cat", "lion", "sea-lion",
  "code", "computer", "robot", "city", "village", "new-york", "happy", "sad", "love", "apple",
  "coffee", "ice-cream", "bank", "mouse", "python",
]);

const labelPlacements: Record<string, { dx: number; dy: number; anchor?: "start" | "end" }> = {
  king: { dx: 11, dy: -9 },
  queen: { dx: 11, dy: 13 },
  prince: { dx: 11, dy: 13 },
  princess: { dx: 11, dy: -11 },
  forest: { dx: -11, dy: -14, anchor: "end" },
  ocean: { dx: 11, dy: -8 },
  python: { dx: -11, dy: -13, anchor: "end" },
  mouse: { dx: 11, dy: -11 },
  dog: { dx: -11, dy: 13, anchor: "end" },
  cat: { dx: 11, dy: 14 },
  lion: { dx: 11, dy: -10 },
  "sea-lion": { dx: 11, dy: -11 },
  "ice-cream": { dx: 11, dy: 14 },
  code: { dx: -11, dy: 13, anchor: "end" },
  computer: { dx: 11, dy: -9 },
  village: { dx: 11, dy: -10 },
  city: { dx: 11, dy: 14 },
  "new-york": { dx: 11, dy: -9 },
  robot: { dx: 11, dy: 14 },
  sad: { dx: 11, dy: 13 },
  love: { dx: 11, dy: 14 },
  apple: { dx: 11, dy: -10 },
  coffee: { dx: 11, dy: -10 },
  bank: { dx: 11, dy: -10 },
};

function format(value: number, digits = 3) {
  return value.toFixed(digits).replace("-0.000", "0.000");
}

function visibleBounds(projection: ProjectionMetadata) {
  const { minX, maxX, minY, maxY } = projection.bounds;
  const xPad = Math.max((maxX - minX) * 0.1, 0.01);
  const yPad = Math.max((maxY - minY) * 0.1, 0.01);
  return { minX: minX - xPad, maxX: maxX + xPad, minY: minY - yPad, maxY: maxY + yPad };
}

function scalePoint(point: readonly number[], projection: ProjectionMetadata, zoom: number, center: readonly number[]) {
  const bounds = visibleBounds(projection);
  const x = center[0] + ((point[0] ?? 0) - center[0]) * zoom;
  const y = center[1] + ((point[1] ?? 0) - center[1]) * zoom;
  return {
    x: PADDING.left + ((x - bounds.minX) / (bounds.maxX - bounds.minX)) * (WIDTH - PADDING.left - PADDING.right),
    y: PADDING.top + (1 - (y - bounds.minY) / (bounds.maxY - bounds.minY)) * (HEIGHT - PADDING.top - PADDING.bottom),
  };
}

function PointMark({ point, x, y, selected }: { point: EmbeddingPoint; x: number; y: number; selected: boolean }) {
  const presentation = clusterPresentation[point.cluster];
  if (point.representation === "pooled") {
    return <path d={`M ${x} ${y - 6.5} L ${x + 6.5} ${y} L ${x} ${y + 6.5} L ${x - 6.5} ${y} Z`} fill={presentation.color} stroke={selected ? thomDesignTokens.color.foregroundStrong : thomDesignTokens.color.background} strokeWidth={selected ? 2.5 : 1.5} />;
  }
  if (presentation.shape === "ring") {
    return <circle cx={x} cy={y} r={selected ? 7 : 5.5} fill={thomDesignTokens.color.surface} stroke={presentation.color} strokeWidth={selected ? 3 : 2} />;
  }
  return <circle cx={x} cy={y} r={selected ? 7 : 5} fill={presentation.color} stroke={selected ? thomDesignTokens.color.foregroundStrong : thomDesignTokens.color.background} strokeWidth={selected ? 2.5 : 1.5} />;
}

function ClusterFields({ points, projection, zoom, center }: { points: EmbeddingPoint[]; projection: ProjectionMetadata; zoom: number; center: readonly number[] }) {
  return (
    <g aria-hidden="true" className="embedding-space__cluster-fields">
      {Object.keys(clusterPresentation).map((cluster) => {
        const clusterPoints = points.filter((point) => point.cluster === cluster).map((point) => scalePoint(point.projection, projection, zoom, center));
        if (clusterPoints.length < 2) return null;
        const cx = clusterPoints.reduce((sum, point) => sum + point.x, 0) / clusterPoints.length;
        const cy = clusterPoints.reduce((sum, point) => sum + point.y, 0) / clusterPoints.length;
        const rx = Math.min(260, Math.max(50, Math.max(...clusterPoints.map((point) => Math.abs(point.x - cx))) + 30));
        const ry = Math.min(210, Math.max(42, Math.max(...clusterPoints.map((point) => Math.abs(point.y - cy))) + 24));
        return <ellipse key={cluster} cx={cx} cy={cy} rx={rx} ry={ry} fill={clusterPresentation[cluster as EmbeddingCluster].color} />;
      })}
    </g>
  );
}

function EmbeddingAtlas({
  dataset = defaultEmbeddingDataset,
  initialSelection = "king",
  projectionMetadata,
  transformationPresets,
  copy,
  className = "",
  modeSwitcher,
}: EmbeddingSpaceVisualizationProps & { modeSwitcher: ReactNode }) {
  const projection = projectionMetadata ?? dataset.projection;
  const presets = transformationPresets ?? dataset.transformations;
  const initialPoint = dataset.points.find((point) => point.id === initialSelection) ?? dataset.points[0];
  if (!initialPoint) throw new Error("EmbeddingSpaceVisualization requires at least one point.");

  const [selectedId, setSelectedId] = useState(initialPoint.id);
  const [query, setQuery] = useState("");
  const [cluster, setCluster] = useState<EmbeddingCluster | "all">("all");
  const [presetId, setPresetId] = useState(presets[0]?.id ?? "");
  const [appliedPresetId, setAppliedPresetId] = useState<string | null>(null);
  const [compare, setCompare] = useState(true);
  const [zoom, setZoom] = useState(1);
  const reducedMotion = usePrefersReducedMotion();
  const titleId = useId();
  const descriptionId = useId();
  const searchId = useId();
  const pointRefs = useRef(new Map<string, SVGGElement>());

  const selected = dataset.points.find((point) => point.id === selectedId) ?? initialPoint;
  const activePreset = presets.find((preset) => preset.id === appliedPresetId);
  const transformed = activePreset ? applyTransformation(selected, activePreset, dataset.points, projection) : null;
  const selectedNeighbors = nearestNeighbors(selected.vector, dataset.points, 5, [selected.id]);
  const displayedNeighbors = transformed
    ? nearestNeighbors(transformed.vector, dataset.points, 5, [selected.id])
    : selectedNeighbors;
  const neighborIds = new Set(displayedNeighbors.map((neighbor) => neighbor.point.id));
  const search = searchEmbeddingDataset(dataset, query);
  const filteredPoints = dataset.points.filter((point) => cluster === "all" || point.cluster === cluster || point.id === selected.id);
  const center = zoom > 1 ? selected.projection : [
    (projection.bounds.minX + projection.bounds.maxX) / 2,
    (projection.bounds.minY + projection.bounds.maxY) / 2,
  ];
  const selectedPosition = scalePoint(selected.projection, projection, zoom, center);
  const transformedPosition = transformed ? scalePoint(transformed.projection, projection, zoom, center) : null;
  const vectorInView = transformed?.vector ?? selected.vector;
  const selectionMagnitude = vectorMagnitude(vectorInView);
  const baseToTransformedSimilarity = transformed ? cosineSimilarity(selected.vector, transformed.vector) : null;
  const pc1 = projection.explainedVarianceRatio[0] * 100;
  const pc2 = projection.explainedVarianceRatio[1] * 100;

  useEffect(() => {
    setAppliedPresetId(null);
    setCompare(true);
  }, [selectedId]);

  const applicablePresets = useMemo(() => {
    const contextual = presets.filter((preset) => !preset.applicableClusters || preset.applicableClusters.includes(selected.cluster));
    return contextual.length > 0 ? contextual : presets;
  }, [presets, selected.cluster]);

  useEffect(() => {
    if (!applicablePresets.some((preset) => preset.id === presetId)) setPresetId(applicablePresets[0]?.id ?? "");
  }, [applicablePresets, presetId]);

  const selectPoint = (id: string) => {
    setSelectedId(id);
    setQuery("");
  };

  const onPointKeyDown = (event: ReactKeyboardEvent<SVGGElement>, point: EmbeddingPoint) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectPoint(point.id);
      return;
    }
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    if (!direction) return;
    event.preventDefault();
    const index = filteredPoints.findIndex((candidate) => candidate.id === point.id);
    const next = filteredPoints[(index + direction + filteredPoints.length) % filteredPoints.length];
    if (next) pointRefs.current.get(next.id)?.focus();
  };

  const transformationStatus = transformed && activePreset
    ? `${selected.label} transformed with ${activePreset.shortLabel}. Nearest curated neighbor is ${displayedNeighbors[0]?.point.label ?? "unavailable"}.`
    : `${selected.label} selected. ${selected.representation === "token" ? "One static GPT-2 token row." : `${selected.tokenIds.length} tokens are mean-pooled for teaching.`}`;

  return (
    <section className={`embedding-space ${className}`.trim()} aria-labelledby={titleId} data-reduced-motion={reducedMotion ? "true" : "false"}>
      <header className="embedding-space__intro">
        <div>
          <p className="embedding-space__eyebrow">{copy?.eyebrow ?? "Model atlas · static token layer"}</p>
          <h1 id={titleId}>{copy?.title ?? "Meaning has neighborhoods, not addresses."}</h1>
        </div>
        <div className="embedding-space__lede">
          <p>{copy?.introduction ?? "This map projects a curated set of learned GPT-2 token vectors from 768 dimensions into two. Nearby points can suggest related use, but the projection distorts distance—and no single vector contains a token’s complete meaning."}</p>
          <dl className="embedding-space__summary-metrics">
            <div><dt>Source</dt><dd>{dataset.source.model}</dd></div>
            <div><dt>Projection</dt><dd>Fixed 2D PCA</dd></div>
            <div><dt>Runtime</dt><dd>Offline · deterministic</dd></div>
          </dl>
        </div>
      </header>

      {modeSwitcher}

      <div className="embedding-space__toolbar" aria-label="Embedding map controls">
        <div className="embedding-space__search">
          <label htmlFor={searchId}>Find a word or token</label>
          <div className="embedding-space__search-field">
            <span aria-hidden="true">⌕</span>
            <input id={searchId} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try queen, python, or ice cream" autoComplete="off" />
            {query ? <button type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button> : null}
          </div>
          {query ? (
            <div className={`embedding-space__search-results is-${search.status}`} role={search.matches.length ? "listbox" : "status"}>
              {search.matches.slice(0, 6).map((point) => (
                <button key={point.id} type="button" role="option" aria-selected={point.id === selected.id} onClick={() => selectPoint(point.id)}>
                  <span>{point.label}</span>
                  <small>{point.representation === "token" ? point.tokenPieces[0] : `${point.tokenIds.length} tokens · pooled`}</small>
                </button>
              ))}
              {search.status === "unsupported" ? <p>{search.message}</p> : null}
            </div>
          ) : null}
        </div>
        <div className="embedding-space__view-controls">
          <span>View</span>
          <div role="group" aria-label="Map zoom">
            <button type="button" onClick={() => setZoom((value) => Math.max(1, value - 0.35))} disabled={zoom <= 1} aria-label="Zoom out">−</button>
            <output aria-label="Current zoom">{format(zoom, 1)}×</output>
            <button type="button" onClick={() => setZoom((value) => Math.min(2.4, value + 0.35))} disabled={zoom >= 2.4} aria-label="Zoom in">+</button>
            <button type="button" onClick={() => setZoom(1)}>Reset view</button>
          </div>
        </div>
      </div>

      <nav className="embedding-space__filters" aria-label="Filter semantic clusters">
        <button type="button" aria-pressed={cluster === "all"} onClick={() => setCluster("all")}><i aria-hidden="true" />All <span>{dataset.points.length}</span></button>
        {(Object.keys(clusterPresentation) as EmbeddingCluster[]).map((key) => {
          const count = dataset.points.filter((point) => point.cluster === key).length;
          return (
            <button
              type="button"
              key={key}
              aria-pressed={cluster === key}
              onClick={() => {
                setCluster(key);
                if (selected.cluster !== key) {
                  const firstInCluster = dataset.points.find((point) => point.cluster === key);
                  if (firstInCluster) selectPoint(firstInCluster.id);
                }
              }}
              style={{ "--cluster-color": clusterPresentation[key].color } as CSSProperties}
            >
              <i aria-hidden="true" />{clusterPresentation[key].label} <span>{count}</span>
            </button>
          );
        })}
      </nav>

      <div className="embedding-space__workspace">
        <div className="embedding-space__map-card">
          <div className="embedding-space__map-meta">
            <div><span className="embedding-space__live-dot" aria-hidden="true" />Source-space similarity · projected position</div>
            <span>{filteredPoints.length} / {dataset.points.length} entries</span>
          </div>
          <svg className="embedding-space__map" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Two-dimensional PCA projection of curated GPT-2 token embeddings" aria-describedby={descriptionId}>
            <title id={`${titleId}-map`}>Two-dimensional PCA projection of curated GPT-2 token embeddings</title>
            <desc id={descriptionId}>Select points with Enter or Space. Use arrow keys to move focus between points. The plot is a distorted projection; neighbor similarity is computed in 768 dimensions.</desc>
            <defs>
              <pattern id={`${titleId}-grid`} width="72" height="72" patternUnits="userSpaceOnUse">
                <path d="M 72 0 L 0 0 0 72" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
              <marker id={`${titleId}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" />
              </marker>
              <radialGradient id={`${titleId}-focus`}>
                <stop offset="0" stopColor={thomDesignTokens.color.brand} stopOpacity=".22" />
                <stop offset="1" stopColor={thomDesignTokens.color.brand} stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect x="0" y="0" width={WIDTH} height={HEIGHT} className="embedding-space__map-bg" />
            <rect x={PADDING.left} y={PADDING.top} width={WIDTH - PADDING.left - PADDING.right} height={HEIGHT - PADDING.top - PADDING.bottom} fill={`url(#${titleId}-grid)`} className="embedding-space__grid" />
            <ClusterFields points={filteredPoints} projection={projection} zoom={zoom} center={center} />
            <g className="embedding-space__axes" aria-hidden="true">
              <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={HEIGHT - PADDING.bottom} y2={HEIGHT - PADDING.bottom} />
              <line x1={PADDING.left} x2={PADDING.left} y1={PADDING.top} y2={HEIGHT - PADDING.bottom} />
              <text x={WIDTH - PADDING.right} y={HEIGHT - 22} textAnchor="end">PC 1 · {format(pc1, 1)}% curated variance</text>
              <text transform={`translate(24 ${PADDING.top}) rotate(-90)`} textAnchor="end">PC 2 · {format(pc2, 1)}% curated variance</text>
            </g>

            {transformed && transformedPosition && compare ? (
              <Fragment>
                <circle cx={selectedPosition.x} cy={selectedPosition.y} r="44" fill={`url(#${titleId}-focus)`} aria-hidden="true" />
                <path
                  className="embedding-space__displacement"
                  d={`M ${selectedPosition.x} ${selectedPosition.y} L ${transformedPosition.x} ${transformedPosition.y}`}
                  markerEnd={`url(#${titleId}-arrow)`}
                  pathLength="1"
                />
                <text className="embedding-space__delta-label" x={(selectedPosition.x + transformedPosition.x) / 2} y={(selectedPosition.y + transformedPosition.y) / 2 - 12}>Δ source vector</text>
              </Fragment>
            ) : null}

            <g className="embedding-space__points">
              {filteredPoints.map((point) => {
                const position = scalePoint(point.projection, projection, zoom, center);
                const isSelected = point.id === selected.id;
                const isNeighbor = neighborIds.has(point.id);
                const showLabel = isSelected || isNeighbor || anchorLabels.has(point.id);
                const labelPlacement = labelPlacements[point.id] ?? { dx: 10, dy: -10, anchor: "start" as const };
                return (
                  <g
                    key={point.id}
                    ref={(node) => { if (node) pointRefs.current.set(point.id, node); else pointRefs.current.delete(point.id); }}
                    className={`embedding-space__point${isSelected ? " is-selected" : ""}${isNeighbor ? " is-neighbor" : ""}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${point.label}, ${clusterPresentation[point.cluster].label}, ${point.representation === "token" ? "single static token" : `${point.tokenIds.length}-token teaching composite`}`}
                    aria-pressed={isSelected}
                    onClick={() => selectPoint(point.id)}
                    onKeyDown={(event) => onPointKeyDown(event, point)}
                  >
                    <title>{point.label} · {point.tokenPieces.join(" + ")}</title>
                    {isSelected ? <circle cx={position.x} cy={position.y} r="17" className="embedding-space__selection-ring" /> : null}
                    <PointMark point={point} x={position.x} y={position.y} selected={isSelected} />
                    {isNeighbor ? <circle cx={position.x} cy={position.y} r="11" className="embedding-space__neighbor-ring" /> : null}
                    {showLabel ? (
                      <text
                        x={position.x + labelPlacement.dx}
                        y={position.y + labelPlacement.dy}
                        textAnchor={labelPlacement.anchor ?? "start"}
                        className={anchorLabels.has(point.id) ? "" : "is-context-label"}
                      >
                        {point.label}
                      </text>
                    ) : null}
                  </g>
                );
              })}
            </g>

            {transformed && transformedPosition ? (
              <g className="embedding-space__transformed-point" aria-label={`Transformed ${selected.label}`}>
                {reducedMotion ? null : (
                  <Fragment>
                    <animateTransform attributeName="transform" type="translate" from={`${selectedPosition.x} ${selectedPosition.y}`} to={`${transformedPosition.x} ${transformedPosition.y}`} dur="650ms" fill="freeze" />
                  </Fragment>
                )}
                <rect
                  x={reducedMotion ? transformedPosition.x - 8 : -8}
                  y={reducedMotion ? transformedPosition.y - 8 : -8}
                  width="16"
                  height="16"
                  rx="2"
                />
                <path d={reducedMotion ? `M ${transformedPosition.x - 4} ${transformedPosition.y} H ${transformedPosition.x + 4} M ${transformedPosition.x} ${transformedPosition.y - 4} V ${transformedPosition.x ? transformedPosition.y + 4 : 4}` : "M -4 0 H 4 M 0 -4 V 4"} />
                <text x={reducedMotion ? transformedPosition.x + 13 : 13} y={reducedMotion ? transformedPosition.y + 4 : 4}>{selected.label}′</text>
              </g>
            ) : null}
          </svg>
          <div className="embedding-space__map-footer">
            <p><span aria-hidden="true">◇</span> Diamond = pooled teaching composite</p>
            <p><span aria-hidden="true">□+</span> Square = transformed, not learned</p>
            <p>Axes describe variance in this curation, not human-readable semantic dimensions.</p>
          </div>
        </div>

        <aside className="embedding-space__inspector" aria-label="Selected vector details">
          <div className="embedding-space__inspector-status"><span>Selected representation</span><span>{transformed ? "Transformed" : "Base"}</span></div>
          <header>
            <div className="embedding-space__token-title">
              <span style={{ "--cluster-color": clusterPresentation[selected.cluster].color } as CSSProperties}>{selected.representation === "token" ? "●" : "◆"}</span>
              <h2>{selected.label}{transformed ? <sup>′</sup> : null}</h2>
            </div>
            <p>{selected.description}</p>
          </header>

          <dl className="embedding-space__metadata">
            <div><dt>Representation</dt><dd>{selected.representation === "token" ? "Learned static token row" : `Illustrative mean of ${selected.tokenIds.length} tokens`}</dd></div>
            <div><dt>Token piece{selected.tokenIds.length > 1 ? "s" : ""}</dt><dd><code>{selected.tokenPieces.join(" + ")}</code></dd></div>
            <div><dt>Source / category</dt><dd>{dataset.source.tensor} / {clusterPresentation[selected.cluster].label}</dd></div>
            <div><dt>Magnitude</dt><dd>{format(selectionMagnitude)} <small>L2 · 768D</small></dd></div>
          </dl>

          {selected.polysemyNote ? <p className="embedding-space__polysemy-note"><strong>One row, several senses.</strong> {selected.polysemyNote}</p> : null}

          <div className="embedding-space__vector-sample">
            <div><h3>Vector sample</h3><span>first 6 / {vectorInView.length}</span></div>
            <code>[{vectorInView.slice(0, 6).map((value) => format(value, 4)).join(", ")}, …]</code>
          </div>

          <div className="embedding-space__neighbors">
            <div><h3>{transformed ? "New source-space neighbors" : "Nearest in source space"}</h3><span>cosine</span></div>
            <ol>
              {displayedNeighbors.map((neighbor, index) => (
                <li key={neighbor.point.id}>
                  <button type="button" onClick={() => selectPoint(neighbor.point.id)}>
                    <span><i style={{ "--cluster-color": clusterPresentation[neighbor.point.cluster].color } as CSSProperties} />{index + 1}. {neighbor.point.label}</span>
                    <strong>{format(neighbor.similarity)}</strong>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="embedding-space__transform">
            <div className="embedding-space__transform-heading">
              <span>02</span>
              <div><h3>Transform the source vector</h3><p>Apply an explicit offset in 768D, then project with the unchanged PCA basis.</p></div>
            </div>
            <label>
              <span>Named direction</span>
              <select value={presetId} onChange={(event) => setPresetId(event.target.value)}>
                {applicablePresets.map((preset) => <option key={preset.id} value={preset.id}>{preset.shortLabel}</option>)}
              </select>
            </label>
            {presets.find((preset) => preset.id === presetId) ? (
              <div className="embedding-space__formula">
                <code>{presets.find((preset) => preset.id === presetId)?.formula}</code>
                <p>{presets.find((preset) => preset.id === presetId)?.description}</p>
                <span>Illustrative vector arithmetic</span>
              </div>
            ) : null}
            <div className="embedding-space__transform-actions">
              <button className="is-primary" type="button" disabled={!presetId} onClick={() => { setAppliedPresetId(presetId); setCompare(true); }}>Apply operation <span aria-hidden="true">→</span></button>
              {transformed ? <button type="button" onClick={() => setCompare((value) => !value)}>{compare ? "Hide" : "Show"} comparison</button> : null}
              {transformed ? <button type="button" onClick={() => setAppliedPresetId(null)}>Reset vector</button> : null}
            </div>
            {transformed && baseToTransformedSimilarity !== null ? (
              <dl className="embedding-space__delta-metrics">
                <div><dt>Base ↔ result</dt><dd>{format(baseToTransformedSimilarity)} cosine</dd></div>
                <div><dt>Projected move</dt><dd>{format(Math.hypot(transformed.projection[0] - selected.projection[0], transformed.projection[1] - selected.projection[1]))} PCA units</dd></div>
              </dl>
            ) : null}
          </div>
        </aside>
      </div>

      <div className="embedding-space__legend" aria-label="Cluster legend">
        {(Object.keys(clusterPresentation) as EmbeddingCluster[]).map((key) => (
          <span key={key}><i style={{ "--cluster-color": clusterPresentation[key].color } as CSSProperties} aria-hidden="true" />{clusterPresentation[key].label}</span>
        ))}
      </div>

      <details className="embedding-space__method">
        <summary><span>Read the map carefully</span><span>Method & caveats</span></summary>
        <div>
          <article><span>01</span><h3>A projection, not the space</h3><p>PCA compresses 768 coordinates to two. This fixed basis preserves comparability across filters and transformations, but only {format(pc1 + pc2, 1)}% of variance in this curated set appears on screen. Projected closeness can mislead.</p></article>
          <article><span>02</span><h3>Tokens, not universal words</h3><p>GPT-2 uses byte-level BPE tokens. A leading <code>Ġ</code> marks a preceding space in this tokenizer. Multi-token labels here are arithmetic teaching composites—not learned whole-word storage.</p></article>
          <article><span>03</span><h3>Static, not contextual</h3><p>These rows initialize model processing. Later layers produce context-dependent activations, so “bank” in a financial sentence need not resemble “bank” beside a river. A static vector is not a complete meaning.</p></article>
        </div>
      </details>

      <div className="embedding-space__sr-summary">
        <h2>Accessible selected-vector summary</h2>
        <table>
          <caption>{transformationStatus}</caption>
          <thead><tr><th>Item</th><th>Representation</th><th>Magnitude</th><th>Nearest source-space neighbor</th><th>Cosine similarity</th></tr></thead>
          <tbody><tr><td>{selected.label}{transformed ? " transformed" : ""}</td><td>{transformed ? "Illustrative transformed vector" : selected.representation === "token" ? "Static learned token" : "Mean-pooled teaching composite"}</td><td>{format(selectionMagnitude)}</td><td>{displayedNeighbors[0]?.point.label}</td><td>{displayedNeighbors[0] ? format(displayedNeighbors[0].similarity) : "—"}</td></tr></tbody>
        </table>
      </div>
      <p className="embedding-space__sr-only" aria-live="polite">{transformationStatus}</p>
    </section>
  );
}

export function EmbeddingSpaceVisualization(props: EmbeddingSpaceVisualizationProps) {
  const [mode, setMode] = useState<"explore" | "train">(props.initialMode ?? "explore");
  const modeSwitcher = (
    <nav className="embedding-space__modes" aria-label="Embedding visualization modes">
      <button type="button" aria-current={mode === "explore" ? "page" : undefined} onClick={() => setMode("explore")}>
        <span>01</span><strong>Explore</strong><small>Production token atlas</small>
      </button>
      <button type="button" aria-current={mode === "train" ? "page" : undefined} onClick={() => setMode("train")}>
        <span>02</span><strong>Train</strong><small>Co-occurrence teaching model</small>
      </button>
    </nav>
  );

  if (mode === "train") {
    return (
      <Suspense fallback={<div className="embedding-space embedding-space__mode-loading" role="status">Loading the offline training checkpoints…</div>}>
        <LazyEmbeddingTrainingLab dataset={props.trainingDataset} modeSwitcher={modeSwitcher} />
      </Suspense>
    );
  }
  return <EmbeddingAtlas {...props} modeSwitcher={modeSwitcher} />;
}
