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

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return <LinkPreview url={href} external>{children}</LinkPreview>;
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

/* ------------------------------------------------------------------ */
/* Series footer                                                       */
/* ------------------------------------------------------------------ */

const seriesLinks: Array<[string, string]> = [
  ["Goals, Solutions & Value", "/writing/goals-solutions-and-value"],
  ["Truth, Entropy & Inference", "/writing/truth-entropy-and-inference"],
  ["The Understanding Bottleneck", "/writing/understanding-is-the-bottleneck"],
  ["The Knowledge Factory", "/writing/the-knowledge-factory"],
  ["Ontology Factory", "/writing/the-ontology-factory"],
  ["Cognitive Factory", "/writing/the-cognitive-factory"],
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ArticlePage({ post }: { post: PublishedPost }) {
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
          Every company is building a factory, and{" "}
          <ArticleLink slug="the-knowledge-factory">The Knowledge Factory</ArticleLink> described its operating
          system: an organization that turns evidence and intent into reusable capability. This essay examines how
          that factory thinks.
        </p>
        <p>
          Cognition is not a model subscription or a collection of agents. It is how the organization represents
          context, checks it against action, and learns from outcomes. Concretely, the factory's cognition has
          four parts:
        </p>
        <ul>
          <li>
            <strong>Graph context exploration</strong> asks relational questions — which evidence motivated this
            capability, which decisions depend on this assumption — instead of treating context as documents
            containing matching words.
          </li>
          <li>
            <strong>Executable context</strong> turns institutional knowledge into contracts: a definition becomes
            a schema, a customer promise becomes an evaluation, an observed failure becomes a regression case.
          </li>
          <li>
            <strong>The compounding loop</strong> returns every outcome to the system as evidence that updates
            context and evaluation, so capability grows through use.
          </li>
          <li>
            <strong>A diagnostic build order</strong> says what to build first: expose evidence, name distinctions,
            build evaluation before scaling generation, instrument outcomes, and give teams authority inside the
            new boundaries.
          </li>
        </ul>
        <p>
          The diagnostic for how far this cognition reaches is the{" "}
          <Term definition="how much of the relevant domain a system can observe, interpret, affect, and learn from.">
            cognitive light cone
          </Term>{" "}
          — how much of the relevant domain the system can observe, interpret, affect, and learn from. This
          essay is where the organization implements the machinery that advances it down the light cone.
        </p>
        <p>
          The factory also needs two human-governed disciplines to keep this cognition purposeful: ontology maps
          the domain, and strategy chooses direction. Both are developed in their own essays, and this essay
          closes by connecting them.
        </p>
      </Section>

      <Section index="02" title="Relationship to the Series">
        <p>
          This is the sixth essay in the sequence.{" "}
          <ArticleLink slug="the-knowledge-factory"><strong>The Knowledge Factory</strong></ArticleLink>{" "}
          introduced the operating system: an organization that turns evidence and intent into reusable
          capability.{" "}
          <ArticleLink slug="the-ontology-factory"><strong>The Ontology Factory</strong></ArticleLink>{" "}
          mapped that system's semantic infrastructure. This essay examines how the factory thinks — the
          cognition that makes the map useful, the learning compound, and the light cone that measures how far
          that cognition reaches. The strategy discipline that chooses where the factory should act is covered
          inside{" "}
          <ArticleLink slug="the-knowledge-factory">The Knowledge Factory</ArticleLink>.
        </p>
      </Section>

      <Section index="03" title="Extending Loop and Graph Engineering">
        <p>
          This essay extends two established engineering ideas.{" "}
          <strong>Loop engineering</strong> builds feedback systems in which outcomes return as evidence that
          updates context and evaluation; <strong>graph engineering</strong> builds traversable relationships
          among people, concepts, systems, evidence, decisions, and outcomes. The cognitive factory is both of
          those — and it extends both with ontology and cognition:
        </p>
        <ul>
          <li>
            <strong>Ontology</strong> makes a loop or a graph checkable rather than plausible: stable terms,
            boundaries, invariants, and evidence rules that let the machinery be validated instead of admired.
            Without ontology, the graph degenerates into named edges and the loop into dashboards.
          </li>
          <li>
            <strong>Cognition</strong> is what the machinery is for. The{" "}
            <Term definition="how much of the relevant domain a system can observe, interpret, affect, and learn from.">
              cognitive light cone
            </Term>{" "}
            measures how much of the relevant domain the system can observe, interpret, affect, and learn from,
            and every loop and graph in this essay exists to advance it.
          </li>
        </ul>
        <p>
          The sections that follow are the implementation of that extension: graph context and executable
          context (the graph made semantic), the compounding loop (the loop made systemic), and the scorecard
          and build order that decide how far the cognition reaches.
        </p>
      </Section>

      <Section index="04" title="1. Graph Context Exploration">
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
          graph database. The product requirement is traversable relationships with{" "}
          <Term definition="the record of where evidence came from, so it can be weighed and trusted.">
            provenance
          </Term>{" "}
          — not a particular storage engine.
        </p>
      </Section>

      <Section index="05" title="2. From Documents to Executable Context">
        <p>
          Documents remain important, but the factory needs context that can guide and check action:
        </p>
        <ExecutableContextCard />
        <p>
          This is how institutional knowledge becomes productive capital rather than a larger pile of prose.
        </p>
      </Section>

      <Section index="06" title="3. The Compounding Loop">
        <p>The factory's return comes from a loop:</p>
        <Figure caption="Work produces outcomes; retained learning improves the next work">
          <CompoundingLoop />
        </Figure>
        <p>
          The loop compounds only when the organization captures corrections. More AI output without retained
          learning is throughput, not a knowledge factory.
        </p>
      </Section>

      <Section index="07" title="4. The Cognitive Light Cone Scorecard">
        <p>
          The cognitive factory is where an organization implements the machinery that advances it down the
          light cone. This essay makes an <strong>organizational adaptation</strong> of Michael Levin&apos;s{" "}
          <Term definition="Levin's framework for the spatiotemporal scope and complexity of goals a system can pursue.">
            cognitive light cone
          </Term>
          : it uses the metaphor as a diagnostic for how much of the relevant domain a system can observe,
          interpret, affect, and learn from. Three systems in increasing reach:
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

      <Section index="08" title="5. What Companies Should Build First">
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

      <Section index="09" title="6. The Two Factory Disciplines">
        <p>
          The knowledge factory needs two human-governed disciplines.{" "}
          <ArticleLink slug="the-ontology-factory">Ontology Factory</ArticleLink> asks how humans map the domain
          so models and teams share the right entities, relationships, constraints, and evidence. The strategy
          discipline — covered in{" "}
          <ArticleLink slug="the-knowledge-factory">The Knowledge Factory</ArticleLink> — asks how humans choose
          direction through narrative, empathy, opportunism, memory, and systematic feedback.
        </p>
        <p>Ontology makes the factory coherent. Strategy makes it purposeful.</p>
      </Section>

      <Section index="10" title="Sources">
        <ul>
          <li>Michael Levin, <ExternalLink href="https://doi.org/10.3389/fnsys.2022.768201">“Technological Approach to Mind Everywhere: An Experimentally-Grounded Framework for Understanding Diverse Bodies and Minds”</ExternalLink> (2022). Introduces the cognitive-light-cone framework adapted as an organizational diagnostic in this essay.</li>
          <li>Patrick Lewis and colleagues, <ExternalLink href="https://proceedings.neurips.cc/paper/2020/hash/6b493230-Abstract.html">“Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks”</ExternalLink> (2020). Establishes retrieval from explicit non-parametric memory and identifies provenance and knowledge updating as design problems.</li>
          <li>Shunyu Yao and colleagues, <ExternalLink href="https://arxiv.org/abs/2210.03629">“ReAct: Synergizing Reasoning and Acting in Language Models”</ExternalLink> (2023). Demonstrates an agent pattern that interleaves model reasoning, tool actions, environmental observations, and plan updates.</li>
          <li>Noah Shinn and colleagues, <ExternalLink href="https://papers.nips.cc/paper_files/paper/2023/hash/1b44b878bb782e6954cd888628510e90-Abstract-Conference.html">“Reflexion: Language Agents with Verbal Reinforcement Learning”</ExternalLink> (2023). Tests the use of retained task feedback in episodic text memory to improve subsequent agent trials.</li>
          <li>W3C, <ExternalLink href="https://www.w3.org/TR/prov-o/">“PROV-O: The PROV Ontology”</ExternalLink> (2013). Defines a standard model for representing provenance among entities, activities, and agents.</li>
          <li>National Institute of Standards and Technology, <ExternalLink href="https://doi.org/10.6028/NIST.AI.600-1"><em>Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile</em></ExternalLink> (2024). Supports lifecycle governance, context mapping, measurement, documentation, and human accountability for generative-AI systems.</li>
          <li>DORA, Google, <ExternalLink href="https://research.google/pubs/dora-2025-state-of-ai-assisted-software-development-report/"><em>2025 State of AI-assisted Software Development Report</em></ExternalLink>. Supports the claim that effective AI adoption depends on the surrounding organizational system and capabilities rather than model access alone.</li>
        </ul>
      </Section>

      <div className="article-outline__closing">
        <div className="article-outline__content" style={{ marginTop: 48 }}>
          <p className="eyebrow">Part of the six-essay series</p>
          <ol style={{ marginTop: 16 }}>
            {seriesLinks.map(([label, href]) => (
              <li key={href}>
                {href === "/writing/the-cognitive-factory" ? (
                  <strong>{label}</strong>
                ) : (
                  <LinkPreview url={href}>{label}</LinkPreview>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </TooltipProvider>
  );
}
