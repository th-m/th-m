import { initialWorkspace } from "../src/model";
import "@testing-library/jest-dom/vitest";
import { beforeEach, describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import App from "../src/App";
import { STORAGE_KEY, decodeWorkspace } from "../src/storage";
beforeEach(() => {
  cleanup();
  localStorage.clear();
});
describe("workspace interactions", () => {
  it("edits, preserves settings across explorers, and undoes changes", () => {
    render(<App />);
    fireEvent.change(screen.getByRole("combobox", { name: "Starting pitch" }), {
      target: { value: "2" },
    });
    expect(
      screen.getByRole("button", { name: "D · START" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /02 Voice leading/ }));
    fireEvent.click(screen.getByRole("button", { name: /01 Intervals/ }));
    expect(
      screen.getByRole("combobox", { name: "Starting pitch" }),
    ).toHaveValue("2");
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(
      screen.getByRole("combobox", { name: "Starting pitch" }),
    ).toHaveValue("0");
  });
  it("builds a numbered route through keyboard selection", () => {
    render(<App />);
    fireEvent.keyDown(screen.getByRole("button", { name: "C · START" }), {
      key: "Enter",
    });
    fireEvent.click(screen.getByRole("button", { name: "Add to route" }));
    expect(screen.getByText("1 steps")).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("button", { name: "E · DEPTH 1" }), {
      key: "Enter",
    });
    fireEvent.click(screen.getByRole("button", { name: "Add to route" }));
    expect(screen.getByText("2 steps")).toBeInTheDocument();
  });
  it("camera operations do not modify persisted musical data", () => {
    render(<App />);
    const before = localStorage.getItem(STORAGE_KEY);
    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    fireEvent.click(screen.getByRole("button", { name: "Fit view" }));
    expect(localStorage.getItem(STORAGE_KEY)).toBe(before);
  });
  it("creates, renames, duplicates, resets, and deletes studies", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "+ New study" }));
    expect(
      decodeWorkspace(localStorage.getItem(STORAGE_KEY)!).studies,
    ).toHaveLength(17);
    fireEvent.change(screen.getByRole("textbox", { name: "Study name" }), {
      target: { value: "My snowflake" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Rename study" }));
    fireEvent.click(screen.getByRole("button", { name: "Duplicate" }));
    expect(
      decodeWorkspace(localStorage.getItem(STORAGE_KEY)!).studies.at(-1)?.name,
    ).toBe("My snowflake copy");
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(
      decodeWorkspace(localStorage.getItem(STORAGE_KEY)!).studies,
    ).toHaveLength(17);
  });
  it("renders the core controls of every family", () => {
    render(<App />);
    const checks = [
      [/02 Voice leading/, "Required pitch classes"],
      [/03 Modulation/, "Source key"],
      [/04 Rhythm/, "Visual clock · BPM"],
      [/05 Motifs/, "Transformation"],
      [/06 Register/, "Voices · octave-labeled pitches"],
      [/07 Form/, "+ Add section"],
      [/08 Scales/, "Compare mode A"],
      [/09 Shared notes/, "Held pitch classes"],
      [/10 Time weave/, "Follower delay · beats"],
      [/11 Recipes/, "Sequential copies"],
      [/12 Gesture/, "Contour points · beat@pitch"],
      [/13 Rhythm garden/, "Paint seed · hits / rests"],
      [/14 Journeys/, "Choice weights"],
      [/15 Landscape/, "Horizontal cursor · sparse to busy"],
      [/16 Counterpoint/, "Pinned voice"],
    ] as const;
    for (const [name, text] of checks) {
      fireEvent.click(screen.getByRole("button", { name }));
      expect(screen.getByText(text, { exact: true })).toBeInTheDocument();
    }
  });
  it("selects an atlas chord and preserves the explicit comparison", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "09 Shared notes" }));
    fireEvent.click(screen.getByRole("button", { name: "Am · A · C · E" }));
    fireEvent.click(screen.getByRole("button", { name: "Compare with source chord" }));
    expect(screen.getByText(/C → Am: keeps C, E/)).toBeInTheDocument();
  });
  it("updates timing and recipe controls without mutating other studies", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "10 Time weave" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Source events · pitch@start:beats" }), {
      target: { value: "C4@0:1 G4@1:1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Update source events" }));
    expect(screen.getAllByRole("button", { name: "G4 · 1–2 beats" })).toHaveLength(2);
    fireEvent.change(screen.getByRole("slider", { name: "Follower delay · beats" }), { target: { value: "2" } });
    expect(screen.getByText(/follower starts 2 beats later/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "11 Recipes" }));
    fireEvent.change(screen.getByRole("slider", { name: "Move edited copy · semitones" }), { target: { value: "7" } });
    expect(screen.getByText(/Copy 2 moves \+7 semitones/)).toBeInTheDocument();
  });
  it("copies a quantized Gesture Score contour as an independent motif", () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "12 Gesture" }));
    fireEvent.click(container.querySelector("[data-node-id]")!);
    fireEvent.click(screen.getByRole("button", { name: "Copy as Motif snapshot ↗" }));
    expect(screen.getByRole("heading", { name: "Motif Tree" })).toBeInTheDocument();
    expect(screen.getByText(/Copied from Gesture Score \/ Quantized contour/)).toBeInTheDocument();
  });
  it("captures a generated Rhythm Garden row and keeps it as a separate Mandala study", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "13 Rhythm garden" }));
    fireEvent.click(screen.getByText("Inspect"));
    fireEvent.click(screen.getByRole("button", { name: "Capture selected row in Rhythm Mandala ↗" }));
    expect(screen.getByRole("heading", { name: "Rhythm Mandala" })).toBeInTheDocument();
    expect(screen.getByText(/Copied from Rhythm Garden/)).toBeInTheDocument();
  });
  it("copies a derived Variation Landscape candidate without changing its source", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "15 Landscape" }));
    fireEvent.click(screen.getByText("Inspect"));
    fireEvent.click(screen.getByRole("button", { name: "Copy candidate as Motif snapshot ↗" }));
    expect(screen.getByRole("heading", { name: "Motif Tree" })).toBeInTheDocument();
    expect(screen.getByText(/Copied from Variation Landscape/)).toBeInTheDocument();
  });
  it("commits an explicit Landscape candidate and pins an accepted counterpoint option", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "15 Landscape" }));
    fireEvent.click(screen.getByRole("button", { name: "Commit candidate snapshot" }));
    expect(decodeWorkspace(localStorage.getItem(STORAGE_KEY)!).studies.find((study) => study.kind === "landscape")?.data.committed).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "16 Counterpoint" }));
    fireEvent.click(screen.getByRole("button", { name: "B3 · use" }));
    expect(decodeWorkspace(localStorage.getItem(STORAGE_KEY)!).studies.find((study) => study.kind === "counterpoint")?.data.pins[1]).toBe(59);
  });
});

describe("durable musical edits", () => {
  it("preserves a route when visible depth shrinks, then clears it after a tonic change", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "G# · DEPTH 2" }));
    fireEvent.click(screen.getByRole("button", { name: "Add to route" }));
    fireEvent.click(screen.getByRole("button", { name: "Build" }));
    fireEvent.change(screen.getByRole("slider", { name: "Visible depth" }), {
      target: { value: "1" },
    });
    expect(
      decodeWorkspace(localStorage.getItem(STORAGE_KEY)!).studies[0].route,
    ).toHaveLength(1);
    fireEvent.change(screen.getByRole("combobox", { name: "Starting pitch" }), {
      target: { value: "2" },
    });
    expect(
      screen.getByRole("status", { name: "Workspace message" }),
    ).toHaveTextContent("previous route has been cleared");
    expect(
      decodeWorkspace(localStorage.getItem(STORAGE_KEY)!).studies[0].route,
    ).toHaveLength(0);
  });
  it("restores saved edits after remount and redoes an undone edit", () => {
    const app = render(<App />);
    fireEvent.change(screen.getByRole("combobox", { name: "Starting pitch" }), {
      target: { value: "5" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    fireEvent.click(screen.getByRole("button", { name: "Redo" }));
    app.unmount();
    render(<App />);
    expect(
      screen.getByRole("combobox", { name: "Starting pitch" }),
    ).toHaveValue("5");
  });
  it("copies a selected chord with spelling and attribution", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "02 Voice leading" }));
    fireEvent.click(screen.getByRole("button", { name: "Cm · C · Eb · G" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Open chord in Register Spiral ↗" }),
    );
    expect(
      screen.getByRole("textbox", { name: "Voices · octave-labeled pitches" }),
    ).toHaveValue("C3 Eb3 G3");
    expect(
      screen.getByText(/Copied from Voice-leading Honeycomb/),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Invert up" }));
    const w = decodeWorkspace(localStorage.getItem(STORAGE_KEY)!);
    expect(w.studies.find((s) => s.kind === "honeycomb")?.data).toMatchObject({
      root: 0,
      quality: "major",
    });
  });
  it("copies the seed motif into a new form study", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "05 Motifs" }));
    const graph = screen.getByLabelText("Motif Tree diagram");
    fireEvent.click(graph.querySelector("[data-node-id]")!);
    fireEvent.click(
      screen.getByRole("button", { name: "Add motif to Form Map ↗" }),
    );
    expect(
      screen.getByRole("heading", { name: "Nested Form Map" }),
    ).toBeInTheDocument();
    expect(
      decodeWorkspace(localStorage.getItem(STORAGE_KEY)!).studies.at(-1)
        ?.source,
    ).toBeDefined();
  });
  it("leaves the workspace intact when a JSON import is invalid", async () => {
    const { container } = render(<App />);
    const before = localStorage.getItem(STORAGE_KEY);
    const file = { size: 2, text: async () => "{}" };
    fireEvent.change(container.querySelector("input[type=file]")!, {
      target: { files: [file] },
    });
    await waitFor(() =>
      expect(
        screen.getByRole("status", { name: "Workspace message" }),
      ).toBeInTheDocument(),
    );
    expect(localStorage.getItem(STORAGE_KEY)).toBe(before);
  });
});

it("starts with four visible musical examples and compares their actual durations", () => {
  const { container } = render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "05 Motifs" }));
  expect(
    screen.getByRole("region", { name: "How the Motif Tree works" }),
  ).toBeInTheDocument();
  expect(container.querySelectorAll("[data-node-id]")).toHaveLength(5);
  fireEvent.click(
    screen.getByRole("button", { name: "Take more time · C4 E4 G4 D4" }),
  );
  expect(
    screen.getByRole("region", { name: "Melody comparison" }),
  ).toBeInTheDocument();
  const notes = container.querySelectorAll(".motif-comparison .roll-note");
  expect(notes).toHaveLength(8);
  expect(Number(notes[4].getAttribute("width")) + 2).toBe(
    2 * (Number(notes[0].getAttribute("width")) + 2),
  );
  expect(notes[4].getAttribute("y")).toBe(notes[0].getAttribute("y"));
});

it("adds examples to a saved single-seed study without replacing its notes, and can undo", () => {
  const workspace = initialWorkspace();
  const study = workspace.studies.find((s) => s.kind === "motif")!;
  if (study.kind !== "motif") throw Error("Expected motif");
  study.data.variations = [study.data.variations[0]];
  study.data.variations[0].notes[0].pitch = 62;
  workspace.active = study.id;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
  render(<App />);
  fireEvent.click(
    screen.getByRole("button", { name: "Add example variations" }),
  );
  let saved = decodeWorkspace(localStorage.getItem(STORAGE_KEY)!).studies.find(
    (s) => s.id === study.id,
  )!;
  if (saved.kind !== "motif") throw Error("Expected motif");
  expect(saved.data.variations).toHaveLength(5);
  expect(saved.data.variations[0]).toEqual(study.data.variations[0]);
  fireEvent.click(screen.getByRole("button", { name: "Undo" }));
  saved = decodeWorkspace(localStorage.getItem(STORAGE_KEY)!).studies.find(
    (s) => s.id === study.id,
  )!;
  expect(saved).toEqual(study);
});

it("reflows the motif drawing into readable mobile rows without changing the study", () => {
  vi.stubGlobal("matchMedia", () => ({
    matches: true,
    addEventListener() {},
    removeEventListener() {},
  }));
  const app = render(<App />);
  try {
    fireEvent.click(screen.getByRole("button", { name: "05 Motifs" }));
    const diagram = screen.getByLabelText("Motif Tree diagram");
    const positions = [...diagram.querySelectorAll("[data-node-id]")].map(
      (n) => n.getAttribute("transform")!,
    );
    expect(new Set(positions).size).toBe(5);
    const rows = positions.map((p) => p.split(" ")[1]);
    expect(
      Math.max(...rows.map((row) => rows.filter((r) => r === row).length)),
    ).toBe(2);
    expect(
      decodeWorkspace(localStorage.getItem(STORAGE_KEY)!).studies.find(
        (s) => s.kind === "motif",
      )?.data,
    ).not.toHaveProperty("coordinates");
  } finally {
    app.unmount();
    vi.unstubAllGlobals();
  }
});
