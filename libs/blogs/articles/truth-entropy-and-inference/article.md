---
title: Truth, Entropy & Inference
description: Why some language reliably predicts useful answers — and some only predicts what a useful answer sounds like.
publishedAt: 2026-08-22
updatedAt: 2026-08-26
tags: [Artificial Intelligence, Language Models, Information Theory, Software Systems]
---
# Truth, Entropy & Inference

## Overview

Consider two prompts that ask for the same outcome:

> Implement hash-based sorting for this array.

> Efficiently organize these numbers.

Both ask for an efficient ordering. Only the first identifies a known problem
space. Used correctly, that identification carries a higher and more useful
information density: it activates shared assumptions, methods, and tradeoffs,
sharply narrowing what a competent response should contain. The terminology is
not a guarantee; its assumptions still have to fit the problem.

> **Core thesis — Fluency follows constraint.**
> Language records what a domain rewards and rejects. Models learn those
> patterns. Strong feedback makes fluent output informative; weak feedback
> makes it merely plausible.

The question driving this essay is: **how do communities compress tested
distinctions into language, and how do models use that language to narrow
plausible continuations?** The answer connects forms of truth to embeddings,
entropy, and prompting.

Building on [Goals, Solutions & Value](/writing/goals-solutions-and-value), this
essay leads into [The Understanding
Bottleneck](/writing/understanding-is-the-bottleneck) and [The Knowledge
Factory](/writing/the-knowledge-factory). Together, the sequence moves from
human stakes to evaluated, reusable knowledge.

## 1. Truth and Propositional Formulations

Seven overlapping truth practices shape the language around us. Treat them as an
editorial framework, not a universal philosophical taxonomy: the same claim can
participate in several practices at once.

Begin with four practices most visibly entangled with subjective experience,
belief, and personal or communal value: relational acquaintance, sincerity,
trustworthiness, and teleology. They ask whether an account remains faithful to
lived experience, whether expression aligns with inward state, whether reliance
is warranted, and whether something fulfills a purpose worth recognizing. This
is the territory of [Goals, Solutions &
Value](/writing/goals-solutions-and-value): what matters, what ought to be
trusted, and whose purposes count cannot be supplied by formalism alone. These
practices are situated and value-laden, but that does not make them arbitrary.

### Experience, belief, and value

| Practice | Validity | Language favors | Feedback that constrains it |
| --- | --- | --- | --- |
| **Relational / acquaintance** | situated significance known through direct familiarity with experiences, people, places, purposes, and relationships | perspective, motive, consequence, interpretation, demonstration, metaphor, phenomenological description | people with direct familiarity test whether a claim remains faithful to experience and its consequences |
| **Sincerity / truthfulness** | non-deceptive fit between an expression and the speaker's subjective state | first-person avowal, disclosure, qualification, acknowledged uncertainty | mismatches among avowal, conduct, and context expose deception or self-deception |
| **Trustworthiness Theory** | `X` is true if and only if `X` is trustworthy; `X` is false if and only if `X` is untrustworthy | warranted reliance, reliability, evidence, risk, dependence, justified trust | failures of warranted reliance expose what ought not be trusted, including failures without deception |
| **Teleological Theory** | `X` is true if and only if `X` is an ideal instance of its kind; `X` is false if and only if `X` is a defective instance | kind, purpose, function, ideal, defect, success conditions, governing norms | failures to fulfill a kind's governing purpose expose defective instances and unsuccessful acts |

Two theological parallels help situate the non-propositional rows without
claiming that the traditions are equivalent to this essay's taxonomy. In
classical Confucian thought, [chéng (誠,
sincerity)](https://www.chinesethought.cn/EN/shuyu_show.aspx?shuyu_id=2126)
joins freedom from deceit to integrity between inward disposition and outward
conduct; the *Doctrine of the Mean* calls sincerity the Way of Heaven and
becoming sincere the human way. In biblical Hebrew, [ʾemet
(אֱמֶת)](https://www.thetorah.com/article/torat-emet-truth-spoken-through-the-humble-human-experience)
spans truth, faithfulness, firmness, and reliability. A person, word, promise,
or God can be “true” in the sense of being dependable enough to warrant trust.

Their feedback remains substantive: people with direct acquaintance can
challenge an account; conduct can contradict an avowal; reliance can fail; and
an instance can betray the purpose or norm of its kind. The stage-door example
in Kane Baker's
[“Nonpropositional Truth”](https://www.youtube.com/watch?v=c9BFn4Kqj0E&t=1954s)
makes the distinction concrete: a door that ought not be trusted by either
Sienna or Pearl counts as false in this normative sense regardless of anyone's
intent to deceive. The
[teleological account](https://www.youtube.com/watch?v=c9BFn4Kqj0E&t=2200s)
changes the relevant kind: the same door can be a true prop door when it ideally
serves its intended theatrical purpose, even if it is untrustworthy as an
ordinary door. A true heart likewise fulfills its function by efficiently
pumping blood. The language of a domain records which of these checks have been
running — and how hard they bite.

### Coherence, correspondence, and consequence

Three other practices become the recurring thread of this article: formal truth
as coherence, empirical truth as correspondence, and operational truth as
consequence. Their memorable questions — does it fit, does it match, and does it
work? — separate internal validity, contact with the world, and successful
action.

| Practice | Memorable lens | Validity | Language favors | Feedback that constrains it |
| --- | --- | --- | --- | --- |
| **Formal** | **Coherence — Does it fit?** | validity relative to definitions, axioms, and inference rules | explicit premises, symbolic relationships, proof obligations | counterexamples and proof assistants reject invalid derivations |
| **Empirical** | **Correspondence — Does it match?** | agreement with an observable state of affairs—the events, objects, properties, or relations the claim describes | measurement, method, uncertainty, replication, counterevidence | failed predictions and unreplicated results erode the claim |
| **Operational** | **Consequence — Does it work?** | reliable consequences under stated conditions—the procedure repeatedly produces its intended result within defined tolerances | procedures, preconditions, failure modes, tolerances, observed outcomes | systems that crash, stall, or cost too much are corrected or retired |

Together, the three can compose into patterned formulations. Correspondence
gives stable labels to recurring observable features; consequence preserves
procedures that repeatedly produce useful outputs; coherence abstracts those
labels and operations into definitions, algorithms, and proofs. A community
can therefore build a reusable problem-solving pattern before the next concrete
problem instance is known. When a new situation is recognized as an instance
of that pattern, its terminology retrieves candidate operations and exposes
assumptions for testing. The pattern does not solve an unknown problem by
magic; it gives future problems a tested structure into which they may fit.

## 2. From Context to Coordinates to Probabilities

J. R. Firth's maxim, “You shall know a word by the company it keeps,” captured
the distributional premise later formalized by Zellig Harris's
[*Distributional Structure*](https://www.its.caltech.edu/~matilde/ZelligHarrisDistributionalStructure1954.pdf).
Modern embeddings operationalize a limited version of that idea: repeated
context becomes geometry, not a complete theory of meaning. In Word2Vec's
skip-gram objective, target and context tables `Wᵢₙ` and `Wₒᵤₜ` are scored by a
dot product. Training raises scores for observed pairs and lowers them for
sampled non-neighbors; rows of `Wᵢₙ` become the embeddings described in the
[2013 Word2Vec paper](https://research.google/pubs/efficient-estimation-of-word-representations-in-vector-space/).
Firth's original formulation appears in
[*A Synopsis of Linguistic Theory, 1930–1955*](https://languagelog.ldc.upenn.edu/myl/Firth1957.pdf).

The interactive semantic-composition explorer follows here, pairing its
three-dimensional word map with the live vector calculation from selected
inputs to a result location.

A tokenizer assigns each token an integer ID. For vocabulary `V` and width
`d`, the learned table `E ∈ ℝ^{|V|×d}` maps token `xᵢ` to
`eᵢ = E[xᵢ] ∈ ℝᵈ`. A phrase may span several tokens and therefore enters as
several vectors. The rows begin as arbitrary values and acquire predictive
structure during training; a decoder transformer learns them inside its
next-token objective rather than in a separate Word2Vec task.

Cosine similarity and distance make neighborhoods visible: nearby points are
close under learned usage, not necessarily true in the world. Recurring offsets
can also suggest directions such as `man + royal ≈ king`. The published explorer
compresses a much larger space into three hand-authored dimensions. Its
equations are geometric intuition, not measured Word2Vec identities or
guaranteed semantic arithmetic.

An input embedding is only the starting state. Position, attention, and
feed-forward layers transform it into a **contextual hidden state** that changes
with context. *Stable* therefore produces different states in *stable counting
sort* and *stable employment*.

<details>
<summary><strong>Engram metaphor</strong></summary>

> **A helpful engram — Three kinds of memory; keep them distinct.**
>
> Use this as a small *engram about engrams*: a compact cue for recalling three
> mechanisms often gathered under the metaphor of memory.
>
> - **Biological engram — trace.** A physical change in living neural tissue
>   associated with storing and later reactivating an experience. See the
>   [review of engram research](https://www.nature.com/articles/nrn4000).
> - **Token embedding — parameter.** A learned row in a model's embedding
>   table. Training makes it predictively useful, but it is neither an episodic
>   memory nor a stored source record.
> - **Vector-indexed record — record and address.** Durable application content
>   stored beside an embedding; similarity search uses the vector as an address
>   for retrieving the record.
>
> The useful metaphor is that past structure can guide later activation. The
> mechanisms remain different. Remember: **trace · parameter · record**.

</details>

`Token ID → input embedding → contextual hidden state → output logits →
next-token probabilities.`

At the final prompt position, an output projection produces one **logit**, or
unnormalized score, per vocabulary token. **Softmax** turns those scores into
`P(next token | prompt)`. A decoder chooses or samples a token, appends it, and
repeats.

> **Important boundary — Embedding geometry is not output probability.**
> Similar input embeddings can reveal learned relationships, but they do not
> determine the next token. The full prompt, transformer layers, and output
> projection intervene before softmax produces a distribution.

A valid term of art steers a response by shifting contextual states toward
learned technical patterns; the prompt must still supply the assumptions that
make those patterns applicable. The next section examines how that shift
narrows uncertainty. For the cross-entropy and backpropagation that shaped these
weights, see the [training walkthrough in *Goals, Solutions &
Value*](/writing/goals-solutions-and-value).

## 3. Entropy, Surprise, and Conditional Prediction

Information theory gives us a precise way to talk about the uncertainty a
request leaves behind. A **probability distribution** represents uncertainty
among possible messages or symbols. A less probable observation carries more
**surprise** under that distribution. **Entropy** is the expected surprise — a
summary of how much the system still has to learn before it can pick an outcome
confidently. **Conditional prediction** asks how that distribution changes when
prior context is known.

Modern language modeling operationalizes these ideas directly. A next-token
model estimates a distribution over possible continuations given the preceding
context. Training penalizes probability assigned away from observed
continuations, commonly through a **cross-entropy** objective. The result is
not a database of sentences; it is a learned structure of conditional
regularities.

The lineage here matters. Claude Shannon did not invent language models, and
next-token prediction does not follow automatically from his work. In
[“A Mathematical Theory of Communication”](https://doi.org/10.1002/j.1538-7305.1948.tb01338.x),
Shannon defined entropy as uncertainty in a probability distribution; in
[“Prediction and Entropy of Printed English”](https://doi.org/10.1002/j.1538-7305.1951.tb01366.x),
he had human subjects repeatedly guess the next letter of unfamiliar passages
and used their prediction performance to estimate the redundancy of English.
That is a genuine intellectual ancestor of statistical language modeling — and
it is historical intuition, not proof that human language or thought is only
next-token prediction.

**Prediction under constraint** — an ambiguous request leaves a broad
distribution (high entropy, many plausible continuations); a fitting term of art
selects a response family, and valid assumptions narrow it into a handful of
testable continuations. On the published page, an interactive figure keeps those
roles distinct: the scenario sets context, the chosen phrase directs the
response, and a small ambiguity meter shows the remaining uncertainty. Choosing
the term of art automatically reveals a compact summary of the assumptions that
make it applicable. Its number is an illustrative proxy, not a measured model
probability.

The model did not become smarter between the two prompts; the second prompt
simply selected more of the structure the model had learned.

Compression also runs in the other direction. The four words `hash sort in
TypeScript` do not contain an implementation verbatim; they address a learned
network of algorithmic and language conventions. On the published page, a
second figure expands that compact direction through explicit defaults — a
map-based frequency table, numeric ordering, duplicate preservation, immutable
input, and safe-integer validation — into an inspectable TypeScript
implementation. The response is much denser than the request, but it is
generative reconstruction rather than lossless decoding of information
literally stored in four words.

## 4. Language Patterns Carry the History of Constraint

Patterns become meaningful when practices repeatedly reward some distinctions
and reject others. Technical terms survive because they compress a history of
use:

- a term names a distinction practitioners repeatedly needed;
- surrounding syntax records typical relationships;
- examples teach ordinary cases;
- failures and counterexamples define boundaries; and
- institutions, tools, and consequences reinforce the usage.

This is why language can contain more knowledge than a glossary reveals. A term
of art can point into a network of assumptions and operations — a **bounded
context** that a dictionary entry cannot enumerate. But it also explains stale
or harmful fluency: language faithfully records fashionable habits,
institutional blind spots, and repeated mistakes too.

The figure on the published page states a working hypothesis, not a settled law
of language: domains subjected to repeated correspondence and consequence
checks tend to preserve the distinctions that make those checks efficient.
Their terms of art become compact addresses into a much larger body of inputs,
operations, boundaries, and known failures.

The hypothesis has three truth-linked stages followed by a computational
result:

1. **Labeling — correspondence: Does it match?** Observation, measurement, and
   counterexamples correct names that fail to track events, objects,
   properties, or relations.
2. **Operationalization — consequence: Does it work?** Repeated practice
   compresses successful inputs, operations, boundaries, and failure modes into
   efficient terms of art that guide action. Here *compression* is a semantic
   metaphor, not a measured number of bits.
3. **Formalization — coherence: Does it fit?** Mathematics, logic, type systems,
   and programming languages make relationships explicit enough to compose and
   calculate.

The resulting capability is **computation**, not a fourth theory of truth.
Formal structure enables synthetic data, type checking, theorem proving,
simulation, and executable tests.

Automation does not close the epistemic loop by itself. A proof establishes
derivability from stated premises; a program may compile and pass its tests.
Neither result alone shows that the premises model the world, the synthetic
data are representative, or the outcome is worth pursuing. Automated results
can provide evidence of coherence and sometimes operational success;
correspondence still requires renewed observation, measurement, and
consequence.

This computational ladder does not absorb the other truth practices introduced
earlier. Relational and acquaintance-based truth remains anchored in
first-person experience, as does sincerity; trustworthiness and teleological
truth depend on judgments about warranted reliance, governing purposes, and
what ought to count as a good instance. Religious and theological traditions
have often supplied languages and communities for making those judgments, but
the practices are neither exclusively theological nor merely private. Personal
values are tested and negotiated through relationships, shared norms,
testimony, and consequences. Their constraints can be rigorous without
becoming fully reducible to formal proof.

## 5. Why Code Is So Pattern-Dense

The practical constraints that enforce programming-language patterns form a
stack. Each layer rejects invalid expressions before the next one ever sees
them:

| Layer | What it rejects |
| --- | --- |
| **Corpus** | contains the patterns practitioners wrote under real conditions |
| **Syntax** | invalid token sequences before anything else runs |
| **Types** | invalid relationships between values and operations |
| **Tests** | specified behavioral failures |
| **Runtime** | crashes, latency, and resource misuse |
| **Users** | behavior that fails in the world — physical, economic, human |

These filters produce large corpora in which many patterns map to executable
behavior. That makes code unusually compatible with predictive generation. It
does not guarantee that the requested behavior was the right behavior — and it
does not make code fully objective. Requirements, architecture, naming, product
behavior, and acceptable tradeoffs remain human judgments.

Formal mathematics intensifies the same pattern density. Definitions restrict
meaning, proof rules constrain inference, counterexamples eliminate false
generalizations, and proof assistants such as [Lean](https://lean-lang.org/) can
mechanically reject invalid derivations. Models can therefore search a dense
field of candidate steps and receive sharper feedback than most
natural-language domains provide. Even so, a verified derivation does not
decide whether the formal statement captures the intended problem, or whether
the result matters. That consequence becomes a case study in The Understanding
Bottleneck.

The deeper contrast is **evaluative closure**: whether a task supplies enough
evidence, constraints, feedback, and authority to determine whether a change is
better. A coding task often gives the system enough of all four — the tests and
benchmarks value the result on the system’s behalf. A strategy task often asks
the system to define “better” while simultaneously guessing the world, the
values, and the acceptable tradeoffs. The repository contains much of the
relevant state for one; the decisive facts for the other may be tacit, private,
or still being discovered.

## 6. A Map of Domain Fluency

When you need to know whether a model can be trusted in a domain, look for
evidence that the domain’s language is well grounded:

- stable vocabulary inside a bounded context;
- repeated relationships among named concepts;
- examples and counterexamples;
- external checks or observable consequences;
- explicit uncertainty and disagreement;
- maintained standards, tests, or professional practices; and
- enough representative source material to expose variation.

The warning signs are the mirror image: overloaded terms, fashionable but
untested narratives, hidden value conflicts, sparse evidence, no corrective
feedback, and evaluation that depends entirely on whether an answer sounds
right. Fluency is domain- and task-specific, not one global measure of
intelligence — the same model can be sharp in a strongly constrained domain and
glib in a weakly constrained one.

## 7. Prompting as Constraint Selection

While vibe designing a web logo, I realized I needed to eat my own dog food. My
early prompts described the result I wanted in broad visual language, but they
left too many consequential choices ambiguous. The model could produce plausible
variations without reliably producing the typography I had in mind.

I then pulled in visual references, established guidelines, and principles of
typography. I also began prompting with the specific language used in bona fide
typography work. The model performed much more accurately — not because the
terminology was a magic incantation, but because the prompt now selected a more
structured domain and supplied distinctions against which the result could be
judged. The original failure was not a lack of prompt cleverness; I had supplied
an underspecified problem. References narrowed the visual possibility space,
typography principles supplied constraints, and professional vocabulary
activated patterns connected to established relationships and practices. The
model still required human evaluation, but it no longer had to guess what kind
of work I meant.

A practical sequence falls out of that experience:

1. Name the domain and bounded context.
2. Use established terms of art only when their assumptions apply.
3. State invariants, inputs, outputs, and unacceptable failure modes.
4. Provide representative examples and counterexamples.
5. Define what evidence or test would count as success.
6. Ask the model to identify missing distinctions before generating the answer.
7. Route the result to an evaluator capable of checking the relevant truth
   practice.

Prompt quality is not ornamental phrasing. It is the selection and compression
of the context that should govern inference. The same move that makes prompts
work also explains the article’s asymmetry: the cross-entropy objective rewards
the model for predicting what the training text actually contains, and training
text from strongly constrained domains contains fewer plausible continuations
to choose between.

## 8. From Abstract to Actual

Close by running the three truth practices in reverse — from abstract structure
back to actual conditions and effects:

| Truth lens | Question | What the evidence establishes |
| --- | --- | --- |
| **Coherence** | Is it correct within its semantic logic? | The result follows from the system's definitions, premises, syntax, and inference rules. |
| **Consequence** | Does it produce the intended outputs and survive the domain's tests? | Execution and evaluation show that it works under the stated conditions. |
| **Correspondence** | Does it map back to an identifiable problem and its claimed real-world impact? | Observation, measurement, and affected people show whether the model and result track reality. |

AI can help at all three, but success at an earlier stage can simulate success
at the next. A result can be coherent within a semantic system yet fail to
produce the intended outputs. It can pass domain tests yet optimize a proxy
that does not correspond to the actual problem or impact. The loop closes only
when formal claims and operational results are regrounded in observable
conditions and consequences for the people affected. Work backward from
abstraction: does it fit, does it work, and does it match?

> A model is fluent where language has learned to carry the constraints. Our
> work is to follow that fluency back through consequence to correspondence:
> does it fit, does it work, and does it match the world we mean to change?

## Sources

- Claude E. Shannon, [“A Mathematical Theory of Communication”](https://doi.org/10.1002/j.1538-7305.1948.tb01338.x) (1948). Defines information entropy and conditional uncertainty.
- Claude E. Shannon, [“Prediction and Entropy of Printed English”](https://doi.org/10.1002/j.1538-7305.1951.tb01366.x) (1951). Uses next-character prediction to estimate the redundancy of English.
- Yoshua Bengio, Réjean Ducharme, Pascal Vincent, and Christian Jauvin, [“A Neural Probabilistic Language Model”](https://www.jmlr.org/papers/v3/bengio03a.html) (2003). Connects conditional word-sequence probabilities with learned distributed representations.
- Tomas Mikolov, Kai Chen, Greg Corrado, and Jeffrey Dean, [“Efficient Estimation of Word Representations in Vector Space”](https://research.google/pubs/efficient-estimation-of-word-representations-in-vector-space/) (2013). Introduces efficient continuous bag-of-words and skip-gram architectures for learning word vectors at scale.
- Ashish Vaswani et al., [“Attention Is All You Need”](https://arxiv.org/abs/1706.03762) (2017). Describes learned token embeddings, contextual transformation through attention, and projection plus softmax into output-token probabilities.
- Eric Evans, [*Domain-Driven Design Reference*](https://www.domainlanguage.com/ddd/reference/). Defines bounded contexts and model-aligned domain language.
- Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein, [*Introduction to Algorithms*](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/). Provides the sorting and algorithmic assumptions referenced in the essay.
- Jeremy Avigad, Leonardo de Moura, Soonho Kong, and Sebastian Ullrich, [*Theorem Proving in Lean 4*](https://docs.lean-lang.org/theorem_proving_in_lean4/). Documents mechanically checked propositions and proof objects.
- Microsoft, [*The TypeScript Handbook*](https://www.typescriptlang.org/docs/handbook/). Provides an official example of a type checker rejecting invalid program relationships.
- Stanford Encyclopedia of Philosophy, [“The Correspondence Theory of Truth”](https://plato.stanford.edu/entries/truth-correspondence/). Surveys facts, states of affairs, events, objects, and properties as possible correspondence relata.
- Stanford Encyclopedia of Philosophy, [“The Pragmatic Theory of Truth”](https://plato.stanford.edu/entries/truth-pragmatic/). Surveys accounts that test truth through practical consequences and the outcomes of inquiry.
- Stanford Encyclopedia of Philosophy, [“Jürgen Habermas”](https://plato.stanford.edu/entries/habermas/). Distinguishes sincerity or truthfulness from propositional truth and normative rightness as a validity claim of speech.
- Stanford Encyclopedia of Philosophy, [“Knowledge by Acquaintance vs. Description”](https://plato.stanford.edu/entries/knowledge-acquaindescrip/). Surveys direct, non-propositional acquaintance and its distinction from descriptive knowledge.
- Key Concepts in Chinese Thought and Culture, [“Chéng (誠): Sincerity”](https://www.chinesethought.cn/EN/shuyu_show.aspx?shuyu_id=2126). Relates freedom from deceit and consistency of conduct to the Way of Heaven and human moral cultivation.
- TheTorah.com, [“Torat Emet: Truth Spoken through the Humble Human Experience”](https://www.thetorah.com/article/torat-emet-truth-spoken-through-the-humble-human-experience). Explains the biblical Hebrew sense of *ʾemet* as truth and trustworthiness.
- Kane Baker, [“Nonpropositional Truth” — Trustworthiness Theory](https://www.youtube.com/watch?v=c9BFn4Kqj0E&t=1954s) and [Teleological Theory](https://www.youtube.com/watch?v=c9BFn4Kqj0E&t=2200s). Presents trustworthiness as warranted reliance and teleological truth as fulfillment of the governing ideal or purpose of a kind.
