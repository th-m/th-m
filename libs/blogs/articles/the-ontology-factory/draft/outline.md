# Ontology Factory

## Role in the Series

**Question:** What shared model makes AI context precise, reusable, and safe to
act upon?

**Thesis:** More context is not the same as better context. An ontology is an
explicit commitment about the concepts a system recognizes, how they relate,
what evidence supports its claims, and which actions those claims permit. It
lets people and AI coordinate without silently collapsing important distinctions.

## Audience

Product and engineering teams building domain-heavy software and reusable AI
context.

## Outline

### 1. AI Needs a Map, Not a Larger Pile of Documents

Open with an overloaded term such as `customer`, `conversation`, `song`, or
`risk`. Retrieval can find every use of the word while mixing incompatible
meanings.

The problem is not missing text. It is missing commitments about which meaning
controls which decision.

### 2. A Map Is a Commitment, Not a Mirror

Use one working definition:

> A product ontology states which distinctions the system will recognize, how
> they relate, and what evidence is sufficient to make claims about them.

An ontology is designed and governed. It reflects a purpose, perspective, and
risk boundary; it is not a neutral copy of reality.

### 3. The Smallest Useful Ontology Packet

Compress the existing ten-part packet into six parts:

1. **Vocabulary:** preferred terms, aliases, and prohibited conflations.
2. **Entities and relationships:** what exists in the model and how it connects.
3. **States and invariants:** what may change and what must remain true.
4. **Evidence:** what warrants a claim, including provenance and uncertainty.
5. **Actions and permissions:** what the system may do, who owns it, and when to
   escalate.
6. **Examples and evaluations:** ordinary cases, boundaries, counterexamples,
   and tests.

The packet may be encoded through prose, schemas, types, graphs, policies, or
tests. It is a semantic contract, not a required file format.

### 4. Boundaries and Ownership Prevent Semantic Slop

Different parts of an organization may legitimately use the same word
differently. Bounded contexts make those differences explicit. Ownership gives
someone responsibility for changing the model when evidence or purpose changes.

Stable identifiers and typed relationships let the factory assemble only the
context needed for a task instead of filling a prompt with everything retrieved.

### 5. Two Examples Are Enough

Keep the existing examples, but use each to teach one distinction:

- **Mango:** a protocol answer is not necessarily a human conversation. The
  ontology separates technical observations from product outcomes.
- **SoundSculpt:** composition, performance, rendering, mood, and rights must not
  collapse into one creative object. The ontology coordinates what must be
  shared while preserving subjective judgment.

Controlled language can improve expression inside the model. It cannot choose
the domain model itself.

### 6. The Ontology Learns from Use

Close with the maintenance loop:

> observation → ontology commitment → context and implementation → evaluation →
> counterexample or consequence → revision

Semantic slop is clean output built on collapsed concepts, incompatible
contexts, or claims the system cannot support. Versioning, review, migration,
and conflict resolution make the ontology a living factory system rather than a
glossary.

## Keep from the Existing Material

- Ontology as commitment rather than mirror.
- Designed context instead of indiscriminate retrieval.
- Controlled language as a support, not a substitute for domain modeling.
- Mango and SoundSculpt as the two concrete cases.
- Semantic slop as the closing failure mode.

Cut the ontology packet from ten top-level items to six and fold in-context
learning, provenance, versioning, and evaluation into those sections.

## Research Obligations

- Preserve the caveats around the controlled-language experiment.
- Prefer primary sources for in-context learning, bounded contexts, and any
  product-specific claims.
- Make explicit where the ontology represents a local product commitment rather
  than a universal category.

## Handoff

*Cognitive Factory* uses this map to interpret signals and connect discoverable
organizational memory with the present decision. Triggers, agent DAGs, and loop
engineering belong in *The Knowledge Factory*.
