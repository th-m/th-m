import type { GraphDocument, GraphLibrary, RelationshipParticipant } from "./types";

const participant = (
  nodeId: string,
  arrowAtNode = false,
  arrowAtRelation = false,
): RelationshipParticipant => ({ nodeId, arrowAtNode, arrowAtRelation });

export function createWeatherGraph(now = new Date().toISOString()): GraphDocument {
  return {
    schemaVersion: 1,
    id: "weather-kolob",
    name: "Weather above Kolob",
    createdAt: now,
    updatedAt: now,
    themeId: "thom-dark",
    layoutMode: "editorial",
    propositions: [
      { id: "temperature", statement: "Temperature is 85°F", emphasis: true, pinned: false },
      { id: "humidity", statement: "Humidity is 24%", emphasis: false, pinned: false },
      { id: "date", statement: "Date is Aug 15", emphasis: false, pinned: false },
      { id: "time", statement: "Time is 8:27", emphasis: true, pinned: false },
      {
        id: "jacket",
        statement: "He is wearing a hooded jacket",
        emphasis: false,
        pinned: false,
      },
      {
        id: "sweat",
        statement: "He is wet from sweat, but not from rain.",
        emphasis: true,
        pinned: false,
      },
    ],
    relationships: [
      {
        id: "warm-muggy",
        statement: "It feels warm and muggy outside",
        participants: [participant("temperature"), participant("humidity")],
        pinned: false,
      },
      {
        id: "kolob-sunset",
        statement: "Sunset exposes beauty in glowing Kolob",
        participants: [participant("date"), participant("time")],
        pinned: false,
      },
      {
        id: "iris",
        statement:
          "Ambivalent Iris bends above Kolob—gilding the sunlit cliffs with one hand, gathering rain with the other.",
        participants: [
          participant("date"),
          participant("temperature"),
          participant("humidity"),
          participant("time"),
          participant("sweat"),
        ],
        pinned: false,
      },
      {
        id: "temperature-causes-sweat",
        statement: "Heat gathers beneath the jacket",
        participants: [participant("temperature"), participant("sweat", true)],
        pinned: false,
      },
      {
        id: "humidity-causes-sweat",
        statement: "Dry air sharpens the heat",
        participants: [participant("humidity"), participant("sweat", true)],
        pinned: false,
      },
      {
        id: "jacket-causes-sweat",
        statement: "The hooded layer holds the warmth close",
        participants: [participant("jacket"), participant("sweat", true)],
        pinned: false,
      },
    ],
    poster: {
      kicker: "AI KNOWS PROPOSITIONAL TRUTHS",
      title: "Weather, relation, and what the body knows",
      footer: "THOM · PROPOSITION GRAPH 01",
      showLegend: true,
    },
  };
}

export function createPropositionsGraph(now = new Date().toISOString()): GraphDocument {
  return {
    schemaVersion: 1,
    id: "propositions-about-propositions",
    name: "Propositions about propositions",
    createdAt: now,
    updatedAt: now,
    themeId: "thom-dark",
    layoutMode: "editorial",
    propositions: [
      {
        id: "prop-asserted",
        statement: "A proposition states what can be asserted",
        emphasis: true,
        pinned: false,
      },
      {
        id: "rel-participate",
        statement: "A relationship expresses how propositions participate together",
        emphasis: true,
        pinned: false,
      },
      {
        id: "doc-source",
        statement: "A GraphDocument is the portable source of truth",
        emphasis: false,
        pinned: false,
      },
      {
        id: "layout-derived",
        statement: "Layout positions are derived output",
        emphasis: false,
        pinned: false,
      },
      {
        id: "artifact-pair",
        statement: "An artifact is a self-contained SVG plus 2× PNG",
        emphasis: false,
        pinned: false,
      },
    ],
    relationships: [
      {
        id: "rel-connects",
        statement: "Relationships connect two or more propositions",
        participants: [participant("prop-asserted"), participant("rel-participate")],
        pinned: false,
      },
      {
        id: "doc-carries",
        statement: "The document carries propositions and relationships together",
        participants: [
          participant("prop-asserted"),
          participant("rel-participate"),
          participant("doc-source"),
        ],
        pinned: false,
      },
      {
        id: "derived-never-mutates",
        statement: "Derived output never mutates the input document",
        participants: [participant("doc-source"), participant("layout-derived")],
        pinned: false,
      },
      {
        id: "generator-produces",
        statement: "The generator produces the artifact pair",
        participants: [participant("doc-source"), participant("artifact-pair")],
        pinned: false,
      },
    ],
    poster: {
      kicker: "PROPOSITION GRAPH",
      title: "What a proposition graph is",
      footer: "THOM · PROPOSITION GRAPH 02",
      showLegend: true,
    },
  };
}

export function createUnderstandingPipelineGraph(now = new Date().toISOString()): GraphDocument {
  return {
    schemaVersion: 1,
    id: "understanding-pipeline",
    name: "Proof pipeline",
    createdAt: now,
    updatedAt: now,
    themeId: "thom-dark",
    layoutMode: "editorial",
    propositions: [
      {
        id: "generate",
        statement: "Generate candidate proofs",
        emphasis: false,
        pinned: false,
      },
      {
        id: "verify",
        statement: "Verify with proof assistants",
        emphasis: true,
        pinned: false,
      },
      {
        id: "explain",
        statement: "Explain and evaluate",
        emphasis: true,
        pinned: false,
      },
      {
        id: "adopt",
        statement: "Community adoption",
        emphasis: false,
        pinned: false,
      },
      {
        id: "canonical",
        statement: "Canonical knowledge",
        emphasis: false,
        pinned: false,
      },
    ],
    relationships: [
      {
        id: "outrun-verification",
        statement: "Candidate proofs outrun verification",
        participants: [participant("generate"), participant("verify", false, true)],
        pinned: false,
      },
      {
        id: "outrun-explanation",
        statement: "Verified proofs outrun explanation",
        participants: [participant("verify"), participant("explain", false, true)],
        pinned: false,
      },
      {
        id: "outrun-absorption",
        statement: "Published work outruns collective absorption",
        participants: [participant("explain"), participant("adopt", false, true)],
        pinned: false,
      },
      {
        id: "accumulate-canonical",
        statement: "Adoption accumulates into canonical knowledge",
        participants: [participant("adopt"), participant("canonical", false, true)],
        pinned: false,
      },
    ],
    poster: {
      kicker: "UNDERSTANDING AND BOTTLENECKS",
      title: "Proof abundance",
      footer: "GENERATE → VERIFY → EXPLAIN → ADOPT → CANONICAL",
      showLegend: false,
    },
  };
}

export function createUnderstandingLoopGraph(now = new Date().toISOString()): GraphDocument {
  return {
    schemaVersion: 1,
    id: "understanding-loop",
    name: "The understanding loop",
    createdAt: now,
    updatedAt: now,
    themeId: "thom-dark",
    layoutMode: "editorial",
    propositions: [
      {
        id: "observe",
        statement: "Observe evidence and lived stakes",
        emphasis: false,
        pinned: false,
      },
      {
        id: "interpret",
        statement: "Interpret what the output means",
        emphasis: true,
        pinned: false,
      },
      {
        id: "frame",
        statement: "Frame the testable problem",
        emphasis: false,
        pinned: false,
      },
      {
        id: "propose",
        statement: "Propose an intervention",
        emphasis: false,
        pinned: false,
      },
      {
        id: "test",
        statement: "Test with explicit learning goals",
        emphasis: true,
        pinned: false,
      },
      {
        id: "revise",
        statement: "Revise the shared model",
        emphasis: false,
        pinned: false,
      },
    ],
    relationships: [
      {
        id: "observe-interpret",
        statement: "Listen for evidence and lived stakes",
        participants: [participant("observe"), participant("interpret", false, true)],
        pinned: false,
      },
      {
        id: "interpret-frame",
        statement: "Separate observation from explanation",
        participants: [participant("interpret"), participant("frame", false, true)],
        pinned: false,
      },
      {
        id: "frame-propose",
        statement: "Return a clearer, testable problem frame",
        participants: [participant("frame"), participant("propose", false, true)],
        pinned: false,
      },
      {
        id: "propose-test",
        statement: "Small experiments with explicit learning goals",
        participants: [participant("propose"), participant("test", false, true)],
        pinned: false,
      },
      {
        id: "test-revise",
        statement: "Learn from consequences",
        participants: [participant("test"), participant("revise", false, true)],
        pinned: false,
      },
      {
        id: "revise-observe",
        statement: "The next decision starts from a stronger model",
        participants: [participant("revise"), participant("observe", false, true)],
        pinned: false,
      },
    ],
    poster: {
      kicker: "UNDERSTANDING AND BOTTLENECKS",
      title: "The understanding loop",
      footer: "OBSERVE → INTERPRET → FRAME → PROPOSE → TEST → REVISE",
      showLegend: false,
    },
  };
}

export function createLayerDependencyGraph(now = new Date().toISOString()): GraphDocument {
  return {
    schemaVersion: 1,
    id: "factory-layer-dependencies",
    name: "Factory layer dependencies",
    createdAt: now,
    updatedAt: now,
    themeId: "thom-dark",
    layoutMode: "directional",
    propositions: [
      {
        id: "apps",
        statement: "Apps — composition and lifecycle",
        emphasis: true,
        pinned: false,
      },
      {
        id: "edge",
        statement: "Edge — product workflows, provider-backed data, reactive state",
        emphasis: true,
        pinned: false,
      },
      {
        id: "engine",
        statement: "Engine — deterministic audio/video execution",
        emphasis: false,
        pinned: false,
      },
      {
        id: "schema",
        statement: "Schema — canonical models, invariants, taxonomy",
        emphasis: false,
        pinned: false,
      },
      {
        id: "platform",
        statement: "Platform — product-neutral mechanisms and helpers",
        emphasis: false,
        pinned: false,
      },
    ],
    relationships: [
      {
        id: "apps-edge",
        statement: "Apps may depend on Edge",
        participants: [participant("apps"), participant("edge", false, true)],
        pinned: false,
      },
      {
        id: "apps-engine",
        statement: "Apps may depend on Engine",
        participants: [participant("apps"), participant("engine", false, true)],
        pinned: false,
      },
      {
        id: "apps-schema",
        statement: "Apps may depend on Schema",
        participants: [participant("apps"), participant("schema", false, true)],
        pinned: false,
      },
      {
        id: "apps-platform",
        statement: "Apps may depend on Platform",
        participants: [participant("apps"), participant("platform", false, true)],
        pinned: false,
      },
      {
        id: "edge-engine",
        statement: "Edge may depend on Engine",
        participants: [participant("edge"), participant("engine", false, true)],
        pinned: false,
      },
      {
        id: "edge-schema",
        statement: "Edge may depend on Schema",
        participants: [participant("edge"), participant("schema", false, true)],
        pinned: false,
      },
      {
        id: "edge-platform",
        statement: "Edge may depend on Platform",
        participants: [participant("edge"), participant("platform", false, true)],
        pinned: false,
      },
      {
        id: "engine-schema",
        statement: "Engine may depend on Schema",
        participants: [participant("engine"), participant("schema", false, true)],
        pinned: false,
      },
      {
        id: "engine-platform",
        statement: "Engine may depend on Platform",
        participants: [participant("engine"), participant("platform", false, true)],
        pinned: false,
      },
      {
        id: "schema-platform",
        statement: "Schema may depend on Platform",
        participants: [participant("schema"), participant("platform", false, true)],
        pinned: false,
      },
    ],
    poster: {
      kicker: "THE ONTOLOGY FACTORY",
      title: "Dependencies flow toward more foundational layers",
      footer: "APPS → EDGE → ENGINE → SCHEMA → PLATFORM",
      showLegend: false,
    },
  };
}

export function createSeedLibrary(now = new Date().toISOString()): GraphLibrary {
  const weather = createWeatherGraph(now);
  const propositions = createPropositionsGraph(now);
  return {
    schemaVersion: 1,
    activeDocumentId: weather.id,
    documents: [weather, propositions],
  };
}
