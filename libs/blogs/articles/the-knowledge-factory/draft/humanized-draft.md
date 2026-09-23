---
title: The Knowledge Factory
description: "Every company has a knowledge factory. The question is whether people merely work inside it or improve the system that turns evidence and intent into reliable outcomes."
publishedAt: 2026-08-22
updatedAt: 2026-09-23
tags: [Artificial Intelligence, Organizations, Strategy, Knowledge Work, Software Systems]
---
# The Knowledge Factory

import { AdversarialDiplomaticFigure, ArrowMarker, Card, CardContent, EXPLICIT_FACTORY_BOXES, FeedbackLoopFigure, Figure, formatDate, Fragment, GLOSSARY, GlossaryCards, HoverCard, HoverCardContent, HoverCardTrigger, IMPLICIT_FACTORY_BOXES, ImplicitVsExplicitFactory, KnowledgeFactoryStack, Link, LinkPreview, OntologyStrategyFigure, participant, PIPELINE_STEPS, ProductPipeline, PropositionGraphFigure, secondBrainGraph, STACK_LAYERS, ToolLauncher, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, WorkerVsFactoryEngineer } from "./article-components"

<Section index="01" title="Overview">
  <P>
    A customer reports a problem. By the time it reaches an engineer, it has become a ticket. The evidence that
    made the problem urgent has been condensed into a few sentences. The tradeoffs have already been chosen.
    The engineer is asked to build the answer, not revisit the question.
  </P>
  <P>
    That path is a factory line, even if nobody calls it one. Its raw materials are observations, customer
    needs, data, expertise, and intent. Along the way they become models, decisions, designs, specifications,
    and code. The finished goods are products, services, and changed conditions in the world.
  </P>
  <P>
    When the factory stays implicit, work collects in hidden queues. Context lives in a few heads. Engineers
    execute fragments, and much of what the company learns disappears after delivery. AI can make that system
    produce more artifacts. It does not automatically make the system wiser.
  </P>
  <P>
    So the important choice is not whether engineers will work in an AI factory. They will. The choice is
    whether they remain workers who receive solution instructions or become{" "}
    <Term definition="a participant who improves the reusable machinery, context, standards, and feedback loops through which many work items pass.">
      factory engineers
    </Term>{" "}
    who improve the machinery itself.
  </P>
</Section>

<Section index="02" title="What the Previous Articles Establish">
  <P>
    This is the fourth essay in the sequence. The first three establish the ground beneath this one:
  </P>
  <ul>
    <li>
      <strong><ArticleLink slug="vision-and-values">Vision and Values</ArticleLink>:</strong>{" "}
      a factory cannot infer what matters from output volume. Opportunity begins with human stakes and an
      accountable choice about the future worth pursuing.
    </li>
    <li>
      <strong><ArticleLink slug="truth-and-inference">Truth and Inference</ArticleLink>:</strong>{" "}
      predictive systems are strongest where language carries stable constraints and feedback. A coherent
      answer is not, by itself, evidence of truth or meaning.
    </li>
    <li>
      <strong><ArticleLink slug="understanding-and-bottlenecks">Understanding and Bottlenecks</ArticleLink>:</strong>{" "}
      the scarce leadership skill is making meaningful context clear enough that more people can solve the
      right problems.
    </li>
  </ul>
  <P>This essay asks the practical next question: what must an organization build once it accepts those claims?</P>
</Section>

<Section index="03" title="Core Thesis">
  <P>
    The AI-era knowledge factory is not a model subscription, and it is not a box of agents. It is the system
    that turns what an organization learns into reusable capital, then puts that capital back into the hands of
    people doing the next piece of work.
  </P>
  <P>
    Its highest-leverage builders are factory engineers. They improve the{" "}
    <Term definition="navigable relationships among people, concepts, systems, evidence, decisions, dependencies, and outcomes, with provenance.">
      context graph
    </Term>
    , domain ontology, workflows, evaluation, observability, and feedback mechanisms that many future
    decisions will pass through. Their unit of work is not just the current output. It is the capability that
    produces the next hundred outputs.
  </P>
  <Card className="essay-card">
    <CardContent>
      <P className="essay-card__claim">
        Learning becomes reusable capital; reusable capital becomes problem-solving capacity.
      </P>
    </CardContent>
  </Card>
</Section>

<Section index="04" title="Key Terms">
  <Asset id="glossary-cards" />
</Section>

<Section index="05" title="1. You Already Have a Factory">
  <P>Pick one ordinary product change and trace its path:</P>
  <P className="article-outline__flow">
    Customer experience → evidence → interpretation → priority → design → implementation → verification →
    release → observed consequence.
  </P>
  <Figure caption="The path of one product change">
    <Asset id="product-pipeline" />
  </Figure>
  <P>
    That is a production system. It has queues, handoffs, specialized stations, quality checks, rework,
    bottlenecks, and feedback. The company&apos;s design determines which facts survive each handoff, who gets to
    question the plan, and where learning goes after release.
  </P>
  <P>
    AI enters this system as it is. It amplifies clear context or vague tickets, shared learning or fragmented
    memory, serious evaluation or cosmetic approval. The factory was always there. AI simply makes its shape
    consequential much faster.
  </P>
</Section>

<Section index="06" title="2. The Implicit Factory Turns People into Workers">
  <P>
    The familiar operating model sounds reasonable. Leaders or product specialists define a solution. Someone
    decomposes it into tickets. Engineers optimize the local implementation. Customer context arrives several
    summaries later. Success is measured by output and schedule, while lessons remain scattered across calls,
    pull requests, and individual memory.
  </P>
  <Figure caption="Two operating models for the same factory">
    <Asset id="implicit-vs-explicit-factory" />
  </Figure>
  <P>
    An implicit factory keeps queues hidden and decisions gated; an explicit factory makes context,
    evaluation, and feedback visible. The implicit model turns many talented engineers into{" "}
    <Term definition="any participant executing a bounded step designed by the larger system — a role, not a judgment about talent or status.">
      factory workers
    </Term>{" "}
    by design. They can improve the code in front of them, but not the problem frame or the system that handed
    it to them.
  </P>
</Section>

<Section index="07" title="3. A Factory Engineer Improves the Line">
  <P>
    A factory engineer does more than complete one unit of work. They improve the capability that produces a
    class of work. You can see the difference in ordinary, concrete changes:
  </P>
  <ul>
    <li>clarifying a domain concept so prompts, schemas, APIs, analytics, and UI use the same distinction;</li>
    <li>turning repeated review judgment into an evaluation suite;</li>
    <li>connecting decisions to source evidence and observed outcomes;</li>
    <li>removing a coordination queue with a safe self-service workflow;</li>
    <li>instrumenting an agent so failures become visible and useful;</li>
    <li>encoding allowed side effects and clear escalation boundaries; and</li>
    <li>letting domain experts change the system without routing every decision through specialists.</li>
  </ul>
  <Figure caption="Completing one unit versus improving the capability that produces many">
    <Asset id="worker-vs-factory-engineer" />
  </Figure>
  <P>
    This work combines domain knowledge, systems thinking, software craft, teaching, and institutional design.
    “Factory engineer” does not need to become a new job title. It names a way of working that can show up in
    product, research, operations, design, engineering, or leadership.
  </P>
</Section>

<Section index="08" title="4. Make Good Judgment Portable">
  <P>
    Imagine two companies with access to the same models. In the first, a small group frames problems and sends
    solutions downstream. AI speeds up task completion, so the gate receives more requests and must review more
    output. The bottleneck does not disappear. It gets busier.
  </P>
  <P>
    In the second company, teams can see customer evidence, domain context, decision boundaries, tools, and
    evaluations. They can frame and test solutions close to the work, then escalate the choices that genuinely
    require broader authority.
  </P>
  <P>
    The second company can explore more opportunities without quietly dropping its standards. That is{" "}
    <Term definition="framing, generating, testing, and revising interventions in response to a meaningful problem.">
      distributed solutioning
    </Term>
    . It is not unbounded autonomy. Context, decision rights, safety constraints, and evaluation are what make
    the distribution responsible.
  </P>
</Section>

<Section index="09" title="5. Fix the Factory Before Asking AI to Scale It">
  <P>
    Here is the awkward part of AI-assisted development: a codebase usually has to become easier to understand
    before AI can improve it reliably. An agent cannot preserve a boundary nobody has named, reconcile
    contracts that disagree, or verify a change when correctness exists only in a reviewer&apos;s memory.
  </P>
  <P>
    Start by making important contracts explicit and machine-readable. Carry a domain distinction through the
    database, API, runtime validation, application types, analytics, and interface. Where one representation can
    reasonably own the truth, generate the downstream artifacts:
  </P>
  <ul>
    <li>a schema can generate types, validators, clients, fixtures, and documentation;</li>
    <li>an API specification can generate request and response types, server stubs, and client libraries;</li>
    <li>a database schema can generate query types, migrations, and policy checks; and</li>
    <li>a design system can generate tokens, components, documentation, and visual references.</li>
  </ul>
  <P>
    The source does not need to be a particular technology. It has to be authoritative enough to own, version,
    validate, and regenerate. Generated artifacts are materialized views of that source, not rival truths that
    people maintain by hand.
  </P>
  <P className="article-outline__flow">
    Authoritative source → generated contracts → runtime validation → end-to-end verification.
  </P>
  <P>
    Types reveal intended relationships to people and tools. Runtime checks protect the places where untyped
    data enters. Tests show whether the parts still compose. Together, they give AI a legible environment in
    which a change can be proposed, checked, and corrected.
  </P>
</Section>

<Section index="10" title="6. Systematize the Whole Chain">
  <P>
    Software is only one station. Design, reporting, user engagement, development, and operations all contain
    repeated decisions that can become shared systems:
  </P>
  <ul>
    <li><strong>design:</strong> shared tokens, components, interaction rules, accessibility checks, and visual regression evidence;</li>
    <li><strong>reports:</strong> governed definitions, datasets, queries, templates, provenance, and scheduled review;</li>
    <li><strong>user engagement:</strong> research repositories, support signals, experiments, consent, segmentation, and feedback loops;</li>
    <li><strong>development:</strong> schemas, types, tests, build pipelines, release controls, observability, and incident learning; and</li>
    <li><strong>operations:</strong> explicit workflows, ownership, service levels, escalation paths, and outcome measures.</li>
  </ul>
  <Quote>
    <strong>Systematize everything that repeats.</strong> This does not mean automate every decision.
  </Quote>
  <P>
    A good system can end in a human judgment. Its job is to make the inputs, constraints, choice, and
    consequences available to the people making the next one.
  </P>
</Section>

<Section index="11" title="7. The Knowledge-Factory Stack">
  <P>
    The stack below is an inventory, not a mandatory vendor architecture. It names eight reusable layers a
    working factory needs:
  </P>
  <Figure caption="Eight reusable layers, from observation through learning">
    <Asset id="knowledge-factory-stack" />
  </Figure>
  <P>
    AI-assisted mathematics gives us a compact example. A problem statement and research literature supply
    context. An orchestrator and specialized agents generate conjectures, lemmas, counterexamples, scripts, and
    proofs. Tests or proof assistants reject invalid candidates. Provenance records which tools and assumptions
    produced the survivors. Mathematicians still decide whether the formalization is faithful, the result is
    significant, and the direction is worth pursuing.
  </P>
  <P>
    The factory can process far more intermediate work than a person could read line by line. That becomes
    useful search only when mechanical verification is trustworthy and people continue to govern meaning,
    standards, attribution, and direction.
  </P>
</Section>

<Section index="12" title="8. Human Direction Sets the Boundary">
  <P>
    A factory can retrieve evidence, generate options, expose inconsistencies, and simulate reactions. It
    cannot decide which future an organization should try to create, or whose outcome should count. When
    evidence narrows a choice without determining it, a person must make the wager and remain accountable for
    what follows.
  </P>
  <P>
    The answer is not to hide judgment behind automation. Make it inspectable. For every consequential choice,
    retain:
  </P>
  <ul>
    <li>the desired change and the people whose experience defines its stakes;</li>
    <li>supporting and contradictory evidence;</li>
    <li>assumptions, uncertainty, and rejected alternatives;</li>
    <li>owners, decision rights, and escalation boundaries;</li>
    <li>predicted outcomes and disconfirming signals; and</li>
    <li>the revision made after consequences arrive.</li>
  </ul>
  <Quote><strong>Systematize the feedback. Do not automate away the judgment.</strong></Quote>
</Section>

<Section index="13" title="9. Retain Learning, Not Just Outputs">
  <P>The factory compounds only when completed work changes the context available to the next decision:</P>
  <P className="article-outline__flow">Evidence → interpretation → choice → action → outcome → revised context.</P>
  <Figure caption="Work becomes reusable when outcomes revise the next decision's context.">
    <Asset id="feedback-loop-figure" />
  </Figure>
  <P>
    Organizational memory is more than a warehouse of notes. It connects claims to evidence, decisions to
    owners, experiments to predictions, and outcomes to revisions. Search can retrieve a document. Maintained
    graph context can reconstruct why a decision made sense, what depended on it, and what should change now.
  </P>
  <P>A useful memory lets a team ask:</P>
  <ul>
    <li>Why did we believe this condition mattered?</li>
    <li>Which observations support or contradict that belief?</li>
    <li>Which decisions and systems depend on it?</li>
    <li>What outcome did we predict?</li>
    <li>What evidence would cause us to stop or revise?</li>
    <li>What did the last attempt teach us?</li>
  </ul>
  <Figure caption="Organizational memory connects evidence, decisions, actors, experiments, metrics, and outcomes.">
    <PropositionGraphFigure document={secondBrainGraph} title="The organizational memory graph" />
  </Figure>
  <P>
    You can explore this shape as an interactive graph —{" "}
    <ToolLauncher toolId="relationship-graph" href="/relationship-graph" label="Explore the relationship graph" />{" "}
    — or open the full <BlogLink href="/relationship-graph">relationship graph editor</BlogLink> on its own route.
  </P>
</Section>

<Section index="14" title="10. Start with One Broken Handoff">
  <P>
    Do not begin with a company-wide AI program. Start with one workflow where context keeps disappearing or
    judgment is trapped in a review queue:
  </P>
  <ol>
    <li>Trace the path from customer experience to observed consequence.</li>
    <li>Expose the evidence and decisions hidden at each handoff.</li>
    <li>Name the distinctions and invariants that must remain stable.</li>
    <li>Turn repeated judgment into tools, workflows, tests, and escalation rules.</li>
    <li>Give teams authority to frame and test solutions inside those boundaries.</li>
    <li>Instrument outcomes and connect them back to the original decision.</li>
    <li>Promote validated learning into shared context for the next cycle.</li>
  </ol>
  <P>
    The goal is not maximum automation. It is a system where more people can exercise sound judgment, more
    experiments can run responsibly, and every consequence has a path back into organizational memory.
  </P>
</Section>

<Section index="15" title="11. What Actually Compounds">
  <P>
    Durable advantage is the residue of this learning system. Proprietary data, domain knowledge, ontology,
    tools, relationships, infrastructure, and network effects become defensible when they operate as one
    connected system that creates customer value and improves through use. Owning the parts is not the moat.
    Compounding them is.
  </P>
</Section>

<Section index="16" title="12. Ontology Makes It Coherent; Cognition Makes It Learn">
  <P>
    Two companion disciplines complete the operating model. The{" "}
    <ArticleLink slug="the-ontology-factory">Ontology Factory</ArticleLink> makes ownership, vocabulary,
    relationships, constraints, and evidence rules explicit enough to check. The{" "}
    <ArticleLink slug="the-cognitive-factory">Cognitive Factory</ArticleLink> connects graph context,
    executable context, evaluation, and feedback so outcomes improve the next work.
  </P>
  <P>
    Ontology gives the factory a stable world to reason about. Cognition lets it act in that world and revise
    its model. Human direction decides which changes are worth pursuing.
  </P>
</Section>

<div className="essay-closing">
  <blockquote>
    The companies that win will not be the ones that turn the most engineers into faster workers. They will be
    the ones that let teams see the whole line, learn from its consequences, and improve the factory itself.
  </blockquote>
</div>

<Section index="17" title="Sources">
  <ul>
    <li>DORA, Google, <ExternalLink href="https://research.google/pubs/dora-2025-state-of-ai-assisted-software-development-report/"><em>2025 State of AI-assisted Software Development Report</em></ExternalLink>. Supports the premise that AI adoption is a systems problem that can amplify existing organizational strengths and weaknesses.</li>
    <li>Ikujiro Nonaka, <ExternalLink href="https://doi.org/10.1287/orsc.5.1.14">“A Dynamic Theory of Organizational Knowledge Creation”</ExternalLink> (1994). Develops the account of organizational knowledge as a continuously created and shared capability.</li>
    <li>James G. March, <ExternalLink href="https://doi.org/10.1287/orsc.2.1.71">“Exploration and Exploitation in Organizational Learning”</ExternalLink> (1991). Establishes the tension between searching for new possibilities and refining established capabilities.</li>
    <li>Karl E. Weick, Kathleen M. Sutcliffe, and David Obstfeld, <ExternalLink href="https://doi.org/10.1287/orsc.1050.0133">“Organizing and the Process of Sensemaking”</ExternalLink> (2005). Grounds the treatment of organizations as systems that interpret equivocal evidence and act from provisional models.</li>
    <li>James P. Walsh and Gerardo Rivera Ungson, <ExternalLink href="https://doi.org/10.5465/AMR.1991.4278992">“Organizational Memory”</ExternalLink> (1991). Supports the acquisition, retention, retrieval, use, and possible misuse of organizational memory.</li>
    <li>Michael E. Porter, <ExternalLink href="https://hbr.org/1996/11/what-is-strategy">“What Is Strategy?”</ExternalLink> (1996). Frames strategy as a coherent system of choices and activities rather than a list of operational improvements.</li>
    <li>ISO, <ExternalLink href="https://www.iso.org/standard/77520.html"><em>ISO 9241-210:2019 — Human-centred design for interactive systems</em></ExternalLink>. Grounds sustained attention to users, their needs, and human-system consequences throughout design.</li>
    <li>National Institute of Standards and Technology, <ExternalLink href="https://doi.org/10.6028/NIST.AI.100-1"><em>Artificial Intelligence Risk Management Framework (AI RMF 1.0)</em></ExternalLink> (2023). Provides continuous governance, context mapping, measurement, evaluation, and accountability practices for deployed AI systems.</li>
  </ul>
</Section>
