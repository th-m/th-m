import type { Note } from "./model";
import { noteName, totalDuration } from "./music";

export function rollDomain(groups: Note[][]) {
  const pitches = groups.flat().map((n) => n.pitch);
  return {
    low: Math.min(...pitches) - 2,
    high: Math.max(...pitches) + 2,
    beats: Math.max(4, ...groups.map(totalDuration)),
  };
}
type Domain = ReturnType<typeof rollDomain>;

/** Both versions use the same pitch and time axes, so changes remain visible. */
export function PianoRollMarks({
  notes,
  domain,
  width,
  height,
}: {
  notes: Note[];
  domain: Domain;
  width: number;
  height: number;
}) {
  let onset = 0;
  const y = (pitch: number) =>
    ((domain.high - pitch) / (domain.high - domain.low)) * (height - 18) + 4;
  const noteHeight = Math.max(
    3,
    Math.min(7, (height - 18) / (domain.high - domain.low)),
  );
  return (
    <g className="piano-roll-marks" aria-hidden="true">
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <line
          key={f}
          x1={f * width}
          x2={f * width}
          y1="0"
          y2={height - 8}
          className="roll-grid"
        />
      ))}
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1="0"
          x2={width}
          y1={f * (height - 18)}
          y2={f * (height - 18)}
          className="roll-grid"
        />
      ))}
      {notes.map((n, i) => {
        const x = (onset / domain.beats) * width;
        onset += n.duration;
        return (
          <g key={i}>
            <rect
              className="roll-note"
              x={x}
              y={y(n.pitch)}
              width={Math.max(2, (n.duration / domain.beats) * width - 2)}
              height={noteHeight}
              rx="2"
            />
            <text className="roll-note-name" x={x + 1} y={height + 5}>
              {noteName(n.pitch)}
            </text>
          </g>
        );
      })}
    </g>
  );
}
export function PianoRoll({
  notes,
  domain,
  label,
}: {
  notes: Note[];
  domain: Domain;
  label: string;
}) {
  return (
    <figure className="piano-roll">
      <figcaption>
        {label}
        <span>{totalDuration(notes)} beats</span>
      </figcaption>
      <svg
        viewBox="0 0 252 112"
        role="img"
        aria-label={`${label}: ${notes.map((n) => `${noteName(n.pitch)}, ${n.duration} beats`).join("; ")}`}
      >
        <g transform="translate(7 8)">
          <PianoRollMarks
            notes={notes}
            domain={domain}
            width={236}
            height={79}
          />
        </g>
        <text x="7" y="108" className="roll-axis">
          0
        </text>
        <text x="245" y="108" textAnchor="end" className="roll-axis">
          {domain.beats} beats →
        </text>
      </svg>
    </figure>
  );
}
export function MotifComparison({
  before,
  after,
  beforeName,
  afterName,
}: {
  before: Note[];
  after: Note[];
  beforeName: string;
  afterName: string;
}) {
  const domain = rollDomain([before, after]);
  return (
    <section className="motif-comparison" aria-label="Melody comparison">
      <PianoRoll notes={before} domain={domain} label={beforeName} />
      <PianoRoll notes={after} domain={domain} label={afterName} />
      <p className="hint">
        Read left to right. Higher blocks mean higher notes; longer blocks mean
        longer notes. Both diagrams use the same scale.
      </p>
    </section>
  );
}
