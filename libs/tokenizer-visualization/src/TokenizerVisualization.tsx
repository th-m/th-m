import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import {
  DEFAULT_BPE_MERGE_LIMIT,
  MAX_BPE_MERGE_LIMIT,
  applyBpeMerges,
  trainBpeText,
  type BpeMergeStep,
} from "./bpe";
import {
  TOKENIZER_ENCODING,
  assignTextTokenAccents,
  describeTokenText,
  tokenizeText,
  type TokenAccent,
  type TokenDisplayPart,
  type TokenPiece,
} from "./tokenizer";

export const DEFAULT_TOKENIZER_TEXT = "Patterns become pieces. Patterns become tokens.\nToken by token, language takes shape — 👋🏽";
export type TokenizerMode = "learn" | "inspect";

export interface TokenizerVisualizationProps {
  initialText?: string;
  initialMode?: TokenizerMode;
  className?: string;
}

function joinClassNames(...classNames: Array<string | undefined | false>): string {
  return classNames.filter(Boolean).join(" ");
}

function pluralize(count: number, singular: string): string {
  return `${count.toLocaleString()} ${singular}${count === 1 ? "" : "s"}`;
}

function characterCount(text: string): number {
  return [...text].length;
}

function lineCount(text: string): number {
  return text.length === 0 ? 0 : text.split(/\r\n|\r|\n/).length;
}

function tokenPartDescription(parts: readonly TokenDisplayPart[]): string {
  return parts.map((part) => part.label).join(", ");
}

function TokenPart({ part }: { part: TokenDisplayPart }) {
  if (part.kind === "text") return <span className="tokenizer-token-text">{part.value}</span>;
  if (part.kind === "bytes") {
    return <span className="tokenizer-byte-fragment"><span aria-hidden="true">{part.value}</span><span className="tokenizer-sr-only">{part.label}</span></span>;
  }
  return (
    <span className={`tokenizer-whitespace tokenizer-whitespace--${part.kind}`} title={part.label}>
      <span aria-hidden="true">{part.value}</span>
      <span className="tokenizer-sr-only">{part.label}</span>
    </span>
  );
}

function TokenValue({ parts }: { parts: readonly TokenDisplayPart[] }) {
  return <>{parts.map((part, index) => <TokenPart key={`${part.kind}-${index}`} part={part} />)}</>;
}

function ModelTokenCard({ token }: { token: TokenPiece }) {
  const style = { "--token-accent": token.accent.value } as CSSProperties;
  const hasLineBreak = token.display.some((part) => part.kind === "line-break");
  const label = `Token ${token.index + 1}, ID ${token.id}: ${tokenPartDescription(token.display)}. Bytes ${token.byteLabel}.`;

  return (
    <li
      className={joinClassNames(
        "tokenizer-token",
        token.whitespaceOnly && "tokenizer-token--whitespace",
        hasLineBreak && "tokenizer-token--line-break",
      )}
      style={style}
      aria-label={label}
      data-accent={token.accent.name}
      data-token-id={token.id}
    >
      <span className="tokenizer-token-number" aria-hidden="true">{String(token.index + 1).padStart(2, "0")}</span>
      <span className="tokenizer-token-value" aria-hidden="true"><TokenValue parts={token.display} /></span>
      <code className="tokenizer-token-id" aria-hidden="true">{token.id}</code>
    </li>
  );
}

function LearnedTokenCard({ token, index, accent }: { token: string; index: number; accent: TokenAccent }) {
  const parts = describeTokenText(token, [...new TextEncoder().encode(token)]);
  const style = { "--token-accent": accent.value } as CSSProperties;
  const whitespaceOnly = /^\p{White_Space}+$/u.test(token);
  const hasLineBreak = parts.some((part) => part.kind === "line-break");

  return (
    <li
      className={joinClassNames(
        "tokenizer-token",
        "tokenizer-token--learned",
        whitespaceOnly && "tokenizer-token--whitespace",
        hasLineBreak && "tokenizer-token--line-break",
      )}
      style={style}
      aria-label={`Learned token ${index + 1}: ${tokenPartDescription(parts)}.`}
      data-accent={accent.name}
    >
      <span className="tokenizer-token-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <span className="tokenizer-token-value" aria-hidden="true"><TokenValue parts={parts} /></span>
      <code className="tokenizer-token-id tokenizer-token-id--learned" aria-hidden="true">BPE</code>
    </li>
  );
}

function PairToken({ value }: { value: string }) {
  const parts = describeTokenText(value, [...new TextEncoder().encode(value)]);
  return <span className="tokenizer-pair-token" aria-label={tokenPartDescription(parts)}><span aria-hidden="true"><TokenValue parts={parts} /></span></span>;
}

function MergeEquation({ merge }: { merge: Pick<BpeMergeStep, "pair" | "token"> }) {
  return (
    <span className="tokenizer-merge-equation">
      <PairToken value={merge.pair[0]} />
      <span aria-hidden="true">+</span>
      <PairToken value={merge.pair[1]} />
      <span className="tokenizer-merge-arrow" aria-hidden="true">→</span>
      <PairToken value={merge.token} />
    </span>
  );
}

function CandidateList({ merge }: { merge: BpeMergeStep | undefined }) {
  if (!merge) return <p className="tokenizer-candidate-empty">No adjacent pairs remain.</p>;
  return (
    <ol className="tokenizer-candidate-list" aria-label={`Top pair candidates before merge ${merge.step}`}>
      {merge.candidates.map((candidate, index) => (
        <li key={`${candidate.pair[0]}-${candidate.pair[1]}-${index}`}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className="tokenizer-candidate-pair"><PairToken value={candidate.pair[0]} /><i aria-hidden="true">+</i><PairToken value={candidate.pair[1]} /></span>
          <strong>{candidate.frequency}×</strong>
        </li>
      ))}
    </ol>
  );
}

export function TokenizerVisualization({
  initialText = DEFAULT_TOKENIZER_TEXT,
  initialMode = "learn",
  className,
}: TokenizerVisualizationProps) {
  const [text, setText] = useState(initialText);
  const [mode, setMode] = useState<TokenizerMode>(initialMode);
  const [mergeLimit, setMergeLimit] = useState(DEFAULT_BPE_MERGE_LIMIT);
  const [bpeStep, setBpeStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const editorId = useId();
  const encodingNoteId = useId();
  const workspaceId = useId();
  const learnTabRef = useRef<HTMLButtonElement>(null);
  const inspectTabRef = useRef<HTMLButtonElement>(null);

  const modelTokens = useMemo(() => tokenizeText(text), [text]);
  const training = useMemo(() => trainBpeText(text, mergeLimit), [text, mergeLimit]);
  const activeStep = Math.min(bpeStep, training.merges.length);
  const learnedTokens = useMemo(
    () => applyBpeMerges(text, training.merges, activeStep),
    [activeStep, text, training.merges],
  );
  const learnedAccents = useMemo(() => assignTextTokenAccents(learnedTokens), [learnedTokens]);
  const bytes = useMemo(() => new TextEncoder().encode(text).length, [text]);
  const characters = characterCount(text);
  const lines = lineCount(text);
  const visibleTokens = mode === "learn" ? learnedTokens.length : modelTokens.length;
  const activeMerge = activeStep > 0 ? training.merges[activeStep - 1] : undefined;
  const nextMerge = training.merges[activeStep];
  const featuredMerge = activeMerge ?? nextMerge;
  const learnedVocabulary = useMemo(
    () => [...new Set([...training.initialVocabulary, ...training.merges.slice(0, activeStep).map((merge) => merge.token)])],
    [activeStep, training.initialVocabulary, training.merges],
  );
  const compression = learnedTokens.length > 0
    ? training.initialTokens.length / learnedTokens.length
    : 0;

  useEffect(() => {
    if (!isPlaying) return;
    if (activeStep >= training.merges.length) {
      setIsPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setBpeStep((step) => step + 1), 520);
    return () => window.clearTimeout(timer);
  }, [activeStep, isPlaying, training.merges.length]);

  function updateText(nextText: string) {
    setIsPlaying(false);
    setBpeStep(0);
    setText(nextText);
  }

  function updateStep(nextStep: number) {
    setIsPlaying(false);
    setBpeStep(Math.min(training.merges.length, Math.max(0, nextStep)));
  }

  function togglePlayback() {
    if (activeStep >= training.merges.length) setBpeStep(0);
    setIsPlaying((playing) => !playing || activeStep >= training.merges.length);
  }

  function selectMode(nextMode: TokenizerMode) {
    setIsPlaying(false);
    setMode(nextMode);
  }

  function handleModeKeyDown(event: KeyboardEvent<HTMLButtonElement>, currentMode: TokenizerMode) {
    let nextMode: TokenizerMode | undefined;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      nextMode = currentMode === "learn" ? "inspect" : "learn";
    } else if (event.key === "Home") {
      nextMode = "learn";
    } else if (event.key === "End") {
      nextMode = "inspect";
    }
    if (!nextMode) return;
    event.preventDefault();
    selectMode(nextMode);
    (nextMode === "learn" ? learnTabRef : inspectTabRef).current?.focus();
  }

  const mergeStatus = training.merges.length === 0
    ? "No learnable pairs"
    : activeStep === training.merges.length
      ? training.exhausted ? "Vocabulary complete" : "Merge budget reached"
      : `Merge ${activeStep} of ${training.merges.length}`;

  return (
    <main className={joinClassNames("tokenizer-app", className)}>
      <div className="tokenizer-glow tokenizer-glow--one" aria-hidden="true" />
      <div className="tokenizer-glow tokenizer-glow--two" aria-hidden="true" />

      <header className="tokenizer-hero">
        <div className="tokenizer-brand-row">
          <a className="tokenizer-wordmark" href={`#${workspaceId}`} aria-label="Skip to tokenizer workspace">
            <span>TH</span><i aria-hidden="true" /><span>OM</span>
          </a>
          <span className="tokenizer-local-badge"><i aria-hidden="true" /> Local processing</span>
        </div>

        <div className="tokenizer-title-grid">
          <p className="tokenizer-eyebrow">Language instrument · 01</p>
          <h1 aria-label="See what the model sees and how it learns.">See what the<br /><em>model sees.</em></h1>
          <div className="tokenizer-intro">
            <p>Inspect a production encoding or teach one from scratch. Every boundary, merge, and byte stays in this browser.</p>
            <p className="tokenizer-encoding-note" id={encodingNoteId}>
              <span>Two lenses</span>
              <strong>BPE lab / {TOKENIZER_ENCODING}</strong>
              <small>Learned BPE rules and model encodings produce different boundaries. Neither is universal.</small>
            </p>
          </div>
        </div>
      </header>

      <section className="tokenizer-workspace" id={workspaceId} aria-labelledby={`${editorId}-workspace-title`}>
        <div className="tokenizer-workspace-bar">
          <div className="tokenizer-workspace-title">
            <span className="tokenizer-section-index">01</span>
            <h2 id={`${editorId}-workspace-title`}>Tokenizer workspace</h2>
          </div>
          <div className="tokenizer-mode-tabs" role="tablist" aria-label="Tokenizer view">
            <button
              id={`${editorId}-learn-tab`}
              ref={learnTabRef}
              type="button"
              role="tab"
              aria-selected={mode === "learn"}
              aria-controls={`${editorId}-learn-panel`}
              tabIndex={mode === "learn" ? 0 : -1}
              onClick={() => selectMode("learn")}
              onKeyDown={(event) => handleModeKeyDown(event, "learn")}
            >
              <span>Learn</span> BPE lab
            </button>
            <button
              id={`${editorId}-inspect-tab`}
              ref={inspectTabRef}
              type="button"
              role="tab"
              aria-selected={mode === "inspect"}
              aria-controls={`${editorId}-inspect-panel`}
              tabIndex={mode === "inspect" ? 0 : -1}
              onClick={() => selectMode("inspect")}
              onKeyDown={(event) => handleModeKeyDown(event, "inspect")}
            >
              <span>Inspect</span> Model tokens
            </button>
          </div>
          <output className="tokenizer-live-count" aria-live="polite" aria-atomic="true">
            {pluralize(visibleTokens, "token")}
          </output>
        </div>

        <div
          id={`${editorId}-${mode}-panel`}
          role="tabpanel"
          aria-labelledby={`${editorId}-${mode}-tab`}
        >
          <div className="tokenizer-mode-note">
            <span>{mode === "learn" ? "From-scratch BPE" : `Fixed ${TOKENIZER_ENCODING}`}</span>
            <p>{mode === "learn"
              ? "Characters merge into a vocabulary trained only on this text. Step through the evidence behind every new piece."
              : "A fixed, production-scale vocabulary maps the same text to encoding-specific IDs and UTF-8 bytes."}</p>
          </div>

          <div className="tokenizer-panels">
            <section className="tokenizer-panel tokenizer-input-panel" aria-labelledby={`${editorId}-input-title`}>
              <div className="tokenizer-panel-heading">
                <div>
                  <span className="tokenizer-panel-kicker">Training corpus</span>
                  <h3 id={`${editorId}-input-title`}>Source text</h3>
                </div>
                <button className="tokenizer-clear" type="button" onClick={() => updateText("")} disabled={text.length === 0}>
                  Clear
                </button>
              </div>

              <label className="tokenizer-sr-only" htmlFor={editorId}>Text to tokenize</label>
              <textarea
                id={editorId}
                value={text}
                onChange={(event) => updateText(event.currentTarget.value)}
                placeholder="Type or paste text here…"
                spellCheck="true"
                aria-describedby={encodingNoteId}
              />

              <div className="tokenizer-input-meta" aria-label="Input statistics">
                <span>{pluralize(characters, "character")}</span>
                <span>{pluralize(bytes, "byte")}</span>
                <span>{pluralize(lines, "line")}</span>
              </div>
            </section>

            <section className="tokenizer-panel tokenizer-output-panel" aria-labelledby={`${editorId}-output-title`}>
              <div className="tokenizer-panel-heading">
                <div>
                  <span className="tokenizer-panel-kicker">{mode === "learn" ? `After ${activeStep} merges` : TOKENIZER_ENCODING}</span>
                  <h3 id={`${editorId}-output-title`}>{mode === "learn" ? "Evolving token stream" : "Encoded pieces"}</h3>
                </div>
                <span className="tokenizer-id-key"><i aria-hidden="true" /> {mode === "learn" ? mergeStatus : "token ID"}</span>
              </div>

              {visibleTokens > 0 ? (
                <ol className="tokenizer-token-list" aria-label={mode === "learn" ? `BPE tokens after ${activeStep} merges` : `Tokens using ${TOKENIZER_ENCODING}`}>
                  {mode === "learn"
                    ? learnedTokens.map((token, index) => (
                      <LearnedTokenCard key={`${index}-${token}`} token={token} index={index} accent={learnedAccents[index]!} />
                    ))
                    : modelTokens.map((token) => <ModelTokenCard key={`${token.index}-${token.id}`} token={token} />)}
                </ol>
              ) : (
                <div className="tokenizer-empty" role="status">
                  <span aria-hidden="true">Aa</span>
                  <strong>Waiting for language.</strong>
                  <p>Start typing to reveal its token structure.</p>
                </div>
              )}
            </section>
          </div>

          {mode === "learn" && (
            <section className="tokenizer-bpe-lab" aria-labelledby={`${editorId}-lab-title`}>
              <div className="tokenizer-lab-heading">
                <div>
                  <span className="tokenizer-section-index">02</span>
                  <div>
                    <span className="tokenizer-panel-kicker">Learning sequence</span>
                    <h2 id={`${editorId}-lab-title`}>Merge laboratory</h2>
                  </div>
                </div>
                <label className="tokenizer-budget-control">
                  <span>Merge budget</span>
                  <select
                    value={mergeLimit}
                    onChange={(event) => {
                      setIsPlaying(false);
                      setBpeStep(0);
                      setMergeLimit(Number(event.currentTarget.value));
                    }}
                  >
                    {[8, 16, 24, 48, 96, 256, MAX_BPE_MERGE_LIMIT].map((limit) => <option key={limit} value={limit}>{limit}</option>)}
                  </select>
                </label>
              </div>

              <div className="tokenizer-transport">
                <div className="tokenizer-transport-buttons">
                  <button type="button" onClick={() => updateStep(activeStep - 1)} disabled={activeStep === 0} aria-label="Previous BPE merge"><span aria-hidden="true">←</span></button>
                  <button className="tokenizer-play" type="button" onClick={togglePlayback} disabled={training.merges.length === 0} aria-label={isPlaying ? "Pause BPE merges" : "Play BPE merges"}>
                    <span aria-hidden="true">{isPlaying ? "Ⅱ" : "▶"}</span>
                  </button>
                  <button type="button" onClick={() => updateStep(activeStep + 1)} disabled={activeStep >= training.merges.length} aria-label="Next BPE merge"><span aria-hidden="true">→</span></button>
                </div>
                <label className="tokenizer-scrubber">
                  <span className="tokenizer-sr-only">BPE merge step</span>
                  <input
                    type="range"
                    min="0"
                    max={training.merges.length}
                    value={activeStep}
                    onChange={(event) => updateStep(Number(event.currentTarget.value))}
                    disabled={training.merges.length === 0}
                  />
                </label>
                <output className="tokenizer-step-readout" aria-live="polite">
                  <strong>{String(activeStep).padStart(2, "0")}</strong>
                  <span>/ {String(training.merges.length).padStart(2, "0")}</span>
                </output>
              </div>

              <div className="tokenizer-lab-grid">
                <article className="tokenizer-featured-merge">
                  <span className="tokenizer-panel-kicker">{activeMerge ? `Merge ${activeMerge.step}` : "Next merge"}</span>
                  {featuredMerge ? (
                    <>
                      <MergeEquation merge={featuredMerge} />
                      <p>The pair occurs <strong>{featuredMerge.frequency}×</strong> in the weighted corpus.</p>
                    </>
                  ) : (
                    <div className="tokenizer-merge-complete"><strong>Complete</strong><p>Every pre-token is now a single learned piece.</p></div>
                  )}
                </article>

                <div className="tokenizer-metrics" aria-label="BPE training statistics">
                  <div><span>Vocabulary</span><strong>{learnedVocabulary.length}</strong><small>unique pieces</small></div>
                  <div><span>Token stream</span><strong>{learnedTokens.length}</strong><small>from {training.initialTokens.length}</small></div>
                  <div><span>Compression</span><strong>{compression ? compression.toFixed(2) : "0.00"}×</strong><small>characters / pieces</small></div>
                  <div><span>Pre-tokens</span><strong>{training.uniquePreTokenCount}</strong><small>unique chunks</small></div>
                </div>

                <aside className="tokenizer-candidates" aria-labelledby={`${editorId}-candidates-title`}>
                  <div className="tokenizer-subheading"><span id={`${editorId}-candidates-title`}>Pair ranking</span><small>before selected merge</small></div>
                  <CandidateList merge={featuredMerge} />
                </aside>
              </div>

              <div className="tokenizer-ledger-section">
                <div className="tokenizer-subheading"><span>Merge ledger</span><small>select any learned rule</small></div>
                {training.merges.length > 0 ? (
                  <ol className="tokenizer-merge-ledger" aria-label="Learned BPE merge rules">
                    {training.merges.map((merge) => (
                      <li key={merge.step}>
                        <button
                          type="button"
                          className={joinClassNames(activeStep === merge.step && "is-current", activeStep > merge.step && "is-complete")}
                          onClick={() => updateStep(merge.step)}
                          aria-current={activeStep === merge.step ? "step" : undefined}
                        >
                          <span className="tokenizer-ledger-index">{String(merge.step).padStart(2, "0")}</span>
                          <MergeEquation merge={merge} />
                          <span className="tokenizer-ledger-frequency">{merge.frequency}×</span>
                        </button>
                      </li>
                    ))}
                  </ol>
                ) : <p className="tokenizer-ledger-empty">Add a repeated multi-character word to create merge rules.</p>}
              </div>

              <div className="tokenizer-vocabulary-section">
                <div className="tokenizer-subheading"><span>Vocabulary at step {activeStep}</span><small>{pluralize(learnedVocabulary.length, "piece")}</small></div>
                <ul className="tokenizer-vocabulary-list" aria-label={`BPE vocabulary after ${activeStep} merges`}>
                  {learnedVocabulary.map((token, index) => (
                    <li key={`${token}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><PairToken value={token} /></li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </div>
      </section>

      <footer className="tokenizer-footer">
        <p><span>One text</span><i aria-hidden="true" /><span>Many possible encodings</span></p>
        <p>BPE lab learns from this sample. {TOKENIZER_ENCODING} uses a fixed, production-scale vocabulary.</p>
      </footer>
    </main>
  );
}
