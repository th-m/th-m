# Writing-Guidelines Review: *Ontology Factory*

## Scope and Guideline Key

This review treats `article.md` as a published essay, not as repository
documentation to be mechanically shortened. It preserves the recurring map,
path, layer, and factory metaphors because their repetition gives the essay a
stable topic and a visual vocabulary.

- **A — Compression and precision:** prune fillers, doublets, implied words,
  and cumbersome phrases; choose exact words; prefer affirmative constructions
  unless a prohibition or contrast is the point.
- **B — Memory and attention:** keep sentence topics aligned with passage
  context, move from old to new information, use concrete or visual language,
  and remove unnecessary writing-about-writing.
- **C — Clarity at every scale:** put characters in subjects and actions in
  verbs, create sentence handoffs, keep paragraph topics coherent, move from
  simple to complex, establish a valued problem, mark section boundaries, and
  give every major unit a short index and a clear point before its discussion.

## Overall Diagnosis

The essay has a clear conceptual spine: repository root, ownership paths,
layers, identifiers, local contracts, skills, revision workflow, and finally
ontology as a revisable commitment. Concrete paths, dependency tables, and the
two diagrams make an abstract subject visible. The ending also preserves the
right uncertainty: the ontology records chosen distinctions and remains
subject to human judgment; it does not claim to mirror the domain perfectly.

The main editorial opportunity is not a new argument. It is a cleaner boundary
between the **SoundSculpt case** and the essay's **broader interpretation** of
that case. Several sentences move from a repository rule to a universal or
causal claim without marking the change in scope. The opening also delays its
compact thesis until the third paragraph and uses meta-discourse along the way,
while “The System in Motion” presents the same workflow three times. Tightening
those places would make the existing argument easier to trust and remember. **(A:
compression and precision; B: topic/context and limited meta-discourse; C:
problem–idea introduction and index/discussion.)**

## What Already Works

| Article choice | Why it works | Guidelines |
|---|---|---|
| “Ownership should be visible from the path, and dependencies should flow toward more foundational layers.” | This is a compact point sentence at the end of the introduction. It gives the reader two concepts that recur throughout the essay. | B: stable topics; C: point sentence and index/discussion |
| `apps/soundsculpt/...` “is not an address; it is a claim.” | The sentence turns a filesystem path into a visible object with an action and stakes. It is concise, memorable, and central to the thesis. | A: compression; B: visual language; C: character/action clarity |
| The root-area, layer, and dependency tables | Each table supplies a short index before the prose discusses consequences. Readers can see the ontology rather than holding a long list in working memory. | B: visual memorability; C: simple-to-complex and index/discussion |
| Repeated use of *map*, *path*, *layer*, *contract*, and *commitment* | The repetition is functional, not monotonous: it keeps sentence topics connected to the essay's context. Do not replace these terms merely for variety. | B: topic/context; C: coherent paragraph topics |
| “Where README and AGENTS say *what* and *how*, skills supply *procedure*.” | It picks up already established terms, adds one new term at the end, and becomes a clean index for the short section. | B: old-to-new flow; C: point sentence |
| “An ontology that never changes is a museum.” | The concrete museum image introduces revision without meta-discourse and gives the workflow section a memorable problem. | A: precise compression; B: visual language; C: valued problem |
| “A Commitment, Not a Mirror” and the human-judgment limitation | The conclusion correctly presents ontology as a deliberate, revisable model. The negative contrast is worth keeping because rejecting the mirror claim is the point. | A: justified negative; B: concrete contrast; C: thesis restatement |

## Prioritized Structural and Idea-Level Improvements

### 1. Mark the boundary between observed design and broader interpretation

**Suggestion.** Use three consistent scopes:

1. **Observed SoundSculpt structure:** “SoundSculpt places…,” “The repository
   requires…,” or “In this ontology…”.
2. **Interpretation:** “The essay treats this as…,” “This design makes…,” or
   “The rule functions as…”.
3. **Broader proposition:** “A knowledge factory benefits when…” or “Other
   factories could…”.

Apply that distinction especially to “Layers Are Bounded Contexts,” “State
belongs to Edge,” “Skip-but-never-ascend is what keeps the map stable under
growth,” “the factory can grow without asking permission of its own past,” and
“the thing is only real in the system when its term is stable enough to be
validated against.” Rename the layer heading to **“Layers as Bounded
Contexts”** or say that SoundSculpt *treats* the layers as bounded contexts.
Likewise, “In SoundSculpt, reactive product state belongs to `edge`” is more
exact than the unqualified “State belongs to Edge.”

**Reasoning.** The repository paths, tags, contracts, and checks are concrete
case evidence. Claims that they ensure stable growth or determine what is
“real” are interpretations. Scope markers keep the main character visible and
retain the essay's commitment-not-mirror uncertainty without weakening its
thesis. **(A: precise words; B: topic/context; C: main characters as subjects
and a clear problem–idea relation.)**

### 2. Replace the opening's essay-signposting with the concrete case

**Suggestion.** Compress the first paragraph so that `SoundSculpt` or “the
SoundSculpt repository” becomes the subject by the second sentence. Keep the
series connection to *The Knowledge Factory* to one clause, then move directly
to the visible fact: the ontology lives in repository structure. Let the
second paragraph establish the cost of missing ownership and dependency rules,
and retain the current bold thesis as the point sentence.

**Reasoning.** Phrases such as “This essay is the first
implementation-oriented deep dive,” “the factory whose map we inspect,” and
“This essay reads the idea as” describe the essay rather than the object. The
case itself provides a stronger index: familiar context, concrete repository,
problem, cost, and idea. **(A: prune and compress; B: limit meta-discourse and
move from concrete old information to the new ontological reading; C:
status-quo/problem/cost/idea introduction.)**

### 3. Give the entire essay one explicit progression

**Suggestion.** At the end of the opening, add one compact orienting sentence
only if testing shows readers lose the sequence: “The map starts with ownership,
adds layers and names, then becomes operational through contracts, skills, and
verification.” Do not enumerate every heading.

**Reasoning.** The present order is strong, but the transition from structural
ontology (`apps/`, `libs/`, layers, identifiers) to operational ontology
(README, AGENTS, skills, workflow) is implicit. One sentence would expose that
simple-to-complex progression without the dullness of a conventional “this
essay will discuss” roadmap. **(A: compression; B: sparing, journey-like
orientation; C: clear major-unit index and simple-to-complex order.)**

### 4. Compress “Description and Operation” around the conceptual contrast

**Suggestion.** Keep the README/AGENTS contrast as the section's point. Reduce
the two exhaustive prose inventories to representative enforced rules, or use
a compact two-row comparison with columns for **contract**, **question
answered**, **required structure**, and **enforcement**. Preserve exact details
only when a later claim depends on them.

**Reasoning.** The current README paragraph strings together many semicolon
separated rules, and the AGENTS paragraph follows with another long inventory.
Those details obscure the important new idea: description and operation are
separate, colocated, executable contracts. A comparison would make their
relationship visible and lower cognitive load while retaining verifiable
examples. **(A: prune inventories and compress; B: visual memory and stable
topics; C: short index before complex discussion.)**

### 5. Present the revision workflow once, then interpret it once

**Suggestion.** Keep the numbered list because it supplies useful ownership
and verification detail. Either delete the preceding arrow sequence or shorten
it to the three conceptual phases **route → change → prove**. Replace the final
paragraph's full restatement with one interpretive sentence explaining why the
workflow belongs to the ontology.

**Reasoning.** The arrow sequence, nine-step list, and “observation → ontology
commitment → implementation → evaluation → revision” paragraph repeat the same
material under different labels. One concrete procedure plus one interpretation
will be more memorable than three indexes for the same discussion. **(A:
remove redundancy; B: topic continuity; C: index/discussion at the section
scale.)**

### 6. Add one short, explicitly illustrative path through the whole system

**Suggestion.** Reuse the existing
`libs/edge/audio/state-zustand-player` example in “The System in Motion.” In
two or three sentences, show how its path identifies ownership, its layer
constrains dependencies, its local contracts guide work, and verification
produces evidence. Label it as an illustration rather than a reported change;
do not invent a bug, result, team, or metric.

**Reasoning.** The article explains each component concretely but leaves their
integration abstract. Reusing an existing path would let readers picture one
object moving through the entire ontology without adding unsupported facts.
**(B: visual, human-scale memory and old-to-new handoff; C: concrete character
and action, with discussion built from an established example.)**

### 7. Preserve the conclusion's limitation in affirmative form

**Suggestion.** Keep “A Commitment, Not a Mirror,” but consider changing “None
of this replaces human judgment” to “Human judgment still decides whether the
map's distinctions remain useful.” Follow it with the existing benefits:
shareable, testable, contextual judgment.

**Reasoning.** The proposed sentence states the responsible actor and action,
preserves fallibility, and makes clear that enforcement checks consistency
rather than proving that the ontology is a perfect model. **(A: affirmative
voice; B: stable topic; C: character in subject position and action in the
verb.)**

## Section and Paragraph Flow

| Location | Suggested flow change | Reasoning and guideline |
|---|---|---|
| **A Map of the Factory Itself**, paragraph 1 | Move from the prior essay's “knowledge factory” directly to SoundSculpt, then end on “repository itself.” | This creates a clean old-to-new relay and removes essay-level throat clearing. **(A: compression; B: old-to-new and less meta-discourse.)** |
| **A Map of the Factory Itself**, paragraph 2 | Keep “Maps are easy to imagine for products,” but make “which definition controls a decision, and who decides” the bridge to repository ownership. | The decision problem should cause the factory-map problem rather than appear beside it. **(B: sentence handoff; C: valued problem before solution.)** |
| **Ownership in the Path**, app paragraph | Keep `Applications` as the subject through the description; then pivot once to reusable `capabilities` and finish on the path-as-claim image. | The paragraph already has a strong endpoint; one explicit pivot will prevent “apps,” “rule,” “composition,” “capability,” and “behavior” from competing as topics. **(B: two skis; C: coherent subjects.)** |
| **Layers as Bounded Contexts**, assignment paragraph | Start with “Within SoundSculpt's ontology…” and keep “layer assignment” as the subject of the next two sentences. | It grounds the rule in the case and carries old information forward before introducing dependency consequences. **(A: precision; B: old-to-new; C: coherent topics.)** |
| **Layers as Bounded Contexts**, final two paragraphs | State the enforceable rule first, then separate the benefit as an interpretation: “This constraint helps…” | A checkable repository fact should precede the causal claim drawn from it. **(A: exact scope; C: simple evidence before complex inference.)** |
| **A Vocabulary for Identifiers**, final paragraph | Let “stable vocabulary” remain the topic: human-readable path → machine-readable identity → validation. Replace the “only real” claim with a checkable tooling action. | The proposed sequence preserves the human/tooling relay and avoids metaphysical overstatement. **(A: exact wording; B: topic/context; C: actions in verbs.)** |
| **Description and Operation**, README/AGENTS paragraphs | Use parallel sentence shapes: “A README describes…” / “An AGENTS file directs…”. Follow each with representative rules. | Parallel main characters make the comparison immediately legible. **(B: visual pattern and stable topics; C: characters as subjects.)** |
| **Skills Supply Procedure** | Keep the opening and closing almost unchanged; trim the frontmatter inventory if the preceding contracts section remains detailed. | The section is already a strong short index/discussion unit. Further detail risks repeating the general enforcement point. **(A: pruning; C: index/discussion.)** |
| **The System in Motion** | Numbered procedure → one existing-path illustration → one sentence interpreting the maintenance cycle. | Readers move from index to concrete discussion to significance, without three restatements. **(B: visual memory; C: index/discussion and simple-to-complex.)** |
| **A Commitment, Not a Mirror** | Keep the summary paragraph, then put “Human judgment…” at the start of the final paragraph and close on the current “world clear enough to speak about” image. | The affirmative actor states the limitation cleanly, and the image supplies a memorable final new idea. **(A: affirmative voice; B: old-to-new and visual ending.)** |
| **Sources** | Keep the annotations, but vary only the verbs when the evidentiary role truly differs: *defines*, *grounds*, *documents*, or *offers an analogy*. | Exact role labels distinguish primary conceptual support, implementation documentation, and a service-scale comparison. **(A: precise words; C: clear idea relationships.)** |

## Representative Sentence-Level Edits

These are models for a revision pass, not instructions to flatten every
rhetorical contrast. In particular, retain “must never point upward” and “not
a mirror”: each negative carries the warning or thesis.

### 1. Open on the object, not the essay

**Before**

> This essay is the first implementation-oriented deep dive into that system's
> semantic infrastructure, and it makes the subject concrete. The factory whose
> map we inspect is a real one — the SoundSculpt repository — and its ontology
> is not stored in a diagram somewhere. It is the structure of the repository
> itself.

**Proposed edit**

> SoundSculpt makes that semantic infrastructure concrete. Its ontology is not
> a diagram in a wiki; it is the structure of the repository itself.

**Reasoning.** The edit makes SoundSculpt the character, turns *makes* and *is*
into the main actions, removes meta-discourse, and compresses three sentences
without losing the diagram/repository contrast. **(A: pruning and exact words;
B: visual language and less signposting; C: character/action clarity.)**

### 2. State the interpretive move directly

**Before**

> This essay reads the idea as an ontology and shows what a factory gains when
> it enforces one.

**Proposed edit**

> Together, those rules form SoundSculpt's repository ontology: an enforceable
> map of ownership, dependency, and accountability.

**Reasoning.** The edit replaces writing-about-writing with the actual claim
and repeats the introduction's established terms. It also limits the sentence
to the SoundSculpt case instead of promising a universal gain. **(A:
compression and precision; B: topic/context and no meta-discourse; C: point
sentence.)**

### 3. Turn a negative definition into a positive commitment

**Before**

> The list is stable enough to read as a policy. Nothing about these boundaries
> follows from technology; they are decisions, which is exactly what makes them
> ontology.

**Proposed edit**

> These boundaries encode policy rather than technological necessity. Their
> deliberate placement makes them ontological commitments.

**Reasoning.** *Encode* and *placement* name the actions precisely, the second
sentence picks up “boundaries” through “their,” and *commitments* anticipates
the conclusion. **(A: precise, affirmative compression; B: old-to-new handoff;
C: actions in verbs.)**

### 4. Ground the layer rule in this ontology

**Before**

> Assigning a concept to a layer is not a matter of taste; it is a semantic
> commitment. State belongs to Edge. Canonical entities belong to Schema.
> Deterministic execution belongs to Engine. Product-neutral mechanisms belong
> to Platform.

**Proposed edit**

> Within SoundSculpt's ontology, assigning a concept to a layer makes a semantic
> commitment. Reactive product state belongs to `edge`; canonical entities to
> `schema`; deterministic execution to `engine`; and product-neutral mechanisms
> to `platform`.

**Reasoning.** The scope marker prevents a local architecture rule from reading
as a universal ontology claim. “Reactive product state” is more exact than
“State,” and one parallel sentence makes the mapping easier to scan. **(A:
precision, compression, and affirmative voice; B: stable topic; C:
simple-to-complex mapping.)**

### 5. Separate a rule from its intended benefit

**Before**

> Skip-but-never-ascend is what keeps the map stable under growth.

**Proposed edit**

> In SoundSculpt, skip-but-never-ascend helps keep the map stable as the system
> grows.

**Reasoning.** *Helps* retains the design's intent without presenting one rule
as a sufficient cause of stability. The case marker also distinguishes the
observed commitment from the broader design lesson. **(A: exact causal
language; B: topic/context; C: evidence-to-idea clarity.)**

### 6. Make identifier value operational

**Before**

> A name is the ontology's term for a thing, and the thing is only real in the
> system when its term is stable enough to be validated against.

**Proposed edit**

> A stable name lets people and tooling identify, query, and validate the same
> repository concept.

**Reasoning.** The edit replaces an abstract claim about what is “real” with
the concrete operations established in the preceding paragraph. It also makes
the actors and verbs visible. **(A: compression and precise words; B: concrete
language; C: characters in subjects and actions in verbs.)**

### 7. Compress the README rule inventory

**Before**

> The shape is enforced by executable rules: exactly one H1; exactly the
> required H2s — `Purpose`, `Boundaries`, `Ontology` — in order, with no
> additional H2s; every required section nonempty; at least one local term
> defined in the ontology; optional H3s limited to `Relationships` then
> `Behavioral Semantics`; local links and anchors that must resolve; and shared
> concepts linked to their owner rather than copied.

**Proposed edit**

> Executable rules require each README to define `Purpose`, `Boundaries`, and
> `Ontology` in order, include a local term, resolve its links, and point shared
> concepts to their owner. Additional heading constraints keep that structure
> consistent.

**Reasoning.** The edit retains representative evidence of enforcement while
moving secondary schema detail out of the main sentence. The main actions —
*define*, *include*, *resolve*, and *point* — now appear as verbs. **(A: prune
and compress; B: manageable old-to-new sequence; C: actions in verbs.)**

### 8. Remove a repeated negative construction

**Before**

> A violation is caught like a lint error, not discovered months later by a
> confused reader.

**Proposed edit**

> The checker catches a violation immediately, like a lint error, before it can
> confuse a later reader.

**Reasoning.** The checker becomes the actor, *catches* becomes the action, and
the timing remains vivid without asking readers to reverse “not discovered.”
If the contrast is preferred for rhythm, the original is also defensible.
**(A: affirmative voice; B: concrete human consequence; C: character/action
clarity.)**

### 9. Interpret the workflow without reciting it again

**Before**

> The loop is a maintenance cycle made concrete: an observation (a request, or
> a check that fails), an ontology commitment (the contracts that route the
> work), implementation, evaluation (verification that binds proof to the exact
> change), and revision (review, merge, and an evidence card that lets the
> learning accumulate).

**Proposed edit**

> Together, these steps make ontology maintenance executable: contracts route
> the change, verification binds proof to it, and the evidence card preserves
> what the factory learned.

**Reasoning.** “These steps” picks up the numbered list as old information;
the rest adds only the section's interpretive point. Parallel actors and verbs
also make the causal chain easier to retain. **(A: remove redundancy; B:
old-to-new flow; C: main characters and actions.)**

### 10. Preserve uncertainty with a visible actor

**Before**

> None of this replaces human judgment. It is how human judgment becomes
> shareable, testable, and available in context — for the next engineer, for
> the next review, and for the next model asked to change the system.

**Proposed edit**

> Human judgment still decides whether the map's distinctions remain useful.
> The contract system makes that judgment shareable, testable, and available
> in context — for the next engineer, review, or model asked to change the
> system.

**Reasoning.** The revision keeps the limitation, names the question enforcement
cannot settle, and assigns clear actions to human judgment and the contract
system. It also compresses the closing triad without erasing its audiences.
**(A: affirmative voice and compression; B: stable topics; C:
character/action clarity.)**

## Recommended Revision Order

1. Calibrate case-specific, interpretive, and general claims.
2. Compress the opening and retain its current bold thesis.
3. Reduce the README/AGENTS inventories and the repeated workflow explanation.
4. Add the short existing-path illustration if the article still feels
   abstract in motion.
5. Apply the representative sentence edits, preserving purposeful negatives
   and repeated key terms.

This order addresses argument trust and document-level clarity before local
polish. **(C: idea and section structure before sentence technique.)**
