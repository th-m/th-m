# Cognitive Factory

## Role in the Series

**Question:** What can an agentic factory notice, understand, remember, and use
to guide future work?

**Answer:** Develop a capacity for sensemaking across time and organizational
boundaries: meaningful signals, relevant history, current state, and selective
access to evidence. Assess that capacity through a task-specific adaptation of
Levin's cognitive light cone.

**Boundary:** *The Knowledge Factory* owns triggers, agent DAGs, executable
context, and loop engineering. This article owns the capabilities served by
that machinery. Ontology supplies definitions and relationships; cognition uses
them to interpret a situation. Human strategic authority remains in article one.

## Audience

Teams designing how people and agents use organizational information to make
better development, product, and project decisions.

## Current Draft Brief

This outline governs the next private `article.md` and `humanized-draft.md`.
Keep canonical MDX as the published baseline until review. The humanized pass
should sound like a person reasoning through a familiar problem, with fewer
taxonomies and repeated qualifications, while preserving the source limits.

Carry the same first-import problem as *The Knowledge Factory*. Here the
question is why the evidence changes the interpretation, not how to dispatch
an agent. Distinguish observed activation decline from its competing
explanations: regression, intended tradeoff, and a changed customer mix.

The signal layer from article one supplies strategic direction. The signals
in this article are observations used to judge progress toward that direction;
do not conflate the two meanings. Human vision and priorities give a measure
its purpose, and relevant experience can challenge the initial explanation.

## Preface and Series Position

Introduce two teams seeing the same activation drop. One sees a release to
reverse; the other can find the plan, experiment, prior decision, and changed
priority that may alter the interpretation.

Introduce sensemaking as connecting observations with an explanation that can
guide a decision and be revised. Put the six-part linked series map before the
body, mark Cognitive Factory as current, and hand execution mechanics back to
article four.

Introduce three recurring motifs: the reach of the factory's attention, a
small path into a much larger memory, and experience returning to a decision.

## Argument Flow

### 1. How Far Can the Factory Make Sense?

Introduce Levin's spatial and temporal framing with direct attribution. Propose
a profile for a configured workflow, not a scalar intelligence rating.

- What past decisions and future consequences can it relate to this problem?
- Which connected people, systems, and goals can it represent?
- Which interpretations and missing evidence can it preserve?
- What can it affect within its mandate, and how does later evidence revise it?

Use one onboarding workflow. More documents, agents, or tools do not demonstrate
a wider useful capacity. Keep capability reach distinct from authority.

Map spatial reach to the people, workflows, and dependencies a configured
factory can relate, and temporal reach to applicable history and anticipated
consequences. State once that this is an organizational adaptation, then use
concrete tests rather than repeatedly apologizing for the analogy.

### 2. Choose Signals That Explain Progress

Use 4DX lead and lag measures to connect controllable practices to outcomes.
Keep diagnostic signals and guardrails distinct.

- Lag: a defined cohort's successful first import within seven days.
- Candidate lead: representative customer import trials completed before release.
- Diagnostics: error patterns, support reports, abandonment.
- Guardrails: support cost and severe import failures.

These are illustrative candidates. Validate the predictive relationship and
avoid treating early timestamps or activity counts as proof of a lead measure.
Keep cohorts, baselines, observation windows, definitions, and owners visible.
Trigger thresholds and scheduling belong in *The Knowledge Factory*.

Organizational implication: the team pursuing the outcome proposes a lead
measure, checks its relationship with the lag result, and changes it when the
evidence fails. Product and support help identify harm hidden by a local
engineering metric. Keep a person accountable for the measure's interpretation.

### 3. A Second Brain Holds History and Current State

Reference Tiago Forte's Second Brain and PARA as a starting practice. Explicitly
identify the additional organizational requirements as this article's proposal.

Cover project plans, experiment outcomes, ADRs, and product/project priorities.
Distinguish what is proposed, active, accepted, completed, superseded, or archived.

Keep identity, owner, dates, scope, provenance, and supersession links. History
can explain an implementation without governing the next one. A failed
experiment carries the conditions under which it failed.

Organizational implication: record owners maintain current state; domain
teams retain the conditions behind results; a decision owner resolves
contradictory priorities. Memory stewardship belongs with the people who can
correct the record, not with a central curator approving every investigation.

### 4. Make Context Discoverable by Convention

Keep changing organizational records in their authoritative systems. The
repository holds code, enforceable contracts, and decisions coupled to that
implementation, including an ADR when it belongs with the code.

A small conventional entry point identifies project/domain IDs, record types,
canonical locations, access methods, owners, and when to consult each source.
It routes to knowledge rather than copying plans, research, and archives.

Specify record summaries, state, dates, stable references, and evidence links.
Describe a convention; do not imply an implemented index or connector.

Give one small example: a repo entry identifies the onboarding project, links
its authoritative plan and decision index, and explains when to consult them.
The plan itself stays with its owner. An implementation-coupled ADR can still
live in the repository. Avoid prescribing a new universal filename or forcing
every team onto one storage product.

### 5. Retrieve the Context the Decision Needs

Adapt progressive summarization into selective retrieval:

1. Bound the task, domain, project, and relevant period.
2. Inspect index metadata and summaries.
3. Fetch the few records supporting or challenging live hypotheses.
4. Follow source and supersession links when needed.
5. Assemble relevant excerpts with provenance and a retrieval budget.

Never load the full organizational archive by default. Record consequential
gaps when evidence is unavailable or exceeds the budget; retrieve further or
escalate rather than treating silence as certainty.

Use the onboarding priority, release experiment, relevant ADR, and measure
definition as the first context packet. Expand only as the question requires.

Prefer relevance to quantity. A summary helps decide what to inspect; it is
not a substitute for source evidence when the distinction controls the action.
Respect access boundaries and retain an explicit uncertainty when a necessary
record cannot be retrieved.

### 6. Experience Must Change the Next Judgment

Return to the opening case. Show how an expected tradeoff, a failed experiment,
and a changed priority each alter the same apparent symptom.

Retain what changed in the explanation, expected/actual outcome, and ownership
of the revision. Promote durable findings into relevant contracts or practice;
keep their full history discoverable elsewhere. Working context is a selected
view of organizational memory.

### 7. Evaluate the Factory's Cognitive Reach

Propose representative cases with known relevant records. Check recovery of
current priorities, historical applicability, alternative explanations,
provenance, and response to new contradictory evidence.

Report retrieval misses, stale-state mistakes, unsupported claims, and review
effort alongside success. Compare the same tasks under different configurations;
do not aggregate them into an unvalidated universal cognition score.

## Figure and Motif Plan

| Placement | Illustration | Purpose |
| --- | --- | --- |
| Section 1 | Cognitive reach profile for one workflow | Replace the model/agent/factory ladder with evaluation questions and observable evidence; separate capability from governance. |
| Sections 4–5 | A small path into a larger memory | Move from a conventional entry point to selected records and the evidence a decision needs; leave unrelated history outside working context. |
| Section 6 | Existing consequence-returns-to-context motif | Show that retained experience changes the next interpretation. |

The control-loop SVG, trigger motif, and executable-context card move to the
factory article. Keep the preface's series map as navigation.

Use compact tables for the lead/lag distinction and record states only when
they improve comparison. They support the prose; the three motifs above carry
the recurring visual story. Private drafts contain labeled figure cues and
captions, not unimplemented components.

## Research and Evidence Limits

Use [sensemaking, signals, and memory research](../research/sensemaking-signals-and-memory.md).
Levin supplies the source framework, FranklinCovey the measurement distinction,
and Forte the external-memory and summarization practices. The organizational
profile, state model, retrieval conventions, and example are proposed synthesis.
Keep real-world validation and missing access explicit.

## Organizational Thread

Each section should answer who can notice, interpret, correct, or learn. The
aim is distributed sensemaking with shared conventions: teams own the
questions near their work, authoritative sources retain their owners, and
shared records let another team recover the reasoning without asking one
central expert to remember everything. Broader access alone does not grant
decision rights or establish competence.

## Handoff

The factory can execute governed work; ontology makes its context interpretable;
cognition connects signals, history, current state, and possible consequences.
The outcome is better situated judgment, with memory available by convention
and loaded only to the extent the present decision needs.
