import type { Chord, Note, TimedEvent, GesturePoint, JourneyPhrase, JourneyChoice, LandscapeAnchor } from "./model";
export const pc = (n: number) => ((n % 12) + 12) % 12;
export const sharpNames = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];
export const flatNames = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
];
export const pitchName = (n: number, flat = false) =>
  (flat ? flatNames : sharpNames)[pc(n)];
export const noteName = (n: number) =>
  pitchName(n) + String(Math.floor(n / 12) - 1);
export const parseNote = (s: string): number | null => {
  const m = /^([A-Ga-g])([#b]{0,2})(-?\d)$/.exec(s.trim());
  if (!m) return null;
  const value =
    { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1].toUpperCase()]! +
    [...m[2]].reduce(
      (sum, accidental) => sum + (accidental === "#" ? 1 : -1),
      0,
    ) +
    (Number(m[3]) + 1) * 12;
  return value >= 0 && value <= 127 ? value : null;
};
export const intervals = [0, 2, 4, 5, 7, 9, 11];
export const modes = [
  "Ionian",
  "Dorian",
  "Phrygian",
  "Lydian",
  "Mixolydian",
  "Aeolian",
  "Locrian",
];
export function modePcs(root: number, mode: number): number[] {
  return intervals.map((_, i) =>
    pc(root + intervals[(i + mode) % 7] - intervals[mode]),
  );
}
export function spellScale(
  root: number,
  pcs: number[],
  minor = false,
  tonicOverride?: string,
): string[] {
  const tonic =
    tonicOverride ??
    pitchName(
      root,
      [1, 3, 5, 8, 10].includes(root) || (minor && [0, 7].includes(root)),
    );
  const letters = ["C", "D", "E", "F", "G", "A", "B"],
    naturals = [0, 2, 4, 5, 7, 9, 11],
    start = letters.indexOf(tonic[0]);
  return pcs.map((p, i) => {
    const k = (start + i) % 7;
    let delta = pc(p - naturals[k]);
    if (delta > 6) delta -= 12;
    return letters[k] + (delta > 0 ? "#".repeat(delta) : "b".repeat(-delta));
  });
}
export function triadPcs(c: Chord) {
  return [
    c.root,
    pc(c.root + (c.quality === "major" ? 4 : 3)),
    pc(c.root + (c.quality === "dim" ? 6 : 7)),
  ];
}
export const chordRootName = (c: Chord) =>
  pitchName(
    c.root,
    c.quality === "major"
      ? [1, 3, 8, 10].includes(c.root)
      : [3, 10].includes(c.root),
  );
export const chordName = (c: Chord) =>
  chordRootName(c) +
  (c.quality === "minor" ? "m" : c.quality === "dim" ? "°" : "");
export function chordSpellings(c: Chord): string[] {
  const collection = modePcs(
    c.root,
    c.quality === "major" ? 0 : c.quality === "minor" ? 5 : 6,
  );
  return spellScale(
    c.root,
    collection,
    c.quality !== "major",
    chordRootName(c),
  ).filter((_, i) => [0, 2, 4].includes(i));
}
export const chordPitchLabel = (c: Chord, n: number) =>
  chordSpellings(c)[triadPcs(c).indexOf(n)] ?? pitchName(n);
export const chordKey = (c: Chord) => c.root + ":" + c.quality;
export function transformChord(c: Chord, t: "P" | "L" | "R"): Chord {
  const major = c.quality === "major";
  return {
    root: pc(
      c.root + (t === "P" ? 0 : t === "R" ? (major ? -3 : 3) : major ? 4 : -4),
    ),
    quality: major ? "minor" : "major",
  };
}
export function common(a: number[], b: number[]) {
  return a.filter((n) => b.includes(n));
}
export function chordDifference(a: Chord, b: Chord) {
  const x = triadPcs(a),
    y = triadPcs(b);
  return {
    shared: common(x, y),
    removed: x.filter((n) => !y.includes(n)),
    added: y.filter((n) => !x.includes(n)),
  };
}
export function atlasChords(): Chord[] {
  return Array.from({ length: 12 }, (_, root) =>
    (["major", "minor", "dim"] as const).map((quality) => ({ root, quality })),
  ).flat();
}
export const chordContainsPins = (chord: Chord, pins: number[]) =>
  pins.every((pin) => triadPcs(chord).includes(pin));
export function weaveEvents(
  source: TimedEvent[],
  delay: number,
  transpose: number,
  reversed: boolean,
): TimedEvent[] {
  const span = source.reduce((end, event) => Math.max(end, event.start + event.duration), 0);
  return source.map((event, index) => ({
    id: "copy:" + event.id,
    pitch: event.pitch + transpose,
    start: delay + (reversed ? span - event.start - event.duration : event.start),
    duration: event.duration,
    // Keep source order stable for inspection even when a copy is reversed.
    sourceIndex: index,
  }));
}
export function recipeEvents(
  source: Note[],
  repeats: number,
  targetCopy: number,
  transpose: number,
  shortenEnding: number,
): TimedEvent[] {
  const span = totalDuration(source);
  return Array.from({ length: repeats }, (_, copy) => {
    let start = copy * span;
    return source.map((note, index) => {
      const last = index === source.length - 1;
      const duration =
        copy + 1 === targetCopy && last
          ? Math.max(0.125, note.duration - shortenEnding)
          : note.duration;
      const event = {
        id: `copy:${copy + 1}:note:${index + 1}`,
        pitch: note.pitch + (copy + 1 === targetCopy ? transpose : 0),
        start,
        duration,
      };
      start += note.duration;
      return event;
    });
  }).flat();
}
export type GestureSample = {
  id: string;
  start: number;
  duration: number;
  raw: number;
  rounded: number;
  pitch: number;
};
export function gestureSamples(
  points: GesturePoint[],
  sampleStep: number,
  root: number,
  mode: number,
): GestureSample[] {
  const end = points.at(-1)!.beat,
    candidates = Array.from({ length: 128 }, (_, pitch) => pitch).filter((pitch) =>
      modePcs(root, mode).includes(pc(pitch)),
    );
  return Array.from({ length: Math.floor(end / sampleStep) + 1 }, (_, index) => {
    const start = index * sampleStep;
    const right = points.find((point) => point.beat >= start) ?? points.at(-1)!;
    const left = [...points].reverse().find((point) => point.beat <= start) ?? points[0];
    const ratio = left.beat === right.beat ? 0 : (start - left.beat) / (right.beat - left.beat);
    const raw = left.value + (right.value - left.value) * ratio;
    const rounded = Math.floor(raw + 0.5);
    const pitch = candidates.reduce((best, candidate) =>
      Math.abs(candidate - rounded) < Math.abs(best - rounded) ||
      (Math.abs(candidate - rounded) === Math.abs(best - rounded) && candidate > best)
        ? candidate
        : best,
    );
    return { id: `sample:${index}`, start, duration: sampleStep, raw, rounded, pitch };
  });
}
export const gestureNotes = (
  points: GesturePoint[],
  sampleStep: number,
  root: number,
  mode: number,
): Note[] => gestureSamples(points, sampleStep, root, mode).map(({ pitch, duration }) => ({ pitch, duration }));
export function gardenRows(
  seed: boolean[],
  rule: number,
  edgeMode: "fixed-zero" | "cyclic",
  generations: number,
): boolean[][] {
  const rows = [seed];
  for (let generation = 0; generation < generations; generation++) {
    const previous = rows.at(-1)!;
    rows.push(previous.map((_, index) => {
      const read = (offset: number) => {
        const at = index + offset;
        return edgeMode === "cyclic"
          ? previous[pcIndex(at, previous.length)]
          : (previous[at] ?? false);
      };
      const neighborhood = (read(-1) ? 4 : 0) + (read(0) ? 2 : 0) + (read(1) ? 1 : 0);
      return ((rule >> neighborhood) & 1) === 1;
    }));
  }
  return rows;
}
export const gardenHits = (cells: boolean[]) =>
  cells.flatMap((live, index) => (live ? [index] : []));
const seeded = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};
export type JourneyEvent = { step: number; phraseId: string; choiceId?: string; denominator?: number };
export function journeyPreview(
  phrases: JourneyPhrase[],
  choices: JourneyChoice[],
  start: string,
  seed: number,
  steps: number,
): JourneyEvent[] {
  const result: JourneyEvent[] = [], visits = new Map<string, number>(), random = seeded(seed);
  let at = start;
  for (let step = 0; step < steps; step++) {
    result.push({ step, phraseId: at });
    visits.set(at, (visits.get(at) ?? 0) + 1);
    const eligible = choices.filter((choice) => {
      const target = phrases.find((phrase) => phrase.id === choice.to);
      return choice.from === at && choice.weight > 0 && target && (visits.get(target.id) ?? 0) < target.maxVisits;
    });
    const denominator = eligible.reduce((sum, choice) => sum + choice.weight, 0);
    if (!denominator) break;
    let threshold = random() * denominator;
    const choice = eligible.find((candidate) => (threshold -= candidate.weight) < 0) ?? eligible.at(-1)!;
    result.at(-1)!.choiceId = choice.id;
    result.at(-1)!.denominator = denominator;
    at = choice.to;
  }
  return result;
}
export type LandscapePreview = {
  weights: { id: string; name: string; value: number }[];
  activity: number;
  register: number;
  durationScale: number;
  notes: Note[];
};
export function landscapePreview(
  source: Note[], anchors: LandscapeAnchor[], cursor: { x: number; y: number },
): LandscapePreview {
  const exact = anchors.filter((anchor) => anchor.x === cursor.x && anchor.y === cursor.y);
  const raw = exact.length
    ? anchors.map((anchor) => (exact.includes(anchor) ? 1 / exact.length : 0))
    : anchors.map((anchor) => 1 / Math.max(0.0001, (anchor.x - cursor.x) ** 2 + (anchor.y - cursor.y) ** 2));
  const total = raw.reduce((sum, value) => sum + value, 0);
  const weights = anchors.map((anchor, index) => ({ id: anchor.id, name: anchor.name, value: raw[index] / total }));
  const blend = (key: "activity" | "register" | "durationScale") => anchors.reduce((sum, anchor, index) => sum + anchor[key] * weights[index].value, 0);
  const activity = blend("activity"), register = Math.floor(blend("register") + 0.5), durationScale = blend("durationScale");
  const count = Math.max(1, Math.min(source.length, Math.floor(activity * source.length + 0.5)));
  const notes = source.slice(0, count).map((note) => ({
    pitch: note.pitch + register,
    duration: Math.max(0.125, Math.floor(note.duration * durationScale * 8 + 0.5) / 8),
  }));
  return { weights, activity, register, durationScale, notes };
}
export const consonantInterval = (bass: number, soprano: number) =>
  [0, 3, 4, 7, 8, 9].includes(pc(soprano - bass));
export const intervalLabel = (bass: number, soprano: number) => {
  const semitones = Math.abs(soprano - bass), simple = pc(semitones);
  const names: Record<number, string> = { 0: "P8", 3: "m3", 4: "M3", 7: "P5", 8: "m6", 9: "M6" };
  return names[simple] ? (semitones >= 12 && simple !== 0 ? `${names[simple]} + octave` : names[simple]) : `${semitones} semitones`;
};
export const parallelPerfect = (beforeBass: number, beforeSoprano: number, bass: number, soprano: number) => {
  const before = pc(beforeSoprano - beforeBass), after = pc(soprano - bass);
  const bassDirection = Math.sign(bass - beforeBass), sopranoDirection = Math.sign(soprano - beforeSoprano);
  return before === after && [0, 7].includes(after) && bassDirection !== 0 && bassDirection === sopranoDirection;
};
export function counterpointCandidates(
  bass: number[], soprano: number[], anchor: "bass" | "soprano", pins: Record<number, number>, index: number,
): { pitch: number; accepted: boolean; reason: string }[] {
  const fixed = anchor === "bass" ? bass : soprano;
  const domain = anchor === "bass" ? [59, 60, 62, 64, 65, 67, 69, 71] : [43, 45, 47, 48, 50, 52, 53, 55, 57, 59];
  const target = pins[index] === undefined ? domain : [pins[index]];
  return target.map((pitch) => {
    const lower = anchor === "bass" ? fixed[index] : pitch, upper = anchor === "bass" ? pitch : fixed[index];
    if (upper < lower) return { pitch, accepted: false, reason: "voice crossing" };
    if (!consonantInterval(lower, upper)) return { pitch, accepted: false, reason: "vertical dissonance" };
    if (index > 0) {
      const previousBass = anchor === "bass" ? fixed[index - 1] : soprano[index - 1];
      const previousSoprano = anchor === "bass" ? soprano[index - 1] : fixed[index - 1];
      if (parallelPerfect(previousBass, previousSoprano, lower, upper)) return { pitch, accepted: false, reason: "parallel perfect interval" };
    }
    return { pitch, accepted: true, reason: "consonant option" };
  });
}
export function diatonic(root: number, mode: "major" | "minor") {
  const pcs = modePcs(root, mode === "major" ? 0 : 5),
    names = spellScale(root, pcs, mode === "minor");
  return pcs.map((p, i) => {
    const third = pc(pcs[(i + 2) % 7] - p),
      fifth = pc(pcs[(i + 4) % 7] - p),
      quality = fifth === 6 ? "dim" : third === 3 ? "minor" : "major";
    const chord: Chord = { root: p, quality };
    const numeral = ["I", "II", "III", "IV", "V", "VI", "VII"][i];
    return {
      chord,
      name:
        names[i] + (quality === "minor" ? "m" : quality === "dim" ? "°" : ""),
      degree:
        quality === "major"
          ? numeral
          : numeral.toLowerCase() + (quality === "dim" ? "°" : ""),
    };
  });
}
export function pivots(
  a: number,
  am: "major" | "minor",
  b: number,
  bm: "major" | "minor",
) {
  return diatonic(a, am).flatMap((x) =>
    diatonic(b, bm)
      .filter((y) => chordKey(x.chord) === chordKey(y.chord))
      .map((y) => ({
        chord: x.chord,
        name: x.name,
        from: x.degree,
        to: y.degree,
      })),
  );
}
export function evenHits(steps: number, hits: number, rotation = 0): number[] {
  return Array.from({ length: Math.min(steps, hits) }, (_, i) =>
    pcIndex(Math.floor((i * steps) / hits) + rotation, steps),
  ).sort((a, b) => a - b);
}
export const pcIndex = (n: number, size: number) => ((n % size) + size) % size;
export const rotateSteps = (values: number[], amount: number, steps: number) =>
  values.map((n) => pcIndex(n + amount, steps)).sort((a, b) => a - b);
export function transformNotes(
  notes: Note[],
  operation: "transpose" | "invert" | "reverse" | "stretch",
  amount: number,
): Note[] {
  const result = structuredClone(notes);
  if (operation === "reverse") return result.reverse();
  return result.map((n) =>
    operation === "stretch"
      ? { ...n, duration: n.duration * amount }
      : {
          ...n,
          pitch:
            operation === "transpose" ? n.pitch + amount : 2 * amount - n.pitch,
        },
  );
}
export function invertVoicing(pitches: number[], up = true): number[] {
  const n = [...pitches].sort((a, b) => a - b);
  if (up) n.push(n.shift()! + 12);
  else n.unshift(n.pop()! - 12);
  return n.sort((a, b) => a - b);
}
export const totalDuration = (notes: Note[]) =>
  notes.reduce((sum, n) => sum + n.duration, 0);
export function formatNotes(notes: Note[]) {
  return notes.map((n) => noteName(n.pitch) + ":" + n.duration).join(" ");
}
export function parseNotes(text: string): Note[] | null {
  const tokens = text.trim().split(/\s+/);
  if (!text.trim() || tokens.length > 16) return null;
  const notes = tokens.map((t) => {
    const [name, d = "1"] = t.split(":");
    return { pitch: parseNote(name), duration: Number(d) };
  });
  if (
    notes.some(
      (n) =>
        n.pitch === null ||
        !Number.isFinite(n.duration) ||
        n.duration < 0.125 ||
        n.duration > 16,
    )
  )
    return null;
  return notes as Note[];
}

export function spelledNoteName(n: number, spellings?: string[]) {
  const name = spellings?.[pc(n)];
  if (!name) return noteName(n);
  const natural = (
    { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 } as Record<string, number>
  )[name[0]];
  const offset = [...name.slice(1)].reduce(
    (sum, c) => sum + (c === "#" ? 1 : -1),
    0,
  );
  return name + String((n - natural - offset) / 12 - 1);
}
