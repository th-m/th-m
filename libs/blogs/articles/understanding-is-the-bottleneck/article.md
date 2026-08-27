---
title: The Understanding Bottleneck
description: When plausible output becomes abundant, shared understanding limits progress.
publishedAt: 2026-08-22
updatedAt: 2026-08-26
tags: [Artificial Intelligence, Leadership, Knowledge Work, Software Systems]
---

# The Understanding Bottleneck

## 1. Two Ways Output Outruns Understanding

### When Correctness Outruns Meaning

AI-assisted mathematics exposes the understanding bottleneck in unusually clean
form. Mathematical work can separate three operations that ordinary knowledge
work often blends:

1. **Generation** produces candidate conjectures, proofs, counterexamples,
   programs, and intermediate lemmas.
2. **Verification** determines whether an artifact satisfies stated formal
   constraints through expert review, tests, or a proof assistant.
3. **Interpretation and adoption** determines whether the formalization captures
   the intended question, what the result teaches, why it matters, how it should
   be explained, and whether it belongs in the field's reusable knowledge.

These three stages organize Terence Tao's 2026 ICM talk,
["Mathematics in the Age of AI"](https://www.simonsfoundation.org/2026/08/13/fields-medalist-terence-tao-on-artificial-intelligence-and-why-we-do-math/),
and the accompanying
[essay](https://arxiv.org/abs/2608.16753). Tao asks the mathematical community
to assume that AI will perform a meaningful share of research-level tasks, then
return to a foundational question: what are the goals and values of mathematical
work?

Generating and verifying a proof begin the pipeline; explanation, evaluation,
attribution, review, teaching, and adoption complete it. If generation
accelerates faster than those downstream practices, the community develops what
Tao calls **proof indigestion**: candidate proofs outrun verification, verified
proofs outrun explanation, and published work outruns collective absorption.

<!-- understanding-pipeline -->

A formal certificate can establish that a derivation follows from encoded
definitions and axioms. It cannot establish by itself that the encoding
faithfully represents the informal question, that the result matters, or that
anyone has developed a transferable understanding of why it works. Tao proposes
a practical test: authors should be able to give a clear, correct, and properly
attributed expert talk about a result before it is treated as complete, even
when the proof has been formally verified.

The recent
[OpenAI unit-distance result](https://openai.com/index/model-disproves-discrete-geometry-conjecture/)
makes the distinction concrete: external mathematicians checked the proof,
while people still chose the problem and interpreted its significance. The
[Leiden Declaration on Artificial Intelligence and
Mathematics](https://leidendeclaration.ai/) gives that distinction an
institutional form by placing correctness alongside understanding, depth,
attribution, transparency, and human direction.

Mathematics makes the bottleneck unusually visible because its patterns and
constraints support large-scale search and verification. Every organization,
however, can now produce more analyses, specifications, designs, and code than
its people can responsibly interpret and absorb.

### When Generation Outruns Evaluation

At the opposite pole, a developer is not struggling to absorb verified work.
The work has not been qualified yet. Each prompt becomes a lever pull, each
stream of tokens the spinning reels, and the next response might be the big
score. A strong answer rewards another pull; a weak answer invites a retry. The
activity can drift from pursuing an explicit learning goal into continuing the
generation loop.

The slot-machine image is a structural analogy, not a clinical diagnosis.
[Research on gambling and reward
uncertainty](https://pubmed.ncbi.nlm.nih.gov/31870708/) explains how uncertain
rewards can intensify attention and repeated behavior; it does not establish
that prompting is gambling disorder. The analogy identifies a design risk:
low-friction repetition, uncertain quality, occasional high-value output, and no
clear stopping rule.

Developer well-being research places that risk inside an organizational system.
A [mixed-methods study of 442
developers](https://arxiv.org/abs/2510.07435) associated GenAI adoption with
higher job demands and burnout, while autonomy and learning resources mitigated
those relationships. A [survey of 319 knowledge
workers](https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/)
found that AI shifted reported critical-thinking work toward verification,
response integration, and task stewardship. AI can reduce one kind of effort
while creating another kind of load.

Developers rarely remain at either pole. Depending on the task and the team,
the same person can oscillate between qualified output outrunning absorption and
generation outrunning judgment. Tests, domain constraints, shared context,
autonomy, learning resources, and explicit stopping rules move the work along
that spectrum.

At one pole, evaluation cannot keep pace with qualified output. At the other,
generation proceeds without enough evaluation. Both expose the same scarcity:
a grounded model for deciding what the output means and what should happen next.

> **AI can make plausible work abundant; in formally constrained domains, it can
> make verified work abundant too. When a community can produce more than it can
> ground, interpret, and absorb, shared understanding becomes the bottleneck.**

Understanding is a provisional, shareable, and revisable model of a situation.
Three recurring tests discipline that model:

1. **Coherence — does it fit?** Do its explanations and commitments hold
   together without hiding consequential contradictions?
2. **Correspondence — does it match?** Does it remain answerable to the intended
   question, the available evidence, and the world it claims to represent?
3. **Consequence — what follows when people act on it?** What does the model help
   people predict, what does action change, and what must they revise afterward?

These tests do not determine by themselves what matters, whose purposes count,
or whether reliance is warranted. They discipline a model; people and
institutions remain accountable for its purposes and authority.

### Inference Produces an Answer; Understanding Maintains a Model

In machine learning, **inference** is the execution of a trained model. For an
autoregressive language model, learned parameters and the available context
tokens enter a transformer pass. The model computes a hidden state for the
final position, projects it into logits over the vocabulary, converts those
logits into a probability distribution, selects a next token, appends it to the
context, and repeats. The visible answer is the accumulated output of that
loop.

<!-- neural-inference -->

The hidden state is not a human-readable account of the situation, and
next-token probability is not a measure of truth. Both are transient quantities
used to continue a sequence under the model's learned distribution. Retrieval,
tools, and additional context can make more evidence available to the pass, but
the resulting answer must still be interpreted and evaluated.

Understanding begins when the output becomes an object of inquiry rather than
the end of the process. People relate it to situated evidence, use a provisional
model to explain and predict, act within an evaluative boundary, observe what
follows, and retain the revision.

> **Understanding is not the answer produced by inference. It is the
> provisional model that makes an answer intelligible, supports prediction and
> action, and remains available for correction after contact with the world.**

The analogy is limited but useful. Both processes condition prior structure on
present context. LLM inference asks which continuation is probable under a
trained model. Understanding asks which working model best explains the
situation, what action it warrants, and what evidence or consequence should
change it. [Truth, Entropy & Inference](/writing/truth-entropy-and-inference)
examines the first loop in detail; this essay is concerned with what must remain
after the continuation has been produced.

## 2. From Output to Shared Understanding

Consider a hypothetical product team trying to understand why people abandon an
onboarding step. A researcher brings interviews. A product practitioner brings
the abandonment metric. A designer brings observations of the workflow. An
engineer brings system constraints. A support specialist brings recurring
questions. AI produces several polished but incompatible explanations and
interventions.

The team has plenty of artifacts but cannot yet explain what they mean together.
Moving from output to understanding requires the team to distinguish
observation from interpretation, preserve consequential disagreement, connect
technical choices to human stakes, and return a clearer problem frame that
others can test.

### Distillation Preserves What a Decision Needs

A summary makes material shorter. **Distillation** identifies which distinctions
must survive compression for a decision to remain sound. In this case,
distillation preserves:

- whose experience is represented;
- what the team observed and what it inferred;
- which explanations remain disputed;
- which constraints are hard or negotiable;
- which tradeoffs a test would accept; and
- what evidence would overturn the model.

AI can summarize the interviews, metric, constraints, and proposals at scale.
The team must decide which distinctions carry meaning for the present decision.
The work should increase the group's shared capacity to reason and act, not
merely produce another artifact.

Customers do not experience a roadmap, architecture, or ticket queue. They
experience a situation. Empathy is disciplined contact with that situation,
informed by observation, participation, evidence, and correction. A metric can
show abandonment; empathy investigates the confusion, mistrust, interrupted
workflow, or competing obligation behind that abandonment.

### Five Dimensions Check the Model's Coverage

A compact coverage check keeps the team honest about what its model includes:

1. **Human:** goals, experience, behavior, trust, and consequences.
2. **Domain:** entities, relationships, rules, exceptions, and language.
3. **System:** architecture, dependencies, state, failure modes, and operations.
4. **Economic:** incentives, opportunity cost, distribution, and sustainability.
5. **Epistemic:** evidence quality, uncertainty, assumptions, and disconfirming
   tests.

The five dimensions ask what parts of the situation the model must cover.
Coherence, correspondence, and consequence ask how the team tests that model.
No one person needs every fact, but the model must be shareable enough for the
group to predict what an intervention will change and recognize when that
prediction fails.

## 3. From an Authority Gate to an Evaluative Boundary

Abundant output often creates conflicting interpretations. An organization may
respond by centralizing sensemaking: teams collect evidence, but only a small
authority layer may frame the problem or authorize a solution. Each handoff
strips context. Requests pile up at the gate, and builders learn to wait for
tasks instead of framing problems.

The alternative is shared capability. Teams gain an advantage when more people
can propose and test solutions without losing meaning, evidence, or
accountability. **Solutioning** is the shared work of framing a problem,
proposing interventions, testing them, and revising the model. Teams can
distribute that work when they share evidence, vocabulary, constraints, and
decision boundaries.

|                            | Centralized authority gate    | Distributed evaluative boundaries            |
| -------------------------- | ----------------------------- | -------------------------------------------- |
| **Who frames the problem** | A small authority layer       | People close to the evidence                 |
| **Context**                | Compressed across handoffs    | Shared with its rationale and limits         |
| **Action**                 | Teams wait for approved tasks | Teams frame and test within explicit bounds  |
| **Outcome**                | Queueing and dependency       | More exploration with visible accountability |

### Evaluative Closure Makes Delegation Responsible

Distributed solutioning does not eliminate judgment or control. It replaces a
centralized interpretation gate with explicit evaluative boundaries.
**Evaluative closure** means a team understands enough of a particular decision
to define what is settled, what remains open, who has authority, and what
evidence will trigger review. Closure is scoped and provisional, not a claim to
certainty.

Before delegating solutioning to a person or an AI, the team establishes an
**evaluative boundary**:

- the situation, purpose, and decisions already settled;
- the solution space still open for exploration;
- non-negotiable constraints and the reasons they exist;
- evidence or changed conditions that may warrant an exception;
- a challenge protocol that identifies the conflict, cites evidence, proposes
  the narrowest exception, and pauses;
- the accountable authority who may approve the exception, including where a
  concern owned elsewhere must escalate; and
- the verification and revision record that will preserve what happened.

> An AI may challenge an evaluative boundary when new evidence conflicts with
> its rationale, but it may not silently cross or redefine that boundary.

Every evaluative boundary names an accountable authority. If an exception
affects another owned concern—customer trust, security, architecture, legal
obligations, or product purpose—the decision escalates to that concern's
authority.

### Make the Reasoning Visible

Teams can build and distribute understanding through one causal operating
model:

1. **Gather evidence** through customer contact, observation, support, sales,
   telemetry, and system behavior.
2. **Frame the problem** with briefs and shared vocabulary that distinguish
   symptoms, causes, stakes, assumptions, and disagreement.
3. **Authorize a test** with decision records, rejected alternatives,
   pre-mortems, explicit boundaries, and learning goals.
4. **Learn from consequences** through small experiments and follow-up with the
   people affected.
5. **Retain the revised model** through retrospectives, records, interfaces, and
   coaching that make the next decision start from stronger context.

Once one person forms a useful model, the organization must make it retrievable
and revisable. Shared understanding becomes visible through language, models,
decisions, tests, interfaces, and repeated behavior. Teams should be able to
recover why a decision was made, trace a claim to evidence, see where contexts
differ, and update the model after outcomes arrive.

## 4. Test, Act, and Revise

AI can search, cluster observations, generate hypotheses, identify missing
questions, compare explanations, and propose tests. These tasks can deepen a
team's model. AI can also produce coherence before the organization has earned
correspondence or examined consequences.

A trustworthy synthesis should:

- cite its evidence;
- state its assumptions;
- compare plausible explanations;
- mark its confidence and limits; and
- name the next observation that would discriminate among alternatives.

Teams demonstrate understanding when they predict an outcome, act at a scale
that makes learning affordable, observe what follows, and revise their model.

<!-- understanding-loop -->

The discipline is to improve the loop's fidelity and speed without allowing
speed to erase meaningful context:

> observe → interpret → frame → propose → test → experience consequences →
> revise

Consequences may revise the team's explanation, its evaluative boundary, or
both. A boundary that cannot change when its rationale no longer corresponds to
the situation becomes another gate.

### Understanding Is a Skill to Look For—and Develop

This capability is not confined to management. It appears when an engineer
finds the missing constraint, a designer connects behavior to lived experience,
a support specialist recognizes a recurring causal pattern, or a researcher
separates evidence from a compelling story.

Organizations should look for people who can build shareable models, distribute
bounded authority, and revise both after action. They develop the same skill by
giving people repeated customer contact, asking them to separate observation
from interpretation, letting them frame problems inside clear boundaries, and
requiring predictions and revisions after consequences arrive.

> In an age of abundant answers, the scarce skill is building enough shared
> understanding to know what deserves to be solved—and whether an answer
> survives contact with the world.

Shared, retrievable learning is the bridge to
[The Knowledge Factory](/writing/the-knowledge-factory), where understanding
becomes reusable organizational capability.

## Sources

- Terence Tao, ["Mathematics in the Age of AI"](https://arxiv.org/abs/2608.16753) (2026). Develops the essay's organizing example of proof abundance, verification, explanation, and mathematical value.
- OpenAI, ["An OpenAI Model Has Disproved a Central Conjecture in Discrete Geometry"](https://openai.com/index/model-disproves-discrete-geometry-conjecture/) (2026). Documents the unit-distance result and the continuing human role in choosing and interpreting problems.
- [Leiden Declaration on Artificial Intelligence and Mathematics](https://leidendeclaration.ai/). States principles for correctness, understanding, attribution, transparency, and human direction in AI-assisted mathematics.
- Jeremy Avigad, Leonardo de Moura, Soonho Kong, and Sebastian Ullrich, [_Theorem Proving in Lean 4_](https://docs.lean-lang.org/theorem_proving_in_lean4/). Supports the distinction between kernel-checkable proof objects and the human task of choosing and interpreting a formalization.
- Karl E. Weick, Kathleen M. Sutcliffe, and David Obstfeld, ["Organizing and the Process of Sensemaking"](https://doi.org/10.1287/orsc.1050.0133) (2005). Examines how people turn circumstances into articulated situations that can guide action.
- Amy C. Edmondson, ["Psychological Safety and Learning Behavior in Work Teams"](https://doi.org/10.2307/2666999) (1999). Connects psychological safety with learning behavior in the studied teams.
- ISO, [_ISO 9241-210:2019 — Human-centred design for interactive systems_](https://www.iso.org/standard/77520.html). Grounds sustained attention to users, needs, and human-system consequences throughout design.
- Zixuan Feng, Sadia Afroz, and Anita Sarma, [_From Gains to Strains: Modeling Developer Burnout with GenAI Adoption_](https://arxiv.org/abs/2510.07435) (ICSE-SEIS 2026). Connects GenAI adoption, job demands, job resources, and developer burnout in a mixed-methods study.
- Hao-Ping Lee, Advait Sarkar, Lev Tankelevitch, Ian Drosos, Sean Rintel, Richard Banks, and Nicholas Wilson, [_The Impact of Generative AI on Critical Thinking_](https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/) (CHI 2025). Examines how knowledge workers describe goal formation, verification, response integration, and stewardship in GenAI-assisted work.
- Charlotte Brandebusemeyer, Kerim Zunic, Thomas Zimmermann, Tobias Schimmer, and Bert Arnrich, [_Developers' Experience with Generative AI Beyond Productivity Assessment_](https://arxiv.org/abs/2607.02337) (2026 preprint). Reports task- and interaction-dependent changes in perceived workload, cognitive load, and productivity.
- Martin Zack, Ross St. George, and Luke Clark, [_Dopaminergic Signaling of Uncertainty and the Aetiology of Gambling Addiction_](https://pubmed.ncbi.nlm.nih.gov/31870708/) (2020). Reviews reward uncertainty in gambling; used only to bound the slot-machine analogy, not to diagnose AI use.
