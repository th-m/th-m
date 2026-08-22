import type {
  Point,
  SetAtlasDocument,
  SetAtlasLibrary,
  SetAtlasSource,
  ViewportState,
} from "./types";

export const DEFAULT_ATLAS_SOURCE: SetAtlasSource = {
  mode: "snippet",
  fileName: "untitled-atlas.ts",
  code: `type A = "shared" | "only-a";
type B = "shared" | "only-b";
`,
};

export const DEFAULT_ATLAS_VIEWPORT: ViewportState = { x: 0, y: 0, zoom: 1 };

const isoNow = () => new Date().toISOString();

const cloneSource = (source: SetAtlasSource): SetAtlasSource =>
  source.mode === "snippet"
    ? { mode: "snippet", fileName: source.fileName, code: source.code }
    : {
        mode: "project",
        sourceFilePath: source.sourceFilePath,
        ...(source.tsconfigPath === undefined ? {} : { tsconfigPath: source.tsconfigPath }),
      };

const clonePoint = ({ x, y }: Point): Point => ({ x, y });

const clonePins = (pins: Record<string, Point>): Record<string, Point> =>
  Object.fromEntries(Object.entries(pins).map(([id, point]) => [id, clonePoint(point)]));

function randomToken(): string {
  const cryptoApi = globalThis.crypto;
  if (typeof cryptoApi?.randomUUID === "function") {
    return cryptoApi.randomUUID();
  }
  if (typeof cryptoApi?.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    cryptoApi.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/** Creates an opaque ID which remains stable for the lifetime of the saved document. */
export function createSetAtlasId(prefix = "atlas"): string {
  return `${prefix}-${randomToken()}`;
}

export function touchDocument(
  document: SetAtlasDocument,
  now = isoNow(),
): SetAtlasDocument {
  return { ...document, updatedAt: now };
}

export function createBlankDocument(
  name = "Untitled set atlas",
  now = isoNow(),
): SetAtlasDocument {
  return {
    schemaVersion: 1,
    id: createSetAtlasId(),
    name,
    source: cloneSource(DEFAULT_ATLAS_SOURCE),
    themeId: "thom-dark",
    pins: {},
    viewport: { ...DEFAULT_ATLAS_VIEWPORT },
    createdAt: now,
    updatedAt: now,
  };
}

export function duplicateDocument(
  document: SetAtlasDocument,
  now = isoNow(),
): SetAtlasDocument {
  return {
    schemaVersion: 1,
    id: createSetAtlasId(),
    name: `${document.name} copy`,
    source: cloneSource(document.source),
    themeId: "thom-dark",
    pins: clonePins(document.pins),
    viewport: { ...document.viewport },
    createdAt: now,
    updatedAt: now,
  };
}

export function renameDocument(
  document: SetAtlasDocument,
  name: string,
  now = isoNow(),
): SetAtlasDocument {
  return touchDocument({ ...document, name }, now);
}

export function updateDocumentSource(
  document: SetAtlasDocument,
  source: SetAtlasSource,
  now = isoNow(),
): SetAtlasDocument {
  return touchDocument({ ...document, source: cloneSource(source) }, now);
}

export function updateDocumentPin(
  document: SetAtlasDocument,
  symbolId: string,
  point: Point,
  now = isoNow(),
): SetAtlasDocument {
  return touchDocument(
    {
      ...document,
      pins: { ...document.pins, [symbolId]: clonePoint(point) },
    },
    now,
  );
}

export const setDocumentPin = updateDocumentPin;

export function removeDocumentPin(
  document: SetAtlasDocument,
  symbolId: string,
  now = isoNow(),
): SetAtlasDocument {
  if (!Object.hasOwn(document.pins, symbolId)) return document;
  const pins = { ...document.pins };
  delete pins[symbolId];
  return touchDocument({ ...document, pins }, now);
}

export function clearDocumentPins(
  document: SetAtlasDocument,
  now = isoNow(),
): SetAtlasDocument {
  if (Object.keys(document.pins).length === 0) return document;
  return touchDocument({ ...document, pins: {} }, now);
}

export function updateDocumentViewport(
  document: SetAtlasDocument,
  viewport: ViewportState,
  now = isoNow(),
): SetAtlasDocument {
  return touchDocument({ ...document, viewport: { ...viewport } }, now);
}

export function replaceDocument(
  library: SetAtlasLibrary,
  document: SetAtlasDocument,
): SetAtlasLibrary {
  return {
    ...library,
    documents: library.documents.map((candidate) =>
      candidate.id === document.id ? document : candidate,
    ),
  };
}

export function addDocument(
  library: SetAtlasLibrary,
  document: SetAtlasDocument,
): SetAtlasLibrary {
  const documents = library.documents.some(({ id }) => id === document.id)
    ? library.documents.map((candidate) => (candidate.id === document.id ? document : candidate))
    : [...library.documents, document];
  return { ...library, activeDocumentId: document.id, documents };
}

export function setActiveDocument(
  library: SetAtlasLibrary,
  documentId: string,
): SetAtlasLibrary {
  return library.documents.some(({ id }) => id === documentId)
    ? { ...library, activeDocumentId: documentId }
    : library;
}

export function deleteDocument(
  library: SetAtlasLibrary,
  documentId: string,
): SetAtlasLibrary {
  const documents = library.documents.filter(({ id }) => id !== documentId);
  if (documents.length === library.documents.length) return library;
  if (documents.length === 0) {
    const replacement = createBlankDocument();
    return { schemaVersion: 1, activeDocumentId: replacement.id, documents: [replacement] };
  }
  return {
    ...library,
    activeDocumentId:
      library.activeDocumentId === documentId ? documents[0].id : library.activeDocumentId,
    documents,
  };
}
