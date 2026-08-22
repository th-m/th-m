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

export function createSeedLibrary(now = new Date().toISOString()): GraphLibrary {
  const weather = createWeatherGraph(now);
  const propositions = createPropositionsGraph(now);
  return {
    schemaVersion: 1,
    activeDocumentId: weather.id,
    documents: [weather, propositions],
  };
}
