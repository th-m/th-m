import { afterAll, describe, expect, it, vi } from "vitest";
import { createGraphSvg } from "../src/exportSvg";
import { estimateDocumentSizes } from "../src/layout";
import { createWeatherGraph } from "../src/seed";
import type { LayoutPositions } from "../src/types";

vi.stubGlobal(
  "fetch",
  vi.fn(async () => new Response(new Uint8Array([119, 79, 70, 50, 1, 2, 3]))),
);

afterAll(() => vi.unstubAllGlobals());

describe("self-contained SVG export", () => {
  it("renders graph data directly with fonts, markers, and accessibility metadata", async () => {
    const graph = createWeatherGraph();
    const sizes = estimateDocumentSizes(graph);
    const positions: LayoutPositions = Object.fromEntries(
      Object.keys(sizes).map((id, index) => [id, { x: (index % 4) * 460, y: Math.floor(index / 4) * 390 }]),
    );
    const svg = await createGraphSvg(graph, positions, "graph", sizes);

    expect(svg).toContain("@font-face");
    expect(svg).toContain("data:font/woff2;base64,");
    expect(svg).toContain('aria-labelledby="title description"');
    expect(svg).toContain('id="arrow-node"');
    expect(svg).toContain('marker-start="url(#arrow-node)"');
    expect(svg).toContain("It feels warm and muggy outside");
    expect(svg).toContain("Sunset exposes beauty in glowing Kolob");
    expect(svg).toContain("Ambivalent Iris bends above Kolob");
  });

  it("renders the fixed editorial poster frame", async () => {
    const graph = createWeatherGraph();
    const sizes = estimateDocumentSizes(graph);
    const positions: LayoutPositions = Object.fromEntries(
      Object.keys(sizes).map((id, index) => [id, { x: index * 180, y: (index % 3) * 220 }]),
    );
    const svg = await createGraphSvg(graph, positions, "poster", sizes);
    expect(svg).toContain('width="1600" height="1000"');
    expect(svg).toContain(graph.poster.kicker);
    expect(svg).toContain("CIRCLES / PROPOSITIONS");
  });

  it("renders chicken and egg arrows at both proposition endpoints", async () => {
    const graph = createWeatherGraph();
    graph.name = "Chicken and egg";
    graph.propositions = [
      { id: "chicken", statement: "Chicken", emphasis: true, pinned: false },
      { id: "egg", statement: "Egg", emphasis: true, pinned: false },
    ];
    graph.relationships = [
      {
        id: "origin",
        statement: "Origin of operational confusion",
        pinned: false,
        participants: [
          { nodeId: "chicken", arrowAtNode: true, arrowAtRelation: false },
          { nodeId: "egg", arrowAtNode: true, arrowAtRelation: false },
        ],
      },
    ];
    const sizes = estimateDocumentSizes(graph);
    const positions: LayoutPositions = {
      "proposition:chicken": { x: 0, y: 100 },
      "relationship:origin": { x: 330, y: 150 },
      "proposition:egg": { x: 820, y: 100 },
    };
    const svg = await createGraphSvg(graph, positions, "graph", sizes);
    expect(svg.match(/marker-start="url\(#arrow-node\)"/g)).toHaveLength(2);
  });
});
