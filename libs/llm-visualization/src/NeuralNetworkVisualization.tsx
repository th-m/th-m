import {
  useEffect,
  useId,
  useReducer,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useMediaQuery } from "./media";
import {
  illustrativeScenario,
  kindLabels,
  viewLabels,
  visualizationStages,
  visualizationViews,
  type ContentKind,
  type VisualizationStageId,
  type VisualizationView,
} from "./model";
import { createVisualizationState, visualizationReducer } from "./state";

export interface VisualizationCopy {
  eyebrow: string;
  title: string;
  summary: string;
  disclaimer: string;
}

export interface NeuralNetworkVisualizationProps {
  initialStage?: VisualizationStageId;
  initialView?: VisualizationView;
  autoplay?: boolean;
  reducedMotion?: "system" | "always" | "never";
  showTrainingComparison?: boolean;
  copy?: Partial<VisualizationCopy>;
  className?: string;
}

const defaultCopy: VisualizationCopy = {
  eyebrow: "Decoder-only model · one token step",
  title: "Inside a language model",
  summary: "Follow one simplified forward pass from token representations to a selected next token, then watch that token return as context.",
  disclaimer: "Simplified explanatory model · deterministic illustrative values · not a literal live trace · architectures vary",
};

const isStage = (stageId: VisualizationStageId, ...ids: VisualizationStageId[]) => ids.includes(stageId);

function KindMark({ kind, compact = false }: { kind: ContentKind; compact?: boolean }) {
  return (
    <span className={`nnv-kind nnv-kind--${kind}`} data-kind={kind}>
      <span className="nnv-kind__shape" aria-hidden="true">{kind === "parameter" ? "◆" : "●"}</span>
      <span className={compact ? "nnv-visually-hidden" : undefined}>{kindLabels[kind]}</span>
    </span>
  );
}

function Node({
  label,
  detail,
  kind,
  active = false,
  children,
  className = "",
}: {
  label: string;
  detail: string;
  kind: ContentKind;
  active?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`nnv-node nnv-node--${kind} ${active ? "is-active" : ""} ${className}`}
      data-kind={kind}
      aria-label={`${label}. ${kindLabels[kind]}. ${detail}`}
    >
      <KindMark kind={kind} compact />
      <strong>{label}</strong>
      <span className="nnv-node__detail">{detail}</span>
      {children}
    </div>
  );
}

function Flow({ active = false, reverse = false, label }: { active?: boolean; reverse?: boolean; label?: string }) {
  return (
    <div className={`nnv-flow ${active ? "is-active" : ""} ${reverse ? "is-reverse" : ""}`} aria-hidden="true">
      <span className="nnv-flow__line" />
      <span className="nnv-flow__signal" />
      <span className="nnv-flow__arrow">{reverse ? "←" : "→"}</span>
      {label ? <small>{label}</small> : null}
    </div>
  );
}

function TokenStrip({ selected = false }: { selected?: boolean }) {
  return (
    <div className="nnv-token-strip" aria-label="Illustrative context tokens">
      {illustrativeScenario.context.map(({ token, position }) => (
        <span className="nnv-token" key={`${token}-${position}`}>
          <small>p{position}</small>{token}
        </span>
      ))}
      {selected ? <span className="nnv-token is-selected"><small>p4</small>{illustrativeScenario.selectedToken}</span> : null}
    </div>
  );
}

function PipelineScene({ stageId }: { stageId: VisualizationStageId }) {
  const representations = isStage(stageId, "representations");
  const blockWork = isStage(stageId, "residual-entry", "residual-norm", "stacked-blocks");
  const logits = isStage(stageId, "logits");
  const loop = isStage(stageId, "decode", "feedback");

  return (
    <div className="nnv-scene nnv-scene--pipeline" role="group" aria-label="Whole decoder-only inference pipeline">
      <div className="nnv-scene__track">
        <Node label="Token + position" detail="4 × dmodel" kind="activation" active={representations}>
          <TokenStrip />
          <div className="nnv-mini-parameter"><KindMark kind="parameter" compact /> embedding table</div>
        </Node>
        <Flow active={representations || blockWork} />
        <div className={`nnv-block-stack ${blockWork ? "is-active" : ""}`} aria-label="Stack of transformer blocks with distinct learned weights">
          <div className="nnv-stack-card nnv-stack-card--back"><span>Block 24</span></div>
          <div className="nnv-stack-card nnv-stack-card--middle"><span>Block 02</span></div>
          <div className="nnv-stack-card nnv-stack-card--front">
            <span className="nnv-stack-index">Block 01 / 24</span>
            <strong>Attention</strong>
            <span className="nnv-stack-divider">residual + norm</span>
            <strong>Feed-forward</strong>
            <KindMark kind="parameter" compact />
          </div>
        </div>
        <Flow active={blockWork || logits} />
        <Node label="Vocabulary projection" detail="hfinal × Wvocab" kind="parameter" active={logits} />
        <Flow active={logits || loop} />
        <Node label="Logits → token" detail="softmax + decoding" kind="activation" active={logits || loop}>
          <div className="nnv-mini-bars" aria-hidden="true">
            {illustrativeScenario.vocabulary.map(({ token, probability }) => (
              <span key={token} style={{ "--nnv-value": probability } as React.CSSProperties} />
            ))}
          </div>
          <span className="nnv-selected-token">“{illustrativeScenario.selectedToken}”</span>
        </Node>
      </div>
      <div className={`nnv-feedback-rail ${loop ? "is-active" : ""}`} aria-label="Autoregressive feedback path">
        <span>selected token joins the context</span>
        <span aria-hidden="true">↩</span>
      </div>
    </div>
  );
}

function AttentionMatrix({ active }: { active: boolean }) {
  return (
    <div className={`nnv-attention-matrix ${active ? "is-active" : ""}`} aria-label="Causal attention matrix. Masked future relationships are marked with crosses.">
      {illustrativeScenario.causalAttention.flatMap((row, rowIndex) => row.map((value, columnIndex) => {
        const masked = columnIndex > rowIndex;
        return (
          <span
            key={`${rowIndex}-${columnIndex}`}
            className={masked ? "is-masked" : ""}
            style={masked ? undefined : { "--nnv-weight": value } as React.CSSProperties}
            aria-label={masked ? `Position ${rowIndex} cannot attend to future position ${columnIndex}` : `Attention weight ${value.toFixed(2)}`}
          >
            {masked ? "×" : value.toFixed(2)}
          </span>
        );
      }))}
    </div>
  );
}

function AttentionScene({ stageId }: { stageId: VisualizationStageId }) {
  const projections = isStage(stageId, "qkv");
  const scores = isStage(stageId, "attention", "score-mix");

  return (
    <div className="nnv-scene nnv-scene--attention" role="group" aria-label="Multi-head causal self-attention detail">
      <div className="nnv-attention-flow">
        <Node label="Residual stream" detail="normalized token features" kind="activation" active={isStage(stageId, "attention")} />
        <Flow active={projections || scores} />
        <div className="nnv-qkv-group" aria-label="Query, key, and value projections">
          {(["Q", "K", "V"] as const).map((projection) => (
            <div className={`nnv-qkv ${projections ? "is-active" : ""}`} key={projection}>
              <div className="nnv-qkv__parameter"><KindMark kind="parameter" compact /> W<sub>{projection}</sub></div>
              <span className="nnv-qkv__arrow" aria-hidden="true">↓</span>
              <div className="nnv-qkv__activation"><KindMark kind="activation" compact /> {projection}</div>
            </div>
          ))}
        </div>
        <Flow active={scores} />
        <div className="nnv-score-panel">
          <span className="nnv-panel-label">QKᵀ + causal mask</span>
          <AttentionMatrix active={scores} />
        </div>
        <Flow active={isStage(stageId, "score-mix")} />
        <Node label="Value mix" detail="weighted context per head" kind="activation" active={isStage(stageId, "score-mix")} />
      </div>
      <div className="nnv-heads" aria-label="Illustrative attention heads">
        {illustrativeScenario.heads.map((head, index) => (
          <div className="nnv-head" key={head.label}>
            <header><span>H{index + 1}</span><strong>{head.label}</strong></header>
            <div className="nnv-head__weights" aria-label={`${head.label} head weights ${head.weights.join(", ")}`}>
              {head.weights.map((weight, weightIndex) => (
                <span key={weightIndex} style={{ "--nnv-weight": weight } as React.CSSProperties}>{weight.toFixed(2)}</span>
              ))}
            </div>
          </div>
        ))}
        <div className="nnv-head nnv-head--join">
          <header><span>JOIN</span><strong>Output projection</strong></header>
          <p><KindMark kind="parameter" compact /> W<sub>O</sub> recombines head features</p>
        </div>
      </div>
    </div>
  );
}

function FeedForwardScene({ stageId }: { stageId: VisualizationStageId }) {
  const active = isStage(stageId, "feed-forward");
  return (
    <div className="nnv-scene nnv-scene--mlp" role="group" aria-label="Feed-forward network detail">
      <div className="nnv-mlp-skip" aria-label="Residual skip path"><span>x</span><span>unmodified skip path</span><span>＋</span></div>
      <div className="nnv-mlp-flow">
        <Node label="Normalized x" detail="dmodel = 4" kind="activation" active={active} />
        <Flow active={active} />
        <Node label="Expand" detail="Wup · x" kind="parameter" active={active} />
        <Flow active={active} />
        <Node label="Wide features" detail="dff = 8" kind="activation" active={active} className="nnv-wide-features">
          <div className="nnv-feature-bars" aria-hidden="true">
            {illustrativeScenario.mlpExpansion.map((value, index) => (
              <span className={value < 0 ? "is-negative" : ""} key={index} style={{ "--nnv-value": Math.abs(value) } as React.CSSProperties} />
            ))}
          </div>
        </Node>
        <Flow active={active} />
        <Node label="GELU" detail="nonlinear activation" kind="activation" active={active} />
        <Flow active={active} />
        <Node label="Project down" detail="Wdown · features" kind="parameter" active={active} />
        <Flow active={active} />
        <Node label="Residual update" detail="Δx rejoins stream" kind="activation" active={active} />
      </div>
      <p className="nnv-scene-note"><KindMark kind="activation" compact /> The same learned MLP is applied independently at every token position within this layer.</p>
    </div>
  );
}

function ProbabilityBars() {
  return (
    <div className="nnv-probabilities" aria-label="Illustrative next-token probabilities">
      {illustrativeScenario.vocabulary.map(({ token, logit, probability }, index) => (
        <div className={index === 0 ? "is-selected" : ""} key={token}>
          <span className="nnv-prob-token">{token}</span>
          <span className="nnv-prob-track"><span style={{ "--nnv-value": probability } as React.CSSProperties} /></span>
          <span>{Math.round(probability * 100)}%</span>
          <small>logit {logit.toFixed(2)}</small>
        </div>
      ))}
    </div>
  );
}

function AutoregressiveScene({ stageId }: { stageId: VisualizationStageId }) {
  const decode = isStage(stageId, "decode");
  const feedback = isStage(stageId, "feedback");
  return (
    <div className="nnv-scene nnv-scene--loop" role="group" aria-label="Autoregressive next-token loop">
      <div className="nnv-loop-context">
        <span className="nnv-panel-label">Context · inference step 01</span>
        <TokenStrip selected={feedback} />
      </div>
      <Flow active={decode || feedback} label="forward pass" />
      <div className={`nnv-loop-model ${decode || feedback ? "is-active" : ""}`}>
        <span>24 ×</span>
        <strong>decoder block</strong>
        <small>cached K / V may be reused</small>
      </div>
      <Flow active={decode || feedback} label="vocabulary scores" />
      <ProbabilityBars />
      <div className={`nnv-loop-selection ${decode ? "is-active" : ""}`}>
        <span>selected next token</span><strong>“{illustrativeScenario.selectedToken}”</strong><small>greedy in this example</small>
      </div>
      <div className={`nnv-loop-return ${feedback ? "is-active" : ""}`}>
        <span aria-hidden="true">↩</span>
        <p><strong>Append, then repeat.</strong> The next pass predicts position 5 from the extended context.</p>
      </div>
    </div>
  );
}

function Scene({ view, stageId }: { view: VisualizationView; stageId: VisualizationStageId }) {
  switch (view) {
    case "attention": return <AttentionScene stageId={stageId} />;
    case "feed-forward": return <FeedForwardScene stageId={stageId} />;
    case "autoregressive": return <AutoregressiveScene stageId={stageId} />;
    case "pipeline": return <PipelineScene stageId={stageId} />;
  }
}

function ControlIcon({ name }: { name: "previous" | "next" | "play" | "pause" | "reset" }) {
  const paths: Record<typeof name, ReactNode> = {
    previous: <><path d="M18 6 10 12l8 6" /><path d="M6 5v14" /></>,
    next: <><path d="m6 6 8 6-8 6" /><path d="M18 5v14" /></>,
    play: <path d="m8 5 11 7-11 7Z" />,
    pause: <><path d="M9 5v14" /><path d="M15 5v14" /></>,
    reset: <><path d="M5 8V4m0 0h4" /><path d="M5.8 5.7A8 8 0 1 1 4 14" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function TrainingComparison() {
  return (
    <details className="nnv-training">
      <summary>
        <span><span className="nnv-training__flag">Training only</span> Compare what happens after a forward pass during training</span>
        <span aria-hidden="true">＋</span>
      </summary>
      <div className="nnv-training__content">
        <div><small>Target token</small><strong>“story”</strong><KindMark kind="activation" compact /></div>
        <span aria-hidden="true">→</span>
        <div><small>Loss</small><strong>−log .19 = 1.66</strong><KindMark kind="activation" compact /></div>
        <span aria-hidden="true">←</span>
        <div><small>Backpropagate</small><strong>gradients ∂L/∂θ</strong><KindMark kind="activation" compact /></div>
        <span aria-hidden="true">→</span>
        <div><small>Optimizer</small><strong>update parameters</strong><KindMark kind="parameter" compact /></div>
      </div>
      <p>Backpropagation and optimizer updates change learned parameters during training. They are not ordinary steps in next-token inference.</p>
    </details>
  );
}

export function NeuralNetworkVisualization({
  initialStage = "representations",
  initialView,
  autoplay = false,
  reducedMotion = "system",
  showTrainingComparison = true,
  copy,
  className = "",
}: NeuralNetworkVisualizationProps) {
  const systemReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const compactLayout = useMediaQuery("(max-width: 760px)");
  const motionIsReduced = reducedMotion === "always" || (reducedMotion === "system" && systemReducedMotion);
  const [state, dispatch] = useReducer(
    visualizationReducer,
    undefined,
    () => createVisualizationState(initialStage, initialView, autoplay && !motionIsReduced),
  );
  const descriptionId = useId();
  const mergedCopy = { ...defaultCopy, ...copy };
  const stage = visualizationStages[state.stageIndex] ?? visualizationStages[0];

  useEffect(() => {
    if (motionIsReduced) {
      dispatch({ type: "stop" });
      return;
    }
    if (!state.isPlaying) return;
    const timer = window.setInterval(() => dispatch({ type: "tick" }), 1_800);
    return () => window.clearInterval(timer);
  }, [motionIsReduced, state.isPlaying]);

  const handleKeyboard = (event: KeyboardEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target !== event.currentTarget) return;
    if (event.key === "ArrowRight") dispatch({ type: "next" });
    else if (event.key === "ArrowLeft") dispatch({ type: "previous" });
    else if (event.key === "Home") dispatch({ type: "select-stage", stageIndex: 0 });
    else if (event.key === "End") dispatch({ type: "select-stage", stageIndex: visualizationStages.length - 1 });
    else if (event.key === " ") dispatch({ type: "toggle-play" });
    else return;
    event.preventDefault();
  };

  return (
    <section
      className={`nnv ${className}`}
      aria-label="Interactive decoder-only language model visualization"
      aria-describedby={descriptionId}
      data-layout={compactLayout ? "compact" : "wide"}
      data-motion={motionIsReduced ? "reduced" : "full"}
      data-stage={stage.id}
      data-view={state.view}
      tabIndex={0}
      onKeyDown={handleKeyboard}
    >
      <header className="nnv-header">
        <div className="nnv-header__copy">
          <p className="nnv-eyebrow">{mergedCopy.eyebrow}</p>
          <h2>{mergedCopy.title}</h2>
          <p id={descriptionId}>{mergedCopy.summary}</p>
        </div>
        <div className="nnv-status" aria-label="Model status">
          <span><i aria-hidden="true" /> Inference</span>
          <strong>Step {String(state.stageIndex + 1).padStart(2, "0")} / {visualizationStages.length}</strong>
        </div>
      </header>

      <nav className="nnv-views" aria-label="Visualization focus">
        {visualizationViews.map((view) => (
          <button type="button" key={view} aria-pressed={state.view === view} onClick={() => dispatch({ type: "select-view", view })}>
            <span aria-hidden="true">{String(visualizationViews.indexOf(view) + 1).padStart(2, "0")}</span>
            {viewLabels[view]}
          </button>
        ))}
      </nav>

      <div className="nnv-canvas">
        <div className="nnv-stage-copy" aria-live="polite" aria-atomic="true">
          <span className="nnv-stage-copy__index">{String(state.stageIndex + 1).padStart(2, "0")}</span>
          <p className="nnv-stage-copy__signal">{stage.signal}</p>
          <h3>{stage.title}</h3>
          <p>{stage.description}</p>
          <div className="nnv-stage-copy__result"><span>Produces</span><strong>{stage.result}</strong></div>
          <div className="nnv-stage-copy__kinds">
            {stage.kinds.map((kind) => <KindMark kind={kind} key={kind} />)}
          </div>
        </div>
        <div className="nnv-diagram">
          <div className="nnv-diagram__meta">
            <span>{viewLabels[state.view]}</span>
            <span>Illustrative dimensions · dmodel 4 · 3 heads · 24 blocks</span>
          </div>
          <Scene view={state.view} stageId={stage.id} />
          <div className="nnv-legend" aria-label="Diagram legend">
            <KindMark kind="parameter" />
            <KindMark kind="activation" />
            <span className="nnv-legend__mask"><i aria-hidden="true">×</i> causally masked</span>
          </div>
        </div>
      </div>

      <div className="nnv-transport">
        <div className="nnv-controls" aria-label="Playback controls">
          <button type="button" aria-label="Previous stage" onClick={() => dispatch({ type: "previous" })} disabled={state.stageIndex === 0}><ControlIcon name="previous" /></button>
          <button type="button" className="nnv-play" aria-label={state.isPlaying ? "Pause animation" : "Play animation"} aria-pressed={state.isPlaying} onClick={() => dispatch({ type: "toggle-play" })}>
            <ControlIcon name={state.isPlaying ? "pause" : "play"} />
            <span>{state.isPlaying ? "Pause" : "Play"}</span>
          </button>
          <button type="button" aria-label="Next stage" onClick={() => dispatch({ type: "next" })} disabled={state.stageIndex === visualizationStages.length - 1}><ControlIcon name="next" /></button>
          <button type="button" aria-label="Reset visualization" onClick={() => dispatch({ type: "reset" })}><ControlIcon name="reset" /></button>
        </div>
        <p>Keyboard: ← / → to step · space to play · home to reset</p>
      </div>

      <ol className="nnv-timeline" aria-label="Forward-pass stages">
        {visualizationStages.map((item, index) => (
          <li key={item.id} className={index < state.stageIndex ? "is-complete" : index === state.stageIndex ? "is-active" : ""}>
            <button
              type="button"
              aria-label={`Go to stage ${index + 1}: ${item.title}`}
              aria-current={index === state.stageIndex ? "step" : undefined}
              onClick={() => dispatch({ type: "select-stage", stageIndex: index })}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.shortLabel}</strong>
            </button>
          </li>
        ))}
      </ol>

      {showTrainingComparison ? <TrainingComparison /> : null}
      <footer className="nnv-disclaimer"><span aria-hidden="true">◇</span>{mergedCopy.disclaimer}</footer>
    </section>
  );
}
