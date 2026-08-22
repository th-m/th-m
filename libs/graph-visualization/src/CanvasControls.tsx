// Floating view controls for the reagraph canvas: zoom in/out, refit, and a
// directional pan "nob" for click-driven exploration. Rendered as native
// buttons above the WebGL canvas so they stay keyboard-accessible. The pan
// step scales with the camera distance so one click moves a consistent
// fraction of the view at any zoom level.
import type { RefObject } from "react";
import type { GraphCanvasRef } from "reagraph";

export interface CanvasControlsProps {
  canvasRef: RefObject<GraphCanvasRef | null>;
  /** Fraction of the current camera distance panned per click. */
  panStep?: number;
}

export function CanvasControls({ canvasRef, panStep = 0.08 }: CanvasControlsProps) {
  const pan = (x: number, y: number) => {
    const controls = canvasRef.current?.getControls();
    if (!controls || typeof controls.truck !== "function") return;
    const step = (controls.distance || 1000) * panStep;
    void controls.truck(x * step, y * step, false);
  };

  return (
    <div className="graph-canvas-controls" role="group" aria-label="Graph view controls">
      <div className="graph-canvas-controls__zoom">
        <button
          type="button"
          className="graph-canvas-controls__button"
          onClick={() => canvasRef.current?.zoomIn()}
          aria-label="Zoom in"
        >+</button>
        <button
          type="button"
          className="graph-canvas-controls__button"
          onClick={() => canvasRef.current?.zoomOut()}
          aria-label="Zoom out"
        >−</button>
        <button
          type="button"
          className="graph-canvas-controls__button"
          onClick={() => canvasRef.current?.fitNodesInView(undefined, { animated: true })}
          aria-label="Fit graph"
        >⤢</button>
      </div>
      <div className="graph-canvas-controls__nob">
        <button
          type="button"
          className="graph-canvas-controls__button"
          onClick={() => pan(0, 1)}
          aria-label="Pan up"
        >▲</button>
        <button
          type="button"
          className="graph-canvas-controls__button"
          onClick={() => pan(1, 0)}
          aria-label="Pan left"
        >◀</button>
        <button
          type="button"
          className="graph-canvas-controls__button"
          onClick={() => pan(-1, 0)}
          aria-label="Pan right"
        >▶</button>
        <button
          type="button"
          className="graph-canvas-controls__button"
          onClick={() => pan(0, -1)}
          aria-label="Pan down"
        >▼</button>
      </div>
    </div>
  );
}
