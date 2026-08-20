import {
  useEffect,
  useId,
  useMemo,
  useReducer,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  createDecodingResult,
  createDeterministicTrainingTrace,
  createEmbeddingPoints,
  defaultTransformerLabConfig,
  deriveTransformerArchitecture,
  formatParameterCount,
  normalizeTransformerLabConfig,
  tokenizeWithIllustrativeBpe,
  transformerLabLimits,
  transformerLabPhaseDefinitions,
  transformerLabPhases,
  transformerLabPresets,
  type BpeResult,
  type DecodingResult,
  type TrainingCheckpoint,
  type TransformerArchitecture,
  type TransformerLabConfig,
  type TransformerLabPhase,
} from "./lab-model";
import { createTransformerLabState, transformerLabReducer } from "./lab-state";
import { useMediaQuery } from "./media";

export interface TransformerLabCopy {
  eyebrow: string;
  title: string;
  summary: string;
  disclaimer: string;
}

export interface TransformerLabProps {
  initialConfig?: Partial<TransformerLabConfig>;
  initialPhase?: TransformerLabPhase;
  autoplay?: boolean;
  reducedMotion?: "system" | "always" | "never";
  copy?: Partial<TransformerLabCopy>;
  className?: string;
}

const defaultCopy: TransformerLabCopy = {
  eyebrow: "Transformer lab · deterministic controls",
  title: "Change the knobs. Keep the science visible.",
  summary: "Transform a prompt, inspect a tiny decoder architecture, follow a seeded learning trace, and see how temperature and top-p alter decoding.",
  disclaimer: "Teaching instrument · tokenization and decoding math run locally · loss and sample progression are deterministic illustrative traces · no model weights are trained",
};

type NumericConfigKey = Exclude<keyof TransformerLabConfig, "prompt">;

function LabIcon({ name }: { name: "previous" | "next" | "play" | "pause" | "reset" }) {
  const paths: Record<typeof name, ReactNode> = {
    previous: <><path d="M18 6 10 12l8 6" /><path d="M6 5v14" /></>,
    next: <><path d="m6 6 8 6-8 6" /><path d="M18 5v14" /></>,
    play: <path d="m8 5 11 7-11 7Z" />,
    pause: <><path d="M9 5v14" /><path d="M15 5v14" /></>,
    reset: <><path d="M5 8V4m0 0h4" /><path d="M5.8 5.7A8 8 0 1 1 4 14" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function KindBadge({ kind }: { kind: "parameter" | "activation" }) {
  return (
    <span className={`nnv-lab-kind nnv-lab-kind--${kind}`}>
      <span aria-hidden="true">{kind === "parameter" ? "◆" : "●"}</span>
      {kind === "parameter" ? "Persistent learned parameter" : "Temporary activation"}
    </span>
  );
}

function RangeControl({
  configKey,
  label,
  value,
  displayValue,
  onChange,
}: {
  configKey: NumericConfigKey;
  label: string;
  value: number;
  displayValue?: string;
  onChange: (key: NumericConfigKey, value: number) => void;
}) {
  const limits = transformerLabLimits[configKey];
  return (
    <label className="nnv-lab-control">
      <span>{label}<output>{displayValue ?? value}</output></span>
      <input
        type="range"
        aria-label={label}
        min={limits.min}
        max={limits.max}
        step={limits.step}
        value={value}
        onChange={(event) => onChange(configKey, Number(event.currentTarget.value))}
      />
      <small><span>{limits.min}</span><span>{limits.max}</span></small>
    </label>
  );
}

function ArchitectureMetrics({ architecture }: { architecture: TransformerArchitecture }) {
  const metrics = [
    ["Parameters", formatParameterCount(architecture.totalParameters)],
    ["Vocabulary", architecture.vocabSize],
    ["Context", architecture.contextLength],
    ["Width", architecture.embeddingDimension],
    ["Heads", architecture.numHeads],
    ["MLP", architecture.feedForwardDimension],
  ] as const;
  return (
    <dl className="nnv-lab-metrics" aria-label="Illustrative transformer architecture metrics">
      {metrics.map(([label, value]) => (
        <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
      ))}
    </dl>
  );
}

function EmbeddingMap({ bpe }: { bpe: BpeResult }) {
  const points = createEmbeddingPoints(bpe.tokens);
  return (
    <svg className="nnv-lab-embedding-map" viewBox="0 0 320 150" role="img" aria-label={`Deterministic two-dimensional projection of ${points.length} token embeddings`}>
      <line x1="20" y1="75" x2="300" y2="75" />
      <line x1="160" y1="15" x2="160" y2="135" />
      {points.map((point, index) => {
        const x = 160 + (point.x * 126);
        const y = 75 - (point.y * 52);
        return (
          <g key={`${point.token}-${index}`} transform={`translate(${x} ${y})`}>
            <circle r="4" />
            <text x="7" y="3">{point.token}</text>
          </g>
        );
      })}
    </svg>
  );
}

function TokenizerPanel({ bpe, active }: { bpe: BpeResult; active: boolean }) {
  return (
    <article className={`nnv-lab-card nnv-lab-tokenizer ${active ? "is-active" : ""}`}>
      <header>
        <div><span className="nnv-lab-card__index">01 / actual transform</span><h4>BPE workbench</h4></div>
        <KindBadge kind="activation" />
      </header>
      <p>Characters merge into reusable pieces using a small fixed vocabulary. IDs are stable hashes for this teaching instrument.</p>
      <div className="nnv-lab-tokens" aria-label="Tokenized prompt">
        {bpe.tokens.length > 0 ? bpe.tokens.map((token, index) => (
          <span key={`${token.text}-${index}`}><strong>{token.text}</strong><small>#{token.id}</small></span>
        )) : <span className="is-empty">Enter a prompt to transform</span>}
      </div>
      <div className="nnv-lab-token-detail">
        <div>
          <span className="nnv-lab-card__label">Applied merge rules</span>
          <ol className="nnv-lab-merges">
            {bpe.merges.slice(0, 6).map((merge, index) => (
              <li key={`${merge.word}-${merge.pair}-${index}`}>
                <span>{merge.pair}</span><i aria-hidden="true">→</i><strong>{merge.result}</strong>
              </li>
            ))}
            {bpe.merges.length === 0 ? <li><span>No configured pair matched</span></li> : null}
          </ol>
        </div>
        <div>
          <span className="nnv-lab-card__label">Embedding lookup · projected to 2D</span>
          <EmbeddingMap bpe={bpe} />
        </div>
      </div>
    </article>
  );
}

function ArchitecturePanel({ architecture, active, forwardActive }: { architecture: TransformerArchitecture; active: boolean; forwardActive: boolean }) {
  return (
    <article className={`nnv-lab-card nnv-lab-architecture ${active || forwardActive ? "is-active" : ""}`}>
      <header>
        <div><span className="nnv-lab-card__index">02 / decoder-only</span><h4>Architecture ledger</h4></div>
        <KindBadge kind="parameter" />
      </header>
      <ArchitectureMetrics architecture={architecture} />
      <div className={`nnv-lab-model-flow ${forwardActive ? "is-flowing" : ""}`} aria-label={`${architecture.numLayers} layer decoder-only model flow`}>
        <div className="nnv-lab-model-node nnv-lab-model-node--activation"><span>●</span><strong>Tokens</strong><small>T × 32</small></div>
        <span className="nnv-lab-model-arrow" aria-hidden="true">→</span>
        <div className="nnv-lab-blocks">
          {Array.from({ length: architecture.numLayers }, (_, index) => (
            <div key={index} style={{ "--nnv-lab-layer": index } as CSSProperties}>
              <span>Layer {String(index + 1).padStart(2, "0")}</span>
              <strong>MHCA <i>＋</i> MLP</strong>
            </div>
          ))}
        </div>
        <span className="nnv-lab-model-arrow" aria-hidden="true">→</span>
        <div className="nnv-lab-model-node nnv-lab-model-node--parameter"><span>◆</span><strong>Vocab head</strong><small>32 × 96</small></div>
      </div>
      <footer><KindBadge kind="activation" /><span>activations travel forward</span><i aria-hidden="true">/</i><KindBadge kind="parameter" /><span>weights persist across requests</span></footer>
    </article>
  );
}

function lossChartGeometry(trace: readonly TrainingCheckpoint[]) {
  const width = 640;
  const height = 220;
  const inset = { top: 20, right: 18, bottom: 28, left: 44 };
  const maxLoss = Math.max(...trace.map((checkpoint) => checkpoint.loss));
  const minLoss = Math.min(...trace.map((checkpoint) => checkpoint.loss));
  const range = Math.max(0.001, maxLoss - minLoss);
  const points = trace.map((checkpoint, index) => ({
    x: inset.left + ((index / Math.max(1, trace.length - 1)) * (width - inset.left - inset.right)),
    y: inset.top + (((maxLoss - checkpoint.loss) / range) * (height - inset.top - inset.bottom)),
  }));
  return { width, height, inset, maxLoss, minLoss, points, path: points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ") };
}

function LossChart({ trace, selectedIndex, onSelect }: { trace: readonly TrainingCheckpoint[]; selectedIndex: number; onSelect: (index: number) => void }) {
  const chart = lossChartGeometry(trace);
  const selected = trace[selectedIndex] ?? trace.at(-1);
  return (
    <div className="nnv-lab-loss-chart">
      <svg viewBox={`0 0 ${chart.width} ${chart.height}`} role="img" aria-label={`Deterministic illustrative loss decreases from ${chart.maxLoss.toFixed(2)} to ${chart.minLoss.toFixed(2)}`}>
        {[0, 0.5, 1].map((fraction) => {
          const y = chart.inset.top + (fraction * (chart.height - chart.inset.top - chart.inset.bottom));
          return <line className="nnv-lab-chart-grid" key={fraction} x1={chart.inset.left} x2={chart.width - chart.inset.right} y1={y} y2={y} />;
        })}
        <path className="nnv-lab-chart-area" d={`${chart.path} L${chart.points.at(-1)?.x ?? 0} ${chart.height - chart.inset.bottom} L${chart.inset.left} ${chart.height - chart.inset.bottom} Z`} />
        <path className="nnv-lab-chart-line" d={chart.path} />
        {chart.points.map((point, index) => (
          <circle className={index === selectedIndex ? "is-selected" : ""} key={index} cx={point.x} cy={point.y} r={index === selectedIndex ? 5 : 2.5} />
        ))}
        <text x={chart.inset.left} y={chart.height - 8}>epoch 0</text>
        <text textAnchor="end" x={chart.width - chart.inset.right} y={chart.height - 8}>epoch {trace.at(-1)?.epoch}</text>
      </svg>
      <label>
        <span>Inspect checkpoint <output>epoch {selected?.epoch} · loss {selected?.loss.toFixed(4)}</output></span>
        <input type="range" aria-label="Inspect training checkpoint" min="0" max={trace.length - 1} step="1" value={selectedIndex} onChange={(event) => onSelect(Number(event.currentTarget.value))} />
      </label>
    </div>
  );
}

function TrainingPanel({ trace, activePhase, selectedIndex, onSelect }: { trace: readonly TrainingCheckpoint[]; activePhase: TransformerLabPhase; selectedIndex: number; onSelect: (index: number) => void }) {
  const isActive = activePhase === "loss" || activePhase === "backpropagate" || activePhase === "update";
  const finalLoss = trace.at(-1)?.loss ?? 0;
  return (
    <article className={`nnv-lab-card nnv-lab-training-card ${isActive ? "is-active" : ""}`}>
      <header>
        <div><span className="nnv-lab-card__index">03 / training only</span><h4>Learning trace</h4></div>
        <span className="nnv-lab-training-flag">Not inference</span>
      </header>
      <div className="nnv-lab-loss-layout">
        <LossChart trace={trace} selectedIndex={selectedIndex} onSelect={onSelect} />
        <dl className="nnv-lab-loss-summary">
          <div><dt>Start loss</dt><dd>{trace[0]?.loss.toFixed(3)}</dd></div>
          <div><dt>Final loss</dt><dd>{finalLoss.toFixed(3)}</dd></div>
          <div><dt>Checkpoints</dt><dd>{trace.length}</dd></div>
          <div><dt>Trace source</dt><dd>Seeded</dd></div>
        </dl>
      </div>
      <div className="nnv-lab-update-rail" aria-label="Training-only loss, gradient, and optimizer path">
        <div className={activePhase === "loss" ? "is-active" : ""}><small>Target token</small><strong>“story”</strong><KindBadge kind="activation" /></div>
        <span aria-hidden="true">→</span>
        <div className={activePhase === "loss" ? "is-active" : ""}><small>Cross-entropy</small><strong>−log p(target)</strong><KindBadge kind="activation" /></div>
        <span aria-hidden="true">←</span>
        <div className={activePhase === "backpropagate" ? "is-active" : ""}><small>Backpropagate</small><strong>gradients ∂L/∂θ</strong><KindBadge kind="activation" /></div>
        <span aria-hidden="true">→</span>
        <div className={activePhase === "update" ? "is-active" : ""}><small>Adam step</small><strong>θ ← θ − update</strong><KindBadge kind="parameter" /></div>
      </div>
      <p className="nnv-lab-training-caveat">The curve and text checkpoints are stable illustrative data recomputed from the controls. They explain training telemetry; they are not evidence of a model being trained in this page.</p>
    </article>
  );
}

function SamplerPanel({ decoding, trace, config, active }: { decoding: DecodingResult; trace: readonly TrainingCheckpoint[]; config: TransformerLabConfig; active: boolean }) {
  const samples = trace.filter((checkpoint) => checkpoint.sample);
  return (
    <article className={`nnv-lab-card nnv-lab-sampler ${active ? "is-active" : ""}`}>
      <header>
        <div><span className="nnv-lab-card__index">04 / actual decoding math</span><h4>Nucleus sampler</h4></div>
        <KindBadge kind="activation" />
      </header>
      <div className="nnv-lab-sampler-layout">
        <div className="nnv-lab-distribution" aria-label="Temperature-adjusted next-token distribution">
          {decoding.candidates.map((candidate) => (
            <div className={`${candidate.included ? "is-included" : "is-excluded"} ${candidate.selected ? "is-selected" : ""}`} key={candidate.token}>
              <span>{candidate.token}</span>
              <span className="nnv-lab-prob-track"><i style={{ "--nnv-lab-probability": candidate.probability } as CSSProperties} /></span>
              <strong>{(candidate.probability * 100).toFixed(1)}%</strong>
              <small>{candidate.included ? "in nucleus" : "trimmed"}</small>
            </div>
          ))}
        </div>
        <div className="nnv-lab-selection">
          <small>Selected next token</small>
          <strong>“{decoding.selectedToken}”</strong>
          <p>temperature {config.temperature.toFixed(1)} · top-p {config.topP.toFixed(2)} · retained mass {(decoding.nucleusMass * 100).toFixed(1)}%</p>
          <div><span aria-hidden="true">↩</span> append to context and repeat</div>
        </div>
      </div>
      <div className="nnv-lab-samples" aria-label="Illustrative generated text checkpoints">
        {samples.map((checkpoint) => (
          <div key={checkpoint.epoch}><small>epoch {checkpoint.epoch}</small><p>{checkpoint.sample}</p></div>
        ))}
      </div>
    </article>
  );
}

export function TransformerLab({
  initialConfig,
  initialPhase = "tokenize",
  autoplay = false,
  reducedMotion = "system",
  copy,
  className = "",
}: TransformerLabProps) {
  const systemReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const compactLayout = useMediaQuery("(max-width: 760px)");
  const motionIsReduced = reducedMotion === "always" || (reducedMotion === "system" && systemReducedMotion);
  const [config, setConfig] = useState(() => normalizeTransformerLabConfig(initialConfig));
  const [selectedCheckpointIndex, setSelectedCheckpointIndex] = useState(10);
  const [state, dispatch] = useReducer(
    transformerLabReducer,
    undefined,
    () => createTransformerLabState(initialPhase, autoplay && !motionIsReduced),
  );
  const descriptionId = useId();
  const mergedCopy = { ...defaultCopy, ...copy };
  const phase = transformerLabPhaseDefinitions[state.phaseIndex] ?? transformerLabPhaseDefinitions[0];
  const bpe = useMemo(() => tokenizeWithIllustrativeBpe(config.prompt), [config.prompt]);
  const architecture = useMemo(() => deriveTransformerArchitecture(config), [config]);
  const trace = useMemo(() => createDeterministicTrainingTrace(config), [config]);
  const decoding = useMemo(() => createDecodingResult(config), [config]);

  useEffect(() => {
    if (motionIsReduced) {
      dispatch({ type: "stop" });
      return;
    }
    if (!state.isPlaying) return;
    const timer = window.setInterval(() => dispatch({ type: "tick" }), 1_700);
    return () => window.clearInterval(timer);
  }, [motionIsReduced, state.isPlaying]);

  const updateNumber = (key: NumericConfigKey, value: number) => {
    setConfig((current) => normalizeTransformerLabConfig({ ...current, [key]: value }));
    dispatch({ type: "stop" });
  };

  const updatePrompt = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setConfig((current) => ({ ...current, prompt: event.currentTarget.value.slice(0, 120) }));
    dispatch({ type: "stop" });
  };

  const applyPreset = (preset: (typeof transformerLabPresets)[number]) => {
    setConfig((current) => normalizeTransformerLabConfig({ ...current, ...preset.config }));
    dispatch({ type: "reset" });
    setSelectedCheckpointIndex(10);
  };

  const handleKeyboard = (event: KeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "ArrowRight") dispatch({ type: "next" });
    else if (event.key === "ArrowLeft") dispatch({ type: "previous" });
    else if (event.key === "Home") dispatch({ type: "select-phase", phaseIndex: 0 });
    else if (event.key === "End") dispatch({ type: "select-phase", phaseIndex: transformerLabPhases.length - 1 });
    else if (event.key === " ") dispatch({ type: "toggle-play" });
    else return;
    event.preventDefault();
  };

  return (
    <section
      className={`nnv-lab ${className}`}
      aria-label="Interactive deterministic transformer lab"
      aria-describedby={descriptionId}
      data-phase={phase.id}
      data-layout={compactLayout ? "compact" : "wide"}
      data-motion={motionIsReduced ? "reduced" : "full"}
      tabIndex={0}
      onKeyDown={handleKeyboard}
    >
      <header className="nnv-lab-header">
        <div>
          <p className="nnv-lab-eyebrow">{mergedCopy.eyebrow}</p>
          <h2>{mergedCopy.title}</h2>
          <p id={descriptionId}>{mergedCopy.summary}</p>
        </div>
        <div className="nnv-lab-status"><span><i aria-hidden="true" /> Local / deterministic</span><strong>{phase.trainingOnly ? "Training comparison" : "Forward + decoding"}</strong></div>
      </header>

      <div className="nnv-lab-shell">
        <aside className="nnv-lab-config" aria-label="Transformer lab controls">
          <div className="nnv-lab-config__heading"><span>Configuration</span><strong>Micro GPT / lesson scale</strong></div>
          <label className="nnv-lab-prompt">
            <span>Prompt <small>{config.prompt.length} / 120</small></span>
            <textarea aria-label="Prompt" value={config.prompt} maxLength={120} rows={3} onChange={updatePrompt} />
          </label>
          <div className="nnv-lab-presets" aria-label="Configuration presets">
            {transformerLabPresets.map((preset) => <button type="button" key={preset.id} onClick={() => applyPreset(preset)}>{preset.label}</button>)}
          </div>
          <RangeControl configKey="epochs" label="Epochs" value={config.epochs} onChange={updateNumber} />
          <RangeControl configKey="numLayers" label="Decoder layers" value={config.numLayers} onChange={updateNumber} />
          <RangeControl configKey="temperature" label="Temperature" value={config.temperature} displayValue={config.temperature.toFixed(1)} onChange={updateNumber} />
          <RangeControl configKey="topP" label="Top-p nucleus" value={config.topP} displayValue={config.topP.toFixed(2)} onChange={updateNumber} />
          <RangeControl configKey="maxTokens" label="Maximum tokens" value={config.maxTokens} onChange={updateNumber} />
          <p className="nnv-lab-config__note"><span aria-hidden="true">◇</span> Controls recompute stable educational data. There is no server, model API, random seed drift, or persisted training state.</p>
        </aside>

        <div className="nnv-lab-main">
          <div className="nnv-lab-phase-copy" aria-live="polite" aria-atomic="true">
            <div><span>{String(state.phaseIndex + 1).padStart(2, "0")}</span>{phase.trainingOnly ? <strong>Training only</strong> : <strong>Forward path</strong>}</div>
            <div><h3>{phase.title}</h3><p>{phase.description}</p></div>
          </div>

          <ol className="nnv-lab-phase-nav" aria-label="Transformer lab phases">
            {transformerLabPhaseDefinitions.map((item, index) => (
              <li className={index < state.phaseIndex ? "is-complete" : index === state.phaseIndex ? "is-active" : ""} key={item.id}>
                <button type="button" aria-label={`Go to lab phase ${index + 1}: ${item.title}`} aria-current={index === state.phaseIndex ? "step" : undefined} onClick={() => dispatch({ type: "select-phase", phaseIndex: index })}>
                  <span>{String(index + 1).padStart(2, "0")}</span><strong>{item.shortLabel}</strong>{item.trainingOnly ? <i>T</i> : null}
                </button>
              </li>
            ))}
          </ol>

          <div className="nnv-lab-grid">
            <TokenizerPanel bpe={bpe} active={phase.id === "tokenize"} />
            <ArchitecturePanel architecture={architecture} active={phase.id === "initialize"} forwardActive={phase.id === "forward"} />
            <TrainingPanel trace={trace} activePhase={phase.id} selectedIndex={selectedCheckpointIndex} onSelect={setSelectedCheckpointIndex} />
            <SamplerPanel decoding={decoding} trace={trace} config={config} active={phase.id === "sample"} />
          </div>
        </div>
      </div>

      <div className="nnv-lab-transport">
        <div aria-label="Lab playback controls">
          <button type="button" aria-label="Previous lab phase" disabled={state.phaseIndex === 0} onClick={() => dispatch({ type: "previous" })}><LabIcon name="previous" /></button>
          <button type="button" className="nnv-lab-play" aria-label={state.isPlaying ? "Pause lab animation" : "Play lab animation"} aria-pressed={state.isPlaying} onClick={() => dispatch({ type: "toggle-play" })}><LabIcon name={state.isPlaying ? "pause" : "play"} /><span>{state.isPlaying ? "Pause lesson" : "Play lesson"}</span></button>
          <button type="button" aria-label="Next lab phase" disabled={state.phaseIndex === transformerLabPhases.length - 1} onClick={() => dispatch({ type: "next" })}><LabIcon name="next" /></button>
          <button type="button" aria-label="Reset transformer lab" onClick={() => dispatch({ type: "reset" })}><LabIcon name="reset" /></button>
        </div>
        <p>← / → step · space play · all values deterministic</p>
      </div>
      <footer className="nnv-lab-disclaimer"><span aria-hidden="true">◇</span>{mergedCopy.disclaimer}</footer>
    </section>
  );
}
