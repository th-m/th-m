# Phrase Journeys — weighted state graph

## Musical question and default experience

**Question:** how can a small collection of phrases make a coherent, changing
journey without pretending that every repeat is a new idea? The familiar
experience is choosing routes through a lead sheet: a verse returns, a response
answers a call, a turnaround leads somewhere else. A directed graph makes those
choices visible before it makes them automatic.

The first canvas opens with **Question / Answer in C**. It has four piano-roll
cards, each one bar of 4/4, with a small spoken-style contour rather than raw
note codes:

| State | Phrase (pitch: beats) | Role |
| --- | --- | --- |
| `call` | C4:1 D4:1 E4:1 G4:1 | opening question |
| `answer` | G4:1 E4:1 D4:1 C4:1 | answering descent |
| `echo` | C5:0.5 G4:0.5 E4:1 D4:1 C4:1 | varied answer |
| `turn` | A3:1 B3:1 D4:1 G3:1 | turnaround |

The route begins at `call`. Its outgoing choices are `answer` (weight 6),
`echo` (weight 3), and `turn` (weight 1). `answer` must go to `call` or
`turn`; `echo` returns to `call`; `turn` returns to `call`. The preview of eight
visits might read **call → answer → call → echo → call → answer → turn → call**.
This makes call/response recognizable in the note contours and legible in the route, while
the loop is controlled rather than accidental.

Nodal's official manual describes a user-defined network with multiple paths and
sequential, parallel, or random outbound selection. [Nodal Manual, pp. 2 and
21](https://nodalmusic.com/downloads/NodalManual.pdf) SuperCollider's `Pfsm`
defines a state as an item plus possible next-state indices, ending at a terminal
state. [Pfsm reference](https://doc.sccode.org/Classes/Pfsm.html) Phrase
Journeys adapts those ideas to editable cards and a silent visual route.

## First minute and interaction

The canvas shows the four piano-roll cards as nodes. An arrow is a possible
next phrase. Arrow thickness is **relative weight**, the label is its integer
weight, and colour marks `continue`, `answer`, `turn`, or `return`. Card width
is total beats; position is movable layout only. Camera and dragging cannot edit
music or a route.

The first-minute path is: read the route; click an arrow to see “6 of 10
eligible weight = 60% *for this decision*”; preview eight visits; then select
`echo` and use **Duplicate phrase**, **Edit notes**, or **Make answer**. The
last proposes pitch inversion around the source's final pitch (`newPitch = 2 × finalPitch − oldPitch`), preserves event order and durations, rejects out-of-range pitches, and shows independent source/result piano rolls before adding an edge.

The inspector separates **Phrase** (name and notes), **Choice** (target, weight,
intent, condition), and **Journey** (start, seed, caps, preview). Adding a
choice is explicit; deleting a card first lists its incoming choices. “Copy as
new journey” takes a deep snapshot with source study/item attribution.

## Model and traversal

The graph is saved musical data; the preview is derived data. A **state** is a
reusable phrase with stable identity. An **event** is one visit at a step; visit
counts/cooldowns belong to traversal state, never the phrase.

```ts
type PhraseState = {
  id: string; name: string; notes: Note[]; maxVisits: number; cooldown: number; terminal: boolean; role: "call" | "answer" | "turn" | "neutral";
};
type Choice = {
  id: string; from: string; to: string; enabled: boolean; weight: number; intent: "continue" | "answer" | "turn" | "return";
  condition?: { kind: "after-role" | "max-visits"; value: string | number };
};
type PhraseJourney = {
  id: string; name: string; states: PhraseState[]; choices: Choice[]; start: string;
  seed: number; rngVersion: string; maxSteps: number; source?: { study: string; item: string };
};
type JourneyEvent = { step: number; stateId: string; choiceId?: string; eligibleChoiceIds: string[] };
type JourneyPreview = { journeyId: string; seed: number; rngVersion: string; events: JourneyEvent[] };
```

IDs are immutable UUIDs; choices reference states by ID, never position or name.
Duplication makes new IDs and copying makes a deep snapshot. Coordinates and
card previews are derived, not musical meaning.

A weight is not a probability. It is a non-negative relative preference among
the **currently eligible** outgoing choices. At each step the algorithm filters
disabled choices, missing targets, zero weights, failed conditions, and a target
that violates its cooldown or maximum visit count. It normalizes the remaining
weights only for that one draw: `p(choice) = weight / sum(eligible weights)`.
Thus “6 of 10” is 60% only for those eligible units. This follows
SuperCollider's `Pwrand`, whose weights determine per-draw probabilities.
[Pwrand reference](https://doc.sccode.org/Classes/Pwrand.html) The UI keeps
integer relations such as 6:3:1 and normalizes per draw.

Controlled repetition uses a per-state visit cap and one- or two-event cooldown,
without an implicit exception for call/answer roles. It permits responses while blocking
`call → call` and `echo → echo` by default. **Make answer** may propose an
answer edge only after a call-role state. A terminal state permits finite work.

The preview uses a specified PRNG and saves its integer seed, algorithm version,
and step cap alongside the resulting event IDs. Same snapshot, seed, and
version must yield the same preview. This is an adaptation of SuperCollider's
`Pseed`, which sets a random generator seed for a stream and demonstrates that a
seed restarts repeatable pseudorandom choices. [Pseed reference](https://doc.sccode.org/Classes/Pseed.html)
Changing the graph or seed deliberately changes the preview; changing layout
does not. A bounded traversal is O(maxSteps × outgoingChoices) with a hard
v1 cap of 64 steps and 32 choices per state. If no eligible choice remains, it
ends with the explainable message “Stopped at *answer*: all next choices are
disabled, capped, cooling down, or have zero weight,” enumerating each reason.

## First release, fit, and acceptance

v1 is one local visual study with card editing, directed choices, seeded
previews, caps/cooldowns, side-by-side answer creation, JSON storage, undo/redo,
and snapshot copy. It uses the existing `Note[]` pitch/duration representation;
a copied motif can start a journey. A future accepted-preview export to Form Map
would create independent phrase occurrences, never a live link.

Exclusions: audio, playback, MIDI/DAW sync, multiple players, note-level chance,
automatic harmonic analysis, and edge-length timing. Nodal's edge-time mapping
and parallel voices are sourced capabilities, not proposed here.

Acceptance: the default example visibly explains all card/arrow encodings; a
fixed seed reproduces the same eight events after reload; a changed seed can
change the route without changing material; a 6:3:1 decision reports its
conditional denominator; cooldown blocks an immediate self-repeat; missing or
ineligible exits stop safely with reasons; duplicating then editing a phrase
does not alter its source; and invalid JSON preserves the current workspace.

Prioritize this **after** the Motif Tree usability repair, or ship it only with
the prepared example and piano-roll cards. It offers a clear composition-level
question and a disciplined bridge from motif variation to form, but an empty
graph would repeat the abstraction problem already observed in Motif Tree.
