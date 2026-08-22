import { Fragment, useEffect, useMemo, useState, type CSSProperties } from "react";
import { useMediaQuery } from "./media";
import {
  buildTrace,
  effectLabel,
  illustrativeScenario,
  neuralNetPhases,
  outputTargetIndex,
  outputTokenLabels,
  type LayerActivations,
  type NeuralNetEffect,
  type NeuralNetPhase,
  type NeuralNetScenario,
  type NeuralNetTrace,
} from "./model";

export interface NeuralNetAnimationCopy {
  eyebrow: string;
  title: string;
  summary: string;
  disclaimer: string;
}

export interface NeuralNetAnimationProps {
  /** Which self-playing scene to show. Defaults to "inference". */
  effect?: NeuralNetEffect;
  /** Repeat the scene forever. Defaults to true; false freezes on the final frame. */
  loop?: boolean;
  reducedMotion?: "system" | "always" | "never";
  /** Override the illustrative network and its teaching trace. */
  scenario?: NeuralNetScenario;
  copy?: Partial<NeuralNetAnimationCopy>;
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

const defaultCopy: Record<NeuralNetEffect, NeuralNetAnimationCopy> = {
  inference: {
    eyebrow: "Neural net · 3 → 4 → 4 → 2",
    title: "One forward pass",
    summary: "Input values move left to right through two hidden layers and score two candidate tokens.",
    disclaimer: "Simplified explanatory animation · deterministic illustrative values · not a live trace",
  },
  "feed-forward": {
    eyebrow: "Neural net · 3 → 4 → 4 → 2",
    title: "Activations, layer by layer",
    summary: "Each node computes a weighted sum of the previous layer, then applies an activation before passing the signal on.",
    disclaimer: "Simplified explanatory animation · deterministic illustrative values · not a live trace",
  },
  backprop: {
    eyebrow: "Neural net · 3 → 4 → 4 → 2",
    title: "A bad guess, then training",
    summary: "A forward pass scores the target token too low. Backpropagation carries the error backward and the numbers inside the nodes adjust.",
    disclaimer: "Training-only illustration · deterministic teaching trace · not a live training run",
  },
};

interface PhaseVisual {
  lit: readonly number[];
  backEdgeGroup?: number;
  lossBad?: boolean;
  updating?: boolean;
  selecting?: boolean;
  cascade?: boolean;
}

function visualFor(effect: NeuralNetEffect, phaseId: string): PhaseVisual {
  switch (effect) {
    case "inference":
      switch (phaseId) {
        case "input": return { lit: [0] };
        case "h1": return { lit: [0, 1] };
        case "h2": return { lit: [0, 1, 2] };
        case "output": return { lit: [0, 1, 2, 3] };
        case "select": return { lit: [0, 1, 2, 3], selecting: true };
      }
      break;
    case "feed-forward":
      switch (phaseId) {
        case "input": return { lit: [0], cascade: true };
        case "h1": return { lit: [0, 1], cascade: true };
        case "h2": return { lit: [0, 1, 2], cascade: true };
        case "output": return { lit: [0, 1, 2, 3], cascade: true };
      }
      break;
    case "backprop":
      switch (phaseId) {
        case "forward": return { lit: [0, 1, 2, 3] };
        case "loss": return { lit: [0, 1, 2, 3], lossBad: true };
        case "backward-h2": return { lit: [2, 3], backEdgeGroup: 2 };
        case "backward-h1": return { lit: [1, 2], backEdgeGroup: 1 };
        case "update": return { lit: [0, 1, 2, 3], updating: true };
      }
      break;
  }
  return { lit: [] };
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

/** Signed gradient value for an edge label, e.g. "+0.57" or "-0.99". */
function formatGradient(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}`;
}

function EdgeGroup({
  fromLayer,
  toLayer,
  layerCount,
  fromCount,
  toCount,
  forward,
  backward,
  cascade,
  pathFrom,
  pathTo,
  gradients,
}: {
  fromLayer: number;
  toLayer: number;
  layerCount: number;
  fromCount: number;
  toCount: number;
  /** The forward wave has reached the target layer of this group. */
  forward: boolean;
  /** This group carries the backward (gradient) signal. */
  backward: boolean;
  cascade: boolean;
  /** Dominant-path source node; when set, only that edge glows forward. */
  pathFrom?: number;
  /** Dominant-path target node; when set, only that edge glows forward. */
  pathTo?: number;
  /** ∂L/∂w matrix for this group [target][source]; labels each rose edge. */
  gradients?: readonly (readonly number[])[];
}) {
  const x1 = layerX(fromLayer, layerCount);
  const x2 = layerX(toLayer, layerCount);
  return (
    <g className={`nnl-edges ${forward ? "is-forward" : ""} ${backward ? "is-backward" : ""} ${cascade ? "is-cascade" : ""}`}>
      {Array.from({ length: fromCount * toCount }, (_, pair) => {
        const i = Math.floor(pair / toCount);
        const j = pair % toCount;
        const y1 = nodeY(i, fromCount);
        const y2 = nodeY(j, toCount);
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const onPath = forward && pathFrom !== undefined && pathTo !== undefined && i === pathFrom && j === pathTo;
        const edgeActive = backward || onPath;
        const gradient = backward && gradients ? gradients[j]?.[i] : undefined;
        return (
          <Fragment key={`${i}-${j}`}>
            <path
              className={`nnl-edge ${edgeActive ? "is-active" : ""}`}
              style={{ "--nnl-i": pair } as CSSProperties}
              d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
            />
            {gradient !== undefined ? (
              <text
                className="nnl-edge__gradient"
                x={midX + (i - j) * 11}
                y={midY + 3}
                textAnchor="middle"
                aria-hidden="true"
              >
                {formatGradient(gradient)}
              </text>
            ) : null}
          </Fragment>
        );
      })}
    </g>
  );
}

function Node({
  layer,
  layerCount,
  index,
  count,
  value,
  label,
  lit,
  adjusting,
  selecting,
  target,
  cascade,
}: {
  layer: number;
  layerCount: number;
  index: number;
  count: number;
  value: number;
  label?: string;
  lit: boolean;
  adjusting: boolean;
  selecting: boolean;
  target: boolean;
  cascade: boolean;
}) {
  const x = layerX(layer, layerCount);
  const y = nodeY(index, count);
  return (
    <g
      className={`nnl-node ${lit ? "is-lit" : ""} ${adjusting ? "is-adjusting" : ""} ${selecting ? "is-selected" : ""} ${target ? "is-target" : ""} ${cascade ? "is-cascade" : ""}`}
      style={{ "--nnl-i": index } as CSSProperties}
      aria-label={`${layer === 0 ? "Input" : layer === layerCount - 1 ? "Output" : "Hidden"} node ${index + 1}: ${formatValue(value)}`}
    >
      <circle className="nnl-node__ring" cx={x} cy={y} r={NODE_RADIUS + 6} />
      <circle className="nnl-node__disc" cx={x} cy={y} r={NODE_RADIUS} />
      <text className="nnl-node__value" x={x} y={y + 4} textAnchor="middle">{formatValue(value)}</text>
      {label ? (
        <text className="nnl-node__label" x={x} y={y + NODE_RADIUS + 20} textAnchor="middle">{label}</text>
      ) : null}
    </g>
  );
}

/** The loss gap: the forward pass ended at one output node, but the target
 *  token is another — the curve between them is the error the loss measures. */
function LossLine({
  layerCount,
  outputCount,
  fromIndex,
  toIndex,
}: {
  layerCount: number;
  outputCount: number;
  fromIndex: number;
  toIndex: number;
}) {
  const x = layerX(layerCount - 1, layerCount);
  const yFrom = nodeY(fromIndex, outputCount);
  const yTo = nodeY(toIndex, outputCount);
  const midY = (yFrom + yTo) / 2;
  const bulge = 64;
  return (
    <g className="nnl-loss">
      <path className="nnl-loss__line" d={`M ${x} ${yFrom} Q ${x + bulge} ${midY} ${x} ${yTo}`} />
      <text className="nnl-loss__label" x={x + bulge / 2 + 16} y={midY + 3} textAnchor="middle">
        loss
      </text>
    </g>
  );
}

export function NeuralNetAnimation({
  effect = "inference",
  loop = true,
  reducedMotion = "system",
  scenario = illustrativeScenario,
  copy,
  className = "",
}: NeuralNetAnimationProps) {
  const systemReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const reduced = reducedMotion === "always" || (reducedMotion === "system" && systemReduced);

  const trace: NeuralNetTrace = useMemo(() => buildTrace(scenario), [scenario]);
  const phases = neuralNetPhases[effect];
  const mergedCopy = { ...defaultCopy[effect], ...copy };

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [epochIndex, setEpochIndex] = useState(0);
  const [playing, setPlaying] = useState(loop);
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    setPhaseIndex(0);
    setEpochIndex(0);
    setPlaying(loop);
    setInteracted(false);
  }, [effect, loop]);

  useEffect(() => {
    if (reduced || !playing) return;
    const timer = window.setInterval(() => {
      setPhaseIndex((current) => {
        const last = phases.length - 1;
        if (current >= last) {
          if (effect === "backprop" && loop) {
            setEpochIndex((epoch) => (epoch + 1) % trace.epochs.length);
          }
          return loop ? 0 : current;
        }
        return current + 1;
      });
    }, PHASE_MS);
    return () => window.clearInterval(timer);
  }, [reduced, playing, effect, loop, phases.length, trace.epochs.length]);

  useEffect(() => {
    if (loop || reduced) return;
    if (phaseIndex >= phases.length - 1) setPlaying(false);
  }, [phaseIndex, loop, reduced, phases.length]);

  // Manual stepping pauses autoplay so the reader can inspect one state.
  const lastPhase = phases.length - 1;
  const pauseForInspection = () => {
    setInteracted(true);
    setPlaying(false);
  };
  const goToStep = (index: number) => {
    pauseForInspection();
    setPhaseIndex(Math.min(Math.max(index, 0), lastPhase));
  };
  const stepForward = () => {
    pauseForInspection();
    setPhaseIndex((current) => {
      if (current >= lastPhase) {
        if (effect === "backprop" && loop) {
          setEpochIndex((epoch) => (epoch + 1) % trace.epochs.length);
        }
        return loop ? 0 : current;
      }
      return current + 1;
    });
  };
  const stepBack = () => {
    pauseForInspection();
    setPhaseIndex((current) => {
      if (current <= 0) {
        if (effect === "backprop" && epochIndex > 0) {
          setEpochIndex((epoch) => epoch - 1);
          return lastPhase;
        }
        return 0;
      }
      return current - 1;
    });
  };
  const togglePlay = () => {
    setInteracted(true);
    setPlaying((current) => !current);
  };

  // Under reduced motion the figure stays on the final labeled frame until
  // the reader steps through it manually.
  const displayPhaseIndex = reduced && !interacted ? lastPhase : phaseIndex;
  const phase = phases[Math.min(displayPhaseIndex, phases.length - 1)];
  const visual = visualFor(effect, phase.id);
  const layerCount = scenario.layerSizes.length;

  const epochForDisplay = (phaseVisual: PhaseVisual): number => {
    if (effect !== "backprop") return 0;
    // Under reduced motion the untouched figure stays on the final trained
    // epoch; once the reader steps through it, show the real timeline.
    const displayEpoch = reduced && !interacted ? trace.epochs.length - 1 : epochIndex;
    if (phaseVisual.updating) return Math.min(displayEpoch + 1, trace.epochs.length - 1);
    return displayEpoch;
  };
  const epoch = epochForDisplay(visual);
  const epochData = trace.epochs[epoch];
  const nextEpochData = trace.epochs[Math.min(epoch + 1, trace.epochs.length - 1)];
  const probabilities = effect === "backprop" && visual.updating ? nextEpochData.probabilities : epochData.probabilities;
  const winnerIndex = probabilities.indexOf(Math.max(...probabilities));
  const targetProbability = probabilities[scenario.targetIndex] ?? 0;
  const currentLoss = epochData.loss;
  const nextLoss = nextEpochData.loss;

  const activationsForNode = (layer: number): readonly number[] => {
    const activations: LayerActivations = effect === "backprop" && visual.updating ? nextEpochData.activations : epochData.activations;
    return activations[layer] ?? [];
  };

  // The dominant path: the strongest node per layer. A forward pass lights
  // only this route through the dense network; the rest of the fan stays dim.
  const pathByLayer = scenario.layerSizes.map((count, layer) => {
    if (layer === layerCount - 1) {
      const scores = probabilities;
      return scores.indexOf(Math.max(...scores));
    }
    const values = activationsForNode(layer);
    return values.indexOf(Math.max(...values));
  });

  const backEdgeGroup = visual.backEdgeGroup;
  const edgeGroups = layerCount - 1;

  return (
    <section
      className={`nnl nnl--${effect} ${className}`}
      data-effect={effect}
      data-motion={reduced ? "reduced" : "full"}
      aria-label={`Animated ${effectLabel(effect)} on a small neural network. ${mergedCopy.summary}`}
    >
      <header className="nnl__header">
        <p className="nnl__eyebrow">{mergedCopy.eyebrow}</p>
        <h3>{mergedCopy.title}</h3>
        <p className="nnl__summary">{mergedCopy.summary}</p>
      </header>

      <div className="nnl__stage">
        <svg
          className="nnl__canvas"
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
          role="img"
          aria-label="Neural network layers with animated activation values"
        >
          <title>{`${mergedCopy.title} — ${phase.label}. ${phase.detail}`}</title>
          <defs>
            <radialGradient id="nnl-node-fill" cx="42%" cy="34%" r="75%">
              <stop offset="0" style={{ stopColor: "var(--color-surface-raised)" }} />
              <stop offset="1" style={{ stopColor: "var(--color-background)" }} />
            </radialGradient>
            <linearGradient id="nnl-edge-gold" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" style={{ stopColor: "var(--nnl-gold-soft)" }} />
              <stop offset="0.5" style={{ stopColor: "var(--color-foreground-strong)" }} />
              <stop offset="1" style={{ stopColor: "var(--color-primary)" }} />
            </linearGradient>
          </defs>

          {Array.from({ length: edgeGroups }, (_, group) => {
            const backward = backEdgeGroup === group;
            const forward = !backward && visual.lit.includes(group + 1);
            return (
              <EdgeGroup
                key={group}
                fromLayer={group}
                toLayer={group + 1}
                layerCount={layerCount}
                fromCount={scenario.layerSizes[group]}
                toCount={scenario.layerSizes[group + 1]}
                forward={forward}
                backward={backward}
                cascade={visual.cascade === true}
                pathFrom={forward ? pathByLayer[group] : undefined}
                pathTo={forward ? pathByLayer[group + 1] : undefined}
                gradients={backward ? epochData.gradients?.[group] : undefined}
              />
            );
          })}

          {scenario.layerSizes.map((count, layer) => {
            const values = activationsForNode(layer);
            const pathNode = pathByLayer[layer];
            return Array.from({ length: count }, (_, index) => {
              const isOutput = layer === layerCount - 1;
              const value = isOutput ? probabilities[index] : (values[index] ?? 0);
              return (
                <Node
                  key={`${layer}-${index}`}
                  layer={layer}
                  layerCount={layerCount}
                  index={index}
                  count={count}
                  value={value}
                  label={isOutput ? outputTokenLabels[index] : undefined}
                  lit={visual.lit.includes(layer) && index === pathNode}
                  adjusting={visual.updating === true}
                  selecting={visual.selecting === true && index === winnerIndex}
                  target={effect === "backprop" && isOutput && index === scenario.targetIndex}
                  cascade={visual.cascade === true}
                />
              );
            });
          })}

          {visual.lossBad && winnerIndex !== scenario.targetIndex ? (
            <LossLine
              layerCount={layerCount}
              outputCount={scenario.layerSizes[layerCount - 1]}
              fromIndex={winnerIndex}
              toIndex={scenario.targetIndex}
            />
          ) : null}
        </svg>

        <div className="nnl__probs" aria-hidden="true">
          {outputTokenLabels.map((token, index) => (
            <div
              key={token}
              className={`nnl__prob ${index === scenario.targetIndex ? "is-target" : ""} ${
                visual.selecting === true && index === winnerIndex ? "is-winner" : ""
              } ${visual.lossBad === true && index === scenario.targetIndex ? "is-bad-guess" : ""}`}
            >
              <span className="nnl__prob-token">{token}</span>
              <span className="nnl__prob-track">
                <span style={{ width: `${Math.round((probabilities[index] ?? 0) * 100)}%` }} />
              </span>
              <span className="nnl__prob-value">{(probabilities[index] ?? 0).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="nnl__controls" aria-label="Step through the animation">
        <button type="button" className="nnl__ctrl nnl__ctrl--prev" onClick={stepBack} aria-label="Previous step">
          <span aria-hidden="true">‹</span>
          <span className="nnl__ctrl-label">Prev</span>
        </button>
        <ol className="nnl__steps">
          {phases.map((phase, index) => {
            const active = displayPhaseIndex === index;
            return (
              <li key={phase.id}>
                <button
                  type="button"
                  className="nnl__step"
                  aria-current={active ? "step" : undefined}
                  aria-label={`Step ${index + 1} of ${phases.length}: ${phase.label} — ${phase.detail}`}
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
          <p className="nnl__readout-step">Step {displayPhaseIndex + 1} of {phases.length}</p>
          <strong className="nnl__readout-op">{phase.label}</strong>
          <span>{phase.detail}</span>
        </div>
        {effect === "backprop" ? (
          <div className="nnl__chips" aria-label="Training telemetry">
            <span className="nnl__chip nnl__chip--epoch">epoch {epoch + 1} / {trace.epochs.length}</span>
            {visual.lossBad ? <span className="nnl__chip nnl__chip--loss">loss −ln {targetProbability.toFixed(2)} = {currentLoss.toFixed(2)}</span> : null}
            {visual.updating
              ? <span className="nnl__chip nnl__chip--loss">{epoch + 1 < trace.epochs.length ? `loss ${currentLoss.toFixed(2)} → ${nextLoss.toFixed(2)}` : `loss ${currentLoss.toFixed(2)} · final`}</span>
              : null}
            {backEdgeGroup !== undefined ? <span className="nnl__chip nnl__chip--gradient">gradient ∂L/∂θ</span> : null}
          </div>
        ) : null}
      </div>

      <div className="nnl__legend" aria-hidden="true">
        <span><i className="nnl__dot" /> activation value</span>
        <span className="nnl__legend-edge"><i /> edge = learned weight</span>
        {effect === "backprop" ? <span className="nnl__legend-target">target token ▸</span> : null}
        {effect === "backprop" ? <span className="nnl__legend-loss"><i /> loss gap</span> : null}
      </div>

      <footer className="nnl__disclaimer"><span aria-hidden="true">◇</span>{mergedCopy.disclaimer}</footer>
    </section>
  );
}
