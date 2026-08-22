import {
  useEffect,
  useId,
  useReducer,
  useRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  trainingCorpus,
  trainingLossTrace,
  trainingModes,
  trainingSteps,
  type TrainingMode,
} from "./model";
import { createTrainingState, trainingReducer, type TrainingState } from "./state";

export interface TrainingWalkthroughCopy {
  eyebrow: string;
  title: string;
  summary: string;
  disclaimer: string;
}

export interface TrainingWalkthroughProps {
  initialMode?: TrainingMode;
  autoplay?: boolean;
  reducedMotion?: "system" | "always" | "never";
  copy?: Partial<TrainingWalkthroughCopy>;
  className?: string;
}

const defaultCopy: TrainingWalkthroughCopy = {
  eyebrow: "Training only · not inference",
  title: "How an LLM learns",
  summary:
    "Walk through the training loop: corpus tokens become predictions, predictions become loss, and loss drives gradient updates that reshape the parameters.",
  disclaimer:
    "Simplified explanatory model · deterministic illustrative values · backpropagation belongs to training, never to ordinary inference",
};

function mediaMatches(query: string): boolean {
  return typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia(query).matches
    : false;
}

function ControlIcon({ name }: { name: "back" | "play" | "pause" | "forward" | "reset" }) {
  const paths: Record<typeof name, ReactNode> = {
    back: <><path d="M18 6 10 12l8 6" /><path d="M6 5v14" /></>,
    play: <path d="m8 5 11 7-11 7Z" />,
    pause: <><path d="M9 5v14" /><path d="M15 5v14" /></>,
    forward: <><path d="m6 6 8 6-8 6" /><path d="M18 5v14" /></>,
    reset: <><path d="M5 8V4m0 0h4" /><path d="M5.8 5.7A8 8 0 1 1 4 14" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function KindMark({ kind }: { kind: "parameter" | "activation" }) {
  return (
    <span className={`tr-kind tr-kind--${kind}`} aria-hidden="true">
      {kind === "parameter" ? "◆" : "●"}
    </span>
  );
}

/** Maps a step index onto the loss trace so playback animates along the curve. */
function epochForStep(stepIndex: number, stepTotal: number): number {
  if (stepTotal <= 1) return 0;
  return Math.min(
    trainingLossTrace.length - 1,
    Math.round((stepIndex / (stepTotal - 1)) * (trainingLossTrace.length - 1)),
  );
}

function LossCurve({ epoch }: { epoch: number }) {
  const width = 100;
  const height = 40;
  const min = Math.min(...trainingLossTrace);
  const max = Math.max(...trainingLossTrace);
  const range = Math.max(0.001, max - min);
  const points = trainingLossTrace.map((value, index) => {
    const x = (index / (trainingLossTrace.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 6) - 3;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  const marker = {
    x: (epoch / (trainingLossTrace.length - 1)) * width,
    y: height - ((trainingLossTrace[epoch] - min) / range) * (height - 6) - 3,
  };
  return (
    <svg
      className="tr-curve"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Training loss curve; epoch ${epoch + 1} of ${trainingLossTrace.length}, loss ${trainingLossTrace[epoch].toFixed(2)}`}
      preserveAspectRatio="none"
    >
      <polyline className="tr-curve__line" points={points.join(" ")} fill="none" />
      <circle className="tr-curve__marker" cx={marker.x} cy={marker.y} r="2.4" />
      <text x={marker.x} y="38" className="tr-curve__label" textAnchor="middle">
        e{epoch + 1}
      </text>
    </svg>
  );
}

function SimpleScene({ epoch }: { epoch: number }) {
  return (
    <div className="tr-scene" role="group" aria-label="Simple training loop over a fixed corpus">
      <div className="tr-corpus" aria-label="Training corpus">
        {trainingCorpus.map((sentence) => (
          <div className="tr-sentence" key={sentence.text}>
            <span>{sentence.text}</span>
            <strong>{sentence.target}</strong>
          </div>
        ))}
      </div>
      <div className="tr-flowline" aria-hidden="true"><span>predict → compare → loss</span></div>
      <div className="tr-loss-readout">
        <span className="tr-panel-label">Cross-entropy loss · epoch {epoch + 1}</span>
        <strong>{trainingLossTrace[epoch].toFixed(2)}</strong>
        <small>lower is better</small>
      </div>
    </div>
  );
}

function ModelScene({ epoch, stepIndex }: { epoch: number; stepIndex: number }) {
  const steps = trainingSteps("model");
  const active = (index: number) => stepIndex >= index;
  return (
    <div className="tr-model" role="group" aria-label="Training forward and backward pass">
      <div className={`tr-model__node ${active(0) ? "is-active" : ""}`}>
        <KindMark kind="activation" /><span>Token embeddings</span>
      </div>
      <span className="tr-model__arrow" aria-hidden="true">↓</span>
      <div className={`tr-model__node ${active(1) ? "is-active" : ""}`}>
        <KindMark kind="activation" /><span>Forward pass → prediction</span>
      </div>
      <span className="tr-model__arrow" aria-hidden="true">↓</span>
      <div className={`tr-model__node ${active(2) ? "is-active" : ""}`}>
        <KindMark kind="activation" /><span>Loss L = −log p(target)</span>
      </div>
      <span className="tr-model__arrow tr-model__arrow--back" aria-hidden="true">↑ backprop</span>
      <div className={`tr-model__node ${active(3) ? "is-active" : ""}`}>
        <KindMark kind="activation" /><span>Gradients ∂L/∂θ</span>
      </div>
      <span className="tr-model__arrow" aria-hidden="true">↓</span>
      <div className={`tr-model__node ${active(4) ? "is-active" : ""}`}>
        <KindMark kind="parameter" /><span>Optimizer: θ ← θ − η·∂L/∂θ</span>
      </div>
      <span className="tr-model__arrow" aria-hidden="true">↓</span>
      <div className={`tr-model__node ${active(5) ? "is-active" : ""}`}>
        <KindMark kind="parameter" /><span>Updated parameters · epoch {epoch + 1}</span>
      </div>
      <p className="tr-model__hint">Parameter changes happen only during training — ordinary inference never backpropagates.</p>
      <p className="tr-model__step-count">{String(stepIndex + 1).padStart(2, "0")} / {steps.length}</p>
    </div>
  );
}

export function TrainingWalkthrough({
  initialMode = "simple",
  autoplay = false,
  reducedMotion = "system",
  copy,
  className = "",
}: TrainingWalkthroughProps) {
  const systemReducedMotion = typeof window !== "undefined"
    && typeof window.matchMedia === "function"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const motionIsReduced = reducedMotion === "always" || (reducedMotion === "system" && systemReducedMotion);
  const [state, dispatch] = useReducer(
    trainingReducer,
    undefined,
    () => createTrainingState(initialMode, autoplay && !motionIsReduced),
  );
  const descriptionId = useId();
  const helpRef = useRef<HTMLDetailsElement>(null);
  const mergedCopy = { ...defaultCopy, ...copy };

  const steps = trainingSteps(state.mode);
  const step = steps[state.stepIndex] ?? steps[0];
  const epoch = epochForStep(state.stepIndex, steps.length);

  useEffect(() => {
    if (motionIsReduced) {
      if (state.isPlaying) dispatch({ type: "pause" });
      return;
    }
    if (!state.isPlaying) return;
    const timer = window.setInterval(() => dispatch({ type: "tick" }), 1_600);
    return () => window.clearInterval(timer);
  }, [motionIsReduced, state.isPlaying]);

  const handleKeyboard = (event: KeyboardEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target !== event.currentTarget) return;
    const key = event.key;
    if (key === " ") dispatch({ type: "toggle-play" });
    else if (key === "ArrowRight") dispatch({ type: "step-forward" });
    else if (key === "ArrowLeft") dispatch({ type: "step-back" });
    else if (key === "r" || key === "R") dispatch({ type: "reset" });
    else if (key === "h" || key === "H") {
      if (helpRef.current) helpRef.current.open = !helpRef.current.open;
    } else return;
    event.preventDefault();
  };

  return (
    <section
      className={`tr ${className}`}
      aria-label="Interactive training walkthrough"
      aria-describedby={descriptionId}
      data-motion={motionIsReduced ? "reduced" : "full"}
      tabIndex={0}
      onKeyDown={handleKeyboard}
    >
      <header className="tr-header">
        <div className="tr-header__copy">
          <p className="tr-eyebrow"><span className="tr-flag">Training only</span>{mergedCopy.eyebrow}</p>
          <h3>{mergedCopy.title}</h3>
          <p id={descriptionId}>{mergedCopy.summary}</p>
        </div>
        <div className="tr-status" aria-label="Training status">
          <span><i aria-hidden="true" /> Loss {trainingLossTrace[epoch].toFixed(2)}</span>
          <strong>Step {String(state.stepIndex + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</strong>
        </div>
      </header>

      <div className="tr-modes" role="group" aria-label="Training view">
        {trainingModes.map((mode) => (
          <button
            type="button"
            key={mode}
            aria-pressed={state.mode === mode}
            onClick={() => dispatch({ type: "select-mode", mode })}
          >
            {mode === "simple" ? "Simple" : "Model"}
          </button>
        ))}
      </div>

      <div className="tr-canvas">
        <div className="tr-stage-copy" aria-live="polite" aria-atomic="true">
          <span className="tr-stage-copy__index">{String(state.stepIndex + 1).padStart(2, "0")}</span>
          <p className="tr-stage-copy__signal">{step.signal}</p>
          <h4>{step.title}</h4>
          <p>{step.description}</p>
          <div className="tr-stage-copy__result"><span>Produces</span><strong>{step.result}</strong></div>
        </div>
        <div className="tr-diagram">
          {state.mode === "simple"
            ? <SimpleScene epoch={epoch} />
            : <ModelScene epoch={epoch} stepIndex={state.stepIndex} />}
          <LossCurve epoch={epoch} />
        </div>
      </div>

      <div className="tr-transport">
        <div className="tr-controls" aria-label="Playback controls">
          <button type="button" aria-label="Previous step" onClick={() => dispatch({ type: "step-back" })} disabled={state.stepIndex === 0}>
            <ControlIcon name="back" />
          </button>
          <button
            type="button"
            className="tr-play"
            aria-label={state.isPlaying ? "Pause animation" : "Play animation"}
            aria-pressed={state.isPlaying}
            onClick={() => dispatch({ type: "toggle-play" })}
          >
            <ControlIcon name={state.isPlaying ? "pause" : "play"} />
            <span>{state.isPlaying ? "Pause" : "Play"}</span>
          </button>
          <button type="button" aria-label="Next step" onClick={() => dispatch({ type: "step-forward" })} disabled={state.stepIndex >= steps.length - 1}>
            <ControlIcon name="forward" />
          </button>
          <button type="button" aria-label="Reset training walkthrough" onClick={() => dispatch({ type: "reset" })}>
            <ControlIcon name="reset" />
          </button>
        </div>
      </div>

      <details className="tr-help" ref={helpRef}>
        <summary>Keyboard shortcuts</summary>
        <ul>
          <li><kbd>Space</kbd> play / pause</li>
          <li><kbd>←</kbd> / <kbd>→</kbd> step back / forward</li>
          <li><kbd>R</kbd> reset</li>
          <li><kbd>H</kbd> toggle this help</li>
        </ul>
      </details>

      <footer className="tr-disclaimer"><span aria-hidden="true">◇</span>{mergedCopy.disclaimer}</footer>
    </section>
  );
}
