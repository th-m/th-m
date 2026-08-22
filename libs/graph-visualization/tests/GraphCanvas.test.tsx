import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const canvas = vi.hoisted(() => ({
  fit: vi.fn(),
  zoomTo: vi.fn(),
}));

vi.mock("reagraph", async () => {
  const React = await import("react");
  return {
    GraphCanvas: React.forwardRef(function MockGraphCanvas(
      props: { layoutOverrides?: unknown },
      ref: React.ForwardedRef<unknown>,
    ) {
      React.useImperativeHandle(ref, () => ({
        fitNodesInView: canvas.fit,
        getControls: () => ({ camera: { zoom: 1.4 }, zoomTo: canvas.zoomTo }),
      }));
      return <div data-testid="reagraph" data-layout={JSON.stringify(props.layoutOverrides)} />;
    }),
  };
});

import {
  ThomGraphCanvas,
  graphLayoutOverrides,
  graphLayoutProfiles,
  graphNeedsCompactLayout,
} from "../src/GraphCanvas";

const nodes = [
  { id: "proposition:one", label: "One" },
  { id: "proposition:two", label: "Two" },
];
const edges = [{ id: "one-two", source: "proposition:one", target: "proposition:two" }];

describe("graph layout density", () => {
  it("keeps the compact profile deterministic and smaller than comfortable", () => {
    expect(graphLayoutProfiles.compact).toEqual({
      nodeSpacing: 28,
      layeredSpacing: 64,
      stressEdgeLength: 340,
      overlapPadding: 18,
    });
    expect(graphLayoutOverrides("editorial", "compact")).toEqual(
      graphLayoutOverrides("editorial", "compact"),
    );
    expect(graphLayoutProfiles.compact.nodeSpacing).toBeLessThan(
      graphLayoutProfiles.comfortable.nodeSpacing,
    );
    expect(graphLayoutProfiles.compact.layeredSpacing).toBeLessThan(
      graphLayoutProfiles.comfortable.layeredSpacing,
    );
    expect(graphLayoutProfiles.compact.overlapPadding).toBeGreaterThan(0);
    // Comfortable must keep real breathing room between nodes; compact stays
    // tighter but never collapses the seed graphs into overlapping labels.
    expect(graphLayoutProfiles.comfortable.stressEdgeLength).toBeGreaterThan(400);
    expect(graphLayoutProfiles.compact.stressEdgeLength).toBeGreaterThanOrEqual(300);
  });

  it("selects compact density for narrow or crowded canvases", () => {
    expect(graphNeedsCompactLayout(390, 844, 2)).toBe(true);
    expect(graphNeedsCompactLayout(1200, 800, 2)).toBe(false);
    expect(graphNeedsCompactLayout(700, 300, 20)).toBe(true);
  });
});

describe("ThomGraphCanvas fitting and keyboard access", () => {
  it("fits after layout settles, clamps the initial zoom, and refits on resize", () => {
    vi.useFakeTimers();
    canvas.fit.mockClear();
    canvas.zoomTo.mockClear();
    let resize: ((entries: Array<{ contentRect: { width: number; height: number } }>) => void) | undefined;
    const OriginalResizeObserver = globalThis.ResizeObserver;
    globalThis.ResizeObserver = class ResizeObserverMock {
      constructor(callback: typeof resize) {
        resize = callback;
      }
      observe() {}
      disconnect() {}
      unobserve() {}
    } as unknown as typeof ResizeObserver;

    const { container } = render(
      <div style={{ position: "relative", width: 800, height: 500 }}>
        <ThomGraphCanvas nodes={nodes} edges={edges} density="auto" />
      </div>,
    );

    act(() => vi.advanceTimersByTime(800));
    expect(canvas.fit).toHaveBeenCalled();
    expect(canvas.zoomTo).toHaveBeenCalledWith(0.92, false);

    act(() => resize?.([{ contentRect: { width: 390, height: 500 } }]));
    expect(container.querySelector(".graph-canvas-surface")).toHaveAttribute("data-density", "compact");
    const fitCount = canvas.fit.mock.calls.length;
    act(() => vi.advanceTimersByTime(800));
    expect(canvas.fit.mock.calls.length).toBeGreaterThan(fitCount);

    globalThis.ResizeObserver = OriginalResizeObserver;
    vi.useRealTimers();
  });

  it("exposes every WebGL node as a native keyboard-activatable button", () => {
    const activate = vi.fn();
    render(
      <ThomGraphCanvas
        nodes={nodes}
        edges={edges}
        autoFit={false}
        keyboardActionLabel="Edit"
        onNodeKeyboardActivate={activate}
      />,
    );
    const button = screen.getByRole("button", { name: "Edit One" });
    fireEvent.keyDown(button, { key: "Enter" });
    fireEvent.click(button);
    expect(activate).toHaveBeenCalledWith("proposition:one");
  });
});
