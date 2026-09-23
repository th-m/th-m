---
name: article-flow-diagram
description: Evaluate an article's topic-comment information flow and illustrate it with an elaboration, linking, taxonomy, or theme-preview diagram. Use when asked to visualize article structure, critique thematic progression, map old-to-new information, or produce an information-flow figure from prose. Do not use for generic article illustrations unrelated to prose flow or for editing without a diagram and framework critique.
---

# Article Flow Diagram

Show how an article moves a reader from familiar topics to new information,
then critique whether that movement matches the elaboration, linking, taxonomy,
or theme-preview framework best suited to each unit.

## Set the Scope

Identify the article, intended reader, and requested resolution. Default to
section or paragraph resolution for a complete article. Use clause resolution
for a short passage or a focused trouble spot; a clause-by-clause map of a long
article usually exceeds the diagram's useful complexity.

Read [the framework and diagram grammar](references/frameworks.md) before
evaluating. Read the complete prose once in reading order before extracting its
structure.

An evaluation is read-only. Do not revise prose, register article assets, or
publish content unless the user explicitly requests those actions.

## Build the Topic-Comment Ledger

For each unit in scope, record:

- a stable section, paragraph, clause, or line reference;
- the **topic**: the familiar starting point the unit asks the reader to stand on;
- the **comment**: the new contribution the unit makes about that topic;
- the source of the topic's familiarity, such as prior context, repetition, or
  an explicit preview;
- whether the comment becomes a later topic;
- the important term used for each concept.

Use short paraphrases in the ledger and diagram. Quote only enough prose to make
the interpretation auditable. Mark an inferred topic as inferred rather than
silently supplying context the article does not establish.

## Select the Framework

Choose the dominant pattern for the target unit:

1. **Elaboration:** repeated topic, multiple new comments.
2. **Linking:** each comment becomes the next topic.
3. **Taxonomy:** an explicit whole licenses development of its parts.
4. **Theme preview:** an index previews several named themes that later units
   develop.

An article may mix patterns at different resolutions. Name the pattern for each
region rather than forcing one global classification. When a passage is
incoherent, state the pattern it appears to attempt and show where the observed
flow departs from it.

## Evaluate the Fit

For each region, test:

- **Entry:** Is the opening topic already available to the reader?
- **Progression:** Does new information appear where the selected pattern can
  carry it forward?
- **Continuity:** Do repeated concepts retain recognizable terms?
- **Boundary:** Does a pattern shift receive an index, umbrella, or transition?
- **Closure:** Does the region resolve, return, or hand off without abandoning
  its organizing topic?

Classify the fit as Strong, Fragile, Broken, or Mixed. Support every material
judgment with a ledger reference and name its reader-facing effect. Distinguish
an intentional pattern change from accidental drift.

## Draw the Diagram

Always include a diagram with the critique.

- For an ordinary review, return a compact Mermaid flowchart using the visual
  grammar in the reference. Keep it small enough to read inline.
- For a publishable THOM article figure, exported SVG/PNG/HTML, or animation,
  also use [thom-diagrams](../thom-diagrams/SKILL.md). That skill owns visual
  styling, source placement, generation, and artifact verification; this skill
  owns the topic-comment model and editorial critique.

Use labels and shapes in addition to color so topic, comment, preview, whole,
and part remain distinguishable. Put stable prose references in node sublabels
or the accompanying ledger, not as long quotations inside nodes.

For a long article, draw one overview showing section-level patterns and at most
one focused detail showing the highest-cost break. Prefer a table when the
relationship is merely a list; the diagram must reveal repetition, pickup,
containment, preview, or drift.

## Deliver the Critique

Return:

1. **Framework verdict:** the dominant pattern or pattern mix and the principal
   information-flow constraint.
2. **Topic-comment ledger:** the evidence needed to audit the interpretation.
3. **Diagram:** observed information flow, including the break when one exists.
4. **Framework critique:** strengths, deviations, and reader effects by region.
5. **Revision priorities:** no more than three high-leverage structural moves,
   each naming the expected pattern and the smallest useful change.
6. **Verification boundary:** assumptions about audience familiarity, factual
   accuracy, or authorial intent the prose alone cannot establish.

When revision is explicitly requested, preserve meaning, citations, technical
scope, and voice. Revise the highest-cost break first, rebuild the ledger, and
redraw the affected region so the before-and-after flow can be compared.
