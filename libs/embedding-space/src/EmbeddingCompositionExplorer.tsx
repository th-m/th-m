import { Component, Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  COMPOSITION_TERM_GROUPS,
  availableCompositionTerms,
  replaceableCompositionTerms,
  resolveTermComposition,
  type CompositionTerm,
} from "./compositionModel";

const LazyEmbeddingCompositionScene3D = lazy(() =>
  import("./EmbeddingCompositionScene3D").then((module) => ({
    default: module.EmbeddingCompositionScene3D,
  })),
);

const DEFAULT_TERMS: readonly CompositionTerm[] = ["man", "royal"];

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
  const [terms, setTerms] = useState<CompositionTerm[]>([...DEFAULT_TERMS]);
  const [sceneRequested, setSceneRequested] = useState(false);
  const [webglMessage, setWebglMessage] = useState<string | null>(null);
  const composition = useMemo(() => resolveTermComposition(terms), [terms]);
  const availableTerms = useMemo(() => availableCompositionTerms(terms), [terms]);
  const availableTermGroups = useMemo(() => COMPOSITION_TERM_GROUPS.map((group) => {
    const groupTerms = group.terms as readonly CompositionTerm[];
    return {
      ...group,
      availableTerms: groupTerms.filter((term) => availableTerms.includes(term)),
      selectedTerms: terms.flatMap((term, index) => groupTerms.includes(term) ? [{ index, term }] : []),
    };
  }), [availableTerms, terms]);
  const displayResult = composition.result;

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

  const removeTerm = (index: number) => setTerms((current) => current.filter((_, termIndex) => termIndex !== index));
  const replaceTerm = (index: number, term: CompositionTerm) => setTerms((current) =>
    current.map((currentTerm, termIndex) => termIndex === index ? term : currentTerm),
  );
  const undo = () => setTerms((current) => current.slice(0, -1));
  const reset = () => setTerms(["man"]);
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
          {terms.map((term, index) => (
            <span key={`${term}-${index}`} className="embedding-composition__equation-term">
              {index > 0 ? <i aria-hidden="true">+</i> : null}
              <button type="button" aria-label={`Remove ${term} term`} onClick={() => removeTerm(index)}>
                {term}
              </button>
            </span>
          ))}
          {terms.length > 0 ? <i>=</i> : null}
          {terms.length > 0 ? <strong>{displayResult ?? "—"}</strong> : null}
        </output>
      </div>

      <div className="embedding-composition__directions">
        <div>
          <span>Add a compatible term</span>
          <div className="embedding-composition__term-groups" role="group" aria-label="Available composition terms by type">
            {availableTermGroups.map((group) => (
              <div key={group.id} className="embedding-composition__term-group">
                <span>{group.label}</span>
                <div>
                  {group.selectedTerms.map(({ index, term }, slotIndex) => (
                    <select
                      key={`${term}-${index}`}
                      aria-label={`${group.label} term ${slotIndex + 1}`}
                      value={term}
                      onChange={(event) => {
                        const nextTerm = event.currentTarget.value as CompositionTerm;
                        if (nextTerm) replaceTerm(index, nextTerm);
                        else removeTerm(index);
                      }}
                    >
                      <option value="">Remove {term}</option>
                      {replaceableCompositionTerms(terms, index).map((candidate) => (
                        <option key={candidate} value={candidate}>{candidate}</option>
                      ))}
                    </select>
                  ))}
                  {group.availableTerms.length > 0 || group.selectedTerms.length === 0 ? (
                    <select
                      aria-label={`Add ${group.label} term`}
                      value=""
                      disabled={group.availableTerms.length === 0}
                      onChange={(event) => {
                        const term = event.currentTarget.value as CompositionTerm;
                        if (term) setTerms((current) => [...current, term]);
                      }}
                    >
                      <option value="">
                        {group.availableTerms.length > 0 ? `Add ${group.label.toLowerCase()}` : `No compatible ${group.label.toLowerCase()}`}
                      </option>
                      {group.availableTerms.map((term) => <option key={term} value={term}>{term}</option>)}
                    </select>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          {availableTerms.length === 0 ? (
            <span className="embedding-composition__complete">Remove a pill to explore another valid combination.</span>
          ) : null}
        </div>
        <div className="embedding-composition__history" role="group" aria-label="Composition history controls">
          <button type="button" disabled={terms.length === 0} onClick={undo}>Undo</button>
          <button type="button" disabled={terms.length === 1 && terms[0] === "man"} onClick={reset}>Reset</button>
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
              result={displayResult}
              recipe={composition.recipe}
              onUnavailable={handleWebglFailure}
            />
          </Suspense>
        </SceneErrorBoundary>
      )}
    </figure>
  );
}
