# Voice-leading Weave — harmony, voice tracing, and substitutions

Status: editable Figma study with five scripted states; audio is not connected.

[Open the interactive study](https://www.figma.com/proto/yviBCbP8XjQzcN2067EgAi/Theory?node-id=13-141&starting-point-node-id=13%3A141).

This adapts the user-supplied [reharm reference](assets/reharm.png) into the
existing [circular composition design](circular-composition-figma-poc.md) and
[bell voice workspace](bell-voice-workspace-figma-poc.md). Reference text is
inspiration, not an authoritative musical specification.

## Interaction model

1. Select a chord to see its function and the exact pitches connecting it to
   the next chord. This study starts with G7 selected.
2. Follow the upper or lower thread to isolate one voice visually. The other
   line dims but stays present as context. Eventual playback would offer solo
   and layer mixing separately from visual focus.
3. Preview replacing G7 with Db7 in bar 2. Show changed bass movement, retained
   guide-tone pitches, and the new spelling before applying anything.
4. Apply the substitution or keep G7. An explicit undo returns to the original.

The editable Figma frames demonstrate those transitions; arbitrary chord
selection, dragging, synthesis, and persistent project state are not implemented.
The Bell workspace link opens its existing fixed example, not a synchronized
performance of the substituted progression.

## Musical example and reference corrections

The four-bar progression is Dm7 → G7 → Cmaj7 → A7; the fifth displayed Dm7 is
the return to bar 1, not an additional bar. Each chord lasts one bar.

| Thread | Pitches, including loop return | Signed movement in semitones |
| --- | --- | --- |
| Upper | F4 → F4 → E4 → E4 → F4 | 0, −1, 0, +1 |
| Lower | C4 → B3 → B3 → C#4 → C4 | −1, 0, +2, −1 |

Travel in a focused inspector is the sum of absolute semitone changes for
that displayed line, including the return: 2 for the upper and 4 for the lower.
It is not a global measure of harmonic quality.

G7 and Db7 share the tritone F–B/Cb. In this particular voicing, F4 falls to E4
and B3 stays on B3 at Cmaj7. Under Db7, the latter pitch is spelled Cb4; in
twelve-tone equal temperament it sounds at the same pitch as B3. The proposed
bass changes from G2 → C3 (+5 semitones) to Db3 → C3 (−1 semitone). Other
voicings could resolve these notes differently.

The reference's B → C# label is corrected to +2 semitones. Its ambiguous E/G
label is replaced by a single identified voice at E4. Upper structures are
deferred: for example, a Bb major triad over G introduces Bb, a tension beyond
plain G7. Any future upper-structure layer should show its actual notes and
resulting extensions rather than imply it is equivalent to the base chord.

## How this would connect to the app

One harmonic progression would own chord identity, onset, duration, and chosen
voicing. A voice would retain an identity across events, with exact pitches and
octaves. The weave would display these musical objects rather than infer them
from the positions of circles. Paths indicate continuity; bar labels indicate
time. A preview would contain a proposed change and its musical differences.

Applying a change would update that shared progression. Generators whose pitch
source is the active chord would follow it; independently captured takes would
stay unchanged unless the user explicitly regenerated or transformed them.
Layer focus, layer audibility, and harmonic edits should remain separate state.

For implementation, the same event model should support playback, the weave,
exact inspectors, piano-roll editing, and undo. Playback can illuminate the
current chord and traversing voices. Richer voicings, constraints on register
or motion, and tension layers can then be added without changing this model.

## Verification

Native Figma screenshots and presentation mode were inspected. Browser clicks
verified upper focus → lower focus → substitution preview → apply → undo, and
preview → keep G7. Both font families match the existing design. Inspectors fit
their panels; guide-note outline contrast and focused-layer selection were
corrected. This is design-flow verification, not audio or engine validation.

Frame IDs are recorded in the [continuation ledger](references/circular-composition-figma-state.json).
