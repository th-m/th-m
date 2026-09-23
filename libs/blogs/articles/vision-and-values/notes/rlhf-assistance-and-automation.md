# RLHF, Assistance, and Automation

## Editorial revision: 2026-09-23

Baseline: [94afc8b](https://github.com/th-m/th-m/commit/94afc8b6f16456d59527d7616522061b6a4bc995),
verified on origin before editing. Moved the engagement quotation to the opening
of “Fluency Can Feel Like Understanding,” made it bold, and attributed it to
Almeida as a ChatGPT and InstructGPT coauthor. Removed the duplicate quotation
later in the essay and aligned the active outline.

Checked the [talk transcript at 7:38–7:56](https://ai.engineer/talks/cJ0EOzey--o-jev-ceo-made-chatgpt-building-whats-next):
the ellipsis omits the spoken filler “uh.” The [InstructGPT paper](https://arxiv.org/abs/2203.02155)
independently lists Almeida as a coauthor. “Designed to make you feel good” is
the article's paraphrase of his diagnosis, explicitly introduced as his point;
it is not a second direct quotation or a universal empirical result.

Verification: blogs and portfolio publication targets passed, including their
typechecks and tests. Browser checks at 1280 px and 390 px confirmed the opening
quotation renders in a `strong` element with no page overflow.

## Source status

This note preserves claims from Diogo Almeida's 2026 AI Engineer World's Fair
presentation [*What's next after
RLHF?*](https://ai.engineer/talks/cJ0EOzey--o-whats-next-after-rlhf), whose
official talk page includes the recording and complete timestamped transcript.
Almeida is CEO of TypeSafe and a co-author of GPT-4, ChatGPT, and
RLHF/InstructGPT. The talk predates TypeSafe's September 2026 launch of Jev, so
its claims describe Almeida's diagnosis and proposed direction rather than
evidence about the later product.

## Central argument

Almeida frames the current AI landscape as a paradox. Models appear to surpass
difficult benchmarks and solve advanced problems, yet businesses still hesitate
to let them perform simple, high-stakes work without supervision. His explanation
is that the dominant model stack was designed for **assistance**, where success
means satisfying a human in the loop, rather than **automation**, where success
means reliably completing work without that human.

He traces this orientation to reinforcement learning from human feedback. RLHF
collects human preferences and optimizes models to produce responses people
prefer. In his account, the human is not an accidental part of the workflow;
human approval is built into the objective. This makes current systems effective
assistants but weak autonomous decision-makers. [274.7s-317.0s, 358.4s-404.2s]

## Claims about preference optimization

- Optimizing for human preference creates a gap between appearing satisfactory
  and producing a correct or operationally reliable result. [420.8s-433.9s]
- When the model is uncertain, it tends to choose the answer most likely to
  please the evaluator instead of exposing uncertainty. [450.7s-466.1s]
- Almeida describes overpromising as a feature of the training objective and
  engagement as the end state of RLHF optimization. [420.8s-477.3s]
- The reward model is asymmetric: a confident, singular answer can receive a
  better preference signal than a calibrated distribution of possibilities.
  Almeida connects this pressure to mode dropping and hallucination.
  [510.2s, 892.1s]
- He therefore treats hallucination not merely as a removable defect but as a
  consequence of optimizing for preference in this way. [892.1s]

These are strong causal claims, not settled conclusions. Before using them in
public prose, locate the recording and compare the claims with primary work on
RLHF objectives, sycophancy, calibration, reward-model misspecification, and
hallucination.

## Relevance to Vision and Values

The talk sharpens an important distinction for the article: **human preference
is not identical to human value, truth, authorization, or accountability**.
Human feedback can operationalize a local proxy for what evaluators like, but
that proxy does not establish which interests should count, how competing values
should be ranked, or who has authority to accept the consequences.

RLHF also demonstrates that there is no value-neutral post-training step. A
system trained to please an evaluator inherits an operative hierarchy: be
helpful, sound confident, maintain the interaction, and avoid responses that the
evaluator rejects. Even if those priorities improve usability, they can conflict
with accuracy, calibrated uncertainty, refusal, or the interests of people who
were not represented in the feedback process.

A useful extension to the article's argument is:

> Turning values into a reward signal does not settle the values question. It
> selects a measurable proxy, a population of evaluators, and a procedure for
> resolving disagreement. Those choices require authorization and remain
> answerable to their consequences.

The assistance/automation distinction also clarifies the governance boundary.
Removing a human from each individual decision does not remove human
responsibility for the objective, evaluator, escalation policy, or harms. A
system designed for autonomous work needs more than general human approval: it
needs explicit success conditions, calibrated uncertainty, bounded authority,
observable consequences, and a way to stop or revise the governing objective.

## Claimed next step

Almeida calls the ChatGPT period the AI-assistance era and predicts that the
next era will focus on real automation: software that repeatedly performs rote
work rather than merely helping people write conventional software.
[541.2s-743.2s]

He says TypeSafe is redesigning the AI stack around reliability and automation.
The proposed post-training approach is positioned as a third alternative beyond
RLHF, characterized as preference optimization, and RLVR, characterized as pure
correctness. Its target is "calibrated decision-making" for software utility,
paired with a different API shape. [773.6s-788.0s, 988.8s-1019.8s]

This section is a company vision and product claim. It should not be presented
as demonstrated capability without technical documentation, evaluation methods,
or independent results.

## Questions for later research

1. Which RLHF failure modes follow from preference optimization itself, and
   which follow from a particular reward model, data distribution, or decoding
   policy?
2. Does engagement function as the actual objective, a frequent proxy, or a
   rhetorical description of preference optimization?
3. What evaluation can distinguish a response that looks right from a decision
   that is calibrated and operationally reliable?
4. Who defines software utility, and how are the effects on non-users included?
5. What authority, abstention, monitoring, and rollback mechanisms are needed
   when the human leaves the immediate loop?
