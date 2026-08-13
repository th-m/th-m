# The Next Abstraction Layer: Software Engineering Becomes Ontology Design

## Overview

AI is making the translation from an instruction to working code faster and cheaper. That does not eliminate software engineering; it moves the most consequential engineering work upstream. When implementation is abundant, the scarce work is deciding what exists in a domain, which distinctions matter, how concepts relate, and what each term must mean for people and machines to coordinate reliably.

This post should argue that ontology design is becoming a higher and more important abstraction layer in software. The claim is not that code, architecture, or developers disappear. It is that generated implementation magnifies the quality of the model supplied to it. A vague model can now produce a large amount of plausible but incorrect software very quickly. A precise model gives AI a stable vocabulary, valid relationships, and boundaries against which implementation can be generated and evaluated.

Use two grounded examples. Mango shows why a technically successful phone response is not necessarily a human conversation, and why a communications product needs separate concepts for calls, legs, sessions, endpoints, participants, transfers, bridges, and answer states. Sound Sculpt shows how a creative domain can be modeled without flattening it: composition, performance, production, and rights are distinct macro-level groups; rendered timbre can be assessed through shared scorecards; and perceived mood remains emergent and relational rather than being treated as a primitive fact about a composition.

The post should remain exploratory. It should describe a change in where leverage and difficulty accumulate, not predict that ontology work will become the only form of software engineering.

## Core Thesis

As AI automates more implementation, software engineering moves toward intent and ontology design: defining a domain's entities, categories, relationships, distinctions, constraints, and stable meanings well enough that implementation can be generated and its correctness can be judged.

Supporting claims:

- Every abstraction layer hides lower-level mechanics and makes the accuracy of the layer above it more important.
- Natural-language fluency does not guarantee semantic precision. AI can implement an ambiguous instruction confidently.
- A domain-specific language gives collaborators and machines a bounded vocabulary, but it is useful only when its meanings are stable.
- Semantic accuracy requires using the same term for the same meaning and different terms for materially different meanings.
- An ontology is more than a glossary or database schema. It identifies what exists in the modeled world and how those things relate.
- Implementation is one expression of an ontology. A database schema, API, UI, prompt, or generated codebase may each embody the same deeper model.
- The goal is not to remove human judgment. It is to place human judgment where meaning, boundaries, and exceptions are decided.

## Editorial Direction

### Intended reader

Write for software builders, technical product leaders, founders, and domain experts who already sense that AI changes development but may still describe that change mainly as faster coding.

### Tone

- Concrete, curious, and confident without becoming deterministic.
- Practical rather than academic; define ontology with examples before leaning on the term.
- Respectful of implementation work. Avoid implying that code is trivial or that current engineering disciplines no longer matter.
- Precise about the difference between formalized domain meaning and relational human interpretation.

### Editorial guardrails

- Do not equate ontology design with prompt engineering.
- Do not reduce ontology to a list of nouns, a database diagram, or a taxonomy. Include entities, categories, relationships, distinctions, and boundaries.
- Do not claim that natural language is inherently unsuitable for programming. The narrower claim is that unconstrained ambiguity creates risk when shared meanings are required.
- Do not present the Mango or Sound Sculpt models as universal standards. They are examples of domain-specific distinctions created for particular products.
- Keep the hierarchy clear: ontology informs implementation; implementation also reveals gaps that feed back into the ontology.

## Detailed Section Notes

### 1. Opening: Ambiguity Is an Operational Risk

Open outside ordinary software development, with controlled language in aviation or technical documentation. In safety-critical and operational settings, an ambiguous word is not merely inelegant prose: it can cause different people to perform different actions. A constrained vocabulary and stable definitions improve reliability because writers, operators, maintainers, and systems can coordinate around the same meaning.

The purpose of this hook is conceptual, not historical. It establishes that limiting expression can increase useful precision. Connect that principle to AI-generated software: a model can respond to ambiguous language fluently, but fluency does not resolve which interpretation the author intended.

Drafting beats:

1. Show a plausible instruction containing a term that could carry two operational meanings.
2. Explain that both readings can be grammatically valid while only one is safe or correct in context.
3. Introduce controlled language as an attempt to reduce this semantic branching.
4. Pivot: AI makes producing an answer easier, which makes agreeing on the meaning of the question more valuable.

Do not invent a specific aviation incident. If the draft names a controlled-language standard, organization, origin story, adoption date, or quantified safety benefit, verify it before publication.

### 2. From Vocabulary to Ontology

Define the three central ideas in an order that readers can build on:

**Domain-specific language (DSL):** a vocabulary for a bounded field whose terms carry precise, shared meanings. In this article, DSL refers broadly to the language a domain uses to express its concepts; it need not mean only a formal executable programming language.

**Semantic accuracy:** the discipline of using the same term for the same meaning and different terms for different meanings. Synonyms can be helpful in prose, but they can hide meaningful distinctions in a system model. Conversely, reusing one familiar word for multiple domain concepts can cause incorrect behavior.

**Ontology:** an explicit model of the entities, categories, relationships, and distinctions that a system treats as real. An ontology answers questions such as: What kinds of things can exist? What is a part of what? Which events change state? Which relationships can overlap? What looks similar technically but must remain different semantically?

Make the progression visible:

> vocabulary names the concepts; semantic discipline keeps the names stable; ontology defines the world those concepts form together.

Clarify what ontology is not:

- A glossary explains words but may not define relationships or constraints.
- A taxonomy classifies things but may not model events, state, or interaction.
- A database schema stores a chosen representation but may reflect implementation compromises rather than the complete domain.
- A prompt asks for behavior but may leave the underlying concepts implicit.

The point is not to insist on a heavyweight formal exercise before any work begins. Ontologies can be developed iteratively, and implementation will expose missing distinctions. The important change is treating this modeling work as a first-class engineering artifact rather than incidental vocabulary scattered across tickets and code.

### 3. A Short History of Abstraction

Walk through the recurring direction of software history: builders express intent at increasingly higher levels while lower layers translate that intent into executable behavior.

Use this sequence:

1. **Machine architecture:** instructions conform directly to a computer's execution model.
2. **Assembly:** symbolic names replace raw opcodes while the machine remains close at hand.
3. **Higher-level languages:** programmers express algorithms and data structures without managing every machine instruction.
4. **Frameworks and libraries:** reusable conventions and components encode common implementation patterns.
5. **Cloud abstractions:** managed services hide more infrastructure and operational mechanics.
6. **Domain models:** software is organized around concepts meaningful to a business or practice.
7. **AI-generated implementation:** natural-language instructions and examples can produce code across several lower layers.
8. **Ontology and intent design:** the builder's leverage concentrates in defining the conceptual world, expected behavior, and criteria by which generated implementation is correct.

Frame this as continuity rather than rupture. Each new layer depends on the old layers and can leak. Higher-level languages did not abolish machine architecture; cloud services did not abolish infrastructure; AI generation will not abolish implementation knowledge. The shift is in where most people spend attention and where mistakes become most expensive.

Include a crucial asymmetry: AI can produce syntactically and technically valid code even when the domain model is wrong. Compile success, test success, and semantic success are different thresholds. Tests derived from the same ambiguous model may only confirm the ambiguity.

### 4. Mango: A Successful Response Is Not Necessarily a Conversation

Introduce Mango as a communications example where everyday language collapses several technically and socially different events into the word “call.” The model needs enough resolution to describe routing and transport without pretending those mechanics prove that two humans communicated.

#### The full call ontology

Use the following terms consistently:

- **Call:** the overall communication attempt or product-level event being tracked.
- **Call leg:** one routed connection segment within that attempt. A call can create multiple legs, including during forwarding or transfer.
- **Conversation:** an interaction in which human participants actually communicate. Do not infer this solely from a successful network response.
- **Participant:** a person or other actor associated with the communication.
- **Endpoint:** the addressable destination or device reached by the system.
- **Session:** the technical communication context established between endpoints or system components.
- **Human answer:** a person answers in a way that can support a human conversation.
- **Protocol answer:** the network or telephony protocol reports that the destination answered; voicemail, an automated system, or other machinery may satisfy this condition.
- **Transfer:** an operation that redirects or hands an active communication to another endpoint, participant, or leg.
- **Bridge:** a structure that joins multiple legs or participants into a shared communication context.
- **Missed call:** a call attempt that does not result in the relevant human connection, even if some technical component responded.

The key distinction is:

> A protocol can report a successful answer without establishing that a human answered, and a human answer does not by itself prove that a meaningful conversation occurred.

Use one compact scenario to exercise the model: an incoming call reaches an endpoint, a protocol answer occurs, and the call is transferred or bridged through additional legs. Ask which facts are known at each point. The system may know that sessions were created and legs connected. It should not casually claim a conversation unless the product has evidence for that semantic state.

This section should show why precision changes product behavior:

- Analytics differ depending on whether “answered” means protocol answer or human answer.
- A missed-call workflow depends on the intended human outcome, not only transport success.
- Transfers and bridges make a one-record-per-call model misleading.
- UI language should reflect what the system knows rather than overstate human interaction.
- AI asked to “handle answered calls” cannot implement the right behavior until “answered” is disambiguated.

#### Mango visual

Start with an intentionally ambiguous sketch in which **call**, **conversation**, and **call leg** are shown as loosely overlapping labels. Then replace it with defined entities and labeled relationships: a Call has one or more Call legs; legs connect Endpoints or Sessions; Participants may join; Transfer creates or redirects legs; Bridge joins them; Protocol answer and Human answer are distinct observations; Conversation is a semantically stronger outcome.

Use an Euler or nested-set diagram when showing subset or containment relationships. Use a Venn diagram only when the modeled categories truly overlap independently. Do not use decorative overlap that suggests a false set relationship.

### 5. Sound Sculpt: Modeling a Creative Domain Without Flattening It

Introduce Sound Sculpt as the complementary example. Communications demand precision because several technical events are easily confused; music demands precision because several creative contributions combine into one listening experience. The ontology must separate those contributions while preserving the qualities that emerge from their interaction.

#### Macro ontology for a musical work and its rendering

Organize the domain into four macro groups.

**Composition** describes the organized musical material and its movement through time:

- Pattern
- Rhythm
- Tempo/BPM
- Melody
- Harmony
- Chord progression
- Tonal organization
- Structural movement through time

**Performance** describes how people or systems realize that material:

- Sample provider/performer
- Timing/feel
- Dynamics
- Articulation
- Intonation
- Virtuosity
- Interpretive choices

**Production** describes how the performance is captured, transformed, and presented:

- Recording/capture
- Sound design
- Signal chain
- Effects
- Mixing
- Mastering
- Spatial placement

**Attribution and rights** describe contribution, ownership, and permitted use:

- Performer
- Composer
- Producer
- Mixer
- Rights holder
- License
- Permitted uses

These groups should not be presented as four mutually exclusive boxes containing every possible music concept. They are macro-level distinctions that prevent a single word such as “song,” “sound,” or “artist” from carrying incompatible meanings. State explicitly that a rendered track may embody all four groups while the concepts remain analytically distinct.

#### Timbre belongs to rendered sound

Treat timbre as a quality evaluated on rendered audio, influenced by both performance and production. Do not make timbre a primitive property of an abstract composition. The same melodic and harmonic material can have materially different timbre when played with different articulation, instruments, signal chains, effects, or spatial treatment.

Use this hierarchy:

> Audio Asset → Rendered Sound → Timbre → Scorecard dimensions

The scorecard dimensions are:

- **Brightness**
- **Depth**
- **Texture**
- **Density**
- **Attack**
- **Spatial Character**

Explain the scorecard's role carefully. It does not turn aesthetic judgment into objective ground truth. It gives collaborators a shared frame for applying vague adjectives more consistently. The ontology defines which quality is being evaluated and where it belongs; the scorecard makes comparison and feedback more repeatable.

Possible drafting example: “make it warmer” is under-specified. A shared scorecard can prompt the team to ask whether the intended change concerns brightness, attack, density, spatial character, or some combination. The point is not that “warmth” has one universal formula, but that a bounded evaluative language supports clearer iteration.

#### Mood is emergent and relational

Do not model mood as a necessary primitive property of composition. Separate three things:

1. **Creative intent:** the mood or effect a creator hopes to evoke.
2. **Observable musical characteristics:** features of composition, performance, production, and timbre that can be described or measured.
3. **Perceived mood:** a listener's relational interpretation in a particular context.

Present mood as emerging from the interaction of:

- composition,
- performance,
- production,
- timbre,
- listening context, and
- listener.

The same composition can feel different under another performance or production; the same rendering can feel different to another listener or in another context. A system may store creative intent, observable characteristics, and listener responses, but it should not collapse them into a single supposedly intrinsic mood fact.

This example should land the larger thesis: a useful ontology does not force every important idea into a primitive field. It also identifies which properties are rendered, inferred, emergent, contextual, or relational.

### 6. The Engineer's Changing Role

Return from the examples to the argument. When AI can generate endpoints, schemas, UI components, integrations, and tests, the engineer increasingly supplies and maintains the semantic frame within which those outputs make sense.

Describe the role as:

- identifying entities and relationships;
- separating concepts that everyday language collapses;
- defining invariants, boundaries, and evidence thresholds;
- deciding which properties are intrinsic, observed, inferred, emergent, or relational;
- creating examples and counterexamples that expose ambiguity;
- evaluating whether implementation preserves the intended meaning across data, APIs, UI, analytics, and automation; and
- revising the ontology when real use reveals missing concepts or exceptions.

Keep the feedback loop explicit. Ontology is not handed down once and then frozen. Domain experts, users, engineers, and observed behavior continually test whether its distinctions are useful. AI can assist with implementation and consistency checks, but people remain responsible for deciding whether the model describes the domain responsibly and usefully.

### 7. The New Bottleneck

Bring both examples together. In Mango, generated code cannot decide whether a protocol answer counts as a conversation; that is a product and domain decision. In Sound Sculpt, generated code cannot decide whether mood is an intrinsic property, a creative intention, or a listener response without silently choosing an ontology. In both cases, the model exists whether the team makes it explicit or not.

The risk of AI-generated implementation is therefore not only hallucinated code. It is invisible semantic drift: one screen, service, prompt, or metric uses a term differently from another while every local component appears to work.

End the body with a practical question for teams: before asking AI to build the next feature, can the team name the entities involved, state how they relate, and identify the distinctions the implementation must not erase?

## Visual Sequence

The post should use a sequence of diagrams that progressively makes the argument rather than one overloaded graphic.

1. **Abstraction ladder:** machine architecture → assembly → higher-level languages → frameworks/libraries → cloud abstractions → domain models → AI-generated implementation → ontology/intent design.
2. **Mango ambiguity to precision:** first show “call,” “conversation,” and “call leg” as ambiguous overlapping language; then replace it with defined entities, answer states, and labeled relationships.
3. **Sound Sculpt macro groups:** split a song/rendered musical experience into Composition, Performance, Production, and Attribution/Rights.
4. **Timbre hierarchy:** Audio Asset → Rendered Sound → Timbre → Brightness, Depth, Texture, Density, Attack, and Spatial Character scorecards.
5. **Emergent mood:** concrete sets for composition, performance, production, and timbre combine with context and listener to produce perceived mood; creative intent is shown separately.
6. **Closing synthesis:** Natural language → Domain ontology → AI implementation, with an evaluation arrow from implementation back to the ontology to show iteration.

Use Mermaid during drafting if helpful, but commission or create publication graphics only after the relationships have been reviewed. Diagrams must not imply set containment, causality, or object ownership that the prose does not establish.

## Examples and Drafting Placeholders

- **Opening instruction:** `[Insert a verified controlled-language example in which an everyday ambiguous term is replaced by one approved operational term.]`
- **Mango trace:** `[Insert a short, product-accurate event sequence containing a Call, multiple Call legs, a Protocol answer, a Transfer or Bridge, and the uncertain status of Human answer/Conversation.]`
- **Sound Sculpt comparison:** `[Insert two renderings of the same compositional material whose performance or production choices yield different timbre scorecards.]`
- **Mood comparison:** `[Insert a grounded example showing the same rendering interpreted differently by context or listener, without claiming universal emotional effects.]`
- **AI prompt contrast:** `[Show a vague request and a domain-defined request, then compare what each permits the implementation to assume.]`

## Fact-Check and Research Caveats

Before converting this brief into a publishable draft:

- Verify the history, terminology, governing organization, and current status of any aviation or technical controlled-language standard mentioned.
- Verify all dates and causal claims in the abstraction-history section. Present the ladder as a conceptual progression unless a sourced chronology is needed.
- Confirm that “domain-specific language” is introduced in the broad domain-vocabulary sense used here; acknowledge the narrower executable-language meaning if the final wording could confuse technical readers.
- Review the complete Mango ontology with a communications-domain expert. In particular, verify how the product distinguishes Call, Call leg, Endpoint, Session, Human answer, Protocol answer, Transfer, Bridge, Conversation, and Missed call.
- Do not claim that technical systems can reliably detect a human conversation unless the actual evidence and limitations are documented.
- Review the Sound Sculpt macro groups and hierarchy with the product/domain owner. Do not imply that the lists are exhaustive or universally accepted musicological categories.
- Treat timbre scorecards as a shared evaluative framework, not scientifically objective measurements, unless measurement methods and validation evidence are supplied.
- Avoid universal claims connecting specific musical features to specific moods. Distinguish creator intent, observable characteristics, and listener interpretation.
- Check every diagram for accurate relationship semantics. Use Euler/nested-set notation for true subsets and Venn notation only for genuine overlap.
- Source any claim that AI has reduced implementation cost or changed developer effort if it is stated quantitatively. The qualitative thesis can remain framed as an observed direction.

## Candidate Closing Line

> When code becomes inexpensive, the expensive work is deciding exactly what the code should mean.
