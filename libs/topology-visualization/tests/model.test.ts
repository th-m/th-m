import { describe, expect, it } from "vitest";
import {
  addLayer,
  addLink,
  addNode,
  createBlankTopology,
  isValidTopologyDocument,
  moveLayer,
  moveNode,
  removeLayer,
  removeNode,
  renameLayer,
  renameNode,
  toggleNodeEmphasis,
} from "../src/model";

const now = "2026-08-22T00:00:00.000Z";

describe("topology model", () => {
  it("creates a blank topology and adds layers/nodes/links", () => {
    const blank = createBlankTopology(now);
    expect(blank.layers).toEqual([]);

    const layered = addLayer(blank, "Apps");
    const edge = addLayer(layered, "Edge");
    expect(edge.layers.map((layer) => layer.name)).toEqual(["Apps", "Edge"]);

    const withNodes = addNode(edge, edge.layers[0].id, "Apps");
    const node = withNodes.nodes[0];
    expect(node.layerId).toBe(edge.layers[0].id);

    const second = addNode(withNodes, edge.layers[1].id);
    const linked = addLink(second, node.id, second.nodes[1].id);
    expect(linked.links).toHaveLength(1);
  });

  it("rejects self links and duplicate ordered pairs", () => {
    const blank = createBlankTopology(now);
    const first = addLayer(blank, "A");
    const withNodes = addNode(addNode(first, first.layers[0].id), first.layers[0].id);
    const a = withNodes.nodes[0];
    const b = withNodes.nodes[1];

    expect(addLink(withNodes, a.id, a.id)).toBe(withNodes);
    const once = addLink(withNodes, a.id, b.id);
    expect(once.links).toHaveLength(1);
    expect(addLink(once, a.id, b.id)).toBe(once);
    expect(addLink(once, b.id, a.id).links).toHaveLength(2);
  });

  it("renames and reorders layers", () => {
    const blank = createBlankTopology(now);
    const doc = addLayer(addLayer(blank, "A"), "B");
    const renamed = renameLayer(doc, doc.layers[0].id, "Apps");
    expect(renamed.layers[0].name).toBe("Apps");

    const moved = moveLayer(renamed, renamed.layers[0].id, 1);
    expect(moved.layers.map((layer) => layer.name)).toEqual(["B", "Apps"]);
  });

  it("removes a layer with its nodes and touching links", () => {
    const blank = createBlankTopology(now);
    const doc = addLayer(addLayer(blank, "A"), "B");
    const withNodes = addNode(addNode(doc, doc.layers[0].id), doc.layers[1].id);
    const a = withNodes.nodes[0];
    const b = withNodes.nodes[1];
    const linked = addLink(withNodes, a.id, b.id);

    const pruned = removeLayer(linked, doc.layers[0].id);
    expect(pruned.layers).toHaveLength(1);
    expect(pruned.nodes.map((node) => node.id)).toEqual([b.id]);
    expect(pruned.links).toHaveLength(0);
  });

  it("removes a node with its touching links", () => {
    const blank = createBlankTopology(now);
    const doc = addLayer(addLayer(blank, "A"), "B");
    const withNodes = addNode(addNode(doc, doc.layers[0].id), doc.layers[1].id);
    const a = withNodes.nodes[0];
    const b = withNodes.nodes[1];
    const linked = addLink(withNodes, a.id, b.id);
    const pruned = removeNode(linked, a.id);
    expect(pruned.nodes).toHaveLength(1);
    expect(pruned.links).toHaveLength(0);
  });

  it("moves a node between layers and clears its pinned position", () => {
    const blank = createBlankTopology(now);
    const doc = addLayer(addLayer(blank, "A"), "B");
    const withNodes = addNode(doc, doc.layers[0].id);
    const node = withNodes.nodes[0];
    const pinned = { ...withNodes, nodes: [{ ...node, pinned: true, position: { x: 1, y: 2 } }] };
    const moved = moveNode(pinned, node.id, doc.layers[1].id);
    expect(moved.nodes[0].layerId).toBe(doc.layers[1].id);
    expect(moved.nodes[0].pinned).toBe(false);
    expect(moved.nodes[0].position).toBeNull();
  });

  it("toggles node emphasis", () => {
    const blank = createBlankTopology(now);
    const first = addLayer(blank, "A");
    const doc = addNode(first, first.layers[0].id);
    const node = doc.nodes[0];
    expect(toggleNodeEmphasis(doc, node.id).nodes[0].emphasis).toBe(true);
    expect(toggleNodeEmphasis(toggleNodeEmphasis(doc, node.id), node.id).nodes[0].emphasis).toBe(false);
  });

  it("validates topology documents", () => {
    const first = addLayer(createBlankTopology(now), "A");
    const doc = addNode(first, first.layers[0].id);
    expect(isValidTopologyDocument(doc)).toBe(true);
    expect(isValidTopologyDocument(createBlankTopology(now))).toBe(true);

    expect(
      isValidTopologyDocument({ ...doc, links: [{ id: "x", source: "nope", target: doc.nodes[0].id }] }),
    ).toBe(false);
    expect(isValidTopologyDocument({ ...doc, layoutDirection: "diagonal" })).toBe(false);
  });

  it("renames nodes", () => {
    const blank = createBlankTopology(now);
    const first = addLayer(blank, "A");
    const doc = addNode(first, first.layers[0].id);
    const renamed = renameNode(doc, doc.nodes[0].id, "Edge layer");
    expect(renamed.nodes[0].label).toBe("Edge layer");
  });
});
