import { createId } from "./ids";
import { createSeedLibrary } from "./seed";
import type { GraphDocument, GraphLibrary, Point } from "./types";

export const GRAPH_LIBRARY_KEY = "thom:proposition-graph:v1";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const isString = (value: unknown): value is string => typeof value === "string";
const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";
const isPoint = (value: unknown): value is Point =>
  isRecord(value) && typeof value.x === "number" && typeof value.y === "number";

export function isGraphDocument(value: unknown): value is GraphDocument {
  if (!isRecord(value)) return false;
  if (
    value.schemaVersion !== 1 ||
    !isString(value.id) ||
    !isString(value.name) ||
    !isString(value.createdAt) ||
    !isString(value.updatedAt) ||
    value.themeId !== "thom-dark" ||
    (value.layoutMode !== "editorial" && value.layoutMode !== "directional") ||
    !Array.isArray(value.propositions) ||
    !Array.isArray(value.relationships) ||
    !isRecord(value.poster)
  ) {
    return false;
  }

  const propositionsAreValid = value.propositions.every(
    (proposition) =>
      isRecord(proposition) &&
      isString(proposition.id) &&
      isString(proposition.statement) &&
      isBoolean(proposition.emphasis) &&
      isBoolean(proposition.pinned) &&
      (proposition.position === undefined || isPoint(proposition.position)),
  );
  if (!propositionsAreValid) return false;

  const propositionIds = new Set(value.propositions.map((proposition) => proposition.id));
  const relationshipsAreValid = value.relationships.every(
    (relationship) =>
      isRecord(relationship) &&
      isString(relationship.id) &&
      isString(relationship.statement) &&
      isBoolean(relationship.pinned) &&
      (relationship.position === undefined || isPoint(relationship.position)) &&
      Array.isArray(relationship.participants) &&
      relationship.participants.length >= 2 &&
      relationship.participants.every(
        (participant) =>
          isRecord(participant) &&
          isString(participant.nodeId) &&
          propositionIds.has(participant.nodeId) &&
          isBoolean(participant.arrowAtNode) &&
          isBoolean(participant.arrowAtRelation),
      ),
  );
  if (!relationshipsAreValid) return false;

  return (
    isString(value.poster.kicker) &&
    isString(value.poster.title) &&
    isString(value.poster.footer) &&
    isBoolean(value.poster.showLegend)
  );
}

export function isGraphLibrary(value: unknown): value is GraphLibrary {
  return (
    isRecord(value) &&
    value.schemaVersion === 1 &&
    isString(value.activeDocumentId) &&
    Array.isArray(value.documents) &&
    value.documents.length > 0 &&
    value.documents.every(isGraphDocument) &&
    value.documents.some((document) => document.id === value.activeDocumentId)
  );
}

export function loadGraphLibrary(storage: Pick<Storage, "getItem"> = localStorage): GraphLibrary {
  const encoded = storage.getItem(GRAPH_LIBRARY_KEY);
  if (!encoded) return createSeedLibrary();
  try {
    const parsed: unknown = JSON.parse(encoded);
    return isGraphLibrary(parsed) ? parsed : createSeedLibrary();
  } catch {
    return createSeedLibrary();
  }
}

export function saveGraphLibrary(
  library: GraphLibrary,
  storage: Pick<Storage, "setItem"> = localStorage,
): void {
  storage.setItem(GRAPH_LIBRARY_KEY, JSON.stringify(library));
}

export function importGraphDocument(json: string): GraphDocument {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("The selected file is not valid JSON.");
  }
  if (!isGraphDocument(parsed)) {
    throw new Error("The selected JSON is not a valid proposition graph document.");
  }
  const now = new Date().toISOString();
  return structuredClone({
    ...parsed,
    id: createId("graph"),
    name: `${parsed.name} imported`,
    createdAt: now,
    updatedAt: now,
  });
}

export function exportGraphDocument(document: GraphDocument): string {
  return `${JSON.stringify(document, null, 2)}\n`;
}
