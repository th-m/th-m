---
title: Cognitive Factory
description: "The factory's cognition is not a model subscription. It is relational context, executable contracts, and a compounding loop that turns outcomes into capability."
publishedAt: 2026-08-22
tags: [Artificial Intelligence, Knowledge Work, Software Systems]
---
# Cognitive Factory

## Overview

Every company is building a factory, and *The Knowledge Factory* described its
operating system: an organization that turns evidence and intent into reusable
capability. This essay examines how that factory thinks.

Cognition is not a model subscription or a collection of agents. It is how the
organization represents context, checks it against action, and learns from
outcomes. Concretely, the factory's cognition has four parts:

- **Graph context exploration** asks relational questions — which evidence
  motivated this capability, which decisions depend on this assumption —
  instead of treating context as documents containing matching words.
- **Executable context** turns institutional knowledge into contracts: a
  definition becomes a schema, a customer promise becomes an evaluation, an
  observed failure becomes a regression case.
- **The compounding loop** returns every outcome to the system as evidence that
  updates context and evaluation, so capability grows through use.
- **A diagnostic build order** says what to build first: expose evidence, name
  distinctions, build evaluation before scaling generation, instrument
  outcomes, and give teams authority inside the new boundaries.

The diagnostic for how far this cognition reaches is the cognitive light cone —
how much of the relevant domain the system can observe, interpret, affect, and
learn from. This essay is where the organization implements the machinery that
advances it down the light cone.

The factory also needs two human-governed disciplines to keep this cognition
purposeful: ontology maps the domain, and strategy chooses direction. Both are
developed in their own essays, and this essay closes by connecting them.

## Relationship to the Series

This is the sixth essay in the sequence. *The Knowledge Factory* introduced the
operating system: an organization that turns evidence and intent into reusable
capability. *The Ontology Factory* mapped that system's semantic
infrastructure. This essay examines how the factory thinks — the cognition that
makes the map useful, the learning compound, and the light cone that measures
how far that cognition reaches. The strategy discipline that chooses where the
factory should act is covered inside *The Knowledge Factory*.

## Extending Loop and Graph Engineering

This essay extends two established engineering ideas. **Loop engineering**
builds feedback systems in which outcomes return as evidence that updates
context and evaluation; **graph engineering** builds traversable relationships
among people, concepts, systems, evidence, decisions, and outcomes. The
cognitive factory is both of those — and it extends both with ontology and
cognition:

- **Ontology** makes a loop or a graph checkable rather than plausible: stable
  terms, boundaries, invariants, and evidence rules that let the machinery be
  validated instead of admired. Without ontology, the graph degenerates into
  named edges and the loop into dashboards.
- **Cognition** is what the machinery is for. The cognitive light cone measures
  how much of the relevant domain the system can observe, interpret, affect,
  and learn from, and every loop and graph in this essay exists to advance it.

The sections that follow are the implementation of that extension: graph
context and executable context (the graph made semantic), the compounding loop
(the loop made systemic), and the scorecard and build order that decide how far
the cognition reaches.

## 1. Graph Context Exploration

Graph context is a signature concept, not a generic knowledge-graph pitch. Most
organizational search treats context as documents containing matching words.
Graph context exploration asks relational questions:

- Which customer evidence motivated this capability?
- Which definition of `conversation` applies in this service?
- What decisions depend on this assumption?
- Which failures caused this evaluation to exist?
- Which teams, systems, and metrics will a change affect?
- Where does the current model conflict with observed behavior?

The graph may be implemented through links, metadata, schemas, code
dependencies, event lineage, or a graph database. The product requirement is
traversable relationships with provenance — not a particular storage engine.

## 2. From Documents to Executable Context

Documents remain important, but the factory needs context that can guide and
check action:

- a definition becomes a schema or validation rule;
- an architectural judgment becomes a dependency boundary;
- a customer promise becomes an evaluation;
- an exception becomes an escalation path;
- an observed failure becomes a regression case; and
- a decision becomes a traceable link between evidence and outcome.

This is how institutional knowledge becomes productive capital rather than a
larger pile of prose.

## 3. The Compounding Loop

The factory's return comes from a loop:

> Work produces outcomes → outcomes produce evidence → evidence updates context
> and evaluation → better context improves the next work.

The loop compounds only when the organization captures corrections. More AI
output without retained learning is throughput, not a knowledge factory.

## 4. The Cognitive Light Cone Scorecard

The cognitive factory is where an organization implements the machinery that
advances it down the light cone. This essay makes an **organizational
adaptation** of Michael Levin's cognitive-light-cone framework: it uses the
metaphor as a diagnostic for how much of the relevant domain a system can
observe, interpret, affect, and learn from. Three systems in increasing reach:

- **LLM:** works from supplied context without its own harness. Humans select
  the evidence, state the goal, and evaluate the response.
- **Agent:** combines an LLM with tools, memory, and bounded workflows. Humans
  establish its objective, permissions, evaluation, and escalation boundaries.
- **Knowledge factory:** connects agents to organizational data, context
  stores, operational signals, evaluations, and feedback loops. Humans
  systematize the inputs, govern how evidence is interpreted, and remain
  accountable for the values and decisions propagated through the system.

| Dimension | LLM | Agent | Knowledge factory |
| --- | --- | --- | --- |
| Observability | Supplied context only | Tools and memory within its bounds | Organization-wide signals, context stores, telemetry |
| Semantic context | Prompt and retrieved text | Objective, permissions, escalation boundaries | Ontologies and graph context with provenance |
| Evaluation | Humans judge the response | Bounded checks humans design | Deterministic tests, rubrics, simulations, outcome checks |
| Feedback | None — the session ends | Tool outcomes feed back into its workflow | Outcomes update context, evaluations, and future work |
| Reversibility | The prompt can be rewritten | Bounded actions can be reversed | Provenance enables tracing and rollback |
| Authority | Humans select evidence and state the goal | Humans set objectives and permissions | Humans govern meaning, standards, and decisions |
| Accountability | Humans remain accountable for use | Humans remain accountable for boundaries | Humans remain accountable for propagated values |

Expanding a system's cognitive light cone increases what it can coordinate; it
does not by itself authorize the governing values it applies.

## 5. What Companies Should Build First

Not everything at once. A diagnostic order:

1. Identify the decisions or workflows with repeated context loss and review
   burden.
2. Expose the customer and operational evidence behind them.
3. Name the domain distinctions and invariants required for safe delegation.
4. Build evaluation before scaling generation.
5. Instrument outcomes and connect them back to decisions.
6. Give teams authority inside the new boundaries.
7. Measure whether capability, learning speed, and customer outcomes improve —
   not only whether token or labor costs fall.

## 6. The Two Factory Disciplines

The knowledge factory needs two human-governed disciplines.
[**Ontology Factory**](/writing/the-ontology-factory) asks how humans map the
domain so models and teams share the right entities, relationships,
constraints, and evidence. The strategy discipline — covered in
[**The Knowledge Factory**](/writing/the-knowledge-factory) — asks how humans
choose direction through narrative, empathy, opportunism, memory, and
systematic feedback.

Ontology makes the factory coherent. Strategy makes it purposeful.

## Series

- [Goals, Solutions & Value](/writing/goals-solutions-and-value)
- [Truth, Entropy & Inference](/writing/truth-entropy-and-inference)
- [The Understanding Bottleneck](/writing/understanding-is-the-bottleneck)
- [The Knowledge Factory](/writing/the-knowledge-factory)
- [Ontology Factory](/writing/the-ontology-factory)
- Cognitive Factory (this essay)

## Sources

- Michael Levin, [“Technological Approach to Mind Everywhere: An Experimentally-Grounded Framework for Understanding Diverse Bodies and Minds”](https://doi.org/10.3389/fnsys.2022.768201) (2022). Introduces the cognitive-light-cone framework adapted as an organizational diagnostic in this essay.
- Patrick Lewis and colleagues, [“Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks”](https://proceedings.neurips.cc/paper/2020/hash/6b493230-Abstract.html) (2020). Establishes retrieval from explicit non-parametric memory and identifies provenance and knowledge updating as design problems.
- Shunyu Yao and colleagues, [“ReAct: Synergizing Reasoning and Acting in Language Models”](https://arxiv.org/abs/2210.03629) (2023). Demonstrates an agent pattern that interleaves model reasoning, tool actions, environmental observations, and plan updates.
- Noah Shinn and colleagues, [“Reflexion: Language Agents with Verbal Reinforcement Learning”](https://papers.nips.cc/paper_files/paper/2023/hash/1b44b878bb782e6954cd888628510e90-Abstract-Conference.html) (2023). Tests the use of retained task feedback in episodic text memory to improve subsequent agent trials.
- W3C, [“PROV-O: The PROV Ontology”](https://www.w3.org/TR/prov-o/) (2013). Defines a standard model for representing provenance among entities, activities, and agents.
- National Institute of Standards and Technology, [*Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile*](https://doi.org/10.6028/NIST.AI.600-1) (2024). Supports lifecycle governance, context mapping, measurement, documentation, and human accountability for generative-AI systems.
- DORA, Google, [*2025 State of AI-assisted Software Development Report*](https://research.google/pubs/dora-2025-state-of-ai-assisted-software-development-report/). Supports the claim that effective AI adoption depends on the surrounding organizational system and capabilities rather than model access alone.
