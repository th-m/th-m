# Variation Landscape — anchors for bounded motif variation

## Musical question and default experience

**How can one four-note idea become sparser, busier, lower, or higher while showing exactly what changed?** The familiar experience is moving between variation presets, then adjusting values between them. This is a silent piano-roll comparison, not a claim that a cursor can interpolate arbitrary melodies, styles, or “moods.”

The canvas opens with **C-major four-beat cell**: C4:1 E4:1 G4:1 D4:1. Its editable corner anchors are:

| Anchor | position | activity | register | duration scale | shown result |
| --- | --- | ---: | ---: | ---: | --- |
| Sparse low | x=0, y=0 | 0.50 | -12 semitones | 1.00 | C3:1 E3:1 |
| Busy low | x=1, y=0 | 1.00 | -12 semitones | 1.00 | C3:1 E3:1 G3:1 D3:1 |
| Sparse high | x=0, y=1 | 0.50 | +12 semitones | 1.00 | C5:1 E5:1 |
| Busy high | x=1, y=1 | 1.00 | +12 semitones | 1.00 | C5:1 E5:1 G5:1 D5:1 |

At cursor (0.50, 0.50), every corner weight is 0.25. Its blended vector is activity **0.75**, register **0**, duration scale **1.00**, so the preview is `C4:1 E4:1 G4:1`: three retained source events at original pitches and timing. This is a concrete intermediate, not an invented tune.

Cycling '74’s Max `function` object provides the useful familiar idea: saved, editable breakpoints and an interpolated output for an input coordinate. Those are sourced capabilities; this adapts the interaction to two-dimensional, visual-only music study. [Max function reference](https://docs.cycling74.com/legacy/max5/refpages/max-ref/function.html)

## First minute and explicit actions

The canvas has a square landscape, named anchor chips, and a cursor. In the default, horizontal is sparse-to-busy and vertical is low-to-high; after anchors are moved, both coordinates only determine their interpolation weight. Anchor values determine **activity**, **register**, and **duration scale**. Colour identifies the greatest-weight anchor and the inspector prints all weights. Identically scaled source and preview piano rolls show onset, duration, and pitch. Moving the cursor derives a preview only; camera operations are view-only.

In the first minute, the user reads the source/result, moves to centre, opens **Inspect result** for weights and event IDs, then chooses **Edit anchor**. Editing explicitly renames, moves, or changes a bounded vector. **Add anchor** begins at the current blended values. Anchor and source edits are saved musical edits with undo. **Commit preview as variation** is the action that saves the generated event list: it shows source, result, and vector before saving. **Copy to Motif Tree** creates a new study snapshot; no study follows later edits in the other.

The inspector separates **Source** (ordered original events), **Anchors** (saved controls), **Cursor preview** (derived weights/vector), and **Committed variations** (saved results). It does not score quality or call a result emotional.

## Model, interpolation, and discrete mapping

Saved authority is the source, anchors, and committed snapshots. Cursor position is transient interaction state; weight shading, piano-roll geometry, and candidate preview are derived. A production-approved variant needs a new `Kind`, preset, validator, controls, graph builder, fixtures, and tests; these types are proposal-only:

```ts
type LandscapeEvent = { id: string; pitch: number; start: number; duration: number };
type VariationVector = { activity: number; register: number; durationScale: number };
type LandscapeAnchor = { id: string; name: string; x: number; y: number; vector: VariationVector };
type CommittedVariation = { id: string; cursor: [number, number]; weights: Record<string, number>; vector: VariationVector; events: LandscapeEvent[] };
type VariationLandscape = { id: string; name: string; source: LandscapeEvent[]; anchors: LandscapeAnchor[]; committed: CommittedVariation[]; provenance?: { study: string; item: string } };
```

UUIDs are stable through reordering. Store durations and starts as integer eighth-beat ticks; numeric beats in this sketch are shorthand. Importing a Motif copies notes into fresh event IDs and inferred cumulative starts. A commit copies events into a fresh `CommittedVariation`, retaining source-event attribution separately from new event IDs; duplicate and cross-study transfer are deep snapshots with human-readable source attribution, matching current Spiral/Form boundaries.

Coordinates clamp to `[0, 1]`. `activity` is `[0.25, 1.00]` events per original event, `register` is `[-24, +24]` semitones, and `durationScale` is `[0.50, 2.00]`. With 2–8 anchors, use inverse-square weights: at cursor `c`, `wᵢ = (1 / max(0.0001, |c-aᵢ|²)) / Σⱼ(...)`. Exact matching anchors split weight equally; all other anchors get zero. Each blended component is `Σ wᵢvᵢ`; the corner default therefore gives 0.25 each at centre.

Interpolation applies only to these meaningful continuous controls. It does not blend pitch classes, note identities, rhythms, or whole melodies. A fixed discrete mapping then renders a candidate: for `N` source events, retain `roundHalfUp(activity × N)` (at least one), in saved priority order of earliest onset then lower original index. Add rounded register to each retained MIDI pitch; `.5` rounds toward positive infinity. Multiply duration by durationScale, quantize to nearest **1/8 beat**, with an exact half rounded later in time. A copy to the current Motif Tree is allowed only for contiguous events starting at zero, since it cannot represent rests or explicit onsets. Gapped candidates remain valid Landscape studies with a named transfer limitation; never silently close gaps. Reject, without altering saved data, a candidate with MIDI pitch outside `0..127`, duration outside `0.125..16` beats, or overlapping retained events; name the event and bound.

Max `table~` distinguishes linear interpolation from truncation and rounded index lookup: a sound lesson for our explicit continuous-to-discrete policy. [Max table~ reference](https://docs.cycling74.com/reference/table~/) There is no random choice, hence no seed: saved anchors, source order, and stated ties reproduce a preview after reload. Cap at 16 source events, 32 committed variations, and 8 anchors; derivation is O(anchors + events).

## Release, fit, and acceptance

v1 is the worked example, visual pad, 2–8 editable anchors, numeric inspection, same-axis comparison, explicit commit, undo/redo, JSON storage, and snapshot copy to Motif Tree. Exclude audio, MIDI, playback, arbitrary drawn melodies, learned style spaces, chord/key inference, automatic rhythm generation, global study links, and live preset automation. Max `pattrstorage` can interpolate stored preset values; that is a useful precedent, while this v1 neither controls Max nor fades parameters in time. [Max pattrstorage reference](https://docs.cycling74.com/legacy/max8/refpages/pattrstorage)

Landscape complements Motif Tree’s named operations with a small inspectable space of numeric variation. A Tree copy may become the source but is never live-linked. Register Spiral remains for voicing/inversion and Rhythm Mandala for cyclic rhythm editing.

Acceptance: (1) defaults and centre output match the table; (2) exact-anchor cursor uses its vector; (3) centre weights are 0.25; (4) 0.75 activity over four events retains exactly three by priority/tie rule; (5) semitone and duration ties use their separate rules; (6) invalid range/overlap explains and blocks commit; (7) later anchor edits do not change a committed result; and (8) copied studies remain independent after save, reload, and JSON import.

The risk is presenting two dimensions as a complete musical map. Keep controls short, the example visible, and the discrete conversion inspectable. I recommend **medium priority after Motif Tree**: it offers tangible controlled variation only if its limits remain as clear as its landscape.
