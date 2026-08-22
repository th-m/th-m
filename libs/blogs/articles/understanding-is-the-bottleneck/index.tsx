import { Fragment } from "react";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
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
} from "@th-m/ui";
import {
  createUnderstandingLoopGraph,
  createUnderstandingPipelineGraph,
  PropositionGraphFigure,
} from "@th-m/graph-visualization";

// Stable module-scope documents so the figures lay out once and never re-run
// ELK on incidental re-renders.
const pipelineGraph = createUnderstandingPipelineGraph("2026-08-22T00:00:00.000Z");
const loopGraph = createUnderstandingLoopGraph("2026-08-22T00:00:00.000Z");

function formatDate(value: string): string {
  return new Date(`${value}T00:00:00.000Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
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

function Claim({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <Card className="article-claim">
      {title ? (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      ) : null}
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Gloss({ term, title, children }: { term: ReactNode; title: string; children: ReactNode }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="thom-tooltip-trigger article-gloss-trigger" tabIndex={0}>{term}</span>
      </HoverCardTrigger>
      <HoverCardContent className="article-gloss">
        <h4>{title}</h4>
        {children}
      </HoverCardContent>
    </HoverCard>
  );
}

function Note({ term, children }: { term: ReactNode; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="thom-tooltip-trigger" tabIndex={0}>{term}</span>
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
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

function EssayLink({ slug, children }: { slug: string; children: ReactNode }) {
  return (
    <LinkPreview url={`/writing/${slug}`} asChild>
      <Link to="/writing/$slug" params={{ slug }}>{children}</Link>
    </LinkPreview>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <LinkPreview url={href} external>
      {children}
    </LinkPreview>
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
            <time dateTime={post.publishedAt}>Published {formatDate(post.publishedAt)}</time>
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
          <p>AI makes drafts, analyses, prototypes, and implementations abundant. The scarce organizational capability is increasingly the ability to interpret that output: to understand what a team has learned, connect it to customer experience, frame the right problem, and determine which proposed solution deserves a test.</p>
          <p>Producing more answers does not resolve this bottleneck. People must listen across roles, separate evidence from interpretation, preserve consequential disagreement, and build a working model that others can test and revise. The useful output is not merely another artifact. It is a greater shared capacity to reason and act.</p>
          <p>This requires technical and product judgment, but it also requires empathy. Customers do not experience a roadmap, architecture, or ticket queue. They experience a situation. A team cannot reliably solve for them unless it remains close to that situation and can recognize which consequences matter.</p>
        </Section>

        <Section index="02" title="Core Thesis">
          <p>When producing output is expensive, execution limits progress. When plausible output becomes abundant, shared understanding limits progress. People and teams respond by strengthening their ability to:</p>
          <ul>
            <li>observe customers and systems more accurately;</li>
            <li>distinguish evidence from interpretation;</li>
            <li>name the problem before converging on a solution;</li>
            <li>surface important disagreements and missing context;</li>
            <li>translate insight into testable action;</li>
            <li>learn from consequences; and</li>
            <li>retain that learning so the next decision starts from a stronger model.</li>
          </ul>
          <p>The advantage comes from making <Note term="solutioning">the collective capability to frame a problem, generate interventions, test them, and revise the model — not merely the act of proposing features.</Note> more capable and distributed while keeping meaning, evidence, and accountability intact.</p>
        </Section>

        <Section index="03" title="Relationship to the Series">
          <p>This is the third essay in a coordinated sequence:</p>
          <ol>
            <li><EssayLink slug="goals-solutions-and-value">Goals, Solutions &amp; Value</EssayLink> establishes the human stakes that make an opportunity worth pursuing.</li>
            <li><EssayLink slug="truth-entropy-and-inference">Truth, Entropy &amp; Inference</EssayLink> explains why AI can be fluent and coherent in some domains while remaining weakly grounded in others.</li>
            <li><strong>The Understanding Bottleneck</strong> defines the human and organizational capability needed to direct and evaluate abundant output.</li>
            <li><EssayLink slug="the-knowledge-factory">The Knowledge Factory</EssayLink> turns that capability into an organizational operating system.</li>
          </ol>
        </Section>

        <Section index="04" title="Intended Reader">
          <p>Developers, designers, researchers, product practitioners, founders, and leaders who use AI-generated work or help a group improve its decisions and problem-solving capacity.</p>
        </Section>

        <Section index="05" title="Key Terms">
          <Terms items={[
            ["Understanding", "a provisional working model of the relevant people, entities, relationships, causes, constraints, and consequences that supports better prediction and action."],
            ["Solutioning", "the collective capability to frame a problem, generate interventions, test them, and revise the model — not merely the act of proposing features."],
            ["Distillation", "compressing many observations into a useful model while preserving uncertainty, dissent, provenance, and consequential detail."],
            ["Evaluative closure", "enough relevant understanding, evidence, criteria, and authority to accept, revise, reject, or stop without pretending to have certainty."],
            ["Customer empathy", "disciplined contact with how a situation is experienced, including the customer's goals, costs, habits, fears, incentives, and trust."],
          ]} />
        </Section>

        <Section index="06" title="When Verification Outruns Understanding">
          <p>AI-assisted mathematics provides an unusually clean case of output becoming abundant while understanding remains scarce. Mathematical work separates three operations that ordinary knowledge work often blends:</p>
          <ol>
            <li><strong>Generation</strong> produces candidate conjectures, proofs, counterexamples, programs, and intermediate lemmas.</li>
            <li><strong>Verification</strong> determines whether an artifact satisfies stated formal constraints through expert review, tests, or a proof assistant.</li>
            <li><strong>Interpretation and adoption</strong> determines whether the formalization matches the intended question, what the result teaches, why it matters, how it should be explained, and whether it belongs in the field's reusable knowledge.</li>
          </ol>
          <p>Terence Tao's 2026 ICM talk, <ExternalLink href="https://www.simonsfoundation.org/2026/08/13/fields-medalist-terence-tao-on-artificial-intelligence-and-why-we-do-math/">"Mathematics in the Age of AI"</ExternalLink>, and the accompanying <ExternalLink href="https://arxiv.org/abs/2608.16753">essay</ExternalLink> provide the organizing example. Tao asks the mathematical community to assume that AI will perform a meaningful share of research-level tasks, then examine the harder question this abundance exposes: what are the actual goals and values of mathematical work?</p>
          <p>Solving or verifying a proof is only the beginning of the pipeline. The result must still be explained, evaluated, attributed, reviewed, connected to other work, taught, and eventually incorporated into the field's canonical knowledge. If proof generation accelerates faster than those downstream practices, the community develops what Tao calls <Note term="proof indigestion">the failure mode when downstream practices — verification, explanation, absorption — cannot keep pace with upstream proof generation.</Note>: candidate proofs outrun verification, verified proofs outrun explanation, and published work outruns collective absorption.</p>
          <PropositionGraphFigure document={pipelineGraph} title="Proof abundance pipeline" />
          <p>A formal certificate can establish that a derivation follows from encoded definitions and axioms. It cannot by itself establish that the encoding faithfully represents the informal question, that the result is significant, or that anyone has developed a transferable understanding of why it works. Tao proposes a practical test: authors should be able to give a clear, correct, and properly attributed <Note term="expert talk">a short lecture explaining the result, its significance, and its place in the field — even when a proof assistant has already verified the derivation.</Note> about a result before it is treated as complete, even when the proof has been formally verified.</p>
          <p>The recent OpenAI unit-distance result gives the opening a concrete case. Its proof was checked by external mathematicians, while OpenAI's own account still concludes that people choose important problems and interpret their significance: <ExternalLink href="https://openai.com/index/model-disproves-discrete-geometry-conjecture/">"An OpenAI model has disproved a central conjecture in discrete geometry"</ExternalLink>. The <ExternalLink href="https://leidendeclaration.ai/">Leiden Declaration on Artificial Intelligence and Mathematics</ExternalLink> adds the institutional requirements: correctness must sit alongside understanding, depth, attribution, transparency, and human direction of research.</p>
          <p>This connects directly to <EssayLink slug="truth-entropy-and-inference">Truth, Entropy &amp; Inference</EssayLink>. Mathematics is unusually pattern-dense and mechanically constrained, so AI systems can search and verify candidate work at extraordinary scale. The case then reveals the next bottleneck: even where correctness can be checked, someone must interpret what the output means, decide what deserves attention, connect it to existing knowledge, and make it usable by other people.</p>
          <Claim title="The opening question">
            <p>What becomes scarce when a system can produce more correct work than a community can understand, evaluate, and absorb?</p>
          </Claim>
          <p>That is not only a question for mathematicians. Every organization can produce more research summaries, analyses, specifications, designs, and code than its people can integrate into a responsible model of what to do next. Formal verification makes the boundary unusually visible; understanding is the general organizational bottleneck.</p>
        </Section>

        <Section index="07" title="What Understanding Adds">
          <p>Step away from mathematics and look at an ordinary team producing more than ever: research summaries, dashboards, customer transcripts, prototypes, pull requests, and AI-generated options. The team's problem is no longer a lack of artifacts. It is an inability to determine what all the artifacts mean together.</p>
          <p>Moving from output to understanding requires five operations:</p>
          <ol>
            <li>listen for evidence and lived stakes;</li>
            <li>separate observations from proposed explanations;</li>
            <li>name the consequential relationships and disagreements;</li>
            <li>return a clearer, testable problem frame to the team; and</li>
            <li>expand who can reason from that frame.</li>
          </ol>
          <p>The result is not merely a decision. It is a provisional model that increases the group's capacity to predict, test, and solve.</p>
        </Section>

        <Section index="08" title="Distillation Is Not Summarization">
          <p>A summary makes material shorter. <Gloss term="Distillation" title="Distillation">compressing many observations into a useful model while preserving uncertainty, dissent, provenance, and consequential detail. A summary is shorter; a distillation is sound under pressure.</Gloss> identifies which distinctions must survive compression for a decision to remain sound.</p>
          <Claim title="Good distillation preserves">
            <ul>
              <li>whose experience is represented;</li>
              <li>what was directly observed;</li>
              <li>what is inferred;</li>
              <li>what remains disputed;</li>
              <li>which constraints are hard or negotiable;</li>
              <li>which tradeoffs are being accepted; and</li>
              <li>what evidence would overturn the current model.</li>
            </ul>
          </Claim>
          <p>AI can summarize at scale. People must determine the criteria by which a summary becomes meaningful context for the present decision.</p>
        </Section>

        <Section index="09" title="Keep Problem Framing Close to the Work">
          <p>The goal of organizational understanding is to extract the solvable structure from noisy experience without extracting the right to solve from the people closest to the work.</p>
          <p>The failure mode is a gate. Teams collect evidence, but only a small authority layer may frame problems or authorize solutions. Context is destroyed at every handoff, queueing grows as requests pile up at the gate, and engineers learn to wait for tasks instead of understanding them. A gate may look like control; it usually produces dependency.</p>
          <Claim title="Gated versus distributed solutioning">
            <table>
              <thead>
                <tr><th></th><th>Gated</th><th>Distributed</th></tr>
              </thead>
              <tbody>
                <tr><th>Who frames the problem</th><td>A small authority layer</td><td>Teams close to the evidence</td></tr>
                <tr><th>Context</th><td>Summarized across handoffs</td><td>Shared context, boundaries, and tools</td></tr>
                <tr><th>Teams</th><td>Wait for tasks</td><td>Propose and test inside explicit constraints</td></tr>
                <tr><th>Outcome</th><td>Queueing and dependency</td><td>More exploration without lower standards</td></tr>
              </tbody>
            </table>
          </Claim>
          <p>The alternative is shared capability. Teams receive the context, decision boundaries, problem-framing tools, and authority needed to propose and test solutions inside explicit constraints. The frame stays close to the evidence, and the people who will live with the consequences get to shape the plan.</p>
        </Section>

        <Section index="10" title="Build Shared Problem-Solving Capacity">
          <p>Understanding becomes easier to build and share when the organization adopts practices that make reasoning visible:</p>
          <ul>
            <li>problem briefs that distinguish symptoms, causes, stakes, and assumptions;</li>
            <li>shared domain vocabulary;</li>
            <li>decision records with evidence and rejected alternatives;</li>
            <li>pre-mortems and adversarial review;</li>
            <li>customer contact across product, design, and engineering;</li>
            <li>small experiments with explicit learning goals;</li>
            <li>retrospectives that update the model, not only the process; and</li>
            <li>coaching that asks better questions before supplying answers.</li>
          </ul>
          <p>The goal is for more people to recognize a poorly framed request, surface a missing constraint, and connect technical choices to customer consequences.</p>
        </Section>

        <Section index="11" title="Empathy Is Part of the Evidence System">
          <p>Customer empathy is how teams remain connected to stakes that do not appear in telemetry alone. A metric can show abandonment; empathy helps investigate the confusion, fear, broken trust, interrupted workflow, or competing obligation behind it. Empathy is not intuition — it is disciplined contact, informed by observation, evidence, participation, and correction.</p>
          <p>Operationalize empathy through contact:</p>
          <ul>
            <li>interviews and observation;</li>
            <li>support and sales evidence;</li>
            <li>usability sessions;</li>
            <li>participation in the workflow where possible;</li>
            <li>attention to non-users and excluded users; and</li>
            <li>follow-up after a solution changes behavior.</li>
          </ul>
          <p>The point is not that customers dictate features. It is that solutioning begins with an accountable interpretation of their situation.</p>
        </Section>

        <Section index="12" title="Five Dimensions of Product Understanding">
          <p>A compact model keeps the group honest about what "understanding the product situation" includes:</p>
          <Claim title="Five dimensions of product understanding">
            <table>
              <thead>
                <tr><th>Dimension</th><th>What it covers</th></tr>
              </thead>
              <tbody>
                <tr><th>Human</th><td>goals, experience, behavior, trust, and consequences</td></tr>
                <tr><th>Domain</th><td>entities, relationships, rules, exceptions, and language</td></tr>
                <tr><th>System</th><td>architecture, dependencies, state, failure modes, and operations</td></tr>
                <tr><th>Economic</th><td>incentives, opportunity cost, distribution, and sustainability</td></tr>
                <tr><th>Epistemic</th><td>evidence quality, uncertainty, assumptions, and disconfirming tests</td></tr>
              </tbody>
            </table>
          </Claim>
          <p>No one person needs every fact. The group needs enough shared understanding across these dimensions to predict what an intervention will change and recognize when the prediction fails.</p>
        </Section>

        <Section index="13" title="AI Can Accelerate Understanding and Simulate It">
          <p>AI can search, cluster observations, generate hypotheses, identify missing questions, compare explanations, and propose tests. These are real contributions to understanding.</p>
          <p>It can also generate a polished explanation before the organization has earned the model. Fluency can conceal missing customer contact, weak evidence, or an undefined term. Every important synthesis should therefore expose:</p>
          <ul>
            <li>its source evidence;</li>
            <li>its assumptions;</li>
            <li>plausible competing explanations;</li>
            <li>its confidence and limits; and</li>
            <li>the next observation that would discriminate among alternatives.</li>
          </ul>
          <p>The test of a synthesis is not how confident it sounds. It is whether the underlying model can be examined, challenged, and updated.</p>
        </Section>

        <Section index="14" title="Understanding Is Organizational, Not Merely Individual">
          <p>An insight trapped in one person's head is a throughput constraint. Shared understanding becomes visible through language, models, decisions, tests, interfaces, and repeated behavior.</p>
          <p>The organization needs mechanisms that let teams retrieve why a decision was made, trace concepts to evidence, see where contexts differ, and update the model after outcomes arrive. That is the bridge to <EssayLink slug="the-knowledge-factory">the knowledge factory</EssayLink>: an operating system that turns learning into reusable capability instead of leaving it in conversations, pull requests, and individuals.</p>
        </Section>

        <Section index="15" title="Action Completes the Loop">
          <p>Understanding is demonstrated by better prediction and revision, not by the feeling of clarity. Teams must act at a scale that makes learning affordable, observe the result, and update their shared model.</p>
          <PropositionGraphFigure document={loopGraph} title="The understanding loop" />
          <p>The discipline is to improve the loop's fidelity and speed without allowing speed to erase meaningful context: observe → interpret → frame → propose → test → experience consequences → revise.</p>
        </Section>

        <Section index="16" title="Understanding Is a Skill to Look For">
          <p>As generated output becomes cheaper, the ability to turn it into a grounded, testable model becomes more valuable. Organizations should look for, develop, and reward people who can:</p>
          <ul>
            <li>synthesize across customer, product, engineering, and business evidence;</li>
            <li>teach problem framing and experimental reasoning;</li>
            <li>distribute decisions with clear constraints;</li>
            <li>protect contact between builders and customers;</li>
            <li>make assumptions and disagreement inspectable;</li>
            <li>build durable context rather than presentation theater; and</li>
            <li>recognize when AI-generated coherence has outrun comprehension.</li>
          </ul>
          <p>This capability is not confined to management. It may appear in an engineer who finds the missing constraint, a designer who connects behavior to lived experience, a support specialist who recognizes a recurring causal pattern, or a researcher who distinguishes evidence from a compelling story. Leadership is one place to look for the skill, but the organizational advantage comes from making it common across roles.</p>
        </Section>

        <div className="article-outline__closing">
          <blockquote>In an age of abundant answers, the scarce skill is building enough shared understanding to know what deserves to be solved — and whether an answer survives contact with the world.</blockquote>
          <p>Next in the series — <EssayLink slug="the-knowledge-factory">The Knowledge Factory</EssayLink>, then <EssayLink slug="the-factory-ontology">Factory Ontology</EssayLink> and <EssayLink slug="the-cognitive-factory">Cognitive Factory</EssayLink>.</p>
        </div>
      </div>
    </TooltipProvider>
  );
}
