# theory — generative music tools

Two references for exploring how musical rules become playable patterns.
The descriptions below come from the official pages; the theory ideas are
design possibilities, not implementation decisions.

## Nodal — composing with networks

Nodal represents musical events as nodes connected by edges. Virtual players
traverse the network and trigger notes; edge length determines travel time
between events. Networks can be edited during playback, with sound provided by
a built-in synthesizer or MIDI instruments. This makes it a reference for a
visual map that actively generates music. [Official overview](https://nodalmusic.com/)

The supplied [tutorials and examples page](https://nodalmusic.com/tutorials/)
lists introductory videos on using Nodal, node types, and synchronization with
Ableton Live, followed by contributed compositions and demonstrations. The page
was reviewed as a tutorial index; the linked videos were not watched.

**Ideas for theory:** make playback paths visible, let users explore branching
musical choices, and show how traversal changes what they hear. If geometric
distance controls timing, explain that relationship explicitly and distinguish
musical edits from purely visual rearrangement.

## Strudel — composing with pattern code

Strudel is a JavaScript port of the Tidal Cycles pattern language for making
music with code. Its introduction describes live coding, algorithmic composition,
teaching, and sequencing external setups through MIDI or OSC. The interactive
workshop does not require prior JavaScript or Tidal knowledge and directs users
to the Strudel REPL for making music. [Getting started](https://strudel.cc/workshop/getting-started/)

The workshop navigation progresses through first sounds, notes, audio effects,
and pattern effects. Its introductory example combines drums, chords, and melody,
providing a reference for layering musical patterns in one composition.
[Workshop introduction](https://strudel.cc/workshop/getting-started/)

**Ideas for theory:** offer small playable patterns with controls for musical
transformations, then let users hear how those transformations interact across
layers. An optional code view could make the underlying rules inspectable.
Studying Strudel does not yet imply embedding it or requiring users to code.

## Comparison for design exploration

| Reference | Main representation | Question for theory |
| --- | --- | --- |
| Nodal | A network traversed by players | How can a visible route generate a musical sequence? |
| Strudel | Code expressing and manipulating patterns | How can a small set of rules create variation across musical layers? |

A possible direction is to connect an understandable visual interface with
explicit musical rules, so users can both hear a result and see how it was
produced. This remains a concept to explore. Neither tool was installed or
tested as part of collecting these references.

Related notes: [musical growth patterns](musical-growth-patterns.md) and
[similar apps and services](similar-apps-and-services.md).
