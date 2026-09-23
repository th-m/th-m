# Understanding and Bottlenecks

A proof can be correct before a field understands why it matters. A pull request
can pass every test before its author—or its reviewer—can explain what the
change will do to the larger system. A polished answer can arrive before anyone
has decided whether it answers the right question.

AI did not create these gaps. It made them easier to reach.

[Vision and Values](/writing/vision-and-values) asked who chooses the direction.
The next question is organizational. When generation outruns evaluation, where
does understanding live?

The tempting answer is to place it in one experienced person: the architect,
staff engineer, research lead, or executive who can see the whole. That answer
works until every local discovery and consequential decision has to pass
through the same head. Then expertise becomes a queue.

The alternative is not leaderless autonomy. It is to move complete learning
loops into bounded teams and connect those teams through shared intent,
explicit interfaces, decision rights, and evidence. The goal is not simply to
distribute production. It is to distribute the capacity to understand what the
work means, act on it, and revise the model when reality pushes back.

> **Series map:** [Vision and Values](/writing/vision-and-values) →
> **Understanding and Bottlenecks** → [Truth and Coherence](/writing/truth-and-inference) →
> [The Knowledge Factory](/writing/the-knowledge-factory) → [The Ontology
> Factory](/writing/the-ontology-factory) → [The Cognitive
> Factory](/writing/the-cognitive-factory)

## 1. Generation Scales; Understanding Does Not

Consider four scenes from AI-assisted work.

In mathematics, systems can now generate or verify results faster than the
mathematical community can explain, teach, evaluate, and absorb them. Terence
Tao calls the resulting condition [“proof
indigestion”](https://arxiv.org/abs/2608.16753): candidate proofs can outrun
verification, verified proofs can outrun explanation, and published work can
outrun collective understanding.

Formal verification matters, but it answers a bounded question. A certificate
can establish that a derivation follows from encoded definitions and axioms. It
cannot establish by itself that the encoding captures the informal problem, that
the result matters, or that anyone can explain why it works. Tao's practical
test is strikingly human: before a result is treated as complete, its authors
should be able to give a clear, correct, and properly attributed expert talk
about it.

The [OpenAI unit-distance
result](https://openai.com/index/model-disproves-discrete-geometry-conjecture/)
makes the division of labor visible. External mathematicians checked the proof;
people still chose the problem and interpreted the significance of the answer.
The [Leiden Declaration](https://leidendeclaration.ai/) gives that distinction an
institutional form by placing correctness alongside depth, understanding,
attribution, transparency, and human direction.

Now move from mathematics to software development. A mixed-methods [study of
442 developers](https://arxiv.org/abs/2510.07435) associated GenAI adoption with
higher job demands and burnout, while autonomy and learning resources softened
those relationships. A [survey of 319 knowledge
workers](https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/)
found that AI shifted reported critical-thinking work toward verification,
response integration, and task stewardship. AI can remove effort from one part
of the job while piling it onto another.

An industry-sponsored [GitLab
survey](https://about.gitlab.com/resources/ai-accountability-survey-2026/) found
the same concern in perception data: many respondents said the bottleneck had
moved from writing code to reviewing and validating it, even as they reported
faster individual work. That survey does not measure review quality, and it
does not prove that every generated pull request is difficult. It does describe
a recognizable failure mode: production accelerates, then evaluation becomes
the downstream queue.

The third scene is less respectable but more familiar. A developer prompts,
skims the answer, retries, and waits for the useful result to appear. Each prompt
is a lever pull; each stream of tokens is another spin. A strong answer rewards
one more pull. A weak answer invites one more retry. The person becomes a meat
proxy for the judgment the system does not supply.

That phrase is aimed at the work design, not the person caught inside it. The
slot-machine comparison is structural, not clinical. [Research on gambling and
reward uncertainty](https://pubmed.ncbi.nlm.nih.gov/31870708/) helps explain why
uncertain rewards can hold attention and encourage repetition. It does not make
prompting a gambling disorder. The relevant resemblance is narrower:
low-friction repetition, uncertain quality, occasional high-value output, and
no obvious stopping rule.

The fourth scene arrives at review time. Your PR reviewer will not understand
the pull request better than you didn't. If the author generated a large change
without building a causal model of it, the interpretation problem has merely
moved. The reviewer receives more code, less context, and the same obligation to
decide whether the change belongs in the system.

These scenes do not establish one universal law. They point to a bounded
organizational diagnosis: AI can lower the cost of candidate output without
lowering the cost of interpretation, integration, or adoption by the same
amount. Generation scaled. Understanding, evaluation, and absorption did not.

For experts, that mismatch can feel personal. Work that once signaled years of
practice can now be produced, at least in plausible form, by someone with a
prompt. But expertise has not disappeared. Its value is moving away from being
the sole source of artifacts and toward something harder to automate: building
models that other people can inspect, use, and revise.

Understanding, in this sense, is not a feeling of familiarity. It is a
provisional, shareable model of a situation. Three questions keep that model
honest:

- **Coherence:** Does it fit together, or does it hide consequential
  contradictions?
- **Correspondence:** Does it match the evidence and the world it claims to
  describe?
- **Consequence:** What happens when people act on it, and what should they
  revise afterward?

These tests do not tell us what ought to matter or who should hold authority.
They discipline the model. People and institutions remain accountable for the
purpose behind it.

This is also the important difference between inference and understanding. A
language model uses learned parameters and the available context to produce a
probable continuation. Understanding maintains a model that people can use to
explain, predict, act, and revise after contact with the world. More context,
retrieval, and tools can improve an answer; they do not remove the need to
interpret what the answer means.

> **Figure: Without understanding / excess output**  
> Use the existing `understanding-in-embedding-space` motif. The grounded lane
> shows a shared term guiding useful expansion; the ungrounded lane shows fluent
> volume missing the goal. The contrast is conceptual, not a measured token
> efficiency claim.

## 2. The Central Architect Becomes the Queue

Imagine an experienced architect working with three AI-assisted teams. Each
team can produce designs, code, and test results quickly. Each team also
discovers conditions the original plan did not anticipate.

The architect delegates implementation but keeps every important act of
interpretation. She frames each problem, decides what new evidence means,
approves every exception, and integrates every change. At first, this looks like
responsible control. As production accelerates, the teams begin waiting for her
to catch up.

The queue grows in both directions. Work waits to be approved, while local
discoveries wait to be absorbed into the larger model. The architect has three
bad options: examine everything and become the constraint, skim and
rubber-stamp decisions she no longer understands, or stop the teams often
enough that the supposed productivity gain evaporates.

This is a mechanism, not a universal measurement. Central expertise remains
useful, especially when a decision has broad, opaque, or irreversible effects.
The bottleneck appears when consequential local decisions must always travel
through one mind, regardless of who holds the relevant evidence.

Delegating execution is not enough. If one person must still interpret every
result and authorize every next step, the work moved but the learning loop did
not.

## 3. Distribute Complete Learning Loops

The answer is not to remove the architect and hope for alignment. It is to give
each team responsibility for a bounded outcome, enough context to choose an
approach, and an obligation to learn from what happens next.

A complete local loop looks like this:

> investigate → decide → act → evaluate → revise

The team owns the whole motion within its remit. It sees the quality of its
inputs, the assumptions made by partner teams, and the downstream effects of
its choices. It has enough authority to run a test and enough feedback to know
when the test failed. It also knows which decisions exceed its boundary and who
must join when they do.

That is a stricter form of autonomy than “move fast.” The team cannot throw a
change over the wall and call the task complete. It owns the consequence and
the revision.

An old battlefield account offers a useful, limited picture. In *The Gallic
War* II.20–26, Caesar describes the Roman response to the Nervii attack. The
terrain and urgency made complete central direction impossible, so experienced
soldiers and lieutenants acted without waiting for every command. Caesar's
account also describes active coordination when particular units came under
pressure.

This is an analogy, not an origin story for decentralized organizations. Caesar
was a self-interested narrator describing a military hierarchy, not a modern
software team. What the scene makes visible is narrower: responsible local
action depends on shared purpose, practiced judgment, and continued connection
to coordination.

Distributed judgment therefore needs boundaries. Before a team delegates work
to a person or an AI, it should be able to say what is settled, what remains
open, which constraints cannot be crossed silently, what evidence would justify
an exception, and who owns that exception.

An AI may challenge a boundary when new evidence conflicts with its rationale.
It may not quietly redefine the boundary while completing the task.

## 4. Design Philosophy Makes Local Decisions Compatible

Complete local loops solve one problem and create another. A decision can be
reasonable inside one team and still break an agreement that another team
depends on.

Return to the hypothetical onboarding product. Suppose the registration team
wants to change how the product handles delayed identity checks. It can revise
the wording, sequence, and local experiment within its own surface. It cannot
silently change the meaning of `verified`, because billing, support, security,
and other workflows may depend on that state.

The interface is more than an API shape. It includes the promise other teams
believe they are receiving: the meaning of each state, the expected failure
behavior, the signals available for monitoring, the owner of the decision, and
the condition that should trigger rollback or escalation.

A bounded exception makes those relationships explicit. The team states the
conflict, cites the evidence, proposes the narrowest change, names the affected
interfaces, and pauses for the accountable authority when the effect crosses
ownership. A disagreement becomes a testable wager rather than a private
reinterpretation.

Black boxes are useful when their relevant boundaries are understandable and
testable. We need to look inside as consequences, coupling, opacity, or
irreversibility increase. “Disagree and commit” is responsible only when the
commitment has a boundary, a way to detect failure, and a path back.

Shared design philosophy handles unfamiliar local situations. Explicit
interfaces protect neighboring assumptions. Feedback shows when either one is
wrong. Together, they let teams make consequential decisions without sending
every decision back to a universal approval gate.

> **Figure: Where understanding lives**  
> Use `central-queue-to-bounded-loops`. The upper lane shows the same three
> teams routing discoveries, decisions, and exceptions through one
> interpretation gate. The lower lane gives those teams bounded learning loops
> connected through shared intent and named interfaces. The teams do not
> change; the topology does.

Making the reasoning visible is what keeps this structure from becoming a set
of isolated local optimizations. A team should be able to show how it moved
through five kinds of work:

The evidence cannot come only from internal artifacts. Customers do not
experience a roadmap, architecture, or ticket queue. They experience a
situation. A metric can show that people abandon onboarding; direct contact can
surface the confusion, mistrust, interruption, or competing obligation hidden
inside that number.

1. **Gather evidence** from customers, support, telemetry, and system behavior.
2. **Frame the problem** by separating symptoms, causes, assumptions, stakes,
   and disagreement.
3. **Authorize a test** by naming the boundary, the learning goal, and the
   responsible decision-maker.
4. **Learn from consequences** by observing the people and systems affected.
5. **Retain the revised model** in records, interfaces, and practices that the
   next decision can reuse.

A compact coverage check asks whether the model includes five dimensions of the
situation: the human experience, the domain and its rules, the system and its
failure modes, the economic incentives and tradeoffs, and the epistemic quality
of the evidence. The list does not replace judgment. It helps a team notice
which part of reality its tidy explanation left out.

Once one person develops a useful model, the organization has to make that
model retrievable and revisable. Otherwise, “distributed understanding” is only
a collection of private insights.

## 5. Make Shared Models Compact—and Reopenable

No team can carry every detail of a system in working memory. We compress. We
name recurring patterns, draw boundaries around them, and use those names to
coordinate without reconstructing an entire explanation each time.

Take the word **idempotent**. In a software conversation, the term can compress
a long operational concern: if the same request is retried, applying the
operation again should not create an additional intended effect. A payment
operation that honors an idempotency key gives the term a concrete case. A
double charge gives it a counterexample. A retry test turns the concept into a
check rather than a slogan.

The term helps because a team does not need to repeat the whole explanation in
every design review. It becomes dangerous when two teams use the same word for
different guarantees.

This is why shared vocabulary must remain reopenable. A trustworthy term should
lead back to examples, assumptions, evidence, tests, counterexamples, and the
conditions under which its meaning needs revision. Compression saves time only
if the underlying model remains available when the stakes rise.

It also helps to keep three different kinds of unit separate. A morpheme is a
meaningful unit of language. A conceptual chunk is a pattern a person or team
uses to reason. A model token is a unit of encoded input or output. These can
interact, but they are not interchangeable explanations of how either a person
or a language model understands.

The practical habit is active ingestion. Do not merely save a summary. Identify
the claim, connect it to the model you already use, test that connection against
a case, and record what would break it. This is a proposed learning practice,
not a neurological theory.

> **Figure: A model that can be opened**  
> Begin with one shared concept node, then reveal its examples, assumptions,
> evidence, tests, counterexamples, and a revision edge. The figure should make
> the loss inside compression visible without claiming to depict a literal
> cognitive mechanism.

AI can help build these maps. It can cluster observations, compare explanations,
surface missing questions, and propose tests. It can also produce a coherent
summary before the team has earned correspondence or examined consequences.

A trustworthy synthesis exposes the model behind the prose. It cites its
evidence, states its assumptions, compares plausible explanations, marks its
limits, and names the next observation that would distinguish among the
alternatives. The test is not how finished the answer sounds. The test is
whether another person can examine, challenge, and update it.

## 6. Protect the Work That Develops Judgment

Reopenable models still demand attention. If a team spends the day generating,
triaging, and reviewing output, it cannot perform the investigation that keeps
its compressed knowledge honest.

Distributed authority therefore has a capacity cost. Teams need time to examine
difficult cases, test assumptions, talk to the people affected, mentor newer
members, and revise the models behind fast decisions. A team cannot own a
learning loop if its work design rewards only generation.

The research does not give us one universal ratio for deep work or one queue
limit that prevents burnout. It does support a more modest conclusion: workload
and cognitive effects depend on the task and the surrounding resources, while
autonomy and opportunities to learn matter. The organizational responses below
are prescriptions to test, not laws already proved:

- cap concurrent generated work so evaluation can catch up;
- pair compressed summaries with close examination of hard cases;
- give experts protected time for design, investigation, mentoring, and model
  revision;
- evaluate collaborators by the context, evidence, and judgment they add, not
  only the artifacts they produce; and
- retain reasons, counterexamples, and consequences so the next team starts
  from accumulated learning rather than another blank prompt.

This changes the role of expertise without making it smaller. The expert is no
longer valuable only because she can produce or approve every artifact. She
develops shareable models, improves the boundaries within which others act,
notices when evidence no longer fits, and helps teams learn from consequences.

The destination is not an organization with AI everywhere. It is an
organization in which more teams can exercise responsible judgment without
losing shared direction or hiding the relationships between their decisions.

> In an age of abundant answers, the scarce skill is building enough shared
> understanding to know what deserves to be solved—and whether an answer
> survives contact with the world.

Distributing decisions removes a central bottleneck. But what lets those
decisions remain trustworthy? [Truth and Coherence](/writing/truth-and-inference)
takes up the shared standards teams need to judge their inputs and outputs.

## Sources

- Terence Tao, [*Mathematics in the Age of
  AI*](https://arxiv.org/abs/2608.16753) (2026). Develops the distinction among
  proof generation, verification, explanation, and community absorption.
- Simons Foundation, [“Fields Medalist Terence Tao on Artificial Intelligence
  and Why We Do
  Math”](https://www.simonsfoundation.org/2026/08/13/fields-medalist-terence-tao-on-artificial-intelligence-and-why-we-do-math/)
  (2026). Provides the public context for Tao's ICM argument.
- OpenAI, [“An OpenAI Model Has Disproved a Central Conjecture in Discrete
  Geometry”](https://openai.com/index/model-disproves-discrete-geometry-conjecture/)
  (2026). Documents the unit-distance result and the continuing human role in
  choosing and interpreting the problem.
- [Leiden Declaration on Artificial Intelligence and
  Mathematics](https://leidendeclaration.ai/). States principles for
  correctness, understanding, attribution, transparency, and human direction.
- Jeremy Avigad, Leonardo de Moura, Soonho Kong, and Sebastian Ullrich, [*Theorem
  Proving in Lean
  4*](https://docs.lean-lang.org/theorem_proving_in_lean4/). Supports the
  distinction between kernel-checkable proof objects and the human task of
  choosing and interpreting a formalization.
- Karl E. Weick, Kathleen M. Sutcliffe, and David Obstfeld, [“Organizing and the
  Process of Sensemaking”](https://doi.org/10.1287/orsc.1050.0133) (2005).
  Examines how people turn circumstances into articulated situations that guide
  action.
- Amy C. Edmondson, [“Psychological Safety and Learning Behavior in Work
  Teams”](https://doi.org/10.2307/2666999) (1999). Connects psychological safety
  with learning behavior in the studied teams.
- ISO, [*ISO 9241-210:2019—Human-centred design for interactive
  systems*](https://www.iso.org/standard/77520.html). Grounds sustained attention
  to users, needs, and human-system consequences throughout design.
- Zixuan Feng, Sadia Afroz, and Anita Sarma, [*From Gains to Strains: Modeling
  Developer Burnout with GenAI Adoption*](https://arxiv.org/abs/2510.07435)
  (ICSE-SEIS 2026). Reports the association among GenAI adoption, job demands,
  job resources, and developer burnout in a mixed-methods study.
- Hao-Ping Lee et al., [“The Impact of Generative AI on Critical
  Thinking”](https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/)
  (CHI 2025). Examines how knowledge workers describe goal formation,
  verification, response integration, and stewardship in AI-assisted work.
- Charlotte Brandebusemeyer et al., [*Developers' Experience with Generative AI
  Beyond Productivity Assessment*](https://arxiv.org/abs/2607.02337) (2026
  preprint). Reports task- and interaction-dependent changes in perceived
  workload, cognitive load, and productivity.
- GitLab, [*2026 AI Accountability
  Report*](https://about.gitlab.com/resources/ai-accountability-survey-2026/).
  Reports perceptions from a Harris Poll survey of developers and technology
  buyers; it is not a direct measure of review quality.
- Martin Zack, Ross St. George, and Luke Clark, [“Dopaminergic Signaling of
  Uncertainty and the Aetiology of Gambling
  Addiction”](https://pubmed.ncbi.nlm.nih.gov/31870708/) (2020). Used only to
  bound the structural slot-machine analogy, not to diagnose AI use.
- Julius Caesar, [*The Gallic War*, Book II,
  20–26](https://classics.mit.edu/Caesar/gallic.2.2.html). A primary,
  self-interested account used as a limited analogy for trained local initiative
  and coordination.
