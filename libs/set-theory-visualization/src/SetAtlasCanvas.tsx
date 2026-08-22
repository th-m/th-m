import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type WheelEvent } from "react";
import { setAtlasAccent } from "./theme";
import type { Point, SetAtlasScene, ViewportState } from "./types";

interface SetAtlasCanvasProps {
  scene: SetAtlasScene;
  selectedSymbolId: string | null;
  viewport: ViewportState;
  fitRequest: number;
  onSelect: (symbolId: string) => void;
  onPin: (sceneId: string, point: Point) => void;
  onViewportChange: (viewport: ViewportState) => void;
  /** Read-only figure mode: disables drag-to-pin; pan/zoom/select remain. */
  readOnly?: boolean;
}

type DragState =
  | { kind: "pan"; pointerId: number; startClient: Point; startViewport: ViewportState }
  | { kind: "region"; pointerId: number; regionId: string; startClient: Point; base: Point; delta: Point };

const clampZoom = (zoom: number) => Math.min(3.4, Math.max(0.45, zoom));

export function SetAtlasCanvas({
  scene,
  selectedSymbolId,
  viewport,
  fitRequest,
  onSelect,
  onPin,
  onViewportChange,
  readOnly = false,
}: SetAtlasCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<DragState | null>(null);

  useEffect(() => {
    onViewportChange({ x: 0, y: 0, zoom: 1 });
  }, [fitRequest, scene.width, scene.height]);

  const orderedRegions = useMemo(
    () => [...scene.regions].sort((first, second) => first.depth - second.depth || second.rx - first.rx),
    [scene.regions],
  );

  // One accent per set, assigned in the same depth-then-id order the static
  // renderer uses, so a set keeps its color on every surface.
  const accentByRegion = useMemo(() => {
    const sorted = [...scene.regions].sort(
      (first, second) => first.depth - second.depth || first.id.localeCompare(second.id, "en"),
    );
    return new Map(sorted.map((region, index) => [region.id, setAtlasAccent(index)]));
  }, [scene.regions]);

  const regionAccent = (regionId: string): CSSProperties =>
    ({ "--region-accent": accentByRegion.get(regionId) ?? setAtlasAccent(0) }) as CSSProperties;

  const unitsPerPixel = () => {
    const rect = svgRef.current?.getBoundingClientRect();
    return rect ? (scene.width / viewport.zoom) / Math.max(1, rect.width) : 1;
  };

  const beginPan = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.target !== event.currentTarget && (event.target as Element).closest("[data-set-item]")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({
      kind: "pan",
      pointerId: event.pointerId,
      startClient: { x: event.clientX, y: event.clientY },
      startViewport: viewport,
    });
  };

  const beginRegionDrag = (event: ReactPointerEvent<SVGGElement>, regionId: string, base: Point) => {
    if (readOnly) return;
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({
      kind: "region",
      pointerId: event.pointerId,
      regionId,
      startClient: { x: event.clientX, y: event.clientY },
      base,
      delta: { x: 0, y: 0 },
    });
  };

  const movePointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!drag || drag.pointerId !== event.pointerId) return;
    const scale = unitsPerPixel();
    const delta = {
      x: (event.clientX - drag.startClient.x) * scale,
      y: (event.clientY - drag.startClient.y) * scale,
    };
    if (drag.kind === "pan") {
      onViewportChange({
        ...drag.startViewport,
        x: drag.startViewport.x - delta.x,
        y: drag.startViewport.y - delta.y,
      });
      return;
    }
    setDrag({ ...drag, delta });
  };

  const endPointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (drag.kind === "region" && Math.hypot(drag.delta.x, drag.delta.y) > unitsPerPixel() * 3) {
      onPin(drag.regionId, { x: drag.base.x + drag.delta.x, y: drag.base.y + drag.delta.y });
    }
    setDrag(null);
  };

  const zoom = (nextZoom: number) => {
    const normalized = clampZoom(nextZoom);
    const centerX = viewport.x + scene.width / viewport.zoom / 2;
    const centerY = viewport.y + scene.height / viewport.zoom / 2;
    onViewportChange({
      zoom: normalized,
      x: centerX - scene.width / normalized / 2,
      y: centerY - scene.height / normalized / 2,
    });
  };

  const onWheel = (event: WheelEvent<SVGSVGElement>) => {
    event.preventDefault();
    zoom(viewport.zoom * (event.deltaY > 0 ? 0.9 : 1.1));
  };

  const viewBox = `${viewport.x} ${viewport.y} ${scene.width / viewport.zoom} ${scene.height / viewport.zoom}`;

  return (
    <div className="set-canvas-shell">
      <svg
        ref={svgRef}
        className={`set-canvas${drag?.kind === "pan" ? " is-panning" : ""}`}
        viewBox={viewBox}
        preserveAspectRatio="xMidYMin meet"
        role="application"
        aria-label="TypeScript set atlas"
        onPointerDown={beginPan}
        onPointerMove={movePointer}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onWheel={onWheel}
      >
        <title>TypeScript set atlas</title>
        <desc>Nested and overlapping regions show relationships between named TypeScript types.</desc>
        <defs>
          <radialGradient id="set-region-fill" cx="58%" cy="38%">
            <stop offset="0" stopColor="currentColor" stopOpacity=".58" />
            <stop offset=".72" stopColor="currentColor" stopOpacity=".48" />
            <stop offset="1" stopColor="currentColor" stopOpacity=".42" />
          </radialGradient>
          <pattern id="set-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="var(--color-primary)" opacity=".1" />
          </pattern>
          <filter id="set-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect x={0} y={0} width={scene.width} height={scene.height} className="set-canvas-bg" />
        <rect x={0} y={0} width={scene.width} height={scene.height} fill="url(#set-grid)" pointerEvents="none" />
        <g aria-label="Set regions">
          {orderedRegions.map((region) => {
            const isSelected = Boolean(selectedSymbolId && region.symbolIds.includes(selectedSymbolId));
            const activeDrag = drag?.kind === "region" && drag.regionId === region.id ? drag.delta : { x: 0, y: 0 };
            const cx = region.cx + activeDrag.x;
            const cy = region.cy + activeDrag.y;
            const display = region.labels.includes(region.display)
              ? ""
              : region.display.length > 44
                ? `${region.display.slice(0, 41)}…`
                : region.display;
            return (
              <g
                key={region.id}
                data-set-item="region"
                className={`set-region${isSelected ? " is-selected" : ""}${region.approximate ? " is-approximate" : ""}`}
                style={regionAccent(region.id)}
                role="button"
                tabIndex={0}
                aria-label={`${region.labels.join(", ")} set${display ? `, ${display}` : ""}${region.approximate ? ", approximate geometry" : ""}`}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect(region.symbolIds[0]);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") onSelect(region.symbolIds[0]);
                }}
                onPointerDown={(event) => beginRegionDrag(event, region.id, { x: region.cx, y: region.cy })}
              >
                <ellipse
                  cx={cx}
                  cy={cy}
                  rx={region.rx}
                  ry={region.ry}
                  fill="url(#set-region-fill)"
                />
              </g>
            );
          })}
        </g>
        <g className="set-region-annotation-overlay" aria-hidden="true" pointerEvents="none">
          {orderedRegions.map((region, index) => {
            const activeDrag = drag?.kind === "region" && drag.regionId === region.id ? drag.delta : { x: 0, y: 0 };
            const cx = region.cx + activeDrag.x;
            const cy = region.cy + activeDrag.y;
            const top = cy - region.ry;
            const visibleLabels = region.labels.slice(0, 2);
            const labelY = top + Math.min(58, Math.max(46, region.ry * 0.36));
            const displayY = labelY + visibleLabels.length * 24 + 8;
            const labelOffsetX = scene.regions
              .filter((peer) =>
                peer.id !== region.id &&
                peer.depth === region.depth &&
                Math.abs(peer.cx - region.cx) < peer.rx + region.rx,
              )
              .reduce((offset, peer) => offset + (peer.cx < region.cx ? 18 : -18), 0);
            const labelX = cx + Math.max(-28, Math.min(28, labelOffsetX));
            const display = region.labels.includes(region.display)
              ? ""
              : region.display.length > 44
                ? `${region.display.slice(0, 41)}…`
                : region.display;
            return (
              <g key={`annotation:${region.id}`} className="set-region" style={regionAccent(region.id)}>
                <circle className="set-region-register" cx={cx} cy={top} r="4.5" />
                <text className="set-region-code" x={cx} y={top + 24} textAnchor="middle">
                  {`SET ${String(index + 1).padStart(2, "0")}${region.approximate ? " / ≈" : ""}`}
                </text>
                <text className="set-region-label" x={labelX} y={labelY} textAnchor="middle">
                  {visibleLabels.map((label, labelIndex) => (
                    <tspan key={label} x={labelX} dy={labelIndex === 0 ? 0 : 25}>{label}</tspan>
                  ))}
                </text>
                {display && <text className="set-region-display" x={labelX} y={displayY} textAnchor="middle">{display}</text>}
              </g>
            );
          })}
        </g>
        <g aria-label="Literal members" pointerEvents="none">
          {scene.atoms.map((atom) => (
            <g key={atom.id} className="set-atom" transform={`translate(${atom.x} ${atom.y})`}>
              <rect x="-50" y="-15" width="100" height="30" rx="15" />
              <text textAnchor="middle" dominantBaseline="middle">{atom.label}</text>
            </g>
          ))}
        </g>
        <g aria-label="Type exceptions">
          {scene.cards.map((card) => {
            const isSelected = selectedSymbolId === card.symbolId;
            return (
              <g
                key={card.id}
                data-set-item="card"
                className={`set-card is-${card.status}${isSelected ? " is-selected" : ""}`}
                role="button"
                tabIndex={0}
                aria-label={`${card.label}, ${card.status}`}
                onClick={(event) => { event.stopPropagation(); onSelect(card.symbolId); }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") onSelect(card.symbolId);
                }}
              >
                <rect x={card.x} y={card.y} width={card.width} height={card.height} rx="3" />
                <circle cx={card.x + 20} cy={card.y + card.height / 2} r="4" />
                <text className="set-card-status" x={card.x + 37} y={card.y + 25}>{card.status.toUpperCase()}</text>
                <text className="set-card-label" x={card.x + 37} y={card.y + 50}>{card.label}</text>
              </g>
            );
          })}
        </g>
        {scene.warnings.length > 0 && (
          <g className="set-scene-warning" transform={`translate(${scene.width - 292} 28)`}>
            <rect width="264" height="48" rx="2" />
            <circle cx="22" cy="24" r="4" />
            <text x="38" y="21">APPROXIMATE GEOMETRY</text>
            <text x="38" y="35">See diagnostics for {scene.warnings.length} note{scene.warnings.length === 1 ? "" : "s"}</text>
          </g>
        )}
      </svg>
      <div className="set-zoom-controls" aria-label="Atlas zoom controls">
        <button type="button" onClick={() => zoom(viewport.zoom * 1.18)} aria-label="Zoom in">Zoom in</button>
        <button type="button" onClick={() => zoom(viewport.zoom / 1.18)} aria-label="Zoom out">Zoom out</button>
        <span>{Math.round(viewport.zoom * 100)}%</span>
      </div>
    </div>
  );
}
