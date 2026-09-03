# Rendered HTML Writing-Guidelines Review: *Vision and Values*

## Review surface

This review treats the rendered React article—not `article.md`—as the source of
truth. The reviewed surface was the local route
`/writing/vision-and-values`, generated from the current
`index.tsx`. The browser's rendered DOM contained approximately 2,869 article
words, seven numbered H2 sections, and five figures.

The rendered structure differs materially from `article.md`:

- Section 02 contains 1,056 words, about 37 percent of the rendered article,
  and combines model mechanics, the limits of language, and implicit judgment.
- The visible section sequence jumps from `02` to `04`.
- One of the five figures is explicitly labeled and captioned as a
  “Visualization placeholder.”
- The page contains an interactive neural-training explanation, a value
  ladder, a goal tree, a strategy map, a governing-values loop, tooltips, and
  linked conversation previews that must be evaluated in their rendered
  reading order.

No recommendation below assumes that `article.md` will be copied into this
page. The HTML article should be edited on its own terms.

## Guideline key

- **A1 — Prune filler:** remove throat-clearing and conversational padding.
- **A2 — Remove doublets:** choose the stronger of two equivalent words or
  clauses.
- **A3 — Cut redundancy:** remove modifiers and phrases already implied by the
  concrete facts.
- **A4 — Choose exact words:** prefer the narrowest defensible term over a
  vivid but inaccurate generalization.
- **A5 — Prefer the affirmative:** state the usable proposition directly,
  while retaining negatives when a warning or boundary is the point.
- **B1 — Keep topic and context aligned:** use a small set of recurring,
  concrete sentence subjects that sustain the section's larger subject.
- **B2 — Move old information to new information:** begin from what the reader
  already has and end with the idea the next sentence will develop.
- **B3 — Make ideas visible:** favor people, actions, consequences, examples,
  and controlled visual metaphors over ungrounded abstractions.
- **B4 — Limit meta-discourse:** remove narration about the essay, series, or
  authoring process unless it helps the reader cross a real boundary.
- **C1/C2 — Put characters in subjects and actions in verbs:** let people,
  organizations, models, goals, values, and strategies perform the action.
- **C3/C4/C5 — Build cohesion and coherence:** create sentence handoffs,
  repeat a controlled set of topics, and move from familiar material to more
  complex material.
- **C6 — Establish a consequential problem:** give the reader a status quo,
  concession, destabilizing condition, cost, and proposed answer.
- **C7/C8/C9 — Shape major units:** use meaningful boundaries, a short opening
  index, and a point sentence before each unit's detailed discussion.
- **C10 — Index, then discuss:** apply a compact orienting claim followed by
  development at document, section, paragraph, and figure scale.

## Overall diagnosis

The rendered essay contains a stronger visual and conceptual argument than the
Markdown review could see. The failed-plan scene, animated training example,
value ladder, support-ticket comparison, strategy map, and governing-values
loop give the reader concrete objects to remember. The central normative claim
is also valuable: prediction can expand and execute a solution space, but it
does not confer legitimate authority to choose the values that define that
space.

The main weakness is not that the page explains language models. That
explanation belongs here because it supports the two-compressions argument. The
weakness is that Section 02 lacks one stable job. It begins as a model tutorial,
turns into a categorical argument about thought and consciousness, shifts to
language's omissions, moves through a workplace anecdote, and ends with a
taxonomy of value-laden words. The section's visible size and changing subjects
make model mechanics compete with the essay's governing topics: experience,
values, wisdom, strategy, authority, and corrigibility.

The highest-value revision is therefore **separation plus calibration**:

1. keep Section 02 as a compact, technically accurate account of tokens,
   training, weights, and inference;
2. promote “What Language Leaves Out” and “Judgments hidden in ordinary
   language” into the missing Section 03;
3. make Section 03 explicitly develop experience, values, and wisdom; and
4. remove categorical side claims that the normative argument does not need.

That change preserves the interactive explanation, fixes the visible numbering
gap, restores a simple-to-complex progression, and makes every technical detail
serve the values argument. **Guidelines: A3, A4, B1, B2, C4, C5, C7–C10.**

## What already works and should be preserved

1. **The nine-hour plan is an effective opening scene.** The prompt, pages of
   validation gates, hidden contradictions, and inability to review the result
   make the cost of omitted judgment visible. Preserve the dry line “Of course
   I blame the agent.” **Why:** the reader meets a person, an action, an object,
   and a consequence before encountering the abstraction. **Guidelines: B3,
   C1, C2, C6.**

2. **“What I actually wanted was narrower” is the introduction's strongest
   paragraph.** Material gaps, proportional validation, team executability,
   and a stopping condition reveal the priorities hidden inside `optimize`.
   **Why:** the paragraph demonstrates value judgments through observable
   tradeoffs rather than defining them abstractly. **Guidelines: A4, B2, B3,
   C3.**

3. **The core-thesis card provides a real reading boundary.** Its parallel
   opening—experience, values, strategy—gives the page an index that the later
   sections can develop. Preserve the card while sharpening its final claim
   and restoring wisdom's role. **Why:** the card is both semantic structure
   and visual emphasis. **Guidelines: B1, C7, C9, C10.**

4. **The neural-training figure earns its space.** The token probabilities,
   numerical loss, training steps, and caption make an otherwise abstract
   mechanism visible. Preserve the figure and the short distinction “Training
   changes the weights. Inference uses them.” **Why:** this is the rendered
   article's clearest technical index/discussion unit. **Guidelines: B3, C5,
   C8–C10.**

5. **The coworkers using `quality`, `safe`, and `done` are the right bridge
   from people to AI.** Their misunderstanding establishes the language problem
   without making it uniquely an AI failure. **Why:** familiar characters and
   actions turn semantic underdetermination into a scene the reader can
   recognize. **Guidelines: B1–B3, C1–C3.**

6. **The judgment table and value ladder should remain together.** The table
   indexes kinds of implicit judgment; the ladder then shows how a value
   becomes an operational procedure. **Why:** the rendered sequence already
   moves from category to visible transformation. **Guidelines: B3, C5,
   C10.**

7. **The support-ticket example makes governing goals concrete.** The same
   observation becomes a margin, retention, or learning issue depending on the
   goal. Preserve the example and the governing/instrumental distinction.
   **Why:** it demonstrates the essay's thesis without needing a new empirical
   claim. **Guidelines: A4, B3, C1, C6.**

8. **The strategy prose is correctly placed beneath the strategy map.** The
   discussion of customers, employees, partners, regulators, time, and
   competing goals arrives at its visual referent rather than in a detached
   preamble. Preserve that placement. **Why:** the figure becomes the index and
   the prose becomes its discussion. **Guidelines: B2, B3, C3, C10.**

9. **“The system becomes coherently wrong” is memorable and earned.** The
   governing-values loop and consequence table develop the claim rather than
   merely decorating it. Preserve the phrase, loop, and false-evaluative-
   closure explanation. **Why:** the section keeps one causal topic visible
   across claim, figure, examples, and consequence. **Guidelines: B1, B3,
   C3, C4, C10.**

10. **The corrigibility and translation lists are practical conclusions.**
    Direct observation, protected disagreement, affected perspectives,
    escalation, explicit priorities, tests, and revisable feedback prevent the
    essay from treating human judgment as infallible. **Why:** the lists turn
    normative authority into accountable practices. **Guidelines: A4, C2,
    C6, C10.**

## Prioritized structural and idea-level improvements

### P0 — Remove visible draft residue and repair continuity errors

Make these corrections before stylistic polishing:

- Replace or remove the public figure whose accessible label, data attribute,
  and caption all say “Visualization placeholder.” A published placeholder
  interrupts trust at the exact point where the article needs a memorable
  two-compressions visual.
- Restore Section 03. The strongest solution is to promote “What Language
  Leaves Out” and “Judgments hidden in ordinary language” into a new numbered
  section rather than renumbering every later unit.
- Change `optimal` in the conclusion back to the prompt's actual word,
  `optimize`.
- Correct “AI researches” and the ungrammatical “It doesn't reason not like
  people.”
- Remove the unattributed “map is the territory” line unless the article names
  and accurately uses a source. As rendered, it reads like a malformed slogan,
  not an advancing claim.
- Standardize `judgment`; the rendered page alternates with `judgement`.
- Reconcile the source note claiming that *Attention Is All You Need*
  supports an “attention and feed-forward account above.” The rendered body
  contains no such account. Either add only the explanation the argument needs
  or narrow the annotation to the Transformer's relevance to modern language
  models.

**Reasoning:** These are reader-visible coherence and trust failures. They
cannot be repaired through rhythm or compression alone. **Guidelines: A4, B1,
C3, C7.**

### P0 — Remove claims that outrun the essay's evidence or purpose

The values argument does not require the page to settle thought,
consciousness, meaning, copyright, or the full ontology of model capability.
Narrow or remove the following claims:

- “A model never experiences anything.”
- “A model is not conscious.”
- “It does not distill meaning.”
- “There is no evidence to suggest anything beyond” probabilistic prediction.
- “Even after stealing all content on the internet...”
- “AI cannot ... meaningfully author values.”

Replace them with the limit the essay can use consistently: model output does
not provide direct access to a person's private experience, intended value
hierarchy, or legitimate authority. A system may propose, represent, rank, or
enact values; the people and institutions accountable for consequences must
authorize and revise which values govern.

**Reasoning:** Exact scope makes the normative argument stronger. It avoids
turning a practical claim about authority into an unnecessary metaphysical or
legal dispute, and it aligns the page with the dedicated consciousness essay's
uncertainty. **Guidelines: A1, A4, B1, C5, C6.**

### P1 — Make the document-level progression explicit

Use this article spine:

1. **Prompt:** a procedural instruction hides priorities.
2. **Model:** training learns patterns from recorded language.
3. **Experience:** recorded language omits part of the experience and judgment
   that produced it.
4. **Values and wisdom:** people identify stakes, negotiate tradeoffs, and
   revise priorities through consequences.
5. **Goals and strategy:** those priorities create opportunity and solution
   spaces.
6. **Authority and corrigibility:** legitimate values remain answerable to the
   people affected by them.
7. **Language and feedback:** explicit definitions, constraints, evidence, and
   revision make judgment inspectable.

The current page contains nearly all of this material, but the second and third
steps are fused while wisdom is mostly absent. Give each step a visible section
or point sentence and repeat its core subject through the relevant paragraphs.

**Reasoning:** the sequence moves from a familiar failure to mechanism, then
from mechanism to the human normative response. Each unit begins with the prior
unit's new information. **Guidelines: B1, B2, C3–C5, C7–C10.**

### P1 — Move the thesis before the study's detail

After “What I actually wanted was narrower,” state the prompt-level point:

> The prompt specified procedures but omitted the values that would make one
> result better than another.

Then use the strategic-advice study as corroboration. Keep its limitation next
to the findings and let the six governing questions lead into the expanded
core-thesis card.

**Reasoning:** the anecdote has already supplied the status quo, disruption,
and cost. A point sentence gives readers the idea before the research detail;
the study then expands rather than delays that idea. **Guidelines: B2, C3, C6,
C9, C10.**

### P1 — Give Section 02 one job: explain what the model carries

Rename the section **“What a Language Model Carries.”** Open with a compact
index:

> A language model learns statistical relationships from human-produced text.
> Training encodes those relationships in weights; inference uses the weights
> and current context to predict a continuation. The important limit for this
> essay appears before training: experience and judgment have already been
> translated into incomplete language.

Keep the reversible token flow, numerical cross-entropy example, animation,
and training/inference distinction. Remove the godlike-oracle detour and the
general commentary about vocabulary. Move the coworker example, implicit-
judgment table, value ladder, and discussion of what language omits to Section
03.

Make the technical discussion end on the exact handoff:

> Cross-entropy rewards probability assigned to the observed continuation; it
> does not verify that the continuation recovers an author's unspoken motive or
> intended priority.

**Reasoning:** the page retains its distinctive teaching figure while every
technical detail advances the two-compressions argument. Model, training,
weights, and inference remain the stable topics until “unspoken motive” becomes
the new information Section 03 develops. **Guidelines: A1, A3, A4, B1, B2,
C3–C5, C8–C10.**

### P1 — Use the missing Section 03 for experience, values, and wisdom

Promote the relevant Section 02 subsections into:

> **03 — Experience, Values, and Wisdom**

Open with the two-compressions pipeline:

> lived experience → motivation and judgment → language → training corpus →
> learned weights → inferred continuation

Then develop four ideas in order:

1. language represents only part of lived experience;
2. people also infer different meanings from shared words;
3. ordinary evaluative language carries judgments; and
4. wisdom integrates competing judgments and revises them after consequences
   arrive.

Use the coworkers as the recurring characters, then move to the judgment table
and value ladder. End with the point that operational precision makes a value
easier to enact but does not make it legitimate.

**Reasoning:** this fixes the visible numbering gap, restores the human subject
of the essay, and makes “judgment” the old information that Section 04's goals
and opportunity spaces operationalize. **Guidelines: B1–B3, C1–C5,
C7–C10.**

### P1 — Distinguish system behavior from model self-description

The linked ChatGPT, Claude, and DeepSeek conversations are interesting examples
of generated self-description, but they do not reveal a model's operative
hierarchy directly. Introduce them as outputs under particular prompts, then
move quickly to the more defensible source table: training data,
post-training, instructions, policy, user context, tools, permissions, and
evaluation.

Prefer **“layered priorities”** or **“operative priorities”** over the broad
opening “Every AI system operates with an implicit value hierarchy.” Then let
the source table show how a deployed system's behavior is shaped.

**Reasoning:** the article should not ask generated prose to authenticate its
own causes. The rendered conversation previews can remain illustrative without
bearing evidentiary weight. **Guidelines: A4, B1, B2, C5.**

### P2 — Preserve the strategy map but simplify its discussion

Keep the prose beneath the figure. Replace the two rhetorical questions about
partners, customers, subgoals, and competitors with one compact scenario or a
direct point:

> Strategy weighs relational effects, consequences over time, and tradeoffs
> among people whose goals can conflict. Encoding those priorities in a prompt
> makes them more explicit; it does not delegate legitimate authority to the
> model.

Replace “experiential change for a target audience” with people and
consequences. For example:

> Prediction alone cannot decide which goal deserves authority. Governing
> goals must remain answerable to the people who experience their consequences.

**Reasoning:** the figure already contains the competing parties. The prose
should interpret that visual once, with stable topics and concrete stakes,
rather than reopen it through several questions. **Guidelines: A1, A3, A4,
B1–B3, C3.**

### P2 — End by resolving the opening, not reopening the study

Move the counterfactual study hypothesis beside the study or label it there as
a proposed follow-up. In the conclusion, correct `optimal` to `optimize`, name
the hierarchy the prompt implicitly rewarded, and end on the durable division
of responsibility:

> Human experience reveals what can matter. Values determine what should
> matter. Wisdom keeps those judgments answerable to consequences. Strategy
> turns them into coordinated action. AI can help explore and execute the
> resulting solution space, but people accountable for the consequences must
> authorize and revise the values that govern it.

**Reasoning:** the ending returns to the failed plan and completes the essay's
experience → values → wisdom → strategy progression. The study no longer
interrupts the resolution with an unanswered experiment. **Guidelines: A3,
A4, B1, B2, C3, C9, C10.**

## Rendered section and flow recommendations

| Rendered location | Suggested action | Reasoning and guideline |
| --- | --- | --- |
| Header | Keep the title, description, dates, and topic tags. | The description already states the reader problem and governing actors concisely. **C6, C9.** |
| Section 01, failed-plan paragraph | Keep the facts; remove stacked modifiers such as “impractically,” “reasonably,” “as a whole,” “incoherent,” and “completely” where the scene already proves failure. | Concrete evidence carries the judgment with less cognitive load. **A1, A3, B3.** |
| Section 01, study transition | State the prompt-level thesis before the study, then describe the finding as one bounded evaluation rather than a property of all strategic advice. | Index first; evidence second. **A4, B2, C6, C9, C10.** |
| Core-thesis card | Restore wisdom between values and strategy; replace “author values” with authority and accountability language. | The card becomes the document's complete conceptual index. **A4, B1, C9.** |
| Section 02 opening | Replace the three current paragraphs with the compact model/training/inference index; remove the slogans and categorical consciousness claims. | One topic and one purpose prepare readers for the animation. **A1–A4, B1, C8–C10.** |
| Training figure | Keep the caption before or immediately with the interactive; verify that screen-reader users receive a concise summary before detailed node/connection telemetry. | The rendered DOM exposes extensive figure detail. A short index should precede optional discussion at figure scale. **A3, C10.** |
| Cross-entropy close | End on what the objective scores and what it cannot validate about unspoken intent. | The new concept becomes the old information of Section 03. **A4, B2, C3.** |
| Public placeholder | Replace it with the full two-compressions pipeline or remove the figure wrapper until the visual exists. | Draft residue breaks the published reading experience and wastes the essay's best visual opportunity. **B3, C7, C10.** |
| Section 03 | Promote language omissions, coworkers, judgment table, value ladder, and wisdom into a numbered human-centered section. | This repairs numbering and topic/context alignment. **B1–B3, C4, C7–C10.** |
| Section 04 | Keep the opening definitions, goal tree, support-ticket example, governing/instrumental distinction, strategy map, and post-map prose. Compress the rhetorical tradeoff paragraph. | The section already follows index → example → distinction → visual discussion. **B2, B3, C10.** |
| Section 05 opening | Treat model self-descriptions as illustrations; make the layered sources of behavior the actual evidence. | Generated claims about a model's own values cannot establish their causes. **A4, C5.** |
| Section 05, wrong-values transition | Replace the universal “same downstream consequences” statement with a conditional causal sentence. | Exact causal scope preserves the strong “coherently wrong” point. **A4, B2.** |
| Section 06 opening | Change “Human values cannot guide an AI while remaining private” to “To guide AI, people must translate values into...” and retain the list. | The affirmative version names the actor and action before the useful discussion. **A5, C1, C2.** |
| Section 06 handoff | Compress the two-paragraph series preview into one sentence linked to *Truth and Inference*. | One handoff is useful; a mini-introduction to the next essay delays this essay's close. **A3, B4, C7.** |
| Section 07 | Return to `optimize`, identify the omitted hierarchy, move the new study hypothesis earlier, and end on accountable human revision. | The conclusion should resolve the opening scene and deliver one point. **B2, C3, C9.** |
| Section 08 Sources | Keep the provenance boundary but consider styling Sources as an unnumbered appendix rather than the eighth argumentative movement. Reconcile annotations with claims actually present in the HTML. | Sources are essential evidence, but they are not another step in the conceptual sequence. **A4, B4, C7.** |

## Representative sentence-level edits

These examples show the direction of a prose pass. Paragraph-level handoffs
should determine the final wording.

### 1. Let the plan demonstrate its own excess

**Before**

> Nine hours later, it returned an impractically large plan: pages of phases,
> dependencies, validation gates, and Markdown checkboxes—too much for a person
> to reasonably read and review as a whole. Buried in that volume were
> contradictions that made the plan incoherent and completely unusable.

**Proposed edit**

> Nine hours later, it returned pages of phases, dependencies, validation
> gates, and Markdown checkboxes—more than one person could review. The volume
> also hid contradictions that made the plan unusable.

**Reasoning:** the visible pages and hidden contradictions already establish
scale and failure. The second sentence begins with the volume just introduced
and ends on its consequence. **Guidelines: A1, A3, B2, B3, C3.**

### 2. Preserve the joke without the filler

**Before**

> It was basically malicious compliance.

**Proposed edit**

> It looked like malicious compliance.

**Reasoning:** “basically” is filler; “looked like” preserves the voice without
asserting model intent. **Guidelines: A1, A4.**

### 3. Assign the hidden priorities accurately

**Before**

> A polished recommendation can conceal the priorities a model supplied for
> itself.

**Proposed edit**

> A polished recommendation can conceal priorities implicit in the prompt,
> training, instructions, and evaluation.

**Reasoning:** the revision removes anthropomorphic authorship and previews the
layered sources Section 05 will develop. **Guidelines: A4, B2, C3.**

### 4. Restore the full normative progression

**Before**

> Human experience reveals what can matter. Values determine what should
> matter. Strategy negotiates trade-offs between competing values, risks,
> resources, and time horizons.

**Proposed edit**

> Human experience reveals what can matter. Values determine what should
> matter. Wisdom integrates competing values and revises them as consequences
> arrive. Strategy turns those judgments into coordinated action.

**Reasoning:** each sentence begins with the prior sentence's new concept and
gives wisdom a distinct function between valuation and execution.
**Guidelines: A4, B1, B2, C1–C4.**

### 5. Replace the unstable model introduction

**Before**

> Technically, an LLM is just a large file with a bunch of weights. Those
> weights represent a compressed statistical model of patterns in human
> language. It doesn't “think” and it doesn't “reason” not like people. It
> simply operates on patterns.

**Proposed edit**

> A language model learns statistical relationships from human-produced text.
> Training encodes those relationships in weights; inference uses the weights
> and current context to predict a continuation.

**Reasoning:** the revision removes throat-clearing, a reductive file metaphor,
an ungrammatical double negative, and an unnecessary claim about thought. It
ends on the process the section will explain. **Guidelines: A1, A3, A4, A5,
B1, C1–C3, C8.**

### 6. Remove the loaded corpus aside

**Before**

> Even after stealing all content on the internet, its training data is
> incomplete, historically situated, and further constrained by post-training.

**Proposed edit**

> Even a vast training corpus remains incomplete, historically situated, and
> shaped by post-training.

**Reasoning:** the revision preserves the needed premise while removing a
universal legal and empirical claim that the paragraph does not establish.
**Guidelines: A1, A4, B1, C1.**

### 7. State exactly what cross-entropy does not validate

**Before**

> Repeated across an enormous body of language, the training process adjusts
> billions of parameters, or weights, distilling statistical information into
> learned patterns. It does not distill meaning.

**Proposed edit**

> Repeated across a large corpus, training adjusts model weights to preserve
> predictive relationships. That objective does not verify whether a
> continuation recovers an author's unspoken motive or intended priority.

**Reasoning:** “meaning” is too broad for the mechanism described. The proposed
limit is narrower, observable in the essay's argument, and provides the handoff
to language and judgment. **Guidelines: A4, B2, C2, C3.**

### 8. Remove the unsupported totalizing inference

**Before**

> However remarkable the capabilities that emerge, the underlying process
> remains probabilistic prediction across learned patterns. There is no
> evidence to suggest anything beyond that.

**Proposed edit**

> Training optimizes next-token prediction; inference uses the learned weights
> and runtime context. Neither process reveals which unspoken priorities the
> author intended.

**Reasoning:** the edit states the technical mechanism and the exact
values-specific limit without pretending to settle every interpretation of
emergent capability. **Guidelines: A3, A4, B1, B2, C3.**

### 9. Replace the oracle detour with the two-compressions point

**Before**

> Could a sufficiently capable LLM become a god-like oracle? Ask one, “What is
> my purpose?” There is some nonzero chance it returns the right answer. Even if
> it did, it could not intend for you to live a purposeful life.

**Proposed edit**

> Model inference begins after experience has already been translated into
> language. It can recover plausible motives from that language, but it cannot
> directly inspect the private experience or judgment the words omit.

**Reasoning:** the revision restores the section's topic, removes an
unanswerable speculative question, and introduces the pipeline that follows.
**Guidelines: A1, A4, B1, B2, C3.**

### 10. Preserve uncertainty about consciousness

**Before**

> A model is not conscious. It cannot directly observe motivations or a private
> judgment or know that its inference is correct.

**Proposed edit**

> This argument does not depend on whether a model is conscious. Its operative
> limit is narrower: generated language does not directly expose another
> person's motivation, private judgment, or intended hierarchy.

**Reasoning:** the revision aligns the link with the dedicated consciousness
essay, fixes the faulty parallelism, and keeps the only limit this essay needs.
**Guidelines: A4, B1, C5, C6.**

### 11. Give ordinary language a precise action

**Before**

> Common language often smuggles in unintended value judgements.

**Proposed edit**

> Ordinary evaluative words carry implicit judgments.

**Reasoning:** the revision removes the intentional “smuggling” metaphor,
standardizes “judgments,” and provides a compact point sentence for the table.
**Guidelines: A1, A4, B1, C1, C2, C9.**

### 12. Make strategy act

**Before**

> A strategy coordinates cognitive operations and actions over time toward a
> goal. It can combine inference, prediction, planning, valuation, action
> selection, and revision in response to feedback.

**Proposed edit**

> A strategy coordinates decisions and actions over time toward a goal. It
> interprets evidence, selects actions, and revises the plan as consequences
> arrive.

**Reasoning:** concrete verbs replace a dense inventory of nominalizations and
make strategy easier to visualize. **Guidelines: A3, A4, B3, C1, C2.**

### 13. Interpret the strategy map once

**Before**

> Accounting for relational impacts, temporal impacts, and value tradeoffs
> requires multiple dimensions of understanding. Do you prioritize a partner's
> goal above a customer's? Do you sacrifice Subgoal 2 to stop a competitor from
> reaching its goal?

**Proposed edit**

> Strategy weighs relational effects, consequences over time, and tradeoffs
> among people whose goals can conflict.

**Reasoning:** the map already displays the competing actors. One interpretive
sentence keeps those actors visible without scattering the topic through
rhetorical questions. **Guidelines: A1, A3, A4, B1–B3.**

### 14. Ground authority in people and consequences

**Before**

> Prediction alone cannot determine which goal deserves authority. Goals must
> be grounded in experiential change for a target audience.

**Proposed edit**

> Prediction alone cannot decide which goal deserves authority. Governing
> goals must remain answerable to the people who experience their consequences.

**Reasoning:** “people” and “consequences” make the normative relation concrete;
“answerable” anticipates corrigibility. **Guidelines: A4, B2, B3, C1–C3.**

### 15. Calibrate the conversation previews

**Before**

> Every AI system operates with an implicit value hierarchy. You can ask models
> to describe theirs; compare the answers from ChatGPT, Claude, and DeepSeek.

**Proposed edit**

> Deployed AI systems act under layered priorities. ChatGPT, Claude, and
> DeepSeek can generate descriptions of those priorities, but the operative
> hierarchy also depends on training, instructions, policy, user context,
> permissions, and evaluation.

**Reasoning:** the generated descriptions remain illustrative while the
sentence directs evidentiary weight to the layers that shape behavior.
**Guidelines: A4, B1, B2, C5.**

### 16. Narrow the downstream-consequence claim

**Before**

> Implicitly or explicitly choosing the wrong values will have the same
> downstream consequences.

**Proposed edit**

> Whether priorities remain implicit or become explicit, misranking them can
> propagate error through metrics, incentives, and repeated decisions.

**Reasoning:** “can” avoids an exceptionless causal claim, and the concrete
chain prepares the governing-values figure. **Guidelines: A4, B2, C2, C3.**

### 17. Make translation affirmative

**Before**

> Human values cannot guide an AI while remaining private. They must be
> expressed via:

**Proposed edit**

> To guide AI, people must translate values into inspectable forms:

**Reasoning:** the revision gives people the action and the list a clear point
sentence. **Guidelines: A1, A5, C1, C2, C9.**

### 18. Correct and complete the conclusion

**Before**

> The agent failed because `optimal` omitted the judgment that would make one
> plan preferable to another.

**Proposed edit**

> The agent failed because `optimize` named an operation without naming the
> values that would make one plan preferable to another.

**Reasoning:** the revision restores the prompt's actual word, distinguishes
procedure from value, and closes the opening loop. **Guidelines: A4, B2, C3,
C9.**

## Recommended revision order

1. Remove the placeholder and repair numbering, copy, prompt continuity, and
   source annotations.
2. Narrow claims about thought, consciousness, meaning, copyright, and value
   authorship to the authority and direct-access limits the essay needs.
3. Split Section 02 and create the human-centered Section 03.
4. Restore experience → values → wisdom → strategy in the core thesis and
   conclusion.
5. Move the study hypothesis beside the study and let the conclusion resolve
   the opening scene.
6. Apply sentence-level compression only after the section topics and
   handoffs are stable.
7. Re-render the route and review the visible section sequence, figure
   captions, interactive reading order, and Sources annotations against the
   final prose.

This order addresses public trust, argument scope, and document-level clarity
before local polish. **Guidelines: A4, B1, B2, C7–C10.**
