# The Knowledge Factory

A release goes live. Fewer customers complete their first data import. An
agent finds a likely cause and produces a patch before the team finishes its
morning meeting.

In this hypothetical case, generation has accelerated. The work is still
unfinished. Someone must establish what changed, decide whether it matters,
check the proposed intervention, coordinate its effects, and find out whether
customers recover. Those responsibilities form the factory around the model.

The previous essays established the need for human direction, evidence, and
distributed understanding. A knowledge factory puts those commitments to work:
it turns intent and evidence into verified outcomes, then retains what the
outcomes teach. Its design determines whether faster generation produces useful
capacity or a larger queue of things waiting for judgment.

Three motifs will follow the work: candidate output passing through evaluation,
an investigation branching into dependent tasks, and consequences returning to
the next attempt.

**The AI Factory series:** [1. Vision and Values](/writing/vision-and-values) →
[2. Understanding and Bottlenecks](/writing/understanding-and-bottlenecks) →
[3. Truth and Coherence](/writing/truth-and-inference) →
**4. The Knowledge Factory — you are here** →
[5. Ontology Factory](/writing/the-ontology-factory) →
[6. Cognitive Factory](/writing/the-cognitive-factory).

## 1. Generation is one station

At the model boundary, the exchange looks simple: context enters, inference
runs, and candidate output leaves. This says little about the work required on
either side. The context may have taken days to assemble. The output may take
minutes to generate and another week to verify.

The import problem begins before a prompt. Support has customer reports,
product has a definition of successful onboarding, and engineering has release
and runtime evidence. The people assembling the task must decide which of
those facts belong together. A request to improve activation hides that work
unless someone has already supplied the definition, affected population,
constraints, and desired outcome.

This is an organizational problem. DORA's 2025 research describes AI as an
amplifier of the strengths and weaknesses of the surrounding organization.
The proposed factory applies that observation to the path of a work item:
inspect the context, queues, handoffs, and checks around generation before
treating output volume as a productivity result. [DORA](https://research.google/pubs/dora-2025-state-of-ai-assisted-software-development-report/).

## 2. Follow the work to an outcome

The patch is an artifact. A customer completing the intended import is an
outcome. Tests may establish that the patch handles a specified input without
establishing that it solves the customer's difficulty.

Follow the change through context assembly, generation, review, integration,
release, and observation. Each handoff has an input, an output, and someone who
can accept, return, or redirect the work. Triage clarifies what deserves
attention and where it belongs. Validation examines whether a result satisfies
the relevant requirement. Both may happen more than once.

Distinguish the requirement from the procedure too. Preserve valid customer
data states what must remain true. Run the representative import test states
one way to check it. An agent needs both a target and a method, but a procedure
cannot anticipate every case in which the target is threatened.

The factory's throughput ends at an evaluated consequence. Counting patches
at the generation station can conceal a growing review queue or a customer
problem that remains unresolved.

## 3. What should the factory optimize?

The objective is to reach a worthwhile outcome sooner, with less failure and
avoidable rework. Which indicators tell us whether the factory is improving?
Begin with the token exchange, then follow its consequences through delivery.

Input tokens describe how much context enters a model. Their count is a volume,
not a duration. The more useful flow question is how long it takes to turn a
recognized need into usable input: finding evidence, clarifying the objective,
resolving dependencies, and waiting for decisions. Time to token-in is a
lead-time measure for that preparation stage. Reducing it requires improving
the work and queues before generation, not merely shortening the prompt.

On the output side, ask what contribution survives evaluation and how much
correction it requires. This is the useful yield behind token value output.
Trace accepted work into production as well: how often does a deployment need
an immediate fix, and how much subsequent delivery is incident-driven rework?
Counting generated tokens cannot answer either question.

These concerns are familiar from DORA's software delivery metrics:

| Factory question | Established engineering connection |
| --- | --- |
| How long does a need wait before the model has usable input? | Lead time through an upstream stage of the value stream. DORA's **change lead time** measures a different interval: commit to production. |
| How much generated work survives, and how often must deployed work be corrected? | Useful yield exposes candidate waste; **change fail rate** tracks deployments needing immediate intervention. Both direct attention to failure and rework, at different boundaries. |

DORA also measures deployment frequency, failed deployment recovery time, and
deployment rework rate. Together, these describe the delivery pace, recovery,
and instability that token counts miss. Apply them to a service over time,
alongside the customer outcome; they are indicators for improvement rather
than quotas for generating or deploying more work.
[DORA metrics](https://dora.dev/guides/dora-metrics/).

The boundaries preserve the usefulness of the comparison. A candidate rejected
before release is not a failed deployment. A deployment with no incident can
still deliver little value to the customer. DORA's value-stream guidance
places software delivery within the larger journey from an idea to an outcome.
Our preparation time and customer result extend that view rather than rename
the delivery metrics. [Value-stream mapping](https://dora.dev/guides/value-stream-management/).

The engineering goal has not changed: smaller changes, less waiting, dependable
checks, quick recovery, and feedback that improves the next cycle. Continuous
delivery already develops these practices. Agents can automate more of the
preparation, implementation, and correction between checks, allowing shorter
development cycles. The benefit depends on the whole path improving; faster
generation that lengthens review has moved the queue.
[Continuous delivery](https://dora.dev/capabilities/continuous-delivery/).

For the import workflow, compare preparation time, commit-to-production time,
failures, and rework with the same service's baseline. Keep successful customer
imports and support effort beside them. That shows whether the faster cycle
is delivering the intended benefit.

> **Figure cue — candidate work and useful yield.** Extend the token-economics
> figure plan with a preparation clock, a separate commit-to-production clock,
> candidate rejection, and post-deployment correction. Caption: “The familiar
> engineering questions are flow, failure, and rework. Measure each at its own
> boundary, then check the customer outcome.” Token volume remains a separate
> quantity. This is a proposed illustration update, not a changed live asset.

## 4. Build the system around generation

The proposed operating loop is intent and evidence, reusable context,
generation, evaluation, action, consequence, and revised context. Model
inference occupies one part of it. The organization supplies the relationships
between the parts.

For the import change, reusable context might include the data contract,
representative customer files, known failure cases, and the boundary between
the onboarding and import-service teams. It should be possible to recover this
material without reconstructing the project from chat history.

When the intervention succeeds or fails, the result must have somewhere to go.
A newly discovered file format may enter the test corpus. A confusing error
may change product guidance. A faulty assumption may revise a decision record.
Retaining a result changes future work only when people can find and use it.

Nonaka's account of organizational knowledge creation examines how individual
knowledge becomes articulated and amplified through organizational activity.
The factory applies that concern to AI-assisted work: a useful discovery should
become available beyond the person or agent that made it.
[Nonaka, 1994](https://doi.org/10.1287/orsc.5.1.14).

## 5. Give teams complete pieces of the problem

A central architect can delegate many implementation tasks and still become
the bottleneck if every interpretation, integration question, and exception
must return to that person. Faster subordinates can deepen the queue.

Give a domain team the customer problem, relevant evidence, acceptance
conditions, and authority to investigate within its boundary. Let it revise
the approach as it learns. Name an integration owner when the intervention
affects another team's commitments. That owner resolves shared effects;
routine local decisions remain with the team capable of evaluating them.

Factory engineers improve the conditions under which these teams work. One
makes a recurring review criterion testable. Another exposes a hidden queue.
A third clarifies a domain term that means different things in analytics and
the API. This responsibility can belong to engineers, product specialists,
researchers, and operations staff. It need not create another central office.

The practical test is whether another team can make a sound decision with less
reconstruction and fewer unnecessary handoffs. Reusable judgment includes the
reason for a constraint as well as its executable form. A requirement about
first-import integrity can become a test; unfamiliar cases still need someone
able to question whether the test covers what matters.

## 6. Match evaluation to the claim

Different claims require different evidence. Deterministic tests check
specified behavior. Domain review examines meaning and exceptions. Runtime
observation checks what the system does after release. Customer evidence checks
whether the intended experience improved.

For the import patch, a passing test can justify proceeding to the next gate.
It cannot establish that activation recovered or that the improvement did not
transfer work to support. Record which claim each check supports, who may
accept it, and what remains unknown.

An evaluator should be able to reject, return, accept, or escalate the result.
When the evidence contradicts the task's premise, a useful factory can stop
the task. It does not require a patch merely because generation has begun.

NIST's AI Risk Management Framework supports assessment tied to context,
measurement, oversight, and consequences. It provides grounding for this
approach without prescribing the factory's particular workflow.
[NIST AI RMF](https://doi.org/10.6028/NIST.AI.100-1).

## 7. A trigger opens an investigation

An alert about activation is an invitation to explain a change. The release
may have introduced a defect, deliberately changed the journey, or coincided
with a different customer mix. The initial observation does not choose among
those explanations.

A trigger should preserve its source, baseline, observation window, affected
domain, uncertainty, evidence links, and owner. It also needs an identity and
expiry so duplicate or stale events do not keep opening the same work.
Deduplication and cooldowns make that policy operational.

Permission to investigate should be separate from permission to intervene.
The investigation may retrieve records and reproduce an error without being
allowed to change production. Tools such as product analytics, error tracking,
and infrastructure alarms provide parts of the sensing path. Their composition
into this workflow remains a design choice.

The factory article owns this routing machinery. Choosing a useful lead
measure and interpreting what a signal means are the sensemaking questions
developed in Cognitive Factory.

## 8. Make agent dependencies inspectable

An agentic directed acyclic graph, or DAG, describes the dependencies within
one attempt. In the import case, reproducing the error and retrieving the
governing plan can happen independently. Their results meet at a review of
the hypotheses. An authorized intervention then proceeds through implementation,
verification, and integration.

Each node needs a declared input and expected output, access to relevant
context, permitted tools and side effects, checks, an owner, and conditions
for stopping or recovery. These contracts let a team see why a downstream task
can begin and what evidence it is relying on.

The graph describes possible work, not a command to visit every node. Evidence
may end the investigation without an implementation. A revised attempt can
start after new evidence arrives. That repetition belongs to the enclosing
workflow; the dependencies inside one attempt remain acyclic.

Keep execution state durable across interruptions. A retry should not silently
repeat a customer email, a release, or another side effect. Bounded attempts,
recorded completion, and an explicit recovery policy make the graph a work
record that survives an individual model call.

> **Figure cue — a trigger branches into inspectable work.** An observation
> opens competing explanations. Context lookup and reproduction join at a
> decision; that decision either closes the investigation or authorizes an
> intervention. Caption: “Parallel work rejoins where its evidence can change
> the next action. Every branch has an owner and a stopping condition.”

## 9. Engineer the return path

Before release, specify the expected customer effect, the observation window,
acceptable tradeoffs, conditions for reversal, and the person responsible for
the outcome. That responsibility must survive the implementation ticket.

Verification asks whether the artifact meets known requirements. Outcome
evaluation asks whether the intervention produced the intended change. If
activation recovers but support effort rises sharply, the result calls for
judgment rather than an automatic success label.

Delayed or missing observations need a defined outcome too. Keep the work
pending when the observation window is still open; close it as inconclusive
when evidence cannot settle it. Another generated attempt is useful only if
there is a reason to expect it to resolve the gap.

Automation can make the inner generation-and-test loop much shorter while the
customer outcome still takes days to observe. Engineer both clocks. Fast tests
help the team iterate; the outcome owner keeps those iterations connected to
the slower evidence about whether the change helped.

> **Figure cue — consequences return to the next attempt.** Reuse the factory
> control-loop composition, with verification before release and consequence
> evaluation afterward. Caption: “Work becomes learning when observed results
> revise the context, checks, or practices used by later work.”

## 10. The next team should inherit more than a patch

The import problem has produced more than code if the next team inherits a
representative test, a clearer definition, an applicable decision, and evidence
about what happened. It has produced reusable capability when that inheritance
helps the next team reach a worthwhile result.

This is where a strategic advantage may develop. A competitor can copy visible
features more easily than it can recover the customer relationships, mistakes,
and tested distinctions behind them. The advantage depends on those things
remaining useful, discoverable, and open to correction. Accumulation by itself
does not create a moat.

The next essay, Ontology Factory, develops the shared model that makes context
reusable. Cognitive Factory then asks how the organization can interpret its
signals and recover the history a decision needs. Here, the task is to build
the execution system that can act on that understanding and bring back evidence.

The factory earns its name when one finished piece of work improves how the
next piece is done.

## Sources

- DORA, [Software delivery performance metrics](https://dora.dev/guides/dora-metrics/), [Value-stream mapping](https://dora.dev/guides/value-stream-management/), and [Continuous delivery](https://dora.dev/capabilities/continuous-delivery/). Metric boundaries, flow across the wider value stream, and established automation and feedback practices. The token mapping is an analogy, not a new DORA metric.
- DORA, Google, [2025 State of AI-assisted Software Development Report](https://research.google/pubs/dora-2025-state-of-ai-assisted-software-development-report/). AI's effects depend on the surrounding organization; this report does not validate the proposed workflow or yield measures.
- Ikujiro Nonaka, [A Dynamic Theory of Organizational Knowledge Creation](https://doi.org/10.1287/orsc.5.1.14) (1994). Organizational articulation and amplification of knowledge.
- NIST, [AI Risk Management Framework 1.0](https://doi.org/10.6028/NIST.AI.100-1) (2023). Context, measurement, oversight, and ongoing evaluation.
- AWS, [CloudWatch alarm actions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarm-actions.html); PostHog, [Insights](https://posthog.com/docs/product-analytics/insights/); Sentry, [Seer](https://docs.sentry.io/product/ai-in-sentry/seer/). Examples of sensing and investigation capabilities, not evidence that the full proposed factory is deployed.

The onboarding case, task contracts, and operating model are illustrative
synthesis. They make no measured productivity or competitive-performance claim.
