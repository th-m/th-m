// Seeded layered system topologies: the factory dependency topology (the
// canonical THOM layered system) and a proof-pipeline topology. Each returns
// a fresh TopologyDocument; ids are stable so figures and tests can rely on
// them.
import type { TopologyDocument, TopologyLibrary } from "./types";

export function createFactoryTopology(now = new Date().toISOString()): TopologyDocument {
  return {
    schemaVersion: 1,
    id: "factory-layer-topology",
    name: "Factory layer topology",
    createdAt: now,
    updatedAt: now,
    themeId: "thom-dark",
    layoutDirection: "lr",
    layers: [
      { id: "apps", name: "Apps", detail: "Composition and lifecycle" },
      { id: "edge", name: "Edge", detail: "Product workflows, provider-backed data, reactive state" },
      { id: "engine", name: "Engine", detail: "Deterministic audio/video execution" },
      { id: "schema", name: "Schema", detail: "Canonical models, invariants, taxonomy" },
      { id: "platform", name: "Platform", detail: "Product-neutral mechanisms and helpers" },
    ],
    nodes: [
      { id: "apps-node", layerId: "apps", label: "Apps", emphasis: true },
      { id: "edge-node", layerId: "edge", label: "Edge" },
      { id: "engine-node", layerId: "engine", label: "Engine" },
      { id: "schema-node", layerId: "schema", label: "Schema" },
      { id: "platform-node", layerId: "platform", label: "Platform" },
    ],
    links: [
      { id: "apps-edge", source: "apps-node", target: "edge-node", label: "may depend on" },
      { id: "apps-engine", source: "apps-node", target: "engine-node", label: "may depend on" },
      { id: "apps-schema", source: "apps-node", target: "schema-node", label: "may depend on" },
      { id: "apps-platform", source: "apps-node", target: "platform-node", label: "may depend on" },
      { id: "edge-engine", source: "edge-node", target: "engine-node", label: "may depend on" },
      { id: "edge-schema", source: "edge-node", target: "schema-node", label: "may depend on" },
      { id: "edge-platform", source: "edge-node", target: "platform-node", label: "may depend on" },
      { id: "engine-schema", source: "engine-node", target: "schema-node", label: "may depend on" },
      { id: "engine-platform", source: "engine-node", target: "platform-node", label: "may depend on" },
      { id: "schema-platform", source: "schema-node", target: "platform-node", label: "may depend on" },
    ],
    poster: {
      kicker: "THE ONTOLOGY FACTORY",
      title: "Dependencies flow toward more foundational layers",
      footer: "APPS → EDGE → ENGINE → SCHEMA → PLATFORM",
      showLegend: true,
    },
  };
}

export function createPipelineTopology(now = new Date().toISOString()): TopologyDocument {
  return {
    schemaVersion: 1,
    id: "understanding-pipeline-topology",
    name: "Proof abundance pipeline",
    createdAt: now,
    updatedAt: now,
    themeId: "thom-dark",
    layoutDirection: "lr",
    layers: [
      { id: "generate", name: "Generate", detail: "Candidate proofs" },
      { id: "verify", name: "Verify", detail: "Proof assistants" },
      { id: "explain", name: "Explain", detail: "Evaluation" },
      { id: "adopt", name: "Adopt", detail: "Community adoption" },
      { id: "canonical", name: "Canonical", detail: "Canonical knowledge" },
    ],
    nodes: [
      { id: "generate-node", layerId: "generate", label: "Generate" },
      { id: "verify-node", layerId: "verify", label: "Verify", emphasis: true },
      { id: "explain-node", layerId: "explain", label: "Explain", emphasis: true },
      { id: "adopt-node", layerId: "adopt", label: "Adopt" },
      { id: "canonical-node", layerId: "canonical", label: "Canonical" },
    ],
    links: [
      { id: "outrun-verification", source: "generate-node", target: "verify-node", label: "outruns" },
      { id: "outrun-explanation", source: "verify-node", target: "explain-node", label: "outruns" },
      { id: "outrun-absorption", source: "explain-node", target: "adopt-node", label: "outruns" },
      { id: "accumulate-canonical", source: "adopt-node", target: "canonical-node", label: "accumulates" },
    ],
    poster: {
      kicker: "THE UNDERSTANDING BOTTLENECK",
      title: "Proof abundance",
      footer: "GENERATE → VERIFY → EXPLAIN → ADOPT → CANONICAL",
      showLegend: false,
    },
  };
}

export function createTopologyLibrary(now = new Date().toISOString()): TopologyLibrary {
  const factory = createFactoryTopology(now);
  const pipeline = createPipelineTopology(now);
  return {
    schemaVersion: 1,
    activeDocumentId: factory.id,
    documents: [factory, pipeline],
  };
}
