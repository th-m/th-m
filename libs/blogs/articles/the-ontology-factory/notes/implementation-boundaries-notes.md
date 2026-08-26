# Implementation Boundaries

## Status and purpose

Working note for *The Ontology Factory*. These sources support the claim that
an ontology's commitments are expressed and enforced through implementation
boundaries — modules, services, and dependency rules — and that maintaining a
map of the domain is continuous with maintaining the architecture that encodes
it. Recorded as supplied references; verify quotations against the primary
sources before promoting any claim into the article.

## Sources

### A Philosophy of Software Design, second edition extract

- <https://web.stanford.edu/~ouster/cgi-bin/aposd2ndEdExtract.pdf>
- Author-published sample from John Ousterhout's *A Philosophy of Software
  Design* (2nd ed.), hosted on his Stanford page.

Relevance: Ousterhout's core distinction between a module's interface and its
implementation, and the "deep module" argument, give the article a concrete way
to say that an implementation boundary is a commitment about what the rest of
the system is allowed to know. A module's interface is a kind of mini-ontology:
it fixes which distinctions are visible and which are hidden. The same reasoning
applies to a factory ontology packet — the interface is the maintained contract,
the implementation details behind it may change.

### Introducing Domain-Oriented Microservice Architecture

- <https://www.uber.com/us/en/blog/microservice-architecture/>
- Uber Engineering blog post describing how Uber organizes its microservices
  around domains.

Relevance: Uber's post is a working example of drawing boundaries from the
domain rather than from technology or team structure. It supports the article's
bounded-context argument: when a system is large enough to require many
services, someone must decide which domain each service belongs to, what each
service is responsible for knowing, and what crosses the boundary as a
dependency. Those decisions are ontology commitments rendered as architecture.

### Nx: Project dependency rules (enforce module boundaries)

- <https://nx.dev/docs/kb/project-dependency-rules>
- Nx knowledge-base entry on constraining which projects may depend on which,
  and what those rules enforce in the build.

Relevance: dependency rules are an operational mechanism for making a boundary
machine-checkable. A declared rule ("project A may not depend on project B")
turns an intended boundary into a testable invariant, the same move the article
proposes for ontology commitments — encode the commitment in an artifact that
the build or CI can verify, not only in prose.

## What the article may use these for

- **Section 9 (Ontology as a Living Factory System):** the maintenance loop
  treats ownership, review, versioning, migration, and conflict resolution for
  semantic changes as continuous with the same needs for APIs and schemas.
  These sources give the section real architecture vocabulary: interfaces
  (Ousterhout), domain organization (Uber), and enforceable rules (Nx).
- **Ontology packet (Section 6):** evidence that different implementations
  express the same conceptual contract — module interfaces, service
  boundaries, and dependency rules are all places a boundary commitment shows
  up in code.
- **Guardrails:** do not present any of these as *the* way to do ontology. Each
  is one mechanism for expressing or enforcing a boundary; the article's point
  is that the map comes first and the mechanism follows.

## Editorial follow-up: evaluative boundaries for AI delegation

*The Understanding Bottleneck* will describe this pattern generically: a
delegated system needs descriptive context, operational rules, an allowed
solution space, reasons for its boundaries, signals that may warrant an
exception, a challenge-and-escalation protocol, explicit authority, and a
revision record.

*The Ontology Factory* should later show how the repository contract system
instantiates that pattern:

- the nearest README supplies purpose, boundaries, vocabulary, stable
  relationships, and the rationale an agent needs to interpret the boundary;
- the nearest AGENTS file supplies workflows, invariants, verification, skills,
  and downlinks that govern safe action and escalation;
- an applicable skill supplies a specialized procedure;
- the current task states what is settled, what remains open to solutioning,
  and which evidence may justify an exception; and
- issues, changes, verification, review, and evidence preserve consequences and
  revise the contract when its model no longer fits.

Flesh out the authority model rather than treating ownership and authority as
synonyms. Distinguish ownership of a scope, authority over the current decision,
authority to approve an exception, and authority to revise the underlying
contract. An agent may identify evidence that challenges a boundary and propose
the narrowest reasonable exception, but it may not silently cross or redefine
the boundary. Higher-level vision and strategy should be linked from their
authoritative owner when they change more quickly than the local contract.

## Caveats

- The Ousterhout PDF is an extract, not the full book; cite it as an extract or
  cite the published book for claims about the full argument.
- The Uber post describes one large company's architecture at a point in time;
  do not present domain-oriented microservice architecture as a universal
  prescription.
- Nx is a build tool with its own conventions; the dependency-rule mechanism
  generalizes, but the doc itself is tool-specific.
