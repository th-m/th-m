# Cognitive Factory

Two teams see the same decline in customer activation. Both can inspect the
release, reproduce an import error, and prepare a fix. One also finds a planned
experiment, a similar attempt from three months ago, and a change in product
priorities. That team has a different decision to make.

This is a hypothetical case, but the missing information is familiar. Plans,
experiments, decisions, and priorities exist across an organization. Their
existence does not ensure that they reach the people or agents whose work they
could change. A team can complete its assigned workflow while missing the
reason the assignment should be reconsidered.

A cognitive factory develops the capacity to relate present observations to
relevant history, current goals, and possible consequences. Its sensemaking is
visible in what it notices, which explanations it considers, and how it
revises a judgment when evidence changes.

Three motifs organize this essay: the reach of attention across time and
domains, a narrow path into a large organizational memory, and experience
returning to a later decision. The question is how to make that memory useful
without putting the entire archive into every task.

**The AI Factory series:** [1. Vision and Values](/writing/vision-and-values) →
[2. Understanding and Bottlenecks](/writing/understanding-and-bottlenecks) →
[3. Truth and Inference](/writing/truth-and-inference) →
[4. The Knowledge Factory](/writing/the-knowledge-factory) →
[5. Ontology Factory](/writing/the-ontology-factory) →
**6. Cognitive Factory — you are here**.

## 1. How far can the factory make sense?

Michael Levin's cognitive light cone concerns the spatial and temporal reach
of the events and goals a system can measure, model, and try to affect. His
framework provides a way to ask about the scale of agency beyond familiar
human examples. Applying it to a factory of people, agents, and software is
an organizational adaptation, not a validated intelligence test.
[Levin, 2019](https://doi.org/10.3389/fpsyg.2019.02688).

For our onboarding workflow, temporal reach concerns which past decisions
remain available and which future consequences enter the present judgment.
Can the factory recover an earlier experiment under comparable conditions?
Can it distinguish yesterday's priority from the one that now governs the
project? Can it predict an effect whose evaluation will occur after the code
is released?

Reach across domains concerns the people and dependencies included in the
explanation. An import error belongs to a service, but its consequence may be
a delayed customer project, a support escalation, or a missed purchasing
window. A system confined to the exception trace will overlook some of those
relationships even if it can edit every file in the repository.

Useful reach must be demonstrated through tasks. More documents and wider tool
access create possibilities; they do not establish that relevant information
will be found or interpreted well. Authority is a separate question. Knowing
about another team's work does not grant permission to change its commitments.

> **Figure cue — the reach of one configured factory.** Show the present import
> decision connected to an applicable past experiment, current customer and
> team context, and a future outcome review. Caption: “Cognitive reach is the
> context a factory can use in a judgment, not the size of the archive it can
> access.” Keep intervention authority separate from capability.

## 2. Choose signals that explain progress

An observation becomes useful in relation to a goal. The signal layer from
Vision and Values supplies a distinctive direction for the work. Here, signals
are observations used to judge progress toward that direction.

FranklinCovey's 4 Disciplines of Execution distinguishes lag measures of a
result from lead measures selected for their predictive relationship to that
result and the team's ability to influence them. The distinction makes a
practical demand: connect controllable behavior with the outcome it is meant
to improve. [FranklinCovey](https://www.franklincovey.com/blog/5-ways-to-narrow-sales-focus-in-uncertainty/).

For the import example, use this hypothetical measurement plan:

| Kind | Example | Question |
| --- | --- | --- |
| Lag measure | Share of a defined customer cohort completing a first successful import within seven days | Did the customer outcome improve? |
| Candidate lead measure | Share of scheduled import trials completed with representative customer data before release | Does this practice predict fewer failed first imports? |
| Diagnostic signal | Validation errors, support reports, and abandonment points | Which explanations fit the difficulty? |
| Guardrail | Support effort per onboarding and severe import failures | Did apparent progress move the cost elsewhere? |

A lead measure needs evidence behind the relationship. Counting trials could
reward quick, unrepresentative tests. A metric appearing early in a dashboard
is not automatically a lead measure. Keep the cohort, baseline, definition,
observation window, and owner visible so the team can revisit the relationship.

The team pursuing the outcome should help choose and interpret its measures.
Product and support may see costs hidden by an engineering dashboard. If the
practice improves while the customer result does not, the factory has learned
something about its theory of improvement. It should revise that theory.

Triggers and scheduling belong to the execution machinery in The Knowledge
Factory. The cognitive question is what an observation means and what could
make the interpretation wrong.

## 3. Give the organization a second brain

Tiago Forte's Building a Second Brain develops a practice for retaining useful
knowledge outside immediate memory. His PARA method organizes information
around projects, areas, resources, and archives. It offers a starting point
for thinking about organizational memory, with additional requirements for
shared ownership, record state, and provenance.
[Second Brain](https://www.buildingasecondbrain.com/), [PARA](https://fortelabs.com/blog/para/).

The factory needs both what happened and what currently governs the work.
These are related questions with different answers:

| Record | Current state | History worth retaining |
| --- | --- | --- |
| Project plan | Objective, owner, dependencies, status, next decision | Changed assumptions, scope, and reasons |
| Experiment | Hypothesis, window, status, interpretation | Expected and observed outcomes, including failure |
| Architecture decision record | Accepted decision and whether it remains in force | Alternatives, rationale, consequences, replacements |
| Product and project priorities | Present order, constraints, owner, effective date | What changed and why |

An old priority can explain a release without authorizing the next change.
A failed experiment can be relevant without settling every later case. An ADR
may explain why the import service behaves as it does while a superseding
record establishes a new requirement.

A useful record therefore carries its identity, scope, owner, dates, state,
and source links. Replacements should point to what they supersede. Conflicting
priorities should remain visible until someone with responsibility resolves
them. A fluent summary must not quietly invent agreement.

This work belongs with record owners and domain teams. A central memory
curator cannot know every current project condition. Shared conventions should
help the people closest to a record maintain it and others discover it.

## 4. Make memory discoverable by convention

Organizational memory does not have to live in the source repository. A project
tracker can remain authoritative for the plan; an experiment store for its
results; a document workspace for product priorities. Copying all those
records into the repo creates another archive to keep synchronized.

Keep implementation, enforceable contracts, and code-coupled decisions with
the code. An ADR about a service boundary may belong there because changing
the boundary should involve changing the decision. Broad roadmaps, interview
notes, and historical project material can stay with their owners elsewhere.

What the repo needs is a small, predictable entry point. Existing agent
instructions or a linked context index can identify the project and domain,
point to authoritative record collections, name their owners and access
methods, and explain when to consult them.

For onboarding work, that entry might say where to find the current plan,
accepted decisions, experiment history, and priority record. It need not
contain their full text. At each destination, summaries and metadata let the
reader determine which records may apply before opening the evidence.

The convention establishes a route, not a universal storage product or a
requirement to create another documentation repository. Its usefulness depends
on stable references and people who can correct stale information.

## 5. Retrieve what can change the decision

A discoverable archive still needs a way into the task at hand. Forte's
progressive summarization preserves deeper source material while making useful
information easier to recover. For an agentic factory, we can adapt that
principle into staged retrieval.
[Progressive Summarization](https://fortelabs.com/blog/progressive-summarization-a-practical-technique-for-designing-discoverable-notes/).

Begin with the question, affected domain, and relevant period. Inspect the
index and record summaries. Open the few records that support or challenge the
live explanations, then follow their evidence or supersession links when a
detail could alter the decision.

For the activation decline, the first context packet might contain the current
onboarding priority, the release's experiment, an applicable ADR, and the
measurement definition. An earlier experiment enters when its conditions bear
on a live hypothesis. Unrelated projects stay outside this task's context.

> **Figure cue — a narrow path into a large memory.** A conventional entry
> point leads to summaries, selected records, and the evidence needed for the
> decision. Most records remain outside the working packet. Caption: “The
> factory needs a reliable route to relevant memory, not the whole archive in
> every prompt.”

A retrieval budget bounds effort; it does not prove that the inquiry is
complete. If a missing record could reverse the recommendation, preserve the
gap and seek the evidence or escalate. An inaccessible source remains an
uncertainty. Summaries help choose sources, but a consequential claim may
require the underlying record.

Retrieved information also retains its original status. An archived instruction
is evidence about the past, not a new instruction merely because an agent
encountered it during a search.

## 6. Let experience change the next judgment

Return to the opening teams. The experiment plan may reveal that the decline
was an anticipated tradeoff. The outcome record may show that the tradeoff
failed. The present priority may establish that the same cost is no longer
acceptable. Each record changes the meaning of the same observation.

The capacity we want is the ability to relate those facts, preserve a credible
alternative, and update the recommendation. The execution machinery can then
carry out an authorized decision. A longer memory is useful when it changes
what the factory notices or concludes.

Record the expectation, the observed result, and the explanation that changed.
When a lesson is durable, put it into an appropriate test, definition, decision,
or operating practice. Preserve the fuller history with links to its evidence.
A future team should be able to recover both the conclusion and its conditions.

> **Figure cue — consequence returns to context.** Reuse the existing motif
> with emphasis on changed interpretation. Caption: “An outcome becomes useful
> memory when a later judgment can recover what it changed and why.”

Working context is the selected view needed for today's task. Organizational
memory is the larger body of records that can inform future questions. Keeping
them distinct lets the factory remember more without making every decision
carry the entire history.

## 7. Evaluate the reach you actually built

A cognitive light cone becomes a useful design lens when it leads to observable
questions. Choose representative decisions with known relevant records. Test
whether the configured factory can recover the current priority, distinguish
superseded guidance, find an applicable experiment, identify missing evidence,
and trace its recommendation to sources.

Then introduce a contradictory outcome or a changed priority. Does the system
revise its recommendation and explain the change? Does it notice that the old
record applied to a different customer group? Can another team recover the
reasoning without asking one central expert to reconstruct the project?

Track retrieval misses, stale-state errors, unsupported claims, and human
review effort alongside task success. Compare the same cases under different
memory and context arrangements. These are proposed evaluations of a specific
factory, not a universal score for intelligence.

The series has moved from choosing a direction to testing claims, distributing
understanding, executing work, maintaining shared meaning, and making sense of
experience. The cognitive factory connects those capacities over time.

Its second brain gives the next decision a history. Its discovery conventions
make that history reachable. Its judgment depends on knowing which parts matter
now—and remaining willing to change its mind.

## Sources

- Michael Levin, [The Computational Boundary of a “Self”](https://doi.org/10.3389/fpsyg.2019.02688) (2019). The spatial and temporal framing informs an organizational adaptation; it is not a validated factory intelligence scale.
- FranklinCovey, [5 Ways to Narrow Your Sales Focus in Times of Uncertainty](https://www.franklincovey.com/blog/5-ways-to-narrow-sales-focus-in-uncertainty/). Lead measures are predictive and influenceable; the onboarding measures here are hypothetical candidates.
- Tiago Forte, [Building a Second Brain](https://www.buildingasecondbrain.com/) and [The PARA Method](https://fortelabs.com/blog/para/). Personal knowledge practices extended here with organizational ownership, state, and provenance.
- Tiago Forte, [Progressive Summarization](https://fortelabs.com/blog/progressive-summarization-a-practical-technique-for-designing-discoverable-notes/). A basis for the selective-retrieval proposal, not a performance evaluation of agents.
- W3C, [PROV-O](https://www.w3.org/TR/prov-o/) (2013). A reference vocabulary for provenance; it does not mandate this record or storage design.
