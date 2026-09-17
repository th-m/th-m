import { parseNote, pc } from "./music";
import {
  families,
  type Workspace,
  type Study,
  initialWorkspace,
} from "./model";
export const STORAGE_KEY = "theory.shape-studies.v1";
const obj = (x: unknown): x is Record<string, unknown> =>
  !!x && typeof x === "object" && !Array.isArray(x);
const str = (x: unknown) =>
  typeof x === "string" && x.length > 0 && x.length <= 200;
const num = (x: unknown, a: number, b: number) =>
  typeof x === "number" && Number.isFinite(x) && x >= a && x <= b;
const int = (x: unknown, a: number, b: number) =>
  num(x, a, b) && Number.isInteger(x);
const arr = (
  x: unknown,
  min: number,
  max: number,
  p: (x: any) => boolean,
): x is any[] =>
  Array.isArray(x) && x.length >= min && x.length <= max && x.every(p);
const unique = (xs: any[], key = (x: any) => x) =>
  new Set(xs.map(key)).size === xs.length;
const notes = (x: unknown) =>
  arr(
    x,
    1,
    16,
    (n) => obj(n) && int(n.pitch, 0, 127) && num(n.duration, 0.125, 16),
  );
const timedEvents = (x: unknown) =>
  arr(
    x,
    1,
    16,
    (event) =>
      obj(event) &&
      str(event.id) &&
      int(event.pitch, 0, 127) &&
      num(event.start, 0, 32) &&
      num(event.duration, 0.125, 16),
  ) && unique(x as any[], (event) => event.id);
function dataValid(s: Record<string, unknown>): boolean {
  const d = s.data;
  if (!obj(d)) return false;
  switch (s.kind) {
    case "snowflake":
      return (
        int(d.root, 0, 11) &&
        arr(d.intervals, 1, 6, (n) => int(n, 1, 12)) &&
        unique(d.intervals) &&
        [1, -1].includes(d.direction as number) &&
        int(d.depth, 1, 4)
      );
    case "honeycomb":
      return (
        int(d.root, 0, 11) &&
        ["major", "minor"].includes(d.quality as string) &&
        arr(d.transforms, 1, 3, (t) => ["P", "L", "R"].includes(t)) &&
        unique(d.transforms) &&
        int(d.depth, 1, 4) &&
        arr(d.pins, 0, 12, (n) => int(n, 0, 11)) &&
        unique(d.pins)
      );
    case "garden":
      return (
        int(d.root, 0, 11) &&
        int(d.destination, 0, 11) &&
        ["major", "minor"].includes(d.mode as string) &&
        ["major", "minor"].includes(d.destinationMode as string)
      );
    case "mandala":
      return (
        int(d.bpm, 30, 240) &&
        arr(
          d.rings,
          1,
          4,
          (r) =>
            obj(r) &&
            str(r.id) &&
            str(r.name) &&
            int(r.steps, 2, 48) &&
            int(r.hits, 0, r.steps as number) &&
            int(r.rotation, 0, (r.steps as number) - 1) &&
            int(r.bars, 1, 4) &&
            arr(r.enabled, 0, r.steps as number, (n) =>
              int(n, 0, (r.steps as number) - 1),
            ) &&
            unique(r.enabled) &&
            r.hits === r.enabled.length &&
            arr(r.accents, 0, r.steps as number, (n) =>
              (r.enabled as number[]).includes(n),
            ) &&
            unique(r.accents),
        ) &&
        unique(d.rings, (r) => r.id)
      );
    case "motif": {
      if (
        !arr(
          d.variations,
          1,
          128,
          (v) =>
            obj(v) &&
            str(v.id) &&
            str(v.name) &&
            str(v.operation) &&
            (v.parent === null || str(v.parent)) &&
            notes(v.notes),
        ) ||
        !unique(d.variations, (v) => v.id) ||
        d.variations.filter((v) => v.parent === null).length !== 1
      )
        return false;
      return d.variations.every((v) => {
        const visited = new Set<string>();
        let at = v,
          depth = 0;
        while (at.parent !== null) {
          if (visited.has(at.id) || ++depth > 4) return false;
          visited.add(at.id);
          at = (d.variations as any[]).find((n: any) => n.id === at.parent);
          if (!at) return false;
        }
        return true;
      });
    }
    case "spiral":
      return (
        (d.spellings === undefined ||
          (arr(
            d.spellings,
            12,
            12,
            (n) => typeof n === "string" && /^[A-G][#b]{0,2}$/.test(n),
          ) &&
            d.spellings.every(
              (n, i) =>
                parseNote(n + "3") !== null && pc(parseNote(n + "3")!) === i,
            ))) &&
        arr(d.pitches, 1, 12, (n) => int(n, 0, 127)) &&
        unique(d.pitches) &&
        int(d.minOctave, 0, 8) &&
        int(d.maxOctave, d.minOctave as number, 8) &&
        d.pitches.every(
          (n) =>
            n >= (Number(d.minOctave) + 1) * 12 &&
            n <= (Number(d.maxOctave) + 2) * 12 - 1,
        )
      );
    case "form": {
      if (
        !arr(
          d.definitions,
          1,
          128,
          (m) => obj(m) && str(m.id) && str(m.name) && notes(m.notes),
        ) ||
        !unique(d.definitions, (m) => m.id) ||
        !arr(
          d.sections,
          1,
          16,
          (s) =>
            obj(s) &&
            str(s.id) &&
            str(s.name) &&
            arr(
              s.phrases,
              1,
              16,
              (p) =>
                obj(p) &&
                str(p.id) &&
                str(p.name) &&
                arr(
                  p.occurrences,
                  1,
                  16,
                  (o) =>
                    obj(o) &&
                    str(o.id) &&
                    (d.definitions as any[]).some(
                      (m: any) => m.id === o.definition,
                    ),
                ),
            ),
        )
      )
        return false;
      const ids = d.sections.flatMap((s) => [
        s.id,
        ...s.phrases.flatMap((p: any) => [
          p.id,
          ...p.occurrences.map((o: any) => o.id),
        ]),
      ]);
      return ids.length <= 256 && unique(ids);
    }
    case "scale":
      return (
        int(d.root, 0, 11) &&
        ["parallel", "relative"].includes(d.relation as string) &&
        int(d.a, 0, 6) &&
        int(d.b, 0, 6) &&
        d.a !== d.b
      );
    case "atlas":
      return (
        obj(d.source) &&
        obj(d.selected) &&
        int(d.source.root, 0, 11) &&
        int(d.selected.root, 0, 11) &&
        ["major", "minor", "dim"].includes(d.source.quality as string) &&
        ["major", "minor", "dim"].includes(d.selected.quality as string) &&
        arr(d.pins, 0, 3, (n) => int(n, 0, 11)) &&
        unique(d.pins)
      );
    case "weave":
      return (
        timedEvents(d.source) &&
        int(d.delay, 0, 16) &&
        int(d.transpose, -24, 24) &&
        typeof d.reversed === "boolean" &&
        (d.source as any[]).every((event) => event.pitch + (d.transpose as number) >= 0 && event.pitch + (d.transpose as number) <= 127)
      );
    case "recipe":
      return (
        notes(d.source) &&
        int(d.repeats, 1, 4) &&
        int(d.targetCopy, 1, d.repeats as number) &&
        int(d.transpose, -24, 24) &&
        num(d.shortenEnding, 0, 8) &&
        (d.source as any[]).at(-1).duration - (d.shortenEnding as number) >= 0.125 &&
        (d.source as any[]).every((note) => note.pitch + (d.transpose as number) >= 0 && note.pitch + (d.transpose as number) <= 127)
      );
    case "gesture": {
      const step = d.sampleStep as number,
        points = d.points as any[];
      return (
        [0.25, 0.5, 1].includes(step) &&
        int(d.root, 0, 11) &&
        int(d.mode, 0, 6) &&
        arr(points, 2, 16, (point) =>
          obj(point) && str(point.id) && num(point.beat, 0, 16) && num(point.value, 0, 127),
        ) &&
        unique(points, (point) => point.id) &&
        points[0].beat === 0 &&
        points.every((point, index) =>
          (index === 0 || point.beat > points[index - 1].beat) &&
          Math.abs(point.beat / step - Math.round(point.beat / step)) < 0.000001,
        ) &&
        Math.floor(points.at(-1).beat / step) + 1 <= 16
      );
    }
    case "rhythmGarden":
      return (
        [8, 16, 32].includes(d.width as number) &&
        int(d.rule, 0, 255) &&
        ["fixed-zero", "cyclic"].includes(d.edgeMode as string) &&
        arr(d.seed, d.width as number, d.width as number, (value) => typeof value === "boolean") &&
        int(d.generations, 1, 16) &&
        int(d.selectedGeneration, 0, d.generations as number)
      );
    case "journey": {
      const phrases = d.phrases as any[], choices = d.choices as any[];
      return (
        arr(phrases, 2, 16, (phrase) => obj(phrase) && str(phrase.id) && str(phrase.name) && notes(phrase.notes) && ["call", "answer", "echo", "turn"].includes(phrase.role as string) && int(phrase.maxVisits, 1, 16)) &&
        unique(phrases, (phrase) => phrase.id) &&
        arr(choices, 1, 64, (choice) => obj(choice) && str(choice.id) && phrases.some((phrase) => phrase.id === choice.from) && phrases.some((phrase) => phrase.id === choice.to) && int(choice.weight, 0, 10) && ["continue", "answer", "return", "turn"].includes(choice.intent as string)) &&
        unique(choices, (choice) => choice.id) &&
        phrases.some((phrase) => phrase.id === d.start) &&
        int(d.seed, 0, 9999) && int(d.steps, 1, 32)
      );
    }
    case "landscape":
      return (
        notes(d.source) &&
        arr(d.anchors, 2, 8, (anchor) => obj(anchor) && str(anchor.id) && str(anchor.name) && num(anchor.x, 0, 1) && num(anchor.y, 0, 1) && num(anchor.activity, 0.25, 1) && int(anchor.register, -24, 24) && num(anchor.durationScale, 0.5, 2)) &&
        unique(d.anchors as any[], (anchor) => anchor.id) &&
        obj(d.cursor) && num(d.cursor.x, 0, 1) && num(d.cursor.y, 0, 1) &&
        arr(d.committed, 0, 32, (item) => obj(item) && str(item.id) && str(item.name) && notes(item.notes))
      );
    case "counterpoint":
      return (
        arr(d.bass, 6, 6, (pitch) => int(pitch, 0, 127)) &&
        arr(d.soprano, 6, 6, (pitch) => int(pitch, 0, 127)) &&
        ["bass", "soprano"].includes(d.anchor as string) &&
        obj(d.pins) && Object.entries(d.pins).every(([index, pitch]) => int(+index, 0, 5) && int(pitch, 0, 127)) &&
        int(d.inspectBeat, 0, 5)
      );
    default:
      return false;
  }
}
export function decodeWorkspace(text: string): Workspace {
  if (text.length > 50_000_000)
    throw Error("This backup is too large (maximum 50 MB).");
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw Error("This file is not valid JSON. Existing studies are unchanged.");
  }
  if (
    !obj(value) ||
    value.version !== 1 ||
    !arr(
      value.studies,
      1,
      100,
      (s) =>
        obj(s) &&
        str(s.id) &&
        str(s.name) &&
        families.some((f) => f.kind === s.kind) &&
        arr(s.route, 0, 256, str) &&
        (!s.source ||
          (obj(s.source) && str(s.source.study) && str(s.source.item))) &&
        dataValid(s),
    ) ||
    !unique(value.studies, (s) => s.id) ||
    !value.studies.some((s) => s.id === value.active)
  )
    throw Error(
      "Unrecognized or invalid theory backup. Existing studies are unchanged.",
    );
  return value as Workspace;
}
export function validateStudy(s: Study) {
  return dataValid(s as unknown as Record<string, unknown>);
}
export function loadWorkspace(storage: Pick<Storage, "getItem">): {
  workspace: Workspace;
  error: string | null;
} {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return {
      workspace: raw ? decodeWorkspace(raw) : initialWorkspace(),
      error: null,
    };
  } catch (e) {
    return {
      workspace: initialWorkspace(),
      error:
        "Could not restore saved studies. The previous backup has not been overwritten. " +
        String(e),
    };
  }
}
export function saveWorkspace(
  storage: Pick<Storage, "setItem">,
  w: Workspace,
): string | null {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(w));
    return null;
  } catch {
    return "Browser storage is unavailable or full. Your current session is intact; export JSON to keep it.";
  }
}
