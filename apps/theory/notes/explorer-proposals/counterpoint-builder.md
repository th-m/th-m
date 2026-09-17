# Counterpoint Builder — pinned voices and explainable domains

Status: proposal only; no model change or solver implementation.

## The musical question

“If I keep this melody note or bass note, what can the other voice do here?” Counterpoint Builder answers with a two-staff, six-note, note-against-note exercise in C major. It should feel like filling an exercise beside a teacher’s marked score.

Its default has a pinned bass and a solved upper voice:

| beat | 1 | 2 | 3 | 4 | 5 | 6 |
| --- | --- | --- | --- | --- | --- | --- |
| bass | C3 | D3 | E3 | F3 | G2 | C3 |
| soprano | C4 | F4 | G4 | A4 | B3 | C4 |
| vertical interval | P8 | m10 | m10 | M10 | M10 | P8 |

All intervals are consonant; the ends are octaves, no perfects move in parallel, and B3 steps to C4. The opening leap is visible and scores lower. This is valid only under this narrow profile.

The first minute shows the two piano-roll lanes and a candidate strip. **Anchor bass** (default) searches soprano choices; **anchor melody** searches bass choices. Click a candidate to edit or pin it: green is possible, amber scores lower, and crossed-out notes name their rejection. **Find 12** enumerates a deterministic sample without changing a pin. The canvas is the piano roll plus constraint edges; the inspector shows pitch, interval, motion, and reasons.

## Proposed model and calculation

The current app stores MIDI pitches and durations in twelve-tone equal temperament. This sketch separates saved music from derived search output:

```ts
type CounterpointEvent = { id: string; onset: number; duration: 1; pitch: number | null };
type CounterpointExercise = {
  id: string; key: { tonic: 0; mode: "major" }; profile: "twoVoiceConsonanceC-v1";
  bass: CounterpointEvent[]; soprano: CounterpointEvent[]; anchor: "bass" | "soprano";
  pins: Record<string, number>; seed: number; source?: { study: string; item: string };
};
type Candidate = { eventId: string; pitch: number; hard: string[]; rank: string[]; score: number };
```

`CounterpointEvent.id` is stable across edits, so pins reference an event rather than an array index. The saved exercise contains authored notes and pins; domains, edges, scores, and results are derived. Applying one result makes an independent snapshot while preserving its source. View state is not musical.

With a bass anchor, each unpinned soprano event begins with the eight diatonic pitches B3–B4, which includes the default B3 at beat 5. With a melody anchor, its accompanying bass domain is the ten diatonic pitches G2–B3, which includes every default bass pitch. The endpoints are fixed at C4/C3. A pin replaces its domain with one exact pitch. The graph has one variable vertex per accompanying event; vertical edges join aligned voices, horizontal edges join adjacent events, and four-event edges check relative motion. This is a finite-domain constraint problem, following Situation’s separation of ordered variable domains and constraints, rather than copying its interface.[^situation] The product adaptation is proposed: Situation documents a general solver, not this curriculum, UI, or rule set.

**Hard constraints in v1** are: in-domain pitches with no crossing; a vertical absolute semitone distance whose pitch class is one of `0, 3, 4, 7, 8, 9` (unison/octave, minor/major third, perfect fifth, minor/major sixth, including compounds); P8 at both ends; a stepwise final soprano arrival on C4; and no parallel perfect intervals. The latter rejects a transition when the before and after vertical pitch classes are equal and belong to `{0, 7}`, and both voices move in the same nonzero direction. A fifth-to-octave transition is not a parallel interval under this predicate; any direct-perfect-motion restriction would be a separate rule. **Ranking preferences** are stepwise upper motion, imperfect consonances, contrary/oblique motion, fewer repeats, and recovery after a large leap. They order valid alternatives and never reject one.

This is a selectable, deliberately simplified subset of a *two-voice strict-counterpoint teaching profile*, not universal musical correctness. MIT’s curriculum frames this as strict note-against-note writing and gives local expectations about consonance, motion, leaps, and cadence; it supports this profile, not all styles.[^mit-assignment][^mit-summary] In particular, the default A4 → B3 descent is 10 semitones, so this v1 only penalizes it; a fuller species profile would add the curriculum’s detailed melodic-leap restrictions before calling the example fully strict. Jazz, non-diatonic harmony, rhythmic dissonance, equal-register voices, and deliberate parallelism need other profiles.

The solver uses time-ordered depth-first backtracking, filtering each candidate when its vertical and preceding transition are known. It stops after exactly 20,000 partial assignments or 12 solutions, so the same exercise, pins, profile, and seed produce the same ordered result set. The default bass-anchor search has four free interior beats and eight pitches each: `8^4 = 4,096` complete upper-line assignments before pruning; the melody-anchor maximum is `10^4 = 10,000`. The browser may yield every 500 assignments and resume, but yielding never changes solver order or the assignment budget. “Budget reached” is distinct from a proven exhausted domain.

An explainable failure is immediate: pin **D4** at beat 2 while the opening C4 is fixed over C3. D4 over D3 is a P8, but C4/C3 → D4/D3 creates parallel octaves. The candidate strip marks D4 “blocked: parallel perfect interval with beat 1”; if that was the only pin-compatible branch, the failure panel identifies those two pins and offers **unpin beat 2**, rather than merely displaying zero results.

## Release boundary and fit

Release one includes one C-major, six-beat, two-voice profile; pins, inspection, deterministic bounded search, same-axis comparison, and JSON snapshots. It excludes audio, MIDI, free rhythm, later species, more voices, style-learning, key inference, and automatic correction.

It complements Voice-leading Honeycomb’s chord-to-chord shared tones and Register Spiral’s spacing: this owns aligned voices over time.

Practical acceptance checks: load the worked example and verify its six interval labels and declared semitone predicates; pin D4 at beat 2 and receive the named parallel-octave explanation; pin any allowed candidate and confirm only the pinned event changes; rerun with the same seed and receive the same ordered results despite browser yields; force the assignment budget and display “incomplete search,” not “impossible”; apply a result and confirm the original exercise remains unchanged.

The risk is a brittle rule checker. A named profile and separate rules/preferences make that visible. Prioritize it after Voice-leading Honeycomb: it answers a temporal-voice question the current explorers do not.

## Sources

[^situation]: IRCAM, [*Situation 3.6* manual](https://support.ircam.fr/docs/om-libraries/old/Situation%203.pdf), pp. 56–58: ordered finite domains, constraints, and partial solutions; supports the proposed separation, not this profile.
[^mit-assignment]: MIT OpenCourseWare, [*Harmony and Counterpoint I*, Assignment 5](https://ocw.mit.edu/courses/21m-301-harmony-and-counterpoint-i-spring-2005/1e2dff536bc156dd3f2f903885c3ff4c_asgnmnt5_twopart.pdf): strict two-part note-against-note exercise and stepwise final tonic approach.
[^mit-summary]: MIT OpenCourseWare, [*Two-voice strict note-against-note summary*](https://ocw.mit.edu/courses/21m-302-harmony-and-counterpoint-ii-spring-2005/0f3cc6a4f19347e46cc3a6d941308c05_quick1spec2voice.pdf): consonance, motion, and leap guidance.
