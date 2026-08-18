import { describe, expect, it } from "vitest";
import { createBlankDocument, updateDocumentSource } from "../../src/model";
import { createSeedLibrary, createSetTheoryDocument } from "../../src/seed";
import {
  isSetAtlasDocument,
  isSetAtlasLibrary,
  isSetAtlasSource,
  loadSetAtlasLibrary,
  saveSetAtlasLibrary,
  serializeSetAtlasLibrary,
  SET_ATLAS_LIBRARY_KEY,
} from "../../src/storage";
import type { SetAtlasLibrary } from "../../src/types";

function memoryStorage(initial?: string) {
  const values = new Map<string, string>();
  if (initial !== undefined) values.set(SET_ATLAS_LIBRARY_KEY, initial);
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    value: () => values.get(SET_ATLAS_LIBRARY_KEY),
  };
}

describe("set atlas schema and storage", () => {
  it("uses a versioned, tool-specific local storage key", () => {
    expect(SET_ATLAS_LIBRARY_KEY).toBe("thom:set-atlas:v1");
  });

  it("strictly validates documents, sources, pins, viewport, and library identity", () => {
    const document = createSetTheoryDocument("2026-08-15T12:00:00.000Z");
    const library = createSeedLibrary("2026-08-15T12:00:00.000Z");
    expect(isSetAtlasDocument(document)).toBe(true);
    expect(isSetAtlasLibrary(library)).toBe(true);

    expect(isSetAtlasSource({ mode: "project", sourceFilePath: "/tmp/model.ts" })).toBe(true);
    expect(isSetAtlasSource({ mode: "project", sourceFilePath: "" })).toBe(true);
    expect(
      isSetAtlasSource({ mode: "project", sourceFilePath: "/tmp/model.ts", code: "secret" }),
    ).toBe(false);

    expect(isSetAtlasDocument({ ...document, analysis: { symbols: [] } })).toBe(false);
    expect(isSetAtlasDocument({ ...document, viewport: { x: 0, y: 0, zoom: 0 } })).toBe(false);
    expect(isSetAtlasDocument({ ...document, pins: { Stop: { x: 0, y: Infinity } } })).toBe(false);
    expect(isSetAtlasDocument({ ...document, updatedAt: "not-a-date" })).toBe(false);
    expect(
      isSetAtlasLibrary({
        ...library,
        documents: [document, structuredClone(document)],
      }),
    ).toBe(false);
    expect(isSetAtlasLibrary({ ...library, activeDocumentId: "missing" })).toBe(false);
  });

  it("round-trips pasted TypeScript exactly", () => {
    const storage = memoryStorage();
    const library = createSeedLibrary("2026-08-15T12:00:00.000Z");
    saveSetAtlasLibrary(library, storage);

    expect(loadSetAtlasLibrary(storage)).toEqual(library);
    expect(storage.value()).toContain('"code"');
    expect(storage.value()).toContain("type Stop");
  });

  it("persists project references as paths only and excludes transient analysis", () => {
    const document = updateDocumentSource(
      createBlankDocument("Project", "2026-08-15T12:00:00.000Z"),
      {
        mode: "project",
        sourceFilePath: "/workspace/src/domain.ts",
        tsconfigPath: "/workspace/tsconfig.json",
      },
      "2026-08-15T12:01:00.000Z",
    );
    const withTransientAnalysis = {
      schemaVersion: 1,
      activeDocumentId: document.id,
      documents: [{ ...document, analysis: { symbols: [{ name: "private" }] } }],
    } as unknown as SetAtlasLibrary;

    const encoded = serializeSetAtlasLibrary(withTransientAnalysis);
    const parsed = JSON.parse(encoded) as Record<string, unknown>;
    const savedDocument = (parsed.documents as Array<Record<string, unknown>>)[0];
    expect(savedDocument.analysis).toBeUndefined();
    expect(savedDocument.source).toEqual({
      mode: "project",
      sourceFilePath: "/workspace/src/domain.ts",
      tsconfigPath: "/workspace/tsconfig.json",
    });
    expect(encoded).not.toContain("private");
    expect(encoded).not.toContain('"code"');
  });

  it("falls back safely when storage is missing, malformed, invalid, or unavailable", () => {
    expect(loadSetAtlasLibrary(memoryStorage()).documents[0].id).toBe("typescript-set-theory");
    expect(loadSetAtlasLibrary(memoryStorage("{broken")).documents[0].id).toBe(
      "typescript-set-theory",
    );
    expect(loadSetAtlasLibrary(memoryStorage(JSON.stringify({ schemaVersion: 1 })))).toEqual(
      expect.objectContaining({ activeDocumentId: "typescript-set-theory" }),
    );
    expect(
      loadSetAtlasLibrary({
        getItem: () => {
          throw new Error("Storage is unavailable");
        },
      }).documents[0].id,
    ).toBe("typescript-set-theory");
  });

  it("refuses to serialize invalid required data", () => {
    const library = createSeedLibrary("2026-08-15T12:00:00.000Z");
    const invalid = {
      ...library,
      documents: [{ ...library.documents[0], viewport: { x: 0, y: 0, zoom: Number.NaN } }],
    } as SetAtlasLibrary;

    expect(() => serializeSetAtlasLibrary(invalid)).toThrow("invalid set atlas library");
  });
});
