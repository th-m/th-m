import { describe, expect, it } from "vitest";
import { layoutTopology } from "../src/layout";
import { addLayer, addNode, createBlankTopology } from "../src/model";
import { createFactoryTopology } from "../src/seed";

const now = "2026-08-22T00:00:00.000Z";

function layeredDocument() {
  const blank = createBlankTopology(now);
  const withLayers = addLayer(addLayer(blank, "Apps"), "Edge");
  return addNode(addNode(withLayers, withLayers.layers[0].id, "Apps"), withLayers.layers[1].id, "Edge");
}

describe("layoutTopology", () => {
  it("lays layers out as left-to-right columns in document order", () => {
    const doc = layeredDocument();
    const { positions, extent } = layoutTopology(doc);
    const apps = positions[doc.nodes[0].id];
    const edge = positions[doc.nodes[1].id];

    expect(apps.x).toBeLessThan(edge.x);
    expect(apps.y).toBe(edge.y);
    expect(extent.width).toBeGreaterThan(extent.height);
    expect(apps.x).toBeGreaterThanOrEqual(84);
    expect(apps.y).toBeGreaterThanOrEqual(84);
  });

  it("transposes the layout for top-down direction", () => {
    const doc = { ...layeredDocument(), layoutDirection: "td" as const };
    const { positions, extent } = layoutTopology(doc);
    const apps = positions[doc.nodes[0].id];
    const edge = positions[doc.nodes[1].id];
    expect(apps.y).toBeLessThan(edge.y);
    expect(apps.x).toBe(edge.x);
    expect(extent.height).toBeGreaterThan(extent.width);
  });

  it("stacks multiple nodes per layer into rows", () => {
    const base = layeredDocument();
    const doc = addNode(base, base.layers[0].id, "App shell");
    const { positions } = layoutTopology(doc);
    const apps = positions[doc.nodes[0].id];
    const edge = positions[doc.nodes[1].id];
    const shell = positions[doc.nodes[2].id];
    // Nodes in the same layer share a column and stack into rows.
    expect(shell.x).toBe(apps.x);
    expect(shell.y).toBeGreaterThan(apps.y);
    // Nodes in adjacent layers share a row.
    expect(edge.x).toBeGreaterThan(apps.x);
    expect(edge.y).toBe(apps.y);
  });

  it("honors pinned positions", () => {
    const base = layeredDocument();
    const doc = {
      ...base,
      nodes: base.nodes.map((node, index) =>
        index === 0 ? { ...node, pinned: true, position: { x: 777, y: 333 } } : node,
      ),
    };
    const { positions } = layoutTopology(doc);
    expect(positions[doc.nodes[0].id]).toEqual({ x: 777, y: 333 });
  });

  it("lays out the factory seed deterministically", () => {
    const factory = createFactoryTopology(now);
    const a = layoutTopology(factory);
    const b = layoutTopology(createFactoryTopology(now));
    expect(a.positions).toEqual(b.positions);
    expect(a.extent).toEqual(b.extent);
    expect(Object.keys(a.positions)).toHaveLength(factory.nodes.length);
  });
});
