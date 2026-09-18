import "./ai-factory-motif.css";

const motifContent = {
  "morpheme-to-token": {
    index: "01",
    eyebrow: "Meaning boundary",
    title: "Meaning does not arrive as a token",
    nodes: [
      { label: "Lived meaning", detail: "experience · context" },
      { label: "Morpheme", detail: "linguistic meaning" },
      { label: "Token sequence", detail: "model vocabulary" },
    ],
    focus: 1,
    description:
      "Lived meaning is compressed into a morpheme, which a tokenizer may preserve, split, or combine into model tokens.",
    caption:
      "A morpheme carries linguistic meaning; a tokenizer may preserve it, split it, or combine it with neighboring material. Meaning and model units touch, but they are not the same boundary.",
  },
  "formalized-idea-to-density": {
    index: "02",
    eyebrow: "Constraint boundary",
    title: "Constraint concentrates the continuation",
    nodes: [
      { label: "Problem space", detail: "many plausible framings" },
      { label: "Formalized idea", detail: "named method · constraints" },
      { label: "Targeted token field", detail: "fewer useful continuations" },
    ],
    focus: 2,
    description:
      "A formalized idea narrows a broad problem space into a more concentrated field of useful token continuations.",
    caption:
      "A formalized idea is a compact address into constrained language. It raises the concentration of useful continuations; density here is conceptual, not a measured model statistic.",
  },
  "ontology-to-tokens": {
    index: "03",
    eyebrow: "Shared-model boundary",
    title: "Ontology gives generation a world to target",
    nodes: [
      { label: "Ontology", detail: "entities · relations · rules" },
      { label: "Formalized idea", detail: "bounded task model" },
      { label: "Token sequence", detail: "testable expression" },
    ],
    focus: 0,
    description:
      "An ontology constrains a formalized idea, which guides a generated token sequence toward a shared and testable model.",
    caption:
      "An ontology names entities, relations, constraints, and evidence rules. Formalizing a task through that shared model gives generated tokens a narrower, testable target.",
  },
} as const;

export type AiFactoryMotifVariant = keyof typeof motifContent;

function SemanticConstellation({ focal }: { focal: boolean }) {
  return (
    <g className={focal ? "ai-factory-motif__glyph ai-factory-motif__glyph--focal" : "ai-factory-motif__glyph"} aria-hidden="true">
      <path d="M84 142 H116 M100 126 V158 M88 130 L112 154 M112 130 L88 154" />
      <circle cx="100" cy="142" r="7" />
      <circle cx="84" cy="142" r="4" />
      <circle cx="116" cy="142" r="4" />
      <circle cx="100" cy="126" r="4" />
      <circle cx="100" cy="158" r="4" />
    </g>
  );
}

function FormalizedExpression({ focal }: { focal: boolean }) {
  return (
    <g className={focal ? "ai-factory-motif__glyph ai-factory-motif__glyph--focal" : "ai-factory-motif__glyph"} aria-hidden="true">
      <path d="M296 124 H284 V160 H296 M424 124 H436 V160 H424" />
      <path d="M308 132 H364 M308 144 H412 M308 156 H380" />
      <circle cx="396" cy="132" r="4" />
    </g>
  );
}

function TokenField({ focal, dense }: { focal: boolean; dense: boolean }) {
  const tokens: ReadonlyArray<readonly [number, number, number]> = dense
    ? [
        [520, 124, 28], [552, 124, 48], [604, 124, 24], [632, 124, 36],
        [520, 144, 44], [568, 144, 24], [596, 144, 52], [652, 144, 16],
        [520, 164, 20], [544, 164, 52], [600, 164, 32], [636, 164, 32],
      ]
    : [
        [520, 128, 40], [568, 128, 24], [600, 128, 52],
        [520, 152, 24], [552, 152, 56], [616, 152, 36],
      ];

  return (
    <g className={focal ? "ai-factory-motif__tokens ai-factory-motif__tokens--focal" : "ai-factory-motif__tokens"} aria-hidden="true">
      {tokens.map(([x, y, width], index) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={width} height="12" data-emphasis={index % 3 === 1 ? "true" : undefined} />
      ))}
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
        <svg
          viewBox="0 0 720 288"
          role="img"
          aria-labelledby={`${titleId} ${descriptionId}`}
          preserveAspectRatio="xMidYMid meet"
        >
        <title id={titleId}>{content.title}</title>
        <desc id={descriptionId}>{content.description}</desc>
        <defs>
          <marker id={arrowId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" />
          </marker>
        </defs>

        <g className="ai-factory-motif__connectors" aria-hidden="true">
          <path d="M224 144 H268" markerEnd={`url(#${arrowId})`} />
          <path d="M448 144 H492" markerEnd={`url(#${arrowId})`} />
        </g>

        {[40, 272, 496].map((x, index) => (
          <g
            className={index === content.focus ? "ai-factory-motif__node ai-factory-motif__node--focal" : "ai-factory-motif__node"}
            key={content.nodes[index]!.label}
          >
            <rect x={x} y="64" width="184" height="160" />
            <text className="ai-factory-motif__index" x={x + 16} y="88">
              {String(index + 1).padStart(2, "0")}
            </text>
            <text className="ai-factory-motif__label" x={x + 92} y="196" textAnchor="middle">
              {content.nodes[index]!.label}
            </text>
            <text className="ai-factory-motif__detail" x={x + 92} y="212" textAnchor="middle">
              {content.nodes[index]!.detail}
            </text>
          </g>
        ))}

        <SemanticConstellation focal={content.focus === 0} />
        <FormalizedExpression focal={content.focus === 1} />
        <TokenField focal={content.focus === 2} dense={variant === "formalized-idea-to-density"} />

        <g className="ai-factory-motif__axis" aria-hidden="true">
          <path d="M40 252 H680" />
          <text x="40" y="272">MEANING</text>
          <text x="360" y="272" textAnchor="middle">FORMALIZATION</text>
          <text x="680" y="272" textAnchor="end">GENERATION</text>
        </g>
        </svg>
      </div>
      <figcaption>{content.caption}</figcaption>
    </figure>
  );
}
