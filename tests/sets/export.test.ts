import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import {
  createSetAtlasPng,
  exportSetAtlasSvg,
  slugifySetAtlasFilename,
} from "../../src/sets/export";
import { createSetAtlasSvg, renderSetAtlasSvg } from "../../src/sets/renderSvg";
import type { SetAtlasScene } from "../../src/sets/types";

vi.stubGlobal(
  "fetch",
  vi.fn(async () => new Response(new Uint8Array([119, 79, 70, 50, 1, 2, 3]))),
);

const scene: SetAtlasScene = {
  width: 760,
  height: 520,
  regions: [
    {
      id: "color<&",
      symbolIds: ["color<&", "alias"],
      labels: ["Color < Green", "Alias & Color"],
      display: '"green" | "orange"',
      cx: 270,
      cy: 245,
      rx: 184,
      ry: 132,
      depth: 0,
      approximate: true,
    },
  ],
  atoms: [{ id: "green", label: '"green"', x: 250, y: 255, ownerIds: ["color<&"] }],
  cards: [
    {
      id: "card:any",
      symbolId: "any",
      label: "EscapeHatch",
      detail: "any / outside set algebra",
      status: "exception",
      x: 510,
      y: 180,
      width: 230,
      height: 116,
    },
  ],
  warnings: ["Color geometry is approximate"],
};

afterEach(() => {
  vi.restoreAllMocks();
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe("set atlas SVG rendering", () => {
  it("renders deterministic accessible THOM markup and escapes compiler text", () => {
    const options = {
      title: "Colors & Signals",
      description: "A <set> atlas",
      fonts: { newsreader: "bmV3c3JlYWRlcg==", plexMono: "cGxleA==" },
    };
    const first = renderSetAtlasSvg(scene, options);
    const second = renderSetAtlasSvg(scene, options);
    expect(first).toBe(second);
    expect(first).toContain('aria-labelledby="set-atlas-title set-atlas-description"');
    expect(first).toContain("Colors &amp; Signals");
    expect(first).toContain("A &lt;set&gt; atlas");
    expect(first).toContain('data-region-id="color&lt;&amp;"');
    expect(first).toContain("@font-face");
    expect(first).toContain("data:font/woff2;base64,bmV3c3JlYWRlcg==");
    expect(first).toContain("GEOMETRY / APPROXIMATION NOTES");
    expect(first).toContain("APPROXIMATE");
    expect(first).toContain('id="set-atlas-atoms"');
    expect(first).toContain('id="set-atlas-cards"');
  });

  it("fetches and embeds both Vite font assets for a self-contained SVG", async () => {
    const svg = await createSetAtlasSvg(scene, { title: "Signal atlas" });
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(svg.match(/data:font\/woff2;base64,/g)).toHaveLength(2);
    expect(svg).not.toMatch(/src: url\((?!data:)/);
  });

  it("downloads a slugged SVG and returns the same artifact", async () => {
    const createObjectURL = vi.fn(() => "blob:atlas");
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
    const svg = await exportSetAtlasSvg(scene, { title: "Types: Green / Red" });
    expect(svg).toContain("Types: Green / Red");
    expect(createObjectURL).toHaveBeenCalledWith(
      expect.objectContaining({ type: "image/svg+xml;charset=utf-8" }),
    );
    expect(click).toHaveBeenCalledOnce();
    expect(slugifySetAtlasFilename("  Týpes: Green / Red  ")).toBe("types-green-red");
    expect(slugifySetAtlasFilename("!!!")).toBe("typescript-set-atlas");
  });

  it("rasterizes the exact SVG dimensions at 2×", async () => {
    const createObjectURL = vi.fn(() => "blob:raster-source");
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });

    class MockImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      set src(_value: string) {
        queueMicrotask(() => this.onload?.());
      }
    }
    vi.stubGlobal("Image", MockImage);

    const drawImage = vi.fn();
    const canvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => ({ drawImage })),
      toBlob: vi.fn((callback: BlobCallback) => callback(new Blob(["png"], { type: "image/png" }))),
    } as unknown as HTMLCanvasElement;
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation(((tagName: string) =>
      tagName === "canvas" ? canvas : originalCreateElement(tagName)) as typeof document.createElement);

    const svg = await createSetAtlasSvg(scene, { title: "Raster source" });
    const width = Number(svg.match(/<svg[^>]*\bwidth="([0-9.]+)"/)?.[1]);
    const height = Number(svg.match(/<svg[^>]*\bheight="([0-9.]+)"/)?.[1]);
    const blob = await createSetAtlasPng(scene, { title: "Raster source" });
    expect(blob.type).toBe("image/png");
    expect(canvas.width).toBe(width * 2);
    expect(canvas.height).toBe(height * 2);
    expect(drawImage).toHaveBeenCalledWith(expect.any(MockImage), 0, 0, width * 2, height * 2);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:raster-source");
  });
});
