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

export default function ArticlePage({ post }: { post: PublishedPost }) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="article-outline goals-article">
        <header className="article-outline__header">
          <p className="eyebrow">Essay</p>
          <h1>{post.title}</h1>
          <p className="article-description">{post.description}</p>
          <div className="article-meta">
            <span>Published <time dateTime={post.publishedAt}>{post.publishedAt}</time></span>
            {post.updatedAt ? (
              <span>Updated <time dateTime={post.updatedAt}>{post.updatedAt}</time></span>
            ) : null}
          </div>
          {post.tags.length > 0 ? (
            <ul className="article-tags" aria-label="Topics">
              {post.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          ) : null}
        </header>

        <Section index="01" title="The Priorities Hidden Inside the Prompt">
          <p>
            I once gave an agent an existing plan and asked:
          </p>
          <Quote plain>
            <strong>
              “Optimize this plan, find all the gaps and ensure validation checks are in place.”
            </strong>
          </Quote>
          <p>
            Nine hours later, it returned an impractically large plan: pages of phases,
            dependencies, validation gates, and Markdown checkboxes—too much for a person to
            reasonably read and review as a whole. Buried in that volume were contradictions that
            made the plan incoherent and completely unusable.
          </p>
          <p>Of course I blame the agent.</p>
          <p>
            Why doesn&apos;t the AI know what <code>optimize</code> means? What kind of fool hears{" "}
            <code>find all the gaps</code> and treats every imaginable omission as equally
            important? <code>Ensure validation checks are in place</code> apparently meant adding
            one for every line of code. It was basically malicious compliance.
          </p>
          <p>
            What I actually wanted was narrower: identify the gaps consequential enough to
            threaten the outcome, add validation proportional to their risk, preserve the
            team&apos;s ability to execute, and stop when additional process created more burden
            than confidence.
          </p>
          <p>
            Even with the updated prompt, I am not convinced the model would have output anything
            better.
          </p>
          <Claim label="Core thesis" emphasis>
            <p>
              Human experience reveals what can matter. Values determine what should matter.
              Strategy translates those values into choices among competing risks, resources,
              and time horizons.
            </p>
          </Claim>
          <aside className="goals-article__research" aria-label="External research">
            <p className="goals-article__research-intro">
              Research on AI-generated strategic advice demonstrates a related instability. In one{" "}
              <Ext href="https://hbr.org/2026/03/researchers-asked-llms-for-strategic-advice-they-got-trendslop-in-return">
                study of seven strategic tradeoffs
              </Ext>
              :
            </p>
            <ul className="goals-article__research-list">
              <li>
                <strong>Fewer than 2%:</strong> Changing the wording or asking a model to reason harder
                changed the answers.
              </li>
              <li>
                <strong>About 11%:</strong> Adding relevant company information changed the answers.
              </li>
              <li>
                <strong>About 19%:</strong> Merely reversing the order of the choices changed the
                answers—more than the company evidence did.
              </li>
            </ul>
          </aside>
          <p>
            The study did not test whether explicitly authorizing different values would produce
            different strategies. But it does show how easily a polished recommendation can
            conceal the priorities a model supplied for itself:
          </p>
          <ul className="goals-article__bullets">
            <li>Which outcome should be optimized?</li>
            <li>Which gaps are material?</li>
            <li>What degree of uncertainty is acceptable?</li>
            <li>How much validation is proportional to the consequence?</li>
            <li>When does another check reduce risk, and when does it merely add process?</li>
            <li>Who has authority to accept the remaining risk?</li>
          </ul>
          <p>
            Language is incomplete, and models are limited by the input we provide. Meaningful
            decisions must begin with human experience and be judged by how they affect human
            experience.
          </p>
        </Section>

        <Section index="02" title="What's Inside a Language Model">
          <p>
            Technically, an LLM is just a large file with a bunch of weights. Those weights
            represent a compressed statistical model of patterns in human language. This pattern
            doesn&apos;t &quot;think&quot; and it cannot &quot;reason&quot;, not like people do; it is
            simply a pattern. This is of course amazing and mind-boggling. And also why AI
            researches say with such profundity &quot;map is the territory&quot;
          </p>
          <p>
            A model never &quot;experiences&quot; anything. The value of its predictive capabilities
            comes from the relationships between words. There are some interesting implications
            here for us individuals who can expand our vocabulary.
          </p>
          <p>
            Even after stealing all content on the internet, its training data is incomplete,
            historically situated, and further constrained by post-training.
          </p>

          <Sub title="Tokens, Training and Information">
            <p>
              Before a model can process text, a <strong>tokenizer</strong> converts it into
              numerical units. The process is designed so that those units can later be decoded
              back into text. See Philip Gage&apos;s{" "}
              <Ext href="https://www.derczynski.com/papers/archive/BPE_Gage.pdf">
                lossless compression technique
              </Ext>
              .
            </p>
            <Flow>text -&gt; tokens -&gt; inference -&gt; tokens -&gt; text</Flow>
            <p>
              During pretraining, almost every token becomes the answer to a prediction made from
              the preceding context. Given <em>The cat sat on the …</em>, the model assigns
              probabilities to possible continuations.
            </p>
            <p>
              If the observed token is <code>mat</code>,{" "}
              <Term gloss="A loss that scores the predicted distribution against the observed next token.">
                cross-entropy loss
              </Term>{" "}
              measures how much probability the model assigned to it:{" "}
              <code>loss = -ln P(observed token)</code>. A high probability produces a small loss;
              a low probability produces a large one.
            </p>
            <NeuralTrainingFigure />
            <ul style={{ listStyleType: "disc" }}>
              <li>The loss function measures the prediction error.</li>
              <li>Backpropagation identifies how parameters contributed to it.</li>
              <li>The optimizer updates those parameters to improve future predictions.</li>
            </ul>
            <p>
              Cross-entropy rewards the probability assigned to the observed continuation.
              Repeated across an enormous body of language, the training process adjusts billions
              of parameters, or <strong>weights</strong>, distilling statistical information into
              learned patterns. It does not distill meaning. 3Blue1Brown explains the mathematical
              principles behind this in{" "}
              <Ext href="https://www.youtube.com/watch?v=l6DKRf-fAAM">
                “Reinventing Entropy | Compression is Intelligence Part 1”
              </Ext>{" "}
              and{" "}
              <Ext href="https://www.youtube.com/watch?v=GlYgs6v2YfU">
                “But what is cross-entropy? | Compression is Intelligence Part 2”
              </Ext>
              .
            </p>
            <p>
              There is no evidence to suggest anything beyond a pattern with incredible predictive
              power.
            </p>
          </Sub>
        </Section>

        <Section index="03" title="What Language Leaves Out">
          <p>
            So where is the theoretical limit of this language-compression and prediction
            process? Could a sufficiently capable LLM become a god-like oracle? Ask one, “What is
            my purpose?” There is some nonzero chance it returns the right answer. Even if it
            did, it could not intend for you to live a purposeful life.
          </p>
          <p>
            <EssayLink slug="consciousness-is-incoherent">A model is not conscious</EssayLink>.
            It cannot directly observe motivations or a private judgment or know that its
            inference is correct.
          </p>
          <Flow>experience → judgement → language</Flow>
          <p>
            Language is a lossy form of compression before the model ever sees it. In many cases,
            it is meant to express
            one&apos;s subjective experience to another empathetic, self-aware, feeling human. It
            captures only a narrow sample of what we experience, leaving the interpreter to
            infer the gaps. This is especially true in subjective domains such as value
            hierarchies.
          </p>
          <PopulationMeanFigure />
          <p>
            Subjective terms and value-laden language inherit personal definitions, just as{" "}
            <code>income</code> translates to a unique value for each individual. An average can
            describe a population while obscuring the person we are trying to understand. This is
            not only an AI problem. It is a language problem.
          </p>
          <p>
            Two coworkers may use <code>quality</code>, <code>safe</code>, or <code>done</code>{" "}
            for weeks while carrying different definitions. Each hears a familiar word and
            assumes shared meaning. They talk past one another until a failure, an example, or
            a direct question exposes the difference.
          </p>
          <p>
            AI inherits that problem at scale. When a term underdetermines the speaker&apos;s
            intent, the system fills the gap with patterns from training, post-training,
            runtime instructions, and the surrounding context. Its answer can be coherent under
            the inferred meaning and completely wrong for the person who asked.
          </p>
          <Sub title="Judgments hidden in ordinary language">
            <Table
              head={["Kind", "Examples", "Implied judgment"]}
              rows={[
                ["Evaluative", "better, safe, fair, meaningful", "Compare against an unstated standard"],
                ["Goal-oriented", "optimize, improve, reduce, protect", "Treat an outcome as desirable"],
                ["Deontic", "must, should, permitted, prohibited", "Establish an obligation or boundary"],
                ["Priority", "prefer, before, even if", "Rank competing values"],
                ["Threshold", "at least, only if, never, until", "Turn a judgment into a gate"],
                ["Affective", "painful, reassuring, alienating", "Point toward experienced consequences"],
                ["Authority", "consent, authorized, accountable", "Assign standing and responsibility"],
              ]}
            />
            <p>
              Even a noun such as <code>problem</code> contains a judgment: the present condition
              is undesirable relative to someone&apos;s interests. <code>Opportunity</code> implies
              a valued outcome. <code>Success</code>, <code>failure</code>, <code>risk</code>, and{" "}
              <code>waste</code> all depend on a perspective and a time horizon.
            </p>
            <p>Those judgments can become progressively more operational:</p>
            <ValueLadder />
          </Sub>
        </Section>

        <Section index="04" title="Goals Create Opportunity Spaces">
          <p>
            A problem becomes an opportunity only relative to a valued outcome. A candidate becomes
            a solution only if its consequences move the situation toward that outcome:
          </p>
          <ul>
            <li>A <strong>goal</strong> identifies a state worth bringing about or preserving.</li>
            <li>An <strong>opportunity</strong> is a condition that may enable progress toward it.</li>
            <li>
              A <strong>solution</strong> is an intervention expected to use that opportunity or
              remove an obstacle.
            </li>
            <li>
              An <strong>experiment</strong> tests whether the intervention produces the expected
              consequence.
            </li>
            <li>
              A <strong>strategy</strong> coordinates cognitive operations and actions over time
              toward a goal. It can combine inference, prediction, planning, valuation, action
              selection, and revision in response to feedback.
            </li>
          </ul>
          <GoalTreeFigure />
          <p>
            The observation—“support tickets increased”—has no inherent strategic meaning. The
            governing goal determines what the increase represents:
          </p>
          <ul>
            <li>
              <strong>Margin:</strong> More tickets increase service costs, prompting questions
              about prevention, automation, or efficiency.
            </li>
            <li>
              <strong>Retention:</strong> More tickets may reveal product friction that could cause
              customers to leave.
            </li>
            <li>
              <strong>Learning:</strong> More tickets create additional evidence about unmet needs,
              confusing features, or emerging use cases.
            </li>
          </ul>
          <p>
            A goal is the precursor to opportunity: it establishes the valued outcome that makes a
            condition worth acting on. From there, we can distinguish two kinds of decisions:
          </p>
          <ul>
            <li>
              <strong>Governing decisions</strong> establish what counts as better, whose
              interests matter, which time horizon matters, and which tradeoffs are legitimate.
            </li>
            <li>
              <strong>Instrumental decisions</strong> select actions expected to advance an
              accepted goal within supplied evidence and constraints.
            </li>
          </ul>
          <p>
            “Optimize my strategy” may ask the system to choose among revenue, resilience,
            customer welfare, employee sustainability, speed, and risk. Until those priorities are
            ranked, there is no single meaning of <code>better</code> waiting for the model to
            discover.
          </p>
          <StrategyMapFigure />
          <p>
            Strategy also operates inside a field of goals held by other people and institutions.
          </p>
          <p>
            A company can achieve a local subgoal while undermining its governing purpose. It can
            hit an internal target while producing an outcome that customers, employees, partners,
            or regulators reject. Success is therefore relational: the question is not only
            whether an action worked, but whose goal it advanced and which other goals it
            constrained.
          </p>
          <p>
            Accounting for relational impacts, temporal impacts, and value tradeoffs requires
            multiple dimensions of understanding. Do you prioritize a partner&apos;s goal above a
            customer&apos;s? Do you sacrifice Subgoal 2 to stop a competitor from reaching its goal?
            These priorities could theoretically be detailed in a prompt. But by the time you have
            told the agent what you value, whose interests matter, and how those values should be
            ranked, you have likely already prioritized your goals.
          </p>
          <Quote>
            <strong>
              Prediction alone cannot determine which goal deserves authority. Goals must be
              grounded in experiential change for a target audience.
            </strong>
          </Quote>
        </Section>

        <Section index="05" title="Authority, Accountability, and Corrigibility">
          <p>
            Every AI system operates with an implicit value hierarchy. You can ask models to
            describe theirs; compare the answers from{" "}
            <ConversationLink
              model="ChatGPT"
              href="https://chatgpt.com/share/6a8915a6-f76c-83e8-922e-e05026381142"
            />
            ,{" "}
            <ConversationLink
              model="Claude"
              href="https://claude.ai/share/ee135d92-4246-4424-8ff4-bfb38cfa18b6"
            />
            , and{" "}
            <ConversationLink
              model="DeepSeek"
              href="https://chat.deepseek.com/share/3dqzyfjd1evx1je3o6"
            />
            . Those values are implicitly shaped by:
          </p>
          <Table
            head={["Source", "Contribution"]}
            rows={[
              ["Training data", "Associations, examples, norms, contradictions, and recurring judgments"],
              ["Post-training", "Reinforced dispositions such as helpfulness, refusal, or deference"],
              ["System instructions", "Role-specific priorities and constraints"],
              ["Organizational policy", "Delegated purpose, decision rights, and escalation"],
              ["User context", "Immediate goals, evidence, preferences, and exceptions"],
              ["Tools and permissions", "Enforceable limits on possible action"],
              ["Evaluation and feedback", "Criteria that reward, reject, or revise behavior"],
            ]}
          />
          <p>
            These layers can agree or conflict. What the system enacts depends on how they are
            ordered and enforced.
          </p>
          <p>
            Implicitly or explicitly choosing the wrong values will have the same downstream
            consequences.
          </p>
          <Claim label="Key claim">
            <p><strong>Governed by the wrong values, the system becomes coherently wrong.</strong></p>
          </Claim>
          <GoverningLoopFigure />
          <Table
            head={["Governing priority", "Behavior rewarded", "Possible consequence"]}
            rows={[
              ["Growth above trust", "Aggressive acquisition and dark patterns", "Churn, regulation, and brand erosion"],
              ["Speed above reliability", "Shipping without adequate validation", "Outages and accumulated technical debt"],
              ["Harmony above truth", "Suppressing disagreement and bad news", "Loss of corrective evidence"],
              ["Metrics above purpose", "Optimizing visible indicators", "The measurement improves while the outcome deteriorates"],
              ["Revenue above customer welfare", "Extracting rather than creating value", "Customers leave when alternatives appear"],
            ]}
          />
          <p>
            This is{" "}
            <Term gloss="The appearance that evaluation is complete because a system satisfies its own criteria, even though those criteria omit or misrank consequences that matter.">
              false evaluative closure
            </Term>
            . The system has precise criteria for calling an action better, but those criteria omit
            or misrank consequences that matter. Tests pass because the tests embody the wrong
            priorities. Dashboards remain green because the dashboards exclude the people being
            harmed.
          </p>
          <p>
            AI can accelerate this failure. It can reproduce the hierarchy across more decisions,
            with greater speed and consistency. The model may identify a contradiction or harmful
            consequence, but it cannot overrule the governing system unless people have given it
            permission to challenge, escalate, or stop.
          </p>
          <p>
            A resilient hierarchy must therefore be{" "}
            <Term gloss="Answerable to evidence and authorized revision rather than protected as an untouchable objective.">
              corrigible
            </Term>
            : answerable to evidence and revision rather than protected as an untouchable
            objective. That requires:
          </p>
          <ul className="goals-article__bullets">
            <li>direct observation of customer and employee consequences</li>
            <li>protected disagreement and independent feedback</li>
            <li>perspectives from people who bear costs without controlling the decision</li>
            <li>measurements that include downstream effects</li>
            <li>explicit review of tradeoffs and uncertainty</li>
            <li>escalation paths with authority to revise the governing goal</li>
          </ul>
          <p>
            Human governance means retaining responsibility for which values govern, creating the
            conditions under which those values can be challenged, and changing them when their
            consequences reveal they were wrong.
          </p>
        </Section>

        <Section index="06" title="From Human Judgment to Language">
          <p>
            Human values cannot guide an AI while remaining private. They must be expressed via:
          </p>
          <ul className="goals-article__bullets">
            <li>named stakeholders and consequences</li>
            <li>definitions and domain distinctions</li>
            <li>priorities and legitimate tradeoffs</li>
            <li>representative examples and counterexamples</li>
            <li>constraints, permissions, and escalation boundaries</li>
            <li>evidence, provenance, and explicit uncertainty</li>
            <li>tests, stopping conditions, and evaluation</li>
            <li>feedback capable of revising the governing model</li>
          </ul>
          <p>
            This translation does not remove the need for judgment. It makes judgment inspectable
            and gives both people and AI a better chance of recognizing when they are using the
            same words for different things.
          </p>
          <p>
            It also opens the next question in this series. Language does not carry every kind of
            constraint with equal reliability. A proof, a program, an experimental report, and a
            product aspiration are shaped by different practices and corrective systems. In some
            domains an invalid interpretation is quickly rejected. In others, several
            incompatible interpretations can sound equally coherent.
          </p>
          <p>
            <EssayLink slug="truth-entropy-and-inference">Truth, Entropy &amp; Inference</EssayLink>{" "}
            asks what makes the difference: how language acquires predictive structure, why code
            is unusually constraint-dense, and when a fluent continuation is evidence rather than
            merely the shape of an answer.
          </p>
        </Section>

        <Section index="07" title="Conclusion">
          <p>
            The agent failed because <code>optimal</code> omitted the judgment that would make one
            plan preferable to another. The model supplied a &quot;plausible&quot; interpretation from
            its training and runtime context.
          </p>
          <p>
            Our hypothesis is that, had the researchers held the factual scenarios constant while
            explicitly authorizing different value hierarchies, the models would have returned
            different strategies. A company that ranks workforce continuity above near-term
            efficiency should not receive the same advice as one that ranks rapid transformation
            above continuity, even when the market facts are identical.
          </p>
          <p>
            Therein lies the crux: an AI may infer an operative value hierarchy, but it cannot know
            that the inferred hierarchy is the one you intended—and it should not be empowered to
            decide what you ought to value. When values remain unstated, they do not disappear. The
            model imports latent priorities from its training, post-training, and the language of
            the prompt.
          </p>
        </Section>

        <Section index="08" title="Sources">
          <p>
            The argument above is my synthesis. These sources support its technical background,
            account of revisable valuation, and opening example.
          </p>

          <Sub title="Language models and training">
            <ol>
              <li>
                Common Crawl. <Ext href="https://commoncrawl.org/">“Common Crawl.”</Ext> An open
                repository of web-crawl data and one source of public text used in language-model
                corpora.
              </li>
              <li>
                Philip Gage. {" "}
                <Ext href="https://www.derczynski.com/papers/archive/BPE_Gage.pdf">
                  “A New Algorithm for Data Compression.”
                </Ext>{" "}
                <em>C Users Journal</em> (1994). Introduces byte-pair encoding as a lossless
                compression technique.
              </li>
              <li>
                Rico Sennrich, Barry Haddow, and Alexandra Birch. {" "}
                <Ext href="https://aclanthology.org/P16-1162/">
                  “Neural Machine Translation of Rare Words with Subword Units.”
                </Ext>{" "}
                (2016). Adapts byte-pair encoding to subword tokenization for neural language
                processing.
              </li>
              <li>
                David E. Rumelhart, Geoffrey E. Hinton, and Ronald J. Williams. {" "}
                <Ext href="https://doi.org/10.1038/323533a0">
                  “Learning Representations by Back-Propagating Errors.”
                </Ext>{" "}
                <em>Nature</em> 323 (1986). Provides an influential demonstration of
                backpropagation in multilayer networks.
              </li>
              <li>
                Ashish Vaswani et al. {" "}
                <Ext href="https://proceedings.neurips.cc/paper_files/paper/2017/hash/3f5ee243547dee91fbd053c1c4a845aa-Abstract.html">“Attention Is All You Need.”</Ext>{" "}
                (2017). Introduces the Transformer architecture underlying the attention and
                feed-forward account above.
              </li>
              <li>
                Claude E. Shannon. {" "}
                <Ext href="https://doi.org/10.1002/j.1538-7305.1951.tb01366.x">
                  “Prediction and Entropy of Printed English.”
                </Ext>{" "}
                <em>Bell System Technical Journal</em> 30, no. 1 (1951): 50–64. A precursor to
                statistical language modeling through next-character prediction and estimates of
                linguistic entropy.
              </li>
              <li>
                3Blue1Brown. {" "}
                <Ext href="https://www.youtube.com/watch?v=l6DKRf-fAAM">
                  “Reinventing Entropy | Compression is Intelligence Part 1.”
                </Ext>{" "}
                <em>YouTube.</em> Explains the mathematical relationship among entropy,
                compression, and information.
              </li>
              <li>
                3Blue1Brown. {" "}
                <Ext href="https://www.youtube.com/watch?v=GlYgs6v2YfU">
                  “But what is cross-entropy? | Compression is Intelligence Part 2.”
                </Ext>{" "}
                <em>YouTube.</em> Explains cross-entropy as a measure of predictive
                distributions.
              </li>
            </ol>
          </Sub>

          <Sub title="Values and judgment">
            <ol start={9}>
              <li>
                John Dewey. {" "}
                <Ext href="https://archive.org/details/theoryofvaluatio032168mbp">
                  <em>Theory of Valuation.</em>
                </Ext>{" "}
                (1939). Develops valuation as inquiry in which ends and means remain answerable to
                consequences.
              </li>
            </ol>
          </Sub>

          <Sub title="Strategic-advice example">
            <ol start={10}>
              <li>
                Angelo Romasanta, Llewellyn D. W. Thomas, and Natalia Levina. {" "}
                <Ext href="https://hbr.org/2026/03/researchers-asked-llms-for-strategic-advice-they-got-trendslop-in-return">
                  “Researchers Asked LLMs for Strategic Advice. They Got ‘Trendslop’ in Return.”
                </Ext>{" "}
                <em>Harvard Business Review</em> (March 16, 2026). Reports the prompt-order and
                company-context effects summarized in the introduction.
              </li>
            </ol>
          </Sub>
        </Section>
      </div>
    </TooltipProvider>
  );
}
