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
  atlasChords,
  chordContainsPins,
  weaveEvents,
  recipeEvents,
  gestureSamples,
  gardenRows,
  gardenHits,
  journeyPreview,
  landscapePreview,
  intervalLabel,
  consonantInterval,
  counterpointCandidates,
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
    case "atlas": {
      const g = blank(
          "Left: pitch classes · Right: triads · Lines: held-note membership or the selected chord · Dim cards: do not contain every required note",
        ),
        d = s.data,
        source = triadPcs(d.source);
      Array.from({ length: 12 }, (_, pitch) => {
        const y = 80 + pitch * 48;
        g.nodes.push({
          id: "pitch:" + pitch,
          label: pitchName(pitch),
          sub: d.pins.includes(pitch) ? "HELD" : "pitch class",
          detail: `${pitchName(pitch)} is ${d.pins.includes(pitch) ? "required by the current filter" : "available to pin"}. Octaves are intentionally ignored here.`,
          x: 95,
          y,
          r: 19,
          tone: d.pins.includes(pitch) ? 1 : 0,
        });
      });
      atlasChords().forEach((chord, index) => {
        const id = "chord:" + chordKey(chord),
          pcs = triadPcs(chord),
          selected = chordKey(chord) === chordKey(d.selected),
          compatible = chordContainsPins(chord, d.pins),
          col = Math.floor(index / 9),
          row = index % 9;
        g.nodes.push({
          id,
          label: chordName(chord),
          sub: chordSpellings(chord).join(" · "),
          detail: `${chordName(chord)} contains ${chordSpellings(chord).join(", ")}. ${compatible ? `It contains every held pitch class: ${d.pins.map((pitch) => pitchName(pitch)).join(", ") || "none"}.` : `It is filtered because it lacks ${d.pins.filter((pin) => !pcs.includes(pin)).map((pitch) => pitchName(pitch)).join(", ")}.`} ${selected ? "This is the comparison chord." : "Select it to compare with the source."}`,
          x: 275 + col * 195,
          y: 72 + row * 66,
          r: 31,
          shape: "rect",
          tone: selected ? 4 : compatible ? 1 : 0,
          chord,
          disabled: !compatible,
        });
        if (selected || compatible)
          pcs.forEach((pitch) =>
            g.edges.push(
              edge(
                "pitch:" + pitch,
                id,
                "",
                `${pitchName(pitch)} is a pitch-class member of ${chordName(chord)}.`,
                !d.pins.includes(pitch),
              ),
            ),
          );
      });
      const diff = chordDifference(d.source, d.selected);
      g.notice = `${chordName(d.source)} → ${chordName(d.selected)}: keeps ${diff.shared.map((pitch) => pitchName(pitch)).join(", ") || "no pitch classes"}; ${diff.removed.map((pitch) => pitchName(pitch)).join(", ") || "nothing"} changes to ${diff.added.map((pitch) => pitchName(pitch)).join(", ") || "nothing"}. Shared notes are membership, not a voice-leading or functional-harmony score.`;
      return g;
    }
    case "weave": {
      const g = blank(
          "Horizontal position: beat · Vertical position: MIDI pitch · Lines: source event to its copied event",
        ),
        d = s.data,
        copy = weaveEvents(d.source, d.delay, d.transpose, d.reversed),
        all = [...d.source, ...copy],
        low = Math.min(...all.map((event) => event.pitch)) - 2,
        high = Math.max(...all.map((event) => event.pitch)) + 2,
        y = (pitch: number) => 560 - ((pitch - low) / Math.max(1, high - low)) * 430,
        add = (event: typeof all[number], lane: "source" | "copy", index: number) => {
          const id = lane === "source" ? event.id : "copy:" + d.source[index].id;
          g.nodes.push({
            id,
            label: noteName(event.pitch),
            sub: `${event.start}–${event.start + event.duration} beats`,
            detail: `${lane === "source" ? "Source" : d.reversed ? "Reversed follower" : "Follower"} event ${noteName(event.pitch)} from beat ${event.start} for ${event.duration} beats.`,
            x: 120 + (event.start + event.duration / 2) * 165,
            y: y(event.pitch) + (lane === "copy" ? 12 : -12),
            r: Math.max(24, event.duration * 52),
            shape: "rect",
            tone: lane === "source" ? 0 : 4,
          });
        };
      d.source.forEach((event, index) => add(event, "source", index));
      copy.forEach((event, index) => {
        add(event, "copy", index);
        g.edges.push(edge(d.source[index].id, event.id, `${d.transpose >= 0 ? "+" : ""}${d.transpose}`, `Copy of ${noteName(d.source[index].pitch)}: ${d.transpose >= 0 ? "+" : ""}${d.transpose} semitones and ${d.delay} beat${d.delay === 1 ? "" : "s"} later${d.reversed ? ", with its position reversed within the phrase" : ""}.`));
      });
      g.notice = `The follower starts ${d.delay} beat${d.delay === 1 ? "" : "s"} later and is ${d.transpose >= 0 ? "+" : ""}${d.transpose} semitones. Overlap is visible when event blocks occupy the same beat range; this is a silent timing study.`;
      return g;
    }
    case "recipe": {
      const g = blank(
          "Horizontal position: sequence time · Rows: repeated copies · Amber events: selected copy edits",
        ),
        d = s.data,
        events = recipeEvents(d.source, d.repeats, d.targetCopy, d.transpose, d.shortenEnding),
        span = totalDuration(d.source);
      for (let copy = 1; copy <= d.repeats; copy++) {
        const row = events.filter((event) => event.id.startsWith(`copy:${copy}:`));
        row.forEach((event, index) => {
          g.nodes.push({
            id: event.id,
            label: noteName(event.pitch),
            sub: `${event.start}–${event.start + event.duration} beats`,
            detail: `Copy ${copy}, note ${index + 1}: ${noteName(event.pitch)} starts at beat ${event.start} and lasts ${event.duration} beats.${copy === d.targetCopy ? ` This copy is transposed ${d.transpose >= 0 ? "+" : ""}${d.transpose} semitones; its final note is shortened by ${d.shortenEnding} beats.` : ""}`,
            x: 120 + (event.start + event.duration / 2) * 145,
            y: 155 + (copy - 1) * 145,
            r: Math.max(24, event.duration * 46),
            shape: "rect",
            tone: copy === d.targetCopy ? 2 : 0,
          });
          if (index) g.edges.push(edge(row[index - 1].id, event.id, "then", "Sequential event order within this copy."));
          if (copy > 1) g.edges.push(edge(`copy:1:note:${index + 1}`, event.id, copy === d.targetCopy ? `${d.transpose >= 0 ? "+" : ""}${d.transpose}` : "repeat", copy === d.targetCopy ? `This copy moves by ${d.transpose >= 0 ? "+" : ""}${d.transpose} semitones.` : "Same source position in a repeated copy.", copy !== d.targetCopy));
        });
      }
      g.notice = `${d.repeats} sequential ${span}-beat copies. Copy ${d.targetCopy} moves ${d.transpose >= 0 ? "+" : ""}${d.transpose} semitones; only its final event shortens by ${d.shortenEnding} beats. Generated positions are derived, never dragged into the saved recipe.`;
      return g;
    }
    case "rhythmGarden": {
      const g = blank("Rows: cellular generations · Filled cells: proposed onsets · Column: rhythmic step"), d = s.data;
      const rows = gardenRows(d.seed, d.rule, d.edgeMode, d.generations);
      rows.forEach((row, generation) => row.forEach((live, step) => {
        const id = `row:${generation}:step:${step}`;
        g.nodes.push({
          id, label: live ? "●" : "○", sub: generation === 0 ? `seed · step ${step + 1}` : `generation ${generation} · step ${step + 1}`,
          detail: `${generation === 0 ? "Seed" : `Generation ${generation}`} at step ${step + 1}: ${live ? "hit" : "rest"}. ${generation === 0 ? "Paint this cell to change every derived row." : "This is a derived onset proposal, not a later musical bar."}`,
          x: 140 + step * (d.width === 32 ? 24 : d.width === 16 ? 46 : 88), y: 140 + generation * 92, r: d.width === 32 ? 9 : 18, tone: generation === d.selectedGeneration ? 2 : generation,
        });
        if (generation) {
          const prior = (step - 1 + d.width) % d.width, next = (step + 1) % d.width;
          if (d.edgeMode === "cyclic" || step > 0) g.edges.push(edge(`row:${generation - 1}:step:${prior}`, id, "left", "Left neighbor contributes to this elementary-automaton result.", true));
          if (d.edgeMode === "cyclic" || step + 1 < d.width) g.edges.push(edge(`row:${generation - 1}:step:${next}`, id, "right", "Right neighbor contributes to this elementary-automaton result.", true));
        }
      }));
      const selected = rows[d.selectedGeneration];
      g.notice = `Rule ${d.rule}, ${d.edgeMode} edges. Generation ${d.selectedGeneration} has ${gardenHits(selected).length}/${d.width} hits at steps ${gardenHits(selected).map((step) => step + 1).join(", ") || "none"}. Rows are generated from the seed; selecting a row never advances time.`;
      return g;
    }
    case "journey": {
      const g = blank("Cards: reusable phrases · Arrow width: relative choice weight · Numbered cards: seeded preview"), d = s.data;
      const preview = journeyPreview(d.phrases, d.choices, d.start, d.seed, d.steps);
      d.phrases.forEach((phrase, index) => {
        const x = 160 + (index % 2) * 450, y = 165 + Math.floor(index / 2) * 290;
        const visits = preview.filter((event) => event.phraseId === phrase.id);
        g.nodes.push({ id: phrase.id, label: phrase.name, sub: `${phrase.role} · ${phrase.notes.map((note) => noteName(note.pitch)).join(" ")}`,
          detail: `${phrase.name} is a reusable ${phrase.role} phrase: ${phrase.notes.map((note) => `${noteName(note.pitch)} for ${note.duration}`).join(", ")}. Preview visits: ${visits.map((event) => event.step + 1).join(", ") || "none"}.`, x, y, r: 120, shape: "rect", tone: index });
      });
      d.choices.forEach((choice) => {
        const denominator = preview.find((event) => event.choiceId === choice.id)?.denominator;
        g.edges.push(edge(choice.from, choice.to, `${choice.weight}${denominator ? ` / ${denominator}` : ""}`, `${choice.intent} choice with relative weight ${choice.weight}${denominator ? ` among ${denominator} eligible units in this preview decision` : "."}`));
      });
      g.notice = `Seed ${d.seed} previews ${preview.map((event) => d.phrases.find((phrase) => phrase.id === event.phraseId)!.name).join(" → ")}. Weights only become percentages inside one eligible choice set; moving a card does not change the route.`;
      return g;
    }
    case "landscape": {
      const g = blank("Corners: saved variation anchors · Diamond: cursor · Cards: derived, quantized candidate notes"), d = s.data;
      const preview = landscapePreview(d.source, d.anchors, d.cursor);
      const x = (value: number) => 180 + value * 480, y = (value: number) => 560 - value * 400;
      d.anchors.forEach((anchor, index) => g.nodes.push({ id: anchor.id, label: anchor.name, sub: `${Math.round(anchor.activity * d.source.length)} notes · ${anchor.register >= 0 ? "+" : ""}${anchor.register}`, detail: `${anchor.name}: activity ${anchor.activity}, register ${anchor.register >= 0 ? "+" : ""}${anchor.register} semitones, duration ×${anchor.durationScale}. Weight here: ${(preview.weights[index].value * 100).toFixed(1)}%.`, x: x(anchor.x), y: y(anchor.y), r: 78, shape: "rect", tone: index }));
      g.nodes.push({ id: "cursor", label: "Cursor", sub: `${d.cursor.x.toFixed(2)}, ${d.cursor.y.toFixed(2)}`, detail: `Derived vector: ${preview.activity.toFixed(2)} activity, ${preview.register >= 0 ? "+" : ""}${preview.register} semitones, ×${preview.durationScale.toFixed(2)} duration. This cursor is saved, but the candidate is not committed.`, x: x(d.cursor.x), y: y(d.cursor.y), r: 26, shape: "hex", tone: 3 });
      preview.notes.forEach((note, index) => g.nodes.push({ id: `candidate:${index}`, label: noteName(note.pitch), sub: `${note.duration} beats`, detail: `Candidate note ${index + 1}: earliest retained source event, shifted ${preview.register >= 0 ? "+" : ""}${preview.register} semitones and quantized to ${note.duration} beats.`, x: 790, y: 155 + index * 95, r: 48, shape: "rect", tone: 4 }));
      g.notice = `Cursor blend: activity ${preview.activity.toFixed(2)} → ${preview.notes.length}/${d.source.length} earliest events; register ${preview.register >= 0 ? "+" : ""}${preview.register} semitones; duration ×${preview.durationScale.toFixed(2)}. ${d.committed.length} committed candidate snapshot${d.committed.length === 1 ? "" : "s"}. Anchor weights: ${preview.weights.map((weight) => `${weight.name} ${(weight.value * 100).toFixed(0)}%`).join(" · ")}.`;
      return g;
    }
    case "counterpoint": {
      const g = blank("Upper row: soprano · Lower row: bass · Cards: inspectable consonance choices under one C-major profile"), d = s.data;
      const fixed = d.anchor === "bass" ? d.bass : d.soprano;
      for (let index = 0; index < 6; index++) {
        const x = 105 + index * 145, bass = d.bass[index], soprano = d.soprano[index];
        g.nodes.push({ id: `bass:${index}`, label: noteName(bass), sub: `bass · beat ${index + 1}`, detail: `Bass at beat ${index + 1}: ${noteName(bass)}.`, x, y: 510, r: 36, tone: 0 });
        g.nodes.push({ id: `soprano:${index}`, label: noteName(soprano), sub: `soprano · ${intervalLabel(bass, soprano)}`, detail: `Soprano at beat ${index + 1}: ${noteName(soprano)} over ${noteName(bass)} = ${intervalLabel(bass, soprano)}${consonantInterval(bass, soprano) ? ", consonant in this profile" : ", outside this profile"}.`, x, y: 210, r: 36, tone: 2 });
        g.edges.push(edge(`bass:${index}`, `soprano:${index}`, intervalLabel(bass, soprano), "Vertical interval at this beat."));
      }
      const candidates = counterpointCandidates(d.bass, d.soprano, d.anchor, d.pins, d.inspectBeat);
      candidates.slice(0, 10).forEach((candidate, index) => g.nodes.push({ id: `candidate:${index}`, label: noteName(candidate.pitch), sub: candidate.accepted ? "possible" : candidate.reason, detail: `Beat ${d.inspectBeat + 1} candidate ${noteName(candidate.pitch)}: ${candidate.reason}.`, x: 112 + index * 82, y: 680, r: 27, tone: candidate.accepted ? 1 : 4, disabled: !candidate.accepted }));
      g.notice = `${d.anchor === "bass" ? "Bass" : "Soprano"} is the anchor. Beat ${d.inspectBeat + 1} shows a finite candidate domain; ${candidates.filter((candidate) => candidate.accepted).length}/${candidates.length} pass vertical consonance, no crossing, and prior parallel-perfect checks. Pins are explicit and reversible.`;
      return g;
    }
    case "gesture": {
      const g = blank(
          "Hexagons: editable contour points · Cards: scale-snapped samples · Horizontal position: beat · Vertical position: raw MIDI pitch",
        ),
        d = s.data,
        samples = gestureSamples(d.points, d.sampleStep, d.root, d.mode),
        low = Math.min(...d.points.map((point) => point.value), ...samples.map((sample) => sample.pitch)) - 3,
        high = Math.max(...d.points.map((point) => point.value), ...samples.map((sample) => sample.pitch)) + 3,
        y = (value: number) => 570 - ((value - low) / Math.max(1, high - low)) * 440,
        x = (beat: number) => 130 + beat * 190;
      d.points.forEach((point, index) => {
        const id = "point:" + point.id;
        g.nodes.push({
          id,
          label: noteName(Math.round(point.value)),
          sub: `point · beat ${point.beat}`,
          detail: `Control point ${index + 1}: raw MIDI value ${point.value} at beat ${point.beat}. The line between points is linear; this point is not yet a quantized note.`,
          x: x(point.beat),
          y: y(point.value),
          r: 24,
          shape: "hex",
          tone: 4,
        });
        if (index)
          g.edges.push(
            edge(
              "point:" + d.points[index - 1].id,
              id,
              "linear",
              `Linear contour from beat ${d.points[index - 1].beat} to beat ${point.beat}.`,
            ),
          );
      });
      samples.forEach((sample) => {
        g.nodes.push({
          id: sample.id,
          label: noteName(sample.pitch),
          sub: `${sample.start}–${sample.start + sample.duration} beats`,
          detail: `Sample at beat ${sample.start}: raw ${Number(sample.raw.toFixed(3))} → rounded ${sample.rounded} → ${noteName(sample.pitch)} in ${pitchName(d.root)} ${modes[d.mode]}. It lasts ${sample.duration} beats.`,
          x: x(sample.start),
          y: y(sample.pitch) + 34,
          r: Math.max(25, sample.duration * 50),
          shape: "rect",
          tone: 1,
        });
      });
      g.notice = `Sample every ${d.sampleStep} beat${d.sampleStep === 1 ? "" : "s"}: raw contour values round halves upward, then snap to the nearest ${pitchName(d.root)} ${modes[d.mode]} pitch. Equal-distance scale ties go upward. The final note continues for one sample step.`;
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
