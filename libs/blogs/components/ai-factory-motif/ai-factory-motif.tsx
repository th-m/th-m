import "./ai-factory-motif.css";

const motifContent = {
  "vision-to-morpheme": {
    index: "01",
    eyebrow: "Expression",
    title: "Vision becomes a morpheme",
    description:
      "A vision gives rise to meaning, which is expressed as a context-sensitive morpheme with a still-diffuse boundary.",
    caption:
      "Vision exceeds what language can hold. Meaning gives part of it direction; a morpheme expresses a minimal unit of that meaning without fixing every possible interpretation.",
  },
  "refinement-and-discipline-to-term-of-art": {
    index: "02",
    eyebrow: "Refinement + discipline",
    title: "Refinement and discipline establish a term of art",
    description:
      "Refinement defines and corrects a context-sensitive morpheme; discipline sustains continuity, clarification, and specification until it becomes a term of art with a stable domain boundary.",
    caption:
      "Refinement supplies definition, evidence, and correction. Discipline supplies continuity, clarification, and specification. Together they narrow a morpheme, word, or phrase into a term of art.",
  },
  "ontology-of-terms": {
    index: "04",
    eyebrow: "Coordination",
    title: "Ontology coordinates terms of art",
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

function ConnectorLabel({ x, y, children }: { x: number; y: number; children: string }) {
  const width = Math.max(56, children.length * 6.4);

  return (
    <g className="ai-factory-motif__connector-label" aria-hidden="true">
      <rect x={x - width / 2} y={y - 12} width={width} height="16" />
      <text x={x} y={y} textAnchor="middle">
        {children}
      </text>
    </g>
  );
}

function MorphemeGlyph({
  x,
  y,
  state,
  focal = false,
  scale = 1,
}: {
  x: number;
  y: number;
  state: "diffuse" | "refined";
  focal?: boolean;
  scale?: number;
}) {
  const className = [
    "ai-factory-motif__morpheme",
    `ai-factory-motif__morpheme--${state}`,
    focal ? "ai-factory-motif__morpheme--focal" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <g className={className} transform={`translate(${x} ${y}) scale(${scale})`} aria-hidden="true">
      <circle className="ai-factory-motif__morpheme-core" cx="0" cy="0" r="32" />
      <circle className="ai-factory-motif__morpheme-center" cx="0" cy="0" r="5" />
    </g>
  );
}

function VisionGlyph() {
  return (
    <g className="ai-factory-motif__vision-glyph" aria-hidden="true">
      <circle className="ai-factory-motif__vision-center" cx="132" cy="136" r="12" />
      <path className="ai-factory-motif__vision-edge" d="M132 92V112" />
      <path className="ai-factory-motif__vision-edge" d="M132 160V180" />
      <path className="ai-factory-motif__vision-edge" d="M88 136H112" />
      <path className="ai-factory-motif__vision-edge" d="M152 136H176" />
    </g>
  );
}

function MeaningGlyph() {
  return (
    <g className="ai-factory-motif__meaning-glyph" aria-hidden="true">
      <circle cx="360" cy="136" r="12" />
      <path d="M360 92V112M360 160V180M316 136H336M384 136H404M328 104L344 120M376 152L392 168M392 104L376 120M344 152L328 168" />
      <circle cx="360" cy="136" r="32" />
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
      <VisionGlyph />
      <MeaningGlyph />
      <MorphemeGlyph x={588} y={136} state="diffuse" focal />
      <StationLabel x={132} label="Vision" detail="felt possibility" />
      <StationLabel x={364} label="Meaning" detail="directed significance" />
      <StationLabel x={588} label="Morpheme" detail="meaning expressed in language" />
      <Axis left="VISION" middle="MEANING" right="EXPRESSION" />
    </>
  );
}

function RefinementAndDisciplineToTermOfArt({ arrowId }: { arrowId: string }) {
  return (
    <>
      <g className="ai-factory-motif__connectors" aria-hidden="true">
        <path d="M228 152H336" />
        <path className="ai-factory-motif__practice-input" data-practice="discipline" d="M360 104V136" markerEnd={`url(#${arrowId})`} />
        <path className="ai-factory-motif__practice-input" data-practice="refinement" d="M360 200V168" markerEnd={`url(#${arrowId})`} />
        <path className="ai-factory-motif__connector--focal" d="M384 152H484" markerEnd={`url(#${arrowId})`} />
        <ConnectorLabel x={436} y={132}>ESTABLISHES</ConnectorLabel>
      </g>
      <rect className="ai-factory-motif__station" x="44" y="64" width="184" height="184" />
      <rect className="ai-factory-motif__station ai-factory-motif__station--focal" x="492" y="64" width="184" height="184" />
      <MorphemeGlyph x={136} y={136} state="diffuse" />
      <MorphemeGlyph x={584} y={136} state="refined" focal />
      <circle className="ai-factory-motif__operator" cx="360" cy="152" r="16" />
      <text className="ai-factory-motif__operator-label" x="360" y="158" textAnchor="middle">+</text>
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
      <StationLabel x={136} label="Morpheme" detail="context-sensitive meaning" />
      <StationLabel x={584} label="Term of art" detail="consistent within a domain" />
      <Axis left="MEANING POTENTIAL" middle="REFINEMENT + DISCIPLINE" right="STABLE TERM" />
    </>
  );
}

function UnderstandingGlyph() {
  return (
    <g className="ai-factory-motif__understanding-glyph" aria-hidden="true">
      <path className="ai-factory-motif__understanding-vision-edge" d="M364 92V112" />
      <path className="ai-factory-motif__understanding-vision-edge" d="M364 160V180" />
      <path className="ai-factory-motif__understanding-vision-edge" d="M320 136H344" />
      <path className="ai-factory-motif__understanding-vision-edge" d="M384 136H408" />
      <circle className="ai-factory-motif__understanding-term-boundary" cx="364" cy="136" r="32" />
      <circle className="ai-factory-motif__understanding-vision-center" cx="364" cy="136" r="12" />
      <circle className="ai-factory-motif__understanding-term-center" cx="364" cy="136" r="4" />
    </g>
  );
}

function ImplementationGlyph() {
  return (
    <g className="ai-factory-motif__implementation-glyph" aria-hidden="true">
      <rect x="548" y="100" width="80" height="72" />
      <circle cx="572" cy="136" r="16" />
      <circle className="ai-factory-motif__implementation-core" cx="572" cy="136" r="4" />
      <path d="M600 120H616M600 136H616M600 152H616" />
    </g>
  );
}

function TermOfArtToImplementation({ arrowId }: { arrowId: string }) {
  return (
    <>
      <g className="ai-factory-motif__connectors" aria-hidden="true">
        <path d="M224 136H264" markerEnd={`url(#${arrowId})`} />
        <path className="ai-factory-motif__connector--focal" d="M456 136H488" markerEnd={`url(#${arrowId})`} />
        <ConnectorLabel x={244} y={116}>APPLIED IN</ConnectorLabel>
        <ConnectorLabel x={472} y={116}>IMPLEMENTS</ConnectorLabel>
      </g>
      <StationFrame x={40} />
      <StationFrame x={272} focal />
      <StationFrame x={496} />
      <MorphemeGlyph x={132} y={136} state="refined" />
      <UnderstandingGlyph />
      <ImplementationGlyph />
      <StationLabel x={132} label="Term of art" detail="shared domain constraint" />
      <StationLabel x={364} label="Understanding" detail="context · evidence · stakes" />
      <StationLabel x={588} label="Implementation" detail="decision · test · artifact" />
      <Axis left="SHARED TERM" middle="SITUATED MODEL" right="CONCRETE ACTION" />
    </>
  );
}

function OntologyNode({ x, y, label, focal = false }: { x: number; y: number; label: string; focal?: boolean }) {
  return (
    <g className={focal ? "ai-factory-motif__ontology-node ai-factory-motif__ontology-node--focal" : "ai-factory-motif__ontology-node"}>
      <rect x={x} y={y} width="136" height="72" />
      <MorphemeGlyph x={x + 36} y={y + 36} state="refined" focal={focal} scale={0.42} />
      <text className="ai-factory-motif__label" x={x + 76} y={y + 41}>{label}</text>
    </g>
  );
}

function OntologyOfTerms({ arrowId }: { arrowId: string }) {
  return (
    <>
      <g className="ai-factory-motif__connectors" aria-hidden="true">
        <path d="M176 160H284" markerEnd={`url(#${arrowId})`} />
        <path className="ai-factory-motif__connector--focal" d="M428 160H536" markerEnd={`url(#${arrowId})`} />
        <path d="M360 100V116" markerEnd={`url(#${arrowId})`} />
        <path d="M360 228V204" markerEnd={`url(#${arrowId})`} />
        <ConnectorLabel x={232} y={140}>PURSUES</ConnectorLabel>
        <ConnectorLabel x={484} y={140}>DIRECTS</ConnectorLabel>
        <text className="ai-factory-motif__vertical-edge-label" x="376" y="112">SUPPORTS</text>
        <text className="ai-factory-motif__vertical-edge-label" x="376" y="220">BOUNDS</text>
      </g>
      <OntologyNode x={40} y={124} label="Actor" />
      <OntologyNode x={292} y={124} label="Goal" focal />
      <OntologyNode x={544} y={124} label="Action" />
      <OntologyNode x={292} y={28} label="Evidence" />
      <OntologyNode x={292} y={228} label="Constraint" />
      <g className="ai-factory-motif__ontology-legend" aria-hidden="true">
        <path d="M40 316H680" />
        <text x="40" y="308">REPEATED BOUNDARY</text>
        <text x="360" y="308" textAnchor="middle">TYPED RELATIONSHIPS</text>
        <text x="680" y="308" textAnchor="end">SHARED MODEL</text>
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
    <figure className="ai-factory-motif">
      <header className="ai-factory-motif__header">
        <p>{`AI Factory · ${content.index} · ${content.eyebrow}`}</p>
        <h3>{content.title}</h3>
      </header>
      <p className="ai-factory-motif__scroll-cue">Scroll the path →</p>
      <div className="ai-factory-motif__viewport" role="region" tabIndex={0} aria-label="Scrollable AI Factory motif">
        <svg viewBox="0 0 720 320" role="img" aria-labelledby={`${titleId} ${descriptionId}`} preserveAspectRatio="xMidYMid meet">
          <title id={titleId}>{content.title}</title>
          <desc id={descriptionId}>{content.description}</desc>
          <defs>
            <marker id={arrowId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0 0L8 4L0 8Z" />
            </marker>
          </defs>
          {variant === "vision-to-morpheme" ? <VisionToMorpheme arrowId={arrowId} /> : null}
          {variant === "refinement-and-discipline-to-term-of-art" ? <RefinementAndDisciplineToTermOfArt arrowId={arrowId} /> : null}
          {variant === "term-of-art-to-implementation" ? <TermOfArtToImplementation arrowId={arrowId} /> : null}
          {variant === "ontology-of-terms" ? <OntologyOfTerms arrowId={arrowId} /> : null}
        </svg>
      </div>
      <figcaption>{content.caption}</figcaption>
    </figure>
  );
}
