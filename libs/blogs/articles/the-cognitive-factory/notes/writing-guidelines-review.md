# Writing-Guidelines Review: *Cognitive Factory*

## Guideline key

- **A — Compression and precision:** **A1** prune filler, **A2** remove
  doublets, **A3** cut implied or repeated meaning, **A4** choose exact words,
  and **A5** prefer affirmative constructions when the warning itself is not
  the point.
- **B — Memory and attention:** keep sentence topics consistent, move from old
  to new information, use concrete or visual language, and minimize
  meta-discourse.
- **C — Clarity at every scale:** put characters in subjects and actions in
  verbs, create cohesive handoffs, introduce a reader-relevant problem, mark
  section boundaries, and give each major unit a short index and a developed
  discussion.

## Overall diagnosis

The article has a strong conceptual spine: graph context exposes relationships,
executable context turns those relationships into checks, and captured outcomes
update both in a compounding loop. The current opening makes readers traverse an
overview, a series map, and a second conceptual overview before they encounter
that spine. Because those early sections repeat much of the same vocabulary,
they delay the reader's problem: model output can increase while organizational
learning remains fragmented or disposable.

The revision should present the article as a proposed operating model, not an
empirical law. In particular, the cognitive-light-cone comparison is an
organizational adaptation and qualitative diagnostic. A bare model call, an
agent, and a knowledge factory do not possess fixed levels of cognition by
definition; their practical reach depends on the context, tools, permissions,
evaluations, and feedback that a particular implementation provides.

## What already works

- **Keep the concrete transformations in “From Documents to Executable
  Context.”** “A definition becomes a schema” and “an observed failure becomes
  a regression case” give abstractions visible actions and outcomes. **Reason:**
  these examples make institutional knowledge easier to picture and put the
  important actions in verbs. **Guidelines:** B3; C2.
- **Keep the relational questions in “Graph Context Exploration.”** The
  questions turn a generic graph claim into recognizable work: tracing customer
  evidence, assumptions, decisions, failures, teams, systems, and metrics.
  **Reason:** concrete questions help readers imagine using the proposed model
  and keep “relationships” as the section's stable topic. **Guidelines:** B1,
  B3; C4.
- **Keep the one-line compounding loop.** “Work produces outcomes → outcomes
  produce evidence…” is the article's most memorable compression of the
  mechanism. **Reason:** repeated nouns create explicit old-to-new handoffs,
  while the arrow sequence makes the causal proposal visible. **Guidelines:**
  A; B2, B3; C3.
- **Keep the human-governance boundary.** The distinction between greater
  coordination and legitimate authority prevents the light-cone metaphor from
  becoming a claim that capability determines values. **Reason:** the negative
  in “does not by itself authorize” is worth retaining because the warning is
  the point. **Guidelines:** A5 exception; C6.
- **Keep the short parallel close.** “Ontology makes the factory coherent.
  Strategy makes it purposeful.” is concise and memorable. **Reason:** stable
  subjects, active verbs, and parallel form make the relationship easy to
  retain. **Guidelines:** A; B1; C1–C3.

## Prioritized structural and idea-level improvements

### 1. Lead with context loss, then state the operating-model thesis

**Suggested change:** Replace the current “Overview,” “Relationship to the
Series,” and most of “Extending Loop and Graph Engineering” with one short
introduction. Use the status quo → concession → destabilizing condition → cost
→ proposed response pattern. For example:

> A company can buy model access without building a system that retains what
> work teaches it. Models and agents may increase output, but when evidence,
> decisions, evaluations, and outcomes remain separate, teams must reconstruct
> context and can repeat old failures. A cognitive factory is a proposed
> operating model for connecting those parts: graph context makes relationships
> traversable, executable context turns knowledge into checks, and a feedback
> loop returns outcomes as evidence. The cognitive-light-cone scorecard then
> asks how far that machinery can observe, interpret, affect, and learn from a
> specific domain.

**Reasoning:** This version gives readers a problem and cost before a taxonomy,
ends the introduction with the article's point sentence, and introduces the
same four concepts the discussion will reuse. “Proposed operating model” also
preserves the claim's uncertainty. **Guidelines:** A1–A4; B1, B2, B4; C6, C9,
index/discussion.

### 2. Move the series map to the end

**Suggested change:** Remove “Relationship to the Series” from the opening.
Integrate its one necessary distinction into the introduction or conclusion:
ontology supplies stable domain distinctions, while strategy chooses direction.
Let “The Two Factory Disciplines” and the existing “Series” list carry the links
after the main argument.

**Reasoning:** The current series paragraph repeats *The Knowledge Factory*,
ontology, cognition, and the light cone before readers know why this article is
needed. Moving it preserves navigation for series readers without making new
readers process publication metadata as argument. **Guidelines:** A2–A3; B4;
C6–C9.

### 3. Make graph context → executable context → loop one visible chain

**Suggested change:** End and begin the three sections with deliberate relay
sentences:

- End graph context: “Provenance makes these relationships inspectable;
  executable contracts make them consequential.”
- Begin executable context: “Executable context turns traversable
  relationships into schemas, boundaries, evaluations, escalation paths, and
  regression cases.”
- End executable context: “When those contracts run, they produce outcomes.
  Capturing the outcomes closes the loop.”
- Begin the loop: “The compounding loop returns each captured outcome as
  evidence for the next decision.”

**Reasoning:** Each new term arrives at the end of one unit and becomes the
familiar subject of the next. The chain also clarifies dependency: a graph makes
relationships findable, contracts let work test them, and outcomes let the
system revise them. **Guidelines:** B1–B2; C1–C5, C8–C9,
index/discussion.

### 4. Make the light-cone scorecard a workflow diagnostic, not a hierarchy

**Suggested change:** Keep the scorecard, but anchor it to one explicitly
hypothetical workflow already supported by the article's examples. For example,
suppose a team changes the definition of `conversation`: what evidence can the
system observe, which definition can it interpret, which bounded change can it
affect, and what outcome can it retain for later work? Score the target workflow
on the four verbs **observe, interpret, affect, learn**. Put reversibility,
authority, and accountability in a separate “governance conditions” group.

Introduce the comparison as three illustrative configurations rather than
“three systems in increasing reach.” Rename “LLM” to “bare model call” if that
column intentionally means supplied context with no surrounding harness. Add a
one-sentence limit: the score describes the configured workflow, not an
intrinsic rank of a model, agent, organization, or mind.

**Reasoning:** A single change moving through evidence, definition, action, and
retained outcome gives readers a scene to remember. The four repeated verbs
match the metaphor's stated definition and produce a usable scorecard.
Separating capability from governance preserves the article's strongest
normative distinction. Qualifying the configurations avoids treating a proposed
operating model as a measured progression or Levin's biological framework as a
validated organizational metric. **Guidelines:** A4; B1–B3; C4–C9,
index/discussion.

### 5. Make the build order assemble the same chain

**Suggested change:** Introduce the numbered list with “Build the feedback chain
in diagnostic order,” then make each step reuse the article's principal nouns:
target workflow, evidence, domain distinctions, executable evaluation, outcome,
feedback, bounded team authority, and measured change. Where practical, state
the observable completion condition for each step rather than only the activity.

**Reasoning:** The list currently contains sound actions, but its relationship
to graph context, executable context, and the compounding loop is implicit.
Repeated terms will let readers see the build order as implementation of the
argument rather than a new checklist. Completion conditions also make the
proposal more concrete without asserting that it has already produced results.
**Guidelines:** A4–A5; B1–B3; C4, C7–C9.

## Section and paragraph flow

| Location | Suggested improvement | Reasoning | Guidelines |
| --- | --- | --- | --- |
| Overview, paragraphs 1–2 | Replace “Every company is building a factory” with the narrower context-loss problem, then make “a company,” “the system,” or “the cognitive factory” the stable sentence subjects. | The universal opening is broader than the article establishes. Stable subjects keep readers on the same topic while the predicate adds new information. | A4; B1–B2; C1, C4, C6 |
| Overview, four-part list | Keep it only as the thesis/index for the article; omit the later restatement in “Extending Loop and Graph Engineering.” | One compact index prepares the reader. Two indexes delay the discussion and increase cognitive load. | A1–A3; B4; C8–C9, index/discussion |
| Overview, light-cone paragraphs | Move the scorecard preview to the final sentence of the introduction and defer ontology/strategy to the close. | The light cone follows naturally from the mechanism's reach; the two disciplines answer a governance question best raised after capability is visible. | B2; C5–C9 |
| Extending Loop and Graph Engineering | Reduce this to a short bridge or absorb it into the introduction. Delete “The sections that follow…” and state the chain itself. | The current paragraph is meta-discourse about organization. A direct causal statement gives the reader content instead of navigation instructions. | A1–A3; B4; C1–C3 |
| Graph Context Exploration | Follow the question list with one small relational trace using only existing concepts: customer evidence → decision → capability → evaluation → observed outcome. Label it as an example. | The trace converts a list of possible edges into a visible path and anticipates executable context without adding a factual claim. | B2–B3; C3–C5 |
| From Documents to Executable Context | Preserve the list, but end with the outcome-producing bridge into the loop. | The section currently ends on the abstract phrase “productive capital.” An outcome is concrete new information that the next section can pick up as old information. | A4; B2–B3; C2–C5 |
| The Compounding Loop | Add two or three sentences explaining what must be retained: the correction, its provenance, and the evaluation or context it changes. Keep the arrow line as the point sentence or visual summary. | The shortest and most important mechanism currently receives less discussion than the preliminary framing. A compact expansion would make “retained learning” operational. | B1–B3; C2, C8–C9, index/discussion |
| Cognitive Light Cone Scorecard | State adaptation and limits before the comparison; use the four core verbs as capability dimensions and move governance conditions below them. | Readers need to know what kind of claim they are evaluating. The current seven-row table mixes reach, controls, and responsibility, weakening the metaphor's visual pattern. | A4; B1–B3; C5, C8–C9 |
| What Companies Should Build First | Tie every step back to the chain and retain the final outcome test. | The final step correctly resists cost-only measurement; explicit recurring topics will make it feel like the argument's implementation. | B1–B2; C3–C5 |
| The Two Factory Disciplines | Use this as the conceptual conclusion, then let the “Series” list provide navigation. | “Ontology makes the factory coherent. Strategy makes it purposeful.” supplies a memorable close; series placement after it prevents navigation from interrupting the argument. | A; B4; C7–C9 |

## Representative sentence-level edits

These examples illustrate the editorial direction; they are not a mandate to
replace every negative or repeat the same noun mechanically.

| Before | Proposed edit | Reasoning and guidelines |
| --- | --- | --- |
| “Every company is building a factory, and *The Knowledge Factory* described its operating system…” | “A company can buy model access without building a system that retains what work teaches it.” | Narrows an unsupported universal, establishes the reader problem immediately, and gives “company” an action. **Guidelines:** A4; B1; C1–C2, C6. |
| “This essay examines how that factory thinks.” | “A cognitive factory connects evidence, decisions, evaluations, and outcomes so later work can reuse what earlier work learned.” | Replaces meta-discourse with the claim, uses an active verb, and makes “thinks” concrete. “Can” preserves the proposal's uncertainty. **Guidelines:** A4; B3–B4; C1–C2. |
| “This essay is where the organization implements the machinery that advances it down the light cone.” | “A cognitive factory is a proposed way to build the machinery that widens this practical reach.” | Removes signposting, fixes the unclear spatial phrase “advances it down,” and labels the model as proposed. **Guidelines:** A4; B4; C1–C2. |
| “This essay extends two established engineering ideas.” | “The cognitive factory joins two engineering practices: loop engineering and graph engineering.” | Names the character and action, removes self-reference, and previews the two concrete topics. “Practices” avoids implying that the article has empirically established their combined effect. **Guidelines:** A4; B1, B4; C1–C2, C8. |
| “The sections that follow are the implementation of that extension…” | “Graph context exposes relationships; executable context turns them into checks; captured outcomes update both.” | Replaces a roadmap with the causal chain and hands each clause's new information to the next. **Guidelines:** A1–A4; B2, B4; C2–C3. |
| “Graph context is a signature concept, not a generic knowledge-graph pitch.” | “Graph context treats organizational context as traversable relationships with provenance.” | Removes defensive branding and a negative construction, then states the distinctive idea affirmatively and precisely. **Guidelines:** A4–A5; B1; C1–C2. |
| “The graph may be implemented through links, metadata, schemas, code dependencies, event lineage, or a graph database.” | “Teams can represent these relationships with links, metadata, schemas, code dependencies, event lineage, or a graph database.” | Replaces passive voice with a human subject and carries “relationships” forward as old information. **Guidelines:** B1–B2; C1–C3. |
| “Documents remain important, but the factory needs context that can guide and check action.” | “Documents preserve explanations; executable context guides and checks action.” | Preserves the concession while giving each form of context a concrete action. The semicolon makes the contrast direct. **Guidelines:** A4–A5; B1; C1–C2. |
| “This is how institutional knowledge becomes productive capital rather than a larger pile of prose.” | “These contracts make institutional knowledge usable in work and testable against outcomes.” | Replaces the vague subject “This” and mixed capital/pile metaphors with the section's recurring character and observable actions. **Guidelines:** A4; B1, B3; C1–C2. |
| “The factory's return comes from a loop.” | “A cognitive factory compounds when captured outcomes change the context and evaluations used in later work.” | Defines “return” through the mechanism, puts the main character in the subject, and supplies a point sentence for the section. **Guidelines:** A4; B1–B2; C1–C3, C9. |
| “Three systems in increasing reach:” | “The table compares three illustrative configurations; their reach depends on the context, tools, permissions, evaluations, and feedback each implementation provides.” | Removes an unqualified hierarchy and states the comparison's limits before readers interpret the table. **Guidelines:** A4; B2; C5, C8. |
| “Feedback: None — the session ends” | “Retained feedback in this baseline: none; a new call starts without prior outcomes.” | Limits the claim to the defined bare-model baseline instead of implying that all LLM-based systems lack feedback. It also names what “none” means operationally. **Guidelines:** A4; B3; C4–C5. |
| “Not everything at once. A diagnostic order:” | “Build the feedback chain in diagnostic order:” | Uses an affirmative imperative, removes throat-clearing fragments, and reconnects the checklist to the article's mechanism. **Guidelines:** A1, A5; B1; C2, C8. |

## Editorial guardrail

For each revision, distinguish among **definition**, **proposal**, **diagnostic**,
and **observed evidence**. The article may define what it means by a cognitive
factory, propose a build order, and offer the light cone as a diagnostic. It
should not imply that the progression from model to agent to factory is a fixed
empirical law, that the scorecard measures cognition objectively, or that the
proposed loop necessarily compounds. Conditional verbs such as “can,” “aims
to,” and “depends on” are useful when the implementation and evidence determine
the outcome; direct affirmative language remains appropriate for the article's
own definitions.
