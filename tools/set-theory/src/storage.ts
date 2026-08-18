import { createSeedLibrary } from "./seed";
import type {
  Point,
  SetAtlasDocument,
  SetAtlasLibrary,
  SetAtlasSource,
  ViewportState,
} from "./types";

export const SET_ATLAS_LIBRARY_KEY = "thom:set-atlas:v1";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const hasExactKeys = (
  value: Record<string, unknown>,
  required: readonly string[],
  optional: readonly string[] = [],
): boolean => {
  const allowed = new Set([...required, ...optional]);
  return (
    required.every((key) => Object.hasOwn(value, key)) &&
    Object.keys(value).every((key) => allowed.has(key))
  );
};

const isString = (value: unknown): value is string => typeof value === "string";
const isNonEmptyString = (value: unknown): value is string =>
  isString(value) && value.trim().length > 0;
const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isIsoTimestamp = (value: unknown): value is string => {
  if (!isString(value)) return false;
  const milliseconds = Date.parse(value);
  return Number.isFinite(milliseconds) && new Date(milliseconds).toISOString() === value;
};

const isPoint = (value: unknown): value is Point =>
  isRecord(value) &&
  hasExactKeys(value, ["x", "y"]) &&
  isFiniteNumber(value.x) &&
  isFiniteNumber(value.y);

const isViewport = (value: unknown): value is ViewportState =>
  isRecord(value) &&
  hasExactKeys(value, ["x", "y", "zoom"]) &&
  isFiniteNumber(value.x) &&
  isFiniteNumber(value.y) &&
  isFiniteNumber(value.zoom) &&
  value.zoom > 0;

export function isSetAtlasSource(value: unknown): value is SetAtlasSource {
  if (!isRecord(value)) return false;
  if (value.mode === "snippet") {
    return (
      hasExactKeys(value, ["mode", "fileName", "code"]) &&
      isString(value.fileName) &&
      isString(value.code)
    );
  }
  if (value.mode === "project") {
    return (
      hasExactKeys(value, ["mode", "sourceFilePath"], ["tsconfigPath"]) &&
      isString(value.sourceFilePath) &&
      (value.tsconfigPath === undefined || isString(value.tsconfigPath))
    );
  }
  return false;
}

export function isSetAtlasDocument(value: unknown): value is SetAtlasDocument {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, [
      "schemaVersion",
      "id",
      "name",
      "source",
      "themeId",
      "pins",
      "viewport",
      "createdAt",
      "updatedAt",
    ]) ||
    value.schemaVersion !== 1 ||
    !isNonEmptyString(value.id) ||
    !isString(value.name) ||
    !isSetAtlasSource(value.source) ||
    value.themeId !== "thom-dark" ||
    !isRecord(value.pins) ||
    !Object.values(value.pins).every(isPoint) ||
    !isViewport(value.viewport) ||
    !isIsoTimestamp(value.createdAt) ||
    !isIsoTimestamp(value.updatedAt)
  ) {
    return false;
  }

  return value.updatedAt >= value.createdAt;
}

export function isSetAtlasLibrary(value: unknown): value is SetAtlasLibrary {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, ["schemaVersion", "activeDocumentId", "documents"]) ||
    value.schemaVersion !== 1 ||
    !isNonEmptyString(value.activeDocumentId) ||
    !Array.isArray(value.documents) ||
    value.documents.length === 0 ||
    !value.documents.every(isSetAtlasDocument)
  ) {
    return false;
  }

  const ids = value.documents.map(({ id }) => id);
  return new Set(ids).size === ids.length && ids.includes(value.activeDocumentId);
}

const persistSource = (source: SetAtlasSource): SetAtlasSource =>
  source.mode === "snippet"
    ? { mode: "snippet", fileName: source.fileName, code: source.code }
    : {
        mode: "project",
        sourceFilePath: source.sourceFilePath,
        ...(source.tsconfigPath === undefined ? {} : { tsconfigPath: source.tsconfigPath }),
      };

const persistDocument = (document: SetAtlasDocument): SetAtlasDocument => ({
  schemaVersion: 1,
  id: document.id,
  name: document.name,
  source: persistSource(document.source),
  themeId: "thom-dark",
  pins: Object.fromEntries(
    Object.entries(document.pins).map(([symbolId, { x, y }]) => [symbolId, { x, y }]),
  ),
  viewport: {
    x: document.viewport.x,
    y: document.viewport.y,
    zoom: document.viewport.zoom,
  },
  createdAt: document.createdAt,
  updatedAt: document.updatedAt,
});

/** Serializes only the versioned document schema, deliberately excluding analysis results. */
export function serializeSetAtlasLibrary(library: SetAtlasLibrary): string {
  const persisted: SetAtlasLibrary = {
    schemaVersion: 1,
    activeDocumentId: library.activeDocumentId,
    documents: library.documents.map(persistDocument),
  };
  if (!isSetAtlasLibrary(persisted)) {
    throw new Error("Cannot save an invalid set atlas library.");
  }
  return JSON.stringify(persisted);
}

export function loadSetAtlasLibrary(
  storage: Pick<Storage, "getItem"> = localStorage,
): SetAtlasLibrary {
  try {
    const encoded = storage.getItem(SET_ATLAS_LIBRARY_KEY);
    if (!encoded) return createSeedLibrary();
    const parsed: unknown = JSON.parse(encoded);
    return isSetAtlasLibrary(parsed) ? parsed : createSeedLibrary();
  } catch {
    return createSeedLibrary();
  }
}

export function saveSetAtlasLibrary(
  library: SetAtlasLibrary,
  storage: Pick<Storage, "setItem"> = localStorage,
): void {
  storage.setItem(SET_ATLAS_LIBRARY_KEY, serializeSetAtlasLibrary(library));
}

export const loadAtlasLibrary = loadSetAtlasLibrary;
export const saveAtlasLibrary = saveSetAtlasLibrary;
