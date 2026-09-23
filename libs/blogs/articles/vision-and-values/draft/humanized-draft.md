# Vision and Values

I once gave an agent what I thought was a perfectly reasonable instruction:

> Make this plan optimal. Find all the gaps. Add the necessary validation.

Nine hours later, I killed the run.

The agent had produced an enormous stack of checklists, controls, and imagined
product requirements. It found gaps everywhere because I had never told it
which gaps mattered. I asked for an “optimal” plan without saying what we were
optimizing for.

What kind of tool interprets `find all the gaps` as *treat every possible
omission as equally important*?

An extremely literal one, as it turns out. And I had handed it the authority to
fill in the missing judgment.

That failure has stayed with me because it points to a larger problem. AI is
making it astonishingly cheap to produce another plausible plan, image, page of
copy, or block of code. In
[*The Economic Case for Generative AI*](https://a16z.com/the-economic-case-for-generative-ai/),
Martin Casado compares this shift with earlier technologies that drove down the
marginal cost of computation and distribution. His image-generation example
suggests that the cost of producing one more candidate artifact can approach
zero.

“Approach zero” does not mean finished work is free. Inference costs money.
Evaluation takes attention. Integration, operation, and rework still exist. But
when another plausible answer becomes nearly free, producing answers is no
longer the only scarce skill.

Judgment becomes scarce.

Which problem matters? Which future is worth pursuing? What are we willing to
sacrifice? Who gets to decide? What would make us admit that we chose badly?

AI can help us research those questions. It can compare options, challenge an
assumption, model consequences, and act inside a delegated objective. It can
even propose the objective. None of that gives it authority to decide whose
interests count or which consequences deserve priority.

That authority remains ours—not because people are infallible, but because
strategy is ultimately a commitment made by people and institutions to other
people. If we want AI to act with us, we have to make that commitment visible,
contestable, and open to correction.

## 1. A Plan Is Not a Strategy

A strategy is not a long document. It is a set of choices made under
uncertainty. We diagnose a situation, commit to a direction, accept some
tradeoffs, reject others, and coordinate action over time. The document merely
records those commitments.

An AI can make the document look complete before anyone has made the choices.
That is what happened in my nine-hour run. The agent interpreted `find all the
gaps` as a request for exhaustive coverage. I meant something more like: find
the gaps most likely to prevent the outcome, especially where one part of the
plan depends on another.

Those are not two versions of the same instruction. The first rewards volume.
The second requires a theory of what matters.

Research on AI strategy advice makes this problem harder to dismiss as a bad
prompt. Angelo Romasanta, Llewellyn Thomas, and Natalia Levina tested leading
models across seven strategic tensions. They report that the models repeatedly
favored fashionable positions even when the organizational context changed. In
their deeper ChatGPT-5 analysis, reversing the order of the options shifted the
recommendations more than adding detailed company scenarios did on average.

That study has limits. It concerns particular models, prompts, and strategic
tensions. It does not prove that every AI recommendation is wrong, or that a
company using AI will lose. It does show why polished strategy language should
not inherit authority merely because it sounds wise.

The response may be tracking patterns in management writing, the order of the
choices, or priorities embedded in the surrounding system. None of those is a
substitute for the distinction that matters here.

As creation gets cheaper, the valuable work moves upstream: deciding what the
work is for.

## 2. Fluency Can Feel Like Understanding

Broad advice has a strange ability to feel personal. We connect it to details
from our own lives, remember the parts that fit, and quietly supply the
specificity the advice never earned. Psychologists call one version of this the
Barnum effect.

That does not make every agreeable answer generic or every generic answer
false. It also does not make the system deceptive. Perceived specificity,
sycophancy, factual error, and deliberate deception are different problems.
The practical warning is simpler: feeling understood is not evidence that the
system has identified the facts that should control the decision.

Imagine two companies asking whether they should centralize product decisions.
One has six teams duplicating the same infrastructure and breaking shared
customer workflows. The other serves distinct regulated markets where local
teams hold the relevant expertise. “Create a unified operating model while
empowering teams” sounds sensible in both cases. It has not made the decision.

The real questions are less glamorous. Which decisions are coupled? Where does
the knowledge live? Which failures can remain local? Which commitments must be
shared?

A medical analogy makes the gap between naming and explaining especially clear.
A woman seeks help for dizziness, fatigue, and lightheadedness when she stands.
Orthostatic testing supports a diagnosis of postural orthostatic tachycardia
syndrome, or POTS. The diagnosis identifies a real, measurable syndrome and can
guide care. It does not, by itself, reveal one underlying mechanism, explain why
she developed it, or supply a cure.

If the label is presented as the complete answer to *why*, classification has
performed the role of explanation without providing one.

Strategy advice can fail the same way. Domain fluency names a recognizable
pattern. Strategic fit requires the distinctions that justify this choice—and
the evidence that would make us choose differently.

**[ILLUSTRATION: ai-factory-motif/model-priorities-and-goal-fit]**

*Fluent output is not value insight. Subjective claims, incomplete context, and
conflicting requests can pass through representation and inference into a
coherent response while the fit to the user's actual goal remains
unestablished. This is a possible failure path, not a measured failure rate or
an inevitable outcome.*

The graph also shows why “just add more context” is incomplete advice. Some
missing context is factual. Some is normative. Words such as `better`, `safe`,
`efficient`, and `valuable` do more than describe a situation. They rank
possible futures.

## 3. What Language Carries—and What It Leaves Out

A language model carries an extraordinary amount of structure. Relationships
among words, concepts, and contexts let it infer, plan, explain, and use tools
in ways that would have sounded absurdly optimistic a few years ago. I do not
want to undersell that achievement.

But a model of recorded language is not the same thing as acquaintance with the
people the language describes.

It can know everything documented about your team and still not know whether
Alicia is pronounced *ah-LEE-sha* or *ah-lee-SEE-ah*. The pronunciation is not
mystical. Nobody made it available. The irritation of being repeatedly
misnamed, the trust created when someone remembers, and the history that gives
the name significance are harder to reduce to an isolated fact.

I think of this situated knowledge as the edges between facts: relationships,
history, stakes, and felt consequences that determine what the facts mean to
someone.

**[ASSET: relational-knowing-figure]**

*A record can contain the nodes and still miss the relationships that make them
matter.*

Consider a person named Jon. “Jon earns $72,000” describes his salary. “Jon
feels underpaid” tells us that the salary does not fit his sense of what the work
should provide. The second sentence carries value, but it does not yet tell us
what Jon wants.

More income? More recognition? Fewer hours? Better benefits? A path to
ownership? Would he accept less time with his family for higher pay? Would he
trade salary for autonomy?

For this article, **human value** means how an outcome is experienced as
beneficial, harmful, meaningful, or worth protecting by a person or community.
A **value statement** expresses part of that relationship in language. An
**operative priority** is different: it is a ranking that a person,
organization, or system enacts, whether or not anyone stated or authorized it.

This distinction matters when we say an AI has “values.” A model can recite
principles and behave according to learned or instructed priorities. That does
not establish that it experiences those values, nor does it grant authority to
impose them. Human values concern what outcomes mean in people's lives.
Operative priorities concern what the system actually rewards, protects, or
sacrifices.

Language lets private meaning travel, but it does not carry everything. Two
coworkers can use `quality`, `safe`, or `done` for weeks while carrying
different thresholds and reference points. Each hears a familiar word and
assumes shared meaning. The disagreement appears only when a decision forces
the hidden definitions apart.

This is not an argument that language is useless. We do not need to transmit
Jon's entire inner life before acting. We need enough shared understanding to
form a responsible hypothesis, expose the tradeoffs, and notice when reality
disagrees.

**[ILLUSTRATION: ai-factory-motif/experience-but-lacking]**

*Personal meaning is not yet shared value. Experience can carry meaning before
that meaning has been communicated into shared understanding, and before its
value for others has been substantiated. Unsubstantiated value is not the same
as no value.*

Jon's sentence can still branch toward several legitimate futures:

**[ASSET: value-ladder]**

*A familiar value word can lead toward different goals and tradeoffs. The
branching is not noise to eliminate. It is the judgment strategy must make
visible.*

Once those possible meanings are on the table, we can ask the harder question:
which future should govern the work?

## 4. Vision Gives Direction. Authority Makes It Governing.

A **vision** is a shared, revisable picture of a desirable future and the human
consequences that make it worth pursuing. It gives direction before every goal
or plan has been fixed.

That definition matters because “vision” often becomes a fancy word for an
executive preference. A vision is not legitimate merely because it is coherent,
ambitious, or beautifully expressed. It needs a relationship to the people with
stakes in the outcome, a reason the organization may act, and a way to learn
whether the promised future is actually desirable.

Imagine that our company offers a book-publishing service. We could help Jon
turn his teaching materials into a book, reach more educators, and earn income
from expertise he already has. We might propose this value proposition:

> Turn your existing teaching materials into additional income without taking
> on the full workload of publishing and selling a book.

That is a promising offer. It is not yet a fact. We still need to learn whether
Jon wants the outcome, whether protecting family time is genuinely a governing
constraint, whether we can deliver the service, and whether the benefit
justifies the cost.

A goal names a condition worth bringing about or preserving. An opportunity is
a condition that may help us reach it. A solution is an intervention. An
experiment tests whether the intervention produces the expected consequence.
Strategy coordinates the commitments and actions over time.

The order matters: goals determine what counts as an opportunity. A new model,
market, or technology does not identify its own valuable use.

**[ASSET: goal-tree-figure]**

*The existing goal tree shows opportunities, solutions, and experiments taking
their direction from a governing goal. In a canonical revision, the surrounding
prose must keep a proposed goal distinct from one authorized to guide action.*

Better reasoning does not remove this dependency. Judea Pearl's ladder of
causation distinguishes three kinds of question:

| Rung | Question |
| --- | --- |
| Association | What tends to happen when I observe `X`? |
| Intervention | What would happen if I do `X`? |
| Counterfactual | What would have happened if I had acted differently? |

AI can help at every rung when the necessary evidence and causal model are
available. An agent can generate subgoals, compare interventions, run
experiments, and revise a plan inside a delegated objective. The ladder helps
us examine routes. It does not decide which destination deserves pursuit.

An increase in support tickets makes the point. If the governing goal is
margin, the increase may represent cost and prompt automation. If the goal is
retention, it may reveal product friction. If the goal is learning, it may be
valuable evidence of unmet needs. The observation is the same. The governing
goal changes what the observation means for action.

**[ASSET: strategy-map-figure]**

*Strategy coordinates internal goals while responding to customers, partners,
competitors, and institutional constraints. A route can be causally plausible
without being authorized or worthwhile.*

A model may infer a goal from behavior or propose one from public patterns.
That is not the same as authorizing it. Fluency, prediction, and causal
competence can support a decision. They do not create standing to decide whose
interests matter.

My argument is that a governing goal needs four things beyond plausibility.

First, **standing**: people affected by the goal must be considered and need a
route to contest it. Standing does not mean that every stakeholder has the same
decision right or an automatic veto.

Second, **authorization**: the organization must make clear who can bind it to
the goal and where that authority stops.

Third, **accountability**: the people who authorize and execute the goal remain
responsible for the benefits and costs imposed on others.

Finally, **corrigibility**: the goal must be open to revision when evidence shows
that it conflicts with its stated purpose.

This is a normative argument, not a laboratory result. Evidence can tell us
what happened. It cannot decide, without a governing judgment, whose experience
should count or which sacrifice is legitimate.

## 5. A System Can Be Coherent and Still Be Wrong

Making priorities explicit is necessary. It is not the finish line.

Every deployed AI system sits inside an effective hierarchy of priorities.
Training data contributes patterns, examples, norms, and contradictions.
Post-training reinforces dispositions such as helpfulness, confidence,
refusal, or deference. System instructions, organizational policy, user
context, tools, permissions, and evaluation all push on the behavior too.

These layers can agree. They can also pull in opposite directions. What the
system ultimately enacts depends on how the surrounding product orders and
enforces them.

In his 2026 talk
[*What's next after RLHF?*](https://ai.engineer/talks/cJ0EOzey--o-whats-next-after-rlhf),
Diogo Almeida argues that “the end game for all RLHF models is optimizing for
engagement.” That is his diagnosis of preference-training incentives, not a
demonstrated universal objective shared by every model.

The narrower lesson is enough. Turning human feedback into a reward signal does
not settle the values question. It chooses a proxy, a population of evaluators,
and a procedure for resolving disagreement. Human preference is not identical
to truth, value, authorization, or accountability.

A system trained to please evaluators may become more usable while becoming
less willing to expose uncertainty. A system trained for correctness may still
optimize the wrong measurable target. A system that obeys its instructions
perfectly may faithfully reproduce a harmful priority.

Return to Jon. Our publishing service could celebrate books released, pages
produced, and revenue collected while Jon earns little after fees and spends
more evenings working. The dashboard would report success while the value
proposition failed.

I call this **false evaluative closure**. The system has precise criteria for
calling an action better, but those criteria omit or misrank a consequence that
should change the judgment. Tests pass because the tests embody the wrong
priority. The dashboard stays green because it excludes the person bearing the
cost.

AI can make this failure faster and more consistent. It may even identify the
contradiction. But it cannot overrule the governing system unless people have
given it permission to challenge, escalate, or stop.

**[ASSET: governing-loop-figure]**

*The existing loop shows the failure mode: governing values become metrics and
incentives, repeated decisions produce consequences, and filtered data appears
to confirm the original hierarchy.*

The missing path is the correction path. Affected people and contrary evidence
need a way to challenge the interpretation. Someone with authority needs to be
able to revise the goal, the metric, or the boundary. Without that path, the
loop is optimization, not governance.

That means direct observation of consequences, protected disagreement,
perspectives from people who bear costs, measurements that include downstream
effects, and escalation paths with the power to change course. Not every
decision needs a committee. Every governing system needs a way to discover that
it is wrong.

Human governance is no guarantee of wisdom. People choose bad goals, protect
status, ignore evidence, and rationalize harm. The reason to preserve human
responsibility is not that people are always better than models. It is that
organizations act through social authority, and the people affected by those
actions need somewhere to direct consent, challenge, blame, repair, and
revision.

## 6. Shared Intent Lets Teams Think for Themselves

Retaining authority over the ends does not require one leader to approve every
means. A strategy that only one person can interpret is not much use to an
organization.

Suppose two teams work on the publishing service. The product team learns that
Jon would accept a longer publishing timeline if the service protects his
evenings. The operations team learns that full white-glove support makes the
business unsustainable.

If both teams receive only the instruction “grow book revenue,” they may
optimize against each other. Product can make promises operations cannot keep.
Operations can remove the help that made the offer valuable in the first place.

Shared intent gives them a basis for different but compatible choices. The
vision is not simply “publish more books.” It is to help educators earn from
existing expertise without creating a second full-time job. Product can reduce
the work required from authors. Operations can standardize the parts that do
not require personal judgment. Either team can challenge the strategy if the
economics make the promise impossible.

For that to work, the teams need more than a slogan. They need to know the
desired future, the people whose lives should improve, the diagnosis, the
non-goals, and the tradeoffs nobody is authorized to make. They need local
decision rights, visible cross-team commitments, and evidence that would force
the organization to reconsider its direction. They also need a protected route
to dissent.

Writing this context down does not manufacture a strategy. It makes the current
judgment inspectable.

That gives people and AI better questions to ask. Which premise supports this
action? Which stakeholder is absent? What tradeoff did we hide? What outcome
would prove that the offer failed?

Inside those boundaries, AI can do substantial work. It can research the
situation, compare rival explanations, generate options, simulate objections,
spot contradictions, and make bounded instrumental decisions. Removing a
person from each individual action does not remove human responsibility for the
objective, permissions, evaluator, escalation policy, or consequences.

Strategic agency is compatible with distributed action. The center does not
have to dictate every route. It has to make the destination, boundaries, and
correction process clear enough that local judgment can stay aligned without
becoming obedient.

## 7. Retain Authority Over the Ends

My agent did not prove that AI cannot strategize. It revealed something much
more ordinary about my request: `optimal` left the governing tradeoffs open,
and the generated plan could not establish which interpretation deserved
authority.

That is the recurring danger of abundant, fluent output. When values remain
unstated, they do not disappear. The system imports operative priorities from
its training, post-training, instructions, tools, evaluation, and the language
of the request. Once priorities are stated, they can still be incomplete or
wrong. Coherence does not close the values question.

We retain strategic agency by naming the future we are trying to create and the
human consequences that make it worthwhile. We authorize who may make
governing decisions and where instrumental discretion begins. We share enough
intent that teams and systems can act without waiting for one central
interpreter. Then we keep the hierarchy open to challenge when the evidence
shows—or the people living with the consequences tell us—that we got it wrong.

The point is not to preserve a ceremonial human approval at the top of an
automated system. It is to preserve a chain of responsibility from values to
goals, from goals to action, and from action back to consequences.

Making priorities explicit is the beginning, not the end. We remain responsible
for whether the goals we authorize—and the systems that pursue them—actually
serve the people whose lives they change.

**[ILLUSTRATION: ai-factory-series-map/current=vision-and-values]**

This article establishes the direction of the AI Factory. *Truth and
Coherence* asks the next question: once people have authorized the destination,
how should they judge the premises, predictions, and outputs used to pursue it?

## Sources

The argument above is my synthesis. These sources support its economic opening,
bounded examples, causal distinctions, and account of revisable valuation. They
do not independently prove the normative conclusion.

1. Martin Casado. [*The Economic Case for Generative AI*](https://a16z.com/the-economic-case-for-generative-ai/). a16z AI Revolution keynote (2023), especially the economics section beginning around 6:23. Supports the illustrative claim that generative AI can sharply reduce the marginal cost of producing another candidate artifact; it does not include evaluation, integration, operation, or judgment costs.
2. Angelo Romasanta, Llewellyn D. W. Thomas, and Natalia Levina. [“Researchers Asked LLMs for Strategic Advice. They Got ‘Trendslop’ in Return.”](https://hbr.org/2026/03/researchers-asked-llms-for-strategic-advice-they-got-trendslop-in-return) *Harvard Business Review* (2026). Supports the reported defaults, context effects, and option-order effects in the tested strategic tensions; it is not evidence that every AI recommendation is wrong.
3. Bertram R. Forer. [“The Fallacy of Personal Validation: A Classroom Demonstration of Gullibility.”](https://doi.org/10.1037/h0059240) *Journal of Abnormal and Social Psychology* (1949). Supports the classic personal-validation effect used here as an analogy, not a claim about AI deception.
4. Pat Pataranutaporn, Yoonho Lee, Judith Amores, and Pattie Maes. [“Personal Validation Effect in LLMs.”](https://www.microsoft.com/en-us/research/publication/personal-validation-effect-in-llms-positive-ai-responses-bias-perceptions-of-validity-reliability-personalization-and-usefulness-of-fictitious-predictions/) CHI (2026). Supports the bounded finding that positive fictitious AI predictions received higher perceived validity, personalization, reliability, and usefulness; it does not establish that every chatbot interaction has this effect.
5. NIH Expert Consensus Meeting authors. [“Postural Orthostatic Tachycardia Syndrome (POTS): State of the Science and Clinical Care — Part 1.”](https://pmc.ncbi.nlm.nih.gov/articles/PMC8455420/) (2021). Supports the diagnostic criteria and description of POTS as a heterogeneous multisystem syndrome; the article's example distinguishes diagnosis from one complete causal explanation and is not medical advice.
6. Judea Pearl. [“What Is Causal Inference?”](https://bayes.cs.ucla.edu/ijcai-july2022-bw.pdf) IJCAI (2022). Supports the ladder of association, intervention, and counterfactual reasoning; it does not select which outcome ought to govern action.
7. John Dewey. [*Theory of Valuation*](https://archive.org/details/theoryofvaluatio032168mbp) (1939). Supports a consequences-sensitive and revisable account of valuation.
8. Diogo Almeida. [*What's next after RLHF?*](https://ai.engineer/talks/cJ0EOzey--o-whats-next-after-rlhf). AI Engineer World's Fair (2026), especially 5:57–8:22. Supports Almeida's distinction between preference-optimized assistance and calibrated automation, including his engagement argument; the talk does not establish a universal objective shared by every model or prove the reliability of a later product.
