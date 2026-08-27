import { defineArticleComponents } from "@th-m/blogs/mdx";
import articleAssets from "./article-assets";
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

export { AdversarialDiplomaticFigure, ArrowMarker, ArticleLink, Card, CardContent, EssayLink, EXPLICIT_FACTORY_BOXES, ExternalLink, FeedbackLoopFigure, Figure, Flow, formatDate, Fragment, Gloss, GLOSSARY, GlossaryCards, HoverCard, HoverCardContent, HoverCardTrigger, IMPLICIT_FACTORY_BOXES, ImplicitVsExplicitFactory, KnowledgeFactoryStack, Link, LinkPreview, OntologyStrategyFigure, participant, PIPELINE_STEPS, ProductPipeline, PropositionGraphFigure, Quote, secondBrainGraph, Section, STACK_LAYERS, Term, TermGloss, ToolLauncher, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, WorkerVsFactoryEngineer };
export default defineArticleComponents(articleAssets, () => ({
  "feedback-loop-figure": FeedbackLoopFigure,
  "glossary-cards": GlossaryCards,
  "implicit-vs-explicit-factory": ImplicitVsExplicitFactory,
  "knowledge-factory-stack": KnowledgeFactoryStack,
  "product-pipeline": ProductPipeline,
  "worker-vs-factory-engineer": WorkerVsFactoryEngineer,
}));
