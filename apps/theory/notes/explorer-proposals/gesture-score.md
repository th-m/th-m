# Gesture Score — draw a contour, inspect the notes it proposes

Status: proposal only. Owner: `theory`.

## Musical question and default score

**How does a drawn rise, peak, and fall become an inspectable melody or pulse
shape?** The familiar reference is drawing automation in a piano roll, but this
explorer makes the mapping visible before treating it as a score. It opens with
one three-beat C-major gesture: “climb to G, then settle on D.” Its editable
break points are `(beat, raw MIDI pitch)`:

| Point | Coordinate | Meaning |
| --- | --- | --- |
| `p0` | `(0, 60)` | C4, start |
| `p1` | `(1, 64)` | E4, first landing |
| `p2` | `(2, 67)` | G4, peak |
| `p3` | `(3, 62)` | D4, arrival |

The canvas is a piano-roll plane: horizontal position is **musical beat** and
vertical position is raw MIDI pitch, with C major shown as horizontal bands.
The default curve is a piecewise-linear spline through those control points,
sampled every half beat. Linear interpolation gives raw values
`60, 62, 64, 65.5, 67, 64.5, 62` at beats
`0, .5, 1, 1.5, 2, 2.5, 3`. The conversion rounds halves upward, then snaps to
the nearest C-major pitch class (an equal-distance tie goes upward), producing
the following proposed *silent* event list:

| Onset → end | Raw → rounded → scale-snapped | Displayed pitch |
| --- | --- | --- |
| 0 → .5 | 60 → 60 → 60 | C4 |
| .5 → 1 | 62 → 62 → 62 | D4 |
| 1 → 1.5 | 64 → 64 → 64 | E4 |
| 1.5 → 2 | 65.5 → 66 → 67 | G4 |
| 2 → 2.5 | 67 → 67 → 67 | G4 |
| 2.5 → 3 | 64.5 → 65 → 65 | F4 |
| 3 → 3.5 | 62 → 62 → 62 | D4 |

“MIDI” here is the app's existing 0–127 pitch-number representation, not MIDI
output. Repeated G4 is retained; deduplicating it would be a later explicit
operation. The same y values can preview **visual intensity** (0–1) or **event
density** (one to four evenly spaced dots per beat), without audio.

## First minute and edits

The landing card says “Draw a line. See the notes it proposes.” It shows the
example, quantized piano-roll blocks, and a reading key: left/right = beat,
up/down = pitch, dots = samples, blocks = candidate notes. A player drags `p2`
to F4, compares source/result rolls, changes halves to quarters, then presses
**Copy as Motif snapshot**. The copy is independent.

The inspector has explicit musical actions: **Add point**, **move point in
time**, **move point in pitch**, **set key/mode**, **set sampling grid**,
**choose contour, intensity, or density mapping**, and **copy result**. It
reports exact coordinates and every raw/rounded/snapped value, including the
tie rule. A control point's x must be strictly greater than its predecessor's;
dragging across a neighbour stops at one grid tick before it and explains why.
The endpoint duration is the selected grid value, making the default result
end at beat 3.5 rather than silently truncating D4.

**Pan, zoom, fit, and show/hide scale bands are camera edits only.** They live
in Canvas state and cannot change a control point, key, sample grid, or copied
motif. This follows the current app's separation of derived diagrams from saved
musical data.

## Model, interpolation, and deterministic conversion

The saved break-point function is authority; the spline preview and sampled
events are derived. Stable point IDs make selection and undo addressable.

```ts
type GesturePoint = { id: string; beat: Rational; value: number };
type GestureMapping = "contour" | "intensity" | "density";
type GestureScore = {
  id: string; name: string; points: GesturePoint[];
  interpolation: "linear" | "monotone-cubic";
  sampleStep: Rational; mapping: GestureMapping;
  pitchRange: { low: number; high: number }; key: { root: number; mode: number };
};
type GestureSample = { beat: Rational; raw: number; snapped?: number; density?: 1|2|3|4 };
```

For a contour, x is time: sample beats are `0, step, 2×step …` through the final
point, plus a final full-step event duration. A freehand 2D path can loop back
in x, making “value at beat t” ambiguous. Gesture Score therefore adopts
OpenMusic's increasing-x BPF distinction rather than its free BPC curve.

Linear interpolation is the first-release default. Monotone cubic interpolation
may be offered only for increasing x; use fixed tangents, clamp each segment to
its endpoint range, and evaluate in a fixed order, preventing peak overshoot.
Round with `floor(value + .5)`, then choose the nearest scale member within
both MIDI 0–127 and the configured pitch range; ties choose higher. Reject a
range containing no permitted scale pitch. Require `low < high`. Intensity is
`u = clamp((value - low) / (high - low), 0, 1)`; density is
`min(4, 1 + floor(4*u))` dots per beat. Neither uses randomness.

IanniX supplies the trajectory/cursor analogy: curves yield continuous values
and cursors fire discrete triggers. Gesture Score adapts that relationship into
local, silent score proposals. OpenMusic supports the point/interpolation/sample
distinction.

## Scope, checks, and recommendation

Time starts at beat 0. Point times must lie on the selected sampling grid,
within beats 0–16; a grid change that would invalidate points requires an
explicit snapped preview before applying it. Reject settings yielding more
than 16 samples before generation, matching the current Motif Tree note limit.

First release: one saved gesture, 2–16 ordered points, the example, linear
interpolation, half/quarter/whole-beat sampling, existing modal collections,
contour conversion, visual intensity/density previews, undo, JSON validation,
and an independent Motif Tree copy. Exclude audio, MIDI export/output, freeform
DSP/automation editing, cursor playback, tempo maps, arbitrary curves, and live
cross-study links.

Acceptance tests: (1) the default emits exactly the seven C4/D4/E4/G4/G4/F4/D4
events and timings above; (2) a 65.5 raw value follows the stated upward round
and scale-tie rules; (3) moving a point changes only derived samples, while a
camera pan changes neither points nor samples; (4) invalid or unordered x
coordinates are rejected with the point ID; (5) copying a result then editing
either study leaves the other unchanged; and (6) intensity/density remains
visible metadata with no audio or runtime event dispatch.

The risk is a pleasant drawing tool hiding its musical decision rules. Keep raw,
rounded, and snapped values together in the inspector, begin with linear
segments, and make smoothing opt-in. I recommend **medium priority**: it gives
the existing Motif Tree a tactile way to originate a short melody while
remaining smaller and more explainable than a general automation editor.

## Primary-source lessons

- [IanniX documentation: cursors, coordinate mapping, and triggers](https://www.iannix.org/download/documentation.pdf)
  documents continuous cursor values and discrete trigger events. The local
  curve-to-note adaptation is proposed here; IanniX itself is an external,
  real-time OSC/MIDI environment.
- [OpenMusic BPF/BPC documentation](https://support.ircam.fr/docs/om/om6-manual/co/BPF-BPC.html)
  defines an increasing-x break-point function separately from a free 2D curve.
- [OpenMusic curve tools](https://support.ircam.fr/docs/om/archive/om6.3-manual/co/Tools.html)
  documents regular sampling and spline interpolation from control points.
