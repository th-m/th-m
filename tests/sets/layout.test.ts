import { describe, expect, it } from "vitest";
import {
  buildSetAtlasScene,
  reduceTransitiveContainment,
} from "../../src/sets/layout";
import type {
  AnalyzeResult,
  AtlasSymbolStatus,
  TypeRelation,
  TypeSetSymbol,
} from "../../src/sets/types";

const span = { start: 0, end: 1, line: 1, column: 1 };

function symbol(
  id: string,
  status: AtlasSymbolStatus = "region",
  display = id,
): TypeSetSymbol {
  return {
    id,
    name: id,
    kind: "alias",
    display,
    status,
    typeFlags: 0,
    sourceSpan: span,
    atomIds: [],
  };
}

function relation(
  sourceId: string,
  targetId: string,
  kind: TypeRelation["kind"],
  confidence: TypeRelation["confidence"] = "compiler-proven",
): TypeRelation {
  return { sourceId, targetId, kind, confidence };
}

function analysis(
  symbols: TypeSetSymbol[],
  relations: TypeRelation[] = [],
  atoms: AnalyzeResult["atoms"] = [],
): AnalyzeResult {
  return {
    revision: 1,
    compilerVersion: "7.0.0-test",
    sourceText: "",
    sourceFilePath: "atlas.ts",
    diagnostics: [],
    symbols,
    relations,
    atoms,
  };
}

function intersects(
  left: { cx: number; cy: number; rx: number; ry: number },
  right: { cx: number; cy: number; rx: number; ry: number },
): boolean {
  const dx = left.cx - right.cx;
  const dy = left.cy - right.cy;
  return (dx / (left.rx + right.rx)) ** 2 + (dy / (left.ry + right.ry)) ** 2 < 1;
}

describe("set atlas semantic layout", () => {
  it("merges equivalent symbols and reduces redundant containment", () => {
    expect(
      reduceTransitiveContainment([
        { sourceId: "literal", targetId: "color" },
        { sourceId: "color", targetId: "unknown" },
        { sourceId: "literal", targetId: "unknown" },
      ]),
    ).toEqual([
      { sourceId: "color", targetId: "unknown" },
      { sourceId: "literal", targetId: "color" },
    ]);

    const scene = buildSetAtlasScene(
      analysis(
        [
          symbol("literal", "region", '"green"'),
          symbol("same-literal", "region", '"green"'),
          symbol("color", "region", '"green" | "orange"'),
          symbol("unknown", "universe", "unknown"),
        ],
        [
          relation("literal", "same-literal", "equivalent"),
          relation("literal", "color", "proper-subset"),
          relation("color", "unknown", "proper-subset"),
          relation("literal", "unknown", "proper-subset"),
        ],
      ),
    );

    expect(scene.regions).toHaveLength(3);
    expect(scene.regions.find(({ id }) => id === "literal")?.symbolIds).toEqual([
      "literal",
      "same-literal",
    ]);
    const literal = scene.regions.find(({ id }) => id === "literal")!;
    const color = scene.regions.find(({ id }) => id === "color")!;
    const universe = scene.regions.find(({ id }) => id === "unknown")!;
    expect(color.rx).toBeGreaterThan(literal.rx);
    expect(universe.rx).toBeGreaterThan(color.rx);
    expect(literal.cx).toBe(color.cx);
    expect(color.cx).toBe(universe.cx);
    expect(scene.warnings).toEqual([]);
  });

  it("places overlapping roots together and unrelated islands apart", () => {
    const scene = buildSetAtlasScene(
      analysis(
        [symbol("CanCross"), symbol("ShouldStop"), symbol("Other")],
        [
          relation("CanCross", "ShouldStop", "overlap"),
          relation("CanCross", "Other", "disjoint"),
          relation("ShouldStop", "Other", "disjoint"),
        ],
      ),
    );
    const cross = scene.regions.find(({ id }) => id === "CanCross")!;
    const stop = scene.regions.find(({ id }) => id === "ShouldStop")!;
    const other = scene.regions.find(({ id }) => id === "Other")!;
    expect(intersects(cross, stop)).toBe(true);
    expect(intersects(cross, other)).toBe(false);
    expect(intersects(stop, other)).toBe(false);
    expect(scene.warnings).toEqual([]);
  });

  it("respects canonical pins, preserves atoms, and renders special types as cards", () => {
    const scene = buildSetAtlasScene(
      analysis(
        [
          symbol("Color"),
          symbol("Generic", "template", "T[]"),
          symbol("Any", "exception", "any"),
          symbol("Never", "empty", "never"),
        ],
        [],
        [{ id: "green", label: '"green"', kind: "literal", ownerIds: ["Color"] }],
      ),
      { Color: { x: 420, y: 260 } },
    );
    expect(scene.regions[0]).toMatchObject({ id: "Color", cx: 420, cy: 260 });
    expect(scene.atoms).toEqual([
      expect.objectContaining({ id: "green", label: '"green"', ownerIds: ["Color"] }),
    ]);
    expect(scene.cards.map(({ status }) => status)).toEqual(["empty", "template", "exception"]);
  });

  it("marks geometry as approximate when conflicting pins contradict disjointness", () => {
    const scene = buildSetAtlasScene(
      analysis(
        [symbol("Left"), symbol("Right")],
        [relation("Left", "Right", "disjoint")],
      ),
      { Left: { x: 300, y: 300 }, Right: { x: 300, y: 300 } },
    );
    expect(scene.regions.every(({ approximate }) => approximate)).toBe(true);
    expect(scene.warnings.join(" ")).toContain("disjoint");
  });

  it("is deterministic and accounts for a 100-type fixture without truncation", () => {
    const symbols = Array.from({ length: 100 }, (_, index) => symbol(`Type${index}`));
    const fixture = analysis(symbols);
    const first = buildSetAtlasScene(fixture);
    const second = buildSetAtlasScene(fixture);
    expect(first).toEqual(second);
    expect(first.regions).toHaveLength(100);
    expect(first.regions.every(({ cx, cy, rx, ry }) => [cx, cy, rx, ry].every(Number.isFinite))).toBe(
      true,
    );
  });
});
