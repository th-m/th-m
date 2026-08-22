import { Fragment } from "react";
import type { PublishedPost } from "@th-m/blogs/publish";

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

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <h3>{title}</h3>
      {children}
    </>
  );
}

function Quote({ children }: { children: React.ReactNode }) {
  return <blockquote><p>{children}</p></blockquote>;
}

function Flow({ children }: { children: React.ReactNode }) {
  return <p className="article-outline__flow">{children}</p>;
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

export default function ArticlePage({ post }: { post: PublishedPost }) {
  return (
    <div className="article-outline">
      <header className="article-outline__header">
        <p className="eyebrow">Essay outline</p>
        <h1>{post.title}</h1>
        <p className="article-description">{post.description}</p>
        <p className="article-outline__status"><strong>Editorial status —</strong> This is the bridge from the first three essays into the "Factory" essays. It describes the organizational landscape, introduces factory engineering for knowledge work, and inventories the context, evaluation, and feedback tools the new operating model requires.</p>
      </header>

      <Section index="01" title="Overview">
        <p>Every company is building a factory, either explicitly or implicitly. Its raw materials are observations, customer needs, data, expertise, and intent. Its intermediate goods are models, decisions, designs, specifications, and code. Its outputs are products, services, and changed conditions in the world.</p>
        <p>When that factory is implicit, work moves through hidden queues. Context lives in a few people, decisions arrive as tickets, engineers execute fragments, and learning disappears after delivery. AI can make this factory produce more artifacts without making it more intelligent.</p>
        <p>Many engineers will work inside these factories. The decisive organizational choice is whether they are treated primarily as workers who receive solution instructions or as <strong>factory engineers</strong> who improve the system that turns evidence and intent into reliable outcomes.</p>
        <p>Companies that distribute solutioning — while supplying clear context, semantic boundaries, evaluation, and accountability — should gain a disproportionate advantage over companies where problem framing and meaningful decisions remain gated above the people doing the work.</p>
      </Section>

      <Section index="02" title="Core Thesis">
        <p>The AI-era knowledge factory is not a model subscription or a collection of agents. It is an organizational system that turns learning into reusable capital and gives that capital back to teams as greater problem-solving capacity.</p>
        <p>Its highest-leverage builders are factory engineers: people who can improve the context graph, domain ontology, workflows, evaluation, observability, and feedback mechanisms through which many future decisions and implementations will pass.</p>
      </Section>

      <Section index="03" title="What the Previous Articles Establish">
        <p>The opening should explicitly state that the earlier essays describe the landscape, the problem, and the opportunity:</p>
        <ol>
          <li><strong>Solutions, Meaning, and Value:</strong> the factory cannot derive its own definition of value from output volume; opportunities remain grounded in human stakes and accountable choices.</li>
          <li><strong>Truth, Entropy, and Inference:</strong> predictive systems are strongest where language carries stable constraints and feedback; coherence alone is not evidence of correctness or meaning.</li>
          <li><strong>Understanding Is the Bottleneck:</strong> the scarce leadership capability is distilling meaningful context and multiplying a team's capacity to solve problems.</li>
        </ol>
        <p>This article asks what an organization must build once it accepts those three claims.</p>
      </Section>

      <Section index="04" title="Intended Reader">
        <p>Engineering and product leaders, platform teams, staff-plus engineers, founders, and knowledge-management practitioners deciding how AI should change an organization's architecture and division of work.</p>
      </Section>

      <Section index="05" title="Key Terms">
        <Terms items={[
          ["Knowledge factory", "the socio-technical system that transforms evidence, expertise, and intent into decisions and product outcomes."],
          ["Factory worker", "any participant executing a bounded step designed by the larger system. This is a role, not a judgment about talent or status."],
          ["Factory engineer", "a participant who improves the reusable machinery, context, standards, and feedback loops through which many work items pass."],
          ["Shared capital", "reusable organizational assets — ontologies, context graphs, tools, evaluations, workflows, infrastructure, and accumulated learning — that increase future capability."],
          ["Solutioning", "framing, generating, testing, and revising interventions in response to a meaningful problem."],
        ]} />
      </Section>

      <Section index="06" title="Editorial Guardrails">
        <ul>
          <li>Do not reduce people to interchangeable factory inputs. The analogy describes repeatable systems, capital, queues, quality, and feedback.</li>
          <li>Do not imply every engineer must become a platform engineer. Factory engineering occurs in product, domain, research, operations, design, and leadership work.</li>
          <li>Do not make distributed solutioning mean unbounded autonomy. Context, decision rights, safety constraints, and evaluation make distribution viable.</li>
          <li>Do not claim AI makes implementation effortless. Verification, integration, operations, security, and maintenance remain material work.</li>
          <li>Distinguish purchased model capability from organizational capital the company owns or can reliably carry between vendors.</li>
        </ul>
      </Section>

      <Section index="07" title="Section Notes">
        <Sub title="1. Every Company Already Has a Factory">
          <p>Open by tracing one ordinary product change:</p>
          <Quote>Customer experience → evidence → interpretation → priority → design → implementation → verification → release → observed consequence.</Quote>
          <p>Whether or not the company names it, this is a production system. It has queues, handoffs, specialized stations, quality checks, rework, bottlenecks, and feedback. Organizational design determines which information survives each handoff and who is allowed to alter the plan.</p>
          <p>AI enters this existing system. It amplifies whatever is already there: clear context or vague tickets, shared learning or fragmented memory, good evaluation or cosmetic acceptance.</p>
        </Sub>

        <Sub title="2. The Implicit Factory Creates Factory Workers">
          <p>Describe the common operating model:</p>
          <ul>
            <li>leaders or product specialists define the solution;</li>
            <li>work is decomposed into tickets;</li>
            <li>engineers optimize local implementation;</li>
            <li>customer context is summarized several handoffs away;</li>
            <li>success is measured through output and schedule; and</li>
            <li>lessons remain in conversations, pull requests, or individuals.</li>
          </ul>
          <p>This model makes many engineers factory workers by design. Even highly capable people are prevented from improving the problem frame or production system when solutioning is gated elsewhere.</p>
        </Sub>

        <Sub title="3. The Factory Engineer">
          <p>A factory engineer improves more than one output. They improve the capability that produces a class of outputs.</p>
          <p>Examples:</p>
          <ul>
            <li>clarifying a domain concept so prompts, schemas, APIs, analytics, and UI use the same distinction;</li>
            <li>turning recurring review judgment into an evaluation suite;</li>
            <li>connecting decisions to source evidence and observed outcomes;</li>
            <li>removing a coordination queue through a safe self-service workflow;</li>
            <li>instrumenting an agent so failures become visible and learnable;</li>
            <li>encoding allowed side effects and escalation boundaries; and</li>
            <li>creating tools that let domain experts alter the system without routing every change through specialists.</li>
          </ul>
          <p>The role combines domain understanding, systems thinking, software craft, teaching, and institutional design.</p>
        </Sub>

        <Sub title="4. Distributed Solutioning Is the Advantage">
          <p>Compare two organizations with access to similar models.</p>
          <p>In the gated organization, a small group frames problems and sends solutions downstream. AI accelerates task completion, so the gate receives more requests and reviews more output.</p>
          <p>In the distributed organization, teams receive customer evidence, domain context, decision boundaries, tools, and evaluations. They can frame and test solutions locally, escalating choices that truly require broader authority.</p>
          <p>The second organization can explore more opportunities without lowering its standards because it invests in the infrastructure that makes judgment portable.</p>
        </Sub>

        <Sub title="5. The New Knowledge-Factory Stack">
          <p>Introduce the reusable layers without pretending they form one mandatory vendor architecture:</p>
          <ol>
            <li><strong>Observation and intake:</strong> customer evidence, operational telemetry, research, support, and market signals.</li>
            <li><strong>Graph context exploration:</strong> navigable relationships among people, concepts, systems, evidence, decisions, dependencies, and outcomes.</li>
            <li><strong>Ontology and semantic boundaries:</strong> stable terms, entity relationships, invariants, permissions, and evidence rules within bounded contexts.</li>
            <li><strong>Context assembly:</strong> retrieval and packaging of the smallest relevant context for a person, model, or workflow.</li>
            <li><strong>Workflows and agents:</strong> repeatable transformations with explicit inputs, outputs, tools, and escalation rules.</li>
            <li><strong>Evaluation:</strong> deterministic tests, rubrics, simulations, expert review, and customer outcome checks.</li>
            <li><strong>Observability and provenance:</strong> what ran, which evidence was used, which model or person decided, and where uncertainty entered.</li>
            <li><strong>Feedback and learning:</strong> outcomes update decisions, ontologies, examples, evaluations, and future context.</li>
          </ol>
          <p>AI-assisted mathematics provides a compact example of the whole stack. A problem statement and the research literature supply context; an orchestrator and specialized agents generate conjectures, lemmas, counterexamples, scripts, and proofs; tests or proof assistants reject invalid candidates; provenance records which tools and assumptions produced the survivors; and mathematicians evaluate whether the formalization is faithful, the result is significant, and the research direction is worth pursuing. The factory may process far more intermediate work than any human reads line by line. That can increase useful search only when mechanical verification is trustworthy and people continue to govern meaning, standards, attribution, and direction.</p>
        </Sub>

        <Sub title="6. The Cognitive Light Cone Scorecard">
          <p>Use the cognitive light cone as a diagnostic for how much of the relevant domain a system can observe, interpret, affect, and learn from:</p>
          <ul>
            <li><strong>LLM:</strong> works from supplied context without its own harness. Humans select the evidence, state the goal, and evaluate the response.</li>
            <li><strong>Agent:</strong> combines an LLM with tools, memory, and bounded workflows. Humans establish its objective, permissions, evaluation, and escalation boundaries.</li>
            <li><strong>Knowledge factory:</strong> connects agents to organizational data, context stores, operational signals, evaluations, and feedback loops. Humans systematize the inputs, govern how evidence is interpreted, and remain accountable for the values and decisions propagated through the system.</li>
          </ul>
          <p>Score each system across decision-relevant observability, semantic context, evaluation, feedback, reversibility, authority, and accountability. Expanding a system's cognitive light cone increases what it can coordinate; it does not by itself authorize the governing values it applies.</p>
        </Sub>

        <Sub title="7. Graph Context Exploration">
          <p>Make this a signature concept rather than a generic knowledge graph pitch.</p>
          <p>Most organizational search treats context as documents containing matching words. Graph context exploration asks relational questions:</p>
          <ul>
            <li>Which customer evidence motivated this capability?</li>
            <li>Which definition of <code>conversation</code> applies in this service?</li>
            <li>What decisions depend on this assumption?</li>
            <li>Which failures caused this evaluation to exist?</li>
            <li>Which teams, systems, and metrics will a change affect?</li>
            <li>Where does the current model conflict with observed behavior?</li>
          </ul>
          <p>The graph may be implemented through links, metadata, schemas, code dependencies, event lineage, or a graph database. The product requirement is traversable relationships with provenance, not a particular storage engine.</p>
        </Sub>

        <Sub title="8. From Documents to Executable Context">
          <p>Documents remain important, but the factory needs context that can guide and check action:</p>
          <ul>
            <li>a definition becomes a schema or validation rule;</li>
            <li>an architectural judgment becomes a dependency boundary;</li>
            <li>a customer promise becomes an evaluation;</li>
            <li>an exception becomes an escalation path;</li>
            <li>an observed failure becomes a regression case; and</li>
            <li>a decision becomes a traceable link between evidence and outcome.</li>
          </ul>
          <p>This is how institutional knowledge becomes productive capital rather than a larger pile of prose.</p>
        </Sub>

        <Sub title="9. The Compounding Loop">
          <p>Use the loop:</p>
          <Quote>Work produces outcomes → outcomes produce evidence → evidence updates context and evaluation → better context improves the next work.</Quote>
          <p>The loop compounds only when the organization captures corrections. More AI output without retained learning is throughput, not a knowledge factory.</p>
        </Sub>

        <Sub title="10. What Companies Should Build First">
          <p>Offer a diagnostic order:</p>
          <ol>
            <li>Identify the decisions or workflows with repeated context loss and review burden.</li>
            <li>Expose the customer and operational evidence behind them.</li>
            <li>Name the domain distinctions and invariants required for safe delegation.</li>
            <li>Build evaluation before scaling generation.</li>
            <li>Instrument outcomes and connect them back to decisions.</li>
            <li>Give teams authority inside the new boundaries.</li>
            <li>Measure whether capability, learning speed, and customer outcomes improve — not only whether token or labor costs fall.</li>
          </ol>
        </Sub>

        <Sub title="11. The Two Factory Disciplines">
          <p>Close by introducing the follow-on essays:</p>
          <ul>
            <li><strong>The Factory — Ontology</strong> asks how humans map the domain so models and teams share the right entities, relationships, constraints, and evidence.</li>
            <li><strong>The Factory — Strategy</strong> asks how humans choose direction through narrative, empathy, opportunism, memory, and systematic feedback.</li>
          </ul>
          <p>Ontology makes the factory coherent. Strategy makes it purposeful.</p>
        </Sub>
      </Section>

      <Section index="08" title="Visual Notes">
        <ol>
          <li><strong>Implicit versus explicit factory:</strong> hidden handoffs and gates contrasted with visible context, evaluation, and feedback.</li>
          <li><strong>Worker versus factory engineer:</strong> completing one unit of work versus improving the capability that produces many units.</li>
          <li><strong>Knowledge-factory stack:</strong> the eight layers from observation through learning.</li>
          <li><strong>Cognitive light cone scorecard:</strong> compare the observable context, evaluation, feedback, and authority available to an LLM, an agent, and a knowledge factory.</li>
          <li><strong>Graph context exploration:</strong> a decision linked to evidence, concepts, systems, evaluations, owners, and outcomes.</li>
        </ol>
      </Section>

      <div className="article-outline__closing">
        <blockquote>The companies that win will not be the ones that turn the most engineers into faster workers. They will be the ones that give engineers the context, authority, and tools to redesign the factory itself.</blockquote>
        <p>Candidate closing line</p>
      </div>
    </div>
  );
}
