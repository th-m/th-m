import { describe, expect, it } from "vitest";
import { createWeatherGraph } from "../src/seed";
import {
  exportGraphDocument,
  GRAPH_LIBRARY_KEY,
  importGraphDocument,
  isGraphDocument,
  loadGraphLibrary,
  saveGraphLibrary,
} from "../src/storage";

function memoryStorage(initial?: string) {
  const values = new Map<string, string>();
  if (initial) values.set(GRAPH_LIBRARY_KEY, initial);
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
}

describe("graph schema and storage", () => {
  it("validates the versioned schema and rejects dangling participants", () => {
    const valid = createWeatherGraph();
    expect(isGraphDocument(valid)).toBe(true);

    const invalid = structuredClone(valid) as unknown as Record<string, unknown>;
    const relationships = invalid.relationships as Array<Record<string, unknown>>;
    relationships[0].participants = [
      { nodeId: "missing", arrowAtNode: false, arrowAtRelation: false },
      { nodeId: "temperature", arrowAtNode: false, arrowAtRelation: false },
    ];
    expect(isGraphDocument(invalid)).toBe(false);
  });

  it("autosaves and restores a local graph library", () => {
    const storage = memoryStorage();
    const firstLoad = loadGraphLibrary(storage);
    saveGraphLibrary(firstLoad, storage);
    const restored = loadGraphLibrary(storage);
    expect(restored).toEqual(firstLoad);
  });

  it("falls back to the weather seed for malformed storage", () => {
    const restored = loadGraphLibrary(memoryStorage("{broken"));
    expect(restored.documents[0].id).toBe("weather-kolob");
  });

  it("imports as a new document and exports portable JSON", () => {
    const original = createWeatherGraph("2026-08-15T10:00:00.000Z");
    const imported = importGraphDocument(exportGraphDocument(original));
    expect(imported.id).not.toBe(original.id);
    expect(imported.name).toBe(`${original.name} imported`);
    expect(imported.relationships).toEqual(original.relationships);
  });
});
