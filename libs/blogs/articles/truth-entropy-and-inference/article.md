---
title: Truth, Entropy & Inference
description: Why some language reliably predicts useful answers — and some only predicts what a useful answer sounds like.
publishedAt: 2026-08-22
updatedAt: 2026-08-26
tags: [Artificial Intelligence, Language Models, Information Theory, Software Systems]
---
# Truth, Entropy & Inference

## Overview

Language models generate coherent continuations by learning patterns in
language. Those patterns are not arbitrary. Different truth-seeking practices
produce different forms of discourse: a proof, an experimental report, a
program, a legal argument, and a product narrative each carry different
constraints, conventions, and signals of validity.

This article connects three ideas. First, communities encode meaningful
distinctions into recurring language. Second, information theory gives us a
way to reason about uncertainty, surprise, and prediction — which
machine-learning systems later operationalize through conditional token
prediction. Third, some domains, especially code, produce unusually dense and
reliable patterns because syntax, compilers, types, tests, runtimes, and
physical consequences continually reject invalid expressions.

The practical destination is an intuition for working with AI: recognize when
a domain has enough linguistic and operational structure for a model to be
fluent, choose language that activates the relevant structure, and distinguish
a coherent continuation from a correct or meaningful answer.

> **Core thesis — Fluency follows structure, not the other way around.**
> Language becomes predictively useful when a domain repeatedly encodes stable
> distinctions, constraints, relationships, and consequences into its patterns
> of expression. A language model can learn those patterns and infer plausible
> continuations, but the reliability of that inference depends on the structure
> that produced the language. Code is a strong case because incorrect
> expressions encounter layers of mechanical rejection; loosely specified
> strategy, taste, or human meaning often lacks comparable enforcement. The
> difference is not that one domain contains truth and the other does not — it
> is that their language has been shaped by different feedback systems.

This is the second essay in a coordinated sequence:
[Goals, Solutions & Value](/writing/goals-solutions-and-value) establishes
that valuable opportunities are grounded in human stakes; this essay explains
why learned language patterns are powerful, when they carry constraints, and
where fluency breaks;
[The Understanding Bottleneck](/writing/understanding-is-the-bottleneck) asks
how teams turn abundant output into better problem solving; and
[The Knowledge Factory](/writing/the-knowledge-factory) introduces the
organizational system that makes that understanding reusable.

## 1. The Mystery of the Plausible Continuation

Consider two prompts that are grammatically similar but structurally very
different:

> Implement hash-based sorting for these bounded integer keys.

> Can you put these numbers in order? Be efficient.

Both ask for an efficient ordering. The first activates a technical region of
language containing named assumptions, known implementation patterns, and
recognizable tradeoffs. The second communicates the visible goal but leaves the
ordering direction, integer representation, input size, duplicate handling,
stability, memory budget, and meaning of “efficient” unspecified. A model can answer
both fluently; only one prompt gives it much of a correctness surface.

The governing question is: **what happened in the world that made one pattern
of language more informative than the other?** It was not that one sentence was
longer or cleverer. The informativity came from outside the sentence — from a
community of practice that had spent decades encoding its distinctions into
words, syntax, and standards.

## 2. Forms of Truth and Propositional Formulations

Six overlapping truth practices shape the language around us. Treat them as an
editorial framework, not a universal philosophical taxonomy: the same claim can
participate in several practices at once. The cards below distinguish the
practices, the language each favors, and the feedback that constrains it.

A temperature reading can be empirically calibrated and operationally relevant
to a machine; someone can sincerely report that the same room feels oppressive
while knowing its heat by acquaintance before converting that experience into a
claim. The categories describe different constraint and meaning systems, not
sealed kinds of sentence.

**Truth practices and their feedback** — each form of truth produces a language,
and an institution or consequence that rejects what does not survive it:

| Practice | Validity | Language favors | Feedback that constrains it |
| --- | --- | --- | --- |
| **Formal** | validity relative to definitions, axioms, and inference rules | explicit premises, symbolic relationships, proof obligations | counterexamples and proof assistants reject invalid derivations |
| **Empirical** | correspondence with observations | measurement, method, uncertainty, replication, counterevidence | failed predictions and unreplicated results erode the claim |
| **Operational** | reliability in action | procedures, preconditions, failure modes, tolerances, observed outcomes | systems that crash, stall, or cost too much are corrected or retired |
| **Relational** | significance within human purposes and relationships | perspective, motive, consequence, interpretation, accountability | people who bear the consequences accept, resist, or repair the claim |
| **Sincerity / truthfulness** | non-deceptive fit between an expression and the speaker's subjective state | first-person avowal, disclosure, qualification, acknowledged uncertainty | mismatches among avowal, conduct, and context expose deception or self-deception |
| **Knowledge by acquaintance** | direct familiarity with an experience, person, place, or quality | demonstration, metaphor, example, gesture, phenomenological description | repeated experience and situated witnesses expose descriptions that flatten or distort what is encountered |

Each practice is also a feedback system. Formal work is checked by
counterexamples and proof obligations; empirical work by failed predictions and
unreplicated results; operational work by systems that crash, stall, or cost
too much; relational work by the people who accept, resist, or repair a claim
because they bear its consequences; sincerity by whether avowal, conduct, and
context remain in good-faith alignment; knowledge by acquaintance by whether a
description or demonstration remains faithful to experience. The language of a
domain records which of these checks have been running — and how hard they bite.

## 3. From Tokens to Embeddings to Probabilities

A tokenizer does not hand the model words or definitions. It hands the model
token IDs. For a vocabulary `V` and embedding width `d`, a learned table
`E ∈ ℝ|V|×d` stores one input vector for each token ID. Looking up token `xᵢ`
selects the row `E[xᵢ]`. A phrase such as *stable
counting sort* may occupy several tokens, so it begins as a sequence of vectors
rather than one indivisible concept.

Distributed representations can also encode useful directions. The familiar
shorthand `man + royal ≈ king` is best read as a geometric intuition: adding a
learned feature can move a vector toward a neighborhood of related roles. It is
not symbolic arithmetic, and no equation is guaranteed across models. On the
published page, a compact interactive teaching space lets readers combine terms
such as `man + royal = king`, `king + young = prince`, and
`man + royal + young + feminine = princess`. Its default x-y projection shows
status and age, deliberately collapsing masculine- and feminine-coded role
pairs onto the same points. A lazy-loaded semantic network reveals that third
coordinate and can be rotated without making WebGL part of the article's
initial load. It keeps the eight composable words as anchors, then adds category
terms such as *person*, *child*, *monarch*, *heir*, and *sovereign* with links
for status, age, category, and conventional counterparts. It also adds animals
and mythical creatures as a second compositional family:
`man + horse = centaur`, `woman + fish = mermaid`, and
`girl + hummingbird = pixie`. Typed blend edges connect the person, animal, and
mythical clusters without implying that every term shares the role region's
status, age, and convention axes. The coordinates and creature recipes are
hand-authored for clarity, not definitions or etymological claims; real
Word2Vec-style arithmetic operates in the model's original high-dimensional
space and returns ranked neighbors whose order depends on the model and
training corpus. This toy axis is not a claim that gender or meaning is
inherently binary.

Those lookup vectors are only the starting state. Positional information is
added, and transformer layers use attention and feed-forward transformations to
produce a **contextual hidden state** for every position. The input row for a
token is fixed during ordinary inference, but its hidden state changes with the
surrounding language. The representation of *stable* in *stable counting sort*
therefore differs from its representation in *stable employment*.

The common decoder-style path is:

```text
token IDs          x₁, x₂, …, xₙ ∈ V
embedding lookup   eᵢ = E[xᵢ] ∈ ℝᵈ
contextual states  h₁…hₙ = Transformer(e₁…eₙ)
output logits      z = Wₒhₙ + b ∈ ℝ|V|
probabilities      P(j | x≤n) = softmax(z)ⱼ
```

At the final prompt position, the output projection produces one **logit**, or
unnormalized score, per vocabulary token. **Softmax** exponentiates and
normalizes those scores into `P(next token | prompt)`. A decoding rule chooses
or samples a token, appends it to the context, and repeats the same computation.

> **Important boundary — Embedding geometry is not output probability.**
> Distance or cosine similarity between input embeddings can expose useful
> learned relationships, but it does not determine the next token by itself.
> The full prompt, every transformer layer, and the output projection intervene
> before softmax produces a distribution.

This is how a valid term of art can steer a response without acting like a
magic command or a database key. Its tokens shift the model's contextual state
toward learned patterns associated with that technical usage; the rest of the
prompt supplies the assumptions that make those patterns applicable. The next
section turns that mechanism into the prompt-and-ambiguity interaction.

The embedding table and every downstream weight acquired this predictive role
during training. For the cross-entropy, backpropagation, and optimizer loop that
updates those parameters, return to the [training walkthrough in *Goals,
Solutions & Value*](/writing/goals-solutions-and-value).

## 4. Entropy, Surprise, and Conditional Prediction

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

## 5. Language Patterns Carry the History of Constraint

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

The published page embeds a proposition graph of this argument — how a precise
prompt activates named patterns, how feedback systems shape those patterns, and
how executable checks ground coherence. It is a map of the argument, not a
claim about which sentences are true.

## 6. Why Code Is So Pattern-Dense

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

## 7. “Hash Sort” Versus “Put These Numbers in Order”

The two prompts from the opening are a lesson in semantic compression. An
algorithm name can activate expectations about input shape, complexity, memory,
stability, and implementation. But **hash sort** is not one universally standard
optimal algorithm. The article must state the intended variant and assumptions —
such as bounded integer keys and hash- or bucket-based partitioning — before
treating the name as precise. The reference family is classic material; see, for
example, Cormen, Leiserson, Rivest, and Stein,
[Introduction to Algorithms](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/),
for the conditions under which these approaches outperform comparison sorts.

“Can you put these numbers in order? Be efficient” predicts a generic response because the prompt
contains almost no domain constraints. The model must guess what organization
means and will often converge on a familiar default — likely a comparison sort
by value, whether or not that is what you wanted. The lesson is not “use
jargon.” It is: **use the most specific valid concept available, then state the
conditions that make it valid.**

## 8. A Map of Domain Fluency

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

## 9. Prompting as Constraint Selection

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

## 10. Coherence Is Evidence About a Pattern, Not the World

Close by separating three judgments that are easy to conflate:

| Judgment | Question | Can AI help? |
| --- | --- | --- |
| **Coherence** | Does the response fit the language patterns of the requested domain? | Yes — this is what predictive generation is good at. |
| **Correctness** | Does it survive that domain’s tests and evidence? | Yes, when the domain has mechanical checks and the checks are run. |
| **Meaning** | Does it solve a problem that matters to the people who bear the consequences? | Only with human judgment about stakes, values, and context. |

AI can help with all three, but success at the first can simulate success at the
other two. A response that sounds exactly like the domain — right vocabulary,
right shape, right cadence — is evidence that the model has learned the pattern.
It is not evidence that the pattern survived the domain’s tests, and it is not
evidence that the answer matters to anyone. Recognizing that gap is the
intuition this article is trying to leave you with: distinguish a coherent
continuation from a correct answer, and both from a meaningful one.

> A model is fluent where language has learned to carry the constraints. Our
> work is to know when those patterns are evidence — and when they are only the
> shape of an answer.

## Sources

- Claude E. Shannon, [“A Mathematical Theory of Communication”](https://doi.org/10.1002/j.1538-7305.1948.tb01338.x) (1948). Defines information entropy and conditional uncertainty.
- Claude E. Shannon, [“Prediction and Entropy of Printed English”](https://doi.org/10.1002/j.1538-7305.1951.tb01366.x) (1951). Uses next-character prediction to estimate the redundancy of English.
- Yoshua Bengio, Réjean Ducharme, Pascal Vincent, and Christian Jauvin, [“A Neural Probabilistic Language Model”](https://www.jmlr.org/papers/v3/bengio03a.html) (2003). Connects conditional word-sequence probabilities with learned distributed representations.
- Ashish Vaswani et al., [“Attention Is All You Need”](https://arxiv.org/abs/1706.03762) (2017). Describes learned token embeddings, contextual transformation through attention, and projection plus softmax into output-token probabilities.
- Eric Evans, [*Domain-Driven Design Reference*](https://www.domainlanguage.com/ddd/reference/). Defines bounded contexts and model-aligned domain language.
- Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein, [*Introduction to Algorithms*](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/). Provides the sorting and algorithmic assumptions referenced in the essay.
- Jeremy Avigad, Leonardo de Moura, Soonho Kong, and Sebastian Ullrich, [*Theorem Proving in Lean 4*](https://docs.lean-lang.org/theorem_proving_in_lean4/). Documents mechanically checked propositions and proof objects.
- Microsoft, [*The TypeScript Handbook*](https://www.typescriptlang.org/docs/handbook/). Provides an official example of a type checker rejecting invalid program relationships.
- Stanford Encyclopedia of Philosophy, [“Jürgen Habermas”](https://plato.stanford.edu/entries/habermas/). Distinguishes sincerity or truthfulness from propositional truth and normative rightness as a validity claim of speech.
- Stanford Encyclopedia of Philosophy, [“Knowledge by Acquaintance vs. Description”](https://plato.stanford.edu/entries/knowledge-acquaindescrip/). Surveys direct, non-propositional acquaintance and its distinction from descriptive knowledge.
