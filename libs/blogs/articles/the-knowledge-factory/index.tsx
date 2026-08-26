import { Fragment, type ReactNode } from "react";
import type { PublishedPost } from "@th-m/blogs/publish";
import {
  Card,
  CardContent,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  LinkPreview,
  ToolLauncher,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@th-m/ui";
import { Link } from "@tanstack/react-router";
import {
  PropositionGraphFigure,
  type GraphDocument,
  type RelationshipParticipant,
} from "@th-m/graph-visualization";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(`${value}T00:00:00.000Z`),
  );
}

function Section({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return (
    <section className="article-outline__section">
      <p className="article-outline__index">{index}</p>
      <div className="article-outline__content">
        <h2>{title}</h2>
        {children}
      </div>
    </section>
  );
}

function Figure({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="essay-figure">
      {children}
      <figcaption className="essay-figure__caption">{caption}</figcaption>
    </figure>
  );
}

function Term({ definition, children }: { definition: string; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="thom-tooltip-trigger" tabIndex={0}>{children}</span>
      </TooltipTrigger>
      <TooltipContent>{definition}</TooltipContent>
    </Tooltip>
  );
}

function ArticleLink({ slug, children }: { slug: string; children: ReactNode }) {
  return (
    <LinkPreview url={`/writing/${slug}`} asChild>
      <Link to="/writing/$slug" params={{ slug }}>{children}</Link>
    </LinkPreview>
  );
}

/** Cross-article link with a floating destination preview. */
function EssayLink({ to, children }: { to: string; children: ReactNode }) {
  return <LinkPreview url={to}>{children}</LinkPreview>;
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return <LinkPreview url={href} external>{children}</LinkPreview>;
}

/** Inline jargon gloss — a ≤3-line floating tooltip. Attention stays in the sentence. */
function Gloss({ tip, children }: { tip: string; children: ReactNode }) {
  return (
    <Tooltip delayDuration={150}>
      <TooltipTrigger asChild>
        <span className="thom-tooltip-trigger" tabIndex={0}>{children}</span>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>{tip}</TooltipContent>
    </Tooltip>
  );
}

/** Structured gloss — a floating hover card with definition and worked example. */
function TermGloss({
  term,
  definition,
  example,
}: {
  term: string;
  definition: string;
  example?: string;
}) {
  return (
    <HoverCard openDelay={120} closeDelay={80}>
      <HoverCardTrigger asChild>
        <span className="thom-tooltip-trigger" tabIndex={0}>{term}</span>
      </HoverCardTrigger>
      <HoverCardContent sideOffset={8} align="start">
        <h4 className="thom-tooltip-card__title">{term}</h4>
        <p className="thom-tooltip-card__description">{definition}</p>
        {example ? (
          <p className="thom-tooltip-card__description" style={{ marginTop: 8 }}>{example}</p>
        ) : null}
      </HoverCardContent>
    </HoverCard>
  );
}

function Quote({ children }: { children: ReactNode }) {
  return <blockquote><p>{children}</p></blockquote>;
}

function Flow({ children }: { children: ReactNode }) {
  return <p className="article-outline__flow">{children}</p>;
}

/* ------------------------------------------------------------------ */
/* Illustrations                                                       */
/* ------------------------------------------------------------------ */

function ArrowMarker({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={id}
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" className="essay-fig-arrow" />
      </marker>
    </defs>
  );
}

const PIPELINE_STEPS = [
  "Customer experience",
  "Evidence",
  "Interpretation",
  "Priority",
  "Design",
  "Implementation",
  "Verification",
  "Release",
  "Observed consequence",
];

function ProductPipeline() {
  return (
    <ol className="essay-flow" aria-label="The path of one product change">
      {PIPELINE_STEPS.map((step, index) => (
        <li key={step}>
          {step}
          {index < PIPELINE_STEPS.length - 1 ? (
            <span className="essay-flow__arrow" aria-hidden="true">→</span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

const IMPLICIT_FACTORY_BOXES = [
  { label: "Leaders frame the solution", strong: true },
  { label: "Work arrives as tickets", strong: false },
  { label: "Engineers execute fragments", strong: false },
  { label: "Lessons stay in individuals", strong: false },
];

const EXPLICIT_FACTORY_BOXES = [
  { label: "Evidence and intent are shared", strong: true },
  { label: "Semantic boundaries are named", strong: false },
  { label: "Evaluation precedes release", strong: false },
  { label: "Feedback updates the context", strong: false },
];

function ImplicitVsExplicitFactory() {
  return (
    <svg
      className="essay-figure__svg"
      viewBox="0 0 960 420"
      role="img"
      aria-label="The implicit factory contrasted with the explicit factory"
    >
      <ArrowMarker id="kf-arrow" />
      <title>The implicit factory contrasted with the explicit factory</title>

      {/* Implicit factory */}
      <g>
        <text x="36" y="44" className="essay-fig-title">Implicit factory</text>
        <text x="36" y="64" className="essay-fig-sub">hidden queues · gated decisions · learning lost</text>
        <rect x="24" y="84" width="440" height="308" className="essay-fig-panel" />
        {IMPLICIT_FACTORY_BOXES.map((box, index) => {
          const y = 104 + index * 76;
          return (
            <g key={box.label}>
              <rect x="44" y={y} width="400" height="52" className="essay-fig-box" />
              <text
                x="244"
                y={y + 34}
                textAnchor="middle"
                className={box.strong ? "essay-fig-label" : "essay-fig-label--muted"}
              >
                {box.label}
              </text>
              {index < IMPLICIT_FACTORY_BOXES.length - 1 ? (
                <path d={`M 244 ${y + 56} L 244 ${y + 70}`} className="essay-fig-line" markerEnd="url(#kf-arrow)" />
              ) : null}
            </g>
          );
        })}
        <text x="244" y="412" textAnchor="middle" className="essay-fig-note">
          the system is not designed; it accumulates
        </text>
      </g>

      {/* Explicit factory */}
      <g>
        <text x="508" y="44" className="essay-fig-title">Explicit factory</text>
        <text x="508" y="64" className="essay-fig-sub">visible context · evaluation · feedback</text>
        <rect x="496" y="84" width="440" height="308" className="essay-fig-panel essay-fig-panel--accent" />
        {EXPLICIT_FACTORY_BOXES.map((box, index) => {
          const y = 104 + index * 76;
          return (
            <g key={box.label}>
              <rect x="516" y={y} width="400" height="52" className="essay-fig-box" />
              <text
                x="716"
                y={y + 34}
                textAnchor="middle"
                className={box.strong ? "essay-fig-label" : "essay-fig-label--muted"}
              >
                {box.label}
              </text>
              {index < EXPLICIT_FACTORY_BOXES.length - 1 ? (
                <path d={`M 716 ${y + 56} L 716 ${y + 70}`} className="essay-fig-line" markerEnd="url(#kf-arrow)" />
              ) : null}
            </g>
          );
        })}
        {/* Feedback loop returning to the top */}
        <path
          d="M 916 358 C 952 358, 952 130, 916 130"
          className="essay-fig-loop"
          markerEnd="url(#kf-arrow)"
        />
        <text x="946" y="250" className="essay-fig-note" transform="rotate(90 946 250)">feedback</text>
      </g>
    </svg>
  );
}

function WorkerVsFactoryEngineer() {
  return (
    <svg
      className="essay-figure__svg"
      viewBox="0 0 960 320"
      role="img"
      aria-label="A factory worker completes one unit of work; a factory engineer improves the capability that produces many units"
    >
      <ArrowMarker id="kf-worker-arrow" />
      <title>A factory worker completes one unit; a factory engineer improves the capability that produces many units</title>

      {/* Worker */}
      <g>
        <text x="36" y="44" className="essay-fig-title">Factory worker</text>
        <text x="36" y="64" className="essay-fig-sub">completes one unit of work</text>
        <rect x="24" y="84" width="440" height="212" className="essay-fig-panel" />
        <text x="244" y="88" textAnchor="middle" className="essay-fig-note">work item</text>
        <path d="M 244 96 L 244 118" className="essay-fig-line" markerEnd="url(#kf-worker-arrow)" />
        <rect x="84" y="120" width="320" height="64" className="essay-fig-box" />
        <text x="244" y="158" textAnchor="middle" className="essay-fig-label">Execute the bounded step</text>
        <path d="M 244 184 L 244 206" className="essay-fig-line" markerEnd="url(#kf-worker-arrow)" />
        <text x="244" y="226" textAnchor="middle" className="essay-fig-note">one output</text>
        <text x="244" y="268" textAnchor="middle" className="essay-fig-note">the system is unchanged</text>
      </g>

      {/* Factory engineer */}
      <g>
        <text x="508" y="44" className="essay-fig-title">Factory engineer</text>
        <text x="508" y="64" className="essay-fig-sub">improves the capability that produces many units</text>
        <rect x="496" y="84" width="440" height="212" className="essay-fig-panel essay-fig-panel--accent" />
        <rect x="556" y="120" width="320" height="64" className="essay-fig-box" />
        <text x="716" y="158" textAnchor="middle" className="essay-fig-label">Capability — context, tools, evaluation</text>
        <path d="M 716 184 L 611 214" className="essay-fig-line" markerEnd="url(#kf-worker-arrow)" />
        <path d="M 716 184 L 716 214" className="essay-fig-line" markerEnd="url(#kf-worker-arrow)" />
        <path d="M 716 184 L 821 214" className="essay-fig-line" markerEnd="url(#kf-worker-arrow)" />
        <rect x="566" y="216" width="90" height="44" className="essay-fig-box--small" />
        <text x="611" y="243" textAnchor="middle" className="essay-fig-label--muted">decisions</text>
        <rect x="671" y="216" width="90" height="44" className="essay-fig-box--small" />
        <text x="716" y="243" textAnchor="middle" className="essay-fig-label--muted">designs</text>
        <rect x="776" y="216" width="90" height="44" className="essay-fig-box--small" />
        <text x="821" y="243" textAnchor="middle" className="essay-fig-label--muted">code</text>
        <path d="M 876 216 C 924 216, 924 152, 876 152" className="essay-fig-loop" markerEnd="url(#kf-worker-arrow)" />
        <text x="940" y="186" className="essay-fig-note" transform="rotate(90 940 186)">improves</text>
      </g>
    </svg>
  );
}

const STACK_LAYERS: Array<[string, string]> = [
  ["Observation and intake", "customer evidence, telemetry, research, support, market signals"],
  ["Graph context exploration", "navigable relationships among people, concepts, systems, evidence"],
  ["Ontology and semantic boundaries", "stable terms, invariants, permissions, and evidence rules"],
  ["Context assembly", "the smallest relevant context for a person, model, or workflow"],
  ["Workflows and agents", "repeatable transformations with explicit inputs, outputs, escalation"],
  ["Evaluation", "tests, rubrics, simulations, expert review, customer outcome checks"],
  ["Observability and provenance", "what ran, which evidence, who decided, where uncertainty entered"],
  ["Feedback and learning", "outcomes update decisions, ontologies, examples, evaluations"],
];

function KnowledgeFactoryStack() {
  return (
    <svg
      className="essay-figure__svg"
      viewBox="0 0 960 620"
      role="img"
      aria-label="The eight layers of the knowledge-factory stack"
    >
      <title>The eight layers of the knowledge-factory stack</title>
      <text x="40" y="44" className="essay-fig-title">The knowledge-factory stack</text>
      <text x="40" y="66" className="essay-fig-sub">eight reusable layers — not one mandatory vendor architecture</text>
      {STACK_LAYERS.map(([name, detail], index) => {
        const y = 100 + index * 62;
        return (
          <g key={name}>
            <text x="40" y={y + 34} className="essay-fig-number">{String(index + 1).padStart(2, "0")}</text>
            <rect x="110" y={y} width="800" height="52" className="essay-fig-bar" />
            <text x="130" y={y + 32} className="essay-fig-label">{name}</text>
            <text x="440" y={y + 32} className="essay-fig-detail">{detail}</text>
            {index < STACK_LAYERS.length - 1 ? (
              <path d={`M 490 ${y + 52} L 490 ${y + 60}`} className="essay-fig-line" markerEnd="url(#kf-arrow)" />
            ) : null}
          </g>
        );
      })}
      <ArrowMarker id="kf-arrow" />
    </svg>
  );
}

const GLOSSARY: Array<[string, string]> = [
  ["Knowledge factory", "the socio-technical system that transforms evidence, expertise, and intent into decisions and product outcomes."],
  ["Factory worker", "any participant executing a bounded step designed by the larger system — a role, not a judgment about talent or status."],
  ["Factory engineer", "a participant who improves the reusable machinery, context, standards, and feedback loops through which many work items pass."],
  ["Shared capital", "reusable organizational assets — ontologies, context graphs, tools, evaluations, workflows, infrastructure, and accumulated learning — that increase future capability."],
  ["Solutioning", "framing, generating, testing, and revising interventions in response to a meaningful problem."],
  ["Graph context", "navigable relationships among people, concepts, systems, evidence, decisions, dependencies, and outcomes, with provenance."],
  ["Strategy", "a coherent set of choices about a desired future, the obstacles and opportunities between here and there, and the coordinated actions used to change the situation."],
  ["Narrative", "a causal interpretation connecting present conditions, actors, stakes, possible change, and a believable path forward."],
  ["Adversarial opportunism", "recognizing competition, incentives, conflict, timing, and ways other actors may resist or exploit a move."],
  ["Diplomatic opportunism", "creating value through trust, coalition, negotiation, distribution, partnership, and aligned incentives."],
  ["Second brain", "a maintained organizational memory that connects strategic beliefs and decisions to evidence, owners, experiments, and outcomes."],
];

function GlossaryCards() {
  return (
    <div className="essay-glossary">
      {GLOSSARY.map(([term, definition]) => (
        <Card key={term} className="essay-glossary__item">
          <CardContent>
            <h4>{term}</h4>
            <p>{definition}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * The strategy discipline opening figure: ontology maps the possible world;
 * strategy draws a path through it; outcomes revise both.
 */
function OntologyStrategyFigure() {
  return (
    <svg viewBox="0 0 640 400" role="img" aria-label="Ontology maps the possible world; strategy draws a path through it; outcomes revise both." style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <marker id="os-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M0,0 L7,3.5 L0,7 z" fill="var(--color-primary)" />
        </marker>
        <marker id="os-arrow-muted" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M0,0 L7,3.5 L0,7 z" fill="var(--color-foreground-muted)" />
        </marker>
      </defs>

      {/* The map: the world the ontology can recognize. */}
      <rect x="24" y="180" width="592" height="180" fill="var(--color-surface)" stroke="var(--line)" />
      {[72, 120, 168, 216, 264, 312, 360, 408, 456, 504, 552].map((x) => (
        <line key={`v${x}`} x1={x} y1="180" x2={x} y2="360" stroke="var(--line)" opacity="0.45" />
      ))}
      {[228, 276, 324].map((y) => (
        <line key={`h${y}`} x1="24" y1={y} x2="616" y2={y} stroke="var(--line)" opacity="0.45" />
      ))}
      {[
        [120, 228, "customers"],
        [264, 228, "evidence"],
        [408, 228, "decisions"],
        [504, 276, "actors"],
        [168, 324, "outcomes"],
        [552, 324, "experiments"],
      ].map(([x, y, label]) => (
        <g key={label as string}>
          <rect x={(x as number) - 4} y={(y as number) - 4} width="8" height="8" fill="var(--color-surface-raised)" stroke="var(--color-border-strong)" />
          <text x={x as number} y={(y as number) + 22} textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".08em", textTransform: "uppercase", fill: "var(--color-foreground-muted)" }}>
            {label as string}
          </text>
        </g>
      ))}
      <text x="320" y="352" textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", fill: "var(--color-foreground-muted)" }}>
        Ontology — maps the world the factory can recognize
      </text>

      {/* The path: strategy drawn through the map. */}
      <polyline
        points="60,340 120,300 200,300 240,250 320,250 380,210 460,210 520,150"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="2"
        markerEnd="url(#os-arrow)"
      />
      {["120,300", "240,250", "320,250", "380,210", "460,210"].map((point) => {
        const [x, y] = point.split(",").map(Number);
        return <circle key={point} cx={x} cy={y} r="3" fill="var(--color-primary)" />;
      })}
      <text x="616" y="138" textAnchor="end" style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", fill: "var(--color-primary)" }}>
        Strategy — draws a path through it
      </text>

      {/* Outcomes revise both. */}
      <path d="M 520 150 C 560 200, 540 260, 470 320" fill="none" stroke="var(--color-foreground-muted)" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#os-arrow-muted)" />
      <text x="600" y="244" textAnchor="end" style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", fill: "var(--color-foreground-muted)" }}>
        Outcomes — revise both
      </text>
    </svg>
  );
}

/**
 * The strategic feedback loop: evidence → narrative → choice → response →
 * learning, with learning returning as revised interpretation.
 */
function FeedbackLoopFigure() {
  const nodes = [
    { label: "Evidence", x: 320, y: 42 },
    { label: "Narrative", x: 443.6, y: 129.8 },
    { label: "Choice", x: 396.4, y: 275.2, emphasis: true },
    { label: "Response", x: 243.6, y: 275.2 },
    { label: "Learning", x: 196.4, y: 129.8 },
  ];
  return (
    <svg viewBox="0 0 640 340" role="img" aria-label="The strategic feedback loop: evidence, narrative, choice, response, learning, and back to revised evidence." style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <marker id="fl-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M0,0 L7,3.5 L0,7 z" fill="var(--color-primary)" />
        </marker>
      </defs>

      {nodes.map((node, index) => {
        const next = nodes[(index + 1) % nodes.length];
        const dashed = index === nodes.length - 1;
        return (
          <line
            key={`${node.label}-${next.label}`}
            x1={node.x}
            y1={node.y}
            x2={next.x}
            y2={next.y}
            stroke={dashed ? "var(--color-foreground-muted)" : "var(--color-primary)"}
            strokeWidth={dashed ? 1.5 : 2}
            strokeDasharray={dashed ? "4 4" : undefined}
            markerEnd="url(#fl-arrow)"
          />
        );
      })}

      {nodes.map((node) => (
        <g key={node.label}>
          <rect
            x={node.x - 62}
            y={node.y - 17}
            width="124"
            height="34"
            fill="var(--color-surface)"
            stroke={node.emphasis ? "var(--color-primary)" : "var(--line)"}
          />
          <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="central" style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", fill: node.emphasis ? "var(--color-foreground-strong)" : "var(--color-foreground-muted)" }}>
            {node.label}
          </text>
        </g>
      ))}

      <text x="320" y="186" textAnchor="middle" dominantBaseline="central" style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", fill: "var(--color-foreground-muted)" }}>
        the strategic feedback loop
      </text>
      <text x="320" y="206" textAnchor="middle" dominantBaseline="central" style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".1em", textTransform: "uppercase", fill: "var(--color-foreground-muted)" }}>
        learning returns as revised interpretation
      </text>
    </svg>
  );
}

/**
 * The organizational second brain: a hypothesis linked to customers,
 * evidence, decisions, actors, experiments, metrics, and outcomes. Rendered
 * as a live proposition graph by the shared layout pipeline.
 */
const participant = (nodeId: string, arrowAtNode = false, arrowAtRelation = false): RelationshipParticipant => ({
  nodeId,
  arrowAtNode,
  arrowAtRelation,
});

const secondBrainGraph: GraphDocument = {
  schemaVersion: 1,
  id: "second-brain",
  name: "The organizational second brain",
  createdAt: "2026-08-22T00:00:00.000Z",
  updatedAt: "2026-08-22T00:00:00.000Z",
  themeId: "thom-dark",
  layoutMode: "editorial",
  propositions: [
    { id: "hypothesis", statement: "Hypothesis: the market is changing", emphasis: true, pinned: false },
    { id: "customers", statement: "Customer evidence", emphasis: false, pinned: false },
    { id: "evidence", statement: "Field observations & interviews", emphasis: false, pinned: false },
    { id: "decisions", statement: "Strategic decisions", emphasis: true, pinned: false },
    { id: "actors", statement: "People & partners", emphasis: false, pinned: false },
    { id: "experiments", statement: "Experiments & pilots", emphasis: false, pinned: false },
    { id: "metrics", statement: "Leading indicators", emphasis: false, pinned: false },
    { id: "outcomes", statement: "Outcomes & revisions", emphasis: false, pinned: false },
  ],
  relationships: [
    { id: "supported-by", statement: "supported by", participants: [participant("hypothesis"), participant("evidence")], pinned: false },
    { id: "observed-from", statement: "observed from", participants: [participant("evidence"), participant("customers")], pinned: false },
    { id: "depend-on", statement: "depend on", participants: [participant("decisions"), participant("hypothesis")], pinned: false },
    { id: "owned-by", statement: "owned by", participants: [participant("decisions"), participant("actors")], pinned: false },
    { id: "tested-by", statement: "tested by", participants: [participant("hypothesis"), participant("experiments")], pinned: false },
    { id: "produce", statement: "produce", participants: [participant("experiments"), participant("metrics")], pinned: false },
    { id: "bear-cost", statement: "bear the cost of", participants: [participant("customers"), participant("outcomes")], pinned: false },
    { id: "revise", statement: "revise", participants: [participant("outcomes"), participant("hypothesis")], pinned: false },
  ],
  poster: {
    kicker: "The Knowledge Factory",
    title: "The organizational second brain",
    footer: "Hypothesis linked to customers, evidence, decisions, actors, experiments, metrics, and outcomes.",
    showLegend: true,
  },
};

/**
 * Adversarial and diplomatic opportunism: competition and coalition as two
 * complementary views of the same landscape.
 */
function AdversarialDiplomaticFigure() {
  return (
    <svg viewBox="0 0 640 340" role="img" aria-label="Adversarial and diplomatic opportunism: competition and coalition as two complementary views of the same landscape." style={{ width: "100%", height: "auto", display: "block" }}>
      {/* The shared landscape divider. */}
      <line x1="320" y1="24" x2="320" y2="256" stroke="var(--line)" />

      {/* Adversarial lens. */}
      <text x="160" y="40" textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", fill: "var(--color-primary)" }}>
        Adversarial
      </text>
      <text x="160" y="58" textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".08em", textTransform: "uppercase", fill: "var(--color-foreground-muted)" }}>
        competition · countermoves · power
      </text>
      <polygon points="92,92 142,122 92,152" fill="none" stroke="var(--color-foreground-muted)" strokeWidth="1.5" />
      <polygon points="228,92 178,122 228,152" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" />
      <text x="160" y="196" textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", fill: "var(--color-foreground-muted)" }}>
        competitors &amp; substitutes
      </text>
      <text x="160" y="214" textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", fill: "var(--color-foreground-muted)" }}>
        timing · asymmetries · imitation
      </text>

      {/* Diplomatic lens. */}
      <text x="480" y="40" textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", fill: "var(--color-primary)" }}>
        Diplomatic
      </text>
      <text x="480" y="58" textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".08em", textTransform: "uppercase", fill: "var(--color-foreground-muted)" }}>
        trust · coalition · alignment
      </text>
      <line x1="472" y1="122" x2="484" y2="122" stroke="var(--color-primary)" strokeWidth="1.5" />
      <line x1="552" y1="122" x2="564" y2="122" stroke="var(--color-primary)" strokeWidth="1.5" />
      {[
        [404, "Trust"],
        [484, "Coalition"],
        [564, "Alignment"],
      ].map(([x, label]) => (
        <g key={label as string}>
          <rect x={x as number} y="104" width="68" height="36" fill="var(--color-surface-raised)" stroke="var(--line)" />
          <text x={(x as number) + 34} y="122" textAnchor="middle" dominantBaseline="central" style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".1em", textTransform: "uppercase", fill: "var(--color-foreground-muted)" }}>
            {label as string}
          </text>
        </g>
      ))}
      <text x="480" y="196" textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", fill: "var(--color-foreground-muted)" }}>
        partnership · standards · legitimacy
      </text>
      <text x="480" y="214" textAnchor="middle" style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", fill: "var(--color-foreground-muted)" }}>
        negotiated access · shared incentives
      </text>

      {/* The shared landscape. */}
      <rect x="24" y="272" width="592" height="48" fill="var(--color-surface)" stroke="var(--line)" />
      <text x="320" y="288" textAnchor="middle" dominantBaseline="central" style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", fill: "var(--color-foreground-strong)" }}>
        the same move changes another actor's options
      </text>
      <text x="320" y="304" textAnchor="middle" dominantBaseline="central" style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: ".1em", textTransform: "uppercase", fill: "var(--color-foreground-muted)" }}>
        two lenses on one landscape
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* The published page                                                  */
/* ------------------------------------------------------------------ */

export default function ArticlePage({
  post,
  assetUrl: _assetUrl,
}: {
  post: PublishedPost;
  assetUrl: (value: string) => string;
}) {
  return (
    <TooltipProvider>
      <header>
        <p className="eyebrow">Essay</p>
        <h1>{post.title}</h1>
        <p className="article-description">{post.description}</p>
        <div className="article-meta">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.updatedAt ? (
            <span>Updated <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time></span>
          ) : null}
        </div>
        {post.tags.length > 0 ? (
          <ul className="article-tags" aria-label="Topics">
            {post.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
        ) : null}
      </header>

      <Section index="01" title="Overview">
        <p>
          Every company is building a factory, either explicitly or implicitly. Its raw materials are
          observations, customer needs, data, expertise, and intent. Its intermediate goods are models,
          decisions, designs, specifications, and code. Its outputs are products, services, and changed
          conditions in the world.
        </p>
        <p>
          When that factory is implicit, work moves through hidden queues. Context lives in a few people,
          decisions arrive as tickets, engineers execute fragments, and learning disappears after delivery.
          AI can make this factory produce more artifacts without making it more intelligent.
        </p>
        <p>
          Many engineers will work inside these factories. The decisive organizational choice is whether they
          are treated primarily as workers who receive solution instructions — or as{" "}
          <Term definition="a participant who improves the reusable machinery, context, standards, and feedback loops through which many work items pass.">
            factory engineers
          </Term>{" "}
          who improve the system that turns evidence and intent into reliable outcomes.
        </p>
        <p>
          Companies that distribute{" "}
          <Term definition="framing, generating, testing, and revising interventions in response to a meaningful problem.">
            solutioning
          </Term>{" "}
          — while supplying clear context, semantic boundaries, evaluation, and accountability — should gain a
          disproportionate advantage over companies where problem framing and meaningful decisions remain gated
          above the people doing the work.
        </p>
      </Section>

      <Section index="02" title="What the Previous Articles Establish">
        <p>
          This is the fourth essay in the sequence. The earlier essays describe the landscape, the problem, and
          the opportunity:
        </p>
        <ul>
          <li>
            <strong><ArticleLink slug="goals-solutions-and-value">Goals, Solutions &amp; Value</ArticleLink>:</strong>{" "}
            the factory cannot derive its own definition of value from output volume; opportunities remain grounded
            in human stakes and accountable choices.
          </li>
          <li>
            <strong><ArticleLink slug="truth-entropy-and-inference">Truth, Entropy &amp; Inference</ArticleLink>:</strong>{" "}
            predictive systems are strongest where language carries stable constraints and feedback; coherence
            alone is not evidence of correctness or meaning.
          </li>
          <li>
            <strong><ArticleLink slug="understanding-is-the-bottleneck">The Understanding Bottleneck</ArticleLink>:</strong>{" "}
            the scarce leadership capability is distilling meaningful context and multiplying a team's capacity
            to solve problems.
          </li>
        </ul>
        <p>This article asks what an organization must build once it accepts those three claims.</p>
      </Section>

      <Section index="03" title="Core Thesis">
        <p>
          The AI-era knowledge factory is not a model subscription or a collection of agents. It is an
          organizational system that turns learning into reusable capital and gives that capital back to teams as
          greater problem-solving capacity.
        </p>
        <p>
          Its highest-leverage builders are factory engineers: people who can improve the{" "}
          <Term definition="navigable relationships among people, concepts, systems, evidence, decisions, dependencies, and outcomes, with provenance.">
            context graph
          </Term>
          , domain ontology, workflows, evaluation, observability, and feedback mechanisms through which many
          future decisions and implementations will pass.
        </p>
        <Card className="essay-card">
          <CardContent>
            <p className="essay-card__claim">
              Learning becomes reusable capital; reusable capital becomes problem-solving capacity.
            </p>
          </CardContent>
        </Card>
      </Section>

      <Section index="04" title="Key Terms">
        <GlossaryCards />
      </Section>

      <Section index="05" title="1. Every Company Already Has a Factory">
        <p>Open by tracing one ordinary product change:</p>
        <Figure caption="The path of one product change">
          <ProductPipeline />
        </Figure>
        <p>
          Whether or not the company names it, this is a production system. It has queues, handoffs, specialized
          stations, quality checks, rework, bottlenecks, and feedback. Organizational design determines which
          information survives each handoff — and who is allowed to alter the plan.
        </p>
        <p>
          AI enters this existing system. It amplifies whatever is already there: clear context or vague tickets,
          shared learning or fragmented memory, good evaluation or cosmetic acceptance. The factory was always
          there; AI just makes its shape consequential faster.
        </p>
      </Section>

      <Section index="06" title="2. The Implicit Factory Creates Factory Workers">
        <p>
          The common operating model is familiar: leaders or product specialists define the solution; work is
          decomposed into tickets; engineers optimize local implementation; customer context is summarized
          several handoffs away; success is measured through output and schedule; and lessons remain in
          conversations, pull requests, or individuals.
        </p>
        <Figure caption="Two operating models for the same factory">
          <ImplicitVsExplicitFactory />
        </Figure>
        <p>
          This model makes many engineers{" "}
          <Term definition="any participant executing a bounded step designed by the larger system — a role, not a judgment about talent or status.">
            factory workers
          </Term>{" "}
          by design. Even highly capable people are prevented from improving the problem frame or the production
          system when solutioning is gated elsewhere.
        </p>
      </Section>

      <Section index="07" title="3. The Factory Engineer">
        <p>
          A factory engineer improves more than one output. They improve the capability that produces a class of
          outputs. The work takes recognizable forms:
        </p>
        <ul>
          <li>clarifying a domain concept so prompts, schemas, APIs, analytics, and UI use the same distinction;</li>
          <li>turning recurring review judgment into an evaluation suite;</li>
          <li>connecting decisions to source evidence and observed outcomes;</li>
          <li>removing a coordination queue through a safe self-service workflow;</li>
          <li>instrumenting an agent so failures become visible and learnable;</li>
          <li>encoding allowed side effects and escalation boundaries; and</li>
          <li>creating tools that let domain experts alter the system without routing every change through specialists.</li>
        </ul>
        <Figure caption="Completing one unit versus improving the capability that produces many">
          <WorkerVsFactoryEngineer />
        </Figure>
        <p>
          The role combines domain understanding, systems thinking, software craft, teaching, and institutional
          design. It is not a new job title; it is a way of working available in product, domain, research,
          operations, design, and leadership work.
        </p>
      </Section>

      <Section index="08" title="4. Distributed Solutioning Is the Advantage">
        <p>
          Compare two organizations with access to similar models. In the gated organization, a small group
          frames problems and sends solutions downstream. AI accelerates task completion, so the gate receives
          more requests and reviews more output.
        </p>
        <p>
          In the distributed organization, teams receive customer evidence, domain context, decision boundaries,
          tools, and evaluations. They can frame and test solutions locally, escalating choices that truly
          require broader authority.
        </p>
        <p>
          The second organization can explore more opportunities without lowering its standards because it
          invests in the infrastructure that makes judgment portable. Distribution is not unbounded autonomy:
          context, decision rights, safety constraints, and evaluation are exactly what make it viable.
        </p>
      </Section>

      <Section index="09" title="5. The New Knowledge-Factory Stack">
        <p>
          The stack is a way of inventorying what a factory must build — not one mandatory vendor architecture.
          Eight reusable layers:
        </p>
        <Figure caption="Eight reusable layers, from observation through learning">
          <KnowledgeFactoryStack />
        </Figure>
        <p>
          AI-assisted mathematics provides a compact example of the whole stack. A problem statement and the
          research literature supply context; an orchestrator and specialized agents generate conjectures,
          lemmas, counterexamples, scripts, and proofs; tests or proof assistants reject invalid candidates;
          provenance records which tools and assumptions produced the survivors; and mathematicians evaluate
          whether the formalization is faithful, the result is significant, and the research direction is worth
          pursuing.
        </p>
        <p>
          The factory may process far more intermediate work than any human reads line by line. That can
          increase useful search only when mechanical verification is trustworthy — and people continue to
          govern meaning, standards, attribution, and direction.
        </p>
      </Section>

      <Section index="10" title="The Strategy Discipline">
        <p>
          Strategy is a human art. It chooses a direction before the evidence can fully determine the answer. It
          creates a narrative about the world, develops deep empathy for a customer, competes for scarce
          opportunities, coordinates allies, and accepts tradeoffs for which people remain accountable.
        </p>
        <p>
          AI can accelerate research, generate options, simulate reactions, and expose inconsistencies. It cannot
          independently decide which future an organization should attempt to create or whose outcome should
          count. A knowledge factory therefore needs a strategy discipline that keeps human judgment central
          while making its evidence and feedback substantially more systematic.
        </p>
        <p>
          The central tool is an organizational <strong>second brain</strong>: not a warehouse of notes, but a
          living memory linking narratives, assumptions, customer evidence, decisions, experiments,
          relationships, and outcomes. Its purpose is to make strategy more learnable without pretending to
          automate the art.
        </p>
        <Quote><strong>Systematize the feedback. Do not automate away the judgment.</strong></Quote>
        <Figure caption="Ontology maps the possible world; strategy draws a path through it; outcomes revise both.">
          <OntologyStrategyFigure />
        </Figure>
        <p>
          The factory's ontology describes the world it can recognize — the subject of the companion essay{" "}
          <ArticleLink slug="the-ontology-factory">Ontology Factory</ArticleLink>. Strategy chooses where in
          that world to act, which change to pursue, how to earn the cooperation required, and which risks to
          accept. How the factory represents and reuses context — graph context, executable context, and the
          compounding loop — is the subject of{" "}
          <ArticleLink slug="the-cognitive-factory">Cognitive Factory</ArticleLink>.
        </p>
        <p>
          Organizations can improve and accelerate strategy by building feedback systems that preserve customer
          empathy, adversarial awareness, diplomatic relationships, decision provenance, and learning over time.
          These systems should make human strategists better informed and more{" "}
          <Gloss tip="Open to correction — the system keeps the strategist well informed while allowing their judgment to be revised by evidence.">
            corrigible
          </Gloss>{" "}
          — not replace them with a stream of plausible recommendations.
        </p>
      </Section>

      <Section index="11" title="6. Strategy Begins Where the Answer Stops Being Deducible">
        <p>
          Open with a well-instrumented company facing several plausible directions. It has market data, customer
          interviews, competitive analysis, prototypes, and AI-generated recommendations. None of them can
          deductively choose the future.
        </p>
        <p>
          Strategy begins when evidence constrains but does not determine action. Someone must interpret the
          situation, imagine a change, choose a wager, and accept responsibility for the consequences.
        </p>
      </Section>

      <Section index="12" title="7. Narrative Is a Causal Tool">
        <p>
          A strategy needs a{" "}
          <TermGloss
            term="narrative"
            definition="A causal interpretation connecting present conditions, actors, stakes, possible change, and a believable path forward."
            example="Coordinated action depends on one: what is changing, why the situation persists, who is affected, who can resist, and why this organization can act."
          />{" "}
          because coordinated action depends on an account of:
        </p>
        <ul>
          <li>what is changing;</li>
          <li>why the current situation persists;</li>
          <li>who experiences the problem and why it matters;</li>
          <li>which actors can enable or resist change;</li>
          <li>what intervention could alter the system; and</li>
          <li>why this organization can credibly pursue it.</li>
        </ul>
        <p>The narrative is not branding varnish. It is a causal model expressed in a form people can remember, challenge, and use to coordinate.</p>
        <p>AI can generate many narratives. Human strategists must test which one explains the evidence, preserves inconvenient details, and motivates an ethically and economically viable direction.</p>
      </Section>

      <Section index="13" title="8. Deep Customer Empathy Defines the Stakes">
        <p>
          Strategy must remain close to customers because a market category or metric cannot fully specify value.
          Deep empathy means understanding the customer's workflow, identity, incentives, fears, compromises,
          relationships, and cost of change.
        </p>
        <p>
          It also means understanding{" "}
          <Gloss tip="The people who would use a solution but currently cannot — and the costs they bear without becoming buyers.">
            non-consumption
          </Gloss>
          , exclusion, and the people who bear costs without becoming the buyer.
        </p>
        <p>
          Systematize this contact through{" "}
          <Gloss tip="Repeated contact with the same customers over time, rather than one-off interviews.">
            longitudinal research
          </Gloss>
          , support and sales loops, field observation, customer councils,{" "}
          <Gloss tip="A structured retrospective on deals or projects that were won or lost, separating real causes from storytelling.">
            win/loss review
          </Gloss>
          , and post-release follow-up. The purpose is not to outsource the decision to customers; it is to keep
          the strategic narrative accountable to lived conditions.
        </p>
      </Section>

      <Section index="14" title="9. Adversarial Opportunism">
        <p>Every strategic move changes another actor's options. Examine:</p>
        <ul>
          <li>competitors and substitutes;</li>
          <li>suppliers, platforms, and regulators;</li>
          <li>internal incentives and political constraints;</li>
          <li>likely countermoves;</li>
          <li>scarce timing windows;</li>
          <li>
            <Gloss tip="Advantages one side holds that competitors cannot easily copy.">
              asymmetries
            </Gloss>{" "}
            the organization can exploit; and
          </li>
          <li>ways success could attract imitation or dependency.</li>
        </ul>
        <p>
          AI can enumerate games and scenarios, but{" "}
          <TermGloss
            term="adversarial judgment"
            definition="Recognizing competition, incentives, conflict, timing, and ways other actors may resist or exploit a move — without reckless aggression."
            example="Every move changes another actor's options: countermoves, timing windows, and asymmetries matter."
          />{" "}
          depends on local knowledge, credibility, risk tolerance, and an understanding of what other people
          actually value.
        </p>
      </Section>

      <Section index="15" title="10. Diplomatic Opportunism">
        <p>Many advantages are earned through relationships rather than defeated rivals:</p>
        <ul>
          <li>partnerships and distribution;</li>
          <li>standards and ecosystems;</li>
          <li>customer trust;</li>
          <li>community legitimacy;</li>
          <li>internal coalitions;</li>
          <li>negotiated access and permissions; and</li>
          <li>incentives that let several parties benefit from the same move.</li>
        </ul>
        <p>
          <TermGloss
            term="Diplomatic strategy"
            definition="Creating value through trust, coalition, negotiation, distribution, partnership, and aligned incentives — not avoiding conflict."
            example="It asks not only 'How do we win?' but 'What arrangement makes others willing to help this future exist?'"
          />{" "}
          asks not only "How do we win?" but "What arrangement makes others willing to help this future exist?"
        </p>
        <Figure caption="Adversarial and diplomatic opportunism: competition and coalition as two complementary views of the same landscape.">
          <AdversarialDiplomaticFigure />
        </Figure>
      </Section>

      <Section index="16" title="11. Systematize the Feedback System">
        <p>Strategy improves when the factory records the loop rather than only the final plan:</p>
        <Flow>Evidence → interpretation → assumption → choice → action → response → outcome → revised interpretation.</Flow>
        <Figure caption="The strategic feedback loop: evidence → narrative → choice → response → learning.">
          <FeedbackLoopFigure />
        </Figure>
        <p>For each consequential choice, retain:</p>
        <ul>
          <li>the narrative and expected causal mechanism;</li>
          <li>supporting and contradictory evidence;</li>
          <li>assumptions and confidence;</li>
          <li>alternatives considered and rejected;</li>
          <li>owners and decision rights;</li>
          <li>
            <Gloss tip="Early signals that predict whether the strategic hypothesis is playing out, before outcomes are final.">
              leading indicators
            </Gloss>{" "}
            and{" "}
            <Gloss tip="Evidence that would challenge the current narrative if it appeared.">
              disconfirming signals
            </Gloss>
            ;
          </li>
          <li>observed customer, competitor, partner, and system responses; and</li>
          <li>the revision made after learning.</li>
        </ul>
        <p>This turns strategy from periodic theater into an ongoing learning discipline.</p>
      </Section>

      <Section index="17" title="12. The Organizational Second Brain">
        <p>
          Define the{" "}
          <TermGloss
            term="second brain"
            definition="A maintained organizational memory that connects strategic beliefs and decisions to evidence, owners, experiments, and outcomes."
            example="Search retrieves documents; a second brain reconstructs the reasoning and relationships needed for a decision."
          />{" "}
          by capability rather than software category. It should let a strategist ask:
        </p>
        <ul>
          <li>Why did we believe this market was changing?</li>
          <li>Which customer observations support that belief?</li>
          <li>Which decisions depend on it?</li>
          <li>What did we predict competitors would do?</li>
          <li>Which partnerships or relationships are material?</li>
          <li>What evidence would cause us to stop?</li>
          <li>Where did an earlier strategy fail, and what did we learn?</li>
        </ul>
        <p>
          The system should connect notes, research, domain concepts, people, decisions, experiments, metrics,
          and outcomes through{" "}
          <Gloss tip="Connections between notes, people, decisions, and evidence — not just documents in a folder.">
            graph context
          </Gloss>
          . Search retrieves documents; a second brain reconstructs the reasoning and relationships needed for a
          decision.
        </p>
        <Figure caption="The organizational second brain: a hypothesis linked to customers, evidence, decisions, actors, experiments, metrics, and outcomes.">
          <PropositionGraphFigure document={secondBrainGraph} title="The organizational second brain" />
        </Figure>
        <p>
          You can explore the same shape as an interactive graph —{" "}
          <ToolLauncher toolId="relationship-graph" href="/relationship-graph" label="Explore the relationship graph" />{" "}
          — or open the full <EssayLink to="/relationship-graph">relationship graph editor</EssayLink> on its
          own route.
        </p>
      </Section>

      <Section index="18" title="13. AI as Strategic Staff, Not Sovereign">
        <p>Use AI to:</p>
        <ul>
          <li>
            synthesize evidence with{" "}
            <Gloss tip="The record of where evidence came from, so it can be weighed and trusted.">
              provenance
            </Gloss>
            ;
          </li>
          <li>generate competing interpretations;</li>
          <li>
            <Gloss tip="Deliberately attacking a plan or assumption to find its weaknesses before commitments are made.">
              red-team
            </Gloss>{" "}
            assumptions and narratives;
          </li>
          <li>model scenarios and countermoves;</li>
          <li>identify missing stakeholders;</li>
          <li>compare a current choice with prior decisions;</li>
          <li>monitor signals tied to explicit hypotheses; and</li>
          <li>prepare decision reviews.</li>
        </ul>
        <p>
          Do not ask AI for "the strategy" and mistake a coherent genre performance for an independent choice.
          Require alternatives, uncertainty, source separation, and explicit tests of the prompt's preferred
          framing.
        </p>
      </Section>

      <Section index="19" title="14. Defensibility Is the Residue of a Learning System">
        <p>Carry forward the strongest material from the moats outline. Durable advantage can emerge from:</p>
        <ul>
          <li>scarce domain knowledge;</li>
          <li>proprietary or permissioned data;</li>
          <li>ontology and proprietary logic;</li>
          <li>rights and privileged access;</li>
          <li>brand, relationships, distribution, and trust;</li>
          <li>infrastructure and capital;</li>
          <li>network effects; and</li>
          <li>feedback loops that improve the system through use.</li>
        </ul>
        <p>
          These are not a checklist of possessions. They become moats when strategy links them into a system
          that repeatedly creates customer value and becomes difficult to reproduce.
        </p>
      </Section>

      <Section index="20" title="15. Strategic Cadence for the Factory">
        <p>Offer a practical rhythm:</p>
        <ol>
          <li>Maintain a small set of explicit strategic hypotheses.</li>
          <li>Link work and evidence to those hypotheses.</li>
          <li>Review leading signals without erasing qualitative customer evidence.</li>
          <li>Run adversarial and diplomatic reviews before major commitments.</li>
          <li>
            Record predictions and{" "}
            <Gloss tip="The evidence, decided in advance, that would cause the organization to abandon or revise a strategy.">
              stop conditions
            </Gloss>{" "}
            before outcomes are known.
          </li>
          <li>Revisit the narrative when evidence changes.</li>
          <li>Promote validated learning into ontology, evaluation, workflow, or resource allocation.</li>
        </ol>
        <p>The cadence accelerates learning while leaving final choices with accountable humans.</p>
      </Section>

      <Section index="21" title="Editorial Guardrails">
        <ul>
          <li>Do not equate strategy with a plan, backlog, goal, prediction, or generated market analysis.</li>
          <li>Do not romanticize human strategists. They are vulnerable to narrative bias, status, incentives, selective memory, and confirmation.</li>
          <li>"Adversarial" does not mean reckless aggression. It means taking competing interests, countermoves, and power seriously.</li>
          <li>"Diplomatic" does not mean avoiding conflict. It means understanding that many opportunities require cooperation, legitimacy, and durable relationships.</li>
          <li>Do not call a document repository a second brain unless it supports retrieval, relationships, revision, and feedback.</li>
          <li>Preserve uncertainty and minority views instead of rewriting strategic history after an outcome is known.</li>
        </ul>
      </Section>

      <Section index="22" title="Research Queue">
        <ul>
          <li>Strategy as choice under uncertainty and as a coherent system of activities.</li>
          <li>Sensemaking, narrative, and organizational decision-making.</li>
          <li>Adversarial reasoning, game theory, negotiation, coalition, and ecosystem strategy.</li>
          <li>Customer empathy and longitudinal discovery practices.</li>
          <li>Decision journals, forecasting, after-action review, and organizational memory.</li>
          <li>Evidence on AI-supported strategic work, sycophancy, order effects, and scenario generation.</li>
        </ul>
      </Section>

      <div className="essay-closing">
        <blockquote>
          The factory can remember more, simulate more, and learn faster. Strategy still begins when a person
          decides which future is worth making real.
        </blockquote>
        <blockquote>
          The companies that win will not be the ones that turn the most engineers into faster workers. They
          will be the ones that give engineers the context, authority, and tools to redesign the factory
          itself.
        </blockquote>
      </div>

      <Section index="23" title="Sources">
        <ul>
          <li>DORA, Google, <ExternalLink href="https://research.google/pubs/dora-2025-state-of-ai-assisted-software-development-report/"><em>2025 State of AI-assisted Software Development Report</em></ExternalLink>. Supports the premise that AI adoption is a systems problem that can amplify existing organizational strengths and weaknesses.</li>
          <li>Ikujiro Nonaka, <ExternalLink href="https://doi.org/10.1287/orsc.5.1.14">“A Dynamic Theory of Organizational Knowledge Creation”</ExternalLink> (1994). Develops the account of organizational knowledge as a continuously created and shared capability.</li>
          <li>James G. March, <ExternalLink href="https://doi.org/10.1287/orsc.2.1.71">“Exploration and Exploitation in Organizational Learning”</ExternalLink> (1991). Establishes the tension between searching for new possibilities and refining established capabilities.</li>
          <li>Karl E. Weick, Kathleen M. Sutcliffe, and David Obstfeld, <ExternalLink href="https://doi.org/10.1287/orsc.1050.0133">“Organizing and the Process of Sensemaking”</ExternalLink> (2005). Grounds the treatment of organizations as systems that interpret equivocal evidence and act from provisional models.</li>
          <li>James P. Walsh and Gerardo Rivera Ungson, <ExternalLink href="https://doi.org/10.5465/AMR.1991.4278992">“Organizational Memory”</ExternalLink> (1991). Supports the acquisition, retention, retrieval, use, and possible misuse of organizational memory.</li>
          <li>Michael E. Porter, <ExternalLink href="https://hbr.org/1996/11/what-is-strategy">“What Is Strategy?”</ExternalLink> (1996). Frames strategy as a coherent system of choices and activities rather than a list of operational improvements.</li>
          <li>ISO, <ExternalLink href="https://www.iso.org/standard/77520.html"><em>ISO 9241-210:2019 — Human-centred design for interactive systems</em></ExternalLink>. Grounds sustained attention to users, their needs, and human-system consequences throughout design.</li>
          <li>National Institute of Standards and Technology, <ExternalLink href="https://doi.org/10.6028/NIST.AI.100-1"><em>Artificial Intelligence Risk Management Framework (AI RMF 1.0)</em></ExternalLink> (2023). Provides continuous governance, context mapping, measurement, evaluation, and accountability practices for deployed AI systems.</li>
        </ul>
      </Section>
    </TooltipProvider>
  );
}
