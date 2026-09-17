import type { Chord, Note } from "./model";
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
