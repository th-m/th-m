# Truth and Coherence

The first article in this series asks who supplies the direction. This one asks
how we judge the information used to pursue it.

Picture a map laid over the terrain it claims to describe. Every road can join
cleanly to the next. The legend can be consistent. The route can look complete.
But if the map includes a crossing that does not exist, its internal elegance
will not carry a traveler across the river. The error becomes undeniable when
someone reaches the bank.

AI produces maps like this at extraordinary speed. It can develop a premise,
connect it to familiar patterns, and return an answer whose parts reinforce one
another. That ability is useful. It also means that a weak premise can acquire
the appearance of a finished argument before anyone checks whether it describes
the terrain.

The question driving this essay is: **How do we recognize meaningful input and
valuable output when AI can make weak premises and answers look equally
plausible?**

The answer is not to distrust fluency. It is to inspect the whole exchange.
Meaningful input makes its premises, evidence, constraints, omissions, and
uncertainty visible. Valuable output survives three different tests: it coheres
within its stated model, corresponds with what we can observe, and produces
acceptable consequences in relation to an explicit aim.

Information theory helps explain the prediction at the center of that exchange.
It can show how context makes some continuations more likely than others. It
cannot, by itself, tell us whether the context is true or the continuation is
worth acting on. Those judgments require domain checks and contact with the
results.

> **Series position — navigation, not an explanatory figure**
>
> [Vision and Values](/writing/vision-and-values) →
> **[Truth and Coherence](/writing/truth-and-inference) — YOU ARE HERE** →
> [Understanding and Bottlenecks](/writing/understanding-and-bottlenecks) →
> [The Knowledge Factory](/writing/the-knowledge-factory) →
> [Ontology Factory](/writing/the-ontology-factory) →
> [Cognitive Factory](/writing/the-cognitive-factory)

## 1. Examine Both Sides of the Exchange

Consider two requests for the same composite commercial problem. A software
company helps customers import data from spreadsheets into a known application
schema.

The first request says:

> Our customers keep choosing the wrong columns. Design an AI mapper that fixes
> their mistakes automatically and reduces support costs.

The second says:

> Customers submit files with unfamiliar headers, optional identifiers, mixed
> date formats, and fields whose meanings vary by account. We have the target
> schema, representative files, validation errors, and examples of manual
> corrections. Propose candidate mappings, expose ambiguous interpretations,
> and identify the evidence needed before any mapping is applied automatically.

The first request may turn out to be right. Customers may be selecting the wrong
columns, automation may help, and support work may fall. But the request has
already converted those possibilities into a diagnosis, a solution, and a
measure of success. A model can now produce a coherent design for the proposed
mapper without independently discovering that the premise was correct.

The second request does not merely contain more words. It changes the work. It
separates observations from interpretations, names available evidence, preserves
several possible causes, and limits the authority of the generated result. A
candidate mapping is not yet a decision. Ambiguity is part of the output rather
than something the prose must smooth away.

We usually evaluate AI from the middle of this exchange onward. We inspect the
answer for factual errors, broken logic, invented sources, or unusable code. But
the prompt is also a set of claims. It defines the problem, selects evidence,
excludes alternatives, and implies what a successful answer should optimize.
If those choices are wrong, a faithful answer can deepen the error.

Good input therefore does more than make generation easier. It gives the answer
a surface against which it can fail. What would contradict the diagnosis? Which
terms have agreed meanings? Which observations are missing? What uncertainty
should survive into the output? Who is authorized to resolve it? A request
becomes meaningful when another person can inspect why its framing deserves to
guide the model.

The output needs the same treatment. Which conclusions follow from the supplied
premises? Which depend on observations outside the prompt? Which claims can be
tested before action, and which will only become visible in use? Neither side of
the exchange should be allowed to grade itself. We need questions that do not
originate from the answer they are being used to evaluate.

## 2. Philosophy of Truth Provides a Map

Three truth practices give us a practical map: coherence, correspondence, and
consequence. They overlap, but they do not ask the same question.

**Coherence asks: Does it fit?** A claim should remain consistent with the
definitions, premises, and inference rules of the representation in which it
appears. A proposed mapping from `signup_date` to `createdAt` might fit the
declared schema, the data types, and the other mappings in the plan. That fit is
real evidence. It is not yet evidence that the source column actually means the
date the application expects.

The philosophical coherence theory of truth is more demanding and more
contested than the everyday consistency check used here. As the
[Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/entries/truth-coherence/)
notes, theories of coherence disagree about both the relation that counts as
coherence and the set of propositions against which a claim must cohere.
Consistency alone is too weak: incompatible propositions can each be consistent
with the same incomplete set. In this essay, coherence is therefore an
evaluative lens, not a claim that internal fit exhausts truth.

**Correspondence asks: Does it match?** The mapping must return to an observable
state of affairs. Documentation, representative files, customer explanations,
and actual application behavior may reveal that `signup_date` means the date a
record was exported, the date a customer account was opened, or a date typed by
an administrator. The source name is evidence, but the source name is not the
terrain.

**Consequence asks: What happens when someone relies on it?** A mapping may be
coherent and appear to match a sample while still failing in use. Perhaps it
drops timezone information, merges two customer concepts, or makes later
correction more expensive than manual entry. Pragmatic inquiry directs attention
to consequences and the outcomes of investigation. It does not make whatever
works temporarily true, nor does commercial success settle what is good. People
must still decide which effects matter, who bears them, which tradeoffs are
acceptable, and whether the result is worth repeating.

These distinctions are easiest to see on the map:

> **Figure placement — A consistent map, a missing crossing**
>
> Show a map whose roads join coherently, a terrain observation that reveals a
> missing crossing, and a traveler who reaches the river after relying on the
> route. Label the three tests: **Coherence — does the map fit itself?**
> **Correspondence — does it fit the terrain?** **Consequence — what happens
> when someone follows it?**
>
> **Caption:** Internal consistency, external observation, and reliance answer
> different questions. A claim may pass one test and fail the next.

The order of the tests is not fixed. Observation can expose an incoherent model.
A failed consequence can reveal a missing observation. A formal contradiction
can stop an action before anyone reaches the river. What matters is that success
under one lens does not silently stand in for all three.

Repeated practice can also change the language used to make claims. A community
refines an idea through definition, evidence, and correction. It gives the idea
discipline through continuity, clarification, and specification. Over time, a
diffuse expression can become a term of art: a stable label for distinctions
that practitioners repeatedly need.

Refinement and discipline do not correspond one-to-one with the three truth
tests. A correction may come from a contradiction, an observation, or a failed
result. Specification may preserve all three. The point is that a stable term
usually has a history. People have drawn its boundary, challenged its uses, and
carried enough of the successful distinctions forward for others to reuse it.

> **Shared motif placement — Variant 02:
> `refinement-and-discipline-to-term-of-art`**
>
> **REFINEMENT + DISCIPLINE — Refinement and discipline establish a term of
> art**
>
> **Idea — shared meaning** → **ESTABLISHES** → **Term of art — consistent
> within a domain**
>
> Inputs: **Discipline — continuity · clarification · specification** and
> **Refinement — definition · evidence · correction**
>
> Axis: **MEANING POTENTIAL / REFINEMENT + DISCIPLINE / STABLE TERM**
>
> **Caption:** Refinement supplies definition, evidence, and correction.
> Discipline supplies continuity, clarification, and specification. Together
> they give an idea a stable expression as a term of art. Stability inside a
> domain does not, by itself, establish correspondence or good consequences.

A term of art is therefore more than a short string and less than a guarantee.
It is a compact address into a shared body of distinctions. The next question is
what happens when that address enters a predictive model.

## 3. Information Theory Makes Prediction Concrete

> **Shared motif placement — Variant 02b:
> `understanding-in-embedding-space`**
>
> **EMBEDDING SPACE / INFERENCE VALUE — Short input, useful output—or just more
> tokens**
>
> **WITH UNDERSTANDING:** Short label — shared term of art → Embedding space —
> Understanding + Term of art + shared domain distinctions → Inference — guided
> by meaning → **YIELDS** → Useful expansion — fits the intended result — more
> text · useful tokens.
>
> **WITHOUT UNDERSTANDING:** Short label — unshared or ambiguous → Embedding
> space — No grounding + Loose meaning + context and criteria absent → Inference
> — fluent, not grounded → **YIELDS** → Excess output — does not fit the goal —
> excess tokens · no added value.
>
> Footer: **CONCEPTUAL CONTRAST · TOKEN MARKS ARE NOT COUNTS / VALUE ≠ VOLUME**
>
> **Caption:** A term of art packs shared domain distinctions into a short
> label. When those distinctions are learned or supplied in context, they can
> guide representation and inference toward useful output. The comparison is
> conceptual, not a measured gain: embeddings represent input, the model
> generates text, and value must be checked against the intended result.

The figure names an important distinction but does not explain the mechanism.
The words *shared term of art* do not enter a model as a parcel of human
understanding. A tokenizer divides text into tokens and assigns each token an
identifier. An embedding table maps each identifier to a learned vector. The
transformer then combines those vectors with position and surrounding context,
producing contextual states that change from one prompt to another. An output
projection and softmax finally produce a distribution over possible next
tokens.

The path is roughly:

`token IDs → input embeddings → contextual hidden states → output logits → next-token probabilities`

This is why the same word can participate in different response families. The
word *stable* in *stable counting sort* enters a different context from *stable
employment*. A domain term can shift the model toward technical patterns that
occurred around that term during training or that have been supplied in the
current context. The term does not contain the patterns verbatim. It helps
select among them.

Information theory gives us precise language for that selection. A probability
distribution assigns weight to possible outcomes. The **surprisal** of an
observed outcome increases as the probability assigned to it decreases.
**Entropy** summarizes expected surprisal across the distribution: a broad
distribution contains more unresolved uncertainty than one concentrated on a
small set of outcomes. **Conditional prediction** asks how the distribution
changes when context is known.

Claude Shannon developed entropy as part of a mathematical theory of
communication. In his 1951 paper on the prediction and entropy of printed
English, human subjects repeatedly guessed the next character in unfamiliar
passages, and their performance provided a way to estimate redundancy in the
language. Modern neural language models are not a direct implementation of that
experiment, but they inherit the general problem of assigning conditional
probability to the next symbol given prior context.

During training, a next-token model commonly uses a cross-entropy objective that
penalizes probability assigned away from the observed continuation. Over many
examples, the model learns conditional regularities in language. It does not
learn a database in which every term retrieves one fixed answer. It learns
parameters that make some continuations more likely in some contexts.

Return to the import example. Compare these requests:

> Map the date column.

> Map `activation_date` to a nullable calendar-date field. Reject timestamps and
> locale-ambiguous values; expose rows that require account-specific review.

The second request names a smaller problem. The field type, rejected cases, and
review boundary narrow the family of competent continuations. No probability in
this example has been measured, and the model has not become generally smarter.
The context has made more distinctions available to prediction and evaluation.

That same context can still be false. If `activation_date` actually records the
date an export job ran, the model may produce a precise, type-safe, thoroughly
explained mapping to the wrong concept. Conditional probability tells us how an
answer follows from context. It does not provide independent evidence that the
context corresponds to the world.

<details>
<summary>Developer note — entropy, surprisal, and cross-entropy</summary>

For an outcome `x` with probability `p(x)`, surprisal is commonly written
`I(x) = -log₂ p(x)`. Shannon entropy is the expected surprisal,
`H(P) = -Σ p(x) log₂ p(x)`. Cross-entropy scores a predicted distribution
against observations from another distribution. In next-token training, the
observed token is usually represented as the target, and the loss decreases as
the model assigns that token more probability.

These equations describe distributions. They do not measure truth, meaning, or
business value.

</details>

Prediction can explain why a term of art is efficient input. It cannot certify
the term's application. For that, we need the practices that reject plausible
but invalid work.

## 4. Domain Practices Supply Ways to Detect Error

Different domains make different errors visible. Mathematics uses definitions,
proof obligations, and counterexamples. Empirical inquiry uses measurement,
replication, and failed prediction. Software uses specifications, types, tests,
runtime behavior, and operational signals. Product work adds customer evidence,
adoption, correction effort, cost, and effects on the people using the system.

These practices do not collapse into one master score. Each establishes a
different kind of warrant.

Code makes the distinction unusually concrete because some of its constraints
are executable. Consider the phrase *hash-based sorting*. It sounds like a term
of art, but it does not name one universally specified algorithm. Before the
phrase can constrain an implementation, the task must say what is being hashed,
which key ranges or collision behavior matter, whether ordering must be stable,
what complexity is acceptable, and what should happen on invalid input.

Once those assumptions are explicit, several checks become possible:

- The type checker can reject relationships that violate the program's declared
  types.
- Unit examples can establish expected behavior for named cases.
- Property tests can challenge broader invariants such as sorted order and
  preservation of input elements.
- A benchmark can compare latency or memory use under a stated workload.
- Runtime observation can reveal behavior the test environment omitted.
- A product owner can still reject the result because the requested operation
  solves the wrong customer problem.

Some well-scoped coding tasks therefore approach **evaluative closure**: the
repository contains enough evidence, constraints, feedback, and delegated
authority to test whether a bounded change improved. The loop can be short:

`inspect → change → compile → test → benchmark → compare → revise`

Strategy and product questions are often more open. The decisive evidence may
be tacit, private, contested, or still emerging. The environment reacts. Effects
arrive late. The people affected may disagree about what “better” means. Tests
can encode acceptance criteria, but they do not decide whether the goal deserves
pursuit.

This difference helps explain why code is often productive material for AI. A
programming corpus contains traces of syntax, types, tests, review, execution,
and correction. Models can learn patterns from those traces, and tools can apply
some of the original checks to generated work.

But the inference has limits. A model does not automatically inherit a domain's
verification practices merely because it learned from the domain's language.
The training data may contain obsolete techniques, fashionable mistakes,
unexecuted examples, and code that was never correct. Fluency is task-specific.
Evidence that a model produces valid TypeScript under tests says little about
its ability to interpret a customer's ambiguous data field.

The practical question is therefore not, “Can this model be trusted in the
domain?” It is, “What can we check for this task, using which evidence, before
we rely on the result?”

## 5. Turn Domain Fluency into Commercial Value

Return to the import-mapping product. The case remains illustrative; it is not a
report of measured revenue, accuracy, or customer savings. Its purpose is to
show the chain a real product would have to close.

The model begins with meaningful input:

- the target schema and its invariants;
- representative customer files rather than one clean example;
- field definitions, aliases, and known overloaded terms;
- accepted mappings and documented corrections;
- boundary cases, rejected values, and unresolved ambiguity;
- the customer's stated aim; and
- a decision boundary separating suggestions from automatic changes.

From that context, the model proposes candidate mappings. It should expose the
interpretations on which each candidate depends. `company` may identify an
account, an employer, a legal entity, or free text. `active` may be a current
state, a historical observation, or a billing flag. A candidate that hides
these alternatives is easier to read and harder to evaluate.

Mechanical checks can eliminate part of the space. Types reject impossible
values. Parsers detect invalid formats. Referential constraints expose missing
identifiers. Required fields, enumerations, and uniqueness rules reject other
candidates. These checks establish coherence with the application schema and
some operational consequences. They do not settle what an ambiguous source
field meant to the customer.

A domain owner reviews the remaining interpretations. That review is not a
ceremonial human approval after the model has already decided. It contributes
evidence the system does not possess: how the customer's workflow uses the
field, which loss is reversible, whose records are affected, and when an
uncertain mapping should stop rather than guess.

Only use reveals whether the product produced value. The team would need to
observe outcomes such as accepted imports, correction effort, reversals,
support work, and customer time saved. It would also need to count the costs of
generation, review, integration, monitoring, failures, and support. More tokens
are not useful yield. A technically valid mapping that creates expensive cleanup
is not a valuable output.

> **Figure placement — A route that survives use**
>
> Show the same visual grammar moving through: **supplied definitions and
> representative data → candidate mappings and exposed uncertainty → schema
> checks → domain review → customer result and correction effort → retained
> learning**. Put generation cost, review cost, integration cost, and support
> cost beside the path rather than hiding them outside the frame.
>
> **Caption:** Commercial value appears only after generated candidates survive
> evaluation, produce an acceptable customer result, and justify the total cost
> of delivering them. The case illustrates a mechanism; it supplies no measured
> ROI.

This is the point at which “meaningful input” and “valuable output” meet. The
input does not need to contain the finished answer. It needs to expose enough of
the problem that candidate answers can be discriminated. The output does not
need to be infallible. It needs to carry its assumptions and uncertainty into a
process capable of checking them.

If the mapping fails, the failure should improve the next attempt. A corrected
field definition, new boundary example, or revised stopping rule becomes part of
the maintained context. The system creates durable value when evaluation changes
what the organization knows, not merely when generation produces another
candidate.

## 6. Build Organizational Standards for Knowing

One skilled reviewer can perform these checks for a small number of decisions.
That does not make review a scalable organizational practice. As generation
accelerates, a central reviewer can become a queue: every team can create
candidate work, but only one person can decide what deserves reliance.

The alternative is not to lower the standard. It is to make the standard
inspectable and usable where the work happens.

Teams need shared definitions, evidence standards, and acceptance criteria.
They need local tools that expose contradictions, failed tests, uncertain
interpretations, and downstream consequences. They also need decision rights:
which conclusions remain local, which affect another team's commitments, and
which consequences require escalation.

A compact claim record can make the reasoning visible:

| Field | Question |
| --- | --- |
| Claim | What are we asking others to rely on? |
| Source | Which observation, document, test, or person supports it? |
| Assumptions | What must be true for the claim to hold? |
| Scope | Where does it apply, and where does it stop? |
| Uncertainty | Which interpretations or outcomes remain unresolved? |
| Disconfirmation | What evidence would weaken or overturn it? |
| Authority | Who may act, approve, stop, or escalate? |
| Consequence | What happened after someone relied on it? |

Completing a table does not create knowledge. The record matters because it
keeps a conclusion connected to the conditions under which it earned reliance.
It lets another team challenge the premise without reconstructing the entire
conversation. It also keeps disagreement alive long enough to become useful.

Organizations should preserve counterexamples and failed consequences, not only
approved answers. A standard that records success while erasing correction will
teach both people and models the wrong lesson. When local results contradict a
shared assumption, the context should change. Otherwise “alignment” becomes the
coherence of a map that nobody is permitted to compare with the terrain.

The resulting practice is simple to state and difficult to fake:

> **Inspect the input → generate candidates → discriminate among claims → act
> within the evidence → observe consequences → revise the shared context.**

AI can participate in every step. It can expose hidden premises, retrieve
sources, generate alternatives, execute tests, compare outcomes, and record what
changed. It should not silently collapse the steps into one fluent answer.

Meaningful input makes the grounds of prediction inspectable. Valuable output
survives coherence, correspondence, and consequence in relation to an explicit
aim. That is how fluency becomes dependable work: not because the model sounds
like it knows, but because the organization can show what the answer fits, what
it matches, what happened when someone relied on it, and what changed afterward.

The next article asks who can develop and exercise that judgment when output
arrives faster than a central figure can evaluate it.

## Research Notes Before Canonical Revision

- The import-mapping scenario is a composite. Keep it explicitly illustrative
  unless a source-backed case supplies real outcomes and costs.
- The relationship between domain constraint practices and learned model
  fluency remains a working hypothesis. The draft narrows it to task-specific
  patterns and does not claim that models inherit verification automatically.
- The probability comparison is conceptual. Any later numeric example must be
  calculated and labeled as a toy distribution rather than a model measurement.
- The organizational practices in Section 6 are a prescriptive inference from
  the argument, not a demonstrated universal operating model.
- Before canonical revision, decide whether the shared motif pair should remain
  split across the Section 3 heading or render as one uninterrupted block with
  the heading immediately after it.

## Sources

- James O. Young, [“The Coherence Theory of Truth,” *Stanford Encyclopedia of Philosophy*](https://plato.stanford.edu/entries/truth-coherence/). Surveys competing accounts of coherence and explains why consistency alone is insufficient.
- Stanford Encyclopedia of Philosophy, [“The Correspondence Theory of Truth”](https://plato.stanford.edu/entries/truth-correspondence/). Surveys accounts that relate truth-bearing claims to facts, states of affairs, events, objects, and properties.
- Stanford Encyclopedia of Philosophy, [“The Pragmatic Theory of Truth”](https://plato.stanford.edu/entries/truth-pragmatic/). Surveys pragmatic accounts connecting truth, inquiry, practice, and consequences.
- Claude E. Shannon, [“A Mathematical Theory of Communication”](https://doi.org/10.1002/j.1538-7305.1948.tb01338.x) (1948). Defines information entropy and conditional uncertainty.
- Claude E. Shannon, [“Prediction and Entropy of Printed English”](https://doi.org/10.1002/j.1538-7305.1951.tb01366.x) (1951). Uses next-character prediction to estimate the redundancy of English.
- Yoshua Bengio, Réjean Ducharme, Pascal Vincent, and Christian Jauvin, [“A Neural Probabilistic Language Model”](https://www.jmlr.org/papers/v3/bengio03a.html) (2003). Connects conditional word-sequence probabilities with learned distributed representations.
- Tomas Mikolov, Kai Chen, Greg Corrado, and Jeffrey Dean, [“Efficient Estimation of Word Representations in Vector Space”](https://research.google/pubs/efficient-estimation-of-word-representations-in-vector-space/) (2013). Introduces efficient architectures for learning distributed word representations.
- Ashish Vaswani et al., [“Attention Is All You Need”](https://arxiv.org/abs/1706.03762) (2017). Describes transformer attention, learned representations, and next-token probability generation.
- Eric Evans, [*Domain-Driven Design Reference*](https://www.domainlanguage.com/ddd/reference/). Defines bounded contexts and model-aligned domain language.
- Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein, [*Introduction to Algorithms*](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/). Provides the algorithmic terminology and assumptions referenced in the code example.
- Jeremy Avigad, Leonardo de Moura, Soonho Kong, and Sebastian Ullrich, [*Theorem Proving in Lean 4*](https://docs.lean-lang.org/theorem_proving_in_lean4/). Documents mechanically checked propositions and proof objects.
- Microsoft, [*The TypeScript Handbook*](https://www.typescriptlang.org/docs/handbook/). Documents TypeScript's type system and compiler checks.
