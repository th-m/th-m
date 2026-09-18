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
  "discipline-to-morpheme": {
    index: "02",
    eyebrow: "Discipline",
    title: "Discipline stabilizes the morpheme",
    description:
      "Definitions, methods, evidence, and correction refine a context-sensitive morpheme into a disciplined morpheme with a consistent domain boundary.",
    caption:
      "This series uses disciplined morpheme as editorial shorthand for a morpheme, word, or phrase whose use a discipline has intentionally narrowed through definition and corrective practice.",
  },
  "ontology-of-morphemes": {
    index: "03",
    eyebrow: "Coordination",
    title: "Ontology coordinates disciplined morphemes",
    description:
      "An ontology repeats bounded linguistic forms as concept labels and coordinates them through typed relationships and constraints.",
    caption:
      "The repeated shape is the disciplined morpheme. More precisely, an ontology maps the concepts those expressions designate; typed relationships coordinate them into a shared model.",
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
  state: "diffuse" | "disciplined";
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
      {state === "diffuse" ? (
        <g className="ai-factory-motif__morpheme-halo">
          <path transform="translate(-8 -4)" d="M0-32C20-32 36-16 32 4C28 24 12 36-8 32C-28 28-40 8-32-12C-24-32-8-40 0-32Z" />
          <path transform="translate(8 4)" d="M0-32C20-32 36-16 32 4C28 24 12 36-8 32C-28 28-40 8-32-12C-24-32-8-40 0-32Z" />
        </g>
      ) : null}
      <path className="ai-factory-motif__morpheme-core" d="M0-32C20-32 36-16 32 4C28 24 12 36-8 32C-28 28-40 8-32-12C-24-32-8-40 0-32Z" />
      <circle className="ai-factory-motif__morpheme-center" cx="0" cy="0" r="5" />
      {state === "disciplined" ? (
        <g className="ai-factory-motif__morpheme-bounds">
          <path d="M-44-16V-44H-16" />
          <path d="M16-44H44V-16" />
          <path d="M44 16V44H16" />
          <path d="M-16 44H-44V16" />
        </g>
      ) : null}
    </g>
  );
}

function VisionGlyph() {
  return (
    <g className="ai-factory-motif__vision-glyph" aria-hidden="true">
      <circle cx="132" cy="136" r="28" />
      <circle cx="108" cy="116" r="5" />
      <circle cx="160" cy="112" r="4" />
      <circle cx="164" cy="156" r="6" />
      <circle cx="104" cy="164" r="4" />
      <path d="M112 120L124 128M156 116L140 128M156 152L140 144M108 160L124 148" />
      <path className="ai-factory-motif__vision-orbit" d="M88 136C88 104 108 88 136 88C168 88 184 108 184 136C184 168 164 184 136 184C104 184 88 164 88 136Z" />
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

function DisciplineToMorpheme({ arrowId }: { arrowId: string }) {
  return (
    <>
      <g className="ai-factory-motif__connectors" aria-hidden="true">
        <path d="M228 152H336" />
        <path d="M360 120V136" />
        <path className="ai-factory-motif__connector--focal" d="M384 152H484" markerEnd={`url(#${arrowId})`} />
        <ConnectorLabel x={436} y={132}>REFINES</ConnectorLabel>
      </g>
      <rect className="ai-factory-motif__station" x="44" y="64" width="184" height="184" />
      <rect className="ai-factory-motif__discipline" x="272" y="48" width="176" height="72" />
      <rect className="ai-factory-motif__station ai-factory-motif__station--focal" x="492" y="64" width="184" height="184" />
      <MorphemeGlyph x={136} y={136} state="diffuse" />
      <MorphemeGlyph x={584} y={136} state="disciplined" focal />
      <circle className="ai-factory-motif__operator" cx="360" cy="152" r="16" />
      <text className="ai-factory-motif__operator-label" x="360" y="158" textAnchor="middle">+</text>
      <text className="ai-factory-motif__label" x="360" y="76" textAnchor="middle">Discipline</text>
      <text className="ai-factory-motif__detail" x="360" y="94" textAnchor="middle">definition · evidence · correction</text>
      <StationLabel x={136} label="Morpheme" detail="context-sensitive meaning" />
      <StationLabel x={584} label="Disciplined morpheme" detail="consistent within a domain" />
      <Axis left="MEANING POTENTIAL" middle="CORRECTIVE PRACTICE" right="STABLE TERM" />
    </>
  );
}

function OntologyNode({ x, y, label, focal = false }: { x: number; y: number; label: string; focal?: boolean }) {
  return (
    <g className={focal ? "ai-factory-motif__ontology-node ai-factory-motif__ontology-node--focal" : "ai-factory-motif__ontology-node"}>
      <rect x={x} y={y} width="136" height="72" />
      <MorphemeGlyph x={x + 36} y={y + 36} state="disciplined" focal={focal} scale={0.42} />
      <text className="ai-factory-motif__label" x={x + 76} y={y + 41}>{label}</text>
    </g>
  );
}

function OntologyOfMorphemes({ arrowId }: { arrowId: string }) {
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
          {variant === "discipline-to-morpheme" ? <DisciplineToMorpheme arrowId={arrowId} /> : null}
          {variant === "ontology-of-morphemes" ? <OntologyOfMorphemes arrowId={arrowId} /> : null}
        </svg>
      </div>
      <figcaption>{content.caption}</figcaption>
    </figure>
  );
}
