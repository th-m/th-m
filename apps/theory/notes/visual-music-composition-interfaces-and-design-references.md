# Visual Music Composition: Interfaces and Design References

A research map for theory covering visual representations, software, books,
scores, and demonstrations. Imported from `graphical-music.md` and prepared for
Markdown on September 17, 2026 (UTC). The
[original supplied report](references/graphical-music-original.txt) is preserved
verbatim as a text attachment.

## Starting reference: harmony as a network

The saved screenshot identifies itself as *Illustrated Harmony*, page 62,
“Major and Minor Chords.” It presents chord symbols connected by arrows, offering
a reference for exploring possible harmonic paths.

![Major and Minor: a harmonic network from Illustrated Harmony](<assets/major and minor.png>)

The central design question is **what a visual relationship means musically**.
A line might indicate a possible chord transition, shared pitches, a path through
time, a computational dependency, or a trajectory that produces sound. Those
meanings should be explicit within each view.

For theory, a useful cluster to explore is directed chord networks, traversable
musical graphs, Tonnetz lattices, functional-harmony maps, contextual chord
workspaces, and geometric voice-leading spaces. This is a proposed research
focus, not a measured similarity ranking.

## Visual representation patterns

The supplied report contains **24 overlapping representation patterns**. This is
a design taxonomy, not an exhaustive or mutually exclusive classification.
The examples link to source material supporting the described interaction.

| Representation | What the visual elements mean and how they are used | Examples and sources |
| --- | --- | --- |
| Staff / symbolic score | Position and notation encode pitch, duration, articulation, and dynamics; users enter and edit a score. | [MuseScore Studio][musescore], [Dorico][dorico], [Flat][flat] |
| Handwritten score | Pen gestures enter conventional notation, which software interprets and makes editable. | [StaffPad][staffpad] |
| Piano roll | Time and pitch form a plane; note lengths encode duration. Users draw, stretch, and move notes. | [FL Studio piano roll][fl-piano] |
| Step-sequencer grid | Discrete cells represent steps and sounds. Users toggle or edit repeating events. | [FL Studio step sequencer][fl-step] |
| Linear arrangement | Clips, recordings, and sections occupy positions on a song timeline. | [Ableton Arrangement View][ableton-arrangement] |
| Clip / scene matrix | Tracks and launchable clips support combinations that are not fixed to one arrangement timeline. | [Ableton Session View][ableton-session] |
| Tracker / event table | Time runs through rows; columns contain notes, instruments, effects, and parameters. | [Renoise][renoise] |
| Chord chart / harmonic timeline | Chord symbols and bars express harmonic structure without entering every sounding note. | [iReal Pro][ireal], [Hookpad][hookpad] |
| Tonal / functional-harmony map | Position communicates tonal relationships and harmonic function. | [Mapping Tonal Harmony][mdecks] |
| Directed chord-progression graph | Chords are nodes; arrows indicate possible harmonic movements. | [Illustrated Harmony][illustrated-harmony] |
| Traversable musical graph | Players move through connected events; routes and timing generate a sequence. | [Nodal][nodal] |
| Tonnetz / harmonic lattice | Spatial adjacency expresses pitch and triadic relationships; transformations support chord navigation. | [Tonnetz Sequent][tonnetz-sequent], [Audacious Euphony][cohn] |
| Geometric chord / voice-leading space | Chords occupy a mathematical space; a chosen geometry describes relationships between voicings. | [A Geometry of Music][tymoczko] |
| Rhythm circle / polygon | Onsets occupy positions around a repeating cycle; rotations and spacing expose rhythmic relationships. | [The Geometry of Musical Rhythm][toussaint] |
| Patch-cord / dataflow graph | Objects perform operations and connections carry control data or audio. Users build a process. | [Max][max], [Pure Data][pd] |
| Computer-assisted composition graph | Connected functions transform musical structures and generate material. | [OpenMusic][openmusic], [OM#][omsharp] |
| Modular signal-flow canvas | Modules and cables define audio and modulation paths. | [VCV Rack][vcv] |
| Draw-the-sound / graphical synthesis | Lines and shapes specify sound behavior across pitch, time, or other parameters. | [UPIC][upic], [MetaSynth][metasynth] |
| Graphical / indeterminate score | Graphics serve as performance instructions whose interpretation can remain open. | [Notations][notations], [Treatise][treatise] |
| Animated / dynamic score | Visual instructions move or change during performance and can be synchronized between players. | [Decibel ScorePlayer][decibel] |
| Generative spatial playground | Arranging or connecting objects becomes a way to create musical behavior. | [NodeBeat][nodebeat] |
| Trajectory / cursor score | Moving cursors encounter curves or events and produce control information. | [IanniX][iannix] |
| Spectral / image composition | Image position, color, and intensity map to sound parameters. | [MetaSynth Image Synth][metasynth] |
| Context-assisted harmonic workspace | Entered musical material appears alongside suggested continuations or transformations. | [Hookpad][hookpad], [Scaler][scaler] |

A useful design distinction is whether a view emphasizes **musical events**,
**available choices**, **the process generating events**, or **instructions for a
performer**. These roles can overlap: a piano roll can support exploration, and
a graph can represent a finished composition. The representation does not
strictly determine the workflow.

## Software and systems to explore

These are interface references, not recommendations based on market share.
The source report's user counts, forum counts, subscriber totals, and rankings
are retained in the archived original but are not repeated as verified facts.

| Product or system | Visual approach | Useful aspect to study |
| --- | --- | --- |
| [BandLab][bandlab] | Multitrack studio | Organizing recorded and sequenced material in tracks. |
| [FL Studio][fl-piano] | Piano roll, step sequencer, and arrangement | Moving between note, pattern, and song scales. |
| [Flat][flat] | Collaborative staff notation | [Shared editing of structured musical notation][flat-sharing]. |
| [MuseScore Studio][musescore] | Conventional score editor | Editing, reading, and playing back notated music. |
| [iReal Pro][ireal] | Chord charts with accompaniment | Working at the level of harmony and song form. |
| [Hookpad / Hooktheory][hookpad] | Chords, melody, and contextual assistance | Connecting theory explanations with songwriting. |
| [StaffPad][staffpad] | Handwritten notation interpreted as a score | Combining pen input, editing, and playback. |
| [Dorico][dorico] | Structured notation and engraving | Separating musical structure from page presentation. |
| [Ableton Live][ableton-session] | Session clips and Arrangement timeline | Switching between exploratory combinations and a fixed sequence. |
| [Renoise][renoise] | Vertical tracker | Compact, keyboard-oriented event editing. |
| [Scaler 3][scaler] | Chord and scale workspace | Discovering and arranging harmonic material. |
| [Mapping Tonal Harmony Pro / mDecks][mdecks] | Spatial functional-harmony map | Maintaining meaningful locations while navigating harmony. |
| [Max][max] | Connected processing objects | Making computational relationships visible. |
| [Pure Data][pd] | Audio and control patches | Combining musical logic with synthesis. |
| [VCV Rack][vcv] | Virtual modules and cables | Connecting clocks, modulation, sequencing, and sound. |
| [OpenMusic][openmusic] | Visual programs manipulating musical structures | Transformations, recursion, and symbolic composition. |
| [OM#][omsharp] | Computer-assisted composition environment | Graphical programming for musical and audio data; [now developed independently of IRCAM][omsharp-history]. |
| [Nodal][nodal] | Event graphs traversed by virtual players | Making a route through a network audible. |
| [IanniX][iannix] | Curves, triggers, and moving cursors | Connecting geometric motion with events. |
| [MetaSynth][metasynth] | Image-based synthesis | Painting musical and spectral structure. |
| [UPIC / UPIX][upic] | Drawing connected to synthesis | The original graphical system and its later software implementation. |
| [UPISketch][upisketch] | Drawing-based composition | A later continuation of the UPIC approach. |
| [HighC][highc] | Draw-your-music canvas | Sketching sound with a graphical interface; legacy product information. |
| [Decibel ScorePlayer][decibel] / [Score Creator][decibel-creator] | Graphical scores and score-file preparation | Packaging score images and presenting synchronized performance instructions are separate roles. |
| [NodeBeat][nodebeat] | Spatial generators and nodes | Immediate exploration through object placement. |
| [Tonnetz Sequent][tonnetz-sequent] | Discontinued hardware chord-transformation sequencer | Making harmonic transformations direct controls. |

Centre Iannis Xenakis distinguishes **UPIC**, whose first prototype dates to
1977, from **UPIX**, a Windows software version from 2001. They are related
implementations, not interchangeable names. [Institutional history][upic]
UPISketch is a later drawing-based tool that manipulates source sounds and has
desktop and iOS versions. [Project documentation][upisketch]

Dorico's Write/Engrave distinction is sourced to an official 2019 article, not
a current-version compatibility check. HighC's product information is also
historical. The table concerns interaction models rather than current purchasing
advice.

## Books, scores, and historical references

| Work | Why it matters for interface design |
| --- | --- |
| [Brian Calli — Illustrated Harmony][illustrated-harmony] | Chord symbols and arrows provide a vocabulary for possible harmonic paths. This is the source named in the saved reference image. |
| [mDecks — Mapping Tonal Harmony][mdecks-book] | Functional harmony becomes a spatial map that can be studied alongside the app. |
| [Hooktheory I][hooktheory-one] & [II][hooktheory-two] | Visual explanation, playback, and song examples connect theory with musical experience. |
| [Dmitri Tymoczko — A Geometry of Music][tymoczko] | Geometric models provide a way to reason about chords, scales, and voice leading. |
| [Richard Cohn — Audacious Euphony][cohn] | Transformational and voice-leading relationships inform harmonic-network design. |
| [Godfried Toussaint — The Geometry of Musical Rhythm][toussaint] | Rhythms can be studied through spacing, shape, and geometric relationships. |
| [John Cage and Alison Knowles, editors — Notations][notations] | A collection of notational approaches expands the vocabulary beyond conventional staff notation. |
| [Theresa Sauer — Notations 21][notations21] | Contemporary graphic notation offers further examples of musical meaning assigned to visual forms. |
| [Cornelius Cardew — Treatise][treatise] | An extended graphic score invites examination of the relationship between visual structure and performer interpretation. |
| [From Xenakis's UPIC to Graphic Notation Today][upic-book] | Historical and contemporary perspectives on drawing, notation, and computer music. |
| [Iannis Xenakis — UPIC lineage][upic] | A reference for using graphical structures to generate sound, rather than only describe a performance. |

A possible reading order for theory is **Illustrated Harmony → Mapping Tonal
Harmony → geometric harmony and Tonnetz → UPIC → graphic scores**. That order
moves from the current chord-network reference toward more open-ended visual
systems; it is a proposed research sequence, not an external ranking.

## Videos and demonstrations

Pages and embedded video references were checked; full playback was not tested.
Some exact video titles in the original could not be recovered. The table labels
replacement resources and access limits rather than attaching an unrelated link
to the original title.

| Resource | Format and what to study |
| --- | --- |
| [mDecks: Mapping Tonal Harmony demonstrations][mdecks] | Official video hub. Study how the map makes harmonic function and navigation visible. |
| [Brian Calli: Illustrated Harmony accompanying material][illustrated-harmony] | Creator's access page for example videos and interactive material; purchase/login applies. This is not a verified free public video. |
| [Zombie Guitar: 25 Applications of the Tonnetz Chart][tonnetz-lesson] | Creator's video lesson page. Study practical chord movement; some accompanying material is member-only. |
| [Louis Bigo: HexaChord][hexachord] | Creator's written/demo-software resource for Tonnetz visualization and transformations. An alternative to the original's unresolved Tonnetz video titles, not the same video. |
| [Toussaint: rhythm and mathematics research][rhythm-research] | Written research replacing the unverified “Musical Rhythm through the Lens of Geometry” lecture link. Study circular and polygonal rhythm representations. |
| [Centre Iannis Xenakis: UPIC film and exhibition resources][upic-films] | Institutional context for historical film material. This is not a confirmed freely playable copy of the unnamed documentary in the original. |
| [Xenakis: Mycènes Alpha, sound and graphical score][mycenes] | Institutional archive with an embedded video combining sound and UPIC score pages. Compare visual marks with the sounding result. |
| [StaffPad: Writing Music][staffpad-writing] | Official help page with an embedded writing tutorial. Study pen input and the division between writing and touch editing. |
| [Cycling '74: Learn Max][max-learn] | Official learning hub with written tutorials and video links. Study what a patch-cord connection means. |
| [OpenMusic: QuickStart][om-quickstart] | Written steps with video clips for patches and musical applications. Material belongs to the OM 6.6 manual; current interfaces may differ. |
| [Hookpad: video tutorials][hookpad-videos] | Official beginner and songwriting demonstrations. Study chords, melody, and the composition workflow. |
| [Nodal: tutorials and examples][nodal-videos] | Introductory videos and compositions. Study the relationship between graph traversal and playback. |
| [IanniX: official site and showcase][iannix-showcase] | Demonstrations of graphical sequencing. A showcase is not necessarily a step-by-step course. |

The exact sources for the original “300-year-old map of music” video and
“Musical Rhythm through the Lens of Geometry” lecture were not established.
The original Muse *Take a Bow* analysis video was corroborated through other
resources, but a creator-hosted playable source was not confirmed; HexaChord is
linked above as a clearly labeled alternative. These original leads remain in
the archived report for later follow-up.

## Design implications for theory

**Make the meaning of connections visible.** Functional harmony, common-tone
relationships, timing, dataflow, and sound trajectories should not silently share
one generic edge meaning. This is an interpretation of the different models
above, not a rule asserted by every source.

**Explore several scales of musical structure.** One possible design could show
sections, progressions, voicings, and melodic gestures at different levels. A
selected route could define playback while neighboring routes remain available
alternatives. This is a proposal from the supplied report, not an established
market gap or a committed requirement.

**Keep views connected to musical intent.** A score can guide a performer, a
timeline can arrange events, a harmonic map can expose choices, and a patch can
specify how material is generated. A possible direction for theory is to offer
compatible views of shared musical material while preserving these distinctions.

## Source and rendering notes

- The original's 100 chat-only citation markers have been replaced with ordinary
  Markdown source links. The original source identifiers cannot themselves be
  resolved outside the chat that generated them.
- The temporary image URL now points to the screenshot already stored in this
  notes folder. Unicode punctuation and musical names remain normal UTF-8 text.
- Wide tables have been reduced to two or three columns. The 24 representations,
  26 software/system entries, and 11 reading references remain available.
- Popularity numbers and “largest,” “best,” or “commercially validated” conclusions
  are not treated as verified by this import. User counts, projects, forum topics,
  and subscribers are different measures and cannot establish one ranking.
- Source descriptions do not imply that the applications were installed or that
  their current compatibility was tested. Legacy materials are identified where
  relevant.

Related notes: [generative systems survey](non-ai-generative-music-systems-and-market-survey.md),
[tutorial index](music-tool-tutorials.md), and
[musical growth patterns](musical-growth-patterns.md).

[bandlab]: https://help.bandlab.com/hc/en-us/articles/900003878046-Editing-Audio-Regions
[fl-piano]: https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/pianoroll.htm
[fl-step]: https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/channelrack.htm
[flat]: https://help.flat.io/en/music-notation-software/discover-the-interface/
[flat-sharing]: https://help.flat.io/en/music-notation-software/share-collaborate/
[musescore]: https://handbook.musescore.org/basics/entering-notes-and-rests
[ireal]: https://www.irealpro.com/
[hookpad]: https://www.hooktheory.com/support/hookpad
[staffpad]: https://www.staffpad.net/
[dorico]: https://blog.dorico.com/2019/09/introducing-dorico-3-condensing-guitar-notation-and-so-much-more/
[ableton-arrangement]: https://www.ableton.com/en/manual/arrangement-view/
[ableton-session]: https://www.ableton.com/en/manual/session-view/
[renoise]: https://tutorials.renoise.com/wiki/Tracker_Interface
[scaler]: https://scalermusic.com/products/scaler-3/
[mdecks]: https://mdecks.com/mapharmony.phtml
[mdecks-book]: https://mdecks.com/mapharmony.phtml
[illustrated-harmony]: https://briancallimusic.com/en/libro/ai
[nodal]: https://nodalmusic.com/
[tonnetz-sequent]: https://noiseengineering.us/products/tonnetz-sequent/
[tymoczko]: https://www.math.princeton.edu/events/geometry-music-2011-04-12t210004
[cohn]: https://academic.oup.com/book/12064
[toussaint]: https://ressources.ircam.fr/en/flora/the-geometry-of-musical-rhythm-second-edition-50675
[max]: https://docs.cycling74.com/learn/series/max-tutorials/
[pd]: https://msp.ucsd.edu/Pd_documentation/1.introduction.htm
[openmusic]: https://openmusic-project.github.io/openmusic/doc/Tutorials/
[omsharp]: https://github.com/cac-t-u-s/om-sharp
[omsharp-history]: https://www.ircam.fr/fr/recherche/projets/84
[vcv]: https://vcvrack.com/Rack
[upic]: https://centre-iannis-xenakis.org/cix_upic_presentation
[upisketch]: https://www.centre-iannis-xenakis.org/upisketch
[highc]: https://highc.org/
[metasynth]: https://uisoftware.com/metasynth-manual/
[notations]: https://johncage.org/library_entry.cfm?id=16
[treatise]: https://www.cambridge.org/core/journals/tempo/article/abs/cardews-treatise-mainly-the-visual-aspects/0F50D840074D13B082186D8EBC588845
[decibel]: https://decibelnewmusic.com/decibel-scoreplayer/
[decibel-creator]: https://decibelnewmusic.com/decibel-scorecreator/
[nodebeat]: https://www.nodebeat.com/?lang=en
[hooktheory-one]: https://www.hooktheory.com/books/one
[hooktheory-two]: https://www.hooktheory.com/books/two
[notations21]: https://notations21.wordpress.com/drawing-inspiration-from-john-cage%E2%80%99s-notations-notations-21-features-illustrated-musical-scores-from-more-than-160-international-composers-all-of-whom-are-making-amazing-breakthroughs-in-th/
[upic-book]: https://zkm.de/en/from-xenakiss-upic-to-graphic-notation-today
[tonnetz-lesson]: https://www.zombieguitar.com/blog/25-applications-of-the-tonnetz-chart
[hexachord]: https://www.louisbigo.com/hexachord
[rhythm-research]: https://cgm.cs.mcgill.ca/~godfried/research/Web-Paintings/rhythm-and-mathematics.html
[upic-films]: https://www.centre-iannis-xenakis.org/cix_expositions?lang=en
[mycenes]: https://www.centre-iannis-xenakis.org/exhibits/show/expo-upic/mycenes-alpha
[staffpad-writing]: https://staffpad.zendesk.com/hc/en-us/articles/360002335978-Writing-Music
[max-learn]: https://cycling74.com/learn
[om-quickstart]: https://support.ircam.fr/docs/om/om6-manual/co/QuickStart-Chapters.html
[hookpad-videos]: https://www.hooktheory.com/videos
[nodal-videos]: https://nodalmusic.com/tutorials/
[iannix]: https://www.iannix.org/en/whatisiannix/
[iannix-showcase]: https://www.iannix.org/en/
