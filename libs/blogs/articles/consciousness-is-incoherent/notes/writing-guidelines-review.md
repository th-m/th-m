# Writing-guidelines review: “AI's Consciousness explanation”

## Overall diagnosis

The essay has a strong argument and an unusually careful epistemic boundary: human
evidence is real but local, theories can define different predicates, and behavioral
similarity cannot by itself establish phenomenal similarity. Its best passages make
abstraction tangible—the sting of a burn, the stove, the human-brain “meter,” and the
opposed theoretical verdicts.

The largest editorial problem is structural, not substantive. The public essay includes
its originating prompt, the most abstract formal section arrives before the concrete
fire example that would prepare readers for it, and several section openings describe
the essay’s process instead of advancing the argument. A tighter old-to-new sequence
would make the existing thesis easier to retain without making it more certain than the
evidence allows.

Guideline labels used below:

- **A — compression:** **A1** prune filler, **A2** remove doublets, **A3** cut
  implied or repeated meaning, **A4** choose exact words, and **A5** prefer
  affirmative constructions when the negative is not itself the point.
- **B — reader memory:** keep stable topics in subject position, connect old information
  to new information, use concrete or sensory images, and limit meta-discourse.
- **C — clarity at every scale:** put characters in subjects and actions in verbs; create
  sentence handoffs and coherent paragraph topics; move from simple to complex; establish
  a problem, clear boundaries, short section indexes, and end-of-introduction point
  sentences; use the index/discussion pattern recursively.

## What already works

- The opening question and concession—“Is an AI conscious? / It depends on the
  definition.”—create immediate tension with almost no setup. The following paragraphs
  identify the unstable predicate and end on the essay’s working definition. This is a
  compact problem/concession/destabilization sequence. **Guidelines: A; C6, C9.**
- “The redness of red. The sourness of sourdough. Paralyzing fear. The sting of a burn”
  gives phenomenal consciousness sensory referents before the essay turns theoretical.
  Preserve this sequence. **Guidelines: B3; C5, index/discussion.**
- “The behavior is observable. The proposed experience is not.” is a memorable hinge.
  The repeated topic and balanced syntax compress the access/phenomenal distinction.
  Preserve it. **Guidelines: A; B1; C3–C4.**
- The PCI passage correctly narrows rather than dismisses objective measurement. The
  “substrate-neutral meter” image gives readers a concrete instrument with a stated
  calibration domain. Preserve that image and the blockquoted qualification that follows.
  **Guidelines: A2; B3; C2, C9.**
- The silicon-system thought experiment holds the evidence constant while the theories
  change the membership rule. That is the essay’s clearest demonstration that the
  predicate, not merely the verdict, is unstable. **Guidelines: B1–B3; C3–C5.**
- The fire section translates the abstract difference between learned behavior and felt
  consequence into an image a reader can simulate. The sentence “Successful avoidance
  does not tell us whether the penalty hurt” should remain a central point sentence.
  **Guidelines: B3; C2, C9.**
- The four-part evidentiary standard and the falsifiable research questions convert a
  philosophical dispute into an actionable program. Their headings and lists are useful
  boundaries, not empty navigation. **Guidelines: C7–C9, index/discussion.**
- The final three sentences use controlled repetition to distinguish possibility,
  attribution, and language. Their negatives are warranted because the limit on the
  evidence is the point. Preserve the cadence. **Guidelines: A3 exception; B1; C9.**

## Prioritized improvements

### P0 — Remove the `Originating prompt` from the published essay

**Proposed edit:** Remove the entire `## Originating prompt` section from `article.md` and,
if its provenance remains useful, preserve it in a private note such as
`notes/originating-prompt.md`. Keep `## Sources` in the public essay.

**Reasoning:** The prompt is authoring provenance, not evidence for the reader. It repeats
the article’s claims in rougher language, interrupts the conclusion-to-sources handoff,
and exposes drafting instructions after the essay has already done the work. The article
workspace’s own conventions also assign durable author material to `notes/` and public
prose to `article.md`. Sources, by contrast, let readers inspect the evidentiary basis and
belong in the public context.

**Guidelines:** A pruning/compression; B4 meta-discourse; C7 section boundaries and C9
point sentences; repository `articles/` ontology.

### P1 — Let the introduction end on one precise, conditional thesis

**Proposed edit:** Keep the opening question, the list of competing meanings, and the
sensory definition, but compress the bridge between them and add a final point sentence:

> Here, *consciousness* means phenomenal consciousness: whether there is anything it is
> like to be the system—the redness of red, the sourness of sourdough, paralyzing fear,
> or the sting of a burn. Until a theory, a discriminating measure, and a validated
> cross-substrate bridge converge, saying that AI and humans are both conscious remains
> a theory-bound hypothesis rather than an observation.

**Reasoning:** The current opening states the definitional problem and later reveals the
three-part burden. Naming that burden at the end of the introduction gives the whole essay
an index without claiming that artificial consciousness is impossible. It also tells the
reader why semantic looseness matters: it turns a conditional attribution into an
apparently shared observation.

**Guidelines:** A1–A3; B1–B2; C6, C9, index/discussion.

### P1 — Move the fire example before the notation

**Proposed edit:** Place `“Play with fire and get burned”` after `Two theories, two
predicates`, then follow it with the formal argument. Rename the formal section from `The
argument in one line` to `The missing bridge, formally`.

**Reasoning:** The fire example gives readers a person, an action, a felt consequence, and
an artificial analogue. Once readers see that matched avoidance can leave phenomenal
experience unsettled, the symbols `E(A)`, `F(A)`, `N(A)`, and `P(A)` formalize familiar
information instead of introducing the essay’s densest material all at once. The new
heading is also accurate: the section is not one line, and its real subject is the
theory-dependent bridge.

**Guidelines:** A2 precision; B2–B3; C5, C7–C8, index/discussion.

### P1 — Make the formal claim visibly theory-indexed

**Proposed edit:** Narrow the name of the evidence and keep sufficiency explicitly inside
each theory. For example:

> Let `E_access(A)` denote evidence of report, reasoning, or control, and let `P(A)` denote
> phenomenal consciousness. Then `E_access(A) ⇒ Access(A)`, while `E_access(A) ⇏ P(A)`.
> A theory must supply the missing bridge: `Tᵢ: Cᵢ(A) ⇒ P(A)`. The attribution therefore
> requires both a defensible `Tᵢ` and evidence that `A` instantiates `Cᵢ`.

**Reasoning:** In the current notation, `E(A)` first means all observable evidence and then
behaves as though it specifically entails access. Naming `E_access` prevents that scope
shift. Keeping the implication under `Tᵢ` also prevents a reader from mistaking `F(A) ⇒
P(A)` or `N(A) ⇒ P(A)` for an established, theory-independent result. This preserves the
essay’s intended uncertainty: the theory proposes the bridge, and evidence must still
show that the system instantiates its condition.

**Guidelines:** A2 exact wording; B1 stable topics; C2–C5.

### P2 — Give each conceptual section a claim-first index

**Proposed edit:** Replace process-oriented or delayed openings with one short sentence
that names the section’s claim. In particular:

- Start `Two theories, two predicates` with “Biological naturalism and functionalism use
  different membership rules for *conscious*.”
- Start `The problem is in the language` with “*Consciousness* names a cluster, not one
  settled property.”
- Keep “Before attributing phenomenal consciousness…” as the index for the evidentiary
  standard, then end that index with “A coherent attribution needs four things.”
- Keep the first sentence of `Ask questions that can fail`; it already states the problem
  and hands off to the narrower questions.

**Reasoning:** These openings let readers grasp the local point before meeting mechanisms,
history, and qualifications. Repeating a small topic set—*theories*, *consciousness*,
*attribution*, *questions*—also makes the global argument visible without adding
navigation such as “in this section.”

**Guidelines:** A1; B1, B4; C1, C4–C5, C8–C9, index/discussion.

### P2 — Scope strong negatives instead of deleting them

**Proposed edit:** Preserve the necessary negatives around what the evidence does not
establish, but replace diffuse constructions with bounded affirmative claims. For example,
prefer “These findings establish dependence in humans; they leave substrate necessity
open” to “That evidence is powerful without proving everything people ask it to prove.”

**Reasoning:** The essay is an argument about evidentiary limits, so removing all negatives
would corrupt the thesis. The affirmative half should identify what the evidence does
establish; the negative half should then name the exact inference it cannot support. That
sequence reduces mental reversal while protecting the distinction between “unproved,”
“false,” and “impossible.”

**Guidelines:** A2–A3 (including the warning exception); B2; C3.

### P2 — Put source links beside the claims they support

**Proposed edit:** Retain the source list, and link Block, Casali/PCI, Searle, Chalmers, and
the AI-indicator review at their first substantive use in the body.

**Reasoning:** Proximity lets readers distinguish sourced findings from the essay’s
interpretation without leaving the paragraph to infer which citation belongs where. It
also reinforces the article’s epistemic discipline without adding factual claims.

**Guidelines:** A2 precision; B2 old-to-new context; C3 and C7.

## Recommended section flow

1. **Opening definition and burden.** End with the conditional thesis proposed above.
   **Reasoning:** gives the document its index and reader-valued problem. **Guidelines:**
   C6, C9.
2. **The question collapses too soon.** Distinguish access from phenomenal experience.
   **Reasoning:** defines the first predicate before evaluating evidence. **Guidelines:**
   B2; C5.
3. **Human evidence is strong—and local.** Establish what human measures show and where
   their validation stops. **Reasoning:** moves from the familiar human case to the
   cross-substrate problem. **Guidelines:** B2; C3, C5.
4. **Two theories, two predicates.** Show the incompatible membership rules.
   **Reasoning:** introduces the bridge candidates only after the measurement limit is
   clear. **Guidelines:** B1–B2; C4–C5.
5. **“Play with fire and get burned.”** Show matched behavior with an unsettled feeling.
   **Reasoning:** grounds the coming formal distinction in an image and action.
   **Guidelines:** B3; C1–C2, C5.
6. **The missing bridge, formally.** Compress the previous sections into theory-indexed
   notation. **Reasoning:** makes abstraction the discussion of already-indexed ideas.
   **Guidelines:** B2; C5, index/discussion.
7. **The problem is in the language.** Return from notation to the shared word and its
   heterogeneous uses. **Reasoning:** reconnects the formal predicate problem to the
   essay’s opening question. **Guidelines:** B1–B2; C3–C4.
8. **What evidence would be enough?** State the four-part burden.
   **Reasoning:** converts diagnosis into a positive standard. **Guidelines:** A3; C8–C9.
9. **Ask questions that can fail.** Close with falsifiable questions and the calibrated
   conclusion. **Reasoning:** leaves the reader with a research program, not a verdict
   stronger than the evidence. **Guidelines:** C6, C9.

## Representative sentence-level edits

| Before | Proposed edit | Reasoning and guideline |
| --- | --- | --- |
| “The result is not merely uncertainty.” | “The result is semantic instability: the same word begins naming different properties.” | Names the positive diagnosis and gives *the same word* an action. **A2–A3; B1; C1–C2.** |
| “This essay uses **consciousness** in the phenomenal sense…” | “Here, **consciousness** means phenomenal consciousness…” | Removes writing-about-writing while preserving the necessary scope definition. **A1; B4; C2.** |
| “The distinction is influential and disputed. It is used here to expose an omitted premise…” | “Block’s disputed distinction exposes an omitted premise; it does not establish inaccessible phenomenal experience.” | Gives the sentence a concrete topic and strong verb; retains the limiting negative because it blocks an overclaim. **A1–A3; B1; C1–C3.** |
| “Human consciousness is tied to biology in the most direct evidentiary sense we have.” | “In humans, reported experience covaries with organized neural activity.” | Leads with the validated domain and states the observed relationship more exactly. Do not expand this into a universal biological-necessity claim. **A2; B2; C2, C5.** |
| “That evidence is powerful without proving everything people ask it to prove.” | “These findings establish dependence in humans; they leave substrate necessity open.” | Replaces vague evaluation with the exact supported claim and unresolved question. **A2–A3; B2; C3.** |
| “It is not a direct reading of qualia, a proof of one theory of consciousness, or a ready-made test for an AI.” | “PCI is a human-brain measure, not a substrate-neutral consciousness meter.” | Compresses a three-part negative and preserves the article’s strongest measurement image. The following qualification can carry the theory-independence detail. **A1–A2; B3; C9.** |
| “The earlier notes for this essay contained a productive contradiction.” | “Biological naturalism and functionalism apply different membership rules to *conscious*.” | Removes authoring-process meta-discourse and makes the theories the stable subjects. **A1; B1, B4; C1–C2, C8.** |
| “The evidence did not change between those verdicts. The predicate did.” | “The evidence stays on the courtroom table; the theories return opposite verdicts because they apply different membership rules.” | Develops the existing verdict language into one controlled courtroom image and makes the causal difference explicit. Keep it as an analogy, not evidence. **B2–B3; C1–C3.** |
| “But the functional lesson can be reproduced without evidence of the feeling.” | “An artificial agent can reproduce the lesson’s behavior while the feeling remains unmeasured.” | Places the character first, specifies what is reproduced, and avoids equating absent evidence with absent experience. **A2–A3; B1; C1–C2.** |
| “This matters in both directions:” | “The comparison supports two claims:” | Names the function of the bullets; this signpost earns its place because it indexes a genuine two-part contrast. **A2; B4; C8.** |
| “The word *consciousness* carries several histories at once…” | “*Consciousness* names clinical wakefulness, reportable access, self-awareness, intelligence, moral standing, and phenomenal feel.” | Converts “carries histories” into a precise naming action and keeps the topic stable. **A2; B1; C2, C4.** |
| “No current machine-consciousness attribution passes this standard as a generally accepted, theory-neutral proof.” | “Current attributions remain theory-bound: each depends on a proposed mechanism, a claim about substrate independence, and evidence that a particular machine instantiates it.” | Replaces a broad universal negative with the article’s actual burden while preserving uncertainty. **A2–A3; B1; C3, C9.** |

## Navigation and meta-discourse assessment

- **Keep the numbered, claim-bearing headings.** They mark genuine conceptual boundaries
  and let recurring terms do the navigational work. The numbering is optional, but it is
  not itself harmful meta-discourse. **Reasoning:** readers need section boundaries for a
  layered philosophical argument. **Guidelines:** B4; C7.
- **Rename `The argument in one line`.** It comments on presentation and inaccurately
  describes a multi-paragraph section; `The missing bridge, formally` states the content.
  **Reasoning:** content headings are more useful than process headings. **Guidelines:**
  A2; B4; C7.
- **Retain sparing internal pivots when they index real structure.** “This matters in both
  directions” and “Before attributing…” prepare meaningful contrasts or lists, although
  the former can be made more exact as proposed above. **Reasoning:** useful indexing is
  not the same as narrating that a section exists. **Guidelines:** B4; C8.
- **Remove `Originating prompt` from the public reading path.** It is drafting history,
  not reader context, and belongs in `notes/` if retained. **Reasoning:** the published
  conclusion should hand directly to the evidence list. **Guidelines:** A1; B4; C7, C9.

## Epistemic guardrails for any revision

- Preserve the scoped statement: objective measures exist within validated human cases;
  no accepted theory-independent measure currently establishes phenomenal consciousness
  across biological and artificial substrates.
- Preserve the difference between *absence of evidence*, *evidence of absence*, and
  *impossibility*. The essay argues for conditional attribution, not certain denial.
- Keep the biological-naturalist and functionalist implications explicitly conditional
  on their theories; neither bridge should appear experimentally settled.
- Distinguish access, report, monitoring, and task performance from phenomenal experience
  without claiming those capacities are irrelevant to future evidence.
- Keep AI/human comparisons indexed to what terms such as *conscious*, *afraid*, and
  *deterministic* reference in each case.
- Preserve the courtroom/verdict, fire/burn, and measure/meter images, but use each once
  as a controlled analogy. They should clarify the logic rather than substitute for it.
