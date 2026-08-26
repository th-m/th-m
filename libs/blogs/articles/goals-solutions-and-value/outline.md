# Goals, Solutions & Value

## Editorial Status

This outline narrows the first essay to the normative foundation of the AI
Factory series. It retains a compact, technically accurate explanation of LLM
input, cross-entropy training, model weights, inference, and runtime context
because that mechanism explains why a model can infer a person's motivations
without directly knowing them.

Detailed information theory, distributional semantics, domain fluency, code
constraints, and prompting practice belong to *Truth, Entropy & Inference*.

## Overview

An agent spent nine hours producing a plan too large to reasonably review after
being asked: “Optimize this plan, find all the gaps and ensure validation checks
are in place.” Contradictions hidden among its validations and todo items made
the result unusable. The failure was not an inability to plan or a lack of
instruction. The prompt supplied a vocabulary of rigor while leaving the
judgment that makes rigor useful unstated.

`Optimize` did not define what should become better. `All the gaps` rewarded
exhaustive enumeration without distinguishing material risks from imaginable
omissions. `Ensure validation checks` encouraged another gate wherever
uncertainty remained. The model operationalized a plausible hidden hierarchy:
completeness over simplicity, risk reduction over momentum, validation coverage
over usability, and planning over action.

An LLM is a compressed statistical model of patterns in human-produced
language. Its architecture and learned weights let it infer associations,
motivations, principles, and plausible continuations from supplied context.
But language is already a partial representation of lived experience. A model
can infer what a person means; it cannot directly observe the private
experience, motivation, or value hierarchy that the words incompletely encode.

People face the same boundary. Two people can use the same term while carrying
different histories, definitions, and expectations. AI inherits this problem
at scale and fills missing meaning with patterns from training, post-training,
system instructions, and the current context.

The article's normative claim follows: human experience reveals what is at
stake, values identify which outcomes should matter, and wisdom integrates and
revises those judgments through consequences. AI can help operationalize and
pursue a goal, but predictive competence cannot determine which goal deserves
authority.

## Core Thesis

> Human experience reveals what can matter. Values determine what should
> matter. Wisdom negotiates conflicts among those values and revises them after
> consequences arrive. AI can infer and pursue a goal, but people who inhabit
> the situation and remain accountable for its consequences must define,
> authorize, and revise the values that govern it.

## Relationship to the Series

This is the first essay in the coordinated sequence:

1. **Goals, Solutions & Value** establishes why human stakes, judgment, and
   authority must govern the problem space.
2. **Truth, Entropy & Inference** explains how language carries constraints,
   when predictive fluency becomes reliable, and when coherence only resembles
   understanding.
3. **The Understanding Bottleneck** examines how people and organizations
   evaluate abundant output and preserve meaning through action.
4. **The Knowledge Factory** turns that capability into reusable organizational
   infrastructure.

## Intended Reader

People delegating consequential work to AI: developers, designers, product and
technical leaders, founders, strategists, and builders of agentic systems.

## Key Terms

- **Experience:** situated contact with events and consequences, including
  needs, emotions, relationships, memory, and embodied or social effects.
- **Value:** something treated as worth pursuing, protecting, or refusing.
- **Wisdom:** corrigible judgment that integrates experience, evidence,
  competing values, relationships, time horizons, and consequences.
- **Governing decision:** a decision about what counts as better, whose
  interests matter, and which tradeoffs are legitimate.
- **Instrumental decision:** a decision about which action is expected to
  advance an accepted goal within supplied constraints.
- **Corrigibility:** the ability and authorization to revise a goal, value
  hierarchy, or operational rule when consequences expose it as incomplete or
  wrong.

## Editorial Guardrails

- Describe an LLM as a compressed statistical model of patterns in its training
  data, not literally the sum total of all language.
- Describe cross-entropy as the training objective that scores predicted token
  distributions; optimization and neural-network architecture produce the
  learned compression.
- Say AI can infer motivations but cannot directly observe them or know that an
  inference is correct.
- Do not make the normative argument depend on resolving machine consciousness
  or the hard problem of consciousness.
- Do not romanticize human judgment. People and institutions can be biased,
  self-serving, shortsighted, or coherently wrong.
- Treat wisdom as a practice of accountable revision, not an infallible human
  faculty.
- Keep the detailed explanation of entropy, domain language, code constraints,
  and prompting in *Truth, Entropy & Inference*.

## Section Notes

### 1. The Priorities Hidden Inside the Prompt

Open with the exact prompt:

> Optimize this plan, find all the gaps and ensure validation checks are in
> place.

The resulting nine-hour plan was impractically large—too long to be reasonably
reviewed as a whole. Contradictions buried among its validations and todo items
made it completely unusable. The model did not ignore the instruction; it
operationalized it.

- `Optimize` omitted the outcome that should become better.
- `All the gaps` treated every possible omission as equally important.
- `Ensure` implied that uncertainty should be eliminated rather than managed.
- `Validation checks` rewarded visible gates whether or not they improved the
  decision.

Name the hidden hierarchy: completeness over simplicity, risk reduction over
momentum, validation coverage over usability, and planning over action.

Contrast that with the intended request: identify material gaps, add validation
proportional to risk, preserve executability, and stop when more process costs
more than the confidence it creates. Those priorities were not in the prompt.

Use the strategic-advice order-effects study briefly as supporting evidence:
models can produce coherent recommendations while small presentation changes
move the answer more than relevant company information.

Establish the governing questions:

- Which outcome should be optimized?
- Which gaps are material?
- What degree of uncertainty is acceptable?
- How much validation is proportional to the consequence?
- When does another check reduce risk, and when does it merely add process?
- Who has authority to accept the remaining risk?

### 2. What a Language Model Carries

Retain the interactive training explanation, but make every technical detail
serve the normative argument.

#### Input and tokens

Training data is language produced by people and institutions after experience
has already been translated into symbols. Tokenization converts those symbols
into reversible model inputs; it does not recover the experience or motivation
behind them.

#### Cross-entropy training

Explain the loop:

> context → token probabilities → observed next token → cross-entropy loss →
> backpropagation → updated weights

Keep the animated backpropagation figure and the numerical `mat` example. Make
the precision explicit: cross-entropy rewards probability assigned to observed
continuations, not accurate recovery of an author's unspoken motive.

#### Model, inference, and runtime

The trained weights are a compressed statistical representation of recurring
linguistic relationships, not a searchable archive. At inference time the
model uses those weights and the current context to predict a continuation.
System instructions, tools, permissions, and the user's words shape which
learned patterns govern that execution.

#### Two compressions

Use the pipeline:

> lived experience → motivation and judgment → language → training corpus →
> learned weights → inferred continuation

The model can infer missing motivation, sometimes impressively. It cannot
reliably reconstruct information that was never expressed.

### 3. Experience, Values, and Wisdom

Separate the three concepts:

- Experience exposes stakes and consequences.
- Values select what deserves pursuit or protection.
- Wisdom integrates competing values and revises them through consequences.

People do not automatically possess wisdom. Wise judgment requires evidence,
empathy, memory, dissent, multiple perspectives, and willingness to change.

#### Shared words do not guarantee shared meaning

Use `safe`, `fair`, `better`, `meaningful`, and `optimal`. People talk past one
another when each assumes a shared word carries a shared definition. AI does
the same thing by selecting a plausible learned interpretation.

#### Judgments hidden in language

Retain the table of evaluative, goal-oriented, deontic, priority, threshold,
affective, and authority language. Retain the value-to-procedure figure:

> value → preference → priority → constraint → metric → procedure

The more operational statement is easier for AI to enact, but operational
precision does not establish legitimacy.

### 4. Goals Create Problem Spaces

Define the hierarchy:

- A goal names a state worth bringing about or preserving.
- An opportunity is a condition that may enable progress toward it.
- A solution is an intervention expected to produce progress.
- An experiment tests whether the intervention has the expected consequence.

Retain the goal-tree and strategy-in-a-field-of-goals figures.

Distinguish governing decisions from instrumental decisions. AI can expand the
tree, compare options, and execute authorized actions. It cannot derive from
output volume which root goal should govern.

### 5. Authority, Accountability, and Corrigibility

An AI can represent, rank, and enact principles without establishing that it
authored them or has authority to impose them. Its operative hierarchy comes
from training data, post-training, system instructions, organizational policy,
user context, permissions, and evaluation.

Retain the strongest “coherently wrong” material. An organization can encode a
bad value hierarchy into excellent metrics, incentives, tests, and automation.
AI increases the speed and consistency of that system.

Retain the governing-values feedback-loop figure. Close the section with the
requirements for corrigibility: direct observation of consequences, protected
dissent, independent feedback, multiple stakeholder perspectives, escalation,
and authority to revise the goal itself.

### 6. From Human Judgment to Language

Human judgment cannot guide AI while remaining private. Translate it into:

- named stakeholders and consequences;
- definitions and distinctions;
- priorities and legitimate tradeoffs;
- examples and counterexamples;
- constraints and permissions;
- evidence and uncertainty;
- tests and stopping conditions; and
- feedback capable of revising the governing model.

This is the handoff to *Truth, Entropy & Inference*. Some language carries these
constraints reliably because communities, tools, and consequences repeatedly
reject invalid usage. Other language leaves several incompatible meanings able
to sound equally coherent.

### 7. Conclusion

Return to the failed plan. The model generated a plausible interpretation of
`optimal`; it did not receive the private definition the prompt omitted.

The human role is not to choose every action. It is to supply and authorize the
governing values, translate them into inspectable language and constraints,
observe consequences, and revise the hierarchy when it proves wrong.

## Visual and Interactive Notes

1. **Training animation:** a bad next-token guess followed by backpropagation
   adjusting the network.
2. **Cross-entropy example:** probabilities and loss for `The cat sat on the …`.
3. **Two compressions:** experience → language → learned weights → inference.
4. **Value ladder:** value → preference → priority → constraint → metric →
   procedure.
5. **Goal tree:** governing goal → opportunities → solutions → experiments.
6. **Strategy map:** governing and external goals coordinated through strategy.
7. **Governing-values loop:** metrics and incentives filter consequences into
   evidence that can falsely confirm the original hierarchy.

## Candidate Closing and Handoff

> Human experience reveals what can matter. Values determine what should
> matter. Wisdom keeps those judgments answerable to their consequences. But AI
> encounters these commitments through language. The next question is when
> language carries enough of the relevant distinctions to guide reliable
> action—and when it carries only the shape of an answer.

## Reference Plan

Keep the published bibliography selective and tied to claims that remain in
this essay.

### Language models and training

- Common Crawl for the public web-crawl source.
- Gage (1994) for byte-pair encoding as compression.
- Sennrich, Haddow, and Birch (2016) for BPE adapted to subword tokenization.
- Rumelhart, Hinton, and Williams (1986) for backpropagation.
- Vaswani et al. (2017) for the Transformer architecture.
- Shannon (1951) for the statistical predictability and entropy of written
  language.

### Normative foundation

- Dewey (1939), *Theory of Valuation*, for ends and means revised through
  inquiry and consequences.
- Schroeder, “Value Theory,” for distinctions among value claims, varieties of
  goodness, instrumental value, pluralism, and comparison.

### Opening evidence

- Romasanta, Thomas, and Levina (2026) for the strategic-advice order and
  company-context effects.

Do not cite the cross-entropy/compression lecture until its title, creator, and
URL are recovered; the current note records only a timestamped summary.
