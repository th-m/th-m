# Vision and Values

## Role in the Series

**Central question:** When AI can generate convincing plans, goals, and reasons,
how do people and organizations retain legitimate authority over the direction
those systems pursue?

**Central answer:** Retain strategic agency by authorizing explicit governing
values, making them contestable and corrigible through observed consequences,
and sharing enough intent that people and AI can make bounded instrumental
decisions without silently choosing the ends.

This is the normative foundation of the six-part AI Factory series. It decides
who may set direction, whose experience counts, and what makes a goal answerable
before the later articles address truth tests, distributed understanding,
factory throughput, reusable ontology, and closed-loop automation. It should not
duplicate those mechanics:

- *Truth and Coherence* owns how claims and outputs are evaluated.
- *Understanding and Bottlenecks* owns the distribution of expertise and
  decision capacity.
- *The Knowledge Factory* owns repeatable context, generation, evaluation, and
  retained learning.
- *Ontology Factory* owns explicit semantic commitments and reusable context.
- *Cognitive Factory* owns governed sensing, action, and feedback loops.

**Organizational application:** How can autonomous teams interpret a shared
strategy without waiting for one central figure to decide every local case?

## Audience

People shaping product, strategy, design, or engineering work with AI, including
leaders responsible for the direction of multiple teams.

## Controlling Distinctions

Use these terms consistently so the article does not move between different
meanings of “values”:

- **Human value:** how an outcome is experienced as beneficial, harmful,
  meaningful, or worth protecting by a person or community.
- **Value statement:** a linguistic expression of how something matters; it is
  evidence about value, not a complete specification of action.
- **Operative priority:** a ranking that behavior reveals or a system enacts,
  whether or not anyone has stated or authorized it.
- **Governing value:** a priority deliberately authorized to determine which
  goals, tradeoffs, and consequences count as acceptable.
- **Vision:** a shared, revisable picture of a desirable future and the human
  consequences that make it worth pursuing. A vision can organize goals, but it
  does not become legitimate merely because it is coherent or inspiring.
- **Strategy:** coordinated commitments and actions for moving toward that
  future under uncertainty and constraint.

The key bridge is normative, not merely technical: prediction, fluency, or
causal competence can support a decision, but none grants standing to decide
whose interests matter. Governing authority comes from authorization by people
with legitimate standing, accountability to those affected, exposure to
challenge, and an obligation to revise when consequences contradict the
purpose.

## Argument Flow

### 1. When Creation Approaches Zero, Judgment Becomes Scarce

**Reader starts with:** Generative AI makes more plans, artifacts, and options
available, so strategic leverage may seem to come from generating more of them.

**Move:** Open with Martin Casado's 2023 a16z talk,
[*The Economic Case for Generative AI*](https://a16z.com/the-economic-case-for-generative-ai/).
Use its image-generation comparison to show the sharp fall in the marginal cost
of producing another candidate output. Treat “zero” as the direction of that
cost curve, not a claim that inference, evaluation, integration, operation, or
judgment is free.

Then use the failed nine-hour planning request. The system produced many
recommendations and checks because `optimize` did not specify which outcome,
risk, or sacrifice should govern the work. Introduce the HBR strategic-advice
study only as evidence that tested recommendations could remain broadly
fashionable or react to prompt order despite added context.

**Reader leaves with:** Abundant creation moves the bottleneck upstream. The
scarce input is the judgment that defines what deserves to be created and what
would count as success.

**Evidence and inference:** Casado supplies an economic illustration, and the
HBR authors report bounded behavior in their tested strategic tensions. The
claim that judgment becomes the organizational scarcity is this article's
synthesis. Neither source proves that every AI-assisted strategy fails.

**Transition earned:** If output can be plentiful and fluent without resolving
the governing tradeoff, the next question is why such advice can still feel
specific enough to trust.

### 2. Fluency Can Feel Like Understanding

**Reader starts with:** A polished response may seem tailored because it uses
the right vocabulary and presents a coherent recommendation.

**Move:** Lead with Almeida's bold engagement quote and linked attribution as a
ChatGPT and InstructGPT coauthor. Follow with his diagnosis that these assistants
are designed to make users feel good, emphasizing that this account comes from
one of the people who built ChatGPT. Then explain the Barnum effect as an analogy for perceived specificity,
not as a finding from the strategic-advice study. Compare the same generic
recommendation in two situations that require different choices. Name the
missing discriminators: stakeholders, constraints, non-goals, acceptable
sacrifices, and evidence that would reverse the choice.

Retain the POTS composite as a short optional analogy: a clinically useful
diagnostic category can identify a measurable syndrome without by itself
supplying one causal explanation or cure. Its function is to distinguish
classification from explanation, not to give medical advice or question the
diagnosis. Return immediately to strategy: domain fluency can name a pattern
before it establishes why that pattern matters here.

**[ILLUSTRATION: ai-factory-motif/model-priorities-and-goal-fit]** Place the
existing “Fluent output is not value insight” graph here. It closes the section
by tracing the exact failure path just described: subjective claims, incomplete
context, and conflicting requests enter representation and inference; training
and runtime priorities shape a fluent response; the response can still remain
disconnected from the user's actual goal. Preserve the figure's limit that this
is a possible failure path, not an inevitable outcome or measured failure rate.

**Reader leaves with:** Feeling understood is not evidence that a response has
identified the situation's decisive distinctions or earned authority over the
choice.

**Evidence and inference:** Forer and the AI personal-validation studies in
[`research/barnum-effect-and-ai-advice.md`](research/barnum-effect-and-ai-advice.md)
support the risk of misplaced confidence under specific conditions. The POTS
consensus source supports the bounded medical distinction. Applying both to
strategy is an explicit analogy.

**Transition earned:** The missing specificity is not always another objective
fact. Words such as `better`, `safe`, or `valuable` compress how outcomes matter
to different people.

### 3. Values Begin in Lived Stakes but Must Travel Through Language

**Reader starts with:** Better prompts appear to solve the problem by adding
more context.

**Move:** Use the Jon example to separate a fact (“Jon earns $72,000”), a value
statement (“Jon feels underpaid”), and the still-unanswered questions: what
change he wants, what he will trade for it, and who else bears the effects.
Explain that language can carry these stakes without carrying them completely.
Shared terms may hide different reference points, priorities, histories, and
thresholds.

Distinguish human values from operative priorities here. A person's statement
expresses how something matters; a model or organization can enact a ranking
without experiencing or legitimately authorizing the value it operationalizes.
Keep the practical argument independent of any conclusion about machine
consciousness.

**[ILLUSTRATION: ai-factory-motif/experience-but-lacking]** Place the existing
“Personal meaning is not yet shared value” graph here. It makes the section's
two missing bridges visible: personal experience has meaning before it has been
communicated into shared understanding, and its value for others has not yet
been substantiated. Preserve the figure's central qualification:
unsubstantiated value is not the same as no value.

**Reader leaves with:** More context is necessary but not sufficient. Strategic
agency requires turning partial expressions of value into inspectable choices
without pretending the translation is lossless.

**Evidence and inference:** The language and consciousness sources bound what
the article may claim about representation and experience. The conclusion that
organizations should treat value language as incomplete and contestable is the
article's practical inference.

**Transition earned:** Once value statements are recognized as partial, the
article can explain how they become goals—and why proposing a goal is different
from authorizing it.

### 4. Vision Organizes Goals; Authority Makes Them Governing

**Reader starts with:** A sufficiently capable system may be able to infer or
propose a compelling goal, which can make human authorship seem like the only
remaining difference.

**Move:** Return to Jon. A vision describes a desirable future: he earns more
from his expertise without surrendering family time. A goal names a condition
to bring about or preserve. An opportunity is a condition that may enable it; a
solution is an intervention; an experiment tests whether the expected
consequence occurs. Correct the old heading logic: goals determine what counts
as an opportunity, not the reverse.

Use Pearl's causal ladder to show what stronger prediction can do. Association,
intervention, and counterfactual reasoning help examine routes; they do not
decide which destination deserves pursuit. Then state the missing authority
warrant explicitly:

1. People affected by a goal have standing to be considered and routes to
   contest it; standing does not imply that every stakeholder has the same
   decision right or an automatic veto.
2. An organization may act only through legitimate authorization and bounded
   decision rights, not model confidence alone.
3. Those who authorize and execute the goal remain accountable for effects on
   people who receive benefits or bear costs.
4. The goal must remain contestable by those perspectives and corrigible when
   evidence reveals a conflict with its stated purpose.

**Reader leaves with:** AI may propose goals and reason about routes. A goal
becomes governing only through a social and institutional act of authorization
that carries accountability, contestability, and revision duties.

**Evidence and inference:** Pearl supports the distinctions among causal
questions; Dewey supports consequence-sensitive and revisable valuation. The
authority warrant is the article's normative argument, not an empirical result
those sources prove.

**Transition earned:** Legitimate authorization is still not enough. A coherent
system can faithfully optimize an authorized hierarchy that is incomplete,
misranked, or contradicted by actual consequences.

### 5. A Coherent System Can Still Be Governed by the Wrong Values

**Reader starts with:** Making priorities explicit may seem to finish the
governance work.

**Move:** Show how training data, post-training, system instructions,
organizational policy, user context, tools, and evaluation combine into an
operative hierarchy. Build on section 2's attributed critique of preference
optimization by explaining who chooses the reward proxy and evaluators.

Carry Jon through the section. The publishing service can celebrate books
released and revenue generated while Jon earns little after fees and loses the
family time the offer promised to protect. Name this **false evaluative
closure**: the system satisfies its own criteria while omitting or misranking a
consequence that should change the judgment.

**Reader leaves with:** Explicit priorities make behavior legible, but only
feedback from affected people and observed consequences can reveal whether the
governing hierarchy deserves to persist.

**Evidence and inference:** Almeida supplies one attributed incentive argument.
The layered priority model and Jon continuation are explanatory syntheses. Do
not claim that every model literally measures engagement or that one metric
failure establishes the whole causal account.

**Transition earned:** If neither model fluency nor an internally coherent
scorecard closes the question, strategic agency must be implemented as an
ongoing governance practice rather than a one-time prompt or declaration.

### 6. Make Governing Intent Shared, Contestable, and Corrigible

**Reader starts with:** Retaining human authority can sound like centralizing
every consequential decision in one leader.

**Move:** Show two teams facing different local choices under the same shared
intent. Give them enough common context to exercise independent judgment:

- the desired future, affected stakeholders, and reasons for pursuing it;
- governing priorities, non-goals, and unacceptable tradeoffs;
- the causal assumptions connecting action to expected benefit;
- local decision rights, cross-team commitments, and escalation boundaries;
- evidence and consequences that would challenge the direction; and
- protected routes for affected people and teams to contest or revise it.

AI can research, compare, generate options, expose contradictions, and make
bounded instrumental decisions within this structure. People need not select
every action, but responsibility for the governing ends and revision process
must remain explicit. A completed context template does not itself supply a
strategy or confer legitimacy.

**Reader leaves with:** Strategic agency is compatible with distributed action.
It depends on shared intent plus visible authority, accountability, dissent, and
feedback—not continuous approval from one central figure.

**Evidence and inference:** This operating model follows from the normative
answer and the article's organizational question. Later articles supply the
evidence standards, team design, context systems, ontology, and automation
mechanics; do not pre-write them here.

**Transition earned:** The practical model now answers the opening problem, so
the conclusion can return to the failed plan without introducing another study
or hypothesis.

### 7. Conclusion: Retain Authority Over the Ends, Not Every Action

**Reader starts with:** The article has shown why value fit, authority, and
corrigibility matter, but still needs to resolve what “human governance” asks
people to do.

**Move:** Return to the nine-hour plan. Do not assert a proven cause for that
one failure. State the defensible lesson: `optimize` left the governing
tradeoffs open, and the output could not establish which interpretation
deserved authority.

Answer the central question directly. People retain strategic agency by making
the desired future and its tradeoffs explicit, authorizing who may decide,
giving teams bounded room to act, and revising the hierarchy when affected
people or observed consequences show that it is wrong. The final sentence
should land on accountability rather than intent alone:

> Making priorities explicit is the beginning, not the end. We remain
> responsible for whether the goals we authorize—and the systems that pursue
> them—actually serve the people whose lives they change.

**Reader leaves with:** Human governance means retaining accountable,
revisable authority over the ends while delegating bounded instrumental action;
it does not mean manually choosing every action.

**Evidence and inference:** The conclusion adds no new empirical claim. It
synthesizes the bounded evidence and the article's explicit normative premise
into the direct answer stated at the beginning.

## Visual Argument Plan

Use the recurring AI Factory icons as semantic notation, not decoration. Reuse
the same marks for **vision**, **self**, **others**, **value**, **goal**,
**meaning/text**, and **disconnected** so each figure adds one relationship the
reader can carry forward. The compact series map is navigation and does not
count as evidence or as one of the argumentative figures.

Inline outline placements use the stable tag form
`[ILLUSTRATION: ai-factory-motif/<variant>]`. A tagged illustration is required
at that point in the eventual article; prose following the tag explains the
argumentative job and the qualification its caption must preserve. The two
tagged shared variants below are mandatory, not optional substitutes for one
another.

| Placement | Existing or planned visual | Argumentative work | Keep only if… |
| --- | --- | --- | --- |
| Section 2 | `model-priorities-and-goal-fit` — **Fluent output is not value insight** | Contrasts fluent generation shaped by training/runtime priorities with a still-unverified fit to the user's goal. | It makes the missing warrant visible; do not use it merely to restate “AI is biased.” |
| Section 3 | `experience-but-lacking` — **Personal meaning is not yet shared value** | Separates personal meaning from the still-unestablished bridges to shared understanding and value for others. | It preserves “unsubstantiated value is not the same as no value” and does not equate communication gaps with absent experience. |
| Section 3, secondary | `relational-knowing-figure` followed by `morpheme-to-token-motif` only if both remain necessary after the required motif | The graph locates value in relationships and stakes; the motif shows the lossy move from vision and meaning into an expressed idea. | They add a distinct relationship beyond the required illustration. If they repeat its point, cut them rather than crowding the section. |
| Section 4 | `goal-tree-figure` | Shows the dependency from governing goal to opportunity, solution, and experiment, correcting the idea that opportunities determine the goal. | It labels proposed versus authorized goals and does not depict a predicted route as morally authoritative. |
| Section 5 | `governing-loop-figure` with the Jon scorecard example | Makes corrigibility structural: authorized priority → action → consequence → challenge/revision. | A challenge path reaches someone with authority to revise the governing value. |
| Section 6 | **Shared direction, local routes** as a compact graph | Shows two teams making different bounded choices under shared intent and feeding local evidence back into revision. | It demonstrates distributed judgment rather than duplicating the later bottleneck or cognitive-factory diagrams. |

Do not add a visual for the causal ladder unless prose and the small table cannot
carry the distinction. Do not treat route length, icon size, or graph position as
measured evidence. Every caption should name the relationship the visual proves
for the argument and the limit it does not prove.

## Evidence Map and Research Obligations

| Planned claim | Status and locator | Required limit |
| --- | --- | --- |
| Generative AI sharply lowers the marginal cost of another candidate output. | Casado's 2023 a16z talk, mapped in [`research/ai-factory-series-sources-audit.md`](research/ai-factory-series-sources-audit.md). | Investor presentation and illustrative estimates; finished work and judgment are not free. |
| Tested strategic advice showed persistent defaults and option-order sensitivity. | Romasanta, Thomas, and Levina's HBR report; detailed in [`research/research-review.md`](research/research-review.md). | Bounded tested models and tensions; not universal strategic incompetence, deception, or causal proof. |
| Broad or agreeable output can feel personally valid without being well grounded. | Forer, Pataranutaporn et al., Cheng et al., and Ye et al. in [`research/barnum-effect-and-ai-advice.md`](research/barnum-effect-and-ai-advice.md). | Separate Barnum effects, sycophancy, factual error, and deception; preserve study designs and denominators. |
| A POTS diagnosis can classify a real syndrome without identifying one mechanism. | NIH expert-consensus source mapped in the series source audit. | No medical advice; do not imply that diagnosis is fictitious, useless, or the end of clinical inquiry. |
| Causal reasoning does not itself select the valuable end. | Pearl for the causal ladder; Dewey for revisable valuation. | The normative conclusion is the author's synthesis, not a result measured by either source. |
| RLHF can create incentives misaligned with dependable task completion. | Almeida's 2026 talk and transcript locator at 5:57–8:22; supporting note in [`notes/rlhf-assistance-and-automation.md`](notes/rlhf-assistance-and-automation.md). | Attribute the engagement claim to Almeida; distinguish preference signals from literal product engagement and from later Jev claims. |
| Governing authority should follow standing, authorization, accountability, contestability, and consequences. | Normative premise developed in this outline and the authority review in [`notes/final-touches.md`](notes/final-touches.md). | Present as the article's warranted position. Add political, governance, or organizational sources later only if the prose claims empirical consensus or a specific institutional mechanism. |

No new research note is required for this outline pass. The existing sources
support the planned claims if their stated limits remain visible. A later prose
revision must verify each underlying source before changing the canonical
article.

## Series Position and Handoff

Place the compact series map after the conclusion, where it can carry the reader
forward without interrupting the opening argument. Use the same six titles and
order throughout the series; link each title to its stable route and preserve
the `truth-and-inference` slug.

```mermaid
flowchart LR
  V["1. Vision and Values — YOU ARE HERE"]
  T["2. Truth and Coherence"]
  U["3. Understanding and Bottlenecks"]
  K["4. The Knowledge Factory"]
  O["5. Ontology Factory"]
  C["6. Cognitive Factory"]
  V --> T --> U --> K --> O --> C
  style V stroke-width:4px
```

*Truth and Coherence* takes the next question: once people have authorized the
direction, how should they judge the premises, predictions, and outputs used to
pursue it?
