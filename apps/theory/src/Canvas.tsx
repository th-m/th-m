import { PianoRollMarks, rollDomain } from "./PianoRoll";
import { totalDuration } from "./music";
import { useState, useRef, useEffect, type PointerEvent } from "react";
import type { Graph, GNode } from "./graphs";
import type { Study } from "./model";
const palette = [
  "#89bcff",
  "#77e1bc",
  "#f0cb7d",
  "#bca1ff",
  "#f5a9cd",
  "#79d3e8",
  "#f1b18d",
];
export function Canvas({
  graph,
  study,
  selected,
  onSelect,
  beat = 0,
}: {
  graph: Graph;
  study: Study;
  selected: string | null;
  onSelect: (id: string) => void;
  beat?: number;
}) {
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
  const [narrow, setNarrow] = useState(
    () => window.matchMedia?.("(max-width: 650px)").matches ?? false,
  );
  useEffect(() => {
    const media = window.matchMedia?.("(max-width: 650px)");
    if (!media) return;
    const update = () => setNarrow(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const compactMotif = narrow && study.kind === "motif";
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<{ x: number; y: number; cx: number; cy: number } | null>(
    null,
  );
  // Reflow only the drawing on narrow screens; musical data and ancestry stay intact.
  let all = graph.nodes;
  if (compactMotif) {
    let top = 120;
    all = [];
    for (let level = 0; level <= 4; level++) {
      const group = graph.nodes.filter(
        (n) => Math.round((n.y - 150) / 300) === level,
      );
      all.push(
        ...group.map((n, i) => ({
          ...n,
          x: group.length === 1 ? 260 : 130 + (i % 2) * 260,
          y: top + Math.floor(i / 2) * 250,
        })),
      );
      top += Math.ceil(group.length / 2) * 250;
    }
  }
  const margin = 95,
    minX = Math.min(
      0,
      ...all.map((n) => n.x - Math.max(margin, (n.r ?? 30) + 16)),
    ),
    maxX = Math.max(
      compactMotif ? 520 : 880,
      ...all.map((n) => n.x + Math.max(margin, (n.r ?? 30) + 16)),
    ),
    minY = Math.min(0, ...all.map((n) => n.y - margin)),
    maxY = Math.max(compactMotif ? 0 : 660, ...all.map((n) => n.y + margin));
  const width = maxX - minX,
    height = maxY - minY,
    vw = width / camera.zoom,
    vh = height / camera.zoom;
  function down(e: PointerEvent<SVGSVGElement>) {
    if ((e.target as Element).closest("[role=button]")) return;
    drag.current = { x: e.clientX, y: e.clientY, cx: camera.x, cy: camera.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function move(e: PointerEvent<SVGSVGElement>) {
    if (!drag.current || !svg.current) return;
    const rect = svg.current.getBoundingClientRect();
    const scale = Math.min(rect.width / vw, rect.height / vh);
    setCamera((c) => ({
      ...c,
      x: drag.current!.cx - (e.clientX - drag.current!.x) / scale,
      y: drag.current!.cy - (e.clientY - drag.current!.y) / scale,
    }));
  }
  const key = (id: string, e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(id);
    }
  };
  const motifDomain =
    study.kind === "motif"
      ? rollDomain(study.data.variations.map((v) => v.notes))
      : null;
  function node(n: GNode) {
    const chosen = selected === n.id,
      routeIndex = study.route.indexOf(n.id),
      fill = palette[(n.tone ?? 0) % palette.length],
      r = n.r ?? 30;
    const small = r < 10;
    const melody = study.kind === "motif" && n.motif;
    return (
      <g
        key={n.id}
        role="button"
        tabIndex={0}
        aria-label={n.label + (n.sub ? " · " + n.sub : "")}
        aria-pressed={chosen}
        className={
          "map-node " +
          (chosen ? "chosen" : "") +
          (n.disabled ? " inactive" : "")
        }
        data-node-id={n.id}
        onClick={() => onSelect(n.id)}
        onKeyDown={(e) => key(n.id, e)}
        transform={`translate(${n.x} ${n.y})`}
        style={{ "--node-color": fill } as React.CSSProperties}
      >
        <title>{n.detail}</title>
        {chosen &&
          (melody ? (
            <rect
              className="selection-halo"
              x={-r - 6}
              y={-85}
              width={2 * r + 12}
              height={172}
              rx={16}
            />
          ) : (
            <circle
              className="selection-halo"
              r={n.shape === "rect" ? r + 8 : r + 9}
            />
          ))}
        {n.shape === "rect" ? (
          <rect
            x={-r}
            y={melody ? -79 : -28}
            width={2 * r}
            height={melody ? 160 : 56}
            rx={10}
          />
        ) : n.shape === "hex" ? (
          <polygon
            points={Array.from(
              { length: 6 },
              (_, i) =>
                `${Math.cos((Math.PI / 3) * i) * r},${Math.sin((Math.PI / 3) * i) * r}`,
            ).join(" ")}
          />
        ) : (
          <circle r={r} />
        )}
        {melody && motifDomain && (
          <>
            <text className="node-label" y={-53}>
              {n.label}
            </text>
            <text className="node-sub" y={-35}>
              {totalDuration(melody.notes)} beats · {melody.notes.length} notes
            </text>
            <g transform={`translate(${-r + 14} -22)`}>
              <PianoRollMarks
                notes={melody.notes}
                domain={motifDomain}
                width={2 * r - 28}
                height={81}
              />
            </g>
          </>
        )}
        {!small && !melody && (
          <>
            <text
              className={"node-label " + (r < 20 ? "tiny" : "")}
              y={n.sub ? -2 : 5}
            >
              {n.label.length > 22 ? n.label.slice(0, 21) + "…" : n.label}
            </text>
            {n.sub && (
              <text className="node-sub" y={n.shape === "rect" ? 43 : r + 19}>
                {n.sub.length > 35 ? n.sub.slice(0, 34) + "…" : n.sub}
              </text>
            )}
          </>
        )}
        {small && chosen && (
          <text className="node-label" y={-15}>
            {n.label}
          </text>
        )}
        {routeIndex >= 0 && (
          <g transform={`translate(${r * 0.7} ${-r * 0.7})`}>
            <circle className="route-badge" r="10" />
            <text className="route-number" y="4">
              {routeIndex + 1}
            </text>
          </g>
        )}
      </g>
    );
  }
  return (
    <section className="canvas-panel" aria-label="Musical exploration canvas">
      <div className="canvas-caption">
        <span>
          <span className="live-dot" /> RELATIONSHIP MAP
        </span>
        <span>
          {graph.nodes.length} items · {graph.edges.length} relationships
        </span>
      </div>
      <svg
        ref={svg}
        style={
          compactMotif
            ? {
                aspectRatio: `${width} / ${height}`,
                height: "auto",
                maxHeight: 1800,
              }
            : undefined
        }
        viewBox={`${minX + (width - vw) / 2 + camera.x} ${minY + (height - vh) / 2 + camera.y} ${vw} ${vh}`}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        aria-label={study.name + " diagram"}
      >
        <defs>
          <pattern
            id="dots"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r=".7" fill="#263441" />
          </pattern>
        </defs>
        <rect
          x={minX - 2000}
          y={minY - 2000}
          width={width + 4000}
          height={height + 4000}
          fill="url(#dots)"
        />
        {study.kind === "snowflake" &&
          [100, 200, 290].map((r) => (
            <circle
              key={r}
              cx="440"
              cy="330"
              r={r}
              className="reference-ring"
            />
          ))}
        {study.kind === "spiral" && (
          <path
            className="spiral-track"
            d={graph.nodes
              .map((n, i) => `${i ? "L" : "M"} ${n.x} ${n.y}`)
              .join(" ")}
          />
        )}
        {graph.circles?.map((c, i) => (
          <g key={i}>
            <circle cx={c.x} cy={c.y} r={c.r} className="reference-ring" />
            <text className="ring-label" x={c.x + c.r + 22} y={c.y - 12}>
              {c.label}
            </text>
          </g>
        ))}
        {graph.edges.map((e) => {
          const a = all.find((n) => n.id === e.from),
            b = all.find((n) => n.id === e.to);
          if (!a || !b) return null;
          const chosen = selected === e.id,
            route = study.route.some(
              (n, i) => i && study.route[i - 1] === e.from && n === e.to,
            );
          const motifEdge = study.kind === "motif";
          const path = motifEdge
            ? `M ${a.x} ${a.y + 81} V ${b.y - 130} H ${b.x} V ${b.y - 79}`
            : `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
          return (
            <g
              key={e.id}
              role="button"
              tabIndex={0}
              aria-label={"Relationship " + (e.label || e.detail)}
              aria-pressed={chosen}
              className={
                "map-edge " +
                (chosen ? "chosen" : "") +
                (route ? " routed" : "")
              }
              onClick={() => onSelect(e.id)}
              onKeyDown={(event) => key(e.id, event)}
            >
              <title>{e.detail}</title>
              <path className="edge-hit" d={path} />
              <path
                className="edge-line"
                strokeDasharray={e.dashed ? "5 6" : undefined}
                d={path}
              />
              {e.label && (
                <text
                  className={motifEdge ? "motif-edge-label" : undefined}
                  x={motifEdge ? b.x : (a.x + b.x) / 2}
                  y={motifEdge ? b.y - 98 : (a.y + b.y) / 2 - 9}
                >
                  {e.label}
                </text>
              )}
            </g>
          );
        })}
        {all.map(node)}
        {study.kind === "mandala" && (
          <>
            <circle cx="440" cy="330" r="64" className="clock-center" />
            <text x="440" y="327" className="clock-title">
              4 / 4
            </text>
            <text x="440" y="350" className="clock-sub">
              SILENT CLOCK
            </text>
            {study.data.rings.map((ring, k) => {
              const a =
                  -Math.PI / 2 +
                  ((beat % (ring.bars * 4)) / (ring.bars * 4)) * Math.PI * 2,
                r = 100 + k * 54;
              return (
                <circle
                  key={ring.id}
                  cx={440 + Math.cos(a) * r}
                  cy={330 + Math.sin(a) * r}
                  r="6"
                  fill="white"
                  pointerEvents="none"
                />
              );
            })}
          </>
        )}
      </svg>
      <div className="view-tools" aria-label="View controls">
        <button
          onClick={() =>
            setCamera((c) => ({ ...c, zoom: Math.max(0.3, c.zoom / 1.25) }))
          }
          aria-label="Zoom out"
        >
          −
        </button>
        <output>{Math.round(camera.zoom * 100)}%</output>
        <button
          onClick={() =>
            setCamera((c) => ({ ...c, zoom: Math.min(4, c.zoom * 1.25) }))
          }
          aria-label="Zoom in"
        >
          +
        </button>
        <i />
        <button onClick={() => setCamera({ x: 0, y: 0, zoom: 1 })}>
          Fit view
        </button>
        <span>Drag empty space to pan</span>
      </div>
      <div className="legend">{graph.legend}</div>
    </section>
  );
}
