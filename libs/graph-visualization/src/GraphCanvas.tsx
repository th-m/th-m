import { GraphCanvas as ReagraphCanvas, type GraphCanvasRef, type GraphEdge, type GraphNode } from "reagraph";
import plexWoffUrl from "@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff?url";
import {
  Component,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createReagraphTheme } from "./reagraphTheme";
import { CanvasControls } from "./CanvasControls";
import { thomGraphNodeRenderer } from "./nodes";

export type GraphLayoutDensity = "comfortable" | "compact";

export interface GraphLayoutProfile {
  nodeSpacing: number;
  layeredSpacing: number;
  stressEdgeLength: number;
  overlapPadding: number;
}

/**
 * Shared density contract. Reagraph consumes these values through the
 * force-directed adapter below; keeping the source values explicit makes
 * rendering deterministic across every graph surface. The values are tuned
 * against the seeded graphs (measured minimum pairwise node distance):
 * comfortable ≈ 150–200px, compact ≈ 110–160px — wide enough that node
 * labels never touch.
 */
export const graphLayoutProfiles: Readonly<Record<GraphLayoutDensity, GraphLayoutProfile>> = {
  comfortable: {
    nodeSpacing: 56,
    layeredSpacing: 96,
    stressEdgeLength: 560,
    overlapPadding: 28,
  },
  compact: {
    nodeSpacing: 28,
    layeredSpacing: 64,
    stressEdgeLength: 340,
    overlapPadding: 18,
  },
};

export interface GraphLayoutOptions {
  density?: GraphLayoutDensity | "auto";
  /** Fractional breathing room applied after fitting; defaults to 8%. */
  fitPadding?: number;
}

export function graphNeedsCompactLayout(
  width: number,
  height: number,
  nodeCount: number,
): boolean {
  if (width <= 0 || height <= 0 || nodeCount === 0) return false;
  if (width <= 680) return true;
  const comfortableNodeArea = 180 * 96;
  return nodeCount * comfortableNodeArea > width * height * 0.72;
}

export function graphLayoutOverrides(
  _layoutMode: "editorial" | "directional",
  density: GraphLayoutDensity,
) {
  const profile = graphLayoutProfiles[density];
  // Every mode shares the force-directed layout. Repulsion scales with the
  // stress edge length (≈ 4×) so connected clusters keep generous, legible
  // gaps. Reagraph's tree-based hierarchical layout collapses layered DAGs
  // into a single column and throws on multi-root or cyclic graphs, so
  // directional graphs keep the force layout and communicate direction
  // through edge arrows and curves instead.
  return {
    linkDistance: profile.stressEdgeLength,
    nodeStrength: -(profile.stressEdgeLength * 4),
  };
}

export interface ThomGraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selections?: string[];
  actives?: string[];
  /** Layout mode drives the layout family: editorial flow vs directional DAG. */
  layoutMode?: "editorial" | "directional";
  /** Comfortable by default; `auto` switches to compact when 1x space is constrained. */
  density?: GraphLayoutDensity | "auto";
  /** Refit after layout settles and when the containing surface changes size. */
  autoFit?: boolean;
  /** Fractional padding added after fitting. */
  fitPadding?: number;
  /**
   * Minimum zoom applied after fitting (default 0.1 = no floor). Raises the
   * settled view so labels stay readable on small fitted figures; the graph
   * overflows the viewport and is explored by panning/zooming.
   */
  fitMinScale?: number;
  disabled?: boolean;
  draggable?: boolean;
  onNodeClick?: (nodeId: string) => void;
  onNodeDoubleClick?: (nodeId: string) => void;
  onNodeDragged?: (nodeId: string, position: { x: number; y: number }) => void;
  /** Native-button keyboard path for WebGL nodes. */
  onNodeKeyboardActivate?: (nodeId: string) => void;
  keyboardActionLabel?: string;
  onCanvasClick?: () => void;
  /** Show the floating zoom/pan controls over the canvas. Defaults to true. */
  showControls?: boolean;
  /** Invoked when the WebGL canvas fails to mount. */
  onError?: () => void;
  className?: string;
  style?: CSSProperties;
}

class CanvasErrorBoundary extends Component<
  { onError?: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  componentDidCatch(): void {
    this.props.onError?.();
  }

  render(): ReactNode {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Shared reagraph canvas configured with the THOM theme and typography.
 * Wraps the WebGL GraphCanvas so editor, explorer, and article figure stay on
 * one brand/token surface. Pinned node positions arrive as fx/fy/fz on the
 * mapped nodes themselves.
 */
export const ThomGraphCanvas = forwardRef<GraphCanvasRef, ThomGraphCanvasProps>(
  function ThomGraphCanvas(
    {
      nodes,
      edges,
      selections,
      actives,
      layoutMode = "editorial",
      density = "comfortable",
      autoFit = true,
      fitPadding = 0.08,
      fitMinScale = 0.1,
      disabled = false,
      draggable = false,
      onNodeClick,
      onNodeDoubleClick,
      onNodeDragged,
      onNodeKeyboardActivate,
      keyboardActionLabel = "Open",
      onCanvasClick,
      showControls = true,
      onError,
      className,
      style,
    },
    ref,
  ) {
    const theme = useMemo(() => createReagraphTheme(), []);
    const canvasRef = useRef<GraphCanvasRef | null>(null);
    const surfaceRef = useRef<HTMLDivElement | null>(null);
    const pointerActiveRef = useRef(false);
    const pendingFitRef = useRef(false);
    const fitTimersRef = useRef<number[]>([]);
    const [autoDensity, setAutoDensity] = useState<GraphLayoutDensity>("comfortable");
    const resolvedDensity = density === "auto" ? autoDensity : density;

    const assignCanvasRef = useCallback(
      (value: GraphCanvasRef | null) => {
        canvasRef.current = value;
        if (typeof ref === "function") ref(value);
        else if (ref) ref.current = value;
      },
      [ref],
    );

    const clearFitTimers = useCallback(() => {
      for (const timer of fitTimersRef.current) window.clearTimeout(timer);
      fitTimersRef.current = [];
    }, []);

    const fitGraph = useCallback(
      (animated = false) => {
        if (pointerActiveRef.current) {
          pendingFitRef.current = true;
          return;
        }
        const canvas = canvasRef.current;
        if (!canvas || nodes.length === 0) return;
        canvas.fitNodesInView(undefined, { animated });
        const paddingTimer = window.setTimeout(() => {
          if (pointerActiveRef.current) {
            pendingFitRef.current = true;
            return;
          }
          const controls = canvas.getControls();
          const initialZoom = Math.min(1, controls?.camera.zoom ?? 1);
          // Fit padding breathes around the graph; `fitMinScale` then enforces
          // a legibility floor so fitted figures never shrink labels below
          // readable size (the graph overflows the viewport and pans/zooms).
          const padded = initialZoom * (1 - fitPadding);
          const target = Math.max(padded, fitMinScale);
          void controls?.zoomTo(Math.max(0.12, target), false);
        }, animated ? 240 : 80);
        fitTimersRef.current.push(paddingTimer);
      },
      [fitPadding, fitMinScale, nodes.length],
    );

    const scheduleSettledFit = useCallback(() => {
      if (!autoFit) return;
      clearFitTimers();
      // The first pass catches deterministic layouts; the second catches the
      // end of Reagraph's force simulation without continuously moving the camera.
      fitTimersRef.current = [180, 620].map((delay) =>
        window.setTimeout(() => fitGraph(false), delay),
      );
    }, [autoFit, clearFitTimers, fitGraph]);

    useEffect(() => {
      scheduleSettledFit();
      return clearFitTimers;
    }, [edges, nodes, layoutMode, resolvedDensity, scheduleSettledFit, clearFitTimers]);

    useEffect(() => {
      const surface = surfaceRef.current;
      if (!surface || typeof ResizeObserver === "undefined") return;
      const updateForSize = (width: number, height: number) => {
        if (density === "auto") {
          const next = graphNeedsCompactLayout(width, height, nodes.length)
            ? "compact"
            : "comfortable";
          setAutoDensity((current) => (current === next ? current : next));
        }
        scheduleSettledFit();
      };
      const observer = new ResizeObserver((entries) => {
        const bounds = entries[0]?.contentRect;
        if (bounds) updateForSize(bounds.width, bounds.height);
      });
      observer.observe(surface);
      const bounds = surface.getBoundingClientRect();
      updateForSize(bounds.width, bounds.height);
      return () => observer.disconnect();
    }, [density, nodes.length, scheduleSettledFit]);

    useEffect(() => {
      const finishInteraction = () => {
        pointerActiveRef.current = false;
        if (pendingFitRef.current) {
          pendingFitRef.current = false;
          scheduleSettledFit();
        }
      };
      window.addEventListener("pointerup", finishInteraction);
      window.addEventListener("pointercancel", finishInteraction);
      return () => {
        window.removeEventListener("pointerup", finishInteraction);
        window.removeEventListener("pointercancel", finishInteraction);
      };
    }, [scheduleSettledFit]);

    return (
      <div
        ref={surfaceRef}
        className={`graph-canvas-surface ${className ?? ""}`.trim()}
        style={style}
        data-density={resolvedDensity}
        onPointerDownCapture={() => {
          pointerActiveRef.current = true;
        }}
      >
        <CanvasErrorBoundary onError={onError}>
          <div
            className="graph-canvas-renderer"
            aria-hidden={onNodeKeyboardActivate ? true : undefined}
          >
            <ReagraphCanvas
              ref={assignCanvasRef}
              nodes={nodes}
              edges={edges}
              selections={selections ?? []}
              actives={actives ?? []}
              layoutType="forceDirected2d"
              layoutOverrides={graphLayoutOverrides(layoutMode, resolvedDensity)}
              labelType="all"
              labelFontUrl={plexWoffUrl}
              renderNode={thomGraphNodeRenderer}
              theme={theme}
              cameraMode="pan"
              minZoom={0.12}
              maxZoom={4}
              draggable={draggable}
              disabled={disabled}
              onNodeClick={(node) => onNodeClick?.(node.id)}
              onNodeDoubleClick={(node) => onNodeDoubleClick?.(node.id)}
              onNodeDragged={(node) =>
                onNodeDragged?.(node.id, {
                  x: node.position?.x ?? 0,
                  y: node.position?.y ?? 0,
                })
              }
              onCanvasClick={() => onCanvasClick?.()}
            />
          </div>
        </CanvasErrorBoundary>
        {showControls ? <CanvasControls canvasRef={canvasRef} /> : null}
        {onNodeKeyboardActivate ? (
          <div className="graph-canvas-keyboard" role="group" aria-label="Graph nodes">
            {nodes.map((node) => (
              <button
                key={node.id}
                type="button"
                className="graph-canvas-keyboard__node"
                aria-label={`${keyboardActionLabel} ${node.label ?? node.id}`}
                onClick={() => onNodeKeyboardActivate(node.id)}
              >
                {node.label ?? node.id}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    );
  },
);
