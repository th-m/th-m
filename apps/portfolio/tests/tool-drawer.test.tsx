import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ToolDrawer } from "../src/tools/ToolDrawer";
import { ToolDrawerProvider, useToolDrawer } from "../src/tools/ToolDrawerProvider";

function OpenEmbeddingButton() {
  const { openTool } = useToolDrawer();
  return (
    <button type="button" onClick={() => openTool("embedding-explorer")}>
      Open embeddings
    </button>
  );
}

function DrawerHarness() {
  return (
    <ToolDrawerProvider>
      <ToolDrawer />
      <OpenEmbeddingButton />
    </ToolDrawerProvider>
  );
}

describe("global tool drawer", () => {
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
});
