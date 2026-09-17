# One voice, five views — production controls in theory

Status: editable Figma design and scripted clickable prototype; no audio engine.

[Open the bell voice prototype](https://www.figma.com/proto/yviBCbP8XjQzcN2067EgAi/Theory?node-id=10-53&starting-point-node-id=10%3A53).

This extends the [circular composition POC](circular-composition-figma-poc.md)
and [graphical music language](theory-graphical-music-language.md). It explores
how the production concepts discussed around Wotja, VCV Rack, Max, and Ableton
could fit a coherent interface. These are design adaptations, not a claim of
feature parity or integration with those products.

## The same musical object across five views

The companion [Voice-leading Weave](voice-leading-weave-figma-study.md) explores
the harmonic progression that a chord-following voice would use. A navigation
link connects the two Figma studies; their example data is not synchronized.

| View | Visual language | Utility retained |
| --- | --- | --- |
| Shape | Circular clock with a rhythmic polygon | Cycle length, step placement, rotation, swing, and chord context |
| Inspect | Exact event table and contextual inspector | Onset, velocity, duration, probability, and pitch behavior |
| Rules | Labeled clock → pattern → chance → pitch → voice chain | Visible signal types and an explanation of a rejected hit |
| Sound | Envelope curve and source/filter/space/output cards | Numeric synthesis, effect, and output settings |
| Take | Piano roll with a selected note | A captured result that can be edited independently of its recipe |

The persistent voice strip keeps voice identity, level, pan, mute/solo status,
sound, and capture visible. Those values are illustrative in this prototype.
Circles represent repetition; flow connections represent processing; the grid
represents exact note placement. Each visual form has a musical purpose.

## Concrete example

The bell uses a one-bar, 16-step pattern with events at steps 1, 4, 7, 10, and
13. Step 10 has an independent 60% play probability; the others have 100%.
A rejected event rests and does not advance the ascending pitch index.
Under Dm7, the ordered pitch pool inside C4–B4 is C4, D4, F4, A4.

The rule trace illustrates a draw of 0.72 against a 0.60 threshold. This is a
fixed explanatory example, not a computed seeded result. The captured example
therefore contains C4, D4, F4, A4 at steps 1, 4, 7, and 13. Straight-grid onset
labels accompany a 54% swing setting. The envelope illustration is schematic.

## Clickable interactions

- Switch between all five views of the bell voice.
- Preview a one-step rotation to steps 2, 5, 8, 11, and 14. The probability
  setting follows its event to step 11. Discard restores the original.
- Inspect step 10, then open its underlying chance rule.
- Preview decay changing from 1.8 seconds to 0.8 seconds, then restore it.
- Open the captured example and change F4 to G4, then undo. G4 is an explicit
  manual non-chord tone; the source recipe remains unchanged.

The three edit examples use separate frames. Leaving a preview restores the
canonical state; leaving the edited take resets its example. Numeric fields,
general note dragging, mixing, audio, MIDI export, stochastic generation,
automation, and persistent edits are not implemented. Full production parity
would need additional workflows and implementation validation.

## Design and verification

Eight new native editable frames reuse the original variable palette, action
components, Instrument Serif, and DM Sans. The original four-screen harmonic
flow remains available. Its **Explore bell voice** action enters this study.

The five primary views and three variants were visually inspected through
Figma exports or presentation mode. Browser clicks verified rotation/discard,
Inspect → Rules, Sound → short decay → restore, capture → pitch edit → undo,
and return to Shape. Reaction destinations and inspector bounds were read back
from Figma. These checks validate the design, not musical playback.

The prototype uses a fixed 1440 × 1040 desktop frame. Smaller presentation
windows need Figma's fit-to-window setting; responsive layouts and a full
accessibility review remain implementation work.

Frame IDs and continuation status are in
[the Figma ledger](references/circular-composition-figma-state.json).
