import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const canvas = vi.hoisted(() => ({
  fit: vi.fn(),
  zoomTo: vi.fn(),
  zoomIn: vi.fn(),
  zoomOut: vi.fn(),
  truck: vi.fn(),
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
        zoomIn: canvas.zoomIn,
        zoomOut: canvas.zoomOut,
        getControls: () => ({
          camera: { zoom: 1.4 },
          zoomTo: canvas.zoomTo,
          distance: 1000,
          truck: canvas.truck,
        }),
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
    expect(screen.getByTestId("reagraph").parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps Reagraph in the accessibility tree when no native node layer is present", () => {
    render(<ThomGraphCanvas nodes={nodes} edges={edges} autoFit={false} />);
    expect(screen.getByTestId("reagraph").parentElement).not.toHaveAttribute("aria-hidden");
  });

  it("exposes zoom, fit, and a directional pan nob over the canvas", () => {
    canvas.zoomIn.mockClear();
    canvas.zoomOut.mockClear();
    canvas.fit.mockClear();
    canvas.truck.mockClear();
    render(
      <div style={{ position: "relative", width: 600, height: 400 }}>
        <ThomGraphCanvas nodes={nodes} edges={edges} autoFit={false} />
      </div>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    expect(canvas.zoomIn).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Zoom out" }));
    expect(canvas.zoomOut).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Fit graph" }));
    expect(canvas.fit).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Pan left" }));
    expect(canvas.truck).toHaveBeenLastCalledWith(80, 0, false);
    fireEvent.click(screen.getByRole("button", { name: "Pan up" }));
    expect(canvas.truck).toHaveBeenLastCalledWith(0, 80, false);
    fireEvent.click(screen.getByRole("button", { name: "Pan right" }));
    expect(canvas.truck).toHaveBeenLastCalledWith(-80, 0, false);
    fireEvent.click(screen.getByRole("button", { name: "Pan down" }));
    expect(canvas.truck).toHaveBeenLastCalledWith(0, -80, false);

    expect(screen.getByRole("group", { name: "Graph view controls" })).toBeInTheDocument();
  });

  it("hides the controls when showControls is false", () => {
    render(<ThomGraphCanvas nodes={nodes} edges={edges} autoFit={false} showControls={false} />);
    expect(screen.queryByRole("group", { name: "Graph view controls" })).not.toBeInTheDocument();
  });
});
