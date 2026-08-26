# AI Factory Series Sources Audit

## Recommendation

Give every public essay a final `## Sources` section with three to eight
claim-mapped entries. Use the same heading and entries in the custom React page
when one exists. Prefer papers, standards, official documentation, and
first-party case reports; describe the article's broader argument as the
author's synthesis rather than implying that a bibliography proves it.

Current publication surfaces:

| Article | `article.md` | Custom page | Closing source status |
| --- | --- | --- | --- |
| Goals, Solutions & Value | Yes | Yes | Has nine-item `References` section in both surfaces |
| Truth, Entropy & Inference | Yes | Yes | Four inline links; no closing section |
| The Understanding Bottleneck | Yes | Yes | Five inline links; no closing section |
| The Knowledge Factory | Yes | Yes | No external citations; `Research Queue` is not a bibliography |
| Ontology Factory | Yes | No | Six inline links; no closing section |
| Cognitive Factory | Yes | Yes | No external citations |

## Goals, Solutions & Value

Rename `References` to `Sources` in both public surfaces and reduce the list
from nine entries to these eight. The Stanford Encyclopedia survey is useful
background, but it is the easiest item to remove when favoring primary work.

1. Common Crawl, [“Common Crawl maintains a free, open repository of web crawl
   data”](https://commoncrawl.org/) — supports only the description of Common
   Crawl as a public web corpus, not a claim that any particular model used it.
2. Philip Gage, [“A New Algorithm for Data
   Compression”](https://www.derczynski.com/papers/archive/BPE_Gage.pdf)
   (1994) — introduces byte-pair encoding as a lossless compression method.
3. Rico Sennrich, Barry Haddow, and Alexandra Birch, [“Neural Machine
   Translation of Rare Words with Subword
   Units”](https://aclanthology.org/P16-1162/) (ACL 2016) — supports the
   adaptation of BPE to subword tokenization.
4. David E. Rumelhart, Geoffrey E. Hinton, and Ronald J. Williams, [“Learning
   Representations by Back-Propagating
   Errors”](https://doi.org/10.1038/323533a0) (1986) — supports the training
   description as an influential demonstration of backpropagation in multilayer
   networks. Do not say the paper invented or first established the method.
5. Ashish Vaswani et al., [“Attention Is All You
   Need”](https://proceedings.neurips.cc/paper_files/paper/2017/hash/3f5ee243547dee91fbd053c1c4a845aa-Abstract.html)
   (NeurIPS 2017) — supports the Transformer attention and feed-forward account.
6. Claude E. Shannon, [“Prediction and Entropy of Printed
   English”](https://doi.org/10.1002/j.1538-7305.1951.tb01366.x) (1951) —
   supports the historical next-character-prediction and linguistic-redundancy
   lineage.
7. John Dewey, [*Theory of
   Valuation*](https://archive.org/details/theoryofvaluatio032168mbp) (1939) —
   supports the consequences-sensitive, revisable account of valuation.
8. Angelo Romasanta, Llewellyn D. W. Thomas, and Natalia Levina, [“Researchers
   Asked LLMs for Strategic Advice. They Got ‘Trendslop’ in
   Return”](https://hbr.org/2026/03/researchers-asked-llms-for-strategic-advice-they-got-trendslop-in-return)
   (2026) — supports the exact order, context, and wording effects in the
   opening. This is the study authors' HBR report; label the percentages as
   reported findings rather than as independently replicated evidence.

## Truth, Entropy & Inference

Add the same seven-item `Sources` section after the closing line in
`article.md` and `index.tsx`.

1. Claude E. Shannon, [“A Mathematical Theory of
   Communication”](https://doi.org/10.1002/j.1538-7305.1948.tb01338.x) (1948)
   — supports entropy as expected uncertainty/information in a probability
   distribution.
2. Claude E. Shannon, [“Prediction and Entropy of Printed
   English”](https://doi.org/10.1002/j.1538-7305.1951.tb01366.x) (1951) —
   supports the next-letter experiment and the statistical constraints in
   English.
3. Yoshua Bengio, Réjean Ducharme, Pascal Vincent, and Christian Jauvin, [“A
   Neural Probabilistic Language
   Model”](https://www.jmlr.org/papers/v3/bengio03a.html) (2003) — supports
   conditional word-sequence probabilities and learned distributed
   representations.
4. Eric Evans, [*Domain-Driven Design
   Reference*](https://www.domainlanguage.com/ddd/reference/) — supports
   bounded contexts, models, and domain-specific language.
5. Jeremy Avigad, Leonardo de Moura, Soonho Kong, and Sebastian Ullrich,
   [*Theorem Proving in Lean
   4*](https://docs.lean-lang.org/theorem_proving_in_lean4/) — supports the
   claim that formalized propositions and proof objects can be checked against
   explicit axioms and rules.
6. Microsoft, [*The TypeScript
   Handbook*](https://www.typescriptlang.org/docs/handbook/) — provides an
   official example of a type checker mechanically rejecting invalid program
   relationships.
7. Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, and Clifford
   Stein, [*Introduction to Algorithms*, fourth
   edition](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)
   — supports the sorting families and the importance of input and complexity
   assumptions.

Accuracy guardrails: Shannon does not establish that an underspecified prompt
has a directly measured entropy value, so present the distribution figure as a
conceptual model unless it uses actual model probabilities. The cited code and
proof systems demonstrate mechanical constraint, but they do not by themselves
prove the broader thesis that code corpora are more “pattern-dense.” CLRS does
not define one universally standard algorithm called `hash sort`; retain the
article's bounded-integer/bucket-family qualification.

## The Understanding Bottleneck

Add the same seven-item `Sources` section after the closing in both public
surfaces. Prefer Tao's essay over the current secondary Simons Foundation story.

1. Terence Tao, [“Mathematics in the Age of
   AI”](https://arxiv.org/abs/2608.16753) (2026) — primary support for the
   proof-abundance example, “proof indigestion,” and the goals and values of
   mathematical work.
2. OpenAI, [“An OpenAI model has disproved a central conjecture in discrete
   geometry”](https://openai.com/index/model-disproves-discrete-geometry-conjecture/)
   (2026) — first-party support for the unit-distance case, its disclosed
   external checks, and OpenAI's own human-judgment conclusion. It is not an
   independent assessment of OpenAI's model or proof.
3. [*Leiden Declaration on Artificial Intelligence and
   Mathematics*](https://leidendeclaration.ai/) (2026) — supports correctness,
   understanding, attribution, transparency, and human direction as distinct
   requirements for mathematical work.
4. Avigad et al., [*Theorem Proving in Lean
   4*](https://docs.lean-lang.org/theorem_proving_in_lean4/) — supports the
   distinction between kernel-checkable formal proof objects and the human task
   of choosing and interpreting a formalization.
5. Karl E. Weick, Kathleen M. Sutcliffe, and David Obstfeld, [“Organizing and
   the Process of
   Sensemaking”](https://doi.org/10.1287/orsc.1050.0133) (2005) — supports
   sensemaking as turning circumstances into an articulated situation that can
   guide action.
6. Amy C. Edmondson, [“Psychological Safety and Learning Behavior in Work
   Teams”](https://doi.org/10.2307/2666999) (1999) — supports the narrower
   finding that psychological safety was associated with team learning
   behavior in the studied teams.
7. ISO, [*ISO 9241-210:2019 — Human-centred design for interactive
   systems*](https://www.iso.org/standard/77520.html) — supports sustained
   attention to users, needs, and human-system consequences throughout design.

The “understanding bottleneck” remains the essay's synthesis, not a result
established by these sources. Do not turn Edmondson's association into a
universal causal claim or the OpenAI case report into independent verification.

## The Knowledge Factory

Replace the public research queue with, or follow it by, a real final `Sources`
section in both public surfaces. These eight sources cover the article's main
organizational and strategy mechanisms:

1. DORA, Google, [*2025 State of AI-assisted Software Development
   Report*](https://research.google/pubs/dora-2025-state-of-ai-assisted-software-development-report/)
   — supports the article's most important empirical premise: AI adoption is a
   systems problem and tends to amplify existing organizational strengths and
   weaknesses. It does not prove that a “knowledge factory” causes superior
   performance.
2. Ikujiro Nonaka, [“A Dynamic Theory of Organizational Knowledge
   Creation”](https://doi.org/10.1287/orsc.5.1.14) (1994) — supports knowledge
   creation as an organizational process that moves between tacit and explicit
   forms rather than a document-storage problem.
3. James G. March, [“Exploration and Exploitation in Organizational
   Learning”](https://doi.org/10.1287/orsc.2.1.71) (1991) — supports the tension
   between exploring new possibilities, exploiting established knowledge, and
   learning across organizational time horizons.
4. Weick, Sutcliffe, and Obstfeld, [“Organizing and the Process of
   Sensemaking”](https://doi.org/10.1287/orsc.1050.0133) (2005) — supports the
   claim that interpretation and narrative shape coordinated organizational
   action.
5. James P. Walsh and Gerardo Rivera Ungson, [“Organizational
   Memory”](https://doi.org/10.5465/AMR.1991.4278992) (1991) — supports the
   acquisition, retention, retrieval, use, and possible misuse of organizational
   memory; it grounds the “second brain” section without endorsing that label.
6. Michael E. Porter, [“What Is
   Strategy?”](https://hbr.org/1996/11/what-is-strategy) (1996) — supports
   strategy as a coherent system of activities and tradeoffs distinct from
   operational effectiveness.
7. ISO, [*ISO 9241-210:2019 — Human-centred design for interactive
   systems*](https://www.iso.org/standard/77520.html) — supports incorporating
   user needs and human consequences throughout product design rather than
   relying only on internal metrics.
8. Elham Tabassi, [*Artificial Intelligence Risk Management Framework (AI RMF
   1.0)*](https://doi.org/10.6028/NIST.AI.100-1) (NIST, 2023) — supports
   continuous governance, context mapping, measurement, evaluation, and
   accountability around deployed AI systems.

Accuracy guardrails: the factory metaphor, eight-layer stack, factory-engineer
role, and predicted “disproportionate advantage” are the author's proposed
operating model. Present them as a synthesis and wager, not as findings from
the sources. DORA is a large mixed-method report but is not causal proof;
Nonaka, March, Weick, and Walsh predate current generative AI and support the
organizational mechanisms, not the AI-specific conclusions.

## Ontology Factory

This is the only essay without a custom page, so a final section in
`article.md` is sufficient. Use these seven sources:

1. Thomas R. Gruber, [“A Translation Approach to Portable Ontology
   Specifications”](https://tomgruber.org/writing/ontolingua-kaj-1993.pdf)
   (1993) — primary support for ontology as an explicit representational
   vocabulary of classes, relations, functions, and other domain objects.
2. Eric Evans, [*Domain-Driven Design
   Reference*](https://www.domainlanguage.com/ddd/reference/) — primary author
   support for bounded contexts, ubiquitous language, and deliberate domain
   models. Prefer this to the current Fowler summary when defining the terms.
3. David L. Parnas, [“On the Criteria To Be Used in Decomposing Systems into
   Modules”](https://doi.org/10.1145/361598.361623) (1972) — supports assigning
   stable responsibilities and hiding changeable decisions behind module
   boundaries.
4. Edsger W. Dijkstra, [“The Structure of the ‘THE’-Multiprogramming
   System”](https://doi.org/10.1145/363095.363143) (1968) — primary historical
   support for deliberate layered-system structure.
5. John Ousterhout, [*A Philosophy of Software Design*, second-edition
   extract](https://web.stanford.edu/~ouster/cgi-bin/aposd2ndEdExtract.pdf) —
   supports deep modules and keeping implementation decisions behind compact
   interfaces.
6. Nx, [“Enforce Module
   Boundaries”](https://nx.dev/docs/features/enforce-module-boundaries) —
   official support for using project tags and automated rules to constrain
   dependency direction.
7. Uber Engineering, [“Introducing Domain-Oriented Microservice
   Architecture”](https://www.uber.com/us/en/blog/microservice-architecture/)
   — first-party case evidence for domains, layers, gateways, and ownership at
   large organizational scale.

The SoundSculpt path grammar, layer meanings, README/AGENTS schema, and
verification workflow are project-specific primary evidence supplied by the
case itself. The external sources ground its terminology and design lineage;
they do not independently verify those repository facts or prove that this is
the only valid ontology.

## Cognitive Factory

Add the same seven-item `Sources` section after the series list in both public
surfaces.

1. Michael Levin, [“Technological Approach to Mind Everywhere: An
   Experimentally-Grounded Framework for Understanding Diverse Bodies and
   Minds”](https://doi.org/10.3389/fnsys.2022.768201) (2022) — the primary
   source for the *cognitive light cone* as the spatiotemporal scope and
   complexity of goals a system can pursue.
2. Patrick Lewis et al., [“Retrieval-Augmented Generation for
   Knowledge-Intensive NLP
   Tasks”](https://proceedings.neurips.cc/paper/2020/hash/6b493230-Abstract.html)
   (NeurIPS 2020) — supports retrieval from explicit non-parametric memory and
   identifies provenance and knowledge updating as problems; it does not prove
   the article's full graph-context model.
3. Shunyu Yao et al., [“ReAct: Synergizing Reasoning and Acting in Language
   Models”](https://arxiv.org/abs/2210.03629) (ICLR 2023) — supports the narrow
   agent pattern of interleaving model reasoning, tool actions, environmental
   observations, and plan updates.
4. Noah Shinn et al., [“Reflexion: Language Agents with Verbal Reinforcement
   Learning”](https://papers.nips.cc/paper_files/paper/2023/hash/1b44b878bb782e6954cd888628510e90-Abstract-Conference.html)
   (NeurIPS 2023) — supports retaining task feedback in episodic text memory to
   improve subsequent agent trials. It is not evidence that organizations
   automatically learn or that reflection always compounds.
5. W3C, [*PROV-O: The PROV
   Ontology*](https://www.w3.org/TR/prov-o/) (2013) — official support for
   representing and exchanging provenance through entities, activities,
   agents, and their relationships.
6. NIST, [*Artificial Intelligence Risk Management Framework: Generative
   Artificial Intelligence Profile*](https://doi.org/10.6028/NIST.AI.600-1)
   (2024) — supports lifecycle governance, context mapping, measurement,
   evaluation, documentation, and human accountability around generative-AI
   systems.
7. DORA, Google, [*2025 State of AI-assisted Software Development
   Report*](https://research.google/pubs/dora-2025-state-of-ai-assisted-software-development-report/)
   — supports the claim that effective AI adoption depends on the surrounding
   organizational system and capabilities rather than model access alone.

The article currently changes Levin's construct from the scope of represented
goals to “how much of the relevant domain the system can observe, interpret,
affect, and learn from.” Call this explicitly **an organizational adaptation of
Levin's cognitive-light-cone metaphor**. The LLM/agent/knowledge-factory
scorecard, compounding loop, and diagnostic build order are the author's
synthesis. RAG, ReAct, and Reflexion establish narrower technical mechanisms;
they do not validate the whole organizational model.

## Publication Parity Check

When the sources are implemented, verify both publication surfaces rather than
only the Markdown:

- `goals-solutions-and-value`: rename and update the existing Markdown and JSX
  lists together.
- `truth-entropy-and-inference`, `understanding-is-the-bottleneck`,
  `the-knowledge-factory`, and `the-cognitive-factory`: add an equivalent final
  `Sources` section to both `article.md` and `index.tsx`.
- `the-ontology-factory`: update only `article.md`; it uses the generic Markdown
  renderer.

The final page should expose the source title, author or institution, stable
primary URL, and one bounded sentence saying what the source supports. A source
list should not silently convert a conceptual proposal, first-party case,
association, or benchmark result into a universal causal claim.
