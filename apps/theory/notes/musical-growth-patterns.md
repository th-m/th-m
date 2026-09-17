I’d build **a family of musical growth patterns**, rather than one universal fractal. Each should answer a different question: *What belongs together? What can follow? How does an idea develop?*

Your references provide two starting structures: **roots with chord-quality branches**, and **keys with related-chord branches**. We can extend those into harmony, rhythm, melody, and musical form.

## 1. Pattern families

These are proposed visual designs built on musical relationships. Some are recursive; others are repeating lattices or cycles rather than strict mathematical fractals.

| Pattern                     | Musical structure and visual growth                                                                                                                                                                                                                                                                                 | Pattern-specific controls                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Interval snowflake**      | Arrange pitch classes around a circle and repeatedly step through an interval. Major thirds produce a three-point cycle; minor thirds produce four points. Each vertex can open another local interval pattern. ([VIVA Pressbooks][1])                                                                              | Starting pitch, interval step, pitch collection, expansion depth.                                 |
| **Voice-leading honeycomb** | A repeating chord lattice. Neighbors represent transformations that retain common notes: C major connects to C minor, A minor, and E minor. Exploring each neighbor reveals another neighborhood. ([arXiv][2])                                                                                                      | Allowed transformations, exploration depth, pinned notes, voicing range.                          |
| **Modulation garden**       | Each key becomes a flower containing its chords. Shared chords become bridges between flowers, exposing potential routes into another key. Pivot-chord modulation provides the musical basis. ([VIVA Pressbooks][3])                                                                                                | Starting and destination keys, permitted modes, pivot rules, maximum route length.                |
| **Rhythm mandala**          | A circle represents a cycle; smaller circles represent subdivisions. Stack rings for different instruments. An optional Euclidean generator distributes a chosen number of hits as evenly as possible across the steps. ([arXiv][4])                                                                                | Cycle length, hit count, rotation, subdivision, accents, layer alignment.                         |
| **Motif tree**              | A short musical idea branches into transformed versions: transposed, pitch-inverted, reversed, or stretched in time. Apply those operations again to descendants. Recursive musical grammars provide an established foundation. ([Monash Users][5])                                                                 | Transformation vocabulary, generations, duration scaling, variation limits, pitch range.          |
| **Register spiral**         | Angle represents pitch class; each revolution represents another octave. A chord’s shape repeats at different registers, while individual notes remain distinguishable—for example, C3 versus C4. ([VIVA Pressbooks][6])                                                                                            | Octave range, inversion, spacing, bass position, whether octaves collapse together.               |
| **Nested form map**         | Sections contain phrases, which contain smaller ideas and motifs. Give recurring material a recognizable visual signature, so repetition and variation remain visible across scales. Musical form supports this hierarchical reading without requiring every piece to have identical levels. ([VIVA Pressbooks][7]) | Section structure, phrase lengths, repetition, contrast, depth, linked versus independent copies. |

**The strongest genuinely recursive candidates are the motif tree, nested rhythm subdivisions, and nested form map.** The others provide complementary ways to navigate musical relationships.

## 2. The meta-options that define the pattern

I’d separate controls that change **musical meaning** from controls that change **presentation**.

| Meta-option                  | What it changes                                                                                                                                       |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Musical context**          | Tonic, scale/mode, tuning system, meter, and allowed chord vocabulary. Establishes the musical world being explored.                                  |
| **Node meaning**             | Whether a point represents a note, chord, specific voicing, rhythm, motif, or phrase.                                                                 |
| **Relationship rule**        | What a connection means: shared notes, interval movement, harmonic function, transformation, rhythmic alignment, or containment.                      |
| **Growth rule**              | Whether expansion means “show neighbors,” “generate variations,” “subdivide time,” or “reveal components.”                                            |
| **Depth and breadth**        | How many generations or neighbors appear. Keep **display limits** separate from limits on generated music.                                            |
| **Identity and equivalence** | Whether repeated chords merge into one node or appear in several contexts; whether octave differences matter; how enharmonic spellings are displayed. |
| **Constraints and anchors**  | Notes, bass lines, rhythms, ranges, destinations, or existing passages that must remain unchanged.                                                    |
| **Traversal policy**         | How the next event is selected: manually, by a recorded path, through weighted suggestions, or by a generative rule.                                  |
| **Visual mapping**           | What angle, distance, size, color, and line weight mean. These meanings should remain consistent within a view.                                       |

The most consequential control is **the relationship rule**. “Nearby” could mean *shares notes*, *requires little finger movement*, or *belongs to a related key*. Those should be different selectable views—not silently mixed into one distance.

## 3. Geometric controls with musical consequences

For each family, give common geometric gestures explicit meanings:

| Gesture or adjustment  | Possible musical meaning                                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Rotate**             | Transpose pitches on a pitch map; shift onset positions on a rhythm map. Keep ordinary camera rotation separate. |
| **Expand outward**     | Reveal more distant relationships, additional octaves, or further generations—depending on the selected pattern. |
| **Mirror**             | Invert melodic pitch movement or reverse a rhythmic pattern, with the operation clearly named.                   |
| **Increase branching** | Permit more transformation types or show more alternatives—not automatically add more simultaneous notes.        |
| **Nest**               | Subdivide a duration, reveal a phrase’s contents, or develop a motif recursively.                                |
| **Overlay**            | Combine simultaneous parts or compare shared material.                                                           |
| **Place sequentially** | Arrange musical events or sections over time.                                                                    |

Two distinctions are essential: **revealing more detail must not silently generate more music**, and **moving the camera must not transpose the composition**.

## 4. How this fits the layered composer

I’d start with **voice-leading honeycomb + rhythm mandala + motif tree**, retaining one dominant combined map with editable layers underneath.

The harmony layer supplies chord choices. The rhythm layer determines when they sound. The motif layer develops melodic material against them. A selected path becomes the composition; the surrounding graph remains the space of alternatives.

For adaptation, expose controls such as **variation amount, rhythmic density, common-note preference, and return-to-home preference**. Let these change suggestions or uncommitted material while preserving locked passages and stable visual landmarks.

**The central design principle: every branch should explain a musical choice, and every path should be playable.**

[1]: https://viva.pressbooks.pub/openmusictheory/chapter/equal-divisions-of-the-octave/ "Equal Divisions of the Octave – Open Music Theory"
[2]: https://arxiv.org/html/2505.08752v3 "Three Tone Networks and a Tessellation"
[3]: https://viva.pressbooks.pub/openmusictheory/chapter/extended-tonicization-and-modulation-to-closely-related-keys/ "Extended Tonicization and Modulation to Closely Related Keys – Open Music Theory"
[4]: https://arxiv.org/abs/0705.4085 "[0705.4085] The Distance Geometry of Music"
[5]: https://users.monash.edu/~jonmc/research/Papers/L-systemsMusic.pdf?utm_source=chatgpt.com "[PDF] Grammar Based Music Composition - Monash University"
[6]: https://viva.pressbooks.pub/openmusictheory/chapter/aspn/ "American Standard Pitch Notation (ASPN) – Open Music Theory"
[7]: https://viva.pressbooks.pub/openmusictheory/chapter/foundational-concepts/ "Foundational Concepts for Phrase-Level Forms – Open Music Theory"
