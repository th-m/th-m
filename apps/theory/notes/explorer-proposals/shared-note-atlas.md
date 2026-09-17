# Shared-note Atlas — a note-to-chord map for held tones

## Question, reference, and default

**Musical question:** “If I hold these notes, which chords can contain them, and what would change?” A player pins tones, sees compatible chord names, and decides. The familiar reference is a DAW piano-roll chord helper: Ableton’s Chord effect retains an input note and adds relative pitches. The Atlas adapts that immediate interaction into an explanatory map.[^ableton]

It opens on a worked example, never an empty graph: **C major = C–E–G**. “Keep C and E; find another home” pins their *pitch classes* and reveals **A minor = A–C–E**. Its card reads “keeps C, E; G becomes A.” C major and A minor share C/E; this does not claim the same function, key, spacing, or register. Open Music Theory identifies diatonic mediants such as C and A minor as having two common tones.[^mediants]

## First minute and interaction

In the first ten seconds, the learner clicks C and E; incompatible chords fade but remain countable. Clicking A minor highlights shared C/E, removed G, and added A. “Show seventh extensions” exposes **Am7 = A–C–E–G** as “all source tones retained + A”; it does not replace the selected chord. “Make a copy in Register Spiral” opens a concrete pitch preview, defaulting to root position with the root in octave 3; the user may choose another root octave before creating an independent voicing study. “Send C and E to Voice-leading Honeycomb” copies only pitch-class pins, not a voicing or route.

The canvas is a bipartite incidence graph: note nodes on the left, chord cards on the right, and a line only for pitch-class membership. Teal means pinned-and-contained; gray means unpinned membership, never proximity or quality. Labelled card rows make membership auditable. Filtered chords remain in a count drawer. The inspector offers **Pins**, **Vocabulary** (triads or triads + sevenths), **Compare** (shared/removed/added), and an editable, unranked context label. Camera pan and zoom only change the view.

Edits are “set source chord,” “pin/unpin note,” “choose vocabulary,” and “select comparison target.” Selecting a card only inspects it; “Use as next chord” appends it to an Atlas-local two-card comparison and never writes another study.

## Data, calculation, and limits

Saved material is chord identities, pins, selection, and transfer attribution; graph and labels are derived.

```ts
type PitchClass = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
type AtlasShape = "maj" | "min" | "dim" | "maj7" | "min7" | "dom7" | "halfDim7";
type AtlasChord = { id: string; root: PitchClass; shape: AtlasShape };
type AtlasData = {
  source: AtlasChord; pins: PitchClass[]; vocabulary: "triads" | "sevenths";
  selected: string | null; contextLabel: string;
};
type AtlasStudy = { id: string; kind: "atlas"; data: AtlasData; route: string[] };
```

`id` is the stable `root:shape` catalogue identity, while the study ID is independently generated. `chordPcs` adds the shape’s fixed semitone offsets modulo 12, deduplicates, and sorts them. The bipartite edges are the deterministic Cartesian lookup `{ notePc, chordId }` for every membership. A chord is compatible precisely when `pins.every(pc => chordPcs(chord).includes(pc))`; zero pins shows the complete catalogue. `shared = sourcePcs ∩ targetPcs`, `removed = sourcePcs − targetPcs`, and `added = targetPcs − sourcePcs` make every comparison explainable.

Release one has 36 triads or 84 cards with seventh shapes, laid out in 12 fixed root columns and deterministic shape rows: no force simulation, seed, or chance. A filtered selected card says why; invalid or duplicate pins are rejected; an empty result offers Clear pins. Enharmonic names use the app’s contextual spelling policy, but equality is twelve-tone pitch-class equality.

Pitch-class membership deliberately stops before several tempting inferences. **C3–E4–G4** and **A2–C4–E5** may share C/E by class while having very different spacing and playable motion; the Atlas neither stores nor scores those voicings. The Register Spiral can inspect a copied concrete voicing. The current triad-only transfer helper needs a separate pitch-array adapter for seventh chords, preserving all four tones; it must never discard the seventh. A shared-tone count is also neither harmonic distance nor functional suitability: C major → A minor has two shared classes, but whether it works as a tonic substitute, vi, or a phrase continuation needs key, bass, rhythm, preceding/following harmony, and style. The existing Garden’s warning that a pivot chord alone does not establish modulation should appear verbatim in the Atlas help. Seventh cards expose *membership* extensions; chord-scale sources describe ninth, eleventh, and thirteenth as possible extensions, not a universal permission to add them.[^chordscales]

## Research lessons, scope, and acceptance

The sources support facts, not product claims. Ableton’s documented input-plus-relative-pitches model informs the familiar note/card interaction; the graph is proposed adaptation.[^ableton] Open Music Theory supports C/Am common tones and distinguishes voice leading from voicing, so Spiral transfer has no false voice-leading score.[^mediants][^glossary] Its chord-scale chapter supports naming extensions, not reharmonization in an unknown context.[^chordscales]

Release one is the fixed catalogue, pins, comparison, extension toggle, shared-tone-only “reharmonization candidates,” and two snapshot transfers. Exclude chord recognition, inversions, slash chords, key detection, playback/MIDI, progression generation, and ranked harmonic distance. Honeycomb remains for P/L/R and pitch constraints; Garden for pivots/key context; Spiral for register and inversion.

Acceptance tests: (1) the default displays C–E–G and, after pinning C/E, A minor with C/E highlighted and “G → A”; (2) C/E pins admit a chord iff both classes occur in its declared offsets; (3) enabling sevenths introduces Am7 and its extra G without changing the source; (4) C3 and C5 are one membership pin but a Spiral copy retains chosen octaves; (5) no empty compatible set crashes; (6) transfers create new studies with source attribution and edits to either copy do not mutate the other; (7) every comparison presents shared/removed/added sets and no functional or distance score.

The main risk is a pretty graph that teaches “more common tones means better progression.” Fixed cards, the comparison text, and the absence of ranking keep that claim bounded, but the explanatory burden is still real. I recommend prioritizing this after or alongside Honeycomb: it reuses its pinning concept, offers an immediately legible novice task, and creates a clean bridge to both Honeycomb and Spiral without pretending to solve reharmonization.

[^ableton]: [Ableton, *Live MIDI Effect Reference*, “Chord”](https://www.ableton.com/en/manual/live-midi-effect-reference/) (official manual; verified 2026-09-17).
[^mediants]: [Mark Gotham, “Mediants,” *Open Music Theory*](https://viva.pressbooks.pub/openmusictheory/chapter/mediants/) (primary instructional text; verified 2026-09-17).
[^glossary]: [“Glossary,” *Open Music Theory*](https://viva.pressbooks.pub/openmusictheorycopy/back-matter/glossary/) (primary instructional text; verified 2026-09-17).
[^chordscales]: [“Chord-Scale Theory,” *Open Music Theory*](https://viva.pressbooks.pub/openmusictheorycopy/chapter/chord-scale-theory/) (primary instructional text; verified 2026-09-17).
