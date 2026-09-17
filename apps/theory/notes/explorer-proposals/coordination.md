# Theory explorer proposals — delegated design investigation

Status: complete. These are proposals, not approved implementation work.

## Brief and acceptance

Develop eight proposed musical explorers, one independent GPT-5.6 Terra agent per idea. Owner: `theory`. Coordinator: root agent, sole writer of this coordination record and the final comparison. Workers write only their assigned proposal. No app implementation, commits, remote publication, or additional delegation.

Read `apps/theory/README.md`, `apps/theory/AGENTS.md`, and the existing notes relevant to the assignment. Inspect `src/model.ts`, `src/music.ts`, and relevant view/control code as needed to ground integration suggestions. Existing studies are independent snapshots; transfers are explicit copies. The current product is local, visual-only, and uses twelve-tone equal temperament. Separate view controls from musical edits. Preserve saved material.

The Motif Tree exposed a UX problem: an empty abstract graph and raw note codes were hard to understand. Its improved version opens with a small original-plus-four-variations example, piano-roll cards, plain-language operations, and source/result comparisons with common axes. Apply that lesson: lead with a worked musical example and familiar interaction, not terminology or a blank canvas.

Each proposal should be roughly 700–1100 words and include:

- The musical question, a familiar reference experience, and a concrete default example with actual pitches or timings.
- A first-minute walkthrough; canvas, inspector, and explicit edit actions; what each visual dimension means.
- The underlying data structure versus the algorithm operating on it; concise TypeScript-shaped domain types; stable identity, references, and snapshot boundaries.
- Correct musical calculations and edge cases, explainable failures, deterministic/seeded generation where appropriate, and bounded complexity.
- Relevant tool lessons supported by 2–4 verified primary-source links. Clearly distinguish sourced capabilities from proposed adaptations; browse to verify product/API claims.
- A small first release, deliberate exclusions, links to compatible current explorers, and practical acceptance tests.
- Main risks and one recommendation about whether to prioritize the concept.

Do not change existing source, contracts, or other proposals. Do not implement the feature. Stop after the assigned document is written and self-reviewed. Return a concise summary, exact artifact path, source locators, checks actually run, and blockers. Coordinator performs integration and repository verification.

## Assignments

| Proposal | Assigned agent | Allowed output | Dependencies | Status |
| --- | --- | --- | --- | --- |
| Phrase journeys / weighted state graph | phrase_journeys | `phrase-journeys.md` | Existing notes and model | Reviewed; clarified model fields |
| Shared-note atlas / bipartite graph or hypergraph | shared_note_atlas | `shared-note-atlas.md` | Existing notes and model | Reviewed |
| Time weave / event intervals and interval index | time_weave | `time-weave.md` | Existing notes and model | Reviewed; corrected pitches and timing bounds |
| Counterpoint builder / constraint graph | counterpoint_builder | `counterpoint-builder.md` | Existing notes and model | Reviewed after revision; domains and parallel predicate corrected |
| Pattern recipes / expression tree and dependency DAG | pattern_recipes | `pattern-recipes.md` | Existing notes and model | Reviewed; clarified identity and timing |
| Evolving rhythm garden / cellular grid | rhythm_garden | `rhythm-garden.md` | Existing notes and model | Reviewed; clarified capture and generation |
| Gesture score / control points and splines | gesture_score | `gesture-score.md` | Existing notes and model | Reviewed; bounds and snapshot semantics clarified |
| Variation landscape / parameter vectors and interpolation | variation_landscape | `variation-landscape.md` | Existing notes and model | Reviewed; bounds and snapshot semantics clarified |

All output paths are relative to this directory. Run up to three workers concurrently, plus the coordinator. Workers use model `gpt-5.6-terra` as explicitly requested by the user.

## Integration and verification

Root compares the proposals for usefulness, clarity, overlap, scope, and fit with the current app, then writes `comparison.md`. Review worked examples and source boundaries; repair concrete inconsistencies. Run owner verification and `testing:test` after all documentation is complete. Do not commit or merge these new proposals without a new request.

## Final review

All eight proposals are complete. The coordinator reviewed the worked examples, corrected concrete music/model inconsistencies, and wrote the comparison and implementation priorities. App implementation remains unchanged. Verification completed:

- `bun run nx run theory:publish` passed, including its `theory:typecheck`, `theory:test`, `testing:typecheck`, and `testing:test` dependencies. Nx reused one cached task; other tasks executed locally. Publication produced local artifacts only.
- Independent arithmetic checks passed for Time Weave's +7 transposition, three Rule 90 generations, Gesture Score's seven samples, and the six counterpoint interval distances.
- All ten Markdown files decoded as UTF-8 without replacement characters or internal citation markers; trailing-whitespace checks passed.
- No source, package metadata or runtime behavior changed, so no new browser acceptance claim is made. These are reviewed proposals, not implemented feature acceptance.

