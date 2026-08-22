import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { PublishedPost } from "@th-m/blogs/publish";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  LinkPreview,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useToolDrawer,
} from "@th-m/ui";
import { PropositionGraphFigure } from "@th-m/graph-visualization";
import type { GraphDocument } from "@th-m/graph-visualization";

/* ------------------------------------------------------------------ */
/* Small prose primitives                                              */
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

/** Inline jargon gloss: dotted-underline tooltip, no links, ≤45 words. */
function Term({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="thom-tooltip-trigger">{label}</span>
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
}

/** Structured gloss: hover card with a definition plus a link. */
function Gloss({
  label,
  title,
  children,
  href,
  linkLabel,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <HoverCard openDelay={120} closeDelay={120}>
      <HoverCardTrigger asChild>
        <span
          style={{
            cursor: "help",
            textDecoration: "underline dotted",
            textUnderlineOffset: ".22em",
            textDecorationColor: "var(--color-primary)",
          }}
        >
          {label}
        </span>
      </HoverCardTrigger>
      <HoverCardContent>
        <p style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 430, lineHeight: 1.15 }}>
          {title}
        </p>
        <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6, color: "var(--color-hover-card-foreground)" }}>
          {children}
          {href ? (
            <p style={{ margin: "10px 0 0" }}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--color-primary)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", textDecoration: "underline", textUnderlineOffset: ".18em" }}
              >
                {linkLabel ?? "Read more"} ↗
              </a>
            </p>
          ) : null}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function ClaimCard({ eyebrow, title, children }: { eyebrow?: string; title: string; children: React.ReactNode }) {
  return (
    <Card style={{ margin: "1.5em 0" }}>
      <CardHeader>
        {eyebrow ? (
          <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".13em", textTransform: "uppercase", color: "var(--color-primary)" }}>
            {eyebrow}
          </p>
        ) : null}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent style={{ fontFamily: "var(--font-display)", fontSize: "clamp(17px, 1.7vw, 19px)", lineHeight: 1.6, color: "var(--color-foreground)" }}>
        {children}
      </CardContent>
    </Card>
  );
}

/** Gold affordance that opens a registered tool in the global drawer. */
function Explore({ toolId, children }: { toolId: string; children: React.ReactNode }) {
  const { openTool } = useToolDrawer();
  return (
    <button type="button" className="article-tool-trigger" onClick={() => openTool(toolId)}>
      <span>{children}</span>
      <span aria-hidden="true">→</span>
    </button>
  );
}

function FigureCaption({ children }: { children: React.ReactNode }) {
  return (
    <figcaption
      style={{
        margin: "14px 0 0",
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: ".08em",
        lineHeight: 1.7,
        textTransform: "uppercase",
        color: "var(--color-foreground-muted)",
      }}
    >
      {children}
    </figcaption>
  );
}

const figureFrame: React.CSSProperties = {
  margin: "1.75em 0",
  padding: "22px",
  border: "1px solid var(--line)",
  background: "var(--color-surface)",
};

/* ------------------------------------------------------------------ */
/* F1 — Truth practices and their feedback                             */
/* ------------------------------------------------------------------ */

const TRUTH_PRACTICES = [
  {
    name: "Formal",
    validity: "validity relative to definitions, axioms, and inference rules",
    language: "explicit premises, symbolic relationships, proof obligations",
    feedback: "counterexamples and proof assistants reject invalid derivations",
  },
  {
    name: "Empirical",
    validity: "correspondence with observations",
    language: "measurement, method, uncertainty, replication, counterevidence",
    feedback: "failed predictions and unreplicated results erode the claim",
  },
  {
    name: "Operational",
    validity: "reliability in action",
    language: "procedures, preconditions, failure modes, tolerances, observed outcomes",
    feedback: "systems that crash, stall, or cost too much are corrected or retired",
  },
  {
    name: "Relational",
    validity: "significance within human purposes and relationships",
    language: "perspective, motive, consequence, interpretation, accountability",
    feedback: "people who bear the consequences accept, resist, or repair the claim",
  },
] as const;

function TruthPracticesFigure() {
  return (
    <figure aria-label="Four truth practices and the feedback that constrains their language">
      <div
        style={{
          ...figureFrame,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        {TRUTH_PRACTICES.map((practice) => (
          <div
            key={practice.name}
            style={{
              padding: "16px 18px",
              border: "1px solid var(--line)",
              background: "var(--color-card)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".13em", textTransform: "uppercase", color: "var(--color-primary)" }}>
              {practice.name} truth
            </p>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--color-foreground)" }}>
              {practice.validity}
            </p>
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.55, color: "var(--color-foreground-muted)" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase" }}>Language favors — </span>
              {practice.language}
            </p>
            <p style={{ margin: 0, paddingTop: 8, borderTop: "1px solid var(--line)", fontSize: 12, lineHeight: 1.55, color: "var(--color-foreground-muted)" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--color-primary)" }}>Feedback — </span>
              {practice.feedback}
            </p>
          </div>
        ))}
      </div>
      <FigureCaption>
        Truth practices and their feedback — each form of truth produces a language, and an institution or consequence that rejects what does not survive it.
      </FigureCaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* F2 — Prediction under constraint (interactive distribution)         */
/* ------------------------------------------------------------------ */

const CONTINUATIONS = [
  "generic reordering",
  "sort by value",
  "sort alphabetically",
  "sort by priority",
  "sort by size",
  "bucket by range",
  "hash partition",
  "stable merge",
  "counting sort",
  "radix pass",
] as const;

const BASE_WEIGHTS = [6, 8, 7, 9, 8, 10, 8, 7, 6, 5];

const CONSTRAINTS: Array<{ label: string; favored: number[]; multiplier: number }> = [
  { label: "Name the domain: bounded integer keys", favored: [5, 6, 7, 8, 9], multiplier: 3 },
  { label: "State the family: hash- or bucket-based partitioning", favored: [5, 6], multiplier: 5 },
  { label: "Give invariants and failure modes (memory, stability)", favored: [6, 7, 8], multiplier: 3 },
  { label: "Provide examples and counterexamples", favored: [5, 6, 7, 8, 9], multiplier: 2 },
  { label: "Define what a test would count as success", favored: [6, 7, 8], multiplier: 2 },
];

function entropyBits(weights: number[]): number {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  if (total <= 0) return 0;
  let entropy = 0;
  for (const weight of weights) {
    if (weight <= 0) continue;
    const p = weight / total;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

function PredictionFigure() {
  const [active, setActive] = useState<Set<number>>(new Set());

  const { weights, entropy } = useMemo(() => {
    const computed = BASE_WEIGHTS.map((base, index) => {
      let weight = base;
      for (const constraint of CONSTRAINTS) {
        if (active.has(CONSTRAINTS.indexOf(constraint))) {
          weight *= constraint.favored.includes(index) ? constraint.multiplier : 1;
        }
      }
      return weight;
    });
    return { weights: computed, entropy: entropyBits(computed) };
  }, [active]);

  const toggle = (index: number) => {
    setActive((previous) => {
      const next = new Set(previous);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const maxWeight = Math.max(...weights);
  const constrained = active.size >= 3;

  return (
    <figure aria-label="How constraints narrow the distribution of plausible continuations">
      <div style={figureFrame}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 18 }}>
          <div style={{ padding: "12px 14px", border: "1px solid var(--line)", background: "var(--color-card)" }}>
            <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--color-foreground-muted)" }}>Ambiguous request</p>
            <p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.5, color: "var(--color-foreground)" }}>“Organize this list really fast.”</p>
          </div>
          <div style={{ padding: "12px 14px", border: "1px solid var(--color-primary)", background: "var(--color-card)" }}>
            <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--color-primary)" }}>Constrained request</p>
            <p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.5, color: "var(--color-foreground)" }}>“Implement hash-based sorting for these bounded integer keys.”</p>
          </div>
        </div>

        <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--color-foreground-muted)" }}>
          Distribution over plausible continuations
        </p>
        <div
          role="img"
          aria-label={`Probability distribution across ${CONTINUATIONS.length} possible continuations with entropy ${entropy.toFixed(2)} bits`}
          style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 160, margin: "12px 0 4px" }}
        >
          {weights.map((weight, index) => (
            <div key={CONTINUATIONS[index]} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 0 }}>
              <div
                aria-hidden="true"
                style={{
                  width: "100%",
                  height: `${Math.max(4, Math.round((weight / maxWeight) * 128))}px`,
                  background: constrained ? "var(--color-primary)" : "var(--color-foreground-muted)",
                  opacity: 0.85,
                  transition: "height 180ms var(--ease-draw), background 180ms var(--ease-draw)",
                }}
              />
              <span
                aria-hidden="true"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 8,
                  letterSpacing: ".02em",
                  color: "var(--color-foreground-muted)",
                  textAlign: "center",
                  lineHeight: 1.3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "100%",
                }}
              >
                {CONTINUATIONS[index]}
              </span>
            </div>
          ))}
        </div>

        <p style={{ margin: "0 0 14px", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".06em", color: "var(--color-primary)" }}>
          Entropy H ≈ {entropy.toFixed(2)} bits —{" "}
          {constrained
            ? "the request selects the structure; few continuations remain plausible."
            : "the model must guess what you mean; nearly any continuation is plausible."}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, borderTop: "1px solid var(--line)", paddingTop: 14 }}>
          {CONSTRAINTS.map((constraint, index) => (
            <label key={constraint.label} style={{ display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer", fontSize: 12, lineHeight: 1.45, color: "var(--color-foreground)" }}>
              <input
                type="checkbox"
                checked={active.has(index)}
                onChange={() => toggle(index)}
                style={{ accentColor: "var(--color-primary)", width: 14, height: 14 }}
              />
              {constraint.label}
            </label>
          ))}
        </div>
      </div>
      <FigureCaption>
        Prediction under constraint — each selected assumption compresses the distribution of plausible continuations and lowers the entropy the model must resolve.
      </FigureCaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* F3 — The code constraint stack                                      */
/* ------------------------------------------------------------------ */

const CONSTRAINT_STACK = [
  { layer: "Corpus", rejects: "accumulates what practitioners wrote under real conditions" },
  { layer: "Syntax", rejects: "invalid token sequences before anything else runs" },
  { layer: "Types", rejects: "invalid relationships between values and operations" },
  { layer: "Tests", rejects: "specified behavioral failures" },
  { layer: "Runtime", rejects: "crashes, latency, and resource misuse" },
  { layer: "Users", rejects: "behavior that fails in the world — physical, economic, human" },
] as const;

function ConstraintStackFigure() {
  return (
    <figure aria-label="The code constraint stack from corpus to user consequences">
      <div
        style={{
          ...figureFrame,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: 560,
        }}
      >
        {CONSTRAINT_STACK.map((entry, index) => (
          <div
            key={entry.layer}
            style={{
              display: "grid",
              gridTemplateColumns: "110px minmax(0, 1fr)",
              gap: 14,
              alignItems: "center",
              padding: "10px 14px",
              border: "1px solid var(--line)",
              background: index === 0 ? "var(--color-card)" : "var(--color-surface)",
            }}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--color-primary)" }}>
              {entry.layer}
            </span>
            <span style={{ fontSize: 13, lineHeight: 1.5, color: "var(--color-foreground-muted)" }}>
              {index === 0 ? "contains the patterns" : "rejects"}&nbsp;{entry.rejects}
            </span>
          </div>
        ))}
      </div>
      <FigureCaption>
        The code constraint stack — every layer filters invalid expressions, which is why the language that survives is unusually pattern-dense.
      </FigureCaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* F4 — Concept graph (revised proposition/relationship visual)        */
/* ------------------------------------------------------------------ */

const constraintGraphDocument: GraphDocument = {
  schemaVersion: 1,
  id: "truth-entropy-constraints",
  name: "How language carries constraints",
  createdAt: "2026-08-22T00:00:00.000Z",
  updatedAt: "2026-08-22T00:00:00.000Z",
  themeId: "thom-dark",
  layoutMode: "editorial",
  propositions: [
    {
      id: "prompt-hash",
      statement: "Prompt: “Implement hash-based sorting for these bounded integer keys.”",
      emphasis: true,
      pinned: false,
    },
    {
      id: "prompt-organize",
      statement: "Prompt: “Organize this list really fast.”",
      emphasis: false,
      pinned: false,
    },
    {
      id: "patterns",
      statement: "Technical language activates named patterns and assumptions",
      emphasis: true,
      pinned: false,
    },
    {
      id: "feedback",
      statement: "Feedback systems reject invalid expressions",
      emphasis: true,
      pinned: false,
    },
    {
      id: "code",
      statement: "Parsers, types, tests, runtimes, and consequences filter candidate continuations",
      emphasis: false,
      pinned: false,
    },
    {
      id: "coherence",
      statement: "Coherence is evidence about a pattern, not the world",
      emphasis: true,
      pinned: false,
    },
  ],
  relationships: [
    {
      id: "activates",
      statement: "activates a region of precise language",
      participants: [
        { nodeId: "prompt-hash", arrowAtNode: false, arrowAtRelation: false },
        { nodeId: "patterns", arrowAtNode: true, arrowAtRelation: false },
      ],
      pinned: false,
    },
    {
      id: "guesses",
      statement: "leaves the ordering rule and costs unspecified — the model guesses",
      participants: [
        { nodeId: "prompt-organize", arrowAtNode: false, arrowAtRelation: false },
        { nodeId: "coherence", arrowAtNode: true, arrowAtRelation: false },
      ],
      pinned: false,
    },
    {
      id: "shapes",
      statement: "rewards stable distinctions and rejects noise",
      participants: [
        { nodeId: "feedback", arrowAtNode: false, arrowAtRelation: false },
        { nodeId: "patterns", arrowAtNode: true, arrowAtRelation: false },
      ],
      pinned: false,
    },
    {
      id: "corpora",
      statement: "produces pattern-dense corpora a model can learn",
      participants: [
        { nodeId: "feedback", arrowAtNode: false, arrowAtRelation: false },
        { nodeId: "code", arrowAtNode: true, arrowAtRelation: false },
      ],
      pinned: false,
    },
    {
      id: "checks",
      statement: "lets patterns be checked against executable behavior",
      participants: [
        { nodeId: "code", arrowAtNode: false, arrowAtRelation: false },
        { nodeId: "coherence", arrowAtNode: true, arrowAtRelation: false },
      ],
      pinned: false,
    },
    {
      id: "selects",
      statement: "constrains which continuations are plausible",
      participants: [
        { nodeId: "patterns", arrowAtNode: false, arrowAtRelation: false },
        { nodeId: "coherence", arrowAtNode: true, arrowAtRelation: false },
      ],
      pinned: false,
    },
  ],
  poster: {
    kicker: "TRUTH, ENTROPY & INFERENCE",
    title: "How language carries constraints",
    footer: "THOM · PROPOSITION GRAPH 02",
    showLegend: true,
  },
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ArticlePage({ post }: { post: PublishedPost }) {
  const publishedLabel = new Date(`${post.publishedAt}T00:00:00.000Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <TooltipProvider delayDuration={600}>
      <div className="article-outline">
        <header className="article-outline__header">
          <p className="eyebrow">Essay</p>
          <h1>{post.title}</h1>
          <p className="article-description">{post.description}</p>
          <div className="article-meta">
            <span>Published {publishedLabel}</span>
          </div>
          {post.tags.length > 0 ? (
            <ul className="article-tags" aria-label="Topics">
              {post.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          ) : null}

          <div className="article-outline__lede">
            <p>
              Language models generate coherent continuations by learning patterns in language. Those patterns are not
              arbitrary. Different truth-seeking practices produce different forms of discourse: a proof, an
              experimental report, a program, a legal argument, and a product narrative each carry different
              constraints, conventions, and signals of validity.
            </p>
            <p>
              This article connects three ideas. First, communities encode meaningful distinctions into recurring
              language. Second, information theory gives us a way to reason about uncertainty, surprise, and
              prediction — which machine-learning systems later operationalize through conditional token prediction.
              Third, some domains, especially code, produce unusually dense and reliable patterns because syntax,
              compilers, types, tests, runtimes, and physical consequences continually reject invalid expressions.
            </p>
            <p>
              The practical destination is an intuition for working with AI: recognize when a domain has enough
              linguistic and operational structure for a model to be fluent, choose language that activates the
              relevant structure, and distinguish a coherent continuation from a correct or meaningful answer.
            </p>
            <ClaimCard eyebrow="Core thesis" title="Fluency follows structure — not the other way around">
              <p style={{ margin: 0 }}>
                Language becomes predictively useful when a domain repeatedly encodes stable distinctions,
                constraints, relationships, and consequences into its patterns of expression. A language model can
                learn those patterns and infer plausible continuations, but the reliability of that inference depends
                on the structure that produced the language. Code is a strong case because incorrect expressions
                encounter layers of mechanical rejection; loosely specified strategy, taste, or human meaning often
                lacks comparable enforcement. The difference is not that one domain contains truth and the other does
                not — it is that their language has been shaped by different feedback systems.
              </p>
            </ClaimCard>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--color-foreground-muted)" }}>
              This is the second essay in a coordinated sequence:{" "}
              <LinkPreview url="/writing/goals-solutions-and-value" asChild>
                <Link to="/writing/$slug" params={{ slug: "goals-solutions-and-value" }}>Goals, Solutions &amp; Value</Link>
              </LinkPreview>{" "}
              establishes that valuable opportunities are grounded in human stakes; this essay explains why learned
              language patterns are powerful, when they carry constraints, and where fluency breaks;{" "}
              <LinkPreview url="/writing/understanding-is-the-bottleneck" asChild>
                <Link to="/writing/$slug" params={{ slug: "understanding-is-the-bottleneck" }}>The Understanding Bottleneck</Link>
              </LinkPreview>{" "}
              asks how teams turn abundant output into better problem solving; and{" "}
              <LinkPreview url="/writing/the-knowledge-factory" asChild>
                <Link to="/writing/$slug" params={{ slug: "the-knowledge-factory" }}>The Knowledge Factory</Link>
              </LinkPreview>{" "}
              introduces the organizational system that makes that understanding reusable.
            </p>
          </div>
        </header>

        <Section index="01" title="The Mystery of the Plausible Continuation">
          <p>Consider two prompts that are grammatically similar but structurally very different:</p>
          <blockquote>
            <p>Implement hash-based sorting for these bounded integer keys.</p>
          </blockquote>
          <blockquote>
            <p>Organize this list really fast.</p>
          </blockquote>
          <p>
            Both ask for organization and speed. The first activates a technical region of language containing named
            assumptions, known implementation patterns, and recognizable tradeoffs. The second leaves the ordering
            rule, data type, size, stability, memory budget, and meaning of “fast” unspecified. A model can answer
            both fluently; only one prompt gives it much of a correctness surface.
          </p>
          <p>
            The governing question is: <strong>what happened in the world that made one pattern of language more
            informative than the other?</strong> It was not that one sentence was longer or cleverer. The
            informativity came from outside the sentence — from a community of practice that had spent decades
            encoding its distinctions into words, syntax, and standards.
          </p>
        </Section>

        <Section index="02" title="Forms of Truth Produce Forms of Language">
          <p>
            Four overlapping truth practices shape the language around us. Treat them as an editorial framework, not
            a universal philosophical taxonomy: the same claim can participate in several practices at once.
          </p>
          <ul>
            <li>
              <strong>Formal truth</strong> is validity relative to definitions, axioms, and inference rules. Its
              language favors explicit premises, symbolic relationships, and proof obligations.
            </li>
            <li>
              <strong>Empirical truth</strong> is correspondence with observations. Its language favors measurement,
              method, uncertainty, replication, and counterevidence.
            </li>
            <li>
              <strong>Operational truth</strong> is reliability in action. Its language favors procedures,
              preconditions, failure modes, tolerances, and observed outcomes.
            </li>
            <li>
              <strong>Relational truth</strong> is significance within human purposes, identities, histories, and
              relationships. Its language favors perspective, motive, consequence, interpretation, and
              accountability.
            </li>
          </ul>
          <p>
            A temperature reading can be empirically calibrated, operationally relevant to a machine, and relationally
            experienced as uncomfortable. The categories describe different constraint and meaning systems, not sealed
            kinds of sentence.
          </p>
          <TruthPracticesFigure />
          <p>
            Each practice is also a feedback system. Formal work is checked by counterexamples and proof obligations;
            empirical work by failed predictions and unreplicated results; operational work by systems that crash,
            stall, or cost too much; relational work by the people who accept, resist, or repair a claim because they
            bear its consequences. The language of a domain records which of these checks have been running — and how
            hard they bite.
          </p>
        </Section>

        <Section index="03" title="Entropy, Surprise, and Conditional Prediction">
          <p>
            Information theory gives us a precise way to talk about the uncertainty a request leaves behind. A{" "}
            <Term label="probability distribution">
              A description of how much weight a system assigns to each possible outcome; outcomes with more weight
              are considered more likely.
            </Term>{" "}
            represents uncertainty among possible messages or symbols. A less probable observation carries more{" "}
            <Term label="surprise">
              A measure of how unlikely an observation is under a distribution; rarer outcomes are more surprising.
            </Term>{" "}
            under that distribution. <Term label="Entropy">
              Shannon entropy summarizes the expected uncertainty of a distribution in bits; it is not a claim about
              disorder in the world.
            </Term>{" "}
            is the expected surprise — a summary of how much the system still has to learn before it can pick an
            outcome confidently. <Term label="Conditional prediction">
              Asking how the distribution changes when prior context is known, rather than predicting from nothing.
            </Term>{" "}
            asks how that distribution changes when prior context is known.
          </p>
          <p>
            Modern language modeling operationalizes these ideas directly. A next-token model estimates a{" "}
            <Term label="distribution">
              A description of how much weight a system assigns to each possible outcome; outcomes with more weight
              are considered more likely.
            </Term>{" "}
            over possible continuations given the preceding context. Training penalizes probability assigned away
            from observed continuations, commonly through a <Term label="cross-entropy">
              A loss that scores how well the model's predicted distribution matches the observed next token; lower
              values mean the model assigned the observed token more probability.
            </Term>{" "}
            objective. The result is not a database of sentences; it is a learned structure of conditional
            regularities.
          </p>
          <p>
            The lineage here matters. Claude Shannon did not invent language models, and next-token prediction does
            not follow automatically from his work. In{" "}
            <LinkPreview url="https://doi.org/10.1002/j.1538-7305.1948.tb01338.x" external>
              “A Mathematical Theory of Communication”
            </LinkPreview>
            , Shannon defined entropy as uncertainty in a probability distribution; in{" "}
            <LinkPreview url="https://doi.org/10.1002/j.1538-7305.1951.tb01366.x" external>
              “Prediction and Entropy of Printed English”
            </LinkPreview>
            , he had human subjects repeatedly guess the next letter of unfamiliar passages and used their prediction
            performance to estimate the redundancy of English. That is a genuine intellectual ancestor of statistical
            language modeling — and it is historical intuition, not proof that human language or thought is only
            next-token prediction.
          </p>
          <PredictionFigure />
          <p>
            The figure above is the article’s core move in miniature. An ambiguous request leaves a broad
            distribution — high entropy, many plausible continuations. A request that names a domain and states its
            assumptions leaves a narrow, peaked distribution — low entropy, a handful of testable continuations. The
            model did not become smarter between the two prompts; the second prompt simply selected more of the
            structure the model had learned.
          </p>
        </Section>

        <Section index="04" title="Language Patterns Carry the History of Constraint">
          <p>
            Patterns become meaningful when practices repeatedly reward some distinctions and reject others.
            Technical terms survive because they compress a history of use:
          </p>
          <ul>
            <li>a term names a distinction practitioners repeatedly needed;</li>
            <li>surrounding syntax records typical relationships;</li>
            <li>examples teach ordinary cases;</li>
            <li>failures and counterexamples define boundaries; and</li>
            <li>institutions, tools, and consequences reinforce the usage.</li>
          </ul>
          <p>
            This is why language can contain more knowledge than a glossary reveals. A term of art can point into a
            network of assumptions and operations — a <Gloss label="bounded context" title="Bounded context">
              A boundary around a set of terms and rules that keeps them consistent with each other; outside the
              boundary the same word may mean something different. Coined in domain-driven design to keep models
              honest.
            </Gloss>{" "}
            that a dictionary entry cannot enumerate. But it also explains stale or harmful fluency: language
            faithfully records fashionable habits, institutional blind spots, and repeated mistakes too.
          </p>
          <PropositionGraphFigure
            document={constraintGraphDocument}
            title="How language carries constraints"
            className="article-outline__figure"
          />
          <p className="article-outline__flow">Language = pattern + constraint + feedback. Fluency rides on the constraint.</p>
          <p>
            This graph is a map of the argument, not a claim about which sentences are true. The relationships it
            draws — a precise prompt activating named patterns, feedback systems shaping those patterns, and
            executable checks grounding coherence — are the linguistic constraints this article is about. You can{" "}
            <Explore toolId="relationship-graph">Explore the relationship graph</Explore>{" "}
            in the tool drawer, or open the full{" "}
            <LinkPreview url="/relationship-graph" asChild>
              <Link to="/relationship-graph">relationship graph editor</Link>
            </LinkPreview>{" "}
            on its own route.
          </p>
        </Section>

        <Section index="05" title="Why Code Is So Pattern-Dense">
          <p>
            The practical constraints that enforce programming-language patterns form a stack. Each layer rejects
            invalid expressions before the next one ever sees them:
          </p>
          <ConstraintStackFigure />
          <p>
            These filters produce large corpora in which many patterns map to executable behavior. That makes code
            unusually compatible with predictive generation. It does not guarantee that the requested behavior was
            the right behavior — and it does not make code fully objective. Requirements, architecture, naming,
            product behavior, and acceptable tradeoffs remain human judgments.
          </p>
          <p>
            Formal mathematics intensifies the same pattern density. Definitions restrict meaning, proof rules
            constrain inference, counterexamples eliminate false generalizations, and{" "}
            <Term label="proof assistant">
              A tool like Lean that mechanically checks derivations and rejects invalid proofs.
            </Term>{" "}
            such as{" "}
            <LinkPreview url="https://lean-lang.org/" external>
              Lean
            </LinkPreview>{" "}
            can mechanically reject invalid derivations. Models can therefore search a dense field of candidate steps
            and receive sharper feedback than most natural-language domains provide. Even so, a verified derivation
            does not decide whether the formal statement captures the intended problem, or whether the result
            matters. That consequence becomes a case study in The Understanding Bottleneck.
          </p>
          <p>
            The deeper contrast is what the notes for this essay call{" "}
            <Gloss label="evaluative closure" title="Evaluative closure">
              Whether a task supplies enough evidence, constraints, feedback, and authority to determine whether a
              change is better. Code optimization usually closes the loop; strategy usually cannot.
            </Gloss>
            . A coding task often gives the system enough evidence, constraints, feedback, and authority to determine
            whether its change is better — the tests and benchmarks value the result on the system’s behalf. A
            strategy task often asks the system to define “better” while simultaneously guessing the world, the
            values, and the acceptable tradeoffs. The repository contains much of the relevant state for one; the
            decisive facts for the other may be tacit, private, or still being discovered.
          </p>
        </Section>

        <Section index="06" title="“Hash Sort” Versus “Organize This List Really Fast”">
          <p>
            The two prompts from the opening are a lesson in semantic compression. An algorithm name can activate
            expectations about input shape, complexity, memory, stability, and implementation. But{" "}
            <Gloss label="hash sort" title="Hash sort is a family, not one algorithm">
              Any sorting approach that partitions keys by hash or bucket rather than comparing them pairwise —
              counting sort, bucket sort, radix passes. Which one is best depends on key range, distribution,
              stability, and memory budget, so the name alone is not precise.
            </Gloss>{" "}
            is not one universally standard optimal algorithm. The article must state the intended variant and
            assumptions — such as bounded integer keys and hash- or bucket-based partitioning — before treating the
            name as precise. The reference family is classic material; see, for example, Cormen, Leiserson, Rivest,
            and Stein,{" "}
            <LinkPreview url="https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/" external>
              Introduction to Algorithms
            </LinkPreview>
            , for the conditions under which these approaches outperform comparison sorts.
          </p>
          <p>
            “Organize this list really fast” predicts a generic response because the prompt contains almost no domain
            constraints. The model must guess what organization means and will often converge on a familiar default —
            likely a comparison sort by value, whether or not that is what you wanted. The lesson is not “use
            jargon.” It is: <strong>use the most specific valid concept available, then state the conditions that
            make it valid.</strong>
          </p>
        </Section>

        <Section index="07" title="A Map of Domain Fluency">
          <p>
            When you need to know whether a model can be trusted in a domain, look for evidence that the domain’s
            language is well grounded:
          </p>
          <ul>
            <li>stable vocabulary inside a bounded context;</li>
            <li>repeated relationships among named concepts;</li>
            <li>examples and counterexamples;</li>
            <li>external checks or observable consequences;</li>
            <li>explicit uncertainty and disagreement;</li>
            <li>maintained standards, tests, or professional practices; and</li>
            <li>enough representative source material to expose variation.</li>
          </ul>
          <p>
            The warning signs are the mirror image: overloaded terms, fashionable but untested narratives, hidden
            value conflicts, sparse evidence, no corrective feedback, and evaluation that depends entirely on whether
            an answer sounds right. Fluency is domain- and task-specific, not one global measure of intelligence —
            the same model can be sharp in a strongly constrained domain and glib in a weakly constrained one.
          </p>
        </Section>

        <Section index="08" title="Prompting as Constraint Selection">
          <p>
            While vibe designing a web logo, I realized I needed to eat my own dog food. My early prompts described
            the result I wanted in broad visual language, but they left too many consequential choices ambiguous. The
            model could produce plausible variations without reliably producing the typography I had in mind.
          </p>
          <p>
            I then pulled in visual references, established guidelines, and principles of typography. I also began
            prompting with the specific language used in bona fide typography work. The model performed much more
            accurately — not because the terminology was a magic incantation, but because the prompt now selected a
            more structured domain and supplied distinctions against which the result could be judged. The original
            failure was not a lack of prompt cleverness; I had supplied an underspecified problem. References
            narrowed the visual possibility space, typography principles supplied constraints, and professional
            vocabulary activated patterns connected to established relationships and practices. The model still
            required human evaluation, but it no longer had to guess what kind of work I meant.
          </p>
          <p>A practical sequence falls out of that experience:</p>
          <ol>
            <li>Name the domain and bounded context.</li>
            <li>Use established terms of art only when their assumptions apply.</li>
            <li>State invariants, inputs, outputs, and unacceptable failure modes.</li>
            <li>Provide representative examples and counterexamples.</li>
            <li>Define what evidence or test would count as success.</li>
            <li>Ask the model to identify missing distinctions before generating the answer.</li>
            <li>Route the result to an evaluator capable of checking the relevant truth practice.</li>
          </ol>
          <p>
            Prompt quality is not ornamental phrasing. It is the selection and compression of the context that should
            govern inference. The same move that makes prompts work also explains the article’s asymmetry: the{" "}
            <Term label="cross-entropy">
              A loss that scores how well the model's predicted distribution matches the observed next token; lower
              values mean the model assigned the observed token more probability.
            </Term>{" "}
            objective rewards the model for predicting what the training text actually contains, and training text
            from strongly constrained domains contains fewer plausible continuations to choose between.
          </p>
        </Section>

        <Section index="09" title="Coherence Is Evidence About a Pattern, Not the World">
          <p>Close by separating three judgments that are easy to conflate:</p>
          <Card style={{ margin: "1.5em 0" }}>
            <CardHeader>
              <CardTitle>Coherence · Correctness · Meaning</CardTitle>
            </CardHeader>
            <CardContent>
              <table>
                <thead>
                  <tr>
                    <th>Judgment</th>
                    <th>Question</th>
                    <th>Can AI help?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Coherence</strong></td>
                    <td>Does the response fit the language patterns of the requested domain?</td>
                    <td>Yes — this is what predictive generation is good at.</td>
                  </tr>
                  <tr>
                    <td><strong>Correctness</strong></td>
                    <td>Does it survive that domain’s tests and evidence?</td>
                    <td>Yes, when the domain has mechanical checks and the checks are run.</td>
                  </tr>
                  <tr>
                    <td><strong>Meaning</strong></td>
                    <td>Does it solve a problem that matters to the people who bear the consequences?</td>
                    <td>Only with human judgment about stakes, values, and context.</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
          <p>
            AI can help with all three, but success at the first can simulate success at the other two. A response
            that sounds exactly like the domain — right vocabulary, right shape, right cadence — is evidence that the
            model has learned the pattern. It is not evidence that the pattern survived the domain’s tests, and it is
            not evidence that the answer matters to anyone. Recognizing that gap is the intuition this article is
            trying to leave you with: distinguish a coherent continuation from a correct answer, and both from a
            meaningful one.
          </p>
        </Section>

        <div className="article-outline__closing">
          <blockquote>
            A model is fluent where language has learned to carry the constraints. Our work is to know when those
            patterns are evidence — and when they are only the shape of an answer.
          </blockquote>
          <p>Closing line</p>
        </div>
      </div>
    </TooltipProvider>
  );
}
