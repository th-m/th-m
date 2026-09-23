# Ontology Factory

A system can retrieve every document that contains the word `customer` and
still not know which customer matters.

The purchaser may be a company. The person using the product may be an
employee. The person calling support may be a contractor. A renewal workflow,
a support policy, and an access-control check can all use the same familiar word
while referring to different people, relationships, and obligations. More
documents do not resolve the conflict. They give the system more examples of
the conflict.

This is the problem an ontology factory is built to solve. It does not collect
every available description of a domain and hope that a model finds the right
one. It makes a set of commitments explicit: which concepts the product
recognizes, how those concepts relate, what evidence supports a claim, and
which actions that claim permits.

More context is not the same as better context. Better context has a model.

## AI Needs a Map, Not a Larger Pile of Documents

Retrieval is good at finding material that resembles a question. It is less
good at deciding which local meaning should control a decision. If one document
uses *conversation* for a transport session, another for two humans exchanging
speech, and a third for the complete customer interaction across transfers,
retrieval can surface all three. The ambiguity survives the search.

A person may notice the mismatch and ask what the author meant. A generative
system can continue. It can write a handler, propose a schema, or produce a
plausible answer before anyone settles the distinction. The result can be
syntactically valid, well tested against the predicates it was given, and still
wrong about the product.

The missing input is not another paragraph. It is a decision about meaning.

A map supplies that decision by locating terms inside a bounded model. It says
that this kind of customer owns the contract, that kind uses the product, and a
third kind may act on behalf of one of them. It says which evidence can establish
each role and which uncertainty must remain unresolved. Then retrieval can
assemble the part of the map relevant to the task instead of treating every
nearby sentence as equally authoritative.

The point is not to make prompts enormous. It is to make context selective.

## A Map Is a Commitment, Not a Mirror

A useful working definition is:

> A product ontology states which distinctions the system will recognize, how
> they relate, and what evidence is sufficient to make claims about them.

That definition is intentionally practical. In knowledge representation,
ontology can imply a formal account of classes, relations, functions, and
constraints. Product teams often encode only part of that account, across
schemas, APIs, policies, types, tests, and prose. The important move is not a
particular file format. It is the move from implicit assumptions to explicit,
reviewable commitments.

Those commitments do not neutrally copy reality. A product model selects the
distinctions needed for a purpose. A hospital, an insurer, and a patient may
model the same encounter differently because they face different decisions and
risks. Two teams inside one company may legitimately use the same word
differently, provided the boundary is visible and the translation between
contexts is deliberate.

This makes ownership part of the model. Someone must be responsible for saying
when a distinction no longer fits, when new evidence changes a state, and when
an action has crossed the authority granted by the current claim. Without that
responsibility, an ontology becomes a frozen vocabulary: consistent enough to
look official, but too detached from practice to govern anything.

Human judgment still decides whether the map's distinctions remain useful. The
ontology makes those judgments shareable, testable, and available to the next
person or system that must act.

## The Smallest Useful Ontology Packet

An ontology can become so elaborate that maintaining it costs more than the
decisions it improves. The smallest useful packet contains six parts. Each part
answers a different question.

| Part | Question | Typical expressions |
|---|---|---|
| **Vocabulary** | Which terms do we use, and which apparent synonyms must stay separate? | Definitions, aliases, naming rules, prohibited conflations |
| **Entities and relationships** | What exists in this model, and how can those things connect? | Schemas, graphs, types, identifiers, cardinalities |
| **States and invariants** | What may change, and what must remain true? | State machines, constraints, validation rules, tests |
| **Evidence** | What warrants a claim, and how certain is it? | Events, provenance, observations, confidence, timestamps |
| **Actions and permissions** | What may follow from the claim, who owns the decision, and when must work escalate? | Policies, capabilities, approvals, exception paths |
| **Examples and evaluations** | What counts as an ordinary case, a boundary, a counterexample, or a successful outcome? | Fixtures, scenarios, acceptance tests, observed consequences |

The six parts form one semantic contract. A vocabulary without relationships is
a glossary. Entities without evidence encourage the system to treat every
populated field as truth. Evidence without permissions lets an observation
silently become authority. Actions without evaluations make it impossible to
learn whether the model helped.

The packet can be encoded in prose, a graph, a type system, a policy engine, or
a test suite. Most real systems will distribute it across all of them. What
matters is that the artifacts point to the same distinctions and make conflicts
visible. The ontology precedes the format; the format makes parts of the
ontology executable.

## Boundaries and Ownership Prevent Semantic Slop

Bounded contexts allow a system to preserve local meaning without demanding one
universal vocabulary. Inside a context, terms should be stable enough that
people and tools can identify the same concept. At the boundary, translation
should be explicit enough that one model does not quietly overwrite another.

Repository structure can expose these commitments. Consider the path:

```text
libs/edge/audio/state-zustand-player
```

In the SoundSculpt repository ontology, each segment contributes meaning. The
root identifies a reusable capability. The layer places it near product-facing
work. The capability names the domain subject. The leaf names a concrete
responsibility: reactive player state implemented with Zustand. The path is not
only a filesystem address. It is a claim about ownership.

> **Figure candidate — A path is a claim about ownership.** Show the four path
> commitments—owner type, layer, capability, and responsibility—converging on
> one owned repository concept and routing a bounded change.

The path alone cannot govern a change. A local README can describe what the
scope owns and which concepts it defines. A local AGENTS contract can state how
work proceeds, which invariants apply, and how the change must be verified. An
applicable skill can supply a specialized procedure. These artifacts answer
different questions, and their authority should remain separate.

The factory does not need to copy every contract into every prompt. For each
task, it can resolve the relevant owners, rules, and procedures, then compose
only the material that fits the agent's available context budget. The context is
dynamic; the sources and their authority remain identifiable. Selection changes
what the agent needs to hold at once, not which contract governs the work.

> **Figure candidate — Contracts compose context for bounded action.** Show
> README, AGENTS, and Skill as distinct text sources that converge through a
> composition step. The selected context fits the agent's budget, governs agent
> action, and carries the observed outcome into evaluation.

This is how an ontology becomes operational. A stable identifier lets the
factory find the owner. A typed relationship limits what can depend on what. A
contract routes the work. A procedure performs it. Evaluation produces evidence
about whether the original commitment still holds.

Without those boundaries, generated work tends toward semantic slop: clean
output built on collapsed concepts, incompatible contexts, or claims the
system cannot support. The prose may be polished and the code may run. The
meaning has still leaked.

## Two Examples Are Enough

The value of an ontology becomes clearest when confusing two concepts would
change what the system does. Mango and SoundSculpt expose opposite forms of the
problem. Mango must split events that ordinary language compresses. SoundSculpt
must preserve relationships and interpretations that a simple object model
would flatten.

### Mango: a protocol answer is not a conversation

In a voice product, *answered* sounds precise until it becomes a trigger.

Suppose a requirement says: “When an answered call ends, send the customer a
follow-up.” A code generator can produce the event handler immediately. It
cannot determine what *answered* means unless the product has already decided.
Did a provider establish a connection? Did an answering machine respond? Did a
human participate? Did two humans exchange enough information to satisfy the
product's definition of a conversation? If the call transferred, which
participant is the customer and which technical session owns the event?

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

Each arrow requires evidence and a product rule. The latter concepts are Mango
commitments, not universal SIP categories. The ontology's job is to preserve
that boundary: transport observations describe what the system saw; product
claims describe what Mango is entitled to conclude. Permissions can then attach
to the right state. A follow-up may require stronger evidence than a connection
metric, and an ambiguous case may require delay, review, or no action.

### SoundSculpt: one creative object is several related things

Music presents the complementary risk. Here, the failure is not treating too
many technical events as one human event. It is treating a creative work, its
realizations, and its reception as properties of one undifferentiated object.

SoundSculpt benefits from distinguishing at least these concepts:

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
music ontology, but it confirms that composition and recording cannot safely be
collapsed. Perceptual research likewise treats timbre as multidimensional. A
composition may constrain instrumentation or technique, yet SoundSculpt can
still attach a timbre assessment to a particular rendered sound rather than
pretending the score belongs intrinsically to the abstract composition.

The same care applies to mood. A listener's perceived mood depends on the
rendering, the listener, and the situation, even though musical features can
produce systematic regularities in how people describe expression. A useful
product ontology preserves both facts. It can support a shared evaluative
vocabulary without claiming that subjective judgment has become objective
physics.

That distinction is the point. An ontology should not force every meaningful
quality into an intrinsic field. It should locate the relationship in which the
claim becomes valid.

### Controlled language helps after the model exists

Controlled language can make both examples easier to express. ASD-STE100
Simplified Technical English, developed for bounded technical-documentation
work, constrains vocabulary and usage so writers can reduce avoidable
ambiguity. An author-run 2026 experiment applying a subset of those ideas to AI
engineering tasks reported fewer mechanical rule violations, but it involved
six tasks, two models, and a heuristic linter. It did not measure factual
correctness, domain completeness, or operational safety.

The caveat reveals the boundary. Controlled language can tell a system how to
state a claim clearly. It cannot decide whether `answered` means a protocol
event or a human interaction, or whether mood belongs to a composition, a
rendering, or a listener's experience. A wrong domain model can be expressed in
perfectly controlled language.

The factory needs both: an ontology to define what the answer may refer to, and
an expression system appropriate to the audience and task.

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
requires authority the model did not represent.

Revision therefore needs the same discipline as any other consequential system
change. The factory versions its terms, identifies their owners, reviews changed
relationships, migrates dependent artifacts, and records conflicts that cannot
be resolved by renaming. It preserves provenance so a later reader can ask not
only *what does this mean now?* but *why did we decide it meant this?*

Evaluation closes the loop. Tests can check structural consistency. Review can
challenge whether the right distinctions were chosen. Observed consequences
can show whether the permitted action produced the intended result. None of
these alone proves that the model is correct. Together, they make correction
possible.

This is the factory's real product: not a perfect map, but a governed way to
revise the map as the territory pushes back.

The Cognitive Factory begins from there. Once operational signals can be
interpreted through explicit concepts, evidence rules, and permissions, the
system can turn observations into bounded, inspectable decisions. Without that
map, more cognition only lets the factory get lost faster.

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
