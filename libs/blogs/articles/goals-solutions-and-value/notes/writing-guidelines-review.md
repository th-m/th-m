# Writing Guidelines Review: *Goals, Solutions & Value*

## Scope and editorial boundary

This review treats the current `article.md` as a published essay that needs a
focused editorial pass, not a new argument. The pass should preserve the
series division of labor:

- *Goals, Solutions & Value* owns human values, wisdom, lived experience,
  normative authority, problem selection, strategy, and corrigibility.
- *Truth, Entropy & Inference* owns most of the explanation of tokenization,
  training, inference, and the mechanics and limits of predictive language.

The proposed edits below avoid adding factual claims. Where the draft makes a
claim that would need evidence or qualification, the recommendation is to
narrow, support, or remove it rather than replace it with another unsupported
claim.

## Guideline key

- **A1 — Prune and compress:** remove filler, doublets, redundancy, and implied
  words.
- **A2 — Choose precise words:** replace long or vague phrases with the exact
  word or distinction.
- **A3 — Prefer the affirmative:** state the positive proposition directly,
  while retaining negatives when a warning or boundary is the point.
- **B1 — Keep topic and context aligned:** use short, concrete, recurring
  sentence subjects that sustain the passage's larger subject.
- **B2 — Move old information to new information:** begin from what the reader
  already has and end on the idea the next sentence will develop.
- **B3 — Make ideas visible and memorable:** favor people, actions,
  consequences, and concrete examples over ungrounded abstraction.
- **B4 — Limit meta-discourse:** remove navigation and commentary about the
  writing unless it genuinely helps the reader cross a boundary.
- **C1/C2 — Put characters in subjects and actions in verbs:** let people,
  organizations, models, goals, and values do the work in the sentence.
- **C3/C4/C5 — Build cohesion and coherence:** link sentence endings to the next
  opening, repeat a controlled set of topics, and move from simple/old material
  to complex/new material.
- **C6 — Establish a consequential problem:** show the status quo, disruption,
  cost, and proposed resolution.
- **C7/C8/C9 — Mark and introduce major units:** use clear boundaries, a short
  opening index, and a point sentence before the detailed discussion.
- **C10 — Use index/discussion at every scale:** give the reader the compact
  idea before expanding it.

## Overall diagnosis

The essay has a compelling thesis and several memorable demonstrations, but it
currently has two competing centers. One is the distinctive argument promised
by the title: people must choose which outcomes count as valuable, and AI can
assist only within a value hierarchy for which people remain accountable. The
other is a long tutorial on tokenization, cross-entropy, model architecture,
and inference. That tutorial delays the values argument, introduces several
draft-level errors, and belongs mainly to the next essay.

The highest-value revision is therefore subtraction and reordering. Compress
the model-mechanics material into the minimum bridge needed to establish the
"two compressions" claim; promote the sections on hidden judgments, problem
spaces, authority, and corrigibility; and let each section open with a short
point sentence. This would improve compression, topic continuity, old-to-new
flow, and the index/discussion structure without flattening the essay's
uncertainty. **Guidelines: A1, B1, B2, C4, C7–C10.**

## What already works and should be preserved

1. **The nine-hour plan is a strong human-scale opening.** It gives the reader
   an agent, an action, a visible artifact (pages of phases and checkboxes), and
   a consequence (a plan no person could reasonably review). Preserve the dry
   turn in "Of course I blame the agent"; it gives the essay a voice before the
   argument becomes abstract. **Why:** the scene establishes a problem readers
   can care about and makes the cost of omitted judgment concrete.
   **Guidelines: B3, C1, C2, C6.**

2. **"What I actually wanted was narrower" states the missing judgment well.**
   Its sequence—consequential gaps, proportional validation, team execution,
   and a stopping condition—shows that `optimize` conceals priorities rather
   than merely lacking detail. Preserve this paragraph as the bridge from
   anecdote to thesis. **Why:** it turns an abstract claim about values into
   observable decisions and trade-offs. **Guidelines: A2, B2, B3, C3.**

3. **The ordinary-language table is one of the essay's clearest original
   contributions.** The progression from evaluative terms to authority makes
   hidden judgments inspectable, and the value → constraint → metric →
   procedure figure shows how judgment becomes operational. Preserve both.
   **Why:** they give the essay a compact index followed by concrete discussion,
   while keeping values—not model mechanics—as the topic. **Guidelines: B1,
   B3, C4, C10.**

4. **The support-ticket example and the governing/instrumental distinction are
   the conceptual center.** The same observation becoming a cost, quality, or
   learning problem demonstrates that goals create problem spaces. Preserve
   the example and the definitions. **Why:** the example lets the reader see a
   governing goal change the meaning of evidence without requiring a new
   factual claim. **Guidelines: A2, B3, C1, C6.**

5. **"The organization becomes coherently wrong" is memorable and earned.**
   The feedback-loop figure and consequence table then develop the line rather
   than merely repeating it. Preserve the phrase, the loop, and the concept of
   false evaluative closure. **Why:** the passage gives an abstraction a visible
   actor and downstream consequences. **Guidelines: B3, C1, C2, C10.**

6. **The discussion of corrigibility protects the essay from simplistic human
   supremacy.** It says human governance is responsibility for revising values
   in light of consequences, not infallibility or manual control of every
   action. Preserve that qualification. **Why:** it locates human authority in
   lived consequences and accountable revision while retaining uncertainty.
   **Guidelines: A2, A3, B1, C6.**

## Prioritized structural and idea-level improvements

### 1. Restore one governing argument

**Suggested change:** Make every major section answer one question: *Who decides
what counts as a worthwhile outcome, and how can that decision remain
answerable to consequences?* Reduce "What a Language Model Carries" to a short
bridge that establishes only this premise: models work from patterns in
recorded language and runtime context, while language itself contains only a
partial expression of lived judgment. Move the detailed tokenization,
cross-entropy, architecture, and decoding explanation to *Truth, Entropy &
Inference*.

**Reasoning:** The present technical tutorial occupies roughly a third of the
argument before the essay reaches goals, authority, or corrigibility. Its
subjects continually change—from model to tokenizer to loss to weights to
runtime—so the reader loses the title's topic. Compression would make the
distinctive values argument easier to remember and preserve the intended
series boundary. **Guidelines: A1, B1, C4, C5, C7, C10.**

### 2. Put the thesis before the research corroboration

**Suggested change:** After "What I actually wanted was narrower" and the
question about alignment, give the reader a two- or three-sentence version of
the thesis. Then use the strategic-advice study as corroborating evidence and
close the introduction with the sharper governing point: prediction can
generate candidate actions, but people must authorize the values by which
those actions are judged.

**Reasoning:** The opening already supplies the status quo, destabilizing
condition, and cost. The study currently interrupts the handoff from the
personal example to the essay's answer, while the full thesis arrives only
after the study and six questions. Index first, then discuss. **Guidelines: B2,
C3, C6, C9, C10.**

### 3. Promote "two compressions" and hidden judgments; demote mechanics

**Suggested change:** Place a concise "Experience becomes language" section
immediately after the introduction. Use the existing sequence
`experience → judgment → language → training corpus → learned weights → inferred
continuation`, then move directly into "Judgments hidden in ordinary
language." Keep no more than one short paragraph explaining that training
learns predictive patterns from recorded language; link to the Truth essay for
the technical account.

**Reasoning:** The two-compressions model is the only part of the technical
section required for this essay's normative argument. Placing hidden judgments
next lets the end of one unit—language omits experience—become the beginning of
the next—language still carries implicit judgments. **Guidelines: A1, A2, B1,
B2, C3–C5, C10.**

### 4. Repair the section architecture

**Suggested change:** Renumber the headings (the draft jumps from section 2 to
section 4) and use concept-bearing headings rather than generic navigation. A
possible sequence is:

1. The Priorities Hidden Inside the Prompt
2. Experience Is Larger Than Language
3. Ordinary Words Carry Judgments
4. Goals Create Problem Spaces
5. Authority Must Remain Corrigible
6. Making Human Judgment Inspectable
7. Conclusion: Choose the Goal Before Optimizing

**Reasoning:** The revised headings repeat the essay's key concepts—experience,
language, judgments, goals, authority—and therefore work as a document-level
index. They also make the missing section number and current draft state less
visible to readers. **Guidelines: A2, B1, C4, C7, C10.**

### 5. Give each section a one-sentence index

**Suggested change:** Open each major section with its point before definitions,
tables, or qualifications. Examples:

- "Recorded language carries traces of human judgment, not the whole experience
  from which that judgment arose."
- "A goal turns an observation into a problem and an intervention into a
  possible solution."
- "Authority over values must remain answerable to the people who experience
  their consequences."
- "Human judgment becomes useful to an AI when people translate it into
  inspectable priorities, examples, constraints, and feedback."

**Reasoning:** These sentences tell readers what the coming material will
develop and repeat a controlled set of subjects. They also avoid making the
reader infer the section's purpose from a list or table. **Guidelines: B1, B2,
C1, C4, C8–C10.**

### 6. Separate evidence, hypothesis, and rhetoric more cleanly

**Suggested change:** Keep the reported study results close to the source, state
its limitation once, and label the value-hierarchy proposal as the author's
hypothesis. Remove or substantiate the claims about "stolen copyrighted
content" and the unattributed line about AI researchers saying "map is the
territory." Avoid categorical claims about whether a model thinks or reasons;
the essay only needs the narrower claim that model output does not provide
direct access to a person's private experience or intended value hierarchy.

**Reasoning:** The draft is strongest when it carefully distinguishes the
study's findings from its own synthesis. Loaded or absolute side claims invite
readers to debate issues the essay does not need to settle and weaken the
stated preservation of uncertainty. **Guidelines: A1, A2, B1, C6.**

### 7. End on human responsibility, not a reopened experiment

**Suggested change:** Move the counterfactual research hypothesis out of the
conclusion and place it beside the study discussion, or reduce it to one
explicitly labeled sentence there. Let the conclusion return to the failed
plan, name what was absent, and end with the responsibility that follows:
people choose and revise the governing goal; AI helps explore the solution
space that goal creates.

**Reasoning:** The current conclusion starts decisively, then reopens an
unanswered empirical question before restating the thesis. Ending on the
governing/instrumental distinction resolves the opening scene and gives the
reader the essay's practical point. **Guidelines: A1, B2, B4, C3, C9, C10.**

## Section and paragraph flow suggestions

| Location | Suggested editorial action | Reasoning and guidelines |
| --- | --- | --- |
| Opening anecdote, from "Nine hours later" through "malicious compliance" | Keep the scene but remove redundant intensifiers such as "impractically," "reasonably," "as a whole," and "completely" where the concrete facts already show failure. | The pages, contradictions, and inability to review the plan carry the point without stacked modifiers. **A1, A2, B3.** |
| Introduction, after "What I actually wanted was narrower" | Move a concise thesis here; follow it with the study and the six diagnostic questions. | The desired behavior is old information the reader has just seen; the thesis names its hidden cause; the study then extends that cause beyond one anecdote. **B2, C3, C6, C9, C10.** |
| "What a Language Model Carries" opening | Replace the current argumentative aside with one clean index sentence about patterns in recorded language versus direct access to lived experience. | The current paragraph combines categorical claims, a double negative, commentary, and an unattributed quotation. One stable subject restores topic control. **A1–A3, B1, C1, C4, C8.** |
| "Input and tokens," "Training through cross-entropy," and "Model, inference, and runtime" | Cut from this essay or collapse into a short linked sidebar/paragraph; retain the detailed explanation for *Truth*. | The units explain machinery rather than who chooses values. Removing them preserves the series boundary and prevents technical context from displacing the normative topic. **A1, B1, C4, C7.** |
| "Two compressions" | Rewrite the speculative opening questions as a direct point sentence, then retain the experience → judgment → language diagram and the coworker example. | The questions about godlike oracles and personal purpose scatter the topic. The diagram and coworkers make the actual limit concrete without overstating it. **A1, A2, B1–B3, C1, C10.** |
| "Judgments hidden in ordinary language" | Make this section 3 and place it directly after the compression account. Add one closing sentence that hands off from implicit judgments to explicit goals. | The table shows what language does carry after the previous section explains what it omits; the close can make "goal" the old information that opens the next section. **B2, C3–C5.** |
| "Goals Create Problem Spaces" | Keep the definitions and support-ticket example; combine the sentence fragments beginning "Once the root goal is supplied" into one affirmative transition. | The example is the essay's clearest demonstration. A grammatical transition will carry "governing goal" into the list of instrumental actions. **A3, B2, C2, C3.** |
| "Authority, Accountability, and Corrigibility" | Move "The organization becomes coherently wrong" immediately after a compact statement that mischosen values compound through repeated decisions; then show the loop and table. | Cause before consequence improves old-to-new flow, while the memorable line becomes the point the visual develops. **B2, B3, C2, C10.** |
| "From Human Judgment to Language" | Reframe the first sentence affirmatively and end the section with a single restrained bridge to *Truth*. | The list is an effective operational answer to the essay. One bridge is useful; several sentences previewing the next essay become meta-discourse. **A3, B4, C8, C9.** |
| Conclusion | Keep the return to the opening agent, compress the study hypothesis, and make the final paragraph name the division of responsibility between human governance and AI assistance. | This closes the narrative loop and ends with a positive proposition rather than repeated negatives about what AI cannot know or decide. **A1, A3, B2, C3, C10.** |
| Sources introduction | Keep the provenance distinction but compress the two sentences to one. | Attribution is useful here, but "The argument above" is avoidable meta-discourse. **A1, B4.** |

## Representative sentence-level edits

These examples show the direction of a prose pass; they are not a substitute
for revising whole paragraphs so that sentence handoffs remain intact.

### 1. Let the facts show that the plan failed

**Before**

> Nine hours later, it returned an impractically large plan: pages of phases,
> dependencies, validation gates, and Markdown checkboxes—too much for a person
> to reasonably read and review as a whole. Buried in that volume were
> contradictions that made the plan incoherent and completely unusable.

**Proposed edit**

> Nine hours later, it returned pages of phases, dependencies, validation gates,
> and Markdown checkboxes—more than one person could review. The volume also hid
> contradictions that made the plan unusable.

**Reasoning:** "Pages," "more than one person could review," and
"contradictions" make the failure visible; the additional modifiers repeat
what those facts already imply. The second sentence begins with the volume just
introduced and ends on the new consequence. **Guidelines: A1, A2, B2, B3,
C3.**

### 2. Preserve the joke; remove the filler

**Before**

> It was basically malicious compliance.

**Proposed edit**

> It looked like malicious compliance.

**Reasoning:** "Basically" is filler. "Looked like" preserves the comic
accusation without asserting intent the model cannot have demonstrated.
**Guidelines: A1, A2.**

### 3. Replace the unstable model-definition paragraph

**Before**

> An LLM is a compressed statistical model of patterns in human language. It
> doesn't "think" and it doesn't "reason" not like people. It simply operates on
> patterns. This is of course amazing and mind-boggling. And also why AI
> researches say with such profundity "map is the territory".

**Proposed edit**

> A language model learns statistical patterns from recorded language. Its
> outputs can resemble reasoning, but this essay need not settle whether that
> behavior counts as thought. The relevant limit is narrower: those patterns do
> not give the model direct access to another person's lived experience or
> intended priorities.

**Reasoning:** The edit removes a double negative, filler, an unattributed
quotation, and a categorical claim the argument does not require. It ends on
the values-specific limit the next paragraph should develop. **Guidelines: A1,
A2, B1, B2, C1, C3.**

### 4. Remove the unsupported legal aside

**Before**

> Even with all the stolen copyrighted content on the internet, its training
> data is incomplete, historically situated, and further constrained by
> post-training.

**Proposed edit**

> Even a vast training corpus remains incomplete, historically situated, and
> shaped by post-training.

**Reasoning:** The revision preserves the premise needed by the argument while
removing a legally and empirically loaded aside that the cited sources do not
establish here. It also makes "training corpus" the concrete subject.
**Guidelines: A1, A2, B1, C1.**

### 5. State tokenization only as precisely as this essay needs

**Before**

> Tokenization at it's heart a lossless compression technique. One influential
> family uses **Byte Pair Encoding**, adapted from Philip Gage...

**Proposed edit**

> Many tokenizers use subword schemes such as Byte Pair Encoding, adapted from a
> lossless compression algorithm. Here, tokenization matters because it converts
> text into units a model can process and later decode as text.

**Reasoning:** This fixes the grammatical error and distinguishes tokenization's
role from the compression algorithm that inspired BPE. If the technical units
move to *Truth*, this sentence can be cut entirely. **Guidelines: A2, B1, C1,
C2.**

### 6. Turn the "two compressions" questions into a point

**Before**

> What is the theoretical limit to this language compression and prediction
> process? Could these LLMa become god like oracles predicting the future and
> providing direct solutions for all problems in an individuals life?

**Proposed edit**

> Prediction meets a limit before training begins: language already preserves
> only part of lived experience and judgment.

**Reasoning:** The edit removes speculative questions that lead away from the
essay's argument and gives the section its index before the compression
diagram. **Guidelines: A1, A2, B1, B4, C8–C10.**

### 7. Make the language limit affirmative and exact

**Before**

> A model cannot directly observe a private motivation or know that its
> inference is correct.

**Proposed edit**

> A model receives linguistic and contextual traces of a private motivation,
> not the motivation itself; people must test whether its inference fits the
> situation.

**Reasoning:** The sentence names what the model does receive, then gives people
the main action. The retained negative marks the precise boundary rather than
using negation as a vague conclusion. **Guidelines: A2, A3, B2, C1, C2.**

### 8. Link language ambiguity to model inference

**Before**

> This is not just an inference problem, it is a language problem.

**Proposed edit**

> The inference problem begins in language itself.

**Reasoning:** The revision removes a comma splice and states the relationship
affirmatively in fewer words. "Inference problem" is old information; "language"
is the new topic developed by the coworker example. **Guidelines: A1, A3, B2,
C3.**

### 9. Repair the transition into instrumental work

**Before**

> Once the root goal is supplied. Then it becomes valuable to explore
> opportunities, generate solutions, design experiments, predict consequences,
> and compare results.

**Proposed edit**

> Once people supply the governing goal, AI can help explore opportunities,
> generate solutions, design experiments, predict consequences, and compare
> results.

**Reasoning:** The edit joins the fragment, names the human and AI roles, and
turns vague value language ("it becomes valuable") into a concrete allocation
of work. **Guidelines: A2, A3, B1, C1, C2.**

### 10. Give authority a positive source

**Before**

> An AI can state principles, rank them, and translate them into behavior. That
> does not establish that it authored those principles or has authority to
> impose them.

**Proposed edit**

> An AI can state principles, rank them, and translate them into behavior.
> Authority over those principles still comes from the people and institutions
> accountable for their consequences.

**Reasoning:** The first sentence ends on behavior; the second picks up
"principles" and introduces their source of authority. The affirmative wording
keeps the emphasis on accountability without erasing the warning.
**Guidelines: A3, B2, C1, C3.**

### 11. Compress the compounding-error transition

**Before**

> Implicitly or explicitly choosing the wrong values will have the same
> downstream consequences.

**Proposed edit**

> Whether chosen explicitly or inherited silently, the wrong values compound
> through every downstream decision.

**Reasoning:** "Inherited silently" makes the implicit case more concrete, and
"compound" turns the main action into a verb that prepares the feedback-loop
figure. The sentence also avoids claiming the consequences are literally the
same. **Guidelines: A2, B2, B3, C2.**

### 12. Make translation into an affirmative action

**Before**

> Human values cannot guide an AI while remaining private.

**Proposed edit**

> Human values can guide an AI when people make them inspectable.

**Reasoning:** The affirmative sentence gives people the action and ends on
"inspectable," which the following list develops through stakeholders,
definitions, examples, constraints, and feedback. **Guidelines: A3, B2, C1,
C2, C3.**

### 13. Close the opening loop directly

**Before**

> The agent did not fail because it was incapable of producing a plan. It failed
> because `optimal` omitted the judgment that would make one plan preferable to
> another.

**Proposed edit**

> The agent could produce a plan. What it lacked was the judgment hidden inside
> `optimal`: which plan this team should prefer, given its goals, risks, and
> capacity.

**Reasoning:** The revision removes nested negatives, restores the team from the
opening scene, and turns "judgment" into the specific decision the essay has
explained. **Guidelines: A2, A3, B2, B3, C1.**

### 14. End with the durable positive proposition

**Before**

> When values remain unstated, they do not disappear. The model imports latent
> priorities from its training, post-training, and the language of the prompt.

**Proposed edit**

> Unstated values persist as priorities inferred from training, post-training,
> runtime context, and the prompt. People therefore remain responsible for
> naming the governing goal, testing its consequences, and revising it when
> experience proves it wrong.

**Reasoning:** The edit compresses the negative construction and ends with
human responsibility expressed through concrete verbs. "When experience proves
it wrong" preserves corrigibility and the authority of lived consequences.
**Guidelines: A1–A3, B2, C1, C2, C9.**

## Suggested revision test

After revising, read only the H1, section headings, first sentence of each
section, blockquotes, figures, and final paragraph. That skim should reproduce
the whole argument:

1. prompts conceal priorities;
2. language preserves only part of lived judgment;
3. ordinary words still carry implicit values;
4. goals determine what counts as a problem and solution;
5. authority must remain accountable and corrigible;
6. people must make judgment inspectable; and
7. AI can assist within, but should not author, the governing value hierarchy.

**Reasoning:** This is a practical test of topic continuity and the
index/discussion pattern at document scale. If the skim cannot recover that
sequence, the section indices or boundaries still need work. **Guidelines: B1,
B2, C3, C4, C7–C10.**
