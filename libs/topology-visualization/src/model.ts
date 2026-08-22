// Topology model: pure functions over TopologyDocument. All updates are
// immutable and return a new document; none mutate the input.
import { createId } from "./ids";
import type { TopologyDocument, TopologyLayer, TopologyLink, TopologyNode } from "./types";

export function createBlankTopology(now = new Date().toISOString()): TopologyDocument {
  return {
    schemaVersion: 1,
    id: createId("topology"),
    name: "Untitled topology",
    createdAt: now,
    updatedAt: now,
    themeId: "thom-dark",
    layoutDirection: "lr",
    layers: [],
    nodes: [],
    links: [],
  };
}

function touch(document: TopologyDocument, now = new Date().toISOString()): TopologyDocument {
  return { ...document, updatedAt: now };
}

export function addLayer(document: TopologyDocument, name = "New layer"): TopologyDocument {
  const layer: TopologyLayer = { id: createId("layer"), name };
  return touch({ ...document, layers: [...document.layers, layer] });
}

export function renameLayer(
  document: TopologyDocument,
  layerId: string,
  name: string,
): TopologyDocument {
  return touch({
    ...document,
    layers: document.layers.map((layer) => (layer.id === layerId ? { ...layer, name } : layer)),
  });
}

export function setLayerDetail(
  document: TopologyDocument,
  layerId: string,
  detail: string,
): TopologyDocument {
  return touch({
    ...document,
    layers: document.layers.map((layer) => (layer.id === layerId ? { ...layer, detail } : layer)),
  });
}

export function moveLayer(
  document: TopologyDocument,
  layerId: string,
  direction: -1 | 1,
): TopologyDocument {
  const index = document.layers.findIndex((layer) => layer.id === layerId);
  const next = index + direction;
  if (index < 0 || next < 0 || next >= document.layers.length) return document;
  const layers = [...document.layers];
  const [layer] = layers.splice(index, 1);
  layers.splice(next, 0, layer);
  return touch({ ...document, layers });
}

export function removeLayer(document: TopologyDocument, layerId: string): TopologyDocument {
  const removedNodeIds = new Set(
    document.nodes.filter((node) => node.layerId === layerId).map((node) => node.id),
  );
  return touch({
    ...document,
    layers: document.layers.filter((layer) => layer.id !== layerId),
    nodes: document.nodes.filter((node) => node.layerId !== layerId),
    links: document.links.filter(
      (link) => !removedNodeIds.has(link.source) && !removedNodeIds.has(link.target),
    ),
  });
}

export function addNode(
  document: TopologyDocument,
  layerId: string,
  label = "New node",
): TopologyDocument {
  if (!document.layers.some((layer) => layer.id === layerId)) return document;
  const node: TopologyNode = { id: createId("node"), layerId, label };
  return touch({ ...document, nodes: [...document.nodes, node] });
}

export function renameNode(
  document: TopologyDocument,
  nodeId: string,
  label: string,
): TopologyDocument {
  return touch({
    ...document,
    nodes: document.nodes.map((node) => (node.id === nodeId ? { ...node, label } : node)),
  });
}

export function moveNode(
  document: TopologyDocument,
  nodeId: string,
  layerId: string,
): TopologyDocument {
  return touch({
    ...document,
    nodes: document.nodes.map((node) =>
      node.id === nodeId ? { ...node, layerId, pinned: false, position: null } : node,
    ),
  });
}

export function toggleNodeEmphasis(document: TopologyDocument, nodeId: string): TopologyDocument {
  return touch({
    ...document,
    nodes: document.nodes.map((node) =>
      node.id === nodeId ? { ...node, emphasis: !node.emphasis } : node,
    ),
  });
}

export function removeNode(document: TopologyDocument, nodeId: string): TopologyDocument {
  return touch({
    ...document,
    nodes: document.nodes.filter((node) => node.id !== nodeId),
    links: document.links.filter((link) => link.source !== nodeId && link.target !== nodeId),
  });
}

export function addLink(
  document: TopologyDocument,
  source: string,
  target: string,
  label?: string,
): TopologyDocument {
  if (source === target) return document;
  const exists = document.links.some((link) => link.source === source && link.target === target);
  if (exists) return document;
  const link: TopologyLink = { id: createId("link"), source, target, label };
  return touch({ ...document, links: [...document.links, link] });
}

export function removeLink(document: TopologyDocument, linkId: string): TopologyDocument {
  return touch({ ...document, links: document.links.filter((link) => link.id !== linkId) });
}

export function setLinkLabel(
  document: TopologyDocument,
  linkId: string,
  label: string,
): TopologyDocument {
  return touch({
    ...document,
    links: document.links.map((link) => (link.id === linkId ? { ...link, label } : link)),
  });
}

export function toggleLinkDashed(document: TopologyDocument, linkId: string): TopologyDocument {
  return touch({
    ...document,
    links: document.links.map((link) =>
      link.id === linkId ? { ...link, dashed: !link.dashed } : link,
    ),
  });
}

export function isValidTopologyDocument(value: unknown): value is TopologyDocument {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<TopologyDocument>;
  if (candidate.schemaVersion !== 1 || typeof candidate.id !== "string") return false;
  if (typeof candidate.name !== "string") return false;
  if (!Array.isArray(candidate.layers) || !Array.isArray(candidate.nodes) || !Array.isArray(candidate.links)) {
    return false;
  }
  if (candidate.layoutDirection !== "lr" && candidate.layoutDirection !== "td") return false;
  const layerIds = new Set(candidate.layers.map((layer) => layer.id));
  const nodeIds = new Set(candidate.nodes.map((node) => node.id));
  if (!candidate.nodes.every((node) => typeof node.id === "string" && layerIds.has(node.layerId))) {
    return false;
  }
  return candidate.links.every(
    (link) =>
      typeof link.id === "string" &&
      nodeIds.has(link.source) &&
      nodeIds.has(link.target) &&
      link.source !== link.target,
  );
}

export function isValidTopologyLibrary(value: unknown): value is { schemaVersion: 1; activeDocumentId: string; documents: TopologyDocument[] } {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as { schemaVersion?: unknown; activeDocumentId?: unknown; documents?: unknown };
  return (
    candidate.schemaVersion === 1 &&
    typeof candidate.activeDocumentId === "string" &&
    Array.isArray(candidate.documents) &&
    candidate.documents.every((document) => isValidTopologyDocument(document))
  );
}
