import { describe, it, expect } from "vitest";
import {
  pc,
  modePcs,
  triadPcs,
  transformChord,
  chordDifference,
  pivots,
  evenHits,
  rotateSteps,
  transformNotes,
  invertVoicing,
  parseNotes,
  spellScale,
  diatonic,
  atlasChords,
  chordContainsPins,
  weaveEvents,
  recipeEvents,
  gestureSamples,
  gestureNotes,
  gardenRows,
  gardenHits,
  journeyPreview,
  landscapePreview,
  consonantInterval,
  parallelPerfect,
  counterpointCandidates,
} from "../src/music";
import {
  newStudy,
  initialWorkspace,
  copyOccurrence,
  toSpiral,
  toForm,
  commit,
  undo,
  redo,
  type History,
} from "../src/model";
import { buildGraph } from "../src/graphs";
import {
  decodeWorkspace,
  saveWorkspace,
  loadWorkspace,
  validateStudy,
} from "../src/storage";
describe("musical relationships", () => {
  it("closes major- and minor-third cycles correctly", () => {
    const s = newStudy("snowflake");
    expect(buildGraph(s).nodes.map((n) => n.label)).toEqual([
      "C",
      "E",
      "G#",
      "C",
    ]);
    s.data.intervals = [3];
    s.data.depth = 4;
    expect(buildGraph(s).nodes.map((n) => n.label)).toEqual([
      "C",
      "D#",
      "F#",
      "A",
      "C",
    ]);
    s.data.direction = -1;
    expect(buildGraph(s).nodes[1].label).toBe("A");
    expect(pc(-1)).toBe(11);
  });
  it("bounds recursive expansion", () => {
    const s = newStudy("snowflake");
    s.data.intervals = [1, 2, 3, 4, 5, 6];
    s.data.depth = 4;
    const g = buildGraph(s);
    expect(g.nodes.length).toBe(256);
    expect(g.notice).toContain("limited");
  });
  it.each(["P", "L", "R"] as const)(
    "%s retains two tones and is involutive",
    (t) => {
      for (let root = 0; root < 12; root++)
        for (const quality of ["major", "minor"] as const) {
          const chord = { root, quality },
            next = transformChord(chord, t);
          expect(chordDifference(chord, next).shared).toHaveLength(2);
          expect(transformChord(next, t)).toEqual(chord);
        }
    },
  );
  it("C major has the specified P/L/R neighbors", () => {
    const c = { root: 0, quality: "major" as const };
    expect(transformChord(c, "P")).toEqual({ root: 0, quality: "minor" });
    expect(transformChord(c, "L")).toEqual({ root: 4, quality: "minor" });
    expect(transformChord(c, "R")).toEqual({ root: 9, quality: "minor" });
  });
  it("uses a minor third in diminished triads", () =>
    expect(triadPcs({ root: 11, quality: "dim" })).toEqual([11, 2, 5]));
  it("builds graph edges only between existing nodes and marks pinned constraints", () => {
    const s = newStudy("honeycomb");
    s.data.depth = 4;
    s.data.pins = [0];
    const g = buildGraph(s);
    expect(g.nodes.some((n) => n.disabled)).toBe(true);
    expect(
      g.edges.every(
        (e) =>
          g.nodes.some((n) => n.id === e.to) &&
          g.nodes.some((n) => n.id === e.from),
      ),
    ).toBe(true);
  });
  it("finds actual shared triads with both key functions", () => {
    expect(
      pivots(0, "major", 7, "major").find((p) => p.name === "Am"),
    ).toMatchObject({ from: "vi", to: "ii" });
    expect(diatonic(9, "minor").map((d) => d.name)).toEqual([
      "Am",
      "B°",
      "C",
      "Dm",
      "Em",
      "F",
      "G",
    ]);
  });
  it("filters the atlas by pitch-class membership without claiming voicing", () => {
    const c = { root: 0, quality: "major" as const };
    const a = { root: 9, quality: "minor" as const };
    expect(atlasChords()).toHaveLength(36);
    expect(chordContainsPins(c, [0, 4])).toBe(true);
    expect(chordContainsPins(a, [0, 4])).toBe(true);
    expect(chordContainsPins({ root: 7, quality: "major" }, [0, 4])).toBe(false);
    expect(chordDifference(c, a)).toEqual({ shared: [0, 4], removed: [7], added: [9] });
  });
  it("derives a delayed follower and a bounded sequential recipe", () => {
    const weave = newStudy("weave");
    expect(weaveEvents(weave.data.source, 1, 7, false).map((event) => [event.pitch, event.start, event.duration])).toEqual([
      [67, 1, 0.5], [71, 1.5, 0.5], [74, 2, 1], [69, 3, 0.5],
    ]);
    const reverse = weaveEvents(weave.data.source, 1, 7, true);
    expect(reverse.map((event) => event.start)).toEqual([3, 2.5, 1.5, 1]);
    const recipe = newStudy("recipe");
    const generated = recipeEvents(recipe.data.source, 2, 2, 2, 0.5);
    expect(generated.map((event) => [event.pitch, event.start, event.duration])).toEqual([
      [60, 0, 1], [64, 1, 1], [67, 2, 1], [62, 3, 1],
      [62, 4, 1], [66, 5, 1], [69, 6, 1], [64, 7, 0.5],
    ]);
  });
  it("samples a linear gesture with explicit rounding and scale snapping", () => {
    const gesture = newStudy("gesture");
    const samples = gestureSamples(
      gesture.data.points,
      gesture.data.sampleStep,
      gesture.data.root,
      gesture.data.mode,
    );
    expect(samples.map((sample) => sample.raw)).toEqual([60, 62, 64, 65.5, 67, 64.5, 62]);
    expect(samples.map((sample) => sample.rounded)).toEqual([60, 62, 64, 66, 67, 65, 62]);
    expect(samples.map((sample) => sample.pitch)).toEqual([60, 62, 64, 67, 67, 65, 62]);
    expect(gestureNotes(gesture.data.points, 0.5, 0, 0)).toHaveLength(7);
  });
  it("grows Rule 90 rows and keeps a captured onset row independent", () => {
    const rows = gardenRows([false, false, false, true, false, false, false, false], 90, "fixed-zero", 3);
    expect(rows.map((row) => row.map((cell) => +cell).join(""))).toEqual(["00010000", "00101000", "01000100", "10101010"]);
    expect(gardenHits(rows[3])).toEqual([0, 2, 4, 6]);
    expect(gardenRows([true, false, false, false, false, false, false, false], 90, "fixed-zero", 1)[1]).not.toEqual(gardenRows([true, false, false, false, false, false, false, false], 90, "cyclic", 1)[1]);
  });
  it("replays weighted phrase choices from the saved seed", () => {
    const journey = newStudy("journey"), { phrases, choices, start, seed, steps } = journey.data;
    expect(journeyPreview(phrases, choices, start, seed, steps)).toEqual(journeyPreview(phrases, choices, start, seed, steps));
    expect(journeyPreview(phrases, choices, start, seed, steps)).toHaveLength(steps);
  });
  it("blends the Landscape centre into three original-register events", () => {
    const landscape = newStudy("landscape"), preview = landscapePreview(landscape.data.source, landscape.data.anchors, landscape.data.cursor);
    expect(preview.weights.map((weight) => weight.value)).toEqual([0.25, 0.25, 0.25, 0.25]);
    expect(preview.activity).toBe(0.75);
    expect(preview.register).toBe(0);
    expect(preview.notes.map((note) => note.pitch)).toEqual([60, 64, 67]);
  });
  it("identifies consonance and named parallel-perfect rejection", () => {
    expect(consonantInterval(48, 60)).toBe(true);
    expect(parallelPerfect(48, 60, 50, 62)).toBe(true);
    const counterpoint = newStudy("counterpoint");
    const blocked = counterpointCandidates(counterpoint.data.bass, counterpoint.data.soprano, "bass", { 1: 62 }, 1)[0];
    expect(blocked).toMatchObject({ accepted: false, reason: "parallel perfect interval" });
  });
  it("spells diatonic collections using letters rather than pitch-class shortcuts", () => {
    expect(spellScale(5, modePcs(5, 0))).toEqual([
      "F",
      "G",
      "A",
      "Bb",
      "C",
      "D",
      "E",
    ]);
    expect(spellScale(6, modePcs(6, 0))).toEqual([
      "F#",
      "G#",
      "A#",
      "B",
      "C#",
      "D#",
      "E#",
    ]);
  });
  it("distributes and rotates rhythms while preserving hit count", () => {
    expect(evenHits(16, 5)).toEqual([0, 3, 6, 9, 12]);
    expect(rotateSteps(evenHits(16, 5), 2, 16)).toEqual([2, 5, 8, 11, 14]);
    expect(evenHits(16, 0)).toEqual([]);
    for (let steps = 2; steps <= 48; steps++)
      for (let hits = 0; hits <= steps; hits++) {
        const result = evenHits(steps, hits, steps - 1);
        expect(new Set(result).size).toBe(hits);
        expect(result.every((n) => n >= 0 && n < steps)).toBe(true);
      }
  });
  it("calculates rhythm coincidence across independent cycle lengths", () => {
    const s = newStudy("mandala");
    s.data.rings[1].bars = 2;
    const n = buildGraph(s).nodes.find(
      (n) => n.meta?.ring === s.data.rings[0].id && n.meta.step === 0,
    )!;
    expect(n.detail).toContain("Kick, Hi-hat");
    expect(n.detail).not.toContain("Snare");
  });
  it("transforms motif snapshots without mutating the parent", () => {
    const source = [
      { pitch: 60, duration: 1 },
      { pitch: 64, duration: 0.5 },
    ];
    expect(transformNotes(source, "transpose", 7)).toEqual([
      { pitch: 67, duration: 1 },
      { pitch: 71, duration: 0.5 },
    ]);
    expect(transformNotes(source, "invert", 60)[1].pitch).toBe(56);
    expect(transformNotes(source, "reverse", 0)).toEqual([...source].reverse());
    expect(transformNotes(source, "stretch", 2)[1].duration).toBe(1);
    expect(source[1]).toEqual({ pitch: 64, duration: 0.5 });
  });
  it("parses note edits and rejects invalid ranges", () => {
    expect(parseNotes("C4:1 Eb4:0.5")).toEqual([
      { pitch: 60, duration: 1 },
      { pitch: 63, duration: 0.5 },
    ]);
    expect(parseNotes("H4:1")).toBeNull();
    expect(parseNotes("C4:NaN")).toBeNull();
  });
  it("inverts voicings by moving actual octaves", () => {
    expect(invertVoicing([60, 64, 67])).toEqual([64, 67, 72]);
    expect(invertVoicing([60, 64, 67], false)).toEqual([55, 60, 64]);
    const s = newStudy("spiral");
    s.data.pitches = [60, 67, 64];
    expect(buildGraph(s).notice).toContain("1 voice crossings");
  });
  it("distinguishes parallel and relative modes", () => {
    expect(modePcs(0, 0)).not.toEqual(modePcs(0, 3));
    const base = modePcs(0, 0);
    for (let i = 0; i < 7; i++)
      expect(modePcs(base[i], i).sort((a, b) => a - b)).toEqual(
        [...base].sort((a, b) => a - b),
      );
  });
});
describe("studies and persistence", () => {
  it("all presets produce valid studies and finite geometry", () => {
    for (const s of initialWorkspace().studies) {
      expect(validateStudy(s)).toBe(true);
      const g = buildGraph(s);
      expect(g.nodes.length).toBeGreaterThan(0);
      expect(g.nodes.length).toBeLessThanOrEqual(256);
      expect(
        g.nodes.every((n) => Number.isFinite(n.x) && Number.isFinite(n.y)),
      ).toBe(true);
    }
  });
  it("copies chords to the spiral with provenance", () => {
    const s = newStudy("honeycomb"),
      next = toSpiral(s, { root: 11, quality: "dim" }, "B diminished");
    expect(next.kind).toBe("spiral");
    if (next.kind === "spiral") expect(next.data.pitches).toEqual([59, 62, 65]);
    expect(next.source?.study).toBe(s.name);
  });
  it("transfers motif copies without a live dependency", () => {
    const s = newStudy("motif"),
      f = toForm(s, s.data.variations[0]);
    s.data.variations[0].notes[0].pitch = 70;
    if (f.kind === "form") {
      expect(f.data.definitions[0].notes[0].pitch).toBe(60);
      expect(f.data.sections[0].phrases[0].occurrences[0].definition).toBe(
        f.data.definitions[0].id,
      );
    }
  });
  it("linked form copies share changes while independent copies do not", () => {
    const s = newStudy("form"),
      d = s.data,
      p = d.sections[0].phrases[0],
      original = p.occurrences[0];
    copyOccurrence(d, p, original, true);
    copyOccurrence(d, p, original, false);
    d.definitions[0].notes[0].pitch = 65;
    expect(p.occurrences[1].definition).toBe(original.definition);
    expect(
      d.definitions.find((m) => m.id === p.occurrences[2].definition)!.notes[0]
        .pitch,
    ).toBe(60);
    expect(
      buildGraph(s).nodes.find((n) => n.id === original.id)!.detail,
    ).toContain("4 linked occurrences");
  });
  it("collapse changes the view, not the musical document", () => {
    const s = newStudy("form"),
      before = JSON.stringify(s),
      full = buildGraph(s);
    expect(buildGraph(s, [s.data.sections[0].id]).nodes.length).toBeLessThan(
      full.nodes.length,
    );
    expect(JSON.stringify(s)).toBe(before);
  });
  it("undo/redo restores independent study settings", () => {
    const w = initialWorkspace(),
      next = structuredClone(w);
    next.studies[0].name = "Changed";
    const h: History = { past: [], present: w, future: [] };
    const updated = commit(h, next);
    expect(undo(updated).present).toEqual(w);
    expect(redo(undo(updated)).present).toEqual(next);
    expect(commit(undo(updated), w).future).toEqual([]);
  });
  it("round-trips versioned backups", () => {
    const w = initialWorkspace();
    expect(decodeWorkspace(JSON.stringify(w))).toEqual(w);
  });
  it("rejects malformed data, broken references and recursive cycles", () => {
    expect(() => decodeWorkspace("{}")).toThrow();
    const w = initialWorkspace(),
      s = w.studies.find((s) => s.kind === "motif")!;
    if (s.kind === "motif")
      s.data.variations[0].parent = s.data.variations[0].id;
    expect(() => decodeWorkspace(JSON.stringify(w))).toThrow();
    const x = initialWorkspace(),
      f = x.studies.find((s) => s.kind === "form")!;
    if (f.kind === "form")
      f.data.sections[0].phrases[0].occurrences[0].definition = "missing";
    expect(() => decodeWorkspace(JSON.stringify(x))).toThrow();
  });
  it("rejects dangerous numerical and size inputs", () => {
    const w = initialWorkspace(),
      s = w.studies[0];
    if (s.kind === "snowflake") s.data.depth = 99;
    expect(() => decodeWorkspace(JSON.stringify(w))).toThrow();
    expect(() => decodeWorkspace("x".repeat(50_000_001))).toThrow();
  });
  it("handles unavailable storage without losing the current workspace", () => {
    const w = initialWorkspace();
    expect(
      saveWorkspace(
        {
          setItem: () => {
            throw Error("quota");
          },
        },
        w,
      ),
    ).toContain("session is intact");
    expect(loadWorkspace({ getItem: () => "{bad" }).error).toContain(
      "not been overwritten",
    );
  });
});

it("round-trips transfers for every triad spelling, including double accidentals", () => {
  for (let root = 0; root < 12; root++) {
    for (const quality of ["major", "minor", "dim"] as const) {
      const study = toSpiral(newStudy("honeycomb"), { root, quality }, "Chord");
      expect(validateStudy(study)).toBe(true);
      expect(
        decodeWorkspace(
          JSON.stringify({ version: 1, active: study.id, studies: [study] }),
        ).studies[0],
      ).toEqual(study);
    }
  }
});

it("seeds a readable motif family with independent snapshots", () => {
  const study = newStudy("motif");
  const [original, higher, mirrored, reverse, longer] = study.data.variations;
  expect(study.data.variations).toHaveLength(5);
  expect(
    study.data.variations.slice(1).every((v) => v.parent === original.id),
  ).toBe(true);
  expect(higher.notes.map((n) => n.pitch)).toEqual([62, 66, 69, 64]);
  expect(mirrored.notes.map((n) => n.pitch)).toEqual([60, 56, 53, 58]);
  expect(reverse.notes.map((n) => n.pitch)).toEqual([62, 67, 64, 60]);
  expect(longer.notes.map((n) => n.duration)).toEqual([2, 2, 2, 2]);
  longer.notes[0].pitch = 80;
  expect(original.notes[0].pitch).toBe(60);
});
