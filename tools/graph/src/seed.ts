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

export function createSeedLibrary(now = new Date().toISOString()): GraphLibrary {
  const document = createWeatherGraph(now);
  return { schemaVersion: 1, activeDocumentId: document.id, documents: [document] };
}
