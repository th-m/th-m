import { describe, expect, it } from "vitest";
import {
  addDocument,
  clearDocumentPins,
  createBlankDocument,
  deleteDocument,
  duplicateDocument,
  removeDocumentPin,
  renameDocument,
  replaceDocument,
  setActiveDocument,
  updateDocumentPin,
  updateDocumentSource,
  updateDocumentViewport,
} from "../src/model";
import {
  createSeedLibrary,
  createSetTheoryDocument,
  SET_THEORY_SEED_CODE,
} from "../src/seed";

const CREATED = "2026-08-15T12:00:00.000Z";
const UPDATED = "2026-08-15T12:01:00.000Z";

describe("set atlas model", () => {
  it("seeds a useful tour of TypeScript set semantics", () => {
    const document = createSetTheoryDocument(CREATED);

    expect(document).toMatchObject({
      id: "typescript-set-theory",
      name: "TypeScript is set theory",
      createdAt: CREATED,
      updatedAt: CREATED,
      themeId: "thom-dark",
    });
    expect(document.source.mode).toBe("snippet");
    expect(SET_THEORY_SEED_CODE).toContain('type Stop = "red" | "amber"');
    expect(SET_THEORY_SEED_CODE).toContain('type Caution = "amber" | "yellow"');
    expect(SET_THEORY_SEED_CODE).toContain("type Signal = Stop | Caution | Go");
    expect(SET_THEORY_SEED_CODE).toContain("type Everything = unknown");
    expect(SET_THEORY_SEED_CODE).toContain("type Nothing = never");
    expect(SET_THEORY_SEED_CODE).toContain("type EscapeHatch = any");
    expect(SET_THEORY_SEED_CODE).toContain("type Box<Value>");
  });

  it("creates editable documents with unique stable identities", () => {
    const first = createBlankDocument("First", CREATED);
    const second = createBlankDocument("Second", CREATED);

    expect(first.id).not.toBe(second.id);
    expect(first.source).toMatchObject({ mode: "snippet", fileName: "untitled-atlas.ts" });
    expect(first.source.mode === "snippet" && first.source.code).toContain("type A");
    expect(first.createdAt).toBe(CREATED);
    expect(first.updatedAt).toBe(CREATED);
  });

  it("duplicates source and view state without sharing mutable records", () => {
    const source = updateDocumentPin(createSetTheoryDocument(CREATED), "Stop", { x: 12, y: 20 });
    const copy = duplicateDocument(source, UPDATED);

    expect(copy.id).not.toBe(source.id);
    expect(copy.name).toBe(`${source.name} copy`);
    expect(copy.source).toEqual(source.source);
    expect(copy.source).not.toBe(source.source);
    expect(copy.pins).toEqual(source.pins);
    expect(copy.pins).not.toBe(source.pins);
    expect(copy.createdAt).toBe(UPDATED);
    expect(copy.updatedAt).toBe(UPDATED);
  });

  it("updates names, source, pins, and viewport immutably with timestamps", () => {
    const original = createBlankDocument("Draft", CREATED);
    const renamed = renameDocument(original, "Relations", UPDATED);
    const project = updateDocumentSource(
      renamed,
      {
        mode: "project",
        sourceFilePath: "/workspace/domain.ts",
        tsconfigPath: "/workspace/tsconfig.json",
      },
      UPDATED,
    );
    const pinned = updateDocumentPin(project, "Person", { x: 120, y: 80 }, UPDATED);
    const viewed = updateDocumentViewport(pinned, { x: -40, y: 12, zoom: 1.5 }, UPDATED);

    expect(original.name).toBe("Draft");
    expect(renamed.name).toBe("Relations");
    expect(project.source).toEqual({
      mode: "project",
      sourceFilePath: "/workspace/domain.ts",
      tsconfigPath: "/workspace/tsconfig.json",
    });
    expect(viewed.pins.Person).toEqual({ x: 120, y: 80 });
    expect(viewed.viewport).toEqual({ x: -40, y: 12, zoom: 1.5 });
    expect(viewed.updatedAt).toBe(UPDATED);

    const withoutPin = removeDocumentPin(viewed, "Person", UPDATED);
    expect(withoutPin.pins).toEqual({});
    expect(clearDocumentPins(pinned, UPDATED).pins).toEqual({});
  });

  it("supports library CRUD and never leaves the library empty", () => {
    const initial = createSeedLibrary(CREATED);
    const created = createBlankDocument("Second", UPDATED);
    const withSecond = addDocument(initial, created);

    expect(withSecond.activeDocumentId).toBe(created.id);
    expect(withSecond.documents).toHaveLength(2);
    expect(setActiveDocument(withSecond, initial.activeDocumentId).activeDocumentId).toBe(
      initial.activeDocumentId,
    );
    expect(setActiveDocument(withSecond, "missing")).toBe(withSecond);

    const changed = renameDocument(created, "Changed", UPDATED);
    const replaced = replaceDocument(withSecond, changed);
    expect(replaced.documents.find(({ id }) => id === created.id)?.name).toBe("Changed");

    const afterSecondDelete = deleteDocument(replaced, created.id);
    expect(afterSecondDelete.documents).toHaveLength(1);
    const afterLastDelete = deleteDocument(afterSecondDelete, initial.activeDocumentId);
    expect(afterLastDelete.documents).toHaveLength(1);
    expect(afterLastDelete.documents[0].name).toBe("Untitled set atlas");
    expect(afterLastDelete.activeDocumentId).toBe(afterLastDelete.documents[0].id);
  });
});
