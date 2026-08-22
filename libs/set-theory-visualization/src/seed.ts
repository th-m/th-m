import type { SetAtlasDocument, SetAtlasLibrary } from "./types";

export const SET_THEORY_SEED_CODE = `// TypeScript types describe sets of possible values.
// Stop and Caution overlap at "amber"; Signal contains both.
type Stop = "red" | "amber";
type Caution = "amber" | "yellow";
type Go = "green";
type Signal = Stop | Caution | Go;

// The universe, the empty set, and TypeScript's set-breaking escape hatch.
type Everything = unknown;
type Nothing = never;
type EscapeHatch = any;

// An uninstantiated generic is a reusable set template.
type Box<Value> = {
  value: Value;
};
`;

export function createSetTheoryDocument(
  now = new Date().toISOString(),
): SetAtlasDocument {
  return {
    schemaVersion: 1,
    id: "typescript-set-theory",
    name: "TypeScript is set theory",
    source: {
      mode: "snippet",
      fileName: "typescript-sets.ts",
      code: SET_THEORY_SEED_CODE,
    },
    themeId: "thom-dark",
    pins: {},
    viewport: { x: 0, y: 0, zoom: 1 },
    createdAt: now,
    updatedAt: now,
  };
}

export const createSeedDocument = createSetTheoryDocument;

export function createSeedLibrary(now = new Date().toISOString()): SetAtlasLibrary {
  const document = createSetTheoryDocument(now);
  return {
    schemaVersion: 1,
    activeDocumentId: document.id,
    documents: [document],
  };
}
