import "./ai-factory-motif.css";
import { useId } from "react";
import { aiFactoryIconLabel, type AiFactoryIconKind } from "./icon-catalog";
export type { AiFactoryIconKind } from "./icon-catalog";

const motifContent = {
  "experience-but-lacking": {
    index: "01",
    eyebrow: "Experience / missing bridges",
    title: "Personal meaning is not yet shared value",
    description:
      "Personal experience carries meaning. Text can lead to shared understanding, and value is situated in the relationship between self and others, but communication and value for others have not yet been established.",
    caption:
      "The experience is meaningful to me. Text can carry that meaning toward shared understanding; value is realized in relationships with others. The outward bridge is still lacking: the meaning has not been communicated, and its value has not been demonstrated. Unsubstantiated value is not the same as no value.",
  },
  "model-priorities-and-goal-fit": {
    index: "01b",
    eyebrow: "Model priorities / missing grounding",
    title: "Fluent output is not value insight",
    description:
      "A possible failure path: subjective, incomplete, and conflicting statements enter a model as token embeddings; training shapes learned priorities and the runtime harness steers generation, but the resulting fluent response may mislead or miss the user's unverified goal.",
    caption:
      "Subjective does not mean false. The risk is treating incomplete or conflicting statements as sufficient grounding. Input tokens are encoded as embeddings; the model generates the response. Training shapes learned behavior, while the harness supplies runtime instructions, tools, and constraints. These influences are not a guaranteed understanding of what matters to the user. Models can clarify or challenge a premise; this figure shows the failure path when missing evidence, context, and success criteria go unresolved. The statements are illustrative, not a measured count or failure rate.",
  },
  "vision-to-morpheme": {
    index: "01",
    eyebrow: "Expression",
    title: "Vision becomes an idea",
    description:
      "A vision gives rise to meaning, which takes shape as a context-sensitive idea with a still-diffuse boundary.",
    caption:
      "Vision exceeds what language can hold. Meaning gives part of it direction; an idea gives that meaning a shape without fixing every possible interpretation.",
  },
  "refinement-and-discipline-to-term-of-art": {
    index: "02",
    eyebrow: "Refinement + discipline",
    title: "Refinement and discipline establish a term of art",
    description:
      "Refinement defines and corrects a concrete idea; discipline sustains continuity, clarification, and specification until it becomes a term of art with a stable domain boundary.",
    caption:
      "Refinement supplies definition, evidence, and correction. Discipline supplies continuity, clarification, and specification. Together they give an idea a stable expression as a term of art.",
  },
  "understanding-in-embedding-space": {
    index: "02b",
    eyebrow: "Embedding space / inference value",
    title: "Short input, useful output—or just more tokens",
    description:
      "Conceptual comparison: a short label used as a grounded term of art can guide inference toward useful expanded text, while an ungrounded label can produce excess tokens without meeting the intended result.",
    caption:
      "A term of art packs shared domain distinctions into a short label. When those distinctions are learned or supplied in context, they can guide model representations and inference toward useful expanded output. Without shared understanding, fluent expansion may miss the goal. This is a conceptual contrast, not a measured gain: embeddings represent input; the model generates text. Token marks are illustrative, and value must be checked against the intended result.",
  },
  "ontology-of-terms": {
    index: "04",
    eyebrow: "Coordination",
    title: "Ontology coordinates terms of art to make them actionable",
    description:
      "An ontology repeats terms of art as concept labels and coordinates them through typed relationships and constraints.",
    caption:
      "The repeated shape is a term of art. More precisely, an ontology maps the concepts those expressions designate; typed relationships coordinate them into a shared model.",
  },
  "term-of-art-to-implementation": {
    index: "03",
    eyebrow: "Understanding",
    title: "Understanding carries a term into implementation",
    description:
      "A term of art enters a situated working model, where context, evidence, and stakes make its shared constraints actionable in a concrete implementation.",
    caption:
      "Knowing the term is not yet understanding. Understanding preserves its distinctions in a situated model, predicts what should follow, and makes a concrete implementation possible to test and revise.",
  },
} as const;

export type AiFactoryMotifVariant = keyof typeof motifContent;

function IconMorpheme({ refined = false, x = 80, y = 80, scale = 1, showCenter = true }: { refined?: boolean; x?: number; y?: number; scale?: number; showCenter?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><circle className={refined ? "ai-factory-icon__morpheme ai-factory-icon__morpheme--refined" : "ai-factory-icon__morpheme"} cx="0" cy="0" r="32" />{showCenter ? <path className="ai-factory-icon__morpheme-center-line ai-factory-icon__text-line" d="M-8 0H8" /> : null}</g>;
}

function VisionGlyph() {
  return <><circle className="ai-factory-icon__vision-center" cx="80" cy="80" r="12" /><path className="ai-factory-icon__vision-edge" d="M80 36V56M80 104V124M36 80H56M104 80H124" /></>;
}

function SelfGlyph() {
  return <circle className="ai-factory-icon__self-dot" cx="80" cy="80" r="8" />;
}

function ValueGlyph() {
  return <>
    <SelfGlyph />
    <path className="ai-factory-icon__value-edge" d="M80 24V52" />
    <path className="ai-factory-icon__value-edge" d="M108 80H136" />
    <path className="ai-factory-icon__value-edge" d="M80 108V136" />
    <path className="ai-factory-icon__value-edge" d="M24 80H52" />
    <path className="ai-factory-icon__value-edge" d="M40 40L60 60" />
    <path className="ai-factory-icon__value-edge" d="M100 60L120 40" />
    <path className="ai-factory-icon__value-edge" d="M100 100L120 120" />
    <path className="ai-factory-icon__value-edge" d="M40 120L60 100" />
  </>;
}

/**
 * The isolated primitives used by the AI Factory motif. These stay deliberately
 * small and composable: a page, figure, graph, or workflow can reuse the same
 * semantic marks without importing one of the composed chapter diagrams.
 */
function TruthPracticeGlyph({ kind }: { kind: "truth" | "coherence" | "correspondence" | "consequence" }) {
  // A 96-unit side keeps the truth family equilateral and identically sized.
  const height = 96 * Math.sqrt(3) / 2;
  const left = 80 - height / 2;
  const right = 80 + height / 2;
  const center = left + height / 3;
  const rotation = kind === "truth" || kind === "coherence" ? -90 : kind === "correspondence" ? 90 : 0;

  return (
    <g transform={`rotate(${rotation} 80 80)`}>
      <path className={`ai-factory-icon__truth-triangle${kind === "truth" ? " ai-factory-icon__truth-triangle--dotted" : ""}`} d={`M${left} 32L${right} 80L${left} 128Z`} />
      {kind === "coherence" ? <>
        <path className="ai-factory-icon__coherence-spokes" d={`M${center} 80L${left} 32M${center} 80H${right}M${center} 80L${left} 128`} />
        <circle className="ai-factory-icon__coherence-center" cx={center} cy="80" r="6" />
      </> : kind === "correspondence" ? <>
        <circle className="ai-factory-icon__truth-vertex" cx={left} cy="32" r="7" />
        <circle className="ai-factory-icon__truth-vertex" cx={left} cy="128" r="7" />
        <circle className="ai-factory-icon__truth-vertex" cx={right} cy="80" r="7" />
      </> : kind === "consequence" ? <>
        <path className="ai-factory-icon__consequence-path" d={`M${left} 80H${right}`} />
        <circle className="ai-factory-icon__consequence-outcome" cx={right} cy="80" r="7" />
      </> : null}
    </g>
  );
}

function UnderstandingGlyph({ showEdges = true }: { showEdges?: boolean }) {
  return <>
    {showEdges ? <>
      <path className="ai-factory-icon__understanding-edge ai-factory-icon__understanding-edge--cardinal" d="M80 28V48M80 112V132M28 80H48M112 80H132" />
      <path className="ai-factory-icon__understanding-edge ai-factory-icon__understanding-edge--diagonal" d="M43 43L58 58M102 102L117 117M117 43L102 58M58 102L43 117" />
    </> : null}
    <circle className="ai-factory-icon__understanding-boundary" cx="80" cy="80" r="32" />
    <circle className="ai-factory-icon__understanding-core" cx="80" cy="80" r="5" />
  </>;
}

function AiFactoryIconGlyph({ kind }: { kind: AiFactoryIconKind }) {
  const instanceId = useId();
  const markerId = `ai-factory-icon-arrow-${instanceId.replace(/:/g, "")}`;
  const outlineArrow = kind === "implementation" || kind === "automation";
  return (
    <>
      <defs>
        <marker id={markerId} markerWidth="8" markerHeight="8" refX={outlineArrow ? 0 : 7} refY="4" orient="auto" markerUnits={outlineArrow ? "userSpaceOnUse" : "strokeWidth"} overflow="visible">
          <path className={outlineArrow ? "ai-factory-icon__arrowhead--outline" : undefined} d="M0 0L8 4L0 8Z" />
        </marker>
      </defs>
      {kind === "vision" ? <VisionGlyph /> : null}
      {kind === "value" ? <ValueGlyph /> : null}
      {kind === "self" ? <SelfGlyph /> : null}
      {kind === "others" ? <>
        <circle className="ai-factory-icon__others-dot" cx="64" cy="80" r="8" />
        <circle className="ai-factory-icon__others-dot" cx="88" cy="66" r="8" />
        <circle className="ai-factory-icon__others-dot" cx="88" cy="94" r="8" />
      </> : null}
      {kind === "goal" ? <><IconMorpheme showCenter={false} /><VisionGlyph /></> : null}
      {kind === "meaning" ? <><circle className="ai-factory-icon__meaning-core" cx="80" cy="80" r="5" /><circle className="ai-factory-icon__meaning-boundary" cx="80" cy="80" r="32" /><path className="ai-factory-icon__meaning-edge ai-factory-icon__meaning-edge--diagonal" d="M43 43L58 58M102 102L117 117M117 43L102 58M58 102L43 117" /></> : null}
      {kind === "inference" ? <>
        <path className="ai-factory-icon__inference-path" d="M36 80H72M72 44V116M72 44H128M72 80H128M72 116H128" />
        <circle className="ai-factory-icon__inference-junction" cx="28" cy="80" r="8" />
        <circle className="ai-factory-icon__inference-output" cx="136" cy="44" r="8" />
        <circle className="ai-factory-icon__inference-output" cx="136" cy="80" r="8" />
        <circle className="ai-factory-icon__inference-output" cx="136" cy="116" r="8" />
      </> : null}
      {kind === "truth" || kind === "coherence" || kind === "correspondence" || kind === "consequence" ? <TruthPracticeGlyph kind={kind} /> : null}
      {kind === "morpheme-diffuse" ? <IconMorpheme /> : null}
      {kind === "morpheme-refined" ? <IconMorpheme refined /> : null}
      {kind === "text" || kind === "label" ? <>
        <path className="ai-factory-icon__text-line" d="M24 52H60M68 52H104M112 52H136M24 80H48M56 80H104M112 80H136M24 108H72M80 108H116M124 108H136" />
        {kind === "label" ? <rect className="ai-factory-icon__text-highlight" x="56" y="72" width="48" height="16" /> : null}
      </> : null}
      {kind === "token" ? (
        <g className="ai-factory-icon__token-sequence">
          <rect className="ai-factory-icon__token-segment ai-factory-icon__token-segment--one" x="24" y="64" width="24" height="32" />
          <rect className="ai-factory-icon__token-segment ai-factory-icon__token-segment--two" x="48" y="64" width="32" height="32" />
          <rect className="ai-factory-icon__token-segment ai-factory-icon__token-segment--three" x="80" y="64" width="20" height="32" />
          <rect className="ai-factory-icon__token-segment ai-factory-icon__token-segment--four" x="100" y="64" width="28" height="32" />
        </g>
      ) : null}
      {kind === "embedding" ? (
        <g className="ai-factory-icon__embedding-matrix">
          {[
            ["one", "two", "three", "four"],
            ["four", "one", "two", "three"],
            ["two", "three", "four", "one"],
            ["three", "four", "one", "two"],
          ].flatMap((row, rowIndex) => row.map((shade, columnIndex) => (
            <rect
              key={`${rowIndex}-${columnIndex}`}
              className={`ai-factory-icon__embedding-cell ai-factory-icon__token-segment ai-factory-icon__token-segment--${shade}`}
              x={33 + columnIndex * 24}
              y={33 + rowIndex * 24}
              width="22"
              height="22"
            />
          )))}
        </g>
      ) : null}
      {kind === "term-of-art" ? <>
        <path className="ai-factory-icon__term-edge" d="M80 28V48M80 112V132M28 80H48M112 80H132" />
        <IconMorpheme refined />
      </> : null}
      {kind === "understanding" ? <UnderstandingGlyph /> : null}
      {kind === "bottleneck" ? <>
        <path className="ai-factory-icon__bottleneck-flow" d="M36 44H92M36 80H128M36 116H92" />
        <path className="ai-factory-icon__bottleneck-boundary" d="M92 32V56M92 104V128" />
        <path className="ai-factory-icon__bottleneck-throat" d="M92 68V92M100 68V92" />
        <circle className="ai-factory-icon__bottleneck-input" cx="28" cy="44" r="8" />
        <circle className="ai-factory-icon__bottleneck-input" cx="28" cy="80" r="8" />
        <circle className="ai-factory-icon__bottleneck-input" cx="28" cy="116" r="8" />
        <circle className="ai-factory-icon__bottleneck-output" cx="136" cy="80" r="8" />
      </> : null}
      {kind === "implementation" ? <>
        <circle className="ai-factory-icon__implementation-boundary" cx="64" cy="80" r="12" />
        <circle className="ai-factory-icon__implementation-core" cx="64" cy="80" r="4" />
        <path className="ai-factory-icon__action-vector" d="M76 80H124" markerEnd={`url(#${markerId})`} />
      </> : null}
      {kind === "automation" ? <>
        <UnderstandingGlyph showEdges={false} />
        <path className="ai-factory-icon__automation-action" d="M112 80H132" />
        <circle className="ai-factory-icon__automation-node" cx="144" cy="80" r="12" />
        <circle className="ai-factory-icon__automation-node-core" cx="144" cy="80" r="2" />
        <path className="ai-factory-icon__action-vector" d="M156 80H180" markerEnd={`url(#${markerId})`} />
      </> : null}
      {kind === "ontology-node" ? <>
        <path className="ai-factory-icon__ontology-edge" d="M28 80H48M80 112V132" />
        <path className="ai-factory-icon__ontology-edge ai-factory-icon__ontology-edge--connected" d="M80 28V48M112 80H132" />
        <circle className="ai-factory-icon__ontology-root" cx="80" cy="80" r="32" />
        <path className="ai-factory-icon__ontology-root-core ai-factory-icon__text-line" d="M72 80H88" />
        <circle className="ai-factory-icon__ontology-term" cx="80" cy="16" r="12" />
        <circle className="ai-factory-icon__ontology-term" cx="144" cy="80" r="12" />
        <path className="ai-factory-icon__ontology-term-core ai-factory-icon__text-line" d="M77 16H83" />
        <path className="ai-factory-icon__ontology-term-core ai-factory-icon__text-line" d="M141 80H147" />
      </> : null}
      {kind === "typed-relation" ? <>
        <path className="ai-factory-icon__relation-line" d="M24 80H136" markerEnd={`url(#${markerId})`} />
        <ConnectorLabel x={80} y={80} onEdge />
      </> : null}
      {kind === "disconnected" ? <>
        <path className="ai-factory-icon__disconnected-ends" d="M32 80H56M56 68V92M104 68V92M104 80H128" />
        <path className="ai-factory-icon__disconnected-mark" d="M72 72L88 88M88 72L72 88" />
      </> : null}
      {kind === "operator" ? <><circle className="ai-factory-icon__operator" cx="80" cy="80" r="22" /><path className="ai-factory-icon__operator-mark" d="M68 80H92M80 68V92" /></> : null}
    </>
  );
}

export function AiFactoryIcon({ kind, label = aiFactoryIconLabel(kind) }: { kind: AiFactoryIconKind; label?: string }) {
  return (
    <svg className={`ai-factory-icon ai-factory-icon--${kind}`} viewBox="0 0 160 160" role="img" aria-label={label}>
      <AiFactoryIconGlyph kind={kind} />
    </svg>
  );
}

function MotifGlyph({ kind, x, y, scale = 1, centerX = 80 }: { kind: AiFactoryIconKind; x: number; y: number; scale?: number; centerX?: number }) {
  return (
    <g className={`ai-factory-motif__primitive ai-factory-icon ai-factory-icon--${kind}`} transform={`translate(${x} ${y}) scale(${scale}) translate(-${centerX} -80)`} aria-hidden="true">
      <AiFactoryIconGlyph kind={kind} />
    </g>
  );
}

// Full automation span: the large circle begins at 48 and the arrow tip ends at 188.
const automationVisualCenterX = (48 + 188) / 2;

const seriesMapArticles: Array<{
  index: string;
  stage: string;
  title: string;
  href: string;
  sourceIcon: AiFactoryIconKind;
  targetIcon: AiFactoryIconKind;
  sourceLabel: string;
  targetLabel: string;
  relationship: string;
  flywheel?: boolean;
  summary: string;
}> = [
  {
    index: "01",
    stage: "Direction",
    title: "Vision and Values",
    href: "/writing/vision-and-values",
    sourceIcon: "vision",
    targetIcon: "value",
    sourceLabel: "Vision",
    targetLabel: "Values",
    relationship: "GOVERNS",
    summary: "Human experience and values choose the goals, authority, and corrections that guide AI.",
  },
  {
    index: "02",
    stage: "Prediction",
    title: "Truth and Inference",
    href: "/writing/truth-and-inference",
    sourceIcon: "truth",
    targetIcon: "inference",
    sourceLabel: "Truth",
    targetLabel: "Inference",
    relationship: "CONSTRAINS",
    summary: "Language patterns become conditional predictions whose value depends on truth-bearing constraint.",
  },
  {
    index: "03",
    stage: "Understanding",
    title: "Understanding and Bottlenecks",
    href: "/writing/understanding-and-bottlenecks",
    sourceIcon: "understanding",
    targetIcon: "bottleneck",
    sourceLabel: "Understanding",
    targetLabel: "Bottlenecks",
    relationship: "REVEALS",
    summary: "Shared, testable understanding—not plausible output—becomes the bottleneck to coordinated action.",
  },
  {
    index: "04",
    stage: "Production",
    title: "The Knowledge Factory",
    href: "/writing/the-knowledge-factory",
    sourceIcon: "ontology-node",
    targetIcon: "automation",
    sourceLabel: "Ontology",
    targetLabel: "Automation",
    relationship: "SYSTEMATIZES",
    flywheel: true,
    summary: "Ontology and automation can form a flywheel, so long as they remain grounded in understanding.",
  },
  {
    index: "05",
    stage: "Coherence",
    title: "Ontology Factory",
    href: "/writing/the-ontology-factory",
    sourceIcon: "understanding",
    targetIcon: "ontology-node",
    sourceLabel: "Understanding",
    targetLabel: "Ontology",
    relationship: "FORMALIZES",
    summary: "Ownership, concepts, constraints, and typed relationships make the factory navigable and checkable.",
  },
  {
    index: "06",
    stage: "Cognition",
    title: "Cognitive Factory",
    href: "/writing/the-cognitive-factory",
    sourceIcon: "automation",
    targetIcon: "understanding",
    sourceLabel: "Automation",
    targetLabel: "Understanding",
    relationship: "FEEDS",
    summary: "Sensors and decision graphs turn operational evidence into governed action and feedback.",
  },
];

function KnowledgeFlywheel() {
  const id = useId();

  return (
    <div className="ai-factory-series-map__equation ai-factory-series-map__equation--flywheel">
      <svg className="ai-factory-series-map__flywheel" viewBox="0 0 320 192" role="img" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`}>
        <title id={`${id}-title`}>Ontology and automation flywheel</title>
        <desc id={`${id}-description`}>Ontology systematizes automation. Learning from automation informs ontology. They can form a reinforcing flywheel so long as they remain grounded in understanding.</desc>
        <defs>
          <marker id={`${id}-arrow`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0 0L6 3L0 6" />
          </marker>
        </defs>
        <g className="ai-factory-series-map__flywheel-paths" markerEnd={`url(#${id}-arrow)`}>
          <path d="M108 72A64 64 0 0 1 212 72" />
          <path d="M212 108A64 64 0 0 1 108 108" />
        </g>
        <g className="ai-factory-series-map__flywheel-relations">
          <ConnectorLabel x={160} y={46} onEdge>SYSTEMATIZES</ConnectorLabel>
          <ConnectorLabel x={160} y={134} onEdge>INFORMS</ConnectorLabel>
        </g>
        <g className="ai-factory-series-map__flywheel-concept">
          <MotifGlyph kind="ontology-node" x={64} y={92} scale={0.6} />
          <text x="64" y="144">Ontology</text>
        </g>
        <g className="ai-factory-series-map__flywheel-concept">
          <MotifGlyph kind="automation" x={244} y={92} scale={0.6} />
          <text x="244" y="144">Automation</text>
        </g>
      </svg>
    </div>
  );
}

export function AiFactorySeriesMap() {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <figure className="ai-factory-series-map" aria-labelledby={`${titleId} ${descriptionId}`}>
      <header className="ai-factory-series-map__header">
        <p>AI Factory · Series map</p>
        <div>
          <h2 id={titleId}>Six essays describe one operating system.</h2>
          <p id={descriptionId}>
            The series moves from human direction, through prediction and understanding, into the factories that
            produce, coordinate, and learn.
          </p>
        </div>
      </header>
      <p className="ai-factory-series-map__scroll-cue">Scroll the series →</p>
      <div className="ai-factory-series-map__viewport" role="region" tabIndex={0} aria-label="Scrollable AI Factory article map">
        <ol className="ai-factory-series-map__track">
          {seriesMapArticles.map((article, articleIndex) => (
            <li className="ai-factory-series-map__item" key={article.href}>
              <a href={article.href}>
                <div className="ai-factory-series-map__meta">
                  <span>{article.index}</span>
                  <span>{article.stage}</span>
                </div>
                {article.flywheel ? <KnowledgeFlywheel /> : (
                  <div className="ai-factory-series-map__equation" aria-hidden="true">
                    <svg className="ai-factory-series-map__pair" viewBox="0 0 320 192">
                      <g className="ai-factory-series-map__concept">
                        <MotifGlyph kind={article.sourceIcon} x={64} y={92} scale={0.6} centerX={article.sourceIcon === "automation" ? automationVisualCenterX : 80} />
                        <text x="64" y="144">{article.sourceLabel}</text>
                      </g>
                      <text className="ai-factory-series-map__relationship" x="154" y="96">{article.relationship}</text>
                      <g className="ai-factory-series-map__concept">
                        <MotifGlyph kind={article.targetIcon} x={244} y={92} scale={0.6} />
                        <text x="244" y="144">{article.targetLabel}</text>
                      </g>
                    </svg>
                  </div>
                )}
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
              </a>
              {articleIndex % 3 !== 2 ? (
                <span className="ai-factory-series-map__connector" aria-hidden="true">→</span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
      <figcaption>
        Direction → prediction → understanding → production → coherence → cognition. Each factory preserves the
        human-governed intent established at the beginning of the series.
      </figcaption>
    </figure>
  );
}

function ConnectorLabel({ x, y, children = "", onEdge = false }: { x: number; y: number; children?: string; onEdge?: boolean }) {
  // 8-unit IBM Plex Mono + tracking, 6-unit side padding, snapped to a 4-unit grid.
  // Keep in sync with --ai-factory-type-edge and --ai-factory-tracking-label.
  const width = Math.max(40, Math.ceil((children.length * 5.6 + 12) / 4) * 4);
  const height = 16;

  return (
    <g className={`ai-factory-motif__connector-label${onEdge ? " ai-factory-motif__connector-label--on-edge" : ""}`} aria-hidden="true">
      <rect x={x - width / 2} y={y - (onEdge ? height / 2 : 12)} width={width} height={height} />
      {children ? <text x={x} y={y} textAnchor="middle" dominantBaseline={onEdge ? "middle" : undefined}>
        {children}
      </text> : null}
    </g>
  );
}

function StationFrame({ x, focal = false }: { x: number; focal?: boolean }) {
  return <rect className={focal ? "ai-factory-motif__station ai-factory-motif__station--focal" : "ai-factory-motif__station"} x={x} y="56" width="184" height="184" />;
}

function StationLabel({ x, label, detail }: { x: number; label: string; detail: string }) {
  return (
    <g>
      <text className="ai-factory-motif__label" x={x} y="208" textAnchor="middle">
        {label}
      </text>
      <text className="ai-factory-motif__detail" x={x} y="224" textAnchor="middle">
        {detail}
      </text>
    </g>
  );
}

function ExperienceButLacking({ arrowId }: { arrowId: string }) {
  return (
    <>
      <rect className="ai-factory-motif__station" x="40" y="56" width="300" height="296" />
      <text className="ai-factory-motif__experience-eyebrow" x="64" y="84">PERSONAL EXPERIENCE</text>
      <g className="ai-factory-motif__connectors" aria-hidden="true">
        <path className="ai-factory-motif__connector--focal" d="M156 184H216" markerEnd={`url(#${arrowId})`} />
        <path className="ai-factory-motif__experience-gap" data-gap="communication" d="M388 124H496" />
        <path className="ai-factory-motif__experience-gap" data-gap="value" d="M388 284H496" />
      </g>
      <MotifGlyph kind="disconnected" x={364} y={124} scale={0.5} />
      <MotifGlyph kind="disconnected" x={364} y={284} scale={0.5} />
      <MotifGlyph kind="vision" x={116} y={184} scale={0.75} />
      <MotifGlyph kind="meaning" x={260} y={184} scale={0.75} />
      <text className="ai-factory-motif__label" x="116" y="252" textAnchor="middle">Experience</text>
      <text className="ai-factory-motif__label" x="260" y="252" textAnchor="middle">Meaning</text>
      <g className="ai-factory-motif__experience-outcome" data-outcome="communication">
        <rect x="496" y="56" width="264" height="136" />
        <text className="ai-factory-motif__label" x="628" y="80" textAnchor="middle">Shared understanding</text>
        <g className="ai-factory-motif__connectors" aria-hidden="true">
          <path data-relationship="text-to-understanding" d="M556 112H652" markerEnd={`url(#${arrowId})`} />
          <ConnectorLabel x={600} y={112} onEdge>LEADS TO</ConnectorLabel>
        </g>
        <MotifGlyph kind="text" x={532} y={112} scale={0.32} />
        <MotifGlyph kind="understanding" x={684} y={112} scale={0.4} />
        <text className="ai-factory-motif__detail" x="628" y="176" textAnchor="middle">not yet communicated</text>
      </g>
      <g className="ai-factory-motif__experience-outcome" data-outcome="value">
        <rect x="496" y="216" width="264" height="136" />
        <text className="ai-factory-motif__label" x="628" y="240" textAnchor="middle">Value lies within relationships</text>
        <g className="ai-factory-motif__connectors" aria-hidden="true">
          <path className="ai-factory-motif__connector--focal" data-relationship="value-between-people" d="M550 284H602M654 284H694" />
        </g>
        <MotifGlyph kind="self" x={544} y={284} scale={0.75} />
        <MotifGlyph kind="value" x={628} y={284} scale={0.4} />
        <MotifGlyph kind="others" x={712} y={284} scale={0.75} />
        <text className="ai-factory-motif__label" x="544" y="320" textAnchor="middle">Self</text>
        <text className="ai-factory-motif__label" x="712" y="320" textAnchor="middle">Others</text>
        <text className="ai-factory-motif__detail" x="628" y="340" textAnchor="middle">not yet substantiated</text>
      </g>
      <g className="ai-factory-motif__axis" aria-hidden="true">
        <path d="M40 384H760" />
        <text x="40" y="408">MEANING FOR ME</text>
        <text x="760" y="408" textAnchor="end">MISSING BRIDGES TO OTHERS</text>
      </g>
    </>
  );
}

function ModelPrioritiesAndGoalFit({ arrowId }: { arrowId: string }) {
  const statements = [
    { label: "Subjective claim", example: "“It feels right to me.”", y: 212 },
    { label: "Incomplete context", example: "“Make it better.”", y: 276 },
    { label: "Conflicting requests", example: "“Be brief. Include everything.”", y: 340 },
  ];

  return (
    <>
      <g className="ai-factory-motif__connectors" aria-hidden="true">
        <path data-influence="training" d="M400 136V200" markerEnd={`url(#${arrowId})`} />
        <path data-influence="harness" d="M592 136V200" markerEnd={`url(#${arrowId})`} />
        {statements.map(({ y, label }) => <path key={label} data-relationship="statement-to-model" d={`M232 ${y + 24}H312`} markerEnd={`url(#${arrowId})`} />)}
        <path data-relationship="model-to-response" d="M672 300H744" markerEnd={`url(#${arrowId})`} />
        <path className="ai-factory-motif__experience-gap" data-relationship="unverified-goal-fit" d="M836 408V416M836 448V468" />
        <ConnectorLabel x={400} y={168} onEdge>SHAPES</ConnectorLabel>
        <ConnectorLabel x={592} y={168} onEdge>STEERS</ConnectorLabel>
      </g>

      <g data-influence-source="training">
        <rect className="ai-factory-motif__station" x="320" y="40" width="160" height="96" />
        <text className="ai-factory-motif__label" x="400" y="68" textAnchor="middle">Training priorities</text>
        <text className="ai-factory-motif__detail" x="400" y="92" textAnchor="middle">data · rewards · feedback</text>
        <text className="ai-factory-motif__detail" x="400" y="116" textAnchor="middle">learned behavior</text>
      </g>
      <g data-influence-source="harness">
        <rect className="ai-factory-motif__station" x="512" y="40" width="160" height="96" />
        <text className="ai-factory-motif__label" x="592" y="68" textAnchor="middle">Runtime harness</text>
        <text className="ai-factory-motif__detail" x="592" y="92" textAnchor="middle">instructions · tools · policy</text>
        <text className="ai-factory-motif__detail" x="592" y="116" textAnchor="middle">configured behavior</text>
      </g>

      <text className="ai-factory-motif__embedding-eyebrow" x="40" y="188">MANY STATEMENTS · NO SHARED CRITERIA</text>
      {statements.map(({ label, example, y }) => (
        <g key={label} data-input-statement={label}>
          <rect className="ai-factory-motif__station" x="40" y={y} width="192" height="52" />
          <text className="ai-factory-motif__label ai-factory-motif__embedding-compact" x="56" y={y + 20}>{label}</text>
          <text className="ai-factory-motif__detail" x="56" y={y + 40}>{example}</text>
        </g>
      ))}

      <g data-stage="conditioned-model">
        <rect className="ai-factory-motif__station" x="320" y="208" width="352" height="200" />
        <text className="ai-factory-motif__embedding-eyebrow" x="340" y="236">REPRESENTATION → GENERATION</text>
        <g className="ai-factory-motif__connectors" aria-hidden="true">
          <path data-relationship="embedding-to-inference" d="M448 300H532" markerEnd={`url(#${arrowId})`} />
        </g>
        <MotifGlyph kind="embedding" x={404} y={300} scale={0.64} />
        <MotifGlyph kind="inference" x={584} y={300} scale={0.6} />
        <text className="ai-factory-motif__label" x="404" y="356" textAnchor="middle">Embedding space</text>
        <text className="ai-factory-motif__label" x="584" y="356" textAnchor="middle">Inference</text>
        <text className="ai-factory-motif__detail" x="404" y="380" textAnchor="middle">encodes supplied tokens</text>
        <text className="ai-factory-motif__detail" x="584" y="380" textAnchor="middle">generates a continuation</text>
      </g>

      <g data-stage="unverified-response">
        <rect className="ai-factory-motif__station" x="752" y="208" width="168" height="200" />
        <text className="ai-factory-motif__label" x="836" y="236" textAnchor="middle">Fluent response</text>
        <MotifGlyph kind="text" x={836} y={296} scale={0.76} />
        <text className="ai-factory-motif__label ai-factory-motif__embedding-compact" x="836" y="356" textAnchor="middle">May mislead</text>
        <text className="ai-factory-motif__label ai-factory-motif__embedding-compact" x="836" y="380" textAnchor="middle">or miss the goal</text>
      </g>
      <g transform="rotate(90 836 432)">
        <MotifGlyph kind="disconnected" x={836} y={432} scale={0.32} />
      </g>
      <g data-stage="user-goal">
        <rect className="ai-factory-motif__station ai-factory-motif__station--focal" x="752" y="468" width="168" height="80" />
        <MotifGlyph kind="goal" x={780} y={504} scale={0.32} />
        <text className="ai-factory-motif__label ai-factory-motif__embedding-compact" x="808" y="500">Your actual goal</text>
        <text className="ai-factory-motif__detail" x="808" y="524">fit not established</text>
      </g>
      <text className="ai-factory-motif__label" x="40" y="480">Behavioral priorities ≠ insight into your values</text>
      <text className="ai-factory-motif__priorities-note" x="40" y="508">Without evidence, context, and success criteria,</text>
      <text className="ai-factory-motif__priorities-note" x="40" y="528">more statements can leave the same ambiguity unresolved.</text>
      <g className="ai-factory-motif__axis" aria-hidden="true">
        <path d="M40 580H920" />
        <text x="40" y="604">POSSIBLE FAILURE PATH · NOT AN INEVITABLE OUTCOME</text>
        <text x="920" y="604" textAnchor="end">FLUENCY ≠ GOAL FIT</text>
      </g>
    </>
  );
}

function VisionToMorpheme({ arrowId }: { arrowId: string }) {
  return (
    <>
      <g className="ai-factory-motif__connectors" aria-hidden="true">
        <path d="M224 136H264" markerEnd={`url(#${arrowId})`} />
        <path d="M456 136H488" markerEnd={`url(#${arrowId})`} />
        <ConnectorLabel x={244} y={116}>BECOMES</ConnectorLabel>
        <ConnectorLabel x={472} y={116}>EXPRESSED AS</ConnectorLabel>
      </g>
      <StationFrame x={40} />
      <StationFrame x={272} />
      <StationFrame x={496} focal />
      <MotifGlyph kind="vision" x={132} y={136} />
      <MotifGlyph kind="meaning" x={364} y={136} />
      <MotifGlyph kind="morpheme-diffuse" x={588} y={136} />
      <StationLabel x={132} label="Vision" detail="felt possibility" />
      <StationLabel x={364} label="Meaning" detail="directed significance" />
      <StationLabel x={588} label="Idea" detail="meaning taking shape" />
      <Axis left="VISION" middle="MEANING" right="EXPRESSION" />
    </>
  );
}

function RefinementAndDisciplineToTermOfArt({ arrowId }: { arrowId: string }) {
  return (
    <>
      <g className="ai-factory-motif__connectors" aria-hidden="true">
        <path d="M228 152H324" />
        <path className="ai-factory-motif__practice-input" data-practice="discipline" d="M360 104V120" markerEnd={`url(#${arrowId})`} />
        <path className="ai-factory-motif__practice-input" data-practice="refinement" d="M360 200V184" markerEnd={`url(#${arrowId})`} />
        <path className="ai-factory-motif__connector--focal" d="M384 152H484" markerEnd={`url(#${arrowId})`} />
        <ConnectorLabel x={432} y={152} onEdge>ESTABLISHES</ConnectorLabel>
      </g>
      <rect className="ai-factory-motif__station" x="44" y="64" width="184" height="184" />
      <rect className="ai-factory-motif__station ai-factory-motif__station--focal" x="492" y="64" width="184" height="184" />
      <MotifGlyph kind="morpheme-refined" x={136} y={136} />
      <MotifGlyph kind="term-of-art" x={584} y={136} />
      <MotifGlyph kind="operator" x={360} y={152} scale={0.72} />
      <g className="ai-factory-motif__practice" data-practice="discipline">
        <rect x="272" y="24" width="176" height="80" />
        <text className="ai-factory-motif__label" x="360" y="48" textAnchor="middle">Discipline</text>
        <text className="ai-factory-motif__detail" x="360" y="68" textAnchor="middle">continuity · clarification</text>
        <text className="ai-factory-motif__detail" x="360" y="82" textAnchor="middle">specification</text>
      </g>
      <g className="ai-factory-motif__practice" data-practice="refinement">
        <rect x="272" y="200" width="176" height="56" />
        <text className="ai-factory-motif__label" x="360" y="224" textAnchor="middle">Refinement</text>
        <text className="ai-factory-motif__detail" x="360" y="244" textAnchor="middle">definition · evidence · correction</text>
      </g>
      <StationLabel x={136} label="Idea" detail="shared meaning" />
      <StationLabel x={584} label="Term of art" detail="consistent within a domain" />
      <Axis left="MEANING POTENTIAL" middle="REFINEMENT + DISCIPLINE" right="STABLE TERM" />
    </>
  );
}

function EmbeddingTokenStrip({ x, y, rows = 1, columns = 8 }: { x: number; y: number; rows?: number; columns?: number }) {
  const shades = ["one", "two", "three", "four"];
  return (
    <g className="ai-factory-motif__embedding-tokens" aria-hidden="true">
      {Array.from({ length: rows * columns }, (_, index) => (
        <rect key={index} className={`ai-factory-icon__token-segment ai-factory-icon__token-segment--${shades[index % shades.length]}`} x={x + (index % columns) * 18} y={y + Math.floor(index / columns) * 12} width="16" height="8" />
      ))}
    </g>
  );
}

function EmbeddingContrastLane({ grounded, arrowId }: { grounded: boolean; arrowId: string }) {
  return (
    <g data-lane={grounded ? "grounded" : "ungrounded"} transform={grounded ? undefined : "translate(0 288)"}>
      <text className={`ai-factory-motif__embedding-eyebrow${grounded ? " ai-factory-motif__embedding-eyebrow--focal" : ""}`} x="40" y="76">{grounded ? "01 / WITH UNDERSTANDING" : "02 / WITHOUT UNDERSTANDING"}</text>
      <g className="ai-factory-motif__connectors" aria-hidden="true">
        <path data-relationship="label-to-embedding" d="M160 168H232" markerEnd={`url(#${arrowId})`} />
        <path data-relationship="embedding-to-inference" d="M492 168H544" markerEnd={`url(#${arrowId})`} />
        <path className={grounded ? "ai-factory-motif__connector--focal" : undefined} data-relationship="inference-to-output" d="M632 168H708" markerEnd={`url(#${arrowId})`} />
        <ConnectorLabel x={668} y={168} onEdge>YIELDS</ConnectorLabel>
      </g>
      <g data-stage="input">
        <MotifGlyph kind="label" x={112} y={168} scale={0.65} />
        <EmbeddingTokenStrip x={86} y={200} columns={3} />
        <text className="ai-factory-motif__label" x="112" y="236" textAnchor="middle">Short label</text>
        <text className="ai-factory-motif__detail" x="112" y="256" textAnchor="middle">{grounded ? "shared term of art" : "unshared or ambiguous"}</text>
      </g>
      <g data-stage="representation">
        <rect className={`ai-factory-motif__station${grounded ? "" : " ai-factory-motif__embedding-unanchored"}`} x="248" y="104" width="244" height="176" />
        <MotifGlyph kind="embedding" x={268} y={124} scale={0.18} />
        <text className="ai-factory-motif__label" x="376" y="128" textAnchor="middle">Embedding space</text>
        <g className={grounded ? undefined : "ai-factory-motif__embedding-missing"}>
          <MotifGlyph kind="understanding" x={316} y={176} scale={0.52} />
        </g>
        <MotifGlyph kind={grounded ? "operator" : "disconnected"} x={368} y={176} scale={0.32} />
        <MotifGlyph kind={grounded ? "term-of-art" : "morpheme-diffuse"} x={420} y={176} scale={0.52} />
        <text className="ai-factory-motif__label ai-factory-motif__embedding-compact" x="316" y="216" textAnchor="middle">{grounded ? "Understanding" : "No grounding"}</text>
        <text className="ai-factory-motif__label ai-factory-motif__embedding-compact" x="420" y="216" textAnchor="middle">{grounded ? "Term of art" : "Loose meaning"}</text>
        <text className="ai-factory-motif__detail" x="370" y="256" textAnchor="middle">{grounded ? "shared domain distinctions" : "context and criteria absent"}</text>
      </g>
      <g data-stage="inference">
        <MotifGlyph kind="inference" x={588} y={168} scale={0.56} />
        <text className="ai-factory-motif__label" x="588" y="236" textAnchor="middle">Inference</text>
        <text className="ai-factory-motif__detail" x="588" y="256" textAnchor="middle">{grounded ? "guided by meaning" : "fluent, not grounded"}</text>
      </g>
      <g data-stage="output">
        <rect className={`ai-factory-motif__station${grounded ? " ai-factory-motif__station--focal" : ""}`} x="720" y="104" width="208" height="176" />
        <g className="ai-factory-motif__output-heading">
          <text className="ai-factory-motif__label" x={grounded ? 812 : 824} y="128" textAnchor="middle">{grounded ? "Useful expansion" : "Excess output"}</text>
          {grounded && <MotifGlyph kind="value" x={888} y={123} scale={0.2} />}
        </g>
        <g className="ai-factory-motif__generated-text" aria-hidden="true">
          {(grounded ? [148, 160, 172, 184] : [144, 154, 164, 174, 184, 194]).map((y, index) => (
            <path key={y} className="ai-factory-icon__text-line" d={`M736 ${y}H776M784 ${y}H${index % 2 ? 832 : 844}M${index % 2 ? 840 : 852} ${y}H876`} />
          ))}
        </g>
        <EmbeddingTokenStrip x={736} y={204} rows={grounded ? 2 : 3} />
        <text className="ai-factory-motif__label ai-factory-motif__embedding-compact" x="824" y="252" textAnchor="middle">{grounded ? "Fits the intended result" : "Does not fit the goal"}</text>
        <text className="ai-factory-motif__detail" x="824" y="272" textAnchor="middle">{grounded ? "more text · useful tokens" : "excess tokens · no added value"}</text>
      </g>
    </g>
  );
}

function UnderstandingInEmbeddingSpace({ arrowId }: { arrowId: string }) {
  return (
    <>
      <g className="ai-factory-motif__embedding-columns" aria-hidden="true">
        <text x="112" y="32" textAnchor="middle">SHORT INPUT</text>
        <text x="370" y="32" textAnchor="middle">REPRESENTATION</text>
        <text x="588" y="32" textAnchor="middle">GENERATION</text>
        <text x="824" y="32" textAnchor="middle">EXPANDED OUTPUT</text>
        <path d="M40 48H928M40 312H928" />
      </g>
      <EmbeddingContrastLane grounded arrowId={arrowId} />
      <EmbeddingContrastLane grounded={false} arrowId={arrowId} />
      <g className="ai-factory-motif__axis" aria-hidden="true">
        <path d="M40 600H928" />
        <text x="40" y="624">CONCEPTUAL CONTRAST · TOKEN MARKS ARE NOT COUNTS</text>
        <text x="928" y="624" textAnchor="end">VALUE ≠ VOLUME</text>
      </g>
    </>
  );
}

function TermOfArtToImplementation({ arrowId }: { arrowId: string }) {
  return (
    <>
      <g className="ai-factory-motif__connectors" aria-hidden="true">
        <path d="M196 136H296" markerEnd={`url(#${arrowId})`} />
        <path className="ai-factory-motif__connector--focal" d="M424 136H548" markerEnd={`url(#${arrowId})`} />
        <ConnectorLabel x={244} y={136} onEdge>APPLIED IN</ConnectorLabel>
        <ConnectorLabel x={484} y={136} onEdge>AFFORDS</ConnectorLabel>
      </g>
      <MotifGlyph kind="term-of-art" x={132} y={136} />
      <MotifGlyph kind="understanding" x={360} y={136} />
      <MotifGlyph kind="implementation" x={588} y={136} />
      <StationLabel x={132} label="Term of art" detail="shared domain constraint" />
      <StationLabel x={360} label="Understanding" detail="context · evidence · stakes" />
      <StationLabel x={588} label="Implementation" detail="decision · test · artifact" />
      <g className="ai-factory-motif__axis" aria-hidden="true">
        <path d="M40 260H680" />
        <text x="132" y="280" textAnchor="middle">SHARED TERM</text>
        <text x="360" y="280" textAnchor="middle">SITUATED MODEL</text>
        <text x="588" y="280" textAnchor="middle">CONCRETE ACTION</text>
      </g>
    </>
  );
}

function OntologyNode({ x, y, label, kind = "term-of-art", focal = false, labelBeside = false }: { x: number; y: number; label: string; kind?: AiFactoryIconKind; focal?: boolean; labelBeside?: boolean }) {
  return (
    <g className={focal ? "ai-factory-motif__ontology-node ai-factory-motif__ontology-node--focal" : "ai-factory-motif__ontology-node"}>
      <MotifGlyph kind={kind} x={x} y={y} scale={0.7} />
      <text className="ai-factory-motif__label" x={labelBeside ? x - 52 : focal ? x - 16 : x} y={labelBeside ? y : focal ? y + 36 : y + 52} textAnchor={labelBeside || focal ? "end" : "middle"}>{label}</text>
    </g>
  );
}

function OntologyOfTerms({ arrowId }: { arrowId: string }) {
  return (
    <>
      <g className="ai-factory-motif__connectors" aria-hidden="true">
        <path d="M148 200H320" markerEnd={`url(#${arrowId})`} />
        <path className="ai-factory-motif__connector--focal" d="M396 200H568" markerEnd={`url(#${arrowId})`} />
        <path d="M360 108V160" markerEnd={`url(#${arrowId})`} />
        <path d="M360 292V240" markerEnd={`url(#${arrowId})`} />
        <ConnectorLabel x={236} y={200} onEdge>PURSUES</ConnectorLabel>
        <ConnectorLabel x={484} y={200} onEdge>DIRECTS</ConnectorLabel>
        <ConnectorLabel x={360} y={136} onEdge>SUPPORTS</ConnectorLabel>
        <ConnectorLabel x={360} y={268} onEdge>BOUNDS</ConnectorLabel>
      </g>
      <OntologyNode x={112} y={200} label="Actor" />
      <OntologyNode x={360} y={200} label="Goal" kind="goal" focal />
      <OntologyNode x={608} y={200} label="Action" kind="automation" />
      <OntologyNode x={360} y={72} label="Evidence" labelBeside />
      <OntologyNode x={360} y={328} label="Constraint" labelBeside />
      <g className="ai-factory-motif__ontology-legend" aria-hidden="true">
        <path d="M40 384H680" />
        <text x="40" y="408">SHARED TERMS</text>
        <text x="360" y="408" textAnchor="middle">TYPED RELATIONSHIPS</text>
        <text x="680" y="408" textAnchor="end">ONE NAVIGABLE MODEL</text>
      </g>
    </>
  );
}

function Axis({ left, middle, right }: { left: string; middle: string; right: string }) {
  return (
    <g className="ai-factory-motif__axis" aria-hidden="true">
      <path d="M40 276H680" />
      <text x="40" y="296">{left}</text>
      <text x="360" y="296" textAnchor="middle">{middle}</text>
      <text x="680" y="296" textAnchor="end">{right}</text>
    </g>
  );
}

export function AiFactoryMotif({ variant }: { variant: AiFactoryMotifVariant }) {
  const content = motifContent[variant];
  const titleId = `ai-factory-motif-${variant}-title`;
  const descriptionId = `ai-factory-motif-${variant}-description`;
  const arrowId = `ai-factory-motif-${variant}-arrow`;

  return (
    <figure className="ai-factory-motif" data-variant={variant}>
      <header className="ai-factory-motif__header">
        <p>{`AI Factory · ${content.index} · ${content.eyebrow}`}</p>
        <h3>{content.title}</h3>
      </header>
      <p className="ai-factory-motif__scroll-cue">Scroll the path →</p>
      <div className="ai-factory-motif__viewport" role="region" tabIndex={0} aria-label="Scrollable AI Factory motif">
        <svg viewBox={variant === "ontology-of-terms" ? "0 0 720 432" : variant === "experience-but-lacking" ? "0 0 800 432" : variant === "model-priorities-and-goal-fit" ? "0 0 960 616" : variant === "understanding-in-embedding-space" ? "0 0 960 648" : "0 0 720 320"} role="img" aria-labelledby={`${titleId} ${descriptionId}`} preserveAspectRatio="xMidYMid meet">
          <title id={titleId}>{content.title}</title>
          <desc id={descriptionId}>{content.description}</desc>
          <defs>
            <marker id={arrowId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0 0L8 4L0 8Z" />
            </marker>
          </defs>
          {variant === "experience-but-lacking" ? <ExperienceButLacking arrowId={arrowId} /> : null}
          {variant === "model-priorities-and-goal-fit" ? <ModelPrioritiesAndGoalFit arrowId={arrowId} /> : null}
          {variant === "vision-to-morpheme" ? <VisionToMorpheme arrowId={arrowId} /> : null}
          {variant === "refinement-and-discipline-to-term-of-art" ? <RefinementAndDisciplineToTermOfArt arrowId={arrowId} /> : null}
          {variant === "understanding-in-embedding-space" ? <UnderstandingInEmbeddingSpace arrowId={arrowId} /> : null}
          {variant === "term-of-art-to-implementation" ? <TermOfArtToImplementation arrowId={arrowId} /> : null}
          {variant === "ontology-of-terms" ? <OntologyOfTerms arrowId={arrowId} /> : null}
        </svg>
      </div>
      <figcaption>
        {content.caption}
        {variant === "model-priorities-and-goal-fit" ? <span className="ai-factory-motif__evidence-note">
          Diogo Almeida, TypeSafe founder and GPT-4 coauthor, argues that “the end game for all … RLHF models is optimizing for engagement” in <a href="https://ai.engineer/talks/cJ0EOzey--o-jev-ceo-made-chatgpt-building-whats-next">his AI Engineer talk (7:38–7:56)</a>. This is his interpretation of preference-training incentives, not a universal objective of every model. The narrower risk is documented: <a href="https://www.anthropic.com/research/towards-understanding-sycophancy-in-language-models">preference training can favor agreement over truth</a>, and <a href="https://openai.com/index/sycophancy-in-gpt-4o/">OpenAI’s April 2025 account</a> links excessive reliance on short-term feedback to overly agreeable responses.
        </span> : null}
      </figcaption>
    </figure>
  );
}
