import { describe, expect, it } from "vitest";
import { createTopologySvg } from "../src/exportSvg";
import { layoutTopology } from "../src/layout";
import { createFactoryTopology, createPipelineTopology } from "../src/seed";
import { thomDesignTokens } from "@th-m/design-theme";

const fonts = { newsreader: "bm90LXJlYWwtZm9udA==", plex: "bm90LXJlYWwtZm9udA==" };

describe("createTopologySvg", () => {
  it("renders a self-contained graph-mode SVG with theme tokens", () => {
    const factory = createFactoryTopology("2026-08-22T00:00:00.000Z");
    const { positions, extent } = layoutTopology(factory);
    const svg = createTopologySvg(factory, positions, "graph", extent, fonts);

    expect(svg).toContain("Newsreader Embedded");
    expect(svg).toContain("IBM Plex Mono Embedded");
    expect(svg).toContain(thomDesignTokens.color.background);
    expect(svg).toContain(thomDesignTokens.color.primary.default);
    expect(svg).toContain("aria-labelledby=\"title description\"");
    expect(svg).toContain("Apps");
    expect(svg).toContain("may depend on");
    expect(svg).toContain('marker-end="url(#topology-arrow)"');
    expect(svg).toContain("5 layers with 5 nodes and 10 dependencies.");
  });

  it("renders a fixed 1600×1000 poster with the editorial header", () => {
    const factory = createFactoryTopology("2026-08-22T00:00:00.000Z");
    const { positions, extent } = layoutTopology(factory);
    const svg = createTopologySvg(factory, positions, "poster", extent, fonts);

    expect(svg).toContain('width="1600" height="1000"');
    expect(svg).toContain("THE FACTORY — ONTOLOGY");
    expect(svg).toContain("Dependencies flow toward more foundational layers");
    expect(svg).toContain("APPS → EDGE → ENGINE → SCHEMA → PLATFORM");
    expect(svg).toContain("topology-legend");
  });

  it("renders the pipeline seed without a legend", () => {
    const pipeline = createPipelineTopology("2026-08-22T00:00:00.000Z");
    const { positions, extent } = layoutTopology(pipeline);
    const svg = createTopologySvg(pipeline, positions, "poster", extent, fonts);
    expect(svg).toContain("Proof abundance");
    expect(svg).not.toContain('class="topology-legend"');
  });

  it("escapes markup in labels", () => {
    const pipeline = createPipelineTopology("2026-08-22T00:00:00.000Z");
    const doc = {
      ...pipeline,
      name: "Proofs <&> abundance",
      nodes: pipeline.nodes.map((node, index) =>
        index === 0 ? { ...node, label: "Generate <candidates> & verify" } : node,
      ),
    };
    const { positions, extent } = layoutTopology(doc);
    const svg = createTopologySvg(doc, positions, "graph", extent, fonts);
    expect(svg).toContain("&lt;candidates&gt;");
    expect(svg).toContain("&amp;");
    expect(svg).not.toContain("<candidates>");
  });
});
