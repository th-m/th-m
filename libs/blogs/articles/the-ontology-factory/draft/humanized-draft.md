# Ontology Factory

A system can retrieve every document containing the word `customer` and still
have no idea which customer matters.

The purchaser might be a company. The person using the product might be an
employee. The person calling support might be a contractor. A renewal workflow,
a support policy, and an access-control check can all use the same familiar word
while referring to different people, relationships, and obligations.

Adding more documents does not settle the conflict. It gives the system more
examples of it.

This is the problem an ontology factory is built to solve. It does not gather
every available description of a domain and hope a model chooses the right one.
It makes the choices explicit: which concepts the product recognizes, how they
relate, what evidence supports a claim, and which actions that claim permits.

More context is not the same as better context. Better context has a map.

## AI Needs a Map, Not a Larger Pile of Documents

Retrieval is good at finding material that resembles a question. It is much less
reliable at deciding which local meaning should control a decision. One document
might use *conversation* for a transport session, another for two humans
exchanging speech, and a third for the complete customer interaction across
transfers. Retrieval can surface all three. The ambiguity survives the search.

A person may notice the mismatch and ask what the author meant. A generative
system can simply keep going. It can write a handler, propose a schema, or
produce a plausible answer before anyone settles the distinction. The result
may be syntactically valid and well tested against the predicates it was given,
yet still be wrong about the product.

The missing input is not another paragraph. It is a decision about meaning.

An ontology supplies that decision by locating terms inside a bounded model. It
can say that one kind of customer owns the contract, another uses the product,
and a third may act on behalf of one of them. It can say which evidence
establishes each role and which uncertainty must remain unresolved.

Retrieval can then assemble the portion of the map relevant to the task instead
of treating every nearby sentence as equally authoritative. The goal is not an
enormous prompt. It is selective context.

## A Map Is a Commitment, Not a Mirror

Here is a practical working definition:

> A product ontology states which distinctions the system will recognize, how
> they relate, and what evidence is sufficient to make claims about them.

In knowledge representation, *ontology* can imply a formal account of classes,
relations, functions, and constraints. Product teams often encode only part of
that account, spread across schemas, APIs, policies, types, tests, and prose.
The important move is not choosing one perfect format. It is moving from
implicit assumptions to explicit, reviewable commitments.

The factory's ontology is not a description of what its repository happens to
look like. It is a deliberate account of the distinctions the system will
recognize and maintain.

Those commitments do not neutrally copy reality. A product model selects the
distinctions needed for a purpose. A hospital, an insurer, and a patient may
model the same encounter differently because they face different decisions and
risks. Two teams inside one company may legitimately use the same word
differently, provided the boundary is visible and the translation is deliberate.

Ownership therefore belongs inside the model. Someone must decide when a
distinction no longer fits, when new evidence changes a state, and when an
action exceeds the authority granted by the current claim. Without an owner,
an ontology becomes a frozen vocabulary: official enough to discourage
questions, but too detached from practice to govern anything.

Human judgment still decides whether the map remains useful. The ontology makes
those judgments shareable, testable, and available to the next person or system
that needs to act.

## The Smallest Useful Ontology Packet

An ontology can become so elaborate that maintaining it costs more than the
decisions it improves. A useful minimum has six parts, each answering a
different question.

| Part | Question | Typical expressions |
|---|---|---|
| **Vocabulary** | Which terms do we use, and which apparent synonyms must stay separate? | Definitions, aliases, naming rules, prohibited conflations |
| **Entities and relationships** | What exists in this model, and how can those things connect? | Schemas, graphs, types, identifiers, cardinalities |
| **States and invariants** | What may change, and what must remain true? | State machines, constraints, validation rules, tests |
| **Evidence** | What warrants a claim, and how certain is it? | Events, provenance, observations, confidence, timestamps |
| **Actions and permissions** | What may follow from the claim, who owns the decision, and when must work escalate? | Policies, capabilities, approvals, exception paths |
| **Examples and evaluations** | What counts as an ordinary case, a boundary, a counterexample, or a successful outcome? | Fixtures, scenarios, acceptance tests, observed consequences |

Together, these parts form one semantic contract. A vocabulary without
relationships is a glossary. Entities without evidence encourage the system to
treat every populated field as truth. Evidence without permissions lets an
observation quietly become authority. Actions without evaluation leave no way
to learn whether the model helped.

The packet can live in prose, a graph, a type system, a policy engine, or a test
suite. Most systems will distribute it across several of them. What matters is
that the artifacts point to the same distinctions and make disagreements
visible. The ontology comes first; the formats make parts of it executable.

## Boundaries and Ownership Prevent Semantic Slop

Different parts of an organization may legitimately use the same word in
different ways. Bounded contexts preserve those local meanings without forcing
everyone into one universal vocabulary. Inside a context, terms should be
stable enough that people and tools can identify the same concept. At the
boundary, translation should be explicit enough that one model cannot quietly
overwrite another.

Repository structure can expose those commitments. Consider this path:

```text
libs/edge/audio/state-zustand-player
```

In the SoundSculpt repository ontology, every segment says something. The root
identifies a reusable capability. The layer places it near product-facing work.
The capability names the domain subject. The leaf names a concrete
responsibility: reactive player state implemented with Zustand.

The path is not merely an address. It is a claim about ownership.

> **Figure candidate — A path is a claim about ownership.** Show the four path
> commitments—owner type, layer, capability, and responsibility—composing one
> owned repository concept and routing a bounded change.

The path alone cannot govern a change. A local README can describe what the
scope owns and which concepts it defines. A local AGENTS contract can state how
work proceeds, which invariants apply, and how the change must be verified. An
applicable skill can supply a specialized procedure. These artifacts answer
different questions, so their authority should remain separate.

The factory also does not need to paste every contract into every prompt. For a
specific task, it can resolve the relevant owners, rules, and procedures, then
compose only the material that fits the agent's available context budget. The
context is dynamic. The sources, and the authority each source carries, remain
identifiable.

Selection changes what the agent needs to hold at once. It does not change
which contract governs the work.

> **Figure candidate — Contracts compose context for bounded action.** Show
> README, AGENTS, and Skill as distinct text sources converging through a
> composition step. The selected context fits the agent's budget, governs agent
> action, and carries the observed outcome into evaluation.

This is how an ontology becomes operational. A stable identifier finds the
owner. A typed relationship limits what may depend on what. A contract routes
the work. A procedure performs it. Evaluation produces evidence about whether
the original commitment still holds.

Without those boundaries, generated work tends toward semantic slop: polished
output built on collapsed concepts, incompatible contexts, or unsupported
claims. The prose may sound confident and the code may run. The meaning has
still leaked.

## Two Examples Make the Cost Visible

The value of an ontology becomes clearest when confusing two concepts would
change what the system does. Mango and SoundSculpt expose opposite versions of
the problem. Mango must separate events that ordinary language compresses.
SoundSculpt must preserve relationships and interpretations that a simple
object model would flatten.

### Mango: a protocol answer is not a conversation

In a voice product, *answered* sounds precise until it becomes a trigger.

Suppose a requirement says, “When an answered call ends, send the customer a
follow-up.” A code generator can produce the handler immediately. It cannot
decide what *answered* means unless the product has already decided.

Did a provider establish a connection? Did an answering machine respond? Did a
human participate? Did two humans exchange enough information to satisfy the
product's definition of a conversation? If the call transferred, which
participant is the customer, and which technical session owns the event?

SIP provides technical concepts such as sessions and dialogs. A successful
protocol response can establish those objects without establishing that two
humans conversed. Voice providers make a similar distinction: a technically
completed connection may terminate at a person, an IVR, or voicemail, while
answering-machine detection adds a fallible classification that can remain
unknown.

Mango therefore needs an evidence hierarchy rather than one overloaded `call`
record:

```text
call attempt
  → session or dialog established
  → machine, human, or unknown classification
  → sufficient evidence of human participation
  → Mango-defined conversation
```

Every arrow requires evidence and a product rule. The later concepts are Mango
commitments, not universal SIP categories. Transport observations describe
what the system saw; product claims describe what Mango is entitled to
conclude. Permissions can then attach to the right state. A follow-up may
require stronger evidence than a connection metric, while an ambiguous case
may require delay, review, or no action.

### SoundSculpt: one creative object is several related things

Music presents the complementary risk. The failure here is not treating too
many technical events as one human event. It is treating a creative work, its
realizations, and its reception as properties of one undifferentiated object.

SoundSculpt benefits from keeping at least these concepts separate:

```text
Composition
  → may guide a Performance
  → which may be shaped through Production
  → into a Rendered Sound

Rendered Sound
  → has observable acoustic characteristics
  → can receive product-specific timbre assessments
  → can contribute to perceived mood

Perceived Mood
  ← also depends on Listener and Context

Rights and attribution
  → relate people, works, recordings, uses, territories, and conditions
```

The U.S. Copyright Office independently distinguishes a musical work from a
sound recording of a performance. That legal distinction is not a complete
music ontology, but it confirms that composition and recording cannot safely
collapse into one object. Perceptual research likewise treats timbre as
multidimensional. A composition may constrain instrumentation or technique,
yet SoundSculpt can still attach a timbre assessment to a particular rendered
sound instead of pretending that assessment belongs intrinsically to the score.

The same care applies to mood. A listener's perceived mood depends on the
rendering, the listener, and the situation, even though musical features can
produce regularities in how people describe expression. A useful product
ontology preserves both facts. It can support shared evaluation without
pretending subjective judgment has become objective physics.

That is the larger point: an ontology should not force every meaningful quality
into an intrinsic field. It should locate the relationship in which the claim
becomes valid.

### Controlled language helps after the model exists

Controlled language can make both examples easier to express. ASD-STE100
Simplified Technical English, developed for bounded technical-documentation
work, constrains vocabulary and usage to reduce avoidable ambiguity. An
author-run 2026 experiment applied a subset of those ideas to AI engineering
tasks and reported fewer mechanical rule violations. It involved six tasks,
two models, and a heuristic linter; it did not measure factual correctness,
domain completeness, or operational safety.

That caveat reveals the boundary. Controlled language can tell a system how to
state a claim clearly. It cannot decide whether `answered` means a protocol
event or a human interaction, or whether mood belongs to a composition, a
rendering, or a listener's experience. A wrong domain model can be expressed in
perfectly controlled language.

The factory needs both: an ontology that defines what the answer may refer to,
and an expression system suited to the audience and task.

## The Ontology Learns from Use

An ontology that never changes is a museum. A working ontology participates in
the same loop as the product:

```text
observation
  → ontology commitment
  → assembled context and implementation
  → evaluation
  → counterexample or consequence
  → revision
```

The arrows run both ways in practice. A new distinction changes schemas,
interfaces, tests, prompts, and policies. A production observation can reveal
that the distinction was incomplete. A counterexample can show that two states
must be separated, that an evidence threshold is too weak, or that an action
requires authority the model never represented.

Revision needs the same discipline as any other consequential system change.
The factory versions its terms, identifies their owners, reviews changed
relationships, migrates dependent artifacts, and records conflicts that cannot
be solved by renaming. It preserves provenance so a later reader can ask not
only *what does this mean now?* but *why did we decide it meant this?*

Evaluation closes the loop. Tests can check structural consistency. Review can
challenge whether the right distinctions were chosen. Observed consequences
can show whether a permitted action produced the intended result. None of these
alone proves that the model is correct. Together, they make correction possible.

That is the ontology factory's real product: not a perfect map, but a governed
way to revise the map as the territory pushes back.

The Cognitive Factory begins there. Once operational signals can be interpreted
through explicit concepts, evidence rules, and permissions, the system can turn
observations into bounded, inspectable decisions. Without that map, more
cognition only lets the factory get lost faster.

## Sources

- Thomas R. Gruber, [“A Translation Approach to Portable Ontology Specifications”](https://tomgruber.org/writing/ontolingua-kaj-1993.pdf) (1993). Defines a computational ontology through an explicit representational vocabulary intended for knowledge sharing and reuse.
- Eric Evans, [*Domain-Driven Design Reference*](https://www.domainlanguage.com/ddd/reference/). Provides the bounded-context, ubiquitous-language, and deliberate-model foundations used here.
- IETF, [RFC 3261: SIP — Session Initiation Protocol](https://www.rfc-editor.org/rfc/rfc3261.html). Distinguishes protocol concepts such as dialogs and sessions from product-level claims about human interaction.
- Twilio, [Call Resource](https://www.twilio.com/docs/voice/api/call-resource) and [Answering Machine Detection](https://www.twilio.com/docs/voice/answering-machine-detection). Documents provider call states and the separate, uncertain classification of human and machine answers.
- U.S. Copyright Office, [Circular 56A: Copyright Registration of Musical Compositions and Sound Recordings](https://www.copyright.gov/circs/circ56a.pdf). Distinguishes musical works from sound recordings and their different forms of authorship.
- John M. Grey, [“Multidimensional Perceptual Scaling of Musical Timbres”](https://doi.org/10.1121/1.381428) (1977). Provides primary evidence that perceived timbre has multiple spectral and temporal dimensions.
- Alf Gabrielsson, “Emotion Perceived and Emotion Felt: Same or Different?” (2001), and Patrik N. Juslin and Daniel Västfjäll, [“Emotional Responses to Music: The Need to Consider Underlying Mechanisms”](https://doi.org/10.1017/S0140525X08005293) (2008). Support the separation of musical expression, listener response, and context.
- ASD Simplified Technical English Maintenance Group, [ASD-STE100](https://asd-ste100.org), Issue 9 (2025). Defines the controlled-language system used as the bounded technical-writing example.
- Ege Chelebi, [“The cure for AI slop is a 1986 aircraft manual”](https://www.chele.bi/videos/the-cure-for-ai-slop) (2026). Supplies the small author-run AI writing experiment and its caveats.
