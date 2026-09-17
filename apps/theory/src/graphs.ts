import { type Study, type Chord, type Motif, type Data } from "./model";
import {
  pc,
  pitchName,
  noteName,
  spelledNoteName,
  triadPcs,
  chordName,
  chordSpellings,
  chordPitchLabel,
  chordKey,
  transformChord,
  chordDifference,
  diatonic,
  pivots,
  modePcs,
  modes,
  spellScale,
  common,
  totalDuration,
} from "./music";
export type GNode = {
  id: string;
  label: string;
  sub?: string;
  detail: string;
  x: number;
  y: number;
  r?: number;
  tone?: number;
  chord?: Chord;
  motif?: Motif;
  meta?: {
    ring?: string;
    step?: number;
    variation?: string;
    section?: string;
    phrase?: string;
    occurrence?: string;
    definition?: string;
    noteIndex?: number;
    mode?: number;
  };
  shape?: "rect" | "hex";
  disabled?: boolean;
};
export type GEdge = {
  id: string;
  from: string;
  to: string;
  label: string;
  detail: string;
  dashed?: boolean;
};
export type Graph = {
  nodes: GNode[];
  edges: GEdge[];
  notice: string;
  legend: string;
  circles?: { x: number; y: number; r: number; label: string }[];
};
const polar = (angle: number, r: number, cx = 440, cy = 330) => ({
  x: cx + Math.cos(angle) * r,
  y: cy + Math.sin(angle) * r,
});
const edge = (
  from: string,
  to: string,
  label: string,
  detail: string,
  dashed = false,
): GEdge => ({
  id: from + ">" + to + ":" + label,
  from,
  to,
  label,
  detail,
  dashed,
});
const blank = (legend: string): Graph => ({
  nodes: [],
  edges: [],
  notice: "",
  legend,
});
const signed = (n: number) => (n > 0 ? "+" : "") + n;
export function buildGraph(s: Study, collapsed: string[] = []): Graph {
  switch (s.kind) {
    case "snowflake": {
      const g = blank(
          "Items: pitch classes · Links: interval steps · Dashed: cycle closure",
        ),
        d = s.data;
      g.nodes.push({
        id: "root",
        label: pitchName(d.root),
        sub: "START",
        detail: "Starting pitch class " + pitchName(d.root),
        x: 440,
        y: 330,
        r: 38,
        tone: 0,
      });
      const queue = [
        {
          id: "root",
          pitch: d.root,
          depth: 0,
          history: [d.root],
          x: 440,
          y: 330,
          angle: -Math.PI / 2,
          span: Math.PI * 2,
        },
      ];
      let omitted = 0;
      for (let q = 0; q < queue.length; q++) {
        const p = queue[q];
        if (p.depth >= d.depth) continue;
        for (let j = 0; j < d.intervals.length; j++) {
          if (g.nodes.length >= 256) {
            omitted++;
            continue;
          }
          const delta = d.intervals[j] * d.direction,
            n = pc(p.pitch + delta),
            closed = p.history.includes(n),
            id = p.id + "." + j;
          const span = p.span / d.intervals.length,
            angle = p.angle - p.span / 2 + span * (j + 0.5);
          const radius = 145 * (p.depth + 1),
            x = 440 + Math.cos(angle) * radius,
            y = 330 + Math.sin(angle) * radius;
          g.nodes.push({
            id,
            label: pitchName(n),
            sub: closed ? "CYCLE" : `DEPTH ${p.depth + 1}`,
            x,
            y,
            r: Math.max(12, 31 - p.depth * 5),
            tone: p.depth + 1,
            detail: `${pitchName(p.pitch)} ${signed(delta)} semitones → ${pitchName(n)}. ${closed ? "This pitch class already appears on this branch; the cycle closes." : "A new pitch class on this branch."}`,
          });
          g.edges.push(
            edge(
              p.id,
              id,
              signed(delta),
              `${signed(delta)} semitones, modulo 12: (${p.pitch} ${signed(delta)} + 12) mod 12 = ${n}.`,
              closed,
            ),
          );
          if (!closed)
            queue.push({
              id,
              pitch: n,
              depth: p.depth + 1,
              history: [...p.history, n],
              x,
              y,
              angle,
              span,
            });
        }
      }
      g.notice = omitted
        ? `Display limited to 256 nodes; ${omitted} immediate alternatives hidden.`
        : "Repeated pitch classes close a branch. Expansion reveals relationships, not new events.";
      return g;
    }
    case "honeycomb": {
      const g = blank(
          "Items: triads · Links: P / L / R transformations · Hexagons: chord neighborhoods",
        ),
        d = s.data;
      const root: Chord = { root: d.root, quality: d.quality };
      const key = chordKey(root),
        positions = new Set(["0,0"]);
      const queue = [{ chord: root, depth: 0, q: 0, r: 0 }],
        seen = new Set([key]);
      const dirs = [
        [1, 0],
        [0, 1],
        [-1, 1],
        [-1, 0],
        [0, -1],
        [1, -1],
      ];
      for (let i = 0; i < queue.length; i++) {
        const p = queue[i],
          id = chordKey(p.chord);
        const blocked = d.pins.some((pin) => !triadPcs(p.chord).includes(pin));
        g.nodes.push({
          id,
          label: chordName(p.chord),
          sub: chordSpellings(p.chord).join(" · "),
          detail: `${chordName(p.chord)}: ${chordSpellings(p.chord).join(", ")}.${blocked ? " Blocked: does not contain every pinned pitch class." : ""}`,
          x: 440 + p.q * 145 + p.r * 72.5,
          y: 330 + p.r * 125,
          shape: "hex",
          r: 45,
          chord: p.chord,
          disabled: blocked,
          tone: p.depth,
        });
        if (p.depth >= d.depth || blocked) continue;
        for (const [j, t] of d.transforms.entries()) {
          const next = transformChord(p.chord, t),
            nk = chordKey(next),
            diff = chordDifference(p.chord, next);
          if (
            !g.edges.some(
              (e) =>
                (e.from === id && e.to === nk) ||
                (e.to === id && e.from === nk),
            )
          )
            g.edges.push(
              edge(
                id,
                nk,
                t,
                `${{ P: "Parallel", R: "Relative", L: "Leading-tone" }[t]}: retain ${diff.shared.map((n) => chordPitchLabel(p.chord, n)).join(", ")}; ${diff.removed.map((n) => chordPitchLabel(p.chord, n)).join(", ")} → ${diff.added.map((n) => chordPitchLabel(next, n)).join(", ")}.`,
              ),
            );
          if (!seen.has(nk)) {
            let spot: { q: number; r: number } | undefined;
            for (let k = 0; k < 6; k++) {
              const [dq, dr] = dirs[(j * 2 + k) % 6],
                q = p.q + dq,
                r = p.r + dr;
              if (!positions.has(q + "," + r)) {
                spot = { q, r };
                break;
              }
            }
            if (!spot)
              spot = {
                q: (queue.length % 6) - 3,
                r: Math.floor(queue.length / 6) + 2,
              };
            positions.add(spot.q + "," + spot.r);
            seen.add(nk);
            queue.push({ chord: next, depth: p.depth + 1, ...spot });
          }
        }
      }
      g.notice = d.pins.length
        ? "Pinned pitch classes constrain traversal. Blocked alternatives remain visible."
        : "Select adjacent triads to build a route. P, L, and R each retain two pitch classes.";
      return g;
    }
    case "garden": {
      const g = blank("Items: diatonic triads · Bridges: shared pivot chords"),
        d = s.data;
      const keys = [
        { root: d.root, mode: d.mode, cx: 230 },
        { root: d.destination, mode: d.destinationMode, cx: 650 },
      ];
      keys.forEach((key, k) => {
        g.nodes.push({
          id: "key" + k,
          label:
            spellScale(
              key.root,
              modePcs(key.root, key.mode === "major" ? 0 : 5),
              key.mode === "minor",
            )[0] +
            " " +
            key.mode,
          sub: k ? "DESTINATION" : "SOURCE",
          detail: `${pitchName(key.root)} ${key.mode}; ${key.mode === "minor" ? "natural minor collection" : "major collection"}.`,
          x: key.cx,
          y: 290,
          r: 51,
          tone: k,
        });
        diatonic(key.root, key.mode).forEach((t, i) => {
          const pos = polar(
            -Math.PI / 2 + (i * 2 * Math.PI) / 7,
            145,
            key.cx,
            290,
          );
          g.nodes.push({
            id: k + ":" + chordKey(t.chord),
            label: t.name,
            sub: t.degree,
            detail: `${t.name} is ${t.degree} in ${pitchName(key.root)} ${key.mode}.`,
            ...pos,
            chord: t.chord,
            tone: k,
          });
          g.edges.push(
            edge(
              "key" + k,
              k + ":" + chordKey(t.chord),
              "",
              `Diatonic degree ${t.degree}.`,
            ),
          );
        });
      });
      pivots(d.root, d.mode, d.destination, d.destinationMode).forEach(
        (p, i) => {
          const id = "pivot:" + chordKey(p.chord);
          g.nodes.push({
            id,
            label: p.name,
            sub: p.from + " → " + p.to,
            x: 240 + i * 110,
            y: 545,
            r: 28,
            tone: 2,
            chord: p.chord,
            detail: `Potential pivot: ${p.name} is ${p.from} in the source and ${p.to} in the destination. A shared chord alone does not establish a modulation; cadence and context matter.`,
          });
          g.edges.push(
            edge(
              "0:" + chordKey(p.chord),
              id,
              "pivot",
              `${p.name} belongs to both collections.`,
              true,
            ),
            edge(
              id,
              "1:" + chordKey(p.chord),
              "",
              `Reinterpret ${p.from} as ${p.to}.`,
              true,
            ),
          );
        },
      );
      g.notice = pivots(d.root, d.mode, d.destination, d.destinationMode).length
        ? "Select a pivot to propose source → pivot → destination. Cadence context is still needed."
        : "No shared diatonic triads for these key collections. Try another destination or mode.";
      return g;
    }
    case "mandala": {
      const g = blank(
          "Rings: independent cycles · Filled: hit · Star: accent · Numbers: step",
        ),
        d = s.data;
      g.circles = [];
      d.rings.forEach((ring, k) => {
        const r = 100 + k * 54;
        g.circles!.push({
          x: 440,
          y: 330,
          r,
          label: `${ring.name} · ${ring.steps} steps · ${ring.bars} bar${ring.bars === 1 ? "" : "s"}`,
        });
        for (let j = 0; j < ring.steps; j++) {
          const enabled = ring.enabled.includes(j),
            accent = ring.accents.includes(j),
            time = (j / ring.steps) * ring.bars;
          const together = d.rings
            .filter((other) =>
              other.enabled.some(
                (step) =>
                  Math.abs(
                    (step / other.steps) * other.bars - (time % other.bars),
                  ) < 1e-7,
              ),
            )
            .map((r) => r.name);
          g.nodes.push({
            id: ring.id + ":" + j,
            label: String(j + 1) + (accent ? " ★" : ""),
            sub: "",
            ...polar(-Math.PI / 2 + (j / ring.steps) * 2 * Math.PI, r),
            r: ring.steps > 24 ? 10 : 15,
            tone: k,
            disabled: !enabled,
            meta: { ring: ring.id, step: j },
            detail: `${ring.name}, step ${j + 1} of ${ring.steps}. ${enabled ? "Enabled hit" : "Rest"}${accent ? ", accented" : ""}. Onset ${Number((time * 4).toFixed(3))} beats from cycle start. ${enabled ? "At this onset: " + together.join(", ") : "Enable this step to add a hit."}`,
          });
        }
      });
      g.notice =
        "Select a step to toggle its hit or accent. The cursor is silent; each ring repeats at its own cycle length.";
      return g;
    }
    case "motif": {
      const g = blank(
          "Cards: melodies · Height: pitch · Block length: duration · Branches: changes",
        ),
        d = s.data;
      const depth = (id: string): number => {
        const v = d.variations.find((v) => v.id === id)!;
        return v.parent ? 1 + depth(v.parent) : 0;
      };
      const grouped = Array.from({ length: 5 }, (_, level) =>
        d.variations.filter((v) => depth(v.id) === level),
      );
      grouped.forEach((group, level) =>
        group.forEach((v, i) => {
          g.nodes.push({
            id: v.id,
            label: v.name,
            sub: v.notes.map((n) => noteName(n.pitch)).join(" "),
            detail: `${v.operation}. ${v.notes.length} notes; ${totalDuration(v.notes)} beats. ${v.notes.map((n) => noteName(n.pitch) + " (" + n.duration + " beats)").join(", ")}`,
            x: 440 + (i - (group.length - 1) / 2) * 245,
            y: 150 + level * 300,
            shape: "rect",
            r: 109,
            tone: level === 0 ? 0 : 1 + (i % 5),
            motif: v,
            meta: { variation: v.id },
          });
          if (v.parent)
            g.edges.push(edge(v.parent, v.id, v.operation, v.operation));
        }),
      );
      g.notice =
        "Choose a version to compare its notes, then make another variation. Every branch preserves the melody it came from.";
      return g;
    }
    case "spiral": {
      const g = blank(
          "Angle: pitch class · Revolution: octave · Lines: original voice identity",
        ),
        d = s.data;
      const lo = (d.minOctave + 1) * 12,
        hi = (d.maxOctave + 2) * 12 - 1;
      for (let n = lo; n <= hi; n++) {
        const radius = 65 + (n - lo) * 3.7;
        g.nodes.push({
          id: "pitch:" + n,
          label: spelledNoteName(n, d.spellings),
          x: 440 + Math.cos(-Math.PI / 2 + (pc(n) / 12) * Math.PI * 2) * radius,
          y: 330 + Math.sin(-Math.PI / 2 + (pc(n) / 12) * Math.PI * 2) * radius,
          r: d.pitches.includes(n) ? 24 : 4,
          disabled: !d.pitches.includes(n),
          tone: Math.floor(n / 12) % 4,
          detail: `${spelledNoteName(n, d.spellings)}, MIDI ${n}; pitch class ${pitchName(n)}.`,
          meta: { noteIndex: d.pitches.indexOf(n) },
        });
      }
      d.pitches.forEach((n, i) => {
        if (i)
          g.edges.push(
            edge(
              "pitch:" + d.pitches[i - 1],
              "pitch:" + n,
              String(n - d.pitches[i - 1]),
              `Voice ${i} → ${i + 1}: ${signed(n - d.pitches[i - 1])} semitones.${n < d.pitches[i - 1] ? " Voice crossing: this voice is lower than the previous voice." : ""}`,
            ),
          );
      });
      const sorted = [...d.pitches].sort((a, b) => a - b);
      g.notice = `Bass ${spelledNoteName(sorted[0], d.spellings)} · span ${sorted.at(-1)! - sorted[0]} semitones · ${d.pitches.filter((p, i) => i && p < d.pitches[i - 1]).length} voice crossings. Original voice order is retained.`;
      return g;
    }
    case "form":
      return formGraph(s.data, collapsed);
    case "scale": {
      const g = blank(
          "Items: modal collections · Comparison: shared and differing pitches",
        ),
        d = s.data,
        base = modePcs(d.root, 0);
      modes.forEach((name, i) => {
        const root = d.relation === "parallel" ? d.root : base[i],
          pcs = modePcs(root, i),
          names = spellScale(root, pcs, i === 5),
          pos = polar(-Math.PI / 2 + (i * 2 * Math.PI) / 7, 225);
        g.nodes.push({
          id: "mode:" + i,
          label: name,
          sub: names[0],
          ...pos,
          r: 49,
          tone: i,
          detail: `${names[0]} ${name}: ${names.join(" · ")}. ${d.relation === "parallel" ? "Same tonic; differing pitch collections." : "Different tonic; same parent-major pitch collection."}`,
          meta: { mode: i },
        });
      });
      const ar = d.relation === "parallel" ? d.root : base[d.a],
        br = d.relation === "parallel" ? d.root : base[d.b],
        a = modePcs(ar, d.a),
        b = modePcs(br, d.b);
      g.edges.push(
        edge(
          "mode:" + d.a,
          "mode:" + d.b,
          common(a, b).length + " shared",
          `Shared: ${common(a, b)
            .map((n) => pitchName(n))
            .join(", ")}. Only ${modes[d.a]}: ${
            a
              .filter((n) => !b.includes(n))
              .map((n) => pitchName(n))
              .join(", ") || "none"
          }. Only ${modes[d.b]}: ${
            b
              .filter((n) => !a.includes(n))
              .map((n) => pitchName(n))
              .join(", ") || "none"
          }.`,
        ),
      );
      g.notice =
        d.relation === "relative"
          ? "Relative modes share all seven pitch classes; their tonal centers differ."
          : "Parallel modes keep the same tonic. Select two modes to compare their tonal colors.";
      return g;
    }
  }
}
function formGraph(d: Data["form"], collapsed: string[]): Graph {
  const g = blank(
    "Regions: sections / phrases · Repeated ID: linked motif definition",
  );
  let leaf = 0;
  const nodes: GNode[] = [];
  const duration = (id: string) =>
    totalDuration(d.definitions.find((m) => m.id === id)!.notes);
  for (const s of d.sections) {
    const xs: number[] = [];
    for (const p of s.phrases) {
      const px: number[] = [];
      if (!collapsed.includes(s.id) && !collapsed.includes(p.id))
        for (const o of p.occurrences) {
          const def = d.definitions.find((m) => m.id === o.definition)!;
          const x = 100 + leaf++ * 165;
          px.push(x);
          nodes.push({
            id: o.id,
            label: def.name,
            sub: duration(def.id) + " beats · " + def.id.slice(0, 4),
            detail: `Occurrence of ${def.name}. ${d.sections.flatMap((s) => s.phrases.flatMap((p) => p.occurrences)).filter((o) => o.definition === def.id).length} linked occurrences share this definition.`,
            x,
            y: 460,
            shape: "rect",
            r: 64,
            tone: 2,
            motif: def,
            meta: {
              section: s.id,
              phrase: p.id,
              occurrence: o.id,
              definition: def.id,
            },
          });
          g.edges.push(
            edge(
              p.id,
              o.id,
              "contains",
              "Occurrence references a reusable motif definition.",
            ),
          );
        }
      const x = px.length
        ? px.reduce((a, b) => a + b) / px.length
        : 100 + leaf++ * 165;
      xs.push(x);
      if (!collapsed.includes(s.id)) {
        nodes.push({
          id: p.id,
          label: p.name,
          sub:
            p.occurrences.reduce((n, o) => n + duration(o.definition), 0) +
            " beats",
          detail:
            "Phrase containing " + p.occurrences.length + " motif occurrences.",
          x,
          y: 300,
          shape: "rect",
          r: 64,
          tone: 1,
          meta: { section: s.id, phrase: p.id },
        });
        g.edges.push(
          edge(s.id, p.id, "contains", "Section contains this phrase."),
        );
      }
    }
    const x = xs.length
      ? xs.reduce((a, b) => a + b) / xs.length
      : 100 + leaf++ * 165;
    nodes.push({
      id: s.id,
      label: s.name,
      sub:
        s.phrases.reduce(
          (n, p) =>
            n + p.occurrences.reduce((v, o) => v + duration(o.definition), 0),
          0,
        ) + " beats",
      detail: "Section containing " + s.phrases.length + " phrases.",
      x,
      y: 130,
      shape: "rect",
      r: 70,
      tone: 0,
      meta: { section: s.id },
    });
  }
  const offset =
    440 -
    (Math.min(...nodes.map((n) => n.x)) + Math.max(...nodes.map((n) => n.x))) /
      2;
  g.nodes = nodes.slice(0, 256).map((n) => ({ ...n, x: n.x + offset }));
  g.edges = g.edges.filter(
    (e) =>
      g.nodes.some((n) => n.id === e.from) &&
      g.nodes.some((n) => n.id === e.to),
  );
  g.notice =
    nodes.length > 256
      ? "Display limited to 256 nodes. Collapse sections to inspect smaller scopes."
      : "Linked occurrences share a definition; independent copies keep their own notes. Durations are in quarter-note beats.";
  return g;
}
