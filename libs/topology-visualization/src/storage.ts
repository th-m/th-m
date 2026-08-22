// Library persistence for topology documents. Mirrors the graph library's
// storage contract: seeds are installed on first load and every document is
// versioned JSON under one key.
import { createTopologyLibrary } from "./seed";
import { isValidTopologyLibrary, isValidTopologyDocument } from "./model";
import type { TopologyDocument, TopologyLibrary } from "./types";

export const TOPOLOGY_LIBRARY_KEY = "th-m.topology-library.v1";

export function isTopologyLibrary(value: unknown): value is TopologyLibrary {
  return isValidTopologyLibrary(value);
}

export function isTopologyDocument(value: unknown): value is TopologyDocument {
  return isValidTopologyDocument(value);
}

export function loadTopologyLibrary(): TopologyLibrary {
  try {
    const raw = globalThis.localStorage.getItem(TOPOLOGY_LIBRARY_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (isTopologyLibrary(parsed)) return parsed;
    }
  } catch {
    /* fall through to seeds */
  }
  return createTopologyLibrary();
}

export function saveTopologyLibrary(library: TopologyLibrary): void {
  globalThis.localStorage.setItem(TOPOLOGY_LIBRARY_KEY, JSON.stringify(library));
}

export function exportTopologyDocument(document: TopologyDocument): string {
  return JSON.stringify(document, null, 2);
}

export function importTopologyDocument(source: string): TopologyDocument {
  const parsed: unknown = JSON.parse(source);
  if (!isTopologyDocument(parsed)) {
    throw new Error("Input is not a valid TopologyDocument JSON file.");
  }
  return parsed;
}
