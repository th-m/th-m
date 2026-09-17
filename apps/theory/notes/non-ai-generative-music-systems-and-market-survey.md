# Non-AI Generative Music: Systems, Methods, and Market Survey

**Source check: September 17, 2026 (UTC).** This note compares 18 tools for
procedural and algorithmic composition. It replaces the imported report's
chat-only citation markers with links to primary sources and separates documented
capabilities from design observations.

Companion: [Algorithmic Music: Generative Methods and Tool Relationships](algorithmic-music-generative-methods-and-tool-relationships.md)
maps the methods and relationships visually and links directly to the profiles
below. The later `deep-research-report.md` attachment is identical to this survey's
original `generative-procedural-music.md` source; a
[verbatim archive](references/non-ai-generative-music-original.txt) preserves it.

## Executive summary

Generative music can come from graph traversal, pattern transformations,
probabilities, symbolic operations, cellular automata, or connected signal
processors. These are different ways of constructing a musical process, not a
single product category. The profiles below identify the documented mechanism
and link to the source that describes it.

Here, **non-AI** means a described workflow that generates musical structure
without requiring a trained generative model. That classification is an inference
from the documented mechanism, not an audit of every dependency, plug-in, or
possible use of a platform. Randomness alone does not establish machine learning.

Wotja explicitly markets itself as “AI-free.” Its own explanation also uses the
phrase “AI techniques & heuristics” for its rule-based engine. Those statements
need attribution and context: they do not support the original report's claim
that Wotja is the only such vendor, or an assertion that it excludes every broad
historical meaning of AI. [Wotja's explanation](https://wotja.com/music/)

For theory, the useful comparison is how each tool exposes musical choices:
networks make routes visible, pattern languages express transformations,
patching environments connect processes, and symbolic systems operate on
compositional structures. This is a design interpretation, not a ranking of
which product is best.

## Scope and technical taxonomy

The categories below are a navigation aid. Several products belong to more than
one family; the profiles below supply the evidence for their placement.

| Family | Tools | Main representation |
| --- | --- | --- |
| Graph and state systems | Nodal, Senode | Musical events and transitions |
| Pattern languages | TidalCycles, Strudel | Transformations of time patterns |
| Procedural and stochastic systems | Wotja, Stochas, Sonic Pi, ChucK, SuperCollider | Rules, programs, timing, and probability |
| Visual dataflow and modular systems | Pure Data, Max, VCV Rack | Connected processing objects or modules |
| Symbolic composition | OpenMusic, Opusmodus, Common Music / Grace | Programs operating on musical structures |
| Cellular automata | WolframTones | Evolving cell patterns mapped to music |
| Spatial scores and executable grids | IanniX, ORCA | Geometry or spatially arranged operators |

**Generation and synthesis are separate capabilities.** A tool may determine
which events occur without producing sound. ORCA and Stochas explicitly need
another sound source. Nodal and Senode can drive MIDI instruments but also have
built-in synthesis. Opusmodus includes synthesis as well as symbolic composition.
See their profiles for the corresponding primary sources.

A few concrete relationships help explain the landscape:

| Relationship | Meaning | Primary source |
| --- | --- | --- |
| TidalCycles → Strudel | Strudel ports the Tidal pattern model to JavaScript. | [Strudel introduction](https://strudel.cc/workshop/getting-started/) |
| TidalCycles → SuperCollider | Tidal normally sends musical events to SuperCollider/SuperDirt for sound. | [TidalCycles](https://tidalcycles.org/) |
| ORCA → external instruments | The desktop program emits MIDI, OSC, or UDP; it is not a synthesizer. | [ORCA README](https://github.com/hundredrabbits/Orca/blob/main/README.md) |
| IanniX → real-time environments | Its graphical score communicates control data over OSC. | [IanniX overview](https://www.iannix.org/en/whatisiannix/) |

## Graph, pattern, and live-coding systems

### Nodal

Nodal represents musical events as nodes and connections as edges. Virtual
players traverse that network; edge length affects travel time, and the network
can be edited while playing. It can use its built-in synthesizer or external
MIDI instruments. [Official overview](https://nodalmusic.com/)

**Distribution:** commercial desktop software. The official site offers a
30-day trial with saving disabled and warns of incompatibility with macOS 14.
The previous report's $59.99 amount was not confirmed in the checked material,
so it is not carried forward. The compatibility warning is the vendor's stated
limit, not a test performed here. [Downloads and trial terms](https://nodalmusic.com/)

**Design observation:** Nodal is a reference for making the relationship between
layout, traversal, and musical timing visible. Its
[tutorials](https://nodalmusic.com/tutorials/) demonstrate the interaction model.

### Strudel

Strudel ports TidalCycles' pattern language to JavaScript. Its browser workshop
introduces live coding, algorithmic composition, and MIDI/OSC sequencing; the
examples combine sound playback with layered musical patterns.
[Official introduction](https://strudel.cc/workshop/getting-started/)

**Distribution:** free/open-source under AGPLv3. Its FAQ discusses AI/LLM use:
the community prioritizes human creativity while use is governed by the license.
That is a community stance, not a technical inability to interact with AI.
[FAQ](https://strudel.cc/learn/faq/),
[license guidance](https://strudel.cc/technical-manual/project-start/)

**Design observation:** playable examples are a useful reference for letting
someone change a musical rule and immediately hear the result. The procedural
workflow described here does not establish a blanket product restriction on AI.

### TidalCycles

TidalCycles is a Haskell-based environment for live coding algorithmic patterns.
It generates sequences of sounds, notes, and parameters and normally works with
SuperCollider for synthesis or MIDI. [Official overview](https://tidalcycles.org/)

**Distribution:** free/open-source. The maintainer-published Tidal 1.10.2 package
identifies GPL-3.0-only licensing. Its tutorials cover composing and transforming
patterns. [Package metadata](https://hackage-content-origin.haskell.org/package/tidal-1.10.2),
[getting-started tutorial](https://tidalcycles.org/docs/getting-started/tutorial/)

**Design observation:** Tidal is a reference for reusable musical transformations
and a language-centered composition workflow.

### SuperCollider

SuperCollider combines a programming language, an IDE, and a real-time synthesis
server for sound synthesis and algorithmic composition. Its tutorials introduce
scheduling, routines, patterns, and sound generation.
[Project overview](https://supercollider.github.io/),
[official tutorial](https://doc.sccode.org/Tutorials/Getting-Started/00-Getting-Started-With-SC.html)

**Distribution:** free/open-source under GPLv3. The project repository is the
source for code and licensing, not a measure of active users.
[Repository](https://github.com/supercollider/supercollider)

**Design observation:** its separation between musical control and real-time
sound rendering is useful architectural context. User-written procedural
workflows do not imply that every possible extension is free of learned models.

### Sonic Pi

Sonic Pi teaches and performs music through code. Its tutorial covers live
loops, chords, scales, randomness, and communication with external equipment.
Random sequences can be repeated using a chosen seed, making variation a
controlled part of a musical program. [Official tutorial](https://sonic-pi.net/tutorial.html)

**Distribution:** free/open-source. The main source is MIT-licensed, but bundled
components have their own licenses; one label should not be applied to the
entire packaged application without checking those components.
[Repository license](https://github.com/sonic-pi-net/sonic-pi/blob/dev/LICENSE.md)

**Design observation:** the combination of short examples, explanations, and
immediate playback is relevant to theory's learning interface.

### ChucK

ChucK is a language for real-time synthesis and music creation. Its strongly
timed model makes time and concurrent processes part of programming, with
support for live changes and interaction through MIDI and OSC.
[Official overview](https://chuck.stanford.edu/)

**Distribution:** free/open-source. The repository states a choice of MIT or
GPL-2.0-or-later licensing for its source.
[Repository license section](https://github.com/ccrma/chuck#license)

**Design observation:** ChucK is a reference for coordinating simultaneous
musical processes with explicit timing. Its
[learning materials](https://chuck.stanford.edu/doc/learn/) provide evidence of
an educational path, not a quantified adoption claim.

### ORCA

ORCA is a spatial live-coding language. Character operators on a grid implement
clocks, delays, arithmetic, random values, Euclidean rhythms, and routing.
The desktop program emits MIDI, OSC, or UDP and explicitly does not synthesize
sound. The browser variant has different output constraints.
[Official README](https://github.com/hundredrabbits/Orca/blob/main/README.md)

**Distribution:** MIT-licensed code; the developer offers name-your-own-price
desktop downloads and separately identifies asset licensing as CC BY 4.0.
[Code license](https://github.com/hundredrabbits/Orca/blob/main/LICENSE.md),
[developer distribution](https://hundredrabbits.itch.io/orca)

**Design observation:** spatial placement can itself express a musical program.
The documented operator workflow supports a procedural classification; it is
not proof about every connected sound generator.

## Visual, symbolic, stochastic, and computational systems

### Pure Data

Pure Data is a patchable environment for real-time synthesis, analysis, and
signal processing. Its manual distinguishes control examples, audio examples,
data structures, and reference patches. Users can assemble musical control
logic and sound generation in the same environment.
[Official manual](https://msp.ucsd.edu/Pd_documentation/1.introduction.htm)

**Distribution:** free software for Linux, macOS, and Windows. Its main source
license is the Standard Improved BSD License, with component and file-level
exceptions. These statements concern the main project, not every fork or
external. [Repository](https://github.com/pure-data/pure-data),
[license](https://github.com/pure-data/pure-data/blob/master/LICENSE.txt)

**Design observation:** patch cords expose the connections between musical
processes. How well large patches remain understandable is a design question,
not a measured limitation established by this survey.

### Max

Max connects objects for interactive software, audio, MIDI, and interfaces.
Its tutorials cover timing, random values, probability, and sequencing; Gen
adds procedural processing within the visual environment.
[Product overview](https://cycling74.com/products/max),
[official tutorials](https://docs.cycling74.com/learn/series/max-tutorials/)

**Distribution:** commercial software with a 30-day trial. At this source check,
the store displayed Max 9 at $399 permanent, $120/year, or $12.99/month.
The permanent option includes 9.x updates; later major upgrades are separate.
These are displayed prices, not a tax-inclusive checkout quote.
[Official store](https://cycling74.com/shop/max)

**Design observation:** Max illustrates a platform for constructing a generator
from smaller processes. A procedural patch can be studied without treating the
entire extensible platform as AI-excluding.

### IanniX

IanniX is a graphical sequencer inspired by Xenakis. Curves, events, and scripted
score construction control real-time environments through OSC. Its main role
is sequencing and control rather than conventional audio synthesis.
[Official overview](https://www.iannix.org/en/whatisiannix/)

**Distribution and maintenance:** free GPLv3 software. The original repository
states that active maintenance has stopped and original-team Apple Silicon
support is not planned. However, it points to a supporting fork, and the official
download page links an Apple Silicon fork and an M1-compatible build. Those
routes were not installed or tested here.
[Original repository](https://github.com/buzzinglight/IanniX),
[official downloads](https://www.iannix.org/en/download-iannix/)

**Design observation:** trajectories and geometry can act as a score. The
maintenance caveat should be applied to the specific repository or build,
not treated as evidence that no compatible version exists.

### OpenMusic

OpenMusic is a Common Lisp-based visual programming environment for
computer-assisted composition. Connected functions and data work with notation,
MIDI piano-roll and sound representations; maquettes organize material in time.
Its tutorials include inversion, transposition, random generation, and recursion.
[Repository](https://github.com/openmusic-project/openmusic),
[project tutorials](https://openmusic-project.github.io/openmusic/doc/Tutorials/)

**Distribution:** free software under GPLv3. The repository separately explains
that development and application delivery use the commercial LispWorks
environment. Source licensing and build-tool requirements are different facts.
[Sources and licensing](https://github.com/openmusic-project/openmusic#sources-and-licensing)

**Design observation:** OpenMusic connects symbolic operations with musical
representations, making it relevant to motif transformation and nested form.

### Opusmodus

Opusmodus combines algorithmic composition, analysis, notation, and playback.
Its documented methods include rule-based, parametric, and stochastic processes.
OMN represents musical parameters, and Common Lisp Music integration provides
synthesis in addition to symbolic composition.
[Composition methods](https://opusmodus.com/algorithmic-composition/),
[audio synthesis](https://opusmodus.com/audio-synthesis/)

**Distribution:** commercial software for macOS and Windows. At this check,
the personal license was £399 permanent or £17/month for 24 months (£408 total),
after which ownership is permanent. Academic and upgrade offers are separate.
The original report's statement that pricing was unavailable is therefore
superseded. [Official pricing](https://opusmodus.com/pricing/)

**Design observation:** this is a reference for carrying generated musical
material through analysis, notation, and playback within one environment.

### Wotja

Wotja describes live generation driven by chance, rules, and heuristics, with
note patterns providing structure. It separates a music engine from an optional
internal audio engine and can generate melodic seeds from text. Its “AI-free”
marketing and broader AI terminology should be read together, as explained
above. [Official music explanation](https://wotja.com/music/)

**Distribution:** the developer-published store listing describes free Lite
access and paid unlocks, with an EULA. Exact prices and recording-use rights are
not generalized here across storefronts, regions, or unlock options.
[Developer's Google Play listing](https://play.google.com/store/apps/details?id=com.intermorphic.WotjaGP)

**Design observation:** Wotja provides a reference for packaging rule-based
variation behind templates and editable controls. Its
[tutorial library](https://wotja.com/tutorials/) is a useful way to inspect that
workflow.

### Stochas

Stochas is a probabilistic MIDI step sequencer. Its controls vary note selection,
event probability, timing, velocity, and duration; layers can use different
meters, speeds, and lengths. It produces no sound itself, so it requires a
separate instrument. [Official introduction](https://stochas.org/stochas/)

**Distribution:** the project documents its move from commercial software to
open source in 2020. The code is GPL-3.0, with releases for Windows, macOS, and
Linux. The website's Creative Commons footer is not the software license.
[Repository](https://github.com/surge-synthesizer/stochas),
[downloads](https://stochas.org/download/)

**Design observation:** it is a reference for making probability directly
editable at the musical-event level.

### Senode

Senode describes a finite-state-machine sequencer with probabilistic steps,
notes or chords per step, and polyphonic emitters. It supports cyclic, random,
round-robin, and one-shot directions, MIDI, and Ableton Link. It also includes
a polysynth, so it belongs in both the control-generation and sound-generation
categories. [Official product page](https://senode.org/)

**Distribution:** the site advertises an iPad standalone app and AUv3 MIDI
plugin. A current price and source-code license were not established in this
check. Its tutorial and example patches are documented features, not evidence
that those patches were tested here. [Product and examples](https://senode.org/)

**Design observation:** its explicit transitions are relevant to making
branching composition paths understandable and playable.

### WolframTones

WolframTones describes mapping the evolution of one-dimensional cellular
automata into musical structures. Its controls expose rule type, rule number,
seed, instrumentation, pitch mapping, and time. This supports a procedural
composition classification.
[How it works](https://tones.wolfram.com/about/how-it-works),
[composition controls](https://tones.wolfram.com/about/controls/)

**Evidence limit:** the official pages' search-indexed text was readable, but
direct extraction returned empty bodies. Wolfram's separately readable overview
also identifies the service and its computational approach. Current playback,
service limits, and output reuse rights were not verified.
[Wolfram overview](https://wolfram.com/wolfram-science/)

**Design observation:** the rule-to-pattern-to-music relationship is relevant
to teaching how simple processes can create complex results.

### VCV Rack

VCV Rack provides virtual modular synthesis, with connected modules producing
musical control and audio. Its product page describes algorithmic and generative
rhythms and melodies, plus MIDI, CV, audio, and additional modules.
[Official Rack overview](https://vcvrack.com/Rack)

**Distribution:** the editions are Rack 2 Free, an open-source standalone app,
and Rack 2 Pro, which also runs as a DAW plug-in. Free source and binaries use
GPL-3.0-or-later with a plug-in exception; assets and commercial licensing have
separate terms. Individual modules can have different licenses and prices.
[Editions](https://vcvrack.com/Rack),
[Rack license](https://github.com/VCVRack/Rack/blob/v2/LICENSE.md)

**Design observation:** modular patching is a reference for exposing how clocks,
control signals, and sound generation interact. A particular procedural patch
does not establish the behavior of every module in the ecosystem.

### Common Music / Grace

Common Music represents musical processes as algorithms. Grace is its graphical
application, using Scheme and SAL for real-time or faster-than-real-time
composition. The author's repository lists MIDI, OSC, Sndlib sound-file, FOMUS,
and CSOUND outputs.
[Project page](https://commonmusic.sourceforge.net/),
[author's Grace repository](https://github.com/ricktaube/grace)

**Licensing and age:** the legacy project page names the
Attribution-NonCommercial-ShareAlike Vizsage Public License, and its visible news
ends in 2014. That statement is specific to that page; licensing for every
version, dependency, and later distribution was not established here.
[Legacy project licensing](https://commonmusic.sourceforge.net/)

**Design observation:** separating musical algorithms from output destinations
is relevant to a system with several ways to hear or display the same material.
The old documentation does not by itself establish current adoption or support.

## Adoption and market positioning

This survey does not establish market share, active-user counts, or comparative
learning difficulty. The imported report's stars, forks, downloads, and ratings
had chat-only references without recoverable dated evidence. Those figures and
the unavailable chart have been removed rather than reattached to unrelated
current pages. Repository stars, app installations, ratings, and paying users
would require separate denominators even with verified measurements.

The following is an interpretation of the linked public materials. It describes
visible positioning, not measured acquisition channels or commercial success.

| Positioning | Examples and evidence | Relevance to theory |
| --- | --- | --- |
| Learning through playable examples | [Strudel workshop](https://strudel.cc/workshop/getting-started/), [Sonic Pi tutorial](https://sonic-pi.net/tutorial.html) | Let explanations and sound respond together. |
| Visual control of a generative process | [Nodal](https://nodalmusic.com/), [Senode](https://senode.org/) | Make routes and alternatives visible. |
| Building an instrument from components | [Max tutorials](https://docs.cycling74.com/learn/series/max-tutorials/), [VCV Rack](https://vcvrack.com/Rack) | Expose how connected processes affect music. |
| Symbolic composition and notation | [OpenMusic tutorials](https://openmusic-project.github.io/openmusic/doc/Tutorials/), [Opusmodus](https://opusmodus.com/algorithmic-composition/) | Keep transformations connected to musical structure. |
| Parameterized, template-driven generation | [Wotja tutorials](https://wotja.com/tutorials/) | Provide an approachable starting point with deeper controls. |
| Probability within sequencing | [Stochas](https://stochas.org/stochas/) | Let users shape variation explicitly. |

## Conclusions for theory

The surveyed workflows provide several possible reference models:

- **Routes and state transitions:** Nodal and Senode.
- **Reusable pattern transformations:** TidalCycles and Strudel.
- **Timed programs and synthesis:** SuperCollider, Sonic Pi, and ChucK.
- **Connected visual processes:** Pure Data, Max, and VCV Rack.
- **Symbolic structure and transformation:** OpenMusic, Opusmodus, and Common Music.
- **Spatial or geometric control:** ORCA and IanniX.
- **Controlled chance and procedural emergence:** Wotja, Stochas, and WolframTones.

These are design leads derived from the cited profiles, not benchmark winners
or commitments to integrate a particular engine. For theory, a useful next
question is how clearly a user can connect an editable rule to an audible result.

The companion [tutorial index](music-tool-tutorials.md) provides practical
starting points for exploring the tools. This survey is a documentation and
source review; no application was installed or runtime-tested for it.
