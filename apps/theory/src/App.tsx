import { MotifComparison, PianoRoll, rollDomain } from "./PianoRoll";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  families,
  newStudy,
  motifExamples,
  duplicateStudy,
  toSpiral,
  toForm,
  commit,
  undo,
  redo,
  type History,
  type Study,
  type Kind,
  type Workspace,
} from "./model";
import { buildGraph } from "./graphs";
import {
  loadWorkspace,
  saveWorkspace,
  decodeWorkspace,
  validateStudy,
} from "./storage";
import { Canvas } from "./Canvas";
import { Controls, TextEdit } from "./Controls";
import { modePcs, pitchName } from "./music";
function initial() {
  try {
    return loadWorkspace(window.localStorage);
  } catch {
    return loadWorkspace({
      getItem: () => {
        throw Error("Storage unavailable");
      },
    });
  }
}
export function Glyph({ kind }: { kind: Kind }) {
  const angles = Array.from({ length: 6 }, (_, i) => (i * Math.PI) / 3);
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="glyph">
      {kind === "mandala" || kind === "spiral" ? (
        <>
          {[8, 14, 20].map((r) => (
            <circle
              key={r}
              cx="24"
              cy="24"
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
          {angles.map((a, i) => (
            <circle
              key={i}
              cx={24 + 20 * Math.cos(a)}
              cy={24 + 20 * Math.sin(a)}
              r="2"
              fill="currentColor"
            />
          ))}
        </>
      ) : kind === "form" || kind === "motif" ? (
        <>
          <path
            d="M24 6V18M9 18H39M9 18V30M39 18V30M9 30L3 42M9 30L16 42M39 30L32 42M39 30L46 42"
            fill="none"
            stroke="currentColor"
          />
          {[
            [24, 6],
            [9, 24],
            [39, 24],
            [3, 42],
            [16, 42],
            [32, 42],
            [46, 42],
          ].map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="#101820"
              stroke="currentColor"
            />
          ))}
        </>
      ) : (
        <>
          {angles.map((a, i) => (
            <g key={i}>
              <path
                d={`M24 24L${24 + 18 * Math.cos(a)} ${24 + 18 * Math.sin(a)}`}
                stroke="currentColor"
              />
              <circle
                cx={24 + 18 * Math.cos(a)}
                cy={24 + 18 * Math.sin(a)}
                r={kind === "garden" ? 6 : 4}
                fill="#101820"
                stroke="currentColor"
              />
            </g>
          ))}
          <circle cx="24" cy="24" r="7" fill="#101820" stroke="currentColor" />
        </>
      )}
    </svg>
  );
}
export default function App() {
  const [boot] = useState(initial),
    [history, setHistory] = useState<History>({
      past: [],
      present: boot.workspace,
      future: [],
    }),
    [saving, setSaving] = useState(!boot.error),
    [storageError, setStorageError] = useState(boot.error),
    [message, setMessage] = useState(""),
    [selection, setSelection] = useState<string | null>(null),
    [collapsed, setCollapsed] = useState<string[]>([]),
    [running, setRunning] = useState(false),
    [beat, setBeat] = useState(0),
    [tab, setTab] = useState<"build" | "inspect">("build");
  const lastVisited = useRef<Partial<Record<Kind, string>>>({});
  const file = useRef<HTMLInputElement>(null),
    w = history.present,
    s = w.studies.find((s) => s.id === w.active)!,
    family = families.find((f) => f.kind === s.kind)!;
  const graph = useMemo(() => buildGraph(s, collapsed), [s, collapsed]),
    fullGraph = useMemo(() => {
      const full = structuredClone(s);
      if (full.kind === "snowflake" || full.kind === "honeycomb")
        full.data.depth = 4;
      return buildGraph(full);
    }, [s]),
    node = graph.nodes.find((n) => n.id === selection),
    link = graph.edges.find((e) => e.id === selection);
  useEffect(() => {
    if (saving) {
      try {
        setStorageError(saveWorkspace(window.localStorage, w));
      } catch {
        setStorageError(
          "Browser storage is unavailable. Export JSON to keep this session.",
        );
      }
    }
  }, [w, saving]);
  useEffect(() => {
    lastVisited.current[s.kind] = s.id;
    setSelection(null);
    setTab("build");
    setCollapsed([]);
    setRunning(false);
    setBeat(0);
    setMessage("");
  }, [s.id]);
  useEffect(() => {
    if (
      selection &&
      !graph.nodes.some((n) => n.id === selection) &&
      !graph.edges.some((e) => e.id === selection)
    )
      setSelection(null);
  }, [graph, selection]);
  useEffect(() => {
    if (!running || s.kind !== "mandala") return;
    let last = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      setBeat((b) => b + ((now - last) / 60000) * s.data.bpm);
      last = now;
    }, 40);
    return () => clearInterval(id);
  }, [running, s]);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === "z" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement).tagName,
        )
      ) {
        e.preventDefault();
        setHistory((h) => (e.shiftKey ? redo(h) : undo(h)));
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);
  function update(next: Workspace) {
    setHistory((h) => commit(h, next));
  }
  function edit(fn: (s: Study) => void, resetRoute = false) {
    const next = structuredClone(w),
      target = next.studies.find((st) => st.id === s.id)!;
    fn(target);
    if (!validateStudy(target)) {
      setMessage(
        "This change exceeds the allowed size or musical range. Your study is unchanged.",
      );
      return;
    }
    if (resetRoute && target.route.length) {
      target.route = [];
      setMessage("Context changed: the previous route has been cleared.");
    }
    const full = structuredClone(target);
    if (full.kind === "snowflake" || full.kind === "honeycomb")
      full.data.depth = 4;
    const valid = new Set(buildGraph(full).nodes.map((n) => n.id));
    if (target.route.some((id) => !valid.has(id))) {
      target.route = [];
      setMessage(
        "The previous route is no longer available and has been cleared.",
      );
    }
    update(next);
  }
  function activate(id: string) {
    setHistory((h) => ({ ...h, present: { ...h.present, active: id } }));
  }
  function add(study: Study) {
    if (w.studies.length >= 100) {
      setMessage(
        "Maximum 100 studies. Export a backup, then remove unused studies.",
      );
      return;
    }
    update({ ...w, studies: [...w.studies, study], active: study.id });
  }
  function choose(kind: Kind) {
    const existing =
      w.studies.find((s) => s.id === lastVisited.current[kind]) ||
      w.studies.find((s) => s.kind === kind);
    if (existing) activate(existing.id);
    else add(newStudy(kind));
  }
  function select(id: string) {
    setSelection(id);
    setTab("inspect");
  }
  function appendRoute() {
    if (!node || node.disabled) return;
    if (s.route.length >= 256) {
      setMessage("Route limited to 256 steps. Clear it to start a new route.");
      return;
    }
    if (s.kind === "garden") {
      if (!node.id.startsWith("pivot:")) {
        setMessage("Select a shared pivot below the two key flowers.");
        return;
      }
      edit((s) => {
        s.route = ["key0", node.id, "key1"];
      });
      return;
    }
    const last = s.route.at(-1);
    if (
      last &&
      last !== node.id &&
      !graph.edges.some(
        (e) =>
          (e.from === last && e.to === node.id) ||
          (s.kind === "honeycomb" && e.from === node.id && e.to === last),
      )
    ) {
      setMessage(
        "Choose a connected neighbor, or clear the route to start elsewhere.",
      );
      return;
    }
    if (last === node.id) return;
    edit((s) => {
      s.route.push(node.id);
    });
    setMessage("Added to your selected route.");
  }
  function exportJSON() {
    const blob = new Blob([JSON.stringify(w, null, 2)], {
        type: "application/json",
      }),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = "theory-studies.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function importJSON(f: File) {
    try {
      if (f.size > 50_000_000) throw Error("Backup exceeds 50 MB.");
      const next = decodeWorkspace(await f.text());
      for (const st of next.studies) {
        const full = structuredClone(st);
        if (full.kind === "snowflake" || full.kind === "honeycomb")
          full.data.depth = 4;
        const ids = new Set(buildGraph(full).nodes.map((n) => n.id));
        if (st.route.some((id) => !ids.has(id)))
          throw Error("Backup contains an invalid selected route.");
      }
      update(next);
      setSaving(true);
      setMessage("Backup imported. Undo restores your previous workspace.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not import backup.");
    }
  }
  const motifSelection =
    s.kind === "motif"
      ? s.data.variations.find((v) => v.id === node?.id)
      : undefined;
  const motifParent =
    s.kind === "motif" && motifSelection?.parent
      ? s.data.variations.find((v) => v.id === motifSelection.parent)
      : undefined;
  const canRoute = ["snowflake", "honeycomb", "garden"].includes(s.kind);
  return (
    <div
      className="app"
      style={{ "--accent": family.color } as React.CSSProperties}
    >
      <header className="topbar">
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            choose("snowflake");
          }}
        >
          <span className="brand-mark">✳</span>theory
          <span className="brand-divider" />{" "}
          <small>MUSICAL SHAPE EXPLORERS</small>
        </a>
        <div className="top-actions">
          <span className="local-tag">
            <span /> LOCAL WORKSPACE
          </span>
          <button onClick={exportJSON}>Export JSON ↗</button>
          <button onClick={() => file.current?.click()}>Import</button>
          <input
            ref={file}
            hidden
            type="file"
            accept=".json,application/json"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void importJSON(f);
              e.target.value = "";
            }}
          />
        </div>
      </header>
      <aside className="sidebar">
        <div className="eyebrow">EIGHT WAYS TO EXPLORE</div>
        <nav aria-label="Pattern families">
          {families.map((f, i) => (
            <button
              key={f.kind}
              aria-label={"0" + (i + 1) + " " + f.short}
              className={"family " + (s.kind === f.kind ? "active" : "")}
              aria-current={s.kind === f.kind ? "page" : undefined}
              onClick={() => choose(f.kind)}
              style={{ "--family": f.color } as React.CSSProperties}
            >
              <Glyph kind={f.kind} />
              <span>
                <small>0{i + 1}</small>
                {f.short}
              </span>
              <span className="family-arrow">↗</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="tiny-orbit">◎</span>
          <strong>
            Same music.
            <br />
            Different perspectives.
          </strong>
          <p>
            Change a rule.
            <br />
            See what unfolds.
          </p>
          <div className="visual-only">VISUAL EXPLORATION · NO AUDIO</div>
        </div>
      </aside>
      <main>
        <div className="page-heading">
          <div>
            <div className="eyebrow">
              EXPLORER / 0{families.indexOf(family) + 1}
            </div>
            <h1>{family.name}</h1>
            <p>{family.question}</p>
          </div>
          <div className="study-actions">
            <button
              aria-label="Undo"
              disabled={!history.past.length}
              onClick={() => setHistory(undo)}
            >
              ↶ Undo
            </button>
            <button
              aria-label="Redo"
              disabled={!history.future.length}
              onClick={() => setHistory(redo)}
            >
              ↷ Redo
            </button>
          </div>
        </div>
        {storageError && (
          <div className="notice error" role="alert">
            {storageError}
            <button onClick={exportJSON}>Export now</button>
            {!saving && (
              <button
                onClick={() => {
                  setSaving(true);
                  setStorageError(null);
                }}
              >
                Save this new session
              </button>
            )}
          </div>
        )}
        <div className="study-toolbar">
          <label>
            STUDY{" "}
            <select
              aria-label="Saved study"
              value={s.id}
              onChange={(e) => activate(e.target.value)}
            >
              {w.studies.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
          </label>
          <button onClick={() => add(newStudy(s.kind))}>+ New study</button>
          <button onClick={() => add(duplicateStudy(s))}>Duplicate</button>
          <button
            onClick={() => {
              const next = newStudy(s.kind);
              next.id = s.id;
              next.name = s.name;
              update({
                ...w,
                studies: w.studies.map((st) => (st.id === s.id ? next : st)),
              });
              setMessage("Preset restored. Undo is available.");
            }}
          >
            Reset
          </button>
          <button
            className="subtle"
            onClick={() => {
              let studies = w.studies.filter((st) => st.id !== s.id);
              if (!studies.length) studies = [newStudy(s.kind)];
              update({ ...w, studies, active: studies[0].id });
            }}
          >
            Delete
          </button>
        </div>
        {message && (
          <div className="notice" role="status" aria-label="Workspace message">
            {message}
            <button aria-label="Dismiss message" onClick={() => setMessage("")}>
              ×
            </button>
          </div>
        )}
        <div className="workspace">
          <div className="canvas-stack">
            {s.kind === "motif" && (
              <section
                className="motif-intro"
                aria-label="How the Motif Tree works"
              >
                <div className="eyebrow">
                  ONE MELODY · A FAMILY OF VARIATIONS
                </div>
                <h2>Keep an idea. See what it can become.</h2>
                <p>
                  A motif is a short musical idea. Each branch makes a new
                  version while keeping its source. Select a card to compare
                  them, then build from a version you like.
                </p>
                <div className="motif-reading-key">
                  <span>↑ Higher = higher pitch</span>
                  <span>→ Left to right = time</span>
                  <span>Longer block = longer note</span>
                </div>
                {s.data.variations.length === 1 && (
                  <button
                    className="primary"
                    onClick={() =>
                      edit((st) => {
                        if (st.kind === "motif")
                          st.data.variations = motifExamples(
                            st.data.variations[0],
                          );
                      })
                    }
                  >
                    Add example variations
                  </button>
                )}
              </section>
            )}

            <Canvas
              key={s.id}
              graph={graph}
              study={s}
              selected={selection}
              onSelect={select}
              beat={beat}
            />
            <div className="canvas-note">
              <span>↳</span>
              {graph.notice}
            </div>
            {s.kind === "mandala" && (
              <div className="transport">
                <button
                  className="primary"
                  onClick={() => setRunning(!running)}
                >
                  {running ? "Pause" : "Animate silently"}
                </button>
                <button
                  onClick={() => {
                    setRunning(false);
                    setBeat((b) => b + 0.25);
                  }}
                >
                  Step 1/16
                </button>
                <button
                  onClick={() => {
                    setRunning(false);
                    setBeat(0);
                  }}
                >
                  Rewind
                </button>
                <span>
                  Beat {(beat % 16).toFixed(2)} · {s.data.bpm} BPM · no sound
                </span>
              </div>
            )}
            {canRoute && (
              <section className="route-panel">
                <div className="section-heading">
                  <h3>Selected route</h3>
                  <span>{s.route.length} steps</span>
                  <button
                    disabled={!s.route.length}
                    onClick={() =>
                      edit((s) => {
                        s.route = [];
                      })
                    }
                  >
                    Clear route
                  </button>
                </div>
                {s.route.length ? (
                  <ol>
                    {s.route.map((id, i) => (
                      <li key={i}>
                        <button onClick={() => select(id)}>
                          <b>{i + 1}</b>
                          {fullGraph.nodes.find((n) => n.id === id)?.label ||
                            id}
                        </button>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p>
                    Select an item, then add it to your route. Exploring
                    alternatives never adds music automatically.
                  </p>
                )}
              </section>
            )}
          </div>
          <aside className="inspector" aria-label="Pattern inspector">
            <div className="inspector-tabs">
              <button
                aria-pressed={tab === "build"}
                onClick={() => setTab("build")}
              >
                Build
              </button>
              <button
                aria-pressed={tab === "inspect"}
                onClick={() => setTab("inspect")}
              >
                Inspect {selection && <span className="selection-dot" />}
              </button>
            </div>
            <div className="inspector-content">
              {tab === "build" ? (
                <>
                  <div className="eyebrow">MUSICAL CONTROLS</div>
                  <Controls
                    key={s.id}
                    study={s}
                    node={node}
                    edit={edit}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                  />
                  <div className="rule-divider" />
                  <TextEdit
                    key={s.id + s.name}
                    label="Study name"
                    value={s.name}
                    button="Rename study"
                    onApply={(name) => {
                      if (name.trim())
                        edit((s) => {
                          s.name = name.trim();
                        });
                    }}
                  />
                  {s.source && (
                    <p className="hint">
                      Copied from {s.source.study} / {s.source.item}. Changes
                      are independent.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="eyebrow">
                    {node
                      ? "SELECTED ITEM"
                      : link
                        ? "SELECTED RELATIONSHIP"
                        : "LOOK A LITTLE CLOSER"}
                  </div>
                  <h2>
                    {node?.label || link?.label || "Every shape has a reason."}
                  </h2>
                  <p className="selection-detail">
                    {node?.detail ||
                      link?.detail ||
                      "Select any node or connection to see the musical rule behind it. Keyboard: Tab to a shape, then Enter."}
                  </p>
                  {motifSelection &&
                    (motifParent ? (
                      <MotifComparison
                        before={motifParent.notes}
                        after={motifSelection.notes}
                        beforeName={motifParent.name + " · source"}
                        afterName={motifSelection.name + " · result"}
                      />
                    ) : (
                      <PianoRoll
                        notes={motifSelection.notes}
                        domain={rollDomain([motifSelection.notes])}
                        label="Original melody"
                      />
                    ))}
                  {node?.disabled && s.kind === "honeycomb" && (
                    <p className="error">
                      This chord is blocked by pinned pitch classes.
                    </p>
                  )}
                  {node && canRoute && (
                    <button
                      className="primary wide-button"
                      disabled={!!node.disabled}
                      onClick={appendRoute}
                    >
                      {s.kind === "garden" ? "Use as pivot" : "Add to route"}
                    </button>
                  )}
                  {node?.chord && (
                    <button
                      className="wide-button"
                      onClick={() => add(toSpiral(s, node.chord!, node.label))}
                    >
                      Open chord in Register Spiral ↗
                    </button>
                  )}
                  {node?.motif && s.kind === "motif" && (
                    <button
                      className="wide-button"
                      onClick={() => add(toForm(s, node.motif!))}
                    >
                      Add motif to Form Map ↗
                    </button>
                  )}
                  {s.kind === "scale" && node?.meta?.mode !== undefined && (
                    <button
                      className="wide-button"
                      disabled={node.meta.mode === s.data.a}
                      onClick={() =>
                        edit((st) => {
                          if (st.kind === "scale") st.data.b = node.meta!.mode!;
                        })
                      }
                    >
                      Compare with mode A
                    </button>
                  )}
                  {node && (
                    <button
                      className="wide-button"
                      onClick={() => setTab("build")}
                    >
                      {s.kind === "motif"
                        ? "Make a variation from this →"
                        : "Edit in Build →"}
                    </button>
                  )}
                  <div className="rule-divider" />
                  <h4>Map legend</h4>
                  <p className="hint">{graph.legend}</p>
                  <p className="hint">
                    {s.kind === "motif"
                      ? "Spacing between cards shows ancestry. Inside a card, block length shows duration."
                      : "The drawing explains musical relationships. Distance is not timing."}{" "}
                    Panning and zooming leave your study unchanged.
                  </p>
                </>
              )}
            </div>
          </aside>
        </div>
        <footer className="workspace-footer">
          <span>12-TONE EQUAL TEMPERAMENT</span>
          <span>
            Saved studies stay in this browser · JSON backups are portable
          </span>
        </footer>
      </main>
    </div>
  );
}
