import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DocumentPopover } from "./document-popover";

describe("DocumentPopover", () => {
  it("opens an inline reference, closes with Escape, and restores trigger focus", async () => {
    render(<DocumentPopover title="Reference glossary" trigger="term"><p>Reference content</p></DocumentPopover>);
    const trigger = screen.getByRole("button", { name: "term" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    expect(await screen.findByRole("dialog", { name: "Reference glossary" })).toBeInTheDocument();
    expect(screen.getByRole("document")).toHaveTextContent("Reference content");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
