# Truth and Inference

The most dangerous prompt is often the one that already sounds solved.

Consider a company that helps customers import spreadsheets into an application. One request says:

> Our customers keep choosing the wrong columns. Design an AI mapper that fixes their mistakes automatically and reduces support costs.

Another says:

> Customers submit files with unfamiliar headers, optional identifiers, mixed date formats, and fields whose meanings vary by account. We have the target schema, representative files, validation errors, and examples of manual corrections. Propose candidate mappings, expose ambiguous interpretations, and identify the evidence needed before any mapping is applied automatically.

The first request is clean, confident, and easy to act on. It may even be right. But it has smuggled three untested claims into the work: that customers are making mistakes, that automatic mapping is the right intervention, and that fewer support tickets would prove success. A language model can turn those claims into a polished product plan without ever discovering whether they describe the real problem.

The second request is less elegant. It is also more useful. It separates observations from interpretations, names the available evidence, and leaves room for more than one cause. Most importantly, it gives the answer somewhere to fail.

That distinction drives this essay: **How do we recognize meaningful input and valuable output when AI can make a weak premise and a strong answer sound equally plausible?**

My answer is to inspect the entire exchange. Meaningful input makes its evidence, assumptions, constraints, omissions, and uncertainty visible. Valuable output passes three different tests: it fits the model being used, it matches what we can observe, and it survives contact with the consequences of acting on it.

Philosophies of truth give us questions to ask of an answer. Information theory helps explain how context shapes LLM inference and what the model is likely to produce. The practical bridge is to make the outcome we expect explicit, then test whether the result fits its assumptions, matches what we observe, and holds up when someone uses it.

> **Series position — navigation, not an explanatory figure**
>
> [Vision and Values](/writing/vision-and-values) →
> [Understanding and Bottlenecks](/writing/understanding-and-bottlenecks) →
> **[Truth and Inference](/writing/truth-and-inference) — YOU ARE HERE** →
> [The Knowledge Factory](/writing/the-knowledge-factory) →
> [Ontology Factory](/writing/the-ontology-factory) →
> [Cognitive Factory](/writing/the-cognitive-factory)

## 1. The Input Is Part of the Argument

We tend to begin evaluating AI after it answers. We look for fabricated sources, broken logic, unsafe code, or a conclusion that cannot survive a meeting. Those checks matter, but they start too late. The prompt is already making an argument.

It names the problem. It decides which observations count. It leaves other explanations outside the frame. It implies what a good answer should optimize. If those choices are wrong, a faithful response can make the error more convincing.

Return to the import example. The sentence “customers keep choosing the wrong columns” sounds like an observation, but it may be an interpretation. Perhaps the interface hides schema definitions. Perhaps two teams use the same header to mean different things. Perhaps the target schema cannot represent a distinction customers genuinely need. Perhaps support tickets rise because the system applies uncertain mappings too confidently.

The model cannot recover these possibilities if the task treats them as settled. It can only reason from the world the prompt gives it.

Good input does not need to contain the answer. It needs to make discrimination possible. What evidence supports the diagnosis? What would contradict it? Which terms have agreed meanings? Where should uncertainty remain visible? Who can resolve it? A request becomes meaningful when another person can inspect why its framing deserves to guide the work.

The answer deserves the same scrutiny. Which conclusions follow from the supplied premises? Which depend on facts outside the prompt? Which can be tested before anyone acts, and which will only become visible in use? Neither prompt nor response should be allowed to grade itself.

This is why prompt quality is not a matter of clever phrasing. A detailed prompt can still be detailed nonsense. The useful improvement is epistemic: it connects a request to evidence, makes assumptions contestable, and preserves unresolved questions long enough for the right person or test to answer them.

## 2. A Good Answer Can Be Wrong in Three Ways

Three familiar truth practices give us a practical map: coherence, correspondence, and consequence. They overlap, but they catch different failures.

**Coherence asks: Does it fit?** A claim should remain consistent with the definitions, premises, and rules of the representation in which it appears. A proposed mapping from `signup_date` to `createdAt` may fit the declared schema, its data types, and every other mapping in the plan. That is evidence. It is not evidence that the source column means the date the application expects.

The philosophical coherence theory of truth is more demanding—and more contested—than this everyday consistency check. Philosophers disagree about both the relation that counts as coherence and the set of beliefs or propositions against which a claim must cohere. Consistency alone is too weak. Two incompatible claims can each fit an incomplete account. Here, coherence is a test, not a theory that internal fit exhausts truth.

**Correspondence asks: Does it match?** The mapping has to return to something observable. Documentation, representative files, customer explanations, and application behavior may reveal that `signup_date` means the date a record was exported, the date an account opened, or a date typed by an administrator. The column name is evidence. It is not the terrain.

**Consequence asks: What happens when someone relies on it?** A mapping may cohere with the schema and match a sample file, then fail in use. It might discard timezone information, merge two customer concepts, or create cleanup work that costs more than manual entry. Consequences do not turn whatever works temporarily into truth, and commercial success does not decide what is good. They reveal what our abstractions do when they meet people, systems, and time.

> **Figure placement — A consistent map, a missing crossing**
>
> Show a map whose roads join cleanly, a terrain observation that reveals a missing crossing, and a traveler stopped at the river after following the route. Label the three tests: **Coherence — does the map fit itself?** **Correspondence — does it fit the terrain?** **Consequence — what happens when someone follows it?**
>
> **Caption:** Internal consistency, external observation, and reliance answer different questions. Passing one test does not guarantee passing the next.

The tests do not always arrive in that order. Observation can expose a contradiction in the model. A bad consequence can reveal a missing observation. A formal inconsistency can stop an action before anyone reaches the river. The point is not a rigid sequence. It is refusing to let success under one test silently stand in for all three.

Other truth practices still matter. Acquaintance asks whether an account remains faithful to lived experience. Sincerity asks whether expression aligns with inward belief. Trustworthiness asks whether a person, system, or claim has earned reliance. Those questions are especially important when values, testimony, and relationships are at stake, and they belong more fully to the opening essay, *Vision and Values*. This article stays with coherence, correspondence, and consequence because they recur so clearly in technical and product work.

Repeated practice also changes the language we use. A community refines an idea through definition, evidence, and correction. It gives that idea discipline through continuity, clarification, and specification. Eventually, a loose expression can become a term of art: a stable label for distinctions practitioners repeatedly need.

> **Shared motif placement — Variant 02: `refinement-and-discipline-to-term-of-art`**
>
> **REFINEMENT + DISCIPLINE — Refinement and discipline establish a term of art**
>
> **Idea — shared meaning** → **ESTABLISHES** → **Term of art — consistent within a domain**
>
> Inputs: **Discipline — continuity · clarification · specification** and **Refinement — definition · evidence · correction**
>
> Axis: **MEANING POTENTIAL / REFINEMENT + DISCIPLINE / STABLE TERM**
>
> **Caption:** A term becomes stable through definition, evidence, correction, continuity, clarification, and specification. Stability within a domain still does not guarantee correspondence or good consequences.

A term of art is more than a short string and less than a guarantee. It is a compact address into a history of distinctions. The next question is what happens when that address enters a predictive model.

## 3. The Right Term Changes the Prediction

J. R. Firth's line—“You shall know a word by the company it keeps”—captured a distributional idea that Zellig Harris also formalized: patterns of use tell us something important about linguistic structure. Word2Vec later made a limited version of that idea computationally concrete. Words appearing in similar contexts acquired related vector representations.

Modern language models are not simply giant Word2Vec tables, and distribution is not a complete theory of meaning. Still, the history matters. It explains why a term can direct prediction without containing a finished answer.

> **Shared motif placement — Variant 02b: `understanding-in-embedding-space`**
>
> **EMBEDDING SPACE / INFERENCE VALUE — Short input, useful output—or just more tokens**
>
> **WITH UNDERSTANDING:** Shared term of art → learned or supplied domain distinctions → inference guided by meaning → useful expansion that fits the intended result.
>
> **WITHOUT UNDERSTANDING:** Ambiguous label → loose meaning and absent criteria → fluent inference without grounding → excess output that does not fit the goal.
>
> Footer: **CONCEPTUAL CONTRAST · TOKEN MARKS ARE NOT COUNTS / VALUE ≠ VOLUME**
>
> **Caption:** A term of art can point into a learned network of distinctions. The contrast is conceptual, not a measured gain. The model still generates text, and the result still has to be evaluated.

The mechanism is less mystical than the picture may suggest. A tokenizer divides text into tokens and assigns each one an identifier. An embedding table maps those identifiers to learned vectors. Position, attention, and feed-forward layers transform them into contextual states. An output projection and softmax then produce a probability distribution over possible next tokens.

The rough path is:

`token IDs → input embeddings → contextual hidden states → output logits → next-token probabilities`

Context changes the state. *Stable* participates in one family of relationships in *stable counting sort* and another in *stable employment*. A domain term can shift a model toward patterns associated with that term during training or supplied in the current prompt. It does not store those patterns verbatim. It helps select among them.

Information theory gives us precise language for that selection. **Surprisal** increases as the probability assigned to an observed outcome decreases. **Entropy** describes the expected surprisal across a distribution: a broad distribution contains more unresolved uncertainty than one concentrated on a few outcomes. Conditional prediction asks how that distribution changes when context is known.

Claude Shannon developed entropy as part of a mathematical theory of communication. In his 1951 work on printed English, people repeatedly guessed the next character in unfamiliar passages, providing a way to estimate redundancy in the language. A modern neural language model is not a direct implementation of that experiment, but it inherits the central predictive problem: assign probabilities to what comes next given what came before.

During training, a next-token model commonly uses a cross-entropy objective. It is penalized when it assigns too little probability to the observed continuation. Across many examples, its parameters come to reflect conditional regularities in language. The result is not a database where each phrase retrieves one fixed response. It is a system in which some continuations become more likely under some contexts.

Compare these requests:

> Map the date column.

> Map `activation_date` to a nullable calendar-date field. Reject timestamps and locale-ambiguous values; expose rows that require account-specific review.

The second request names a smaller problem. Its field type, rejected cases, and review boundary narrow the family of competent continuations. I am not claiming a measured probability change here, and the model has not become generally smarter. The prompt has made more distinctions available to both prediction and evaluation.

It can still be precisely wrong. If `activation_date` actually records when an export job ran, the model may produce a type-safe, thoroughly explained mapping to the wrong concept. Conditional probability can tell us how an answer follows from context. It cannot independently establish that the context matches the world.

<details>
<summary>Developer note — entropy, surprisal, and cross-entropy</summary>

For an outcome `x` with probability `p(x)`, surprisal is commonly written `I(x) = -log₂ p(x)`. Shannon entropy is expected surprisal: `H(P) = -Σ p(x) log₂ p(x)`. Cross-entropy scores a predicted distribution against observations from another distribution. In next-token training, the loss decreases as the model assigns more probability to the observed token.

These equations describe distributions. They do not measure truth, meaning, or business value.

</details>

Prediction explains why a term of art can be efficient input. Practice determines whether the term was applied well.

## 4. Domains Teach Language What to Reject

Technical language carries a history of constraint. A useful term names a distinction people repeatedly needed. Its surrounding syntax records common relationships. Examples establish ordinary cases. Failures and counterexamples draw the boundary. Tools, institutions, and consequences reinforce the uses that survive.

This is why a term of art can contain more working knowledge than its glossary entry. It points into a bounded context: a network of assumptions, operations, and known failure modes that cannot fit in a definition. The same process can also preserve stale habits, institutional blind spots, and fashionable mistakes. Language remembers what a domain repeated, not only what it got right.

A compact way to describe the constructive path is:

**Label → operationalize → formalize → compute.**

A label names the distinction. Operational practice connects it to action and consequence. Formalization makes relationships explicit enough to compose. Computation lets a system derive, execute, and check some of those relationships. Each step can sharpen the next, but none removes the need to return to observation.

Different domains make different errors visible. Mathematics uses definitions, proof obligations, and counterexamples. Empirical inquiry uses measurement, replication, and failed prediction. Software uses specifications, types, tests, runtime behavior, and operational signals. Product work adds customer evidence, adoption, correction effort, cost, and effects on the people using the system. There is no single master score hiding behind all of them.

Code makes this unusually concrete because some constraints are executable. Take the phrase *hash-based sorting*. It sounds specific, but it does not name one universally specified algorithm. What is being hashed? Which key ranges matter? How should collisions behave? Must ordering be stable? What complexity is acceptable? What happens on invalid input?

Once those assumptions are explicit, the work can face several independent checks. A type checker rejects relationships that violate declared types. Unit examples establish named behavior. Property tests challenge broader invariants such as sorted order and preservation of elements. Benchmarks compare latency or memory under a stated workload. Runtime observation catches conditions the test environment omitted. A product owner may still reject the implementation because the requested operation solves the wrong problem.

Some bounded coding tasks therefore approach **evaluative closure**: the repository contains enough evidence, constraints, feedback, and delegated authority to tell whether a change improved.

`inspect → change → compile → test → benchmark → compare → revise`

Strategy rarely closes that neatly. The decisive evidence may be tacit, private, contested, or still emerging. Effects arrive late. The environment reacts. People disagree about what “better” means. Tests can encode an acceptance criterion; they cannot decide whether the goal deserves pursuit.

I ran into a smaller version of this while designing the THOM logo. Broad prompts produced plausible marks, but not controllable typography. Once I began using the domain's language—optical profiles, stroke hierarchy, glyph silhouette, spacing, construction-line density—I could ask for specific changes to the Bézier curves, stroke thickness, and the compact `M` used in the header and footer.

You can probably tell it was vibe designed. It is still better than I thought I could make, because the prompt stopped asking for taste in the abstract and started describing a bounded typographic problem with observable constraints.

That does not prove a general theory of model capability. It demonstrates a practical diagnostic. When evaluating “domain fluency,” ask about the task in front of you:

- Is the vocabulary stable inside a bounded context, or are key terms overloaded?
- Do examples include counterexamples and boundary cases, or only clean successes?
- Can an external check reject plausible output, or does evaluation depend on how it sounds?
- Does the task preserve uncertainty and disagreement, or force everything into one confident answer?

A model can be sharp where the feedback is dense and glib where it is thin. Evidence that it writes valid TypeScript under tests says little about whether it understands an ambiguous customer field.

## 5. Paid Work Begins After Generation

Now return to the import-mapping product. This is a composite example, not a report of measured revenue, accuracy, or customer savings. Its purpose is to expose the chain a real product would have to close.

The system begins with a target schema, representative customer files, field definitions, known aliases, accepted mappings, documented corrections, boundary cases, and the customer's stated aim. It also needs a decision boundary: which mappings may be suggested, which may be applied automatically, and which must stop for review.

From that context, the model proposes candidates and exposes the interpretations on which they depend. `company` might mean an account, an employer, a legal entity, or free text. `active` might be a current state, a historical observation, or a billing flag. Hiding those alternatives makes the answer easier to read and harder to trust.

Mechanical checks can eliminate part of the space. Types reject impossible values. Parsers detect invalid formats. Referential constraints expose missing identifiers. Required fields, enumerations, and uniqueness rules reject other candidates. These checks establish coherence with the application schema and anticipate some consequences. They do not settle what an ambiguous source field meant to the customer.

A domain owner reviews the remaining interpretations. This is not ceremonial approval after the model has already decided. The reviewer contributes evidence the system does not possess: how the customer uses the field, which loss is reversible, whose records are affected, and when uncertainty should stop the process rather than be guessed away.

Only use reveals whether the product created value. The team would need to observe accepted imports, correction effort, reversals, support work, and customer time saved. It would also need to count generation, review, integration, monitoring, failure, and support costs. More output is not more value. A technically valid mapping that creates expensive cleanup is a bad product result.

> **Figure placement — A route that survives use**
>
> Show: **supplied definitions and representative data → candidate mappings and exposed uncertainty → schema checks → domain review → customer result and correction effort → retained learning**. Put generation, review, integration, monitoring, and support costs beside the path rather than outside it.
>
> **Caption:** Commercial value appears only after generated candidates survive evaluation, produce an acceptable customer result, and justify the total cost of delivering them. This is a mechanism, not a measured ROI claim.

This is where meaningful input meets valuable output. The input need not contain the finished answer. It must expose enough of the problem to distinguish among candidates. The output need not be infallible. It must carry assumptions and uncertainty into a process capable of checking them.

When a mapping fails, the failure should improve the next attempt. A corrected field definition, a new boundary example, or a revised stopping rule becomes part of the maintained context. The organization creates durable value when evaluation changes what it knows—not merely when generation produces another candidate.

## 6. Make Judgment Local and Inspectable

One skilled reviewer can perform these checks for a handful of decisions. That does not make review a scalable practice. As generation accelerates, the central expert becomes a queue: everyone can produce candidate work, but only one person can decide what deserves reliance.

The answer is not a lower standard. It is a standard people can use where the work happens.

Teams need shared definitions, evidence requirements, and acceptance criteria. They need local tools that expose contradictions, failed tests, uncertain interpretations, and downstream effects. They also need explicit decision rights: which conclusions remain local, which change another team's commitments, and which consequences require escalation.

A compact claim record can keep the reasoning visible:

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

Filling in a table does not create knowledge. The record matters because it keeps a conclusion attached to the conditions under which it earned reliance. Another team can challenge the premise without reconstructing the whole conversation. Disagreement survives long enough to become useful.

Organizations should preserve counterexamples and failed consequences, not only approved answers. A standard that records success while erasing correction teaches people and models the wrong lesson. When local results contradict a shared assumption, the context should change. Otherwise alignment becomes the coherence of a map nobody is permitted to compare with the terrain.

The practice is simple to state and difficult to fake:

> **Inspect the input → generate candidates → discriminate among claims → act within the evidence → observe consequences → revise the shared context.**

AI can assist at every step. It can surface hidden premises, retrieve sources, generate alternatives, execute tests, compare outcomes, and record what changed. What it should not do is collapse those steps into one fluent answer and call the work complete.

Meaningful input makes the grounds of prediction inspectable. Valuable output survives coherence, correspondence, and consequence in relation to an explicit aim. A model is fluent where language has learned to carry the constraints. Our work is to follow that fluency back through consequence to correspondence: does it fit, does it work, and does it match the world we mean to change?

The next article, [The Knowledge Factory](/writing/the-knowledge-factory), builds
a repeatable system around these teams and their standards of judgment: how
does intent become a verified outcome?

## Research Notes Before Canonical Revision

- The import-mapping scenario is a composite. Keep it explicitly illustrative unless a source-backed case supplies real outcomes and costs.
- The relationship between domain constraint practices and model fluency remains a working hypothesis. This draft narrows the claim to task-specific patterns and does not suggest that a model automatically inherits a domain's verification practices.
- The probability comparison is conceptual. Any later numeric example must be calculated and labeled as a toy distribution rather than a model measurement.
- The organizational practices in Section 6 are a prescriptive inference, not a demonstrated universal operating model.
- Before canonical revision, decide whether the shared motif pair should remain split across Sections 2 and 3 or render as one uninterrupted block.
- The map, embedding, constraint, and commercial-route figures should be reviewed as one visual sequence before canonical asset work begins. Repeating every figure from the current article would overload the revised argument.

## Sources

- James O. Young, [“The Coherence Theory of Truth,” *Stanford Encyclopedia of Philosophy*](https://plato.stanford.edu/entries/truth-coherence/). Surveys competing accounts of coherence and explains why consistency alone is insufficient.
- Stanford Encyclopedia of Philosophy, [“The Correspondence Theory of Truth”](https://plato.stanford.edu/entries/truth-correspondence/). Surveys accounts that relate truth-bearing claims to facts, states of affairs, events, objects, and properties.
- Stanford Encyclopedia of Philosophy, [“The Pragmatic Theory of Truth”](https://plato.stanford.edu/entries/truth-pragmatic/). Surveys pragmatic accounts connecting truth, inquiry, practice, and consequences.
- J. R. Firth, [“A Synopsis of Linguistic Theory, 1930–1955”](https://languagelog.ldc.upenn.edu/myl/Firth1957.pdf). Presents the distributional maxim about knowing a word by the company it keeps.
- Zellig S. Harris, [“Distributional Structure”](https://www.its.caltech.edu/~matilde/ZelligHarrisDistributionalStructure1954.pdf) (1954). Describes linguistic structure through distributions of elements in environments.
- Claude E. Shannon, [“A Mathematical Theory of Communication”](https://doi.org/10.1002/j.1538-7305.1948.tb01338.x) (1948). Defines information entropy and conditional uncertainty.
- Claude E. Shannon, [“Prediction and Entropy of Printed English”](https://doi.org/10.1002/j.1538-7305.1951.tb01366.x) (1951). Uses next-character prediction to estimate the redundancy of English.
- Yoshua Bengio, Réjean Ducharme, Pascal Vincent, and Christian Jauvin, [“A Neural Probabilistic Language Model”](https://www.jmlr.org/papers/v3/bengio03a.html) (2003). Connects conditional word-sequence probabilities with learned distributed representations.
- Tomas Mikolov, Kai Chen, Greg Corrado, and Jeffrey Dean, [“Efficient Estimation of Word Representations in Vector Space”](https://research.google/pubs/efficient-estimation-of-word-representations-in-vector-space/) (2013). Introduces efficient architectures for learning distributed word representations.
- Ashish Vaswani et al., [“Attention Is All You Need”](https://arxiv.org/abs/1706.03762) (2017). Describes transformer attention, learned representations, and next-token probability generation.
- Eric Evans, [*Domain-Driven Design Reference*](https://www.domainlanguage.com/ddd/reference/). Defines bounded contexts and model-aligned domain language.
- Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein, [*Introduction to Algorithms*](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/). Provides the algorithmic terminology and assumptions referenced in the code example.
- Jeremy Avigad, Leonardo de Moura, Soonho Kong, and Sebastian Ullrich, [*Theorem Proving in Lean 4*](https://docs.lean-lang.org/theorem_proving_in_lean4/). Documents mechanically checked propositions and proof objects.
- Microsoft, [*The TypeScript Handbook*](https://www.typescriptlang.org/docs/handbook/). Documents TypeScript's type system and compiler checks.
