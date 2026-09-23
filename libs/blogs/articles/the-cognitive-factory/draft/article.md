# Cognitive Factory

A product metric crosses a threshold. An agent traces the change to a recent
release, edits the code, runs the tests, and deploys the fix. The customer
journey recovers before anyone opens a dashboard.

That is the tempting version of an autonomous AI factory. It is also a sentence
that hides nearly every consequential decision.

The metric does not establish a cause. A plausible diagnosis does not authorize
an action. A passing test does not prove that the change will produce the
intended customer effect. A completed run does not teach the next run unless
the system retains what happened and changes how later work is interpreted or
evaluated.

Removing a person from the interface does not remove judgment. It redistributes
observation, selection, authorization, verification, correction, and memory
across the system surrounding the model. If those functions remain implicit,
the organization has accelerated activity. It has not built reliable
automation.

A cognitive factory is a proposed operating model for making those functions
explicit. It turns operational signals into typed observations, opens
testable hypotheses, routes bounded decisions through inspectable agent graphs,
verifies the resulting action, observes its consequences, and carries those
consequences into the next cycle:

> signal → typed observation → hypothesis → bounded decision → agent graph →
> reviewable action → evaluated consequence → retained learning

The sequence joins the other five essays in the AI Factory series. Vision
chooses a direction. Truth supplies practices for testing claims.
Understanding places judgment near the work. The knowledge factory organizes
production, and ontology supplies the shared map. The cognitive factory puts
those parts into motion without granting a model unbounded authority.

This is an architectural proposal, not evidence that the full system already
exists or outperforms a human-led workflow. The tools and research cited here
support parts of the loop. Their composition into a governed cognitive factory
is the argument of this essay.

## 1. Sense: Signals Must Become Typed Observations

Imagine that a release goes live on Tuesday afternoon. Soon afterward,
PostHog reports a meaningful drop in a customer journey. Sentry reports a
correlated increase in application errors. Runtime telemetry shows that the
affected service was under unusual pressure during the same window.

The three signals make the incident worth investigating. They do not explain
it.

Each sensor sees the system through a different instrument. Product analytics
can show that people stopped completing a journey. Application telemetry can
show that a new error appeared after a release. Infrastructure monitoring can
show that a threshold was crossed. None of those observations independently
knows whether the release caused the behavior, whether the behavior is
undesirable, or whether changing code is the right response.

The factory's first job is therefore translation. It must turn heterogeneous
signals into a typed observation that later work can inspect. A useful
observation records:

- the source, time window, and provenance of the evidence;
- the affected service, customer journey, release, and bounded context;
- the observed change, baseline, severity, and confidence;
- corroborating and contradicting signals;
- the owner, permitted next steps, and expiry or re-evaluation conditions; and
- links to the underlying evidence, not only an alert title or generated
  summary.

The ontology from the previous essay becomes operational here. A field such as
`conversation`, `release`, or `customer journey` must resolve to the definition
that controls this decision. The ontology supplies the distinctions. The event
contract uses them.

That contract does not make the observation true in some absolute sense. It
makes the claim bounded and reviewable. A later actor can see what changed,
where the evidence came from, what the observation excludes, and what the
system is allowed to do next.

Normalization turns an alert into a legible claim. It does not turn correlation
into cause.

## 2. Hypothesize: A Trigger Opens an Investigation

The typed observation should open a hypothesis, not declare a diagnosis.

For the release incident, at least three explanations remain live:

1. The release introduced a code regression that broke the journey.
2. The release implemented the intended behavior but created an unexpected
   product tradeoff.
3. The timing is coincidental, and the observed change is noise or the result
   of another event.

A system that jumps directly from the alert to the first explanation may still
produce a convincing patch. Its fluency does not reduce the uncertainty it
discarded.

The hypothesis record should preserve that uncertainty in a form the next
decision can use. It names the proposed explanation, its scope, supporting and
contradicting evidence, plausible alternatives, and the next observation that
would distinguish among them. It also records confidence, the conditions that
should lower it, and the typed observations that opened the investigation.

Three truth practices from the earlier series now become operating gates.
**Coherence** asks whether an explanation fits what the system already claims
about itself. **Correspondence** asks whether the explanation matches
independent evidence. **Consequence** comes later: after an authorized action,
did the system change in the way the hypothesis predicted?

These gates do not collapse truth into one score. They force the factory to ask
different questions at the moments when each question can be answered.

> **Motif — A trigger opens hypotheses, not a diagnosis.** One typed
> observation branches into several live explanations. Coherence and
> correspondence test the candidates. Consequence remains visibly deferred
> because no action has yet been authorized.

Preserving alternatives is the factory's first cognitive act. The goal is not
to delay action indefinitely. It is to make the uncertainty available to the
policy that decides what kind of action is justified.

## 3. Decide: Judgment Is Bounded; Authority Stays Explicit

Evidence can narrow the field without determining what the system may do.
Someone—or some explicit policy—still has to connect a judgment to authority.

The decision layer should choose among a finite set of actions such as:

- investigate;
- run a reversible experiment;
- prepare a reviewable change;
- request human approval;
- abstain; or
- escalate.

The factory should use the least powerful mechanism that fits the question.
Exact conditions and hard constraints belong in deterministic policy. Ambiguous
but bounded classification can use a typed or scored model judgment. Contested
goals, material tradeoffs, novel exceptions, and consequences outside the
automation's mandate remain with human authority.

A typed decision primitive such as Jev is useful as an illustration. The model
might select from a software-defined set of choices or return scores that the
surrounding program can inspect. The program still owns the choices,
thresholds, permissions, escalation rules, and side effects. Typed output makes
a judgment composable. It does not make the judgment correct or calibrated.

This distinction matters because the sentence “the model decided” combines two
different events. A model produced a judgment. A system authorized an action.
When those events are separated, the factory can increase autonomy while
keeping authority legible.

For the release incident, the available evidence may authorize an investigation
and a proposed change while withholding deployment. Another workflow with a
reversible action, strong evaluation, and a proven rollback path might permit
more. The mandate belongs to the configured system, not to the model in the
abstract.

A bounded decision authorizes a kind of work. It should not open an unbounded
agent session.

## 4. Execute: Agent Graphs Make Work Inspectable

The execution layer represents authorized work as a directed graph of scoped
tasks. Each node names its inputs, retrieved context, expected outputs, tools,
permissions, side effects, acceptance checks, dependencies, and stop
conditions. The graph also names who owns integration and which person or
policy can advance the result.

That structure matters even when one model performs several of the tasks. An
opaque run can hide where evidence entered, where a guess became a plan, and
where a side effect became possible. A graph gives each transition an owner and
a reviewable boundary.

Two kinds of context constrain the work.

**Graph context** exposes traversable, provenance-bearing relationships among
the hypothesis, evidence, definitions, owners, systems, evaluations, prior
decisions, actions, and outcomes. Instead of searching for documents that
contain the same words, the factory can ask relational questions:

- Which customer evidence motivated this capability?
- Which definition of `conversation` applies in this service?
- Which decisions depend on this assumption?
- Which failure caused this evaluation to exist?
- Which teams, systems, and metrics will a change affect?
- Where does the current model conflict with observed behavior?

The relationships can live in links, metadata, schemas, code dependencies,
event lineage, or a graph database. The requirement is not a particular storage
engine. It is the ability to trace which evidence and definition support which
decision, then follow the resulting outcome back to the claim it revises.

**Executable context** turns those relationships into constraints on action. A
definition becomes a schema. An ownership boundary becomes an escalation path.
A customer promise becomes an evaluation. An observed failure becomes a
regression case. A permitted relationship becomes a dependency rule. A
rollback requirement becomes a release gate.

Documents remain valuable because they preserve explanation. Executable
context makes that explanation consequential. It lets the factory test whether
an action respects the distinctions and promises the organization says matter.

For the release incident, an execution graph might contain separate nodes to:

1. reproduce the customer-journey failure against the affected release;
2. retrieve the owning component, recent changes, runbook, and relevant domain
   definitions;
3. compare the three hypotheses with the available evidence;
4. prepare a bounded patch or experiment;
5. run regression, policy, and product evaluations;
6. assemble a reviewable branch or pull request; and
7. route the artifact to the authority that can approve, reject, or revise it.

Each node should also define retry, rollback, abstention, and cessation. If the
evidence packet is incomplete, the graph asks for evidence. If the hypotheses
remain indistinguishable, the graph abstains or escalates. If tests pass but the
change violates a policy boundary, the graph stops.

Research such as ReAct shows the value of interleaving model reasoning, tool
action, environmental observation, and plan updates in bounded tasks. It does
not validate this organizational graph or its permission model. Those are
design choices the factory must make explicit.

The graph—not the model call—is the durable unit of automation. It preserves
where judgment entered, which authority permitted the next step, and who owns
the assembled result.

## 5. Evaluate: Close One Signal-to-Outcome Loop

An inspectable graph can produce a verified artifact. That is still only
activity. The factory has to compare the result with the consequence the
decision predicted.

The running example now becomes one complete proposed loop:

1. PostHog observes a meaningful change in a customer journey. Sentry and
   runtime telemetry provide potentially related operational evidence.
2. The event contract records the sources, window, affected journey, release,
   provenance, confidence, and permitted next steps.
3. The trigger opens competing hypotheses and names the evidence that would
   distinguish them.
4. Rules and bounded judgments select investigate, experiment, prepare a
   change, request review, abstain, or escalate.
5. A work record links the hypothesis, owner, decision state, and evidence.
6. The agent graph retrieves ownership, recent changes, runbooks, domain
   definitions, and relevant customer context, then produces a reviewable
   artifact.
7. Tests, evaluations, policy checks, and the appropriate human authority
   decide whether that artifact may advance.
8. After release, product and operational telemetry test the predicted effect.
9. The observed consequence confirms, narrows, or rejects the hypothesis and
   updates the relevant event contract, evaluation, ontology, or procedure.

Verification before release and evaluation after release answer different
questions. Verification asks whether the artifact satisfies the checks we knew
to run. Evaluation asks whether the action produced the intended effect in the
world the system was built to change.

A passing test can coexist with a worse customer journey. A recovered funnel
can coexist with higher operational cost. A local improvement can violate a
product goal or shift harm into another part of the system. The consequence
gate therefore needs the intended effect, observation window, acceptable
tradeoffs, and authority for interpreting the result.

The label “self-driving” should describe a governed cycle operating within an
explicit mandate. It should not be shorthand for an alert deploying code
unattended. The individual tools in this example document useful sensing,
analysis, and work mechanisms. No cited source demonstrates the complete
autonomous path described here.

One successful cycle is still not compounding learning. The factory earns that
description only when the consequence changes what later work can observe,
decide, or verify.

## 6. Learn: Retained Consequences, Not Activity, Compound

The factory's most compact loop is also its most demanding:

> work produces outcomes → outcomes produce evidence → evidence updates context
> and evaluation → better context can improve the next work

The word **can** carries the argument. A feedback loop compounds only when the
system retains the original hypothesis, the evidence and authority behind the
decision, the intended effect, the actual outcome, the correction, and the
context or evaluation that changed.

Without that return path, the organization may complete more tickets, merge
more code, call more tools, or generate more tokens. None of those measures
establish that it learned. Activity becomes learning when an observed
consequence changes the system used for later work.

For the release incident, the retained result might add a regression case,
narrow a domain definition, correct an ownership edge, change a release gate,
revise the signal threshold, or record that the original hypothesis failed.
The useful asset is not only the patch. It is the structured comparison between
what the factory expected and what happened.

Reflexion offers bounded evidence that retained task feedback can improve later
agent trials. It does not prove that an organization will compound knowledge by
installing memory around an agent. Organizational learning also depends on what
the system records, which corrections become authoritative, whether later work
retrieves them, and who remains accountable for revision.

> **Motif — Consequence must return before activity becomes learning.** Two
> lanes contain the same context, automation, and consequence. The first ends
> after the outcome. The second carries a typed **revises** relationship back to
> context. That return edge is the difference between completed activity and
> retained learning.

The factory should measure the result at the level where learning is supposed
to occur:

- capability and time to a verified outcome;
- evaluation and rework cost;
- learning speed and recurrence of known failures;
- customer and operational outcomes; and
- the range of decisions teams can make safely within their mandate.

These measures resist a common substitution. Lower token cost is not better
judgment. Faster generation is not a better outcome. More autonomous action is
not legitimate authority.

### The Cognitive Light Cone as a Workflow Diagnostic

Michael Levin uses the cognitive light cone to describe the spatiotemporal
scope and complexity of goals a system can pursue. The cognitive factory can
adapt the metaphor as a qualitative diagnostic for one configured workflow:

- **Observe:** Which relevant evidence can the workflow sense, and with what
  provenance?
- **Interpret:** Which definitions, relationships, and alternatives can it use
  to make the evidence meaningful?
- **Affect:** Which bounded parts of the system can it change, through which
  permissions and reversible actions?
- **Learn:** Which outcomes can it retain, and what later context or evaluation
  can those outcomes revise?

The score describes the workflow, not an intrinsic rank of a model, agent,
organization, or mind. A bare model call may interpret a supplied evidence
packet well while observing nothing beyond it. An agent may use tools and
memory while remaining unable to evaluate the consequences of its actions. A
larger factory may connect more of the domain while still retaining the wrong
signals or acting under a poorly specified goal.

Capability and governance belong in separate columns. Reversibility,
authority, accountability, escalation, and accepted tradeoffs determine
whether a wider reach is legitimate. Increased reach does not authorize the
values applied through it.

The destination is therefore not maximal independent action. It is a wider but
bounded capacity to observe, interpret, act, inspect consequences, revise the
system, and keep people accountable for its goals and authority.

## 7. Build the Feedback Chain in Dependency Order

A team does not need to build the entire factory at once. It can assemble one
consequential feedback chain in the order that each control requires.

1. **Choose one workflow and name the outcome.** Start with repeated context
   loss, review burden, or a known operational failure. Define whose outcome
   matters and how the team will observe it.
2. **Expose the evidence.** Connect the relevant customer and operational
   signals with source, time window, provenance, and ownership.
3. **Resolve the distinctions.** Define the entities, relationships,
   permissions, and boundaries needed to interpret the evidence.
4. **Normalize observations and hypotheses.** Make uncertainty explicit before
   generation or action begins.
5. **Define the decision set.** Specify act, review, abstain, and escalation
   paths before a model is allowed to choose among them.
6. **Build evaluation and rollback first.** Establish how the artifact and its
   consequence will be checked, and how the system can recover, before
   expanding authority.
7. **Represent the work as a graph.** Name dependencies, side effects,
   integration ownership, evidence retention, and the authority at each gate.
8. **Return the consequence.** Update the relevant context, evaluation,
   ontology, or procedure when the outcome differs from the expectation.
9. **Expand only from evidence.** Widen the mandate when measured outcomes
   justify the next boundary, not merely when the model appears capable.

This build order follows the argument. Evidence makes a signal inspectable.
Ontology makes it interpretable. Policy makes a judgment actionable. The graph
makes the work governable. Evaluation makes the consequence visible. Retention
makes the next cycle different.

The six essays now form one operating system. Vision chooses the direction.
Truth tests the claims. Understanding places judgment where the work happens.
The knowledge factory organizes production, and ontology supplies the map. The
cognitive factory closes the loop.

## The AI Factory Series

1. *Vision and Values*
2. *Truth and Inference*
3. *Understanding and Bottlenecks*
4. *The Knowledge Factory*
5. *The Ontology Factory*
6. **The Cognitive Factory**

## Sources

- Sentry, [“Seer” documentation](https://docs.sentry.io/product/ai-in-sentry/seer/).
- PostHog, [“Insights” documentation](https://posthog.com/docs/product-analytics/insights).
- Amazon Web Services, [“Alarm actions” documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarm-actions.html).
- TypeSafe AI, [TypeSafe AI skill documentation](https://github.com/typesafe-ai/skills/blob/main/skills/typesafe-ai/SKILL.md).
- Michael Levin, [“Technological Approach to Mind Everywhere: An Experimentally-Grounded Framework for Understanding Diverse Bodies and Minds”](https://doi.org/10.3389/fnsys.2022.768201) (2022).
- Shunyu Yao and colleagues, [“ReAct: Synergizing Reasoning and Acting in Language Models”](https://arxiv.org/abs/2210.03629) (2023).
- Noah Shinn and colleagues, [“Reflexion: Language Agents with Verbal Reinforcement Learning”](https://papers.nips.cc/paper_files/paper/2023/hash/1b44b878bb782e6954cd888628510e90-Abstract-Conference.html) (2023).
- W3C, [“PROV-O: The PROV Ontology”](https://www.w3.org/TR/prov-o/) (2013).
- National Institute of Standards and Technology, [*Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile*](https://doi.org/10.6028/NIST.AI.600-1) (2024).
- DORA, Google, [*2025 State of AI-assisted Software Development Report*](https://research.google/pubs/dora-2025-state-of-ai-assisted-software-development-report/).

These sources document individual mechanisms, research results, and governance
frameworks. The control-loop architecture and the way those parts are composed
here are this essay's synthesis.
