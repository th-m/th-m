import {
  useEffect,
  useId,
  useMemo,
  useReducer,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import {
  baseLogits,
  decodingLimits,
  decodingStrategies,
  decodingStrategyInfos,
  type DecodingStrategy,
} from "./model";
import { applyDecoding, type DecodingResult } from "./decoding";
import { createDecodingState, decodingReducer } from "./state";

export interface DecodingExplorerCopy {
  eyebrow: string;
  title: string;
  summary: string;
  disclaimer: string;
}

export interface DecodingExplorerProps {
  initialStrategy?: DecodingStrategy;
  copy?: Partial<DecodingExplorerCopy>;
  className?: string;
}

const defaultCopy: DecodingExplorerCopy = {
  eyebrow: "Decoder-only model · next-token choice",
  title: "Decoding strategies",
  summary:
    "The same logits can produce different next tokens depending on the decoding rule. Compare greedy, temperature, top-k, and top-p on one fixed distribution.",
  disclaimer:
    "Deterministic illustrative values · sampling draws are seeded, not random · same base logits for every strategy",
};

function useMediaQuery(query: string): boolean {
  const matches = typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia(query).matches
    : false;
  const [value, setValue] = useState(matches);
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const media = window.matchMedia(query);
    const update = () => setValue(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return value;
}

function displayToken(token: string): string {
  return token === "" ? "·" : token;
}

function StrategyTabs({
  strategy,
  onSelect,
}: {
  strategy: DecodingStrategy;
  onSelect: (strategy: DecodingStrategy) => void;
}) {
  return (
    <div className="dec-strategies" role="group" aria-label="Decoding strategy">
      {decodingStrategies.map((item) => (
        <button
          type="button"
          key={item}
          aria-pressed={strategy === item}
          onClick={() => onSelect(item)}
        >
          {decodingStrategyInfos[item].label}
        </button>
      ))}
    </div>
  );
}

function ParameterControls({
  strategy,
  temperature,
  topK,
  topP,
  dispatch,
}: {
  strategy: DecodingStrategy;
  temperature: number;
  topK: number;
  topP: number;
  dispatch: (action: Parameters<typeof decodingReducer>[1]) => void;
}) {
  return (
    <div className="dec-params">
      {strategy === "temperature" ? (
        <label className="dec-param">
          <span>Temperature <strong>{temperature.toFixed(1)}</strong></span>
          <input
            type="range"
            min={decodingLimits.temperature.min}
            max={decodingLimits.temperature.max}
            step={decodingLimits.temperature.step}
            value={temperature}
            aria-label="Temperature"
            onChange={(event) => dispatch({ type: "set-temperature", temperature: Number(event.target.value) })}
          />
        </label>
      ) : null}
      {strategy === "top-k" ? (
        <label className="dec-param">
          <span>Top-k <strong>{topK}</strong></span>
          <input
            type="range"
            min={decodingLimits.topK.min}
            max={decodingLimits.topK.max}
            step={decodingLimits.topK.step}
            value={topK}
            aria-label="Top-k count"
            onChange={(event) => dispatch({ type: "set-topK", topK: Number(event.target.value) })}
          />
        </label>
      ) : null}
      {strategy === "top-p" ? (
        <label className="dec-param">
          <span>Top-p <strong>{topP.toFixed(2)}</strong></span>
          <input
            type="range"
            min={decodingLimits.topP.min}
            max={decodingLimits.topP.max}
            step={decodingLimits.topP.step}
            value={topP}
            aria-label="Top-p nucleus size"
            onChange={(event) => dispatch({ type: "set-topP", topP: Number(event.target.value) })}
          />
        </label>
      ) : null}
    </div>
  );
}

function DistributionRows({
  result,
  mode,
}: {
  result: DecodingResult;
  mode: "logit" | "probability";
}) {
  const values = mode === "logit"
    ? baseLogits.map((candidate) => candidate.logit)
    : result.probabilities;
  return (
    <div className="dec-dist" role="group" aria-label={mode === "logit" ? "Base logits" : "Resulting distribution"}>
      {baseLogits.map((candidate, index) => {
        const value = values[index];
        const isSelected = result.selectedIndex === index;
        const isLikely = result.mostLikelyIndex === index;
        const allowed = result.allowed[index];
        const display = mode === "logit"
          ? value.toFixed(2)
          : `${Math.round(value * 100)}%`;
        return (
          <div
            className={[
              "dec-row",
              isSelected ? "is-selected" : "",
              isLikely ? "is-likely" : "",
              !allowed ? "is-masked" : "",
            ].join(" ")}
            key={candidate.token}
          >
            <span className="dec-row__token">{displayToken(candidate.token)}</span>
            <span className="dec-row__track">
              <span
                style={{
                  "--dec-value": mode === "logit"
                    ? Math.max(0, Math.min(1, (value + 3) / 7))
                    : value,
                } as CSSProperties}
              />
            </span>
            <span className="dec-row__value">{display}</span>
            {mode === "probability" && isLikely ? <small className="dec-row__tag">likely</small> : null}
            {mode === "probability" && isSelected ? <small className="dec-row__tag dec-row__tag--selected">selected</small> : null}
            {mode === "probability" && !allowed ? <small className="dec-row__tag">masked</small> : null}
          </div>
        );
      })}
    </div>
  );
}

export function DecodingExplorer({
  initialStrategy = "greedy",
  copy,
  className = "",
}: DecodingExplorerProps) {
  const compact = useMediaQuery("(max-width: 560px)");
  const [state, dispatch] = useReducer(decodingReducer, undefined, () =>
    createDecodingState(initialStrategy),
  );
  const descriptionId = useId();
  const mergedCopy = { ...defaultCopy, ...copy };
  const info = decodingStrategyInfos[state.strategy];

  const result = useMemo(
    () => applyDecoding(state.strategy, {
      temperature: state.temperature,
      topK: state.topK,
      topP: state.topP,
      draw: state.draw,
    }),
    [state.strategy, state.temperature, state.topK, state.topP, state.draw],
  );

  const handleKeyboard = (event: KeyboardEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target !== event.currentTarget) return;
    if (event.key === "r" || event.key === "R") {
      dispatch({ type: "reset" });
      event.preventDefault();
    } else if (event.key === "d" || event.key === "D") {
      dispatch({ type: "next-draw" });
      event.preventDefault();
    } else if (event.key === "1") dispatch({ type: "select-strategy", strategy: "greedy" });
    else if (event.key === "2") dispatch({ type: "select-strategy", strategy: "temperature" });
    else if (event.key === "3") dispatch({ type: "select-strategy", strategy: "top-k" });
    else if (event.key === "4") dispatch({ type: "select-strategy", strategy: "top-p" });
  };

  return (
    <section
      className={`dec ${className}`}
      aria-label="Interactive decoding strategy explorer"
      aria-describedby={descriptionId}
      data-layout={compact ? "compact" : "wide"}
      tabIndex={0}
      onKeyDown={handleKeyboard}
    >
      <header className="dec-header">
        <div className="dec-header__copy">
          <p className="dec-eyebrow">{mergedCopy.eyebrow}</p>
          <h3>{mergedCopy.title}</h3>
          <p id={descriptionId}>{mergedCopy.summary}</p>
        </div>
      </header>

      <StrategyTabs strategy={state.strategy} onSelect={(strategy) => dispatch({ type: "select-strategy", strategy })} />
      <ParameterControls strategy={state.strategy} temperature={state.temperature} topK={state.topK} topP={state.topP} dispatch={dispatch} />

      <p className="dec-info">{info.description}</p>

      <div className="dec-canvas">
        <div className="dec-panel">
          <span className="dec-panel-label">Base logits · same for every strategy</span>
          <DistributionRows result={result} mode="logit" />
        </div>
        <div className="dec-panel">
          <span className="dec-panel-label">After {info.label.toLowerCase()}</span>
          <DistributionRows result={result} mode="probability" />
        </div>
      </div>

      <p className="dec-note" role="status">{result.note}</p>

      <div className="dec-transport">
        {state.strategy !== "greedy" ? (
          <button type="button" className="dec-draw" onClick={() => dispatch({ type: "next-draw" })}>
            Draw again <span aria-hidden="true">🎲</span>
          </button>
        ) : (
          <span className="dec-draw-placeholder" aria-hidden="true" />
        )}
        <span className="dec-draw-count">Sample draw {String(state.draw + 1).padStart(2, "0")}</span>
        <button type="button" className="dec-reset" onClick={() => dispatch({ type: "reset" })}>Reset</button>
      </div>

      <footer className="dec-disclaimer"><span aria-hidden="true">◇</span>{mergedCopy.disclaimer}</footer>
    </section>
  );
}
