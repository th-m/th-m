import { describe, expect, it } from "vitest";
import {
  addDocument,
  addProposition,
  addRelationship,
  createBlankDocument,
  deleteDocument,
  duplicateDocument,
  removeProposition,
} from "../../src/graph/model";
import { createSeedLibrary, createWeatherGraph } from "../../src/graph/seed";

describe("proposition graph model", () => {
  it("seeds the complete weather, Kolob, Iris, and sweat graph", () => {
    const graph = createWeatherGraph("2026-08-15T12:00:00.000Z");

    expect(graph.propositions).toHaveLength(6);
    expect(graph.relationships).toHaveLength(6);
    expect(graph.relationships.find(({ id }) => id === "warm-muggy")?.participants).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ nodeId: "temperature" }),
        expect.objectContaining({ nodeId: "humidity" }),
      ]),
    );
    expect(graph.relationships.find(({ id }) => id === "kolob-sunset")?.statement).toBe(
      "Sunset exposes beauty in glowing Kolob",
    );
    expect(graph.relationships.find(({ id }) => id === "iris")?.participants.map(({ nodeId }) => nodeId)).toEqual([
      "date",
      "temperature",
      "humidity",
      "time",
      "sweat",
    ]);

    for (const relationId of [
      "temperature-causes-sweat",
      "humidity-causes-sweat",
      "jacket-causes-sweat",
    ]) {
      const relation = graph.relationships.find(({ id }) => id === relationId);
      expect(relation?.participants.find(({ nodeId }) => nodeId === "sweat")).toMatchObject({
        arrowAtNode: true,
        arrowAtRelation: false,
      });
    }
  });

  it("creates propositions and multi-node relationships", () => {
    let graph = createBlankDocument("New ideas");
    graph = addProposition(graph, "The chicken precedes the egg");
    graph = addProposition(graph, "The egg precedes the chicken");
    graph = addProposition(graph, "Operational sequence is contextual");
    graph = addRelationship(
      graph,
      graph.propositions.map(({ id }) => id),
      "Origin of operational confusion",
    );

    expect(graph.propositions).toHaveLength(3);
    expect(graph.relationships[0].participants).toHaveLength(3);
  });

  it("cleans relationships after removing a proposition", () => {
    const graph = createWeatherGraph();
    const next = removeProposition(graph, "temperature");

    expect(next.propositions.some(({ id }) => id === "temperature")).toBe(false);
    expect(next.relationships.some(({ id }) => id === "temperature-causes-sweat")).toBe(false);
    expect(next.relationships.find(({ id }) => id === "warm-muggy")).toBeUndefined();
    expect(next.relationships.find(({ id }) => id === "iris")?.participants).toHaveLength(4);
  });

  it("supports local document CRUD without leaving an empty library", () => {
    const initial = createSeedLibrary();
    const copy = duplicateDocument(initial.documents[0]);
    const withCopy = addDocument(initial, copy);

    expect(withCopy.activeDocumentId).toBe(copy.id);
    expect(withCopy.documents).toHaveLength(2);

    const afterCopyDelete = deleteDocument(withCopy, copy.id);
    expect(afterCopyDelete.documents).toHaveLength(1);
    const afterLastDelete = deleteDocument(afterCopyDelete, afterCopyDelete.documents[0].id);
    expect(afterLastDelete.documents).toHaveLength(1);
    expect(afterLastDelete.documents[0].name).toBe("Untitled graph");
  });
});
