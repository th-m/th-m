# Distributional Meaning and Generative Grammar

## Research Question

Who developed the idea of distributional meaning before J. R. Firth's famous
1957 formulation, and how does that tradition relate to Noam Chomsky's account
of language as a finite generative system capable of producing an unbounded
number of expressions?

Related note:
[`distributional-meaning-tokens-and-embeddings.md`](./distributional-meaning-tokens-and-embeddings.md)

## Short Answer

There is no uncontested single inventor of distributional meaning. The most
useful genealogy is:

> **Saussure supplied the relational foundation; Firth developed contextual
> and collocational meaning; Harris formulated the distributional method most
> directly inherited by computational linguistics.**

Distributional linguistics and Chomskyan generative grammar then address
different dimensions of language:

> **Distributional semantics asks how use gives an expression significance.
> Generative grammar asks how finite cognitive machinery produces an unbounded
> space of structured expressions.**

## Before Firth's 1957 Slogan

### Ferdinand de Saussure: Relational Value

Saussure's lectures from 1906–1911 were published posthumously in 1916 as
[*Course in General Linguistics*](https://fr.wikisource.org/wiki/Cours_de_linguistique_g%C3%A9n%C3%A9rale/Texte_entier).
He argued that a linguistic sign acquires its *value* through its relationships
and differences from other signs. He distinguished two important kinds of
relationship:

- **Syntagmatic relations:** which elements occur together in a sequence.
- **Associative or paradigmatic relations:** which elements can occupy similar
  positions or enter related mental series.

This is a conceptual ancestor of embedding spaces. Saussure was describing the
relational structure of a linguistic system, however, not proposing corpus
statistics, prediction objectives, or numerical vectors.

### J. R. Firth: Context and Collocation Before the Slogan

Firth's canonical sentence appeared in 1957:

> “You shall know a word by the company it keeps.”

But he had already developed his contextual theory of meaning in
[*The Technique of Semantics*](https://onlinelibrary.wiley.com/doi/10.1111/j.1467-968X.1935.tb01254.x)
in 1935. His account treated meaning as a complex of relationships between an
expression and its linguistic, practical, and social contexts.

The date of the slogan should therefore not be mistaken for the beginning of
Firth's theory.

### Zellig Harris: The Distributional Hypothesis

Harris provided the clearest immediate formulation of the approach inherited
by modern computational linguistics in his 1954 paper
[*Distributional Structure*](https://www.its.caltech.edu/~matilde/ZelligHarrisDistributionalStructure1954.pdf).

His central methodological idea was to characterize linguistic elements by the
environments in which they occur. Differences in meaning tend to correlate
with differences in linguistic distribution.

Harris did not claim that linguistic distribution contains the whole structure
of experience. He explicitly distinguished the structure of language from both
objective reality and the subjective world of meanings. A person may have an
idea or feeling that available language does not readily express.

## Relationship to Chomsky

Distributional linguistics and Chomsky's generative grammar ask different
questions:

| Distributional approach | Chomskyan generative approach |
| --- | --- |
| What company does an expression keep? | What structural rules generate a valid expression? |
| Begins with observed language use | Begins with an internal generative system |
| Characterizes expressions by their contexts | Characterizes sentences by hierarchical structure |
| Naturally produces similarity and probability | Naturally explains productivity and recursion |
| Primarily extensional: what patterns occurred? | Primarily intensional: what finite system licenses indefinitely many expressions? |

Chomsky did not simply define language as “a recursive function.” His early
work modeled a language as an unbounded set of structured expressions produced
by a **finite generative grammar**. Some grammatical operations can apply
recursively, allowing a structure to contain another structure of the same
kind:

```text
the dog
the dog that chased the cat
the dog that chased the cat that caught the mouse
...
```

A finite collection of elements and rules can therefore produce an
indefinitely large collection of sentences—Wilhelm von Humboldt's “infinite
use of finite means.”

In
[*Three Models for the Description of Language*](https://doi.org/10.1109/TIT.1956.1056813),
Chomsky argued that finite-state Markov processes and increasingly long
statistical approximations do not provide an adequate grammar of English. A
grammar must account for structural relationships and for the ability to
produce and understand expressions that have never previously occurred.

His famous example illustrates the distinction:

> “Colorless green ideas sleep furiously.”

The sentence combines words that keep improbable company, but it remains
recognizably grammatical. Conversely, a statistically familiar sequence can
still be structurally malformed. Chomsky used this distinction to argue that
grammatical structure cannot be reduced to frequency or immediate
co-occurrence.

This criticism targeted finite-state and surface statistical accounts
available at the time. It does not automatically settle what later neural
systems can learn from distributions when they have internal states,
attention, nonlinear transformations, and large-scale training.

## How the Traditions Fit Together

The two approaches are better treated as complementary:

```text
Generative structure determines possible relationships.
Distributional experience estimates which relationships are likely and
significant in use.
```

Syntax creates positions and hierarchical relationships. Distribution
provides evidence about what normally occupies those positions and how an
expression functions in practice.

For example:

```text
The chef sliced the bread.
The knife sliced the bread.
```

Distributional knowledge suggests that `chef` is usually an agent and `knife`
an instrument. Hierarchical syntax identifies both as the grammatical subject.
Understanding the difference requires combining structural relationships with
learned patterns of use.

The relationship can also be expressed schematically:

```text
Distributional account:
    approximate an expression by the distribution of contexts in which it occurs

Generative account:
    define a finite grammar G whose operations generate a language L(G)

Combined account:
    structure constrains the relevant contexts;
    experience supplies probabilities and usage-sensitive distinctions
```

## Relationship to Modern LLMs

Modern LLMs attempt to combine aspects of both traditions without being given
an explicit Chomskyan grammar:

- They learn from **distributional evidence** through next-token prediction.
- Token embeddings and hidden states encode recurring lexical, semantic, and
  structural relationships.
- Attention allows information to interact across a sequence, including across
  nested and long-distance structures.
- Training rewards models for generalizing to combinations that were not
  memorized verbatim.

An autoregressive model factorizes the probability of a token sequence as:

```text
P(t₁, …, tₙ) = ∏ᵢ P(tᵢ | t₁, …, tᵢ₋₁)
```

This objective is distributional: the system learns which continuations are
probable given prior company. But succeeding at the objective can pressure the
model to construct internal representations of syntax and hierarchy, because
those structures help predict language.

An LLM is nevertheless not literally an unbounded recursive grammar. It has:

- a finite number of layers and parameters;
- finite numerical precision;
- a finite context window; and
- training data containing only finite examples of recursive depth.

It can learn to approximate recursive and hierarchical patterns at observed or
nearby depths without possessing a symbolic rule that guarantees correct
generalization to arbitrary depth.

## Meaning and Subjectivity Boundary

These theories also leave an important distinction intact:

- Distribution can reveal how linguistic expressions are used and related.
- Generative grammar can describe how expressions are structurally formed.
- Neither result by itself establishes reference, phenomenal experience,
  normative value, or subjective awareness.

An LLM may learn the distribution of language about `pain`, and it may place
that language into novel grammatical structures. Those achievements establish
substantial linguistic competence. They do not by themselves establish that
the system feels pain or originates the human stakes attached to it.

## Sources

- Ferdinand de Saussure,
  [*Course in General Linguistics*](https://fr.wikisource.org/wiki/Cours_de_linguistique_g%C3%A9n%C3%A9rale/Texte_entier),
  lectures delivered 1906–1911 and published in 1916.
- J. R. Firth,
  [*The Technique of Semantics*](https://onlinelibrary.wiley.com/doi/10.1111/j.1467-968X.1935.tb01254.x),
  1935.
- J. R. Firth,
  [*A Synopsis of Linguistic Theory, 1930–1955*](https://www.ling.upenn.edu/courses/ling5900/Firth1957.pdf),
  1957.
- Zellig S. Harris,
  [*Distributional Structure*](https://www.its.caltech.edu/~matilde/ZelligHarrisDistributionalStructure1954.pdf),
  1954.
- Noam Chomsky,
  [*Three Models for the Description of Language*](https://doi.org/10.1109/TIT.1956.1056813),
  1956.
