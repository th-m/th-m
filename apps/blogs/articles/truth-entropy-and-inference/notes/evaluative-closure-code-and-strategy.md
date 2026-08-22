# Evaluative Closure: Code Optimization and Strategy

## Central Distinction

The difference is not simply that the code is in context. The deeper difference
is **evaluative closure**:

> A coding task often gives the system enough evidence, constraints, feedback,
> and authority to determine whether its change is better. A strategy task
> often asks the system to define “better” while simultaneously guessing the
> world, the values, and the acceptable tradeoffs.

## Code Optimization

“Optimize this code” can often be translated into something close to:

```text
Minimize:
- latency
- memory use
- complexity

Subject to:
- tests continue to pass
- types remain valid
- API behavior remains unchanged
- benchmark improves
```

The agent can close the loop:

```text
inspect → change → compile → test → benchmark → compare → revise
```

The repository contains much of the relevant state. The compiler, tests, and
benchmarks turn important values into executable constraints. Feedback is
immediate, failure is often reversible, and the agent usually has authority to
change only a bounded artifact.

The LLM does not have to decide whether speed is more important than customer
trust. Someone has already converted the governing values into a local
objective and acceptance tests.

## Strategy Optimization

“Optimize my strategy” is closer to:

```text
Maximize:
- revenue?
- profit?
- growth?
- survival?
- customer welfare?
- employee retention?
- strategic optionality?
- market power?

Over:
- what time horizon?

Subject to:
- which ethical constraints?
- which financial risks?
- which stakeholder commitments?
- which irreversible consequences?
```

The objective function is not merely missing from the prompt. It may be
**contested, hierarchical, and still being discovered**.

Even if every internal document is in context, the system may still lack:

- tacit knowledge held by employees;
- customer experiences not captured in research;
- political relationships and personal commitments;
- disagreement among stakeholders;
- competitor responses;
- changing market conditions;
- long-term or irreversible consequences; and
- authority to decide which interests should prevail.

The feedback loop is also open. A strategy may take months or years to
evaluate, and the result is confounded by competitors, markets, execution
quality, and chance.

## The Hierarchy of Gaps

| Gap | Code optimization | Strategy optimization |
| --- | --- | --- |
| **Representation** | Relevant code is often available | Decisive facts may be tacit, private, or changing |
| **Specification** | Tests and contracts define success | “Success” may remain ambiguous |
| **Valuation** | Priorities are encoded in benchmarks and constraints | Values conflict and require weighting |
| **Causality** | The program can be executed | Real-world consequences must be predicted |
| **Feedback** | Results arrive in seconds or minutes | Results may take months or years |
| **Agency** | Code does not react strategically | Customers and competitors change behavior |
| **Reversibility** | Changes can often be reverted | Strategic choices can create path dependence |
| **Authority** | Agent is delegated a bounded implementation decision | The decision may affect people who never delegated authority |
| **Accountability** | Failures are detectable and attributable | Consequences are distributed across stakeholders |

An implicit hierarchy of values is a major part of the gap, but it is not the
entire gap. Strategy also lacks evaluative feedback, complete evidence, a
stable causal environment, and unambiguous authority.

## The Important Distinction

In code optimization:

> The value hierarchy has already been partially translated into executable
> constraints.

In strategy optimization:

> Discovering, negotiating, and revising the value hierarchy is part of the
> task itself.

That is why an LLM can often implement a code optimization without
independently valuing the result. The tests and benchmarks value it on the
system's behalf.

## Where Subjectivity Enters

Qualia is not necessarily the first missing function. The immediate missing
functions are usually:

```text
specification + evidence + feedback + authority
```

Subjective experience matters when it contains evidence or stakes that have
not been operationalized:

- “This workflow technically works, but it makes customers feel powerless.”
- “This policy improves efficiency, but employees experience it as
  surveillance.”
- “Customers say they want more features, but observation shows that
  complexity is driving them away.”

An LLM can reason about these statements once they are supplied. It cannot
directly observe the unrecorded experience behind them.

## This Is a Spectrum

Code work becomes strategy-like when someone asks:

- Should we rewrite the platform?
- Should we prioritize speed over maintainability?
- Should we collect this customer data?
- Which technical debt deserves attention?
- Should this capability exist at all?

Strategy becomes more tractable for AI when humans supply:

- explicit objectives and their priority;
- relevant evidence and competing interpretations;
- constraints and non-negotiable commitments;
- scenario models;
- measurable leading indicators;
- feedback channels;
- stopping and escalation rules; and
- named decision-makers who retain accountability.

## Article-Ready Formulation

> The difference between code optimization and strategy optimization is not
> simply that the code fits inside the context window. Code often arrives with
> evaluative closure: executable constraints, rapid feedback, reversible
> changes, and a delegated objective. Strategy frequently lacks that closure.
> The relevant evidence is incomplete, the environment reacts, consequences
> arrive late, and the hierarchy of values is part of what must be decided.
> When those elements are missing, the model cannot optimize the particular
> strategy; it can only generate a plausible strategy under inferred or
> culturally common assumptions.
