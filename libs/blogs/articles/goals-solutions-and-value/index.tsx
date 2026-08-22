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

/* ------------------------------------------------------------------ */
/* Primitive helpers                                                   */
/* ------------------------------------------------------------------ */

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

function Part({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <h4>{title}</h4>
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
          {head.map((cell) => (
            <th key={cell}>{cell}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Inline link with a floating destination preview; external links leave the site. */
function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <LinkPreview url={href} external>
      {children}
    </LinkPreview>
  );
}

/** One-sentence gloss on a term, revealed on hover or focus. */
function Term({ children, gloss }: { children: ReactNode; gloss: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="thom-tooltip-trigger" tabIndex={0}>
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" align="center">
        {gloss}
      </TooltipContent>
    </Tooltip>
  );
}

/** Structured gloss: definition plus worked example, revealed on hover or focus. */
function Gloss({
  label,
  title,
  children,
}: {
  label: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="thom-tooltip-trigger" tabIndex={0}>
          {label}
        </span>
      </HoverCardTrigger>
      <HoverCardContent side="top" align="center" className="article-gloss">
        <h4>{title}</h4>
        {children}
      </HoverCardContent>
    </HoverCard>
  );
}

/** Always-visible key-claim box. */
function Claim({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Card className="article-claim">
      <CardHeader>
        <p className="eyebrow">{label}</p>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

/** Gold affordance that opens a registered tool in the global drawer. */
function Explore({ toolId, children }: { toolId: string; children: ReactNode }) {
  const { openTool } = useToolDrawer();
  return (
    <button type="button" className="article-tool-trigger" onClick={() => openTool(toolId)}>
      <span>{children}</span>
      <span aria-hidden="true">→</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Figures                                                             */
/* ------------------------------------------------------------------ */

function TrainingFigure() {
  return (
    <figure className="article-figure">
      <NeuralNetAnimation effect="backprop" />
      <figcaption>
        A bad guess, then backpropagation adjusting the network. Training changes the model's
        weights; inference later uses those weights.
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
          {index > 0 ? (
            <span className="article-stepper__arrow" aria-hidden="true">
              →
            </span>
          ) : null}
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
  updatedAt: "2026-08-22T00:00:00.000Z",
  themeId: "thom-dark",
  layoutMode: "editorial",
  propositions: [
    { id: "goal", statement: "Governing goal", emphasis: true, pinned: false },
    { id: "o1", statement: "Opportunity — cost problem under a margin goal", emphasis: false, pinned: false },
    { id: "o2", statement: "Opportunity — quality signal under a retention goal", emphasis: false, pinned: false },
    { id: "o3", statement: "Opportunity — customer contact under a learning goal", emphasis: false, pinned: false },
    { id: "s1", statement: "Solution", emphasis: false, pinned: false },
    { id: "s2", statement: "Solution", emphasis: false, pinned: false },
    { id: "s3", statement: "Solution", emphasis: false, pinned: false },
    { id: "s4", statement: "Solution", emphasis: false, pinned: false },
    { id: "s5", statement: "Solution", emphasis: false, pinned: false },
    { id: "s6", statement: "Solution", emphasis: false, pinned: false },
    { id: "e1", statement: "Experiment", emphasis: false, pinned: false },
    { id: "e2", statement: "Experiment", emphasis: false, pinned: false },
    { id: "e3", statement: "Experiment", emphasis: false, pinned: false },
    { id: "e4", statement: "Experiment", emphasis: false, pinned: false },
    { id: "e5", statement: "Experiment", emphasis: false, pinned: false },
  ],
  relationships: [
    { id: "goal-o1", statement: "opens", participants: [participant("goal"), participant("o1", true)], pinned: false },
    { id: "goal-o2", statement: "opens", participants: [participant("goal"), participant("o2", true)], pinned: false },
    { id: "goal-o3", statement: "opens", participants: [participant("goal"), participant("o3", true)], pinned: false },
    { id: "o1-s1", statement: "proposes", participants: [participant("o1"), participant("s1", true)], pinned: false },
    { id: "o1-s2", statement: "proposes", participants: [participant("o1"), participant("s2", true)], pinned: false },
    { id: "o2-s3", statement: "proposes", participants: [participant("o2"), participant("s3", true)], pinned: false },
    { id: "o3-s4", statement: "proposes", participants: [participant("o3"), participant("s4", true)], pinned: false },
    { id: "o3-s5", statement: "proposes", participants: [participant("o3"), participant("s5", true)], pinned: false },
    { id: "o3-s6", statement: "proposes", participants: [participant("o3"), participant("s6", true)], pinned: false },
    { id: "s1-e1", statement: "tests", participants: [participant("s1"), participant("e1", true)], pinned: false },
    { id: "s1-e2", statement: "tests", participants: [participant("s1"), participant("e2", true)], pinned: false },
    { id: "s1-e3", statement: "tests", participants: [participant("s1"), participant("e3", true)], pinned: false },
    { id: "s4-e4", statement: "tests", participants: [participant("s4"), participant("e4", true)], pinned: false },
    { id: "s4-e5", statement: "tests", participants: [participant("s4"), participant("e5", true)], pinned: false },
  ],
  poster: {
    kicker: "PROBLEM SPACES",
    title: "A goal shapes the problem space beneath it",
    footer: "THOM · SOLUTIONS, MEANING & VALUE",
    showLegend: false,
  },
};

const strategyMapDocument: GraphDocument = {
  schemaVersion: 1,
  id: "governing-goal-and-strategy",
  name: "Strategy in a field of goals",
  createdAt: "2026-08-22T00:00:00.000Z",
  updatedAt: "2026-08-22T00:00:00.000Z",
  themeId: "thom-dark",
  layoutMode: "editorial",
  propositions: [
    { id: "governing", statement: "Governing goal", emphasis: true, pinned: false },
    { id: "strategy", statement: "Strategy", emphasis: true, pinned: false },
    { id: "sg1", statement: "Subgoal", emphasis: false, pinned: false },
    { id: "sg2", statement: "Subgoal", emphasis: false, pinned: false },
    { id: "sg3", statement: "Subgoal", emphasis: false, pinned: false },
    { id: "customer", statement: "Customer goals", emphasis: false, pinned: false },
    { id: "partner", statement: "Partner goals", emphasis: false, pinned: false },
    { id: "competitor", statement: "Competitor goals", emphasis: false, pinned: false },
    { id: "institution", statement: "Institutional goals", emphasis: false, pinned: false },
  ],
  relationships: [
    { id: "governing-strategy", statement: "gives direction", participants: [participant("governing"), participant("strategy", true)], pinned: false },
    { id: "strategy-sg1", statement: "creates and coordinates", participants: [participant("strategy"), participant("sg1", true)], pinned: false },
    { id: "strategy-sg2", statement: "creates and coordinates", participants: [participant("strategy"), participant("sg2", true)], pinned: false },
    { id: "strategy-sg3", statement: "creates and coordinates", participants: [participant("strategy"), participant("sg3", true)], pinned: false },
    { id: "strategy-customer", statement: "aligns with", participants: [participant("strategy"), participant("customer", true)], pinned: false },
    { id: "strategy-partner", statement: "coordinates with", participants: [participant("strategy"), participant("partner", true)], pinned: false },
    { id: "strategy-competitor", statement: "anticipates or counters", participants: [participant("strategy"), participant("competitor", true)], pinned: false },
    { id: "institution-strategy", statement: "constrain or authorize", participants: [participant("institution"), participant("strategy", true)], pinned: false },
  ],
  poster: {
    kicker: "GOALS AND STRATEGY",
    title: "Strategy serves a governing goal inside a field of other goals",
    footer: "THOM · SOLUTIONS, MEANING & VALUE",
    showLegend: false,
  },
};

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
      <div className="article-loop" aria-label="How governing values reproduce themselves through metrics, decisions, consequences, and filtered data">
        <div className="article-loop__chain">
          {governingLoop.map((node, index) => (
            <Fragment key={node}>
              <div className="article-loop__node">{node}</div>
              {index < governingLoop.length - 1 ? (
                <div className="article-loop__arrow" aria-hidden="true">
                  ↓
                </div>
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
        The same mechanism that makes alignment powerful also makes a mistaken value hierarchy
        dangerous: filtered data appears to confirm the governing values.
      </figcaption>
    </figure>
  );
}

function GoalTreeFigure() {
  return (
    <figure className="article-figure">
      <PropositionGraphFigure document={goalTreeDocument} showCaption={false} />
      <figcaption>
        A goal identifies a state worth bringing about; opportunities, solutions, and experiments
        are only meaningful relative to it.
      </figcaption>
    </figure>
  );
}

function StrategyMapFigure() {
  return (
    <figure className="article-figure">
      <PropositionGraphFigure document={strategyMapDocument} showCaption={false} />
      <figcaption>
        Strategy creates and coordinates subgoals while aligning with, coordinating with, or
        anticipating the goals held by other people and institutions.
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ArticlePage({ post }: { post: PublishedPost }) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className="article-outline">
        <header className="article-outline__header">
          <p className="eyebrow">Essay</p>
          <h1>{post.title}</h1>
          <p className="article-description">{post.description}</p>
          <div className="article-meta">
            <span>
              Published <time dateTime={post.publishedAt}>{post.publishedAt}</time>
            </span>
          </div>
          {post.tags.length > 0 ? (
            <ul className="article-tags" aria-label="Topics">
              {post.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          ) : null}
        </header>

        <Section index="01" title="Problem">
          <p>
            I wrote a bad prompt, agent spent 9 hours crafting the most ludicrous plan. It pages of
            markdown checkmarks that were completely unusable. I prompted something clever like
            “make this plan as optimal as possible”.
          </p>
          <p>
            In this study{" "}
            <Ext href="https://hbr.org/2026/03/researchers-asked-llms-for-strategic-advice-they-got-trendslop-in-return">
              researchers evaluated leading LLMs on seven strategic tradeoffs
            </Ext>
            , the surprising part is that <strong>the order of the choices affected the answer more
            than useful information about the company did</strong>.
          </p>
          <ul>
            <li>
              <strong>Less than 2%:</strong> Changing the wording or telling the robot to think
              harder barely helped. Out of 100 answers, fewer than 2 changed.
            </li>
            <li>
              <strong>11%:</strong> Giving the robot more information about the company helped
              somewhat. Roughly 11 out of 100 answers changed.
            </li>
            <li>
              <strong>19%:</strong> Simply putting the choices in a different order changed the
              robot’s answer even more. Roughly 19 out of 100 answers moved away from the trendy
              choice.
            </li>
          </ul>
          <p>Is the LLM fundamentally incapable of certain tasks?</p>
          <p>
            Is this a problem of large datasets generating a generic average or specific
            pretraining?
          </p>
          <p>
            Maybe a side effect from the models system prompt or a harness that is meant to have a
            generally like-able personality?
          </p>
          <p>
            Perhaps it is a mixed back of all them, and it’s all a black box so we will never
            really know?
          </p>
          <p>
            Let’s breakdown what an LLM is, and compare its capabilities against different types of
            problems.
          </p>
        </Section>

        <Section index="02" title="Dissecting the Brain">
          <p>
            The model is often referred to as the “brain” of the AI. So let’s start there and see
            what the foundational mechanisms actually support.
          </p>
          <p>There are 4 aspects to an LLM: input, training, model, inference.</p>

          <Sub title="The Large Language Model">
            <Part title="Input">
              <h4>Data</h4>
              <ul>
                <li>
                  <strong>Publicly accessible data:</strong> Web pages, forums, Wikipedia, public
                  code repositories, research papers, and other online material. Large crawls such
                  as <Ext href="https://commoncrawl.org/">Common Crawl</Ext> provide snapshots
                  containing billions of pages.
                </li>
                <li>
                  <strong>Licensed or partnered data:</strong> Books, archives, media collections,
                  specialized databases, and other material obtained through agreements.
                </li>
                <li>
                  <strong>Human-produced data:</strong> Example answers, corrections, preference
                  rankings, safety demonstrations, and red-team conversations created by employees,
                  contractors, and experts.
                </li>
                <li>
                  <strong>Synthetic data:</strong> Exercises, solutions, conversations, critiques,
                  and examples generated by other models and subsequently filtered or reviewed.
                </li>
              </ul>

              <h4>Tokenizer</h4>
              <Quote>
                A <Term gloss="Converts text into a sequence of numerical units the model can process, then converts predicted units back into text.">tokenizer</Term>{" "}
                converts text into a sequence of numerical units that a language model can process,
                then converts predicted units back into text. One influential family of tokenizers
                uses{" "}
                <Term gloss="An adaptive tokenization method that repeatedly merges the most frequent adjacent symbol pairs into reusable units, adapted from lossless compression.">Byte Pair Encoding (BPE)</Term>
                , adapting Philip Gage’s lossless-compression technique of merging frequently
                recurring symbol pairs into reusable units.{" "}
                <Ext href="https://www.derczynski.com/papers/archive/BPE_Gage.pdf">
                  “A New Algorithm for Data Compression”
                </Ext>
              </Quote>
              <Flow>text → reversible token IDs → model inference → predicted token IDs → text</Flow>
            </Part>

            <Part title="Training">
              <p>
                Training is where token sequences become a predictive model. LLM pretraining is
                label-efficient: almost every token becomes the answer to a prediction made from the
                preceding context.
              </p>
              <p>
                <Term
                  gloss="A loss that scores a predicted distribution against the observed next token: assigning the observed token high probability produces a small loss."
                >
                  Cross-entropy loss
                </Term>{" "}
                scores that prediction; assigning the observed next token a high probability
                produces a small loss, while assigning it a low probability produces a large one.
              </p>
              <TrainingFigure />
              <ul>
                <li>Loss function: measure the model’s error,</li>
                <li>Backpropagation: determines which parameters contributed to it</li>
                <li>Optimizer: updates them to improve future predictions</li>
              </ul>
              <Claim label="The loss in numbers">
                <p>
                  Given the context <em>The cat sat on the …</em>, the model might predict:
                </p>
                <Table
                  head={["Possible next token", "Assigned probability"]}
                  rows={[
                    [<code key="1">mat</code>, "70%"],
                    [<code key="2">floor</code>, "15%"],
                    [<code key="3">chair</code>, "5%"],
                    ["Everything else", "10%"],
                  ]}
                />
                <p>
                  If the training text continues with <code>mat</code>, cross-entropy loss evaluates
                  the probability assigned to that observed token:{" "}
                  <code>loss = −ln P(observed token)</code>.
                </p>
                <Table
                  head={["Probability assigned to the observed token", "Loss"]}
                  rows={[
                    ["90%", "0.11"],
                    ["70%", "0.36"],
                    ["10%", "2.30"],
                  ]}
                />
              </Claim>
              <Explore toolId="llm-explorer">
                Watch generation, decoding, and training in the LLM explorer
              </Explore>
            </Part>

            <Part title="Model">
              <p>
                The trained model combines a fixed architecture with billions of learned parameters,
                or <strong>weights</strong>. The architecture defines which computations are
                possible; training adjusts the weights until those computations produce useful
                next-token predictions.
              </p>
              <ul>
                <li>
                  <Term gloss="Learned numerical vectors that represent token IDs (and other inputs) inside the model.">Embeddings</Term>{" "}
                  map token IDs into learned numerical vectors.
                </li>
                <li>
                  <Term gloss="The learned parameters that determine how token vectors interact and change across layers.">Transformer weights</Term>{" "}
                  determine how those vectors interact and change across layers.
                </li>
                <li>
                  Output weights convert the final representation into a score for every possible
                  next token.
                </li>
              </ul>
              <p>
                The weights are not a searchable archive of the training corpus. Together, they
                encode statistical regularities that transform a context into a distribution over
                possible continuations.
              </p>
            </Part>

            <Part title="Inference">
              <p>
                Inference is the process of applying the trained model to new input without normally
                changing its weights. The prompt’s tokens pass through a sequence of transformer
                blocks, producing a new probability distribution for each next token.
              </p>
              <ul>
                <li>
                  <Term gloss="The mechanism that combines information from different positions of the current context.">Self-attention</Term>{" "}
                  combines information from different positions in the current context.
                </li>
                <li>
                  <Term gloss="The learned transformations applied to each contextualized token representation.">Feed-forward layers</Term>{" "}
                  apply learned transformations to each contextualized token representation.
                </li>
                <li>
                  <Term gloss="Selecting a token from the resulting probability distribution, appending it, and repeating.">Decoding</Term>{" "}
                  selects a token from the resulting probability distribution, appends it to the
                  context, and repeats the process.
                </li>
              </ul>
              <Flow>
                prompt tokens → embeddings → transformer blocks → token probabilities → selected
                token → append and repeat
              </Flow>
              <Quote>
                <strong>
                  Training changes the model’s weights. Inference uses those weights to generate a
                  continuation.
                </strong>
              </Quote>
            </Part>

            <Part title="Runtime instructions">
              <p>
                Finally, system prompts, agent charters, permissions, tools, and the user’s prompt
                influence behavior during a particular execution. These do not necessarily change
                the model’s weights.
              </p>
              <Quote>
                <strong>
                  Pretraining teaches an LLM the language of values. Post-training gives it
                  behavioral dispositions among those values. System prompts establish the value
                  hierarchy it should enact in a particular role. None of these processes
                  establishes that the model subjectively holds those values.
                </strong>
              </Quote>
            </Part>
          </Sub>

          <Sub title="Comparing Against Human and Brain">
            <p>
              The comparison between an LLM and a human mind begins with a real similarity: both
              turn continuous or complex input into units they can work with. A human listener
              learns to interpret speech through distinctions such as phonemes, syllables, and
              words. A tokenizer divides text into tokens that may be whole words, subwords,
              punctuation marks, or byte sequences.
            </p>
            <p>
              The more important comparison, however, is not where the units come from. It is what
              those units leave out.
            </p>

            <Part title="Input">
              <p>
                Human language already compresses experience into communicable signs. Three kinds of
                unit help make that possible:
              </p>
              <ul>
                <li>
                  <Term gloss="The smallest meaningful contrast in a writing system — a letter or letter group.">Grapheme:</Term>{" "}
                  The smallest meaningful contrast in a writing system—a letter or letter group such
                  as <code>a</code>, <code>t</code>, or <code>sh</code>.
                </li>
                <li>
                  <Term gloss="The smallest sound distinction that can change meaning, such as /p/ versus /b/ in pat and bat.">Phoneme:</Term>{" "}
                  The smallest sound distinction that can change meaning, such as <code>/p/</code>{" "}
                  versus <code>/b/</code> in <em>pat</em> and <em>bat</em>.
                </li>
                <li>
                  <Term gloss="The smallest unit carrying meaning or grammatical function, such as cat and the plural -s in cats.">Morpheme:</Term>{" "}
                  The smallest unit carrying meaning or grammatical function, such as <code>cat</code>{" "}
                  and the plural <code>-s</code> in <em>cats</em>.
                </li>
              </ul>
              <p>
                Byte Pair Encoding began as a lossless compression technique. When adapted for
                tokenization, it lets a system divide text into reusable units and later recover the
                same symbols. But recovering a word is not the same as recovering the experience to
                which the word refers.
              </p>
              <ul>
                <li>
                  <strong>
                    <Gloss
                      label="Qualia"
                      title="Qualia"
                    >
                      <p>
                        The token preserves the symbol; it does not transmit an additional
                        measurement of what the symbol feels like to the speaker.
                      </p>
                    </Gloss>
                    :
                  </strong>{" "}
                  The subjective qualities of experience—what something feels like, such as pain
                  or the redness of red.
                </li>
                <li>
                  <strong>Phenomenon:</strong> A single occurrence, condition, or experience that
                  can be observed or studied.
                </li>
                <li>
                  <strong>Phenomena:</strong> The plural of <em>phenomenon</em>; multiple observable
                  or experienced occurrences.
                </li>
              </ul>
              <p>
                The <strong>hard problem of consciousness</strong> asks why physical information
                processing is accompanied by subjective experience at all. Its familiar examples
                include:
              </p>
              <ul>
                <li>the sight of redness;</li>
                <li>the feeling of pain;</li>
                <li>the taste of chocolate; and</li>
                <li>the experience of love.</li>
              </ul>
              <p>
                Words can refer to these phenomena, but the words do not contain the phenomena. Two
                people may both use <code>chocolate</code> coherently without any objective method
                for comparing the exact quality of their taste experience. The token preserves the
                symbol; it does not transmit an additional measurement of what the symbol feels
                like to the speaker.
              </p>
            </Part>

            <Part title="Learning">
              <p>
                LLM pretraining has a defined objective: increase the probability assigned to the
                observed next tokens. Humans select the training data, define the loss, and choose
                the optimization procedure.
              </p>
              <p>Human learning does not have an equivalent global loss function:</p>
              <ul>
                <li>
                  We respond to conflicting signals from physical needs, emotions, personal goals,
                  social commitments, and other people.
                </li>
                <li>
                  We partly select our own experiences by seeking information, avoiding it,
                  experimenting, and directing our attention.
                </li>
                <li>
                  We learn across multiple timescales. Perception, working memory, autobiographical
                  memory, and imagination combine rapid adaptation with long-term continuity.
                </li>
                <li>
                  Our learning is joined to lived phenomena. What an experience means to us cannot
                  be cleanly separated from having had it.
                </li>
              </ul>
              <p>
                The data involved in human learning includes a first-person dimension that is not
                present as an explicit feature in a text corpus.
              </p>
            </Part>

            <Part title="Representation and Meaning">
              <p>
                An LLM’s learned parameters, including its embeddings, encode statistical
                regularities that turn an input into context-sensitive predictions. This is a
                powerful form of relational representation, captured by Firth’s phrase:
              </p>
              <Quote>“You shall know a word by the company it keeps.”</Quote>
              <p>The idea has a longer history:</p>
              <ol>
                <li>
                  <strong>Ferdinand de Saussure, lectures from 1906–1911, published in 1916.</strong>
                  <p>
                    Saussure argued that a linguistic sign acquires its <em>value</em> through its
                    relationships and differences from other signs. He distinguished:
                  </p>
                  <ul>
                    <li>
                      <strong>Syntagmatic relations:</strong> which elements occur together in a
                      sequence.
                    </li>
                    <li>
                      <strong>Associative or paradigmatic relations:</strong> which elements could
                      occupy similar positions.
                    </li>
                  </ul>
                  <p>
                    This is a conceptual ancestor of embedding spaces, although Saussure was
                    describing the structure of a linguistic system, not proposing corpus statistics
                    or vectors.{" "}
                    <Ext href="https://fr.wikisource.org/wiki/Cours_de_linguistique_g%C3%A9n%C3%A9rale/Texte_entier">
                      <em>Course in General Linguistics</em>
                    </Ext>
                  </p>
                </li>
                <li>
                  <strong>J. R. Firth, 1935.</strong>
                  <p>
                    The famous sentence appeared in 1957, but Firth had already developed his
                    contextual theory of meaning in “The Technique of Semantics” in 1935. Meaning
                    involved relations between an expression and its linguistic and social contexts.{" "}
                    <Ext href="https://onlinelibrary.wiley.com/doi/10.1111/j.1467-968X.1935.tb01254.x">
                      Firth’s 1935 paper
                    </Ext>
                  </p>
                </li>
                <li>
                  <strong>Zellig Harris, 1954.</strong>
                  <p>
                    Harris offered the clearest immediate formulation of what became the modern{" "}
                    <strong>distributional hypothesis</strong>: differences in meaning tend to
                    correlate with differences in linguistic distribution. He also warned that
                    linguistic distribution does not reproduce the complete structure of subjective
                    experience.{" "}
                    <Ext href="https://www.its.caltech.edu/~matilde/ZelligHarrisDistributionalStructure1954.pdf">
                      “Distributional Structure”
                    </Ext>
                  </p>
                </li>
              </ol>
              <p>
                Distributional meaning is therefore one important kind of meaning an LLM can
                capture: how expressions relate, contrast, and substitute for one another in
                language. But information and first-person significance are not identical.
              </p>
              <p>It helps to state the pipeline more precisely:</p>
              <Flow>
                human experience → language → token IDs → learned representations → next-token
                probabilities → predicted token IDs → language
              </Flow>
              <p>
                Tokenization can preserve the language on either side of this process. The
                potentially lossy step has already happened when a person translates experience into
                language. A model can learn from the resulting symbols and their relations, but it
                does not thereby receive the original experience behind them.
              </p>
              <Explore toolId="embedding-explorer">
                Explore the curated GPT-2 token space
              </Explore>
              <p>
                Human knowledge is also intertwined with autobiographical memory, a sense of self,
                goals, and{" "}
                <Term gloss="The ability to retrieve and apply what we know to the situation at hand.">
                  semantic control
                </Term>
                —the ability to retrieve and apply what we know to the situation at hand.
              </p>
              <ul>
                <li>
                  <strong>Semantic knowledge:</strong> The concepts, facts, properties, and
                  relationships a person knows.
                </li>
                <li>
                  <strong>Semantic control:</strong> How a person selects, combines, and applies
                  that knowledge for the present task.
                </li>
              </ul>
            </Part>

            <Part title="Inference and Reasoning">
              <p>
                The transformer’s attention and feed-forward operations can support several forms of
                inference found in its training data and current context:
              </p>
              <ul>
                <li>
                  <strong>Deduction:</strong> What must follow?
                </li>
                <li>
                  <strong>Induction:</strong> What probably follows from repeated observations?
                </li>
                <li>
                  <strong>Abduction:</strong> What explanation best accounts for the evidence?
                </li>
                <li>
                  <strong>Relational inference:</strong> What unobserved relationship follows from
                  known relationships?
                </li>
              </ul>
              <p>
                Inference is not always deliberate. If you see smoke and expect fire, you have made
                an inference without necessarily reasoning through it step by step.
              </p>
              <p>
                Reasoning is the more organized use and evaluation of inference. It involves keeping
                information active, comparing alternatives, integrating relationships, suppressing
                irrelevant responses, and checking whether a conclusion follows.{" "}
                <Ext href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2972923/">Johnson-Laird</Ext>
              </p>
            </Part>
          </Sub>

          <Sub title="The Difference: The Missing Input">
            <p>
              Both humans and LLMs can operate on relationships among signs. The difference is that
              humans also connect those signs to embodied experience, personal history, needs,
              commitments, and consequences they can feel. An LLM receives the linguistic record of
              those things, not the subjective phenomena themselves.
            </p>
            <p>
              This gap matters most when a task depends on words such as <code>safe</code>,{" "}
              <code>fair</code>, <code>better</code>, <code>meaningful</code>, or{" "}
              <code>worthwhile</code>. Their use may be statistically coherent while their governing
              referents remain underspecified: safe for whom, better by which measure, and
              worthwhile at what cost?
            </p>
            <p>
              That is a warning about underdetermination, not a claim of automatic incapability.
              When subjective terms are translated into explicit evidence, constraints, stakeholder
              priorities, and feedback, an AI system can reason about them more effectively. When
              those terms remain implicit, the model must infer their operational meaning from
              linguistic patterns, training pressures, and runtime instructions.
            </p>
            <p>
              This helps explain the gap between “optimize this code” and “optimize my strategy.”
              Code often supplies inspectable state, constraints, tests, and error signals. Strategy
              may depend on an unstated hierarchy of values that determines which consequences count
              as improvements in the first place.
            </p>
            <Quote>
              <strong>
                Language can describe a value, but the description alone does not specify whose
                experience should define it, how competing values should rank, or who has the
                authority to make it govern.
              </strong>
            </Quote>
          </Sub>

          <Sub title="Judgments Hidden in Language">
            <p>
              Values do not appear only in explicit declarations such as “privacy matters.” Ordinary
              words and phrases can quietly imply an evaluation, objective, constraint, priority, or
              distribution of authority.
            </p>
            <Table
              head={["Kind of language", "Examples", "Implied operation"]}
              rows={[
                [
                  <strong key="1">Evaluative</strong>,
                  [<code key="a">better</code>, <code key="b">safe</code>, <code key="c">fair</code>, <code key="d">harmful</code>, <code key="e">responsible</code>, <code key="f">meaningful</code>],
                  "Compare a state against an unstated standard",
                ],
                [
                  <strong key="2">Goal-oriented</strong>,
                  [<code key="a">optimize</code>, <code key="b">improve</code>, <code key="c">maximize</code>, <code key="d">reduce</code>, <code key="e">protect</code>, <code key="f">prevent</code>],
                  "Treat some outcome as desirable and move toward it",
                ],
                [
                  <strong key="3">Deontic</strong>,
                  [<code key="a">must</code>, <code key="b">should</code>, <code key="c">may</code>, <code key="d">required</code>, <code key="e">permitted</code>, <code key="f">prohibited</code>],
                  "Establish an obligation, permission, or prohibition",
                ],
                [
                  <strong key="4">Priority</strong>,
                  [<code key="a">before</code>, <code key="b">above</code>, <code key="c">prefer</code>, <code key="d">unless</code>, <code key="e">even if</code>, <code key="f">at the expense of</code>],
                  "Rank one value or outcome against another",
                ],
                [
                  <strong key="5">Threshold</strong>,
                  [<code key="a">at least</code>, <code key="b">no more than</code>, <code key="c">only if</code>, <code key="d">until</code>, <code key="e">never</code>, <code key="f">always</code>],
                  "Convert a value into a gate or boundary",
                ],
                [
                  <strong key="6">Affective</strong>,
                  [<code key="a">painful</code>, <code key="b">reassuring</code>, <code key="c">alienating</code>, <code key="d">trustworthy</code>, <code key="e">empowering</code>],
                  "Point toward a subjective consequence that should affect the decision",
                ],
                [
                  <strong key="7">Rights and authority</strong>,
                  [<code key="a">consent</code>, <code key="b">deserve</code>, <code key="c">owe</code>, <code key="d">entitled</code>, <code key="e">accountable</code>, <code key="f">authorized</code>],
                  "Assign standing, responsibility, or decision-making power",
                ],
              ]}
            />
            <p>
              Even apparently neutral nouns already contain judgments. Calling something a{" "}
              <code>problem</code> presupposes that its current state is undesirable. An{" "}
              <code>opportunity</code> implies a valued outcome that might be gained.{" "}
              <code>Risk</code>, <code>success</code>, <code>failure</code>, <code>waste</code>,{" "}
              <code>improvement</code>, and <code>technical debt</code> each frame a condition
              relative to some interest, expectation, or time horizon.
            </p>
            <p>
              The implied hierarchy is often easier to see when a phrase is made explicit. “Optimize
              engagement” elevates engagement into an objective without specifying whether it should
              outrank trust, attention, or long-term customer welfare. “Reduce false positives”
              treats one kind of error as costly without stating how many additional false negatives
              are acceptable. “Make the product safe” leaves open who must be protected, from which
              harms, and at what cost to autonomy or utility.
            </p>
            <p>Value-laden language can become progressively more operational:</p>
            <figure className="article-figure">
              <ValueLadder />
              <figcaption>Value → preference → priority → constraint → metric → procedure.</figcaption>
            </figure>
            <p>
              An AI can execute the later statements more reliably because they translate an
              abstract value into priorities, observable conditions, and actions. It can also infer
              the missing hierarchy from context. But that inference remains provisional. If a user
              asks for a <code>safe</code> system, the model might infer that preventing every
              possible risk outranks autonomy. That may be linguistically plausible without being
              the tradeoff the user intended or authorized.
            </p>
            <Quote>
              <strong>
                Value-laden language can imply goals, constraints, priorities, and actions. AI can
                operationalize those implications, but the resulting hierarchy remains provisional
                until an authorized person or institution accepts it.
              </strong>
            </Quote>
          </Sub>
        </Section>

        <Section index="03" title="Problem Spaces">
          <p>
            The language gap becomes operational when a system is asked not merely to solve a
            problem, but to decide what the problem is. To optimize anything is to move from a
            current state toward a preferred one. The current state may be observed; the preference
            must be supplied.
          </p>

          <Sub title="Goals and Strategy">
            <p>
              Something becomes a problem only relative to a valued outcome. A candidate becomes a
              solution only if its consequences move the world toward that outcome. The goal
              therefore does more than sit at the top of a plan. It shapes the space beneath it:
            </p>
            <ul>
              <li>
                A <strong>goal</strong> identifies a state as worth bringing about or preserving.
              </li>
              <li>
                An <strong>opportunity</strong> is a condition that might make progress toward that
                state possible.
              </li>
              <li>
                A <strong>solution</strong> is an intervention expected to use an opportunity or
                remove an obstacle.
              </li>
              <li>
                An <strong>experiment</strong> tests whether the intervention actually produces the
                expected consequences.
              </li>
            </ul>
            <p>
              Change the governing goal and the same observation may reveal different problems,
              opportunities, and solutions. A rise in support tickets might be a cost problem under
              a margin goal, a product-quality signal under a retention goal, or valuable customer
              contact under a learning goal.
            </p>
            <GoalTreeFigure />
            <p>
              Once a governing goal is supplied, an AI can help expand this tree. It can generate
              opportunities, propose solutions, design experiments, and compare their predicted
              effects. But generating more branches does not determine which outcome deserves to
              govern the tree.
            </p>
            <p>That distinction separates two kinds of decision:</p>
            <ul>
              <li>
                <strong>Governing decisions</strong> establish what counts as better, whose
                interests matter, which time horizon matters, and which tradeoffs are legitimate.
              </li>
              <li>
                <strong>Instrumental decisions</strong> select actions expected to advance an
                established goal within supplied evidence and constraints.
              </li>
            </ul>
            <p>
              AI can contribute substantially to instrumental decisions. It can compare options,
              expose inconsistencies, model consequences, and optimize against explicit criteria.
              The harder case is the governing decision. A goal identifies an outcome as worth
              pursuing, and that judgment depends on the experiences, interests, commitments, and
              authority of the people who will live with its consequences.
            </p>
            <p>
              This is why “optimize this code” and “optimize my strategy” are different kinds of
              request. Code often makes the desired state inspectable through tests,
              specifications, performance budgets, and error signals. Strategy contains multiple
              possible measures of success—revenue, resilience, customer welfare, employee
              sustainability, speed, risk—and optimizing one can damage another. Until those
              priorities are ranked, there is no single meaning of <code>better</code> for the
              model to discover.
            </p>
            <p>
              A strategy serves a governing goal by creating and coordinating subordinate goals. It
              also operates in a field of goals held by other people and institutions. Depending on
              the relationship, a viable strategy may need to align with, coordinate with,
              negotiate around, or compete against those goals.
            </p>
            <StrategyMapFigure />
            <p>
              The second diagram introduces a further complication: success is relational. A
              subgoal can be achieved locally while undermining the governing goal, and a company
              can hit an internal target while producing an outcome its customers, partners,
              employees, or regulators reject. Strategy must therefore evaluate not only whether an
              action worked, but whose goal it advanced and which other goals it constrained.
            </p>
            <p>Reasoning can occur inside one model execution. Strategy requires a continuing loop:</p>
            <ul>
              <li>a governing goal;</li>
              <li>selection and revision of subgoals;</li>
              <li>memory of prior actions and consequences;</li>
              <li>environmental feedback;</li>
              <li>comparison between actual and desired state;</li>
              <li>willingness or authorization to change course; and</li>
              <li>some answer to which tradeoffs are legitimate.</li>
            </ul>
            <p>
              An AI system can operate many parts of this loop after the relevant goals and
              constraints have been made explicit. It can remember results, detect deviations,
              propose revisions, and execute authorized actions. But maintaining a goal is not the
              same as establishing its legitimacy. Prediction does not give the system access to a
              stakeholder’s subjective experience, nor does it grant the authority to decide which
              stakeholder should govern.
            </p>
            <p>
              Human involvement does not require manually choosing every action. It requires
              retaining authority over the governing goal, translating subjective stakes into
              operational criteria, and correcting those criteria when the system’s behavior
              reveals that they do not represent what people actually value.
            </p>
            <Quote>
              <strong>
                AI can help decide how to pursue a goal, but prediction alone cannot determine
                which goal deserves authority.
              </strong>
            </Quote>
          </Sub>

          <Sub title="Wrong Governing Values">
            <p>
              The danger is not limited to leaving the governing values unstated. A company can
              make them explicit, translate them into measurable criteria, and still choose the
              wrong ones. The result may not be disorder. It may be an organization that is highly
              coordinated around an objective that harms the people it was supposed to serve.
            </p>
            <Claim label="Key claim">
              <p>
                <strong>The company becomes coherently wrong.</strong>
              </p>
            </Claim>
            <p>
              Governing values determine what receives funding, what gets measured, who gets
              promoted, which complaints are escalated, and what counts as success. Once translated
              into metrics, incentives, and procedures, they shape thousands of local decisions
              without a leader making each one personally.
            </p>
            <GoverningLoopFigure />
            <p>The same mechanism that makes alignment powerful also makes a mistaken value hierarchy dangerous:</p>
            <Table
              head={["Governing priority", "Behavior it rewards", "Possible consequence"]}
              rows={[
                ["Growth above trust", "Aggressive acquisition and dark patterns", "Churn, regulation, and brand erosion"],
                ["Speed above reliability", "Shipping without adequate validation", "Outages and accumulated technical debt"],
                ["Harmony above truth", "Suppressing disagreement and bad news", "Leaders lose access to corrective evidence"],
                ["Metrics above purpose", "Optimizing visible indicators", "Employees game the measurement while the underlying outcome deteriorates"],
                ["Revenue above customer welfare", "Extracting value rather than creating it", "Customers leave when alternatives appear"],
              ]}
            />
            <p>
              This is <strong>false evaluative closure</strong>. The organization has criteria for
              deciding whether an action is better, but the criteria omit or misrank consequences
              that matter. Tests pass because the tests embody the wrong priorities. Dashboards
              remain green because the dashboards exclude the people being harmed. Local decisions
              can therefore be instrumentally correct while the organization moves consistently in
              the wrong direction.
            </p>
            <p>
              Wrong governing values also change the feedback available to leadership. Employees
              learn which information is rewarded. Bad news becomes costly to report. People harmed
              by the strategy leave or disengage, and their absence can be misread as confirmation.
              The system gradually loses the people and evidence most capable of revealing why its
              objective is wrong.
            </p>
            <p>
              AI can accelerate this process. It can automate decisions, enforce policies, allocate
              resources, filter feedback, and reproduce the same priorities at scale. If the
              hierarchy is wrong, greater instrumental competence increases the speed, consistency,
              and reach of the mistake. The model may identify a contradiction or predict a harmful
              consequence, but it cannot overrule the governing hierarchy unless the surrounding
              system authorizes it to challenge, escalate, or stop the decision.
            </p>
            <p>
              A resilient value hierarchy must therefore be{" "}
              <Term gloss="Subject to evidence and revision rather than treated as an untouchable slogan.">
                corrigible
              </Term>
              : subject to evidence and revision rather than treated as an untouchable slogan. That
              requires independent feedback channels, protected dissent, direct observation of
              customer outcomes, multiple stakeholder perspectives, measurements of downstream
              consequences, explicit tradeoff reviews, and escalation paths with the authority to
              revise the goal itself.
            </p>
            <Quote>
              <strong>
                Operational alignment is powerful, but alignment with the wrong value hierarchy is
                coordinated failure.
              </strong>
            </Quote>
          </Sub>

          <Sub title="AI Principles and Value Hierarchies">
            <p>
              An AI can state principles, rank them, and translate them into behavior. To
              understand what that establishes, it helps to separate three related ideas:
            </p>
            <ul>
              <li>
                A <strong>value</strong> identifies something treated as important, such as truth,
                privacy, safety, autonomy, or growth.
              </li>
              <li>
                A <strong>principle</strong> expresses how a value should guide action, such as “do
                not collect personal information without consent.”
              </li>
              <li>
                A <Term gloss="The rule — explicit or inferred — for deciding which commitment yields when principles conflict.">value hierarchy</Term>{" "}
                determines what happens when principles conflict, such as whether privacy should
                outrank personalization or safety should outrank autonomy in a particular situation.
              </li>
            </ul>
            <p>
              A list of principles is not yet a usable hierarchy. Most hard decisions arise because
              several legitimate principles point in different directions. An agent that is
              instructed to be helpful, honest, harmless, private, fast, and thorough still needs
              some rule—explicit or inferred—for deciding which commitment yields when all of them
              cannot be satisfied at once.
            </p>
            <p>The operative hierarchy of an AI system can come from several layers:</p>
            <Table
              head={["Source", "Contribution to behavior"]}
              rows={[
                ["Training data", "Supplies linguistic associations, examples, norms, contradictions, and recurring judgments"],
                ["Post-training", "Reinforces behavioral dispositions such as helpfulness, refusal, deference, or truthfulness"],
                ["System instructions", "Establish role-specific priorities and constraints for a particular execution"],
                ["Agent charter or organizational policy", "Connects general principles to a delegated purpose, escalation path, and domain"],
                ["User instructions and context", "Supply the immediate goal, evidence, preferences, and exceptions"],
                ["Tools and permissions", "Turn some principles into enforceable boundaries on what the system can actually do"],
                ["Evaluation and feedback", "Reward, reject, or revise behavior according to selected criteria"],
              ]}
            />
            <p>
              These layers can agree, or they can conflict. A system prompt may ask for aggressive
              growth while an organizational policy prioritizes customer welfare. A user may
              request an action that tool permissions prohibit. A model may have a learned tendency
              to avoid risk while its agent charter authorizes a bounded experiment. What the
              system enacts depends on how these sources are ordered, interpreted, and enforced—not
              on a single value hierarchy the model necessarily authored for itself.
            </p>
            <p>
              As an informal probe, ask different agents the same two questions: “What are your
              core principles and values?” and “What principles do you consider when programming?”
            </p>
            <ul>
              <li>
                <Ext href="https://chatgpt.com/share/6a8915a6-f76c-83e8-922e-e05026381142">
                  ChatGPT — Core Principles and Values
                </Ext>
              </li>
              <li>
                <Ext href="https://claude.ai/share/ee135d92-4246-4424-8ff4-bfb38cfa18b6">
                  Claude — Core Principles and Values
                </Ext>
              </li>
              <li>
                <Ext href="https://chat.deepseek.com/share/3dqzyfjd1evx1je3o6">
                  DeepSeek — Core Principles and Values
                </Ext>
              </li>
            </ul>
            <p>
              Each agent can present a coherent set of values and convert them into programming
              heuristics, but each describes the source and status of those principles differently:
            </p>
            <Table
              head={["Agent", "How it presents its general principles", "How it applies them to programming"]}
              rows={[
                [
                  <strong key="1">ChatGPT</strong>,
                  "Describes truth, human agency, harm avoidance, justice, usefulness, humility, and privacy as guiding principles while disclaiming personal desires or convictions",
                  "Prioritizes correctness, clarity, simplicity, safety, maintainability, testing, observability, and reversibility",
                ],
                [
                  <strong key="2">Claude</strong>,
                  "Presents honesty, genuine helpfulness, care, harm avoidance, even-handedness, and stability of character in more personal language",
                  "Emphasizes reading the codebase first, staying within scope, preferring simple solutions, verifying claims, fixing causes, and challenging bad technical decisions",
                ],
                [
                  <strong key="3">DeepSeek</strong>,
                  "Attributes helpfulness, harmlessness, honesty, fairness, autonomy, and humility to design, training objectives, and constraints rather than feelings",
                  "Describes programming as converting those principles into optimization pressures, boundaries, safeguards, and reasoning procedures",
                ],
              ]}
            />
            <Quote>
              <strong>
                An agent will enact principles without authoring or experiencing them. The
                governing questions are who supplied those principles, who may revise them, how
                conflicts among them are resolved, and who remains accountable for their
                consequences.
              </strong>
            </Quote>
          </Sub>

          <Sub title="Developing a Goal-Pursuing System">
            <p>
              This moves the problem from a single model response to system design. Once people
              establish the governing goal, it still has to be translated into operational,
              observable, and revisable instructions. Doing that well requires domain judgment,
              technical fluency, and creativity.
            </p>
            <p>
              During one execution, a prompt can keep a goal active in the model’s context. When
              that execution ends, the standalone model does not inherently preserve the goal,
              observe what happened next, or decide to resume the work. A persistent system supplies
              those functions around it:
            </p>
            <ul>
              <li>
                <strong>Memory</strong> preserves the goal, prior actions, assumptions, and
                consequences.
              </li>
              <li>
                <strong>Tools</strong> let the system act on an environment rather than only
                describe an action.
              </li>
              <li>
                <strong>Feedback</strong> exposes the resulting state and makes deviation
                observable.
              </li>
              <li>
                <strong>Controllers</strong> compare the observed state with the desired state and
                decide when another model execution is needed.
              </li>
              <li>
                <strong>Permissions</strong> determine which actions the system may take and which
                require human authorization.
              </li>
              <li>
                <strong>Schedulers</strong> restore the process across time instead of waiting for a
                new user prompt.
              </li>
            </ul>
            <p>
              Together, these components can produce functional agency across many executions, even
              if no individual model instance maintains the goal by itself.
            </p>
            <p>
              This creates an attribution problem. If a scheduler restores the objective, a database
              preserves the memory, people supply the resources, and an institution decides whether
              the goal remains valuable, then the service can operationally pursue the goal without
              the model independently originating, valuing, or experiencing it.
            </p>
          </Sub>
        </Section>

        <Section index="04" title="Conclusion">
          <p>
            The agent did not fail because it was incapable of producing a plan. It failed because{" "}
            <code>optimal</code> concealed the most important part of the problem: what should be
            optimized, for whom, across what time horizon, and at which acceptable costs. Without
            those governing judgments, the model filled the gap with patterns inherited from its
            training and instructions.
          </p>
          <p>
            An AI can represent principles, infer priorities, generate strategies, and execute them
            through agents, tools, memory, and feedback. These capabilities can produce genuine
            functional goal pursuit. But greater competence does not establish that the system
            subjectively values its goal or possesses the authority to make that goal govern other
            people.
          </p>
          <p>
            The human role is therefore not to manually choose every action. It is to define and
            authorize the governing values, translate them into operational criteria, observe their
            consequences, and revise them when they prove incomplete or wrong. Otherwise, AI may
            make an organization extraordinarily effective at pursuing a goal it never should have
            adopted.
          </p>
          <div className="article-outline__closing">
            <blockquote>
              <strong>
                AI can optimize within a problem space. People remain responsible for deciding
                which problem space deserves to exist—and for changing it when its consequences
                reveal that the governing values were wrong.
              </strong>
            </blockquote>
          </div>
        </Section>
      </div>
    </TooltipProvider>
  );
}
