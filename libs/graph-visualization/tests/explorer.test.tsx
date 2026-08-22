import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RelationshipGraphExplorer } from "../src/RelationshipGraphExplorer";
import { GRAPH_LIBRARY_KEY } from "../src/storage";

vi.mock("elkjs/lib/elk-api.js", () => ({
  default: class {
    layout = vi.fn(async () => ({ children: [] }));
    terminateWorker = vi.fn();
  },
}));

vi.mock("elkjs/lib/elk-worker.min.js?worker", () => ({ default: class {} }));

vi.mock("@xyflow/react", async () => {
  const actual = await vi.importActual<typeof import("@xyflow/react")>("@xyflow/react");
  return {
    ...actual,
    ReactFlow: ({ nodes }: { nodes: unknown[] }) => (
      <div data-testid="graph-canvas" data-node-count={nodes.length} />
    ),
    ReactFlowProvider: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  };
});

function installMemoryStorage() {
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, String(value)),
      removeItem: (key: string) => values.delete(key),
      clear: () => values.clear(),
    },
  });
}

describe("relationship graph explorer", () => {
  beforeEach(() => {
    installMemoryStorage();
    globalThis.localStorage.clear();
    globalThis.localStorage.removeItem(GRAPH_LIBRARY_KEY);
  });

  it("lists the seeded graphs and shows the active document's node count", () => {
    render(<RelationshipGraphExplorer />);

    const picker = screen.getByLabelText("Choose a graph");
    expect(picker).toHaveValue("weather-kolob");
    const options = Array.from(picker.querySelectorAll("option")).map((option) => option.textContent);
    expect(options).toEqual(["Weather above Kolob", "Propositions about propositions"]);

    expect(screen.getByTestId("graph-canvas")).toHaveAttribute("data-node-count", "12");
  });

  it("switches graphs and opens a requested graph id", () => {
    const { rerender } = render(<RelationshipGraphExplorer />);
    fireEvent.change(screen.getByLabelText("Choose a graph"), {
      target: { value: "propositions-about-propositions" },
    });
    expect(screen.getByTestId("graph-canvas")).toHaveAttribute("data-node-count", "9");

    rerender(
      <RelationshipGraphExplorer initialGraphId="propositions-about-propositions" />,
    );
    expect(screen.getByLabelText("Choose a graph")).toHaveValue("propositions-about-propositions");
  });

  it("falls back to the active graph when the requested id is unknown", () => {
    render(<RelationshipGraphExplorer initialGraphId="does-not-exist" />);
    expect(screen.getByLabelText("Choose a graph")).toHaveValue("weather-kolob");
  });
});
