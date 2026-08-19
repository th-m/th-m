import { describe, expect, it } from "vitest";
import { validateKnowledgeDocument, type KnowledgeDocument } from "../src/index.ts";

describe("knowledge document", () => {
  it("keeps relation meaning separate from presentation", () => {
    const document: KnowledgeDocument = {
      schemaVersion: 1,
      id: "proof",
      title: "Proof",
      sources: [],
      entities: [
        { id: "a", kind: "system", name: "A" },
        { id: "b", kind: "system", name: "B" },
      ],
      groups: [],
      relations: [{
        id: "a-b",
        kind: "dependency",
        sourceId: "a",
        targetId: "b",
        presentation: { direction: "forward", layoutInfluence: "primary", style: "dashed" },
      }],
      perspectives: [],
      diagnostics: [],
    };
    expect(validateKnowledgeDocument(document)).toEqual([]);
    expect(document.relations[0]).toMatchObject({ kind: "dependency", presentation: { style: "dashed" } });
  });

  it("reports dangling references", () => {
    const document = {
      schemaVersion: 1,
      id: "broken",
      title: "Broken",
      sources: [],
      entities: [],
      groups: [],
      relations: [{
        id: "missing",
        kind: "dependency",
        sourceId: "a",
        targetId: "b",
        presentation: { direction: "forward", layoutInfluence: "primary", style: "solid" },
      }],
      perspectives: [],
      diagnostics: [],
    } as KnowledgeDocument;
    expect(validateKnowledgeDocument(document)).toEqual([
      "Relation missing has missing source a.",
      "Relation missing has missing target b.",
    ]);
  });
});
