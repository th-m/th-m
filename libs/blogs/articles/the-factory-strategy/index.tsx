import { Fragment } from "react";
import type { PublishedPost } from "@th-m/blogs/publish";
import {
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
import {
  PropositionGraphFigure,
  type GraphDocument,
  type RelationshipParticipant,
} from "@th-m/graph-visualization";

/* ------------------------------------------------------------------ */
/* Layout helpers (series-consistent `article-outline` presentation)   */
/* ------------------------------------------------------------------ */

function Section({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
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

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <h3>{title}</h3>
      {children}
    </>
  );
}

function Quote({ children }: { children: React.ReactNode }) {
  return <blockquote><p>{children}</p></blockquote>;
}

function Flow({ children }: { children: React.ReactNode }) {
  return <p className="article-outline__flow">{children}</p>;
}

function Terms({ items }: { items: Array<[string, string]> }) {
  return (
    <dl>
      {items.map(([term, definition]) => (
        <Fragment key={term}>
          <dt>{term}</dt>
          <dd>{definition}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

function Figure({ caption, children }: { caption: string; children: React.ReactNode }) {
  return (
    <figure
      className="article-figure"
      style={{ margin: "2.4em 0 2.8em" }}
    >
      {children}
      <figcaption
        style={{
          marginTop: 12,
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: "var(--color-foreground-muted)",
          lineHeight: 1.6,
        }}
      >
        {caption}
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Contextual interactions (@th-m/ui)                                  */
/* ------------------------------------------------------------------ */

/** Inline jargon gloss — a ≤3-line floating tooltip. Attention stays in the sentence. */
function Gloss({ tip, children }: { tip: string; children: React.ReactNode }) {
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

/** Cross-article link with a floating destination preview. */
function EssayLink({ to, children }: { to: string; children: React.ReactNode }) {
  return <LinkPreview url={to}>{children}</LinkPreview>;
}

/* ------------------------------------------------------------------ */
/* Illustrations                                                       */
/* ------------------------------------------------------------------ */

/**
 * Figure 1 — Ontology and strategy: ontology maps the possible world;
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
 * Figure 2 — The strategic feedback loop: evidence → narrative → choice →
 * response → learning, with learning returning as revised interpretation.
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

const participant = (nodeId: string): RelationshipParticipant => ({
  nodeId,
  arrowAtNode: false,
  arrowAtRelation: false,
});

/**
 * Figure 3 — The organizational second brain: a hypothesis linked to
 * customers, evidence, decisions, actors, experiments, metrics, and outcomes.
 * Rendered as a live proposition graph by the shared layout pipeline.
 */
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
    kicker: "Factory Strategy",
    title: "The organizational second brain",
    footer: "Hypothesis linked to customers, evidence, decisions, actors, experiments, metrics, and outcomes.",
    showLegend: true,
  },
};

/**
 * Figure 4 — Adversarial and diplomatic opportunism: competition and
 * coalition as two complementary views of the same landscape.
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
/* Series footer                                                       */
/* ------------------------------------------------------------------ */

const seriesLinks: Array<[string, string]> = [
  ["Solutions, Meaning & Value", "/writing/solutions-meaning-and-value"],
  ["Truth, Entropy & Inference", "/writing/truth-entropy-and-inference"],
  ["The Understanding Bottleneck", "/writing/understanding-is-the-bottleneck"],
  ["The Knowledge Factory", "/writing/the-knowledge-factory"],
  ["Factory Ontology", "/writing/the-factory-ontology"],
  ["Factory Strategy", "/writing/the-factory-strategy"],
];

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(`${value}T00:00:00.000Z`),
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ArticlePage({ post }: { post: PublishedPost }) {
  return (
    <TooltipProvider>
      <div className="article-outline">
        <header className="article-outline__header">
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
          <p>Strategy is a human art. It chooses a direction before the evidence can fully determine the answer. It creates a narrative about the world, develops deep empathy for a customer, competes for scarce opportunities, coordinates allies, and accepts tradeoffs for which people remain accountable.</p>
          <p>AI can accelerate research, generate options, simulate reactions, and expose inconsistencies. It cannot independently decide which future an organization should attempt to create or whose outcome should count. A <EssayLink to="/writing/the-knowledge-factory">knowledge factory</EssayLink> therefore needs a strategy discipline that keeps human judgment central while making its evidence and feedback substantially more systematic.</p>
          <p>The central tool is an organizational <strong>second brain</strong>: not a warehouse of notes, but a living memory linking narratives, assumptions, customer evidence, decisions, experiments, relationships, and outcomes. Its purpose is to make strategy more learnable without pretending to automate the art.</p>
        </Section>

        <Section index="02" title="Working Subtitle">
          <Quote><strong>Systematize the feedback. Do not automate away the judgment.</strong></Quote>
        </Section>

        <Section index="03" title="Core Thesis">
          <p>The factory's ontology describes the world it can recognize. Strategy chooses where in that world to act, which change to pursue, how to earn the cooperation required, and which risks to accept.</p>
          <Figure caption="Figure 01 — Ontology maps the possible world; strategy draws a path through it; outcomes revise both.">
            <OntologyStrategyFigure />
          </Figure>
          <p>Organizations can improve and accelerate strategy by building feedback systems that preserve customer empathy, adversarial awareness, diplomatic relationships, decision provenance, and learning over time. These systems should make human strategists better informed and more <Gloss tip="Open to correction — the system keeps the strategist well informed while allowing their judgment to be revised by evidence.">corrigible</Gloss> — not replace them with a stream of plausible recommendations.</p>
        </Section>

        <Section index="04" title="Relationship to the Series">
          <p>This is the sixth essay and the strategic companion to <EssayLink to="/writing/the-factory-ontology"><strong>The Factory — Ontology</strong></EssayLink>:</p>
          <ul>
            <li>Ontology asks: <strong>What exists here, how does it relate, and what can we know?</strong></li>
            <li>Strategy asks: <strong>What future should we pursue, with whom, against what resistance, and at what cost?</strong></li>
          </ul>
          <p>Together they supply semantic coherence and purposeful direction to <EssayLink to="/writing/the-knowledge-factory"><strong>The Knowledge Factory</strong></EssayLink>.</p>
        </Section>

        <Section index="05" title="Intended Reader">
          <p>Founders, executives, product and engineering leaders, strategists, and senior individual contributors responsible for choosing direction under uncertainty.</p>
        </Section>

        <Section index="06" title="Key Terms">
          <Terms items={[
            ["Strategy", "a coherent set of choices about a desired future, the obstacles and opportunities between here and there, and the coordinated actions used to change the situation."],
            ["Narrative", "a causal interpretation connecting present conditions, actors, stakes, possible change, and a believable path forward."],
            ["Adversarial opportunism", "recognizing competition, incentives, conflict, timing, and ways other actors may resist or exploit a move."],
            ["Diplomatic opportunism", "creating value through trust, coalition, negotiation, distribution, partnership, and aligned incentives."],
            ["Second brain", "a maintained organizational memory that connects strategic beliefs and decisions to evidence, owners, experiments, and outcomes."],
          ]} />
        </Section>

        <Section index="07" title="Editorial Guardrails">
          <ul>
            <li>Do not equate strategy with a plan, backlog, goal, prediction, or generated market analysis.</li>
            <li>Do not romanticize human strategists. They are vulnerable to narrative bias, status, incentives, selective memory, and confirmation.</li>
            <li>"Adversarial" does not mean reckless aggression. It means taking competing interests, countermoves, and power seriously.</li>
            <li>"Diplomatic" does not mean avoiding conflict. It means understanding that many opportunities require cooperation, legitimacy, and durable relationships.</li>
            <li>Do not call a document repository a second brain unless it supports retrieval, relationships, revision, and feedback.</li>
            <li>Preserve uncertainty and minority views instead of rewriting strategic history after an outcome is known.</li>
          </ul>
        </Section>

        <Section index="08" title="Section Notes">
          <Sub title="1. Strategy Begins Where the Answer Stops Being Deducible">
            <p>Open with a well-instrumented company facing several plausible directions. It has market data, customer interviews, competitive analysis, prototypes, and AI-generated recommendations. None of them can deductively choose the future.</p>
            <p>Strategy begins when evidence constrains but does not determine action. Someone must interpret the situation, imagine a change, choose a wager, and accept responsibility for the consequences.</p>
          </Sub>

          <Sub title="2. Narrative Is a Causal Tool">
            <p>A strategy needs a <TermGloss
              term="narrative"
              definition="A causal interpretation connecting present conditions, actors, stakes, possible change, and a believable path forward."
              example="Coordinated action depends on one: what is changing, why the situation persists, who is affected, who can resist, and why this organization can act."
            /> because coordinated action depends on an account of:</p>
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
          </Sub>

          <Sub title="3. Deep Customer Empathy Defines the Stakes">
            <p>Strategy must remain close to customers because a market category or metric cannot fully specify value. Deep empathy means understanding the customer's workflow, identity, incentives, fears, compromises, relationships, and cost of change.</p>
            <p>It also means understanding <Gloss tip="The people who would use a solution but currently cannot — and the costs they bear without becoming buyers.">non-consumption</Gloss>, exclusion, and the people who bear costs without becoming the buyer.</p>
            <p>Systematize this contact through <Gloss tip="Repeated contact with the same customers over time, rather than one-off interviews.">longitudinal research</Gloss>, support and sales loops, field observation, customer councils, <Gloss tip="A structured retrospective on deals or projects that were won or lost, separating real causes from storytelling.">win/loss review</Gloss>, and post-release follow-up. The purpose is not to outsource the decision to customers; it is to keep the strategic narrative accountable to lived conditions.</p>
          </Sub>

          <Sub title="4. Adversarial Opportunism">
            <p>Every strategic move changes another actor's options. Examine:</p>
            <ul>
              <li>competitors and substitutes;</li>
              <li>suppliers, platforms, and regulators;</li>
              <li>internal incentives and political constraints;</li>
              <li>likely countermoves;</li>
              <li>scarce timing windows;</li>
              <li><Gloss tip="Advantages one side holds that competitors cannot easily copy.">asymmetries</Gloss> the organization can exploit; and</li>
              <li>ways success could attract imitation or dependency.</li>
            </ul>
            <p>AI can enumerate games and scenarios, but <TermGloss
              term="adversarial judgment"
              definition="Recognizing competition, incentives, conflict, timing, and ways other actors may resist or exploit a move — without reckless aggression."
              example="Every move changes another actor's options: countermoves, timing windows, and asymmetries matter."
            /> depends on local knowledge, credibility, risk tolerance, and an understanding of what other people actually value.</p>
          </Sub>

          <Sub title="5. Diplomatic Opportunism">
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
            <p><TermGloss
              term="Diplomatic strategy"
              definition="Creating value through trust, coalition, negotiation, distribution, partnership, and aligned incentives — not avoiding conflict."
              example="It asks not only 'How do we win?' but 'What arrangement makes others willing to help this future exist?'"
            /> asks not only "How do we win?" but "What arrangement makes others willing to help this future exist?"</p>
            <Figure caption="Figure 04 — Adversarial and diplomatic opportunism: competition and coalition as two complementary views of the same landscape.">
              <AdversarialDiplomaticFigure />
            </Figure>
          </Sub>

          <Sub title="6. Systematize the Feedback System">
            <p>Strategy improves when the factory records the loop rather than only the final plan:</p>
            <Flow>Evidence → interpretation → assumption → choice → action → response → outcome → revised interpretation.</Flow>
            <Figure caption="Figure 02 — The strategic feedback loop: evidence → narrative → choice → response → learning.">
              <FeedbackLoopFigure />
            </Figure>
            <p>For each consequential choice, retain:</p>
            <ul>
              <li>the narrative and expected causal mechanism;</li>
              <li>supporting and contradictory evidence;</li>
              <li>assumptions and confidence;</li>
              <li>alternatives considered and rejected;</li>
              <li>owners and decision rights;</li>
              <li><Gloss tip="Early signals that predict whether the strategic hypothesis is playing out, before outcomes are final.">leading indicators</Gloss> and <Gloss tip="Evidence that would challenge the current narrative if it appeared.">disconfirming signals</Gloss>;</li>
              <li>observed customer, competitor, partner, and system responses; and</li>
              <li>the revision made after learning.</li>
            </ul>
            <p>This turns strategy from periodic theater into an ongoing learning discipline.</p>
          </Sub>

          <Sub title="7. The Organizational Second Brain">
            <p>Define the <TermGloss
              term="second brain"
              definition="A maintained organizational memory that connects strategic beliefs and decisions to evidence, owners, experiments, and outcomes."
              example="Search retrieves documents; a second brain reconstructs the reasoning and relationships needed for a decision."
            /> by capability rather than software category. It should let a strategist ask:</p>
            <ul>
              <li>Why did we believe this market was changing?</li>
              <li>Which customer observations support that belief?</li>
              <li>Which decisions depend on it?</li>
              <li>What did we predict competitors would do?</li>
              <li>Which partnerships or relationships are material?</li>
              <li>What evidence would cause us to stop?</li>
              <li>Where did an earlier strategy fail, and what did we learn?</li>
            </ul>
            <p>The system should connect notes, research, domain concepts, people, decisions, experiments, metrics, and outcomes through <Gloss tip="Connections between notes, people, decisions, and evidence — not just documents in a folder.">graph context</Gloss>. Search retrieves documents; a second brain reconstructs the reasoning and relationships needed for a decision.</p>
            <Figure caption="Figure 03 — The organizational second brain: a hypothesis linked to customers, evidence, decisions, actors, experiments, metrics, and outcomes.">
              <PropositionGraphFigure document={secondBrainGraph} title="The organizational second brain" />
            </Figure>
            <p>You can explore the same shape as an interactive graph — <ToolLauncher toolId="relationship-graph" href="/relationship-graph" label="Explore the relationship graph" /> — or open the full <EssayLink to="/relationship-graph">relationship graph editor</EssayLink> on its own route.</p>
          </Sub>

          <Sub title="8. AI as Strategic Staff, Not Sovereign">
            <p>Use AI to:</p>
            <ul>
              <li>synthesize evidence with <Gloss tip="The record of where evidence came from, so it can be weighed and trusted.">provenance</Gloss>;</li>
              <li>generate competing interpretations;</li>
              <li><Gloss tip="Deliberately attacking a plan or assumption to find its weaknesses before commitments are made.">red-team</Gloss> assumptions and narratives;</li>
              <li>model scenarios and countermoves;</li>
              <li>identify missing stakeholders;</li>
              <li>compare a current choice with prior decisions;</li>
              <li>monitor signals tied to explicit hypotheses; and</li>
              <li>prepare decision reviews.</li>
            </ul>
            <p>Do not ask AI for "the strategy" and mistake a coherent genre performance for an independent choice. Require alternatives, uncertainty, source separation, and explicit tests of the prompt's preferred framing.</p>
          </Sub>

          <Sub title="9. Defensibility Is the Residue of a Learning System">
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
            <p>These are not a checklist of possessions. They become moats when strategy links them into a system that repeatedly creates customer value and becomes difficult to reproduce.</p>
          </Sub>

          <Sub title="10. Strategic Cadence for the Factory">
            <p>Offer a practical rhythm:</p>
            <ol>
              <li>Maintain a small set of explicit strategic hypotheses.</li>
              <li>Link work and evidence to those hypotheses.</li>
              <li>Review leading signals without erasing qualitative customer evidence.</li>
              <li>Run adversarial and diplomatic reviews before major commitments.</li>
              <li>Record predictions and <Gloss tip="The evidence, decided in advance, that would cause the organization to abandon or revise a strategy.">stop conditions</Gloss> before outcomes are known.</li>
              <li>Revisit the narrative when evidence changes.</li>
              <li>Promote validated learning into ontology, evaluation, workflow, or resource allocation.</li>
            </ol>
            <p>The cadence accelerates learning while leaving final choices with accountable humans.</p>
          </Sub>
        </Section>

        <Section index="09" title="Research Queue">
          <ul>
            <li>Strategy as choice under uncertainty and as a coherent system of activities.</li>
            <li>Sensemaking, narrative, and organizational decision-making.</li>
            <li>Adversarial reasoning, game theory, negotiation, coalition, and ecosystem strategy.</li>
            <li>Customer empathy and longitudinal discovery practices.</li>
            <li>Decision journals, forecasting, after-action review, and organizational memory.</li>
            <li>Evidence on AI-supported strategic work, sycophancy, order effects, and scenario generation.</li>
          </ul>
        </Section>

        <div className="article-outline__closing">
          <blockquote>The factory can remember more, simulate more, and learn faster. Strategy still begins when a person decides which future is worth making real.</blockquote>

          <div className="article-outline__content" style={{ marginTop: 48 }}>
            <p className="eyebrow">Part of the six-essay series</p>
            <ol style={{ marginTop: 16 }}>
              {seriesLinks.map(([label, href]) => (
                <li key={href}>
                  {href === "/writing/the-factory-strategy" ? (
                    <strong>{label}</strong>
                  ) : (
                    <EssayLink to={href}>{label}</EssayLink>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
