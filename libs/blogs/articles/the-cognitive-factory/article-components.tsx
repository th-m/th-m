import { defineArticleComponents } from "@th-m/blogs/mdx";
import { AiFactoryMotif } from "@th-m/blogs/components";
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
} from "@th-m/ui";
import { Link } from "@tanstack/react-router";

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

function TriggerOpensHypothesesMotif() {
  return <AiFactoryMotif variant="trigger-opens-hypotheses" />;
}

function ConsequenceReturnsToContextMotif() {
  return <AiFactoryMotif variant="consequence-returns-to-context" />;
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

const LIGHT_CONE_ROWS: Array<[string, string, string, string, "capability" | "governance"]> = [
  ["Observe", "Supplied evidence only", "Permitted tools and memory", "Customer and operational signals with provenance", "capability"],
  ["Interpret", "Prompt and retrieved text", "Bounded context and alternatives", "Ontology and graph context with evidence", "capability"],
  ["Affect", "Output for another actor", "Scoped, reversible actions", "Explicitly authorized systems and workflows", "capability"],
  ["Learn", "No retained outcome in this baseline", "Task feedback retained within the workflow", "Outcomes revise context and evaluation", "capability"],
  ["Reversibility", "A person can reject or revise the output", "Actions require recovery paths", "Provenance supports tracing and rollback", "governance"],
  ["Authority", "A person chooses evidence and purpose", "Policy sets objectives and permissions", "People govern meaning, standards, and decisions", "governance"],
  ["Accountability", "People remain accountable for use", "People remain accountable for boundaries", "People remain accountable for propagated values", "governance"],
];

function LightConeScorecard() {
  return (
    <table className="essay-scorecard">
      <caption className="essay-figure__caption">The cognitive light cone scorecard</caption>
      <thead>
        <tr>
          <th scope="col">Dimension</th>
          <th scope="col">Bare model call</th>
          <th scope="col">Bounded agent</th>
          <th scope="col">Connected workflow</th>
        </tr>
      </thead>
      <tbody>
        {LIGHT_CONE_ROWS.map(([dimension, model, agent, workflow], index) => (
          <Fragment key={dimension}>
            {index === 0 ? (
              <tr><th scope="colgroup" colSpan={4}>Capability reach</th></tr>
            ) : index === 4 ? (
              <tr><th scope="colgroup" colSpan={4}>Governance conditions</th></tr>
            ) : null}
            <tr>
              <th scope="row">{dimension}</th>
              <td>{model}</td>
              <td>{agent}</td>
              <td>{workflow}</td>
            </tr>
          </Fragment>
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

export { ArrowMarker, Card, CardContent, CompoundingLoop, ConsequenceReturnsToContextMotif, CONTEXT_MAPPINGS, ExecutableContextCard, Figure, formatDate, Fragment, LIGHT_CONE_ROWS, LightConeScorecard, Link, LinkPreview, seriesLinks, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TriggerOpensHypothesesMotif };
export default defineArticleComponents(articleAssets, () => ({
  "consequence-returns-to-context-motif": ConsequenceReturnsToContextMotif,
  "executable-context-card": ExecutableContextCard,
  "light-cone-scorecard": LightConeScorecard,
  "trigger-opens-hypotheses-motif": TriggerOpensHypothesesMotif,
}));
