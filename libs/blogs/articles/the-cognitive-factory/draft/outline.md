# Cognitive Factory

## Role in the Series

**Question:** How does the factory sense, decide, act, and learn without turning
automation into ungoverned autonomy?

**Thesis:** A cognitive factory is a closed control loop. It converts typed
signals into hypotheses, bounded decisions, inspectable agent work, evaluated
outcomes, and retained learning. Automation becomes trustworthy when every
transition has evidence, authority, and a path to revision.

## Audience

Teams connecting product analytics, operational telemetry, issue systems, and
agents into automated or semi-automated workflows.

## Outline

### 1. Cognition Is a Process, Not a Chat Window

Use one loop for the whole article:

> signal → trigger → hypothesis → decision → agent DAG → action → evaluation → memory

The system is cognitive only if consequences can change what it does next. A
one-way generation pipeline is automation without learning.

### 2. Signals Become Typed Events

Sensors may include PostHog behavior, Sentry errors, CloudWatch metrics, support
conversations, repository changes, and Linear work state.

Raw events are not decisions. Normalize them into typed observations with:

- source, time, and provenance;
- affected entity and bounded context;
- severity, confidence, and corroborating signals;
- owner and permitted next actions; and
- expiry or conditions for re-evaluation.

### 3. A Trigger Opens a Hypothesis

A threshold or pattern should create an investigable claim, not declare a
diagnosis. The factory asks what else would have to be true and which evidence
would discriminate among explanations.

This prevents a PostHog drop, error spike, or backlog change from directly
authorizing a code change.

### 4. Decisions Must Be Bounded and Typed

Use Jev as the example of a decision primitive: return an explicit choice and
scores within a bounded set, then let software-controlled policy decide whether
to proceed, request review, or abstain.

Keep the distinction between model judgment and system authority. The model can
rank or classify; permissions, thresholds, escalation, and side effects remain
owned by the surrounding system.

### 5. Agent DAGs Make Execution Inspectable

Represent work as a directed acyclic graph of scoped tasks rather than one
unbounded agent run.

Each node should name:

- inputs and expected outputs;
- tools and permissions;
- acceptance checks;
- dependencies and integration owner;
- retry, rollback, and stop conditions; and
- evidence retained for the final decision.

The DAG exposes where judgment enters and prevents parallel work from hiding an
unowned integration step.

### 6. The PostHog-to-Linear Learning Loop

Use one end-to-end case rather than a catalog:

1. PostHog detects a meaningful change in a customer journey.
2. The event opens a hypothesis with supporting and contradicting evidence.
3. A bounded decision determines whether to investigate, experiment, or abstain.
4. Linear records owned work and its relation to the hypothesis.
5. An agent DAG researches, implements, tests, and prepares the change.
6. Product and operational signals evaluate the release.
7. The result updates the hypothesis, ontology, evaluation, or procedure.

“Self-driving” should mean this governed loop, not unattended code deployment.

### 7. Compound Learning, Not Just Activity

The factory should remember why a trigger mattered, what decision was made,
which evidence supported it, what changed, and whether the expected consequence
occurred.

Measure improvement in capability, learning speed, customer outcomes, and
reduced rework—not ticket count, agent activity, or output tokens alone.

Humans retain responsibility for goals, authority boundaries, contested
tradeoffs, and exceptions whose consequences exceed the automation's mandate.

## Keep from the Existing Material

- Operational perception and control.
- “A trigger should open a hypothesis, not declare a diagnosis.”
- Jev as a typed, bounded decision primitive.
- Agent DAGs and explicit control points.
- PostHog, Linear, and runtime telemetry as one closed example.
- The compounding loop and cognitive light-cone idea, compressed into the final
  evaluation and governance section.

Retire the old strategy outline. Vision and strategic authority belong in
*Vision and Values*; this article owns the mechanics of sensing, deciding,
executing, and learning.

## Research Obligations

- Verify Jev's current documented interface and avoid implying unproven
  reliability.
- Cite PostHog and Linear capabilities from their documentation; label the
  end-to-end self-driving loop as a proposed architecture unless implemented.
- Distinguish DAG orchestration from model reasoning and from organizational
  decision rights.

## Series Close

Vision chooses the direction. Truth checks the claims. Understanding sets the
boundary for action. The knowledge factory optimizes the work. Ontology supplies
the map. The cognitive factory closes the loop.
