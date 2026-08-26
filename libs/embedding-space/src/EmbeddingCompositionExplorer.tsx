import { Component, Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  COMPOSITION_TERM_GROUPS,
  resolveTermComposition,
  type CompositionResultWord,
  type CompositionTerm,
} from "./compositionModel";

const LazyEmbeddingCompositionScene3D = lazy(() =>
  import("./EmbeddingCompositionScene3D").then((module) => ({
    default: module.EmbeddingCompositionScene3D,
  })),
);

type CompositionSlot = CompositionTerm | null;
type CompositionSlots = readonly [CompositionSlot, CompositionSlot, CompositionSlot, CompositionSlot];

const DEFAULT_SLOTS: CompositionSlots = ["man", "royal", null, null];

class SceneErrorBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function EmbeddingCompositionExplorer() {
  const figureRef = useRef<HTMLElement | null>(null);
  const [slots, setSlots] = useState<CompositionSlots>(DEFAULT_SLOTS);
  const [history, setHistory] = useState<CompositionSlots[]>([]);
  const [sceneRequested, setSceneRequested] = useState(false);
  const [webglMessage, setWebglMessage] = useState<string | null>(null);
  const [projectedResult, setProjectedResult] = useState<CompositionResultWord | CompositionTerm | null>(null);
  const terms = useMemo(() => slots.filter((term): term is CompositionTerm => term !== null), [slots]);
  const composition = useMemo(() => resolveTermComposition(terms), [terms]);
  const displayResult = composition.result ?? projectedResult ?? (terms.length > 1 ? "projected point" : null);
  const isApproximate = !composition.result && terms.length > 1;

  useEffect(() => {
    if (!sceneRequested || composition.result || terms.length < 2) return;
    void import("./semanticNetwork3d").then(({ projectComposition3d }) => {
      setProjectedResult(projectComposition3d(terms, composition).result);
    });
  }, [composition, sceneRequested, terms]);

  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;
    if (typeof IntersectionObserver === "undefined") {
      setSceneRequested(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setSceneRequested(true);
      observer.disconnect();
    }, { rootMargin: "0px", threshold: 0.01 });
    observer.observe(figure);
    return () => observer.disconnect();
  }, []);

  const commitSlots = (next: CompositionSlots) => {
    if (next.every((term, index) => term === slots[index])) return;
    setProjectedResult(null);
    setHistory((current) => [...current, slots]);
    setSlots(next);
  };
  const replaceTerm = (index: number, term: CompositionSlot) => {
    const next = [...slots] as unknown as [CompositionSlot, CompositionSlot, CompositionSlot, CompositionSlot];
    next[index] = term;
    commitSlots(next);
  };
  const removeTerm = (index: number) => replaceTerm(index, null);
  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setSlots(previous);
    setHistory((current) => current.slice(0, -1));
  };
  const reset = () => commitSlots(DEFAULT_SLOTS);
  const handleWebglFailure = useCallback(() => {
    setWebglMessage("The 3D semantic network is unavailable in this browser. The composition controls remain active.");
  }, []);

  return (
    <figure ref={figureRef} className="embedding-composition" aria-label="Interactive three-dimensional semantic composition teaching model">
      <div className="embedding-composition__header">
        <div>
          <p>Semantic composition</p>
          <h3>Move through a word space</h3>
        </div>
        <span className="embedding-composition__mode">3D semantic network</span>
      </div>

      <div className="embedding-composition__controls">
        <output className="embedding-composition__equation" aria-label="Combined embedding result" aria-live="polite">
          {terms.length === 0 ? <span className="embedding-composition__empty">Choose a starting term</span> : null}
          {slots.flatMap((term, slotIndex) => term ? [{ term, slotIndex }] : []).map(({ term, slotIndex }, index) => (
            <span key={`${term}-${slotIndex}`} className="embedding-composition__equation-term">
              {index > 0 ? <i aria-hidden="true">+</i> : null}
              <button type="button" aria-label={`Remove ${term} term`} onClick={() => removeTerm(slotIndex)}>
                {term}
              </button>
            </span>
          ))}
          {terms.length > 0 ? (
            <i aria-label={isApproximate ? "approximately" : "equals"}>{isApproximate ? "≈" : "="}</i>
          ) : null}
          {terms.length > 0 ? <strong>{displayResult ?? "—"}</strong> : null}
        </output>
      </div>

      <div className="embedding-composition__directions">
        <div>
          <span>Compose up to four terms</span>
          <div className="embedding-composition__term-groups" role="group" aria-label="Composition term slots">
            {slots.map((term, index) => (
              <label key={index} className="embedding-composition__term-group">
                <span>Term {index + 1}</span>
                <select
                  aria-label={`Composition term ${index + 1}`}
                  value={term ?? ""}
                  onChange={(event) => replaceTerm(index, event.currentTarget.value
                    ? event.currentTarget.value as CompositionTerm
                    : null)}
                >
                  <option value="">Empty slot</option>
                  {COMPOSITION_TERM_GROUPS.map((group) => (
                    <optgroup key={group.id} label={group.label}>
                      {group.terms.map((candidate) => (
                        <option key={candidate} value={candidate}>{candidate}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>
        <div className="embedding-composition__history" role="group" aria-label="Composition history controls">
          <button type="button" disabled={history.length === 0} onClick={undo}>Undo</button>
          <button type="button" disabled={slots.every((term, index) => term === DEFAULT_SLOTS[index])} onClick={reset}>Reset</button>
        </div>
      </div>

      {!sceneRequested ? (
        <div className="embedding-composition__loading" role="status">
          The 3D semantic network loads when this explorer enters the viewport.
        </div>
      ) : webglMessage ? (
        <div className="embedding-composition__loading" role="status">{webglMessage}</div>
      ) : (
        <SceneErrorBoundary onError={handleWebglFailure}>
          <Suspense fallback={<div className="embedding-composition__loading" role="status">Opening the 3D semantic network…</div>}>
            <LazyEmbeddingCompositionScene3D
              source={composition.recipe?.terms[0] ?? composition.semanticStart}
              path={composition.path}
              result={composition.result}
              recipe={composition.recipe}
              terms={terms}
              onUnavailable={handleWebglFailure}
            />
          </Suspense>
        </SceneErrorBoundary>
      )}
    </figure>
  );
}
