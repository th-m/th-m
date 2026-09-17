import { chordPitchLabel, pitchName, transformNotes, noteName } from "./music";
export const families = [
  {
    kind: "snowflake",
    name: "Interval Snowflake",
    short: "Intervals",
    question: "What happens when an interval repeats?",
    color: "#89bcff",
  },
  {
    kind: "honeycomb",
    name: "Voice-leading Honeycomb",
    short: "Voice leading",
    question: "Which notes stay, and which move?",
    color: "#77e1bc",
  },
  {
    kind: "garden",
    name: "Modulation Garden",
    short: "Modulation",
    question: "Where could a shared chord take you?",
    color: "#f0cb7d",
  },
  {
    kind: "mandala",
    name: "Rhythm Mandala",
    short: "Rhythm",
    question: "How do independent rhythms fit together?",
    color: "#bca1ff",
  },
  {
    kind: "motif",
    name: "Motif Tree",
    short: "Motifs",
    question: "How many ways can one idea grow?",
    color: "#f5a9cd",
  },
  {
    kind: "spiral",
    name: "Register Spiral",
    short: "Register",
    question: "How does spacing reshape a chord?",
    color: "#79d3e8",
  },
  {
    kind: "form",
    name: "Nested Form Map",
    short: "Form",
    question: "How do small ideas become a whole?",
    color: "#f1b18d",
  },
  {
    kind: "scale",
    name: "Scale Lattice",
    short: "Scales",
    question: "Which notes give a mode its color?",
    color: "#b9d987",
  },
  {
    kind: "atlas",
    name: "Shared-note Atlas",
    short: "Shared notes",
    question: "Which chords can hold these notes?",
    color: "#5bd9c1",
  },
  {
    kind: "weave",
    name: "Time Weave",
    short: "Time weave",
    question: "How do phrases overlap in time?",
    color: "#8fafff",
  },
  {
    kind: "recipe",
    name: "Pattern Recipes",
    short: "Recipes",
    question: "How was this phrase constructed?",
    color: "#f2bc7d",
  },
  {
    kind: "gesture",
    name: "Gesture Score",
    short: "Gesture",
    question: "How does a drawn contour become notes?",
    color: "#ef9fc6",
  },
  {
    kind: "rhythmGarden",
    name: "Rhythm Garden",
    short: "Rhythm garden",
    question: "What groove can grow from one placed hit?",
    color: "#9dd57a",
  },
  {
    kind: "journey",
    name: "Phrase Journeys",
    short: "Journeys",
    question: "Which route can a small set of phrases take?",
    color: "#86b7ff",
  },
  {
    kind: "landscape",
    name: "Variation Landscape",
    short: "Landscape",
    question: "How can one motif change by a few clear dimensions?",
    color: "#efa6d7",
  },
  {
    kind: "counterpoint",
    name: "Counterpoint Builder",
    short: "Counterpoint",
    question: "Which note can accompany this line under one clear profile?",
    color: "#e8c77f",
  },
] as const;
export type Kind = (typeof families)[number]["kind"];
export type Quality = "major" | "minor" | "dim";
export type Chord = { root: number; quality: Quality };
export type Note = { pitch: number; duration: number };
export type TimedEvent = { id: string; pitch: number; start: number; duration: number };
export type GesturePoint = { id: string; beat: number; value: number };
export type JourneyPhrase = {
  id: string;
  name: string;
  notes: Note[];
  role: "call" | "answer" | "echo" | "turn";
  maxVisits: number;
};
export type JourneyChoice = {
  id: string;
  from: string;
  to: string;
  weight: number;
  intent: "continue" | "answer" | "return" | "turn";
};
export type LandscapeAnchor = {
  id: string;
  name: string;
  x: number;
  y: number;
  activity: number;
  register: number;
  durationScale: number;
};
export type Motif = { id: string; name: string; notes: Note[] };
export type Variation = Motif & { parent: string | null; operation: string };
export type Ring = {
  id: string;
  name: string;
  steps: number;
  hits: number;
  rotation: number;
  bars: number;
  enabled: number[];
  accents: number[];
};
export type Occurrence = { id: string; definition: string };
export type Phrase = { id: string; name: string; occurrences: Occurrence[] };
export type Section = { id: string; name: string; phrases: Phrase[] };
export type Data = {
  snowflake: {
    root: number;
    intervals: number[];
    direction: 1 | -1;
    depth: number;
  };
  honeycomb: {
    root: number;
    quality: "major" | "minor";
    transforms: ("P" | "L" | "R")[];
    depth: number;
    pins: number[];
  };
  garden: {
    root: number;
    mode: "major" | "minor";
    destination: number;
    destinationMode: "major" | "minor";
  };
  mandala: { rings: Ring[]; bpm: number };
  motif: { variations: Variation[] };
  spiral: {
    pitches: number[];
    minOctave: number;
    maxOctave: number;
    spellings?: string[];
  };
  form: { definitions: Motif[]; sections: Section[] };
  scale: {
    root: number;
    relation: "parallel" | "relative";
    a: number;
    b: number;
  };
  atlas: { source: Chord; pins: number[]; selected: Chord };
  weave: {
    source: TimedEvent[];
    delay: number;
    transpose: number;
    reversed: boolean;
  };
  recipe: {
    source: Note[];
    repeats: number;
    targetCopy: number;
    transpose: number;
    shortenEnding: number;
  };
  gesture: {
    points: GesturePoint[];
    sampleStep: 0.25 | 0.5 | 1;
    root: number;
    mode: number;
  };
  rhythmGarden: {
    width: 8 | 16 | 32;
    rule: number;
    edgeMode: "fixed-zero" | "cyclic";
    seed: boolean[];
    generations: number;
    selectedGeneration: number;
  };
  journey: {
    phrases: JourneyPhrase[];
    choices: JourneyChoice[];
    start: string;
    seed: number;
    steps: number;
  };
  landscape: {
    source: Note[];
    anchors: LandscapeAnchor[];
    cursor: { x: number; y: number };
    committed: { id: string; name: string; notes: Note[] }[];
  };
  counterpoint: {
    bass: number[];
    soprano: number[];
    anchor: "bass" | "soprano";
    pins: Record<number, number>;
    inspectBeat: number;
  };
};
export type Study = {
  [K in Kind]: {
    id: string;
    kind: K;
    name: string;
    data: Data[K];
    route: string[];
    source?: { study: string; item: string };
  };
}[Kind];
export type Workspace = { version: 1; studies: Study[]; active: string };
export const uid = () => crypto.randomUUID();
export const seedNotes = (): Note[] =>
  [60, 64, 67, 62].map((pitch) => ({ pitch, duration: 1 }));
/** Examples are editable snapshots; the original is retained unchanged. */
export function motifExamples(original: Variation): Variation[] {
  const axis = original.notes[0].pitch;
  const examples = [
    {
      name: "Move higher",
      operation: "Move up 2 semitones",
      notes: transformNotes(original.notes, "transpose", 2),
    },
    {
      name: "Mirror the melody",
      operation: "Mirror around " + noteName(axis),
      notes: transformNotes(original.notes, "invert", axis),
    },
    {
      name: "Play it backward",
      operation: "Reverse note order",
      notes: transformNotes(original.notes, "reverse", 0),
    },
    {
      name: "Take more time",
      operation: "Double note lengths",
      notes: transformNotes(original.notes, "stretch", 2),
    },
  ];
  return [
    original,
    ...examples
      .filter((v) =>
        v.notes.every(
          (n) =>
            n.pitch >= 0 &&
            n.pitch <= 127 &&
            n.duration >= 0.125 &&
            n.duration <= 16,
        ),
      )
      .map((v) => ({ ...v, id: uid(), parent: original.id })),
  ];
}

export function newStudy<K extends Kind>(kind: K): Extract<Study, { kind: K }> {
  const definition = uid();
  const configs: Data = {
    snowflake: { root: 0, intervals: [4], direction: 1, depth: 3 },
    honeycomb: {
      root: 0,
      quality: "major",
      transforms: ["P", "L", "R"],
      depth: 2,
      pins: [],
    },
    garden: {
      root: 0,
      mode: "major",
      destination: 7,
      destinationMode: "major",
    },
    mandala: {
      bpm: 88,
      rings: [
        ["Kick", 4],
        ["Snare", 2],
        ["Hi-hat", 8],
      ].map(([name, hits], i) => ({
        id: uid(),
        name: String(name),
        steps: 16,
        hits: Number(hits),
        rotation: i === 1 ? 4 : 0,
        bars: 1,
        enabled: Array.from(
          { length: Number(hits) },
          (_, k) =>
            (Math.floor((k * 16) / Number(hits)) + (i === 1 ? 4 : 0)) % 16,
        ),
        accents: [i === 1 ? 4 : 0],
      })),
    },
    motif: {
      variations: motifExamples({
        id: definition,
        name: "Original",
        parent: null,
        operation: "Seed motif",
        notes: seedNotes(),
      }),
    },
    spiral: { pitches: [48, 55, 64, 72], minOctave: 3, maxOctave: 5 },
    form: {
      definitions: [{ id: definition, name: "Motif A", notes: seedNotes() }],
      sections: ["A", "B", "A"].map((name, i) => ({
        id: uid(),
        name: name + (i === 2 ? " return" : ""),
        phrases: [
          {
            id: uid(),
            name: "Phrase 1",
            occurrences: [{ id: uid(), definition }],
          },
        ],
      })),
    },
    scale: { root: 0, relation: "parallel", a: 0, b: 3 },
    atlas: {
      source: { root: 0, quality: "major" },
      selected: { root: 9, quality: "minor" },
      pins: [0, 4],
    },
    weave: {
      source: [
        [60, 0, 0.5],
        [64, 0.5, 0.5],
        [67, 1, 1],
        [62, 2, 0.5],
      ].map(([pitch, start, duration]) => ({ id: uid(), pitch, start, duration })),
      delay: 1,
      transpose: 7,
      reversed: false,
    },
    recipe: {
      source: seedNotes(),
      repeats: 2,
      targetCopy: 2,
      transpose: 2,
      shortenEnding: 0.5,
    },
    gesture: {
      points: [
        [0, 60],
        [1, 64],
        [2, 67],
        [3, 62],
      ].map(([beat, value]) => ({ id: uid(), beat, value })),
      sampleStep: 0.5,
      root: 0,
      mode: 0,
    },
    rhythmGarden: {
      width: 8,
      rule: 90,
      edgeMode: "fixed-zero",
      seed: [false, false, false, true, false, false, false, false],
      generations: 4,
      selectedGeneration: 3,
    },
    journey: (() => {
      const phrases = [
        ["Call", "call", [60, 62, 64, 67]],
        ["Answer", "answer", [67, 64, 62, 60]],
        ["Echo", "echo", [72, 67, 64, 62, 60]],
        ["Turn", "turn", [57, 59, 62, 55]],
      ].map(([name, role, pitches]) => ({
        id: uid(), name: String(name), role: role as JourneyPhrase["role"], maxVisits: 4,
        notes: (pitches as number[]).map((pitch) => ({ pitch, duration: 4 / (pitches as number[]).length })),
      }));
      const [call, answer, echo, turn] = phrases;
      return {
        phrases,
        choices: [
          [call, answer, 6, "answer"], [call, echo, 3, "continue"], [call, turn, 1, "turn"],
          [answer, call, 4, "return"], [answer, turn, 1, "turn"], [echo, call, 1, "return"], [turn, call, 1, "return"],
        ].map(([from, to, weight, intent]) => ({ id: uid(), from: (from as JourneyPhrase).id, to: (to as JourneyPhrase).id, weight: Number(weight), intent: intent as JourneyChoice["intent"] })),
        start: call.id, seed: 7, steps: 8,
      };
    })(),
    landscape: {
      source: seedNotes(),
      anchors: [
        ["Sparse low", 0, 0, 0.5, -12], ["Busy low", 1, 0, 1, -12],
        ["Sparse high", 0, 1, 0.5, 12], ["Busy high", 1, 1, 1, 12],
      ].map(([name, x, y, activity, register]) => ({ id: uid(), name: String(name), x: Number(x), y: Number(y), activity: Number(activity), register: Number(register), durationScale: 1 })),
      cursor: { x: 0.5, y: 0.5 }, committed: [],
    },
    counterpoint: {
      bass: [48, 50, 52, 53, 43, 48],
      soprano: [60, 65, 67, 69, 59, 60],
      anchor: "bass",
      pins: {},
      inspectBeat: 1,
    },
  };
  return {
    id: uid(),
    kind,
    name: families.find((f) => f.kind === kind)!.name,
    data: configs[kind],
    route: [],
  } as unknown as Extract<Study, { kind: K }>;
}
export function initialWorkspace(): Workspace {
  const studies = families.map((f) => newStudy(f.kind));
  return { version: 1, studies, active: studies[0].id };
}
export function duplicateStudy(study: Study): Study {
  return { ...structuredClone(study), id: uid(), name: study.name + " copy" };
}
export function toSpiral(study: Study, chord: Chord, item: string): Study {
  const next = newStudy("spiral");
  next.name = item + " · register";
  next.data.pitches = [
    0,
    chord.quality === "major" ? 4 : 3,
    chord.quality === "dim" ? 6 : 7,
  ].map((n) => 48 + chord.root + n);
  next.data.spellings = Array.from(
    { length: 12 },
    (_, n) => chordPitchLabel(chord, n) || pitchName(n),
  );
  next.source = { study: study.name, item };
  return next;
}
export function toForm(study: Study, motif: Motif): Study {
  const next = newStudy("form"),
    id = uid();
  next.name = motif.name + " · form";
  next.data.definitions = [{ ...structuredClone(motif), id }];
  next.data.sections = [
    {
      id: uid(),
      name: "A",
      phrases: [
        {
          id: uid(),
          name: "Phrase 1",
          occurrences: [{ id: uid(), definition: id }],
        },
      ],
    },
  ];
  next.source = { study: study.name, item: motif.name };
  return next;
}
export function toMotif(study: Study, notes: Note[], item: string): Study {
  const next = newStudy("motif"), id = uid();
  next.name = item + " · motif";
  next.data.variations = [
    {
      id,
      name: item,
      notes: structuredClone(notes),
      parent: null,
      operation: "Copied from Gesture Score",
    },
  ];
  next.source = { study: study.name, item };
  return next;
}
export function toMandala(study: Study, cells: boolean[], item: string): Study {
  const next = newStudy("mandala"), hits = cells.flatMap((live, index) => live ? [index] : []);
  next.name = item + " · rhythm";
  next.data.rings = [{
    id: uid(), name: item, steps: cells.length, hits: hits.length, rotation: 0,
    bars: 1, enabled: hits, accents: hits.slice(0, 1),
  }];
  next.source = { study: study.name, item };
  return next;
}
export function copyOccurrence(
  data: Data["form"],
  phrase: Phrase,
  occ: Occurrence,
  linked: boolean,
) {
  const def = data.definitions.find((d) => d.id === occ.definition)!;
  const id = linked ? def.id : uid();
  if (!linked)
    data.definitions.push({
      ...structuredClone(def),
      id,
      name: def.name + " copy",
    });
  phrase.occurrences.push({ id: uid(), definition: id });
}
export type History = {
  past: Workspace[];
  present: Workspace;
  future: Workspace[];
};
export function commit(h: History, next: Workspace): History {
  return { past: [...h.past, h.present].slice(-80), present: next, future: [] };
}
export function undo(h: History): History {
  return h.past.length
    ? {
        past: h.past.slice(0, -1),
        present: h.past.at(-1)!,
        future: [h.present, ...h.future],
      }
    : h;
}
export function redo(h: History): History {
  return h.future.length
    ? {
        past: [...h.past, h.present],
        present: h.future[0],
        future: h.future.slice(1),
      }
    : h;
}
