import { createId } from "./ids";
import type {
  GraphDocument,
  GraphLibrary,
  Proposition,
  Relationship,
  RelationshipParticipant,
} from "./types";

const isoNow = () => new Date().toISOString();

export function touchDocument(document: GraphDocument): GraphDocument {
  return { ...document, updatedAt: isoNow() };
}

export function createBlankDocument(name = "Untitled graph"): GraphDocument {
  const now = isoNow();
  return {
    schemaVersion: 1,
    id: createId("graph"),
    name,
    createdAt: now,
    updatedAt: now,
    themeId: "thom-dark",
    layoutMode: "editorial",
    propositions: [],
    relationships: [],
    poster: {
      kicker: "PROPOSITION GRAPH",
      title: name,
      footer: "THOM",
      showLegend: true,
    },
  };
}

export function duplicateDocument(document: GraphDocument): GraphDocument {
  const now = isoNow();
  return structuredClone({
    ...document,
    id: createId("graph"),
    name: `${document.name} copy`,
    createdAt: now,
    updatedAt: now,
  });
}

export function addProposition(document: GraphDocument, statement = "A proposition"): GraphDocument {
  const proposition: Proposition = {
    id: createId("proposition"),
    statement,
    emphasis: false,
    pinned: false,
  };
  return touchDocument({ ...document, propositions: [...document.propositions, proposition] });
}

export function addRelationship(
  document: GraphDocument,
  nodeIds: string[],
  statement = "A relationship",
): GraphDocument {
  const uniqueNodeIds = [...new Set(nodeIds)].filter((nodeId) =>
    document.propositions.some((proposition) => proposition.id === nodeId),
  );
  if (uniqueNodeIds.length < 2) return document;
  const participants: RelationshipParticipant[] = uniqueNodeIds.map((nodeId) => ({
    nodeId,
    arrowAtNode: false,
    arrowAtRelation: false,
  }));
  const relationship: Relationship = {
    id: createId("relationship"),
    statement,
    participants,
    pinned: false,
  };
  return touchDocument({ ...document, relationships: [...document.relationships, relationship] });
}

export function removeProposition(document: GraphDocument, propositionId: string): GraphDocument {
  const relationships = document.relationships
    .map((relationship) => ({
      ...relationship,
      participants: relationship.participants.filter(({ nodeId }) => nodeId !== propositionId),
    }))
    .filter((relationship) => relationship.participants.length >= 2);
  return touchDocument({
    ...document,
    propositions: document.propositions.filter(({ id }) => id !== propositionId),
    relationships,
  });
}

export function removeRelationship(document: GraphDocument, relationshipId: string): GraphDocument {
  return touchDocument({
    ...document,
    relationships: document.relationships.filter(({ id }) => id !== relationshipId),
  });
}

export function replaceDocument(library: GraphLibrary, document: GraphDocument): GraphLibrary {
  return {
    ...library,
    documents: library.documents.map((candidate) =>
      candidate.id === document.id ? document : candidate,
    ),
  };
}

export function addDocument(library: GraphLibrary, document: GraphDocument): GraphLibrary {
  return {
    ...library,
    activeDocumentId: document.id,
    documents: [...library.documents, document],
  };
}

export function deleteDocument(library: GraphLibrary, documentId: string): GraphLibrary {
  const documents = library.documents.filter(({ id }) => id !== documentId);
  if (documents.length === 0) {
    const replacement = createBlankDocument();
    return { ...library, activeDocumentId: replacement.id, documents: [replacement] };
  }
  return {
    ...library,
    activeDocumentId:
      library.activeDocumentId === documentId ? documents[0].id : library.activeDocumentId,
    documents,
  };
}
