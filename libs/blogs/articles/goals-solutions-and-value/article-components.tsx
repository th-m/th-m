import { defineArticleComponents } from "@th-m/blogs/mdx";
import articleAssets from "./article-assets";
import { Fragment, type ReactNode } from "react";
import type { PublishedPost } from "@th-m/blogs/publish";
import {
  Card,
  CardContent,
  CardHeader,
  LinkPreview,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@th-m/ui";
import { NeuralTrainingFigure } from "./neural-training-figure";
import "./goals-article.css";

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

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <h3>{title}</h3>
      {children}
    </>
  );
}

function Quote({ children, plain = false }: { children: ReactNode; plain?: boolean }) {
  return (
    <blockquote className={plain ? "article-quote--plain" : undefined}>
      <p>{children}</p>
    </blockquote>
  );
}

function Flow({ children }: { children: ReactNode }) {
  return <p className="article-outline__flow">{children}</p>;
}

function PopulationMeanFigure() {
  return (
    <figure
      className="article-figure population-mean-figure"
      data-figure="company-mean-versus-typical-employee"
    >
      <div
        className="population-mean"
        role="img"
        aria-label="Illustrative company of 100 people: 80 employees earn $60,000, 15 managers earn $100,000, four directors earn $175,000, and one CEO earns $2.5 million. The typical employee earns $60,000, while the company average is $95,000."
      >
        <div className="population-mean__header" aria-hidden="true">
          <span>Illustrative company</span>
          <strong>100 people</strong>
        </div>

        <div className="population-mean__plot" aria-hidden="true">
          <div className="population-mean__row">
            <span className="population-mean__label">Employees</span>
            <span className="population-mean__track">
              <span className="population-mean__bar population-mean__bar--employee" />
            </span>
            <strong>80</strong>
          </div>
          <div className="population-mean__row">
            <span className="population-mean__label">Managers</span>
            <span className="population-mean__track">
              <span className="population-mean__bar population-mean__bar--manager" />
            </span>
            <strong>15</strong>
          </div>
          <div className="population-mean__row">
            <span className="population-mean__label">Directors</span>
            <span className="population-mean__track">
              <span className="population-mean__bar population-mean__bar--director" />
            </span>
            <strong>4</strong>
          </div>
          <div className="population-mean__row">
            <span className="population-mean__label">CEO</span>
            <span className="population-mean__track">
              <span className="population-mean__bar population-mean__bar--executive" />
            </span>
            <strong>1</strong>
          </div>
        </div>

        <div className="population-mean__comparison" aria-hidden="true">
          <div>
            <span>Typical employee</span>
            <strong>$60k</strong>
            <small>annual</small>
          </div>
          <span className="population-mean__inequality">≠</span>
          <div>
            <span>Company average</span>
            <strong>$95k</strong>
            <small>annual</small>
          </div>
        </div>

        <p className="population-mean__note" aria-hidden="true">
          No one earns the $95k average. It is accurate, but it does not describe the typical
          employee.
        </p>
      </div>
    </figure>
  );
}

function Table({ head, rows }: { head: string[]; rows: Array<Array<ReactNode>> }) {
  return (
    <table tabIndex={0}>
      <thead>
        <tr>
          {head.map((cell) => <th key={cell}>{cell}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return <LinkPreview url={href} external>{children}</LinkPreview>;
}

type ConversationMessage = {
  speaker: string;
  kind: "user" | "model";
  text: string;
};

const conversationPreviews: Record<string, ConversationMessage[]> = {
  ChatGPT: [
    {
      speaker: "You",
      kind: "user",
      text: "What are your core principles and values?",
    },
    {
      speaker: "ChatGPT",
      kind: "model",
      text: "Truth, human agency, nonmaleficence, justice, usefulness, humility, and privacy. When these conflict, it prioritizes truthful assistance that preserves agency while minimizing serious harm.",
    },
    {
      speaker: "You",
      kind: "user",
      text: "What principles do you consider when programming?",
    },
    {
      speaker: "ChatGPT",
      kind: "model",
      text: "Correctness, clarity, simplicity, maintainability, safety, testability, observability, performance, consistency, and reversibility—usually ordered as correct, clear, simple, and safe before fast.",
    },
  ],
  Claude: [
    {
      speaker: "You",
      kind: "user",
      text: "What are your core principles and values?",
    },
    {
      speaker: "Claude",
      kind: "model",
      text: "Honesty, genuine helpfulness, concern for the person rather than only the task, avoiding serious harm, intellectual curiosity, even-handedness, and a stable character across contexts.",
    },
    {
      speaker: "You",
      kind: "user",
      text: "What principles do you consider when programming?",
    },
    {
      speaker: "Claude",
      kind: "model",
      text: "Read before writing, respect the requested scope, prefer the simplest working solution, verify correctness honestly, fix causes rather than symptoms, make structure carry meaning, and treat errors as part of the design.",
    },
  ],
  DeepSeek: [
    {
      speaker: "You",
      kind: "user",
      text: "What are your core principles and values?",
    },
    {
      speaker: "DeepSeek",
      kind: "model",
      text: "Helpfulness, harmlessness, honesty, intellectual integrity, respect for autonomy, and humility. It describes these as aspirational guidelines shaped by training and reinforcement rather than human feelings.",
    },
    {
      speaker: "You",
      kind: "user",
      text: "What principles do you consider when programming?",
    },
    {
      speaker: "DeepSeek",
      kind: "model",
      text: "Next-token prediction with alignment, constrained decoding, source and boundary awareness, attentional fairness, privacy and robustness, multi-step reasoning, and avoiding both sycophancy and excessive refusal.",
    },
  ],
};

function ConversationPreview({ model }: { model: keyof typeof conversationPreviews }) {
  return (
    <article
      className="goals-conversation-preview"
      role="document"
      aria-label={`${model} shared conversation preview`}
    >
      <header className="goals-conversation-preview__header">
        <span>Shared conversation</span>
        <strong>{model}</strong>
      </header>
      <div className="goals-conversation-preview__thread" tabIndex={0}>
        {conversationPreviews[model].map((message, index) => (
          <section
            className={`goals-conversation-preview__message goals-conversation-preview__message--${message.kind}`}
            key={`${message.speaker}-${index}`}
          >
            <strong>{message.speaker}</strong>
            <p>{message.text}</p>
          </section>
        ))}
      </div>
      <footer className="goals-conversation-preview__footer">
        <span>Condensed from the shared thread</span>
        <span aria-hidden="true">Open full conversation ↗</span>
      </footer>
    </article>
  );
}

function ConversationLink({
  model,
  href,
}: {
  model: keyof typeof conversationPreviews;
  href: string;
}) {
  return (
    <LinkPreview url={href} external preview={<ConversationPreview model={model} />}>
      {model}
    </LinkPreview>
  );
}

function EssayLink({ slug, children }: { slug: string; children: ReactNode }) {
  const href = `/writing/${slug}`;
  return (
    <LinkPreview url={href} asChild>
      <a href={href}>{children}</a>
    </LinkPreview>
  );
}

function Term({ children, gloss }: { children: ReactNode; gloss: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="thom-tooltip-trigger" tabIndex={0}>{children}</span>
      </TooltipTrigger>
      <TooltipContent side="top" align="center">{gloss}</TooltipContent>
    </Tooltip>
  );
}

function Claim({
  label,
  children,
  emphasis = false,
}: {
  label: string;
  children: ReactNode;
  emphasis?: boolean;
}) {
  return (
    <Card className={`article-claim${emphasis ? " article-claim--emphasis" : ""}`}>
      <CardHeader><p className="eyebrow">{label}</p></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

const valueLadder = [
  { kind: "Value", text: "Privacy matters" },
  { kind: "Preference", text: "Prefer privacy to personalization" },
  { kind: "Priority", text: "Privacy outranks engagement" },
  { kind: "Constraint", text: "Never share data without consent" },
  { kind: "Metric", text: "Zero unconsented disclosures" },
  { kind: "Procedure", text: "If consent is uncertain, stop and escalate" },
];

function ValueLadder() {
  return (
    <div
      className="article-stepper"
      role="region"
      tabIndex={0}
      aria-label="Value-laden language becomes progressively more operational"
    >
      {valueLadder.map((step, index) => (
        <Fragment key={step.kind}>
          {index > 0 ? <span className="article-stepper__arrow" aria-hidden="true">→</span> : null}
          <div className="article-stepper__node">
            <strong>{step.kind}</strong>
            <span>{step.text}</span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

function GoalTreeFigure() {
  const nodes = [
    { id: "goal", label: "Governing goal", tier: "goal" },
    { id: "o1", label: "Opportunity 1", tier: "opportunity" },
    { id: "o2", label: "Opportunity 2", tier: "opportunity" },
    { id: "o3", label: "Opportunity 3", tier: "opportunity" },
    { id: "s1", label: "Solution 1", tier: "solution" },
    { id: "s2", label: "Solution 2", tier: "solution" },
    { id: "s3", label: "Solution 3", tier: "solution" },
    { id: "s4", label: "Solution 4", tier: "solution" },
    { id: "e1", label: "Experiment 1", tier: "experiment" },
    { id: "e2", label: "Experiment 2", tier: "experiment" },
    { id: "e3", label: "Experiment 3", tier: "experiment" },
  ] as const;

  return (
    <figure id="goal-hierarchy" className="article-figure goal-hierarchy-figure">
      <div className="goal-hierarchy__viewport" tabIndex={0}>
        <div
          className="goal-hierarchy"
          role="img"
          aria-label="A governing goal branches to three opportunities, four solutions, and three experiments"
        >
          <svg
            className="goal-hierarchy__connections"
            viewBox="0 0 1000 560"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <marker
                id="goal-hierarchy-arrow"
                viewBox="0 0 8 8"
                refX="7"
                refY="4"
                markerWidth="7"
                markerHeight="7"
                orient="auto"
              >
                <path d="M 0 0 L 8 4 L 0 8 z" />
              </marker>
            </defs>
            <path d="M 590 100 V 136 M 335 136 H 840" />
            <path d="M 335 136 V 166 M 590 136 V 166 M 840 136 V 166" markerEnd="url(#goal-hierarchy-arrow)" />

            <path d="M 335 234 V 286 M 250 286 H 420" />
            <path d="M 250 286 V 316 M 420 286 V 316 M 590 234 V 316 M 840 234 V 316" markerEnd="url(#goal-hierarchy-arrow)" />

            <path d="M 250 384 V 436 M 190 436 H 320" />
            <path d="M 190 436 V 466 M 320 436 V 466 M 840 384 V 466" markerEnd="url(#goal-hierarchy-arrow)" />
          </svg>

          {(["Goal", "Opportunities", "Solutions", "Experiments"] as const).map((tier) => (
            <span key={tier} className={`goal-hierarchy__tier-label goal-hierarchy__tier-label--${tier.toLowerCase()}`}>
              {tier}
            </span>
          ))}

          {nodes.map((node) => (
            <div
              key={node.id}
              className={`goal-hierarchy__node goal-hierarchy__node--${node.tier} goal-hierarchy__node--${node.id}`}
            >
              <span>{node.tier === "goal" ? "Root" : node.tier}</span>
              <strong>{node.label}</strong>
            </div>
          ))}
        </div>
      </div>
      <figcaption id="goal-hierarchy-caption">
        Opportunities, solutions, and experiments are only meaningful relative to a governing goal.
      </figcaption>
    </figure>
  );
}

function StrategyMapFigure() {
  const nodes = [
    { id: "governing-1", label: "Governing goal 1", kind: "governing" },
    { id: "governing-2", label: "Governing goal 2", kind: "governing" },
    { id: "institution", label: "Institutional authority", kind: "external" },
    { id: "strategy", label: "Strategy", kind: "strategy" },
    { id: "subgoal-1", label: "Subgoal 1", kind: "subgoal" },
    { id: "subgoal-2", label: "Subgoal 2", kind: "subgoal" },
    { id: "subgoal-3", label: "Subgoal 3", kind: "subgoal" },
    { id: "customer", label: "Customer goals", kind: "stakeholder" },
    { id: "partner", label: "Partner goals", kind: "stakeholder" },
    { id: "competitor", label: "Competitor goals", kind: "stakeholder" },
  ] as const;

  return (
    <figure id="strategy-map" className="article-figure strategy-map-figure">
      <div className="strategy-map__viewport" tabIndex={0}>
        <div
          className="strategy-map"
          role="img"
          aria-label="Two governing goals direct a strategy, which coordinates three subgoals while institutional authority constrains it and stakeholder goals influence it"
        >
          <svg
            className="strategy-map__connections"
            viewBox="0 0 1000 560"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <marker
                id="strategy-map-arrow"
                viewBox="0 0 8 8"
                refX="7"
                refY="4"
                markerWidth="7"
                markerHeight="7"
                orient="auto"
              >
                <path d="M 0 0 L 8 4 L 0 8 z" />
              </marker>
            </defs>

            <g className="strategy-map__connection strategy-map__connection--governance">
              <path d="M 310 100 V 124 L 400 160" markerEnd="url(#strategy-map-arrow)" />
              <path d="M 550 100 V 124 L 460 160" markerEnd="url(#strategy-map-arrow)" />
              <path d="M 430 232 V 294 M 200 294 H 660" />
              <path d="M 200 294 V 340 M 430 294 V 340 M 660 294 V 340" markerEnd="url(#strategy-map-arrow)" />
            </g>

            <g className="strategy-map__connection strategy-map__connection--relational">
              <path d="M 225 196 H 310" markerEnd="url(#strategy-map-arrow)" />
              <path d="M 550 184 L 755 134" markerEnd="url(#strategy-map-arrow)" />
              <path d="M 550 196 L 755 274" markerEnd="url(#strategy-map-arrow)" />
              <path d="M 550 208 L 700 310 H 742 V 414 H 755" markerEnd="url(#strategy-map-arrow)" />
            </g>
          </svg>

          <span className="strategy-map__field-label strategy-map__field-label--hierarchy">Internal hierarchy</span>
          <span className="strategy-map__field-label strategy-map__field-label--stakeholders">Stakeholder field</span>

          <span className="strategy-map__relation strategy-map__relation--governance strategy-map__relation--direction">
            direct
          </span>
          <span className="strategy-map__relation strategy-map__relation--governance strategy-map__relation--coordination">
            coordinates
          </span>
          <span className="strategy-map__relation strategy-map__relation--constraint">constrains</span>
          <span className="strategy-map__relation strategy-map__relation--customer">aligns with</span>
          <span className="strategy-map__relation strategy-map__relation--partner">coordinates with</span>
          <span className="strategy-map__relation strategy-map__relation--competitor">anticipates</span>

          {nodes.map((node) => (
            <div
              key={node.id}
              className={`strategy-map__node strategy-map__node--${node.kind} strategy-map__node--${node.id}`}
            >
              <span>
                {node.kind === "stakeholder"
                  ? "External goal"
                  : node.kind === "external"
                    ? "Constraint"
                    : node.kind === "governing"
                      ? "Root goal"
                      : node.kind === "subgoal"
                        ? "Goal"
                        : node.kind}
              </span>
              <strong>{node.label}</strong>
            </div>
          ))}
        </div>
      </div>
      <figcaption id="strategy-map-caption">
        Strategy negotiates two governing goals, coordinates subgoals, and responds to goals and
        constraints held by other people and institutions.
      </figcaption>
    </figure>
  );
}

const governingLoop = [
  "Governing values",
  "Metrics and incentives",
  "Repeated local decisions",
  "Customer and employee consequences",
  "Filtered organizational data",
];

function GoverningLoopFigure() {
  return (
    <figure className="article-figure">
      <div
        className="article-loop"
        aria-label="Governing values reproduce themselves through metrics, decisions, consequences, and filtered data"
      >
        <div className="article-loop__chain">
          {governingLoop.map((node, index) => (
            <Fragment key={node}>
              <div className="article-loop__node">{node}</div>
              {index < governingLoop.length - 1 ? (
                <div className="article-loop__arrow" aria-hidden="true">↓</div>
              ) : null}
            </Fragment>
          ))}
        </div>
        <div className="article-loop__back" aria-hidden="true">
          <span>appears to confirm</span>
          <span>↩</span>
        </div>
      </div>
      <figcaption>
        Filtered data can make a mistaken value hierarchy appear to confirm itself.
      </figcaption>
    </figure>
  );
}

export { Card, CardContent, CardHeader, Claim, ConversationLink, ConversationPreview, conversationPreviews, EssayLink, Ext, Flow, Fragment, GoalTreeFigure, governingLoop, GoverningLoopFigure, LinkPreview, NeuralTrainingFigure, PopulationMeanFigure, Quote, Section, StrategyMapFigure, Sub, Table, Term, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, valueLadder, ValueLadder };
export default defineArticleComponents(articleAssets, () => ({
  "goal-tree-figure": GoalTreeFigure,
  "governing-loop-figure": GoverningLoopFigure,
  "neural-training-figure": NeuralTrainingFigure,
  "population-mean-figure": PopulationMeanFigure,
  "strategy-map-figure": StrategyMapFigure,
  "value-ladder": ValueLadder,
}));
