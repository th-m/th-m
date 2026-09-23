# The Knowledge Factory

Suppose you ship a release on Tuesday. By Wednesday, fewer customers are
finishing their first data import. An agent finds a suspicious change and
writes a patch. The tests pass. The whole thing takes twenty minutes.

Has the problem been solved?

You still need to know whether the release caused the decline, whether the
patch addresses it, and whether customers can now do what they came to do.
Someone also needs to notice if the fix creates work for support or breaks
another team's service. Writing the patch was one part of the job.

Every organization has a system for getting through the rest. Evidence becomes
a request, the request becomes work, and the work eventually changes something
for a customer. Along the way, context gets preserved or lost, decisions get
made, and people wait for one another. That is the knowledge factory.

The first three essays argued for human direction, sound evidence, and teams
that can think for themselves. Here we build the machinery that lets them act
on those commitments. We'll follow our hypothetical import problem through
three recurring pictures: what survives generation, how the work branches and
rejoins, and how its consequences return to the next attempt.

**In this series:** [1. Vision and Values](/writing/vision-and-values) →
[2. Understanding and Bottlenecks](/writing/understanding-and-bottlenecks) →
[3. Truth and Inference](/writing/truth-and-inference) →
**4. The Knowledge Factory — you are here** →
[5. Ontology Factory](/writing/the-ontology-factory) →
[6. Cognitive Factory](/writing/the-cognitive-factory).

## 1. Look on both sides of the prompt

A model receives context and produces candidate output. The simplicity of
that exchange can hide the work around it.

Someone knew which customer reports mattered. Someone connected the release
to the affected journey. Someone defined a successful import and decided that
preserving customer data mattered more than completing the task quickly. If
those choices never reach the agent, it has to proceed with a thinner account
of the problem.

The same issue appears after generation. A large patch arrives in seconds,
then waits two days for the one person who understands its consequences.
Generating another patch will not shorten that queue.

DORA's 2025 research describes AI as amplifying an organization's existing
strengths and weaknesses. That is a useful starting point: follow the work
around the model before deciding where more generation will help.
[DORA](https://research.google/pubs/dora-2025-state-of-ai-assisted-software-development-report/).

## 2. Follow the work until someone benefits

For the import problem, the desired result is a customer getting their data
into the product and using it. A patch, a passing test, and a closed ticket are
steps toward that result. Each gives us different evidence about our progress.

Trace one change from the customer report through investigation, review,
integration, release, and observation. At each handoff, ask what arrives, what
leaves, and who can send it back. This makes waiting and reconstruction visible.
It also reveals where the customer problem disappears behind an implementation
instruction.

Triage decides where the work belongs and what deserves attention. Validation
checks whether a result meets the need. The team may have to do both again
when new evidence changes the task.

Keep requirements and procedures distinct. Preserve valid customer data is a
requirement. Run these import tests is a procedure. The tests help, but someone
must still recognize a case they never covered.

## 3. What are we optimizing?

We want worthwhile changes to reach customers sooner, with less failure and
less time spent fixing our own work. How do we tell whether the factory is
getting better at that?

Start before the model runs. How long did it take to gather the evidence,
explain the need, and get the necessary decisions? A twenty-minute coding task
can sit behind two days of preparation and waiting. Time to token-in is really
a lead-time question: how long until the work is ready to proceed? The number
of input tokens tells us how much we supplied, not how long we waited.

Then follow the output. Suppose an agent produces five patches, we discard
four, and the fifth needs an afternoon of correction. The useful contribution
is what survives that work. Once it ships, does it hold up, or do we need a
hotfix? How much of next week's work is repairing this week's changes?

If those questions sound familiar, they should. We have arrived back at DORA.

DORA's **change lead time** runs from a code commit to production. Our input
preparation clock starts further upstream, but it asks the same flow question:
where is the work spending its time? **Change fail rate** counts the share of
deployments that need immediate intervention. It gives the output-quality
question a concrete production measure. A rejected draft stays outside that
denominator; a hotfix after deployment does not.
[DORA metrics](https://dora.dev/guides/dora-metrics/).

Useful yield and change fail rate look at the waste and correction surrounding
work from different ends. They are analogous concerns, not interchangeable
ratios. A stable release can still be useless to the customer, so keep the
intended benefit in view too. DORA's value-stream guidance makes the same
broader move: start with the desired outcome, then trace the flow that must
produce it. [Value-stream mapping](https://dora.dev/guides/value-stream-management/).

Deployment frequency tells us how often changes reach production. Failed
deployment recovery time tells us how quickly we recover when one goes wrong.
Deployment rework rate makes incident-driven deployments visible. Together
with lead time and change fail rate, these give us a much better view than a
count of tokens or agent runs.

The optimization is familiar engineering work: keep changes small, shorten
queues, automate dependable checks, and make recovery routine. Continuous
delivery has been developing that discipline for years. Agents let us automate
more of the work between feedback points, so development cycles can become
much shorter. The fundamentals survive the change in speed.
[Continuous delivery](https://dora.dev/capabilities/continuous-delivery/).

For the import problem, look for shorter preparation and delivery times, fewer
failed changes, and less rework. Compare the same service with its own baseline.
Keep successful customer imports and support effort beside those indicators.
If code arrives faster but waits longer for review, or customers need more
help afterward, we know where the next improvement belongs.

> **Figure cue — candidate work and useful yield.** Extend the token-economics
> figure plan with separate preparation and commit-to-production clocks. Mark
> rejected candidates before release and corrective work after it. Caption:
> “Same engineering questions, faster cycles: where do we wait, what fails,
> and what reaches the customer?” Keep token count separate from elapsed time.

## 4. Build something the next task can use

The factory begins to improve when a team can reuse what another task taught
it. For our import workflow, that might be a representative customer file, a
clear data contract, a known failure case, or a decision explaining an awkward
service boundary.

These materials make the next prompt better because the work behind them has
already been done. They also make review easier: an evaluator can see what the
candidate was supposed to preserve and which evidence supports it.

After the change, the factory needs somewhere to put what it learned. A file
format nobody anticipated can enter the test corpus. A misleading error can
change the interface. A mistaken assumption can revise a decision. The next
team should find the result and the reason it matters.

Nonaka's work on organizational knowledge creation asks how knowledge developed
by individuals becomes available through the organization. That question
survives the arrival of agents. A discovery trapped in one run is still hard
for anyone else to use. [Nonaka](https://doi.org/10.1287/orsc.5.1.14).

## 5. Let teams own the question

A central architect can now hand out implementation tasks faster than before.
That helps until every exception and every uncertain result comes back to the
same person. The team has accelerated the workers while preserving the queue.

Give a domain team a whole problem it can investigate: the intended customer
outcome, the evidence, the boundaries, and the authority to change its approach.
The onboarding team should be able to discover that its original explanation
was wrong without asking permission to think again.

Shared effects still need an owner. If a proposed change affects the import
service, someone must resolve the dependency with that team. An integration
owner handles that shared commitment. Local decisions stay with the people
who have the context to evaluate them.

A factory engineer improves these conditions. They turn a repeated review
question into a useful check, clarify a term that means different things to
product and engineering, or make a hidden dependency visible. The work can be
done by people in several roles. Its value is that the next team spends less
time rediscovering how to proceed.

## 6. Ask what each check actually establishes

Our import test passes. Good: the proposed change handles the case we tested.
We still need to know whether that case represents the customer's problem,
whether the change behaves properly in production, and whether the customer's
journey improves.

Different checks answer different questions. Tests examine specified behavior.
Domain review examines meaning and exceptions. Runtime evidence shows what
happened after release. Customer evidence shows whether the intended benefit
arrived. NIST's AI Risk Management Framework supports tying assessment to the
context and consequences of use. [NIST](https://doi.org/10.6028/NIST.AI.100-1).

Make it clear who can accept, return, reject, or escalate the work. Keep what
is still unknown beside what has passed. If the investigation disproves the
original premise, closing the task without a patch may be the best result.

## 7. Let a trigger ask a question

An activation alert tells us that something changed. It might be a regression,
an intended tradeoff, or a different mix of customers. It earns an investigation
before it earns a fix.

Give the observation enough context to survive the handoff: its source, time
window, baseline, affected journey, uncertainty, evidence, and owner. Give it
an identity too. Otherwise, the same incident can arrive through three tools
and start three competing interventions.

Decide when observations expire, when repeated events should be combined, and
when a cooldown should prevent more work. These are ordinary operating
choices, but they become consequential when an alert can start agents.

The permission to investigate should be explicit. Reading an experiment plan
and reproducing an error may be allowed; releasing a change may require a
separate decision. Product analytics, error tracking, and infrastructure alarms
can provide observations. The organization chooses the policy connecting them
to work.

## 8. Give the work an inspectable shape

Some investigation can happen at the same time. One agent reproduces the error
while another retrieves the relevant plan and decision. Their results meet
before the team selects an intervention.

That dependency structure is an agentic DAG: a directed acyclic graph for one
attempt. It tells us which work can proceed independently, what must wait,
and where results have to come together.

Each task needs inputs, an expected output, an owner, permitted tools and side
effects, and a way to decide whether it is done. It also needs a stopping or
recovery condition. A node labeled investigate forever is an unbounded job
with a diagram around it.

The graph can end without a code change. It can also lead to a revised attempt
when new evidence arrives. That repetition belongs to the surrounding workflow;
the dependencies within each attempt remain acyclic.

Keep the work record through interruptions. Before retrying, determine what
already happened. A restarted run should not send the same customer message
or release the same change merely because its model context was lost.

> **Figure cue — a trigger branches into inspectable work.** Show context lookup
> and reproduction joining at a decision, with paths to closure or an authorized
> intervention. Caption: “Parallel tasks become useful when their evidence can
> change the next action.”

## 9. Keep an owner after release

The easiest part of a loop to omit is the return journey. The patch ships,
the ticket closes, and everyone moves on before its effect is known.

Before release, write down what should change for the customer, when to look,
which costs would make the result unacceptable, and who will examine the
outcome. Include the conditions for stopping or reversing the intervention.

If activation recovers but support now spends twice as long on each onboarding,
the team has a tradeoff to examine. In this hypothetical case, a green product
metric would conceal work elsewhere. The expected result and the observed
result need to meet in the same review.

Sometimes the evidence arrives late or remains inconclusive. Keep that state
visible. There is no need to turn uncertainty into a success label—or into
another automatic attempt with no new reason to expect a better answer.

The agent may run a generation-and-test cycle in minutes while the customer
effect takes days to become visible. Both feedback loops matter. Automate the
fast one where the checks are dependable, and keep an owner for the slower
question of whether the change actually helped.

> **Figure cue — consequences return to the next attempt.** Reuse the factory
> control-loop composition. Caption: “Someone must carry the question past
> release and bring the result back to the next decision.”

## 10. Leave the factory better than you found it

When the import work finishes, the next team should inherit more than a patch.
It might gain a useful test, a clearer definition, a corrected assumption,
and a record of the outcome. Those are small improvements to its ability to
solve the next problem.

Over time, that connected learning may become hard to copy. A competitor can
see a feature without seeing the customer relationships, failed attempts,
and tested distinctions behind it. The advantage depends on those lessons
remaining useful and available. A large archive alone will not provide it.

Ontology Factory takes up the shared model that makes context reusable.
Cognitive Factory asks how the organization finds the history it needs and
uses it to understand the present. The execution system developed here gives
that understanding a way to act—and a way to discover when it was wrong.

A good factory makes the next worthwhile outcome easier to reach.

## Sources

- DORA, [Software delivery performance metrics](https://dora.dev/guides/dora-metrics/), [Value-stream mapping](https://dora.dev/guides/value-stream-management/), and [Continuous delivery](https://dora.dev/capabilities/continuous-delivery/). The measurement boundaries and established engineering practices behind the token analogy.
- DORA, Google, [2025 State of AI-assisted Software Development Report](https://research.google/pubs/dora-2025-state-of-ai-assisted-software-development-report/). The organizational amplifier finding supports the systems argument, not a promised productivity gain.
- Ikujiro Nonaka, [A Dynamic Theory of Organizational Knowledge Creation](https://doi.org/10.1287/orsc.5.1.14) (1994). How organizations articulate and amplify knowledge.
- NIST, [AI Risk Management Framework 1.0](https://doi.org/10.6028/NIST.AI.100-1) (2023). Assessment, oversight, and consequences in context.
- AWS, [CloudWatch alarm actions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarm-actions.html); PostHog, [Insights](https://posthog.com/docs/product-analytics/insights/); Sentry, [Seer](https://docs.sentry.io/product/ai-in-sentry/seer/). Examples of individual sensing and investigation capabilities.

The import case, useful-yield questions, task contracts, and factory composition
are proposals. The cited sources do not establish this complete operating
model or a measured competitive advantage.
