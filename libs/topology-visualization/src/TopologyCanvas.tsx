import { GraphCanvas as ReagraphCanvas, type GraphCanvasRef, type GraphEdge, type GraphNode, type InternalGraphPosition, type LayoutOverrides } from "reagraph";
import plexWoffUrl from "@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff?url";
import { forwardRef, useCallback, useEffect, useMemo, useRef, type CSSProperties } from "react";
import { layoutTopology } from "./layout";
import { createReagraphTheme } from "./reagraphTheme";
import { topologyTheme } from "./theme";
import type { TopologyDocument } from "./types";

export interface TopologyCanvasProps {
  document: TopologyDocument;
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string | null) => void;
  onNodeDragged?: (nodeId: string, position: { x: number; y: number }) => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function topologyToReagraph(document: TopologyDocument): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const layerName = new Map(document.layers.map((layer) => [layer.id, layer.name]));
  const nodes: GraphNode[] = document.nodes.map((node) => ({
    id: node.id,
    label: node.label,
    subLabel: layerName.get(node.layerId) ?? "Layer",
    size: node.emphasis ? 11 : 8,
    fill: node.emphasis ? topologyTheme.color.primary : topologyTheme.color.foreground,
    ...(node.pinned && node.position ? { fx: node.position.x, fy: node.position.y } : {}),
    data: { kind: "node" as const, nodeId: node.id, layerId: node.layerId },
  }));
  const edges: GraphEdge[] = document.links.map((link) => ({
    id: link.id,
    source: link.source,
    target: link.target,
    label: link.label,
    dashed: link.dashed,
    arrowPlacement: "end" as const,
    fill: topologyTheme.color.primary,
    data: { kind: "link" as const, linkId: link.id },
  }));
  return { nodes, edges };
}

function position(id: string, x: number, y: number): InternalGraphPosition {
  return { id, x, y, z: 0, data: null, links: [], index: 0, vx: 0, vy: 0 };
}

/**
 * Reagraph canvas for layered system topologies. Uses the same deterministic
 * layered layout as the SVG generator (`layoutType: "custom"`), so the
 * interactive preview and the generated artifact agree exactly — no force
 * simulation, no tree-layout collapse on multi-parent DAGs, and no crash on
 * cyclic topologies. Dragged nodes keep their drop position for the session;
 * the authoring surface persists them back onto the document.
 */
export const TopologyCanvas = forwardRef<GraphCanvasRef, TopologyCanvasProps>(
  function TopologyCanvas(
    { document, selectedNodeId, onSelectNode, onNodeDragged, disabled = false, className, style },
    ref,
  ) {
    const theme = useMemo(() => createReagraphTheme(), []);
    const { nodes, edges } = useMemo(() => topologyToReagraph(document), [document]);
    const positions = useMemo(() => layoutTopology(document).positions, [document]);
    const canvasRef = useRef<GraphCanvasRef | null>(null);

    const assignRef = useCallback(
      (value: GraphCanvasRef | null) => {
        canvasRef.current = value;
        if (typeof ref === "function") ref(value);
        else if (ref) ref.current = value;
      },
      [ref],
    );

    useEffect(() => {
      const timer = window.setTimeout(() => canvasRef.current?.fitNodesInView(undefined, { animated: true }), 180);
      return () => window.clearTimeout(timer);
    }, [document.id]);

    // `getNodePosition` is part of reagraph's layout factory props rather
    // than the public `LayoutOverrides` union, so it is passed through with a
    // cast; `layoutProvider` spreads overrides into the custom layout.
    const layoutOverrides = useMemo(
      () =>
        ({
          getNodePosition: (
            id: string,
            args: { drags?: Record<string, { position?: { x: number; y: number } }> },
          ): InternalGraphPosition => {
            const dragged = args.drags?.[id]?.position;
            if (dragged) return position(id, dragged.x, dragged.y);
            const point = positions[id];
            return point ? position(id, point.x, point.y) : position(id, 0, 0);
          },
        }) as unknown as LayoutOverrides,
      [positions],
    );

    return (
      <div className={`topology-canvas-surface ${className ?? ""}`.trim()} style={style}>
        <ReagraphCanvas
          ref={assignRef}
          nodes={nodes}
          edges={edges}
          selections={selectedNodeId ? [selectedNodeId] : []}
          layoutType="custom"
          layoutOverrides={layoutOverrides}
          labelType="all"
          labelFontUrl={plexWoffUrl}
          theme={theme}
          cameraMode="pan"
          minZoom={0.12}
          maxZoom={4}
          disabled={disabled}
          draggable={!disabled}
          onNodeClick={(node) => onSelectNode?.(node.id)}
          onCanvasClick={() => onSelectNode?.(null)}
          onNodeDragged={(node) =>
            onNodeDragged?.(node.id, { x: node.position?.x ?? 0, y: node.position?.y ?? 0 })
          }
        />
      </div>
    );
  },
);
