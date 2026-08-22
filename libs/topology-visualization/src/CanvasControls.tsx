// Floating view controls for the topology canvas: zoom in/out, refit, and a
// directional pan "nob" for click-driven exploration. Native buttons stay
// keyboard-accessible; the pan step scales with camera distance so one click
// moves a consistent fraction of the view at any zoom level.
import type { RefObject } from "react";
import type { GraphCanvasRef } from "reagraph";

export interface TopologyCanvasControlsProps {
  canvasRef: RefObject<GraphCanvasRef | null>;
  /** Fraction of the current camera distance panned per click. */
  panStep?: number;
}

export function TopologyCanvasControls({ canvasRef, panStep = 0.08 }: TopologyCanvasControlsProps) {
  const pan = (x: number, y: number) => {
    const controls = canvasRef.current?.getControls();
    if (!controls || typeof controls.truck !== "function") return;
    const step = (controls.distance || 1000) * panStep;
    void controls.truck(x * step, y * step, false);
  };

  return (
    <div className="topology-canvas-controls" role="group" aria-label="Topology view controls">
      <div className="topology-canvas-controls__zoom">
        <button
          type="button"
          className="topology-canvas-controls__button"
          onClick={() => canvasRef.current?.zoomIn()}
          aria-label="Zoom in"
        >+</button>
        <button
          type="button"
          className="topology-canvas-controls__button"
          onClick={() => canvasRef.current?.zoomOut()}
          aria-label="Zoom out"
        >−</button>
        <button
          type="button"
          className="topology-canvas-controls__button"
          onClick={() => canvasRef.current?.fitNodesInView(undefined, { animated: true })}
          aria-label="Fit topology"
        >⤢</button>
      </div>
      <div className="topology-canvas-controls__nob">
        <button
          type="button"
          className="topology-canvas-controls__button"
          onClick={() => pan(0, 1)}
          aria-label="Pan up"
        >▲</button>
        <button
          type="button"
          className="topology-canvas-controls__button"
          onClick={() => pan(1, 0)}
          aria-label="Pan left"
        >◀</button>
        <button
          type="button"
          className="topology-canvas-controls__button"
          onClick={() => pan(-1, 0)}
          aria-label="Pan right"
        >▶</button>
        <button
          type="button"
          className="topology-canvas-controls__button"
          onClick={() => pan(0, -1)}
          aria-label="Pan down"
        >▼</button>
      </div>
    </div>
  );
}
