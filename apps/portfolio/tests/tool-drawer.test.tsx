import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ToolDrawer } from "../src/tools/ToolDrawer";
import { ToolDrawerProvider, useToolDrawer } from "../src/tools/ToolDrawerProvider";

const GraphExplorerMock = vi.fn((props: { initialGraphId?: string }) => (
  <div data-testid="graph-explorer-mock" />
));

const SetAtlasMock = vi.fn(() => <div data-testid="set-atlas-mock" />);

vi.mock("@th-m/graph-visualization", () => ({
  RelationshipGraphExplorer: (props: { initialGraphId?: string }) => GraphExplorerMock(props),
}));

vi.mock("@th-m/set-theory-visualization", () => ({
  SetAtlasVisualization: () => SetAtlasMock(),
  buildSetAtlasScene: () => ({ width: 100, height: 100, regions: [], cards: [], atoms: [], warnings: [] }),
  curatedSetAtlasAnalyses: [
    {
      id: "traffic-light",
      label: "Traffic light",
      description: "Test snippet",
      analysis: { revision: 1, compilerVersion: "5", sourceText: "", sourceFilePath: "x.ts", diagnostics: [], symbols: [], relations: [], atoms: [] },
    },
  ],
  exportSetAtlasSvg: async () => "svg",
}));

function OpenEmbeddingButton() {
  const { openTool } = useToolDrawer();
  return (
    <button type="button" onClick={() => openTool("embedding-explorer")}>
      Open embeddings
    </button>
  );
}

function OpenGraphButton() {
  const { openTool } = useToolDrawer();
  return (
    <button type="button" onClick={() => openTool("relationship-graph", { graphId: "weather-kolob" })}>
      Open graph
    </button>
  );
}

function DrawerHarness() {
  return (
    <ToolDrawerProvider>
      <ToolDrawer />
      <OpenEmbeddingButton />
      <OpenGraphButton />
    </ToolDrawerProvider>
  );
}

describe("global tool drawer", () => {
  beforeEach(() => GraphExplorerMock.mockClear());

  it("opens the embedding explorer from the global tab and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<DrawerHarness />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open tool drawer" }));

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Embedding explorer" })).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Search embedding entries" })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open tool drawer" })).toHaveFocus();
  });

  it("opens a tool programmatically through the provider context", async () => {
    const user = userEvent.setup();
    render(<DrawerHarness />);

    await user.click(screen.getByRole("button", { name: "Open embeddings" }));
    const dialog = await screen.findByRole("dialog");
    expect(screen.getByRole("heading", { name: "Embedding explorer" })).toBeInTheDocument();
    expect(dialog).toHaveAccessibleName(/embedding explorer/i);
  });

  it("lets the reader search the curated embedding dataset", async () => {
    const user = userEvent.setup();
    render(<DrawerHarness />);
    await user.click(screen.getByRole("button", { name: "Open tool drawer" }));
    await screen.findByRole("dialog");

    await user.type(screen.getByRole("searchbox", { name: "Search embedding entries" }), "king");
    expect(await screen.findByRole("button", { name: /king/i })).toBeInTheDocument();
  });

  it("switches to the relationship graph tool and renders its explorer", async () => {
    const user = userEvent.setup();
    render(<DrawerHarness />);

    await user.click(screen.getByRole("button", { name: "Open tool drawer" }));
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: "Relationship graph" }));
    expect(await screen.findByRole("heading", { name: "Relationship graph" })).toBeInTheDocument();
    expect(await screen.findByTestId("graph-explorer-mock")).toBeInTheDocument();
  });

  it("switches to the set atlas tool and renders its explorer", async () => {
    const user = userEvent.setup();
    render(<DrawerHarness />);

    await user.click(screen.getByRole("button", { name: "Open tool drawer" }));
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: "Set atlas" }));
    expect(await screen.findByRole("heading", { name: "Set atlas" })).toBeInTheDocument();
    expect(await screen.findByTestId("set-atlas-mock")).toBeInTheDocument();
  });

  it("passes tool options from openTool to the graph explorer", async () => {
    const user = userEvent.setup();
    render(<DrawerHarness />);

    await user.click(screen.getByRole("button", { name: "Open graph" }));
    await screen.findByRole("dialog");

    expect(GraphExplorerMock).toHaveBeenCalledWith({ initialGraphId: "weather-kolob" });
  });
});
