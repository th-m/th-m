// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { thomDesignTokens } from "@th-m/design-theme";
import { createDiagramTheme } from "./index";
import { mountDiagramMotion, themeSvg } from "./browser";

const source = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><title>Request path</title><rect data-graph-role="background" width="200" height="100" fill="#ffffff"/><path id="request" data-graph-role="edge" data-flow="control" data-source="a" data-target="b" data-motion-stage="1" d="M10 50 H190" fill="none" stroke="#123456"/><text x="10" y="20" class="node-title">Keep this label</text></svg>`;
afterEach(() => { vi.unstubAllGlobals(); document.body.innerHTML = ""; });

describe("diagram theme adaptation", () => {
  it("derives roles from the foundation and allows independent overrides", () => {
    const theme = createDiagramTheme({ colors: { accent: "#abcdef" } });
    expect(theme.colors.paper).toBe(thomDesignTokens.color.background);
    expect(theme.colors.accent).toBe("#abcdef");
    expect(createDiagramTheme().colors.accent).toBe(thomDesignTokens.color.primary.default);
  });
  it("preserves topology, geometry, and labels while recoloring", () => {
    const theme = createDiagramTheme({ colors: { accent: "#abcdef" } });
    const result = new DOMParser().parseFromString(themeSvg(source, "fireworks", theme), "image/svg+xml");
    const path = result.querySelector("#request")!;
    expect(path.getAttribute("d")).toBe("M10 50 H190");
    expect(path.getAttribute("data-target")).toBe("b");
    expect(path.getAttribute("data-motion-stage")).toBe("1");
    expect(path.getAttribute("stroke")).toBe("#abcdef");
    expect(result.querySelector("text")?.textContent).toBe("Keep this label");
    expect(result.documentElement.getAttribute("aria-label")).toBe("Request path");
  });
  it.each([
    '<script>alert(1)</script>', '<foreignObject><div>HTML</div></foreignObject>',
    '<path onclick="alert(1)"/>', '<image href="https://example.com/a.svg"/>',
    '<style>@import "https://example.com/font.css";</style>',
    '<style>text{fill:url(https://example.com/a.svg)}</style>',
  ])("rejects active or remote source content: %s", unsafe => {
    expect(() => themeSvg(source.replace("</svg>", unsafe + "</svg>"), "diagram-design", createDiagramTheme())).toThrow();
  });
  it("rejects CSS injection in theme overrides", () => {
    expect(() => createDiagramTheme({ fonts: { sans: '</style><script>alert(1)</script>' } })).toThrow();
    expect(() => createDiagramTheme({ colors: { paper: 'url(https://example.com)' } })).toThrow();
  });
  it("keeps legend swatches in sync with semantic edge colors", () => {
    const withLegend = source.replace("</svg>", '<line id="legend" data-graph-role="decoration" stroke="#123456" x1="10" x2="30" y1="90" y2="90"/></svg>');
    const parsed = new DOMParser().parseFromString(themeSvg(withLegend, "fireworks", createDiagramTheme()), "image/svg+xml");
    expect(parsed.querySelector("#legend")?.getAttribute("stroke")).toBe(parsed.querySelector("#request")?.getAttribute("stroke"));
  });
});

describe("semantic playback", () => {
  function fixture(reduced = false) {
    vi.stubGlobal("matchMedia", () => ({ matches: reduced, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
    document.body.innerHTML = source;
    const svg = document.querySelector("svg")!;
    Object.defineProperty(svg.querySelector("path"), "getTotalLength", { value: () => 180 });
    return svg;
  }
  it("starts complete, reveals only edges, and restores source state on teardown", () => {
    const svg = fixture();
    const playback = mountDiagramMotion(svg, "flow");
    const edge = svg.querySelector<SVGElement>("#request")!;
    expect(edge.style.visibility).toBe("");
    playback.seek(0);
    expect(edge.style.visibility).toBe("hidden");
    expect(svg.querySelector("text")?.textContent).toBe("Keep this label");
    playback.seek(2);
    expect(edge.style.visibility).toBe("");
    playback.seek(playback.duration);
    expect(Array.from(svg.querySelectorAll<SVGElement>("[data-thom-motion]")).every(el => el.style.visibility === "hidden")).toBe(true);
    playback.destroy();
    expect(svg.querySelectorAll("path")).toHaveLength(1);
    expect(edge.style.visibility).toBe("");
  });
  it("keeps all edges visible under reduced motion even when seeking", () => {
    const svg = fixture(true);
    const playback = mountDiagramMotion(svg, "flow");
    playback.seek(0); playback.play();
    expect(svg.querySelector<SVGElement>("#request")!.style.visibility).toBe("");
    playback.destroy();
  });
});

import { diagramIconFragments } from "./export-icons";
describe("shared icon export", () => {
  it("uses the canonical geometry and gives repeated glyphs unique local markers", () => {
    const input = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><title>Shared icons</title><g data-thom-icon="implementation"/><g data-thom-icon="implementation" transform="translate(180 0)"/></svg>';
    const svg = new DOMParser().parseFromString(themeSvg(input, "diagram-design", createDiagramTheme(), "", diagramIconFragments()), "image/svg+xml");
    const ids = Array.from(svg.querySelectorAll("[id]")).map(el => el.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(svg.querySelectorAll(".ai-factory-icon__implementation-boundary")).toHaveLength(2);
    for (const edge of Array.from(svg.querySelectorAll("[marker-end]"))) {
      const id = edge.getAttribute("marker-end")!.slice(5, -1);
      expect(ids).toContain(id);
    }
  });
  it("rejects unknown icon references", () => {
    expect(() => themeSvg('<svg xmlns="http://www.w3.org/2000/svg"><g data-thom-icon="invented"/></svg>', "diagram-design", createDiagramTheme(), "", diagramIconFragments())).toThrow("Unknown THOM diagram icon");
  });
});

it("rejects executable content supplied through an icon fragment", () => {
  expect(() => themeSvg('<svg xmlns="http://www.w3.org/2000/svg"><g data-thom-icon="unsafe"/></svg>', "diagram-design", createDiagramTheme(), "", { unsafe: '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>' })).toThrow("Unsupported SVG element");
});
