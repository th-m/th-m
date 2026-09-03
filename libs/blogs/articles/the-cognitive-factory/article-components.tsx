import { defineArticleComponents } from "@th-m/blogs/mdx";
import articleAssets from "./article-assets";
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

function Figure({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="essay-figure">
      {children}
      <figcaption className="essay-figure__caption">{caption}</figcaption>
    </figure>
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
  ["Vision and Values", "/writing/vision-and-values"],
  ["Truth and Inference", "/writing/truth-and-inference"],
  ["Understanding and Bottlenecks", "/writing/understanding-and-bottlenecks"],
  ["The Knowledge Factory", "/writing/the-knowledge-factory"],
  ["Ontology Factory", "/writing/the-ontology-factory"],
  ["Cognitive Factory", "/writing/the-cognitive-factory"],
];

export { ArrowMarker, Card, CardContent, CompoundingLoop, CONTEXT_MAPPINGS, ExecutableContextCard, ExploreGraphButton, Figure, formatDate, Fragment, KNOWLEDGE_FACTORY_GRAPH_ID, knowledgeFactoryGraph, LIGHT_CONE_ROWS, LightConeScorecard, Link, LinkPreview, loadGraphLibrary, participant, PropositionGraphFigure, saveGraphLibrary, seedKnowledgeFactoryGraph, seriesLinks, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, useToolDrawer };
export default defineArticleComponents(articleAssets, () => ({
  "compounding-loop": CompoundingLoop,
  "executable-context-card": ExecutableContextCard,
  "light-cone-scorecard": LightConeScorecard,
}));
