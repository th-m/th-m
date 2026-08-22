import { Fragment, type ReactNode } from "react";
import type { PublishedPost } from "@th-m/blogs/publish";
import {
  Card,
  CardContent,
  LinkPreview,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useToolDrawer,
} from "@th-m/ui";
import { Link } from "@tanstack/react-router";
import {
  PropositionGraphFigure,
  loadGraphLibrary,
  saveGraphLibrary,
  type GraphDocument,
  type RelationshipParticipant,
} from "@th-m/graph-visualization";

const KNOWLEDGE_FACTORY_GRAPH_ID = "knowledge-factory";

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

/* ------------------------------------------------------------------ */
/* The knowledge-factory graph, authored for the graph figure and the  */
/* relationship-graph drawer tool.                                     */
/* ------------------------------------------------------------------ */

const participant = (nodeId: string, arrowAtNode = false, arrowAtRelation = false): RelationshipParticipant => ({
  nodeId,
  arrowAtNode,
  arrowAtRelation,
});

const knowledgeFactoryGraph: GraphDocument = {
  schemaVersion: 1,
  id: KNOWLEDGE_FACTORY_GRAPH_ID,
  name: "Knowledge-factory context",
  createdAt: "2026-08-22T00:00:00.000Z",
  updatedAt: "2026-08-22T00:00:00.000Z",
  themeId: "thom-dark",
  layoutMode: "editorial",
  propositions: [
    { id: "decision", statement: "Ship the new checkout flow", emphasis: true, pinned: false },
    { id: "evidence", statement: "Support tickets describe checkout drop-off", emphasis: false, pinned: false },
    { id: "concept", statement: "“Conversation” is a bounded service concept", emphasis: false, pinned: false },
    { id: "system", statement: "Checkout depends on the payments service", emphasis: false, pinned: false },
    { id: "evaluation", statement: "Cart-abandonment regression suite", emphasis: false, pinned: false },
    { id: "owner", statement: "Payments platform team", emphasis: false, pinned: false },
    { id: "outcome", statement: "Checkout conversion rises 6%", emphasis: true, pinned: false },
  ],
  relationships: [
    {
      id: "motivated-by",
      statement: "Motivated by",
      participants: [participant("evidence"), participant("decision", true)],
      pinned: false,
    },
    {
      id: "uses-concept",
      statement: "Uses the definition of",
      participants: [participant("concept"), participant("decision")],
      pinned: false,
    },
    {
      id: "depends-on",
      statement: "Depends on",
      participants: [participant("system"), participant("decision")],
      pinned: false,
    },
    {
      id: "checked-by",
      statement: "Checked by",
      participants: [participant("evaluation"), participant("decision")],
      pinned: false,
    },
    {
      id: "owned-by",
      statement: "Owned by",
      participants: [participant("owner"), participant("decision")],
      pinned: false,
    },
    {
      id: "measured-by",
      statement: "Measured by",
      participants: [participant("decision"), participant("outcome", true)],
      pinned: false,
    },
  ],
  poster: {
    kicker: "Graph context",
    title: "A decision, connected",
    footer: "Evidence, concepts, systems, evaluations, owners, outcomes",
    showLegend: true,
  },
};

function seedKnowledgeFactoryGraph(): void {
  try {
    const library = loadGraphLibrary();
    if (!library.documents.some((document) => document.id === KNOWLEDGE_FACTORY_GRAPH_ID)) {
      library.documents.push(knowledgeFactoryGraph);
      saveGraphLibrary(library);
    }
  } catch {
    // Storage unavailable (private mode): the drawer still opens without the graph.
  }
}

function ExploreGraphButton() {
  const { openTool } = useToolDrawer();
  return (
    <button
      type="button"
      className="essay-explore"
      onClick={() => {
        seedKnowledgeFactoryGraph();
        openTool("relationship-graph", { graphId: KNOWLEDGE_FACTORY_GRAPH_ID });
      }}
    >
      Explore the graph <span aria-hidden="true">→</span>
    </button>
  );
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

const LIGHT_CONE_ROWS: Array<[string, string, string, string]> = [
  ["Observability", "Supplied context only", "Tools and memory within its bounds", "Organization-wide signals, context stores, telemetry"],
  ["Semantic context", "Prompt and retrieved text", "Objective, permissions, escalation boundaries", "Ontologies and graph context with provenance"],
  ["Evaluation", "Humans judge the response", "Bounded checks humans design", "Deterministic tests, rubrics, simulations, outcome checks"],
  ["Feedback", "None — the session ends", "Tool outcomes feed back into its workflow", "Outcomes update context, evaluations, and future work"],
  ["Reversibility", "The prompt can be rewritten", "Bounded actions can be reversed", "Provenance enables tracing and rollback"],
  ["Authority", "Humans select evidence and state the goal", "Humans set objectives and permissions", "Humans govern meaning, standards, and decisions"],
  ["Accountability", "Humans remain accountable for use", "Humans remain accountable for boundaries", "Humans remain accountable for propagated values"],
];

function LightConeScorecard() {
  return (
    <table className="essay-scorecard">
      <caption className="essay-figure__caption">The cognitive light cone scorecard</caption>
      <thead>
        <tr>
          <th scope="col">Dimension</th>
          <th scope="col">LLM</th>
          <th scope="col">Agent</th>
          <th scope="col">Knowledge factory</th>
        </tr>
      </thead>
      <tbody>
        {LIGHT_CONE_ROWS.map(([dimension, llm, agent, factory]) => (
          <tr key={dimension}>
            <th scope="row">{dimension}</th>
            <td>{llm}</td>
            <td>{agent}</td>
            <td>{factory}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const CONTEXT_MAPPINGS: Array<[string, string]> = [
  ["a definition", "becomes a schema or validation rule"],
  ["an architectural judgment", "becomes a dependency boundary"],
  ["a customer promise", "becomes an evaluation"],
  ["an exception", "becomes an escalation path"],
  ["an observed failure", "becomes a regression case"],
  ["a decision", "becomes a traceable link between evidence and outcome"],
];

function ExecutableContextCard() {
  return (
    <Card className="essay-card">
      <CardContent>
        <h4>From documents to executable context</h4>
        <dl className="essay-mapping">
          {CONTEXT_MAPPINGS.map(([from, to]) => (
            <Fragment key={from}>
              <dt>{from}</dt>
              <dd>{to}</dd>
            </Fragment>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

const GLOSSARY: Array<[string, string]> = [
  ["Knowledge factory", "the socio-technical system that transforms evidence, expertise, and intent into decisions and product outcomes."],
  ["Factory worker", "any participant executing a bounded step designed by the larger system — a role, not a judgment about talent or status."],
  ["Factory engineer", "a participant who improves the reusable machinery, context, standards, and feedback loops through which many work items pass."],
  ["Shared capital", "reusable organizational assets — ontologies, context graphs, tools, evaluations, workflows, infrastructure, and accumulated learning — that increase future capability."],
  ["Solutioning", "framing, generating, testing, and revising interventions in response to a meaningful problem."],
  ["Graph context", "navigable relationships among people, concepts, systems, evidence, decisions, dependencies, and outcomes, with provenance."],
  ["Cognitive light cone", "how much of the relevant domain a system can observe, interpret, affect, and learn from."],
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

function CompoundingLoop() {
  return (
    <svg
      className="essay-figure__svg"
      viewBox="0 0 960 460"
      role="img"
      aria-label="The compounding loop: work produces outcomes, outcomes produce evidence, evidence updates context and evaluation, better context improves the next work"
    >
      <ArrowMarker id="kf-loop-arrow" />
      <title>The compounding loop</title>

      <rect x="340" y="38" width="280" height="64" className="essay-fig-box" />
      <text x="480" y="76" textAnchor="middle" className="essay-fig-label">Work produces outcomes</text>

      <rect x="670" y="218" width="280" height="64" className="essay-fig-box" />
      <text x="810" y="256" textAnchor="middle" className="essay-fig-label">Outcomes produce evidence</text>

      <rect x="340" y="398" width="280" height="64" className="essay-fig-box" />
      <text x="480" y="436" textAnchor="middle" className="essay-fig-label">Evidence updates context &amp; evaluation</text>

      <rect x="10" y="218" width="280" height="64" className="essay-fig-box" />
      <text x="150" y="256" textAnchor="middle" className="essay-fig-label">Better context improves next work</text>

      <path d="M 620 70 C 740 70, 810 130, 810 218" className="essay-fig-loop" markerEnd="url(#kf-loop-arrow)" />
      <path d="M 810 282 C 810 360, 740 430, 620 430" className="essay-fig-loop" markerEnd="url(#kf-loop-arrow)" />
      <path d="M 340 430 C 220 430, 150 360, 150 282" className="essay-fig-loop" markerEnd="url(#kf-loop-arrow)" />
      <path d="M 150 218 C 150 130, 220 70, 340 70" className="essay-fig-loop" markerEnd="url(#kf-loop-arrow)" />

      <text x="480" y="232" textAnchor="middle" className="essay-fig-title">The compounding loop</text>
      <text x="480" y="254" textAnchor="middle" className="essay-fig-note">corrections retained — or it is just throughput</text>
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
            <strong><ArticleLink slug="solutions-meaning-and-value">Solutions, Meaning &amp; Value</ArticleLink>:</strong>{" "}
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

      <Section index="10" title="6. The Cognitive Light Cone Scorecard">
        <p>
          Use the{" "}
          <Term definition="how much of the relevant domain a system can observe, interpret, affect, and learn from.">
            cognitive light cone
          </Term>{" "}
          as a diagnostic for how much of the relevant domain a system can observe, interpret, affect, and learn
          from. Three systems in increasing reach:
        </p>
        <ul>
          <li>
            <strong>LLM:</strong> works from supplied context without its own harness. Humans select the
            evidence, state the goal, and evaluate the response.
          </li>
          <li>
            <strong>Agent:</strong> combines an LLM with tools, memory, and bounded workflows. Humans establish
            its objective, permissions, evaluation, and escalation boundaries.
          </li>
          <li>
            <strong>Knowledge factory:</strong> connects agents to organizational data, context stores,
            operational signals, evaluations, and feedback loops. Humans systematize the inputs, govern how
            evidence is interpreted, and remain accountable for the values and decisions propagated through the
            system.
          </li>
        </ul>
        <LightConeScorecard />
        <p>
          Expanding a system's cognitive light cone increases what it can coordinate; it does not by itself
          authorize the governing values it applies.
        </p>
      </Section>

      <Section index="11" title="7. Graph Context Exploration">
        <p>
          Graph context is a signature concept, not a generic knowledge-graph pitch. Most organizational search
          treats context as documents containing matching words. Graph context exploration asks relational
          questions:
        </p>
        <ul>
          <li>Which customer evidence motivated this capability?</li>
          <li>Which definition of <code>conversation</code> applies in this service?</li>
          <li>What decisions depend on this assumption?</li>
          <li>Which failures caused this evaluation to exist?</li>
          <li>Which teams, systems, and metrics will a change affect?</li>
          <li>Where does the current model conflict with observed behavior?</li>
        </ul>
        <Figure caption="A decision connected to its evidence, concepts, systems, evaluations, owners, and outcomes">
          <PropositionGraphFigure document={knowledgeFactoryGraph} title="Graph context exploration" />
        </Figure>
        <p>
          The figure above is a live proposition graph: pick a claim in the explorer to follow its
          relationships. You can open the same graph in the right-side tool drawer.
        </p>
        <p className="essay-explore-row">
          <ExploreGraphButton />
        </p>
        <p>
          The graph may be implemented through links, metadata, schemas, code dependencies, event lineage, or a
          graph database. The product requirement is traversable relationships with provenance — not a
          particular storage engine.
        </p>
      </Section>

      <Section index="12" title="8. From Documents to Executable Context">
        <p>
          Documents remain important, but the factory needs context that can guide and check action:
        </p>
        <ExecutableContextCard />
        <p>
          This is how institutional knowledge becomes productive capital rather than a larger pile of prose.
        </p>
      </Section>

      <Section index="13" title="9. The Compounding Loop">
        <p>The factory's return comes from a loop:</p>
        <Figure caption="Work produces outcomes; retained learning improves the next work">
          <CompoundingLoop />
        </Figure>
        <p>
          The loop compounds only when the organization captures corrections. More AI output without retained
          learning is throughput, not a knowledge factory.
        </p>
      </Section>

      <Section index="14" title="10. What Companies Should Build First">
        <p>Not everything at once. A diagnostic order:</p>
        <ol>
          <li>Identify the decisions or workflows with repeated context loss and review burden.</li>
          <li>Expose the customer and operational evidence behind them.</li>
          <li>Name the domain distinctions and invariants required for safe delegation.</li>
          <li>Build evaluation before scaling generation.</li>
          <li>Instrument outcomes and connect them back to decisions.</li>
          <li>Give teams authority inside the new boundaries.</li>
          <li>
            Measure whether capability, learning speed, and customer outcomes improve — not only whether token
            or labor costs fall.
          </li>
        </ol>
      </Section>

      <Section index="15" title="11. The Two Factory Disciplines">
        <p>
          The factory needs two human-governed disciplines.{" "}
          <ArticleLink slug="the-factory-ontology">Factory Ontology</ArticleLink> asks how humans map the domain
          so models and teams share the right entities, relationships, constraints, and evidence.{" "}
          <ArticleLink slug="the-factory-strategy">Factory Strategy</ArticleLink> asks how humans choose
          direction through narrative, empathy, opportunism, memory, and systematic feedback.
        </p>
        <p>Ontology makes the factory coherent. Strategy makes it purposeful.</p>
        <div className="essay-closing">
          <blockquote>
            The companies that win will not be the ones that turn the most engineers into faster workers. They
            will be the ones that give engineers the context, authority, and tools to redesign the factory
            itself.
          </blockquote>
        </div>
      </Section>
    </TooltipProvider>
  );
}
