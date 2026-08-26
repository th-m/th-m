---
title: Truth, Entropy & Inference
description: Why some language reliably predicts useful answers — and some only predicts what a useful answer sounds like.
publishedAt: 2026-08-22
updatedAt: 2026-08-26
tags: [Artificial Intelligence, Language Models, Information Theory, Software Systems]
---
# Truth, Entropy & Inference

## Overview

Language models learn recurring patterns, but those patterns inherit the
discipline of the practices that produced them. Proofs, experiments, programs,
and product narratives are shaped by different checks. This essay connects
those checks to embeddings, entropy, and prompting — then asks when fluency
signals reliable structure and when it only sounds right.

> **Core thesis — Fluency follows constraint.**
> Language records what a domain rewards and rejects. Models learn those
> patterns. Strong feedback makes fluent output informative; weak feedback
> makes it merely plausible.

Building on [Goals, Solutions & Value](/writing/goals-solutions-and-value), this
essay leads into [The Understanding
Bottleneck](/writing/understanding-is-the-bottleneck) and [The Knowledge
Factory](/writing/the-knowledge-factory). Together, the sequence moves from
human stakes to evaluated, reusable knowledge.

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

Seven overlapping truth practices shape the language around us. Treat them as an
editorial framework, not a universal philosophical taxonomy: the same claim can
participate in several practices at once. The cards below distinguish the
practices, the language each favors, and the feedback that constrains it.

A temperature reading can be empirically calibrated and operationally relevant
to a machine; someone can sincerely report that the same room feels oppressive,
while direct acquaintance makes its heat significant within that person's
experience and relationships. Trustworthiness adds another question: whether a
claim, representation, or object warrants reliance even when nobody intends to
deceive. Teleology asks whether something fulfills the governing purpose or
norm of its kind. The categories describe different constraint and meaning
systems, not sealed kinds of sentence.

**Truth practices and their feedback** — each form of truth produces a language,
and an institution or consequence that rejects what does not survive it:

| Practice | Memorable lens | Validity | Language favors | Feedback that constrains it |
| --- | --- | --- | --- | --- |
| **Formal** | **Coherence — Does it fit?** | validity relative to definitions, axioms, and inference rules | explicit premises, symbolic relationships, proof obligations | counterexamples and proof assistants reject invalid derivations |
| **Empirical** | **Correspondence — Does it match?** | agreement with an observable state of affairs—the events, objects, properties, or relations the claim describes | measurement, method, uncertainty, replication, counterevidence | failed predictions and unreplicated results erode the claim |
| **Operational** | **Consequence — Does it work?** | reliable consequences under stated conditions—the procedure repeatedly produces its intended result within defined tolerances | procedures, preconditions, failure modes, tolerances, observed outcomes | systems that crash, stall, or cost too much are corrected or retired |
| **Relational / acquaintance** | — | situated significance known through direct familiarity with experiences, people, places, purposes, and relationships | perspective, motive, consequence, interpretation, demonstration, metaphor, phenomenological description | people with direct familiarity test whether a claim remains faithful to experience and its consequences |
| **Sincerity / truthfulness** | — | non-deceptive fit between an expression and the speaker's subjective state | first-person avowal, disclosure, qualification, acknowledged uncertainty | mismatches among avowal, conduct, and context expose deception or self-deception |
| **Trustworthiness Theory** | — | `X` is true if and only if `X` is trustworthy; `X` is false if and only if `X` is untrustworthy | warranted reliance, reliability, evidence, risk, dependence, justified trust | failures of warranted reliance expose what ought not be trusted, including failures without deception |
| **Teleological Theory** | — | `X` is true if and only if `X` is an ideal instance of its kind; `X` is false if and only if `X` is a defective instance | kind, purpose, function, ideal, defect, success conditions, governing norms | failures to fulfill a kind's governing purpose expose defective instances and unsuccessful acts |

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

Each practice is also a feedback system. Formal work is checked by
counterexamples and proof obligations; empirical work by failed predictions and
unreplicated results; operational work by systems that crash, stall, or cost
too much; relational and acquaintance-based work by whether situated people
find a claim faithful to their experience and its consequences; sincerity by
whether avowal, conduct, and context remain in good-faith alignment; and
trustworthiness by whether relying on a claim, representation, or object is
warranted; teleology by whether an instance fulfills the purpose and norms of
its kind. The stage-door example in Kane Baker's
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

## 3. From Tokens to Embeddings to Probabilities

CJ's [from-scratch Word2Vec
demonstration](https://www.youtube.com/watch?v=YmLp8qe87A0&t=1297s) offers a
useful way into embeddings: do not ask a vector to contain a dictionary
definition. Give every word a small list of initially arbitrary numbers, then
train those numbers on context. For each target word and nearby context word, a
dot product scores how compatible their vectors are. Training raises that score
for observed pairs and lowers it for sampled non-neighbors. Across many
examples, words used in similar contexts tend to occupy nearby regions or share
useful directions. No coordinate is handed a label such as *royal*, *age*, or
*animal*; the useful structure is distributed across relationships among all
the coordinates.

Technically, CJ's skip-gram example learns two tables, `Wᵢₙ` and `Wₒᵤₜ`, each
with shape `|V| × d`. After training, the rows of `Wᵢₙ` are used as the word
embeddings. A decoder transformer is trained differently: its embedding table
is updated as part of the full next-token objective rather than by a standalone
Word2Vec task. But the entry operation is the same. A tokenizer hands the model
token IDs, and each ID is only a row address. For a vocabulary `V` and embedding
width `d`, the learned table `E ∈ ℝ^{|V|×d}` stores one input vector for each
token ID; looking up token `xᵢ` selects `E[xᵢ]`. A phrase such as *stable
counting sort* may occupy several tokens, so it begins as a sequence of vectors
rather than one indivisible concept.

Distributed representations can also encode useful directions. The familiar
shorthand `man + royal ≈ king` is best read as a geometric intuition: adding a
learned feature can move a vector toward a neighborhood of related roles. It is
not symbolic arithmetic, and no equation is guaranteed across models. On the
published page, one interactive 3D teaching space lets readers combine terms
such as `man + royal = king`, `man + royal + young = prince`, and
`man + royal + young + feminine = princess` while seeing the result in the same
navigable network. Its WebGL scene is requested only when the reader reaches
the explorer, so the article's initial load remains lightweight. The network
keeps the eight role words as geometric anchors, then adds category
terms such as *person*, *child*, *monarch*, *heir*, and *sovereign* with links
for status, age, category, and conventional counterparts. The same contextual
**Add** control groups terms into role, status, age, and creature dropdowns and
only reveals ingredients that can complete the current composition. Derived
endpoints stay out of the menus: the controls can produce `king`, `catfish`, or
`phoenix` without then offering every result as another starting branch. The
authored recipes include status shifts such as `man + noble = lord` and
`man + sovereign = emperor`, life-stage relations such as
`young + cat = kitten`, compounds such as `cat + fish = catfish`, and mythical
blends such as `bear + owl = owlbear`. Typed relation edges connect these local
families without implying that every term shares the role region's status,
age, and convention axes.

Think of an embedding space as a map whose coordinates are learned from
language use. Terms that appear in similar contexts tend to land near one
another. Repeated relationships can also form directions: moving one way may
correspond roughly to status, age, or another recurring distinction. This
picture squeezes that idea into three visible dimensions; real model embeddings
use hundreds or thousands. Its points and links are a teaching approximation,
not definitions or guaranteed equations.

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
- CJ, [“I Built an LLM From Scratch”](https://www.youtube.com/watch?v=YmLp8qe87A0&t=1297s), with the [*How LLMs Work* source](https://github.com/w3cj/how-llms-work). Demonstrates Word2Vec skip-gram training with target-context pairs, negative sampling, learned neighbors, and vector analogies.
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
