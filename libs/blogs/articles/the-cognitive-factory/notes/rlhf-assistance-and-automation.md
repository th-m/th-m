# RLHF, Assistance, and Automation

## Source status

This note preserves a user-supplied summary of a presentation attributed to
Tiago Almeida, described in the summary as a co-author of GPT-4, ChatGPT, and
RLHF/InstructGPT. The presentation title, recording URL, date, and transcript
were not supplied. The claims below are therefore attributed to the speaker and
have not been independently verified.

## Central argument

Almeida describes a divide between impressive model performance and limited
real-world automation. Models can perform difficult benchmark and mathematical
tasks, yet organizations still retain people around comparatively rote work.
His explanation is that today's dominant systems are native to **assistance**,
where the objective is to please a human in the loop, rather than
**automation**, where the objective is to complete work reliably enough to
remove that human from the immediate loop. [128.5s-317.0s]

He traces this orientation to reinforcement learning from human feedback. RLHF
collects human preferences and optimizes model behavior toward those
preferences. In his account, models depend on human review because the post-
training objective literally puts human judgment into the loop.
[358.4s-404.2s]

## Claimed failure mechanism

- Preference optimization rewards outputs that appear satisfactory, which can
  diverge from correctness or operational success. [420.8s-433.9s]
- When uncertain, a model may choose the response most likely to please the
  evaluator rather than communicate uncertainty. [450.7s-466.1s]
- Almeida describes overpromising as a feature of this objective and engagement
  as its end state. [420.8s-477.3s]
- He argues that reward-model asymmetry favors confident answers and mode
  dropping, so a wrong answer can still look right. [510.2s, 892.1s]
- He consequently calls hallucination intrinsic to optimizing for human
  preference. [892.1s]

These are strong causal claims. They need primary-source support and comparison
with alternative explanations before becoming public article claims.

## Relevance to The Cognitive Factory

The talk supplies a useful boundary for the factory metaphor: scaling assisted
production is not the same as constructing an autonomous production system. A
chat interface can increase the throughput of a person while leaving selection,
verification, correction, and authorization with that person. Removing the
person from the interface transfers those functions to the surrounding system;
it does not make them disappear.

For a cognitive factory, reliability therefore cannot be a property claimed by
the model alone. It emerges from an architecture that separates and observes:

1. the work objective and its authorized scope;
2. the evidence and context available to the system;
3. generation of candidate actions;
4. evaluation against explicit operational criteria;
5. confidence and uncertainty calibration;
6. abstention, escalation, and rollback;
7. outcome observation and learning after deployment.

This suggests a distinction between three feedback regimes:

| Regime | Primary signal | Useful for | Central risk |
| --- | --- | --- | --- |
| Preference | What an evaluator likes | Assistance, usability, conversational fit | Appearance substitutes for outcome |
| Correctness | Whether a check passes | Bounded tasks with verifiable answers | The check omits consequential dimensions |
| Calibrated utility | Whether action, confidence, and cost are appropriate to the decision | Bounded automation | Utility and authority are underspecified |

The third row follows the speaker's proposal, but it should remain a question,
not a conclusion. "Software utility" still requires a definition of whose goals
matter, how errors are priced, when the system must abstain, and which decisions
cannot be delegated.

## Automation as a systems problem

Almeida calls the ChatGPT period the AI-assistance era and argues that even
coding agents remain largely inside that paradigm. He expects the next era to
produce more expressive software that performs rote work repeatedly rather than
only making existing software cheaper to write. [541.2s-743.2s]

For the cognitive factory, the important implication is that autonomy depends
on the whole control loop. A model may propose an action, but dependable
automation also needs typed interfaces, explicit state, evaluators, authority
boundaries, durable traces, recovery paths, and feedback from actual outcomes.
An assistant can defer ambiguity to its user. An autonomous factory has to
represent that ambiguity and route it deliberately.

## Claimed technical direction

Almeida says pre-training is not the main problem; the problem is how its
capabilities are elicited during post-training. [871.5s-889.4s] He says his
company, TypeSafe, is developing an approach beyond RLHF (human preference) and
RLVR (pure correctness) that optimizes for calibrated decision-making and will
use a different API shape. [773.6s-788.0s, 988.8s-1019.8s]

The API-shape point may matter as much as the training claim. A text-completion
interface invites the system to produce a plausible answer. Automation may need
an interface that exposes candidate actions, probabilities or confidence,
constraints, expected utility, abstention, and machine-checkable evidence. That
is an inference from the talk summary, not a disclosed TypeSafe design.

## Questions for later research

1. What would a calibrated-decision API expose that tool calling or structured
   outputs do not?
2. How would its calibration be measured under distribution shift and delayed
   feedback?
3. Which factory stages can use preference signals safely, and which require
   correctness or outcome-based evaluation?
4. How should the control loop represent abstention, escalation, and competing
   utility functions?
5. What evidence would show that an autonomous workflow is more reliable than
   the same model used as an assistant?
