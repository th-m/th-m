# Time Weave — arranging copies of one idea in musical time

Status: proposal only. Owner: `theory`.

## Musical question and default score

**What changes when the same small motif enters later, runs at another speed, or
travels backward?** A canon is the familiar case: one voice starts and another
follows. Time Weave makes imitation, phase drift, and polyrhythm inspectable in
a small silent piano-roll score.

It opens with a 2.5-beat source snapshot, **M1**, in C major:

| Source event | Pitch | Onset → end (beats) | Duration |
| --- | --- | --- | --- |
| `m1-c` | C4 | 0 → 0.5 | 0.5 |
| `m1-e` | E4 | 0.5 → 1 | 0.5 |
| `m1-g` | G4 | 1 → 2 | 1 |
| `m1-d` | D4 | 2 → 2.5 | 0.5 |

Three lanes share a beat ruler. `Original` places M1 at 0. `Follower` is +7
semitones and +1 beat: G4 1 → 1.5, B4 1.5 → 2, D5 2 → 3, A4 3 → 3.5. Vertical
position is MIDI pitch (C4 is 60), width is duration, lane is copy identity,
and colour distinguishes source/copy. Original G4 (1 → 2) overlaps follower G4/B4.

`Reversed`, at beat 4, reverses M1: D4 4 → 4.5, G4 4.5 → 5.5, E4 5.5 → 6, C4
6 → 6.5. The inspector says “play source from last event to first” and retains duration.

## First minute and explicit edits

The landing explanation reads “One melody, several entrances.” Select the
follower lane to see source/result piano rolls on shared beat and pitch axes.
Its inspector shows `+7 semitones`, `starts at beat 1`, `1× time`, and
`forward`; selecting a block highlights its source and every derived block. Pan,
zoom, and lane collapse are camera-only actions.

Four explicit edits make copies: **Add entrance** sets offset; **Move** changes
semitone transposition; **Stretch** scales onsets/durations around copy start;
**Reverse** maps events to the other source end. Preview shows its end beat;
“find overlaps” can filter the same MIDI pitch. No drag silently retimes music.

`Phase` repeats M1 in two lanes: one has a 2.5-beat period and the other
a 2.625-beat period, so their next first-note onsets are 0/2.5/5 and
0/2.625/5.25. `3:4 pulse` uses two event sources over a two-beat cycle: a
three-pulse lane at 0, 2/3, 4/3 and a four-pulse lane at 0, 0.5, 1, 1.5. These
are onsets, not one melody.

## Model, calculations, and queries

Time Weave should be a new study kind with study-local event IDs and onsets;
the current global `Note` remains unchanged. It imports a Motif Tree variation
by **copying** notes into `source`, so edits in either study cannot rewrite this
score. Copies reference that immutable local snapshot; stable event/copy IDs
make selection, undo, and overlap results addressable.

```ts
type TimedEvent = { id: string; pitch: number; onset: number; duration: number };
type SourceSnapshot = { id: string; name: string; events: TimedEvent[]; span: number };
type Copy = {
  id: string; sourceId: string; lane: string; offset: number;
  transpose: number; stretch: number; reverse: boolean;
};
type TimeWeave = { sources: SourceSnapshot[]; copies: Copy[]; studySpan: number };
```

For source event `e`, forward placement is `start = offset + stretch * e.onset`
and `duration = stretch * e.duration`; pitch is `e.pitch + transpose`. Reverse
placement uses `start = offset + stretch * (span - e.onset - e.duration)`. The
result must have finite beat values, `duration > 0`, `stretch > 0`, and MIDI
pitch 0–127. Reject empty/invalid sources, out-of-range transforms, and copies
outside the explicitly set musical study span, naming the offending event. Store musical positions as reduced rational beat values (integer numerator and positive denominator); the numeric fields above are shorthand. Convert to floats only for drawing. The 3:4 preset must retain exact thirds, not accumulating rounded decimal steps. Camera range is separate from study span; panning cannot reject or remove events.

An interval is `[onset, onset + duration)`: it includes onset and excludes end.
Thus A4 0 → 1 and A4 1 → 1.5 touch but do **not** overlap. Two intervals overlap
exactly when `a.start < b.end && b.start < a.end`. The editor builds a balanced
interval index from materialized copy events, augmented by each subtree's latest
end, to answer “what intersects [x, y)?” for a viewport, selection, or overlap
inspection. It is a query structure, not the score's authority; rebuilding after
an edit is deterministic and bounded to at most 16 copies × 16 events in the
first release.

That differs from a runtime event queue. A queue orders already-selected future
onsets so a sound system can dispatch them once. The interval index asks about
durations that intersect a range, including an event that began before the
range. This visual-only app needs the latter for inspection. Its existing silent
Mandala cursor is a useful boundary: bounded stepping advances a displayed beat
from elapsed time, clamps at the selected window's end, and never creates,
queues, or sounds events. If audio is ever added, it needs a separate look-ahead
queue and explicit clock mapping.

## Tool lessons, scope, and checks

Strudel documents patterns as values in time and exposes `queryArc(start, end)`
for asking a pattern for events in a time span; its technical manual separately
describes repeatedly querying and scheduling those events. That supports the
proposal's query-versus-scheduling distinction, but it does **not** establish
that Strudel uses an interval tree. [Strudel Technical Manual](https://github.com/tidalcycles/strudel/wiki/Technical-Manual)

Web Audio's `AudioBufferSourceNode.start(when, offset, duration)` schedules in
the audio context's seconds coordinate, supporting separate beats, visual
cursor, and future runtime queue. [MDN: `AudioBufferSourceNode.start`](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode/start)
Use a frame timestamp for the visual cursor; background tabs can pause
`requestAnimationFrame`. [MDN: `requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)

First release: Motif Tree snapshot import, three lanes,
offset/transpose/stretch/reverse, shared-axis roll, range-overlap inspection,
phase/3:4 presets, silent bounded stepping, undo, and JSON validation. Exclude
synthesis, MIDI, live scheduling, tempo maps, swing, nested transforms,
counterpoint scoring, and cross-study live links. It complements Motif Tree,
Form Map, and Rhythm Mandala without changing their data.

Acceptance tests: (1) the default shows the exact C4/E4/G4/D4 times above and
the follower's +7, +1-beat result; (2) reverse yields the exact Reversed order
and endpoints; (3) touching half-open events are absent from overlap results
while 0.999 → 1.001 intersections appear; (4) changing a source study after
import leaves the Time Weave snapshot unchanged; (5) 3:4 labels expose all
seven lane events, including two separate events at beat zero (six unique onset times); and (6) stepping stops at the selected window without audio or
score mutation.

The principal risk is teaching a real temporal relation with an attractive but
overfull canvas. Limit lanes, expose exact values in the inspector, and keep
phase/polyrhythm as named presets before generalising them. I recommend a
**medium priority**: it solves a tangible gap between Motif Tree's “what changed”
and Form Map's “where it recurs,” with a small, inspectable visual-only release.
