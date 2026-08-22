import { describe, expect, it } from "vitest";
import { topologyToReagraph } from "../src/TopologyCanvas";
import { topologyTheme } from "../src/theme";
import { createFactoryTopology } from "../src/seed";

describe("topologyToReagraph", () => {
  const factory = createFactoryTopology("2026-08-22T00:00:00.000Z");
  const { nodes, edges } = topologyToReagraph(factory);

  it("maps every node and link with layer-name sublabels", () => {
    expect(nodes).toHaveLength(factory.nodes.length);
    expect(edges).toHaveLength(factory.links.length);

    const apps = nodes.find((node) => node.id === "apps-node");
    expect(apps?.subLabel).toBe("Apps");
    expect(apps?.data).toMatchObject({ kind: "node", layerId: "apps" });

    const link = edges.find((candidate) => candidate.id === "apps-edge");
    expect(link?.source).toBe("apps-node");
    expect(link?.target).toBe("edge-node");
    expect(link?.arrowPlacement).toBe("end");
  });

  it("assigns each layer a categorical accent and emphasis the primary gold", () => {
    const byId = new Map(nodes.map((node) => [node.id, node]));
    // Apps is the emphasis node → primary; the remaining layers take accents
    // by document order (edge = blue, engine = rose, schema = lime, platform = violet).
    expect(byId.get("apps-node")?.fill).toBe(topologyTheme.color.primary);
    expect(byId.get("edge-node")?.fill).toBe(topologyTheme.color.layerAccents[1]);
    expect(byId.get("engine-node")?.fill).toBe(topologyTheme.color.layerAccents[2]);
    expect(byId.get("schema-node")?.fill).toBe(topologyTheme.color.layerAccents[3]);
    expect(byId.get("platform-node")?.fill).toBe(topologyTheme.color.layerAccents[4]);
    expect(topologyTheme.color.layerAccents).toHaveLength(6);
  });
});
