import { Fragment, type ReactNode } from "react";
import type { PublishedPost } from "@th-m/blogs/publish";
import {
  Card,
  CardContent,
  CardHeader,
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
import { NeuralNetAnimation } from "@th-m/neural-net-visualization";
import {
  PropositionGraphFigure,
  type GraphDocument,
  type RelationshipParticipant,
} from "@th-m/graph-visualization";

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

function Quote({ children }: { children: ReactNode }) {
  return (
    <blockquote>
      <p>{children}</p>
    </blockquote>
  );
}

function Flow({ children }: { children: ReactNode }) {
  return <p className="article-outline__flow">{children}</p>;
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

function Gloss({ label, title, children }: {
  label: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="thom-tooltip-trigger" tabIndex={0}>{label}</span>
      </HoverCardTrigger>
      <HoverCardContent side="top" align="center" className="article-gloss">
        <h4>{title}</h4>
        {children}
      </HoverCardContent>
    </HoverCard>
  );
}

function Claim({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Card className="article-claim">
      <CardHeader><p className="eyebrow">{label}</p></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Explore({ toolId, children }: { toolId: string; children: ReactNode }) {
  const { openTool } = useToolDrawer();
  return (
    <button type="button" className="article-tool-trigger" onClick={() => openTool(toolId)}>
      <span>{children}</span>
      <span aria-hidden="true">→</span>
    </button>
  );
}

function TrainingFigure() {
  return (
    <figure className="article-figure">
      <NeuralNetAnimation effect="backprop" />
      <figcaption>
        A bad next-token guess, then backpropagation adjusting the network. Training changes the
        model&apos;s weights; inference later uses those weights.
      </figcaption>
    </figure>
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

const participant = (nodeId: string, arrowAtNode = false): RelationshipParticipant => ({
  nodeId,
  arrowAtNode,
  arrowAtRelation: false,
});

const goalTreeDocument: GraphDocument = {
  schemaVersion: 1,
  id: "goal-opportunity-solution-experiment",
  name: "A goal shapes the problem space beneath it",
  createdAt: "2026-08-22T00:00:00.000Z",
  updatedAt: "2026-08-25T00:00:00.000Z",
  themeId: "thom-dark",
  layoutMode: "editorial",
  propositions: [
    { id: "goal", statement: "Governing goal", emphasis: true, pinned: false },
    { id: "o1", statement: "Opportunity", emphasis: false, pinned: false },
    { id: "o2", statement: "Opportunity", emphasis: false, pinned: false },
    { id: "o3", statement: "Opportunity", emphasis: false, pinned: false },
    { id: "s1", statement: "Solution", emphasis: false, pinned: false },
    { id: "s2", statement: "Solution", emphasis: false, pinned: false },
    { id: "s3", statement: "Solution", emphasis: false, pinned: false },
    { id: "e1", statement: "Experiment", emphasis: false, pinned: false },
    { id: "e2", statement: "Experiment", emphasis: false, pinned: false },
  ],
  relationships: [
    { id: "g-o1", statement: "opens", participants: [participant("goal"), participant("o1", true)], pinned: false },
    { id: "g-o2", statement: "opens", participants: [participant("goal"), participant("o2", true)], pinned: false },
    { id: "g-o3", statement: "opens", participants: [participant("goal"), participant("o3", true)], pinned: false },
    { id: "o1-s1", statement: "suggests", participants: [participant("o1"), participant("s1", true)], pinned: false },
    { id: "o2-s2", statement: "suggests", participants: [participant("o2"), participant("s2", true)], pinned: false },
    { id: "o3-s3", statement: "suggests", participants: [participant("o3"), participant("s3", true)], pinned: false },
    { id: "s1-e1", statement: "tested by", participants: [participant("s1"), participant("e1", true)], pinned: false },
    { id: "s3-e2", statement: "tested by", participants: [participant("s3"), participant("e2", true)], pinned: false },
  ],
  poster: {
    kicker: "PROBLEM SPACES",
    title: "A goal shapes the problem space beneath it",
    footer: "THOM · GOALS, SOLUTIONS & VALUE",
    showLegend: false,
  },
};

const strategyMapDocument: GraphDocument = {
  schemaVersion: 1,
  id: "governing-goal-and-strategy",
  name: "Strategy in a field of goals",
  createdAt: "2026-08-22T00:00:00.000Z",
  updatedAt: "2026-08-25T00:00:00.000Z",
  themeId: "thom-dark",
  layoutMode: "editorial",
  propositions: [
    { id: "governing", statement: "Governing goal", emphasis: true, pinned: false },
    { id: "strategy", statement: "Strategy", emphasis: true, pinned: false },
    { id: "subgoal", statement: "Subgoals", emphasis: false, pinned: false },
    { id: "customer", statement: "Customer goals", emphasis: false, pinned: false },
    { id: "partner", statement: "Partner goals", emphasis: false, pinned: false },
    { id: "competitor", statement: "Competitor goals", emphasis: false, pinned: false },
    { id: "institution", statement: "Institutional authority", emphasis: false, pinned: false },
  ],
  relationships: [
    { id: "g-s", statement: "gives direction", participants: [participant("governing"), participant("strategy", true)], pinned: false },
    { id: "s-sg", statement: "coordinates", participants: [participant("strategy"), participant("subgoal", true)], pinned: false },
    { id: "s-c", statement: "aligns with", participants: [participant("strategy"), participant("customer", true)], pinned: false },
    { id: "s-p", statement: "coordinates with", participants: [participant("strategy"), participant("partner", true)], pinned: false },
    { id: "s-r", statement: "anticipates", participants: [participant("strategy"), participant("competitor", true)], pinned: false },
    { id: "i-s", statement: "constrains", participants: [participant("institution"), participant("strategy", true)], pinned: false },
  ],
  poster: {
    kicker: "GOALS AND STRATEGY",
    title: "Strategy acts inside a field of goals",
    footer: "THOM · GOALS, SOLUTIONS & VALUE",
    showLegend: false,
  },
};

function GoalTreeFigure() {
  return (
    <figure className="article-figure">
      <PropositionGraphFigure document={goalTreeDocument} showCaption={false} />
      <figcaption>
        Opportunities, solutions, and experiments are only meaningful relative to a governing goal.
      </figcaption>
    </figure>
  );
}

function StrategyMapFigure() {
  return (
    <figure className="article-figure">
      <PropositionGraphFigure document={strategyMapDocument} showCaption={false} />
      <figcaption>
        Strategy coordinates subgoals while meeting goals and constraints held by other people and
        institutions.
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
      <div className="article-outline">
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
          <Quote>
            <strong>
              “Optimize this plan, find all the gaps and ensure validation checks are in place.”
            </strong>
          </Quote>
          <p>
            Nine hours later, it returned an impractically large plan: pages of phases,
            dependencies, validation gates, and Markdown checkboxes—too much for a person to
            reasonably read and review as a whole. Buried in that volume were contradictions that
            made the plan completely unusable.
          </p>
          <p>At first I blamed the agent. Then I looked again at the prompt.</p>
          <p>
            <code>Optimize</code> did not specify what the plan should become better at.{" "}
            <code>Find all the gaps</code> treated every imaginable omission as equally important.{" "}
            <code>Ensure validation checks are in place</code> rewarded adding another gate
            wherever uncertainty remained.
          </p>
          <p>The model had not ignored my instructions. It had operationalized them.</p>
          <p>
            My language implied a value hierarchy: completeness over simplicity, risk reduction
            over momentum, validation coverage over usability, and planning over action. What I
            actually wanted was narrower: identify the gaps consequential enough to threaten the
            outcome, add validation proportional to their risk, preserve the team&apos;s ability to
            execute, and stop when additional process created more burden than confidence.
          </p>
          <p>
            None of those priorities appeared in the prompt. I had supplied a vocabulary of rigor
            without supplying the judgment that makes rigor useful.
          </p>
          <p>
            Research on AI-generated strategic advice demonstrates a related instability. In one{" "}
            <Ext href="https://hbr.org/2026/03/researchers-asked-llms-for-strategic-advice-they-got-trendslop-in-return">
              study of seven strategic tradeoffs
            </Ext>
            , adding relevant company information changed about 11% of answers. Merely reversing
            the order of the choices changed about 19%—more than the company evidence did.
          </p>
          <p>A polished recommendation can therefore conceal the priorities it inferred:</p>
          <ul>
            <li>Which outcome should be optimized?</li>
            <li>Which gaps are material?</li>
            <li>What degree of uncertainty is acceptable?</li>
            <li>How much validation is proportional to the consequence?</li>
            <li>When does another check reduce risk, and when does it merely add process?</li>
            <li>Who has authority to accept the remaining risk?</li>
          </ul>
          <Quote>
            <strong>
              AI does not merely follow our goals. It operationalizes the priorities hidden inside
              the language we use to express them.
            </strong>
          </Quote>
          <Claim label="Core thesis">
            <p>
              Human experience reveals what can matter. Values determine what should matter.
              Wisdom negotiates conflicts among those values and revises them after consequences
              arrive. AI can infer and pursue a goal, but people who inhabit the situation and
              remain accountable for its consequences must define, authorize, and revise the
              values that govern it.
            </p>
          </Claim>
        </Section>

        <Section index="02" title="What a Language Model Carries">
          <p>
            An LLM is a compressed statistical model of patterns in human-produced language. It
            does not literally contain all language: its data is selected, incomplete,
            historically situated, and further shaped by post-training. At sufficient scale,
            however, it absorbs an extraordinary range of associations, distinctions, arguments,
            norms, contradictions, procedures, and forms of expression.
          </p>
          <p>
            Neural-network architecture provides the machinery for representing those patterns.
            Cross-entropy training supplies the pressure: predict the observed continuations more
            accurately. Optimization turns that pressure into learned weights.
          </p>

          <Sub title="Input and tokens">
            <p>Training material commonly includes:</p>
            <ul>
              <li>public writing, code, reference material, and research;</li>
              <li>licensed or partnered collections;</li>
              <li>human demonstrations, corrections, rankings, and safety examples; and</li>
              <li>synthetic material generated and filtered for additional training.</li>
            </ul>
            <p>
              Large crawls such as <Ext href="https://commoncrawl.org/">Common Crawl</Ext> supply
              part of that record. A{" "}
              <Term gloss="Converts text into numerical units a model can process and predicted units back into text.">
                tokenizer
              </Term>{" "}
              converts the text into numerical units. One influential family uses{" "}
              <Term gloss="A tokenization method adapted from lossless compression that merges frequent adjacent symbol pairs.">
                Byte Pair Encoding
              </Term>
              , adapted from Philip Gage&apos;s{" "}
              <Ext href="https://www.derczynski.com/papers/archive/BPE_Gage.pdf">
                lossless compression technique
              </Ext>
              .
            </p>
            <Flow>text → reversible token IDs → model inference → predicted token IDs → text</Flow>
            <p>
              Tokenization can preserve the symbols. It does not recover the experience or
              motivation that caused a person to choose those symbols.
            </p>
          </Sub>

          <Sub title="Training through cross-entropy">
            <p>
              During pretraining, almost every token becomes the answer to a prediction from the
              preceding context. Given <em>The cat sat on the …</em>, the model might assign:
            </p>
            <Table
              head={["Possible next token", "Probability"]}
              rows={[
                [<code key="mat">mat</code>, "70%"],
                [<code key="floor">floor</code>, "15%"],
                [<code key="chair">chair</code>, "5%"],
                ["Everything else", "10%"],
              ]}
            />
            <p>
              If the observed token is <code>mat</code>,{" "}
              <Term gloss="A loss that scores the predicted distribution against the observed next token.">
                cross-entropy loss
              </Term>{" "}
              evaluates <code>loss = -ln P(observed token)</code>.
            </p>
            <Table
              head={["Probability assigned to mat", "Loss"]}
              rows={[["90%", "0.11"], ["70%", "0.36"], ["10%", "2.30"]]}
            />
            <TrainingFigure />
            <ul>
              <li>The loss function measures the prediction error.</li>
              <li>Backpropagation identifies how parameters contributed to it.</li>
              <li>The optimizer updates those parameters to improve future predictions.</li>
            </ul>
            <Flow>
              context → token probabilities → observed token → cross-entropy loss →
              backpropagation → updated weights
            </Flow>
            <p>
              Cross-entropy rewards the probability assigned to the observed continuation. It does
              not directly reward recovery of the author&apos;s unspoken motive, experience of the
              author&apos;s consequences, or a judgment that the author&apos;s values should govern.
            </p>
            <Explore toolId="llm-explorer">
              Watch generation, decoding, and training in the LLM explorer
            </Explore>
          </Sub>

          <Sub title="Model, inference, and runtime">
            <p>
              The trained model combines an architecture with billions of learned parameters, or
              weights. Embeddings represent tokens numerically; attention combines information
              across the context; feed-forward layers transform each representation; and output
              weights produce scores for possible next tokens.
            </p>
            <p>
              The weights are not a searchable archive. They form a compressed statistical
              representation of recurring linguistic relationships. At inference time the model
              produces a probability distribution, a decoding strategy selects a token, and the
              process repeats.
            </p>
            <Flow>
              prompt → tokens → learned representations → token probabilities → selected token →
              append → repeat
            </Flow>
            <p>
              Runtime context steers which patterns matter: system instructions, an agent charter,
              permissions, retrieved evidence, conversation history, and the user&apos;s words.
            </p>
            <Quote>
              Pretraining teaches the language in which values are expressed. Post-training
              reinforces dispositions among those values. Runtime instructions establish which
              hierarchy the model should enact in a particular role.
            </Quote>
          </Sub>

          <Sub title="Two compressions">
            <p>There is a compression before training begins:</p>
            <Flow>lived experience → motivation and judgment → language</Flow>
            <p>Training then performs a second kind of compression:</p>
            <Flow>
              human-produced language → token sequences → learned weights → context-sensitive
              predictions
            </Flow>
            <p>Put together:</p>
            <Flow>
              lived experience → motivation and judgment → language → training corpus → learned
              weights → inferred continuation
            </Flow>
            <p>
              A model can infer a person&apos;s motivation from language, behavior, examples, and
              context—sometimes better than another person. But it cannot directly observe a
              private motivation or know that its inference is correct. Information omitted when
              experience became language is not guaranteed to reappear because the continuation
              sounds plausible.
            </p>
            <p>
              People face the same boundary. Two coworkers may use <code>quality</code>,{" "}
              <code>safe</code>, or <code>done</code> for weeks while carrying different
              definitions. Each hears a familiar word and assumes shared meaning.
            </p>
            <p>
              AI inherits that problem at scale. When a term underdetermines the speaker&apos;s
              intent, the system fills the gap with patterns from training, post-training,
              runtime instructions, and current context. The answer can be coherent under the
              inferred meaning and completely wrong for the person who asked.
            </p>
            <Explore toolId="embedding-explorer">Explore the curated GPT-2 token space</Explore>
          </Sub>
        </Section>

        <Section index="03" title="Experience, Values, and Wisdom">
          <p>
            The language boundary matters because consequential goals are grounded in situations
            people inhabit rather than in words alone.
          </p>
          <ul>
            <li>
              <strong>Experience</strong> is situated contact with events and consequences:
              needs, emotions, relationships, memory, physical conditions, and social effects.
            </li>
            <li>
              A <strong>value</strong> identifies something treated as worth pursuing, protecting,
              or refusing.
            </li>
            <li>
              <Gloss label={<strong>Wisdom</strong>} title="Wisdom">
                <p>
                  Corrigible judgment that integrates experience, evidence, competing values,
                  relationships, time horizons, and consequences.
                </p>
              </Gloss>{" "}
              is judgment that remains answerable to experience and consequences.
            </li>
          </ul>
          <p>
            Humans do not automatically possess wisdom. People can be biased, selfish,
            shortsighted, manipulated by incentives, or confidently wrong. Wisdom is not the
            mystique of intuition. It is a practice: remain in contact with affected people,
            preserve dissent, compare perspectives, remember consequences, and revise the
            judgment when reality contradicts it.
          </p>
          <p>
            That practice cannot be replaced by asking which sentence sounds most like a wise
            answer. People who bear a decision&apos;s consequences have standing in the judgment,
            and institutions exercising authority remain accountable for what follows.
          </p>

          <Sub title="Judgments hidden in ordinary language">
            <p>
              Values do not appear only in declarations such as “privacy matters.” Ordinary
              language quietly supplies objectives, priorities, obligations, and authority:
            </p>
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
              Even <code>problem</code> contains a judgment: the current state is undesirable
              relative to some interest. <code>Opportunity</code> implies a valued outcome.
              <code>Success</code>, <code>failure</code>, <code>risk</code>, and{" "}
              <code>waste</code> depend on perspective and time horizon.
            </p>
            <p>Those judgments can become progressively more operational:</p>
            <ValueLadder />
            <p>
              AI can enact the later statements more reliably because they expose priorities,
              observable conditions, and actions. Operational precision does not establish
              legitimacy. Someone still has to decide that privacy should outrank engagement,
              determine whose consent counts, observe the consequences, and authorize revision.
            </p>
          </Sub>
        </Section>

        <Section index="04" title="Goals Create Problem Spaces">
          <p>
            Something becomes a problem only relative to a valued outcome. A candidate becomes a
            solution only if its consequences move the situation toward that outcome:
          </p>
          <ul>
            <li>A <strong>goal</strong> identifies a state worth bringing about or preserving.</li>
            <li>An <strong>opportunity</strong> may enable progress toward it.</li>
            <li>A <strong>solution</strong> is an intervention expected to produce progress.</li>
            <li>An <strong>experiment</strong> tests whether the expected consequence occurs.</li>
          </ul>
          <GoalTreeFigure />
          <p>
            Change the governing goal and the same observation opens a different problem space. A
            rise in support tickets might be a cost problem under a margin goal, a quality signal
            under a retention goal, or valuable customer contact under a learning goal.
          </p>
          <p>
            Once the root goal is supplied, AI can expand the tree. It can identify opportunities,
            generate solutions, design experiments, predict consequences, and compare results.
            More branches cannot determine which root deserves to govern them.
          </p>
          <p>That separates two kinds of decision:</p>
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
            “Optimize this code” can become substantially instrumental once tests, performance
            budgets, failure conditions, and operational constraints are supplied. “Optimize my
            strategy” may ask the system to choose among revenue, resilience, customer welfare,
            employee sustainability, speed, and risk. Until those priorities are ranked, there is
            no single meaning of <code>better</code> waiting to be discovered.
          </p>
          <p>
            Strategy also operates inside a field of goals held by customers, employees,
            partners, competitors, and institutions.
          </p>
          <StrategyMapFigure />
          <p>
            A company can achieve a local subgoal while undermining its governing purpose. Success
            is relational: the question is not only whether an action worked, but whose goal it
            advanced and which other goals it constrained.
          </p>
          <Quote>
            <strong>
              AI can help decide how to pursue a goal. Prediction alone cannot determine which
              goal deserves authority.
            </strong>
          </Quote>
        </Section>

        <Section index="05" title="Authority, Accountability, and Corrigibility">
          <p>
            An AI can state principles, rank them, and translate them into behavior. That does not
            establish that it authored those principles or has authority to impose them.
          </p>
          <p>Its operative hierarchy can come from several layers:</p>
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
            ordered and enforced—not on a hierarchy the model necessarily chose for itself.
          </p>
          <p>
            The deeper danger is not merely leaving values unstated. People can state them clearly
            and choose the wrong ones. An organization can encode a mistaken hierarchy into
            excellent metrics, incentives, tests, and automation.
          </p>
          <Claim label="Key claim">
            <p><strong>The organization becomes coherently wrong.</strong></p>
          </Claim>
          <GoverningLoopFigure />
          <Table
            head={["Governing priority", "Behavior rewarded", "Possible consequence"]}
            rows={[
              ["Growth above trust", "Aggressive acquisition and dark patterns", "Churn, regulation, and brand erosion"],
              ["Speed above reliability", "Shipping without adequate validation", "Outages and technical debt"],
              ["Harmony above truth", "Suppressing disagreement and bad news", "Loss of corrective evidence"],
              ["Metrics above purpose", "Optimizing visible indicators", "Measurement improves while outcomes deteriorate"],
              ["Revenue above customer welfare", "Extracting rather than creating value", "Customers leave when alternatives appear"],
            ]}
          />
          <p>
            This is false evaluative closure. The organization has precise criteria for calling
            an action better, but those criteria omit or misrank consequences that matter. Tests
            pass because the tests embody the wrong priorities. Dashboards remain green because
            the dashboards exclude the people being harmed.
          </p>
          <p>
            AI can accelerate this failure by reproducing the hierarchy across more decisions,
            with greater speed and consistency. A model may identify a harmful consequence, but it
            cannot overrule the governing system unless people have given it permission to
            challenge, escalate, or stop.
          </p>
          <p>
            A resilient hierarchy must be{" "}
            <Term gloss="Answerable to evidence and authorized revision rather than protected as an untouchable objective.">
              corrigible
            </Term>
            . That requires:
          </p>
          <ul>
            <li>direct observation of customer and employee consequences;</li>
            <li>protected disagreement and independent feedback;</li>
            <li>perspectives from people who bear costs without controlling the decision;</li>
            <li>measurements that include downstream effects;</li>
            <li>explicit review of tradeoffs and uncertainty; and</li>
            <li>escalation paths with authority to revise the governing goal.</li>
          </ul>
          <p>
            Human governance does not mean manually choosing every action. It means retaining
            responsibility for which values govern, making those values challengeable, and
            changing them when their consequences reveal they were wrong.
          </p>
        </Section>

        <Section index="06" title="From Human Judgment to Language">
          <p>
            Human values cannot guide an AI while remaining private. They have to become available
            through some combination of:
          </p>
          <ul>
            <li>named stakeholders and consequences;</li>
            <li>definitions and domain distinctions;</li>
            <li>priorities and legitimate tradeoffs;</li>
            <li>representative examples and counterexamples;</li>
            <li>constraints, permissions, and escalation boundaries;</li>
            <li>evidence, provenance, and explicit uncertainty;</li>
            <li>tests, stopping conditions, and evaluation; and</li>
            <li>feedback capable of revising the governing model.</li>
          </ul>
          <p>
            This translation does not remove judgment. It makes judgment inspectable and gives
            people and AI a better chance of recognizing when they are using the same words for
            different things.
          </p>
          <p>
            It also opens the next question. Language does not carry every kind of constraint with
            equal reliability. A proof, a program, an experimental report, and a product
            aspiration are shaped by different practices and corrective systems. In some domains
            an invalid interpretation is quickly rejected. In others, several incompatible
            interpretations can sound equally coherent.
          </p>
          <p>
            <EssayLink slug="truth-entropy-and-inference">Truth, Entropy &amp; Inference</EssayLink>{" "}
            asks what makes the difference: how language acquires predictive structure, why code
            is unusually constraint-dense, and when fluency is evidence rather than merely the
            shape of an answer.
          </p>
        </Section>

        <Section index="07" title="Conclusion">
          <p>
            The agent did not fail because it was incapable of producing a plan. It failed because{" "}
            <code>optimal</code> omitted the judgment that would make one plan preferable to
            another. The model supplied a plausible interpretation from its training and runtime
            context. It could not receive the private definition I never expressed.
          </p>
          <p>
            AI can represent principles, infer motivations, generate strategies, and pursue goals
            through tools and feedback. Those are genuine capabilities. They do not determine
            which outcome should govern, whose interests deserve standing, or when a successful
            optimization has become harmful.
          </p>
          <p>
            Human experience reveals what can matter. Values determine what should matter. Wisdom
            keeps those judgments answerable to evidence, other people, and their consequences.
            Our role is not to choose every action. It is to define and authorize the governing
            values, translate them into inspectable language, observe what happens, and revise the
            hierarchy when it proves incomplete or wrong.
          </p>
          <div className="article-outline__closing">
            <blockquote>
              <strong>
                AI encounters our commitments through language. The next task is to know when
                language carries enough of the relevant distinctions to guide reliable action—and
                when it carries only the shape of an answer.
              </strong>
            </blockquote>
          </div>
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
            </ol>
          </Sub>

          <Sub title="Values and judgment">
            <ol start={7}>
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
            <ol start={8}>
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
