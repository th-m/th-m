import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { parseMermaidFlowchart, systemToKnowledgeDocument } from "../src/mermaid.ts";

describe("Mermaid flowchart adapter", () => {
  it("preserves the authentication fixture semantics and authoritative order", async () => {
    const source = await readFile(new URL("../fixtures/first-proof/authentication-topology.mmd", import.meta.url), "utf8");
    const model = parseMermaidFlowchart(source);
    expect(model.groups).toHaveLength(3);
    expect(model.nodes).toHaveLength(11);
    expect(model.edges.filter(({ ordinal }) => ordinal !== undefined)).toHaveLength(13);
    expect(model.edges.filter(({ ordinal }) => ordinal === undefined)).toHaveLength(3);
    expect(model.edges.filter((edge) => edge.sourceId === edge.targetId)).toHaveLength(1);
    expect(model.phases.map(({ ordinal, title }) => [ordinal, title])).toEqual([
      [1, "token acquisition"],
      [2, "authorization"],
      [3, "enforcement"],
    ]);
    expect(model.edges.filter(({ sourceId, targetId }) => new Set([sourceId, targetId]).size === 2 && [sourceId, targetId].sort().join(":") === "AUTHZ:GW")).toHaveLength(2);
    expect(model.edges.filter(({ sourceId, targetId }) => [sourceId, targetId].sort().join(":") === "C:GW")).toHaveLength(2);
    expect(model.edges.find(({ ordinal }) => ordinal === 13)).toMatchObject({ sourceId: "CAT", targetId: "SVCS", phaseId: "phase-3" });
    expect(systemToKnowledgeDocument("auth", "Auth", model).relations).toHaveLength(16);
  });

  it("supports nested subgraphs, quoted HTML labels, reverse and parallel routes", () => {
    const model = parseMermaidFlowchart(`flowchart LR
subgraph outer["Outer"]
  subgraph inner["Inner"]
    A["Alpha<br/>node"]
  end
end
%% Phase 1 — exchange
A -->|1. out| B[Beta]
B -->|2. back| A
A -.-> A`);
    expect(model.groups).toEqual([
      expect.objectContaining({ id: "outer" }),
      expect.objectContaining({ id: "inner", parentId: "outer", nodeIds: ["A"] }),
    ]);
    expect(model.nodes.find(({ id }) => id === "A")?.label).toBe("Alpha · node");
    expect(model.edges).toHaveLength(3);
  });
});
