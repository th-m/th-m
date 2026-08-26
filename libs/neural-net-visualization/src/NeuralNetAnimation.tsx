import { Fragment, useEffect, useMemo, useState, type ReactElement } from "react";
import { useMediaQuery } from "./media";
import {
  assertValidNeuralNetScene,
  type NeuralNetEdgeDefinition,
  type NeuralNetEdgeState,
  type NeuralNetFrameDefinition,
  type NeuralNetNodeDefinition,
  type NeuralNetNodeState,
  type NeuralNetScene,
} from "./scene";

export interface NeuralNetAnimationProps {
  scene: NeuralNetScene;
  /** Repeat the complete step and iteration timeline. Defaults to true. */
  loop?: boolean;
  reducedMotion?: "system" | "always" | "never";
  className?: string;
}

const PHASE_MS = 1150;
const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 380;
const NODE_RADIUS = 26;
const LAYER_LEFT = 150;
const LAYER_SPAN = 660;
const NODE_TOP = 100;
const NODE_SPAN = 180;

interface TimelinePosition {
  iteration: number;
  step: number;
}

interface NodeLayout {
  node: NeuralNetNodeDefinition;
  layerId: string;
  layerLabel: string;
  nodeIndex: number;
  x: number;
  y: number;
}

function classes(...values: Array<string | undefined | false>): string {
  return values.filter(Boolean).join(" ");
}

function layerX(layer: number, layerCount: number): number {
  return LAYER_LEFT + (LAYER_SPAN * layer) / Math.max(layerCount - 1, 1);
}

function nodeY(index: number, count: number): number {
  if (count <= 1) return CANVAS_HEIGHT / 2;
  return NODE_TOP + (NODE_SPAN * index) / (count - 1);
}

function formatValue(value: number): string {
  return value.toFixed(2);
}

function frameFor(scene: NeuralNetScene, position: TimelinePosition): NeuralNetFrameDefinition {
  const iteration = scene.iterations[position.iteration];
  const step = scene.steps[position.step];
  const frame = iteration.frames.find((candidate) => candidate.stepId === step.id);
  if (!frame) throw new Error(`Missing frame ${iteration.id}/${step.id}.`);
  return frame;
}

function advancePosition(
  position: TimelinePosition,
  scene: NeuralNetScene,
  loop: boolean,
): TimelinePosition {
  if (position.step < scene.steps.length - 1) {
    return { ...position, step: position.step + 1 };
  }
  if (position.iteration < scene.iterations.length - 1) {
    return { iteration: position.iteration + 1, step: 0 };
  }
  return loop ? { iteration: 0, step: 0 } : position;
}

function retreatPosition(position: TimelinePosition, scene: NeuralNetScene): TimelinePosition {
  if (position.step > 0) return { ...position, step: position.step - 1 };
  if (position.iteration > 0) {
    return { iteration: position.iteration - 1, step: scene.steps.length - 1 };
  }
  return position;
}

function Edge({
  edge,
  state,
  from,
  to,
}: {
  edge: NeuralNetEdgeDefinition;
  state?: NeuralNetEdgeState;
  from: NodeLayout;
  to: NodeLayout;
}) {
  const route = edge.route ?? "between-nodes";
  const visible = state?.visible ?? edge.visible ?? true;
  if (!visible) return null;

  const midY = (from.y + to.y) / 2;
  const controlX = route === "outside-right"
    ? Math.max(from.x, to.x) + 64
    : (from.x + to.x) / 2;
  const label = state?.label;
  const accessibleLabel = state?.ariaLabel ?? edge.ariaLabel ?? label ?? edge.label;

  return (
    <Fragment>
      <path
        className={classes("nnl-edge", edge.className, state?.className)}
        d={`M ${from.x} ${from.y} Q ${controlX} ${midY} ${to.x} ${to.y}`}
        data-edge-id={edge.id}
        data-from={edge.from}
        data-to={edge.to}
        data-route={route}
        aria-label={accessibleLabel}
      >
        <title>{accessibleLabel}</title>
      </path>
      {label ? (
        <text
          className={classes("nnl-edge__label", edge.className, state?.className)}
          x={route === "outside-right" ? controlX + 16 : controlX + (from.nodeIndex - to.nodeIndex) * 11}
          y={midY + 3}
          textAnchor="middle"
          aria-hidden="true"
        >
          {label}
        </text>
      ) : null}
    </Fragment>
  );
}

function Node({
  layout,
  state,
  value,
  showLabel,
}: {
  layout: NodeLayout;
  state?: NeuralNetNodeState;
  value: number;
  showLabel: boolean;
}) {
  const { node, x, y } = layout;
  const accessibleLabel = state?.ariaLabel
    ?? node.ariaLabel
    ?? `${layout.layerLabel}, ${node.label}: ${formatValue(value)}`;
  return (
    <g
      className={classes("nnl-node", node.className, state?.className)}
      data-node-id={node.id}
      aria-label={accessibleLabel}
    >
      <circle className="nnl-node__ring" cx={x} cy={y} r={NODE_RADIUS + 6} />
      <circle className="nnl-node__disc" cx={x} cy={y} r={NODE_RADIUS} />
      <text className="nnl-node__value" x={x} y={y + 4} textAnchor="middle">
        {state?.displayValue ?? formatValue(value)}
      </text>
      {showLabel ? (
        <text className="nnl-node__label" x={x} y={y + NODE_RADIUS + 20} textAnchor="middle">
          {node.label}
        </text>
      ) : null}
    </g>
  );
}

export function NeuralNetAnimation({
  scene,
  loop = true,
  reducedMotion = "system",
  className = "",
}: NeuralNetAnimationProps): ReactElement {
  const systemReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const reduced = reducedMotion === "always" || (reducedMotion === "system" && systemReduced);
  const resolved = useMemo(() => {
    assertValidNeuralNetScene(scene);
    const layouts = scene.layers.flatMap((layer, layerIndex) =>
      layer.nodes.map((node, nodeIndex): NodeLayout => ({
        node,
        layerId: layer.id,
        layerLabel: layer.label,
        nodeIndex,
        x: layerX(layerIndex, scene.layers.length),
        y: nodeY(nodeIndex, layer.nodes.length),
      })),
    );
    return {
      layouts,
      layoutByNodeId: new Map(layouts.map((layout) => [layout.node.id, layout])),
      snapshotById: new Map(scene.snapshots.map((snapshot) => [snapshot.id, snapshot])),
      valueBarNodeIds: new Set((scene.valueBarGroups ?? []).flatMap((group) => group.nodeIds)),
    };
  }, [scene]);

  const [position, setPosition] = useState<TimelinePosition>({ iteration: 0, step: 0 });
  const [playing, setPlaying] = useState(true);
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    setPosition({ iteration: 0, step: 0 });
    setPlaying(true);
    setInteracted(false);
  }, [scene, loop]);

  useEffect(() => {
    if (reduced || !playing) return;
    const timer = window.setInterval(() => {
      setPosition((current) => advancePosition(current, scene, loop));
    }, PHASE_MS);
    return () => window.clearInterval(timer);
  }, [loop, playing, reduced, scene]);

  useEffect(() => {
    if (loop || reduced) return;
    if (
      position.iteration === scene.iterations.length - 1
      && position.step === scene.steps.length - 1
    ) {
      setPlaying(false);
    }
  }, [loop, position, reduced, scene.iterations.length, scene.steps.length]);

  const finalPosition: TimelinePosition = {
    iteration: scene.iterations.length - 1,
    step: scene.steps.length - 1,
  };
  const displayPosition = reduced && !interacted ? finalPosition : position;
  const iteration = scene.iterations[displayPosition.iteration];
  const step = scene.steps[displayPosition.step];
  const frame = frameFor(scene, displayPosition);
  const snapshot = resolved.snapshotById.get(frame.snapshotId);
  if (!snapshot) throw new Error(`Missing snapshot ${frame.snapshotId}.`);

  const values = new Map(snapshot.nodeValues.map((nodeValue) => [nodeValue.id, nodeValue.value]));
  const nodeStates = new Map((frame.nodes ?? []).map((state) => [state.id, state]));
  const edgeStates = new Map((frame.edges ?? []).map((state) => [state.id, state]));

  const pauseForInspection = () => {
    setInteracted(true);
    setPlaying(false);
  };
  const goToStep = (stepIndex: number) => {
    pauseForInspection();
    setPosition({ iteration: displayPosition.iteration, step: stepIndex });
  };
  const stepForward = () => {
    pauseForInspection();
    setPosition(advancePosition(displayPosition, scene, loop));
  };
  const stepBack = () => {
    pauseForInspection();
    setPosition(retreatPosition(displayPosition, scene));
  };
  const togglePlay = () => {
    setInteracted(true);
    if (!playing && !loop && position.iteration === finalPosition.iteration && position.step === finalPosition.step) {
      setPosition({ iteration: 0, step: 0 });
    }
    setPlaying((current) => !current);
  };

  const description = [
    step.detail,
    ...(frame.nodes ?? []).map((state) => state.ariaLabel).filter((value): value is string => Boolean(value)),
    ...(frame.edges ?? []).map((state) => state.ariaLabel ?? state.label).filter((value): value is string => Boolean(value)),
  ].join(" ");

  return (
    <section
      className={classes("nnl", scene.className, className)}
      data-scene-id={scene.id}
      data-step-id={step.id}
      data-snapshot-id={snapshot.id}
      data-iteration-id={iteration.id}
      data-motion={reduced ? "reduced" : "full"}
      aria-label={`Animated neural network: ${scene.copy.title}. ${scene.copy.summary}`}
    >
      <header className="nnl__header">
        <p className="nnl__eyebrow">{scene.copy.eyebrow}</p>
        <h3>{scene.copy.title}</h3>
        <p className="nnl__summary">{scene.copy.summary}</p>
      </header>

      <div className="nnl__stage">
        <svg
          className="nnl__canvas"
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
          role="img"
          aria-label={`${scene.copy.title}: ${step.label}`}
        >
          <title>{`${scene.copy.title} — ${step.label}`}</title>
          <desc>{description}</desc>

          <g className="nnl-edges">
            {scene.edges.map((edge) => {
              const from = resolved.layoutByNodeId.get(edge.from);
              const to = resolved.layoutByNodeId.get(edge.to);
              if (!from || !to) return null;
              return <Edge key={edge.id} edge={edge} state={edgeStates.get(edge.id)} from={from} to={to} />;
            })}
          </g>

          {scene.layers.map((layer) => (
            <g key={layer.id} className={classes("nnl-layer", layer.className)} data-layer-id={layer.id}>
              {resolved.layouts
                .filter((layout) => layout.layerId === layer.id)
                .map((layout) => (
                  <Node
                    key={layout.node.id}
                    layout={layout}
                    state={nodeStates.get(layout.node.id)}
                    value={values.get(layout.node.id) ?? 0}
                    showLabel={resolved.valueBarNodeIds.has(layout.node.id)}
                  />
                ))}
            </g>
          ))}
        </svg>

        {(scene.valueBarGroups ?? []).map((group) => (
          <div
            key={group.id}
            className={classes("nnl__probs", group.className)}
            data-value-bar-group={group.id}
            role="group"
            aria-label={group.ariaLabel ?? group.id}
          >
            {group.nodeIds.map((nodeId) => {
              const layout = resolved.layoutByNodeId.get(nodeId);
              if (!layout) return null;
              const value = values.get(nodeId) ?? 0;
              const state = nodeStates.get(nodeId);
              return (
                <div key={nodeId} className={classes("nnl__prob", state?.valueBarClassName)} data-node-id={nodeId}>
                  <span className="nnl__prob-token">{layout.node.label}</span>
                  <span className="nnl__prob-track" aria-hidden="true">
                    <span style={{ width: `${Math.round(Math.min(Math.max(value, 0), 1) * 100)}%` }} />
                  </span>
                  <span className="nnl__prob-value">{formatValue(value)}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="nnl__controls" aria-label="Step through the animation">
        <button type="button" className="nnl__ctrl nnl__ctrl--prev" onClick={stepBack} aria-label="Previous step">
          <span aria-hidden="true">‹</span>
          <span className="nnl__ctrl-label">Prev</span>
        </button>
        <ol className="nnl__steps">
          {scene.steps.map((candidate, index) => {
            const active = displayPosition.step === index;
            return (
              <li key={candidate.id}>
                <button
                  type="button"
                  className="nnl__step"
                  aria-current={active ? "step" : undefined}
                  aria-label={`Step ${index + 1} of ${scene.steps.length}: ${candidate.label} — ${candidate.detail}`}
                  onClick={() => goToStep(index)}
                >
                  {index + 1}
                </button>
              </li>
            );
          })}
        </ol>
        <button type="button" className="nnl__ctrl nnl__ctrl--next" onClick={stepForward} aria-label="Next step">
          <span className="nnl__ctrl-label">Next</span>
          <span aria-hidden="true">›</span>
        </button>
        <button
          type="button"
          className="nnl__ctrl nnl__ctrl--play"
          onClick={togglePlay}
          aria-pressed={playing}
          aria-label={playing ? "Pause the animation" : "Play the animation"}
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>

      <div className="nnl__readout" role="status" aria-live="polite">
        <div className="nnl__readout-copy">
          <p className="nnl__readout-step">Step {displayPosition.step + 1} of {scene.steps.length}</p>
          <strong className="nnl__readout-op">{step.label}</strong>
          <span>{step.detail}</span>
        </div>
        {iteration.label || (frame.readouts?.length ?? 0) > 0 ? (
          <div className="nnl__chips" aria-label="Animation telemetry">
            {iteration.label ? <span className="nnl__chip nnl__chip--iteration">{iteration.label}</span> : null}
            {(frame.readouts ?? []).map((readout) => (
              <span key={readout.id} className={classes("nnl__chip", readout.className)}>{readout.text}</span>
            ))}
          </div>
        ) : null}
      </div>

      <footer className="nnl__disclaimer">
        <span aria-hidden="true">◇</span>{scene.copy.disclaimer}
      </footer>
    </section>
  );
}
