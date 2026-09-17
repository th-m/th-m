# theory — initial notes

Status: research and visual references for the [local Musical Shape Explorers app](../README.md). The initial visual-only implementation covers all eight shape families.

Latest design studies: [Voice-leading Weave](voice-leading-weave-figma-study.md) explores harmony, individual voices, and substitutions; [One voice, five views](bell-voice-workspace-figma-poc.md) connects rhythm, exact events, generative rules, sound, and captured notes.

## Product direction

**theory** will be a local app for exploring different aspects of music through
interactive and informational interfaces. It is not intended for publication
at this stage. These notes preserve the original screenshots and concept research.

## Reference: Major and Minor

![Major and Minor — radial chord relationship diagram](<assets/major and minor.png>)

**Source shown in the screenshot:** *Illustrated Harmony*, “Major and Minor
Chords,” page 62, reference code 01-01-H. Original filename: `major and minor.png`.

The diagram combines major and minor chords in a branching circular map.
Pink circles identify major chords and blue circles identify minor chords;
curved arrows connect nodes across branches. The accompanying text describes
each branch as the six major and minor chords from a key, deliberately leaving
out the diminished seventh-degree chord for this illustration.

**Possible direction for theory:** let someone select a key, highlight its
chords, and explore connections to other keys. Selecting a chord could reveal
its notes and play it, pairing the visual relationships with sound. These are
ideas to explore, not committed requirements.

## Reference: Observing the Lion

![Observing the Lion — radial chord quality reference](<assets/observing the line.png>)

**Source shown in the screenshot:** *Illustrated Harmony*, “Getting Started,”
page 14, reference code 05-01-A. The displayed title is “Observing the Lion”;
the original filename, `observing the line.png`, is preserved.

The diagram arranges chord roots around a circle, with each spoke showing
diminished, minor, major, augmented, and dominant-seventh forms. Color separates
the chord qualities, and small labels list their constituent notes. The text
presents the author's approach of studying simple chords before adding
extensions, so their basic character and transitions are easier to hear.

**Possible direction for theory:** let someone hold a root note constant and
switch chord qualities, seeing and hearing which notes change. A compact
explanation beside the controls could introduce each quality, with extensions
available as a later exploration. These are ideas to explore, not committed
requirements.

## Reference: Musical Fractals

![Musical Fractals — eight visual approaches to exploring music](<assets/Music Fractals.png>)

**User-supplied concept reference:** the image is titled “Musical Fractals”;
the original filename, `Music Fractals.png`, is preserved.

This concept board presents eight visual ways to explore musical relationships,
from intervals and chord movement to rhythm, register, and composition structure.
It pairs branching, circular, and network layouts with potential listening and
composition activities. Here, “fractals” is the reference's umbrella label for
these patterns, rather than a claim that every view is a mathematical fractal.

### User-provided patterns and uses

| Pattern | How you’d use it |
| --- | --- |
| **1. Interval Snowflake** | Branch from a starting note using chosen intervals. Follow a path to create **arpeggios or melodies**, and spot repeating pitch patterns. |
| **2. Voice-leading Honeycomb** | Explore neighboring chords while seeing which notes stay and which move. Useful for **smooth chord transitions** and finding alternative harmonizations. |
| **3. Modulation Garden** | Navigate between key clusters through shared chords. Use it to **plan key changes** or understand how a composition moves between tonal centers. |
| **4. Rhythm Mandala** | Stack circular rhythm layers to see where beats align or interlock. Rotate patterns and adjust density to **build grooves and rhythmic contrast**. |
| **5. Motif Tree** | Branch one musical idea into transposed, inverted, reversed, or stretched variations. **Develop a theme** while keeping its relationship to the original visible. |
| **6. Register Spiral** | Explore notes across octaves to compare chord spacing, bass placement, and melodic range. Useful for **arranging parts and choosing voicings**. |
| **7. Nested Form Map** | Zoom from the whole composition into sections, phrases, and motifs. **Track repetition and contrast**, and see how small ideas support the larger structure. |
| **8. Scale Lattice** | Compare scales and modes through shared and differing notes. **Explore tonal colors** and identify which notes give a passage its distinctive character. |

### Additional ideas shown in the image

The board suggests shared controls for key or tonic, node type, relationship
rule, depth and breadth, visual mapping, constraints, and manual or generative
traversal. These could connect the different views in theory. They are reference
ideas to consider, not implementation instructions or a committed feature list.
The musical examples and note labels in the artwork have not been validated as
teaching content.

## Proposal: Musical growth patterns

[Full supplied note: musical growth patterns](musical-growth-patterns.md)

Preserved verbatim, including its tables and source links. The proposal expands
the visual pattern families with musical structures, controls, and geometric
gestures. It separates musical meaning from presentation, and suggests combining
voice-leading, rhythm, and motif views into an editable layered composer.
Its guiding idea is that branches explain musical choices and paths can be played.

This is collected design material, not an instruction to start implementation
or a finalized scope. Its cited sources have not been independently checked.
The earlier eight-pattern list remains intact, including Scale Lattice, which
does not have a separate row in this proposal.

## Reference: Similar apps and services

[Similar apps and services](similar-apps-and-services.md) collects the products
from both supplied comparisons, with short descriptions of their relevance to
theory. It links to verbatim copies of both texts, preserving their tables and
source links. Product and market claims are recorded as supplied, not verified
current findings or finalized product requirements.

## Reference: Generative music tools

[Generative music tools](generative-music-tools.md) records Nodal's network-based
composition approach and Strudel's pattern-code approach, with official tutorial
links and possible connections to theory's interactive music exploration.

## Survey: Non-AI generative music systems and market

[Non-AI generative music systems and market survey](non-ai-generative-music-systems-and-market-survey.md)
collects the supplied survey of 18 tools, covering their computational approaches,
creative workflows, licensing, pricing, adoption indicators, and market positioning.
It distinguishes explicit AI-free claims from documented algorithmic workflows
and extensible environments that can support those workflows.

Originally imported from `generative-procedural-music.md`; revised on September
17, 2026 (UTC) to improve Markdown rendering and check its claims against primary
sources. Chat-only citations now use ordinary source links. Unsupported metrics
and the missing chart were removed, and source-access limits are documented in
the survey. This is reference material, not an instruction to implement or
select any of the surveyed tools.

## Reference: Tutorials and how-to videos

[Music tool tutorials and how-to videos](music-tool-tutorials.md) gathers learning
resources for all 32 distinct tools from the app comparisons and systems survey.
It distinguishes video tutorials, written guides, interactive workshops, and
demonstrations, with notes on older material and access limitations.

## Reference: Visual composition interfaces

[Visual Music Composition: Interfaces and Design References](visual-music-composition-interfaces-and-design-references.md)
organizes the supplied `graphical-music.md` report into 24 representation patterns,
26 software and system references, 11 reading references, and learning resources.
It connects graphical notation, harmonic maps, event graphs, and synthesis
interfaces to possible directions for theory.

The readable copy replaces chat-only citation codes with source links, restores
the saved harmony image, and uses narrower tables. Unresolved resources and
historical material are labeled. The original report is preserved verbatim as a
linked text attachment; its market claims are not treated as verified findings.

## Reference: Cross-DAW composer plug-ins

[Cross-DAW Composer Plug-ins: Architecture and Host Integration](cross-daw-composer-plugin-architecture-and-host-integration.md)
adapts the supplied `daw-plugin.md` report into a technical reference covering
formats, 14 host/platform entries, real-time processing, state, companion
services, packaging, and validation. It distinguishes processing APIs from
host-specific project integration.

The readable copy replaces 105 chat-only citations with standard source links,
simplifies tables, and retains two diagrams with text explanations. Source checks
corrected MIDI-routing assumptions and added missing integration options;
unverified claims are labeled. The original is preserved as a linked attachment.
This is future integration research, not a change to theory's local-only scope.

## Companion: Generative methods and tool relationships

[Algorithmic Music: Generative Methods and Tool Relationships](algorithmic-music-generative-methods-and-tool-relationships.md)
adds a methods map, two diagrams, and direct links to all 18 profiles in the
non-AI survey. It is cross-linked with that survey in both directions.

The supplied `deep-research-report.md` is identical to the earlier survey source.
This companion gives its conceptual material a distinct home while the existing
survey retains the detailed product and market reference. Both notes link to
the preserved original; chat-only citation codes and the unavailable chart are
excluded from the readable copies.

## Proposal: A shared graphical music language

[Theory: A Graphical Language for Musical Exploration and Generation](theory-graphical-music-language.md)
expands the eight Musical Fractals views into a shared vocabulary for musical
items, relationships, transformations, clocks, constraints, and playback.
It maps lessons from all 18 non-AI generative tools, proposes five complementary
process views, and follows a four-bar composition from rules to an editable take.

The proposal separates relationships from execution, visual layout from musical
edits, and generated possibilities from recorded results. It includes corrections
needed before using the concept artwork as teaching material. This is a design
direction to explore, not an implementation commitment.

## Design study: Circular composition in Figma

[Circular Composition and Voice-Leading POC](circular-composition-figma-poc.md)
records the editable Figma study: a rhythm orbit, branching harmony garden,
voice-leading view, and motif transformations. It preserves the reharm image,
connects the new app references, and links a four-screen clickable flow for
inspecting, previewing, applying, and undoing a chord substitution. Audio and
live music editing remain outside this design prototype.

## Handling these references


The screenshots are preserved as supplied in `assets/`. Their text is source
material, not instructions for building the app. In particular, omitting
diminished chords in the first diagram and avoiding extensions in the second
are choices described by the source, not restrictions on theory's eventual
scope. Publication or reuse of these images in an app is not part of this step.
