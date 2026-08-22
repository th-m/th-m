import { describe, expect, it } from "vitest";
import { entityIdFromLayoutId, graphToReagraph, kindFromLayoutId, propositionLayoutId, relationshipLayoutId, selectionFromLayoutId } from "../src/canvas";
import { thomTheme } from "../src/theme";
import { createWeatherGraph } from "../src/seed";

describe("graphToReagraph", () => {
  const weather = createWeatherGraph("2026-08-15T12:00:00.000Z");
  const data = graphToReagraph(weather);

  it("maps every proposition and relationship to a canvas node with theme fills", () => {
    expect(data.nodes).toHaveLength(weather.propositions.length + weather.relationships.length);

    const temperature = data.nodeById.get(propositionLayoutId("temperature"));
    expect(temperature?.label).toBe("Temperature is 85°F");
    expect(temperature?.fill).toBe(thomTheme.color.primary);
    expect(temperature?.data.kind).toBe("proposition");
    expect(temperature?.data.entityId).toBe("temperature");

    const iris = data.nodeById.get(relationshipLayoutId("iris"));
    expect(iris?.label).toContain("Ambivalent Iris");
    expect(iris?.fill).toBe(thomTheme.color.accent);
    expect(iris?.data.kind).toBe("relationship");
  });

  it("uses the neutral foreground for non-emphasis propositions", () => {
    const humidity = data.nodeById.get(propositionLayoutId("humidity"));
    expect(humidity?.fill).toBe(thomTheme.color.foreground);
    expect(humidity?.size).toBe(8);

    const sweat = data.nodeById.get(propositionLayoutId("sweat"));
    expect(sweat?.fill).toBe(thomTheme.color.primary);
    expect(sweat?.size).toBe(11);
  });

  it("maps participants to edges pointing at their relationship node", () => {
    const expected = weather.relationships.reduce(
      (count, relationship) => count + relationship.participants.length,
      0,
    );
    expect(data.edges).toHaveLength(expected);

    const edge = data.edges.find((candidate) => candidate.id === "temperature-causes-sweat:temperature");
    expect(edge?.source).toBe(propositionLayoutId("temperature"));
    expect(edge?.target).toBe(relationshipLayoutId("temperature-causes-sweat"));
    expect(edge?.fill).toBe(thomTheme.color.primary);
  });

  it("applies directional arrows in directional mode", () => {
    const directional = graphToReagraph({
      ...createWeatherGraph("2026-08-15T12:00:00.000Z"),
      layoutMode: "directional",
    });
    const arrowAtNode = directional.edges.find(
      (candidate) => candidate.id === "temperature-causes-sweat:sweat",
    );
    expect(arrowAtNode?.arrowPlacement).toBe("mid");
    const plain = directional.edges.find((candidate) => candidate.id === "warm-muggy:temperature");
    expect(plain?.arrowPlacement).toBe("end");
  });

  it("anchors pinned positions onto force layout nodes", () => {
    const withPin = {
      ...createWeatherGraph("2026-08-15T12:00:00.000Z"),
      propositions: createWeatherGraph("2026-08-15T12:00:00.000Z").propositions.map((item, index) =>
        index === 0 ? { ...item, pinned: true, position: { x: 42, y: 99 } } : item,
      ),
    };
    const pinned = graphToReagraph(withPin);
    const node = pinned.nodeById.get(propositionLayoutId("temperature"));
    expect(node?.fx).toBe(42);
    expect(node?.fy).toBe(99);
  });
});

describe("layout id helpers", () => {
  it("round-trips layout ids to domain selections", () => {
    expect(kindFromLayoutId("proposition:p1")).toBe("proposition");
    expect(kindFromLayoutId("relationship:r1")).toBe("relationship");
    expect(kindFromLayoutId("unknown:x")).toBeNull();
    expect(entityIdFromLayoutId("proposition:p1")).toBe("p1");
    expect(selectionFromLayoutId("relationship:r1")).toEqual({ kind: "relationship", id: "r1" });
    expect(selectionFromLayoutId("weird")).toBeNull();
  });
});
