# Four explorer implementation plan

Status: approved local implementation. Owner: `theory`. Coordinator: root
agent.

| Explorer | Scope | Dependency | Acceptance |
| --- | --- | --- | --- |
| Rhythm Garden | Rule-90 cellular rhythm rows and independent Mandala snapshot capture | Existing Mandala ring model | Exact fixed-zero rows; captured hit row retains its own data |
| Phrase Journeys | Weighted phrase-state graph with a seeded, bounded preview | Existing `Note[]` material | Default route is reproducible; edits never alter a preview by layout change |
| Variation Landscape | Anchors, interpolation, quantized candidate phrase, committed snapshots | Motif snapshot transfer | Centre example derives three original-register events |
| Counterpoint Builder | One explicit C-major consonance profile and inspectable finite candidate domains | Existing pitch and timed-note utilities | Default consonance labels and named parallel-perfect rejection |

Implementation keeps each study variant complete: model preset, pure music
calculation, import validation, controls, derived geometry, and tests. The
coordinator will integrate one shared-app change set, run all required `theory`
checks, and browser-check the four new explorers before handing off. No backend,
audio, MIDI, or remote publication is in scope.
