import { Component, Suspense, lazy, useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import {
  HYBRID_RECIPES,
  SEMANTIC_AXES,
  SEMANTIC_WORDS,
  availableMove,
  compose,
  type CompositionMove,
  type CompositionSceneControls,
  type HybridRecipe,
  type MythicalWord,
  type SemanticAxis,
  type SemanticWord,
} from "./compositionModel";

const LazyEmbeddingCompositionScene3D = lazy(() =>
  import("./EmbeddingCompositionScene3D").then((module) => ({
    default: module.EmbeddingCompositionScene3D,
  })),
);

type ViewMode = "2d" | "3d";
type ProjectionPoint = { x: number; y: number; words: readonly [SemanticWord, SemanticWord] };

const PROJECTION_POINTS: readonly ProjectionPoint[] = [
  { x: 170, y: 112, words: ["man", "woman"] },
  { x: 470, y: 112, words: ["king", "queen"] },
  { x: 170, y: 252, words: ["boy", "girl"] },
  { x: 470, y: 252, words: ["prince", "princess"] },
];

const DEFAULT_MOVES: readonly CompositionMove[] = [{ axis: "status", label: "royal" }];

function projectionPoint(word: SemanticWord): ProjectionPoint {
  const point = PROJECTION_POINTS.find((candidate) => candidate.words.includes(word));
  if (!point) throw new Error(`No 2D teaching point is defined for ${word}.`);
  return point;
}

function equationLabel(
  start: SemanticWord,
  moves: readonly CompositionMove[],
  result: SemanticWord | MythicalWord,
  animal?: HybridRecipe["animal"],
) {
  return [start, ...moves.flatMap((move) => ["plus", move.label]), ...(animal ? ["plus", animal] : []), "equals", result].join(" ");
}

class SceneErrorBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function Projection2D({
  start,
  moves,
  path,
  result,
  hybrid,
}: {
  start: SemanticWord;
  moves: readonly CompositionMove[];
  path: readonly SemanticWord[];
  result: SemanticWord;
  hybrid: HybridRecipe | null;
}) {
  const markerId = "embedding-composition-arrow";
  const displayResult = hybrid?.result ?? result;
  const equation = equationLabel(start, moves, displayResult, hybrid?.animal);
  const wordState = (word: SemanticWord) => {
    if (word === result) return "is-result";
    if (word === start) return "is-source";
    if (path.includes(word)) return "is-path";
    return "";
  };

  return (
    <div className="embedding-composition__plot embedding-composition__plot--2d">
      <svg viewBox="0 0 640 340" role="img" aria-label={`${equation} on an illustrative two-dimensional semantic projection`}>
        <title>{equation}</title>
        <desc>
          Status is arranged horizontally and age vertically. Masculine- and feminine-coded role words share the
          same coordinates because that distinction is collapsed by the two-dimensional projection.
        </desc>
        <defs>
          <marker id={markerId} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 8 4 L 0 8 z" />
          </marker>
        </defs>

        <g className="embedding-composition__grid" aria-hidden="true">
          <path d="M 82 50 V 294 H 584" />
          <path d="M 82 182 H 584" />
          <path d="M 320 50 V 294" />
        </g>
        <g className="embedding-composition__axes" aria-hidden="true">
          <text x="82" y="320">ordinary</text>
          <text x="584" y="320" textAnchor="end">royal</text>
          <text x="72" y="286" textAnchor="end">younger</text>
          <text x="72" y="62" textAnchor="end">adult</text>
          <text className="embedding-composition__projection-note" x="584" y="34" textAnchor="end">paired labels share an x-y coordinate</text>
        </g>

        {moves.map((move, index) => {
          const from = projectionPoint(path[index]);
          const to = projectionPoint(path[index + 1]);
          const hidden = from.x === to.x && from.y === to.y;
          if (hidden) {
            return (
              <g key={`${move.axis}-${index}`} className="embedding-composition__hidden-move" aria-hidden="true">
                <circle cx={from.x} cy={from.y} r="24" />
                <text x={from.x} y={from.y + 38} textAnchor="middle">+ {move.label} is hidden in 2D</text>
              </g>
            );
          }
          return (
            <g key={`${move.axis}-${index}`} aria-hidden="true">
              <line
                className="embedding-composition__movement"
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                markerEnd={`url(#${markerId})`}
              />
              <text
                className="embedding-composition__movement-label"
                x={(from.x + to.x) / 2}
                y={(from.y + to.y) / 2 - 10}
                textAnchor="middle"
              >
                + {move.label}
              </text>
            </g>
          );
        })}

        {hybrid ? (
          <g className="embedding-composition__hidden-move embedding-composition__hidden-move--blend" aria-hidden="true">
            <circle cx={projectionPoint(result).x} cy={projectionPoint(result).y} r="31" />
            <text x="320" y="304" textAnchor="middle">
              + {hybrid.animal} → {hybrid.result} is outside the 2D role projection
            </text>
          </g>
        ) : null}

        {PROJECTION_POINTS.map((point) => {
          const pointStates = point.words.map(wordState);
          const pointClass = pointStates.includes("is-result")
            ? "is-result"
            : pointStates.includes("is-source")
              ? "is-source"
              : pointStates.includes("is-path")
                ? "is-path"
                : "";
          return (
            <g key={point.words.join("-")} className={`embedding-composition__point ${pointClass}`} transform={`translate(${point.x} ${point.y})`}>
              <circle r={pointClass ? 7 : 4} />
              <text x="0" y="-14" textAnchor="middle">
                <tspan className={wordState(point.words[0])}>{point.words[0]}</tspan>
                <tspan className="embedding-composition__pair-divider"> / </tspan>
                <tspan className={wordState(point.words[1])}>{point.words[1]}</tspan>
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function EmbeddingCompositionExplorer() {
  const [start, setStart] = useState<SemanticWord>("man");
  const [moves, setMoves] = useState<CompositionMove[]>([...DEFAULT_MOVES]);
  const [hybrid, setHybrid] = useState<HybridRecipe | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("2d");
  const [webglMessage, setWebglMessage] = useState<string | null>(null);
  const sceneControls = useRef<CompositionSceneControls | null>(null);
  const [sceneControlsReady, setSceneControlsReady] = useState(false);
  const composition = useMemo(() => compose(start, moves), [start, moves]);
  const displayResult = hybrid?.result ?? composition.result;
  const usedAxes = new Set(moves.map((move) => move.axis));
  const availableAxes = hybrid
    ? []
    : SEMANTIC_AXES.filter((axis) => !usedAxes.has(axis) && (viewMode === "3d" || axis !== "role"));

  const changeStart = (word: SemanticWord) => {
    setStart(word);
    setMoves([]);
    setHybrid(null);
  };
  const addDirection = (axis: SemanticAxis) => {
    setHybrid(null);
    setMoves((current) => [...current, availableMove(compose(start, current).result, axis)]);
  };
  const chooseHybrid = (recipe: HybridRecipe) => {
    setStart(recipe.base);
    setMoves([]);
    setHybrid(recipe);
  };
  const undo = () => {
    if (hybrid) setHybrid(null);
    else setMoves((current) => current.slice(0, -1));
  };
  const reset = () => {
    setMoves([]);
    setHybrid(null);
  };
  const show3d = () => {
    setWebglMessage(null);
    setViewMode("3d");
  };
  const handleWebglFailure = useCallback(() => {
    setViewMode("2d");
    setWebglMessage("3D is unavailable in this browser. The same composition remains active in 2D.");
  }, []);
  const registerSceneControls = useCallback((controls: CompositionSceneControls | null) => {
    sceneControls.current = controls;
    setSceneControlsReady(Boolean(controls));
  }, []);
  const rotateScene = (horizontal: number, vertical: number) => sceneControls.current?.rotate(horizontal, vertical);

  return (
    <figure className="embedding-composition" aria-label="Interactive semantic composition teaching model">
      <div className="embedding-composition__header">
        <div>
          <p>Semantic composition</p>
          <h3>Move through a word space</h3>
        </div>
        <div className="embedding-composition__view-toggle" role="group" aria-label="Projection view">
          <button type="button" aria-pressed={viewMode === "2d"} onClick={() => setViewMode("2d")}>2D projection</button>
          <button type="button" aria-pressed={viewMode === "3d"} onClick={show3d}>3D semantic network</button>
        </div>
      </div>

      <div className="embedding-composition__controls">
        <label>
          <span>Starting term</span>
          <select aria-label="Starting embedding term" value={start} onChange={(event) => changeStart(event.currentTarget.value as SemanticWord)}>
            {SEMANTIC_WORDS.map((word) => <option key={word} value={word}>{word}</option>)}
          </select>
        </label>
        <output className="embedding-composition__equation" aria-label="Combined embedding result" aria-live="polite">
          <span>{start}</span>
          {moves.map((move, index) => (
            <span key={`${move.axis}-${index}`} className="embedding-composition__equation-move"><i>+</i> {move.label}</span>
          ))}
          {hybrid ? <span className="embedding-composition__equation-move"><i>+</i> {hybrid.animal}</span> : null}
          <i>=</i>
          <strong>{displayResult}</strong>
        </output>
      </div>

      <div className="embedding-composition__directions">
        <div>
          <span>Add a direction</span>
          <div role="group" aria-label="Available semantic directions">
            {availableAxes.map((axis) => {
              const move = availableMove(composition.result, axis);
              return (
                <button
                  key={axis}
                  type="button"
                  aria-label={`Add ${move.label} ${axis === "role" ? "role convention" : axis} direction`}
                  onClick={() => addDirection(axis)}
                >
                  + {move.label}<small>{axis === "role" ? "role convention" : axis}</small>
                </button>
              );
            })}
            {viewMode === "2d" && !hybrid && !usedAxes.has("role") ? (
              <button type="button" className="embedding-composition__reveal" onClick={show3d}>
                Reveal third direction<small>3D only</small>
              </button>
            ) : null}
          </div>
        </div>
        <div className="embedding-composition__history" role="group" aria-label="Composition history controls">
          <button type="button" disabled={moves.length === 0 && !hybrid} onClick={undo}>Undo</button>
          <button type="button" disabled={moves.length === 0 && !hybrid} onClick={reset}>Reset</button>
        </div>
      </div>

      {viewMode === "3d" ? (
        <div className="embedding-composition__blends">
          <span>Mythical blends</span>
          <div role="group" aria-label="Mythical creature compositions">
            {HYBRID_RECIPES.map((recipe) => (
              <button
                key={recipe.result}
                type="button"
                aria-label={`Compose ${recipe.base} plus ${recipe.animal} as ${recipe.result}`}
                aria-pressed={hybrid?.result === recipe.result}
                onClick={() => chooseHybrid(recipe)}
              >
                <span>{recipe.base} + {recipe.animal}</span>
                <strong>= {recipe.result}</strong>
              </button>
            ))}
          </div>
          <p>Authored blend relations connect the person and animal clusters to a mythical result.</p>
        </div>
      ) : null}

      {webglMessage ? <p className="embedding-composition__status" role="status">{webglMessage}</p> : null}

      {viewMode === "2d" ? (
        <Projection2D start={start} moves={moves} path={composition.path} result={composition.result} hybrid={hybrid} />
      ) : (
        <SceneErrorBoundary onError={handleWebglFailure}>
          <Suspense fallback={<div className="embedding-composition__loading" role="status">Opening the 3D semantic network…</div>}>
            <LazyEmbeddingCompositionScene3D
              source={start}
              path={composition.path}
              result={displayResult}
              blend={hybrid}
              onControlsReady={registerSceneControls}
              onUnavailable={handleWebglFailure}
            />
            <div className="embedding-composition__camera-controls" role="group" aria-label="3D camera controls">
              <button type="button" disabled={!sceneControlsReady} onClick={() => rotateScene(-Math.PI / 12, 0)} aria-label="Rotate 3D view left">←</button>
              <button type="button" disabled={!sceneControlsReady} onClick={() => rotateScene(Math.PI / 12, 0)} aria-label="Rotate 3D view right">→</button>
              <button type="button" disabled={!sceneControlsReady} onClick={() => rotateScene(0, -Math.PI / 14)} aria-label="Rotate 3D view up">↑</button>
              <button type="button" disabled={!sceneControlsReady} onClick={() => rotateScene(0, Math.PI / 14)} aria-label="Rotate 3D view down">↓</button>
              <button type="button" disabled={!sceneControlsReady} onClick={() => sceneControls.current?.reset()}>Reset view</button>
            </div>
            <p className="embedding-composition__scene-help">Drag to orbit · scroll or pinch to zoom · use the buttons to rotate by keyboard</p>
          </Suspense>
        </SceneErrorBoundary>
      )}

      <figcaption>
        <strong>Geometric intuition, not a guaranteed equation.</strong> The 2D view deliberately collapses one
        coordinate; the 3D network restores it and adds nearby category, animal, and mythical-creature relationships.
        Both the role directions and the creature blends are hand-authored teaching associations, not measured
        Word2Vec output, definitions, or etymologies. The third axis describes this small role vocabulary—it is not a
        claim that gender or meaning is inherently binary.
      </figcaption>
    </figure>
  );
}
