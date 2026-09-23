# Cognitive Factory

The dashboard says fewer customers are completing their first import. An agent
finds a likely regression and recommends a rollback. Then someone says, “Wasn't
that change part of the experiment we agreed to run?”

Now the team has a different conversation.

The experiment may justify waiting. Its results may justify stopping. A changed
product priority may make an old tradeoff unacceptable. The dashboard has not
changed, but the meaning of what it shows has.

This imagined situation captures a problem with agentic work: a system can
execute a task competently while missing the context that should change the
task. The plan exists. So does the earlier experiment and the decision behind
the code. They simply failed to reach the decision being made now.

A cognitive factory needs to make sense of its situation. That means connecting
what it sees with what has happened, what matters now, and what might happen
next. We'll use three recurring pictures: the reach of its attention, a small
path into a larger memory, and an experience changing a later judgment.

**In this series:** [1. Vision and Values](/writing/vision-and-values) →
[2. Understanding and Bottlenecks](/writing/understanding-and-bottlenecks) →
[3. Truth and Coherence](/writing/truth-and-inference) →
[4. The Knowledge Factory](/writing/the-knowledge-factory) →
[5. Ontology Factory](/writing/the-ontology-factory) →
**6. Cognitive Factory — you are here**.

## 1. How much of the situation can it see?

Michael Levin uses the cognitive light cone to examine the spatial and temporal
reach of what a system can measure, model, and try to affect. For an agentic
factory, it suggests a useful question: how much of the situation can enter
its judgment? This is an adaptation of his framework to organizations, not an
intelligence test. [Levin](https://doi.org/10.3389/fpsyg.2019.02688).

Start with time. Can the factory recover why the team made a decision three
months ago? Can it tell whether that decision still applies? Can it anticipate
a consequence that will appear after the current task closes?

Then look across the organization. An import error is an engineering event,
but it may also delay a customer's project and create a week of support work.
Does the explanation include those people and dependencies, or does it end at
the service boundary?

An agent with access to the entire repository can still have a narrow view of
the problem. A factory with a million indexed documents can miss the one
decision that matters. Useful reach shows up in the connections it can make
and the recommendations those connections change.

Keep authority separate. The ability to understand a dependency does not grant
permission to change another team's commitments. We want a wider view and
clear decision rights together.

> **Figure cue — the reach of one factory.** Put the current import decision
> between applicable history and an outcome still to be observed, connected
> across customer, product, support, and engineering contexts. Caption: “How
> far can the factory recover the past, understand the present, and anticipate
> a consequence someone will check?”

## 2. Give a signal something to mean

A falling number matters because of what we are trying to achieve. Before
asking an agent to improve activation, we should be able to explain what a
successful first experience means for the customer.

The signal layer in Vision and Values concerned the direction and distinctive
purpose of the work. Here we need observations that help us judge whether we
are getting there.

FranklinCovey's 4 Disciplines of Execution offers a useful distinction. Lag
measures show a result. Lead measures concern something the team can influence
that is expected to predict that result. The relationship matters more than
which number appears first on a dashboard.
[FranklinCovey](https://www.franklincovey.com/blog/5-ways-to-narrow-sales-focus-in-uncertainty/).

For our hypothetical import problem, the lag measure could be the share of a
defined customer cohort completing a first successful import within seven days.
A candidate lead measure could be the share of scheduled import trials run
with representative customer data before release. We expect better preparation
to prevent avoidable failures. We still have to test that expectation.

Error patterns and support reports help explain what is happening. Support
effort and severe import failures help catch costs hidden by the headline
result. These observations have different jobs; calling all of them key metrics
can blur the distinction.

If trial completion rises and customer success does not, ask whether the trials
represent the real difficulty. Counting easy tests can make the team look busy
without helping anyone. Keep the definition, cohort, baseline, observation
window, and owner available so the relationship can be challenged.

The people pursuing the outcome should help choose the measures. Product and
support need a voice when an engineering improvement moves the cost onto them.
The factory's trigger policy can start an investigation. Its sensemaking must
remain able to question why that investigation matters.

## 3. Remember what happened—and what still applies

Tiago Forte's Building a Second Brain starts with a familiar limitation: we
cannot keep everything useful in our heads. His PARA method organizes material
around projects, areas of responsibility, resources, and archives. An
organization needs that external memory too, with shared ownership and a way
to tell which records still govern the work.
[Second Brain](https://www.buildingasecondbrain.com/), [PARA](https://fortelabs.com/blog/para/).

Consider four kinds of record:

- A **project plan** explains the objective, dependencies, owner, and next
  decision. Earlier versions explain how the work changed.
- An **experiment record** connects a hypothesis to what actually happened,
  including failures and outcomes that remain uncertain.
- An **architecture decision record** preserves a choice, its alternatives,
  and its consequences. Its status tells us whether that choice remains in force.
- **Product and project priorities** tell us what takes precedence now and
  preserve why the order changed.

History and current state belong together. An old priority may explain the
release without justifying the next one. A failed experiment may save us from
repeating a mistake, provided we can see which customers and conditions it
involved. A superseded ADR can help us understand the code while its replacement
guides the change.

Give these records stable identities, owners, dates, scope, status, and links
to evidence. When a decision changes, connect the new record to the old one.
When priorities conflict, expose the conflict to the person responsible rather
than asking a summary to smooth it away.

This is ongoing work for the people who know the records. Shared conventions
help another team find their knowledge without turning a central curator into
the next bottleneck.

## 4. Put a route to the memory in the repo

We do not need to put the whole second brain beside the source code.

Plans can stay in the project tracker. Experiments can stay with their results.
Product priorities can stay in the workspace where their owners maintain them.
Copying everything into the repo gives us another collection to keep current,
often without the people who know when it changed.

The repository should hold the implementation, its contracts, and decisions
that need to change with the code. An ADR governing a service boundary may
belong there. That does not mean every roadmap discussion or abandoned
experiment needs to join it.

What we need is a predictable way to find relevant context. A small entry in
the existing agent instructions, or an index linked from them, can identify
the project, name the authoritative sources, and explain when to consult them.
It should include owners and access methods, not just a pile of URLs.

For onboarding work, it might point to the current plan, the decision index,
the experiment history, and the priority record. Each destination offers enough
metadata to judge scope and freshness before opening the full record.

The convention is simple: the repo knows where to ask; the source keeps the
record. Teams can use different storage systems as long as the route is stable
and someone owns its maintenance.

## 5. Bring in the records that can change your mind

Finding a source is only the beginning. We still need to decide which part of
the organizational memory belongs in this task.

Forte's progressive summarization keeps useful summaries connected to deeper
material. The same principle suggests a way for agents to retrieve context:
start small, then deepen the inquiry where the decision requires it.
[Progressive Summarization](https://fortelabs.com/blog/progressive-summarization-a-practical-technique-for-designing-discoverable-notes/).

Start with the question. Which customer journey, project, and time period are
affected? Inspect the index and summaries. Open the records that can support
or contradict the live explanation. Follow their source or replacement links
when a consequential detail is missing.

For the activation decline, the first packet might contain the current
onboarding priority, the release experiment, a governing ADR, and the measurement
definition. The earlier experiment comes in if its conditions bear on the
present hypothesis. Everything else can stay where it is.

> **Figure cue — a small path into a large memory.** Move from the repo's entry
> point to record summaries, selected records, and supporting evidence. Leave
> unrelated history outside the working packet. Caption: “Retrieve what the
> decision needs; keep the rest discoverable.”

A budget helps bound the search. It cannot tell us that the search is complete.
If a missing record could reverse the recommendation, say so and seek it or
escalate. If access is unavailable, keep that uncertainty visible. A plausible
summary is a poor substitute for evidence that controls the decision.

The status of retrieved material matters as much as its relevance. An old
instruction remains an old instruction. Finding it does not make it current.

## 6. Make the next judgment different

Return to the proposed rollback. The team finds the experiment plan and learns
that a short-term activation decline was an expected tradeoff. It finds the
outcome and learns that the hoped-for benefit failed to appear. Then it finds
the current priority and learns that onboarding reliability now takes
precedence over the experiment's goal.

The right action may still be a rollback, but now the recommendation rests on
an account the team can inspect. Under different evidence, waiting or changing
the measurement might have been the better response.

Remember the comparison between expectation and result, the explanation it
changed, and who accepted the revision. Put a durable lesson where it can
affect future work: a test, definition, decision, or operating practice. Keep
the full history linked so someone else can examine its conditions.

> **Figure cue — consequence returns to context.** Reuse the existing motif.
> Caption: “An experience becomes useful memory when it can change a later
> interpretation.”

Today's task needs a working view of that memory. The organization needs the
larger history for questions it has not yet asked. Keeping both lets the
factory remember without forcing every prompt to carry everything it knows.

## 7. Test whether its view has improved

Give the factory a case where the relevant records are known. Can it find the
current priority, distinguish a superseded decision, and recover an applicable
experiment? Can it explain which evidence supports the recommendation and
which uncertainty could change it?

Then change a consequential fact. Introduce a new outcome or priority. Watch
whether the recommendation changes for the right reason. Try a case involving
another team's work and see whether the factory preserves the difference
between that team's conditions and its own.

Track missed records, stale-state mistakes, unsupported claims, and review
effort alongside the result. Compare the same cases under different context
and memory arrangements. That gives Levin's light-cone idea a practical use:
questions about the reach of this factory, answered by what it can actually do.

Across the series, we have given the organization a direction, ways to test
claims, distributed understanding, execution machinery, and a shared model.
The cognitive factory makes those capabilities available to a decision over
time.

It should be able to remember why we did something, understand what has changed,
and reconsider what to do next. Most of its memory can remain outside the
prompt. The part that matters must be possible to find.

## Sources

- Michael Levin, [The Computational Boundary of a “Self”](https://doi.org/10.3389/fpsyg.2019.02688) (2019). The organizational light-cone framing is an adaptation, not a validated intelligence scale.
- FranklinCovey, [5 Ways to Narrow Your Sales Focus in Times of Uncertainty](https://www.franklincovey.com/blog/5-ways-to-narrow-sales-focus-in-uncertainty/). Lead and lag measures; the onboarding measures are illustrative and need local validation.
- Tiago Forte, [Building a Second Brain](https://www.buildingasecondbrain.com/) and [The PARA Method](https://fortelabs.com/blog/para/). Personal knowledge practices extended here to shared records and ownership.
- Tiago Forte, [Progressive Summarization](https://fortelabs.com/blog/progressive-summarization-a-practical-technique-for-designing-discoverable-notes/). The selective-retrieval approach is a proposed adaptation.
- W3C, [PROV-O](https://www.w3.org/TR/prov-o/) (2013). A reference vocabulary for provenance, not a prescription for the proposed storage arrangement.
