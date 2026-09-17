# Additional musical explorers — integration review

Status: eight GPT-5.6 Terra proposals completed and reviewed. Design investigation only; no feature is approved or implemented by this document.

## Current integration boundaries

The current app represents a note as a pitch and duration. It has no explicit onset or persistent note-level ID (`src/model.ts`, `Note`). Time-oriented proposals therefore need a new event representation rather than overloading note duration or SVG coordinates.

`Study` is a discriminated union indexed by `Kind`; `families` supplies the picker. Every new explorer needs a preset, validator, calculation model, view, controls and tests. `decodeWorkspace` rejects unknown family kinds. Adding a discriminator is an import-compatibility decision, not merely adding another canvas.

Current transfers to the Spiral and Form Map copy material, assign fresh destination IDs and retain human-readable source attribution. They do not create dependencies across studies. Recipe references or multiple event occurrences should remain local to one study unless the user explicitly approves a broader document model.

The current app has no sound engine. These proposals should prove musical meaning with exact notes, timing, common-scale comparisons and silent stepping. References to audio-capable tools are behavioral inspiration, not an implied expansion of the implementation scope.

## Review criteria

Compare each proposal on:

1. Whether a beginner can explain the example after one minute.
2. Whether the new structure answers a question an existing explorer cannot already answer clearly.
3. Whether every visible change can be traced to exact musical inputs, rules and outputs.
4. Whether a small visual-only version is useful without building a general sequencer, solver or patching environment.
5. Whether identity, timing, probability, constraints and copy semantics are explicit.
6. Whether failure behavior, limits and practical acceptance tests make the proposal implementable.

## Findings

The most useful next additions are **Shared-note Atlas, Time Weave, and Pattern Recipes**, in that order. They answer distinct questions with immediately visible examples: which chords contain held notes, how phrases overlap, and how a sequence was constructed. This is a recommendation for selecting future work, not approval to implement all eight.

| Proposal | Structure and musical question | Small useful first release | Main integration cost | Suggested order |
| --- | --- | --- | --- | --- |
| [Shared-note Atlas](shared-note-atlas.md) | Bipartite membership graph: which chords contain C and E? | Fixed chord catalogue, pinned notes, shared/removed/added comparison | Full-pitch transfer adapter for seventh chords; avoid implying harmonic suitability | 1 — clear and relatively small |
| [Time Weave](time-weave.md) | Timed event intervals: what happens when a phrase enters later? | Original, delayed/transposed follower, reversed copy; overlap inspection | Exact onset/duration representation and overlap rules | 2 — strongest new capability |
| [Pattern Recipes](pattern-recipes.md) | Expression tree / local dependency DAG: how was this phrase made? | Repeat, transpose a named copy, shorten its ending, freeze result | Stable event lineage, dependency invalidation, bounded evaluation | 3 — reusable composition foundation |
| [Gesture Score](gesture-score.md) | Ordered control points: how does a contour become notes? | Linear curve, explicit sampling and scale snapping, motif copy | Quantization, endpoint policy, valid output range | 4 — approachable way to originate material |
| [Evolving Rhythm Garden](rhythm-garden.md) | Cellular grid: how do local rules evolve a rhythm? | Inspect Rule 90 rows; capture one row into a Mandala ring | Explain generation versus musical time; preserve captured recipes | 5 — compact generative experiment |
| [Phrase Journeys](phrase-journeys.md) | Weighted directed state graph: where could a phrase go next? | Four phrase cards, weighted choices, seeded bounded trace | Probability denominators, eligibility, loop limits, reproducibility | 6 — useful once phrase construction is clear |
| [Variation Landscape](variation-landscape.md) | Parameter vectors and interpolation: what lies between bounded settings? | Anchor pad controlling retained event count, register and duration | Discrete conversion and transfer limits; avoid vague “style space” claims | 7 — after more direct controls are established |
| [Counterpoint Builder](counterpoint-builder.md) | Finite-domain constraint graph: which notes satisfy these declared rules? | Six aligned events, one named two-voice profile, pins and explanations | Correct rule profiles, search incompleteness and teaching burden | 8 — valuable, highest correctness burden |

These priorities reflect the current visual-only app. They do not rank the artistic value of the underlying techniques.

## Shared design decisions

**Show music before structure.** Every explorer should open with a populated, small example and a one-sentence question. Put the original and result on common pitch/time axes. Reveal graph terminology in inspection or help, rather than making it the first interaction. The Motif Tree's earlier blank-canvas confusion is the relevant product lesson.

**Keep structures distinct from their algorithms.** An interval index answers overlap queries; it does not compose a canon. A constraint graph represents dependencies; a solver searches assignments. A cellular grid stores generations; an explicit mapping turns one row into rhythm. Their inspectors should expose both the stored objects and the rule that produced the displayed result.

**Add timing deliberately.** Time Weave needs stable event IDs and explicit onsets. A shared exact-time representation could also support Gesture Score, Pattern Recipes, and Variation Landscape. Do not change existing note duration semantics to imply rests or overlapping voices. The current Motif Tree stores contiguous pitch/duration sequences with a 16-note limit: transfer adapters must reject unsupported gaps, overlap or size, or offer an explicit user-reviewed conversion. Never silently flatten them.

**Preserve independent studies.** A copied source is a local snapshot. Live recipe edges and event occurrences may refer within the same study; they must not create invisible dependencies across studies. Frozen outputs need their source recipe or source-event attribution so that later edits cannot rewrite their explanation.

**Make limits part of the interaction.** Report display truncation separately from invalid edits and incomplete searches. Keep the existing 256-visible-item budget and depth-4 recursive-view ceiling. A bounded underlying grid may contain more cells if only a limited window is drawn. A counterpoint budget hit means “not finished,” not “impossible.”

**Separate three kinds of action.** Camera pan/zoom changes the view. Musical controls change saved inputs with undo. An explicit capture, apply or freeze action saves a generated result. A transient preview is not a committed result; a saved anchor edit is still a musical edit even before a result is committed.

## Review corrections and acceptance gates

Coordinator review corrected the delayed follower's actual +7-semitone pitches, distinguished seven lane events from six unique onsets in the 3:4 example, bounded recipe expansion, and clarified stable identity through nested repeats. It also corrected counterpoint pitch domains and distinguished parallel perfect intervals from a fifth-to-octave transition; the proposed rule subset is explicitly not a full strict-species curriculum.

The Gesture Score now defines range-limited scale snapping and sample-count limits. Variation Landscape now distinguishes saved edits from transient preview, avoids a duplicate model field, and names the existing Motif Tree's inability to store gaps. Atlas requires an explicit voicing preview and a four-tone transfer adapter for sevenths.

Before implementing any selected explorer, settle its study discriminator and import compatibility, exact validation bounds, transfer destination limits, and worked-example fixtures. Then verify the musical calculation independently of layout, followed by edit/undo/reload/import behavior and keyboard/mobile interaction. The source links within each proposal support reference-tool capabilities; proposed adaptations and rankings here are design judgments.

## Delivery and verification

All eight agents used `gpt-5.6-terra`, one assigned proposal each. The [coordination record](coordination.md) preserves scope and ownership. These documents change no app behavior. Final owner checks and example arithmetic are recorded there.

