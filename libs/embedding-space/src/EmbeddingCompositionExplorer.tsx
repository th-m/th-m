import { useId, useState } from "react";

const STARTING_TERMS = ["man", "woman", "king", "queen"] as const;
const MODIFIERS = ["royal", "young"] as const;

type StartingTerm = (typeof STARTING_TERMS)[number];
type Modifier = (typeof MODIFIERS)[number];
type PlottedWord = StartingTerm | "boy" | "girl" | "prince" | "princess";

type PlotPoint = {
  x: number;
  y: number;
};

const PLOT_POINTS: Record<PlottedWord, PlotPoint> = {
  man: { x: 170, y: 138 },
  woman: { x: 170, y: 210 },
  boy: { x: 155, y: 270 },
  girl: { x: 220, y: 284 },
  king: { x: 465, y: 134 },
  queen: { x: 492, y: 205 },
  prince: { x: 450, y: 266 },
  princess: { x: 525, y: 282 },
};

const AVAILABLE_BASES: Record<Modifier, readonly StartingTerm[]> = {
  royal: ["man", "woman"],
  young: STARTING_TERMS,
};

function compositionResult(base: StartingTerm, modifier: Modifier): PlottedWord {
  if (modifier === "royal") return base === "woman" ? "queen" : "king";
  if (base === "man") return "boy";
  if (base === "woman") return "girl";
  if (base === "king") return "prince";
  return "princess";
}

export function EmbeddingCompositionExplorer() {
  const [base, setBase] = useState<StartingTerm>("man");
  const [modifier, setModifier] = useState<Modifier>("royal");
  const markerId = `embedding-composition-arrow-${useId().replace(/:/g, "")}`;
  const availableBases = AVAILABLE_BASES[modifier];
  const result = compositionResult(base, modifier);
  const basePoint = PLOT_POINTS[base];
  const resultPoint = PLOT_POINTS[result];

  const selectModifier = (nextModifier: Modifier) => {
    setModifier(nextModifier);
    if (!(AVAILABLE_BASES[nextModifier] as readonly StartingTerm[]).includes(base)) {
      setBase(AVAILABLE_BASES[nextModifier][0]);
    }
  };

  return (
    <figure className="embedding-composition" aria-label="Interactive two-dimensional word composition teaching model">
      <div className="embedding-composition__header">
        <div>
          <p>Semantic composition</p>
          <h3>Move through a word space</h3>
        </div>
        <span>2D teaching projection</span>
      </div>

      <div className="embedding-composition__controls">
        <label>
          <span>Starting term</span>
          <select
            aria-label="Starting embedding term"
            value={base}
            onChange={(event) => setBase(event.currentTarget.value as StartingTerm)}
          >
            {availableBases.map((word) => (
              <option key={word} value={word}>
                {word}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Added direction</span>
          <select
            aria-label="Added embedding direction"
            value={modifier}
            onChange={(event) => selectModifier(event.currentTarget.value as Modifier)}
          >
            {MODIFIERS.map((word) => (
              <option key={word} value={word}>
                {word}
              </option>
            ))}
          </select>
        </label>
        <output className="embedding-composition__equation" aria-label="Combined embedding result" aria-live="polite">
          <span>{base}</span>
          <i>+</i>
          <span>{modifier}</span>
          <i>=</i>
          <strong>{result}</strong>
        </output>
      </div>

      <div className="embedding-composition__plot">
        <svg
          viewBox="0 0 640 340"
          role="img"
          aria-label={`${base} plus ${modifier} moves toward ${result} on an illustrative two-dimensional semantic map`}
        >
          <title>{`${base} + ${modifier} = ${result}`}</title>
          <desc>
            A teaching projection with ordinary and royal roles arranged horizontally, and younger and adult roles
            arranged vertically. An arrow connects the selected starting word to its composed result.
          </desc>
          <defs>
            <marker id={markerId} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 8 4 L 0 8 z" />
            </marker>
          </defs>

          <g className="embedding-composition__grid" aria-hidden="true">
            <path d="M 82 54 V 304 H 584" />
            <path d="M 82 124 H 584 M 82 214 H 584" />
            <path d="M 250 54 V 304 M 416 54 V 304" />
          </g>
          <g className="embedding-composition__axes" aria-hidden="true">
            <text x="82" y="326">ordinary role</text>
            <text x="584" y="326" textAnchor="end">royal role</text>
            <text x="72" y="302" textAnchor="end">younger</text>
            <text x="72" y="62" textAnchor="end">adult</text>
          </g>

          <line
            className="embedding-composition__movement"
            x1={basePoint.x}
            y1={basePoint.y}
            x2={resultPoint.x}
            y2={resultPoint.y}
            markerEnd={`url(#${markerId})`}
          />
          <text
            className="embedding-composition__movement-label"
            x={(basePoint.x + resultPoint.x) / 2}
            y={(basePoint.y + resultPoint.y) / 2 - 10}
            textAnchor="middle"
          >
            + {modifier}
          </text>

          {(Object.entries(PLOT_POINTS) as [PlottedWord, PlotPoint][]).map(([word, point]) => {
            const state = word === result ? "is-result" : word === base ? "is-source" : "";
            return (
              <g key={word} className={`embedding-composition__point ${state}`} transform={`translate(${point.x} ${point.y})`}>
                <circle r={word === result ? 8 : word === base ? 7 : 4} />
                <text x="0" y="-12" textAnchor="middle">
                  {word}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <figcaption>
        <strong>Geometric intuition, not a guaranteed equation.</strong> The coordinates are a hand-authored 2D
        teaching projection. Word2Vec-style models perform arithmetic across many learned dimensions and return ranked
        neighbors; the closest word depends on the model and its training corpus.
      </figcaption>
    </figure>
  );
}
