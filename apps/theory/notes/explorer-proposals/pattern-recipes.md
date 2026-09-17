# Pattern Recipes — inspectable transformations for a reusable motif

Status: proposal only. Owner: `theory`.

## Musical question and default score

**How can a composer write down a transformation, inspect each step, then
reuse it without losing the original idea?** The familiar case is copying a
phrase, changing its second statement, and shortening its final note. Pattern
Recipes shows a readable left-to-right recipe and a piano roll after each step.

It opens with `M1 · C-major turn`: C4 (MIDI 60) from beat 0 to 1, E4 (64)
from 1 to 2, G4 (67) from 2 to 3, and D4 (62) from 3 to 4. The default recipe
is **Repeat twice → transpose copy 2 up two semitones → shorten the ending by
half a beat**. Its intermediate cards show:

| Card | Exact result |
| --- | --- |
| `M1` | C4 0–1, E4 1–2, G4 2–3, D4 3–4 |
| `Repeat ×2` | the same four notes again at 4–5, 5–6, 6–7, 7–8 |
| `Transpose second +2` | first copy unchanged; second is D4, F♯4, A4, E4 at 4–8 |
| `Shorten ending −0.5` | the second-copy E4 runs 7–7.5; every other endpoint stays fixed |

Horizontal location means beat, vertical location MIDI pitch, and width
duration. This is a **sequence** result: each copy starts after the previous
result ends. A future `Stack` operation could align inputs at beat zero and
produce parallel lanes; it is excluded so concatenation stays unambiguous.

## First minute and interactions

The opening sentence is “Make a repeat you can still explain.” The canvas shows
the four cards; the selected final card shares time/pitch axes with the source.
Clicking `Transpose second +2` highlights four blocks and says “Only copy 2
moved higher.” The inspector offers **Repeat**, **Move copy**, **Make last note
shorter**, then explicit **Preview** and **Keep recipe**. Selecting `M1` opens
its note list; selecting a result cannot edit its source.

Drag only rearranges cards. **Duplicate step** creates a new ID, **Disable**
bypasses it, and **Freeze result** records a local motif. The first useful
action is changing `+2` to `+7` and comparing the unchanged first copy.

## Model, evaluation, and snapshots

Each operation has one parent, so its local expression is a tree. Named local
nodes reused by later operations make the stored recipe a dependency DAG. An
evaluation materializes a tree-shaped trace for one output, while the DAG keeps
shared dependencies visible.

```ts
type TimedNote = { id: string; pitch: number; onset: number; duration: number;
  sourceNoteId: string; copyPath: { repeatNodeId: string; index: number }[] };
type MotifSnapshot = { id: string; name: string; notes: TimedNote[]; frozenAt: string };
type Op =
  | { kind: "source"; snapshotId: string }
  | { kind: "repeat"; input: string; count: 2 | 3 | 4 }
  | { kind: "transposeCopy"; input: string; repeatNodeId: string; copy: number; semitones: number }
  | { kind: "shortenEnding"; input: string; beats: 0.125 | 0.25 | 0.5 };
type RecipeNode = { id: string; label: string; op: Op; enabled: boolean; revision: number };
type Recipe = { id: string; nodes: Record<string, RecipeNode>; outputId: string };
type Evaluation = { nodeId: string; notes: TimedNote[]; inputs: string[]; diagnostics: string[] };
```

Evaluation is deterministic and memoized by `(nodeId, revision, input result
revisions)`. `repeat` offsets sequential copies by input span; `transposeCopy`
changes only the numbered copy; `shortenEnding` reduces the event with the
greatest end time, retaining onset. A tie changes later source order. Events retain `sourceNoteId` and a copy path naming each repeat node and copy index. Generated IDs derive from the operation ID and input event lineage; reevaluation does not assign random new IDs. The copy selector names the repeat operation it targets, so nested repeats cannot silently reinterpret “copy 2.”

A Motif Tree import copies its selected variation into `MotifSnapshot`, like the
current motif-to-Form independent transfer. A same-study recipe reference is
live to a named local node; **Freeze result** is immutable. There are no global
or cross-study live references.

This is not a rewrite grammar. A grammar repeatedly replaces symbols according
to productions to derive a new string or structure; McCormack's music work,
for example, adapts L-system string rewriting and encodes pitch, duration, and
timbre as grammar symbols. [McCormack, *Grammar-based music composition*](https://research.monash.edu/en/publications/grammar-based-music-composition/)
Pattern Recipes evaluates a finite transformation DAG over concrete notes.
Grammar expansion could become a separate seeded explorer. Holtzman likewise
defines a generative grammar as formal rules that generate a language.
[Holtzman, *A generative grammar definition language for music*](https://doi.org/10.1080/09298218008570279)

OpenMusic patches evaluate connected upstream boxes and can lock a last value.
That supports exposed intermediate results and Freeze, without making this a
general visual language. [OpenMusic evaluation manual](https://openmusic-project.github.io/openmusic/doc/om-manual/Evaluation.html)

## Validity, limits, scope, and acceptance

Changing a node input runs DFS from the proposed input along stored dependency references. If it reaches the node being edited,
reject it with “This would make `Chorus repeat` depend on itself” and show the
cycle path. Dangling IDs, missing sources, non-finite values, MIDI pitches
outside 0–127, durations below 0.125, and an over-shortened ending stop at the
offending card and preserve the last valid result. A changed node invalidates
only downstream memo entries.

First release caps a source at 64 events, recipe depth at 4, nodes at 64, and
materialized output at 256 events. It rejects an edit before evaluation if the
static repeat upper bound exceeds 256; evaluation is therefore linear in the
bounded generated events and never turns one click into an unbounded expansion.
v1 accepts durations/onsets on an eighth-beat grid, represented by integer ticks (8 ticks per quarter-note beat); the numeric beat fields above are shorthand. This keeps its supported edits exact and rejects off-grid imported values rather than claiming arbitrary decimal arithmetic is exact. No
random operation appears in this release; any later stochastic transform must
store its seed and sampled result in the evaluation trace.

The first release is the default recipe, the three operations above, named
local-node reuse, intermediate cards, provenance highlighting, Freeze, JSON
validation, undo/redo, and Motif Tree snapshot import. Exclude audio/MIDI,
drag-to-compose, rule grammars, loops/recursion, parallel stacking, automatic
variation generation, and live links. It complements Motif Tree’s one-parent
family view and Form Map’s definitions/occurrences without changing either.

Acceptance tests: (1) the default cards render the exact pitches and endpoints
above; (2) `+7` moves only second-copy notes; (3) Freeze remains unchanged after
the source motif is edited; (4) an attempted A → B → A reference is rejected
with the readable cycle path; (5) a 0.5-beat final note cannot be shortened by
0.5; (6) a repeat expansion beyond 256 is rejected before a result card appears;
and (7) disabling transpose restores the second copy’s original pitches while
leaving repeat and shortened ending active.

The risk is making graph vocabulary arrive before music. Lead with one linear,
playable-on-paper recipe and place reuse behind “Use this result again.” I
recommend **high-medium priority** after the Motif Tree improvement.
