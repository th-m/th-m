# The Factory — Ontology

## Editorial Status

This article evolves the former "Next Abstraction Layer" essay into the first
deep dive on knowledge-factory infrastructure.

**Published form (2026-08-22):** the article now centers on the SoundSculpt
repository ontology as the factory's semantic infrastructure — ownership
visible from the path, layered dependency rules, and executable README/AGENTS/
skill contracts. The primary source is `notes/soundsculpt-repository-ontology.md`.

The domain-ontology plan below (controlled language, the ten-part ontology
packet, Mango, and SoundSculpt creative distinctions) is retained as the
working material for a separate future post on modeling product domains for
AI systems. It is not part of the published article.

## Overview

Humans are responsible for mapping the world the factory acts upon. AI can
extract candidate concepts, compare examples, propose relationships, and expose
inconsistencies, but a model cannot independently decide which distinctions a
product should recognize, whose perspective should govern, what evidence is
sufficient, or which errors are acceptable.

A domain ontology makes those commitments inspectable. It defines the entities,
relationships, states, invariants, evidence rules, and permitted actions that a
bounded system treats as real. That structure gives teams a shared language and
gives AI higher-quality in-context material than an isolated prompt or a pile
of loosely related documents.

The article will acknowledge the strength of controlled writing systems such as
ASD-STE100: constraining vocabulary and grammar can make model output clearer
and more machine-checkable. It will then extend the solution. Controlled
language improves the form of expression; a domain-specific ontology clarifies
what the expression is about and how its claims can be checked.

## Working Subtitle

**Controlled language can reduce slop. Domain ontology gives the language
something precise to mean.**

## Core Thesis

The knowledge factory needs more than fluent instructions. It needs explicit,
maintained maps of the domains in which people and AI act.

Within a bounded context, an ontology should tell the factory:

- what kinds of things it may claim exist;
- how those things relate and change;
- which distinctions alter behavior;
- what evidence warrants each state or assertion;
- which actions are allowed, forbidden, or escalated;
- which examples and counterexamples define the boundary; and
- who remains accountable for revising the map.

Ontology design does not replace human judgment. It is how human judgment
becomes shareable, testable, and available in context.

## Relationship to the Series

This is the fifth essay and the first implementation-oriented factory deep dive.
**The Knowledge Factory** introduces the operating system; this article defines
its semantic infrastructure. **The Factory — Strategy** follows with the human
discipline that chooses direction and updates the factory's goals.

## Intended Reader

Software builders, product and platform leaders, domain experts, knowledge
architects, and teams designing context systems or agent workflows.

## Terms and Guardrails

- **Ontology:** an explicit commitment about the entities, relationships,
  properties, states, constraints, and evidence a bounded system recognizes.
- **Domain language:** the vocabulary tied to that model and used consistently
  within its bounded context.
- **In-context learning:** adaptation of model behavior from instructions,
  examples, and other context supplied at inference time, without assuming a
  durable update to model weights.
- Do not present an ontology as objective reality. It is a maintained,
  purpose-bound map with omissions and social consequences.
- Do not treat ontology as a synonym for glossary, taxonomy, database schema,
  or prompt. Each can express part of the model.
- Do not imply that longer context is automatically better. Context must be
  relevant, structured, current, and evaluated.
- Do not claim controlled English alone makes technical content correct.

## Section Notes

### 1. Humans Map the World

Open with a deceptively simple product term such as `conversation`, `customer`,
`song`, or `risk`. A model can produce definitions for each. The factory still
needs a person or accountable institution to decide which definition controls a
particular decision.

Mapping requires judgment:

- which perspective is represented;
- which distinctions matter to an outcome;
- which exceptions deserve first-class status;
- which observations count as evidence;
- what uncertainty is tolerable; and
- who bears the cost when the map is wrong.

AI can assist the cartography. Humans remain responsible for adopting and
governing the map.

### 2. A Map Is a Commitment, Not a Mirror

An ontology does not merely list what a team discovered in the world. It commits
the system to recognizing some distinctions and ignoring or combining others.

Use the working definition:

> A product ontology is an explicit commitment about which distinctions the
> system will recognize, how those distinctions relate, and what evidence is
> sufficient to make claims about them.

This makes classification an architectural and institutional act. A model can
be useful and still require revision as customers, regulations, technology, or
evidence change.

### 3. In-Context Learning Needs Designed Context

Explain why a large context window is not a knowledge architecture.

Models can adapt their response from definitions, demonstrations, counterexamples,
tool descriptions, and task history supplied in context. But raw retrieval can
mix incompatible meanings, stale decisions, and documents written for different
purposes.

An ontology helps assemble context by providing:

- stable identifiers for important concepts;
- relationships that make relevant material traversable;
- bounded contexts that prevent silent semantic blending;
- examples associated with the right concept and state;
- provenance and recency; and
- evaluation criteria tied to the modeled behavior.

The point is not to put the whole ontology in every prompt. It is to use the map
to select the smallest context that preserves the necessary distinctions.

### 4. What the “Cure for AI Slop” Gets Right

Reference [Ege Chelebi's video, “The cure for AI slop is a 1986 aircraft
manual”](https://www.youtube.com/watch?v=uJblcC4lKYw) and its [companion
analysis](https://www.chele.bi/videos/the-cure-for-ai-slop).

The piece's strongest idea is that a banned-word list is not a writing system.
ASD-STE100 supplies constrained vocabulary, one-meaning discipline, procedural
rules, and machine-checkable guidance. In the author's small experiment—six
writing tasks, four conditions, and two models—the STE-derived skill reduced
measured writing-rule violations substantially relative to baseline. The author
also states the necessary caveats: results varied by model, the sample was
small, and the system improves the form of writing rather than whether the
writer has anything worth saying.

Use the reference as a demonstration that **designed linguistic constraints can
change generated output**. Do not treat the reported experiment as universal
evidence or as proof of technical correctness.

### 5. Amend the Solution: From Controlled Language to Domain Ontology

Controlled language can tell a model:

- prefer one approved term;
- keep a sentence procedural and unambiguous;
- avoid synonym rotation;
- state one instruction at a time; and
- produce prose that a linter can inspect.

It cannot by itself decide:

- whether a protocol answer means a human conversation occurred;
- whether `song` names a composition, recording, performance, or rights object;
- which customer outcome makes a capability valuable;
- which evidence justifies a state transition; or
- what action is permitted when the evidence is incomplete.

That is the domain-ontology layer. The amended solution is not merely “give the
model a better style guide.” It is **clarify the domain-specific ontology, then
use controlled language to express and operate within it.**

### 6. The Ontology Packet for a Knowledge Factory

Define a practical, composable artifact:

1. **Vocabulary:** preferred terms, aliases, and prohibited conflations.
2. **Entities and categories:** what the system can refer to.
3. **Relationships and cardinalities:** how entities participate together.
4. **States and transitions:** what can change and under which conditions.
5. **Invariants:** conditions that must remain true.
6. **Evidence rules:** what warrants a claim and how uncertainty is represented.
7. **Examples and counterexamples:** ordinary cases, boundaries, and failure
   cases.
8. **Actions and permissions:** allowed side effects, owners, and escalation.
9. **Evaluations:** tests or rubrics that determine whether output respects the
   model.
10. **Provenance and versioning:** why the commitment exists and when it changed.

Different implementations may express these through prose, schemas, types,
graphs, policies, tests, or code. The packet is a conceptual contract, not a
required file format.

### 7. Mango: Technical Success Is Not Human Conversation

Reuse the communications example:

- `Call` is the product-level communication attempt.
- `Dialog`, `session`, endpoint, and routed segments describe technical state.
- `Protocol answer` records a network or provider observation.
- `Human answer` requires stronger evidence.
- `Conversation` is a semantically stronger human outcome.

A vague instruction such as “follow up on unanswered calls” cannot be safely
implemented until the ontology clarifies which observation counts as answered
for the product's purpose.

### 8. SoundSculpt: Preserve Creative Distinctions

Reuse the creative-domain example:

- composition, performance, production, rendering, and rights are distinct;
- timbre belongs to evaluated rendered sound in this product model;
- mood distinguishes creator intent, observable characteristics, and listener
  interpretation; and
- scorecards create shared comparison language without turning aesthetic
  judgment into objective ground truth.

The case demonstrates that ontology does not have to flatten meaning. A good
model formalizes what must coordinate and preserves a place for what remains
relational or emergent.

### 9. Ontology as a Living Factory System

Implementation and use reveal gaps in the map. The maintenance loop is:

> Domain observation → ontology commitment → context and implementation →
> evaluation → counterexample or consequence → ontology revision.

Factory engineers need ownership, review, versioning, migration, and conflict
resolution for semantic changes just as they do for APIs and schemas.

### 10. Semantic Slop

End by naming the deeper failure mode. Stylistic slop is recognizable prose:
generic cadence, synonym rotation, empty hedging, and familiar transitions.

Semantic slop is more dangerous. It is clean output built on collapsed concepts,
unstated evidence, incompatible contexts, and confident claims about states the
system cannot actually know.

Controlled language helps with the first. Ontology, evaluation, and accountable
domain judgment are required for the second.

## Visual Notes

1. **Style guide versus ontology:** expression constraints on one side; domain
   entities, relationships, evidence, and actions on the other.
2. **Context assembly:** ontology-guided traversal selecting definitions,
   examples, evidence, tools, and evaluations for one task.
3. **Mango map:** protocol observations separated from human outcomes.
4. **Ontology packet:** the ten-part factory artifact.

## Research and Source Notes

- Preserve the existing research audit on ontology, bounded contexts, ambiguity,
  Mango, SoundSculpt, and AI productivity.
- Use the official ASD-STE100 source for claims about the standard itself.
- Treat Chelebi's experiment as a documented small author-run test, not a peer-
  reviewed general result.
- Add primary sources on in-context learning and retrieval/context selection
  before publication.

## Candidate Closing Line

> A writing system can make the factory speak clearly. An ontology gives it a
> world clear enough to speak about.
