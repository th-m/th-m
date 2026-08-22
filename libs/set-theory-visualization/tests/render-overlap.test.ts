import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { curatedSetAtlasAnalyses } from "../src/data/curated-atlases";
import { renderOverlapSvg, resolveOverlap, type OverlapSpec } from "../scripts/render-overlap";

const temporary: string[] = [];

afterEach(async () => {
  await Promise.all(temporary.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("renderOverlapSvg", () => {
  it("sizes the SVG exactly to the placed groups and renders translucent, haloed groups", async () => {
    const spec: OverlapSpec = {
      title: "Known sets",
      groups: [
        { label: "A", cx: 200, cy: 200, rx: 100, ry: 80 },
        { label: "B", cx: 310, cy: 200, rx: 100, ry: 80 },
      ],
    };
    const { svg, resolved } = await renderOverlapSvg(spec);

    // Content spans x 100..410, y 120..280; default margin 60.
    expect(resolved.viewBox).toEqual({ x: 40, y: 60, width: 430, height: 280 });
    expect(svg).toContain(`width="430" height="280"`);
    expect(svg).toContain("viewBox=\"40 60 430 280\"");
    expect(svg.match(/<ellipse /g)).toHaveLength(2);
    expect(svg).toContain('fill-opacity="0.5"');
    expect(svg).toContain('stroke-width="2"');
    expect(svg).toContain('class="overlap-label"');
    expect(svg).toContain(">A</tspan>");
    expect(svg).toContain(">B</tspan>");
    // Legibility halo + embedded fonts, no atlas-scene machinery.
    expect(svg).toContain("paint-order: stroke");
    expect(svg).toContain("data:font/woff2;base64,");
    expect(svg).not.toContain("set-region");
    // Transparent by default.
    expect(svg).not.toMatch(/<rect /);
  });

  it("honors explicit placement, coloring, background, and canvas overrides", async () => {
    const { svg, resolved } = await renderOverlapSvg({
      canvas: { width: 900, height: 600, background: "#0b0a08", margin: 20 },
      style: { fill: "#7a8aff", opacity: 0.45, stroke: "#3077c6", strokeWidth: 3, labelColor: "#0f172a", haloColor: "#f8fafc" },
      groups: [
        { label: "Universe", cx: 400, cy: 300, rx: 330, ry: 240 },
        { label: "Inside", cx: 430, cy: 300, rx: 140, ry: 110, fill: "#e579c4" },
      ],
    });
    expect(resolved.viewBox).toEqual({ x: 50, y: 0, width: 900, height: 600 });
    expect(svg).toContain('fill="#7a8aff" fill-opacity="0.45" stroke="#3077c6" stroke-width="3"');
    expect(svg).toContain('fill="#e579c4"');
    expect(svg).toContain('fill="#0b0a08"');
    expect(svg).toMatch(/<rect /);
    // Deeper groups draw after (on top of) their parents.
    const universe = svg.indexOf('fill="#7a8aff"');
    const inside = svg.indexOf('fill="#e579c4"');
    expect(universe).toBeLessThan(inside);
  });

  it("rejects specs without placement or with out-of-range opacity", async () => {
    await expect(
      renderOverlapSvg({ groups: [{ label: "Loose", cx: 0, cy: 0, rx: 10 }] }),
    ).rejects.toThrow(/missing placement/);
    await expect(
      renderOverlapSvg({ groups: [{ label: "Hot", cx: 0, cy: 0, rx: 10, ry: 10, opacity: 1.5 }] }),
    ).rejects.toThrow(/opacity must be between 0 and 1/);
  });

  it("bootstraps groups from an AnalyzeResult and lets overrides win per group", async () => {
    const root = await mkdtemp(join(tmpdir(), "overlap-analysis-"));
    temporary.push(root);
    const analysisPath = join(root, "analysis.json");
    await writeFile(analysisPath, JSON.stringify(curatedSetAtlasAnalyses[0].analysis));

    const { resolved } = await renderOverlapSvg({
      analysis: analysisPath,
      groups: [
        { label: "CanCross", fill: "#69aed5", cx: 120, cy: 120, rx: 60, ry: 50 },
        { label: "User", hidden: true },
      ],
    });

    const labels = resolved.groups.map((group) => group.label);
    expect(labels.length).toBeGreaterThan(1);
    expect(labels).not.toContain("User");
    const overridden = resolved.groups.find((group) => group.label === "CanCross");
    expect(overridden).toBeDefined();
    expect(overridden?.fill).toBe("#69aed5");
    expect(overridden?.cx).toBe(120);
    expect(overridden?.cy).toBe(120);
    expect(resolved.warnings).toEqual([]);
  });

  it("warns about unmatched overrides and validates the analysis input", async () => {
    const root = await mkdtemp(join(tmpdir(), "overlap-analysis-"));
    temporary.push(root);
    const analysisPath = join(root, "analysis.json");
    await writeFile(analysisPath, JSON.stringify(curatedSetAtlasAnalyses[0].analysis));

    const dropped = await resolveOverlap({
      analysis: analysisPath,
      groups: [{ label: "NoSuchSet" }],
    });
    expect(dropped.warnings.join(" ")).toMatch(/matched no derived group and was dropped/);

    await expect(
      renderOverlapSvg({ analysis: join(root, "missing.json"), groups: [] }),
    ).rejects.toThrow(/Unable to read analysis JSON/);
    await expect(
      renderOverlapSvg({ groups: [{ label: "X", cx: 0, cy: 0, rx: 10, ry: 10 }] }),
    ).resolves.toBeDefined();
  });
});
