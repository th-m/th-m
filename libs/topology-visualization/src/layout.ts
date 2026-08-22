// Deterministic layered layout for system topologies. Layers become columns
// (lr) or rows (td) in document order; nodes stack inside their layer with
// fixed geometry from the theme. Pinned node positions win over the derived
// grid, so authored placements survive regeneration. React-free: safe for the
// Bun/Node generator.
import { topologyTheme } from "./theme";
import type { LayoutPositions, TopologyDocument } from "./types";

export interface LayoutExtent {
  width: number;
  height: number;
}

export function layoutTopology(document: TopologyDocument): { positions: LayoutPositions; extent: LayoutExtent } {
  const { nodeWidth, nodeHeight, columnGap, rowGap, headerHeight, graphPadding } = topologyTheme.geometry;
  const positions: LayoutPositions = {};
  const layerCount = document.layers.length;
  const rowsPerLayer = document.layers.map(
    (layer) => document.nodes.filter((node) => node.layerId === layer.id).length,
  );
  const maxRows = Math.max(0, ...rowsPerLayer);

  document.layers.forEach((layer, layerIndex) => {
    const nodes = document.nodes.filter((node) => node.layerId === layer.id);
    const gridX = graphPadding + layerIndex * (nodeWidth + columnGap);
    nodes.forEach((node, rowIndex) => {
      const gridY = graphPadding + headerHeight + rowIndex * (nodeHeight + rowGap);
      positions[node.id] = node.pinned && node.position ? node.position : { x: gridX, y: gridY };
    });
  });

  const contentWidth = Math.max(0, layerCount * nodeWidth + (layerCount - 1) * columnGap);
  const contentHeight = Math.max(0, headerHeight + maxRows * nodeHeight + (maxRows - 1) * rowGap);
  const width = contentWidth + graphPadding * 2;
  const height = contentHeight + graphPadding * 2;

  if (document.layoutDirection === "td") {
    const transposed: LayoutPositions = {};
    for (const [id, point] of Object.entries(positions)) {
      transposed[id] = { x: point.y, y: point.x };
    }
    return { positions: transposed, extent: { width: height, height: width } };
  }

  return { positions, extent: { width, height } };
}
