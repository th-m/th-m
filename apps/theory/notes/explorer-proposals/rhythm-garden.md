# Evolving Rhythm Garden — a cellular score you can cultivate

Status: proposal only. Owner: `theory`.

## Musical question and default example

**What grooves can grow from one deliberately placed onset?** The familiar
starting point is painting a small drum pattern, then seeing how a simple
neighbour rule makes it fan out, thin, or lock into a pulse. Rhythm Garden is a
silent, editable cellular grid: it discovers patterns before the musician
chooses one as a rhythm.

It opens with an eight-column seed labelled eighth-note positions in one 4/4
bar. The initial painted row is `00010000`: one kick at position 4, onset
**1.5 beats**. The supplied rule is elementary **Rule 90**, with fixed-zero
edges. It gives these exact rows (leftmost cell is position 1):

| Generation | Cells | Live-cell positions | If captured as an 8-step bar |
| --- | --- | --- | --- |
| 0 (seed) | `00010000` | 4 | 1.5 beats |
| 1 | `00101000` | 3, 5 | 1, 2 beats |
| 2 | `01000100` | 2, 6 | 0.5, 2.5 beats |
| 3 | `10101010` | 1, 3, 5, 7 | 0, 1, 2, 3 beats |

That last row is a useful payoff: a painted offbeat becomes a four-on-the-floor
quarter pulse. A cell is either **live** (filled: a proposed hit) or **empty**
(rest); column is rhythmic position; row is *generation*, not musical time.
Only an explicit **Capture generation** turns one row into a Mandala-compatible
ring, so generation 3 does not mean “the fourth bar.”

## First minute and explicit edits

The canvas opens with the editable seed and its first four derived rows. The
left gutter says `seed`, `generation 1`, and so on; a separate beat ruler says
`0, 0.5, 1 … 3.5`. Selecting any derived cell highlights its three parents
in the preceding row and the inspector explains, for example,
“left 1 XOR right 1 = 0.” Hovering a row shows the exact proposed hit count and
the corresponding silent 4/4 step pattern.

The first-minute path is: click cells in the seed to paint or erase hits; inspect the three worked generations; select generation 3; then **Capture as new Mandala ring**.
**Undo seed edit**, **Undo step**, and **Restore snapshot** are reversible.
“Step” appends one derived row; it never plays sound, advances the Mandala
visual clock, or silently overwrites a saved ring. A camera zoom or pan changes
only the view.

The inspector separates musical edits from rule controls: **Paint seed**,
**clear seed**, and **load copied Mandala ring** change seed material; **Rule**,
**edge mode**, and **generation limit** determine derivation; **density target**
is an optional preview filter. It reports density as `live cells / width` (for
generation 3, `4 / 8 = 0.5`), never as an unspecified percentage. Start with a
target band of 0.25–0.75: rows outside it are dimmed, still present and
capturable. This is a selection aid, not a rule mutation or a claim that sparse
patterns are better.

## Data, rule, and boundaries

The saved garden is authority; visible rows are deterministic derivation.
Stable IDs make selection and undo addressable. A Mandala import copies its
enabled positions into `seed`; capture creates an independent Ring snapshot.

```ts
type EdgeMode = "fixed-zero" | "cyclic";
type Garden = {
  id: string; name: string; width: 8 | 16 | 32; rule: number;
  edgeMode: EdgeMode; seed: boolean[]; generationLimit: number;
  density?: { min: number; max: number };
  algorithmVersion: string;
  snapshots: { id: string; generation: number; cells: boolean[];
    recipe: { seed: boolean[]; width: number; rule: number; edgeMode: EdgeMode; algorithmVersion: string } }[];
};
type GardenRow = { generation: number; cells: boolean[] };
```

For the first release, Rule is an integer 0–255 and the neighbourhood order is
**left, centre, right**. Let `n = 4*left + 2*centre + right` (so `111` is 7 and
`000` is 0); the next cell is `(rule >> n) & 1`. This makes bit 7 the `111`
outcome and bit 0 the `000` outcome. Rule 90 is binary `01011010`, hence the
table `111→0, 110→1, 101→0, 100→1, 011→1, 010→0, 001→1, 000→0`; equivalently,
the next value is `left XOR right`. With the default fixed-zero boundary,
outside cells are 0. In cyclic mode, left of index 0 is the last cell and right
of the last cell is index 0. The boundary choice is saved and stated on every
snapshot, because it changes the result.

The default uses fixed-zero edges precisely to make the worked rows above
reproducible. Rows must have `width` cells and Boolean values; reject invalid
rule, density bounds, generation index, or snapshot recipe with an explanation.
Bound v1 to widths 8/16/32 and 0–32 derived generations: at most 1,056 cells
are materialised, with a scrollable window of at most 256 visible cells. Editing a seed or a rule recomputes the derived rows and visibly explains the change; undo restores the prior recipe. Frozen snapshots and captured rings remain intact. A snapshot includes its original recipe, so verification never compares old captured cells with the current edited seed. There is no random evolution: the same
seed, width, rule, boundary, and algorithm version yields the same rows after
reload.

## Reference lessons, release, and tests

Wolfram's `CellularAutomaton` documentation says rule-number digits determine
neighbourhood outputs and that an explicit finite list is cyclic. Garden adopts
the finite-grid idea but exposes its own boundary modes and bit convention.
[Wolfram Language: CellularAutomaton](https://reference.wolfram.com/language/ref/CellularAutomaton.html)

WolframTones documents Rule Type 7 as range-1 elementary automata, the 0–255
range, and visible seed, height, cyclic-boundary, tempo, and note-rate controls.
It maps cellular height to pitch. Garden borrows inspectable generation controls
but maps a *chosen row* to onsets only; it does not claim WolframTones's
instrument, pitch, or audio behaviours. [WolframTones controls](https://tones.wolfram.com/about/controls/)
and [How it works](https://tones.wolfram.com/about/how-it-works).

v1 is the default worked garden, seed painting, Rule 90 plus numeric rules,
fixed/cyclic boundaries, bounded stepping, density filtering, frozen snapshots,
side-by-side row comparison, and copy-only Mandala capture. Exclude audio,
MIDI, probability, two-dimensional automata, automatic beat selection,
rule-search, velocity/accent generation, and live cross-study links. It
complements Rhythm Mandala's independent cycles and silent visual clock: the
Garden supplies candidate one-bar hit rows; Mandala remains the editor for
cycle length, rotation, accents, and alignment.

Acceptance checks: (1) the exact Rule 90 rows above appear under fixed-zero
edges; (2) Rule 90's `111` and `000` outputs are 0 and its `110`/`001` outputs
are 1; (3) cyclic and fixed-zero differ at an edge seed; (4) a generation never
changes the visual clock or implies a musical bar; (5) capture at generation 3
creates hits at 0/1/2/3 beats in an independent ring; (6) a changed seed does
not rewrite a frozen snapshot or captured ring; (7) invalid sizes/rules are
rejected; and (8) density labels retain their numerator and width denominator.

The main risk is ornamental complexity that hides a weak groove. Keep the
default eight-step example, show parent-cell explanations, cap the grid, and
make capture selective. I recommend **medium priority**: it gives Rhythm
Mandala an intelligible idea generator without importing audio or treating an
abstract automaton as musical judgment.
