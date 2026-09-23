# Research: Sensemaking, Signals, and Organizational Memory

Reviewed 2026-09-23 for the factory/cognition responsibility split.

## Evidence and Boundaries

| Source and locator | Supported use | Limit |
| --- | --- | --- |
| Michael Levin, [The Computational Boundary of a “Self”](https://doi.org/10.3389/fpsyg.2019.02688), 2019, abstract and Introduction | Cognitive boundaries have spatial and temporal extent, involving events an agent can measure, model, and try to affect. | The factory capability profile is our adaptation. It is not a validated organizational intelligence score or evidence of consciousness. |
| FranklinCovey, [5 Ways to Narrow Your Sales Focus in Times of Uncertainty](https://www.franklincovey.com/blog/5-ways-to-narrow-sales-focus-in-uncertainty/), discussion of lead measures | 4DX uses lead measures that are predictive and influenceable, distinguished from outcome measures. | The proposed onboarding measures need local validation. Early signals and busywork counts do not automatically qualify. |
| Tiago Forte, [Building a Second Brain](https://www.buildingasecondbrain.com/) and [PARA](https://fortelabs.com/blog/para/), “4 Categories” and organizing by projects/goals | An external knowledge practice organized around projects, areas, resources, and archives. | Organizational ownership, authority, state, and retention requirements extend the personal practice. |
| Forte, [Progressive Summarization](https://fortelabs.com/blog/progressive-summarization-a-practical-technique-for-designing-discoverable-notes/), Layers 0–4 | Summaries can preserve access to deeper source material. | The selective retrieval protocol is an editorial architecture proposal, not a measured AI performance result. |
| W3C, [PROV-O](https://www.w3.org/TR/prov-o/) | Existing reference for provenance among entities, activities, and agents. | Does not prescribe the proposed record schema or storage topology; no new conformance claim. |

## Proposed Synthesis

The factory article owns event contracts, trigger policies, execution DAGs,
bounded retries, verification, and the return of outcomes. Cognition owns the
interpretation of signals, historical and present state, and contextual reach.

Use one illustrative onboarding problem across these concepts. A plan, a failed
experiment, an accepted ADR, and a changed priority can alter a recommendation.
State and provenance determine whether each record is applicable.

Repository context should point to the systems that own broader organizational
records. Keep code-coupled contracts and relevant ADRs with implementation.
Avoid both copying the whole archive into the repository and loading it into
every model prompt. A record index routes selective discovery.

Use stable project identifiers, record types, owners, states, dates, and
supersession/evidence links. Retrieve summaries first, deepen around unresolved
questions, and preserve consequential missing information when a budget or
access boundary prevents completion. This describes a design convention, not
an implemented connector, index, or memory service.

## Open Validation Work

- Select real lead measures and test their relationship to the intended outcome.
- Evaluate retrieval against representative cases with known relevant records.
- Measure stale-state mistakes, evidence omissions, and human review effort.
- Define ownership and retention policies for the actual organization before
  implementing the proposed record conventions.
