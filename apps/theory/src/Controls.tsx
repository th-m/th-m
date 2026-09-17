import { MotifComparison } from "./PianoRoll";
import { useState, type ReactNode } from "react";
import {
  uid,
  copyOccurrence,
  seedNotes,
  type Study,
  type Data,
  type Note,
  type Phrase,
  type Section,
} from "./model";
import {
  sharpNames,
  noteName,
  spelledNoteName,
  parseNote,
  evenHits,
  rotateSteps,
  formatNotes,
  parseNotes,
  transformNotes,
  invertVoicing,
  modes,
  modePcs,
  spellScale,
  common,
  pitchName,
  totalDuration,
  landscapePreview,
  counterpointCandidates,
} from "./music";
import type { GNode } from "./graphs";
export const Field = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="field">
    <span>{label}</span>
    {children}
  </div>
);
export const Select = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | number;
  options: (string | { label: string; value: string | number })[];
  onChange: (s: string) => void;
}) => (
  <Field label={label}>
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o, i) =>
        typeof o === "string" ? (
          <option key={o} value={i}>
            {o}
          </option>
        ) : (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ),
      )}
    </select>
  </Field>
);
export const NumberField = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (n: number) => void;
}) => (
  <Field label={label}>
    <div className="range-control">
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <output>{value}</output>
    </div>
  </Field>
);
const pcOptions = sharpNames.map((label, value) => ({ label, value }));
const qualityOptions = ["major", "minor"].map((v) => ({ label: v, value: v }));
export function TextEdit({
  label,
  value,
  onApply,
  button = "Apply",
}: {
  label: string;
  value: string;
  onApply: (s: string) => void;
  button?: string;
}) {
  const [draft, setDraft] = useState(value);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onApply(draft);
      }}
    >
      <Field label={label}>
        <input
          aria-label={label}
          value={draft}
          maxLength={200}
          onChange={(e) => setDraft(e.target.value)}
        />
      </Field>
      <button className="small-button" type="submit">
        {button}
      </button>
    </form>
  );
}
export function NoteEdit({
  notes,
  onApply,
  label = "Notes · pitch:beats",
  button = "Update notes",
}: {
  notes: Note[];
  onApply: (notes: Note[]) => void;
  label?: string;
  button?: string;
}) {
  const [text, setText] = useState(formatNotes(notes)),
    [error, setError] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const n = parseNotes(text);
        if (!n) {
          setError(
            "Use 1–16 notes, e.g. C4:1 E4:0.5. Durations: 0.125–16 beats.",
          );
          return;
        }
        setError("");
        onApply(n);
      }}
    >
      <Field label={label}>
        <textarea
          aria-label={label}
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Field>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <button type="submit" className="small-button">
        {button}
      </button>
    </form>
  );
}
export function TimedEventEdit({
  events,
  onApply,
}: {
  events: Data["weave"]["source"];
  onApply: (events: Data["weave"]["source"]) => void;
}) {
  const [text, setText] = useState(
      events.map((event) => `${noteName(event.pitch)}@${event.start}:${event.duration}`).join(" "),
    ),
    [error, setError] = useState("");
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const parsed = text.trim().split(/\s+/).map((token) => {
          const match = /^([^@]+)@([\d.]+):([\d.]+)$/.exec(token);
          return match && {
            pitch: parseNote(match[1]),
            start: Number(match[2]),
            duration: Number(match[3]),
          };
        });
        if (
          !parsed.length ||
          parsed.length > 16 ||
          parsed.some(
            (item) =>
              !item ||
              item.pitch === null ||
              !Number.isFinite(item.start) ||
              !Number.isFinite(item.duration) ||
              item.start < 0 ||
              item.start > 32 ||
              item.duration < 0.125 ||
              item.duration > 16,
          )
        ) {
          setError("Use 1–16 events such as C4@0:0.5 E4@0.5:0.5. Starts: 0–32; durations: 0.125–16 beats.");
          return;
        }
        setError("");
        onApply(parsed.map((item, index) => ({ id: events[index]?.id ?? uid(), pitch: item!.pitch!, start: item!.start, duration: item!.duration })));
      }}
    >
      <Field label="Source events · pitch@start:beats">
        <textarea
          aria-label="Source events · pitch@start:beats"
          rows={3}
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      </Field>
      {error && <p role="alert" className="error">{error}</p>}
      <button type="submit" className="small-button">Update source events</button>
    </form>
  );
}
type Props = {
  study: Study;
  node: GNode | undefined;
  edit: (fn: (s: Study) => void, resetRoute?: boolean) => void;
  collapsed: string[];
  setCollapsed: (ids: string[]) => void;
};
export function Controls(props: Props) {
  const { study: s, edit } = props;
  switch (s.kind) {
    case "snowflake": {
      const d = s.data,
        change = (data: Partial<typeof d>) =>
          edit((s) => {
            if (s.kind === "snowflake") Object.assign(s.data, data);
          }, true);
      return (
        <>
          <Select
            label="Starting pitch"
            value={d.root}
            options={pcOptions}
            onChange={(n) => change({ root: +n })}
          />
          <Field label="Interval steps · semitones">
            <div className="chip-grid">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  aria-pressed={d.intervals.includes(n)}
                  disabled={!d.intervals.includes(n) && d.intervals.length >= 6}
                  onClick={() =>
                    change({
                      intervals: d.intervals.includes(n)
                        ? d.intervals.length > 1
                          ? d.intervals.filter((v) => v !== n)
                          : d.intervals
                        : [...d.intervals, n],
                    })
                  }
                >
                  {n}
                </button>
              ))}
            </div>
          </Field>
          <Select
            label="Direction"
            value={d.direction}
            options={[
              { label: "Ascending", value: 1 },
              { label: "Descending", value: -1 },
            ]}
            onChange={(n) => change({ direction: +n as 1 | -1 })}
          />
          <NumberField
            label="Visible depth"
            value={d.depth}
            min={1}
            max={4}
            onChange={(depth) =>
              edit((st) => {
                if (st.kind === "snowflake" || st.kind === "honeycomb")
                  st.data.depth = depth;
              })
            }
          />
          <p className="hint">
            Intervals use modulo-12 pitch classes. A repeated pitch closes its
            branch.
          </p>
        </>
      );
    }
    case "honeycomb": {
      const d = s.data,
        change = (data: Partial<typeof d>) =>
          edit((s) => {
            if (s.kind === "honeycomb") Object.assign(s.data, data);
          }, true);
      return (
        <>
          <Select
            label="Root"
            value={d.root}
            options={pcOptions}
            onChange={(n) => change({ root: +n })}
          />
          <Select
            label="Quality"
            value={d.quality}
            options={qualityOptions}
            onChange={(quality) =>
              change({ quality: quality as "major" | "minor" })
            }
          />
          <Field label="Allowed transformations">
            <div className="chip-grid">
              {(["P", "L", "R"] as const).map((t) => (
                <button
                  key={t}
                  aria-pressed={d.transforms.includes(t)}
                  onClick={() =>
                    change({
                      transforms: d.transforms.includes(t)
                        ? d.transforms.length > 1
                          ? d.transforms.filter((v) => v !== t)
                          : d.transforms
                        : [...d.transforms, t],
                    })
                  }
                >
                  {t} · {{ P: "Parallel", L: "Leading", R: "Relative" }[t]}
                </button>
              ))}
            </div>
          </Field>
          <NumberField
            label="Visible depth"
            value={d.depth}
            min={1}
            max={4}
            onChange={(depth) =>
              edit((st) => {
                if (st.kind === "snowflake" || st.kind === "honeycomb")
                  st.data.depth = depth;
              })
            }
          />
          <Field label="Required pitch classes">
            <div className="chip-grid">
              {sharpNames.map((p, i) => (
                <button
                  key={p}
                  aria-pressed={d.pins.includes(i)}
                  onClick={() =>
                    change({
                      pins: d.pins.includes(i)
                        ? d.pins.filter((n) => n !== i)
                        : [...d.pins, i],
                    })
                  }
                >
                  {p}
                </button>
              ))}
            </div>
          </Field>
          <p className="hint">
            P changes quality. R finds the relative triad. L moves the
            non-shared tone by a semitone.
          </p>
        </>
      );
    }
    case "garden": {
      const d = s.data,
        change = (data: Partial<typeof d>) =>
          edit((s) => {
            if (s.kind === "garden") Object.assign(s.data, data);
          }, true);
      return (
        <>
          <Select
            label="Source key"
            value={d.root}
            options={pcOptions}
            onChange={(n) => change({ root: +n })}
          />
          <Select
            label="Source collection"
            value={d.mode}
            options={qualityOptions}
            onChange={(n) => change({ mode: n as "major" | "minor" })}
          />
          <Select
            label="Destination key"
            value={d.destination}
            options={pcOptions}
            onChange={(n) => change({ destination: +n })}
          />
          <Select
            label="Destination collection"
            value={d.destinationMode}
            options={qualityOptions}
            onChange={(n) =>
              change({ destinationMode: n as "major" | "minor" })
            }
          />
          <p className="hint">
            Minor uses the natural minor collection. Shared triads are possible
            pivots; modulation also needs tonal and cadential context.
          </p>
        </>
      );
    }
    case "mandala":
      return <RhythmControls {...props} study={s} />;
    case "motif":
      return <MotifControls {...props} study={s} />;
    case "spiral":
      return <SpiralControls {...props} study={s} />;
    case "form":
      return <FormControls {...props} study={s} />;
    case "atlas":
      return <AtlasControls {...props} study={s} />;
    case "weave":
      return <WeaveControls {...props} study={s} />;
    case "recipe":
      return <RecipeControls {...props} study={s} />;
    case "gesture":
      return <GestureControls {...props} study={s} />;
    case "rhythmGarden":
      return <RhythmGardenControls {...props} study={s} />;
    case "journey":
      return <JourneyControls {...props} study={s} />;
    case "landscape":
      return <LandscapeControls {...props} study={s} />;
    case "counterpoint":
      return <CounterpointControls {...props} study={s} />;
    case "scale": {
      const d = s.data,
        change = (data: Partial<typeof d>) =>
          edit((s) => {
            if (s.kind === "scale") Object.assign(s.data, data);
          }, true),
        base = modePcs(d.root, 0),
        a = modePcs(d.relation === "parallel" ? d.root : base[d.a], d.a),
        b = modePcs(d.relation === "parallel" ? d.root : base[d.b], d.b);
      return (
        <>
          <Select
            label={
              d.relation === "parallel" ? "Shared tonic" : "Parent major tonic"
            }
            value={d.root}
            options={pcOptions}
            onChange={(n) => change({ root: +n })}
          />
          <Select
            label="Relationship"
            value={d.relation}
            options={[
              { label: "Parallel · same tonic", value: "parallel" },
              { label: "Relative · same collection", value: "relative" },
            ]}
            onChange={(n) => change({ relation: n as "parallel" | "relative" })}
          />
          <Select
            label="Compare mode A"
            value={d.a}
            options={modes
              .map((label, value) => ({ label, value }))
              .filter((o) => o.value !== d.b)}
            onChange={(n) => change({ a: +n })}
          />
          <Select
            label="Compare mode B"
            value={d.b}
            options={modes
              .map((label, value) => ({ label, value }))
              .filter((o) => o.value !== d.a)}
            onChange={(n) => change({ b: +n })}
          />
          <div className="analysis-card">
            <h4>Shared pitches · {common(a, b).length}</h4>
            <p>
              {common(a, b)
                .map((n) => pitchName(n))
                .join(" · ")}
            </p>
            <h4>Only {modes[d.a]}</h4>
            <p>
              {a
                .filter((n) => !b.includes(n))
                .map((n) => pitchName(n))
                .join(" · ") || "None"}
            </p>
            <h4>Only {modes[d.b]}</h4>
            <p>
              {b
                .filter((n) => !a.includes(n))
                .map((n) => pitchName(n))
                .join(" · ") || "None"}
            </p>
            {d.relation === "parallel" && (
              <>
                <h4>Altered degrees · A → B</h4>
                <p>
                  {a
                    .map((n, i) => ({ i, delta: ((b[i] - n + 18) % 12) - 6 }))
                    .filter((x) => x.delta)
                    .map(
                      (x) => `${x.i + 1}: ${x.delta > 0 ? "+" : ""}${x.delta}`,
                    )
                    .join(" · ") || "None"}
                </p>
              </>
            )}
          </div>
        </>
      );
    }
  }
}
function RhythmGardenControls({ study: s, edit }: Props & { study: Extract<Study, { kind: "rhythmGarden" }> }) {
  const d = s.data;
  return <>
    <Select label="Grid width" value={d.width} options={[8, 16, 32].map((value) => ({ label: `${value} steps`, value }))} onChange={(width) => edit((study) => {
      if (study.kind === "rhythmGarden") {
        const next = +width as 8 | 16 | 32;
        study.data.width = next;
        study.data.seed = Array.from({ length: next }, (_, i) => study.data.seed[Math.floor(i * study.data.seed.length / next)] ?? false);
        study.data.selectedGeneration = Math.min(study.data.selectedGeneration, study.data.generations);
      }
    })} />
    <NumberField label="Elementary rule" value={d.rule} min={0} max={255} onChange={(rule) => edit((study) => { if (study.kind === "rhythmGarden") study.data.rule = rule; })} />
    <Select label="Edge behavior" value={d.edgeMode} options={[{ label: "Fixed-zero edges", value: "fixed-zero" }, { label: "Cyclic edges", value: "cyclic" }]} onChange={(edgeMode) => edit((study) => { if (study.kind === "rhythmGarden") study.data.edgeMode = edgeMode as typeof d.edgeMode; })} />
    <NumberField label="Derived generations" value={d.generations} min={1} max={16} onChange={(generations) => edit((study) => { if (study.kind === "rhythmGarden") { study.data.generations = generations; study.data.selectedGeneration = Math.min(study.data.selectedGeneration, generations); } })} />
    <NumberField label="Generation to inspect or capture" value={d.selectedGeneration} min={0} max={d.generations} onChange={(selectedGeneration) => edit((study) => { if (study.kind === "rhythmGarden") study.data.selectedGeneration = selectedGeneration; })} />
    <Field label="Paint seed · hits / rests"><div className="chip-grid">{d.seed.map((live, index) => <button key={index} aria-pressed={live} onClick={() => edit((study) => { if (study.kind === "rhythmGarden") study.data.seed[index] = !study.data.seed[index]; })}>{live ? "●" : "○"} {index + 1}</button>)}</div></Field>
    <p className="hint">A row is an onset proposal, never another bar. Rule 90 means left XOR right; capture stays explicit.</p>
  </>;
}
function JourneyControls({ study: s, edit, node }: Props & { study: Extract<Study, { kind: "journey" }> }) {
  const d = s.data;
  const selected = d.phrases.find((phrase) => phrase.id === node?.id);
  return <>
    <Select label="Starting phrase" value={d.start} options={d.phrases.map((phrase) => ({ label: phrase.name, value: phrase.id }))} onChange={(start) => edit((study) => { if (study.kind === "journey") study.data.start = start; }, true)} />
    <NumberField label="Route seed" value={d.seed} min={0} max={9999} onChange={(seed) => edit((study) => { if (study.kind === "journey") study.data.seed = seed; }, true)} />
    <NumberField label="Preview visits" value={d.steps} min={1} max={32} onChange={(steps) => edit((study) => { if (study.kind === "journey") study.data.steps = steps; }, true)} />
    <Field label="Choice weights"><div className="choice-list">{d.choices.map((choice) => { const from = d.phrases.find((phrase) => phrase.id === choice.from)!; const to = d.phrases.find((phrase) => phrase.id === choice.to)!; return <div key={choice.id}><span>{from.name} → {to.name}</span><input aria-label={`${from.name} to ${to.name} weight`} type="range" min="0" max="10" value={choice.weight} onChange={(event) => edit((study) => { if (study.kind === "journey") study.data.choices.find((item) => item.id === choice.id)!.weight = +event.target.value; }, true)} /><output>{choice.weight}</output></div>; })}</div></Field>
    {selected && <NoteEdit notes={selected.notes} label={`${selected.name} notes · pitch:beats`} button="Update selected phrase" onApply={(notes) => edit((study) => { if (study.kind === "journey") study.data.phrases.find((phrase) => phrase.id === selected.id)!.notes = notes; })} />}
    <p className="hint">Weights are relative only among eligible choices at each decision. A saved seed keeps the preview repeatable.</p>
  </>;
}
function LandscapeControls({ study: s, edit }: Props & { study: Extract<Study, { kind: "landscape" }> }) {
  const d = s.data;
  const preview = landscapePreview(d.source, d.anchors, d.cursor);
  return <>
    <NoteEdit notes={d.source} label="Source motif · pitch:beats" button="Update source" onApply={(source) => edit((study) => { if (study.kind === "landscape") study.data.source = source; })} />
    <NumberField label="Horizontal cursor · sparse to busy" value={d.cursor.x} min={0} max={1} step={0.05} onChange={(x) => edit((study) => { if (study.kind === "landscape") study.data.cursor.x = x; })} />
    <NumberField label="Vertical cursor · low to high" value={d.cursor.y} min={0} max={1} step={0.05} onChange={(y) => edit((study) => { if (study.kind === "landscape") study.data.cursor.y = y; })} />
    <Field label="Anchors"><div className="choice-list">{d.anchors.map((anchor) => <div key={anchor.id}><span>{anchor.name}</span><button onClick={() => edit((study) => { if (study.kind === "landscape") { study.data.cursor = { x: anchor.x, y: anchor.y }; } })}>Visit</button></div>)}</div></Field>
    <button className="small-button" onClick={() => edit((study) => { if (study.kind === "landscape") study.data.committed.push({ id: uid(), name: `Candidate ${study.data.committed.length + 1}`, notes: structuredClone(preview.notes) }); })}>Commit candidate snapshot</button>
    <p className="hint">The cursor derives a candidate; it does not save it. Activity keeps the earliest source notes, register moves them by semitones.</p>
  </>;
}
function CounterpointControls({ study: s, edit }: Props & { study: Extract<Study, { kind: "counterpoint" }> }) {
  const d = s.data;
  const candidates = counterpointCandidates(d.bass, d.soprano, d.anchor, d.pins, d.inspectBeat);
  return <>
    <Select label="Pinned voice" value={d.anchor} options={[{ label: "Bass fixed · choose soprano", value: "bass" }, { label: "Soprano fixed · choose bass", value: "soprano" }]} onChange={(anchor) => edit((study) => { if (study.kind === "counterpoint") study.data.anchor = anchor as typeof d.anchor; }, true)} />
    <NumberField label="Beat to inspect" value={d.inspectBeat + 1} min={1} max={6} onChange={(beat) => edit((study) => { if (study.kind === "counterpoint") study.data.inspectBeat = beat - 1; })} />
    <Field label="Pinned candidate · beat"><div className="chip-grid">{d.soprano.map((_, index) => <button key={index} aria-pressed={d.pins[index] !== undefined} onClick={() => edit((study) => { if (study.kind === "counterpoint") { if (study.data.pins[index] === undefined) study.data.pins[index] = (study.data.anchor === "bass" ? study.data.soprano : study.data.bass)[index]; else delete study.data.pins[index]; } }, true)}>Beat {index + 1}{d.pins[index] === undefined ? " · open" : " · pinned"}</button>)}</div></Field>
    <Field label="Possible notes at inspected beat"><div className="chip-grid">{candidates.map((candidate) => <button key={candidate.pitch} disabled={!candidate.accepted} onClick={() => edit((study) => { if (study.kind === "counterpoint") { study.data.pins[study.data.inspectBeat] = candidate.pitch; const line = study.data.anchor === "bass" ? study.data.soprano : study.data.bass; line[study.data.inspectBeat] = candidate.pitch; } }, true)}>{noteName(candidate.pitch)} · {candidate.accepted ? "use" : candidate.reason}</button>)}</div></Field>
    <p className="hint">This is one C-major two-voice consonance profile: consonant vertical intervals, no crossing, octave ends, and no parallel perfect intervals.</p>
  </>;
}
function AtlasControls({
  study: s,
  edit,
}: Props & { study: Extract<Study, { kind: "atlas" }> }) {
  const d = s.data;
  const change = (data: Partial<typeof d>) =>
    edit((study) => {
      if (study.kind === "atlas") Object.assign(study.data, data);
    });
  return (
    <>
      <Select
        label="Source chord · root"
        value={d.source.root}
        options={pcOptions}
        onChange={(root) => change({ source: { ...d.source, root: +root } })}
      />
      <Select
        label="Source chord · quality"
        value={d.source.quality}
        options={["major", "minor", "dim"]}
        onChange={(quality) =>
          change({ source: { ...d.source, quality: quality as typeof d.source.quality } })
        }
      />
      <Field label="Held pitch classes">
        <div className="chip-grid">
          {sharpNames.map((name, pitch) => (
            <button
              key={name}
              aria-pressed={d.pins.includes(pitch)}
              disabled={!d.pins.includes(pitch) && d.pins.length >= 3}
              onClick={() =>
                change({
                  pins: d.pins.includes(pitch)
                    ? d.pins.filter((value) => value !== pitch)
                    : [...d.pins, pitch],
                })
              }
            >
              {name}
            </button>
          ))}
        </div>
      </Field>
      <p className="hint">
        Held notes filter triads by pitch class. A shared note does not by itself
        prove a good progression, voicing, or key.
      </p>
    </>
  );
}
function WeaveControls({
  study: s,
  edit,
}: Props & { study: Extract<Study, { kind: "weave" }> }) {
  const d = s.data;
  return (
    <>
      <TimedEventEdit
        events={d.source}
        onApply={(source) =>
          edit((study) => {
            if (study.kind === "weave") study.data.source = source;
          })
        }
      />
      <NumberField
        label="Follower delay · beats"
        value={d.delay}
        min={0}
        max={16}
        step={0.5}
        onChange={(delay) =>
          edit((study) => {
            if (study.kind === "weave") study.data.delay = delay;
          })
        }
      />
      <NumberField
        label="Follower transposition · semitones"
        value={d.transpose}
        min={-24}
        max={24}
        onChange={(transpose) =>
          edit((study) => {
            if (study.kind === "weave") study.data.transpose = transpose;
          })
        }
      />
      <Field label="Follower order">
        <button
          aria-pressed={d.reversed}
          onClick={() =>
            edit((study) => {
              if (study.kind === "weave") study.data.reversed = !study.data.reversed;
            })
          }
        >
          {d.reversed ? "Reversed phrase" : "Original phrase order"}
        </button>
      </Field>
      <p className="hint">The displayed follower is derived from the saved source. Pan and zoom do not retime it.</p>
    </>
  );
}
function RecipeControls({
  study: s,
  edit,
}: Props & { study: Extract<Study, { kind: "recipe" }> }) {
  const d = s.data;
  return (
    <>
      <NoteEdit
        notes={d.source}
        label="Recipe source · pitch:beats"
        button="Update source"
        onApply={(source) =>
          edit((study) => {
            if (study.kind === "recipe") study.data.source = source;
          })
        }
      />
      <NumberField
        label="Sequential copies"
        value={d.repeats}
        min={1}
        max={4}
        onChange={(repeats) =>
          edit((study) => {
            if (study.kind === "recipe") {
              study.data.repeats = repeats;
              study.data.targetCopy = Math.min(study.data.targetCopy, repeats);
            }
          })
        }
      />
      <NumberField
        label="Edited copy"
        value={d.targetCopy}
        min={1}
        max={d.repeats}
        onChange={(targetCopy) =>
          edit((study) => {
            if (study.kind === "recipe") study.data.targetCopy = targetCopy;
          })
        }
      />
      <NumberField
        label="Move edited copy · semitones"
        value={d.transpose}
        min={-24}
        max={24}
        onChange={(transpose) =>
          edit((study) => {
            if (study.kind === "recipe") study.data.transpose = transpose;
          })
        }
      />
      <NumberField
        label="Shorten edited ending · beats"
        value={d.shortenEnding}
        min={0}
        max={Math.max(0, d.source.at(-1)!.duration - 0.125)}
        step={0.125}
        onChange={(shortenEnding) =>
          edit((study) => {
            if (study.kind === "recipe") study.data.shortenEnding = shortenEnding;
          })
        }
      />
      <p className="hint">A recipe stores operations, not card positions. The rows are recalculated from the source and the named copy.</p>
    </>
  );
}
function GestureControls({
  study: s,
  edit,
}: Props & { study: Extract<Study, { kind: "gesture" }> }) {
  const d = s.data;
  const [text, setText] = useState(
      d.points.map((point) => `${point.beat}@${noteName(Math.round(point.value))}`).join(" "),
    ),
    [error, setError] = useState("");
  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const points = text.trim().split(/\s+/).map((token) => {
            const match = /^([\d.]+)@(.+)$/.exec(token);
            return match && { beat: Number(match[1]), value: parseNote(match[2]) };
          });
          const step = d.sampleStep;
          if (
            points.length < 2 ||
            points.length > 16 ||
            points.some(
              (point, index) =>
                !point ||
                point.value === null ||
                !Number.isFinite(point.beat) ||
                point.beat < 0 ||
                point.beat > 16 ||
                (index === 0 ? point.beat !== 0 : point.beat <= points[index - 1]!.beat) ||
                Math.abs(point.beat / step - Math.round(point.beat / step)) > 0.000001,
            ) ||
            Math.floor(points.at(-1)!.beat / step) + 1 > 16
          ) {
            setError(`Use 2–16 ordered points such as 0@C4 1@E4. Times must start at 0, follow the ${step}-beat grid, and produce at most 16 samples.`);
            return;
          }
          setError("");
          edit((study) => {
            if (study.kind === "gesture")
              study.data.points = points.map((point, index) => ({
                id: study.data.points[index]?.id ?? uid(),
                beat: point!.beat,
                value: point!.value!,
              }));
          });
        }}
      >
        <Field label="Contour points · beat@pitch">
          <textarea
            aria-label="Contour points · beat@pitch"
            rows={3}
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        </Field>
        {error && <p role="alert" className="error">{error}</p>}
        <button type="submit" className="small-button">Update contour</button>
      </form>
      <Select
        label="Scale root"
        value={d.root}
        options={pcOptions}
        onChange={(root) =>
          edit((study) => {
            if (study.kind === "gesture") study.data.root = +root;
          })
        }
      />
      <Select
        label="Scale mode"
        value={d.mode}
        options={modes.map((label, value) => ({ label, value }))}
        onChange={(mode) =>
          edit((study) => {
            if (study.kind === "gesture") study.data.mode = +mode;
          })
        }
      />
      <Select
        label="Sampling grid"
        value={d.sampleStep}
        options={[
          { label: "Quarter beat", value: 0.25 },
          { label: "Half beat", value: 0.5 },
          { label: "Whole beat", value: 1 },
        ]}
        onChange={(sampleStep) =>
          edit((study) => {
            if (study.kind === "gesture") study.data.sampleStep = +sampleStep as 0.25 | 0.5 | 1;
          })
        }
      />
      <p className="hint">The contour is linear. Each sample shows raw value, rounding, and scale snap before it becomes a note.</p>
    </>
  );
}
function RhythmControls({
  study: s,
  node,
  edit,
}: Props & { study: Extract<Study, { kind: "mandala" }> }) {
  const d = s.data;
  function change(
    id: string,
    fn: (r: Data["mandala"]["rings"][number]) => void,
  ) {
    edit((s) => {
      if (s.kind === "mandala") fn(s.data.rings.find((r) => r.id === id)!);
    });
  }
  return (
    <>
      <NumberField
        label="Visual clock · BPM"
        value={d.bpm}
        min={30}
        max={240}
        onChange={(bpm) =>
          edit((s) => {
            if (s.kind === "mandala") s.data.bpm = bpm;
          })
        }
      />
      {d.rings.map((r, i) => (
        <details
          className="ring-editor"
          key={r.id}
          open={node?.meta?.ring === r.id || i === 0}
        >
          <summary>
            {r.name}
            <span>
              {r.hits}/{r.steps} · {r.bars} bar
            </span>
          </summary>
          <TextEdit
            label="Ring name"
            value={r.name}
            onApply={(name) => {
              if (name.trim())
                change(r.id, (r) => {
                  r.name = name.trim();
                });
            }}
          />
          <NumberField
            label={r.name + " steps"}
            value={r.steps}
            min={2}
            max={48}
            onChange={(steps) =>
              change(r.id, (r) => {
                r.steps = steps;
                r.hits = Math.min(r.hits, steps);
                r.rotation %= steps;
                r.enabled = evenHits(steps, r.hits, r.rotation);
                r.accents = r.accents.filter((n) => r.enabled.includes(n));
              })
            }
          />
          <NumberField
            label={r.name + " hits"}
            value={r.hits}
            min={0}
            max={r.steps}
            onChange={(hits) =>
              change(r.id, (r) => {
                r.hits = hits;
                r.enabled = evenHits(r.steps, hits, r.rotation);
                r.accents = r.accents.filter((n) => r.enabled.includes(n));
              })
            }
          />
          <NumberField
            label={r.name + " rotation"}
            value={r.rotation}
            min={0}
            max={r.steps - 1}
            onChange={(rotation) =>
              change(r.id, (r) => {
                const shift = rotation - r.rotation;
                r.enabled = rotateSteps(r.enabled, shift, r.steps);
                r.accents = rotateSteps(r.accents, shift, r.steps);
                r.rotation = rotation;
              })
            }
          />
          <NumberField
            label={r.name + " cycle · bars"}
            value={r.bars}
            min={1}
            max={4}
            onChange={(bars) =>
              change(r.id, (r) => {
                r.bars = bars;
              })
            }
          />
          <div className="button-row">
            <button
              onClick={() =>
                change(r.id, (r) => {
                  r.enabled = evenHits(r.steps, r.hits, r.rotation);
                  r.accents = r.accents.filter((n) => r.enabled.includes(n));
                })
              }
            >
              Distribute evenly
            </button>
            <button
              disabled={d.rings.length === 1}
              onClick={() =>
                edit((s) => {
                  if (s.kind === "mandala")
                    s.data.rings = s.data.rings.filter((x) => x.id !== r.id);
                })
              }
            >
              Remove ring
            </button>
          </div>
        </details>
      ))}
      <button
        className="wide-button"
        disabled={d.rings.length >= 4}
        onClick={() =>
          edit((s) => {
            if (s.kind === "mandala")
              s.data.rings.push({
                id: uid(),
                name: "Percussion " + (s.data.rings.length + 1),
                steps: 16,
                hits: 5,
                rotation: 0,
                bars: 1,
                enabled: evenHits(16, 5),
                accents: [],
              });
          })
        }
      >
        + Add ring
      </button>
      {node?.meta?.ring && (
        <div className="analysis-card">
          <h4>Step {node.meta.step! + 1}</h4>
          <div className="button-row">
            <button
              onClick={() =>
                change(node.meta!.ring!, (r) => {
                  const step = node.meta!.step!;
                  r.enabled = r.enabled.includes(step)
                    ? r.enabled.filter((n) => n !== step)
                    : [...r.enabled, step].sort((a, b) => a - b);
                  r.hits = r.enabled.length;
                  r.accents = r.accents.filter((n) => r.enabled.includes(n));
                })
              }
            >
              Toggle hit
            </button>
            <button
              disabled={
                !d.rings
                  .find((r) => r.id === node.meta!.ring)
                  ?.enabled.includes(node.meta.step!)
              }
              onClick={() =>
                change(node.meta!.ring!, (r) => {
                  const step = node.meta!.step!;
                  r.accents = r.accents.includes(step)
                    ? r.accents.filter((n) => n !== step)
                    : [...r.accents, step];
                })
              }
            >
              Toggle accent
            </button>
          </div>
        </div>
      )}
    </>
  );
}
function MotifControls({
  study: s,
  node,
  edit,
}: Props & { study: Extract<Study, { kind: "motif" }> }) {
  const d = s.data,
    original = d.variations.find((v) => v.parent === null)!,
    parent =
      d.variations.find((v) => v.id === node?.meta?.variation) || original;
  const [operation, setOperation] = useState<
      "transpose" | "invert" | "reverse" | "stretch"
    >("transpose"),
    [amount, setAmount] = useState(2),
    [preview, setPreview] = useState<Note[] | null>(null);
  let depth = 0,
    ancestor = parent;
  while (ancestor.parent) {
    depth++;
    ancestor = d.variations.find((v) => v.id === ancestor.parent)!;
  }
  const result = transformNotes(parent.notes, operation, amount),
    description =
      operation === "transpose"
        ? `Move ${amount < 0 ? "down" : "up"} ${Math.abs(amount)} semitones`
        : operation === "invert"
          ? `Mirror around ${noteName(amount)}`
          : operation === "reverse"
            ? "Reverse note order"
            : amount === 2
              ? "Double note lengths"
              : `Multiply note lengths by ${amount}`,
    valid = result.every(
      (n) =>
        n.pitch >= 0 &&
        n.pitch <= 127 &&
        n.duration >= 0.125 &&
        n.duration <= 16,
    );
  return (
    <>
      <details className="motif-seed-editor">
        <summary>Edit the original melody</summary>
        <NoteEdit
          key={original.id + formatNotes(original.notes)}
          notes={original.notes}
          button="Update seed & clear variants"
          onApply={(notes) => {
            setPreview(null);
            edit((s) => {
              if (s.kind === "motif") {
                s.data.variations = [{ ...original, notes }];
              }
            }, true);
          }}
        />
      </details>
      <div className="rule-divider" />
      <h4>Make a version of {parent.name}</h4>
      <p className="hint">
        Choose a change, compare the notes, then keep it as a new branch.
      </p>
      <Select
        label="Transformation"
        value={operation}
        options={["transpose", "invert", "reverse", "stretch"].map((v) => ({
          value: v,
          label: {
            transpose: "Move notes up or down (transpose)",
            invert: "Mirror the melody (invert)",
            reverse: "Reverse note order (retrograde)",
            stretch: "Make notes longer or shorter",
          }[v]!,
        }))}
        onChange={(n) => {
          setOperation(n as typeof operation);
          setAmount(n === "invert" ? 60 : n === "stretch" ? 2 : 2);
          setPreview(null);
        }}
      />
      {operation === "transpose" && (
        <NumberField
          label="Semitones"
          value={amount}
          min={-12}
          max={12}
          onChange={(n) => {
            setAmount(n);
            setPreview(null);
          }}
        />
      )}
      {operation === "invert" && (
        <Select
          label="Inversion axis"
          value={amount}
          options={Array.from({ length: 37 }, (_, i) => ({
            value: i + 48,
            label: noteName(i + 48),
          }))}
          onChange={(n) => {
            setAmount(+n);
            setPreview(null);
          }}
        />
      )}
      {operation === "stretch" && (
        <Select
          label="Duration multiplier"
          value={amount}
          options={[0.5, 1, 2, 4].map((n) => ({ value: n, label: n + "×" }))}
          onChange={(n) => {
            setAmount(+n);
            setPreview(null);
          }}
        />
      )}
      <button
        className="wide-button"
        disabled={!valid || depth >= 4 || d.variations.length >= 128}
        onClick={() => setPreview(result)}
      >
        Preview variation
      </button>
      {depth >= 4 && (
        <p className="hint">Maximum generation depth reached (4).</p>
      )}
      {!valid && (
        <p className="error">
          This variation exceeds the pitch or duration range.
        </p>
      )}
      {preview && (
        <div className="preview">
          <h4>{description}</h4>
          <MotifComparison
            before={parent.notes}
            after={result}
            beforeName={parent.name}
            afterName="Proposed variation"
          />
          <p>
            {result
              .map(
                (n, i) =>
                  `${i + 1}: ${n.pitch - parent.notes[i].pitch >= 0 ? "+" : ""}${n.pitch - parent.notes[i].pitch} semitones, ${n.duration / parent.notes[i].duration}× duration`,
              )
              .join(" · ")}
          </p>
          <div className="button-row">
            <button
              onClick={() => {
                edit((s) => {
                  if (s.kind === "motif")
                    s.data.variations.push({
                      id: uid(),
                      parent: parent.id,
                      name: "Variation " + s.data.variations.length,
                      operation: description,
                      notes: result,
                    });
                });
                setPreview(null);
              }}
            >
              Add child
            </button>
            <button onClick={() => setPreview(null)}>Discard</button>
          </div>
        </div>
      )}
    </>
  );
}
function SpiralControls({
  study: s,
  node,
  edit,
}: Props & { study: Extract<Study, { kind: "spiral" }> }) {
  const d = s.data;
  const change = (pitches: number[]) =>
    edit((s) => {
      if (s.kind === "spiral") {
        s.data.pitches = pitches;
        s.data.minOctave = Math.min(
          s.data.minOctave,
          ...pitches.map((n) => Math.floor(n / 12) - 1),
        );
        s.data.maxOctave = Math.max(
          s.data.maxOctave,
          ...pitches.map((n) => Math.floor(n / 12) - 1),
        );
      }
    });
  return (
    <>
      <TextEdit
        key={d.pitches.join()}
        label="Voices · octave-labeled pitches"
        value={d.pitches.map((n) => spelledNoteName(n, d.spellings)).join(" ")}
        button="Update voicing"
        onApply={(text) => {
          const notes = text.trim().split(/\s+/).map(parseNote);
          if (
            notes.length > 0 &&
            notes.length <= 12 &&
            notes.every((n) => n !== null && n >= 12 && n <= 119) &&
            new Set(notes).size === notes.length
          )
            change(notes as number[]);
          else
            window.alert(
              "Use 1–12 distinct pitches from C0 to B8, e.g. C3 G3 E4 C5.",
            );
        }}
      />
      <div className="button-row">
        <button
          disabled={Math.min(...d.pitches) < 24}
          onClick={() => change(invertVoicing(d.pitches, false))}
        >
          Invert down
        </button>
        <button
          disabled={Math.max(...d.pitches) > 107}
          onClick={() => change(invertVoicing(d.pitches))}
        >
          Invert up
        </button>
      </div>
      <NumberField
        label="Lowest displayed octave"
        value={d.minOctave}
        min={0}
        max={Math.min(...d.pitches.map((n) => Math.floor(n / 12) - 1))}
        onChange={(n) =>
          edit((s) => {
            if (s.kind === "spiral") s.data.minOctave = n;
          })
        }
      />
      <NumberField
        label="Highest displayed octave"
        value={d.maxOctave}
        min={Math.max(...d.pitches.map((n) => Math.floor(n / 12) - 1))}
        max={8}
        onChange={(n) =>
          edit((s) => {
            if (s.kind === "spiral") s.data.maxOctave = n;
          })
        }
      />
      {node?.meta?.noteIndex !== undefined && node.meta.noteIndex >= 0 && (
        <div className="analysis-card">
          <h4>
            Voice {node.meta.noteIndex + 1} · {node.label}
          </h4>
          <div className="button-row">
            {[-12, 12].map((delta) => (
              <button
                key={delta}
                disabled={
                  d.pitches[node.meta!.noteIndex!] + delta < 12 ||
                  d.pitches[node.meta!.noteIndex!] + delta > 119 ||
                  d.pitches.includes(d.pitches[node.meta!.noteIndex!] + delta)
                }
                onClick={() =>
                  change(
                    d.pitches.map((p, i) =>
                      i === node.meta!.noteIndex ? p + delta : p,
                    ),
                  )
                }
              >
                {delta < 0 ? "Octave down" : "Octave up"}
              </button>
            ))}
          </div>
        </div>
      )}
      <p className="hint">
        Pitches remain exact. Changing the visible octave range does not
        transpose voices.
      </p>
    </>
  );
}
function FormControls({
  study: s,
  node,
  edit,
  collapsed,
  setCollapsed,
}: Props & { study: Extract<Study, { kind: "form" }> }) {
  const d = s.data,
    section = d.sections.find((x) => x.id === node?.meta?.section),
    phrase = section?.phrases.find((p) => p.id === node?.meta?.phrase),
    occurrence = phrase?.occurrences.find(
      (o) => o.id === node?.meta?.occurrence,
    ),
    definition = d.definitions.find((m) => m.id === occurrence?.definition);
  const modify = (fn: (d: Data["form"]) => void) =>
    edit((s) => {
      if (s.kind === "form") fn(s.data);
    }, true);
  const newPhrase = (): Phrase => ({
    id: uid(),
    name: "New phrase",
    occurrences: [{ id: uid(), definition: d.definitions[0].id }],
  });
  const cloneSection = (s: Section): Section => ({
    ...structuredClone(s),
    id: uid(),
    name: s.name + " copy",
    phrases: s.phrases.map((p) => ({
      ...p,
      id: uid(),
      occurrences: p.occurrences.map((o) => ({ ...o, id: uid() })),
    })),
  });
  function reorder(items: { id: string }[], id: string, delta: number) {
    const i = items.findIndex((x) => x.id === id),
      j = i + delta;
    if (j >= 0 && j < items.length) [items[i], items[j]] = [items[j], items[i]];
  }
  return (
    <>
      <button
        className="wide-button"
        disabled={d.sections.length >= 16}
        onClick={() =>
          modify((d) =>
            d.sections.push({
              id: uid(),
              name: "New section",
              phrases: [newPhrase()],
            }),
          )
        }
      >
        + Add section
      </button>
      <p className="hint">
        Select a section, phrase, or motif occurrence to edit it. Repeated
        definition IDs mean linked material.
      </p>
      {section && !phrase && (
        <>
          <TextEdit
            key={section.id}
            label="Section name"
            value={section.name}
            onApply={(name) => {
              if (name.trim())
                modify((d) => {
                  d.sections.find((s) => s.id === section.id)!.name =
                    name.trim();
                });
            }}
          />
          <div className="button-row">
            <button
              onClick={() => modify((d) => reorder(d.sections, section.id, -1))}
            >
              Move earlier
            </button>
            <button
              onClick={() => modify((d) => reorder(d.sections, section.id, 1))}
            >
              Move later
            </button>
          </div>
          <div className="button-row">
            <button
              disabled={d.sections.length >= 16}
              onClick={() =>
                modify((d) => d.sections.push(cloneSection(section)))
              }
            >
              Duplicate section
            </button>
            <button
              disabled={section.phrases.length >= 16}
              onClick={() =>
                modify((d) =>
                  d.sections
                    .find((s) => s.id === section.id)!
                    .phrases.push(newPhrase()),
                )
              }
            >
              Add phrase
            </button>
          </div>
          <button
            disabled={d.sections.length === 1}
            onClick={() =>
              modify((d) => {
                d.sections = d.sections.filter((s) => s.id !== section.id);
              })
            }
          >
            Delete section
          </button>
        </>
      )}
      {section && phrase && !occurrence && (
        <>
          <TextEdit
            key={phrase.id}
            label="Phrase name"
            value={phrase.name}
            onApply={(name) => {
              if (name.trim())
                modify((d) => {
                  d.sections
                    .find((s) => s.id === section.id)!
                    .phrases.find((p) => p.id === phrase.id)!.name =
                    name.trim();
                });
            }}
          />
          <div className="button-row">
            <button
              onClick={() =>
                modify((d) =>
                  reorder(
                    d.sections.find((s) => s.id === section.id)!.phrases,
                    phrase.id,
                    -1,
                  ),
                )
              }
            >
              Move earlier
            </button>
            <button
              onClick={() =>
                modify((d) =>
                  reorder(
                    d.sections.find((s) => s.id === section.id)!.phrases,
                    phrase.id,
                    1,
                  ),
                )
              }
            >
              Move later
            </button>
          </div>
          <div className="button-row">
            <button
              disabled={section.phrases.length >= 16}
              onClick={() =>
                modify((d) =>
                  d.sections
                    .find((s) => s.id === section.id)!
                    .phrases.push({
                      ...structuredClone(phrase),
                      id: uid(),
                      name: phrase.name + " copy",
                      occurrences: phrase.occurrences.map((o) => ({
                        ...o,
                        id: uid(),
                      })),
                    }),
                )
              }
            >
              Duplicate phrase
            </button>
            <button
              disabled={phrase.occurrences.length >= 16}
              onClick={() =>
                modify((d) =>
                  d.sections
                    .find((s) => s.id === section.id)!
                    .phrases.find((p) => p.id === phrase.id)!
                    .occurrences.push({
                      id: uid(),
                      definition: d.definitions[0].id,
                    }),
                )
              }
            >
              Add motif
            </button>
          </div>
          <button
            disabled={section.phrases.length === 1}
            onClick={() =>
              modify((d) => {
                const s = d.sections.find((s) => s.id === section.id)!;
                s.phrases = s.phrases.filter((p) => p.id !== phrase.id);
              })
            }
          >
            Delete phrase
          </button>
        </>
      )}
      {section && phrase && occurrence && definition && (
        <>
          <h4>
            {definition.name} · {totalDuration(definition.notes)} beats
          </h4>
          <p className="hint">
            Editing this definition updates{" "}
            {
              d.sections
                .flatMap((s) => s.phrases.flatMap((p) => p.occurrences))
                .filter((o) => o.definition === definition.id).length
            }{" "}
            linked occurrences.
          </p>
          <TextEdit
            key={definition.id + "name"}
            label="Definition name"
            value={definition.name}
            onApply={(name) => {
              if (name.trim())
                modify((d) => {
                  d.definitions.find((m) => m.id === definition.id)!.name =
                    name.trim();
                });
            }}
          />
          <NoteEdit
            key={definition.id + formatNotes(definition.notes)}
            notes={definition.notes}
            button="Update linked definition"
            onApply={(notes) =>
              modify((d) => {
                d.definitions.find((m) => m.id === definition.id)!.notes =
                  notes;
              })
            }
          />
          <div className="button-row">
            <button
              disabled={phrase.occurrences.length >= 16}
              onClick={() =>
                modify((d) =>
                  copyOccurrence(
                    d,
                    d.sections
                      .find((s) => s.id === section.id)!
                      .phrases.find((p) => p.id === phrase.id)!,
                    occurrence,
                    true,
                  ),
                )
              }
            >
              Duplicate linked
            </button>
            <button
              disabled={phrase.occurrences.length >= 16}
              onClick={() =>
                modify((d) =>
                  copyOccurrence(
                    d,
                    d.sections
                      .find((s) => s.id === section.id)!
                      .phrases.find((p) => p.id === phrase.id)!,
                    occurrence,
                    false,
                  ),
                )
              }
            >
              Duplicate independent
            </button>
          </div>
          <button
            onClick={() =>
              modify((d) => {
                const def = {
                  ...structuredClone(definition),
                  id: uid(),
                  name: definition.name + " independent",
                };
                d.definitions.push(def);
                d.sections
                  .find((s) => s.id === section.id)!
                  .phrases.find((p) => p.id === phrase.id)!
                  .occurrences.find((o) => o.id === occurrence.id)!.definition =
                  def.id;
              })
            }
          >
            Unlink this occurrence
          </button>
          <div className="button-row">
            <button
              onClick={() =>
                modify((d) =>
                  reorder(
                    d.sections
                      .find((s) => s.id === section.id)!
                      .phrases.find((p) => p.id === phrase.id)!.occurrences,
                    occurrence.id,
                    -1,
                  ),
                )
              }
            >
              Move earlier
            </button>
            <button
              onClick={() =>
                modify((d) =>
                  reorder(
                    d.sections
                      .find((s) => s.id === section.id)!
                      .phrases.find((p) => p.id === phrase.id)!.occurrences,
                    occurrence.id,
                    1,
                  ),
                )
              }
            >
              Move later
            </button>
          </div>
          <button
            disabled={phrase.occurrences.length === 1}
            onClick={() =>
              modify((d) => {
                const p = d.sections
                  .find((s) => s.id === section.id)!
                  .phrases.find((p) => p.id === phrase.id)!;
                p.occurrences = p.occurrences.filter(
                  (o) => o.id !== occurrence.id,
                );
              })
            }
          >
            Delete occurrence
          </button>
        </>
      )}
      {node && (section || phrase) && !occurrence && (
        <button
          className="wide-button"
          onClick={() =>
            setCollapsed(
              collapsed.includes(node.id)
                ? collapsed.filter((id) => id !== node.id)
                : [...collapsed, node.id],
            )
          }
        >
          {collapsed.includes(node.id) ? "Expand" : "Collapse"} contents · view
          only
        </button>
      )}
    </>
  );
}
