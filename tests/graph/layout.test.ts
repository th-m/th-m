import ELK from "elkjs/lib/elk.bundled.js";
import { describe, expect, it } from "vitest";
import {
  buildElkGraph,
  estimateDocumentSizes,
  isCurrentLayoutRequest,
  normalizeLayout,
  positionsFromElk,
  propositionLayoutId,
} from "../../src/graph/layout";
import { createWeatherGraph } from "../../src/graph/seed";
import type { GraphDocument } from "../../src/graph/types";

describe("ELK graph layout", () => {
  it("discards stale asynchronous layout results", () => {
    expect(isCurrentLayoutRequest(4, 5)).toBe(false);
    expect(isCurrentLayoutRequest(5, 5)).toBe(true);
  });

  it.each(["editorial", "directional"] as const)(
    "is deterministic in %s mode",
    async (layoutMode) => {
      const document = { ...createWeatherGraph(), layoutMode };
      const sizes = estimateDocumentSizes(document);
      const elk = new ELK();
      const first = positionsFromElk(await elk.layout(buildElkGraph(document, sizes)));
      const second = positionsFromElk(await elk.layout(buildElkGraph(document, sizes)));

      const rounded = (positions: typeof first) =>
        Object.fromEntries(
          Object.entries(positions).map(([id, point]) => [
            id,
            { x: Math.round(point.x * 100) / 100, y: Math.round(point.y * 100) / 100 },
          ]),
        );
      expect(rounded(first)).toEqual(rounded(second));
    },
    20_000,
  );

  it("keeps pins fixed while moving only unpinned overlaps", () => {
    const document = createWeatherGraph();
    document.propositions[0] = {
      ...document.propositions[0],
      pinned: true,
      position: { x: 50, y: 70 },
    };
    const sizes = estimateDocumentSizes(document);
    const colliding = Object.fromEntries(Object.keys(sizes).map((id) => [id, { x: 50, y: 70 }]));
    const resolved = normalizeLayout(document, colliding, sizes);

    expect(resolved[propositionLayoutId("temperature")]).toEqual({ x: 50, y: 70 });
    expect(new Set(Object.values(resolved).map(({ x, y }) => `${x}:${y}`)).size).toBeGreaterThan(1);
  });

  it.each(["editorial", "directional"] as const)(
    "lays out a 50-proposition / 75-relationship %s stress fixture",
    async (layoutMode) => {
      const now = "2026-08-15T12:00:00.000Z";
      const propositions = Array.from({ length: 50 }, (_, index) => ({
        id: `p-${index}`,
        statement: `Proposition ${index + 1} holds a deliberately variable-length statement`,
        emphasis: index % 7 === 0,
        pinned: false,
      }));
      const relationships = Array.from({ length: 75 }, (_, index) => ({
        id: `r-${index}`,
        statement: `Relationship ${index + 1} makes an interpretive connection`,
        pinned: false,
        participants: [index % 50, (index * 7 + 3) % 50, (index * 11 + 9) % 50]
          .filter((value, participantIndex, values) => values.indexOf(value) === participantIndex)
          .map((value) => ({ nodeId: `p-${value}`, arrowAtNode: false, arrowAtRelation: false })),
      }));
      const document: GraphDocument = {
        schemaVersion: 1,
        id: `stress-${layoutMode}`,
        name: "Stress graph",
        createdAt: now,
        updatedAt: now,
        themeId: "thom-dark",
        layoutMode,
        propositions,
        relationships,
        poster: { kicker: "STRESS", title: "Stress graph", footer: "THOM", showLegend: true },
      };
      const sizes = estimateDocumentSizes(document);
      const result = await new ELK().layout(buildElkGraph(document, sizes));
      const positions = positionsFromElk(result);
      expect(Object.keys(positions)).toHaveLength(125);
      expect(Object.values(positions).every(({ x, y }) => Number.isFinite(x) && Number.isFinite(y))).toBe(true);
    },
    30_000,
  );
});
