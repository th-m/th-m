import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TokenizerVisualization } from "../src";

afterEach(cleanup);

describe("TokenizerVisualization", () => {
  it("labels its editor, announces token counts, and exposes IDs without relying on color", () => {
    render(<TokenizerVisualization initialText="Hello" initialMode="inspect" />);

    expect(screen.getByRole("textbox", { name: "Text to tokenize" })).toHaveValue("Hello");
    expect(screen.getByText("1 token")).toBeInTheDocument();
    const tokenList = screen.getByRole("list", { name: /tokens using o200k_base/i });
    expect(within(tokenList).getByRole("listitem", { name: /token 1, id 13225/i })).toHaveAttribute("data-token-id", "13225");
  });

  it("steps through locally learned BPE merges and exposes the evolving vocabulary", () => {
    render(<TokenizerVisualization initialText="cat cat car" />);

    expect(screen.getByRole("tab", { name: /bpe lab/i })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("11 tokens")).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "BPE tokens after 0 merges" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next BPE merge" }));

    expect(screen.getByText("8 tokens")).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "BPE merge step" })).toHaveValue("1");
    expect(screen.getByRole("list", { name: "BPE vocabulary after 1 merges" })).toBeInTheDocument();
  });

  it("switches between learned and fixed encoding views", () => {
    render(<TokenizerVisualization initialText="Hello" />);

    fireEvent.click(screen.getByRole("tab", { name: /model tokens/i }));

    expect(screen.getByRole("tab", { name: /model tokens/i })).toHaveAttribute("aria-selected", "true");
    const tokenList = screen.getByRole("list", { name: /tokens using o200k_base/i });
    expect(within(tokenList).getByRole("listitem", { name: /id 13225/i })).toBeInTheDocument();
  });

  it("supports arrow-key navigation between its tokenizer tabs", () => {
    render(<TokenizerVisualization initialText="Hello" />);
    const learnTab = screen.getByRole("tab", { name: /bpe lab/i });
    const inspectTab = screen.getByRole("tab", { name: /model tokens/i });

    learnTab.focus();
    fireEvent.keyDown(learnTab, { key: "ArrowRight" });

    expect(inspectTab).toHaveFocus();
    expect(inspectTab).toHaveAttribute("aria-selected", "true");
    expect(learnTab).toHaveAttribute("tabindex", "-1");
  });

  it("updates synchronously and presents an informative empty state", () => {
    render(<TokenizerVisualization initialText="Hi" />);
    const editor = screen.getByRole("textbox", { name: "Text to tokenize" });

    fireEvent.change(editor, { target: { value: "" } });

    expect(screen.getByText("0 tokens")).toBeInTheDocument();
    expect(screen.getByText("Waiting for language.")).toBeInTheDocument();
    expect(screen.queryByRole("list", { name: /tokens using/i })).not.toBeInTheDocument();
  });
});
