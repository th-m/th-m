import {
  useEffect,
  useId,
  useReducer,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  generationExamples,
  generationStageIndex,
  generationStages,
  type CandidateToken,
  type GenerationExample,
  type GeneratedStep,
  type GenerationStage,
  type GenerationStageId,
} from "./model";
import {
  activeExample,
  createGenerationState,
  defaultGenerationSpeedMs,
  generationReducer,
  isAtEnd,
  type GenerationState,
} from "./state";

export interface GenerationPlaybackCopy {
  eyebrow: string;
  title: string;
  summary: string;
  disclaimer: string;
}

export interface GenerationPlaybackProps {
  initialExampleId?: string;
  autoplay?: boolean;
  reducedMotion?: "system" | "always" | "never";
  copy?: Partial<GenerationPlaybackCopy>;
  className?: string;
}

const defaultCopy: GenerationPlaybackCopy = {
  eyebrow: "Decoder-only model · token-by-token",
  title: "Watch an LLM generate",
  summary:
    "Pick an example, press play, and follow every step of inference as the model predicts one token after another — attention, feed-forward, logits, and the decoding choice.",
  disclaimer:
    "Simplified explanatory model · deterministic illustrative values · not a live model trace · decoding shown greedy",
};

const speedOptions = [
  { label: "0.5×", speedMs: 2_000 },
  { label: "1×", speedMs: defaultGenerationSpeedMs },
  { label: "2×", speedMs: 500 },
  { label: "4×", speedMs: 250 },
];

function mediaMatches(query: string): boolean {
  return typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia(query).matches
    : false;
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => mediaMatches(query));
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return matches;
}

function displayToken(token: string): string {
  return token === "\n" ? "⏎" : token === "" ? "·" : token;
}

function ControlIcon({ name }: { name: "back" | "play" | "pause" | "forward" | "next-token" | "end" | "reset" }) {
  const paths: Record<typeof name, ReactNode> = {
    back: <><path d="M18 6 10 12l8 6" /><path d="M6 5v14" /></>,
    play: <path d="m8 5 11 7-11 7Z" />,
    pause: <><path d="M9 5v14" /><path d="M15 5v14" /></>,
    forward: <><path d="m6 6 8 6-8 6" /><path d="M18 5v14" /></>,
    "next-token": <><path d="M6 6l8 6-8 6" /><path d="m14 6 8 6-8 6" /></>,
    end: <><path d="M5 6l8 6-8 6" /><path d="M19 5v14" /></>,
    reset: <><path d="M5 8V4m0 0h4" /><path d="M5.8 5.7A8 8 0 1 1 4 14" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function ContextStrip({
  example,
  state,
  includeCurrent = false,
  highlightCurrent = false,
  placeholder = false,
}: {
  example: GenerationExample;
  state: GenerationState;
  includeCurrent?: boolean;
  highlightCurrent?: boolean;
  placeholder?: boolean;
}) {
  const completed = example.steps.slice(0, state.tokenIndex);
  const current = example.steps[state.tokenIndex];
  return (
    <div className="gen-strip" role="group" aria-label="Growing generation context">
      {example.promptTokens.map((token, index) => (
        <span className="gen-token gen-token--prompt" key={`p-${index}`}>
          <small>p{index}</small>{displayToken(token)}
        </span>
      ))}
      {completed.map((step, index) => (
        <span className="gen-token gen-token--done" key={`g-${index}`}>
          <small>g{index + 1}</small>{displayToken(step.token)}
        </span>
      ))}
      {includeCurrent && current ? (
        <span className={`gen-token gen-token--current ${highlightCurrent ? "is-highlight" : ""}`}>
          <small>g{state.tokenIndex + 1}</small>{displayToken(current.token)}
        </span>
      ) : null}
      {placeholder && !includeCurrent ? (
        <span className="gen-token gen-token--next"><small>…</small>next</span>
      ) : null}
    </div>
  );
}

function AttentionStrip({ example, state, step }: {
  example: GenerationExample;
  state: GenerationState;
  step: GeneratedStep;
}) {
  const context = [...example.promptTokens, ...example.steps.slice(0, state.tokenIndex).map((s) => s.token)];
  return (
    <div className="gen-attention" role="group" aria-label="Final position attention weights over the context">
      <p className="gen-panel-label">Final position → context · attention weights</p>
      <div className="gen-attention__row">
        {context.map((token, index) => {
          const weight = step.attentionWeights[index] ?? 0;
          return (
            <div className="gen-attention__cell" key={index}>
              <span
                className="gen-attention__bar"
                style={{ "--gen-value": weight } as CSSProperties}
                aria-label={`Weight ${weight.toFixed(2)} on ${displayToken(token)}`}
              />
              <small>{displayToken(token)}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CandidateBars({
  candidates,
  mode,
  selectedToken,
}: {
  candidates: readonly CandidateToken[];
  mode: "logit" | "probability";
  selectedToken: string;
}) {
  return (
    <div className="gen-candidates" role="group" aria-label={`Next-token ${mode === "logit" ? "logits" : "probabilities"}`}>
      {candidates.map((candidate) => {
        const value = mode === "logit" ? candidate.logit : candidate.probability;
        const isSelected = candidate.token === selectedToken;
        const display = mode === "logit" ? value.toFixed(2) : `${Math.round(value * 100)}%`;
        return (
          <div className={`gen-candidate ${isSelected ? "is-selected" : ""}`} key={candidate.token}>
            <span className="gen-candidate__token">{displayToken(candidate.token)}</span>
            <span className="gen-candidate__track">
              <span
                style={{
                  "--gen-value": mode === "logit" ? Math.max(0, Math.min(1, (value + 1) / 5)) : value,
                } as CSSProperties}
              />
            </span>
            <span className="gen-candidate__value">{display}</span>
          </div>
        );
      })}
    </div>
  );
}

function FeedForwardScene() {
  return (
    <div className="gen-ff" role="group" aria-label="Feed-forward network transform">
      <div className="gen-ff__box"><strong>Expand</strong><small>Wup · x → 8 features</small></div>
      <span className="gen-ff__arrow" aria-hidden="true">→</span>
      <div className="gen-ff__box"><strong>GELU</strong><small>gate wide features</small></div>
      <span className="gen-ff__arrow" aria-hidden="true">→</span>
      <div className="gen-ff__box"><strong>Compress</strong><small>Wdown · features → dmodel</small></div>
      <span className="gen-ff__arrow" aria-hidden="true">→</span>
      <div className="gen-ff__box gen-ff__box--join"><strong>Residual</strong><small>Δx rejoins the stream</small></div>
    </div>
  );
}

function Scene({
  stageId,
  example,
  state,
  step,
}: {
  stageId: GenerationStageId;
  example: GenerationExample;
  state: GenerationState;
  step: GeneratedStep;
}) {
  const decodeIndex = generationStageIndex("decode");
  const appendIndex = generationStageIndex("append");
  const currentVisible = state.stageIndex >= decodeIndex;
  switch (stageId) {
    case "tokens":
      return <ContextStrip example={example} state={state} placeholder />;
    case "attention":
      return <AttentionStrip example={example} state={state} step={step} />;
    case "feed-forward":
      return <FeedForwardScene />;
    case "logits":
      return <CandidateBars candidates={step.candidates} mode="logit" selectedToken={step.token} />;
    case "decode":
      return <CandidateBars candidates={step.candidates} mode="probability" selectedToken={step.token} />;
    case "append":
      return <ContextStrip example={example} state={state} includeCurrent highlightCurrent={state.stageIndex >= appendIndex} />;
    default:
      return <ContextStrip example={example} state={state} placeholder />;
  }
}

export function GenerationPlayback({
  initialExampleId,
  autoplay = false,
  reducedMotion = "system",
  copy,
  className = "",
}: GenerationPlaybackProps) {
  const systemReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const compact = useMediaQuery("(max-width: 560px)");
  const motionIsReduced = reducedMotion === "always" || (reducedMotion === "system" && systemReducedMotion);
  const initialIndex = Math.max(
    0,
    generationExamples.findIndex((example) => example.id === initialExampleId),
  );
  const [state, dispatch] = useReducer(
    generationReducer,
    undefined,
    () => createGenerationState(initialIndex, autoplay && !motionIsReduced),
  );
  const descriptionId = useId();
  const helpRef = useRef<HTMLDetailsElement>(null);
  const mergedCopy = { ...defaultCopy, ...copy };

  const example = activeExample(state);
  const step = example.steps[state.tokenIndex] ?? example.steps[0];
  const stage = generationStages[state.stageIndex] ?? generationStages[0];
  const decodeIndex = generationStageIndex("decode");
  const currentVisible = state.stageIndex >= decodeIndex;
  const atEnd = isAtEnd(state);

  useEffect(() => {
    if (motionIsReduced) {
      if (state.isPlaying) dispatch({ type: "pause" });
      return;
    }
    if (!state.isPlaying) return;
    const timer = window.setInterval(() => dispatch({ type: "tick" }), state.speedMs);
    return () => window.clearInterval(timer);
  }, [motionIsReduced, state.isPlaying, state.speedMs]);

  const handleKeyboard = (event: KeyboardEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target !== event.currentTarget) return;
    const key = event.key;
    if (key === " ") dispatch({ type: "toggle-play" });
    else if (key === "ArrowRight") dispatch({ type: "step-forward" });
    else if (key === "ArrowLeft") dispatch({ type: "step-back" });
    else if (key === "n" || key === "N") dispatch({ type: "next-token" });
    else if (key === "g" || key === "G") dispatch({ type: "skip-to-end" });
    else if (key === "r" || key === "R") dispatch({ type: "reset" });
    else if (key === "h" || key === "H") {
      if (helpRef.current) helpRef.current.open = !helpRef.current.open;
    } else return;
    event.preventDefault();
  };

  return (
    <section
      className={`gen ${className}`}
      aria-label="Interactive token-by-token LLM generation"
      aria-describedby={descriptionId}
      data-layout={compact ? "compact" : "wide"}
      data-motion={motionIsReduced ? "reduced" : "full"}
      data-stage={stage.id}
      tabIndex={0}
      onKeyDown={handleKeyboard}
    >
      <header className="gen-header">
        <div className="gen-header__copy">
          <p className="gen-eyebrow">{mergedCopy.eyebrow}</p>
          <h3>{mergedCopy.title}</h3>
          <p id={descriptionId}>{mergedCopy.summary}</p>
        </div>
        <div className="gen-status" aria-label="Playback status">
          <span><i aria-hidden="true" /> Inference</span>
          <strong>
            Token {String(state.tokenIndex + 1).padStart(2, "0")} / {String(example.steps.length).padStart(2, "0")} · stage{" "}
            {String(state.stageIndex + 1).padStart(2, "0")} / {String(generationStages.length).padStart(2, "0")}
          </strong>
        </div>
      </header>

      <div className="gen-examples" role="group" aria-label="Generation example">
        {generationExamples.map((item, index) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={state.exampleIndex === index}
            onClick={() => dispatch({ type: "select-example", exampleIndex: index })}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="gen-output" aria-live="polite" aria-atomic="false">
        <span className="gen-panel-label">Generated text</span>
        <p className="gen-output__text">
          <span className="gen-output__prompt">{example.prompt}</span>
          {example.steps.slice(0, state.tokenIndex).map((s, index) => (
            <span className="gen-output__done" key={index}>{s.token}</span>
          ))}
          {currentVisible ? <span className="gen-output__current">{step.token}</span> : null}
          {!currentVisible && state.tokenIndex < example.steps.length ? <span className="gen-output__cursor" aria-hidden="true">▍</span> : null}
        </p>
      </div>

      <div className="gen-canvas">
        <div className="gen-stage-copy" aria-live="polite" aria-atomic="true">
          <span className="gen-stage-copy__index">{String(state.stageIndex + 1).padStart(2, "0")}</span>
          <p className="gen-stage-copy__signal">{stage.signal}</p>
          <h4>{stage.title}</h4>
          <p>{stage.description}</p>
          <div className="gen-stage-copy__result"><span>Produces</span><strong>{stage.result}</strong></div>
        </div>
        <div className="gen-diagram">
          <div className="gen-diagram__meta">
            <span>Stage {stage.shortLabel}</span>
            <span>Deterministic illustrative trace</span>
          </div>
          <Scene stageId={stage.id} example={example} state={state} step={step} />
          {state.stageIndex >= decodeIndex ? (
            <p className="gen-step-note">{step.note}</p>
          ) : null}
        </div>
      </div>

      <div className="gen-transport">
        <div className="gen-controls" aria-label="Playback controls">
          <button type="button" aria-label="Previous stage" onClick={() => dispatch({ type: "step-back" })} disabled={state.tokenIndex === 0 && state.stageIndex === 0}>
            <ControlIcon name="back" />
          </button>
          <button
            type="button"
            className="gen-play"
            aria-label={state.isPlaying ? "Pause animation" : "Play animation"}
            aria-pressed={state.isPlaying}
            onClick={() => dispatch({ type: "toggle-play" })}
          >
            <ControlIcon name={state.isPlaying ? "pause" : "play"} />
            <span>{atEnd ? "Replay" : state.isPlaying ? "Pause" : "Play"}</span>
          </button>
          <button type="button" aria-label="Next stage" onClick={() => dispatch({ type: "step-forward" })} disabled={atEnd}>
            <ControlIcon name="forward" />
          </button>
          <button type="button" aria-label="Next token" onClick={() => dispatch({ type: "next-token" })} disabled={state.tokenIndex >= example.steps.length - 1}>
            <ControlIcon name="next-token" />
          </button>
          <button type="button" aria-label="Skip to end of generation" onClick={() => dispatch({ type: "skip-to-end" })} disabled={atEnd}>
            <ControlIcon name="end" />
          </button>
          <button type="button" aria-label="Reset generation" onClick={() => dispatch({ type: "reset" })}>
            <ControlIcon name="reset" />
          </button>
        </div>
        <label className="gen-speed">
          <span>Speed</span>
          <select
            value={state.speedMs}
            aria-label="Animation speed"
            onChange={(event) => dispatch({ type: "set-speed", speedMs: Number(event.target.value) })}
          >
            {speedOptions.map((option) => (
              <option key={option.label} value={option.speedMs}>{option.label}</option>
            ))}
          </select>
        </label>
      </div>

      <details className="gen-help" ref={helpRef}>
        <summary>Keyboard shortcuts</summary>
        <ul>
          <li><kbd>Space</kbd> play / pause</li>
          <li><kbd>←</kbd> / <kbd>→</kbd> step back / forward</li>
          <li><kbd>N</kbd> next token</li>
          <li><kbd>G</kbd> skip to end of generation</li>
          <li><kbd>R</kbd> reset</li>
          <li><kbd>H</kbd> toggle this help</li>
        </ul>
      </details>

      <footer className="gen-disclaimer"><span aria-hidden="true">◇</span>{mergedCopy.disclaimer}</footer>
    </section>
  );
}
