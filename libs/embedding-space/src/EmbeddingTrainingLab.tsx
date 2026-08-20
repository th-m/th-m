import { useEffect, useId, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { thomDesignTokens } from "@th-m/design-theme";
import { defaultEmbeddingTrainingDataset } from "./defaultTrainingScenario";
import { cosineSimilarity } from "./math";
import { inspectTrainingQuery, trainingAnalogy, trainingNeighbors } from "./trainingMath";
import type { EmbeddingTrainingDataset, TrainingCategory } from "./trainingTypes";
import { usePrefersReducedMotion } from "./useReducedMotion";

const TRAIN_WIDTH = 900;
const TRAIN_HEIGHT = 560;
const TRAIN_PAD = 52;

const categoryPresentation: Record<TrainingCategory, { label: string; color: string }> = {
  roles: { label: "Roles", color: thomDesignTokens.color.accents.rose },
  places: { label: "Places", color: thomDesignTokens.color.accents.violet },
  animals: { label: "Animals", color: thomDesignTokens.color.accents.lime },
  nature: { label: "Nature", color: thomDesignTokens.color.accents.teal },
  food: { label: "Food", color: thomDesignTokens.color.semantic.warning.default },
  technology: { label: "Technology", color: thomDesignTokens.color.accents.blue },
};

const trainingAnchors = new Set(["king", "queen", "paris", "rome", "dog", "cat", "river", "forest", "apple", "coffee", "computer", "server"]);

const trainingLabelPlacements: Record<string, { dx: number; dy: number; anchor?: "start" | "end" }> = {
  king: { dx: -12, dy: -14, anchor: "end" },
  queen: { dx: 12, dy: -14 },
  paris: { dx: -12, dy: -14, anchor: "end" },
  rome: { dx: 12, dy: 15 },
  dog: { dx: -12, dy: 15, anchor: "end" },
  cat: { dx: 12, dy: -14 },
  river: { dx: -12, dy: -14, anchor: "end" },
  forest: { dx: 12, dy: 15 },
  apple: { dx: -12, dy: 15, anchor: "end" },
  coffee: { dx: 12, dy: -14 },
  computer: { dx: -12, dy: -14, anchor: "end" },
  server: { dx: 12, dy: 15 },
};

function trainingLabelPlacement(word: string, index: number, selected: boolean) {
  if (trainingLabelPlacements[word]) return trainingLabelPlacements[word]!;
  const placements = [
    { dx: 12, dy: -14 as number },
    { dx: -12, dy: -14 as number, anchor: "end" as const },
    { dx: 12, dy: 15 as number },
    { dx: -12, dy: 15 as number, anchor: "end" as const },
  ];
  return selected ? { dx: 12, dy: -15 } : placements[index % placements.length]!;
}

function format(value: number, digits = 3) {
  return value.toFixed(digits).replace("-0.000", "0.000");
}

function trainingPosition(point: readonly number[], bounds: EmbeddingTrainingDataset["projection"]["bounds"]) {
  const xRange = Math.max(bounds.maxX - bounds.minX, 0.001);
  const yRange = Math.max(bounds.maxY - bounds.minY, 0.001);
  const xPad = xRange * 0.08;
  const yPad = yRange * 0.08;
  return {
    x: TRAIN_PAD + (((point[0] ?? 0) - (bounds.minX - xPad)) / (xRange + xPad * 2)) * (TRAIN_WIDTH - TRAIN_PAD * 2),
    y: TRAIN_PAD + (1 - ((point[1] ?? 0) - (bounds.minY - yPad)) / (yRange + yPad * 2)) * (TRAIN_HEIGHT - TRAIN_PAD * 2),
  };
}

function LossCurve({ dataset, checkpointIndex }: { dataset: EmbeddingTrainingDataset; checkpointIndex: number }) {
  const losses = dataset.checkpoints.map((checkpoint) => checkpoint.loss);
  const min = Math.min(...losses);
  const max = Math.max(...losses);
  const points = dataset.checkpoints.map((checkpoint, index) => {
    const x = 8 + index / Math.max(1, dataset.checkpoints.length - 1) * 284;
    const y = 67 - (checkpoint.loss - min) / Math.max(0.0001, max - min) * 55;
    return [x, y] as const;
  });
  const visible = points.slice(0, checkpointIndex + 1).map(([x, y]) => `${x},${y}`).join(" ");
  const current = points[checkpointIndex] ?? points[0]!;
  return (
    <svg viewBox="0 0 300 78" role="img" aria-label={`Loss curve through epoch ${dataset.checkpoints[checkpointIndex]?.epoch ?? 0}`}>
      <path d="M 8 67 H 292 M 8 12 V 67" className="embedding-training__loss-axis" />
      <polyline points={visible} className="embedding-training__loss-line" />
      <circle cx={current[0]} cy={current[1]} r="3.5" className="embedding-training__loss-point" />
      <text x="8" y="76">loss</text><text x="292" y="76" textAnchor="end">epoch</text>
    </svg>
  );
}

export interface EmbeddingTrainingLabProps {
  dataset?: EmbeddingTrainingDataset;
  modeSwitcher: ReactNode;
}

export function EmbeddingTrainingLab({ dataset = defaultEmbeddingTrainingDataset, modeSwitcher }: EmbeddingTrainingLabProps) {
  const reducedMotion = usePrefersReducedMotion();
  const titleId = useId();
  const [checkpointIndex, setCheckpointIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [selectedWord, setSelectedWord] = useState("king");
  const [query, setQuery] = useState("king");
  const [queryMessage, setQueryMessage] = useState("");
  const [pairA, setPairA] = useState("king");
  const [pairB, setPairB] = useState("queen");
  const [analogyA, setAnalogyA] = useState("dog");
  const [analogyB, setAnalogyB] = useState("puppy");
  const [analogyC, setAnalogyC] = useState("kitten");
  const checkpoint = dataset.checkpoints[checkpointIndex] ?? dataset.checkpoints[0]!;
  const finalIndex = dataset.checkpoints.length - 1;
  const selectedVector = checkpoint.vectors[selectedWord] ?? [];
  const neighbors = trainingNeighbors(selectedVector, checkpoint, 5, [selectedWord]);
  const neighborWords = new Set(neighbors.map((neighbor) => neighbor.word));
  const analogy = trainingAnalogy(analogyA, analogyB, analogyC, checkpoint);
  const pairSimilarity = cosineSimilarity(checkpoint.vectors[pairA]!, checkpoint.vectors[pairB]!);
  const vocabulary = dataset.vocabulary.map((entry) => entry.word);
  const wordMetadata = new Map(dataset.vocabulary.map((entry) => [entry.word, entry]));
  const progress = checkpoint.epoch / dataset.metadata.epochs * 100;

  useEffect(() => {
    if (!playing) return;
    if (checkpointIndex >= finalIndex) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setCheckpointIndex((index) => Math.min(finalIndex, index + 1)), 360);
    return () => window.clearTimeout(timer);
  }, [checkpointIndex, finalIndex, playing]);

  const startReplay = () => {
    setCheckpointIndex(0);
    if (reducedMotion) {
      setCheckpointIndex(finalIndex);
      setPlaying(false);
    } else {
      setPlaying(true);
    }
  };

  const submitQuery = (event: FormEvent) => {
    event.preventDefault();
    const result = inspectTrainingQuery(query, dataset.vocabulary);
    setQueryMessage(result.message);
    if (result.status === "supported") {
      setSelectedWord(result.word);
      setPairA(result.word);
    }
  };

  const stats = [
    ["Sentences", dataset.metadata.sentenceCount],
    ["Vocabulary", dataset.metadata.vocabularySize],
    ["Dimensions", dataset.metadata.embeddingDimensions],
    ["Window", `±${dataset.metadata.contextWindow}`],
    ["Training pairs", dataset.metadata.trainingPairCount],
    ["Negatives", `${dataset.metadata.negativeSamples} / pair`],
  ] as const;

  const status = checkpointIndex === 0 && !playing ? "Ready to replay" : playing ? "Training replay running" : checkpointIndex === finalIndex ? "Training replay complete" : "Training replay paused";

  return (
    <section className="embedding-space embedding-training" aria-labelledby={titleId} data-reduced-motion={reducedMotion ? "true" : "false"}>
      <header className="embedding-space__intro">
        <div>
          <p className="embedding-space__eyebrow">Teaching model · co-occurrence training</p>
          <h1 id={titleId}>Watch a neighborhood learn itself.</h1>
        </div>
        <div className="embedding-space__lede">
          <p>A tiny skip-gram model learns which words keep similar company. Replay deterministic checkpoints, inspect the loss, and test the geometry—without confusing this teaching objective with how production decoder LLMs are trained.</p>
          <dl className="embedding-space__summary-metrics">
            <div><dt>Objective</dt><dd>Skip-gram + negatives</dd></div>
            <div><dt>Delivery</dt><dd>Precomputed replay</dd></div>
            <div><dt>Projection</dt><dd>Final-basis PCA</dd></div>
          </dl>
        </div>
      </header>

      {modeSwitcher}

      <div className="embedding-training__statusbar">
        <div className="embedding-training__run-state">
          <span className={playing ? "is-running" : ""} aria-hidden="true" />
          <div><small>{status}</small><strong>Epoch {checkpoint.epoch} / {dataset.metadata.epochs}</strong></div>
        </div>
        <div className="embedding-training__progress" aria-label={`Training progress ${Math.round(progress)} percent`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
          <i style={{ width: `${progress}%` }} />
        </div>
        <div className="embedding-training__loss"><span>Mean negative-sampling loss</span><strong>{format(checkpoint.loss, 4)}</strong></div>
        <button type="button" className="embedding-training__run" onClick={playing ? () => setPlaying(false) : startReplay}>
          {playing ? "Pause replay" : checkpointIndex === 0 ? "Start training replay" : "Replay from seed"}<span aria-hidden="true">{playing ? "Ⅱ" : "→"}</span>
        </button>
      </div>

      <div className="embedding-training__timeline">
        <label htmlFor={`${titleId}-epoch`}>Inspect checkpoint</label>
        <input
          id={`${titleId}-epoch`}
          type="range"
          min={0}
          max={finalIndex}
          value={checkpointIndex}
          onChange={(event) => { setPlaying(false); setCheckpointIndex(Number(event.target.value)); }}
          aria-valuetext={`Epoch ${checkpoint.epoch}, loss ${format(checkpoint.loss, 4)}`}
        />
        <div className="embedding-training__curve"><LossCurve dataset={dataset} checkpointIndex={checkpointIndex} /></div>
      </div>

      <dl className="embedding-training__stats" aria-label="Teaching corpus and model statistics">
        {stats.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>

      <div className="embedding-training__workspace">
        <div className="embedding-training__map-card">
          <header><div><span>Learned geometry</span><strong>{dataset.metadata.embeddingDimensions}D source · fixed 2D view</strong></div><p>Points move only when checkpoint vectors change.</p></header>
          <svg className="embedding-training__map" viewBox={`0 0 ${TRAIN_WIDTH} ${TRAIN_HEIGHT}`} role="img" aria-label={`Skip-gram embedding projection at epoch ${checkpoint.epoch}`}>
            <defs>
              <pattern id={`${titleId}-train-grid`} width="62" height="62" patternUnits="userSpaceOnUse"><path d="M 62 0 L 0 0 0 62" /></pattern>
            </defs>
            <rect width={TRAIN_WIDTH} height={TRAIN_HEIGHT} className="embedding-training__map-bg" />
            <rect x={TRAIN_PAD} y={TRAIN_PAD} width={TRAIN_WIDTH - TRAIN_PAD * 2} height={TRAIN_HEIGHT - TRAIN_PAD * 2} fill={`url(#${titleId}-train-grid)`} className="embedding-training__grid" />
            {dataset.vocabulary.map((entry, index) => {
              const point = checkpoint.projections[entry.word];
              if (!point) return null;
              const position = trainingPosition(point, dataset.projection.bounds);
              const selected = entry.word === selectedWord;
              const neighbor = neighborWords.has(entry.word);
              const showLabel = selected || trainingAnchors.has(entry.word);
              const label = trainingLabelPlacement(entry.word, index, selected);
              return (
                <g
                  key={entry.word}
                  role="button"
                  tabIndex={0}
                  aria-label={`${entry.word}, ${categoryPresentation[entry.category].label}, count ${entry.count}`}
                  aria-pressed={selected}
                  className={`embedding-training__word${selected ? " is-selected" : ""}${neighbor ? " is-neighbor" : ""}`}
                  style={{ "--word-color": categoryPresentation[entry.category].color, transform: `translate(${position.x}px, ${position.y}px)` } as CSSProperties}
                  onClick={() => { setSelectedWord(entry.word); setQuery(entry.word); setPairA(entry.word); }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedWord(entry.word);
                      setQuery(entry.word);
                      setPairA(entry.word);
                    }
                  }}
                >
                  {selected ? <circle r="15" className="embedding-training__word-halo" /> : null}
                  <circle r={selected ? 7 : 4.5} />
                  {neighbor ? <circle r="10.5" className="embedding-training__word-neighbor" /> : null}
                  {showLabel ? <text x={label.dx} y={label.dy} textAnchor={label.anchor}>{entry.word}</text> : null}
                </g>
              );
            })}
            <text x={TRAIN_PAD} y={TRAIN_HEIGHT - 18} className="embedding-training__axis-label">Fixed basis fitted once on epoch {dataset.metadata.epochs} · screen distance is projected</text>
          </svg>
          <div className="embedding-training__legend">
            {(Object.keys(categoryPresentation) as TrainingCategory[]).map((category) => <span key={category}><i style={{ "--word-color": categoryPresentation[category].color } as CSSProperties} />{categoryPresentation[category].label}</span>)}
          </div>
        </div>

        <aside className="embedding-training__inspector" aria-label="Training vector operations">
          <form className="embedding-training__query" onSubmit={submitQuery}>
            <label htmlFor={`${titleId}-query`}>Word / query</label>
            <div><input id={`${titleId}-query`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try king, paris, or computer" /><button type="submit">Inspect</button></div>
            {queryMessage ? <p role={queryMessage.includes("available") ? "status" : "alert"}>{queryMessage}</p> : null}
          </form>

          <section className="embedding-training__selected">
            <header><span>Selected word</span><small>{wordMetadata.get(selectedWord)?.category}</small></header>
            <h2>{selectedWord}</h2>
            <p>{selectedVector.map((value) => format(value, 4)).join(" · ")}</p>
            <small>All {selectedVector.length} learned input-vector values at epoch {checkpoint.epoch}</small>
          </section>

          <section className="embedding-training__neighbors">
            <header><h3>Nearest learned neighbors</h3><span>cosine</span></header>
            <ol>{neighbors.map((neighbor, index) => <li key={neighbor.word}><button type="button" onClick={() => { setSelectedWord(neighbor.word); setQuery(neighbor.word); setPairA(neighbor.word); }}><span>{index + 1}. {neighbor.word}</span><strong>{format(neighbor.similarity)}</strong></button></li>)}</ol>
          </section>

          <section className="embedding-training__operation">
            <header><span>01</span><div><h3>Pairwise similarity</h3><p>Compare two current checkpoint vectors.</p></div></header>
            <div className="embedding-training__select-pair">
              <select aria-label="First similarity term" value={pairA} onChange={(event) => setPairA(event.target.value)}>{vocabulary.map((word) => <option key={word}>{word}</option>)}</select>
              <span>↔</span>
              <select aria-label="Second similarity term" value={pairB} onChange={(event) => setPairB(event.target.value)}>{vocabulary.map((word) => <option key={word}>{word}</option>)}</select>
            </div>
            <output aria-label="Pairwise cosine similarity"><strong>{format(pairSimilarity)}</strong><span>cosine similarity</span></output>
          </section>

          <section className="embedding-training__operation">
            <header><span>02</span><div><h3>Vector analogy</h3><p>Compute a − b + c in the learned 16D source space.</p></div></header>
            <div className="embedding-training__analogy-selects">
              <select aria-label="Analogy term a" value={analogyA} onChange={(event) => setAnalogyA(event.target.value)}>{vocabulary.map((word) => <option key={word}>{word}</option>)}</select>
              <i>−</i><select aria-label="Analogy term b" value={analogyB} onChange={(event) => setAnalogyB(event.target.value)}>{vocabulary.map((word) => <option key={word}>{word}</option>)}</select>
              <i>+</i><select aria-label="Analogy term c" value={analogyC} onChange={(event) => setAnalogyC(event.target.value)}>{vocabulary.map((word) => <option key={word}>{word}</option>)}</select>
            </div>
            <output aria-label="Nearest analogy result"><span>Nearest result</span><strong>{analogy.nearest?.word ?? "—"}</strong><small>{analogy.nearest ? `${format(analogy.nearest.similarity)} cosine` : "unavailable"}</small></output>
          </section>
        </aside>
      </div>

      <details className="embedding-training__corpus">
        <summary><span>How co-occurrence becomes geometry</span><span>Original corpus & method</span></summary>
        <div className="embedding-training__corpus-content">
          <div><h2>Nearby words learn from shared company.</h2><p>For every center word, the script predicts words within a ±{dataset.metadata.contextWindow} position window and contrasts each observed pair with {dataset.metadata.negativeSamples} sampled non-pairs. Repeated shared contexts pull vectors toward similar directions; negative examples prevent every word from collapsing together.</p><p className="embedding-training__warning"><strong>Teaching boundary.</strong> {dataset.disclosure}</p></div>
          <ol>{dataset.corpus.map((sentence, index) => <li key={sentence}><span>{String(index + 1).padStart(2, "0")}</span>{sentence}</li>)}</ol>
        </div>
      </details>

      <div className="embedding-space__sr-summary">
        <table><caption>Training state for {selectedWord} at epoch {checkpoint.epoch}</caption><thead><tr><th>Word</th><th>Epoch</th><th>Loss</th><th>Nearest neighbor</th><th>Cosine</th></tr></thead><tbody><tr><td>{selectedWord}</td><td>{checkpoint.epoch}</td><td>{format(checkpoint.loss, 4)}</td><td>{neighbors[0]?.word}</td><td>{neighbors[0] ? format(neighbors[0].similarity) : "—"}</td></tr></tbody></table>
      </div>
      <p className="embedding-space__sr-only" aria-live="polite">{status}. Epoch {checkpoint.epoch}. Loss {format(checkpoint.loss, 4)}.</p>
    </section>
  );
}
